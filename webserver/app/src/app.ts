/// <reference path="../typings/index.d.ts" />

var appName = "TweetAnalyzer";
var app = angular.module(appName, ['chart.js', 'btford.socket-io']);

var appComponent = () => {

}

interface ISocket {
    on(eventName: string, callback: (data: any) => void): any;
    connect(): void;

}

interface IFeed {
    id: number
    text: string,
    topic: string,
    sentiment: string,
    aggregateSentiment: number;
};

app.factory('socket', (socketFactory) => {
    return socketFactory();
});

class AppComponent {
    public title = "Tweeter Analyzer";
};

class ContentPanelComponent {
    public topics = ['trump', 'clinton'];
    public configs: {}
    constructor(private $http: ng.IHttpService) {

        this.$http.get('/topics').then(
            (resolve) => {
                this.configs = resolve.data;
                console.log(resolve);
            }
        )
    }
};

class FeedsPanelComponent {
    public feeds: IFeed[];
    public config: { topic: string, img: string };
    public chart: any;
    public count: number[];

    constructor(private socket: ISocket) {
        let labelsList = ["Negative", "Neutral", "Positive"];
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
        socket.on('newFeed', (feed: IFeed) => {
            if (this.config.topic === feed.topic) {
                this.feeds.unshift(feed);
                // console.log("feed added");
                ++this.chart.data[feed.aggregateSentiment + 1];
            }
        });
    }

    private countVotes() {

    }

};


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