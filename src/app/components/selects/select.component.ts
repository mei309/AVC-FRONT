import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-select',
  template: `
<mat-form-field class="one-field margin-top" [formGroup]="group">
  <input matInput (blur)="InputControl($event)" [placeholder]="field.label" [matAutocomplete]="auto" [formControlName]="field.name">
  <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete" [displayWith]="getOptionText" panelWidth="fit-content">
    <mat-option *ngFor="let item of filteredOptions | async" [value]="item">
      {{item.value}}
    </mat-option>
  </mat-autocomplete>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>
`,
})
export class SelectComponent implements OnInit {
  destroySubject$: Subject<void> = new Subject();

  field: FieldConfig;
  group: FormGroup;
  temp: Observable<any>;
  options = [];
  filteredOptions: Observable<any[]>;
  
  constructor() {}
  ngOnInit() {
    this.temp = this.field.options;
    this.temp.pipe(take(1)).subscribe(
      arg => {
          this.options = arg;
          if(typeof this.group.controls[this.field.name].value == 'string' && this.field.value !== undefined) {
            let putNull: boolean = true;
            this.options.forEach(option => {
                if (option.value === this.field.value) {
                    this.group.controls[this.field.name].setValue(option);
                    putNull = false;
                }
            });
            if(putNull) {
              this.group.controls[this.field.name].setValue(null);
            }
          }
          if(this.field.collections === 'somewhere') {
            this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => this.filterSomewhere(val)));
          } else {
            this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => this.filter(val)));
          }
      } 
    );
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
        option.value.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.options;
    }
  }

  filterSomewhere(val: string): any[] {
    if(val && typeof(val) === 'string') {
      const filterValue = val.toLowerCase();
      return this.options.filter(option =>
        option.value.toLowerCase().includes(filterValue));
    } else {
      return this.options;
    }
  }

  InputControl(event) {
    setTimeout(() => {
        let isValueTrue = this.options.filter(opt =>
            opt.value.toLowerCase() === event.target.value.toLowerCase());
        if (isValueTrue.length !== 0) {
            this.group.controls[this.field.name].setValue(isValueTrue[0]);
        } else {
            this.group.controls[this.field.name].setValue(null);
        }
    }, 300);
  }


  getOptionText(option) {
    if(option !== null) {
      return option.value;
    }
   }
  
  removeItem(index): void {
    this.options.push(((this.group.get([this.field.name])).value.splice(index, 1))[0]);
    if(((this.group.get([this.field.name])).value).length === 0) {
      (this.group.get([this.field.name])).setValue(null);
    }
    this.group.get([this.field.name]).markAsDirty();
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
