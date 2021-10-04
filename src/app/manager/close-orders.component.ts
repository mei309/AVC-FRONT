import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { ManagerService } from './manager.service';
@Component({
  selector: 'orders-close-component',
  template: `
  <h1 style="text-align:center" i18n>Cashew Open Orders</h1>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSource" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class OrdersCloseComponent implements OnInit {

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];

  cashewSource;

  constructor(public dialog: MatDialog, private localService: ManagerService, private genral: Genral) {
  }

  ngOnInit() {
    this.localService.getCashewOrdersOpen().pipe(take(1)).subscribe(value => {
      this.cashewSource = value;
    });
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
        options: this.genral.getSuppliersCashew(),
        group: 'poCode',
      },
      {
        type: 'dateTime',
        name: 'contractDate',
        label: $localize`Contract date`,
        search: 'dates',
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
        name: 'defects',
        label: $localize`% defects`,
        search: 'normal',
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
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(ConfirmCloseOrderDialog, {
      width: '80%',
      data: {id: event.id}
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'closedOrder') {
        this.localService.getCashewOrdersOpen().pipe(take(1)).subscribe(value => {
          this.cashewSource = value;
        });
      }
    });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  template: `
  <h1 style="text-align:center" i18n>Are you sure you want to close this order??</h1>
  <mat-dialog-actions align="end">
    <button  mat-raised-button color="accent" (click)="confirm()" i18n>Confirm</button>
    <button  mat-raised-button color="accent" (click)="onNoClick()" i18n>Reject</button>
  </mat-dialog-actions>
    `
})
export class ConfirmCloseOrderDialog {

  id;

  constructor(private localService: ManagerService, public dialogRef: MatDialogRef<ConfirmCloseOrderDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: any) {
      this.id = data.id;
    }

  confirm(){
    this.localService.closeOrder(this.id).pipe(take(1)).subscribe(value => {
      this.dialogRef.close('closedOrder');
    });
  }

  onNoClick(): void {
    this.dialogRef.close('closed');
  }
}
