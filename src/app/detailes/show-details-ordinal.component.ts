import { Component, OnInit, Input } from '@angular/core';
import {isEqual} from 'lodash-es';
@Component({
  selector: 'show-details-ordinal',
  template: `
  <div class="array-field-grid" *ngIf="noChanges; else elseblockmain">
    <div *ngFor="let item of dataSource" class="one-cell-table">
      <span>&nbsp; {{item.ordinal}} &nbsp;</span>
      <mat-form-field style="width: 100px" appearance="none" provideReadonly>
        <input matInput style="text-align: center" readonly [value]="item.amount">
      </mat-form-field>
    </div>
  </div>
  <ng-template  #elseblockmain>
    <div *ngFor="let item of dataSource" class="one-cell-table">
      <span>&nbsp; {{item.ordinal}} &nbsp;</span>
      <mat-form-field style="width: 100px" appearance="none" provideReadonly>
        <input matInput style="text-align: center" readonly [value]="item.sameVal">
        <input matInput class="added-item" style="text-align: center" readonly [value]="item.newVal">
        <input matInput class="removed-item" style="text-align: center" readonly [value]="item.oldVal">
      </mat-form-field>
    </div>
  </ng-template>
`,
})
export class ShowOrdinalComponent implements OnInit {
  
    @Input() dataSource;

    @Input() secondSource;
  
    noChanges: boolean = true;
  
    constructor() {}
    ngOnInit() {
      var newSource = [];
      if(this.secondSource && this.secondSource.length) {
        this.noChanges = false;
        if(this.dataSource && this.dataSource.length) {
          var place = 0;
          this.dataSource.forEach(element => {
            while(this.secondSource[place] && element['ordinal'] > this.secondSource[place]['ordinal']) {
              newSource.push({ordinal: this.secondSource[place]['ordinal'], oldVal: this.secondSource[place]['amount']});
              place++;
            }
            if(element['ordinal'] === this.secondSource[place]['ordinal']) {
              newSource.push({ordinal: element['ordinal'], oldVal: this.secondSource[place]['amount'], newVal: element['amount']});
              place++;
            } else {
              newSource.push({ordinal: element['ordinal'], newVal: element['amount']});
            }
          });
          while(place < this.secondSource.length) {
            newSource.push({ordinal: this.secondSource[place]['ordinal'], oldVal: this.secondSource[place]['amount']});
            place++;
          }
        } else {
          this.secondSource.forEach(element => {
            newSource.push({ordinal: element['ordinal'], oldVal: element['amount']});
          });
        }
      }
    }
}
