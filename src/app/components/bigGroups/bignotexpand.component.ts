import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { ArrayOrdinalComponent } from '../array/array-ordinal.component';
import { ArrayComponent } from '../array/array.component';
import { CalculateFewComponent } from '../calculateFew/calculate-few.component';
import { DividerComponent } from '../divider-text/divider.component';
import { InputReadonlyComponent } from '../inputs/input-readonly.component';
import { InputSelectComponent } from '../inputs/input-select.component';
import { InputToPercentageComponent } from '../inputs/input-to-percentage.component';
import { InputComponent } from '../inputs/input.component';
import { PercentInputComponent } from '../inputs/percent-input.component';
import { PopupformComponent } from '../popupform/popupform.component';
import { CheckboxComponent } from '../selects/checkbox.component';
import { DateComponent } from '../selects/date.component';
import { RadiobuttonComponent } from '../selects/radio-button.component';
import { SelectgroupComponent } from '../selects/select-group.component';
import { SelectItemComponent } from '../selects/select-item.component';
import { SelectMultipileComponent } from '../selects/select-multipile.component';
import { SelectNormalMultipleComponent } from '../selects/select-normal-multiple.component';
import { SelectNormalComponent } from '../selects/select-normal.component';
import { SelectComponent } from '../selects/select.component';
import { SelectLineComponent } from '../selects/slecet-line.component';
import { UploadComponent } from '../selects/upload.component';
import { TextarryComponent } from '../textarry/textarry.component';


const componentMapper = {
  input: InputComponent,
  inputselect: InputSelectComponent,
  select: SelectComponent,
  selectItem: SelectItemComponent,
  selectMultipile: SelectMultipileComponent,
  selectNormal: SelectNormalComponent,
  selectNormalMultiple: SelectNormalMultipleComponent,
  date: DateComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent,
  textarry: TextarryComponent,
  array: ArrayComponent,
  arrayordinal: ArrayOrdinalComponent,
  selectgroup: SelectgroupComponent,
  selectLine: SelectLineComponent,
  divider: DividerComponent,
  popup: PopupformComponent,
  upload: UploadComponent,
  calculatefew: CalculateFewComponent,
  inputtopercentage: InputToPercentageComponent,
  percentinput: PercentInputComponent,
  inputReadonly: InputReadonlyComponent,
  inputReadonlySelect: InputReadonlyComponent,
};
@Component({
  selector: 'app-bignotexpand',
  template: `
<h1 *ngIf="field.label">{{field.label}}</h1>
<ng-container ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.name).hasError('allOrNoneRequired') && checkAllTouchedBegin()">{{field.validations[0]['message']}}</mat-error>
</ng-container>
<ng-template #container2></ng-template>
`,
  styles: []
})
export class BignotexpandComponent implements OnInit {
  @ViewChild('container2', { read: ViewContainerRef, static: true }) _vcr2

  edit: boolean;
  field: FieldConfig;
  group: FormGroup;
  resolver: ComponentFactoryResolver;
  componentRef: any;

  constructor() {}
  ngOnInit() {
      this.field.collections.forEach(element => {
        if(this.edit && element.disable && !['bignotexpand', 'bigoutside', 'calculatefew', 'divider', 'popup'].includes( element.type ) && (this.group.get([this.field.name]) as FormGroup).get(this.findFieldName(element)).value ) {
          const factory = this.resolver.resolveComponentFactory(
            componentMapper['inputReadonly']
          );
          this.componentRef = this._vcr2.createComponent(factory);
          this.componentRef.instance.field = element;
          this.componentRef.instance.group = this.group.get([this.field.name]);
        } else {
          var factory;
          if(element.type === 'bignotexpand') {
            factory = this.resolver.resolveComponentFactory(
              BignotexpandComponent
            );
          } else{
            factory = this.resolver.resolveComponentFactory(
              componentMapper[element.type]
            );
          }
          this.componentRef = this._vcr2.createComponent(factory);
          if(['bignotexpand', 'calculatefew' ].includes( element.type)) {
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

  findFieldName(element) {
    if(element.name) {
      return element.name;
    } else if('inputselect' === element.type) {
      element.collections[0].name;
    } else {
      return element.collections[1].name;
    }
  }

  ngOnDestroy() {
        this._vcr2.clear();
      }

}


