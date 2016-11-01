"use strict";
var FeedsPanelComponent = (function () {
    function FeedsPanelComponent(socket) {
        var _this = this;
        this.socket = socket;
        this.sentimentIcons = {
            '-1': 'glyphicon-remove',
            '0': 'glyphicon-user',
            '1': 'glyphicon-ok'
        };
        var labelsList = ["Positive", "Neutral", "Negative"];
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
                feed['sentimentIcon'] = _this.sentimentIcons[feed.sentiment];
                _this.feeds.unshift(feed);
                _this.chart.data[feed.sentiment + 1] = feed.aggregateSentiment;
            }
        });
    }
    return FeedsPanelComponent;
}());
exports.FeedsPanelComponent = FeedsPanelComponent;
