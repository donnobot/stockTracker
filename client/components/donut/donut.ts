/// <reference path="../../../typings/angular2-meteor.d.ts" />
 
import {Component, View} from 'angular2/core';
 
import {RouteParams} from 'angular2/router';

import {Stocks} from 'collections/stocks';
import {StockService} from 'client/services/stock-service';

import {RouterLink} from 'angular2/router';

declare var d3: any;

@Component({
  selector: 'donut'
})

@View({
  templateUrl: '/client/components/donut/donut.html',
  directives: [RouterLink]
})

export class Donut {

    //constructor(public tickers: TickerService) {
    constructor(public stockService:StockService) {        
    /////////////////
    var Donut3D={};
    
    function pieTop(d, rx, ry, ir ){
        if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
        var sx = rx*Math.cos(d.startAngle),
        sy = ry*Math.sin(d.startAngle),
        ex = rx*Math.cos(d.endAngle),
        ey = ry*Math.sin(d.endAngle);
        
        var ret =[];
        ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
        ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
        return ret.join(" ");
    }

    function pieOuter(d, rx, ry, h ){
        var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
        
        var sx = rx*Math.cos(startAngle),
        sy = ry*Math.sin(startAngle),
        ex = rx*Math.cos(endAngle),
        ey = ry*Math.sin(endAngle);
        
        var ret =[];
        ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
        return ret.join(" ");
    }

    function pieInner(d, rx, ry, h, ir ){
        var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
        
        var sx = ir*rx*Math.cos(startAngle),
        sy = ir*ry*Math.sin(startAngle),
        ex = ir*rx*Math.cos(endAngle),
        ey = ir*ry*Math.sin(endAngle);

        var ret =[];
        ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
        return ret.join(" ");
    }

    function getPercent(d){
        return (d.endAngle-d.startAngle > 0.2 ? 
            Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
    } 
    
    Donut3D.transition = function(id, data, rx, ry, h, ir){
        function arcTweenInner(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return pieInner(i(t), rx+0.5, ry+0.5, h, ir);  };
        }
        function arcTweenTop(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return pieTop(i(t), rx, ry, ir);  };
        }
        function arcTweenOuter(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return pieOuter(i(t), rx-.5, ry-.5, h);  };
        }
        function textTweenX(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return 0.6*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle));  };
        }
        function textTweenY(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return 0.6*rx*Math.sin(0.5*(i(t).startAngle+i(t).endAngle));  };
        }
        
        var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
        
        d3.select("#"+id).selectAll(".innerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenInner); 
        
        d3.select("#"+id).selectAll(".topSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenTop); 
        
        d3.select("#"+id).selectAll(".outerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenOuter);  
        
        d3.select("#"+id).selectAll(".percent").data(_data).transition().duration(750)
        .attrTween("x",textTweenX).attrTween("y",textTweenY).text(getPercent);  
    }
    
    Donut3D.draw=function(id, data, x /*center x*/, y/*center y*/, 
        rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/){
    
        var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
        
        var slices = d3.select("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
        .attr("class", "slices");
        
        slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
        .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
        .attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
        .each(function(d){this._current=d;});
        
        slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
        .style("fill", function(d) { return d.data.color; })
        .style("stroke", function(d) { return d.data.color; })
        .attr("d",function(d){ return pieTop(d, rx, ry, ir);})
        .each(function(d){this._current=d;});
        
        slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
        .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
        .attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
        .each(function(d){this._current=d;});

        slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
        .attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
        .attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
        .text(function(d){return d.data.label});      
    }  
    /////////////////

   /* var cList = new CookieList();
        var cListArr = cList.stockListGrab();
console.log(StockCollection.sList,"sList")
        StockCollection.getStockData();
        this.stocks = Stocks.find();
       
        stockService.stocks
        var itemData = [];*/

          let c = 0;
          setInterval(() => {
            let stocks = stockService.stocks;
            //console.log(stocks.length,c,"donut")  
            process(stockService.stocks);
            c++;
          },1000);  
      
       function process(){
          let stocks = stockService.stocks;
          let itemDataArr = [];          
          stocks.forEach(function(s){
             let tempObj = {label:s.ticker, color:s.rgb, value: s.current};
             itemDataArr.push(tempObj);
          })
         
          var svg = d3.select("donut").append("svg").attr("width",700).attr("height",300);

          svg.append("g").attr("id","salesDonut");
          svg.append("g").attr("id","quotesDonut");

          Donut3D.draw("salesDonut", randomData(), 150, 150, 130, 100, 30, 0.4);

          function changeData(){
          Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
          }

          function randomData(){
              return itemDataArr.map(function(d){ 
                  return {label:d.label, value:d.value, color:d.color};
              });
          }
        
       }
   
    }
    saveStock(stock) {

    }    
}


