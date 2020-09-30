import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { QcService } from './qc.service';
import { QcDetailsDialogComponent } from './qc-details-dialog.component';
@Component({
  selector: 'app-all-qcs',
  templateUrl: './all-qcs.component.html',
})
export class AllQcsComponent implements OnInit {
  tabIndex: number;

  dateRangeDisp = {begin: new Date(2022, 7, 5), end: new Date(2022, 7, 25)};

  columnsShow: OneColumn[];

  type: string = 'order';
  
  cashewSourceColumns;

  constructor(private router: Router, public dialog: MatDialog, private localService: QcService,
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
    const dialogRef = this.dialog.open(QcDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.type+' QC'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit') {
        if(event['precentage']) {
          this.router.navigate(['../RawPercntage',{id: event['id']}], { relativeTo: this._Activatedroute });
        } else {
          this.router.navigate(['../Raw',{id: event['id']}], { relativeTo: this._Activatedroute });
        }
      }
      // else if() {
      //   this.router.navigate(['../Bouns'], { relativeTo: this._Activatedroute });
      // } 
      // else if(data === 'Finalize') {
      //   this.tabIndex = 2;
      //   this.changed(2);
      // } else if(data === 'Receive') {
      //   this.router.navigate(['../CashewReceived',{poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      // } else if(data === 'Edit receive' || data === 'Receive extra') {
      //   this.router.navigate(['../CashewReceived',{poCode: event['poCode']['id'], id: event['id']}], { relativeTo: this._Activatedroute });
      // } else if(data === 'Sample weights') {
      //   this.router.navigate(['../SampleWeights',{poCode: JSON.stringify(event['poCode'])}], { relativeTo: this._Activatedroute });
      // } 
    });
  }


    changed(event) {
      switch (+event) {
        case 0:
          this.cashewSourceColumns = null;
          this.localService.getRawQC().pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = [<any[]>value, this.columnsShow];
            console.log(value);
            
          });
          this.type = 'Raw';
          this.columnsShow = [
            {
              name: 'id',
              titel: 'id',
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
              options: this.localService.getSupplierCashew(),
              group: 'poCode',
            },
            {
              name: 'itemName',
              label: 'Product descrption',
              search: 'selectAsyncObject',
              options: this.genral.getAllItemsCashew(),
            },
            {
              type: 'percentNormal',
              name: 'totalDamage',
              label: 'Total damage',
              search: 'normal',
            },
            {
              type: 'percentNormal',
              name: 'totalDefects',
              label: 'Total defects',
              search: 'normal',
            },
            {
              type: 'percentNormal',
              name: 'totalDefectsAndDamage',
              label: 'Total defects + damage',
              search: 'normal',
            },
            {
              type: 'dateTime',
              name: 'checkDate',
              label: 'Check date',
              search: 'dates',
            },
          ];
          this.cdRef.detectChanges();
          break;
        case 1:
        //   this.cashewSourceColumns = null;
        //   this.localService.getPendingCashew().pipe(take(1)).subscribe(value => {
        //     this.cashewSourceColumns = [<any[]>value, this.columnsShow];
        //   });
        //   this.type = 'receive';
        //   this.columnsShow = [
        //     {
        //       name: 'id',
        //       titel: 'id',
        //       type: 'idGroup',
        //     },
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
        //       options: this.localService.getItemsCashew(),
        //     },
        //     {
        //       name: 'orderAmount',
        //       titel: 'Order amount',
        //       type: 'object',
        //       pipes: 'object',
        //       compare: {
        //         name: 'receiptAmount',
        //         type: '>lbkg',
        //         // pipes: 'amount',
        //       },
        //     },
        //     {
        //       name: 'receiptAmount',
        //       titel: 'Receipt amount',
        //       type: 'object',
        //       pipes: 'object',
        //       compare: {
        //         name: 'orderAmount',
        //         type: '<lbkg',
        //         // pipes: 'amount',
        //       },
        //     },
        //     {
        //       name: 'receiptDate',
        //       titel: 'Receipt date',
        //       type: 'dates',
        //       pipes: 'datesTime',
        //     },
        //     {
        //       name: 'storage',
        //       titel: 'Storage',
        //       type: 'selectAsyncObject',
        //       options: this.genral.getStorage(),
        //       pipes: 'array',
        //     },
        //     {
        //       name: 'receiptRows',
        //       titel: 'Supplier',
        //       type: 'kidArray',
        //       collections: [
        //       ]
        //     }
        //   ];
        //   this.cdRef.detectChanges();
          break;
        case 2:
        //   this.cashewSourceColumns = null;
        //   this.localService.getReceivedCashew().pipe(take(1)).subscribe(value => {
        //     this.cashewSourceColumns = [<any[]>value, this.columnsShow];
        //   });
        //   this.type = 'receive';
        //   this.columnsShow = [
        //     {
        //       name: 'id',
        //       titel: 'id',
        //       type: 'idGroup',
        //     },
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
        //       options: this.localService.getItemsCashew(),
        //     },
        //     {
        //       name: 'orderAmount',
        //       titel: 'Order amount',
        //       type: 'object',
        //       pipes: 'object',
        //       compare: {
        //         name: 'receiptAmount',
        //         type: '>lbkg',
        //         // pipes: 'amount',
        //       },
        //     },
        //     {
        //       name: 'receiptAmount',
        //       titel: 'Receipt amount',
        //       type: 'object',
        //       pipes: 'object',
        //       compare: {
        //         name: 'orderAmount',
        //         type: '<lbkg',
        //         // pipes: 'amount',
        //       },
        //     },
        //     {
        //       name: 'receiptDate',
        //       titel: 'Receipt date',
        //       type: 'dates',
        //       pipes: 'datesTime',
        //     },
        //     {
        //       name: 'storage',
        //       titel: 'Storage',
        //       type: 'selectAsyncObject',
        //       options: this.genral.getStorage(),
        //       pipes: 'array',
        //     },
        //     {
        //       name: 'receiptRows',
        //       titel: 'Supplier',
        //       type: 'kidArray',
        //       collections: [
        //       ]
        //     }
        //   ];
        //   this.cdRef.detectChanges();
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
