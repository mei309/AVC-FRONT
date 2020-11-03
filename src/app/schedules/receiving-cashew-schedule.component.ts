import { Component, OnInit } from '@angular/core';
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
        <input matInput readonly (focus)="picker3.open()" placeholder="Choose dates" [satDatepicker]="picker3" (dateChange)="inlineRangeChange($event.value)" [value]="dateRangeDisp">
        <sat-datepicker #picker3 [rangeMode]="true"></sat-datepicker>
        <sat-datepicker-toggle  matSuffix [for]="picker3"></sat-datepicker-toggle>
    </mat-form-field>
    <mat-checkbox [checked]="seeAll" (change)="showAllOrWeek()">See all</mat-checkbox>
  </div>
  <normal-group-details [mainDetailsSource]="cashewSourceColumns">
  </normal-group-details>
  <sums-table [mainDetailsSource]="sumsSource">
  </sums-table>
  `,
})
export class ReceivingCashewScheduleComponent implements OnInit {

  dateRangeDisp;
  
  cashewSourceColumns;
  sumsSource;

  seeAll: boolean = false;
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
      this.inlineRangeChange(this.dateRangeDisp);
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
    tempDate.setHours(0,0,0,0);
    const beginDate: Date = new Date();
    beginDate.setHours(0,0,0,0);
    this.dateRangeDisp = {begin: beginDate, end: tempDate};
  }

  inlineRangeChange($event) {
      const begin = $event.begin.getTime();
      const finalEnd: Date = new Date($event.end);
      finalEnd.setDate(finalEnd.getDate() + 1);
      const end = finalEnd.getTime();
      this.ordersSource = this.mainSource.filter(e=> 
        (new Date(e['deliveryDate'])).getTime() > begin && (new Date(e['deliveryDate'])).getTime() < end ) ; 
        this.cashewSourceColumns = [this.ordersSource, this.columnsShow];
        this.sumsSource = [this.ordersSource, ['personInCharge', 'itemName']];
  }

  showAllOrWeek() {
    this.seeAll = !this.seeAll;
    if(this.seeAll) {
      this.cashewSourceColumns = [this.mainSource, this.columnsShow];
      this.sumsSource = [this.mainSource, ['personInCharge', 'itemName']];
    } else {
      this.showWeek();
      this.inlineRangeChange(this.dateRangeDisp);
    }
  }



}


