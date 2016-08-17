/**
 * 编辑组件内部的style和data的控制器
 * Created by jess on 16/8/17.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');

const StyleEditCtrl = require('designer:widget/edit-aside/style-edit-ctrl/style-edit-ctrl.js');
const DataEditCtrl = require('designer:widget/edit-aside/data-edit-ctrl/data-edit-ctrl.js');


function ComponentEditCtrl(args){

    this.platform = args.platform;

    this.component = args.component;

    this.$el = null;
    this.styleCtrl = null;
    this.dataCtrl = null;

    this.init();
}


$.extend( ComponentEditCtrl.prototype, {

    init : function(){
        this.styleCtrl = new StyleEditCtrl({
            component : this.component
        });
        this.dataCtrl = new DataEditCtrl({
            component : this.component
        });
        
    },

    render : function(){
        let tpl = `<div class="editor-com-edit-ctrl">
        <h2 class="editor-back-to-list">返回组件列表</h2>
        <ul class="tab-nav">
            <li data-for="style">编辑样式</li>
            <li data-for="data">编辑数据</li>
        </ul>
        <div class="tab-con"></div>
</div>`;

        let $el = $(tpl);
        this.$el = $el;
        
        this.styleCtrl.render();
        $el.find('.tab-con').append( this.styleCtrl.$getElement() );
        
        this.dataCtrl.render();
        $el.find('.tab-con').append( this.dataCtrl.$getElement() );
    },

    bindEvent : function(){
        let that = this;
        this.$el.on('click', '.editor-back-to-list', function(){
            EventEmitter.eventCenter.trigger('component.list.show');
        } );
        this.$el.on('click', '.tab-nav li', function(e){
            let li = e.currentTarget;
            let forData = li.getAttribute('data-for');
            that.showView( forData );
        } );
        
        this.styleCtrl.bindEvent();
        this.dataCtrl.bindEvent();
    },

    showView : function(view){
        switch( view ){
            case 'style':
                this.dataCtrl.hide();
                this.styleCtrl.show();
                break;
            case 'data':
                this.styleCtrl.hide();
                this.dataCtrl.show();
                break;
            default:
                ;
        }
    },

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
        this.styleCtrl.destroy();
        this.dataCtrl.destroy();
        this.styleCtrl = null;
        this.dataCtrl = null;
        this.$el.off();
        this.$el.remove();
        this.$el = null;
    }
} );



module.exports = ComponentEditCtrl;


