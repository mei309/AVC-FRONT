import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
@Component({
    selector: 'export-import',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="dataSource" [mainLabel]="mainLabel+ 'ing cashew process'" (submitForm)="onSubmit($event)">
        </dynamic-form>
    </div>
    `
  })
export class ExportImportComponent implements OnInit {
    isDataAvailable: boolean = false
    @Input() mainLabel: string;
    @Input() beginData;
    @Input() newUsed;
    @Input() posArray;
    @Output() submitExIm: EventEmitter<any> = new EventEmitter<any>();
    regConfig: FieldConfig[];

    isOnePo: boolean = true;

    dataSource;
    onSubmit(value: any) {
    //     console.log(value);
        
    // }
    // onSubmit1(value: any) {
        var arr = [];
        if(value['materialUsed']) {
            value['materialUsed'].forEach(element => {
                element['usedItems'] = element['usedItems'].filter(amou => amou.numberUsedUnits);
                element['groupName'] = 'meterial';
            });
            value['materialUsed'] = value['materialUsed'].filter(amou => amou.usedItems.length);
            arr = arr.concat(value['materialUsed']);
            delete value['materialUsed'];
        }
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

        value['processItems'] = [];
        if(value['processItemsNormal']) {
            value['processItems'] = value['processItems'].concat(value['processItemsNormal']);
            delete value['processItemsNormal'];
        }
        if(value['processItemsTable']) {
            value['processItemsTable'] = value['processItemsTable'].filter(amou => amou.storage.amounts);
            value['processItemsTable'].forEach(eleme => {
                    eleme['storage']['amounts'] = eleme['storage']['amounts'].filter(amou => amou.amount);
            });
            value['processItemsTable'] = value['processItemsTable'].filter(amou => amou.storage.amounts.length);
            value['processItems'] = value['processItems'].concat(value['processItemsTable']);
            delete value['processItemsTable'];
        }
        if(value['wasteItems']) {
            value['wasteItems'].forEach(elemen => {
                elemen['groupName'] = 'waste';
            });
            value['processItems'] = value['processItems'].concat(value['wasteItems']);
            delete value['wasteItems'];
        }
        this.submitExIm.emit(value);
    }

      constructor(private genral: Genral, public dialog: MatDialog) {
        }

    ngOnInit() {
        var arrNormal = [];
        var arrTable = [];
        var removeIds = [];
        if(this.beginData) {
            if(this.beginData['weightedPos']) {
                this.isOnePo = false;
            }
            var arrMaterial = [];
            this.beginData['usedItemGroups'].forEach(element => {
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
                } else if(element['groupName'] === 'meterial') {
                    element['usedItems'].forEach(el => {
                        el['storage']['numberAvailableUnits'] = el['numberAvailableUnits'];
                    });
                    arrMaterial.push(element);
                } 
            });


            delete this.beginData['usedItemGroups'];
            
            var processNormal = [];
            var processTable = [];
            var wasteNormal = [];
            this.beginData['processItems'].forEach(element => {
                if(element['groupName'] === 'waste') {
                    wasteNormal.push(element);
                } else if(element['storage']) {
                    processTable.push(element);
                } else if(element['storageForms']) {
                    processNormal.push(element);
                }
            });
            delete this.beginData['processItems'];
            this.dataSource = this.beginData;
            if(arrMaterial.length) {
                this.dataSource['materialUsed'] = arrMaterial;
            }
            if(processTable.length) {
                this.dataSource['processItemsTable'] = processTable;
            }
            if(processNormal.length) {
                this.dataSource['processItemsNormal'] = processNormal;
            } 
            // else {
            //     this.dataSource['processItemsNormal'] = [{item: this.dataSource['processItemsTable'][0]['item']}];
            // }
            // if(!processTable.length) {
            //     this.dataSource['processItemsTable'] = [{item: this.dataSource['processItemsNormal'][0]['item']}];
            // }
            if(wasteNormal.length) {
                this.dataSource['wasteItems'] = wasteNormal;
            }
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
                element['storage']['itemPo'] = element['poCode'];
                element['storage']['itemProcessDate'] = element['itemProcessDate'];
                arrTable.push({usedItem: element['storage']});
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => { 
                    if(!removeIds.includes(ele['id'])) {
                        arrUsedItems.push({itemPo: element['poCode'], item: element['item'], itemProcessDate: element['itemProcessDate'], measureUnit: element['measureUnit'], storage: ele});
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
        this.preper(this.mainLabel === 'Clean'? false : true, arrTable.length > 0, arrNormal.length > 0);
        this.isDataAvailable = true;
    }

    preper(isNotClean: boolean, hasItemsTable: boolean, hasItemsNormal: boolean) {
        this.regConfig = [
            ...this.isOnePo? [
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
                            type: 'input',
                            label: 'Weight',
                            name: 'weight',
                            // disable: true,
                        },
                        {
                            type: 'divider',
                            inputType: 'divide'
                        },
                    ]
                }
            ],
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
            // {
            //     type: 'date',
            //     label: 'Time duration',
            //     name: 'duration',
            //     options: 'duration',
            // },
            {
                type: 'input',
                label: 'Start time',
                name: 'startTime',
                // inputType: 'datetime-local',
                inputType: 'time',
            },
            {
                type: 'input',
                label: 'End time',
                name: 'endTime',
                inputType: 'time',
            },
            {
                type: 'input',
                label: 'Number of workers',
                name: 'numOfWorkers',
                inputType: 'number'
            },
            {
                type: 'select',
                label: 'Production line',
                name: 'productionLine',
                options: this.genral.getProductionLine(),
            },
            ...hasItemsNormal? [
                {
                    type: 'bigexpand',
                    name: 'usedItemsNormal',
                    label: this.mainLabel+'ing amounts',
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
                                        type: 'selectgroup',
                                        inputType: 'supplierName',
                                        // options: this.localService.getAllPosRoastPacked(),
                                        disable: true,
                                        collections: [
                                            {
                                                type: 'select',
                                                label: 'Supplier',
                                            },
                                            {
                                                type: 'select',
                                                label: '#PO',
                                                name: 'itemPo',
                                                collections: 'somewhere',
                                            },
                                        ]
                                    }
                                ],
                                {
                                    type: 'select',
                                    label: 'Item',
                                    name: 'item',
                                    disable: true,
                                },
                                {
                                    type: 'date',
                                    label: 'Process date',
                                    name: 'itemProcessDate',
                                    disable: true,
                                },
                                {
                                    type: 'input',
                                    label: 'Weight unit',
                                    name: 'measureUnit',
                                    disable: true,
                                },
                                {
                                    type: 'bignotexpand',
                                    name: 'storage',
                                    collections: [
                                        {
                                            type: 'input',
                                            label: 'Number of units',
                                            name: 'numberUnits',
                                            disable: true,
                                        },
                                        {
                                            type: 'input',
                                            name: 'unitAmount',
                                            label: 'Unit weight',
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
                                            label: 'Warehouse location',
                                            name: 'warehouseLocation',
                                            disable: true,
                                        },
                                        {
                                            type: 'input',
                                            label: 'Number available units',
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
                    label: this.mainLabel+'ing amounts',
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
                                                name: 'itemPo',
                                                collections: 'somewhere',
                                            },
                                        ]
                                    },
                                ],
                                {
                                    type: 'inputReadonlySelect',
                                    label: 'Item descrption',
                                    name: 'item',
                                    disable: true,
                                },
                                {
                                    type: 'date',
                                    label: 'Process date',
                                    name: 'itemProcessDate',
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
                                // {
                                //     type: 'inputReadonly',
                                //     label: 'Empty container weight',
                                //     name: 'containerWeight',
                                //     disable: true,
                                // },
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
            ]: [],
            {
                type: 'bigexpand',
                name: 'processItemsNormal',
                label: this.mainLabel+'d amounts',
                options: 'alone',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        collections: 'somewhere',
                        // disable: true,
                        options: this.genral.getItemsCashew(this.mainLabel),
                    },
                    {
                        type: 'selectNormal',
                        label: 'Weight unit',
                        name: 'measureUnit',
                        inputType: 'item',
                        options: this.genral.getMeasureUnit(),
                    },
                    {
                        type: 'bigexpand',
                        label: 'Amounts',
                        name: 'storageForms',
                        options: 'Inline',
                        collections: [
                            {
                                type: 'input',
                                label: 'Number of units',
                                name: 'numberUnits',
                                inputType: 'numeric',
                                options: 3,
                            },
                            // {
                            //     type: 'inputselect',
                            //     name: 'unitAmount',
                            //     collections: [
                            //         {
                            //             type: 'input',
                            //             label: 'Unit weight',
                            //             name: 'amount',
                            //             inputType: 'numeric',
                            //             options: 3,
                            //         },
                            //         {
                            //             type: 'select',
                            //             label: 'Weight unit',
                            //             name: 'measureUnit',
                            //             options: ['KG', 'LBS', 'OZ', 'GRAM'],
                            //         },
                            //     ]
                            // },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                options: this.genral.getWearhouses(),
                            },
                            // {
                            //     type: 'input',
                            //     label: 'Empty container weight',
                            //     name: 'containerWeight',
                            //     inputType: 'numeric',
                            //     options: 3,
                            // },
                            {
                                type: 'divider',
                                inputType: 'divide'
                            },
                        ],
                        // validations: [
                        //     {
                        //         name: 'unitAmount',
                        //         validator: [
                        //             {
                        //                 name: 'amount',
                        //             },
                        //             {
                        //                 name: 'measureUnit',
                        //             },
                        //         ],
                        //         message: 'a received storage must have weight, measure unit and number of units',
                        //     },
                        //     {
                        //         name: 'numberUnits',
                        //     },
                        // ]
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ],
            },
            {
                type: 'bigexpand',
                name: 'processItemsTable',
                label: this.mainLabel+'d amounts',
                // options: 'NoAdd',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        // disable: true,
                        options: this.genral.getItemsCashew(this.mainLabel),
                    },
                    {
                        type: 'selectNormal',
                        label: 'Weight unit',
                        name: 'measureUnit',
                        inputType: 'item',
                        options: this.genral.getMeasureUnit(),
                    },
                    {
                        type: 'bignotexpand',
                        name: 'storage',
                        options: 'Inline',
                        collections: [
                            // {
                            //     type: 'selectNormal',
                            //     label: 'Weight unit',
                            //     name: 'measureUnit',
                            //     options: ['KG', 'LBS', 'OZ', 'GRAM'],
                            // },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                options: this.genral.getWearhouses(),
                            },
                            // {
                            //     type: 'input',
                            //     label: 'Empty container weight',
                            //     name: 'containerWeight',
                            //     inputType: 'numeric',
                            //     options: 3,
                            // },
                            {
                                type: 'arrayordinal',
                                label: 'Unit weight',
                                name: 'amounts',
                                options: 3,
                                collections: 15,
                            },
                        ],
                        // validations: [
                        //     {
                        //         name: 'measureUnit',
                        //         message: 'a received storage must have weight, measure unit and number of units',
                        //     },
                        // ]
                    },
                ],
            },
            {
                type: 'bigexpand',
                name: 'wasteItems',
                label: 'Waste amounts',
                // options: 'alone',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        options: this.genral.getItemsCashew('Waste'),
                    },
                    {
                        type: 'selectNormal',
                        label: 'Weight unit',
                        name: 'measureUnit',
                        inputType: 'item',
                        options: this.genral.getMeasureUnit(),
                    },
                    {
                        type: 'bigexpand',
                        label: 'Amounts',
                        name: 'storageForms',
                        options: 'aloneNoAddNoFrameInline',
                        collections: [
                            {
                                type: 'input',
                                label: 'Number of units',
                                name: 'numberUnits',
                                // value: 1,
                                inputType: 'numeric',
                                options: 3,
                            },
                            // {
                            //     type: 'inputselect',
                            //     name: 'unitAmount',
                            //     options: ['item'],
                            //     inputType: 'second',
                            //     collections: [
                            //         {
                            //             type: 'input',
                            //             label: 'Unit weight',
                            //             name: 'amount',
                            //             inputType: 'numeric',
                            //             options: 3,
                            //         },
                            //         {
                            //             type: 'select',
                            //             label: 'Weight unit',
                            //             name: 'measureUnit',
                            //             options: ['LBS', 'KG', 'OZ', 'GRAM'],
                            //         },
                            //     ]
                            // },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                options: this.genral.getWearhouses(),
                            },
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            ...isNotClean? [
                {
                    type: 'bigexpand',
                    name: 'materialUsed',
                    label: 'Material used',
                    options: 'aloneNoAdd',
                    collections: [
                        {
                            type: 'materialUsage',
                            // label: 'Transfer from',
                            name: 'usedItems',
                            options: 'numberUsedUnits',
                            collections: [
                                {
                                    type: 'selectgroup',
                                    inputType: 'supplierName',
                                    // options: this.localService.getAllPosRoastPacked(),
                                    disable: true,
                                    collections: [
                                        {
                                            type: 'select',
                                            label: 'Supplier',
                                        },
                                        {
                                            type: 'select',
                                            label: '#PO',
                                            name: 'itemPo',
                                            collections: 'somewhere',
                                        },
                                    ]
                                },
                                {
                                    type: 'select',
                                    label: 'Item',
                                    name: 'item',
                                    disable: true,
                                },
                                {
                                    type: 'date',
                                    label: 'Process date',
                                    name: 'itemProcessDate',
                                    disable: true,
                                },
                                {
                                    type: 'input',
                                    label: 'Weight unit',
                                    name: 'measureUnit',
                                    disable: true,
                                },
                                {
                                    type: 'bignotexpand',
                                    name: 'storage',
                                    collections: [
                                        {
                                            type: 'input',
                                            label: 'Number of units',
                                            name: 'numberUnits',
                                            disable: true,
                                        },
                                        {
                                            type: 'input',
                                            name: 'unitAmount',
                                            label: 'Unit weight',
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
                                            label: 'Warehouse location',
                                            name: 'warehouseLocation',
                                            disable: true,
                                        },
                                        {
                                            type: 'input',
                                            label: 'Number available units',
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
            
            // {
            //     type: 'bigexpand',
            //     name: 'materialUsed',
            //     label: 'Material used',
            //     // options: 'alone',
            //     collections: [
            //         {
            //             type: 'select',
            //             label: 'Item descrption',
            //             name: 'item',
            //             options: this.genral.getItemsGeneral(),
            //         },
            //         {
            //             type: 'selectNormal',
            //             label: 'Weight unit',
            //             name: 'measureUnit',
            //             inputType: 'item',
            //             options: this.genral.getMeasureUnit(),
            //         },
            //         {
            //             type: 'input',
            //             label: 'Number of units',
            //             name: 'numberUnits',
            //             // value: 1,
            //             inputType: 'numeric',
            //             options: 3,
            //         },
            //         // {
            //         //     type: 'inputselect',
            //         //     name: 'unitAmount',
            //         //     options: 'item',
            //         //     inputType: 'second',
            //         //     collections: [
            //         //         {
            //         //             type: 'input',
            //         //             label: 'Unit weight',
            //         //             name: 'amount',
            //         //             inputType: 'numeric',
            //         //             options: 3,
            //         //         },
            //         //         {
            //         //             type: 'select',
            //         //             label: 'Weight unit',
            //         //             value: 'GRAM',
            //         //             name: 'measureUnit',
            //         //             options: ['KG', 'LBS', 'OZ', 'GRAM'],
            //         //         },
            //         //     ]
            //         // },
            //         {
            //             type: 'divider',
            //             inputType: 'divide'
            //         },
            //     ]
            // },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
    }
    

  }