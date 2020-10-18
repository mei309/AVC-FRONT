import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-my-bar-chart',
  template:`
  <div style="display: block;">
    <canvas baseChart
      [datasets]="barChartData"
      [labels]="barChartLabels"
      [options]="barChartOptions"
      [plugins]="barChartPlugins"
      [legend]="barChartLegend"
      [chartType]="barChartType">
    </canvas>
  </div>
  ` ,
})
export class MyBarChartComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['order', 'reciving', 'cleaning', 'roasting', 'packing', 'loading'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55], label: 'This #PO' },
    { data: [28, 48, 40, 19, 86, 27], label: 'Avrage all' },
    { data: [43, 48, 40, 45, 67, 37], label: 'Offical max' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
