import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
@Component({
  selector: 'orders-g-reports',
  templateUrl: './orders-g-reports.component.html',
})
export class OrdersGReports implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;

  
  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  cashewSourceColumns;

  dateRange;

  constructor(private router: Router, public dialog: MatDialog, private localService: OrdersService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
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
      {
        type: 'dateTime',
        name: 'contractDate',
        label: $localize`Contract date`,
        search: 'dates',
      },
      {
        type: 'nameId',
        name: 'item',
        label: $localize`Product descrption`,
        search: 'selectObjObj',
        options: this.genral.getItemsGeneral(),
      },
      {
        type: 'weight2',
        name: 'numberUnits',
        label: $localize`Amount`,
        search: 'objArray',
        // options: 'measureUnit',
      },
      {
        type: 'currency',
        name: 'unitPrice',
        label: $localize`Price per unit`,
        search: 'object',
        // options: 'currency',
      },
      {
        type: 'date',
        name: 'deliveryDate',
        label: $localize`Delivery date`,
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
        label: $localize`Approvals`,
        search: 'normal',
      },
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
            this.changedAndDate(+params.get('number'));
          } else {
            this.changedAndDate(0);
          }
        });
      }
    });
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'General'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit order') {
        this.router.navigate(['../NewGenralOrder',{id: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Receive') {
        this.router.navigate(['Main/receiptready/ReceiveGOrder',{poCode: event['poCode']['id']}]);
      } else if(data === 'Edit receive') {
        this.router.navigate(['Main/receiptready/ReceiveGOrder',{poCode: event['poCode']['id'], id: event['id']}]);
      } else if(data === 'reload') {
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
          this.cashewSourceColumns = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'orderStatus');
          if(ind !== -1) {
              this.columnsShow.splice(ind, 1);
              this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getGeneralOrdersOpen().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'orderStatus');
          if(ind === -1) {
            this.columnsShow.push({
              type: 'arrayVal',
              name: 'orderStatus',
              label: $localize`Status`,
              search: 'select',
              options: this.genral.getOrderStatus(),
            });
            this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getAllGeneralOrders(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = value;
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
