/**
 * Created by jess on 16/8/11.
 */


'use strict';

const ComponentBase = require('common:widget/component/base/base.js');

const componentFactory = require('common:widget/component/component-factory/component-factory.js');

const $ = ComponentBase.$;
const utils = ComponentBase.utils;

const tpl = `<div><div class="glpb-com-content clearfix"></div></div>`;



const LayoutColumn = ComponentBase.extend(
    {
        componentName : 'layout_column',
        componentCategory : ComponentBase.CATEGORY.BASE
    },
    {
        getDefaultStyle : function(){
            return {
                height : 'auto'
            };
        },
        init : function(){

        },
        render : function(){
            
            let currentComponentId = this.componentId;
            
            let cssClass = this.getBaseCssClass() + ' ';
            let $el = $(tpl).addClass( cssClass ).css( this.style );
            let $content = $('.glpb-com-content', $el);
            this.$el = $el;
            this.$content = $content;
            let components = this.components || [];
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                config.parentId = currentComponentId;
                let com = this.page.createComponentInstance( config );
                if( com ){

                    com.render();
                    $el.append( com.$getElement() );
                }else{
                    //不存在该组件
                    throw new Error(`componentName[${config.componentName}]对应的组件不存在!!`);
                }
            }
            return $el;
        },
        setStyle : function( style ){
            this.style = $.extend( this.style, style );
            this.$el.css( this.style );
        },
        bindEditorEvent : function(){
            let that = this;
            ComponentBase.prototype.bindEditorEvent.call( this );
            this.$content.droppable({
                // accept : '.lpb-component',
                accept : '[data-com-name=layout_row]',
                greedy : true,
                classes: {
                    "ui-droppable-active": "custom-state-active",
                    "ui-droppable-hover": "custom-state-hover"
                },
                drop : function(e, ui){
                    let $draggable = ui.draggable;
                    let componentId = $draggable.attr('data-glpb-com-id');
                    let componentName = $draggable.attr('data-com-name');
                    if( componentName !== 'layout_column' ){

                        e.stopPropagation();

                        if( ! componentId ){
                            that.addComponent( componentName );
                        }else{
                            that.addExistComponent( componentName, componentId);
                        }
                    }else{
                        //column组件内部不能直接放column组件
                        console.warn(`column组件[${that.componentId}]内部不能直接放column组件`);
                    }

                }
            });

            this.$el.draggable({
                handle: "> .glpb-editor-setting-wrap .glpb-editor-op-btn-drag",
                revert : 'invalid',
                helper: function(){
                    return that.editorGetDragHelper();
                },
                appendTo: "body"
            });

            // $('.ui-sortable').sortable('refresh');
        },
        
        //要添加新的一个组件
        addComponent : function(componentName){
            let config = {
                componentName : componentName,
                parentId : this.componentId,
                componentId : ComponentBase.generateComponentId()
            };
            let instance = this.page.createComponentInstance(config);
            if( instance ){
                instance.render();
                this.$content.append( instance.$getElement() );
                instance.bindEvent();
                this.components.push( instance.toJSON() );
            }else{
                throw new Error(`componentName[${componentName}]对应的组件不存在!!`);
            }
        },
        
        //要添加的组件实例,已经存在!
        addExistComponent : function(componentName, componentId ){

            if( componentName === this.componentName ){
                //column组件不能直接包含自身
                return;
            }
            console.log(`add exist component : ${componentName} ${componentId}`);
            let component = this.page.getComponentById(componentId);
            if( component ){
                let oldParentComponent = component.getParentComponent();
                oldParentComponent.editorRemoveComponent(componentId);
                this.components.push( component.toJSON() );
                this.$content.append( component.$getElement() );
            }
        },
        editorHandleChildMove : function(componentId, direction){
            let newIndex = ComponentBase.prototype.editorHandleChildMove.call( this, componentId, direction);
            if( newIndex >= 0 ){
                let $child = this.page.getComponentById(componentId).$getElement();
                utils.moveChildInParent($child, this.$content, newIndex);
            }
        }
    }
);


module.exports = LayoutColumn;