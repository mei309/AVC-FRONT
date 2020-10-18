import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-my-pie-chart',
  template:`
  <div style="display: block;">
    <canvas baseChart
      [data]="pieChartData"
      [labels]="pieChartLabels"
      [chartType]="pieChartType"
      [options]="pieChartOptions"
      [plugins]="pieChartPlugins"
      [legend]="pieChartLegend">
    </canvas>
  </div>
  ` ,
})
export class MyPieChartComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['W320', 'wslp', 'w340'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

}
