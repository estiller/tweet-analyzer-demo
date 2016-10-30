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
	var feeds_panel_component_1 = __webpack_require__(3);
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
	        config: "<"
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
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var FeedsPanelComponent = (function () {
	    function FeedsPanelComponent(socket) {
	        var _this = this;
	        this.socket = socket;
	        var labelsList = ["Negative", "Neutral", "Positive"];
	        this.count = [0, 0, 0];
	        this.chart = {
	            labels: labelsList,
	            data: this.count,
	            options: {
	                yAxisMinimumInterval: 1,
	                scaleStartValue: 0,
	                scaleBeginAtZero: true
	            }
	        };
	        this.feeds = [];
	        socket.connect();
	        socket.on('newFeed', function (feed) {
	            if (_this.config.topic === feed.topic) {
	                _this.feeds.unshift(feed);
	                // console.log("feed added");
	                _this.chart.data[feed.sentiment + 1] = feed.aggregateSentiment;
	            }
	        });
	    }
	    return FeedsPanelComponent;
	}());
	exports.FeedsPanelComponent = FeedsPanelComponent;


/***/ }
/******/ ]);