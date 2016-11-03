/// <reference path="../typings/index.d.ts" />

import { AppComponent } from './app-component/app.component';
import { ContentPanelComponent } from './content-panel/content-panel.component';
import { FeedsPanelComponent } from './feeds-panel/feeds-panel.component';

var appName = "TweetAnalyzer";
var app = angular.module(appName, ['chart.js', 'btford.socket-io']);

app.factory('socket', (socketFactory) => {
    return socketFactory();
})
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
            yEvent:"=",
        }
    }); 