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

    this.templateId = config.templateId || '';
    this.title = config.title || '新页面';
    this.meta = config.meta || [];
    this.components = config.components || [];
    this.componentStyles = config.componentStyles || {};

    //当前页面中所有的组件ID到组件实例的map
    this.componentRefs = {};

    this.init();

    //当前处于编辑中的组件ID
    this.currentEditComponentId  = null;

}

$.extend( Builder.prototype, {

    init : function(){
        
        let that = this;


        //初始化组件选择栏/编辑器区域
        let $componentList = $('#lpb-com-container');
        let $editor = $('#lpb-com-editor');

        // $componentList.find('.lpb-component').html5Draggable({
        //     onDragStart : function(event, dragInstance){
        //         let currentTarget = event.currentTarget;
        //         that.setDragInfo(currentTarget.getAttribute('data-com-name'));
        //         console.log('drag start ', event );
        //     }
        // });
        //
        // $editor.parent().html5Droppable({
        //     items : '.gplb-sys-editor',
        //     onDropping : function(side, event, dropInstance){
        //         console.log(side, event, dropInstance);
        //         let dragInfo = that.getDragInfo();
        //         let componentName = dragInfo.componentName;
        //         if( ! dragInfo.componentId ){
        //             //新增组件
        //             if( componentName === 'layout_row' ){
        //                 that.addNewRow();
        //             }
        //         }else{
        //             //添加已经存在的组件
        //         }
        //     }
        // });

        $componentList.find('.lpb-component').draggable({
            connectToSortable : '.ui-sortable',
            revert : 'invalid',
            helper: "clone",
            appendTo: "body"
        });

        // $componentList.sortable({
        //     group : 'glpb-sortable',
        //     containerSelector : '.glpb-sortable',
        //     drop : false,
        //     itemSelector : '.lpb-component',
        //     onDragStart : function($item, container, _super){
        //         // Duplicate items of the no drop area
        //         if(!container.options.drop){
        //             $item.clone().insertAfter($item);
        //             $item.css({
        //                 position : 'absolute'
        //             }).appendTo( document.body );
        //         }
        //         _super($item, container);
        //     }
        // });
        //
        // $editor.sortable({
        //     group : 'glpb-sortable',
        //     containerSelector : '.glpb-sortable',
        //     itemSelector : '.glpb-com-layout_row',
        //     handle: ".glpb-editor-setting-wrap .glpb-editor-op-btn-drag",
        //     pullPlaceholder : true,
        //     onDrop : function($item, container, _super, event){
        //         console.log($item, container);
        //     }
        // });

        $editor
            .droppable({
                // accept : '.lpb-component',
                accept : '[data-com-name=layout_row]',
                classes: {
                    "ui-droppable-active": "custom-state-active"
                },
                drop : function(e, ui){
                    let $draggable = ui.draggable;
                    let componentId = $draggable.attr('data-glpb-com-id');
                    if( $draggable.parents('#lpb-com-container').length > 0 ){

                        that.addNewRow();

                    }else{
                        that.addExistRow(componentId);
                    }

                }
            })
            // .sortable({
            //     revert : true,
            //     items: ".glpb-com-layout_row",
            //     handle: ".glpb-editor-setting-wrap .glpb-editor-op-btn-drag",
            //     placeholder: "ui-state-highlight sortable-placeholder-horizontal",
            //     // onSortStart : function(){},
            //     start : function(event, ui){
            //         event.stopPropagation();
            //         console.log('start: ' + ui.item.index() );
            //     },
            //     over : function(event, ui){
            //         event.stopPropagation();
            //     },
            //     update : function(event, ui){
            //         event.stopPropagation();
            //         console.log('sort end: ' + ui.item.index() );
            //     },
            //     receive : function(event, ui){
            //         event.stopPropagation();
            //         console.log( ui );
            //         // ui.sender.sortable('cancel');
            //     },
            //     stop : function(event, ui){
            //         event.stopPropagation();
            //         $(this).sortable('cancel');
            //         let item = ui.item;
            //         let componentId = item.attr('data-com-id');
            //         if( ! componentId ){
            //             //添加新的行组件
            //             item.remove();
            //             that.addNewRow();
            //         }
            //         console.log('stop in builder', ui );
            //     }
            // });
        
        this.$rawContainer = $componentList;
        this.$editor = $editor;
    },
    
    bindEvent : function(){
        
    },
    
    createComponentInstance : function(conf){
        conf.page = this;
        let component = componentFactory.createComponentInstance(conf);
        if( component ){
            let componentId = component.getComponentId();
            this.componentRefs[componentId] = component;
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
        this.components.push( component.toJSON() );
    },
    
    addExistRow : function(componentId){
        let component = this.getComponentById(componentId);
        if( component ){
            let oldParentComponent = component.getParentComponent();
            oldParentComponent.editorRemoveComponent(componentId);
            this.components.push( component.toJSON() );
            this.$editor.append( component.$getElement() );
        }
    },

    /**
     * 批量修改组件样式
     * @param conf {object} 包含组件ID及该组件要修改的样式 { com-id : {}, com-id-2 : {} }
     */
    updateStyle : function( conf ){

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

    editorRemoveComponent : function(componentId){
        let components = this.components || [];
        for( var i = 0, len = components.length; i < len; i++ ){
            let conf = components[i];
            if( conf.componentId === componentId ){
                components.splice(i, 1);
                return true;
            }
        }
        console.warn(`(editorRemoveComponent) : 页面不包含子组件${componentId}`);
        return false;
    },

    editorHandleChildMove : function(componentId, direction){
        if( [ 'up', 'down', 'left', 'right'].indexOf(direction) < 0 ){
            console.warn(`子组件移动方向值[${direction}]非法!!只能是 up/down/left/right 之一`);
            return false;
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
            return false;
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
            return false;
        }
        if( newIndex >= len ){
            alert('已经是父组件中最后一个了');
            return false;
        }
        //先从老的位置删除
        components.splice(oldIndex, 1);
        //插入到新位置
        components.splice(newIndex, 0, childConf);

        //移动DOM
        let targetComponent = this.getComponentById(componentId);
        let $target = targetComponent.$getElement();
        utils.moveChildInParent($target, this.$editor, newIndex);
    },

    /**
     * 编辑某个组件
     * @param componentId {string} 组件ID
     */
    editComponent : function(componentId){
        
    }

} );



module.exports = Builder;

