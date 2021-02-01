import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { Genral } from './../genral.service';
import { InventoryService } from './inventory.service';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
// import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-inventory-reports',
  template: `
  <h1 style="text-align:center">Inventory reports</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)">
      <!-- <mat-tab label="Transfers">
      </mat-tab> -->
      <mat-tab label="Relocation">
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainDetailsSource]="mainSourceColumns" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class InventoryComponent implements OnInit {
  tabIndex: number;

  dateRangeDisp= new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  mainSourceColumns;

  constructor(private router: Router, private dialog: MatDialog, private localService: InventoryService,
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
            type: 'itemWeight',
            name: 'usedItems',
            label: 'Used items',
            search: 'listAmountWithUnit',
            options: this.genral.getAllItemsCashew(),
        },
        // {
        //     type: 'itemWeight',
        //     name: 'producedItems',
        //     label: 'Produced items',
        //     search: 'listAmountWithUnit',
        //     options: this.genral.getAllItemsCashew(),
        // },
        // {
        //     type: 'weight2',
        //     name: 'processGain',
        //     label: 'Difference',
        //     search: 'object',
        // },
        {
            type: 'itemWeight',
            name: 'itemCounts',
            label: 'Counted items',
            search: 'listAmountWithUnit',
            options: this.genral.getAllItemsCashew(),
        },
        {
            type: 'weight2',
            name: 'usedCountDifference',
            label: 'Difference',
            search: 'object',
        },
        {
            type: 'dateTime',
            name: 'recordedTime',
            label: 'Recorded time',
            search: 'dates',
        },
        {
            type: 'normal',
            name: 'status',
            label: 'Status',
            search: 'select',
            options: this.genral.getProcessStatus(),
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
    const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'Transfer'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit') {
          switch (this.tabIndex) {
                case 0:
                //     this.router.navigate(['../TransferCount',{id: event['id']}], { relativeTo: this._Activatedroute });
                //     break;
                // case 1:
                    this.router.navigate(['../RelocationCount',{id: event['id'], poCode: event['poCode']['id']}], { relativeTo: this._Activatedroute });
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
        //   this.mainSourceColumns = null;
        //   this.localService.getTransferCounts().pipe(take(1)).subscribe(value => {
        //     this.mainSourceColumns = [<any[]>value, this.columnsShow];
        //     console.log(value);
            
        //   });
        //   this.cdRef.detectChanges();
        //   break;
        // case 1:
          this.mainSourceColumns = null;
          this.localService.getStorageRelocations().pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = [<any[]>value, this.columnsShow];
            console.log(value);
            
          });
          this.cdRef.detectChanges();
          break;
        case 2:
        //   this.mainSourceColumns = null;
        //   this.localService.getAllPacking().pipe(take(1)).subscribe(value => {
        //     this.mainSourceColumns = [<any[]>value, this.columnsShow];
        //   });
        //   this.type = 'Packing';
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
