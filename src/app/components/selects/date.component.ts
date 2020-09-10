import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-date',
  template: `
<ng-container [ngSwitch]="field.options">

    <mat-form-field *ngSwitchCase="'withTime'" class="one-field margin-top" [formGroup]="group">
      <input matInput [ngxMatDatetimePicker]="picker" [formControlName]="field.name" [placeholder]="field.label">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <ngx-mat-datetime-picker #picker></ngx-mat-datetime-picker>
      <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
    </mat-form-field>


    <mat-form-field *ngSwitchCase="'duration'" class="one-field margin-top" [formGroup]="group">
      <input matInput DurationPicker type="text" [formControlName]="field.name" [placeholder]="field.label">
      <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
      {{group.get(field.name).value}}
    </mat-form-field>

    <mat-form-field *ngSwitchDefault class="one-field margin-top" [formGroup]="group">
      <input matInput type="date" [formControlName]="field.name" [placeholder]="field.label">
      <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
    </mat-form-field>
</ng-container>
`,
})
export class DateComponent implements OnInit {

  field: FieldConfig;
  group: FormGroup;
  
  constructor() {}
  ngOnInit() {
    if(this.field.options !== 'withTime') {
      if(this.group.get(this.field.name).value && typeof this.group.get(this.field.name).value !== 'string'){
        this.group.get(this.field.name).setValue((this.group.get(this.field.name).value).toISOString().substring(0, 10));
      }
    }
  }

  
}


// ngOnDestroy() {
//   this.destroySubject$.next();
// }
// destroySubject$: Subject<void> = new Subject();
// dateControl = new FormControl();
// <input matInput [ngxMatDatetimePicker]="picker" [formControlName]="field.name" [placeholder]="field.label">
//   <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
//   <ngx-mat-datetime-picker  #picker></ngx-mat-datetime-picker>
// <input matInput type="datetime-local" [formControlName]="field.name" [placeholder]="field.label">
// var isoStr = (this.group.get(this.field.name).value).toISOString();
// this.group.get(this.field.name).setValue(isoStr.substring(0,16));

// <input matInput (dateChange)="addEvent($event)" (dateInput)="addEvent($event)" [formControl]="dateControl" [matDatepicker]="picker1"  [placeholder]="field.label">
//   <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
//   <mat-datepicker  #picker1></mat-datepicker>
// if(this.field.options != 'withTime') {
//   this.dateControl.setValue(<Date>this.group.get(this.field.name).value);
//   // this.group.get(this.field.name).setValue(toISOLocal(this.dateControl.value));
//   this.group.get(this.field.name).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
//     if(!val) {
//       this.dateControl.setValue(null);
//     }
//     if(this.group.controls[this.field.name].disabled) {
//       this.dateControl.disable();
//     } else {
//       this.dateControl.enable();
//     }
//   });
//   if(this.group.controls[this.field.name].disabled) {
//     this.dateControl.disable();
//   } 
//   // if(!this.group.get(this.field.name).value && this.field.options) {
//   //   this.group.get(this.field.name).setValue(toISOLocal(this.field.options))
//   // }
// }
// addEvent($event) {
//   this.group.get(this.field.name).setValue(toISOLocal($event.value));
//   this.group.get([this.field.name]).markAsDirty();
// }
// function toISOLocal(d) {
//   var z  = n =>  ('0' + n).slice(-2);
//   var zz = n => ('00' + n).slice(-3);

//   return d.getFullYear() + '-'
//          + z(d.getMonth()+1) + '-' +
//          z(d.getDate()); //+ 'T' +
//         //  z(d.getHours()) + ':'  + 
//         //  z(d.getMinutes()) + ':' +
//         //  z(d.getSeconds()) + '.' +
//         //  zz(d.getMilliseconds()) +
//         //  sign + z(off/60|0) + ':' + z(off%60); 
// }

// function toISOLocal(d) {
//   var z  = n =>  ('0' + n).slice(-2);
//   var zz = n => ('00' + n).slice(-3);
//   var off = d.getTimezoneOffset();
//   var sign = off < 0? '+' : '-';
//   off = Math.abs(off);

//   return d.getFullYear() + '-'
//          + z(d.getMonth()+1) + '-' +
//          z(d.getDate()) + 'T' +
//          z(d.getHours()) + ':'  + 
//          z(d.getMinutes()) + ':' +
//          z(d.getSeconds()) + '.' +
//          zz(d.getMilliseconds()) +
//          sign + z(off/60|0) + ':' + z(off%60); 
// }
