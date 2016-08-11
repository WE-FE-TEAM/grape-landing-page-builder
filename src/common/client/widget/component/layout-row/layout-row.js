/**
 * 布局组件, 代表一个 DIV 的block区域
 * Created by jess on 16/8/10.
 */

'use strict';


const ComponentBase = require('common:widget/component/base/base.js');

const componentFactory = require('common:widget/component/component-factory/component-factory.js');

const $ = ComponentBase.$;

const tpl = `<div></div>`;

const LayoutRow = ComponentBase.extend(
    {
        componentName : 'layout_row',
        componentCategory : ComponentBase.CATEGORY.BASE
    }, 
    {
        init : function(){
            
        },
        render : function(){
            let cssClass = this.getBaseCssClass() + ' clearfix ui-sortable ui-droppable ';
            let $el = $(tpl).addClass( cssClass );
            this.$el = $el;
            let components = this.components || [];
            for( var i = 0, len = components.length; i < len; i++ ){
                let config = components[i];
                let componentName = config.componentName;
                let componentClass =  componentFactory.getComponent(componentName);
                if( typeof componentClass === 'function' ){
                    let com = new componentClass( config );
                    let $comEl = com.render();
                    $el.append( $comEl );
                }else{
                    //不存在该组件
                    throw new Error(`componentName[${componentName}]对应的组件不存在!!`);
                }
            }
            return $el;
        }
    }
);


module.exports = LayoutRow;


