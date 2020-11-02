import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';
@Component({
    selector: 'relocation-count',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1>Transfer with weighing(relocation)</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <dynamic-form [fields]="regConfigHopper" [putData]="dataSource" [mainLabel]="'Transfer with weighing(relocation)'" (submit)="submit($event)">
        </dynamic-form>
    </div>
    `
  })
export class RelocationCountComponent implements OnInit {
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
        if(value['usedItemsNormal']) {
            value['usedItemsNormal'].forEach(element => {
                element['storageMoves'] = element['storageMoves'].filter(amou => amou.numberUsedUnits);
                element['groupName'] = 'normal';
                element['storageMoves'].forEach(ele => {
                    ele['unitAmount'] = ele['storage']['unitAmount'];
                    ele['numberUnits'] = ele['numberUsedUnits'];
                });
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
                element['groupName'] = 'table';
            });
            value['usedItemsTable'] = value['usedItemsTable'].filter(amou => amou.storageMove.amounts.length);
            arr = arr.concat(value['usedItemsTable']);
            delete value['usedItemsTable'];
        }
        value['itemCounts'].forEach(eleme => {
            eleme['amounts'] = eleme['amounts'].filter(amou => amou.amount);
        });
        value['itemCounts'] = value['itemCounts'].filter(amou => amou.amounts);
        value['storageMovesGroups'] = arr;
        
        console.log(value);
        
        
        this.localService.addEditRelocationTransfer(value, this.isNew).pipe(take(1)).subscribe( val => {
            console.log(val);
            
            const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
                width: '80%',
                data: {inventoryItem: val, fromNew: true, type: 'Inventory item'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if(result === 'Edit') {
                    this.isDataAvailable = false;
                    this.isFormAvailable = false;
                    this.dataSource = null;
                    this.cdRef.detectChanges();
                    this.localService.getStorageByPo(val['poCode']['id']).pipe(take(1)).subscribe( val1 => {
                        this.fillEdit([val, val1]);
                    }); 
                } else {
                    this.router.navigate(['../InventoryReports', {number: 1}], { relativeTo: this._Activatedroute });
                }
            });
        });
    }

    constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private localService: InventoryService, private genral: Genral, private location: Location, public dialog: MatDialog,
        private _Activatedroute:ActivatedRoute, private router: Router,) {
       }
    
       fillEdit(val) {
           var arrTable = [];
           var arrNormal = [];
           var removeIdsNormal = [];
           var removeIdsTable = [];
           val[0]['storageMovesGroups'].forEach(element => {
                if(element['storageMove']) {
                    element['storageMove']['amounts'].forEach(ele => {
                        ele['take'] = true;
                        removeIdsTable.push(ele['id']);
                    });
                    arrTable.push(element);
                } else if(element['storageMoves']) {
                    arrNormal.push(element);
                    element['storageMoves'].forEach(el => {
                        removeIdsNormal.push(el['id']);
                        removeIdsNormal.push(el['storage']['id']);
                    });
                }
           });
           delete val[0]['storageMovesGroups'];
           this.dataSource = val[0];
           this.dataSource['usedItemsTable'] = [];
           this.dataSource['usedItemsNormal'] = [];
           this.setAfterChoose(val[1], removeIdsNormal, removeIdsTable);
           if(arrTable.length) {
               this.dataSource['usedItemsTable'] = this.dataSource['usedItemsTable'].concat(arrTable);
           }
           if(arrNormal.length) {
                this.dataSource['usedItemsNormal'] = this.dataSource['usedItemsNormal'].concat(arrNormal);
           }
           this.cleanUnwanted();
           this.isNew = false;
           this.isFormAvailable = true;
       }


    setBeginChoose(){
        this.form = this.fb.group({});
        this.form.addControl('poCode', this.fb.control(''));
        this.form.get('poCode').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id') && this.poID != selectedValue['id']) { 
                this.localService.getStorageByPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
                    this.dataSource = {poCode: selectedValue, usedItemsTable: [], usedItemsNormal: [], itemCounts: []};
                    this.setAfterChoose(val);
                    this.cleanUnwanted();
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
    setAfterChoose(val, removeIdsNormal?, removeIdsTable?) {
        var arrNormal = [];
        var arrTable = [];
        var arrUsedItems = [];
        val.forEach(element => {
            if(element['storage']) {
                if(!removeIdsTable || (element['storage']['amounts'] = element['storage']['amounts'].filter(amou => !removeIdsTable.includes(amou.id))).length) {
                    element['storage']['item'] = element['item'];
                    element['storage']['itemProcessDate'] = element['itemProcessDate'];
                    arrTable.push({storageMove: element['storage']});
                    this.dataSource['itemCounts'].push({item: element['item']});
                }
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => { 
                    if(!removeIdsNormal || !removeIdsNormal.includes(ele['id'])) {
                        arrUsedItems.push({item: element['item'], itemProcessDate: element['itemProcessDate'], storage: ele});
                        delete ele['numberUsedUnits'];
                    }
                });
                this.dataSource['itemCounts'].push({item: element['item']});
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
        this.isFormAvailable = true;
    }
    cleanUnwanted() {
        if(!this.dataSource['usedItemsTable'].length) {
            this.regConfigHopper.splice(4, 1);
        }
        if(!this.dataSource['usedItemsNormal'].length) {
            this.regConfigHopper.splice(3, 1);
        }
    }
   ngOnInit() {
       this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
           if(params.get('id')) {
               this.localService.getStorageTransferWithStorage(+params.get('id'), +params.get('poCode')).pipe(take(1)).subscribe( val => {
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
               options: this.genral.getProductionLine(),
           },
           {
                type: 'bigexpand',
                name: 'usedItemsNormal',
                label: 'Transfering amounts',
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
                                type: 'bignotexpand',
                                name: 'storage',
                                collections: [
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
                        ],
                    },
                ]
            },
            {
                type: 'bigexpand',
                name: 'usedItemsTable',
                label: 'Transfering amounts',
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

  