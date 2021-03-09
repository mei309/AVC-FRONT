import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from './../field.interface';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-cashew-inventory',
  template: `
  <h1 style="text-align:center">Cashew inventory</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)">
      <mat-tab label="Cashew stock by item">
          <div class="centerButtons">
              <mat-form-field style="margin-bottom:10px; margin-left:25px;" >
                  <mat-select placeholder="Categories" (selectionChange)="applyFilter($event.value)">
                    <mat-option value="">--all--</mat-option>
                    <mat-option *ngFor="let item of itemCategory" [value]="item">{{item}}</mat-option>
                  </mat-select>
              </mat-form-field>
          </div>
      </mat-tab>
      <mat-tab label="Cashew stock by PO#">
      </mat-tab>
      <mat-tab label="Raw cashew stock and orders">
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainDetailsSource]="cashewSourceColumns">
  </search-group-details>
    `
})
export class CashewInventoryComponent implements OnInit {

  dateRangeDisp = {begin: new Date(2020, 7, 5), end: new Date(2020, 7, 25)};
  tabIndex: number;
  columnsShow: OneColumn[];

  cashewSource: any[];
  cashewSourceColumns;

  itemCategory;

  // sumsSource;
  

  constructor(public dialog: MatDialog, private localService: InventoryService, private genral: Genral,
    private _Activatedroute: ActivatedRoute, private cdRef:ChangeDetectorRef) {
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
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'Inventory item'},
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
          this.localService.getCashewInventoryItem().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
            // this.sumsSource = [this.cashewSource, ['personInCharge', 'itemName']];
          });
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'item',
              label: 'Item',
              search: 'selectAsyncObject2',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalStock',
              label: 'Total item',
              search: 'object',
              group: 'item',
            },
            {
              type: 'nameId',
              name: 'poCode',
              label: 'PO#',
              search: 'object',
              group: 'poCode',
            },
            {
              name: 'supplierName',
              label: 'Supplier',
              search: 'selectAsyncObject',
              options: this.genral.getSupplierCashew(),
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: 'Amount',
              search: 'object',
              // group: 'poCode',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: 'Warehouse',
              search: 'selectAsyncObject',
              options: this.genral.getWearhouses(),
            },
            {
                type: 'date',
                name: 'receiptDate',
                label: 'Receipt date',
                search: 'dates',
            },
            {
                type: 'date',
                name: 'processDate',
                label: 'Process date',
                search: 'dates',
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            },
          ];
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null; 
          this.localService.getCashewInventoryByPo().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'poCode',
              label: 'PO#',
              search: 'object',
              group: 'poCode',
            },
            {
              name: 'supplierName',
              label: 'Supplier',
              search: 'selectAsyncObject',
              options: this.genral.getSupplierCashew(),
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: 'totalStock',
              label: 'Total po',
              search: 'object',
              group: 'poCode',
            },
            {
              type: 'nameId',
              name: 'item',
              label: 'Item',
              search: 'selectAsyncObject2',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: 'Amount',
              search: 'object',
              // group: 'item',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: 'Warehouse',
              search: 'selectAsyncObject',
              options: this.genral.getWearhouses(),
            },
            {
                type: 'date',
                name: 'receiptDate',
                label: 'Receipt date',
                search: 'dates',
            },
            {
                type: 'date',
                name: 'processDate',
                label: 'Process date',
                search: 'dates',
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            }
          ];
          this.cdRef.detectChanges();
          break;
        case 2:
          this.cashewSourceColumns = null; 
          this.localService.getCashewInventoryOrder().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'item',
              label: 'Item',
              search: 'selectAsyncObject2',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight',
              name: 'inventoryAmount',
              label: 'Inventory amount',
              search: 'object',
            },
            {
              type: 'weight',
              name: 'orderedAmount',
              label: 'Orderd amount',
              search: 'object',
            },
          ];
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
        this.cashewSourceColumns = [this.cashewSource, this.columnsShow];
      } else {
        this.cashewSourceColumns = [this.cashewSource.filter(aa => aa.item.productionUse === $event), this.columnsShow];
      }
    }
    
}