/**
 * Created by jess on 16/8/8.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');
const utils = require('common:widget/ui/utils/utils.js');
const componentFactory = require('common:widget/component/component-factory/component-factory.js');

const Builder = require('demo:widget/inner/builder/builder.js');

let singleton = {

    init : function(){

        componentFactory.enableEditMode();
        
        this.builder = new Builder();

        this.builder.bindEvent();

        window.builder = this.builder;
    }

};



module.exports = singleton;