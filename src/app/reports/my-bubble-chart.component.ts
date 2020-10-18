import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-my-bubble-chart',
  template:`
  <div style="display: block;">
    <canvas baseChart
      [datasets]="bubbleChartData"
      [options]="bubbleChartOptions"
      [legend]="bubbleChartLegend"
      [chartType]="bubbleChartType">
    </canvas>
  </div>
  ` ,
  
})
export class MyBubbleChartComponent implements OnInit {

  processes = [
    'cleaning', 'roasting', 'packing', 'loading'
  ]

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          max: 3,
          callback: value => this.processes[value]
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 30,
        }
      }]
    }
  };
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = true;

  public bubbleChartData: ChartDataSets[] = [
    {
      data: [
        { x: 1, y: 10, r: 10 },
        { x: 2, y: 5, r: 15 },
        { x: 2, y: 12, r: 23 },
        { x: 3, y: 8, r: 8 },
      ],
      label: 'Series A',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
