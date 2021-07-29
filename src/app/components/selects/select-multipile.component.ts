import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-select-multipile',
  template: `
<mat-form-field class="one-field margin-top" [formGroup]="group">
  <mat-chip-list #chipList [formControlName]="field.name">
    <mat-chip *ngFor="let fruit of group.get([this.field.name]).value; let i = index;"
      selectable="true" removable="true" (removed)="removeItem(i)">
        {{fruit.value}}
      <mat-icon matChipRemove>cancel</mat-icon>
    </mat-chip>
    <input matInput #multipileInput (blur)="InputControlMultipile($event)" [placeholder]="field.label" [matAutocomplete]="auto1" [value]="searchControl.value" [formControl]="searchControl"
      [matChipInputFor]="chipList" [matChipInputSeparatorKeyCodes]="separatorKeysCodes">
  </mat-chip-list>
  <mat-autocomplete autoActiveFirstOption  #auto1="matAutocomplete" (optionSelected)="selected($event)" panelWidth="fit-content">
    <mat-option *ngFor="let fruit of filteredOptions | async" [value]="fruit">
      {{fruit.value}}
    </mat-option>
  </mat-autocomplete>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>
`,
})
export class SelectMultipileComponent implements OnInit {
  @ViewChild('multipileInput', { read: MatAutocompleteTrigger }) multipileInput: MatAutocompleteTrigger;
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchControl = new FormControl(null);

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
          this.options = Object.assign([], arg);
          if(typeof this.group.controls[this.field.name].value == 'string' && this.field.value !== undefined) {
            let putNull: boolean = true;
            this.options.forEach(option => {
                if (option.value === this.field.value) {
                    this.group.controls[this.field.name].setValue([option]);
                    putNull = false;
                }
            });
            if(putNull) {
              this.group.controls[this.field.name].setValue(null);
            }
          }
          if(this.field.collections === 'somewhere') { 
            this.filteredOptions = this.searchControl.valueChanges.pipe(startWith(null), map((val: string) => this.filterSomewhere(val)));
          } else {
            this.filteredOptions = this.searchControl.valueChanges.pipe(startWith(null), map((val: string) => this.filter(val)));
          }
      } 
    );
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

  InputControlMultipile(event) {
        let isValueTrue = this.options.filter(opt =>
            opt.value.toLowerCase() === event.target.value.toLowerCase());
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
    // this.multipileInput.value = '';
    this.searchControl.setValue(null);
    // event.stopPropagation();
    setTimeout(() => {
      this.multipileInput.openPanel();
    }, 2)
  }

  

}
