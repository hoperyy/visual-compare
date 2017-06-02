require('./index.less');
var $ = require('jquery');

/*
* 交叉线部分
*/
function CrossLine(config) {

    this.config = $.extend({}, config);

    this.init();

}

$.extend(CrossLine.prototype, {

    init: function() {
        this.$insert = $(this.config.insert);
        this.appendDom();

        this.$rowLine = this.$insert.find('.J_VisualCompareRowLine');
        this.$verticalLine = this.$insert.find('.J_VisualCompareVerticalLine');

        this.addEvent();
    },

    destory: function() {
        var $win = $(window);

        $win.off('mouseup', this.mouseupHandler);
        $win.off('mousemove', this.mousemoveHandler);

        this.$insert.remove();
        this.$rowLine.remove();
        this.$verticalLine.remove();
    },

    appendDom: function() {
        this.$insert.append('<span style="' + (!this.config.showCrossLine ? 'display: none;' : 'display: block;') + '" class="visual-compare-row-line J_VisualCompareRowLine J_VisualCompareCrossLine"></span><span style="' + (!this.config.showCrossLine ? 'display: none;' : 'display: block;') + '" class="visual-compare-vertical-line J_VisualCompareVerticalLine J_VisualCompareCrossLine"></span>');
    },

    addEvent: function() {

        var self = this;
        var $win = $(window);

        var moveCount = 0;

        this.mouseupHandler = function(ev) {
            moveCount = 0;
        };
        $win.on('mouseup', this.mouseupHandler);

        this.mousemoveHandler = function(ev) {
            moveCount++;



            if (moveCount < 3) {
                return;
            }

            if (!self.$verticalLine.is(':visible')) {
                return;
            }

            var currentX = ev.clientX;
            var currentY = ev.clientY;

            // 手机模式下不支持该功能
            self.$verticalLine.show().css({
                left: currentX - 5
            });

            self.$rowLine.show().css({
                top: currentY - 5
            });
        };
        $win.on('mousemove', this.mousemoveHandler);

    }

});

module.exports = CrossLine;
