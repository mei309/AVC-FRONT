import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FieldConfig } from '../../field.interface';


@Component({
  selector: 'select-measure-unit',
  template: `
<mat-form-field class="one-field margin-top" [formGroup]="group">
  <input matInput (blur)="InputControl($event)" [placeholder]="field.label" [matAutocomplete]="auto" [formControlName]="field.name" type="text">
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
export class SelectMeasureUnitComponent implements OnInit {
  destroySubject$: Subject<void> = new Subject();

  field: FieldConfig;
  group: FormGroup;
  temp: Observable<any>;
  options = ['KG', 'LBS', 'OZ', 'GRAM', 'LOT', 'UNIT', 'BOX', 'TANK', 'BAG', 'ROLL'];
  filteredOptions: Observable<any[]>;
  
  constructor() {}
  ngOnInit() {
        if(this.field.collections === 'somewhere') {
          this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => val ? this.filterSomewhere(val) : this.options.slice()));
        } else {
          this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => val ? this.filter(val) : this.options.slice()));
        }
        this.group.get('item').valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            if(val && val[this.field.name]) {
                if(['KG', 'LBS', 'OZ', 'GRAM', 'LOT'].includes(val[this.field.name])) {
                    this.options = ['KG', 'LBS', 'OZ', 'GRAM', 'LOT'];
                } else {
                    this.options = [val[this.field.name]];
                }
                this.group.get(this.field.name).setValue(val[this.field.name]);  
            }
        });
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
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
