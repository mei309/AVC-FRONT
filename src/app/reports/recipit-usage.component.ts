import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'app-receipt-usage',
  template: `
  <h1 style="text-align:center" i18n>Receipt Usage</h1>
  <date-range-select (submitRange)="setDateRange($event)"></date-range-select>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Cashew" i18n-label>
      </mat-tab>
      <mat-tab label="General" i18n-label>
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="inventorySource">
  </search-group-details>
    `
})
export class ReceiptUsageComponent implements OnInit {

    navigationSubscription;

    ItemsChangable = new ReplaySubject<any[]>();
    SuppliersChangable = new ReplaySubject<any[]>();

    tabIndex: number = 0;

    inventorySource;

    columnsShow = [
      {
          type: 'normal',
          name: 'poCode',
          label: $localize`PO#`,
          search: 'normal',
      },
      {
          type: 'stringComma',
          name: 'supplier',
          label: $localize`Supplier`,
          search: 'selectObj',
          options: this.SuppliersChangable,
      },
      {
          type: 'normal',
          name: 'item',
          label: $localize`Item`,
          search: 'selectObj',
          options: this.ItemsChangable,
      },
      {
          type: 'normal',
          name: 'measureUnit',
          label: $localize`Measure unit`,
          search: 'normal',
      },
      {
          type: 'date',
          name: 'receiptDate',
          label: $localize`Receipt date`,
          search: 'dates',
      },
      {
          type: 'decimalNumber',
          name: 'importedAmount',
          label: $localize`Receipt amount`,
          search: 'normal',
      },
      {
          type: 'arrayVal',
          name: 'usedDates',
          label: $localize`Used dates`,
          search: 'dates',
      },
      {
          type: 'decimalNumber',
          name: 'usedAmount',
          label: $localize`Used amount`,
          search: 'normal',
      },
      {
          type: 'decimalNumber',
          name: 'balance',
          label: $localize`Balance`,
          search: 'normal',
      },
      {
          type: 'arrayVal',
          name: 'warehouses',
          label: $localize`Warehouse`,
          search: 'selectObjArr',
          options: this.genral.getWearhouses(),
      },
      {
          type: 'currency',
          name: 'unitPrice',
          label: $localize`Unit price`,
          search: 'object',
      },
      {
          type: 'arrayVal',
          name: 'bags',
          label: $localize`Bags`,
          search: 'normal',
      },
  ];

    dateRange;

    constructor(public dialog: MatDialog, private localService: ReportsService, private genral: Genral,
      private _Activatedroute: ActivatedRoute, private cdRef:ChangeDetectorRef, private router: Router) {
    }

    ngOnInit() {
      this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
        if(params.get('number')) {
          this.tabIndex = +params.get('number');
        }
      });
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('number')) {
              this.tabIndex = +params.get('number');
            } else {
              this.tabIndex = 0;
            }
            this.changedAndDate(this.tabIndex);
          });
        }
      });
    }

    changed(event) {
      this.changedAndDate(event);
    }
    setDateRange($event) {
      this.dateRange = $event;
      this.changedAndDate(this.tabIndex);
    }

    changedAndDate(event) {
        switch (+event) {
          case 0:
            this.inventorySource = null;
            this.localService.getReceiptUsage(this.dateRange, 'PRODUCT').pipe(take(1)).subscribe(value => {
              this.inventorySource = <any[]>value;
            });
            this.genral.getItemsCashew('').pipe(take(1)).subscribe(val => {
              this.ItemsChangable.next(val);
            });
            this.genral.getSuppliersCashew().pipe(take(1)).subscribe(val => {
              this.SuppliersChangable.next(val);
            });
            this.cdRef.detectChanges();
            break;
          case 1:
            this.inventorySource = null;
            this.localService.getReceiptUsage(this.dateRange, 'GENERAL').pipe(take(1)).subscribe(value => {
              this.inventorySource = <any[]>value;
            });
            this.genral.getItemsGeneral().pipe(take(1)).subscribe(val => {
              this.ItemsChangable.next(val);
            });
            this.genral.getSuppliersGeneral().pipe(take(1)).subscribe(val => {
              this.SuppliersChangable.next(val);
            });
            this.cdRef.detectChanges();
            break;
          default:
            break;
        }
      }

      ngOnDestroy() {
        if (this.navigationSubscription) {
           this.navigationSubscription.unsubscribe();
        }
        this.ItemsChangable.unsubscribe();
        this.SuppliersChangable.unsubscribe();
      }

  }
