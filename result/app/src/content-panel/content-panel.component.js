"use strict";
var IEvent_1 = require('../common/IEvent');
var ContentPanelComponent = (function () {
    function ContentPanelComponent($http, socket) {
        var _this = this;
        this.$http = $http;
        this.socket = socket;
        this.$http.get('/topics').then(function (resolve) {
            _this.configs = resolve.data;
        });
        this.onYMaxNumberChange = new IEvent_1.Event();
    }
    return ContentPanelComponent;
}());
exports.ContentPanelComponent = ContentPanelComponent;
;
