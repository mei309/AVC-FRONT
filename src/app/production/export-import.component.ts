import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ProductionService } from './production.service';
@Component({
    selector: 'export-import',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="dataSource" [mainLabel]="mainLabel+ 'ing cashew process'" (submit)="onSubmit($event)">
        </dynamic-form>
    </div>
    `
  })
export class ExportImportComponent implements OnInit {
    isDataAvailable: boolean = false
    @Input() mainLabel: string;
    @Input() beginData;
    @Input() isNew: boolean = true;
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();
    regConfig: FieldConfig[];

    dataSource;
    
    onSubmit(value: any) {
        var arr = [];
        if(value['materialUsed']) {
            var arrMaterial = [];
            value['materialUsed'].forEach(element => {
                if(element['numberUsedUnits']) {
                    arrMaterial.push({storage: element, numberUsedUnits: element['numberUsedUnits']});
                }
            });
            arr.push({usedItems: arrMaterial, groupName: 'meterial'});
            delete value['materialUsed'];
        }
        if(value['usedItemsNormal']) {
            value['usedItemsNormal'].forEach(element => {
                if(this.isNew) {
                    var arrNormal = [];
                    element['usedItems'].forEach(elem => {
                        if(elem['numberUsedUnits']) {
                            arrNormal.push({storage: elem, numberUsedUnits: elem['numberUsedUnits']});
                        }
                    });
                    element['usedItems'] = arrNormal;
                }
                element['groupName'] = 'normal';
            });
            arr = arr.concat(value['usedItemsNormal']);
            delete value['usedItemsNormal'];
        }
        if(value['usedItemsTable']) {
            value['usedItemsTable'].forEach(element => {
                element['usedItem']['amounts'] = element['usedItem']['amounts'].filter(amou => amou.take);
                if(this.isNew) {
                    element['usedItem']['amounts'].forEach(ele => {
                        ele['storageId'] = ele['id'];
                        delete ele['id'];
                        ele['storageVersion'] = ele['version'];
                        delete ele['version'];
                    });
                }
                element['groupName'] = 'table';
            });
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
        
        console.log(value);
        
        this.submit.emit(value);
    }

      constructor(private _Activatedroute:ActivatedRoute, private router: Router, private fb: FormBuilder, private cdRef: ChangeDetectorRef,
         private localService: ProductionService, private genral: Genral, private location: Location, public dialog: MatDialog) {
        }

    ngOnInit() {
        this.preper();
        if (this.mainLabel === 'Clean') {
            this.regConfig.splice(11, 1);
        }
        var arrNormal = [];
        var arrTable = [];
        if(this.isNew) {
            this.dataSource = {poCode: this.beginData[0]['poCode']};
            this.beginData.forEach(element => {
                if(element['storage']) {
                    element['storage']['item'] = element['item'];
                    arrTable.push({usedItem: element['storage']});
                } else if(element['storageForms']) {
                    element['storageForms'].forEach(ele => {
                        ele['item'] = element['item'];
                        ele['otherUsedUnits'] = ele['numberUsedUnits'];
                    });
                    arrNormal.push({usedItems: element['storageForms']});
                }
            });
        } else {
            this.beginData['usedItemGroups'].forEach(element => {
                if(element['groupName'] === 'table') {
                    element['usedItem']['amounts'].forEach(ele => {
                        ele['take'] = true;
                    });
                    arrTable.push(element);
                } else if(element['groupName'] === 'normal') {
                    element['usedItems']?.forEach(ele => {
                        ele['numberUnits'] = ele['storage']['numberUnits'];
                    });
                    arrNormal.push(element);
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
            if(processTable.length) {
                this.dataSource['processItemsTable'] = processTable;
            }
            if(processNormal.length) {
                this.dataSource['processItemsNormal'] = processNormal;
            } else {
                this.dataSource['processItemsNormal'] = [{item: this.dataSource['processItemsTable'][0]['item']}];
            }
            if(!processTable.length) {
                this.dataSource['processItemsTable'] = [{item: this.dataSource['processItemsNormal'][0]['item']}];
            }
            if(wasteNormal.length) {
                this.dataSource['wasteItems'] = wasteNormal;
            }
        }
        if(arrTable.length) {
            this.dataSource['usedItemsTable'] = arrTable;
        } else {
            this.regConfig.splice(7, 1);
        }
        if(arrNormal.length) {
            this.dataSource['usedItemsNormal'] = arrNormal;
        } else {
            this.regConfig.splice(6, 1);
        }
        this.isDataAvailable = true;
    }

    preper() {
        this.regConfig = [
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
            // {
            //     type: 'date',
            //     label: 'Time duration',
            //     name: 'duration',
            //     options: 'duration',
            // },
            {
                type: 'input',
                label: 'startTime',
                name: 'startTime',
                // inputType: 'datetime-local',
                inputType: 'time',
            },
            {
                type: 'input',
                label: 'endTime',
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
                            {
                                type: 'select',
                                label: 'Item',
                                name: 'item',
                                disable: true,
                            },
                            {
                                type: 'inputselect',
                                name: 'unitAmount',
                                label: 'Unit weight',
                                disable: true,
                                collections: [
                                    {
                                        type: 'input',
                                        label: 'Unit weight',
                                        name: 'amount',
                                    },
                                    {
                                        type: 'select',
                                        label: 'Weight unit',
                                        name: 'measureUnit',
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
                                type: 'input',
                                label: 'Used units',
                                name: 'otherUsedUnits',
                                disable: true,
                            },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                disable: true,
                            },
                            {
                                type: 'nothing',
                                name: 'storage',
                            },
                        ],
                    },
                ]
            },
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
                        // disable: true,
                        options: this.genral.getItemsCashew(this.mainLabel),
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
                    // {
                    //     type: 'divider',
                    //     inputType: 'divide'
                    // },
                ],
            },
            {
                type: 'bigexpand',
                name: 'processItemsTable',
                label: this.mainLabel+'d amounts',
                options: 'NoAdd',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        // disable: true,
                        options: this.genral.getItemsCashew(this.mainLabel),
                    },
                    {
                        type: 'bignotexpand',
                        name: 'storage',
                        options: 'Inline',
                        collections: [
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
                        options: this.genral.getItemsCashew('WASTE'),
                    },
                    {
                        type: 'bigexpand',
                        label: 'Amounts',
                        name: 'storageForms',
                        options: 'aloneNoAddNoFrameInline',
                        collections: [
                            {
                                type: 'inputselect',
                                name: 'unitAmount',
                                options: ['item'],
                                inputType: 'second',
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
                                        options: ['LBS', 'KG', 'OZ', 'GRAM'],
                                    },
                                ]
                            },
                            {
                                type: 'input',
                                label: 'Number of units',
                                name: 'numberUnits',
                                value: 1,
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                options: this.genral.getStorage(),
                            },
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            {
                type: 'bigexpand',
                name: 'materialUsed',
                label: 'Material used',
                // options: 'alone',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        options: this.genral.getItemsGeneral(),
                    },
                    {
                        type: 'inputselect',
                        name: 'unitAmount',
                        options: 'item',
                        inputType: 'second',
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
                                value: 'GRAM',
                                name: 'measureUnit',
                                options: ['KG', 'LBS', 'OZ', 'GRAM'],
                            },
                        ]
                    },
                    {
                        type: 'input',
                        label: 'Number of units',
                        name: 'numberUnits',
                        value: 1,
                        inputType: 'numeric',
                        options: 3,
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
    }
    

  }