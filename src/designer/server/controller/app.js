/**
 * Created by jess on 16/8/8.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class DesignerController extends ControllerBase{

    // drag and drop 的页面
    createAction(){
        this.http.render('designer/page/editor/editor.tpl');
    }

}


module.exports = DesignerController;