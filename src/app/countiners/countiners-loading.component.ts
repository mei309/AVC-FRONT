import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { CountinersService } from './countiners.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import {cloneDeep} from 'lodash-es';

@Component({
    selector: 'countiners-loading',
    template: `
    <div *ngIf="!loading">
      <dynamic-form [fields]="regConfig" [mainLabel]="'Continer information'" (submit)="onLoad($event)">
      </dynamic-form>
    </div>
    <div cdkDropListGroup *ngIf="loading" >
        <h1 style="text-align:center">
          Countiners loading
        </h1>

        <div class="example-container" >
          <h2>To do</h2>
          <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
          </ng-container>
          <div cdkDropList [cdkDropListData]="todo1" class="example-list" (cdkDropListDropped)="drop($event)">
            <div  *ngFor="let unit of todo1" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(unit.item.value)" [ngStyle]="{'background-color':unit.item.value === localCheck ? 'red' : 'white' }" class="example-box" cdkDrag>
              <h2>{{unit.item.value}}</h2>
              {{unit.ordinal}}
              {{unit.unitAmount.value}}
              <mat-form-field  *ngIf="unit.numberUnits">
                <input matInput type="number" (focus)="setLocalLimit(unit.numberUnits)" (keyup)="valideta(unit, $event)" (blur)="onChange(unit, $event, todo1)" placeholder="Amount" [(ngModel)]="unit.numberUnits">
              </mat-form-field>
            </div>
            <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo1.length === 0">empty list ...</button>
          </div>
        </div>

        <div class="example-container" >
          <h2>Countiner</h2>
          <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">
            <div *ngFor="let unit2 of todo" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(unit2.item.value)" [ngStyle]="{'background-color':unit2.item.value === localCheck ? 'red' : 'white' }" class="example-box" cdkDrag>
              <h2>{{unit2.item.value}}</h2>
              {{unit2.ordinal}}
              {{unit2.unitAmount.value}}
              <mat-form-field *ngIf="unit2.numberUnits">
                <input matInput type="number" (focus)="setLocalLimit(unit2.numberUnits)" (keyup)="valideta(unit2, $event)" (blur)="onChange(unit2, $event, todo)" placeholder="Amount" [(ngModel)]="unit2.numberUnits">
              </mat-form-field>
            </div>
            <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
          </div>
          Totel loaded weight: {{calculateTotal(todo)}} (max: 35000), totel valume: (max: something)
        </div>
      </div>
    `,
    styleUrls: ['cdk1.css'],
  })

// tslint:disable-next-line: component-class-suffix
export class CountinersLoadingComponent implements OnInit {

    regConfig: FieldConfig[];
    loading: boolean = false;

    todo = [];
    todo1 = [];
    localLimit: number;
    localCheck: string;

    form: FormGroup;
    poConfig;
    poID: number;
    
    onLoad(value: any) {
      this.form = this.fb.group({});
      this.form.addControl('poCode', this.fb.control(''));
      this.form.get('poCode').valueChanges.subscribe(selectedValue => {
          if(selectedValue && selectedValue.hasOwnProperty('id') && this.poID != selectedValue['id']) { 
              this.localService.getStorageRoastPackedPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
                console.log(val);
                
                var arr = [];
                val.forEach(element => {
                    if(element['storage']) {
                        element['storage']['amounts'].forEach(elem => {
                            elem['item'] = element['item'];
                        });
                        arr = arr.concat(element['storage']);
                    } else if(element['storageForms']) {
                        element['storageForms'].forEach(ele => {
                            ele['item'] = element['item'];
                        });
                        arr = arr.concat(element['storageForms']);
                    }
                });
                console.log(arr);
                this.todo1 = arr;
              }); 
              this.poID = selectedValue['id'];
          }
      });
      this.poConfig = [
          {
              type: 'selectgroup',
              inputType: 'supplierName',
              options: this.localService.getAllPosRoastPacked(),
              collections: [
                  {
                      type: 'select',
                      label: 'Supplier',
                  },
                  {
                      type: 'select',
                      label: '#PO',
                      name: 'poCode',
                      collections: 'somewhere',
                  },
              ]
          },
      ];
      this.loading = true;
    }

    

      constructor(private _Activatedroute:ActivatedRoute, private fb: FormBuilder,
         private localService: CountinersService, private genral: Genral, private location: Location, public dialog: MatDialog) {
        }


      ngOnInit() {
          this.regConfig = [
            {
              type: 'bignotexpand',
              label: 'Shipment code',
              name: 'ShipmentCode',
              collections: [
                  {
                      type: 'input',
                      label: 'Code',
                      name: 'code',
                      validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'Code Required',
                        }
                      ]
                  },
                  {
                      type: 'select',
                      label: 'Destination port',
                      name: 'portOfDischarge',
                      options: this.genral.getShippingPorts(),
                      // disable: true,
                  },
              ],
            },
            {
              type: 'bignotexpand',
              label: 'Container details',
              name: 'containerDetails',
              collections: [
                  {
                      type: 'input',
                      label: 'Container number',
                      name: 'containerNumber',
                  },
                  {
                      type: 'input',
                      label: 'Seal number',
                      name: 'sealNumber',
                  },
                  {
                      type: 'selectNormal',
                      label: 'Container type',
                      name: 'containerType',
                      value: '20\'',
                      options: this.genral.getShippingContainerType(),
                  },
              ],
            },
            {
              type: 'bignotexpand',
              label: 'Shiping details',
              name: 'shipingDetails',
              value: 'required',
              collections: [
                  {
                      type: 'input',
                      label: 'Booking number',
                      name: 'bookingNumber',
                  },
                  {
                      type: 'input',
                      label: 'Vessel',
                      name: 'vessel',
                  },
                  {
                      type: 'input',
                      label: 'Shipping company',
                      name: 'shippingCompany',
                  },
                  {
                      type: 'select',
                      label: 'Loading port',
                      name: 'portOfLoading',
                      options: this.genral.getShippingPorts(),
                  },
                  {
                      type: 'date',
                      label: 'Etd',
                      name: 'etd',
                      // value: new Date()
                  },
                  {
                      type: 'select',
                      label: 'Destination port',
                      name: 'portOfDischarge',
                      options: this.genral.getShippingPorts(),
                  },
                  {
                    type: 'date',
                    label: 'Eta',
                    name: 'eta',
                    // value: new Date()
                  },
              ],
            },
            {
              type: 'button',
              label: 'Load',
              name: 'submit',
            }
        ];
       }

       drop(event: CdkDragDrop<any>) {
          if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
          } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
          }
      }

onChange(item, eve, list) {
    if(eve.target.value < this.localLimit) {
      var copied = cloneDeep(item);
      copied['numberUnits'] = this.localLimit-eve.target.value;
      list.push(copied);
    }
  }

  valideta(item, eve) {
    if(eve.target.value > this.localLimit) {
      item.numberUnits = this.localLimit;
    }
  }

  setLocalCheck(item: string) {
    this.localCheck = item;
  }
  
  setLocalLimit(item: number) {
    this.localLimit = item;
  }
  calculateTotal(products): number {
    return products.reduce((acc, product) => acc + (product.numberUnits? product.numberUnits: 1)*(product.unitAmount.amount), 0)
  }
        

}


