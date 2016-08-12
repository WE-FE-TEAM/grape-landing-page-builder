/**
 * Created by jess on 16/8/11.
 */


'use strict';

const ComponentBase = require('common:widget/component/base/base.js');

const componentFactory = require('common:widget/component/component-factory/component-factory.js');

const $ = ComponentBase.$;

const tpl = `<div></div>`;



const LayoutColumn = ComponentBase.extend(
    {
        componentName : 'layout_column',
        componentCategory : ComponentBase.CATEGORY.BASE
    },
    {
        getDefaultStyle : function(){
            return {
                height : '100%'
            };
        },
        init : function(){

        },
        render : function(){
            let currentComponentId = this.componentId;
            let cssClass = this.getBaseCssClass() + ' clearfix ui-sortable ui-droppable ';
            let $el = $(tpl).addClass( cssClass ).css( this.style );
            this.$el = $el;
            let components = this.components || [];
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                config.parentId = currentComponentId;
                let com = componentFactory.createComponentInstance( config );
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
        }
    }
);


module.exports = LayoutColumn;