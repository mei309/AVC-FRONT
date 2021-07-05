import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { InventoryService } from '../inventory/inventory.service';
import { take } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'material-export-item',
    template: `
    <div *ngIf="isFirstDataAvailable">
        <dynamic-form [fields]="poConfig" [mainLabel]="'Item export'" (submitForm)="goNext($event)">
        </dynamic-form>
    </div>
    <div *ngIf="isDataAvailable">
        <just-show [oneColumns]="regConfig" [dataSource]="putData" [mainLabel]="'Material to export'" (submitForm)="submit($event)">
        </just-show>
    </div>
    `
  })
export class MaterialExportItemComponent implements OnInit {
    poConfig: FieldConfig[];
    regConfig: FieldConfig[];

    recordedTime;

    putData;

    isDataAvailable: boolean = false;
    isFirstDataAvailable: boolean = false;

    submit(value: any) {
        Object.values(value).forEach(ele => {
            var arr = [];
            ele['storageForms'].forEach(element => {
                if(element['numberExport']) {
                    arr.push({storage: element, numberUnits: element['numberExport']});
                }
            });
            ele['usedItems'] = arr;
            ele['recordedTime'] = this.recordedTime;
            delete ele['storageForms'];
            delete ele['id'];
        });
        
        // this.localService.addStorageListTransfer(Object.values(value)).pipe(take(1)).subscribe( val => {
        //     console.log(val);
            
        // });
      
    }
    constructor(private _Activatedroute:ActivatedRoute,
        private localService: InventoryService, private genral: Genral, private location: Location, public dialog: MatDialog) {
    }

    goNext($event) {
        this.localService.getStorageByItem($event['item']['id']).pipe(take(1)).subscribe( val => {
            this.recordedTime = $event['recordedTime'];
            this.putData = {item: $event['item'], storageItems: val};
            this.isDataAvailable = true;
            this.isFirstDataAvailable = false;
        });
    }


    ngOnInit() {
        this.poConfig = [
            {
                type: 'select',
                label: 'Item descrption',
                name: 'item',
                // options: this.localService.getAllItems(),
            },
            {
                type: 'date',
                label: 'Transfering date',
                value: 'timeNow',
                name: 'recordedTime',
                options: 'withTime',
                disable: true,
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Receiving date Required',
                    }
                ]
            },
            // {
            //     type: 'select',
            //     label: 'To warehouse location',
            //     name: 'warehouseLocation',
            //     options: this.genral.getWearhouses(),
            // },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
        this.isFirstDataAvailable = true;
        
        this.regConfig = [
            // {
            //     type: 'name2',
            //     label: '#PO',
            //     name: 'poCode',
            //     collections: 'supplierName',
            // },
            // {
            //     type: 'dateTime',
            //     label: 'Date and time',
            //     name: 'recordedTime',
            // },
            {
                type: 'nameId',
                label: 'Item descrption',
                name: 'item',
                disable: true,
            },
            {
                type: 'arrayGroup',
                // label: 'Received products',
                name: 'storageItems',
                collections: [
                    {
                        name: 'id',
                        titel: 'id',
                        type: 'idGroup',
                    },
                    {
                        type: 'nameId',
                        label: '#PO',
                        name: 'poCode',
                        collections: 'supplierName',
                        group: 'poCode',
                    },
                    {
                        type: 'kidArray',
                        label: 'Amounts',
                        name: 'storageForms',
                        collections: [
                            {
                                type: 'nameId',
                                label: 'Unit amount',
                                name: 'unitAmount',
                                // collections: 'measureUnit',
                            },
                            {
                                type: 'normal',
                                label: 'Number of units',
                                name: 'numberUnits',
                            },
                            {
                                type: 'nameId',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                            },
                            {
                                type: 'check',
                                label: 'Extra',
                                name: 'className',
                                collections: 'ExtraAdded',
                            },
                        ],
                    },
                    {
                        type: 'nameId',
                        label: 'Sum',
                        name: 'totalAmount',
                        group: 'poCode',
                    },
                    {
                        type: 'popup',
                        label: 'Transfer amounts',
                        name: 'bouns',
                        group: 'poCode',
                        options: true,
                        collections: [
                            {
                                type: 'selectgroup',
                                inputType: 'supplierName',
                                disable: true,
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
                            {
                                type: 'select',
                                label: 'Item descrption',
                                name: 'item',
                                disable: true,
                            },
                            {
                                type: 'tableWithInput',
                                name: 'storageForms',
                                label: 'Amounts to transfer',
                                options: 'aloneNoAddNoFrameInline',
                                collections: [
                                    {
                                        type: 'inputselect',
                                        name: 'unitAmount',
                                        disable: true,
                                        collections: [
                                            {
                                                type: 'input',
                                                label: 'Unit weight',
                                                name: 'amount',
                                                inputType: 'numeric',
                                                options: 3,
                                            },
                                            {
                                                type: 'select',
                                                label: 'Weight unit',
                                                name: 'measureUnit',
                                                options: ['KG', 'LBS', 'OZ', 'GRAM'],
                                            },
                                        ]
                                    },
                                    {
                                        type: 'input',
                                        label: 'Number of units',
                                        name: 'numberUnits',
                                        disable: true,
                                    },
                                    {
                                        type: 'select',
                                        label: 'Warehouse location',
                                        name: 'warehouseLocation',
                                        disable: 'true',
                                        // options: this.genral.getWearhouses(),
                                    },
                                    // {
                                    //     type: 'input',
                                    //     label: 'Number of units',
                                    //     name: 'numberExport',
                                    // },
                                    {
                                        type: 'divider',
                                        inputType: 'divide'
                                    },
                                ],
                            },
                            {
                                type: 'bigexpand',
                                name: 'processItems',
                                label: 'Transfer to',
                                options: 'alone',
                                collections: [
                                    {
                                        type: 'select',
                                        label: 'Item descrption',
                                        name: 'item',
                                        // options: this.genral.getItemsCashew(),
                                    },
                                    {
                                        type: 'bigexpand',
                                        label: 'Amounts',
                                        name: 'storageForms',
                                        options: 'Inline',
                                        collections: [
                                            {
                                                type: 'inputselect',
                                                name: 'unitAmount',
                                                collections: [
                                                    {
                                                        type: 'input',
                                                        label: 'Unit weight',
                                                        name: 'amount',
                                                        inputType: 'numeric',
                                                        options: 3,
                                                    },
                                                    {
                                                        type: 'select',
                                                        label: 'Weight unit',
                                                        name: 'measureUnit',
                                                        options: ['KG', 'LBS', 'OZ', 'GRAM'],
                                                    },
                                                ]
                                            },
                                            {
                                                type: 'input',
                                                label: 'Number of units',
                                                name: 'numberUnits',
                                                inputType: 'numeric',
                                                options: 3,
                                            },
                                            {
                                                type: 'select',
                                                label: 'Warehouse location',
                                                name: 'warehouseLocation',
                                                options: this.genral.getWearhouses(),
                                            },
                                            {
                                                type: 'divider',
                                                inputType: 'divide'
                                            },
                                        ],
                                        validations: [
                                            {
                                                name: 'unitAmount',
                                                validator: [
                                                    {
                                                        name: 'amount',
                                                    },
                                                    {
                                                        name: 'measureUnit',
                                                    },
                                                ],
                                                message: 'a received storage must have weight, measure unit and number of units',
                                            },
                                            {
                                                name: 'numberUnits',
                                            },
                                        ]
                                    },
                                ],
                                validations: [
                                    {
                                        name: 'item',
                                        message: 'a received item must have an item, and at least one storage',
                                    },
                                    {
                                        name: 'storageForms',
                                        validator: [
                                            {
                                                name: 'unitAmount',
                                                validator: [
                                                    {
                                                        name: 'amount',
                                                    },
                                                    {
                                                        name: 'measureUnit',
                                                    },
                                                ],
                                            },
                                            {
                                                name: 'numberUnits',
                                            }, 
                                        ],
                                    }
                                ]
                            },
                            {
                                type: 'button',
                                label: 'Save',
                                name: 'submit',
                            }
                        ]
                    },
                ]
            }
        ];
     }


  }


