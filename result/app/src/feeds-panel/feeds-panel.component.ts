import { IFeed, ISocket } from '../common/common'

export class FeedsPanelComponent {
    public feeds: IFeed[];
    public config: { topic: string, img: string };
    public chart: any;
    public count: number[];
    private sentimentIcons = {
        '-1': 'glyphicon-remove',
        '0': 'glyphicon-user',
        '1': 'glyphicon-ok',
    }

    constructor(private socket: ISocket) {
        let labelsList = ["Positive", "Neutral", "Negative"];
        this.count = [0, 0, 0];
        this.chart = {
            labels: labelsList,
            data: this.count,
            options: {
                yAxisMinimumInterval: 1,
                scaleStartValue: 0,
                scaleBeginAtZero: true
            },
        };
        this.feeds = [];
        socket.connect();
        socket.on('newFeed', (feed: IFeed) => {
            if (this.config.topic === feed.topic) {
                feed['sentimentIcon'] = this.sentimentIcons[feed.sentiment];
                this.feeds.unshift(feed);
                this.chart.data[feed.sentiment + 1] = feed.aggregateSentiment;
            }
        });
    }
}