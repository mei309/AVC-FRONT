import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ViewChild,
  ViewContainerRef} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FieldConfig } from '../../field.interface';
import { InputComponent } from '../inputs/input.component';
import { InputToPercentageComponent } from '../inputs/input-to-percentage.component';
import { InputSelectComponent } from '../inputs/input-select.component';
import { PercentInputComponent } from '../inputs/percent-input.component';

const componentMapper = {
  input: InputComponent,
  inputselect: InputSelectComponent,
  inputtopercentage: InputToPercentageComponent,
  percentinput: PercentInputComponent,
};
@Component({
  selector: 'app-alculate-few',
  template: `
<div *ngIf="field.options; else notBox">
  <div class="div-fit">
    <fieldset>
    <legend><h2>{{field.label}}<span *ngIf="prefix">&nbsp;({{prefix}})</span></h2></legend>
    <ng-container #container3></ng-container>
    </fieldset>
    <span class="put-down">Totel {{field.label}}: {{sum | number : '1.0-3'}}&nbsp;{{prefix}}&nbsp; <span class="pad-right" *ngIf="percent">   {{sum/percent | percent:'1.2'}}</span></span>
  </div>
</div>

<ng-template  #notBox>
  <ng-container #container3></ng-container>
  <span id="putsuprdown">Totel {{field.label}}: {{sum | number: '1.0-3'}}</span>
</ng-template>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculateFewComponent implements AfterViewInit {
  @ViewChild('container3', { read: ViewContainerRef, static: false }) _vcr3;
  destroySubject$: Subject<void> = new Subject();

  edit: boolean;
  field: FieldConfig;
  group: FormGroup;
  resolver: ComponentFactoryResolver;
  componentRef: any;
  count: number[] = [];
  sum: number = 0;
  percent: number = 0;
  prefix: string;

  operators = {
    '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
    //'-' : function(a) { return a.reduce((b, c) => { return b + c}, 0); },
    '*' : function(a: number[]) { return a.reduce((b, c) => { return b * c}); },
    //'/' : function(a) { return a.reduce((b, c) => { return b + c}, 0); },
    'avg' : function(a: number[]) { return (a.reduce((b, c) => { return b + c}))/a.length; },
  };
  
  constructor(private cdRef:ChangeDetectorRef) {}
  ngAfterViewInit() {
      let ind: number = 0;
      if(this.field.name) {
        if(this.field.value) {   
          this.group.get([this.field.value]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            this.percent = +val;   
          });
        }
        if(this.field.options && this.field.options !== 'box') {
          this.group.get([this.field.options]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            this.prefix = val;   
          });
        }
        this.group = this.group.get(this.field.name) as FormGroup;
      } else {
        if(this.field.options && this.field.options !== 'box') {
          this.group.get([this.field.options]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            this.prefix = val;   
          });
        }
        if(this.field.value) {   
          this.group.get([this.field.value]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
            this.percent = +val;   
          });
        }
      }
      this.field.collections.forEach(element => {
          this.count.push(0);
          if(this.edit && element.disable) {
            const factory = this.resolver.resolveComponentFactory(
              componentMapper['inputReadonly']
            );
            this.componentRef = this._vcr3.createComponent(factory);
            this.componentRef.instance.field = element;
            this.componentRef.instance.group = this.group;
          } else {
            const factory = this.resolver.resolveComponentFactory(
              componentMapper[element.type]
            );
            this.componentRef = this._vcr3.createComponent(factory);
            this.componentRef.instance.field = element;
            this.componentRef.instance.group = this.group;
          }
          if(element.type === 'inputselect'){
              const here = ind;
              if(element.name) {
                if(this.group.get([element.name]).get([element.collections[0].name]).value){
                  this.setCount(here, +this.group.get([element.name]).get([element.collections[0].name]).value);
                  this.sum = this.operators[this.field.inputType](this.getCount());
                }
                this.group.get([element.name]).get([element.collections[0].name]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
                  this.setCount(here, +val);
                  this.sum = this.operators[this.field.inputType](this.getCount());
                });
              } else {
                if(this.group.get([element.collections[0].name]).value){
                  this.setCount(here, +this.group.get([element.collections[0].name]).value);
                  this.sum = this.operators[this.field.inputType](this.getCount());
                }
                this.group.get([element.collections[0].name]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
                  this.setCount(here, +val);
                  this.sum = this.operators[this.field.inputType](this.getCount());
                });
              }
          } else {
              const here = ind;
              if(this.group.get([element.name]).value){
                this.setCount(here, +this.group.get([element.name]).value);
                this.sum = this.operators[this.field.inputType](this.getCount());
              }
              this.group.get([element.name]).valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
                this.setCount(here, +val);
                this.sum = this.operators[this.field.inputType](this.getCount());
              });
          }
          ind++;
      });
      this.cdRef.detectChanges();
  }

  getCount() {
    return this.count;
  }

  setCount(ind: number, data) {
    this.count[ind] = data;
  }
  

  ngOnDestroy() {
        this.destroySubject$.next();
        this._vcr3.clear();
      }

}


