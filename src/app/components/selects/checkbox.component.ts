import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-checkbox',
  template: `
<ng-container class="one-field margin-top" [formGroup]="group" >
  <mat-checkbox [formControlName]="field.name">{{field.label}}</mat-checkbox>
  <span [hidden]="!group.get(field.name).touched">
    <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
      <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
    </ng-container>
  </span>
</ng-container>
`,
})
export class CheckboxComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
