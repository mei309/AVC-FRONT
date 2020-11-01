import { Component, OnInit } from '@angular/core';
import { multi } from './data';

@Component({
  selector: 'app-my-bar-chart',
  template:`
  <ngx-charts-bar-vertical-2d
    [view]="view"
    [scheme]="colorScheme"
    [results]="multi"
    [gradient]="gradient"
    [xAxis]="showXAxis"
    [yAxis]="showYAxis"
    [legend]="showLegend"
    [showXAxisLabel]="showXAxisLabel"
    [showYAxisLabel]="showYAxisLabel"
    [xAxisLabel]="xAxisLabel"
    [yAxisLabel]="yAxisLabel"
    [legendTitle]="legendTitle"
    (select)="onSelect($event)"
    (activate)="onActivate($event)"
    (deactivate)="onDeactivate($event)">
    </ngx-charts-bar-vertical-2d>
  ` ,
})
export class MyBarChartComponent  {
    multi: any[];
    view: any[] = [700, 400];
  
    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = true;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Country';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = 'Population';
    legendTitle: string = 'Years';
  
    colorScheme = {
      domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    };
  
    constructor() {
      Object.assign(this, { multi })
    }
  
   onSelect(data): void {
      console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }
  
    onActivate(data): void {
      console.log('Activate', JSON.parse(JSON.stringify(data)));
    }
  
    onDeactivate(data): void {
      console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

}
