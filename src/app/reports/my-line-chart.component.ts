import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-my-line-chart',
  template:`
  <div style="display: block;">
    <canvas baseChart width="400" height="400"
      [datasets]="lineChartData"
      [labels]="lineChartLabels"
      [options]="lineChartOptions"
      [colors]="lineChartColors"
      [legend]="lineChartLegend"
      [chartType]="lineChartType"
      [plugins]="lineChartPlugins">
    </canvas>
  </div>
  ` ,
})
export class MyLineChartComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55], label: 'This #PO' },
    { data: [28, 48, 40, 19, 86, 27], label: 'Avrage all' }
  ];
  public lineChartLabels: Label[] = ['order', 'reciving', 'fork(cleaning)', 'cleand', 'roasted', 'packed'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

}
