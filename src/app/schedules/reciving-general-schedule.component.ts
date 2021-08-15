import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { SchedulesService } from './schedules.service';


@Component({
  selector: 'receiving-general-schedule',
  template: `
  <h1 style="text-align:center" i18n>Receiving general schedule</h1>
  <date-range-select [withTime]="false" (submitRange)="inlineRangeChange($event)"></date-range-select>
  <normal-group-details [mainDetailsSource]="cashewSource" [mainColumns]="columnsShow">
  </normal-group-details>
  `,
})
export class ReceivingGeneralScheduleComponent implements OnInit {

  cashewSource;
  
  columnsShow: OneColumn[];
  
  constructor(public dialog: MatDialog, private localService: SchedulesService) {
    
  }

  ngOnInit() {
    this.columnsShow = [
      {
        type: 'date',
        name: 'deliveryDate',
        label: $localize`Delivery date`,
        group: 'deliveryDate',
      },
      {
        name: 'personInCharge',
        label: $localize`Person in charge`,
        group: 'value',
      },
      {
        name: 'value',
        label: $localize`PO#`,
        group: 'value',
      },
      {
        name: 'supplierName',
        label: $localize`Supplier`,
        group: 'value',
      },
      // {
      //   type: 'group',
      //   name: 'lots',
      //   label: 'Total lots',
      //   group: 'value',
      // },
      {
        type: 'nameId',
        name: 'item',
        label: $localize`Product descrption`,
      },
      {
        type: 'weight2',
        name: 'numberUnits',
        label: $localize`Amount`,
        // options: 'measureUnit',
      },
      {
        type: 'currency',
        name: 'unitPrice',
        label: $localize`Price per unit`,
        // options: 'currency',
      },
      {
        type: 'dateTime',
        name: 'contractDate',
        label: $localize`Contract date`,
      },
      {
        type: 'arrayVal',
        name: 'approvals',
        label: $localize`Approvals`,
        search: 'object',
      },
      {
        type: 'arrayVal',
        name: 'orderStatus',
        label: $localize`Status`,
        search: 'select',
        options: ['OPEN', 'RECEIVED', 'REJECTED'],
      },
      // {
      //   name: 'poRows',
      //   titel: 'Supplier',
      //   type: 'kidArray',
      //   collections: [
          
      //   ]
      // }
    ];
  }

 
  inlineRangeChange($event) {
    this.localService.getAllGeneralOrders($event).pipe(take(1)).subscribe(value => {
      this.cashewSource = <any[]>value;
    });
  }


}


