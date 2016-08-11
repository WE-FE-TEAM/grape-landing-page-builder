/**
 * Created by jess on 16/8/10.
 */


'use strict';


let componentMap = {};



let singleton = {};


module.exports = singleton;


singleton.registerComponent = function(componentName, componentClass){
    if( componentMap[componentName] ){
        throw new Error(`componentName[${componentName}]已经存在了!!不能有相同的组件名`);
    }
    componentMap[componentName] = componentClass;
};

singleton.getComponent = function( componentName ){
    return componentMap[componentName];
};


