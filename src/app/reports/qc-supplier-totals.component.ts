import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DropNormal, OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';
@Component({
  selector: 'qcs-totals',
  template: `
    <h1 style="text-align:center" i18n>Suppliers QC Report</h1>
    <date-range-select (submitRange)="getAllByDate($event)"></date-range-select>
    <mat-form-field class="no-print" appearance="fill" style="margin-bottom:10px; margin-left:25px;">
      <mat-label i18n>Supplier</mat-label>
      <mat-select [formControl]="supplier" (selectionChange)="applySupplier($event.value)">
        <mat-option value="">--all--</mat-option>
        <mat-option *ngFor="let sup of suppliers | async" [value]="sup">{{sup.value}}</mat-option>
      </mat-select>
    </mat-form-field>



    <ng-container *ngIf="isDataAvailable">
      <div *ngIf="supplier.value" class="half only-print">
        <label>Supplier</label>
        <span class="half">{{supplier.value | tableCellPipe: 'nameId' : null}}</span>
      </div>
      <search-group-details [mainColumns]="columnsShow"  [detailsSource]="qcSource" [listTotals]="true" [withPaginator]="false" (filteredInfo)="filteredSums($event)">
      </search-group-details>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'rawDefectsAndDamage']" title="Raw defects + damage" type="percentNormal" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'roastDefectsAndDamage']" title="Roast defects + damage" type="percentNormal" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'loss']" title="Loss" type="percent" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'badQuality']" title="QC (LBS)" type="decimalNumber" i18n-title>
      </sums-qc-table>
      <sums-qc-table class="sums-qc" [mainDetailsSource]="[sumsSource, ['supplier', 'receivedItem'], 'waste']" title="Waste (LBS)" type="decimalNumber" i18n-title>
      </sums-qc-table>
    </ng-container>
    `,
})
export class QcsTotalsComponent implements OnInit {
  navigationSubscription;

  suppliers = new ReplaySubject<DropNormal[]>();

  supplier = new FormControl(null);
  isDataAvailable: boolean = false;

  columnsShow: OneColumn[];

  dateRange;

  qcSource;
  sumsSource;

  constructor(public dialog: MatDialog, private localService: ReportsService,
    private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.genral.getSuppliersCashew().pipe(take(1)).subscribe(val => {
      this.suppliers.next(val);
    });
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
        // search: 'object',
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
        label: $localize`Raw defects + damage`,
        search: 'percentage',
      },
      {
        type: 'percentNormal',
        name: 'roastDefectsAndDamage',
        label: $localize`Roast defects + damage`,
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
        label: $localize`QC`,
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
    this.dateRange = $event;
    this.isDataAvailable = true;
    this.qcSource = null;
    this.localService.sumQcBySupplier(this.supplier.value? this.supplier.value.id : null, $event).pipe(take(1)).subscribe(value => {
      this.qcSource = <any[]>value;
    });
    this.cdRef.detectChanges();
  }

  applySupplier($event) {
    this.isDataAvailable = true;
    this.qcSource = null;
    this.localService.sumQcBySupplier($event.id, this.dateRange).pipe(take(1)).subscribe(value => {
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
    this.suppliers.unsubscribe();
  }
}
