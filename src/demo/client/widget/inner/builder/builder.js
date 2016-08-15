/**
 * 页面编辑的控制器
 * Created by jess on 16/8/15.
 */


'use strict';

const cssobj = require('cssobj');

const $ = require('common:widget/lib/jquery/jquery.js');

const utils = require('common:widget/ui/utils/utils.js');

const componentFactory = require('common:widget/component/component-factory/component-factory.js');



function Builder( config ){

    config = config || {};

    this.pageSpecification = $.extend( {
        templateId : '',
        title : '新页面',
        meta : [],
        rows : [],
        components : {},
        componentStyles : {}
    }, config.pageSpecification);

    //当前页面中所有的组件ID到组件实例的map
    this.componentRefs = {};

    this.init();

}

$.extend( Builder.prototype, {

    init : function(){
        
        let that = this;

        // this.cssObj = cssobj( this.pageSpecification.componentStyles );

        //初始化组件选择栏/编辑器区域
        let $componentList = $('#lpb-com-container');
        let $editor = $('#lpb-com-editor');

        $componentList.find('.lpb-component').draggable({
            connectToSortable : '.ui-sortable',
            revert : 'invalid',
            helper: "clone",
            appendTo: "body"
        });

        $editor
            // .droppable({
            //     // accept : '.lpb-component',
            //     accept : '[data-com-name=layout_row]',
            //     classes: {
            //         "ui-droppable-active": "custom-state-active"
            //     },
            //     drop : function(e, ui){
            //         let $draggable = ui.draggable;
            //         if( $draggable.parents('#lpb-com-container').length > 0 ){
            //
            //             that.addNewRow();
            //
            //         }
            //
            //     }
            // })
            .sortable({
                revert : true,
                items: ".glpb-com-layout_row",
                handle: ".glpb-editor-setting-wrap .glpb-editor-op-btn-drag",
                placeholder: "ui-state-highlight sortable-placeholder-horizontal",
                start : function(event, ui){
                    console.log('start: ' + ui.item.index() );
                },
                update : function(event, ui){
                    console.log('sort end: ' + ui.item.index() );
                },
                receive : function(event, ui){
                    console.log( ui );
                    // ui.sender.sortable('cancel');
                },
                stop : function(event, ui){
                    console.log('stop in builder', ui );
                }
            });
        
        this.$rawContainer = $componentList;
        this.$editor = $editor;
    },
    
    bindEvent : function(){
        
    },

    getComponentConfig : function(componentId){
        return this.pageSpecification.components[componentId];
    },
    
    createComponentInstance : function(conf){
        conf.page = this;
        let component = componentFactory.createComponentInstance(conf);
        if( component ){
            let componentId = component.getComponentId();
            let style = component.getStyle();
            this.componentRefs[componentId] = component;
            this.pageSpecification.components[componentId] = component.toJSON();
            // this.pageSpecification.componentStyles['#' + componentId] = style;
            // this.cssObj.update( this.pageSpecification.componentStyles);
        }
        return component;
    },

    addNewRow : function(){
        let conf = {
            parentId : null,
            componentName : 'layout_row'
        };
        let component = this.createComponentInstance(conf);
        component.render();
        let $el = component.$getElement();
        this.$editor.append( $el );
        component.bindEvent();
    },
    
    addExistRow : function(componentId){},

    /**
     * 批量修改组件样式
     * @param conf {object} 包含组件ID及该组件要修改的样式 { com-id : {}, com-id-2 : {} }
     */
    updateStyle : function( conf ){
        // $.extend(this.pageSpecification.componentStyles, conf, true );
        // this.cssObj.update(this.pageSpecification.componentStyles);
        for( var componentId in conf ){
            if( conf.hasOwnProperty(componentId) ){
                let com = this.getComponentById(componentId);
                if( com ){
                    com.setStyle( conf[componentId] );
                }
            }
        }
    },

    //根据组件ID, 获取已经存在的组件实例
    getComponentById : function(componentId){
        return this.componentRefs[componentId];
    },

    /**
     * 将某个组件移动到另外一个父组件下
     * @param toComponentId {string} 移动之后的父组件ID
     * @param targetComponentId {string} 要移动的目标子组件ID
     */
    moveComponentById : function(toComponentId, targetComponentId){
        let pageSpecification = this.pageSpecification;
        let pageComponents = pageSpecification.components;
        let targetConf = pageComponents[targetComponentId];
        let toConf = pageComponents[toComponentId];
        if( ! targetConf ){
            console.error(`当前页面不存在componentId[${targetComponentId}]对应的组件配置`);
            return;
        }

        if( targetConf.parentId === toComponentId ){
            //原父组件和要移动之后的父组件是同一个
            console.warn(`要移动的子组件当前父组件,和目标的父组件是同一个!!`);
            return;
        }

        ////// 从老的父组件中删除 /////
        let oldParentId = targetConf.parentId;
        if( oldParentId ){
            //原父组件不是页面级,需要从原父组件中删除
            let oldParentConf = pageComponents[oldParentId];
            if( oldParentConf && oldParentConf.components ){
                let oldIndex = oldParentConf.components.indexOf(targetComponentId);
                if( oldIndex >= 0 ){
                    oldParentConf.splice( oldIndex, 1);
                }
            }
        }else{
            //原父组件是页面
            let rows = this.rows;
            let oldIndex = rows.indexOf(targetComponentId);
            if( oldIndex >= 0 ){
                rows.splice( oldIndex, 1);
            }
        }

        ////// 添加到新的父组件中   /////
        if( toComponentId ){
            //新的父组件是普通组件
            let components = toConf.components || [];
            if( components.indexOf(targetComponentId) < 0  ){
                components.push( targetComponentId );
                toConf.components = components;
            }else{
                console.warn(`父组件[${toComponentId}]中本来已经包含要移动的子组件[${targetComponentId}]`);
            }
        }else{
            //新的父组件是 页面
            let rows = this.rows;
            if( rows.indexOf(targetComponentId) < 0 ){
                rows.push( targetComponentId );
            }else{
                console.warn(`页面中本来已经包含要移动的子组件[${targetComponentId}]`);
            }
        }

        //修改目标子元素的父组件ID值
        targetConf.parentId = toComponentId;
    }
} );



module.exports = Builder;

