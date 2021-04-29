import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../../field.interface';


@Component({
  selector: 'app-select-line',
  template: `
    <mat-form-field [formGroup]="group" class="one-field margin-top">
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
