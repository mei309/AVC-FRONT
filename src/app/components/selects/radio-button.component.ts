import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-radiobutton',
  template: `
<ng-container *ngIf="field.inputType !== 'withInput'" [formGroup]="group">
  <mat-radio-group style="margin-right: 10px;" [formControlName]="field.name">
    <mat-label>{{field.label}}: </mat-label>
    <mat-radio-button *ngFor="let item of field.options" [value]="item">{{item}}</mat-radio-button>
    <span [hidden]="!group.get(field.name).touched">
      <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
    </span>
  </mat-radio-group>
</ng-container>

<ng-container *ngIf="field.inputType === 'withInput'">
  <mat-radio-group style="margin-right: 10px;" [formControl]="selectedRadio">
    <mat-label>{{field.label}}: </mat-label>
    <mat-radio-button *ngFor="let item of field.options" [value]="item">{{item}}</mat-radio-button>
    <mat-radio-button value="other">
      <mat-form-field>
        <input matInput placeholder="Other" [formControl]="inputOther" >
      </mat-form-field>
    </mat-radio-button>
    <span [hidden]="!group.get(field.name).touched">
      <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
    </span>
  </mat-radio-group>
</ng-container>
`,
})
export class RadiobuttonComponent implements OnInit {
  destroySubject$: Subject<void> = new Subject();

  field: FieldConfig;
  group: FormGroup;
  selectedRadio: FormControl = new FormControl('');
  inputOther: FormControl = new FormControl('');
  constructor() {}
  ngOnInit() {
    if(this.field.inputType === 'withInput'){
      if(this.group.get([this.field.name]).value) {
        const temp = this.group.get([this.field.name]).value;
        var found: boolean = false;
        this.field.options.forEach(element => {
          if(element === temp){
            this.selectedRadio.setValue(element);
            found = true;
          }
        });
        if(!found){
          this.selectedRadio.setValue('other');
          this.inputOther.setValue(temp);
        }
      }
      this.inputOther.valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(inp => {
        this.selectedRadio.setValue('other');
        this.group.get([this.field.name]).setValue(inp);
        this.group.get([this.field.name]).markAsDirty();
      });
      this.selectedRadio.valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
          if(val !== 'other') {
            this.group.get([this.field.name]).setValue(val, {emitEvent: false});
            this.group.get([this.field.name]).markAsDirty();
          }     
      });
      if(this.group.controls[this.field.name].disabled) {
        this.selectedRadio.disable({emitEvent: false});
      }
      this.group.get(this.field.name).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
        if(!val) {
          this.selectedRadio.setValue(null, {emitEvent: false});
        }
        if(this.group.controls[this.field.name].disabled) {
          this.selectedRadio.disable({emitEvent: false});
        } else {
          this.selectedRadio.enable({emitEvent: false});
        }
      });
    }
  }

  ngOnDestroy() {
        this.destroySubject$.next();
      }
}
