import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FieldConfig } from '../field.interface';
@Component({
    selector: 'export-usage',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="dataSource" [mainLabel]="'Cashew usage'" (submitForm)="onSubmit($event)">
        </dynamic-form>
    </div>
    `
  })
export class ExportUsageComponent implements OnInit {
    isDataAvailable: boolean = false
    @Input() beginData;
    @Input() newUsed;
    @Input() posArray;
    @Output() submitExIm: EventEmitter<any> = new EventEmitter<any>();
    regConfig: FieldConfig[];

    isOnePo: boolean = true;

    dataSource;
    onSubmit(value: any) {
        var arr = [];
        if(value['usedItemsNormal']) {
            value['usedItemsNormal'].forEach(element => {
                element['usedItems'] = element['usedItems'].filter(amou => amou.numberUsedUnits);
                element['groupName'] = this.isOnePo? 'normal' : 'normalPos';
            });
            value['usedItemsNormal'] = value['usedItemsNormal'].filter(amou => amou.usedItems.length);
            arr = arr.concat(value['usedItemsNormal']);
            delete value['usedItemsNormal'];
        }
        if(value['usedItemsTable']) {
            value['usedItemsTable'].forEach(element => {
                element['usedItem']['amounts'] = element['usedItem']['amounts'].filter(amou => amou.take);
                element['usedItem']['amounts'].forEach(ele => {
                    if(!ele['storageId']) {
                        ele['storageId'] = ele['id'];
                        delete ele['id'];
                        ele['storageVersion'] = ele['version'];
                        delete ele['version'];
                    }
                });
                element['groupName'] = this.isOnePo? 'table' : 'tablePos';
            });
            value['usedItemsTable'] = value['usedItemsTable'].filter(amou => amou.usedItem.amounts.length);
            arr = arr.concat(value['usedItemsTable']);
            delete value['usedItemsTable'];
        }
        value['usedItemGroups'] = arr;

        
        this.submitExIm.emit(value);
    }

      constructor(public dialog: MatDialog) {
        }

    ngOnInit() {
        var arrNormal = [];
        var arrTable = [];
        var removeIds = [];
        if(this.beginData) {
            if(this.beginData['weightedPos']) {
                this.isOnePo = false;
            }
            this.beginData['usedItemGroups']?.forEach(element => {
                if(element['groupName'].startsWith('table')) {
                    element['usedItem']['amounts'].forEach(ele => {
                        ele['take'] = true;
                    });
                    arrTable.push(element);
                } else if(element['groupName'].startsWith('normal')) {
                    element['usedItems'].forEach(el => {
                        el['storage']['numberAvailableUnits'] = el['numberAvailableUnits'];
                        removeIds.push(el['storage']['id']);
                    });
                    arrNormal.push(element);
                }
            });


            delete this.beginData['usedItemGroups'];
            
            this.dataSource = this.beginData;
        } else {
            if(this.posArray) {
                this.dataSource = {weightedPos: this.posArray};
                this.isOnePo = false;
            } else {
                this.dataSource = {poCode: this.newUsed[0]['poCode']};
            }
        }
        var arrUsedItems = [];
        this.newUsed?.forEach(element => {
            if(element['storage']) {
                element['storage']['item'] = element['item'];
                element['storage']['measureUnit'] = element['measureUnit'];
                element['storage']['itemProcessDate'] = element['itemProcessDate'];
                element['storage']['itemPoCodes'] = element['poCodes'];
                element['storage']['itemSuppliers'] = element['suppliers'];
                element['storage']['amounts'].forEach(ele => {
                    ele['amount'] = ele['numberAvailableUnits'];
                });
                arrTable.push({usedItem: element['storage']});
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => { 
                    if(!removeIds.includes(ele['id'])) {
                        arrUsedItems.push({itemPoCodes: element['poCodes'], itemSuppliers: element['suppliers'], item: element['item'], itemProcessDate: element['itemProcessDate'], measureUnit: element['measureUnit'], storage: ele});
                        delete ele['numberUsedUnits'];
                    }
                });
            }
        });
        if(arrUsedItems.length) {
            arrNormal.push({usedItems: arrUsedItems});
        }
        if(arrTable.length) {
            this.dataSource['usedItemsTable'] = arrTable;
        }
        if(arrNormal.length) {
            this.dataSource['usedItemsNormal'] = arrNormal;
        }
        this.preper(arrTable.length > 0, arrNormal.length > 0);
        this.isDataAvailable = true;
    }

    preper(hasItemsTable: boolean, hasItemsNormal: boolean) {
        this.regConfig = [
            ...this.isOnePo? [
                {
                    type: 'selectgroup',
                    inputType: 'supplierName',
                    disable: true,
                    collections: [
                        {
                            type: 'select',
                            label: $localize`Supllier`,
                        },
                        {
                            type: 'select',
                            label: $localize`#PO`,
                            name: 'poCode',
                            collections: 'somewhere',
                        },
                    ]
                },
            ]: [
                {
                    type: 'bigexpand',
                    name: 'weightedPos',
                    options: 'aloneNoAddNoFrameInline',
                    collections: [
                        {
                            type: 'selectgroup',
                            inputType: 'supplierName',
                            disable: true,
                            collections: [
                                {
                                    type: 'select',
                                    label: $localize`Supplier`,
                                },
                                {
                                    type: 'select',
                                    label: $localize`#PO`,
                                    name: 'poCode',
                                    collections: 'somewhere',
                                },
                            ]
                        },
                        ...this.beginData? [
                            {
                                type: 'input',
                                label: $localize`Weight`,
                                name: 'weight',
                                disable: true,
                            }
                        ]: [],
                        {
                            type: 'divider',
                            inputType: 'divide'
                        },
                    ]
                }
            ],
            {
                type: 'date',
                label: $localize`Date`,
                value: 'timeNow',
                name: 'recordedTime',
                options: 'withTime',
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Date Required`,
                    }
                ]
            },
            ...hasItemsNormal? [
                {
                    type: 'bigexpand',
                    name: 'usedItemsNormal',
                    label: 'Using amounts',
                    options: 'aloneNoAdd',
                    collections: [
                        {
                            type: 'tableWithInput',
                            // label: 'Transfer from',
                            name: 'usedItems',
                            options: 'numberUsedUnits',
                            collections: [
                                ...this.isOnePo? []: [
                                    {
                                        type: 'input',
                                        label: $localize`#PO`,
                                        name: 'itemPoCodes',
                                        disable: true,
                                    },
                                    {
                                        type: 'input',
                                        label: $localize`Supplier`,
                                        name: 'itemSuppliers',
                                        disable: true,
                                    },
                                ],
                                {
                                    type: 'select',
                                    label: $localize`Item`,
                                    name: 'item',
                                    disable: true,
                                },
                                {
                                    type: 'date',
                                    label: $localize`Process date`,
                                    name: 'itemProcessDate',
                                    disable: true,
                                },
                                {
                                    type: 'input',
                                    label: $localize`Weight unit`,
                                    name: 'measureUnit',
                                    disable: true,
                                },
                                {
                                    type: 'bignotexpand',
                                    name: 'storage',
                                    collections: [
                                        {
                                            type: 'input',
                                            label: $localize`Number of units`,
                                            name: 'numberUnits',
                                            disable: true,
                                        },
                                        {
                                            type: 'input',
                                            name: 'unitAmount',
                                            label: $localize`Unit weight`,
                                            disable: true,
                                        //     collections: [
                                        //         {
                                        //             type: 'input',
                                        //             label: 'Unit weight',
                                        //             name: 'amount',
                                        //         },
                                        //         {
                                        //             type: 'select',
                                        //             label: 'Weight unit',
                                        //             name: 'measureUnit',
                                        //         },
                                        //     ]
                                        },
                                        {
                                            type: 'select',
                                            label: $localize`Warehouse location`,
                                            name: 'warehouseLocation',
                                            disable: true,
                                        },
                                        {
                                            type: 'input',
                                            label: $localize`Number available units`,
                                            name: 'numberAvailableUnits',
                                            disable: true,
                                        },
                                    ]
                                },
                            ],
                        },
                    ]
                },
            ]: [],
            ...hasItemsTable? [
                {
                    type: 'bigexpand',
                    name: 'usedItemsTable',
                    label: 'Using amounts',
                    options: 'aloneNoAdd',
                    collections: [
                        {
                            type: 'bignotexpand',
                            name: 'usedItem',
                            // label: 'Transfer from',
                            options: 'aloneNoAdd',
                            collections: [
                                ...this.isOnePo? []: [
                                    {
                                        type: 'input',
                                        label: $localize`#PO`,
                                        name: 'itemPoCodes',
                                        disable: true,
                                    },
                                    {
                                        type: 'input',
                                        label: $localize`Supplier`,
                                        name: 'itemSuppliers',
                                        disable: true,
                                    },
                                ],
                                {
                                    type: 'inputReadonlySelect',
                                    label: $localize`Item descrption`,
                                    name: 'item',
                                    disable: true,
                                },
                                {
                                    type: 'date',
                                    label: $localize`Process date`,
                                    name: 'itemProcessDate',
                                    disable: true,
                                },
                                {
                                    type: 'inputReadonly',
                                    label: $localize`Weight unit`,
                                    name: 'measureUnit',
                                    disable: true,
                                },
                                {
                                    type: 'inputReadonlySelect',
                                    label: $localize`Warehouse location`,
                                    name: 'warehouseLocation',
                                    disable: true,
                                },
                                // {
                                //     type: 'inputReadonly',
                                //     label: 'Empty container weight',
                                //     name: 'containerWeight',
                                //     disable: true,
                                // },
                                {
                                    type: 'arrayordinal',
                                    label: $localize`Unit weight`,
                                    name: 'amounts',
                                    inputType: 'choose',
                                    options: 3,
                                    collections: 30,
                                },
                            ]
                        },
                    ]
                },
            ]: [],
            {
                type: 'button',
                label: $localize`Submit`,
                name: 'submit',
            }
        ];
    }
    

  }