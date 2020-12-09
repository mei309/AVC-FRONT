import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-select-normal',
  template: `
<mat-form-field class="one-field margin-top" [formGroup]="group">
  <input matInput (blur)="InputControl($event)" [placeholder]="field.label" [matAutocomplete]="auto" [formControlName]="field.name">
  <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
    <mat-option *ngFor="let item of filteredOptions | async" [value]="item">
      {{item}}
    </mat-option>
  </mat-autocomplete>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>
`,
})
export class SelectNormalComponent implements OnInit {
  destroySubject$: Subject<void> = new Subject();

  field: FieldConfig;
  group: FormGroup;
  temp: Observable<any>;
  options = [];
  filteredOptions: Observable<any[]>;
  
  constructor() {}
  ngOnInit() {
        this.options = this.field.options;
        if(this.field.collections === 'somewhere') {
          this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => val ? this.filterSomewhere(val) : this.options.slice()));
        } else {
          this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => val ? this.filter(val) : this.options.slice()));
        }
        if(this.field.inputType) {
          this.group.get([this.field.inputType]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
              if(val[this.field.name]) {
                this.group.get(this.field.name).setValue(val[this.field.name]);
              }
          });
        }

  }
  
  filter(val: string): any[] {
    if(val && typeof(val) === 'string') {
      const filterValue = val.toLowerCase();
      return this.options.filter(option =>
        option.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.options;
    }
  }

  filterSomewhere(val: string): any[] {
    if(val && typeof(val) === 'string') {
      const filterValue = val.toLowerCase();
      return this.options.filter(option =>
        option.toLowerCase().includes(filterValue));
    } else {
      return this.options;
    }
  }

  InputControl(event) {
    setTimeout(() => {
        let isValueTrue = this.options.filter(opt =>
            opt.toLowerCase() === event.target.value.toLowerCase());
        if (isValueTrue.length !== 0) {
            this.group.controls[this.field.name].setValue(isValueTrue[0]);
        } else {
            this.group.controls[this.field.name].setValue(null);
        }
    }, 300);
    // this.group.controls[this.field.name].setValue(event.target);
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
