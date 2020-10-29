import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { Genral } from './../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
@Component({
  selector: 'app-orders-genral',
  templateUrl: './orders-genral.component.html',
})
export class OrdersGenralComponent implements OnInit {
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
      data: {id: event['id'], fromNew: false, type: 'General '+this.type},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit order') {
        this.router.navigate(['../NewGenralOrder',{id: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } 
      // else if() {
      //   this.router.navigate(['../Bouns'], { relativeTo: this._Activatedroute });
      // } 
      else if(data === 'Finalize') {
        this.tabIndex = 2;
        this.changed(2);
      } else if(data === 'Receive') {
        this.router.navigate(['../GenralReceived',{poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Edit receive') {
        this.router.navigate(['../GenralReceived',{poCode: event['poCode']['id'], id: event['id']}], { relativeTo: this._Activatedroute });
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
          this.localService.getGeneralOrdersOpen().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
            console.log(value);
            
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
              name: 'numberUnits',
              label: 'Amount',
              search: 'object',
            },
            {
              type: 'currency',
              name: 'unitPrice',
              label: 'Price per unit',
              search: 'object',
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
              name: 'poRows',
              type: 'kidArray',
              collections: [
              ]
            }
          ];
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null;
          this.localService.getPendingGeneral().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'receive';
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
              type: 'weight',
              name: 'receiptAmount',
              label: 'Receipt amount',
              search: 'object',
              compare: {
                name: 'orderBalance',
                type: 'weight',
              },
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
          this.localService.getReceivedGeneral().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'receive';
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
            // {
            //   name: 'receiptRows',
            //   type: 'kidArray',
            //   collections: [
            //   ]
            // }
          ];
          this.cdRef.detectChanges();
          break;
        case 3:
          this.cashewSourceColumns = null;
          this.localService.getAllGeneralOrders().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'history';
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
              name: 'numberUnits',
              label: 'Amount',
              search: 'object',
            },
            {
              type: 'currency',
              name: 'unitPrice',
              label: 'Price per unit',
              search: 'object',
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
              name: 'orderStatus',
              label: 'Order status',
              search: 'select',
              options: this.genral.getProcessStatus(),
            },
            {
              name: 'poRows',
              type: 'kidArray',
              collections: [
                
              ]
            }
          ];
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
