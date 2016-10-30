"use strict";
var ContentPanelComponent = (function () {
    function ContentPanelComponent($http) {
        var _this = this;
        this.$http = $http;
        this.$http.get('/topics').then(function (resolve) {
            _this.configs = resolve.data;
            var numOfColumns = _this.configs && _this.configs.length;
        });
    }
    return ContentPanelComponent;
}());
exports.ContentPanelComponent = ContentPanelComponent;
;
