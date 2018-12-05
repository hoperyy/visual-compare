/**
 * 视觉稿对比工具
 * @author liuyuanyang
 */

(function() {

  var localStorangeConfigName = 'visualComparePanelConfig';
  var localStorageStateName = 'visualCompareState';

  var $ = window.$;
  var myUtil = window.ChromeExtention_FeHelperUtil;

  var IS_SUPPORT_LOCALSTORAGE = myUtil.isSupportLocalStorage();
  var IMG_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAABCAYAAAAIN1RAAAAADElEQVQIW2NkIAEAAABaAAL8VAbiAAAAAElFTkSuQmCC';

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

      this.$insert.append('<img class="visual-compare-img J_VisualCompareImg" src="' + (this.config.src || IMG_PLACEHOLDER) + '" draggable="false" alt="" style="' + style + '">');

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

  /*
   * 控制面板部分
   */
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
        '<ul class="visual-compare-panel-area-ul">' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">opacity: </span><input type="text" value="' + this.config.opacity + '" class="J_VisualCompare_InputText J_VisualCompare_ValOpacity visual-compare-panel-area-input">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">z-index: </span><input type="text" value="' + this.config.zIndex + '" class="J_VisualCompare_InputText J_VisualCompare_ValZIndex visual-compare-panel-area-input">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">width: </span><input type="text" value="' + this.config.width + '" class="J_VisualCompare_InputText J_VisualCompare_ValWidth visual-compare-panel-area-input">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">height: </span><input type="text" value="' + this.config.height + '" class="J_VisualCompare_InputText J_VisualCompare_ValHeight visual-compare-panel-area-input">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">left: </span><input type="text" value="' + this.config.left + '" class="J_VisualCompare_InputText J_VisualCompare_ValLeft visual-compare-panel-area-input">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">top: </span><input type="text" value="' + this.config.top + '" class="J_VisualCompare_InputText J_VisualCompare_ValTop visual-compare-panel-area-input">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">online img: </span><input type="text"' + (this.config.src ? 'value=' + this.config.src : '') + ' class="J_VisualCompare_InputText J_VisualCompare_ValPic visual-compare-panel-area-input">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">local img: </span><input type="file" class="J_VisualCompare_ValFile visual-compare-panel-area-input-file">' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">img border: </span><span class="visual-compare-panel-area-checkbox J_VisualCompare_InputCheckbox J_VisualCompare_ValBorder' + (this.config.showBorder ? ' visual-compare-panel-area-checked' : '') +'"></span>' +
        '</li>' +
        '<li class="visual-compare-panel-area-li">' +
        '<span class="visual-compare-panel-area-label">cross line: </span><span class="visual-compare-panel-area-checkbox J_VisualCompare_InputCheckbox J_VisualCompare_ValCrossLine' + (this.config.showCrossLine ? ' visual-compare-panel-area-checked' : '') +'"></span>' +
        '</li>' +
        '</ul>' +
        '</div>' +

        '<div class="visual-compare-btn-area">' +

        '<a href="javascript:;"' + (!this.config.showPanel ? ' style="display: none;"' : '') + ' class="visual-compare-btn btn-reset J_VisualCompare_Reset">Reset</a>' +

        (this.config.showImg && this.config.src ? '<a href="javascript:;"' + (!this.config.showPanel ? ' style="display: none;"' : '') + ' class="visual-compare-btn btn-img-switcher J_VisualCompare_ImgSwither">Hide image</a>' : '<a href="javascript:;"' + (!this.config.showPanel ? ' style="display: none;"' : '') + ' class="visual-compare-btn btn-img-switcher visual-compare-is-closed J_VisualCompare_ImgSwither">Show image</a>') +

        (this.config.showPanel ? '<a href="javascript:;" class="visual-compare-btn J_VisualCompare_PanelSwitcher">Hide panel<a>' : '<a href="javascript:;" class="visual-compare-btn J_VisualCompare_PanelSwitcher visual-compare-is-closed' + '">Visual Compare</a>') +

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
        showBorder: $('.J_VisualCompare_ValBorder', this.$container).hasClass('visual-compare-panel-area-checked'),
        showCrossLine: $('.J_VisualCompare_ValCrossLine', this.$container).hasClass('visual-compare-panel-area-checked'),
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
      localStorage.removeItem(localStorangeConfigName);
      localStorage.setItem(localStorangeConfigName, JSON.stringify(config));
    },

    resetPanel: function() {

      $('.J_VisualCompare_ValOpacity', this.$container).val(0.6);
      $('.J_VisualCompare_ValWidth', this.$container).val('100%');
      $('.J_VisualCompare_ValHeight', this.$container).val('auto');
      $('.J_VisualCompare_ValZIndex', this.$container).val(1);
      $('.J_VisualCompare_ValLeft', this.$container).val(0);
      $('.J_VisualCompare_ValTop', this.$container).val(0);
      $('.J_VisualCompare_ValBorder', this.$container).removeClass('visual-compare-panel-area-checked');
      $('.J_VisualCompare_ValCrossLine', this.$container).removeClass('visual-compare-panel-area-checked');

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
        if ($target.hasClass('visual-compare-panel-area-checked')) {
          $target.removeClass('visual-compare-panel-area-checked');
        } else {
          $target.addClass('visual-compare-panel-area-checked');
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

      this.$container.find('.J_VisualCompare_ValFile').on('change', function(e){

        var file = e.target.files[0]; //获取图片资源

        // 只选择图片文件
        if (!file.type.match('image.*')) {
          return false;
        }

        var reader = new FileReader();

        reader.readAsDataURL(file); // 读取文件

        // 渲染文件
        reader.onload = function(arg) {
          self.$container.find('.J_VisualCompare_ValPic').val(arg.target.result);
          self.$img.attr('src', arg.target.result);
        }

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
          $target.removeClass('visual-compare-is-closed').text('Hide panel');
        } else {

          // 展开状态
          self.$panelArea.hide();
          self.$container.find('.J_VisualCompare_ImgSwither').hide();
          self.$container.find('.J_VisualCompare_Reset').hide();
          $target.addClass('visual-compare-is-closed').text('Visual Compare');
        }

      });

      this.$container.find('.J_VisualCompare_ImgSwither').on('click touchstart', function(ev) {
        var $target = $(ev.currentTarget);

        if ($target.hasClass('visual-compare-is-closed')) { // 关闭状态
          self.$img.show();
          $target.removeClass('visual-compare-is-closed').text('Hide image');
        } else {
          // 展开状态
          self.$img.hide();
          $target.addClass('visual-compare-is-closed').text('Show image');
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


  /*
   * 入口
   */

  function VisualCompare(userConfig) {

    // localstorage 优先级最高
    userConfig = $.extend(userConfig || {}, JSON.parse(localStorage.getItem(localStorangeConfigName)) || {});

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

    }, userConfig);

    this.init();
  }

  $.extend(VisualCompare.prototype, {

    init: function() {
      myUtil.addCss(chrome.extension.getURL('mod/visual-compare/index.css'), 'visual-compare-css');

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

      myUtil.removeCss('#visual-compare-css');

      window.localStorage.setItem(localStorageStateName, 'off');
    }

  });

  // 初始化
  if (IS_SUPPORT_LOCALSTORAGE) {

    var instance = null;
    var currentState = window.localStorage.getItem(localStorageStateName);
    if (currentState && currentState === 'on') {
        instance = new VisualCompare();
    }

    // 监听插件页面发来的消息
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      if (request.action === 'get-visual-compare-state') {
          sendResponse({
            state: window.localStorage.getItem(localStorageStateName)
          });
      }

      if (request.action === 'set-visual-compare-state') {

          // 同步到 localStorage
          window.localStorage.setItem(localStorageStateName, request.targetState);
          sendResponse({
            msg: 'success'
          });

          if (request.targetState === 'on') {
              instance = new VisualCompare();
          }

          if (request.targetState === 'off') {
              instance && (instance.destory());
          }
      }

    });

  } else {
    // 监听插件页面发来的消息
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      if (request.action === 'get-visual-compare-state') {
          sendResponse({
            state: 'undefined'
          });
      }

      if (request.action === 'set-visual-compare-state') {}

    });
  }


})();
