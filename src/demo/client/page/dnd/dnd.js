/**
 * Created by jess on 16/8/8.
 */


'use strict';


let singleton = {

    init : function(){
        

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
            accept : '[data-lpb-component=layout_row], [data-lpb-component=layout_column]',
            classes: {
                "ui-droppable-active": "custom-state-active"
            },
            drop : function(e, ui){
                let $draggable = ui.draggable;
                if( $draggable.parents('#lpb-com-container').length > 0 ){
                    $editor.append( $draggable.clone() );
                }

            }
        }).sortable({
            items: ".lpb-component",
            placeholder: "ui-state-highlight",
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