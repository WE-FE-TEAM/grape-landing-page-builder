/**
 * Created by jess on 16/8/10.
 */

'use strict';


let singleton = {};


module.exports = singleton;


let componentId = 0;

//生成组件ID
singleton.generateComponentId = function(){
    let now = Date.now();
    return 'glpb-com-' + now + componentId++;
};

