import { IFeed, ISocket } from '../common/common'
import { Event } from '../common/IEvent';

export class FeedsPanelComponent {
    public feeds: IFeed[];
    public config: { topic: string, img: string, maxYValue: number };
    public chart: any;
    public count: number[];
    private maxValue: number;
    public yEvent: Event<{ n: number }>;
    private sentimentIcons = {
        '-1': 'glyphicon-remove',
        '0': 'glyphicon-user',
        '1': 'glyphicon-ok',
    }

    constructor(private socket: ISocket, private $rootScope: ng.IRootScopeService) {
        this.maxValue = 0;
        let labelsList = ["Positive", "Neutral", "Negative"];
        this.count = [0, 0, 0];
        this.chart = {
            labels: labelsList,
            data: this.count,
            options: {
                scales: {
                    beginAtZero: true,
                    yAxes: [{
                        ticks: {
                            min: 0,
                        }
                    }]
                }
            }
        };


        this.yEvent.add((args) => {
            let newMax = this.calcNewMax(args.n);
            this.chart.options.scales.yAxes[0].ticks.max = newMax;
            this.maxValue = newMax;

        });


        this.feeds = [];
        socket.connect();
        socket.on('newFeed', (feed: IFeed) => {
            if (this.config.topic === feed.topic) {
                feed['sentimentIcon'] = this.sentimentIcons[feed.sentiment];
                this.feeds.unshift(feed);
                var sentiment = parseInt(feed.sentiment) * -1;
                this.chart.data[sentiment + 1] = feed.aggregateSentiment;
                if (this.feeds.length > 100) {
                    this.feeds = this.feeds.splice(0, this.feeds.length / 2);
                }
                if (this.maxValue < feed.aggregateSentiment) {
                    this.yEvent.fire({ n: feed.aggregateSentiment });
                }
            }
        });
    }

    private calcNewMax(n: number): number {
        var numAsString = n.toString();
        var scale = Math.pow(10, numAsString.length-1);
        return Math.ceil((n / scale)) * scale;
    };
}