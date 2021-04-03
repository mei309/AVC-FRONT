import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { SchedulesService } from './schedules.service';

@Component({
  selector: 'receiving-schedule',
  template: `
  <h1 style="text-align:center">
    Receiving cashew schedule
  </h1>
  <div class="centerButtons">
    <mat-form-field>
      <mat-label>Enter a date range</mat-label>
      <mat-date-range-input [formGroup]="dateRangeDisp" [rangePicker]="picker4">
        <input matStartDate formControlName="start" placeholder="Start date" (focus)="picker4.open()">
        <input matEndDate formControlName="end" placeholder="End date" (focus)="picker4.open()" (dateChange)="inlineRangeChange()">
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]="picker4"></mat-datepicker-toggle>
      <mat-date-range-picker #picker4></mat-date-range-picker>
    </mat-form-field>
    <mat-checkbox [checked]="seeAll" (change)="showAllOrWeek($event.checked)">See all</mat-checkbox>
  </div>
  <normal-group-details [mainDetailsSource]="cashewSourceColumns" [mainColumns]="columnsShow">
  </normal-group-details>
  <h1 style="text-align:center">Amounts</h1>
  <sums-table [mainDetailsSource]="sumsSource">
  </sums-table>
  `,
})
export class ReceivingCashewScheduleComponent implements OnInit {

  dateRangeDisp= new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  cashewSourceColumns;
  sumsSource;

  seeAll: boolean;
  columnsShow: OneColumn[];
  
  ordersSource: any[];
  mainSource: any[];
  dataSum: any[] = [];

  constructor(public dialog: MatDialog, private localService: SchedulesService) {
    
  }

  ngOnInit() {
    this.showWeek();
    this.localService.getCashewOrdersOpen().pipe(take(1)).subscribe(value => {
      this.mainSource = <any[]>value;
      this.inlineRangeChange();
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
        type: 'weight2',
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
      {
        type: 'arrayVal',
        name: 'approvals',
        label: 'Approvals',
        search: 'object',
      },
      {
        type: 'arrayVal',
        name: 'orderStatus',
        label: 'Status',
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
    const tempDate: Date = new Date();
    tempDate.setDate(tempDate.getDate()+7);
    this.dateRangeDisp.setValue({start: new Date(), end: tempDate});
  }

  inlineRangeChange() {
      var dates = this.dateRangeDisp.value;
      if(dates.end) {
        this.ordersSource = this.mainSource.filter(e=> 
          (new Date(e['deliveryDate'])).getTime() > (dates.start).setHours(0,0,0,0) && (new Date(e['deliveryDate'])).getTime() < (dates.end).setHours(23,59,59,999) ) ; 
        this.cashewSourceColumns = this.ordersSource;
        this.sumsSource = [this.ordersSource, ['personInCharge', 'itemName'], ['item', 'itemName']];
        if(this.ordersSource.length < this.mainSource.length) {
          this.seeAll = false;
        }
      }
  }

  showAllOrWeek(seeAll) {
    this.seeAll = seeAll;
    if(seeAll) {
      this.cashewSourceColumns = this.mainSource;
      this.sumsSource = [this.mainSource, ['personInCharge', 'itemName'], ['item', 'itemName']];
    } else {
      this.showWeek();
      this.inlineRangeChange();
    }
  }



}


