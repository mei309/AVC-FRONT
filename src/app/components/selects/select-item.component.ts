import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { Genral } from 'src/app/genral.service';
import { FieldConfig } from '../../field.interface';


@Component({
  selector: 'app-select-item',
  template: `
<mat-form-field class="one-field margin-top" [formGroup]="group">
  <input matInput #trigger (blur)="InputControl($event)" [placeholder]="field.label" [matAutocomplete]="auto" [formControlName]="field.name">
  <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete" [displayWith]="getOptionText" panelWidth="fit-content">
    <mat-option *ngFor="let item of filteredOptions | async" [value]="item">
      {{item.value}}
    </mat-option>
  </mat-autocomplete>
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>

<button type="button" *ngIf="field.collections !== 'Pack'" class="raised-margin" mat-raised-button color="accent" (click)="allItems()" i18n>All items</button>
`,
})
export class SelectItemComponent implements OnInit {
    @ViewChild('trigger', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  destroySubject$: Subject<void> = new Subject();

  field: FieldConfig;
  group: FormGroup;
  temp: Observable<any>;
  options = [];
  filteredOptions: Observable<any[]>;
  
  constructor(private genral: Genral) {}
  ngOnInit() {
    this.temp = this.field.options;
    this.temp.pipe(take(1)).subscribe(
      arg => {
          if(this.group.controls[this.field.name].value && !arg.some(b => b.value === this.group.controls[this.field.name].value.value)) {
            this.genral.getItemsCashew(this.field.collections).pipe(take(1)).subscribe(arg1 => {
                this.options = arg1;
                this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => this.filterSomewhere(val)));
            });
          } else {
            this.options = arg;
            this.filteredOptions = this.group.controls[this.field.name].valueChanges.pipe(startWith(null), map((val: string) => this.filterSomewhere(val)));
          }
          
          
          // if(typeof this.group.controls[this.field.name].value == 'string' && this.field.value !== undefined) {
          //   let putNull: boolean = true;
          //   this.options.forEach(option => {
          //       if (option.value === this.field.value) {
          //           this.group.controls[this.field.name].setValue(option);
          //           putNull = false;
          //       }
          //   });
          //   if(putNull) {
          //     this.group.controls[this.field.name].setValue(null);
          //   }
          // }
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
  
  // filter(val: string): any[] {
  //   if(val && typeof(val) === 'string') {
  //     const filterValue = val.toLowerCase();
  //     return this.options.filter(option =>
  //       option.value.toLowerCase().indexOf(filterValue) === 0);
  //   } else {
  //     return this.options;
  //   }
  // }

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

  allItems() {
    this.genral.getItemsCashew(this.field.collections).pipe(take(1)).subscribe(arg => {
        this.options = arg;
        setTimeout(() => {
          this.trigger.openPanel();
        }, 300);
    });
      
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
