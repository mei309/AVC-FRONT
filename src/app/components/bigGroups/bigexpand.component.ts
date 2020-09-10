import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArrayComponent } from '../array/array.component';
import { CheckboxComponent } from '../selects/checkbox.component';
import { DateComponent } from '../selects/date.component';
import { DividerComponent } from '../divider-text/divider.component';
import { InputReadonlyComponent } from '../inputs/input-readonly.component';
import { InputComponent } from '../inputs/input.component';
import { RadiobuttonComponent } from '../selects/radio-button.component';
import { SelectComponent } from '../selects/select.component';
import { SelectgroupComponent } from '../selects/select-group.component';
import { SelectNormalComponent } from '../selects/select-normal.component';
import { TableInfoComponent } from '../tablesinput/tableinfo.component';
import { TableInfoGroupComponent } from '../tablesinput/tableinfogroup.component';
import { TextarryComponent } from '../textarry/textarry.component';
import { allOrNoneRequired, FieldConfig } from '../../field.interface';
import { BignotexpandComponent } from './bignotexpand.component';
import { CalculateFewComponent } from '../calculateFew/calculate-few.component';
import { InputToPercentageComponent } from '../inputs/input-to-percentage.component';
import { InputSelectComponent } from '../inputs/input-select.component';
import { PopupformComponent } from '../popupform/popupform.component';
import { UploadComponent } from '../selects/upload.component';
import { ButtonsComponent } from './buttons.component';
import { TableWithInputComponent } from './table-with-input.component';
import { SelectLineComponent } from '../selects/slecet-line.component';
import { ArrayOrdinalComponent } from '../array/array-ordinal.component';
import { PercentInputComponent } from '../inputs/percent-input.component';


const componentMapper = {
  input: InputComponent,
  inputselect: InputSelectComponent,
  select: SelectComponent,
  selectNormal: SelectNormalComponent,
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
  bignotexpand: BignotexpandComponent,
  upload: UploadComponent,
  calculatefew: CalculateFewComponent,
  inputtopercentage: InputToPercentageComponent,
  percentinput: PercentInputComponent,
  tableInfo: TableInfoComponent,
  tableinfogroup: TableInfoGroupComponent,
  buttons: ButtonsComponent,
  inputReadonly: InputReadonlyComponent,
  inputReadonlySelect: InputReadonlyComponent,
  tableWithInput: TableWithInputComponent,
};
@Component({
  selector: 'app-bigexpand',
  template: `
<ng-container [ngSwitch]="field.options">

  <ng-container *ngSwitchCase="'tabs'">
    <div style="background-color: lightGrey;">
      <ng-container ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError('atLeastOneRequired') && checkAllTouchedArray()">at least one line required</mat-error>
      </ng-container>
      <mat-tab-group (selectedIndexChange)="onTabChange($event)" [selectedIndex]="selectedTab">
          <mat-tab *ngFor="let item of formArray.controls; let i = index;">
            <ng-template mat-tab-label>
              <span *ngIf="item.get(field.collections[0].name).value">{{item.get(field.collections[0].name).value['value']}}</span>
              &nbsp;
              {{field.label}}
              &nbsp;
              <button type="button" mat-icon-button (click)="removeIndexTotelly(i)">
                  <mat-icon>delete</mat-icon>
              </button>
            </ng-template>
          </mat-tab>
          <mat-tab disabled>
              <ng-template mat-tab-label>
                <button type="button" mat-icon-button (click)="onAddTab()">
                    <mat-icon>add_circle</mat-icon>
                </button>
              </ng-template>
        </mat-tab>
      </mat-tab-group>
      <ng-template #container></ng-template>
    </div>
  </ng-container>

  <ng-container *ngSwitchCase="'Inline'">
    <div class="div-inline">
      <ng-container ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError('atLeastOneRequired') && checkAllTouchedArray()">at least one line required</mat-error>
      </ng-container>
      <ng-template #container></ng-template>
      <button *ngIf="group.enabled" type="button" style="margin-top: 10px; width: 100%;" class="add-button" (click)="addItem()">Add {{field.label}}</button>
    </div>
  </ng-container>
  
  <ng-container *ngSwitchCase="'aloneNoAddNoFrameInline'">
    <div class="div-inline">
      <ng-container ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError('atLeastOneRequired') && checkAllTouchedArray()">at least one line required</mat-error>
      </ng-container>
      <ng-template #container></ng-template>
    </div>
  </ng-container>

  <ng-container *ngSwitchCase="'aloneNoAddNoFrame'">
    <div>
      <ng-container ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError('atLeastOneRequired') && checkAllTouchedArray()">at least one line required</mat-error>
      </ng-container>
      <ng-template #container></ng-template>
    </div>
  </ng-container>

  <ng-container *ngSwitchCase="'aloneNoAdd'">
    <fieldset [ngStyle]="{'border': '2px groove'}">
      <legend><h1>{{field.label}}</h1></legend>
      <ng-container ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError('atLeastOneRequired') && checkAllTouchedArray()">at least one line required</mat-error>
      </ng-container>
      <ng-template #container></ng-template>
    </fieldset>
  </ng-container>

  <ng-container *ngSwitchCase="'NoFrame'">
      <ng-container ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError('atLeastOneRequired') && checkAllTouchedArray()">at least one line required</mat-error>
      </ng-container>
      <ng-template #container></ng-template>
      <div *ngIf="group.enabled">
        <button type="button" style="margin-top: 10px;" mat-raised-button color="accent" (click)="addItem()">Add {{field.label}}</button>
      </div>
  </ng-container>

  <ng-container *ngSwitchDefault>
    <fieldset [ngStyle]="{'border': '2px groove'}">
      <legend><h1>{{field.label}}</h1></legend>
      <ng-container ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError('atLeastOneRequired') && checkAllTouchedArray()">at least one line required</mat-error>
      </ng-container>
      <ng-template #container></ng-template>
      <div *ngIf="group.enabled">
        <button type="button" style="margin-top: 10px;" mat-raised-button color="accent" (click)="addItem()">Add {{field.label}}</button>
      </div>
    </fieldset>
  </ng-container>
</ng-container>

`,
})
export class BigexpandComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef, static: false}) _vcr;

  edit: boolean;
  field: FieldConfig;
  group: FormGroup;
  resolver: ComponentFactoryResolver;
  componentRef: any;
  longth: number = 0;
  oldData = [];

  components = [];
  selectedTab: number = 0;
  
  constructor(private fb: FormBuilder, private cdRef:ChangeDetectorRef) {}
  ngAfterViewInit() {
    let num = (this.group.get([this.field.name]) as FormArray).length;
    for(let i = 0; i < num; i++) {
      if(!this.field.options || !(this.field.options).includes('alone')) {
          const factory = this.resolver.resolveComponentFactory(
            componentMapper['buttons']
          );
          this.componentRef = this._vcr.createComponent(factory);
          // this.components.push(this.componentRef);
          this.componentRef.instance.index = this.longth;
          if(this.field.hasOwnProperty('validations')) {
            this.componentRef.instance.message = this.field.validations[0].message;
          }
          this.componentRef.instance.group = (this.group.get([this.field.name])  as FormArray).controls[this.longth] as FormGroup; 
          this.componentRef.instance.removing.subscribe($event => {
            this.removeIndex($event);
          });
          this.componentRef.instance.change.subscribe($event => {
            this.enableIndex($event);
          });
          this.componentRef.instance.putBack.subscribe($event => {
            this.putBackIndex($event);
          });
          this.oldData.push(null);
      }
      this.field.collections.forEach(element => {
        if(this.edit && element.disable && (this.group.get([this.field.name])  as FormArray).controls[this.longth].get(element.name).value && !['bigexpand', 'bignotexpand', 'bigoutside', 'calculatefew', 'divider', 'popup'].includes( element.type )) {
          const factory = this.resolver.resolveComponentFactory(
            componentMapper['inputReadonly']
          );
          this.componentRef = this._vcr.createComponent(factory);
          // this.components.push(this.componentRef);
          this.componentRef.instance.field = element;
          this.componentRef.instance.group = (this.group.get([this.field.name])  as FormArray).controls[this.longth] as FormGroup;
        } else {
          var factory;
          if(element.type === 'bigexpand') {
            factory = this.resolver.resolveComponentFactory(
              BigexpandComponent
            );
          } else{
            factory = this.resolver.resolveComponentFactory(
              componentMapper[element.type]
            );
          }
          this.componentRef = this._vcr.createComponent(factory);
          // this.components.push(this.componentRef);
          if(['bigexpand', 'bignotexpand', 'calculatefew' ].includes( element.type)) {
            this.componentRef.instance.resolver = this.resolver;
            this.componentRef.instance.edit = this.edit;
          }
          this.componentRef.instance.field = element;
          this.componentRef.instance.group = (this.group.get([this.field.name])  as FormArray).controls[this.longth] as FormGroup;
        }
        
      });
      this.longth = this.longth + 1;
    }
    if(num > 1 && (!this.field.options || !(this.field.options).includes('alone'))) {
      (this.group.get([this.field.name]) as FormArray).disable();
    }
    if(this.field.options === 'tabs') {
      var size: number = this._vcr.length;
      for(let i = 0; i<size ; i++) {
        this.components[i] = this._vcr.get(i);
      }
      for(let i = size-1; i>size/this.longth-1; i--) {
        this._vcr.detach(i);
      }
    }
    this.cdRef.detectChanges();
  }

  addItemInline(): void {
    const items = this.group.get([this.field.name]) as FormArray;
    var group2 = this.fb.group({});
    items.push(group2);
    this.createItem(group2); 
  }

  get formArray() { return <FormArray>this.group.get(this.field.name); }
  onTabChange(num): void {
    if(num === this.selectedTab) {
      return;
    }
    var size: number = this._vcr.length;
    // for(let i = this._vcr.length-1; i>-1 ; i--) {
    //   this.components[this.selectedTab*size+i] = this._vcr.detach(i);
    // }
    for(let i = size-1; i>-1; i--) {
      this._vcr.detach(i);
    }
    for(let i = num*size; i<(num+1)*size; i++) {
      this._vcr.insert(this.components[i]);
    }
    this.selectedTab = num;
    // this.cdRef.detectChanges();
  }

  onAddTab(): void {
    var size: number = this._vcr.length;
    var compLength: number = this.components.length;
    for(let i = size-1; i>-1; i--) {
      this._vcr.detach(i);
    }
    this.addItem();
    for(let i = compLength; i<compLength+size ; i++) {
      this.components[i] = this._vcr.get(i-compLength);
    }
    this.selectedTab = this.longth-1;
  }
  addItem(): void {
    if(this.group.get([this.field.name]).valid && (!this.field.options || !(this.field.options).includes('alone'))) {
      (this.group.get([this.field.name]) as FormArray).disable();
    } else {
      this.group.get([this.field.name]).markAllAsTouched();
    }
    const items = this.group.get([this.field.name]) as FormArray;
    var group2 = this.fb.group({});
    if(this.field.hasOwnProperty('validations')) {
      group2 = this.fb.group({}, {validators: [allOrNoneRequired(this.field.validations)]});
    }
    items.push(group2);
    this.createItem(group2);
  }

  /** <button *ngIf="longth!=1" type="button" mat-mini-fab (click)="removeItem()">
<mat-icon >delete</mat-icon>
</button>
  removeItem(): void {
    let temp = this.longth-1;
    let temp2 = this.amountGroup;
    (this.group.get([this.field.name]) as FormArray).removeAt(temp);
    for(let i = temp*temp2; i<(1+temp)*temp2; i++) {
      this._vcr.remove(this._vcr.indexOf(this.components[i]));
    }
    this.longth = this.longth-1;
  }*/

  removeIndex(index: number): void {
    this.oldData[index] = (this.group.get([this.field.name]) as FormArray).at(index).value;
    (this.group.get([this.field.name]) as FormArray).at(index).reset();
    (this.group.get([this.field.name]) as FormArray).at(index).disable();
    /**let temp2 = this.amountGroup;
    (this.group.get([this.field.name]) as FormArray).removeAt(index);
    for(let i = index*temp2; i<(1+index)*temp2; i++) {
      this._vcr.remove(this._vcr.indexOf(this.components[i]));
    }
    //this.longth = this.longth-1;*/
  }

  removeIndexTotelly(index: number): void {
    (this.group.get([this.field.name]) as FormArray).removeAt(index);
    var size: number = this._vcr.length;
    this.components.splice(index*size,size);
    this.longth--;
    if(index === this.selectedTab) {
      this._vcr.clear();
      for(let i = 0; i<size; i++) {
        this._vcr.insert(this.components[i]);
      }
      this.selectedTab = 0;
    }
  }

  putBackIndex(index: number) {
    (this.group.get([this.field.name]) as FormArray).at(index).patchValue(this.oldData[index]);
    (this.group.get([this.field.name]) as FormArray).at(index).enable();
  }
  enableIndex(index: number) {
    (this.group.get([this.field.name]) as FormArray).at(index).enable();
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
  /**bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        if (valid.name === 'required') {
          validList.push(conditionalValidator(valid.validator));
        } else {
          validList.push(valid.validator);
        }
      });
      return Validators.compose(validList);
    }
    return null;
  }*/

  createItem(group2: FormGroup) {
    if(!this.field.options || !(this.field.options).includes('alone')) {
          const factory = this.resolver.resolveComponentFactory(
            componentMapper['buttons']
          );
          this.componentRef = this._vcr.createComponent(factory);
          // this.components.push(this.componentRef);
          this.componentRef.instance.index = this.longth;
          if(this.field.hasOwnProperty('validations')) {
            this.componentRef.instance.message = this.field.validations[0].message;
          }
          this.componentRef.instance.removing.subscribe($event => {
            this.removeIndex($event);
          });
          this.componentRef.instance.change.subscribe($event => {
            this.enableIndex($event);
          });
          this.componentRef.instance.putBack.subscribe($event => {
            this.putBackIndex($event);
          });
          this.oldData.push(null);
          this.componentRef.instance.group = (this.group.get([this.field.name])  as FormArray).controls[this.longth] as FormGroup;
    }
    this.field.collections.forEach(kid => {
      let temp: FieldConfig = Object.assign({}, kid);
      let factory;
      if(kid.type === 'bigexpand') {
          factory = this.resolver.resolveComponentFactory(
            BigexpandComponent
          );
      } else {
        factory = this.resolver.resolveComponentFactory(
          componentMapper[temp.type]
        );
      }
      
      this.componentRef = this._vcr.createComponent(factory);
      // this.components.push(this.componentRef);
      this.componentRef.instance.field = temp;
      this.componentRef.instance.group = (this.group.get([this.field.name])  as FormArray).controls[this.longth] as FormGroup; 
      switch (temp.type) {
        case 'divider': {
          break;
        }
        case 'inputselect': {
          if(temp.name) {
            group2.addControl(temp.name, this.createItemOnly(temp));
          } else {
            temp.collections.forEach(opt => {
              const control = this.fb.control(
                opt.value,
                this.bindValidations(temp.validations || [])
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
          this.componentRef.instance.resolver = this.resolver;
          if(temp.name) {
            group2.addControl(temp.name, this.createItemOnly(temp));
          } else {
            this.createCalculateFew(group2, temp);
          }
          break;
        }
        case 'array': {
          group2.addControl(temp.name, this.fb.array([this.fb.group({value: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )})]));
          break;
        }
        case 'bigexpand': {
          this.componentRef.instance.resolver = this.resolver;
          group2.addControl(temp.name, this.fb.array([this.createItemOnly(temp)]));          
          break;
        }
        case 'bignotexpand': {
          this.componentRef.instance.resolver = this.resolver;
          group2.addControl(temp.name, this.createItemOnly(temp));          
          break;
        }
        /**case 'select': {
          const control = this.fb.control(
            null,
            this.bindValidations(temp.validations || [])
          );
          group2.addControl(temp.name, control);
          break;
        }*/
        default: {
          const control = this.fb.control(
            temp.value,
            this.bindValidations(temp.validations || [])
          );
          group2.addControl(temp.name, control);
        }
      }
      
    });
    this.longth = this.longth + 1;
  }

  createItemOnly(field: FieldConfig): FormGroup {
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
            group2.addControl(temp.name, this.createItemOnly(temp));
          } else {
            temp.collections.forEach(opt => {
              const control = this.fb.control(
                opt.value,
                this.bindValidations(temp.validations || [])
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
            group2.addControl(temp.name, this.createItemOnly(temp));
          } else {
            this.createCalculateFew(group2, temp);
          }
          break;
        }
        case 'array': {
          group2.addControl(temp.name, this.fb.array([this.fb.group({value: this.fb.control(temp.value, this.bindValidations(temp.validations || []) )})]));
          break;
        }
        case 'bigexpand': {
          group2.addControl(temp.name, this.fb.array([this.createItemOnly(temp)]));          
          break;
        }
        case 'bignotexpand': {
          group2.addControl(temp.name, this.createItemOnly(temp));          
          break;
        }
        /**case 'select': {
          const control = this.fb.control(
            null,
            this.bindValidations(temp.validations || [])
          );
          group2.addControl(temp.name, control);
          break;
        }*/
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


  createCalculateFew(group: FormGroup, field) {
    field.collections.forEach(kid => {
      if(kid.type === 'inputselect') {
        if(kid.name) {
          group.addControl(kid.name, this.createItemOnly(kid));
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

  checkAllTouchedArray(): boolean{
    return (this.group.get(this.field.name) as FormArray).controls.every(fm => {
      {return this.checkAllTouched(fm as FormGroup)};
    });
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
    this._vcr.clear();
  }


}

