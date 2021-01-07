import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  tabIndex: number;

  dateRangeDisp= new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  cashewSourceColumns;

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
    ];
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
      data: {id: event['id'], fromNew: false, type: 'General'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit order') {
        this.router.navigate(['../NewGenralOrder',{id: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'Finalize') {
        this.tabIndex = 2;
        this.changed(2);
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
          if(this.columnsShow.length === 10) {
            this.columnsShow.splice(9, 1);
            }
          this.localService.getGeneralOrdersOpen().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [value, this.columnsShow];
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null;
          if(this.columnsShow.length === 9) {
            this.columnsShow.push({
              type: 'arrayVal',
              name: 'orderStatus',
              label: 'Status',
              search: 'select',
              options: ['OPEN', 'RECEIVED', 'REJECTED'],
            });
          }
          this.localService.getAllGeneralOrders().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [value, this.columnsShow];
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
