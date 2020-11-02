import { Component, Input, OnInit } from '@angular/core';
// import { multi } from './data';

@Component({
  selector: 'app-my-line-chart',
  template:`
  <ngx-charts-area-chart-stacked
    [view]="view"
    [scheme]="colorScheme"
    [legend]="legend"
    [showXAxisLabel]="showXAxisLabel"
    [showYAxisLabel]="showYAxisLabel"
    [xAxis]="xAxis"
    [yAxis]="yAxis"
    [xAxisLabel]="xAxisLabel"
    [yAxisLabel]="yAxisLabel"
    [timeline]="timeline"
    [results]="multi"
    (select)="onSelect($event)">
  </ngx-charts-area-chart-stacked>
  ` ,
})
export class MyLineChartComponent {
  @Input() multi: any[];
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Process';
  yAxisLabel: string = 'Weight';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    // Object.assign(this, { multi });
  }

  onSelect(event) {
    console.log(event);
  }
}
