/**
 * 组件的数据编辑区域
 * Created by jess on 16/8/17.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');


function DataEditCtrl(args){
    
    this.component = args.component;
    
    this.$el = null;
    
    this.init();
}


$.extend(DataEditCtrl.prototype, {
    
    init : function(){},
    
    render : function(){
        let tpl = `<div class="editor-com-data-edit">编辑数据</div>`;
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


module.exports = DataEditCtrl;


