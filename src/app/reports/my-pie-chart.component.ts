import { Component } from '@angular/core';
import { single } from './data';

@Component({
  selector: 'app-my-pie-chart',
  template:`
    <ngx-charts-pie-chart
      [view]="view"
      [scheme]="colorScheme"
      [results]="single"
      [gradient]="gradient"
      [legend]="showLegend"
      [legendPosition]="legendPosition"
      [labels]="showLabels"
      [doughnut]="isDoughnut"
      (select)="onSelect($event)"
      (activate)="onActivate($event)"
      (deactivate)="onDeactivate($event)"
      >
    </ngx-charts-pie-chart>
  ` ,
})
export class MyPieChartComponent {

  // public pieChartOptions: ChartOptions = {
  //   responsive: true,
  // };
  // public pieChartLabels: Label[] = ['W320', 'wslp', 'w340'];
  // public pieChartData: SingleDataSet = [300, 500, 100];
  // public pieChartType: ChartType = 'pie';
  // public pieChartLegend = true;
  // public pieChartPlugins = [];

  // constructor() { }
  // <div style="display: block;">
  //   <canvas baseChart
  //     [data]="pieChartData"
  //     [labels]="pieChartLabels"
  //     [chartType]="pieChartType"
  //     [options]="pieChartOptions"
  //     [plugins]="pieChartPlugins"
  //     [legend]="pieChartLegend">
  //   </canvas>
  // </div>


  single: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
      {
      "name": "UK",
      "value": 6200000
    }
  ];
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    Object.assign(this, { single });
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
