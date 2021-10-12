import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'general-material-usages',
  template: `
    <h1 style="text-align:center" i18n>General Usages Report</h1>
    <date-range-select (submitRange)="getAllByDate($event)"></date-range-select>
    <search-group-details [mainColumns]="columnsShow" [detailsSource]="usageSource" [withPaginator]="false">
    </search-group-details>
    `,
})
export class GeneralMaterialUsagesComponent implements OnInit {
  navigationSubscription;

  columnsShow: OneColumn[];

  dateRange;

  // [totelColumn]="totelColumn" [totelAll]="totelAll"
  // totelColumn: OneColumn = {
  //     type: 'weight2',
  //     name: 'processGain',
  //     label: $localize`Total difference`,
  //     group: 'poCodes',
  //     options: ['%', 'LBS']
  // };

  // totelAll: OneColumn = {
  //   type: 'listAmountWithUnit',
  //   name: 'producedItems',
  //   label: $localize`Total all produced`,
  //   options: ['LBS']
  // };

  usageSource;

  constructor(private router: Router, public dialog: MatDialog, private localService: ReportsService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.columnsShow = [
          {
              type: 'nameId',
              name: 'item',
              label: $localize`Item`,
              search: 'selectObjObj',
              options: this.genral.getItemsGeneral(),
              group: 'item',
          },
          {
              type: 'stringComma',
              name: 'poCodes',
              label: $localize`PO#`,
              search: 'normal',
              group: 'poCodes',
          },
          {
              type: 'stringComma',
              name: 'suppliers',
              label: $localize`Supplier`,
              search: 'selectObj',
              options: this.genral.getSuppliersGeneral(),
              group: 'poCodes',
          },
          {
              name: 'processName',
              label: $localize`Process name`,
              search: 'select',
              options: this.genral.getProcess(),
          },
          {
              name: 'productionLine',
              label: $localize`Production line`,
              search: 'select',
              options: this.genral.getProductionLine(''),
          },
          {
              type: 'date',
              name: 'receiptDate',
              label: $localize`Receipt date`,
              search: 'dates',
          },
          {
              type: 'date',
              name: 'transactionDate',
              label: $localize`Transaction date`,
              search: 'dates',
          },
          {
              type: 'weight',
              name: 'amountAdded',
              label: $localize`Amount added`,
              search: 'objArray',
          },
          {
              type: 'weight',
              name: 'amountSubtracted',
              label: $localize`Amount subtracted`,
              search: 'objArray',
          },
          {
              type: 'normal',
              label: $localize`Remarks`,
              name: 'remarks',
              search: 'normal',
          },
      ];
  }


  getAllByDate($event) {
    this.dateRange = $event;
    this.usageSource = null;
    this.localService.getInventoryTransactions($event).pipe(take(1)).subscribe(value => {
      this.usageSource = <any[]>value;
    });
    this.cdRef.detectChanges();
  }

    ngOnDestroy() {
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }
    }

}
