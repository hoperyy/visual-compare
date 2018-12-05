/**
 * @author 刘远洋
 * @class 工具类
 */

var ChromeExtention_FeHelperUtil = {
    addCss: function(address, id) {
        $('<link href="' + address + '" id="' + id + '" rel="stylesheet" type="text/css" />').appendTo('head');
    },
    removeCss: function(id) {
      $('head').find(id).remove();
    },
    isSupportLocalStorage: function() {
      try {
        window.localStorage.setItem('ChromeExtention_FeHelper_testLs', '1');
        window.localStorage.getItem('ChromeExtention_FeHelper_testLs');
        window.localStorage.removeItem('ChromeExtention_FeHelper_testLs');
        return true;
      }
      catch (err) {
        return false;
      }
    }
};
