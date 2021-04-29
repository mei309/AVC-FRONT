import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-percent-input',
  template: `
<mat-form-field class="one-field" [formGroup]="group">
  <input type="textbox" matInput [formControlName]="field.name" [placeholder]="field.label" appPercentageDirective>
  <span matSuffix>%</span>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>

`,
})
export class PercentInputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {
  }
}
