/**
 * Created by jess on 16/8/10.
 */


'use strict';


const utils = require('common:widget/ui/utils/utils.js');

//存储支持的组件名到组件类的映射
let componentClassMap = {};

//存储当前页面中实例化的组件ID到组件实例的映射
let pageComponentMap = {};



let singleton = {};


module.exports = singleton;

/**
 * 注册组件类
 * @param componentName {string} 组件名
 * @param componentClass {function} 组件类的构造函数
 */
singleton.registerComponentClass = function(componentName, componentClass){
    if( componentClassMap[componentName] ){
        throw new Error(`componentName[${componentName}]已经存在了!!不能有相同的组件名`);
    }
    componentClassMap[componentName] = componentClass;
};

/**
 * 根据组件名获取组件类
 * @param componentName {string} 组件名
 * @returns {*}
 */
singleton.getComponentClass = function( componentName ){
    return componentClassMap[componentName];
};

/**
 * 注册当前页面中的组件实例
 * @param componentId {string} 组件ID
 * @param instance {object} 组件实例
 */
singleton.addComponentInstance = function(componentId, instance){
    if( pageComponentMap[componentId] ){
        throw new Error(`当前页面组件ID[${componentId}]已经存在了!!`);
    }
    pageComponentMap[componentId] = instance;
};

/**
 * 获取当前页面上,已经注册过的组件实例
 * @param componentId {string} 组件ID
 * @returns {*}
 */
singleton.getComponentById = function(componentId){
    return pageComponentMap[componentId];
};

/**
 * 根据组件的配置, 生成组件实例
 * @param config {object} 组件配置
 * @returns {*}
 */
singleton.createComponentInstance = function(config){
    let out = null;

    let componentClass = singleton.getComponentClass(config.componentName);

    if( typeof componentClass === 'function' ){
        if( ! config.componentId ){
            config.componentId = utils.generateComponentId();
        }
        out = new componentClass( config );
    }

    return out;

};


////////////////////////// 当前页面的编辑模式 /////////////

const MODE_EDIT = 'edit';
const MODE_PREVIEW = 'preview';
const MODE_PRODUCTION = 'production';

let pageMode = MODE_PRODUCTION;

singleton.enableEditMode = function(){
    pageMode = MODE_EDIT;
};
singleton.enablePreviewMode = function(){
    pageMode = MODE_PREVIEW;
};
singleton.enableProductionMode = function(){
    pageMode = MODE_PRODUCTION;
};

singleton.isEditMode = function(){
    return pageMode === MODE_EDIT;
};
singleton.isPreviewMode = function(){
    return pageMode === MODE_PREVIEW;
};
singleton.isProductionMode = function(){
    return pageMode === MODE_PRODUCTION;
};