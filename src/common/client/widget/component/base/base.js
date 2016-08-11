/**
 * 所有组件的基类
 * Created by jess on 16/8/10.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');


function noop(){}

function ComponentBase( args ){
    args = args || {};
    this.componentId = args.componentId;
    this.componentName = this.constructor.componentName;
    this.$el = null;
    this.style = args.style || {};
    this.data = args.data || {};
    this.components = args.components || [];

    this.init();
}


$.extend( ComponentBase.prototype, {

    init : noop,

    render : noop,

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
            style : this.style,
            data : this.data,
            components : subJSON
        };
    },
    destroy : noop,

    getComponentId : function(){
        return this.componentId;
    },

    getComponentType : function(){
        return this.componentName;
    },

    getBaseCssClass : function(){
        return 'glpb-component ';
    }
} );

//组件类型
ComponentBase.componentName = 'base';
//组件所属类目
ComponentBase.componentCategory = '__NONE__';

ComponentBase.getDefaultStyle = function(){
    return {};
};

ComponentBase.getDefaultData = function(){
    return {};
};

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
    function Component(){
        ComponentBase.apply( this, [].slice.call(arguments) );
    }
    $.extend( Component, statics);
    function parent(){}
    parent.prototype = ComponentBase.prototype;
    Component.prototype = new parent();
    Component.prototype.constructor = Component;
    $.extend(Component.prototype, prototype);
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

