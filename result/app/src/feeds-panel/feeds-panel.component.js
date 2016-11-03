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
    //TODO - find a nicer algorithm for this 
    FeedsPanelComponent.prototype.calcNewMax = function (n) {
        var numAsString = n.toString();
        var newMax = 1;
        for (var i = 0; i < numAsString.length; ++i) {
            newMax *= 10;
        }
        return newMax;
    };
    ;
    return FeedsPanelComponent;
}());
exports.FeedsPanelComponent = FeedsPanelComponent;
