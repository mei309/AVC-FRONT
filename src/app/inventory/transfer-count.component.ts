import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';
import {cloneDeep} from 'lodash-es';
import {isEqual} from 'lodash-es';
@Component({
    selector: 'transfer-count',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1>Transfer With Sample</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <dynamic-form [fields]="regConfigHopper" [putData]="dataSource" [mainLabel]="'Transfer With Sample'" (submit)="submit($event)">
        </dynamic-form>
    </div>
    `
  })
export class TransferCountComponent implements OnInit {
    form: FormGroup;
    isDataAvailable: boolean = false
    isFormAvailable: boolean = false;
    poConfig;
    regConfigHopper: FieldConfig[];
    dataSource;
    poID: number;
    submit(value: any) {
        var arr = [];
        if(value['usedItemsTable']) {
            var proccesItems = [];
            value['usedItemsTable'].forEach(element => {
                element['usedItem']['amounts'] = element['usedItem']['amounts'].filter(amou => amou.take);
                element['usedItem']['amounts'].forEach(ele => {
                    ele['storageId'] = ele['id'];
                    delete ele['id'];
                    ele['storageVersion'] = ele['version'];
                    delete ele['version'];
                });
                element['groupName'] = 'table';

                var copied = cloneDeep(element['usedItem']);
                copied['amounts'].forEach(et => {
                    delete et['storageId'];
                    delete et['storageVersion'];
                });
                copied['warehouseLocation'] = (value['itemCounts'].find(ele => isEqual(ele['item'], copied['item'])))['warehouseLocation'];
                var cpoyProcess = {item: copied['item'], groupName: element['groupName'], storage: copied};
                delete copied['item'];
                proccesItems.push(cpoyProcess);
            });
            value['processItems'] = proccesItems;
            arr = arr.concat(value['usedItemsTable']);
            delete value['usedItemsTable'];
        }
        value['usedItemGroups'] = arr;
        
        // if(value['itemCounts']) {
        //     var proccesItems = [];
        //     value['itemCounts'].forEach(element => {
        //         var copied = this.keepData.find(ele => (ele['storage'] && isEqual(ele['item'], element['item'])));
        //         if(copied) {
        //             copied['storage']['amounts'].forEach(et => {
        //                 delete et['id'];
        //                 delete et['version'];
        //             });
        //             copied['storage']['warehouseLocation'] = element['warehouseLocation'];
        //             delete copied['storage']['item'];
        //             var cpoyProcess = {item: element['item'], groupName: element['groupName'], storage: copied['storage']}
        //             proccesItems.push(cpoyProcess);
        //         }
        //     });
        //     value['processItems'] = proccesItems;
        // }
        
        console.log(value);
        
        
        this.localService.addEditTransfer(value, true).pipe(take(1)).subscribe( val => {
            console.log(val);
            
            const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
                width: '80%',
                data: {inventoryItem: val, fromNew: true, type: 'Inventory item'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if(result === 'Edit') {
                    this.router.navigate(['../MaterialExport',{id: val['id']}], { relativeTo: this._Activatedroute });
                } else {
                    this.router.navigate(['../InventoryReports'], { relativeTo: this._Activatedroute });
                }
            });
        });
    }

      constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef,
         private localService: InventoryService, private genral: Genral, private location: Location, public dialog: MatDialog,
         private _Activatedroute:ActivatedRoute, private router: Router,) {
        }


    ngOnInit() {
        this.form = this.fb.group({});
        this.form.addControl('poCode', this.fb.control(''));
        this.form.get('poCode').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id') && this.poID != selectedValue['id']) { 
                this.localService.getStorageByPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
                    var arrTable = [];
                    this.dataSource = {poCode: selectedValue};
                    this.dataSource['itemCounts'] = [];
                    val.forEach(element => {
                        if(element['storage']) {
                            element['storage']['item'] = element['item'];
                            arrTable.push({usedItem: element['storage']});
                            this.dataSource['itemCounts'].push({item: element['item']});
                        }
                    });
                    if(arrTable.length) {
                        this.dataSource['usedItemsTable'] = arrTable;
                        this.isFormAvailable = true;
                    } else {
                        window.alert('dose not have bags for sample');
                        this.isDataAvailable = true;
                    }
                }); 
                this.isDataAvailable = false;
                this.poID = selectedValue['id'];
            }
        });
        this.isDataAvailable = true;
        this.poConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.getPoCashewCodesInventory(),
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

        this.regConfigHopper = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                disable: true,
                collections: [
                    {
                        type: 'select',
                        label: 'Supllier',
                    },
                    {
                        type: 'select',
                        label: '#PO',
                        name: 'poCode',
                        collections: 'somewhere',
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: '#PO Required',
                            }
                        ]
                    },
                ]
            },
            {
                type: 'date',
                label: 'Date',
                value: new Date(),
                name: 'recordedTime',
                options: 'withTime',
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Date Required',
                    }
                ]
            },
            {
                type: 'select',
                label: 'Production line',
                name: 'productionLine',
                options: this.genral.getProductionLine(),
            },
            {
                type: 'bigexpand',
                name: 'usedItemsTable',
                label: 'Transfer from',
                options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'bignotexpand',
                        name: 'usedItem',
                        // label: 'Transfer from',
                        options: 'aloneNoAdd',
                        collections: [
                            {
                                type: 'inputReadonlySelect',
                                label: 'Item descrption',
                                name: 'item',
                                disable: true,
                            },
                            {
                                type: 'inputReadonly',
                                label: 'Weight unit',
                                name: 'measureUnit',
                                disable: true,
                            },
                            {
                                type: 'inputReadonlySelect',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                disable: true,
                            },
                            {
                                type: 'inputReadonly',
                                label: 'Empty container weight',
                                name: 'containerWeight',
                                disable: true,
                            },
                            {
                                type: 'arrayordinal',
                                label: 'Unit weight',
                                name: 'amounts',
                                inputType: 'choose',
                                options: 3,
                                collections: 30,
                            },
                        ]
                    },
                ]
            },
            // {
            //     type: 'bigexpand',
            //     name: 'processItemsTable',
            //     label: 'Transfer to',
            //     options: 'aloneNoAdd',
            //     collections: [
            //         
                    {
                        type: 'bigexpand',
                        name: 'itemCounts',
                        label: 'Transfer With Sample',
                        options: 'aloneNoAdd',
                        collections: [
                            {
                                type: 'select',
                                label: 'Item descrption',
                                name: 'item',
                                disable: true,
                            },
                            {
                                type: 'selectNormal',
                                label: 'Weight unit',
                                name: 'measureUnit',
                                options: ['KG', 'LBS', 'OZ', 'GRAM'],
                            },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                options: this.genral.getStorage(),
                            },
                            {
                                type: 'input',
                                label: 'Empty container weight',
                                name: 'containerWeight',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'arrayordinal',
                                label: 'Unit weight',
                                name: 'amounts',
                                options: 3,
                                collections: 30,
                            },
                        ],
                    },
            //     ],
            // },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
    }

  }