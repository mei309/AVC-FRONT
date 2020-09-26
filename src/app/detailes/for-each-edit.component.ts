import { Component, Input, OnInit } from '@angular/core';
import {isEqualWith} from 'lodash-es';
import { diff } from '../libraries/diffArrayObjects.interface';

@Component({
  selector: 'for-each-edit',
  template: `
<show-details class="change-color" *ngFor="let line of dataSource['same']" [dataSource]="line" [withPo]="false">
</show-details>
<show-details class="change-color added-item" *ngFor="let line of dataSource['added']" [dataSource]="line" [withPo]="false">
</show-details>
<show-details class="change-color removed-item" *ngFor="let line of dataSource['removed']" [dataSource]="line" [withPo]="false">
</show-details>
<show-details class="change-color" *ngFor="let line of dataSource['updated']" [dataSource]="line[0]" [secondSource]="line[1]" [withPo]="false">
</show-details>
  `,
  styleUrls: ['show-details-table.css'],
})
export class ForEachEditComponent implements OnInit {
    
  @Input() dataSource;
  @Input() secondSource;

  constructor() {
  }
  
  ngOnInit() {
        var result = diff(this.secondSource, this.dataSource, 'id', { updatedValues: 3, compareFunction: (o1,o2)  =>{
            return isEqualWith(o1, o2, (value1, value2, key) => {
                return key === 'version' ? true : undefined;
            })
        } });
        this.dataSource = result;
    }
}
