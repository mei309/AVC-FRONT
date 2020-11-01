import { Component, OnInit } from '@angular/core';
import { bubbleData } from './data';

@Component({
  selector: 'app-my-bubble-chart',
  template:`
  <ngx-charts-bubble-chart
    [view]="view"
    [scheme]="colorScheme"
    [results]="bubbleData"
    [xAxis]="showXAxis"
    [yAxis]="showYAxis"
    [legend]="showLegend"
    [showXAxisLabel]="showXAxisLabel"
    [showYAxisLabel]="showYAxisLabel"
    [xAxisLabel]="xAxisLabel"
    [yAxisLabel]="yAxisLabel"
    [xScaleMin]="xScaleMin"
    [xScaleMax]="xScaleMax"
    [yScaleMin]="yScaleMin"
    [yScaleMax]="yScaleMax"
    [minRadius]="minRadius"
    [maxRadius]="maxRadius"
    (select)="onSelect($event)"
    (activate)="onActivate($event)"
    (deactivate)="onDeactivate($event)">
    </ngx-charts-bubble-chart>
  ` ,
  
})
export class MyBubbleChartComponent {
    bubbleData: any[];
    view: any[] = [700, 400];
  
    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    yAxisLabel: string = 'Population';
    showYAxisLabel: boolean = true;
    xAxisLabel: string = 'Years';
    maxRadius: number = 20;
    minRadius: number = 5;
    xScaleMin: number = 70;
    xScaleMax: number = 85;
    yScaleMin: number = 70;
    yScaleMax: number = 85;
  
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
  
    constructor() {
      Object.assign(this, { bubbleData });
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
