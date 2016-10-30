/// <reference path="../../typings/index.d.ts" />
import { IConfig } from '../common/common';

export class ContentPanelComponent {
    public configs :IConfig[] ;
    constructor(private $http: ng.IHttpService) {

        this.$http.get('/topics').then(
            (resolve:{data:IConfig[]}) => {
                this.configs = resolve.data;
                console.log(resolve);
            }
        )
    }
};