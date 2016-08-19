/**
 * Created by jess on 16/8/8.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');
const glpbBase = require('glpb-components-common');
const utils = glpbBase.utils;
const componentFactory = glpbBase.factory;

const Builder = require('designer:widget/builder/builder.js');

let singleton = {

    init : function(){

        componentFactory.enableEditMode();

        this.builder = new Builder({
            platform : 'pc'
        });

        this.builder.bindEvent();

        window.builder = this.builder;
    }

};



module.exports = singleton;