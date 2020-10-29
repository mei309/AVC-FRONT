import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-divider',
  template: `
  <div [ngSwitch]="field.inputType">
    <mat-divider *ngSwitchCase="'divide'"></mat-divider>
    <h1 *ngSwitchCase="'titel'">{{field.label}}</h1>
  </div>
  <div *ngIf="'newlinespace' === field.inputType" class="one-field-space">
  </div>
`,
})
export class DividerComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
