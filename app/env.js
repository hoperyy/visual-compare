
var isLsSupported = (function() {
    try {
        window.localStorage.setItem('visualCompare_testLs', '1');
        window.localStorage.getItem('visualCompare_testLs');
        window.localStorage.removeItem('visualCompare_testLs');
        return true;
    }
    catch (err) {
        return false;
    }
})();


module.exports = {

    localStorage: {
        isSupported: isLsSupported,
        configName: 'visualComparePanelConfig'
    },

    imgPlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAABCAYAAAAIN1RAAAAADElEQVQIW2NkIAEAAABaAAL8VAbiAAAAAElFTkSuQmCC'

};