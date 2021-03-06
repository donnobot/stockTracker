/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgZone, provide} from 'angular2/core';

import {NgFor} from 'angular2/common';

import {bootstrap} from 'angular2-meteor';

import {Stocks} from 'collections/stocks';

import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';
 
import {PageLayout} from 'client/components/page-layout/page-layout';
  
import {StockDetails} from 'client/components/stock-details/stock-details';

import {CookieService} from 'client/services/cookie-service';
import {StockService} from 'client/services/stock-service';
import {RgbService} from 'client/services/rgb-service';


@Component({
  selector: 'app',
  viewProviders: [],
})

@View({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/', as: 'PageLayout', component: PageLayout},
    { path: '/stock/:stockId', as: 'StockDetails', component: StockDetails }
])

class Socially {
  constructor (){
  }
}

bootstrap(Socially, [ROUTER_PROVIDERS, CookieService, StockService, RgbService, provide(APP_BASE_HREF, { useValue: '/' })]);
