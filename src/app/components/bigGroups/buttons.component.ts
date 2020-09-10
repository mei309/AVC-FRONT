import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-buttons',
  template: `
  <div style="float:right;">
    <button [disabled]="group.disabled" type="button" mat-mini-fab (click)="onRemoving()">
      <mat-icon >delete</mat-icon>
    </button>
    <button [disabled]="group.enabled || canPutBack" type="button" mat-mini-fab (click)="onChange()">
      <mat-icon>create</mat-icon>
    </button>
    <button [disabled]="!canPutBack" type="button" mat-mini-fab (click)="onPutBack()">
      <mat-icon>settings_backup_restore</mat-icon>
    </button>
  </div>
  <ng-container ngProjectAs="mat-error">
    <mat-error *ngIf="group.hasError('allOrNoneRequired') && checkAllTouched(group)">{{message}}</mat-error>
  </ng-container>
`,
})
export class ButtonsComponent {
  @Output() removing = new EventEmitter<number>();
  @Output() change = new EventEmitter<number>();
  @Output() putBack = new EventEmitter<number>();
  canPutBack: boolean = false;
  group: FormGroup;
  index: number;
  message: string;
  
  constructor() {}

  onRemoving() {
    this.canPutBack = true;
    this.removing.emit(this.index);
  }

  onChange() {
    this.change.emit(this.index);
  }

  onPutBack() {
    this.canPutBack = false;
    this.putBack.emit(this.index);
  }

  checkAllTouched(fg: FormGroup): boolean{
    const controls = Object.values(fg.controls);
    return controls.every(fc => {
        if(fc instanceof FormGroup){
          return this.checkAllTouched(fc);
        } else if(fc instanceof FormArray){
          return fc.controls.every(ft => {return this.checkAllTouched(ft as FormGroup)});
        } else {
          if(fc.touched) {
            return true;
          } else {
            return false;
          }
        }
      });
  }
}
