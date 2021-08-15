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
  <div class="centerButtons">
    <button mat-raised-button color="primary" routerLink='../ReceiveCOrder' i18n>Receive Cashew Order</button>
    <button mat-raised-button color="primary" routerLink='../ReceiveCAlone' i18n>Receive Cashew Without Order</button>
  </div>
  <h1 style="text-align:center" i18n>Cashew Receivings</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Pending(received)" i18n-label>
      </mat-tab>
      <mat-tab label="Finalized" i18n-label>
      </mat-tab>
      <mat-tab label="All" i18n-label>
      </mat-tab>
  </mat-tab-group>
  <date-range-select [hidden]="!tabIndex" (submitRange)="setDateRange($event)"></date-range-select>
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

  dateRange;
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
        name: 'totalAmount',
        label: $localize`Total receipt`,
        search: 'objArray',
        group: 'poCode',
      },
      {
        type: 'nameId',
        name: 'item',
        label: $localize`Product descrption`,
        search: 'selectObjObj',
        options: this.genral.getItemsCashew('Raw'),
      },
      {
        type: 'weight',
        name: 'receivedOrderUnits',
        label: $localize`Payable units`,
        search: 'object',
        compare: {
          name: 'orderBalance',
          type: 'weight',
        },
      },
      {
        type: 'weight2',
        name: 'receiptAmount',
        label: $localize`Item amount`,
        search: 'objArray',
        compare: {
          name: 'orderBalance',
          type: 'weight',
        },
      },
      {
        type: 'weight',
        name: 'extraAdded',
        label: $localize`Extra requsted`,
        search: 'object',
      },
      {
        type: 'dateTime',
        name: 'receiptDate',
        label: $localize`Receipt date`,
        search: 'dates',
      },
      {
        type: 'array',
        name: 'storage',
        label: $localize`Storage`,
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

  openDialog(event): void {
    const dialogRef = this.dialog.open(ReceiptDialog, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'Cashew'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data === $localize`Receive`) {
        this.router.navigate(['../ReceiveCOrder',{poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === $localize`Edit receive` || data === $localize`Receive extra`) {
        this.router.navigate(['../ReceiveCOrder',{poCode: event['poCode']['id'], id: event['id']}], { relativeTo: this._Activatedroute });
      } else if(dialogRef.componentInstance.approveChange) {
        this.changedAndDate(this.tabIndex);
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
          this.localService.getReceivedCashew(this.dateRange).pipe(take(1)).subscribe(value => {
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
                label: $localize`Status`,
                search: 'select',
                options: this.genral.getProcessStatus(),
              });
              this.columnsShow = this.columnsShow.slice();
            }
          this.localService.findCashewReceiptsHistory(this.dateRange).pipe(take(1)).subscribe(value => {
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
