/// <reference path="../../typings/index.d.ts" />
import { IConfig, ISocket } from '../common/common';
import { IEvent, Event } from '../common/IEvent'


export class ContentPanelComponent {
    public configs: IConfig[];
    public onYMaxNumberChange: Event<{ n: number }>;

    constructor(private $http: ng.IHttpService, private socket: ISocket) {
        this.$http.get('/topics').then(
            (resolve: { data: IConfig[] }) => {
                this.configs = resolve.data;
            });
            this.onYMaxNumberChange = new Event<{n:number}>();

    }
};