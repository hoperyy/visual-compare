require('./index.less');

var $ = require('jquery');
var env = require('../../env');

function Panel(config, imgInstance) {

    this.imgInstance = imgInstance;

    this.config = $.extend({}, config);

    this.init();

}

$.extend(Panel.prototype, {

    init: function() {
        this.$insert = $(this.config.insert);
        this.$img = $('.J_VisualCompareImg');
        this.$crossLine = $('.J_VisualCompareCrossLine');

        this.appendDom();

        this.addEvent();
    },

    destory: function() {
        this.$container.find('.J_VisualCompare_InputText').off('focus');
        this.$container.find('.J_VisualCompare_InputText').off('keyup');
        this.$container.find('.J_VisualCompare_InputCheckbox').off('change');
        this.$container.find('.J_VisualCompare_Reset').off('click');
        this.$container.find('.J_VisualCompare_PanelSwitcher').off('click');
        this.$container.find('.J_VisualCompare_ImgSwither').off('click');
        $(window).off('unload', this._windowOnloadHandler);

        this.$insert.remove();
        this.$img.remove();
        this.$crossLine.remove();

        this.$insert = null;
        this.$img = null;
        this.$crossLine = null;
        this.$panelArea = null;
        this.$container = null;
    },

    appendDom: function() {

        // 插入 DOM 的时候就根据配置信息初始化面板样式
        var panelZIndex = parseInt(this.config.zIndex) ? (parseInt(this.config.zIndex) + 1000) : 1000;
        var domString = '' +
            '<div class="visual-compare-panel J_VisualComparePanel" style="z-index: ' + panelZIndex + ';">' +

            '<div class="visual-compare-panel-area J_VisualCompare_PanelArea"' + (!this.config.showPanel ? ' style="display: none;"' : '') + '>' +
            '<ul>' +
            '<li>' +
            '<span class="label">opacity: </span><input type="text" value="' + this.config.opacity + '" class="J_VisualCompare_InputText J_VisualCompare_ValOpacity">' +
            '</li>' +
            '<li>' +
            '<span class="label">z-index: </span><input type="text" value="' + this.config.zIndex + '" class="J_VisualCompare_InputText J_VisualCompare_ValZIndex">' +
            '</li>' +
            '<li>' +
            '<span class="label">width: </span><input type="text" value="' + this.config.width + '" class="J_VisualCompare_InputText J_VisualCompare_ValWidth">' +
            '</li>' +
            '<li>' +
            '<span class="label">height: </span><input type="text" value="' + this.config.height + '" class="J_VisualCompare_InputText J_VisualCompare_ValHeight">' +
            '</li>' +
            '<li>' +
            '<span class="label">left: </span><input type="text" value="' + this.config.left + '" class="J_VisualCompare_InputText J_VisualCompare_ValLeft">' +
            '</li>' +
            '<li>' +
            '<span class="label">top: </span><input type="text" value="' + this.config.top + '" class="J_VisualCompare_InputText J_VisualCompare_ValTop">' +
            '</li>' +
            '<li>' +
            '<span class="label">img src: </span><input type="text"' + (this.config.src ? 'value=' + this.config.src : '') + ' class="J_VisualCompare_InputText J_VisualCompare_ValPic">' +
            '</li>' +
            '<li>' +
            '<span class="label">img border: </span><span class="checkbox J_VisualCompare_InputCheckbox J_VisualCompare_ValBorder' + (this.config.showBorder ? ' checked' : '') +'"></span>' +
            '</li>' +
            '<li>' +
            '<span class="label">crossline: </span><span class="checkbox J_VisualCompare_InputCheckbox J_VisualCompare_ValCrossLine' + (this.config.showCrossLine ? ' checked' : '') +'"></span>' +
            '</li>' +
            '</ul>' +
            '</div>' +

            '<div class="visual-compare-btn-area">' +

            '<a href="javascript:;"' + (!this.config.showPanel ? ' style="display: none;"' : '') + ' class="visual-compare-btn btn-reset J_VisualCompare_Reset">重置</a>' +

            (this.config.showImg && this.config.src ? '<a href="javascript:;"' + (!this.config.showPanel ? ' style="display: none;"' : '') + ' class="visual-compare-btn btn-img-switcher J_VisualCompare_ImgSwither">隐藏图片</a>' : '<a href="javascript:;"' + (!this.config.showPanel ? ' style="display: none;"' : '') + ' class="visual-compare-btn btn-img-switcher visual-compare-is-closed J_VisualCompare_ImgSwither">显示图片</a>') +

            (this.config.showPanel ? '<a href="javascript:;" class="visual-compare-btn J_VisualCompare_PanelSwitcher">收起面板<a>' : '<a href="javascript:;" class="visual-compare-btn J_VisualCompare_PanelSwitcher visual-compare-is-closed' + '">还原度助手</a>') +

            '</div>' +

            '</div>';


        this.$insert.append(domString);

        this.$container = this.$insert.find('.J_VisualComparePanel');

        this.$panelArea = this.$insert.find('.J_VisualCompare_PanelArea');

    },

    config2style: function(config) {
        var style = {};

        $.each(config, function(key, value) {

            if (key === 'showBorder') {
                key = 'border';
                value = value ? '1px solid black' : '0';
            }

            style[key] = value;

        });

        return style;
    },

    getPanelConfig: function() {

        // 输入的配置
        var config = {
            opacity: $('.J_VisualCompare_ValOpacity', this.$container).val(),
            width: $('.J_VisualCompare_ValWidth', this.$container).val(),
            height: $('.J_VisualCompare_ValHeight', this.$container).val(),
            zIndex: $('.J_VisualCompare_ValZIndex', this.$container).val(),
            left: $('.J_VisualCompare_ValLeft', this.$container).val(),
            top: $('.J_VisualCompare_ValTop', this.$container).val(),
            showBorder: $('.J_VisualCompare_ValBorder', this.$container).hasClass('checked'),
            showCrossLine: $('.J_VisualCompare_ValCrossLine', this.$container).hasClass('checked'),
            showImg: !$('.J_VisualCompare_ImgSwither', this.$container).hasClass('visual-compare-is-closed'),
            showPanel: !$('.J_VisualCompare_PanelSwitcher', this.$container).hasClass('visual-compare-is-closed'),
            src: $('.J_VisualCompare_ValPic', this.$container).val()
        };

        return config;

    },

    updateStyleByPanel: function() {
        var inputValue = this.getPanelConfig();

        var style = this.config2style(inputValue);

        // 图片样式
        this.$img.css(style);

        // panel 的 zIndex 始终要比图片高一级
        var imgZIndex = parseInt(inputValue.zIndex);
        this.$container.css({
            zIndex: imgZIndex ? imgZIndex + 1000 : 1000
        });

        if (inputValue.src) {
            this.$img.attr('src', inputValue.src);
        }

        // 交叉线
        if (inputValue.showCrossLine) {
            this.$crossLine.show();
        } else {
            this.$crossLine.hide();
        }


    },

    storePanelConfig: function(config) {
        localStorage.removeItem(env.localStorage.configName);
        localStorage.setItem(env.localStorage.configName, JSON.stringify(config));
    },

    resetPanel: function() {

        $('.J_VisualCompare_ValOpacity', this.$container).val(0.6);
        $('.J_VisualCompare_ValWidth', this.$container).val('100%');
        $('.J_VisualCompare_ValHeight', this.$container).val('auto');
        $('.J_VisualCompare_ValZIndex', this.$container).val(1);
        $('.J_VisualCompare_ValLeft', this.$container).val(0);
        $('.J_VisualCompare_ValTop', this.$container).val(0);
        $('.J_VisualCompare_ValBorder', this.$container).removeClass('checked');
        $('.J_VisualCompare_ValCrossLine', this.$container).removeClass('checked');

        this.updateStyleByPanel();

        // 修正拖拽组件的状态值
        this.imgInstance.dragInstance.setCurrentPos();

    },

    addEvent: function() {
        var self = this;

        // hack: chrome 移动模拟器无法实现点击聚焦
        this.$container.find('.J_VisualCompare_InputText').on('touchstart', function() {
            this.focus();
        });

        this.$container.find('.J_VisualCompare_InputCheckbox').on('touchstart click', function(ev) {
            ev.preventDefault();
            var $target = $(this);
            if ($target.hasClass('checked')) {
                $target.removeClass('checked');
            } else {
                $target.addClass('checked');
            }

            self.updateStyleByPanel();
        });

        var keyupTimer;
        this.$container.find('.J_VisualCompare_InputText').on('keyup', function() {

            clearTimeout(keyupTimer);

            setTimeout(function() {
                // 获取输入值
                self.updateStyleByPanel();
                clearTimeout(keyupTimer);
            }, 100);

        });

        this.$container.find('.J_VisualCompare_Reset').on('click touchstart', function() {
            self.resetPanel();
        });

        this.$container.find('.J_VisualCompare_PanelSwitcher').on('click touchstart', function(ev) {
            var $target = $(ev.currentTarget);
            if ($target.hasClass('visual-compare-is-closed')) { // 关闭状态
                self.$panelArea.show();
                self.$container.find('.J_VisualCompare_ImgSwither').show();
                self.$container.find('.J_VisualCompare_Reset').show();
                $target.removeClass('visual-compare-is-closed').text('收起面板');
            } else {

                // 展开状态
                self.$panelArea.hide();
                self.$container.find('.J_VisualCompare_ImgSwither').hide();
                self.$container.find('.J_VisualCompare_Reset').hide();
                $target.addClass('visual-compare-is-closed').text('还原度助手');
            }

        });

        this.$container.find('.J_VisualCompare_ImgSwither').on('click touchstart', function(ev) {
            var $target = $(ev.currentTarget);

            if ($target.hasClass('visual-compare-is-closed')) { // 关闭状态
                self.$img.show();
                $target.removeClass('visual-compare-is-closed').text('隐藏图片');
            } else {
                // 展开状态
                self.$img.hide();
                $target.addClass('visual-compare-is-closed').text('显示图片');
            }

        });

        // 刷新页面时存储配置到 localstorage
        this._windowOnloadHandler = function() {
            var inputValue = self.getPanelConfig();

            self.storePanelConfig(inputValue);
        };
        $(window).on('unload', this._windowOnloadHandler);

        function addkeyUpDownEvent($dom, upHandler, downHandler) {
            $dom.on('keydown', function(ev) {
                if (ev.keyCode !== 38 && ev.keyCode !== 40) {
                    return;
                }

                var $target = $(this);
                var val = $.trim($target.val());

                // 上键
                if (ev.keyCode === 38) {
                    upHandler.call(this, val, $target);
                }

                // 下键
                if (ev.keyCode === 40) {
                    downHandler.call(this, val, $target);
                }

            });
        }

        addkeyUpDownEvent(this.$container.find('.J_VisualCompare_ValOpacity'), function(val, $target) {

            val = parseFloat(val === '' ? 1 : val);

            if (val < 1) {
                val = val * 10;
                val += 1;
                val = val / 10;
            }

            $target.val(val);

        }, function(val, $target) {
            val = parseFloat(val === '' ? 1 : val);

            if (val > 0) {
                val = val * 10;
                val -= 1;
                val = val / 10;
            }
            $target.val(val);
        });

        addkeyUpDownEvent(this.$container.find('.J_VisualCompare_ValZIndex'), function(val, $target) {
            val = parseFloat(val === '' ? 0 : val);
            val += 1;
            $target.val(val);
        }, function(val, $target) {
            val = parseFloat(val === '' ? 0 : val);
            val -= 1;
            $target.val(val);
        });

        addkeyUpDownEvent(this.$container.find('.J_VisualCompare_ValWidth, .J_VisualCompare_ValHeight, .J_VisualCompare_ValLeft, .J_VisualCompare_ValTop'), function(val, $target) {

            if (val === '') {
                val = '100%';
            }

            if (val === '0') {
                val = '0px';
            }

            if (!/\w*\d+\w*/.test(val)) {
                return;
            }

            var partUnit = val.split(/-?\d+/g)[1];
            var partNum = val.split(partUnit)[0];

            if (partNum === '') {
                return;
            }

            partNum = parseInt(partNum);
            partNum += 1;

            $target.val(partNum + partUnit);
        }, function(val, $target) {
            if (val === '') {
                val = '100%';
            }

            if (val === '0') {
                val = '0px';
            }

            if (!/\w*\d+\w*/.test(val)) {
                return;
            }

            var partUnit = val.split(/-?\d+/g)[1];
            var partNum = val.split(partUnit)[0];

            if (partNum === '') {
                return;
            }

            partNum = parseInt(partNum);
            partNum -= 1;

            $target.val(partNum + partUnit);
        });

    }

});

module.exports = Panel;