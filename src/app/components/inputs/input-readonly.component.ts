import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-input-readonly',
  template: `
<ng-container [ngSwitch]="type">
    <mat-form-field *ngSwitchCase="'date'" class="one-field" appearance="none" provideReadonly [formGroup]="group">
        <mat-label>{{field.label}}</mat-label>
        <input readonly matInput [ngxMatDatetimePicker]="picker" [formControlName]="field.name">
        <ngx-mat-datetime-picker  #picker></ngx-mat-datetime-picker>
    </mat-form-field>

    <mat-form-field *ngSwitchCase="'array'" class="one-field" appearance="none" provideReadonly [formGroup]="group">
        <mat-label>{{field.label}}</mat-label>
        <mat-chip-list #chipList>
            <mat-chip *ngFor="let symbol of group.get([this.field.name]).value;">{{symbol.value}} </mat-chip>
            <input readonly matInput [matChipInputFor]="chipList">
        </mat-chip-list>
    </mat-form-field>
        
    <mat-form-field *ngSwitchCase="'object'" class="one-field" appearance="none" provideReadonly>
        <mat-label>{{field.label}}</mat-label>
        <input readonly matInput [value]="controlText">
    </mat-form-field>

    <mat-form-field *ngSwitchCase="'inputselect'" class="one-field" appearance="none" provideReadonly>
        <mat-label>{{field.collections[0].label}}</mat-label>
        <input readonly matInput [value]="controlText">
    </mat-form-field>

    <ng-container *ngSwitchCase="'selectgroup'">
        <mat-form-field class="one-field" appearance="none" provideReadonly>
            <mat-label>{{field.collections[0].label}}</mat-label>
            <input readonly matInput [value]="controlText[field.inputType]">
        </mat-form-field>
        <mat-form-field class="one-field" appearance="none" provideReadonly>
            <mat-label>{{field.collections[1].label}}</mat-label> 
            <input readonly matInput [value]="controlText['value']">
        </mat-form-field>
    </ng-container>

    <ng-container *ngSwitchCase="'none'">
    </ng-container>

    <mat-form-field *ngSwitchDefault class="one-field" appearance="none" provideReadonly [formGroup]="group">
        <mat-label>{{field.label}}</mat-label>   
        <input readonly matInput [formControlName]="field.name">
    </mat-form-field>
    
</ng-container>
`,
})
export class InputReadonlyComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  controlText;
  type;
  constructor() {}
  ngOnInit() {
    switch (this.field.type) {
        case 'date':
            this.type = 'date';
            break;
        case 'array':
            this.type = 'array';
            break;
        case 'select':
        case 'selectItem':
        case 'inputReadonlySelect':
            if(this.field.inputType === 'multiple') {
                this.type = 'array';
            } else {
                if(this.group.get([this.field.name]).value) {
                    const temp = this.group.get([this.field.name]).value;
                    this.controlText = temp['value'];
                    this.type = 'object';
                } else {
                    this.type = 'none';
                }
            }
            break;
        case 'inputselect':
            if(this.field.name) {
                this.group = this.group.get(this.field.name) as FormGroup;
            } 
            this.controlText = '';
            if(this.group.get(this.field.collections[0].name).value) {
                this.controlText += this.group.get(this.field.collections[0].name).value
            }
            if(this.group.get(this.field.collections[1].name).value) {
                this.controlText += this.group.get(this.field.collections[1].name).value
            }
            if(!this.controlText) {
                this.type = 'none';
            } else {
                this.type = 'inputselect';
            }
            break;
        case 'selectgroup':
            this.controlText = this.group.get([this.field.collections[1].name]).value;
            if(!this.controlText) {
                this.type = 'none';
            } else {
                this.type = 'selectgroup';
            }
            break;
        // case 'inputReadonlySelect':
        //     const temp2 = this.group.get([this.field.name]).value;
        //     this.controlText = temp2['value'];
        //     if(!this.controlText) {
        //         this.type = 'none';
        //     } else {
        //         this.type = 'object';
        //     }
        //     break
        default:
            break;
    }
  }
}
