import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { Genral } from './../genral.service';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
@Component({
  selector: 'app-productions',
  templateUrl: './productions.component.html',
})
export class ProductionsComponent implements OnInit {
  tabIndex: number;

  dateRangeDisp = {begin: new Date(2022, 7, 5), end: new Date(2022, 7, 25)};

  columnsShow: OneColumn[];

  totelColumn: OneColumn = {
      type: 'weight2',
      name: 'processGain',
      label: 'Total difference',
      group: 'poCode',
  };
  type: string = '';
  
  cashewSourceColumns;

  constructor(private router: Router, public dialog: MatDialog, private localService: ProductionService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
        if(params.get('number')) {
            this.tabIndex = +params.get('number');
            this.changed(+params.get('number'));
        } else {
            this.tabIndex = 0;
            this.changed(0);
        }
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
              type: 'amountWithUnit',
              name: 'usedItems',
              label: 'Used items',
              search: 'listAmountWithUnit',
              options: this.genral.getAllItemsCashew(),
          },
          {
              type: 'amountWithUnit',
              name: 'producedItems',
              label: 'Produced items',
              search: 'listAmountWithUnit',
              options: this.genral.getAllItemsCashew(),
          },
          {
              type: 'weight2',
              name: 'processGain',
              label: 'Difference',
              search: 'array2',
          },
          {
              type: 'dateTime',
              name: 'recordedTime',
              label: 'Recorded time',
              search: 'dates',
          },
          // {
          //     type: 'date',
          //     name: 'receiptDate',
          //     label: 'Receipt date',
          //     search: 'dates',
          // },
          // {
          //     type: 'date',
          //     name: 'processDate',
          //     label: 'Process date',
          //     search: 'dates',
          // },
      ];
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.type},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit') {
          switch (this.tabIndex) {
                case 0:
                    this.router.navigate(['../Cleaning',{id: event['id'], poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
                    break;
                case 1:
                    this.router.navigate(['../Roasting',{id: event['id'], poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
                    break;
                case 2:
                    this.router.navigate(['../Packing',{id: event['id'], poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
                    break;
          
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
          this.localService.getAllCleaning().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'Cleaning';
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null;
          this.localService.getAllRoasting().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'Roasting';
          this.cdRef.detectChanges();
          break;
        case 2:
          this.cashewSourceColumns = null;
          this.localService.getAllPacking().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'Packing';
          this.cdRef.detectChanges();
          break;
        // case 3:
        //   this.cashewSourceColumns = null;
        //   this.localService.getAllCashewOrders().pipe(take(1)).subscribe(value => {
        //     this.cashewSourceColumns = [<any[]>value, this.columnsShow];
        //     console.log(value);
            
        //   });
        //   this.type = 'history';
        //   this.columnsShow = [
        //     {
        //       name: 'poCode',
        //       titel: 'PO#',
        //       type: 'object',
        //       pipes: 'object',
        //       group: 'poCode',
        //     },
        //     {
        //       name: 'totalAmount',
        //       titel: 'Total amount',
        //       type: 'object',
        //       pipes: 'object',
        //       group: 'poCode',
        //     },
        //     {
        //       name: 'supplierName',
        //       titel: 'Supplier',
        //       type: 'selectAsyncObject',
        //       options: this.localService.getSupplierCashew(),
        //       group: 'poCode',
        //     },
        //     {
        //       name: 'itemName',
        //       titel: 'Product descrption',
        //       type: 'selectAsyncObject',
        //       options: this.genral.getItemsCashew(),
        //       group: 'itemName',
        //     },
        //     {
        //       name: 'numberUnits',
        //       titel: 'Amount',
        //       type: 'object',
        //       pipes: 'object',
        //       // options: 'measureUnit',
        //     },
        //     {
        //       name: 'unitPrice',
        //       titel: 'Price per unit',
        //       type: 'object',
        //       pipes: 'object',
        //       // options: 'currency',
        //     },
        //     {
        //       name: 'defects',
        //       titel: '% defects',
        //       type: 'normal',
        //     },
        //     {
        //       name: 'contractDate',
        //       titel: 'Contract date',
        //       type: 'dates',
        //       pipes: 'datesTime',
        //     },
        //     {
        //       name: 'deliveryDate',
        //       titel: 'Delivery date',
        //       type: 'dates',
        //       pipes: 'dates',
        //       compare: {
        //         type: '<',
        //         pipes: new Date().toISOString().substring(0, 10),
        //       },
        //     },
        //     {
        //       name: 'orderStatus',
        //       titel: 'Order status',
        //       type: 'select',
        //       options: this.genral.getProcessStatus(),
        //     },
        //     {
        //       name: 'poRows',
        //       titel: 'Supplier',
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

    

    inlineRangeChange($event) {
      let begin = $event.begin.value;
      let end = $event.end.value;
      // this.dataSource.data = this.dataSource.data.filter(e=>e[column] > begin && e[column] < end ) ;
    }

}
