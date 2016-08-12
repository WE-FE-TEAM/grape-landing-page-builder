/**
 * Created by jess on 16/8/8.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');
const utils = require('common:widget/ui/utils/utils.js');
const componentFactory = require('common:widget/component/component-factory/component-factory.js');



let singleton = {

    init : function(){

        componentFactory.enableEditMode();
        

        let $componentList = $('#lpb-com-container');
        let $editor = $('#lpb-com-editor');

        $componentList.find('.lpb-component').draggable({
            // connectToSortable : '.lpb-sortable',
            revert : 'invalid',
            helper: "clone",
            appendTo: "body"
        });

        $editor.droppable({
            // accept : '.lpb-component',
            accept : '[data-com-name=layout_row]',
            classes: {
                "ui-droppable-active": "custom-state-active"
            },
            drop : function(e, ui){
                let $draggable = ui.draggable;
                if( $draggable.parents('#lpb-com-container').length > 0 ){

                    let conf = {
                        parentId : null,
                        componentName : 'layout_row'
                    };
                    let component = componentFactory.createComponentInstance(conf);
                    component.render();
                    let $el = component.$getElement();
                    $editor.append( $el );
                    component.bindEvent();
                }

            }
        }).sortable({
            items: ".glpb-com-layout_row",
            placeholder: "ui-state-highlight sortable-placeholder-horizontal",
            start : function(event, ui){
                console.log('start: ' + ui.item.index() );
            },
            update : function(event, ui){
                console.log('sort end: ' + ui.item.index() );
            }
        });
    }

};



module.exports = singleton;