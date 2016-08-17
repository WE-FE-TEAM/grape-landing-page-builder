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


/**
 *  在父DOM中移动子元素到新的位置
 * @param $child
 * @param $parent
 * @param newIndex
 */
singleton.moveChildInParent = function($child, $parent, newIndex){
    let children = $parent.children();
    let currentIndex = $child.index();
    let $toBeforeSibling = children[newIndex];
    // $target.detach();
    if( currentIndex < newIndex){
        $child.insertAfter($toBeforeSibling);
    }else if( currentIndex > newIndex ){
        $child.insertBefore($toBeforeSibling);
    }
};