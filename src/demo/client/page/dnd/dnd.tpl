{# 拖拽页面 #}
{% extends 'common:page/layout.tpl' %}

{% block block_body %}

<div id="lpb-com-container" class="ui-helper-clearfix">
    <div class="lpb-component" data-lpb-component="layout_row">布局行</div>
    <div class="lpb-component" data-lpb-component="layout_column">布局列</div>
</div>

<div id="lpb-com-editor" class="lpb-sortable">

</div>

{% endblock %}

{% block block_body_js %}
{% script %}
    require(['demo:page/dnd/dnd.js'], function(app){
        app.init();
    });
{% endscript %}
{% endblock %}