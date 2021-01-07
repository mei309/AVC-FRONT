import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { ReceiptDialog } from './receipt-dialog.component';
import { ReceiptService } from './receipt.service';

@Component({
  selector: 'receive-g-reports',
  template: `
  <h1 style="text-align:center">General Receivings</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)">
      <mat-tab label="Pending(received)">
      </mat-tab>
      <mat-tab label="Received">
      </mat-tab>
      <mat-tab label="All Receivings">
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainDetailsSource]="cashewSource" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class ReceiveGReports implements OnInit {
  tabIndex: number;
  
  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  cashewSourceColumns;

  constructor(private router: Router, public dialog: MatDialog, private localService: ReceiptService,
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
    const dialogRef = this.dialog.open(ReceiptDialog, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'General'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit order') {
        this.router.navigate(['Main/ordready/NewGenralOrder',{id: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Finalize') {
        this.tabIndex = 1;
        this.changed(1);
      } else if(data === 'Receive') {
        this.router.navigate(['../ReceiveGOrder',{poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Edit receive') {
        this.router.navigate(['../ReceiveGOrder',{poCode: event['poCode']['id'], id: event['id']}], { relativeTo: this._Activatedroute });
      }
    });
  }


    changed(event) {
      switch (+event) {
        case 0:
          this.cashewSourceColumns = null;
          this.localService.getPendingGeneral().pipe(take(1)).subscribe(value => {
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
              options: this.genral.getWearhouses(),
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
        case 1:
          this.cashewSourceColumns = null;
          this.localService.getReceivedGeneral().pipe(take(1)).subscribe(value => {
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
              options: this.genral.getWearhouses(),
            },
          ];
          this.cdRef.detectChanges();
          break;
        case 2:
        //   this.cashewSourceColumns = null;
        //   this.localService.getAllGeneralOrders().pipe(take(1)).subscribe(value => {
        //     this.cashewSourceColumns = [<any[]>value, this.columnsShow];
        //   });
        //   this.type = 'history';
        //   this.columnsShow = [
        //     {
        //       type: 'nameId',
        //       name: 'poCode',
        //       label: 'PO#',
        //       search: 'object',
        //       group: 'poCode',
        //     },
        //     {
        //       name: 'supplierName',
        //       label: 'Supplier',
        //       search: 'selectAsyncObject',
        //       options: this.genral.getSupplierCashew(),
        //       group: 'poCode',
        //     },
        //     {
        //       type: 'dateTime',
        //       name: 'contractDate',
        //       label: 'Contract date',
        //       search: 'dates',
        //     },
        //     {
        //       type: 'weight2',
        //       name: 'totalAmount',
        //       label: 'Total amount',
        //       search: 'object',
        //       group: 'poCode',
        //     },
        //     {
        //       type: 'nameId',
        //       name: 'item',
        //       label: 'Product descrption',
        //       search: 'selectAsyncObject2',
        //       options: this.genral.getItemsRawCashew(),
        //     },
        //     {
        //       type: 'weight',
        //       name: 'numberUnits',
        //       label: 'Amount',
        //       search: 'object',
        //     },
        //     {
        //       type: 'currency',
        //       name: 'unitPrice',
        //       label: 'Price per unit',
        //       search: 'object',
        //     },
        //     {
        //       type: 'date',
        //       name: 'deliveryDate',
        //       label: 'Delivery date',
        //       search: 'dates',
        //       compare: {
        //         type: 'date',
        //       },
        //     },
        //     {
        //       name: 'orderStatus',
        //       label: 'Order status',
        //       search: 'select',
        //       options: this.genral.getProcessStatus(),
        //     },
        //     {
        //       name: 'poRows',
        //       type: 'kidArray',
        //       collections: [
                
        //       ]
        //     }
        //   ];
        //   this.cdRef.detectChanges();
        //   break;
        default:
          break;
      }
    }


}
