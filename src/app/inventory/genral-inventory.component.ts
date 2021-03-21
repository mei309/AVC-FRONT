import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from './../field.interface';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-genral-inventory',
  template: `
  <h1 style="text-align:center">General inventory</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)">
      <mat-tab label="General stock by item">
      </mat-tab>
      <mat-tab label="General stock by PO#">
      </mat-tab>
      <mat-tab label="General stock and orders">
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainDetailsSource]="generalSourceColumns">
  </search-group-details>
    `
})
export class GenralInventoryComponent implements OnInit {

  dateRangeDisp = {begin: new Date(2020, 7, 5), end: new Date(2020, 7, 25)};
  tabIndex: number = 0;
  columnsShow: OneColumn[];

  generalSource: any[];
  generalSourceColumns: any[];

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
          this.generalSourceColumns = null; 
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'item',
              label: 'Item',
              search: 'selectAsyncObject2',
              options: this.genral.getItemsGeneral(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalStock',
              label: 'Total stock',
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
              options: this.genral.getSuppliersGeneral(),
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: 'Total balance',
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
              name: 'poInventoryRows',
              type: 'kidArray',
            },
          ];
          this.localService.getGeneralInventoryItem().pipe(take(1)).subscribe(value => {
            this.generalSource = <any[]>value;
            this.generalSourceColumns = [this.generalSource, this.columnsShow];
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.generalSourceColumns = null; 
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
              label: 'Item',
              search: 'selectAsyncObject2',
              options: this.genral.getItemsGeneral(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: 'Total balance',
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
              name: 'poInventoryRows',
              type: 'kidArray',
            }
          ];
          this.localService.getGeneralInventoryByPo().pipe(take(1)).subscribe(value => {
            this.generalSource = <any[]>value;
            this.generalSourceColumns = [this.generalSource, this.columnsShow];
          });
          this.cdRef.detectChanges();
          break;
        case 2:
            this.generalSourceColumns = null; 
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
            this.localService.getGeneralInventoryOrder().pipe(take(1)).subscribe(value => {
              this.generalSource = <any[]>value;
              this.generalSourceColumns = [<any[]>value, this.columnsShow];
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
    
}