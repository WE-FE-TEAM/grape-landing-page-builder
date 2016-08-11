/**
 * Created by jess on 16/8/8.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class PassportController extends ControllerBase{

    // drag and drop 的页面
    dndAction(){
        this.http.render('demo/page/dnd/dnd.tpl');
    }

}


module.exports = PassportController;