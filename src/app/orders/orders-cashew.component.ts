import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { Genral } from './../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
@Component({
  selector: 'app-orders-cashew',
  templateUrl: './orders-cashew.component.html',
})
export class OrdersCashewComponent implements OnInit {
  tabIndex: number;

  dateRangeDisp = {begin: new Date(2022, 7, 5), end: new Date(2022, 7, 25)};

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  type: string = 'order';
  
  cashewSourceColumns;

  constructor(private router: Router, public dialog: MatDialog, private localService: OrdersService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
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
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'Cashew '+this.type},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit order') {
        this.router.navigate(['../NewCashewOrder',{id: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Receive') {
        this.router.navigate(['../CashewReceived',{poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Edit receive' || data === 'Receive extra') {
        this.router.navigate(['../CashewReceived',{poCode: event['poCode']['id'], id: event['id']}], { relativeTo: this._Activatedroute });
      } else {
        this.changed(this.tabIndex);
      } 
      // else if(data === 'Sample weights') {
      //   this.router.navigate(['../SampleWeights',{poCode: JSON.stringify(event['poCode'])}], { relativeTo: this._Activatedroute });
      // } 
    });
  }


    changed(event) {
      switch (+event) {
        case 0:
          this.cashewSourceColumns = null;
          this.localService.getCashewOrdersOpen().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'order';
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
              type: 'dateTime',
              name: 'contractDate',
              label: 'Contract date',
              search: 'dates',
            },
            {
              type: 'nameId',
              name: 'item',
              label: 'Product descrption',
              search: 'selectAsyncObject2',
              options: this.genral.getItemsRawCashew(),
            },
            {
              type: 'weight2',
              name: 'numberUnits',
              label: 'Amount',
              search: 'object',
              // options: 'measureUnit',
            },
            {
              type: 'currency',
              name: 'unitPrice',
              label: 'Price per unit',
              search: 'object',
              // options: 'currency',
            },
            {
              name: 'defects',
              label: '% defects',
              search: 'normal',
            },
            {
              type: 'date',
              name: 'deliveryDate',
              label: 'Delivery date',
              search: 'dates',
              compare: {
                type: 'date',
              },
            },
            {
              type: 'arrayVal',
              name: 'approvals',
              label: 'Approvals',
              search: 'object',
            },
            // {
            //   name: 'poRows',
            //   titel: 'Supplier',
            //   type: 'kidArray',
            //   collections: [
                
            //   ]
            // }
          ];
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null;
          this.localService.getPendingCashew().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'receive';
          this.columnsShow = [
            {
              type: 'idGroup',
              name: 'id',
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
              name: 'totalAmount',
              label: 'Total amount',
              search: 'object',
              group: 'poCode',
            },
            {
              type: 'nameId',
              name: 'item',
              label: 'Product descrption',
              search: 'selectAsyncObject2',
              options: this.genral.getItemsRawCashew(),
            },
            {
              type: 'weight',
              name: 'orderAmount',
              label: 'Order amount',
              search: 'object',
              compare: {
                name: 'orderBalance',
                type: 'weight',
              },
            },
            {
              type: 'weight2',
              name: 'receiptAmount',
              label: 'Receipt amount',
              search: 'object',
              compare: {
                name: 'orderBalance',
                type: 'weight',
              },
            },
            {
              type: 'weight',
              name: 'extraAdded',
              label: 'Extra requsted',
              search: 'object',
            },
            {
              type: 'dateTime',
              name: 'receiptDate',
              label: 'Receipt date',
              search: 'dates',
            },
            {
              type: 'array',
              name: 'storage',
              label: 'Storage',
              search: 'selectAsyncObject',
              options: this.genral.getStorage(),
            },
            {
              name: 'receiptRows',
              type: 'kidArray',
              collections: [
              ]
            }
          ];
          this.cdRef.detectChanges();
          break;
        case 2:
          this.cashewSourceColumns = null;
          this.localService.getReceivedCashew().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'receive';
          this.columnsShow = [
            {
              name: 'id',
              type: 'idGroup',
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
              name: 'totalAmount',
              label: 'Total receipt',
              search: 'object',
              group: 'poCode',
            },
            {
              type: 'nameId',
              name: 'item',
              label: 'Product descrption',
              search: 'selectAsyncObject2',
              options: this.genral.getItemsRawCashew(),
            },
            {
              type: 'weight',
              name: 'orderAmount',
              label: 'Order amount',
              search: 'object',
              compare: {
                name: 'orderBalance',
                type: 'weight',
              },
            },
            {
              type: 'weight2',
              name: 'receiptAmount',
              label: 'Item amount',
              search: 'object',
              compare: {
                name: 'orderBalance',
                type: 'weight',
              },
            },
            {
              type: 'weight',
              name: 'extraAdded',
              label: 'Extra requsted',
              search: 'object',
            },
            {
              type: 'dateTime',
              name: 'receiptDate',
              label: 'Receipt date',
              search: 'dates',
            },
            {
              type: 'array',
              name: 'storage',
              label: 'Storage',
              search: 'selectAsyncObject',
              options: this.genral.getStorage(),
            },
            {
              name: 'receiptRows',
              type: 'kidArray',
              collections: [
              ]
            }
          ];
          this.cdRef.detectChanges();
          break;
        case 3:
          this.cashewSourceColumns = null;
          this.localService.getAllCashewReciveRejected().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'rejected';
          this.columnsShow = [
            {
              name: 'id',
              type: 'idGroup',
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
              name: 'totalAmount',
              label: 'Total amount',
              search: 'object',
              group: 'poCode',
            },
            {
              type: 'nameId',
              name: 'item',
              label: 'Product descrption',
              search: 'selectAsyncObject2',
              options: this.genral.getItemsRawCashew(),
            },
            {
              type: 'weight',
              name: 'orderAmount',
              label: 'Order amount',
              search: 'object',
              compare: {
                name: 'orderBalance',
                type: 'weight',
              },
            },
            {
              type: 'weight2',
              name: 'receiptAmount',
              label: 'Item amount',
              search: 'object',
              compare: {
                name: 'orderBalance',
                type: 'weight',
              },
            },
            {
              type: 'weight',
              name: 'extraAdded',
              label: 'Extra requsted',
              search: 'object',
            },
            {
              type: 'dateTime',
              name: 'receiptDate',
              label: 'Receipt date',
              search: 'dates',
            },
            {
              type: 'array',
              name: 'storage',
              label: 'Storage',
              search: 'selectAsyncObject',
              options: this.genral.getStorage(),
            },
            {
              name: 'receiptRows',
              type: 'kidArray',
              collections: [
              ]
            }
          ];
          this.cdRef.detectChanges();
          break;
        case 4:
          this.cashewSourceColumns = null;
          this.localService.getHistoryCashewOrders().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'order';
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
              type: 'dateTime',
              name: 'contractDate',
              label: 'Contract date',
              search: 'dates',
            },
            {
              type: 'nameId',
              name: 'item',
              label: 'Product descrption',
              search: 'selectAsyncObject2',
              options: this.genral.getItemsRawCashew(),
            },
            {
              type: 'weight2',
              name: 'numberUnits',
              label: 'Amount',
              search: 'object',
              // options: 'measureUnit',
            },
            {
              type: 'currency',
              name: 'unitPrice',
              label: 'Price per unit',
              search: 'object',
              // options: 'currency',
            },
            {
              name: 'defects',
              label: '% defects',
              search: 'normal',
            },
            {
              type: 'date',
              name: 'deliveryDate',
              label: 'Delivery date',
              search: 'dates',
              compare: {
                type: '<',
                pipes: new Date().toISOString().substring(0, 10),
              },
            },
            {
              type: 'arrayVal',
              name: 'orderStatus',
              label: 'Status',
              search: 'select',
              options: ['OPEN', 'RECEIVED', 'REJECTED'],
            },
            // {
            //   name: 'poRows',
            //   type: 'kidArray',
            // }
          ];
          this.cdRef.detectChanges();
          break;
        default:
          break;
      }
    }

    
    // not implemnted yet
    // <mat-form-field floatLabel="never" >
    //     <input matInput placeholder="Choose dates" [satDatepicker]="picker2" (dateChange)="inlineRangeChange($event.value)" [value]="dateRangeDisp">
    //     <sat-datepicker #picker2 [rangeMode]="true"></sat-datepicker>
    //     <sat-datepicker-toggle  matSuffix [for]="picker2"></sat-datepicker-toggle>
    // </mat-form-field>
    // inlineRangeChange($event) {
    //   let begin = $event.begin.value;
    //   let end = $event.end.value;
    //   // this.dataSource.data = this.dataSource.data.filter(e=>e[column] > begin && e[column] < end ) ;
    // }

}
