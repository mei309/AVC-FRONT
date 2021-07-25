import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';
@Component({
  selector: 'qcs-totals',
  template: `
    <h1 style="text-align:center" i18n>QC totals</h1>
    <date-range-select class="no-print" (submitRange)="getAllByDate($event)"></date-range-select>
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow"  [detailsSource]="qcSource" [listTotals]="true" [withPaginator]="false" (filteredInfo)="filteredSums($event)">
      </search-group-details>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'rawDefectsAndDamage']" title="raw defects + damage" type="percentNormal" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'roastDefectsAndDamage']" title="roast defects + damage" type="percentNormal" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'loss']" title="loss" type="percent" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'badQuality']" title="bad quality (LBS)" type="decimalNumber" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'waste']" title="waste (LBS)" type="decimalNumber" i18n-title>
      </sums-qc-table>
    </div>
    `,
    styleUrls: ['./final-report-tables.css']
})
export class QcsTotalsComponent implements OnInit {
  navigationSubscription;

  isDataAvailable: boolean = false;

  columnsShow: OneColumn[];

  qcSource;
  sumsSource;

  constructor(public dialog: MatDialog, private localService: ReportsService,
    private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.columnsShow = [
      // {
      //   name: 'id',
      //   titel: 'id',
      //   type: 'idGroup',
      // },
      {
        name: 'supplier',
        label: $localize`Supplier`,
        search: 'selectObj',
        options: this.genral.getSuppliersCashew(),
        group: 'supplier',
      },
      {
        type: 'normal',
        name: 'receivedItem',
        label: $localize`Product descrption`,
        search: 'selectObj',
        options: this.genral.getItemsCashew('RawCleanRoast'),
        group: 'receivedItem',
      },
      {
        type: 'normal',
        name: 'poCode',
        label: $localize`PO#`,
        search: 'object',
        // group: 'poCode',
      },
      // {
      //   type: 'percentNormal',
      //   name: 'rawDamage',
      //   label: $localize`Total raw damage`,
      //   search: 'percentage',
      // },
      // {
      //   type: 'percentNormal',
      //   name: 'rawDefects',
      //   label: $localize`Total raw defects`,
      //   search: 'percentage',
      // },
      {
        type: 'percentNormal',
        name: 'rawDefectsAndDamage',
        label: $localize`Total raw defects + damage`,
        search: 'percentage',
      },
      {
        type: 'percentNormal',
        name: 'roastDefectsAndDamage',
        label: $localize`Total roast defects + damage`,
        search: 'percentage',
      },
      {
        type: 'percent',
        name: 'loss',
        label: $localize`Loss`,
        search: 'percentage',
      },
      {
        type: 'weight',
        name: 'badQuality',
        label: $localize`Bad quality`,
        search: 'object',
      },
      {
        type: 'weight',
        name: 'waste',
        label: $localize`Waste`,
        search: 'object',
      },
      // {
      //   type: 'percentNormal',
      //   name: 'roastDamage',
      //   label: $localize`Total roast damage`,
      //   search: 'percentage',
      // },
      // {
      //   type: 'percentNormal',
      //   name: 'roastDefects',
      //   label: $localize`Total roast defects`,
      //   search: 'percentage',
      // },
      {
        type: 'dateTime',
        name: 'receiptTime',
        label: $localize`Receiving date`,
        search: 'dates',
      },
    ];
  }

  getAllByDate($event) {
    this.isDataAvailable = true;
    this.qcSource = null;
    this.localService.sumQcBySupplier($event).pipe(take(1)).subscribe(value => {
      this.qcSource = <any[]>value;
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
