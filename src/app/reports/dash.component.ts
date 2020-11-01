import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dash-board',
  template:`
  <div *ngIf="graphNodes.length" class="grid-container">
    <h1 class="mat-h1">Dashboard</h1>
    <mat-grid-list cols="1" rowHeight="350px">
      <mat-grid-tile *ngFor="let card of cards | async" [colspan]="card.cols" [rowspan]="card.rows">
        <mat-card class="dashboard-card" style="display: block;">
          <mat-card-header>
            <mat-card-title>
              {{card.title}}
              <button mat-icon-button class="more-button" [matMenuTriggerFor]="menu" aria-label="Toggle menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu" xPosition="before">
                <button mat-menu-item>Expand</button>
                <button mat-menu-item>Remove</button>
              </mat-menu>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="dashboard-card-content">
            <ng-container [ngSwitch]="card.graph">
              <app-my-bar-chart *ngSwitchCase="'bar'"></app-my-bar-chart>
              <app-my-bubble-chart *ngSwitchCase="'bubble'"></app-my-bubble-chart>
              <app-my-line-chart *ngSwitchCase="'line'" [multi]="graphNodes"></app-my-line-chart>
              <app-my-pie-chart *ngSwitchCase="'pie'"></app-my-pie-chart>
            </ng-container>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>
  </div>
  ` ,
  styleUrls: ['./dash.component.css']
})
export class DashComponent {

  
  @Input() set finalReport(value) {
    if(value) {
      this.preperGraph(value)
    }
  }

  graphNodes = [];

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          // { title: 'QC over time', graph: 'bar'},
          // { title: 'Working time', graph: 'bubble'},
          { title: 'Net weight over process', graph: 'line'},
          // { title: 'Out product', graph: 'pie'}
        ];
      }

      return [
        // { title: 'QC over time', cols: 1, rows: 1, graph: 'bar'},
        // { title: 'Working time', cols: 1, rows: 1, graph: 'bubble'},
        { title: 'Net weight over process', cols: 1, rows: 2, graph: 'line'},
        // { title: 'Out product', cols: 1, rows: 1, graph: 'pie'}
      ];
    })
  );

  findItem(firstItem: string, secondItem: string) : boolean{
    if(firstItem === 'DW' || firstItem === 'WS') {
      return secondItem.startsWith(firstItem.substr(0, 2));
    } else {
      return secondItem.startsWith(firstItem.substr(0, 3));
    }
  }
  preperGraph(val) {
    if(val['receiving']) {
      val['receiving']['amountItems'].forEach(el1 => {
          this.graphNodes.push({
              name: el1.item.value,
              series: [
                  {
                      name: 'receiving',
                      value: el1.amountWithUnit[1]['amount']
                  }
              ]
          });
      });
    }
    if(val['cleaning']) {
      val['cleaning']['amountItems'].forEach(el1 => {
          var temp = this.graphNodes.find(element => this.findItem(element.name, el1.item.value));
          if(temp) {
            temp.series.push({
              name: 'cleaning',
              value: el1.amountWithUnit[1]['amount']
            });
          } else {
            this.graphNodes.push({
                name: el1.item.value,
                series: [
                    {
                        name: 'cleaning',
                        value: el1.amountWithUnit[1]['amount']
                    }
                ]
            });
          }
      });
    }
    if(val['roasting']) {
      val['roasting']['amountItems'].forEach(el1 => {
        var temp = this.graphNodes.find(element => this.findItem(element.name, el1.item.value));
        if(temp) {
          temp.series.push({
            name: 'roasting',
            value: el1.amountWithUnit[1]['amount']
          });
        } else {
          this.graphNodes.push({
              name: el1.item.value,
              series: [
                  {
                      name: 'roasting',
                      value: el1.amountWithUnit[1]['amount']
                  }
              ]
          });
        }
      });
    }
    if(val['packing']) {
      val['packing']['amountItems'].forEach(el1 => {
        var temp = this.graphNodes.find(element => this.findItem(element.name, el1.item.value));
        if(temp) {
          temp.series.push({
            name: 'packing',
            value: el1.amountWithUnit[1]['amount']
          });
        } else {
          this.graphNodes.push({
              name: el1.item.value,
              series: [
                  {
                      name: 'packing',
                      value: el1.amountWithUnit[1]['amount']
                  }
              ]
          });
        }
      });
    }
  }
  constructor(private breakpointObserver: BreakpointObserver) {}
}
