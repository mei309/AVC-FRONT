import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dash-board',
  template:`
  <div class="grid-container">
    <h1 class="mat-h1">Dashboard</h1>
    <mat-grid-list cols="2" rowHeight="350px">
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
              <app-my-line-chart *ngSwitchCase="'line'"></app-my-line-chart>
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
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'QC over time', cols: 1, rows: 1, graph: 'bar'},
        { title: 'Working time', cols: 1, rows: 1, graph: 'bubble'},
        { title: 'Net weight over process', cols: 1, rows: 2, graph: 'line'},
        { title: 'Out product', cols: 1, rows: 1, graph: 'pie'}
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
