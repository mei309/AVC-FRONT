import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-input-to-percentage',
  template: `
<mat-form-field class="one-field" [formGroup]="group">
  <mat-label>{{field.label}}<span *ngIf="prefix">&nbsp;({{prefix}})</span></mat-label>
  <input matInput numeric [formControlName]="field.name" [decimals]="field.options" type="text" maxlength="255">
  <mat-error *ngIf="group.get(field.name).hasError('maxlength')">Max length 255</mat-error>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  <span matSuffix>{{sum/percent | percent:'1.3'}}</span>
</mat-form-field>
`,
})
export class InputToPercentageComponent implements OnInit {
  destroySubject$: Subject<void> = new Subject();

  field: FieldConfig;
  group: FormGroup;
  percent: number = 0;
  sum: number = 0;
  prefix: string;
  constructor() {}
  ngOnInit() {
    this.group.get([this.field.name]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      this.sum = +val;   
    });
    if(this.field.collections) {
        this.group.get([this.field.collections]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            this.percent = +val;   
        });
    }
    if(this.field.inputType) {
      this.group.get([this.field.inputType]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
        this.prefix = val;   
      });
    }
  }

  ngOnDestroy() {
        this.destroySubject$.next();
      }
}
