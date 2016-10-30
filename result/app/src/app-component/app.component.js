"use strict";
var AppComponent = (function () {
    function AppComponent($http) {
        var _this = this;
        this.$http = $http;
        this.title = "Tweeter Analyzer";
        $http.get('/hostName').then(function (resolve) {
            _this.hostName = resolve.data;
        }, function (Error) {
            _this.hostName = 'undefined';
        });
    }
    return AppComponent;
}());
exports.AppComponent = AppComponent;
;
