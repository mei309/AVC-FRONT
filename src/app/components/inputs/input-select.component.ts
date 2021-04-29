import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '../../field.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-input-select',
  template: `
<mat-form-field class="one-group" [formGroup]="myFormGroup">
  <input matInput numeric [formControlName]="field.collections[0].name" [decimals]="field.collections[0].options" [placeholder]="field.collections[0].label" type="text" maxlength="255">
  <mat-error *ngIf="myFormGroup.get(field.collections[0].name).hasError('maxlength')" i18n>Max length 255</mat-error>
  <ng-container *ngFor="let validation of field.collections[0].validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="myFormGroup.get(field.collections[0].name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  <mat-select style="width:50%;" [formControlName]="field.collections[1].name">
    <mat-option *ngFor="let item of field.collections[1].options" [value]="item">{{item}}</mat-option>
  </mat-select>
</mat-form-field>
`,
})
export class InputSelectComponent implements OnInit {
  destroySubject$: Subject<void> = new Subject();
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {
    if(this.field.options) {
      if(Array.isArray(this.field.options)) {
        if(this.field.inputType.startsWith('parent')) {
          const nameOfFileld = this.field.inputType.slice(6);
          this.group.parent.parent.get([this.field.options[0]]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            if(val[nameOfFileld]) {
              this.group.get(this.field.name).patchValue(val[nameOfFileld], {emitEvent: false});
            }
          });
        } else if(this.field.inputType === 'first') {
          this.group.parent.parent.get([this.field.options[0]]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            if(val[this.field.collections[0].name]) {
              this.myFormGroup.get(this.field.collections[0].name).patchValue(val[this.field.collections[0].name], {emitEvent: false});
            }
          });
        } else if(this.field.inputType === 'second') {
          this.group.parent.parent.get([this.field.options[0]]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            if(val[this.field.collections[1].name]) {
              this.myFormGroup.get(this.field.collections[1].name).patchValue(val[this.field.collections[1].name], {emitEvent: false});
            }
          });
        }
      } else {
        if(this.field.inputType.startsWith('parent')) {
          const nameOfFileld = this.field.inputType.slice(6);
          this.group.get([this.field.options]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
              if(val[nameOfFileld]) {
                this.group.get(this.field.name).patchValue(val[nameOfFileld], {emitEvent: false});
              }
          });
        } else if(this.field.inputType === 'first') {
          this.group.get([this.field.options]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            if(val[this.field.collections[0].name]) {
              this.myFormGroup.get(this.field.collections[0].name).patchValue(val[this.field.collections[0].name], {emitEvent: false});
            }
          });
        } else if(this.field.inputType === 'second') {
          this.group.get([this.field.options]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            if(val[this.field.collections[1].name]) {
              this.myFormGroup.get(this.field.collections[1].name).patchValue(val[this.field.collections[1].name], {emitEvent: false});
            }
          });
        }
      }
    }
    // if(this.field.name) {
    if(this.myFormGroup.get([this.field.collections[1].name]).value === null) {
      this.myFormGroup.get([this.field.collections[1].name]).setValue(this.field.collections[1].options[0]);
    }
    this.myFormGroup.get([this.field.collections[1].name]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      if(!val) {
        this.myFormGroup.get([this.field.collections[1].name]).setValue(this.field.collections[1].options[0]);
      }
    });
      // this.group = this.group.get(this.field.name) as FormGroup;
    // } else {
    //   if(this.group.get([this.field.collections[1].name]).value === null) {
    //     this.group.get([this.field.collections[1].name]).setValue(this.field.collections[1].options[0]);
    //   }
    //   this.group.get([this.field.collections[1].name]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
    //     if(!val) {
    //       this.group.get([this.field.collections[1].name]).setValue(this.field.collections[1].options[0]);
    //     }
    //   });
    // }
  }
  get myFormGroup(): FormGroup { return this.field.name? <FormGroup>this.group.get(this.field.name) : <FormGroup>this.group; }


  ngOnDestroy() {
    this.destroySubject$.next();
  }
}
