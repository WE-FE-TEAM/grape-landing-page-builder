{# 页面编辑面板 #}
{% extends 'common:page/layout.tpl' %}

{% block block_body %}

<div id="editor-app">
    <header id="editor-header"></header>
    <section id="editor-main">
        <aside id="com-edit-section"></aside>
        <article id="editor-panel">
            <div id="lpb-com-editor" class="glpb-sortable gplb-sys-editor">

            </div>
        </article>
    </section>
</div>

{% endblock %}

{% block block_body_js %}
{% script %}
    require(['designer:page/editor/editor.js'], function(app){
        app.init();
    });
{% endscript %}
{% endblock %}