import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { cloneDeep, isEqual } from 'lodash-es';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { InventoryDetailsDialogComponent } from '../inventory/inventory-details-dialog.component';
import { InventoryService } from '../inventory/inventory.service';
@Component({
    selector: 'transfer-count',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1>Transfer with weighing</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <dynamic-form [fields]="regConfigHopper" [putData]="dataSource" [mainLabel]="'Transfer with weighing'" (submitForm)="submit($event)">
        </dynamic-form>
    </div>
    `
  })
export class TransferCountComponent implements OnInit {
    navigationSubscription;

    form: FormGroup;
    isDataAvailable: boolean = false
    isFormAvailable: boolean = false;
    poConfig;
    regConfigHopper: FieldConfig[];
    dataSource;
    poID: number;
    isNew: boolean = true;
    submit(value: any) {
        var arr = [];
        var proccesItems = [];

        if(value['usedItemsNormal']) {
            value['usedItemsNormal'].forEach(element => {
                element['usedItems'] = element['usedItems'].filter(amou => amou.numberUsedUnits);
                element['groupName'] = 'normal';
            });
            value['usedItemsNormal'] = value['usedItemsNormal'].filter(amou => amou.usedItems.length);

            value['usedItemsNormal'].forEach(element => {
                var item = element['usedItems'][0]['item'];
                var copied = cloneDeep(element['usedItems']);
                var warehouseLocation = (value['itemCounts'].find(ele => isEqual(ele['item']['id'], item['id'])))['warehouseLocation'];
                copied.forEach(et => {
                    et['numberUnits'] = et['numberUsedUnits'];
                    delete et['numberUsedUnits'];
                    et['warehouseLocation'] = warehouseLocation;
                    et['unitAmount'] = et['storage']['unitAmount'];
                    delete et['storage'];
                    // delete et['id'];
                    // delete et['version'];
                    // delete et['storage']['id'];
                    // delete et['storage']['version'];
                 });
                
                var cpoyProcess = {item: item, groupName: element['groupName'], storageForms: copied};
                delete copied['item'];
                proccesItems.push(cpoyProcess);
            });
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
                element['groupName'] = 'table';

                var copied = cloneDeep(element['usedItem']);
                copied['amounts'].forEach(et => {
                    delete et['storageId'];
                    delete et['storageVersion'];
                });
                copied['warehouseLocation'] = (value['itemCounts'].find(ele => isEqual(ele['item']['id'], copied['item']['id'])))['warehouseLocation'];
                var cpoyProcess = {item: copied['item'], groupName: element['groupName'], storage: copied};
                delete copied['item'];
                proccesItems.push(cpoyProcess);
            });
            arr = arr.concat(value['usedItemsTable']);
            delete value['usedItemsTable'];
        }
        value['usedItemGroups'] = arr;
        value['processItems'] = proccesItems;
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
        
        
        
        this.localService.addEditTransfer(value, this.isNew).pipe(take(1)).subscribe( val => {
            
            const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
                width: '80%',
                data: {inventoryItem: val, fromNew: true, type: 'Inventory item'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if(result === 'Edit') {
                    this.isDataAvailable = false;
                    this.isFormAvailable = false;
                    this.dataSource = null;
                    this.fillEdit(val);
                    this.cdRef.detectChanges();
                    // this.isDataAvailable = true;
                } else {
                    this.router.navigate(['../InventoryReports'], { relativeTo: this._Activatedroute });
                }
            });
        });
    }

      constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef,
         private localService: InventoryService, private genral: Genral, public dialog: MatDialog,
         private _Activatedroute:ActivatedRoute, private router: Router,) {
        }

        fillEdit(val) {
            var arrTable = [];
            var arrNormal = [];
            val['usedItemGroups'].forEach(element => {
                if(element['groupName'] === 'table') {
                    element['usedItem']['amounts'].forEach(ele => {
                        ele['take'] = true;
                    });
                    arrTable.push(element);
                } else if(element['groupName'] === 'normal') {
                    arrNormal.push(element);
                }
            });
            delete val['usedItemGroups'];
            this.dataSource = val;
            if(arrTable.length) {
                this.dataSource['usedItemsTable'] = arrTable;
            } else {
                this.regConfigHopper.splice(4, 1);
            }
            if(arrNormal.length) {
                this.dataSource['usedItemsNormal'] = arrNormal;
            } else {
                this.regConfigHopper.splice(3, 1);
            }
            this.isNew = false;
            this.isFormAvailable = true;
        }


    setBeginChoose(){
                this.form = this.fb.group({});
                this.form.addControl('poCode', this.fb.control(''));
                this.form.get('poCode').valueChanges.subscribe(selectedValue => {
                    if(selectedValue && selectedValue.hasOwnProperty('id') && this.poID != selectedValue['id']) { 
                        this.localService.getStorageByPo(selectedValue['id'], 'll').pipe(take(1)).subscribe( val => {
                            var arrNormal = [];
                            var arrTable = [];
                            this.dataSource = {poCode: selectedValue};
                            this.dataSource['itemCounts'] = [];
                            val.forEach(element => {
                                if(element['storage']) {
                                    element['storage']['item'] = element['item'];
                                    arrTable.push({itemProcessDate: element['processDate'], usedItem: element['storage']});
                                    this.dataSource['itemCounts'].push({item: element['item']});
                                } else if(element['storageForms']) {
                                    var arrUsedItems = [];
                                    element['storageForms'].forEach(ele => {
                                        arrUsedItems.push({item: element['item'], storage: ele})
                                        delete ele['numberUsedUnits'];
                                    });
                                    arrNormal.push({usedItems: arrUsedItems});
                                    this.dataSource['itemCounts'].push({item: element['item']});
                                }
                            });
                            if(arrTable.length) {
                                this.dataSource['usedItemsTable'] = arrTable;
                            } else {
                                this.regConfigHopper.splice(4, 1);
                            }
                            if(arrNormal.length) {
                                this.dataSource['usedItemsNormal'] = arrNormal;
                            } else {
                                this.regConfigHopper.splice(3, 1);
                            }
                            this.isFormAvailable = true;
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
    }

    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                var id = +params.get('id');
                this.localService.getStorageTransfer(id).pipe(take(1)).subscribe( val => {
                    this.fillEdit(val);
                });
            } else {
                this.setBeginChoose();
            }
        });
        

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
                options: this.genral.getProductionLine('Raw'),
            },
            {
                type: 'bigexpand',
                name: 'usedItemsNormal',
                label: 'Transfer from',
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
                                type: 'bignotexpand',
                                name: 'storage',
                                collections: [
                                    {
                                        type: 'date',
                                        label: 'Process date',
                                        name: 'itemProcessDate',
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
                        ]
                    },
                ],
            },
            {
                type: 'bigexpand',
                name: 'usedItemsTable',
                label: 'Transfer from',
                options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'date',
                        label: 'Process date',
                        name: 'itemProcessDate',
                        disable: true,
                    },
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
                        label: 'Count',
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
                                options: this.genral.getWearhouses(),
                            },
                            {
                                type: 'input',
                                label: 'Empty container weight',
                                name: 'containerWeight',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'All bags weight',
                                name: 'accessWeight',
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
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.isFormAvailable = false;
                this.dataSource = null;
                this.poID = null;
                if(this.poConfig) {
                    this.form.get('poCode').setValue(null);
                } else {
                    this.setBeginChoose();
                }
                this.cdRef.detectChanges();
                this.isDataAvailable = true;
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

  }