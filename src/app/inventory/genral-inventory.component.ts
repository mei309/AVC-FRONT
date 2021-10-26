import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from './../field.interface';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-genral-inventory',
  template: `
  <h1 style="text-align:center" i18n>General inventory</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="General stock by item" i18n-label>
      </mat-tab>
      <mat-tab label="General stock by PO#" i18n-label>
      </mat-tab>
      <mat-tab label="General stock and orders" i18n-label>
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="generalSourceColumns" [withPaginator]="false">
  </search-group-details>
    `
})
export class GenralInventoryComponent implements OnInit {
  navigationSubscription;

  dateRangeDisp = {begin: new Date(2020, 7, 5), end: new Date(2020, 7, 25)};
  tabIndex: number = 0;
  columnsShow: OneColumn[];

  generalSourceColumns: any[];


  // totelAll: OneColumn = {
  //   type: 'weight2',
  //   name: 'totalBalance',
  //   label: $localize`Total all`,
  // };[totelAll]="totelAll"

  constructor(public dialog: MatDialog, private localService: InventoryService, private genral: Genral,
    private _Activatedroute: ActivatedRoute, private cdRef:ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
      if(params.get('number')) {
        this.tabIndex = +params.get('number');
        this.changed(+params.get('number'));
      } else {
        this.changed(0);
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
          this.changed(this.tabIndex);
        });
      }
    });
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: $localize`Inventory item`},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit') {
          switch (this.tabIndex) {

              default:
                  break;
          }
      }
    });
  }

    changed(event) {
      switch (+event) {
        case 0:
          this.generalSourceColumns = null;
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
              type: 'weight2',
              name: 'totalStock',
              label: $localize`Total stock`,
              search: 'objArray',
              group: 'item',
            },
            {
              type: 'nameId',
              name: 'poCode',
              label: $localize`PO#`,
              search: 'object',
              group: 'poCode',
            },
            {
              name: 'supplierName',
              label: $localize`Supplier`,
              search: 'selectObj',
              options: this.genral.getSuppliersGeneral(),
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: $localize`totalBalance`,
              label: 'Total balance',
              search: 'objArray',
              // group: 'poCode',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: $localize`Warehouse`,
              search: 'selectObjArr',
              options: this.genral.getWearhouses(),
            },
            {
                type: 'date',
                name: 'receiptDate',
                label: $localize`Receipt date`,
                search: 'dates',
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            },
          ];
          this.localService.getGeneralInventoryItem().pipe(take(1)).subscribe(value => {
            this.generalSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.generalSourceColumns = null;
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'poCode',
              label: $localize`PO#`,
              search: 'object',
              group: 'poCode',
            },
            {
              name: 'supplierName',
              label: $localize`Supplier`,
              search: 'selectObj',
              options: this.genral.getSuppliersGeneral(),
              group: 'poCode',
            },
            // {
            //   type: 'weight2',
            //   name: 'totalStock',
            //   label: 'Total stock',
            //   search: 'object',
            //   group: 'poCode',
            // },
            {
              type: 'nameId',
              name: 'item',
              label: $localize`Item`,
              search: 'selectObjObj',
              options: this.genral.getItemsGeneral(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: $localize`Total balance`,
              search: 'objArray',
              // group: 'item',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: $localize`Warehouse`,
              search: 'selectObjArr',
              options: this.genral.getWearhouses(),
            },
            {
                type: 'date',
                name: 'receiptDate',
                label: $localize`Receipt date`,
                search: 'dates',
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            }
          ];
          this.localService.getGeneralInventoryByPo().pipe(take(1)).subscribe(value => {
            this.generalSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 2:
            this.generalSourceColumns = null;
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
                type: 'decimalNumber',
                name: 'inventoryAmountNumber',
                label: $localize`Inventory amount`,
                search: 'normal',
              },
              {
                type: 'normal',
                name: 'inventoryAmountUnit',
                label: $localize`Inventory unit`,
                search: 'select',
                options: this.genral.getMeasureUnit(),
              },
              {
                type: 'decimalNumber',
                name: 'orderedAmountNumber',
                label: $localize`Orderd amount`,
                search: 'normal',
              },
              {
                type: 'normal',
                name: 'orderedAmountUnit',
                label: $localize`Orderd unit`,
                search: 'select',
                options: this.genral.getMeasureUnit(),
              },
            ];
            this.localService.getGeneralInventoryOrder().pipe(take(1)).subscribe(value => {
              this.generalSourceColumns = <any[]>value;
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
