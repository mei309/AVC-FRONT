import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-inventory-transactions',
  template: `
  <h1 style="text-align:center" i18n>Inventory transactions</h1>
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
export class InventoryTransactionsComponent implements OnInit {

    navigationSubscription;

    tabIndex: number = 0;

    inventorySource;

    columnsShow = [
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
          search: 'selectObj',
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
          name: 'amountSubtracted',
          label: $localize`Amount subtracted`,
          search: 'objArray',
      },
      {
          type: 'weight',
          name: 'amountAdded',
          label: $localize`Amount added`,
          search: 'objArray',
      },
      {
          type: 'normal',
          label: $localize`Remarks`,
          name: 'remarks',
          search: 'normal',
      },
  ];

    dateRange;

    constructor(public dialog: MatDialog, private localService: InventoryService, private genral: Genral,
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
            this.localService.getInventoryTransactions(this.dateRange, 'PRODUCT').pipe(take(1)).subscribe(value => {
              this.inventorySource = <any[]>value;
            });
            this.cdRef.detectChanges();
            break;
          case 1:
            this.inventorySource = null;
            this.localService.getInventoryTransactions(this.dateRange, 'GENERAL').pipe(take(1)).subscribe(value => {
              this.inventorySource = <any[]>value;
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
      }

  }
