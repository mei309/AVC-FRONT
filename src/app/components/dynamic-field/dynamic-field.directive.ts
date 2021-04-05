import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { ArrayOrdinalComponent } from '../array/array-ordinal.component';
import { ArrayComponent } from '../array/array.component';
import { BigexpandComponent } from '../bigGroups/bigexpand.component';
import { BignotexpandComponent } from '../bigGroups/bignotexpand.component';
import { BigoutsideComponent } from '../bigGroups/bigoutside.component';
import { TableWithInputComponent } from '../bigGroups/table-with-input.component';
import { DividerComponent } from '../divider-text/divider.component';
import { InputReadonlyComponent } from '../inputs/input-readonly.component';
import { InputSelectComponent } from '../inputs/input-select.component';
import { InputComponent } from '../inputs/input.component';
import { PopupformComponent } from '../popupform/popupform.component';
import { CheckboxComponent } from '../selects/checkbox.component';
import { DateComponent } from '../selects/date.component';
import { RadiobuttonComponent } from '../selects/radio-button.component';
import { SelectgroupComponent } from '../selects/select-group.component';
import { SelectNormalComponent } from '../selects/select-normal.component';
import { SelectComponent } from '../selects/select.component';
import { SelectLineComponent } from '../selects/slecet-line.component';
import { UploadComponent } from '../selects/upload.component';
import { TableInfoComponent } from '../tablesinput/tableinfo.component';
import { TableInfoGroupComponent } from '../tablesinput/tableinfogroup.component';
import { TextarryComponent } from '../textarry/textarry.component';
import { CalculateFewComponent } from './../calculateFew/calculate-few.component';
import { InputToPercentageComponent } from '../inputs/input-to-percentage.component';
import { PercentInputComponent } from '../inputs/percent-input.component';
import { SelectNormalMultipleComponent } from '../selects/select-normal-multiple.component';
import { SelectMultipileComponent } from '../selects/select-multipile.component';


const componentMapper = {
  input: InputComponent,
  inputselect: InputSelectComponent,
  select: SelectComponent,
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
  bigexpand: BigexpandComponent,
  tableInfo: TableInfoComponent,
  tableinfogroup: TableInfoGroupComponent,
  bignotexpand: BignotexpandComponent,
  popup: PopupformComponent,
  bigoutside: BigoutsideComponent,
  upload: UploadComponent,
  calculatefew: CalculateFewComponent,
  inputtopercentage: InputToPercentageComponent,
  percentinput: PercentInputComponent,
  inputReadonly: InputReadonlyComponent,
  inputReadonlySelect: InputReadonlyComponent,
  tableWithInput: TableWithInputComponent,
};
@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  @Input() edit: boolean;
  componentRef: any;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}
  ngOnInit() {
    if (this.field.type !== 'button') {
     if(this.edit && this.field.disable && !['bixexpand', 'bignotexpand', 'bigoutside', 'calculatefew' ].includes( this.field.type )) {
          const factory = this.resolver.resolveComponentFactory(
            componentMapper['inputReadonly']
          );
          this.componentRef = this.container.createComponent(factory);
          this.componentRef.instance.field = this.field;
          this.componentRef.instance.group = this.group;
      } else {
        const factory = this.resolver.resolveComponentFactory(
          componentMapper[this.field.type]
        );
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.field = this.field;
        this.componentRef.instance.group = this.group;
        if ([ 'bigexpand', 'bignotexpand', 'bigoutside', 'calculatefew' ].includes( this.field.type )) {
          this.componentRef.instance.edit = this.edit;
          this.componentRef.instance.resolver = this.resolver;
        }
      }
    }
  }

  ngOnDestroy(){
    this.container.clear();
  }

}
