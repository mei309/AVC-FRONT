import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';


@Component({
  selector: 'export-report',
  template: `
    <h1 style="text-align:center" i18n>Export Report</h1>
    <date-range-select (submitRange)="getAllByDate($event)"></date-range-select>
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow"  [detailsSource]="cashewSource" [totelAll]="totelAll" [listTotals]="true" [withPaginator]="false" (filteredInfo)="filteredSums($event)">
      </search-group-details>
      <sum-list-tables [mainDetailsSource]="[sumsSource, totelByType]">
      </sum-list-tables>
    </div>
    `,
})
export class ExportReportComponent implements OnInit {
  navigationSubscription;

  isDataAvailable: boolean = false;

  totelAll: OneColumn = {
    type: 'decimalNumber',
    name: 'weightInLbs',
    label: $localize`Sum`,
    options: 'LBS',
  };

  columnsShow: OneColumn[];

  totelByType = [
    {
      type: 'sumByParamCond',
      name: 'whole',
      label: $localize`25/50 LBS packaging (LBS)`,
      option: 'weightInLbs',
      collections: {true: 'WHOLE', false: 'H&P'},
      condision: (arr) => arr.filter(d => d['bagSize']['amount'] === 25 || d['bagSize']['amount'] === 50),
    },
    {
      type: 'sumByParamCond',
      name: 'whole',
      label: $localize`Items packaging`,
      option: 'weightInLbs',
      collections: {true: 'WHOLE', false: 'H&P'},
      condision: (arr) => arr.filter(d => d['bagSize']['amount'] !== 25 && d['bagSize']['amount'] !== 50),
    },
    {
      type: 'sumByParam',
      name: 'whole',
      label: $localize`all (LBS)`,
      option: 'weightInLbs',
      collections: {true: 'WHOLE', false: 'H&P'}
    },
    {
      type: 'recordAmountParam',
      name: 'containerSize',
      option: 'containerNumber',
      label: $localize`Containers`,
    }
  ];

  cashewSource;
  sumsSource;

  constructor(public dialog: MatDialog, private localService: ReportsService,
    private genral: Genral, private cdRef:ChangeDetectorRef) {
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
            search: 'select',
            options: this.genral.getShippingContainerType(),
            group: 'containerNumber',
        },
        {
            type: 'date',
            name: 'processDate',
            label: $localize`Process dates`,
            search: 'dates',
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
            search: 'selectObjObj',
            options: this.genral.getItemsCashew('RoastPacked'),
        },
        {
            name: 'saltLevel',
            label: $localize`Salt level`,
            search: 'select',
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


  getAllByDate($event) {
    this.isDataAvailable = true;
    this.cashewSource = null;
    this.localService.getCashewExportReport($event).pipe(take(1)).subscribe(value => {
        this.cashewSource = <any[]>value;
    });
    this.cdRef.detectChanges();
  }

  filteredSums($event) {
    this.sumsSource = $event;
  }

    ngOnDestroy() {
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }
    }

}
