/**
 * 组件的样式编辑区域
 * Created by jess on 16/8/17.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');


function StyleEditCtrl(args){
    
    this.component = args.component;
    
    this.$el = null;
    
    this.init();
}


$.extend(StyleEditCtrl.prototype, {
    
    init : function(){},
    
    render : function(){
        let tpl = `<div class="editor-com-style-edit">编辑样式</div>`;
        let $el = $(tpl);
        this.$el = $el;
    },
    
    bindEvent : function(){},
    
    $getElement : function(){
        return this.$el;
    },
    
    show : function(){
        this.$el.show();
    },
    hide : function(){
        this.$el.hide();
    },
    
    destroy : function(){
        this.$el.off();
        this.$el.remove();
        this.$el = null;
    }
} );


module.exports = StyleEditCtrl;


