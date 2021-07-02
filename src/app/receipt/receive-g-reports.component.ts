import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { ReceiptDialog } from './receipt-dialog.component';
import { ReceiptService } from './receipt.service';

@Component({
  selector: 'receive-g-reports',
  template: `
  <h1 style="text-align:center" i18n>General Receivings</h1>
  <div class="centerButtons">
    <button mat-raised-button color="primary" routerLink='../ReceiveGOrder' i18n>Receive General Order</button>
  </div>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Pending(received)" i18n-label>
      </mat-tab>
      <mat-tab label="Finalized" i18n-label>
      </mat-tab>
      <mat-tab label="All" i18n-label>
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="generalSourceColumns" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class ReceiveGReports implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;
  
  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  generalSourceColumns;

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
        options: this.genral.getSuppliersGeneral(),
        group: 'poCode',
      },
      // {
      //   type: 'weight2',
      //   name: 'totalAmount',
      //   label: 'Total receipt',
      //   search: 'object',
      //   group: 'poCode',
      // },
      {
        type: 'nameId',
        name: 'item',
        label: $localize`Product descrption`,
        search: 'selectObjObj',
        options: this.genral.getItemsGeneral(),
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
      data: {id: event['id'], fromNew: false, type: 'General'},
    });
    dialogRef.afterClosed().subscribe(data => {
      // if (data === 'Edit order') {
      //   this.router.navigate(['Main/ordready/NewGenralOrder',{id: event['poCode']['id']}]);
      // } else if(data === 'Finalize') {
      //   this.tabIndex = 1;
      //   this.changed(1);
      // } else 
      if(data === $localize`Receive`) {
        this.router.navigate(['../ReceiveGOrder',{poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
      } else if(data === $localize`Edit receive`) {
        this.router.navigate(['../ReceiveGOrder',{poCode: event['poCode']['id'], id: event['id']}], { relativeTo: this._Activatedroute });
      } else if(data === 'reload') {
        this.changed(this.tabIndex);
      }
    });
  }


    changed(event) {
      switch (+event) {
        case 0:
          this.generalSourceColumns = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'status');
          if(ind !== -1) {
              this.columnsShow.splice(ind, 1);
              this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getPendingGeneral().pipe(take(1)).subscribe(value => {
            this.generalSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.generalSourceColumns = null;
          var ind = this.columnsShow.findIndex((em) => em['name'] === 'status');
          if(ind !== -1) {
              this.columnsShow.splice(ind, 1);
              this.columnsShow = this.columnsShow.slice();
          }
          this.localService.getReceivedGeneral().pipe(take(1)).subscribe(value => {
            this.generalSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 2:
          this.generalSourceColumns = null;
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
          this.localService.findGeneralReceiptsHistory().pipe(take(1)).subscribe(value => {
            this.generalSourceColumns = value;
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
