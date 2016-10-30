/// <reference path="../typings/index.d.ts" />
var appName = "TweetAnalyzer";
var app = angular.module(appName, ['chart.js', 'btford.socket-io']);
var appComponent = function () {
};
;
app.factory('socket', function (socketFactory) {
    return socketFactory();
});
var AppComponent = (function () {
    function AppComponent() {
        this.title = "Tweeter Analyzer";
    }
    return AppComponent;
}());
;
var ContentPanelComponent = (function () {
    function ContentPanelComponent($http) {
        var _this = this;
        this.$http = $http;
        this.topics = ['trump', 'clinton'];
        this.$http.get('/topics').then(function (resolve) {
            _this.configs = resolve.data;
            console.log(resolve);
        });
    }
    return ContentPanelComponent;
}());
;
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
            }
        };
        this.feeds = [];
        socket.connect();
        socket.on('newFeed', function (feed) {
            if (_this.config.topic === feed.topic) {
                _this.feeds.unshift(feed);
                // console.log("feed added");
                ++_this.chart.data[feed.aggregateSentiment + 1];
            }
        });
    }
    FeedsPanelComponent.prototype.countVotes = function () {
    };
    return FeedsPanelComponent;
}());
;
angular.module(appName)
    .component('appComponent', {
    templateUrl: 'src/app-component/app.component.html',
    controller: AppComponent,
})
    .component('contentPanelComponent', {
    templateUrl: 'src/content-panel/content-panel.component.html',
    controller: ContentPanelComponent,
})
    .component('feedsPanelComponent', {
    templateUrl: 'src/feeds-panel/feeds-panel.component.html',
    controller: FeedsPanelComponent,
    bindings: {
        config: "<",
    }
});
