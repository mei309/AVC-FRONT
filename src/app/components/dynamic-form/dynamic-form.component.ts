/* eslint-disable no-prototype-builtins */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {cloneDeep} from 'lodash-es';
import { allOrNoneRequired, FieldConfig, checkEmpty, atLeastOneRequired } from '../../field.interface';

@Component({
  selector: 'dynamic-form',
  template: `
  <form autocomplete="off" class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)">
  <fieldset [ngStyle]="{'width':'90%'}">
  <legend *ngIf="mainLabel"><h1>{{mainLabel}}</h1></legend>
  <ng-container *ngFor="let field of fields;" dynamicField [edit]="edit" [field]="field" [group]="form">
  </ng-container>
  <div class="margin-top" style="text-align:right">
  <button type="submit" style="min-width:150px; margin-right: 45px" mat-raised-button color="primary">{{submitText}}</button>
  <button type="button" style="min-width:150px" mat-raised-button color="primary" (click)="onReset()">Reset</button>
  </div>
  </fieldset>
  </form>
  `,
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Input() mainLabel: string = null;

  infoEdit: any = null;
  @Input() set putData(value) {
      this.infoEdit = value;
  }
  get putData() { return this.infoEdit; }

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  edit: boolean = false;

  submitText: string;
  form: FormGroup;

  // detailedDiff = require("deep-object-diff").detailedDiff;
  // diff = require('deep-diff').diff;
  // observableDiff = require('deep-diff').observableDiff;

  get value() {
    return this.form.value;
  }
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    if(this.putData) {
      this.edit = true;
      this.form = this.createControlWithData();
    } else {
      this.form = this.createControl();
    }
    this.putData = JSON.parse(JSON.stringify(this.form.value));
  }

  reset(){
    this.ngOnInit();
  }
  disable() {
    this.form.disable();
  }
  enable() {
    this.form.enable();
  }
  markDirty() {
    this.form.markAsDirty();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    /**if(this.putData !== null && this.putData !== undefined) {
        console.log(this.diff(this.putData, this.form.value));
        if(this.form.dirty) {
          //console.log(this.getDirtyValues(this.form));
        } else {
          console.log('nothing changed');
        }
      }
    */
    if (this.form.valid) {
      //this.emptyNull(this.form.value)
      // console.log(this.form.value);
      
      /**if(this.putData !== null && this.putData !== undefined) {
        if(this.form.dirty) {
          console.log(this.getDirtyValues(this.form));
        } else {
          console.log('nothing changed');
        }
      } else {*/
      // var emptyNull = this.form.getRawValue();
      
      const mmm = cloneDeep(this.form) as FormGroup;
      mmm.enable();
      this.emptyEmptyArray(mmm);
      this.submit.emit(mmm.getRawValue());
      // var emptyNull = mmm.getRawValue();
      // this.emptyNull(emptyNull)
      // this.submit.emit(emptyNull);
      //}
    } else {
      this._snackBar.open('please fill in all required fields', 'ok', {
        duration: 5000,
        // panelClass: 'blue-snackbar',
        verticalPosition:'top'
      });
      // alert('please fill in all required fields'+this.form.errors);
    }
    this.form.markAllAsTouched();
  }
  

  emptyEmptyArray(formValue: FormGroup) {
    
    const controls = Object.values(formValue.controls);
    controls.forEach(fc => {
        if(fc instanceof FormGroup){
            this.emptyEmptyArray(fc);
            if(!Object.values(fc.controls).length) {
              formValue.removeControl(this.getControlName(fc));
            }
        } else if(fc instanceof FormArray){
          const controls1 = Object.values(fc.controls);
          controls1.forEach(fa => {
            this.emptyEmptyArray(fa as FormGroup);
             
            if(!Object.values((fa as FormGroup).controls).length) {
              fc.removeAt(fc.controls.indexOf(fa));
            } else if(fa.pristine) {
              //  && !(fa as FormGroup).contains('id')
              fc.removeAt(fc.controls.indexOf(fa));
            }
          });
          if(!fc.controls.length) {
            formValue.removeControl(this.getControlName(fc));
          }
        } else if(fc.value == null) {
          formValue.removeControl(this.getControlName(fc));
        }
      });
  }

  getControlName(c: AbstractControl): string | null {
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
  }

  getDirtyValues(form: any) {
        let dirtyValues = {};

        Object.keys(form.controls).forEach(key => {
                const currentControl = form.controls[key];
                if (currentControl.dirty || key === 'id') {
                    if (currentControl.controls) {
                        dirtyValues[key] = this.getDirtyValues(currentControl);
                    } else {
                        dirtyValues[key] = currentControl.value;
                    }
                }
            });

        return dirtyValues;
    }


  emptyNull(formValue): boolean {
    
    for (let prop in formValue) {
      if (!formValue[prop]) {
        delete formValue[prop];
      }
      if (Array.isArray(formValue[prop])) {
        formValue[prop].forEach((field, index) => {
          if(this.emptyNull(field)){
            // formValue[prop].splice(index,1);
          }
        });
      } else if(formValue[prop] instanceof Date){
        console.log(formValue);
      } else if(typeof formValue[prop] == "object") {
        if(this.emptyNull(formValue[prop])){
            delete formValue[prop];
          }
      }
    }
    for(var key in formValue) {
        if(formValue[key])
            return false;
    }
    return true;
  }

  onReset() {
    // if(this.putData) {
    this.form.reset(this.putData);
    // } else {
    //   this.form.reset();
    // }
    //this.cancel.emit();
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      switch (field.type) {
        case 'button': {
          this.submitText = field.label;
          break;
        }
        case 'divider': {
          break;
        }
        case 'inputselect': {
          if(field.name) {
            group.addControl(field.name, this.createItem(field));
          } else {
            field.collections.forEach(kid => {
              const control = this.fb.control(
                kid.value,
                this.bindValidations(kid.validations || [])
              );
              group.addControl(kid.name, control);
            });
          }
          break;
        }
        case 'selectgroup': {
          const control = this.fb.control(
            field.collections[1].value,
            this.bindValidations(field.collections[1].validations || [])
          );
          group.addControl(field.collections[1].name, control);
          break;
        }
        case 'calculatefew': {
          if(field.name) {
            group.addControl(field.name, this.createItem(field));
          } else {
            this.createCalculateFewNoName(group, field);
          }
          break;
        }
        case 'array': {
          group.addControl(field.name, this.fb.array([this.fb.group({value: this.fb.control(field.value, this.bindValidations(field.validations || []) )})]));
          break;
        }
        case 'arrayordinal': {
          group.addControl(field.name, this.fb.array([this.fb.group({ordinal: [1], amount: this.fb.control(field.value, this.bindValidations(field.validations || []) )})]));
          const num = field.collections+1;
          for(let i = 2; i < num; i++) {
            (group.get([field.name]) as FormArray).push(this.fb.group({ordinal: [i], amount: this.fb.control(field.value, this.bindValidations(field.validations || []) )}));
          }
          break;
        }
        case 'bigexpand': {
          if(field.value === 'required') {
            group.addControl(field.name, this.fb.array([this.createItem(field)], atLeastOneRequired()));
          } else {
            group.addControl(field.name, this.fb.array([this.createItem(field)]));
          }         
          break;
        }
        case 'bigoutside':
        case 'bignotexpand': {
          group.addControl(field.name, this.createItem(field));          
          break;
        }
        default: {
          const control = this.fb.control(
            field.value,
            this.bindValidations(field.validations || [])
          );
          group.addControl(field.name, control);
        }
      }
    });
    return group;
  }

  createItem(field: FieldConfig): FormGroup {
    var group2: FormGroup;
    if(field.hasOwnProperty('validations')) {
      group2 = this.fb.group({}, {validators: [allOrNoneRequired(field.validations)]});
    } else {
      group2 = this.fb.group({});
    }
    field.collections.forEach(kid => {
      let temp: FieldConfig = Object.assign({}, kid); 
      switch (temp.type) {
        case 'divider': {
          break;
        }
        case 'inputselect': {
          if(temp.name) {
            group2.addControl(temp.name, this.createItem(temp));
          } else {
            temp.collections.forEach(opt => {
              const control = this.fb.control(
                opt.value,
                this.bindValidations(opt.validations || [])
              );
              group2.addControl(opt.name, control);
            });
          }
          break;
        }
        case 'selectgroup': {
          const control = this.fb.control(
            temp.collections[1].value,
            this.bindValidations(temp.collections[1].validations || [])
          );
          group2.addControl(temp.collections[1].name, control);
          break;
        }
        case 'calculatefew': {
          if(temp.name) {
            group2.addControl(temp.name, this.createItem(temp));
          } else {
            this.createCalculateFewNoName(group2, temp);
          }
          break;
        }
        case 'array': {
          group2.addControl(temp.name, this.fb.array([this.fb.group({value: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )})]));
          break;
        }
        case 'arrayordinal': {
          group2.addControl(temp.name, this.fb.array([this.fb.group({ordinal: [1], amount: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )})]));
          const num = temp.collections+1;
          for(let i = 2; i < num; i++) {
            (group2.get([temp.name]) as FormArray).push(this.fb.group({ordinal: [i], amount: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )}));
          }
          break;
        }
        case 'bigexpand': {
          if(temp.value === 'required') {
            group2.addControl(temp.name, this.fb.array([this.createItem(temp)], atLeastOneRequired()));
          } else {
            group2.addControl(temp.name, this.fb.array([this.createItem(temp)]));
          }         
          break;
        }
        case 'bigoutside':
        case 'bignotexpand': {
          group2.addControl(temp.name, this.createItem(temp));          
          break;
        }
        default: {
          const control = this.fb.control(
            temp.value,
            this.bindValidations(temp.validations || [])
          );
          group2.addControl(temp.name, control);
        }
      }
    });
    return group2;
  }

  createCalculateFewNoName(group: FormGroup, field) {
    field.collections.forEach(kid => {
      if(kid.type === 'inputselect') {
        if(kid.name) {
          group.addControl(kid.name, this.createItem(kid));
        } else {
          kid.collections.forEach(element => {
            const control = this.fb.control(
              element.value,
              this.bindValidations(element.validations || [])
            );
            group.addControl(element.name, control);
          });
        }
      } else {
        const control = this.fb.control(
          kid.value,
          this.bindValidations(kid.validations || [])
        );
        group.addControl(kid.name, control);
      }
    });
  }

  createCalculateFewWithDataNoName(group: FormGroup, field, value: any) {
    if(!value) {
      value = {};
    }
    field.collections.forEach(kid => {
      if(kid.type === 'inputselect') {
        if(kid.name) {
          group.addControl(kid.name, this.createItemWithData(kid, value.hasOwnProperty([kid.name]) ? value[kid.name] : {}));
        } else {
          kid.collections.forEach(element => {
            const control = this.fb.control(
              { 
                value: value.hasOwnProperty([element.name]) ? value[element.name] : element.value,
                disabled: element.disable 
              },
              this.bindValidations(element.validations || [])
            );
            group.addControl(element.name, control);
          });
        }
      } else {
        const control = this.fb.control(
          { 
            value: value.hasOwnProperty([kid.name]) ? value[kid.name] : kid.value,
            disabled: kid.disable 
          },
          this.bindValidations(kid.validations || [])
        );
        group.addControl(kid.name, control);
      }
    });
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

  bindValidationsNoReqierd(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        if (valid.name !== 'required') {
          validList.push(valid.validator);
        }
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      //control.markAllAsTouched();
      
    });
  }

  setValue(value: any) {
    this.form.patchValue(value);
  }
  

  createControlWithData() {
    let value = this.putData;
    if(!value) {
      value = {};
    }
    const group = this.fb.group({});
    if(value.hasOwnProperty('id')) {
      group.addControl('id', this.fb.control(value['id'], null));
    }
    if(value.hasOwnProperty('version')) {
      group.addControl('version', this.fb.control(value['version'], null));
    }
    this.fields.forEach(field => {
      switch (field.type) {
        case 'button': {
          this.submitText = field.label;
          break;
        }
        case 'divider': {
          break;
        }
        case 'inputselect':{
          if(field.name) {
            group.addControl(field.name, this.createItemWithData(field, value.hasOwnProperty([field.name]) ? value[field.name] : {}));
          } else {
            field.collections.forEach(kid => {
              var control = this.fb.control(
                  value[kid.name]? value[kid.name] : kid.value,
                  this.bindValidations(kid.validations || [])
                );
              group.addControl(kid.name, control);
            });
          }
          break;
        }
        case 'selectgroup': {
          var control = this.fb.control(
              value[field.collections[1].name]? value[field.collections[1].name] : field.collections[1].value,
              this.bindValidations(field.collections[1].validations || [])
            );
          group.addControl(field.collections[1].name, control);
          break;
        }
        case 'calculatefew': {
          if(field.name) {
            group.addControl(field.name, this.createItemWithData(field, value.hasOwnProperty([field.name]) ? value[field.name] : {}));
          } else {
            this.createCalculateFewWithDataNoName(group, field, value);
          }
          break;
        }
        case 'array': {
          let groupJson = null;
          if(value.hasOwnProperty(field.name)) {
            groupJson = value[field.name];
          }
          if(groupJson && groupJson.length !== 0) {
            group.addControl(field.name, this.fb.array([this.fb.group({id: groupJson[0].id, version: groupJson[0].version,
              value: this.fb.control(groupJson[0].value, this.bindValidations(field.validations || []) )})]));
            for(let i = 1; i < groupJson.length; i++) {
              (group.get([field.name]) as FormArray).push(this.fb.group({id: groupJson[i].id, version: groupJson[i].version,
                value: this.fb.control(groupJson[i].value, this.bindValidationsNoReqierd(field.validations || []) )}));
            }
            (group.get([field.name]) as FormArray).controls.forEach(lm => lm.markAsDirty());
          } else {
            group.addControl(field.name, this.fb.array([this.fb.group({value: this.fb.control(field.value, this.bindValidations(field.validations || []) )})]));
          }
          break;
        }
        case 'arrayordinal': {
          let groupJson = null;
          if(value.hasOwnProperty(field.name)) {
            groupJson = value[field.name];
          }
          if(field.inputType === 'choose') {
            if(groupJson && groupJson.length !== 0) {
              group.addControl(field.name, this.fb.array([this.fb.group({storageId: groupJson[0].storageId, storageVersion: groupJson[0].storageVersion, take: groupJson[0].take? true: false, id: groupJson[0].id, version: groupJson[0].version, ordinal: groupJson[0].ordinal, amount: this.fb.control(groupJson[0].amount, this.bindValidations(field.validations || []) )})]));
              for(let i = 1; i < groupJson.length; i++) {  
                  (group.get([field.name]) as FormArray).push(this.fb.group({storageId: groupJson[i].storageId, storageVersion: groupJson[i].storageVersion, take: groupJson[i].take? true: false, id: groupJson[i].id, version: groupJson[i].version, ordinal: groupJson[i].ordinal, amount: this.fb.control(groupJson[i].amount, this.bindValidations(field.validations || []) )}));
              }
              (group.get([field.name]) as FormArray).controls.forEach(lm => lm.markAsDirty());
            }
          } else {
            if(groupJson && groupJson.length !== 0) {
              var groupLocation = 0;
              if(groupJson[0].ordinal === 1) {
                group.addControl(field.name, this.fb.array([this.fb.group({id: groupJson[0].id, version: groupJson[0].version, ordinal: 1, amount: this.fb.control(groupJson[0].amount, this.bindValidations(field.validations || []) )})]));
                groupLocation++;
              } else {
                group.addControl(field.name, this.fb.array([this.fb.group({ordinal: 1, amount: this.fb.control(field.value, this.bindValidations(field.validations || []) )})]));
              }
              const num = field.collections+1;
              for(let i = 2; i < num; i++) {
                if(groupJson[groupLocation].ordinal === i) {
                  (group.get([field.name]) as FormArray).push(this.fb.group({id: groupJson[groupLocation].id, version: groupJson[groupLocation].version, ordinal: i, amount: this.fb.control(groupJson[groupLocation].amount, this.bindValidations(field.validations || []) )}));
                  groupLocation++;
                } else {
                  (group.get([field.name]) as FormArray).push(this.fb.group({ordinal: i, amount: this.fb.control(field.value, this.bindValidations(field.validations || []) )}));
                }
              }
              while(groupLocation < groupJson.length) {
                for(let i = (group.get([field.name]) as FormArray).length+1; i < groupJson[groupLocation].ordinal ; i++) {
                  (group.get([field.name]) as FormArray).push(this.fb.group({ordinal: i, amount: this.fb.control(field.value, this.bindValidations(field.validations || []) )}));
                }
                (group.get([field.name]) as FormArray).push(this.fb.group({id: groupJson[groupLocation].id, version: groupJson[groupLocation].version, ordinal: groupJson[groupLocation].ordinal, amount: this.fb.control(groupJson[groupLocation].amount, this.bindValidations(field.validations || []) )}));
                groupLocation++;
              }
              (group.get([field.name]) as FormArray).controls.forEach(lm => {if((lm as FormGroup).contains('id')){lm.markAsDirty()}});
            } else {
              group.addControl(field.name, this.fb.array([this.fb.group({ordinal: [1], amount: this.fb.control(field.value, this.bindValidations(field.validations || []) )})]));
              const num = field.collections+1;
              for(let i = 2; i < num; i++) {
                (group.get([field.name]) as FormArray).push(this.fb.group({ordinal: [i], amount: this.fb.control(field.value, this.bindValidations(field.validations || []) )}));
              }
            }
          }
          break;
        }
        case 'tableWithInput': {
          let groupJson = null;
          if(value.hasOwnProperty(field.name)) {
            groupJson = value[field.name];
          }
          group.addControl(field.name, this.fb.array([this.createItemWithData(field, groupJson[0])]));
          control = this.fb.control(
            groupJson[0][field.options]
          );
          ((group.get([field.name]) as FormArray).at(0) as FormGroup).addControl(field.options, control);
          for(let i = 1; i < groupJson.length; i++) {
            (group.get([field.name]) as FormArray).push(this.createItemWithData(field, groupJson[i]));
            control = this.fb.control(
              groupJson[i][field.options]
            );
            ((group.get([field.name]) as FormArray).at(i) as FormGroup).addControl(field.options, control);
          }
          (group.get([field.name]) as FormArray).controls.forEach(lm => lm.markAsDirty());
          break;
        } 
        case 'bigexpand': {
          let groupJson = null;
          if(value.hasOwnProperty(field.name)) {
            groupJson = value[field.name];
          }
          if(field.value === 'required') {
            if(groupJson && groupJson.length !== 0) {
              group.addControl(field.name, this.fb.array([this.createItemWithData(field, groupJson[0])], atLeastOneRequired()));
              for(let i = 1; i < groupJson.length; i++) {
                (group.get([field.name]) as FormArray).push(this.createItemWithData(field, groupJson[i]));
              }
              (group.get([field.name]) as FormArray).controls.forEach(lm => lm.markAsDirty());
            } else {
              group.addControl(field.name, this.fb.array([this.createItemWithData(field, {})], atLeastOneRequired()));
            }
          } else {
            if(groupJson && groupJson.length !== 0) {
              group.addControl(field.name, this.fb.array([this.createItemWithData(field, groupJson[0])]));
              for(let i = 1; i < groupJson.length; i++) {
                (group.get([field.name]) as FormArray).push(this.createItemWithData(field, groupJson[i]));
              }
              (group.get([field.name]) as FormArray).controls.forEach(lm => lm.markAsDirty());
            } else {
              group.addControl(field.name, this.fb.array([this.createItemWithData(field, {})]));
            }
          }
          break;
        }
        case 'bigoutside':
        case 'bignotexpand': {
          group.addControl(field.name, this.createItemWithData(field, value.hasOwnProperty([field.name]) ? value[field.name] : {}));
          break;
        }
        default: {
          const control = this.fb.control(
            value.hasOwnProperty(field.name)? value[field.name] : field.value,
            this.bindValidations(field.validations || [])
          );
          group.addControl(field.name, control);
        }
      }
    });
    return group;
  }

  createItemWithData(field: FieldConfig, value: any): FormGroup {
    if(!value) {
      value = {};
    }
    var group2: FormGroup;
    if(field.hasOwnProperty('validations')) {
      group2 = this.fb.group({}, {validators: [allOrNoneRequired(field.validations)]});
    } else {
      group2 = this.fb.group({});
    }
    if(value.hasOwnProperty('id')) {
      group2.addControl('id', this.fb.control(value['id'], null));
    }
    if(value.hasOwnProperty('version')) {
      group2.addControl('version', this.fb.control(value['version'], null));
    }
    field.collections.forEach(kid => {
      let temp: FieldConfig = Object.assign({}, kid); 
      switch (temp.type) {
        case 'divider': {
          break;
        }
        case 'inputselect': {
          if(temp.name) {
            group2.addControl(temp.name, this.createItemWithData(temp, value.hasOwnProperty([temp.name]) ? value[temp.name] : {}));
          } else {
            temp.collections.forEach(opt => {
              var control = this.fb.control(
                  value[opt.name]? value[opt.name] : opt.value,
                  this.bindValidations(opt.validations || [])
                );
              group2.addControl(opt.name, control);
            });
          }
          break;
        }
        case 'selectgroup': {
          var control = this.fb.control(
              value[temp.collections[1].name]? value[temp.collections[1].name] : temp.collections[1].value,
              this.bindValidations(temp.collections[1].validations || [])
            );
          group2.addControl(temp.collections[1].name, control);
          break;
        }
        case 'calculatefew': {
          if(temp.name) {
            group2.addControl(temp.name, this.createItemWithData(temp, value.hasOwnProperty([temp.name]) ? value[temp.name] : {}));
          } else {
            this.createCalculateFewWithDataNoName(group2, temp, value);
          }
          break;
        }
        case 'array': {
          let groupJson = null;
          if(value.hasOwnProperty(temp.name)) {
            groupJson = value[temp.name];
          }
          if(groupJson && groupJson.length !== 0) {
            group2.addControl(temp.name, this.fb.array([this.fb.group({id: groupJson[0].id, version: groupJson[0].version,
              value: this.fb.control(groupJson[0].value, this.bindValidations(temp.validations || []) )})]));
            for(let i = 1; i < groupJson.length; i++) {
              (group2.get([temp.name]) as FormArray).push(this.fb.group({id: groupJson[i].id, version: groupJson[i].version,
                value: this.fb.control(groupJson[i].value, this.bindValidationsNoReqierd(temp.validations || []) )}));
            }
            (group2.get([temp.name]) as FormArray).controls.forEach(tm => tm.markAsDirty());
          } else {
            group2.addControl(temp.name, this.fb.array([this.fb.group({value: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )})]));
          }
          break;
        }
        case 'arrayordinal': {
          let groupJson = null;
          if(value.hasOwnProperty(temp.name)) {
            groupJson = value[temp.name];
          }
          if(temp.inputType === 'choose') {
            if(groupJson && groupJson.length !== 0) {
              group2.addControl(temp.name, this.fb.array([this.fb.group({storageId: groupJson[0].storageId, storageVersion: groupJson[0].storageVersion, take: groupJson[0].take? true: false, id: groupJson[0].id, version: groupJson[0].version, ordinal: groupJson[0].ordinal, amount: this.fb.control(groupJson[0].amount, this.bindValidations(temp.validations || []) )})]));
              for(let i = 1; i < groupJson.length; i++) {  
                  (group2.get([temp.name]) as FormArray).push(this.fb.group({storageId: groupJson[i].storageId, storageVersion: groupJson[i].storageVersion, take: groupJson[i].take? true: false, id: groupJson[i].id, version: groupJson[i].version, ordinal: groupJson[i].ordinal, amount: this.fb.control(groupJson[i].amount, this.bindValidations(temp.validations || []) )}));
              }
              (group2.get([temp.name]) as FormArray).controls.forEach(tm => tm.markAsDirty());
            }
          } else {
            if(groupJson && groupJson.length !== 0) {
              var groupLocation = 0;
              if(groupJson[0].ordinal === 1) {
                group2.addControl(temp.name, this.fb.array([this.fb.group({id: groupJson[0].id, version: groupJson[0].version, ordinal: 1, amount: this.fb.control(groupJson[0].amount, this.bindValidations(temp.validations || []) )})]));
                groupLocation++;
              } else {
                group2.addControl(temp.name, this.fb.array([this.fb.group({ordinal: 1, amount: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )})]));
              }
              const num = temp.collections+1;
              for(let i = 2; i < num; i++) {  
                if(groupLocation < groupJson.length && groupJson[groupLocation].ordinal === i) {
                  (group2.get([temp.name]) as FormArray).push(this.fb.group({id: groupJson[groupLocation].id, version: groupJson[groupLocation].version, ordinal: i, amount: this.fb.control(groupJson[groupLocation].amount, this.bindValidations(temp.validations || []) )}));
                  groupLocation++;
                } else {
                  (group2.get([temp.name]) as FormArray).push(this.fb.group({ordinal: i, amount: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )}));
                }
              }
              while(groupLocation < groupJson.length) {
                for(let i = (group2.get([temp.name]) as FormArray).length+1; i < groupJson[groupLocation].ordinal ; i++) {
                  (group2.get([temp.name]) as FormArray).push(this.fb.group({ordinal: i, amount: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )}));
                }
                (group2.get([temp.name]) as FormArray).push(this.fb.group({id: groupJson[groupLocation].id, version: groupJson[groupLocation].version, ordinal: groupJson[groupLocation].ordinal, amount: this.fb.control(groupJson[groupLocation].amount, this.bindValidations(temp.validations || []) )}));
                groupLocation++;
              }
              (group2.get([temp.name]) as FormArray).controls.forEach(lm => {if((lm as FormGroup).contains('id')){lm.markAsDirty()}});
            } else {
              group2.addControl(temp.name, this.fb.array([this.fb.group({ordinal: [1], amount: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )})]));
              const num = temp.collections+1;
              for(let i = 2; i < num; i++) {
                (group2.get([temp.name]) as FormArray).push(this.fb.group({ordinal: [i], amount: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )}));
              }
            }
          }
          break;
        }
        case 'tableWithInput': {
          let groupJson = null;
          if(value.hasOwnProperty(temp.name)) {
            groupJson = value[temp.name];
          }
            group2.addControl(temp.name, this.fb.array([this.createItemWithData(temp, groupJson[0])]));
            control = this.fb.control(
              groupJson[0][temp.options]
            );
            ((group2.get([temp.name]) as FormArray).at(0) as FormGroup).addControl(temp.options, control);
            for(let i = 1; i < groupJson.length; i++) {
              (group2.get([temp.name]) as FormArray).push(this.createItemWithData(temp, groupJson[i]));
              control = this.fb.control(
                groupJson[i][temp.options]
              );
              ((group2.get([temp.name]) as FormArray).at(i) as FormGroup).addControl(temp.options, control);
            }
            (group2.get([temp.name]) as FormArray).controls.forEach(tm => tm.markAsDirty());
          break;
        }
        case 'bigexpand': {
          let groupJson = null;
          if(value.hasOwnProperty(temp.name)) {
            groupJson = value[temp.name];
          }
          if(temp.value === 'required') {
            if(groupJson && groupJson.length !== 0) {
              group2.addControl(temp.name, this.fb.array([this.createItemWithData(temp, groupJson[0])], atLeastOneRequired()));
              for(let i = 1; i < groupJson.length; i++) {
                (group2.get([temp.name]) as FormArray).push(this.createItemWithData(temp, groupJson[i]));
              }
              (group2.get([temp.name]) as FormArray).controls.forEach(tm => tm.markAsDirty());
            } else {
              group2.addControl(temp.name, this.fb.array([this.createItemWithData(temp, {})], atLeastOneRequired()));
            }
          } else {
            if(groupJson && groupJson.length !== 0) {
              group2.addControl(temp.name, this.fb.array([this.createItemWithData(temp, groupJson[0])]));
              for(let i = 1; i < groupJson.length; i++) {
                (group2.get([temp.name]) as FormArray).push(this.createItemWithData(temp, groupJson[i]));
              }
              (group2.get([temp.name]) as FormArray).controls.forEach(tm => tm.markAsDirty());
            } else {
              group2.addControl(temp.name, this.fb.array([this.createItemWithData(temp, {})]));
            }
          }
          break;
        }
        case 'bigoutside':
        case 'bignotexpand': {
          group2.addControl(temp.name, this.createItemWithData(temp, value.hasOwnProperty([temp.name]) ? value[temp.name] : {}));
          break;
        }
        default: {
          control = this.fb.control(
            value.hasOwnProperty(temp.name)? value[temp.name] : temp.value,
            this.bindValidations(temp.validations || [])
          );
          group2.addControl(temp.name, control);
        }
      }
    });
    return group2;
  }
  
}


