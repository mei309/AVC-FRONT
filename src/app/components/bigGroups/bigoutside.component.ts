import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { FieldConfig } from '../../field.interface';
import { ArrayComponent } from '../array/array.component';
import { CheckboxComponent } from '../selects/checkbox.component';
import { DateComponent } from '../selects/date.component';
import { DividerComponent } from '../divider-text/divider.component';
import { InputComponent } from '../inputs/input.component';
import { RadiobuttonComponent } from '../selects/radio-button.component';
import { SelectComponent } from '../selects/select.component';
import { SelectgroupComponent } from '../selects/select-group.component';
import { SelectNormalComponent } from '../selects/select-normal.component';
import { TextarryComponent } from '../textarry/textarry.component';
import { BigexpandComponent } from './bigexpand.component';
import { BignotexpandComponent } from './bignotexpand.component';
import { CalculateFewComponent } from '../calculateFew/calculate-few.component';
import { InputToPercentageComponent } from '../inputs/input-to-percentage.component';
import { InputSelectComponent } from '../inputs/input-select.component';
import { PopupformComponent } from '../popupform/popupform.component';
import { UploadComponent } from '../selects/upload.component';
import { InputReadonlyComponent } from '../inputs/input-readonly.component';
import { TableInfoComponent } from '../tablesinput/tableinfo.component';
import { TableInfoGroupComponent } from '../tablesinput/tableinfogroup.component';
import { SelectLineComponent } from '../selects/slecet-line.component';
import { ArrayOrdinalComponent } from '../array/array-ordinal.component';
import { PercentInputComponent } from '../inputs/percent-input.component';

const componentMapper = {
  input: InputComponent,
  inputselect: InputSelectComponent,
  select: SelectComponent,
  date: DateComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent,
  textarry: TextarryComponent,
  array: ArrayComponent,
  arrayordinal: ArrayOrdinalComponent,
  selectgroup: SelectgroupComponent,
  selectLine: SelectLineComponent,
  selectNormal: SelectNormalComponent,
  divider: DividerComponent,
  popup: PopupformComponent,
  bignotexpand: BignotexpandComponent,
  bigexpand: BigexpandComponent,
  tableInfo: TableInfoComponent,
  tableinfogroup: TableInfoGroupComponent,
  upload: UploadComponent,
  calculatefew: CalculateFewComponent,
  inputtopercentage: InputToPercentageComponent,
  percentinput: PercentInputComponent,
  inputReadonly: InputReadonlyComponent,
  inputReadonlySelect: InputReadonlyComponent,
};
@Component({
  selector: 'app-bigoutside',
  template: `
  <ng-container ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError('allOrNoneRequired') && checkAllTouchedBegin()">{{field.validations[0].message}}</mat-error>
  </ng-container>
  <h1 *ngIf="field.inputType == 'alone'">{{field.label}}</h1>
  <ng-template #container3></ng-template>
`,
})
export class BigoutsideComponent implements OnInit {
  @ViewChild('container3', { read: ViewContainerRef, static: true }) _vcr3
  edit: boolean;
  field: FieldConfig;
  group: FormGroup;
  resolver: ComponentFactoryResolver;
  componentRef: any;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
      this.field.collections.forEach(element => {
        // this.group.get([this.field.name]).get(element.name).value &&
        if(this.edit && element.disable && !['bigexpand', 'bignotexpand', 'bigoutside', 'calculatefew', 'divider', 'popup'].includes( element.type )) {
          const factory = this.resolver.resolveComponentFactory(
            componentMapper['inputReadonly']
          );
          this.componentRef = this._vcr3.createComponent(factory);
          this.componentRef.instance.field = element;
          this.componentRef.instance.group = this.group.get([this.field.name]);
        } else {
            var factory;
            if ('bigoutside' === element.type){
              factory = this.resolver.resolveComponentFactory(
                BigoutsideComponent
              );
            } else {
              factory = this.resolver.resolveComponentFactory(
                componentMapper[element.type]
              );
            }
            this.componentRef = this._vcr3.createComponent(factory);
            if(['bigoutside', 'bignotexpand' , 'bigexpand' , 'calculatefew' ].includes( element.type )) {
                this.componentRef.instance.resolver = this.resolver;
                this.componentRef.instance.edit = this.edit;
            }
            this.componentRef.instance.field = element;
            this.componentRef.instance.group = this.group.get([this.field.name]);
        }
      });
  }

  checkAllTouchedBegin(){
    return this.checkAllTouched(this.group.get([this.field.name]) as FormGroup);
  }
  checkAllTouched(fg: FormGroup): boolean{
    const controls = Object.values(fg.controls);
    return controls.every(fc => {
        if(fc instanceof FormGroup){
          return this.checkAllTouched(fc);
        } else if(fc instanceof FormArray){
          return fc.controls.every(ft => {return this.checkAllTouched(ft as FormGroup)});
        } else {
          if(fc.touched) {
            return true;
          } else {
            return false;
          }
        }
      });
  }

  ngOnDestroy() {
        this._vcr3.clear();
      }

}



