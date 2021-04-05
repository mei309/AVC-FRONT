// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { Location } from '@angular/common';
// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute } from '@angular/router';
// import { Subject } from 'rxjs';
// import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
// import { FieldConfig } from '../field.interface';
// import { Genral } from '../genral.service';
// import { CountinersService } from '../countiners/countiners.service';
// import { Validators, FormGroup, FormBuilder } from '@angular/forms';
// import { take } from 'rxjs/operators';
// import {cloneDeep} from 'lodash-es';

// @Component({
//     selector: 'countiners-loading',
//     template: `
//     <div *ngIf="!loading">
//       <dynamic-form [fields]="regConfig" [mainLabel]="'Continer information'" (submitForm)="onLoad($event)">
//       </dynamic-form>
//     </div>
//     <div cdkDropListGroup *ngIf="loading" >
//         <h1 style="text-align:center">
//           Countiners loading
//         </h1>

//         <div class="example-container" >
//           <h2>To do</h2>
//           <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
//           </ng-container>
//           <div cdkDropList [cdkDropListData]="todo1" class="example-list" (cdkDropListDropped)="drop($event)">
//             <div  *ngFor="let unit of todo1" >
//               <ng-container *ngIf="unit['usedItem']; else storageForms">
//                 <div *ngFor="let bag of unit['usedItem']['amounts']" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(unit.item.value)" [ngStyle]="{'background-color':unit.item.value === localCheck ? 'red' : 'white' }" class="example-box" cdkDrag>
//                   <h2>{{unit.item.value}}</h2>
//                   {{bag.ordinal}}
//                   {{bag.amount}} {{unit.usedItem.measureUnit}}
//                 </div>
//               </ng-container>
//               <ng-template #storageForms>
//                 <h2>{{unit.item.value}}</h2>
//                 <div *ngFor="let bag of unit['usedItems']" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(unit.item.value)" [ngStyle]="{'background-color':unit.item.value === localCheck ? 'red' : 'white' }" class="example-box" cdkDrag>
//                   <h2>{{unit.item.value}}</h2>
//                   {{bag.unitAmount.value}}
//                   <mat-form-field  *ngIf="bag.numberUnits">
//                     <input matInput type="number" (focus)="setLocalLimit(bag.numberUnits)" (keyup)="valideta(bag, $event)" (blur)="onChange(bag, $event, todo1)" placeholder="Amount" [(ngModel)]="bag.numberUnits">
//                   </mat-form-field>
//                 </div>
//               </ng-template>
//             </div>
//             <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo1.length === 0">empty list ...</button>
//           </div>
//         </div>

//         <div class="example-container" >
//           <h2>Countiner</h2>
//           <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">
//             <div *ngFor="let unit2 of todo" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(unit2.item.value)" [ngStyle]="{'background-color':unit2.item.value === localCheck ? 'red' : 'white' }" class="example-box" cdkDrag>
//               <ng-container *ngIf="unit2['usedItem']; else storageForms">
//                 <div *ngFor="let bag of unit2['usedItem']['amounts']" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(unit2.item.value)" [ngStyle]="{'background-color':unit2.item.value === localCheck ? 'red' : 'white' }" class="example-box" cdkDrag>
//                   <h2>{{unit2.item.value}}</h2>
//                   {{bag.ordinal}}
//                   {{bag.amount}} {{unit2.usedItem.measureUnit}}
//                 </div>
//               </ng-container>
//               <ng-template #storageForms>
//                 <h2>{{unit2.item.value}}</h2>
//                 <div *ngFor="let bag of unit2['usedItems']" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(unit2.item.value)" [ngStyle]="{'background-color':unit2.item.value === localCheck ? 'red' : 'white' }" class="example-box" cdkDrag>
//                   <h2>{{unit2.item.value}}</h2>
//                   {{bag.unitAmount.value}}
//                   <mat-form-field  *ngIf="bag.numberUnits">
//                     <input matInput type="number" (focus)="setLocalLimit(bag.numberUnits)" (keyup)="valideta(bag, $event)" (blur)="onChange(bag, $event, todo1)" placeholder="Amount" [(ngModel)]="bag.numberUnits">
//                   </mat-form-field>
//                 </div>
//               </ng-template>
//             </div>
//             <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
//           </div>
//           Totel loaded weight: {{calculateTotal(todo)}} (max: 35000), totel valume: (max: something)
//         </div>
//       </div>
//     `,
//     styleUrls: ['cdk1.css'],
//   })

// // tslint:disable-next-line: component-class-suffix
// export class CountinersLoadingComponent implements OnInit {

//     regConfig: FieldConfig[];
//     loading: boolean = false;

//     todo = [];
//     todo1 = [];
//     localLimit: number;
//     localCheck: string;

//     form: FormGroup;
//     poConfig;
//     poID: number;
    
//     onLoad(value: any) {
//       this.form = this.fb.group({});
//       this.form.addControl('poCode', this.fb.control(''));
//       this.form.get('poCode').valueChanges.subscribe(selectedValue => {
//           if(selectedValue && selectedValue.hasOwnProperty('id') && this.poID != selectedValue['id']) { 
//               this.localService.getStorageRoastPackedPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
//                 var arr = [];
//                 val.forEach(element => {
//                     if(element['storage']) {
//                         arr = arr.concat({item: element['item'], usedItem: element['storage']});
//                     } else if(element['storageForms']) {
//                         arr = arr.concat({item: element['item'], usedItems: element['storageForms']});
//                     }
//                 });
//                 this.todo1 = arr;
//               }); 
//               this.poID = selectedValue['id'];
//           }
//       });
//       this.poConfig = [
//           {
//               type: 'selectgroup',
//               inputType: 'supplierName',
//               options: this.localService.getAllPosRoastPacked(),
//               collections: [
//                   {
//                       type: 'select',
//                       label: 'Supplier',
//                   },
//                   {
//                       type: 'select',
//                       label: '#PO',
//                       name: 'poCode',
//                       collections: 'somewhere',
//                   },
//               ]
//           },
//       ];
//       this.loading = true;
//     }

    

//     constructor(private _Activatedroute:ActivatedRoute, private fb: FormBuilder,
//          private localService: CountinersService, private genral: Genral, private location: Location, public dialog: MatDialog) {
//     }


//     ngOnInit() {
//           this.regConfig = [
//             {
//               type: 'bignotexpand',
//               label: 'Shipment code',
//               name: 'ShipmentCode',
//               collections: [
//                   {
//                       type: 'input',
//                       label: 'Code',
//                       name: 'code',
//                       validations: [
//                         {
//                             name: 'required',
//                             validator: Validators.required,
//                             message: 'Code Required',
//                         }
//                       ]
//                   },
//                   {
//                       type: 'select',
//                       label: 'Destination port',
//                       name: 'portOfDischarge',
//                       options: this.genral.getShippingPorts(),
//                       // disable: true,
//                   },
//               ],
//             },
//             {
//               type: 'bignotexpand',
//               label: 'Container details',
//               name: 'containerDetails',
//               collections: [
//                   {
//                       type: 'input',
//                       label: 'Container number',
//                       name: 'containerNumber',
//                   },
//                   {
//                       type: 'input',
//                       label: 'Seal number',
//                       name: 'sealNumber',
//                   },
//                   {
//                       type: 'selectNormal',
//                       label: 'Container type',
//                       name: 'containerType',
//                       value: '20\'',
//                       options: this.genral.getShippingContainerType(),
//                   },
//               ],
//             },
//             {
//               type: 'bignotexpand',
//               label: 'Shiping details',
//               name: 'shipingDetails',
//               value: 'required',
//               collections: [
//                   {
//                       type: 'input',
//                       label: 'Booking number',
//                       name: 'bookingNumber',
//                   },
//                   {
//                       type: 'input',
//                       label: 'Vessel',
//                       name: 'vessel',
//                   },
//                   {
//                       type: 'input',
//                       label: 'Shipping company',
//                       name: 'shippingCompany',
//                   },
//                   {
//                       type: 'select',
//                       label: 'Loading port',
//                       name: 'portOfLoading',
//                       options: this.genral.getShippingPorts(),
//                   },
//                   {
//                       type: 'date',
//                       label: 'Etd',
//                       name: 'etd',
//                       // value: new Date()
//                   },
//                   {
//                       type: 'select',
//                       label: 'Destination port',
//                       name: 'portOfDischarge',
//                       options: this.genral.getShippingPorts(),
//                   },
//                   {
//                     type: 'date',
//                     label: 'Eta',
//                     name: 'eta',
//                     // value: new Date()
//                   },
//               ],
//             },
//             {
//               type: 'button',
//               label: 'Load',
//               name: 'submit',
//             }
//         ];
//     }

// }
