var $ = require('jquery');
var Index = require('./index/index');

if ($('body').length) {
    new Index();
} else {
    $(function() {
        new Index();
    });
}

module.exports = Index;