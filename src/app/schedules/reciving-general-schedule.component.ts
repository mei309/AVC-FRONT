import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { SchedulesService } from './schedules.service';


@Component({
  selector: 'receiving-general-schedule',
  template: `
  <h1 style="text-align:center">
    Receiving general schedule
  </h1>
  <div class="centerButtons">
    <mat-form-field>
      <mat-label>Enter a date range</mat-label>
      <mat-date-range-input (focus)="picker4.open()" (dateChange)="inlineRangeChange($event.value)" [formGroup]="dateRangeDisp" [rangePicker]="picker4">
        <input matStartDate formControlName="start" placeholder="Start date">
        <input matEndDate formControlName="end" placeholder="End date">
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]="picker4"></mat-datepicker-toggle>
      <mat-date-range-picker #picker4></mat-date-range-picker>
    </mat-form-field>
    <mat-checkbox [checked]="seeAll" (change)="showAllOrWeek()">See all</mat-checkbox>
  </div>
  <normal-group-details [mainDetailsSource]="cashewSourceColumns">
  </normal-group-details>
  `,
})
export class ReceivingGeneralScheduleComponent implements OnInit {

  dateRangeDisp= new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  cashewSourceColumns;
  
  seeAll: boolean = false;
  columnsShow: OneColumn[];
  
  ordersSource: any[];
  mainSource: any[];

  constructor(public dialog: MatDialog, private localService: SchedulesService) {
    
  }

  ngOnInit() {
    this.showWeek();
    this.localService.getGeneralOrdersOpen().pipe(take(1)).subscribe(value => {
      this.mainSource = <any[]>value;
      this.inlineRangeChange(this.dateRangeDisp.value);
    });
    this.columnsShow = [
      {
        type: 'date',
        name: 'deliveryDate',
        label: 'Delivery date',
        group: 'deliveryDate',
      },
      {
        name: 'personInCharge',
        label: 'Person in charge',
        group: 'value',
      },
      {
        name: 'value',
        label: 'PO#',
        group: 'value',
      },
      {
        name: 'supplierName',
        label: 'Supplier',
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
        label: 'Product descrption',
      },
      {
        type: 'weight',
        name: 'numberUnits',
        label: 'Amount',
        // options: 'measureUnit',
      },
      {
        type: 'currency',
        name: 'unitPrice',
        label: 'Price per unit',
        // options: 'currency',
      },
      {
        name: 'defects',
        label: '% defects',
      },
      {
        type: 'dateTime',
        name: 'contractDate',
        label: 'Contract date',
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
    const tempDate: Date = new Date();
    tempDate.setDate(tempDate.getDate()+7);
    tempDate.setHours(0,0,0,0);
    const beginDate: Date = new Date();
    beginDate.setHours(0,0,0,0);
    this.dateRangeDisp.setValue({start: beginDate, end: tempDate});
  }

  inlineRangeChange($event) {
      const begin = $event.begin.getTime();
      const finalEnd: Date = new Date($event.end);
      finalEnd.setDate(finalEnd.getDate() + 1);
      const end = finalEnd.getTime();
      this.ordersSource = this.mainSource.filter(e=> 
        (new Date(e['deliveryDate'])).getTime() > begin && (new Date(e['deliveryDate'])).getTime() < end ) ; 
        this.cashewSourceColumns = [this.ordersSource, this.columnsShow];
  }

  showAllOrWeek() {
    this.seeAll = !this.seeAll;
    if(this.seeAll) {
      // this.ordersSource = this.mainSource;
      this.cashewSourceColumns = [this.mainSource, this.columnsShow];
    } else {
      this.showWeek();
      this.inlineRangeChange(this.dateRangeDisp.value);
    }
  }


}


