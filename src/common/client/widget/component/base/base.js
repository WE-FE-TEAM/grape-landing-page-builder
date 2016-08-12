/**
 * 所有组件的基类
 * Created by jess on 16/8/10.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');
const componentFactory = require('common:widget/component/component-factory/component-factory.js');


function noop(){}

function ComponentBase( args ){
    args = args || {};
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
    renderEditorHelper : noop,

    afterRender : noop,

    setStyle : noop,

    setData : noop,

    toJSON : function(){
        let sub = this.components || [];
        let subJSON = sub.map( function(com){
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
    bindEditorEvent : noop,

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
    
    isEditMode : function(){
        return componentFactory.isEditMode();
    },
    isPreviewMode : function(){
        return componentFactory.isPreviewMode();
    },
    isProductionMode : function(){
        return componentFactory.isProductionMode();
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

//基础组件
const CATEGORY_BASE = 'CATE_BASE';
//UI组件
const CATEGORY_UI = 'CATE_UI';

//系统支持的所有组件分类
ComponentBase.CATEGORY = {
    BASE : CATEGORY_BASE,
    UI : CATEGORY_UI
};


module.exports = ComponentBase;

