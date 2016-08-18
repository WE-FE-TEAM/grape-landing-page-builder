/**
 * 代表一个 <img /> 元素
 * Created by jess on 16/8/18.
 */


'use strict';

const ComponentBase = require('common:widget/component/base/base.js');

const utils = require('common:widget/ui/utils/utils.js');

const $ = ComponentBase.$;

const tpl = `<div><img /></div>`;

const ImageView = ComponentBase.extend(
    {
        componentName : 'gplb_image',
        componentNameZh : '单个图片',
        componentCategory : ComponentBase.CATEGORY.BASE,
        platform : ComponentBase.PLATFORM.RESPONSIVE
    },
    {
        getDefaultStyle : function(){
            return {
                height : 'auto',
                width : 'auto',
                margin : '0 auto'
            };
        },
        
        getDefaultData : function(){
            return {
                imageURL : '//placehold.it/350x150',
                title : '',
                alt : ''
            };
        },

        render : function(){
            let currentComponentId = this.componentId;
            let data = this.data;

            let cssClass = this.getBaseCssClass() + '  ';
            let $el = $(tpl).addClass( cssClass ).css( this.style );
            let $content = $('img', $el).attr('src', data.imageURL).attr('title', data.title).attr('alt', data.alt);
            this.$el = $el;
            this.$content = $content;
        },

        //渲染编辑模式下, 额外的DOM组件
        renderEditorHelper : function(){
            let $el = this.$el;
            let $editorSettingWrap = this.$getEditSettingWrap();
            $el.append($editorSettingWrap);
        }
    }
);


module.exports = ImageView;

