// import { Location } from '@angular/common';
// import { Component, OnInit, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { take } from 'rxjs/operators';
// import { FieldConfig } from '../field.interface';
// import { Genral } from '../genral.service';
// import { InventoryService } from './inventory.service';
// import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
// import { ActivatedRoute, Router } from '@angular/router';
// import {mapKeys} from 'lodash-es';
// @Component({
//     selector: 'material-export',
//     template: `
//     <fieldset *ngIf="!isFormAvailable" [ngStyle]="{'width':'90%'}">
//         <legend><h1>Material to export</h1></legend>
//         <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
//         </ng-container>
//         <div *ngIf="isDataAvailable">
//             <normal-details [dataSource]="putData" [oneColumns]="tableOneCloumns" (details)="choosedSpecifc($event)">
//             </normal-details>
//         </div>
//     </fieldset>
//     <div *ngIf="isFormAvailable">
//         <dynamic-form [fields]="regConfig" [putData]="dataSource" [mainLabel]="'Material to export'" (submit)="submit($event)">
//         </dynamic-form>
//     </div>
//     `
//   })
// export class MaterialExportComponent implements OnInit {
//     form: FormGroup;
    
//     choosedPo;
//     choosedItem;
//     lastChoosed: string;
//     poConfig: FieldConfig[];
//     regConfig: FieldConfig[];
//     tableOneCloumns;
//     putData;
//     dataSource;

//     isNew: boolean = true;
//     isDataAvailable: boolean = false;
//     isFormAvailable: boolean = false;

//     submit(value: any) {
//         var arr = [];
//         if(value['usedItemsNormal']) {
//             value['usedItemsNormal'].forEach(element => {
//                 if(this.isNew) {
//                     var arrNormal = [];
//                     element['usedItems'].forEach(elem => {
//                         if(elem['numberExport']) {
//                             arrNormal.push({storage: elem, numberUnits: elem['numberExport']});
//                         }
//                     });
//                     element['usedItems'] = arrNormal;
//                 } else {
//                     element['usedItems'].forEach(elem => {
//                         if(elem['numberExport']) {
//                             elem['numberUnits'] = elem['numberExport'];
//                         }
//                     });
//                 } 
//                 element['groupName'] = 'normal';
//             });
//             arr = arr.concat(value['usedItemsNormal']);
//             delete value['usedItemsNormal'];
//         }
//         if(value['usedItemsTable']) {
//             value['usedItemsTable'].forEach(element => {
//                 element['usedItem']['amounts'] = element['usedItem']['amounts'].filter(amou => amou.take);
//                 if(this.isNew) {
//                     element['usedItem']['amounts'].forEach(ele => {
//                         ele['storageId'] = ele['id'];
//                         delete ele['id'];
//                         ele['storageVersion'] = ele['version'];
//                         delete ele['version'];
//                     });
//                 }
//                 element['groupName'] = 'table';
//             });
//             arr = arr.concat(value['usedItemsTable']);
//             delete value['usedItemsTable'];
//         }
//         value['usedItemGroups'] = arr;

//         value['processItems'] = [];
//         if(value['processItemsNormal']) {
//             value['processItems'] = value['processItems'].concat(value['processItemsNormal']);
//             delete value['processItemsNormal'];
//         }
//         if(value['processItemsTable']) {
//             value['processItems'] = value['processItems'].concat(value['processItemsTable']);
//             delete value['processItemsTable'];
//         }
//         console.log(value);
        
//         this.localService.addEditTransfer(value, this.isNew).pipe(take(1)).subscribe( val => {
//             const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
//                 width: '80%',
//                 data: {inventoryItem: val, fromNew: true, type: 'Inventory item'}
//             });
//             dialogRef.afterClosed().subscribe(result => {
//                 if (result === 'Edit') {
//                     this.isFormAvailable = false;
//                     this.cdRef.detectChanges();
//                     this.localService.getStorageTransfer(val['id']).pipe(take(1)).subscribe( val1 => {
//                         this.fillEdit(val1);
//                     });
//                 } else {
//                     this.router.navigate(['../InventoryReports'], { relativeTo: this._Activatedroute });
//                 }
//             });
//         });
      
//     }
      

//     constructor(private fb: FormBuilder, private _Activatedroute:ActivatedRoute, private router: Router, private cdRef:ChangeDetectorRef,
//         private localService: InventoryService, private genral: Genral, private location: Location, public dialog: MatDialog) {
//     }

//     goNextPo($event) {
//         this.localService.getStorageByPo($event['code']).pipe(take(1)).subscribe( val => {
//             this.putData = val;
//             console.log(val);
            
//             if(val.every( v => v['item']['id'] === val[0]['item']['id'] )) {
//                 this.readyForm();
//             } else {
//                 this.isDataAvailable = true;
//             }
//         });
//     }

//     goNextItem($event) {
//         this.localService.getStorageByItem($event['id']).pipe(take(1)).subscribe( val => {
//             this.putData = val;
//             if(val.every( v => v['poCode']['code'] === val[0]['poCode']['code'] )) {
//                 this.readyForm();
//             } else {
//                 this.isDataAvailable = true;
//             }
//         });
//     }

//     readyForm() {
//         var arrNormal = [];
//         var arrTable = [];

//         console.log(this.putData);
        
//         this.dataSource = {poCode: this.putData[0]['poCode']};
//         this.putData.forEach(element => {
//             if(element['storage']) {
//                 element['storage']['item'] = element['item'];
//                 arrTable.push({usedItem: element['storage']});
//             } else if(element['storageForms']) {
//                 element['storageForms'].forEach(ele => {
//                     ele['item'] = element['item'];
//                 });
//                 arrNormal.push({usedItems: element['storageForms']});
//             }
//         });

//         if(arrTable.length) {
//             this.dataSource['usedItemsTable'] = arrTable;
//         } else {
//             this.regConfig.splice(6, 1);
//         }
//         if(arrNormal.length) {
//             this.dataSource['usedItemsNormal'] = arrNormal;
//         } else {
//             this.regConfig.splice(5, 1);
//         }
//         this.dataSource['processItemsTable'] = [{item: this.putData[0]['item']}];
//         this.dataSource['processItemsNormal'] = [{item: this.putData[0]['item']}];
//         // this.isDataAvailable = true;
//         this.isFormAvailable = true;
//     }

//     choosedSpecifc($event) {
//         if(this.lastChoosed === 'po') {
//             this.putData = this.putData.filter(ele => ele['item']['id'] === $event['item']['id']);
//             this.readyForm();
//         } else {
//             this.putData = this.putData.filter(ele => ele['poCode']['code'] === $event['poCode']['code']);
//             this.readyForm();
//         }
//     }


//     fillEdit(val) {
//         var arrNormal = [];
//         var arrTable = [];
//         val['usedItemGroups'].forEach(element => {
//             if(element['groupName'] === 'table') {
//                 element['usedItem']['amounts'].forEach(ele => {
//                     ele['take'] = true;
//                 });
//                 arrTable.push(element);
//             } else if(element['groupName'] === 'normal') {
//                 element['usedItems']?.forEach(ele => {
//                     ele['numberExport'] = ele['numberUnits'];
//                 });
//                 arrNormal.push(element);
//             } 
//         });
//         delete val['usedItemGroups'];

//         var processNormal = [];
//         var processTable = [];
//         val['processItems'].forEach(element => {
//             if(element['storage']) {
//                 processTable.push(element);
//             } else if(element['storageForms']) {
//                 processNormal.push(element);
//             }
//         });
//         delete val['processItems'];
//         this.dataSource = val;
//         if(arrTable.length) {
//             this.dataSource['usedItemsTable'] = arrTable;
//         } else {
//             this.regConfig.splice(6, 1);
//         }
//         if(arrNormal.length) {
//             this.dataSource['usedItemsNormal'] = arrNormal;
//         } else {
//             this.regConfig.splice(5, 1);
//         }
//         if(processTable.length) {
//             this.dataSource['processItemsTable'] = processTable;
//         }
//         if(processNormal.length) {
//             this.dataSource['processItemsNormal'] = processNormal;
//         } else {
//             this.dataSource['processItemsNormal'] = [{item: this.dataSource['processItemsTable'][0]['item']}];
//         }
//         if(!processTable.length) {
//             this.dataSource['processItemsTable'] = [{item: this.dataSource['processItemsNormal'][0]['item']}];
//         }
//         this.isNew = false;
//         this.isFormAvailable = true;
//     }

//     ngOnInit() {
//         this.preperReg();
//         this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
//             if(params.get('id')) {
//                 var id = +params.get('id');
//                 this.localService.getStorageTransfer(id).pipe(take(1)).subscribe( val => {
//                     this.fillEdit(val);
//                 });
//             } else {
//                 this.form = this.fb.group({});
//                 this.form.addControl('poCode', this.fb.control(''));
//                 this.form.addControl('item', this.fb.control(''));
//                 this.form.get('poCode').valueChanges.subscribe(selectedValue => {
//                     if(selectedValue && selectedValue.hasOwnProperty('code')) {
//                         if(this.lastChoosed === 'po' && selectedValue['code'] === this.choosedPo['code']) {

//                         } else {
//                             this.choosedPo = selectedValue;
//                             if(!this.lastChoosed || this.lastChoosed === 'po') {
//                                 this.lastChoosed = 'po';
//                                 this.goNextPo(selectedValue);
//                             } else {
//                                 this.putData = this.putData.filter(ele => ele['poCode']['code'] === selectedValue['code']);
//                                 this.readyForm();
//                             }
//                         }
//                     } else if(this.lastChoosed === 'po') {
//                         this.choosedPo = null;
//                         if(!this.choosedItem) {
//                             this.putData = null;
//                         }
//                     }
//                 });
//                 this.form.get('item').valueChanges.subscribe(selectedValue => {
//                     if(selectedValue && selectedValue.hasOwnProperty('id')) {
//                         if(this.lastChoosed === 'item' && selectedValue['id'] === this.choosedItem['id']) {

//                         } else {
//                             this.choosedItem = selectedValue;
//                             if(!this.lastChoosed || this.lastChoosed === 'item') {
//                                 this.lastChoosed = 'item';
//                                 this.goNextItem(selectedValue);
//                             } else {
//                                 this.putData = this.putData.filter(ele => ele['item']['id'] === selectedValue['id']);
//                                 this.readyForm();
//                             }
//                         }
//                     } else if(this.lastChoosed === 'item') {
//                         if(!this.choosedPo) {
//                             this.putData = null;
//                         }
//                         this.choosedItem = null;
//                     }
//                 });
//                 this.poConfig = [
//                         {
//                             type: 'selectgroup',
//                             inputType: 'supplierName',
//                             options: this.localService.getPoCashewCodesInventory(),
//                             collections: [
//                                 {
//                                     type: 'select',
//                                     label: 'Supplier',
//                                 },
//                                 {
//                                     type: 'select',
//                                     label: '#PO',
//                                     name: 'poCode',
//                                     collections: 'somewhere',
//                                 },
//                             ]
//                         },
//                         {
//                             type: 'select',
//                             label: 'Item descrption',
//                             name: 'item',
//                             options: this.genral.getAllItemsCashew(),
//                         },
//                 ];

//                 this.tableOneCloumns = [
//                     {
//                         type: 'nameId',
//                         name: 'item',
//                         label: 'Product',
//                     },
//                     {
//                         type: 'weight',
//                         name: 'totalBalanceAmount',
//                         label: 'Total stock',
//                     },
//                 ]
//             }
//         });
//     }

//     preperReg(){
//         this.regConfig = [
//             {
//                 type: 'selectgroup',
//                 inputType: 'supplierName',
//                 disable: true,
//                 collections: [
//                     {
//                         type: 'select',
//                         label: 'Supllier',
//                     },
//                     {
//                         type: 'select',
//                         label: '#PO',
//                         name: 'poCode',
//                         collections: 'somewhere',
//                         validations: [
//                             {
//                                 name: 'required',
//                                 validator: Validators.required,
//                                 message: '#PO Required',
//                             }
//                         ]
//                     },
//                 ]
//             },
//             {
//                 type: 'date',
//                 label: 'Date',
//                 value: new Date(),
//                 name: 'recordedTime',
//                 options: 'withTime',
//                 validations: [
//                     {
//                         name: 'required',
//                         validator: Validators.required,
//                         message: 'Date Required',
//                     }
//                 ]
//             },
//             {
//                 type: 'date',
//                 label: 'Time duration',
//                 name: 'duration',
//                 options: 'duration',
//             },
//             {
//                 type: 'input',
//                 label: 'Number of workers',
//                 name: 'numOfWorkers',
//                 inputType: 'number'
//             },
//             {
//                 type: 'select',
//                 label: 'Production line',
//                 name: 'productionLine',
//                 options: this.genral.getProductionLine(),
//             },
//             {
//                 type: 'bigexpand',
//                 name: 'usedItemsNormal',
//                 label: 'Transfer from',
//                 options: 'aloneNoAdd',
//                 collections: [
//                     {
//                         type: 'tableWithInput',
//                         // label: 'Transfer from',
//                         name: 'usedItems',
//                         options: 'numberExport',
//                         collections: [
//                             {
//                                 type: 'select',
//                                 label: 'Item',
//                                 name: 'item',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'inputselect',
//                                 name: 'unitAmount',
//                                 label: 'Unit weight',
//                                 disable: true,
//                                 collections: [
//                                     {
//                                         type: 'input',
//                                         label: 'Unit weight',
//                                         name: 'amount',
//                                     },
//                                     {
//                                         type: 'select',
//                                         label: 'Weight unit',
//                                         name: 'measureUnit',
//                                     },
//                                 ]
//                             },
//                             {
//                                 type: 'input',
//                                 label: 'Number of units',
//                                 name: 'numberUnits',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'input',
//                                 label: 'Used units',
//                                 name: 'usedUnits',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'select',
//                                 label: 'Warehouse location',
//                                 name: 'warehouseLocation',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'nothing',
//                                 name: 'storage',
//                                 // disable: true,
//                             },
//                         ]
//                     },
//                 ],
//             },
//             {
//                 type: 'bigexpand',
//                 name: 'usedItemsTable',
//                 label: 'Transfer from',
//                 options: 'aloneNoAdd',
//                 collections: [
//                     {
//                         type: 'bignotexpand',
//                         name: 'usedItem',
//                         // label: 'Transfer from',
//                         options: 'aloneNoAdd',
//                         collections: [
//                             {
//                                 type: 'inputReadonlySelect',
//                                 label: 'Item descrption',
//                                 name: 'item',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'inputReadonly',
//                                 label: 'Weight unit',
//                                 name: 'measureUnit',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'inputReadonlySelect',
//                                 label: 'Warehouse location',
//                                 name: 'warehouseLocation',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'inputReadonly',
//                                 label: 'Empty container weight',
//                                 name: 'containerWeight',
//                                 disable: true,
//                             },
//                             {
//                                 type: 'arrayordinal',
//                                 label: 'Unit weight',
//                                 name: 'amounts',
//                                 inputType: 'choose',
//                                 options: 3,
//                                 collections: 30,
//                             },
//                         ]
//                     },
//                 ]
//             },
//             {
//                 type: 'bigexpand',
//                 name: 'processItemsNormal',
//                 label: 'Transfer to',
//                 options: 'aloneNoAdd',
//                 collections: [
//                     {
//                         type: 'select',
//                         label: 'Item descrption',
//                         name: 'item',
//                         disable: true,
//                         // options: this.genral.getAllItemsCashew(),
//                     },
//                     {
//                         type: 'bigexpand',
//                         label: 'Amounts',
//                         name: 'storageForms',
//                         options: 'Inline',
//                         collections: [
//                             {
//                                 type: 'inputselect',
//                                 name: 'unitAmount',
//                                 collections: [
//                                     {
//                                         type: 'input',
//                                         label: 'Unit weight',
//                                         name: 'amount',
//                                         inputType: 'numeric',
//                                         options: 3,
//                                     },
//                                     {
//                                         type: 'select',
//                                         label: 'Weight unit',
//                                         name: 'measureUnit',
//                                         options: ['KG', 'LBS', 'OZ', 'GRAM'],
//                                     },
//                                 ]
//                             },
//                             {
//                                 type: 'input',
//                                 label: 'Number of units',
//                                 name: 'numberUnits',
//                                 inputType: 'numeric',
//                                 options: 3,
//                             },
//                             {
//                                 type: 'select',
//                                 label: 'Warehouse location',
//                                 name: 'warehouseLocation',
//                                 options: this.genral.getStorage(),
//                             },
//                             {
//                                 type: 'input',
//                                 label: 'Empty container weight',
//                                 name: 'containerWeight',
//                                 inputType: 'numeric',
//                                 options: 3,
//                             },
//                             {
//                                 type: 'divider',
//                                 inputType: 'divide'
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 type: 'bigexpand',
//                 name: 'processItemsTable',
//                 label: 'Transfer to',
//                 options: 'NoAdd',
//                 collections: [
//                     {
//                         type: 'select',
//                         label: 'Item descrption',
//                         name: 'item',
//                         disable: true,
//                         // options: this.genral.getAllItemsCashew(),
//                     },
//                     {
//                         type: 'bignotexpand',
//                         name: 'storage',
//                         options: 'Inline',
//                         collections: [
//                             {
//                                 type: 'selectNormal',
//                                 label: 'Weight unit',
//                                 name: 'measureUnit',
//                                 options: ['KG', 'LBS', 'OZ', 'GRAM'],
//                             },
//                             {
//                                 type: 'select',
//                                 label: 'Warehouse location',
//                                 name: 'warehouseLocation',
//                                 options: this.genral.getStorage(),
//                             },
//                             {
//                                 type: 'input',
//                                 label: 'Empty container weight',
//                                 name: 'containerWeight',
//                                 inputType: 'numeric',
//                                 options: 3,
//                             },
//                             {
//                                 type: 'arrayordinal',
//                                 label: 'Unit weight',
//                                 name: 'amounts',
//                                 options: 3,
//                                 collections: 30,
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 type: 'button',
//                 label: 'Submit',
//                 name: 'submit',
//             }
//         ];
        
        
//      }

// }