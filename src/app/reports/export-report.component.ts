import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';


@Component({
  selector: 'export-report',
  template: `
    <h1 style="text-align:center" i18n>Export report</h1>
    <date-range-select class="no-print" (submitRange)="getAllByDate($event)"></date-range-select>
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow"  [detailsSource]="cashewSource" [totelAll]="totelAll" [listTotales]="totelByType" [withPaginator]="false">
      </search-group-details>
    </div>
    `,
})
export class ExportReportComponent implements OnInit {
  navigationSubscription;
  
  isDataAvailable: boolean = false;

  totelAll: OneColumn = {
    type: 'decimalNumber',
    name: 'weightInLbs',
    label: $localize`Total all`,
    options: 'LBS',
  };

  columnsShow: OneColumn[];
  
  totelByType = [
    {
      type: 'sumByParam', 
      name: 'whole',
      label: $localize`Total LBS by type`,
      option: 'weightInLbs',
      collections: {true: 'WHOLE', false: 'H&P'}
    },
    {
      type: 'recordAmountGroup', 
      name: 'containerNumber',
      label: $localize`Container amount`,
    }
  ];

  cashewSource;

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
            options: this.genral.getItemsCashew('Raw'),
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

    
  getAllByDate($event) {
    this.isDataAvailable = true;
    this.cashewSource = null;
    this.localService.getCashewExportReport($event).pipe(take(1)).subscribe(value => {
        this.cashewSource = <any[]>value;
    });
    this.cdRef.detectChanges();
  }

    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }

}
