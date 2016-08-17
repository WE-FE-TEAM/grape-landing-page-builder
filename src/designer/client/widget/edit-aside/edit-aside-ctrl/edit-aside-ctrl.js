/**
 * 左侧操作区域控制器
 * Created by jess on 16/8/17.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const componentFactory = require('common:widget/component/component-factory/component-factory.js');

const ComponentSelectCtrl = require('designer:widget/edit-aside/component-select-ctrl/component-select-ctrl.js');
const ComponentEditCtrl = require('designer:widget/edit-aside/component-edit-ctrl/component-edit-ctrl.js');


function EditAsideCtrl(args){
    
    this.platform = args.platform; 
    
    this.componentListCtrl = null;
    this.componentEditMap = {};
    
    this.$el = $( args.el );
    
    this.init();
}


$.extend( EditAsideCtrl.prototype, {
    
    init : function(){
        
        let components = componentFactory.getComponentOfPlatform(this.platform);
        
        this.componentListCtrl = new ComponentSelectCtrl({
            platform : this.platform,
            supportComponents : components
        });
    },
    
    render : function(){
        
        this.componentListCtrl.render();
        this.componentListCtrl.show();
        let $con = this.componentListCtrl.$getElement();
        this.$el.append( $con );

    },
    
    bindEvent : function(){
        this.componentListCtrl.bindEvent();
    },
    
    destroy : function(){
        this.componentListCtrl.destroy();
        this.componentListCtrl = null;
    },

    showEdit : function(component){
        this.componentListCtrl.hide();
        if( this.currentEdit ){
            this.currentEdit.destroy();
        }
        let edit = new ComponentEditCtrl({
            component : component
        });
        edit.render();
        this.$el.append( edit.$getElement() );
        this.currentEdit = edit;

        edit.show();
    }
    
} );


module.exports = EditAsideCtrl;

