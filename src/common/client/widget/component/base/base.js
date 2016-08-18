/**
 * 所有组件的基类
 * Created by jess on 16/8/10.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');
const utils = require('common:widget/ui/utils/utils.js');
const componentFactory = require('common:widget/component/component-factory/component-factory.js');


function noop(){}

function ComponentBase( args ){
    args = args || {};

    this.page = args.page;

    //当前组件的父组件ID
    this.parentId = args.parentId || null;
    //当前组件ID
    this.componentId = args.componentId;
    //当前组件名
    this.componentName = this.constructor.componentName;
    this.$el = null;
    this.style = $.extend( this.getDefaultStyle(), args.style );
    this.data = $.extend( this.getDefaultData(), args.data );
    this.components = args.components || this.getDefaultComponents();

    //将当前实例对象, 注册到全局
    componentFactory.addComponentInstance(this.componentId, this);

    this.init();
}


$.extend( ComponentBase.prototype, {

    init : noop,

    render : noop,

    //渲染编辑模式下, 额外的DOM组件
    renderEditorHelper : function(){
        let $el = this.$el;
        let $editorSettingWrap = this.$getEditSettingWrap();
        $el.prepend($editorSettingWrap);
    },

    afterRender : noop,

    getStyle : function(){
        return this.style;
    },

    setStyle : function( style ){
        this.style = $.extend( this.style, style );
        this.$el.css( this.style );
    },

    setData : noop,

    toJSON : function(){
        let that = this;
        let sub = this.components || [];
        let subJSON = sub.map( function(conf){
            let id = conf.componentId;
            let com = componentFactory.getComponentById(id);
            return com.toJSON();
        } );
        return {
            componentName : this.componentName,
            componentId : this.componentId,
            parentId : this.parentId,
            style : this.style,
            data : this.data,
            components : subJSON
        };
    },
    destroy : noop,
    
    bindEvent : function(){

        //先绑定子组件的事件
        let components = this.components || [];
        for( var i = 0, len = components.length; i < len; i++ ){
            let componentId = components[i].componentId;
            let component = componentFactory.getComponentById(componentId);
            try{
                component.bindEvent();
            }catch(e){
                console.error(e);
            }
        }

        this.bindComponentEvent();
        if( this.isEditMode() ){
            this.bindEditorEvent();
        }
    },
    //绑定组件本身的事件
    bindComponentEvent : noop,
    //绑定组件在编辑器中的事件
    bindEditorEvent : function(){
        let that = this;
        this.$el.on('mouseenter', function(){
            that.$el.addClass('glpb-editor-bar-showing');
        }).on('mouseleave', function(){
            that.$el.removeClass('glpb-editor-bar-showing');
        });
        
        this.$editorSettingWrap.on('click', '.glpb-editor-op-btn-drag', function(){
            that.$editorSettingWrap.toggleClass('editor-op-show-more');
        } );

        //在父组件内移动位置
        this.$editorSettingWrap.on('click', '.glpb-editor-op-btn-move', function(e){
            let currentTarget = e.currentTarget;
            let direction = currentTarget.getAttribute('data-direction');
            that.editorMoveInParent(direction);
        } );

        //编辑组件
        this.$editorSettingWrap.on('click', '.glpb-editor-op-btn-edit', function(){
            that.enterEdit();
        } );

        this.$el.draggable({
            handle: "> .glpb-editor-setting-wrap .glpb-editor-op-btn-drag",
            revert : 'invalid',
            helper: function(){
                return that.editorGetDragHelper();
            },
            appendTo: "body"
        });
    },

    enterEdit : function(){
        this.page.editComponent(this.componentId);
    },

    //显示正在编辑中的状态
    addEditingState : function(){
        this.$el.addClass('glpb-editor-com-editing');
    },

    removeEditingState : function(){
        this.$el.removeClass('glpb-editor-com-editing');
    },

    editorMoveInParent : function(direction){
        this.getParentComponent().editorHandleChildMove(this.componentId, direction);
    },

    editorHandleChildMove : function(componentId, direction){
        if( [ 'up', 'down', 'left', 'right'].indexOf(direction) < 0 ){
            console.warn(`子组件移动方向值[${direction}]非法!!只能是 up/down/left/right 之一`);
            return -1;
        }
        let components = this.components || [];
        let oldIndex = -1;
        let childConf = null;
        let len = components.length;
        for( var i = 0; i < len; i++ ){
            let temp = components[i];
            if( temp.componentId === componentId ){
                oldIndex = i;
                childConf = temp;
                break;
            }
        }
        if( ! childConf ){
            console.error(`父组件[${this.componentId}]不包含子组件[${componentId}]!!`);
            return -1;
        }
        let newIndex = oldIndex;
        switch(direction){
            case 'up':
            case 'left':
                newIndex = oldIndex - 1;
                break;
            case 'down':
            case 'right':
                newIndex = oldIndex + 1;
                break;
            default:;

        }
        if( newIndex < 0 ){
            alert(`已经是父组件中的第一个了!`);
            return -1;
        }
        if( newIndex >= len ){
            alert('已经是父组件中最后一个了');
            return -1;
        }
        //先从老的位置删除
        components.splice(oldIndex, 1);
        //插入到新位置
        components.splice(newIndex, 0, childConf);
        return newIndex;
    },

    getComponentId : function(){
        return this.componentId;
    },

    getComponentName : function(){
        return this.componentName;
    },

    getBaseCssClass : function(){
        return 'glpb-component ' + ( ' glpb-com-' + this.componentName ) ;
    },

    $getElement : function(){
        return this.$el;
    },

    getDefaultStyle : function(){
        return {};
    },

    getDefaultData : function(){
        return {};
    },

    getDefaultComponents : function(){
        return [];
    },

    getParentComponent : function(){
        if( this.parentId ){
            return this.page.getComponentById(this.parentId);
        }
        return this.page;
    },
    
    //返回统一的组件上拖动/编辑的固定DIV容器
    $getEditSettingWrap : function(){
        let tpl = `<div class="glpb-editor-setting-wrap" data-com-id="${this.componentId}">
    <div class="gplb-editor-setting-bar clearfix">
        <span title="拖动" class="glpb-editor-op-btn glpb-editor-op-btn-drag" data-com-id="${this.componentId}"><i class="fa fa-arrows" aria-hidden="true"></i></span>
        <span class="editor-op-more">
            <span class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="up" title="向上移动"><i class="fa fa-arrow-circle-up" aria-hidden="true"></i></span>
            <span class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="down"  title="向下移动"><i class="fa fa-arrow-circle-down" aria-hidden="true"></i></span>
            <span class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="left"  title="向左移动"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></span>
            <span class="glpb-editor-op-btn glpb-editor-op-btn-move" data-direction="right"  title="向右移动"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></span>
            <span  class="glpb-editor-op-btn glpb-editor-op-btn-edit" title="编辑"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>
        </span>
    </div>
</div>`;

        this.$editorSettingWrap = $(tpl);

        return this.$editorSettingWrap;
    },
    
    isEditMode : function(){
        return componentFactory.isEditMode();
    },
    isPreviewMode : function(){
        return componentFactory.isPreviewMode();
    },
    isProductionMode : function(){
        return componentFactory.isProductionMode();
    },

    //从当前组件中删除指定ID的组件, **不** 进行DOM操作
    editorRemoveComponent : function(componentId){
        let components = this.components || [];
        for( var i = 0, len = components.length; i < len; i++ ){
            let conf = components[i];
            if( conf.componentId === componentId ){
                components.splice(i, 1);
                return true;
            }
        }
        console.warn(`(editorRemoveComponent) : 组件[${this.componentId}]不包含子组件${componentId}`);
        return false;
    },

    //返回当前组件的父组件ID
    editorGetParentId : function(){
        return this.parentId;
    },
    
    //判断当前组件, 是否为 componentObj 的直接父组件
    isContainComponent : function(componentObj){
        if( componentObj ){
            let parentId = componentObj.editorGetParentId();
            return parentId === this.componentId;
        }
        return false;
    },

    editorGetDragHelper : function(){
        return `<div class="glpb-component " data-com-name="${this.componentName}" data-glpb-com-id="${this.componentId}"></div>`;
    }
} );

//组件类型
ComponentBase.componentName = 'base';
//组件所属类目
ComponentBase.componentCategory = '__NONE__';


/**
 * 创建组件类, 继承自 ComponentBase
 * @param statics {object} 新组件类的静态属性
 * @param prototype {object} 组件类的实例属性
 * @returns {Component} 组件类
 */
ComponentBase.extend = function( statics, prototype){
    statics = statics || {};
    if( ! statics.componentName ){
        throw new Error('组件静态属性,必须包含惟一的 componentName 字段!');
    }
    let oldRender = prototype.render;
    if( oldRender ){
        prototype.render = function(){
            oldRender.call( this );
            let $el = this.$el;
            if( $el ){
                $el.attr('data-glpb-com-id', this.componentId).attr('data-com-name', this.componentName);
                if( this.isEditMode() ){
                    this.renderEditorHelper();
                }
            }
            this.afterRender();
        };
    }
    function Component(){
        ComponentBase.apply( this, [].slice.call(arguments) );
    }
    $.extend( Component, statics);
    function parent(){}
    parent.prototype = ComponentBase.prototype;
    Component.prototype = new parent();
    Component.prototype.constructor = Component;
    $.extend(Component.prototype, prototype);

    //注册该组件
    componentFactory.registerComponentClass(statics.componentName, Component);

    return Component;
};


ComponentBase.$ = $;
ComponentBase.utils = utils;
ComponentBase.generateComponentId = utils.generateComponentId;

//基础组件
const CATEGORY_BASE = 'CATE_BASE';
//UI组件
const CATEGORY_UI = 'CATE_UI';

//系统支持的所有组件分类
ComponentBase.CATEGORY = {
    BASE : CATEGORY_BASE,
    UI : CATEGORY_UI
};

//组件所属的平台
ComponentBase.PLATFORM = {
    PC : 'pc',
    MOBILE : 'mobile',
    RESPONSIVE : 'responsive'
};


module.exports = ComponentBase;

