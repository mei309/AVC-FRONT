import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from './../field.interface';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-cashew-inventory',
  template: `
  <h1 style="text-align:center" i18n>Cashew inventory</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Cashew stock by item" i18n-label>
          <div class="centerButtons">
              <mat-form-field style="margin-bottom:10px; margin-left:25px;" >
                  <mat-select placeholder="Categories" (selectionChange)="applyFilter($event.value)">
                    <mat-option value="">--all--</mat-option>
                    <mat-option *ngFor="let item of itemCategory" [value]="item">{{item}}</mat-option>
                  </mat-select>
              </mat-form-field>
          </div>
      </mat-tab>
      <mat-tab label="Cashew stock by PO#" i18n-label>
      </mat-tab>
      <!-- <mat-tab label="Raw cashew stock and orders">
      </mat-tab> -->
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSourceColumns" [totelAll]="totelAll" [withPaginator]="false">
  </search-group-details>
    `
})
export class CashewInventoryComponent implements OnInit {
  navigationSubscription;
  
  dateRangeDisp = {begin: new Date(2020, 7, 5), end: new Date(2020, 7, 25)};
  tabIndex: number = 0;
  columnsShow: OneColumn[];

  cashewSource: any[];
  cashewSourceColumns;

  itemCategory;

  totelAll: OneColumn = {
    type: 'weight2',
    name: 'totalBalance',
    label: $localize`Total all`,
    options: ['KG', 'LBS']
  };
  

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
    this.itemCategory = this.genral.getItemCategory();
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
          this.cashewSourceColumns = null; 
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'item',
              label: $localize`Item`,
              search: 'selectObjObj',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalStock',
              label: $localize`Total item`,
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
              options: this.genral.getSuppliersCashew(),
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: $localize`Amount`,
              search: 'objArray',
              // group: 'poCode',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: $localize`Warehouse`,
              search: 'selectObj',
              options: this.genral.getWearhouses(),
            },
            {
                type: 'date',
                name: 'receiptDate',
                label: $localize`Receipt date`,
                search: 'dates',
            },
            {
                type: 'date',
                name: 'processDate',
                label: $localize`Process date`,
                search: 'dates',
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            },
          ];
          this.localService.getCashewInventoryItem().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
            this.cashewSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null; 
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
              options: this.genral.getSuppliersCashew(),
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: 'totalStock',
              label: $localize`Total po`,
              search: 'objArray',
              group: 'poCode',
            },
            {
              type: 'nameId',
              name: 'item',
              label: $localize`Item`,
              search: 'selectObjObj',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: $localize`Amount`,
              search: 'objArray',
              // group: 'item',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: $localize`Warehouse`,
              search: 'selectObj',
              options: this.genral.getWearhouses(),
            },
            {
                type: 'date',
                name: 'receiptDate',
                label: $localize`Receipt date`,
                search: 'dates',
            },
            {
                type: 'date',
                name: 'processDate',
                label: $localize`Process date`,
                search: 'dates',
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            }
          ];
          this.localService.getCashewInventoryByPo().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
            this.cashewSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 2:
          this.cashewSourceColumns = null; 
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'item',
              label: $localize`Item`,
              search: 'selectObjObj',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight',
              name: 'inventoryAmount',
              label: $localize`Inventory amount`,
              search: 'object',
            },
            {
              type: 'weight',
              name: 'orderedAmount',
              label: $localize`Orderd amount`,
              search: 'object',
            },
          ];
          this.localService.getCashewInventoryOrder().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
            this.cashewSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        default:
          break;
      }
    }

    inlineRangeChange($event) {
      let begin = $event.begin.value;
      let end = $event.end.value;
      // this.dataSource.data = this.dataSource.data.filter(e=>e[column] > begin && e[column] < end ) ;
    }

    applyFilter($event) {
      if($event === '') {
        this.cashewSourceColumns = this.cashewSource;
      } else {
        this.cashewSourceColumns = this.cashewSource.filter(aa => aa.item.productionUse === $event);
      }
    }

    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }
    
}