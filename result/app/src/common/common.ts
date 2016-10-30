
export interface ISocket {
    on(eventName: string, callback: (data: any) => void): any;
    connect(): void;

}


export interface IFeed {
    id: number
    text: string,
    topic: string,
    sentiment: string,
    aggregateSentiment: number;
}


export interface IConfig {
    topic: string;
    img: string;
}