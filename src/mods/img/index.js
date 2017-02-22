require('./index.less');

var $ = require('jquery');
var env = require('../../env');
var Drag = require('../drag/index');

/*
 * 图片部分
 */
function Img(config) {

    this.config = $.extend({}, config);

    this.init();
}

$.extend(Img.prototype, {

    init: function() {
        this.$insert = $(this.config.insert);

        this.appendDom();
        this.addEvent();
    },

    destory: function() {
        this.$img.remove();
        this.$insert = null;
        this.$img = null;

        this.dragInstance.destory();
    },

    appendDom: function() {

        var style = [
            'opacity: ' + this.config.opacity,
            'z-index: ' + this.config.zIndex,
            'width: ' + this.config.width,
            'height: ' + this.config.height,
            'left: ' + this.config.left,
            'top: ' + this.config.top,
            'border: ' + (this.config.showBorder ? '1px solid #000000' : '0'),
            (!this.config.src || !this.config.showImg ? 'display: none' : ''),
            ''
        ].join(';');

        this.$insert.append('<img class="visual-compare-img J_VisualCompareImg" src="' + (this.config.src || env.imgPlaceholder) + '" draggable="false" alt="" style="' + style + '">');

        this.$img = this.$insert.find('.J_VisualCompareImg');

    },

    dragHandler: function(style) {

        var left = style.left;
        var top = style.top;

        $('.J_VisualComparePanel .J_VisualCompare_ValLeft').val(left);
        $('.J_VisualComparePanel .J_VisualCompare_ValTop').val(top);

    },

    addEvent: function() {
        this.dragInstance = new Drag();
        this.dragInstance.init(this.$img).onMove(this.dragHandler);
    },

    removeEvent: function() {

    }

});

module.exports = Img;