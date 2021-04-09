import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { ReceiptDialog } from './receipt-dialog.component';
import { ReceiptService } from './receipt.service';
@Component({
  selector: 'receive-c-reports',
  template: `
  <h1 style="text-align:center">Cashew Receivings</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)">
      <mat-tab label="Pending(received)">
      </mat-tab>
      <mat-tab label="Finalized">
      </mat-tab>
      <mat-tab label="All">
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSource" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class ReceiveCReports implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;

  dateRangeDisp = {begin: new Date(2022, 7, 5), end: new Date(2022, 7, 25)};

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  cashewSource;

  
  constructor(private router: Router, public dialog: MatDialog, private localService: ReceiptService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
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
        search: 'selectObj',
        options: this.genral.getSuppliersCashew(),
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
        search: 'selectObjObj',
        options: this.genral.getItemsRawCashew(),
      },
      {
        type: 'weight',
        name: 'receivedOrderUnits',
        label: 'Payable units',
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
        search: 'selectObj',
        options: this.genral.getWearhouses(),
      },
      {
        name: 'receiptRows',
        type: 'kidArray',
        collections: [
        ]
      }
    ];
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
            this.changed(+params.get('number'));
          } else {
            this.changed(0);
          }
        });
      }
    });
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(ReceiptDialog, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'Cashew'},
    });
    dialogRef.afterClosed().subscribe(data => {
      // if (data === 'Edit order') {
      //   this.router.navigate(['Main/ordready/NewCashewOrder',{id: event['poCode']['id']}]);
      // } else 
      if(data === 'Receive') {
        this.router.navigate(['../ReceiveCOrder',{poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Edit receive' || data === 'Receive extra') {
        this.router.navigate(['../ReceiveCOrder',{poCode: event['poCode']['id'], id: event['id']}], { relativeTo: this._Activatedroute });
      } else {
        this.changed(this.tabIndex);
      }
    });
  }


    changed(event) {
      switch (+event) {
        case 0:
          this.cashewSource = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'status');
          if(ind !== -1) {
              this.columnsShow.splice(ind, 1);
              this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getPendingCashew().pipe(take(1)).subscribe(value => {
            this.cashewSource = value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSource = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'status');
          if(ind !== -1) {
              this.columnsShow.splice(ind, 1);
              this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getReceivedCashew().pipe(take(1)).subscribe(value => {
            this.cashewSource = value;
          });
          
          this.cdRef.detectChanges();
          break;
        case 2:
          this.cashewSource = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'status');
          if(ind === -1) {
            this.columnsShow.push({
                type: 'normal',
                name: 'status',
                label: 'Status',
                search: 'select',
                options: this.genral.getProcessStatus(),
              });
              this.columnsShow = this.columnsShow.slice();
            }
          this.localService.findCashewReceiptsHistory().pipe(take(1)).subscribe(value => {
            this.cashewSource = value;
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
