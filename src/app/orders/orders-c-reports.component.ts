import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
@Component({
  selector: 'orders-c-reports',
  template: `
  <h1 style="text-align:center">Cashew Orders</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)">
      <mat-tab label="Open">
      </mat-tab>
      <mat-tab label="All">
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSource" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class OrdersCReports implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;

  dateRangeDisp = {begin: new Date(2022, 7, 5), end: new Date(2022, 7, 25)};

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  cashewSource;

  constructor(private router: Router, public dialog: MatDialog, private localService: OrdersService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
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
        search: 'selectObj',
        options: this.genral.getSuppliersCashew(),
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
        search: 'selectObjObj',
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
          condition: 'RECEIVED',
          condVar: 'orderStatus',
        },
      },
      {
        type: 'arrayVal',
        name: 'approvals',
        label: 'Approvals',
        search: 'object',
      },
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
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'Cashew'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit order') {
        this.router.navigate(['../NewCashewOrder',{id: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Receive') {
        this.router.navigate(['Main/receiptready/ReceiveCOrder',{poCode: event['poCode']['id']}]);
      } else if(data === 'Edit receive' || data === 'Receive extra') {
        this.router.navigate(['Main/receiptready/ReceiveCOrder',{poCode: event['poCode']['id'], id: event['id']}]);
      } else {
        this.changed(this.tabIndex);
      }
    });
  }


    changed(event) {
      switch (+event) {
        case 0:
          this.cashewSource = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'orderStatus');
          if(ind !== -1) {
              this.columnsShow.splice(ind, 1);
              this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getCashewOrdersOpen().pipe(take(1)).subscribe(value => {
            this.cashewSource = value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSource = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'orderStatus');
          if(ind === -1) {
              this.columnsShow.push({
                type: 'arrayVal',
                name: 'orderStatus',
                label: 'Status',
                search: 'select',
                options: this.genral.getOrderStatus(),
              });
              this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getHistoryCashewOrders().pipe(take(1)).subscribe(value => {
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
