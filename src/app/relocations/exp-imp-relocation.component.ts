import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
@Component({
    selector: 'exp-imp-relocation',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="dataSource" [mainLabel]="num? 'Clean transfering amounts' : 'Raw transfering amounts'" (submitForm)="onSubmit($event)">
        </dynamic-form>
    </div>
    `
  })
export class ExpImpRelocationComponent implements OnInit {
    isDataAvailable: boolean = false
    @Input() num: number;
    @Input() beginData;
    @Input() newUsed;
    @Output() submitExIm: EventEmitter<any> = new EventEmitter<any>();
    regConfig: FieldConfig[];

    dataSource;
    onSubmit(value: any) {
        var arr = [];
        var newWarehouse = value['newWarehouse']? value['newWarehouse']['warehouseLocation'] : null;
        delete value['newWarehouse'];
        if(value['usedItemsNormal']) {
            value['usedItemsNormal'].forEach(element => {
                element['storageMoves'] = element['storageMoves'].filter(amou => amou.numberUsedUnits);
                element['groupName'] = 'normalRelocation';
                element['storageMoves'].forEach(ele => {ele['warehouseLocation'] = newWarehouse;});
            });
            value['usedItemsNormal'] = value['usedItemsNormal'].filter(amou => amou.storageMoves.length);
            arr = arr.concat(value['usedItemsNormal']);
            delete value['usedItemsNormal'];
        }
        if(value['usedItemsTable']) {
            value['usedItemsTable'].forEach(element => {
                element['storageMove']['amounts'] = element['storageMove']['amounts'].filter(amou => amou.take);
                element['storageMove']['amounts'].forEach(ele => {
                    if(!ele['storageId']) {
                        ele['storageId'] = ele['id'];
                        delete ele['id'];
                        ele['storageVersion'] = ele['version'];
                        delete ele['version'];
                    }
                });
                element['storageMove']['newWarehouseLocation'] = newWarehouse;
                element['groupName'] = 'tableRelocation';
            });
            value['usedItemsTable'] = value['usedItemsTable'].filter(amou => amou.storageMove.amounts.length);
            arr = arr.concat(value['usedItemsTable']);
            delete value['usedItemsTable'];
        }
        value['storageMovesGroups'] = arr;
        if(value['itemCounts']) {
            value['itemCounts'] = value['itemCounts'].filter(amou => amou.amounts);
            value['itemCounts'].forEach(eleme => {
                eleme['amounts'] = eleme['amounts'].filter(amou => amou.amount);
            });
            value['itemCounts'] = value['itemCounts'].filter(amou => amou.amounts.length);
        }

        this.submitExIm.emit(value);
    }

      constructor(private genral: Genral, public dialog: MatDialog) {
        }

    ngOnInit() {
        var arrNormal = [];
        var arrTable = [];
        var removeIds = [];
        var cashewGrades = [];
        if(this.beginData && this.beginData['storageMovesGroups']) {
            this.beginData['storageMovesGroups'].forEach(element => {
                if(element['groupName'].startsWith('table')) {
                    cashewGrades.push(element['cashewGrade']);
                    element['storageMove']['amounts'].forEach(ele => {
                        ele['take'] = true;
                    });
                    arrTable.push(element);
                } else if(element['groupName'].startsWith('normal')) {
                    element['storageMoves'].forEach(el => {
                        cashewGrades.push(el['cashewGrade']);
                        el['storage']['numberAvailableUnits'] = el['numberAvailableUnits'];
                        removeIds.push(el['storage']['id']);
                    });
                    arrNormal.push(element);
                }
            });
            const temp = this.beginData['storageMovesGroups'][0];
            if(temp['storageMove']){
                this.beginData['newWarehouse'] = {warehouseLocation: temp['storageMove']['newWarehouseLocation']};
            } else {
                this.beginData['newWarehouse'] = {warehouseLocation: temp['storageMoves'][0]['warehouseLocation']};
            }
            delete this.beginData['storageMovesGroups'];
            this.dataSource = this.beginData;
            if(!this.dataSource['itemCounts']) {
                this.dataSource['itemCounts'] = [];
            }
        } else {
            this.dataSource = {poCode: this.newUsed[0]['poCode'] , itemCounts: []};
        }
        var arrUsedItems = [];
        this.newUsed?.forEach(element => {
            cashewGrades.push(element['cashewGrade']);
            if(element['storage']) {
                element['storage']['item'] = element['item'];
                element['storage']['measureUnit'] = element['measureUnit'];
                element['storage']['itemProcessDate'] = element['itemProcessDate'];
                element['storage']['amounts'].forEach(ele => {
                    ele['amount'] = ele['numberAvailableUnits'];
                });
                arrTable.push({storageMove: element['storage']});
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => {
                    if(!removeIds.includes(ele['id'])) {
                        arrUsedItems.push({item: element['item'], itemProcessDate: element['itemProcessDate'], measureUnit: element['measureUnit'], storage: ele});
                        delete ele['numberUsedUnits'];
                    }
                });
            }
        });
        if(arrUsedItems.length) {
            arrNormal.push({storageMoves: arrUsedItems});
        }
        if(arrTable.length) {
            this.dataSource['usedItemsTable'] = arrTable;
        }
        if(arrNormal.length) {
            this.dataSource['usedItemsNormal'] = arrNormal;
        }
        this.preper(arrTable.length > 0, arrNormal.length > 0, cashewGrades);
        this.isDataAvailable = true;
    }

    preper(hasItemsTable: boolean, hasItemsNormal: boolean, cashewGrades: string[]) {
        this.regConfig = [
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
            {
                type: 'select',
                label: $localize`Production line`,
                value: 'firstVal',
                name: 'productionLine',
                options: this.genral.getProductionLine(this.getFunctionality()),
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Production line Required`,
                    }
                ]
            },
            ...hasItemsNormal? [
                {
                    type: 'bigexpand',
                    name: 'usedItemsNormal',
                    label: $localize`Transfering amounts`,
                    options: 'aloneNoAdd',
                    collections: [
                        {
                            type: 'tableWithInput',
                            // label: 'Transfer from',
                            name: 'storageMoves',
                            options: 'numberUsedUnits',
                            collections: [
                                {
                                    type: 'select',
                                    label: $localize`Item`,
                                    name: 'item',
                                    disable: true,
                                },
                                {
                                    type: 'dateTime',
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
                    label: $localize`Transfering amounts`,
                    options: 'aloneNoAdd',
                    collections: [
                        {
                            type: 'bignotexpand',
                            name: 'storageMove',
                            // label: 'Transfer from',
                            options: 'aloneNoAdd',
                            collections: [
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
                type: 'bignotexpand',
                name: 'newWarehouse',
                label: $localize`New warehouse location`,
                collections: [
                    {
                        type: 'select',
                        label: $localize`Warehouse location`,
                        name: 'warehouseLocation',
                        collections: 'somewhere',
                        options: this.genral.getWearhouses(),
                    },
                ]
            },
            {
               type: 'bigexpand',
               name: 'itemCounts',
               label: $localize`Count`,
               collections: [
                   {
                       type: 'selectItem',
                       label: $localize`Item descrption`,
                       name: 'item',
                       collections: 'relocation',
                       options: this.genral.getItemsCashewGrades(this.num, cashewGrades),
                   },
                  //  {
                  //      type: 'selectMU',
                  //      label: $localize`Weight unit`,
                  //      name: 'measureUnit',
                  //  },
                    {
                        type: 'selectNormal',
                        label: $localize`Weight unit`,
                        name: 'measureUnit',
                        value: 'KG',
                        options: this.genral.getMeasureUnit(),
                    },
                   {
                       type: 'input',
                       label: $localize`All bags weight`,
                       name: 'accessWeight',
                       inputType: 'numeric',
                       options: 3,
                   },
                   {
                       type: 'arrayordinal',
                       label: $localize`Unit weight`,
                       name: 'amounts',
                       options: 3,
                       collections: 30,
                   },
               ],
           },
            {
                type: 'button',
                label: $localize`Submit`,
                name: 'submit',
            }
        ];
    }

    getFunctionality() {
        switch (this.num) {
            case 0:
                return 'RAW_STATION';
            case 1:
                return 'ROASTER_IN';
        }
   }


  }
