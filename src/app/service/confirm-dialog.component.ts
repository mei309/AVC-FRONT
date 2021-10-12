import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  template: `
    <h1 mat-dialog-title i18n>Process Managment</h1>
    <h3 style="color: red">{{message}}</h3>
    <mat-dialog-content>
      <div *ngIf="manager" class="mat-checbox-group">
          <mat-checkbox [disabled]="locked" [(ngModel)]="toLock" i18n>Lock</mat-checkbox>
          <mat-checkbox [disabled]="fineled" [(ngModel)]="toFinal" i18n>Finalize</mat-checkbox>
          <mat-checkbox [(ngModel)]="toCancal" i18n>Cancel process</mat-checkbox>
          <mat-checkbox *ngIf="showClose" [(ngModel)]="toClose" i18n>Close process</mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <ng-container *ngIf="aprove">
        <mat-form-field class="one-field">
            <textarea autocomplete="chrome-off" matInput [(ngModel)]="remarks" placeholder="Remarks"></textarea>
        </mat-form-field>
        <button  mat-raised-button color="accent" (click)="confirm()" i18n>Confirm</button>
        <button  mat-raised-button color="accent" (click)="reject()" i18n>Reject</button>
      </ng-container>
      <button *ngIf="manager" mat-raised-button color="accent" (click)="onSave()" i18n>Save</button>
      <button  mat-raised-button color="accent" (click)="dialogRef.close('closed')" i18n>Close</button>
    </mat-dialog-actions>
    `,
})
export class ConfirmationDialog {
  toLock = false;
  toFinal = false;
  toCancal = false;
  toClose = false;

  showClose = false;

  locked = false;
  fineled = false;

  remarks;

  message: string = '';
  manager: boolean = false;
  aprove: boolean = false;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: any) {
      this.aprove = data.premmisions.includes('APPROVAL');
      this.manager = data.premmisions.includes('MANAGER');
      this.locked = data.toLock;
      this.fineled = data.toFinal;
      this.toLock = data.toLock;
      this.toFinal = data.toFinal;
      this.toCancal = data.toCancal;
      if(data.closeManagment) {
        this.toClose = data.closeManagment.toClose;
        this.showClose = true;
      }
  }

  confirm() {
    if(this.toCancal) {
      this.message = $localize`Can not cancel with confirm`;
    } else {
      this.dialogRef.close({process: 'confirm', remarks: this.remarks, toLock: this.locked? false: this.toLock, toFinal: this.fineled? false: this.toFinal, toCancal: false, ...(this.showClose && {toClose: this.toClose})});
    }
  }

  reject() {
    if((this.toLock && !this.locked) || (this.toFinal && !this.fineled)) {
      this.message = $localize`Can not finalize or lock with reject`;
    } else {
      this.dialogRef.close({process: 'reject', remarks: this.remarks, toLock: false, toFinal: false, toCancal: this.toCancal, ...(this.showClose && {toClose: this.toClose})});
    }
  }
  onSave() {
    this.dialogRef.close({process: 'onSave', remarks: this.remarks, toLock: this.locked? false: this.toLock, toFinal: this.fineled? false: this.toFinal, toCancal: this.toCancal, ...(this.showClose && {toClose: this.toClose})});
  }
}

