///<reference path="../../../typings/angular2-meteor.d.ts" />
 
import {Component, View, Input} from 'angular2/core';
 
import {NgFor} from 'angular2/common';

import {Stocks} from 'collections/stocks';
 
import {StocksForm} from 'client/components/stock-form/stocks-form'; 
 
import {RouterLink} from 'angular2/router';

import {CookieList} from 'client/helpers/cookieList'; 

@Component({
    selector: 'stock-shares'
})
   
@View({
    templateUrl: '/client/components/stock-list/stock-shares.html',
    directives: [NgFor, StocksForm, RouterLink]
})

export class StockShares {
    @Input() stock;
    constructor() {
      this.cList = new CookieList();
      this.showSharesInput = 'on';
      this.hideSharesInput = 'off';
    }   
  

    toggle(){
       this.showSharesInput = this.showSharesInput == 'on' ? 'off': 'on';
       this.hideSharesInput = this.hideSharesInput == 'on' ? 'off': 'on';
    }

    enterShares(stock,shares){
      this.toggle();

      if(shares !== ''){
        this.stock.enterShares(shares);
        this.cList.insertShares(stock,shares);
      }
    }



}