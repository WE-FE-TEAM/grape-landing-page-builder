/**
 * 布局组件, 代表一个 DIV 的block区域
 * Created by jess on 16/8/10.
 */

'use strict';


const ComponentBase = require('common:widget/component/base/base.js');

const utils = require('common:widget/ui/utils/utils.js');

const componentFactory = require('common:widget/component/component-factory/component-factory.js');

const $ = ComponentBase.$;

const tpl = `<div><div class="glpb-com-content clearfix"></div></div>`;

const LayoutRow = ComponentBase.extend(
    {
        componentName : 'layout_row',
        componentCategory : ComponentBase.CATEGORY.BASE
    }, 
    {
        getDefaultStyle : function(){
            return {
                height : '100px'
            };
        },
        getDefaultComponents : function(){
            let rowComponentId = this.componentId;
            let columnConf = {
                parentId : rowComponentId,
                componentId : utils.generateComponentId(),
                componentName  : 'layout_column',
                style : {
                    width : '100%',
                    height : '100%'
                }
            };
            return [ columnConf ];
        },
        init : function(){
            this.$content = null;
        },
        render : function(){
            let currentComponentId = this.componentId;
            let cssClass = this.getBaseCssClass() + '  ';
            let $el = $(tpl).addClass( cssClass );
            let $content = $('.glpb-com-content', $el).css( this.style );
            this.$el = $el;
            this.$content = $content;
            let components = this.components || [];
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                config.parentId = currentComponentId;
                let com = componentFactory.createComponentInstance( config );
                if( com ){
                    com.render();
                    $content.append( com.$getElement() );
                }else{
                    //不存在该组件
                    throw new Error(`componentName[${config.componentName}]对应的组件不存在!!`);
                }
            }
            return $el;
        },

        renderEditorHelper : function(){
            let $el = this.$el;

        },

        addColumn : function(){
            let rowComponentId = this.componentId;
            let columnConf = {
                parentId : rowComponentId,
                componentId : utils.generateComponentId(),
                componentName  : 'layout_column',
                style : {
                    width : '100%',
                    height : '100%'
                }
            };
            let components = this.components;
            components.push( columnConf );
            let columnWidth = 100 / components.length + '%';
            let style = {
                width : columnWidth
            };
            for( var i = 0, len = components.length; i < len - 1; i++ ){
                let conf = components[i];
                let componentObj = componentFactory.getComponentById(conf.componentId);
                componentObj.setStyle( style );
            }

            columnConf.style.width = columnWidth;

            //创建新的列组件
            let component = componentFactory.createComponentInstance(columnConf);
            component.render();
            let $el = component.$getElement();
            this.$content.append( $el );
            component.bindEvent();
        },

        bindEditorEvent : function(){
            let that = this;
            this.$content.droppable({
                // accept : '.lpb-component',
                accept : '[data-com-name=layout_column]',
                classes: {
                    "ui-droppable-active": "custom-state-active",
                    "ui-droppable-hover": "custom-state-hover"
                },
                drop : function(e, ui){
                    let $draggable = ui.draggable;
                    if( $draggable.parents('#lpb-com-container').length > 0 ){

                        that.addColumn();
                    }

                }
            }).sortable({
                connectWidth : '.gplb-sys-editor .glpb-com-layout_row .glpb-com-content',
                items: "[data-com-name=layout_column]",
                placeholder: "ui-state-highlight sortable-placeholder-vertical",
                helper : function(event, item){
                    let componentName = item.attr('data-com-name');
                    return `<div data-com-name="${componentName}" class="gplb-com-drag-holder gplb-drag-com-${componentName}"></div>`;
                },
                start : function(event, ui){
                    console.log('start: ' + ui.item.index() );
                },
                update : function(event, ui){
                    console.log('sort end: ' + ui.item.index() );
                }
            });
            this.$el.draggable({
                // connectToSortable : '.lpb-sortable',
                revert : 'invalid',
                helper : function(event, item){
                    let componentName = item.attr('data-com-name');
                    return `<div data-com-name="${componentName}" class="gplb-com-drag-holder gplb-drag-com-${componentName}"></div>`;
                },
                appendTo: "body"
            });
        }
    }
);


module.exports = LayoutRow;


