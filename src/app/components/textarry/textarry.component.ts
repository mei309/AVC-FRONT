import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-textarry',
  template: `
<mat-form-field class="one-field" [formGroup]="group">
  <textarea [autocomplete]="field.autocomplete" matInput [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType"></textarea>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>
`,
})
export class TextarryComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
