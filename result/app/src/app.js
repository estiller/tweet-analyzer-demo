/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../typings/index.d.ts" />
	"use strict";
	var app_component_1 = __webpack_require__(1);
	var content_panel_component_1 = __webpack_require__(2);
	var feeds_panel_component_1 = __webpack_require__(4);
	var appName = "TweetAnalyzer";
	var app = angular.module(appName, ['chart.js', 'btford.socket-io']);
	app.factory('socket', function (socketFactory) {
	    return socketFactory();
	})
	    .component('appComponent', {
	    templateUrl: 'src/app-component/app.component.html',
	    controller: app_component_1.AppComponent
	})
	    .component('contentPanelComponent', {
	    templateUrl: 'src/content-panel/content-panel.component.html',
	    controller: content_panel_component_1.ContentPanelComponent
	})
	    .component('feedsPanelComponent', {
	    templateUrl: 'src/feeds-panel/feeds-panel.component.html',
	    controller: feeds_panel_component_1.FeedsPanelComponent,
	    bindings: {
	        config: "<",
	        yEvent: "="
	    }
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var IEvent_1 = __webpack_require__(3);
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var FeedsPanelComponent = (function () {
	    function FeedsPanelComponent(socket, $rootScope) {
	        var _this = this;
	        this.socket = socket;
	        this.$rootScope = $rootScope;
	        this.sentimentIcons = {
	            '-1': 'glyphicon-remove',
	            '0': 'glyphicon-user',
	            '1': 'glyphicon-ok'
	        };
	        this.maxValue = 0;
	        var labelsList = ["Positive", "Neutral", "Negative"];
	        this.count = [0, 0, 0];
	        this.chart = {
	            labels: labelsList,
	            data: this.count,
	            options: {
	                scales: {
	                    beginAtZero: true,
	                    yAxes: [{
	                            ticks: {
	                                min: 0
	                            }
	                        }]
	                }
	            }
	        };
	        this.yEvent.add(function (args) {
	            var newMax = _this.calcNewMax(args.n);
	            _this.chart.options.scales.yAxes[0].ticks.max = newMax;
	            _this.maxValue = newMax;
	        });
	        this.feeds = [];
	        socket.connect();
	        socket.on('newFeed', function (feed) {
	            if (_this.config.topic === feed.topic) {
	                feed['sentimentIcon'] = _this.sentimentIcons[feed.sentiment];
	                _this.feeds.unshift(feed);
	                var sentiment = parseInt(feed.sentiment) * -1;
	                _this.chart.data[sentiment + 1] = feed.aggregateSentiment;
	                if (_this.feeds.length > 100) {
	                    _this.feeds = _this.feeds.splice(0, _this.feeds.length / 2);
	                }
	                if (_this.maxValue < feed.aggregateSentiment) {
	                    _this.yEvent.fire({ n: feed.aggregateSentiment });
	                }
	            }
	        });
	    }
	    FeedsPanelComponent.prototype.calcNewMax = function (n) {
	        var numAsString = n.toString();
	        var scale = Math.pow(10, numAsString.length - 1);
	        return Math.ceil((n / scale)) * scale;
	    };
	    ;
	    return FeedsPanelComponent;
	}());
	exports.FeedsPanelComponent = FeedsPanelComponent;


/***/ }
/******/ ]);