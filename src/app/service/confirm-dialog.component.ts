import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Globals } from '../global-params.component';


@Component({
  selector: 'confirm-dialog',
  template: ` 
    <h1 mat-dialog-title>Process Managment</h1>
    <h3 style="color: red">
      {{message}}
    </h3>
    <mat-dialog-content>
      <div *ngIf="manager" class="mat-checbox-group">
        <mat-checkbox [disabled]="locked" [(ngModel)]="toLock">Lock</mat-checkbox>
        <mat-checkbox [disabled]="fineled" [(ngModel)]="toFinal">Finalize</mat-checkbox>
        <mat-checkbox [(ngModel)]="toCancal">Cancel process</mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end"> 
      <ng-container *ngIf="aprove">
        <mat-form-field class="one-field">
            <textarea autocomplete="chrome-off" matInput [(ngModel)]="remarks" placeholder="Remarks"></textarea>
        </mat-form-field>
        <button class="raised-margin" mat-raised-button color="accent" (click)="confirm()">Confirm</button>       
        <button class="raised-margin" mat-raised-button color="accent" (click)="reject()">Reject</button>
      </ng-container>
      <button *ngIf="manager" class="raised-margin" mat-raised-button color="accent" (click)="onSave()">Save</button>
      <button class="raised-margin" mat-raised-button color="accent" (click)="dialogRef.close('closed')">Close</button>
    </mat-dialog-actions>
    `,
})
export class ConfirmationDialog {
  toLock = false;
  toFinal = false;
  toCancal = false;

  locked = false;
  fineled = false;

  remarks;

  message: string = '';
  manager: boolean = false;
  aprove: boolean = false;

  constructor(public globals: Globals, public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: any) {
      this.aprove = data.premmisions.includes('APPROVAL');
      this.manager = data.premmisions.includes('MANAGER');
      this.locked = data.toLock;
      this.fineled = data.toFinal;
      this.toLock = data.toLock;
      this.toFinal = data.toFinal;
      this.toCancal = data.toCancal;
  }

  confirm() {
    if(this.toCancal) {
      this.message = 'Can not cancel with confirm';
    } else {
      this.dialogRef.close({process: 'confirm', remarks: this.remarks, toLock: this.locked? false: this.toLock, toFinal: this.fineled? false: this.toFinal, toCancal: false});
    }
  }

  reject() {
    if((this.toLock && !this.locked) || (this.toFinal && !this.fineled)) {
      this.message = 'Can not finalize or lock with reject';
    } else {
      this.dialogRef.close({process: 'reject', remarks: this.remarks, toLock: false, toFinal: false, toCancal: this.toCancal});
    }
  }
  onSave() {
    this.dialogRef.close({process: 'onSave', remarks: this.remarks, toLock: this.locked? false: this.toLock, toFinal: this.locked? false: this.toFinal, toCancal: this.toCancal});
  }
}

