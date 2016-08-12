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
                height : 'auto'
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
                    height : 'auto'
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
            let $el = $(tpl).addClass( cssClass ).css( this.style );
            let $content = $('.glpb-com-content', $el);
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

        addColumn : function(){
            let rowComponentId = this.componentId;
            let columnConf = {
                parentId : rowComponentId,
                componentId : utils.generateComponentId(),
                componentName  : 'layout_column',
                style : {
                    width : '100%',
                    height : 'auto'
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

        //添加已经存在的组件到内部
        addExistColumn : function(componentId){
            let component = componentFactory.getComponentById(componentId);
            if( component ){
                let oldParentId = component.editorGetParentId();
                if( this.isContainComponent(component) ){
                    //当前操作只是在组件内部重新排序子组件, 不进行任何操作, 在 sortable 中更新序号
                    console.info(`componentId[${componentId}]在父组件[${this.componentId}]内重排序`);
                    return;
                }
                //先从原来的组件中删除
                let oldParent = componentFactory.getComponentById(oldParentId);
                if( oldParent ){
                    oldParent.editorRemoveComponent(componentId);
                }
                this.components.push({

                });
                this.$content.append( component.$getElement() );
            }

        },

        bindEditorEvent : function(){
            let that = this;
            ComponentBase.prototype.bindEditorEvent.call( this );
            this.$content.droppable({
                // accept : '.lpb-component',
                accept : '[data-com-name=layout_column]',
                classes: {
                    "ui-droppable-active": "custom-state-active",
                    "ui-droppable-hover": "custom-state-hover"
                },
                drop : function(e, ui){
                    let $draggable = ui.draggable;
                    let componentId = $draggable.attr('data-glpb-com-id');
                    if( $draggable.parents('#lpb-com-container').length > 0 ){

                        e.stopPropagation();
                        that.addColumn();
                    }else if( componentId ){
                        //添加已有的组件到内部
                        e.stopPropagation();
                        that.addExistColumn( componentId );
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
            // this.$el.draggable({
            //     // connectToSortable : '.lpb-sortable',
            //     handle: ".glpb-editor-op-btn-drag",
            //     revert : 'invalid',
            //     helper : function(event, item){
            //         let dragBtn = event.target;
            //         let componentId = that.componentId;
            //         let componentName = that.componentName;
            //         return `<div data-com-name="${componentName}" class="gplb-com-drag-holder gplb-drag-com-${componentName}"></div>`;
            //     },
            //     appendTo: "body"
            // });
        }
    }
);


module.exports = LayoutRow;


