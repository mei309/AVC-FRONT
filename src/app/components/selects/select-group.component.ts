import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {uniq, isEqual} from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { Genral } from 'src/app/genral.service';
import { FieldConfig } from '../../field.interface';


@Component({
  selector: 'app-selectgroup',
  template: `
<mat-form-field class="one-field margin-top">
  <input matInput (blur)="InputControlOne($event)" [placeholder]="field.collections[0].label" [matAutocomplete]="auto" [formControl]="selectFormFirst">
    <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
      <mat-option *ngFor="let item of filteredOptions1 | async" [value]="item">
        {{item}}
      </mat-option>
    </mat-autocomplete>
</mat-form-field>

<mat-form-field class="one-field margin-top" [formGroup]="group">
  <input #trigger matInput (blur)="InputControlTwo($event)" [placeholder]="field.collections[1].label" [matAutocomplete]="auto2" [formControlName]="field.collections[1].name">
      <mat-autocomplete autoActiveFirstOption #auto2="matAutocomplete" [displayWith]="getOptionText">
        <mat-option *ngFor="let item of filteredOptions2 | async" [value]="item">
          {{item.value}}
        </mat-option>
      </mat-autocomplete>
  <ng-container *ngFor="let validation of field.collections[1].validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.collections[1].name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>

<button type="button" *ngIf="field.label === 'withAllPos'" class="raised-margin" mat-raised-button color="accent" (click)="allPos()">All #POS</button>
`,
})
export class SelectgroupComponent implements OnInit {
  @ViewChild('trigger', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  destroySubject$: Subject<void> = new Subject();
  field: FieldConfig;
  group: FormGroup;
  linkedone;
  linkedtwo;
  options1;
  options2 = [];
  temp: Observable<any>;
  
  filteredOptions1: Observable<any[]>;
  filteredOptions2: Observable<any[]>;

  genralLink;

  selectFormFirst: FormControl;

  constructor(private genral: Genral) {
  }
  ngOnInit() {
    this.genralLink = this.field.inputType;
    let linkId = null;

    this.selectFormFirst = new FormControl(null);

    this.temp = this.field.options;
    this.temp.pipe(take(1)).subscribe(
      arg => {
        // arg.forEach(val => this.linkedtwo.push(Object.assign({}, val)));
        this.linkedtwo = arg;
        // this.options2 = arg;
        this.linkedone = uniq(arg.map(opt => opt[this.genralLink]));
        this.options1 = this.linkedone;
      
        if(this.group.controls[this.field.collections[1].name].value && typeof this.group.controls[this.field.collections[1].name].value === 'object'){
          this.selectFormFirst.setValue(this.group.controls[this.field.collections[1].name].value[this.genralLink]);
          linkId = this.selectFormFirst;
        } else {
          if(this.field.collections[0].value !== undefined) {
            this.linkedone.forEach(option => {
                if (option === this.field.collections[0].value) {
                    this.selectFormFirst.setValue(option);
                    linkId = option;
                }
            });
          }
        }

      

        if(typeof this.group.controls[this.field.collections[1].name].value == 'string' && this.field.collections[1].value !== undefined) {
          let putNull: boolean = true;
          this.linkedtwo.forEach(option => {
              if (option.value === this.field.collections[1].value) {
                  this.group.controls[this.field.collections[1].name].setValue(option);
                  this.selectFormFirst.setValue(option[this.genralLink]);
                  linkId = this.selectFormFirst;
                  putNull = false;
              }
          });
          if(putNull) {
              this.group.controls[this.field.collections[1].name].setValue(null);
            }
        }

        if(linkId !== null){
          let options = [];
          this.linkedtwo.forEach(option => {
              if (isEqual(option[this.genralLink], linkId)) {
                  options.push(option);
              }
          });
          this.options2 = options;
        } else {
          this.options2 =this.linkedtwo;
        }

        if(this.field.collections[0].collections === 'somewhere') {
          this.filteredOptions1 = this.selectFormFirst.valueChanges.pipe(startWith(null), map((val: string) => val ? this.filter1somewhere(val) : this.options1.slice()));
        } else {
          this.filteredOptions1 = this.selectFormFirst.valueChanges.pipe(startWith(null), map((val: string) => val ? this.filter1(val) : this.options1.slice()));
        }
        if(this.field.collections[1].collections === 'somewhere') { 
          this.filteredOptions2 = this.group.controls[this.field.collections[1].name].valueChanges.pipe(startWith(null), map((val: string) => val ? this.filter2somewhere(val) : this.options2.slice()));
        } else {
          this.filteredOptions2 = this.group.controls[this.field.collections[1].name].valueChanges.pipe(startWith(null), map((val: string) => val ? this.filter2(val) : this.options2.slice()));
        }

        if(this.group.controls[this.field.collections[1].name].disabled) {
          this.selectFormFirst.disable();
        }
      }
    );
    this.group.get(this.field.collections[1].name).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      if(!val && val !== '') {
        this.selectFormFirst.setValue(null, {emitEvent: false});
      }
      if(this.group.controls[this.field.collections[1].name].disabled) {
        this.selectFormFirst.disable();
      } else {
        this.selectFormFirst.enable();
      }
    });
  }

  /**public oneChangedHandler(e: MatAutocompleteSelectedEvent){
    let options = [];
    this.linkedtwo.forEach(option => {
        if (option[this.genralLink] === e.option.value.id) {
            options.push(option);
        }
    });
    this.options2 = options;
    if (options.length) {
      //this.group.controls[this.field.collections[1].name].setValue(options[0]);
    } else {
      this.group.controls[this.field.collections[1].name].setValue(null);
    }
  }


  public twoChangedHandler(e: MatAutocompleteSelectedEvent){     
    this.linkedone.forEach(option => {
        if (option.id === e.option.value[this.genralLink]) {
            this.group.controls[this.field.collections[0].name].setValue(option);
        }
    });
  }*/
  
  filter1(val: string): any[] {
    if(val && typeof(val) === 'string') {
      const filterValue = val.toLowerCase();
      return this.options1.filter(option =>
        option.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.options1;
    }
    
  }

  filter2(val: string): any[] {
    if(val && typeof(val) === 'string') {
      const filterValue = val.toLowerCase();
      return this.options2.filter(option =>
        option.value.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.options2;
    }
    
  }

  filter1somewhere(val: string): any[] {
    if(val && typeof(val) === 'string') {
      const filterValue = val.toLowerCase();
      return this.options1.filter(option =>
        option.toLowerCase().includes(filterValue));
    } else {
      return this.options1;
    }
    
  }

  filter2somewhere(val: string): any[] {
    if(val && typeof(val) === 'string') {
      const filterValue = val.toLowerCase();
      return this.options2.filter(option =>
        option.value.toLowerCase().includes(filterValue));
    } else {
      return this.options2;
    }
    
  }

  getOptionText(option) {
    if(option !== null) {
      return option.value;
    }
   }

   InputControlOne(event) {
    setTimeout(() => {
        let isValueTrue = this.linkedone.filter(opt =>
            opt.toLowerCase() === event.target.value.toLowerCase());
        if (isValueTrue.length !== 0) {
            this.selectFormFirst.setValue(isValueTrue[0]);
            let options = [];
            this.linkedtwo.forEach(option => {
                if (isEqual(option[this.genralLink] ,isValueTrue[0])) {
                    options.push(option);
                }
            });
            this.options2 = options;
            let isExist = options.filter(opt =>
              opt === this.group.controls[this.field.collections[1].name].value);
            if (isExist.length === 0) {
              this.group.controls[this.field.collections[1].name].setValue('');
            }
            if(!this.group.controls[this.field.collections[1].name].value) {
              this.trigger.openPanel();
            }
        } else {
            this.selectFormFirst.setValue('');
            this.options2 = this.linkedtwo;
            this.group.controls[this.field.collections[1].name].updateValueAndValidity({ onlySelf: true, emitEvent: true });;
            this.trigger.openPanel();
            
        }
    }, 300);
  }

  InputControlTwo(event) {
    setTimeout(() => {
        let isValueTrue = this.linkedtwo.filter(opt =>
            opt.value.toLowerCase() === event.target.value.toLowerCase());
        if (isValueTrue.length !== 0) {
            this.group.controls[this.field.collections[1].name].setValue(isValueTrue[0]);
            
            if (!this.selectFormFirst || this.selectFormFirst !== isValueTrue[0][this.genralLink]) {
                  this.selectFormFirst.setValue(isValueTrue[0][this.genralLink]);
            }
        } else {
            this.group.controls[this.field.collections[1].name].setValue('');
        }
    }, 300);
  }
  

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }


  allPos() {
    this.genral.findAllPoCodes().pipe(take(1)).subscribe(arg => {
        this.linkedtwo = arg;
        this.linkedone = uniq(arg.map(opt => opt[this.genralLink]));
        this.options1 = this.linkedone;
        this.options2 = arg;
        setTimeout(() => {
          this.trigger.openPanel();
        }, 300);
    });
      
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
