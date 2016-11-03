"use strict";
/// <reference path="../../typings/index.d.ts" />
var CancelEventArgs = (function () {
    function CancelEventArgs() {
        this.cancel = false;
    }
    return CancelEventArgs;
}());
exports.CancelEventArgs = CancelEventArgs;
var EventArgs = (function () {
    function EventArgs(data) {
        this.data = data;
    }
    return EventArgs;
}());
exports.EventArgs = EventArgs;
var Event = (function () {
    function Event() {
        this.handlers = [];
    }
    Event.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    Event.prototype.remove = function (handler) {
        var index = this.handlers.indexOf(handler);
        if (index >= 0) {
            this.handlers.splice(index, 1);
        }
    };
    Event.prototype.fire = function (args) {
        this.handlers.forEach(function (h) { return h(args); });
    };
    return Event;
}());
exports.Event = Event;
var AngularHelper = (function () {
    function AngularHelper() {
    }
    AngularHelper.safeApply = function (scope, action) {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            action();
        }
        else {
            scope.$apply(action);
        }
    };
    return AngularHelper;
}());
exports.AngularHelper = AngularHelper;
