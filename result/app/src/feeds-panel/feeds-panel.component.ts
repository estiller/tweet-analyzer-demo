import { IFeed, ISocket } from '../common/common'

export class FeedsPanelComponent {
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
                scaleStartValue: 0,
                scaleBeginAtZero : true
            }
        };
        this.feeds = [];
        socket.connect();
        socket.on('newFeed', (feed: IFeed) => {
            if (this.config.topic === feed.topic) {
                this.feeds.unshift(feed);
                // console.log("feed added");
                this.chart.data[feed.sentiment + 1] = feed.aggregateSentiment;
            }
        });
    }
}