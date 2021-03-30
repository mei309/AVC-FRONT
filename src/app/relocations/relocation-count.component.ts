import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { cloneDeep } from 'lodash-es';
import { RelocationsDetailsDialogComponent } from './relocations-details-dialog.component';
import { RelocationsService } from './relocations.service';
@Component({
    selector: 'relocation-count',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1>{{type}} transfer with weighing(relocation)</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <dynamic-form [fields]="regConfigHopper" [putData]="dataSource" [mainLabel]="type+' transfer with weighing(relocation)'" (submitForm)="submit($event)">
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

    type: string = 'Raw';
  
    submit(value: any) {
        var arr = [];
        var newWarehouse = value['newWarehouse']? value['newWarehouse']['warehouseLocation'] : null;
        delete value['newWarehouse'];
        if(value['usedItemsNormal']) {
            value['usedItemsNormal'].forEach(element => {
                // element['measureUnit'] = element['storageMoves'][0]['measureUnit'];
                element['storageMoves'] = element['storageMoves'].filter(amou => amou.numberUsedUnits);
                element['groupName'] = 'normal';
                element['storageMoves'].forEach(ele => {
                    ele['unitAmount'] = ele['storage']['unitAmount'];
                    ele['numberUnits'] = ele['numberUsedUnits'];
                    ele['warehouseLocation'] = newWarehouse;
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
                element['storageMove']['newWarehouseLocation'] = newWarehouse;
                element['groupName'] = 'table';
                element['measureUnit'] = element['storageMove']['measureUnit'];
            });
            value['usedItemsTable'] = value['usedItemsTable'].filter(amou => amou.storageMove.amounts.length);
            arr = arr.concat(value['usedItemsTable']);
            delete value['usedItemsTable'];
        }
        value['itemCounts'] = value['itemCounts'].filter(amou => amou.amounts);
        value['itemCounts'].forEach(eleme => {
            eleme['amounts'] = eleme['amounts'].filter(amou => amou.amount);
        });
        value['itemCounts'] = value['itemCounts'].filter(amou => amou.amounts.length);
        value['storageMovesGroups'] = arr;
        if(!value['productionLine']) {
            this.genral.getProductionLine(this.getFunctionality()).pipe(take(1)).subscribe( val => {
                value['productionLine'] = val[0];
                this.submitToBackend(value);
            });
        } else {
            this.submitToBackend(value);
        }
    }

    submitToBackend(value: any) {
        this.localService.addEditRelocationTransfer(value, this.isNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(RelocationsDetailsDialogComponent, {
                width: '80%',
                data: {relocationsItem: cloneDeep(val), fromNew: true, type: 'Inventory item'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if(result === 'Edit') {
                    // this.isDataAvailable = false;
                    this.isFormAvailable = false;
                    this.dataSource = null;
                    this.cdRef.detectChanges();
                    this.setRegConfig();
                    this.localService.getStorageByPo(val['poCode']['id'], this.type).pipe(take(1)).subscribe( val1 => {
                        this.fillEdit([val, val1]);
                    }); 
                } else {
                    this.router.navigate(['../RelocationsReports', {number: this.type === 'Clean'? 1 : 0}], { relativeTo: this._Activatedroute });
                }
            });
        });
    }

    constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private localService: RelocationsService, private genral: Genral, public dialog: MatDialog,
        private _Activatedroute:ActivatedRoute, private router: Router,) {
       }
    
       fillEdit(val) {
            if(!val[0]['itemCounts']) {
                val[0]['itemCounts'] = [];
            }
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
                    if(!val[0]['itemCounts'].some( vendor => vendor['item']['value'] === element['storageMove']['item']['value'] )) {
                        val[0]['itemCounts'].push({item: element['storageMove']['item']});
                    }
                } else if(element['storageMoves']) {
                    element['storageMoves'].forEach(el => {
                        el['storage']['numberAvailableUnits'] = el['numberAvailableUnits'];
                        removeIdsNormal.push(el['id']);
                        removeIdsNormal.push(el['storage']['id']);
                        // if(!val[0]['itemCounts'].some( vendor => vendor['item']['value'] === el['item']['value'] )) {
                        //     val[0]['itemCounts'].push({item: el['item']});
                        // }
                    });
                    arrNormal.push(element);
                }
           });

           const temp = val[0]['storageMovesGroups'][0];
           if(temp['storageMove']){
                val[0]['newWarehouse'] = {warehouseLocation: temp['storageMove']['newWarehouseLocation']};
           } else {
                val[0]['newWarehouse'] = {warehouseLocation: temp['storageMoves'][0]['warehouseLocation']};
           }

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
                this.localService.getStorageByPo(selectedValue['id'], this.type).pipe(take(1)).subscribe( val => {
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
                options: this.localService.getAllPos(this.getProductionUse()),
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
        val?.forEach(element => {
            if(element['storage']) {
                if(!removeIdsTable || (element['storage']['amounts'] = element['storage']['amounts'].filter(amou => !removeIdsTable.includes(amou.id))).length) {
                    element['storage']['item'] = element['item'];
                    element['storage']['measureUnit'] = element['measureUnit'];
                    element['storage']['itemProcessDate'] = element['itemProcessDate'];
                    arrTable.push({storageMove: element['storage']});
                }
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => { 
                    if(!removeIdsNormal || !removeIdsNormal.includes(ele['id'])) {
                        arrUsedItems.push({item: element['item'], itemProcessDate: element['itemProcessDate'], measureUnit: element['measureUnit'], storage: ele});
                        delete ele['numberUsedUnits'];
                    }
                });
            }
            // if(!this.dataSource['itemCounts'].some( vendor => vendor['item']['value'] === element['item']['value'] )) {
            //     this.dataSource['itemCounts'].push({item: element['item']});
            // }
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
            var ind = this.regConfigHopper.findIndex((em) => em['name'] === 'usedItemsTable');
            if(ind !== -1) {
                this.regConfigHopper.splice(ind, 1);
            }
        }
        if(!this.dataSource['usedItemsNormal'].length) {
            var ind = this.regConfigHopper.findIndex((em) => em['name'] === 'usedItemsNormal');
            if(ind !== -1) {
                this.regConfigHopper.splice(ind, 1);
            }
        }
    }
   ngOnInit() {
        this.setRegConfig();
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('clean')) {
                this.type = 'Clean';
            } 
            if(params.get('id')) {
                this.localService.getStorageTransferWithStorage(+params.get('id'), (params.getAll('poCodes')).map(el=>parseInt(el)), this.type).pipe(take(1)).subscribe( val => {
                    this.fillEdit(val);
                });
            } else {
                this.setBeginChoose();
            }
        });
       
       

       
       this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
            this.isDataAvailable = false;
            this.isFormAvailable = false;
            this.dataSource = null;
            this.setRegConfig();
            this.poID = null;
            this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
                if(params.get('clean')) {
                    this.type = 'Clean';
                } else {
                    this.type = 'Raw';
                }
            });
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

   setRegConfig() {
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
            options: this.genral.getProductionLine(this.getFunctionality()),
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
                             type: 'input',
                             label: 'Weight unit',
                             name: 'measureUnit',
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
                                     // collections: [
                                     //     {
                                     //         type: 'input',
                                     //         label: 'Unit weight',
                                     //         name: 'amount',
                                     //     },
                                     //     {
                                     //         type: 'select',
                                     //         label: 'Weight unit',
                                     //         name: 'measureUnit',
                                     //     },
                                     // ]
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
                        //  {
                        //      type: 'inputReadonly',
                        //      label: 'Empty container weight',
                        //      name: 'containerWeight',
                        //      disable: true,
                        //  },
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
             type: 'bignotexpand',
             name: 'newWarehouse',
             label: 'New warehouse location',
             collections: [
                 {
                     type: 'select',
                     label: 'Warehouse location',
                     name: 'warehouseLocation',
                     options: this.genral.getWearhouses(),
                 },
             ]
         },
         {
             type: 'bigexpand',
             name: 'itemCounts',
             label: 'Count',
            //  options: 'aloneNoAdd',
             collections: [
                 {
                     type: 'select',
                     label: 'Item descrption',
                     name: 'item',
                     collections: 'somewhere',
                     options: this.genral.getItemsCashew(this.type),
                    //  disable: true,
                 },
                //  {
                //      type: 'selectNormal',
                //      label: 'Weight unit',
                //      name: 'measureUnit',
                //      options: this.genral.getMeasureUnit(),
                //      // disable: true,
                //  },
                 {
                    type: 'selectMU',
                    label: 'Weight unit',
                    name: 'measureUnit',
                },
                //  {
                //      type: 'input',
                //      label: 'Empty container weight',
                //      name: 'containerWeight',
                //      inputType: 'numeric',
                //      options: 3,
                //  },
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

   }

   getFunctionality() {
    return this.type === 'Clean'? 'ROASTER_IN' : 'RAW_STATION';
   }

   getProductionUse() {
    return this.type === 'Clean'? 'CLEAN' : 'RAW_KERNEL';
   }


   ngOnDestroy() {
        if (this.navigationSubscription) {  
        this.navigationSubscription.unsubscribe();
        }
    }
  }

  