/**
 * FeHelper弹出（下拉）页面
 * @author liuyuanyang
 */
$(function () {
    // 获取后台页面，返回window对象
    var STATE_ON_TEXT = 'on';
    var STATE_OFF_TEXT = 'off';
    var STATE_UNDEFINED = 'localStorage unavailable';

    function Page() {
        this.initPage();
        this.addEvent();
    }

    $.extend(Page.prototype, {

        initPage: function() {
            this.initPageHandlers['visualCompare'].call(this);
        },

        initPageHandlers: {
            visualCompare: function() {

                // 从 localStorage 获取状态
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'get-visual-compare-state'
                    }, function(response) {

                        var $target = jQuery('.J_FeFunctionList').find('.J_VisualCompare');

                        if (!response) {
                          $target.find('.J_State').text('not available');
                          return;
                        }

                        var state = response.state;

                        if (!state || state == 'off') {
                            $target.find('.J_State').text(STATE_OFF_TEXT);
                        }

                        if (state == 'on') {
                            $target.find('.J_State').text(STATE_ON_TEXT);
                        }

                        if (state == 'undefined') {
                            $target.find('.J_State').text(STATE_UNDEFINED);
                        }

                    });
                });

            }
        },

        addEvent: function() {
            var _this = this;

            // 菜单点击以后执行的动作
            jQuery('.J_FeFunctionList li').click(function (e) {
                var msgType = $(this).attr('data-msgtype');

                _this.eventHandlers[msgType].apply(this, [e]);

                // window.close();
            });
        },

        eventHandlers: {
            visualCompare: function() {

                var $target = $(this);
                var $state = $target.find('.J_State');
                var currentState = $state.text();

                if (currentState !== 'on' && currentState !== 'off') {
                    return;
                }

                if (currentState == 'off') {
                    $state.text(STATE_ON_TEXT);
                }

                if (currentState == 'on') {
                    $state.text(STATE_OFF_TEXT);
                }

                // 同步到 localstorage
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'set-visual-compare-state',
                        targetState: currentState === 'on' ? 'off' : 'on'
                    }, function(response) {
                        console.log('设置 localstorage 结果: ', response.msg);
                    });
                });
            }
        }
    });

    new Page();

});
