import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { SchedulesService } from './schedules.service';


@Component({
  selector: 'receiving-general-schedule',
  template: `
  <h1 style="text-align:center" i18n>Receiving general schedule</h1>
  <div class="centerButtons">
    <mat-form-field>
      <mat-label i18n>Enter a date range</mat-label>
      <mat-date-range-input [formGroup]="dateRangeDisp" [rangePicker]="picker4">
        <input matStartDate formControlName="start" (focus)="picker4.open()" placeholder="Start date" i18n-placeholder>
        <input matEndDate formControlName="end" (focus)="picker4.open()" placeholder="End date" (dateChange)="inlineRangeChange()" i18n-placeholder>
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]="picker4"></mat-datepicker-toggle>
      <mat-date-range-picker #picker4></mat-date-range-picker>
    </mat-form-field>
    <mat-checkbox [checked]="seeAll" (change)="showAllOrWeek($event.checked)" i18n>See all</mat-checkbox>
  </div>
  <normal-group-details [mainDetailsSource]="cashewSourceColumns" [mainColumns]="columnsShow">
  </normal-group-details>
  `,
})
export class ReceivingGeneralScheduleComponent implements OnInit {

  dateRangeDisp= new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  cashewSourceColumns;
  
  seeAll: boolean;
  columnsShow: OneColumn[];
  
  ordersSource: any[];
  mainSource: any[];

  constructor(public dialog: MatDialog, private localService: SchedulesService) {
    
  }

  ngOnInit() {
    this.showWeek();
    this.localService.getGeneralOrdersOpen().pipe(take(1)).subscribe(value => {
      this.mainSource = <any[]>value;
      this.inlineRangeChange();
    });
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

  showWeek() {
    this.dateRangeDisp.setValue({start: moment().utc().startOf("day").toDate(), end: moment().utc().add(7, "day").startOf("day").toDate()});
  }

  inlineRangeChange() {
      var dates = this.dateRangeDisp.value;
      if(dates.end) {
        this.ordersSource = this.mainSource.filter(e=> 
          (moment(e['deliveryDate']).isBetween(dates.start, dates.end.add(1, "day"))));
        this.cashewSourceColumns = this.ordersSource;
        if(this.ordersSource.length < this.mainSource.length) {
          this.seeAll = false;
        }
      }
  }

  showAllOrWeek(seeAll) {
    this.seeAll = seeAll;
    if(seeAll) {
      // this.ordersSource = this.mainSource;
      this.cashewSourceColumns = this.mainSource;
    } else {
      this.showWeek();
      this.inlineRangeChange();
    }
  }


}


