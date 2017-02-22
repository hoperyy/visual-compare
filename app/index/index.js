
require('./index.less');

var $ = require('jquery');
var Drag = require('../mods/drag/index');
var Img = require('../mods/img/index');
var CrossLine = require('../mods/crossline/index');
var Panel = require('../mods/panel/index');

var env = require('../env');

/*
 * 入口
 */
function Index() {

    var localConfig = JSON.parse(localStorage.getItem(env.localStorage.configName)) || {};

    $('body').append('<div class="visual-compare-wrapper J_VisualCompareWrapper"></div>');

    this.config = $.extend({

        // 要插入的 dom 外层容器，默认插入到 body
        insert: $('body').find('.J_VisualCompareWrapper'),

        // 图片宽度
        width: '100%',

        // 图片高度
        height: 'auto',

        showBorder: false,

        // 显示图片
        showImg: true,

        // 展示比较线
        showCrossLine: false,

        // 展开控制面板
        showPanel: true,

        // left
        left: 0,

        // top
        top: 0,

        // zIndex
        zIndex: 1,

        // opacity
        opacity: 0.6,

        // 视觉稿链接
        src: ''

    }, localConfig);

    this.init();
}

$.extend(Index.prototype, {

    init: function() {
        this.img = new Img(this.config);
        this.crossLine = new CrossLine(this.config);
        this.panel = new Panel(this.config, this.img);
    },

    destory: function() {
        this.img.destory();
        this.crossLine.destory();
        this.panel.destory();

        this.img = null;
        this.crossLine = null;
        this.panel = null;

        this.config = null;

        $('body').find('.J_VisualCompareWrapper').remove();

        window.localStorage.setItem(env.localStorage.stateName, 'off');
    }

});

module.exports = Index;