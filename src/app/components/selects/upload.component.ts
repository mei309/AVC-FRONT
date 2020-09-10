import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-upload',
  template: `
<ng-container class="one-field margin-top" [formGroup]="group" >
<div class="form-group">
    <label>{{field.label}}</label>
    <input type="file" writeFile="true" [formControlName]="field.name" class="form-control" [multiple]="field.inputType"  />
</div>
</ng-container>
`,
})
export class UploadComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
