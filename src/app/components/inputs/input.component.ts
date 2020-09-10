import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-input',
  template: `
<mat-form-field class="one-field" [formGroup]="group">
  <input matInput *ngIf="field.inputType !== 'numeric'" [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType" maxlength="255">
  <input matInput *ngIf="field.inputType === 'numeric'" numeric [formControlName]="field.name" [decimals]="field.options" [placeholder]="field.label" type="text" maxlength="255">
  <mat-error *ngIf="group.get(field.name).hasError('maxlength')">Max length 255</mat-error>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>

`,
})
export class InputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
