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
  <mat-chip-list #chipList [formControlName]="field.name">
    <mat-chip *ngFor="let fruit of group.get([this.field.name]).value; let i = index;"
      selectable="true" removable="true" (removed)="removeItem(i)">
        {{fruit}}
      <mat-icon matChipRemove>cancel</mat-icon>
    </mat-chip>
    <input matInput #multipileInput (blur)="InputControlMultipile($event)" [placeholder]="field.label" [matAutocomplete]="auto1" [value]="searchControl.value" [formControl]="searchControl"
      [matChipInputFor]="chipList" [matChipInputSeparatorKeyCodes]="separatorKeysCodes">
  </mat-chip-list>
  <mat-autocomplete autoActiveFirstOption #auto1="matAutocomplete" (optionSelected)="selected($event)">
    <mat-option *ngFor="let fruit of filteredOptions | async" [value]="fruit">
      {{fruit}}
    </mat-option>
  </mat-autocomplete>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>
`,
})
export class SelectNormalMultipleComponent implements OnInit {
  @ViewChild('multipileInput', { read: MatAutocompleteTrigger }) multipileInput: MatAutocompleteTrigger;
  destroySubject$: Subject<void> = new Subject();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchControl = new FormControl();

  field: FieldConfig;
  group: FormGroup;
  temp: Observable<any>;
  options = [];
  filteredOptions: Observable<any[]>;
  
  constructor() {}
  ngOnInit() {
        this.options = this.field.options;
        if(this.field.collections === 'somewhere') { 
            this.filteredOptions = this.searchControl.valueChanges.pipe(startWith(''), map((val: string) => this.filterSomewhere(val)));
        } else {
            this.filteredOptions = this.searchControl.valueChanges.pipe(startWith(''), map((val: string) => this.filter(val)));
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

  InputControlMultipile(event) {
        if (event.relatedTarget && event.relatedTarget.tagName === 'MAT-OPTION') {
          // the input was blurred, but the user is still interacting with the component, they've simply selected a mat-option
          return;
        }
        let isValueTrue = this.options.filter(opt =>
            opt.toLowerCase() === event.target.value.toLowerCase());
        if (isValueTrue.length !== 0) {
            if(this.group.controls[this.field.name].value === null) {
              this.group.controls[this.field.name].setValue([isValueTrue[0]]);
            } else {
              (this.group.get([this.field.name])).value.push(isValueTrue[0]);
            }
            this.group.get([this.field.name]).markAsDirty();
            const index = this.options.indexOf(isValueTrue[0], 0);
            if (index > -1) {
              this.options.splice(index, 1);
            }
            this.searchControl.setValue(null);
        }
  }

  
  
  removeItem(index): void{
    this.options.push(((this.group.get([this.field.name])).value.splice(index, 1))[0]);
    if(((this.group.get([this.field.name])).value).length === 0) {
      (this.group.get([this.field.name])).setValue(null);
    }
    this.group.get([this.field.name]).markAsDirty();
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    if(this.group.controls[this.field.name].value === null) {
      this.group.controls[this.field.name].setValue([event.option.value]);
    } else {
      (this.group.get([this.field.name])).value.push(event.option.value);
    }
    this.group.get([this.field.name]).markAsDirty();
    const index = this.options.indexOf(event.option.value, 0);
    if (index > -1) {
      this.options.splice(index, 1);
    }
    this.searchControl.setValue(null);
    setTimeout(() => {
      this.multipileInput.openPanel();
    }, 2)
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
