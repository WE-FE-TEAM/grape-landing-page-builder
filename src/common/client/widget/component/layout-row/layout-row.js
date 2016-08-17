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
        componentNameZh : '独占行',
        componentCategory : ComponentBase.CATEGORY.BASE,
        platform : ComponentBase.PLATFORM.PC
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
                componentName  : 'layout_column'
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
                let com = this.page.createComponentInstance( config );
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
                componentName  : 'layout_column'
            };

            //创建新的列组件
            let component = this.page.createComponentInstance(columnConf);
            component.render();
            let $el = component.$getElement();
            this.$content.append( $el );
            component.bindEvent();

            this.components.push( columnConf );

            // this.resize();
        },

        //添加已经存在的组件到内部
        addExistColumn : function(componentId){
            let component = this.page.getComponentById(componentId);
            if( component ){
                if( component.editorGetParentId() === this.componentId ){
                    //本来就在当前组件里
                    return;
                }
                let oldParentComponent = component.getParentComponent();
                oldParentComponent.editorRemoveComponent(componentId);
                this.components.push( component.toJSON() );
                this.$content.append( component.$getElement() );
            }

            // this.resize();
        },

        resize : function(){

            let components = this.components;

            let columnWidth = 100 / components.length + '%';

            let batchUpdateStyle = {};
            for( var i = 0, len = components.length; i < len; i++ ){
                let conf = components[i];

                batchUpdateStyle[ conf.componentId] = { width : columnWidth };
            }

            this.page.updateStyle(batchUpdateStyle);

        },

        bindEditorEvent : function(){
            let that = this;
            ComponentBase.prototype.bindEditorEvent.call( this );
            this.$content
                .droppable({
                // accept : '.lpb-component',
                accept : '[data-com-name=layout_column]',
                // accept : function(draggable){
                //     console.log( draggable );
                // },
                greedy : true,
                tolerance : 'pointer',
                classes: {
                    "ui-droppable-active": "custom-state-active",
                    "ui-droppable-hover": "custom-state-hover"
                },
                drop : function(e, ui){
                    let $draggable = ui.draggable;
                    let componentId = $draggable.attr('data-glpb-com-id');
                    if( ! componentId ){

                        e.stopPropagation();
                        that.addColumn();
                    }else if( componentId ){
                        //添加已有的组件到内部
                        e.stopPropagation();
                        that.addExistColumn( componentId );
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

        },

        editorRemoveComponent : function(componentId){
            ComponentBase.prototype.editorRemoveComponent.call( this, componentId );
            // this.resize();
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


module.exports = LayoutRow;


