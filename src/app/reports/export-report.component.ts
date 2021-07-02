import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';


@Component({
  selector: 'export-report',
  template: `
    <h1 style="text-align:center" i18n>Export report</h1>
    <date-range-select></date-range-select>
    <mat-form-field>
      <mat-label i18n>Enter a date range</mat-label>
      <mat-date-range-input [formGroup]="dateRangeDisp" [rangePicker]="picker4">
        <input matStartDate formControlName="start" placeholder="Start date" (focus)="picker4.open()" i18n-placeholder>
        <input matEndDate formControlName="end" placeholder="End date" (focus)="picker4.open()" (dateChange)="inlineRangeChange()" i18n-placeholder>
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]="picker4"></mat-datepicker-toggle>
      <mat-date-range-picker #picker4></mat-date-range-picker>
    </mat-form-field>
    
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow"  [detailsSource]="cashewSource" [totelAll]="totelAll" [listTotales]="totelByType" [withPaginator]="false">
      </search-group-details>
    </div>
    `,
})
export class ExportReportComponent implements OnInit {
  navigationSubscription;
  
  isDataAvailable: boolean = false;

  dateRangeDisp= new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  totelAll: OneColumn = {
    type: 'decimalNumber',
    name: 'weightInLbs',
    label: $localize`Total all`,
    options: 'LBS',
  };

  columnsShow: OneColumn[];
  
  totelByType = [
    {
      type: 'multi', 
      name: 'whole',
      label: $localize`Total by type`,
      option: 'weightInLbs',
      collections: {true: 'WHOLE', false: 'H&P'}
    }
  ];

  cashewSource;

  constructor(private router: Router, public dialog: MatDialog, private localService: ReportsService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.columnsShow = [
        {
            type: 'normal',
            name: 'containerNumber',
            label: $localize`Container number`,
            search: 'normal',
            group: 'containerNumber',
        },
        {
            type: 'nameId',
            name: 'shipmentCode',
            label: $localize`Shipment code`,
            search: 'object',
            group: 'containerNumber',
        },
        {
            type: 'normal',
            name: 'containerSize',
            label: $localize`Container size`,
            search: 'normal',
            group: 'containerNumber',
        },
        {
            type: 'normal',
            name: 'poCode',
            label: $localize`PO#`,
            search: 'normal',
            group: 'poCode',
        },
        {
            type: 'nameId',
            name: 'item',
            label: $localize`Commodity`,
            search: 'selectObj',
            options: this.genral.getItemsRawCashew(),
        },
        {
            type: 'date',
            name: 'processDate',
            label: $localize`Process dates`,
            search: 'dates',
        },
        {
            name: 'saltLevel',
            label: $localize`Salt level`,
            type: 'selectNormal',
            options: ['NS', 'S', 'LS'],
        },
        {
            type: 'decimalNumber',
            name: 'boxQuantity',
            label: $localize`Box quantity`,
            search: 'normal',
        },
        {
            type: 'decimalNumber',
            name: 'bagQuantity',
            label: $localize`Bag quantity`,
            search: 'normal',
        },
        {
            type: 'decimalNumber',
            name: 'weightInLbs',
            label: $localize`LBS weight`,
            search: 'normal',
        },
        {
            type: 'checkBool',
            name: 'roast',
            label: $localize`Roast`,
            search: 'none',
        },
        {
            type: 'normal',
            name: 'remarks',
            label: $localize`Remarks`,
            search: 'normal',
        },
      ];
  }

    

    inlineRangeChange() {
        var dates = this.dateRangeDisp.value;
        if(dates.end) {
            this.isDataAvailable = true;
            this.cashewSource = null;
            this.localService.getCashewExportReport(dates.start, dates.end).pipe(take(1)).subscribe(value => {
                this.cashewSource = <any[]>value;
            });
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }

}
