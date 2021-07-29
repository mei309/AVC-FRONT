import { Component, Input, OnInit } from '@angular/core';
import {isEqualWith} from 'lodash-es';
import { diff } from '../libraries/diffArrayObjects.interface';

@Component({
  selector: 'inside-fe-edit',
  template: `
<div *ngFor="let line of secondSource['same']" style="width: fit-content;">
  <inside-details class="change-color" [dataSource]="line" [oneColumns]="oneColumns">
  </inside-details>
  <h2 *ngIf="line['totalAmount']" style="float: right">Total: {{line['totalAmount'] | tableCellPipe: 'weight2' : null}}</h2>
</div>
<div *ngFor="let line of secondSource['added']" style="width: fit-content;">
  <inside-details class="change-color added-item" [dataSource]="line" [oneColumns]="oneColumns">
  </inside-details>
  <h2 *ngIf="line['totalAmount']" style="float: right">Total: {{line['totalAmount'] | tableCellPipe: 'weight2' : null}}</h2>
</div>
<div *ngFor="let line of secondSource['removed']" style="width: fit-content;">
  <inside-details class="change-color removed-item" [dataSource]="line" [oneColumns]="oneColumns">
  </inside-details>
  <h2 *ngIf="line['totalAmount']" style="float: right">Total: {{line['totalAmount'] | tableCellPipe: 'weight2' : null}}</h2>
</div>
<div *ngFor="let line of secondSource['updated']" style="width: fit-content;">
  <inside-details class="change-color" [dataSource]="line[0]" [secondSource]="line[1]" [oneColumns]="oneColumns">
  </inside-details>
  <h2 *ngIf="line[0]['totalAmount']" style="float: right">Total: {{line[0]['totalAmount'] | tableCellPipe: 'weight2' : null}}</h2>
</div>
  `,
  styleUrls: ['show-details-table.css'],
})
export class InsideFEEditComponent implements OnInit {
    // <h2 *ngIf="dataSource['totalWeight'] && dataSource.length > 1" style="float: right">Total all: {{dataSource['totalWeight'] | tableCellPipe: 'weight2' : null}}</h2>
  @Input() dataSource;
  @Input() secondSource;
  @Input() oneColumns;

  constructor() {
  }
  
  ngOnInit() {
        var result = diff(this.secondSource, this.dataSource, 'id', { updatedValues: 3, compareFunction: (o1,o2)  =>{
            return isEqualWith(o1, o2, (value1, value2, key) => {
                return key === 'version' ? true : undefined;
            })
        } });
        this.secondSource = result;
    }
}
