import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-select-line',
  template: `
<div>
    <mat-form-field [formGroup]="group">
        <mat-label>{{field.label}}</mat-label>
        <mat-select [formControlName]="field.name">
            <mat-option *ngFor="let option of options" [value]="option">
                <ng-container *ngFor="let obj of field.collections">
                    <ng-container *ngIf="obj.type === 'value'; else normal">
                        {{option[obj.name]['value']}}
                    </ng-container>
                    <ng-template  #normal>
                        {{option[obj.name]}}
                    </ng-template>
                </ng-container>
            </mat-option>
        </mat-select>
    </mat-form-field>
</div>
`,
})
export class SelectLineComponent implements OnInit {
  

  field: FieldConfig;
  group: FormGroup;
  temp: Observable<any>;
  options = [];
  
  constructor() {}
  ngOnInit() {
    this.temp = this.field.options;
    this.temp.pipe(take(1)).subscribe(arg => {
          this.options = arg;
      });
  }
}
