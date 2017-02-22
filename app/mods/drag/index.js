var $ = require('jquery');

function Drag() {}

$.extend(Drag.prototype, {
    init: function($target) {

        var self = this;

        self.params = {
            left: 0,
            top: 0,
            currentX: 0,
            currentY: 0,
            moveFlag: false
        };

        self.$target = $target;

        var params = self.params;

        var $doc = $(document);

        if ($target.css('left') !== 'auto') {
            params.left = $target.css('left');
        }
        if ($target.css('top') !== 'auto') {
            params.top = $target.css('top');
        }

        this.mousedownHandler = function(ev) {

            ev.preventDefault();

            params.moveFlag = true;

            var isMobile = ev.changedTouches && ev.changedTouches[0];

            if (isMobile) {
                params.currentX = ev.changedTouches[0].pageX;
                params.currentY = ev.changedTouches[0].pageY;
            } else {
                params.currentX = ev.clientX;
                params.currentY = ev.clientY;
            }

        };
        $target.on('mousedown touchstart', this.mousedownHandler);

        this.mouseupHandler = function(ev) {
            ev.preventDefault();

            params.moveFlag = false;

            self.setCurrentPos();

        };
        $doc.on('mouseup touchend', this.mouseupHandler);

        this.mousemoveHandler = function(ev) {

            ev.preventDefault();

            if (params.moveFlag) {

                var isMobile = ev.changedTouches && ev.changedTouches[0];

                if (isMobile) {
                    var nowX = ev.changedTouches[0].pageX;
                    var nowY = ev.changedTouches[0].pageY;
                } else {
                    var nowX = ev.clientX;
                    var nowY = ev.clientY;
                }

                var disX = nowX - params.currentX;
                var disY = nowY - params.currentY;

                var style = {
                    left: parseInt(params.left) + parseInt(disX) + 'px',
                    top: parseInt(params.top) + parseInt(disY) + 'px'
                };

                $target.css(style);

                self.moveHandler && (self.moveHandler(style));
            }

        };
        $doc.on('mousemove touchmove', this.mousemoveHandler);

        return this;
    },

    destory: function() {
        var $doc = $(document);
        $doc.off('mousemove touchmove', this.mousemoveHandler);
        $doc.off('mouseup touchend', this.mouseupHandler);
        this.$target.off('mousedown touchstart', this.mousedownHandler);
    },

    onMove: function(callback) {
        callback && (this.moveHandler = callback);
    },

    setCurrentPos: function() {

        var cssLeft = this.$target.css('left');
        var cssTop = this.$target.css('top');

        if (cssLeft !== 'auto') {
            this.params.left = cssLeft;
        }

        if (cssTop !== 'auto') {
            this.params.top = cssTop;
        }

    }

});

module.exports = Drag;