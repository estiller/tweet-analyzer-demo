"use strict";
var ContentPanelComponent = (function () {
    function ContentPanelComponent($http) {
        var _this = this;
        this.$http = $http;
        this.$http.get('/topics').then(function (resolve) {
            _this.configs = resolve.data;
            console.log(resolve);
        });
    }
    return ContentPanelComponent;
}());
exports.ContentPanelComponent = ContentPanelComponent;
;
