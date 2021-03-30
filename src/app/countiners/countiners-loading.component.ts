import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isEqual, map } from 'lodash-es';
import { take } from 'rxjs/operators';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { diff } from '../libraries/diffArrayObjects.interface';
import { CounteinersDetailsDialogComponent } from './counteiners-details.component';
import { CountinersService } from './countiners.service';
import { cloneDeep } from 'lodash-es';
@Component({
    selector: 'countiners-loading',
    template: `
    <h1 style="text-align:center">Loading</h1>
    <ng-container *ngIf="beginPage" mat-stretch-tabs>
            <dynamic-form #first [fields]="beginConfig" [putData]="putFirstData" [mainLabel]="'Loading information'">
            </dynamic-form>
            <ng-container dynamicField [field]="poConfig" [group]="form">
            </ng-container>
            <div *ngIf="isFormAvailable">
                <dynamic-form #second [fields]="regConfig" [putData]="dataSource" [mainLabel]="'Material to load'">
                </dynamic-form>
            </div>
    </ng-container>
    <div class="margin-top" style="text-align:right" *ngIf="isFormAvailable">
        <button type="button" style="min-width:150px; margin-right: 45px" mat-raised-button color="primary" (click)="onSubmitBoth()">Submit</button>
        <button type="button" style="min-width:150px" mat-raised-button color="primary" (click)="onResetBoth()">Reset</button>
    </div>
    `
  })
export class CountinersLoadingComponent {
    navigationSubscription;

    @ViewChild('first', {static: false}) formFirst: DynamicFormComponent;
    @ViewChild('second', {static: false}) formSecond: DynamicFormComponent;

    form: FormGroup;
    
    choosedPos = [];
    poConfig: FieldConfig;
    regConfig: FieldConfig[] = [];
    beginConfig: FieldConfig[];
    
    dataSource = {usedItemsTable: [], usedItemsNormal: [], loadedItems: []};
    isNew: boolean = true;
    isFormAvailable: boolean = false;
    beginPage: boolean = true;
    putFirstData;

    removeIds = [];
    removeIdsTable = [];

    onSubmitBoth() {
            var firstData = this.formFirst.onSubmitOutside();
            var secondData = this.formSecond? this.formSecond.onSubmitOutside() : false;
            if(secondData && firstData) {
                var arr = [];
                if(secondData['usedItemsNormal']) {
                    secondData['usedItemsNormal'].forEach(element => {
                        element['usedItems'] = element['usedItems'].filter(amou => amou.numberUsedUnits);
                        element['groupName'] = 'normalPos';
                    });
                    secondData['usedItemsNormal'] = secondData['usedItemsNormal'].filter(amou => amou.usedItems.length);
                    arr = arr.concat(secondData['usedItemsNormal']);
                    delete secondData['usedItemsNormal'];
                }
                if(secondData['usedItemsTable']) {
                    secondData['usedItemsTable'].forEach(element => {
                        element['usedItem']['amounts'] = element['usedItem']['amounts'].filter(amou => amou.take);
                        element['usedItem']['amounts'].forEach(ele => {
                            if(!ele['storageId']) {
                                ele['storageId'] = ele['id'];
                                delete ele['id'];
                                ele['storageVersion'] = ele['version'];
                                delete ele['version'];
                            }
                        });
                        element['groupName'] = 'tablePos';
                    });
                    secondData['usedItemsTable'] = secondData['usedItemsTable'].filter(amou => amou.usedItem.amounts.length);
                    arr = arr.concat(secondData['usedItemsTable']);
                    delete secondData['usedItemsTable'];
                }
                firstData['usedItemGroups'] = arr;
                // firstData['loadedItems'] = secondData['loadedItems'];

                // var proccesItems = [];
                // this.processData.forEach(element => {
                //     if(element) {
                //         element['storage']['amounts'].forEach(et => {
                //             delete et['id'];
                //             delete et['version'];
                //         });
                //         // element['storage']['warehouseLocation'] = element['warehouseLocation'];
                //         delete element['storage']['item'];
                //         var cpoyProcess = {item: element['item'], groupName: element['groupName'], storage: element['storage']}
                //         proccesItems.push(cpoyProcess);
                //     }
                // });
                // this.firstData['processItems'] = proccesItems;

                this.localService.addEditLoading(firstData, this.isNew).pipe(take(1)).subscribe( val => {
                    const dialogRef = this.dialog.open(CounteinersDetailsDialogComponent, {
                        width: '80%',
                        data: {loading: cloneDeep(val), fromNew: true, type: 'Loading'}
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        switch (result) {
                            case 'Edit':
                                this.beginPage = false;
                                this.choosedPos = [];
                                this.dataSource = {usedItemsTable: [], usedItemsNormal: [], loadedItems: []};
                                this.putFirstData = null;
                                this.removeIds = [];
                                this.removeIdsTable = [];
                                this.cdRef.detectChanges();
                                this.localService.getLoading(val['id']).pipe(take(1)).subscribe( val1 => {
                                    this.fillEdit(val1);
                                });
                                break;
                            case 'Security Doc':
                                this.router.navigate(['../SecurityExportDoc',{id: val['id'], docType: 'Security'}], { relativeTo: this._Activatedroute });
                                break;
                            case 'Export Doc':
                                this.router.navigate(['../SecurityExportDoc',{id: val['id'], docType: 'Export'}], { relativeTo: this._Activatedroute });
                                break;
                        
                            default:
                                this.router.navigate(['../CountinerReports', {number: 1}], { relativeTo: this._Activatedroute });
                                break;
                        }
                    });
                });
            }
    }

    onResetBoth() {
        this.formFirst.onReset();
        if(this.formSecond) {
            this.formSecond.onReset();
        }
    }

    setRawSecondValue() {
        if(this.formSecond) {
            this.dataSource = this.formSecond.value;
            if(!this.dataSource['usedItemsTable']){
                this.dataSource['usedItemsTable'] = [];
            }
            if(!this.dataSource['usedItemsNormal']){
                this.dataSource['usedItemsNormal'] = [];
            }
            if(!this.dataSource['loadedItems']){
                this.dataSource['loadedItems'] = [];
            }
        }
    }
      

    constructor(private fb: FormBuilder, private _Activatedroute:ActivatedRoute, private router: Router, private cdRef:ChangeDetectorRef,
        private localService: CountinersService, private genral: Genral, public dialog: MatDialog) {
    }


    addToForm(val) { 
        var arrNormal = [];
        var arrTable = [];
        var arrDeclared = [];
        var arrUsedItems = [];
        val?.forEach(element => {
            if(element['storage']) {
                if((element['storage']['amounts'] = element['storage']['amounts'].filter(amou => !this.removeIdsTable.includes(amou.id))).length) {
                    element['storage']['item'] = element['item'];
                    element['storage']['itemPoCodes'] = element['poCodes'];
                    element['storage']['itemSuppliers'] = element['suppliers'];
                    element['storage']['measureUnit'] = element['measureUnit'];
                    element['storage']['itemProcessDate'] = element['itemProcessDate'];
                    arrTable.push({usedItem: element['storage']});
                    element['storage']['amounts'].forEach(ele => {
                        this.removeIdsTable.push(ele['id']);
                    });
                }
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => {
                    if(!this.removeIds.includes(ele['id'])) {
                        arrUsedItems.push({itemPoCodes: element['poCodes'], itemSuppliers: element['suppliers'], item: element['item'], itemProcessDate: element['itemProcessDate'], measureUnit: element['measureUnit'], storage: ele});
                        delete ele['numberUsedUnits'];
                        this.removeIds.push(ele['id']);
                    }
                });
            }
            arrDeclared.push({poCode: element['poCode'], item: element['item']});
        });
        if(arrUsedItems.length) {
            arrNormal.push({usedItems: arrUsedItems});
        }
        if(arrTable.length) {
            this.dataSource['usedItemsTable'] = this.dataSource['usedItemsTable'].concat(arrTable);
        }
        if(arrNormal.length) {
            this.dataSource['usedItemsNormal'] = this.dataSource['usedItemsNormal'].concat(arrNormal);
        }
        if(arrDeclared.length) {
            this.dataSource['loadedItems'] = this.dataSource['loadedItems'].concat(arrDeclared);
        }
    }

    addWanted() {
        var ind = this.regConfig.findIndex((em) => em['name'] === 'usedItemsNormal');
        if(this.dataSource['usedItemsNormal'].length) {
            if(ind === -1) {
                this.addNormal();
            }
        } else if(ind !== -1) {
            this.regConfig.splice(ind, 1);
        }
        var mnd = this.regConfig.findIndex((em) => em['name'] === 'usedItemsTable');
        if(this.dataSource['usedItemsTable'].length) {
            if(mnd === -1) {
                this.addTable();
            }
        } else if(mnd !== -1) {
            this.regConfig.splice(mnd, 1);
        }
    }


    preperChoosingPO() {
        this.form = this.fb.group({});
        this.form.addControl('poCodes', this.fb.array([this.fb.group({poCode: null})]));
        
        this.form.get('poCodes').valueChanges.subscribe(selectedValue => {
            selectedValue = selectedValue.filter(ele => ele.poCode && ele.poCode.id);
            selectedValue = map(selectedValue, 'poCode'); 
            if(selectedValue.length && !isEqual(selectedValue, this.choosedPos)) {
                this.setRawSecondValue();
                var result = diff(this.choosedPos, selectedValue, 'id', { updatedValues: 1});
                var numberOfObsrevers = result['added'].length;// + result['removed'].length;
                if(numberOfObsrevers) {
                    this.isFormAvailable = false;
                }
                result['added'].forEach(el => {
                    this.localService.getStorageRoastPackedPo(el.id).pipe(take(1)).subscribe( val => {
                        this.addToForm(val);
                        numberOfObsrevers--;
                        if(!numberOfObsrevers) {
                            this.addWanted();
                            this.isFormAvailable = true;
                        }
                    });
                });
                // result['removed'].forEach(el => {
                //     numberOfObsrevers--;
                //     if(!numberOfObsrevers) {
                //         this.addWanted();
                //         this.isFormAvailable = true;
                //     }
                // });
                this.choosedPos = selectedValue;
            }
        });
        
        this.poConfig =
            {
                type: 'bigexpand',
                name: 'poCodes',
                label: 'Loading PO#s',
                options: 'aloneInline',
                collections: [
                    {
                        type: 'selectgroup',
                        inputType: 'supplierName',
                        options: this.localService.getAllPosRoastPacked(),
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
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            };
    }


    fillEdit(val) {
        var arrNormal = [];
        var arrTable = [];
        val['usedItemGroups']?.forEach(element => {
            if(element['groupName'].startsWith('table')) {
                element['usedItem']['amounts'].forEach(ele => {
                    ele['take'] = true;
                    this.removeIdsTable.push(ele['id']);
                });
                arrTable.push(element);
            } else if(element['groupName'].startsWith('normal')) {
                element['usedItems'].forEach(el => {
                    el['storage']['numberAvailableUnits'] = el['numberAvailableUnits'];
                    this.removeIds.push(el['id']);
                    this.removeIds.push(el['storage']['id']);
                });
                arrNormal.push(element);
            }
        });
        delete val['usedItemGroups'];
        this.dataSource['loadedItems'] = val['loadedItems'];
        delete val['loadedItems'];
        this.putFirstData = val;
        // this.dataSource = val;
        if(arrTable.length) {
            this.dataSource['usedItemsTable'] = arrTable;
        }
        if(arrNormal.length) {
            this.dataSource['usedItemsNormal'] = arrNormal;
        }
        this.addWanted();
        this.isNew = false;
        this.beginPage = true;
        this.isFormAvailable = true;
    }

    ngOnInit () {
        this.addLoaded();
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                var id = +params.get('id');
                this.beginPage = false;
                this.localService.getLoading(id).pipe(take(1)).subscribe( val => {
                    this.fillEdit(val);
                });
            }
        });
        this.beginConfig = [
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
                label: 'Shipment code',
                name: 'shipmentCode',
                options: this.localService.findFreeShipmentCodes(),
                disable: true,
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Shipment code Required',
                    }
                ]
            },
            {
                type: 'select',
                label: 'Container',
                name: 'arrival',
                options: this.localService.findFreeArrivals(),
                disable: true,
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Container Required',
                    }
                ]
            },
            // {
            //   type: 'bignotexpand',
            //   label: 'Shipment code',
            //   name: 'shipmentCode',
            //   collections: [
            //       {
            //           type: 'input',
            //           label: 'Code',
            //           name: 'code',
            //           inputType: 'numeric',
            //           disable: true,
            //           validations: [
            //             {
            //                 name: 'required',
            //                 validator: Validators.required,
            //                 message: 'Code Required',
            //             }
            //           ]
            //       },
            //       {
            //           type: 'select',
            //           label: 'Destination port',
            //           name: 'portOfDischarge',
            //           options: this.genral.getShippingPorts(),
            //           validations: [
            //                 {
            //                     name: 'required',
            //                     validator: Validators.required,
            //                     message: 'Destination port Required',
            //                 }
            //             ]
            //       },
            //   ],
            // },
            // {
            //   type: 'bignotexpand',
            //   label: 'Container details',
            //   name: 'containerDetails',
            //   collections: [
            //       {
            //           type: 'input',
            //           label: 'Container number',
            //           name: 'containerNumber',
            //           validations: [
            //             {
            //                 name: 'required',
            //                 validator: Validators.required,
            //                 message: 'Container number Required',
            //             }
            //           ]
            //       },
            //       {
            //           type: 'input',
            //           label: 'Seal number',
            //           name: 'sealNumber',
            //           validations: [
            //             {
            //                 name: 'required',
            //                 validator: Validators.required,
            //                 message: 'Seal number Required',
            //             }
            //           ]
            //       },
            //       {
            //           type: 'selectNormal',
            //           label: 'Container type',
            //           name: 'containerType',
            //         //   value: '20\'',
            //           options: this.genral.getShippingContainerType(),
            //           validations: [
            //             {
            //                 name: 'required',
            //                 validator: Validators.required,
            //                 message: 'Container type Required',
            //             }
            //           ]
            //       },
            //   ],
            // },
            // {
            //   type: 'bignotexpand',
            //   label: 'Shiping details',
            //   name: 'shipingDetails',
            //   value: 'required',
            //   collections: [
            //       {
            //           type: 'input',
            //           label: 'Booking number',
            //           name: 'bookingNumber',
            //       },
            //       {
            //           type: 'input',
            //           label: 'Vessel',
            //           name: 'vessel',
            //       },
            //       {
            //           type: 'input',
            //           label: 'Shipping company',
            //           name: 'shippingCompany',
            //       },
            //       {
            //           type: 'select',
            //           label: 'Loading port',
            //           name: 'portOfLoading',
            //           options: this.genral.getShippingPorts(),
            //       },
            //       {
            //           type: 'date',
            //           label: 'Etd',
            //           name: 'etd',
            //           // value: new Date()
            //           validations: [
            //             {
            //                 name: 'required',
            //                 validator: Validators.required,
            //                 message: 'Etd Required',
            //             }
            //           ]
            //       },
            //       {
            //           type: 'select',
            //           label: 'Destination port',
            //           name: 'portOfDischarge',
            //           options: this.genral.getShippingPorts(),
            //       },
            //       {
            //         type: 'date',
            //         label: 'Eta',
            //         name: 'eta',
            //         // value: new Date()
            //         validations: [
            //             {
            //                 name: 'required',
            //                 validator: Validators.required,
            //                 message: 'Eta Required',
            //             }
            //           ]
            //       },
            //   ],
            // },
        ];
        this.preperChoosingPO();
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.beginPage = false;
                this.isFormAvailable = false;
                this.choosedPos = [];
                this.dataSource = {usedItemsTable: [], usedItemsNormal: [], loadedItems: []};
                this.removeIds = [];
                this.removeIdsTable = [];
                this.putFirstData = null;
                this.preperChoosingPO();
                this.cdRef.detectChanges();
                this.beginPage = true;
            }
        });
    }

    addLoaded(){
        this.regConfig = [
            // {
            //     type: 'bigexpand',
            //     name: 'loadedItems',
            //     label: 'Declared amounts',
            //     options: 'aloneNoAdd',
            //     collections: [
            //         {
            //             type: 'selectgroup',
            //             inputType: 'supplierName',
            //             options: this.localService.getAllPosRoastPacked(),
            //             collections: [
            //                 {
            //                     type: 'select',
            //                     label: 'Supplier',
            //                 },
            //                 {
            //                     type: 'select',
            //                     label: '#PO',
            //                     name: 'poCode',
            //                     collections: 'somewhere',
            //                 },
            //             ]
            //         },
            //         {
            //             type: 'select',
            //             label: 'Item descrption',
            //             name: 'item',
            //             options: this.genral.getAllItemsCashew(),
            //         },
            //         {
            //             type: 'inputselect',
            //             name: 'declaredAmount',
            //             collections: [
            //                 {
            //                     type: 'input',
            //                     label: 'Declared amount',
            //                     name: 'amount',
            //                     inputType: 'numeric',
            //                     options: 3,
            //                 },
            //                 {
            //                     type: 'select',
            //                     label: 'Weight unit',
            //                     name: 'measureUnit',
            //                     options: ['KG', 'LBS', 'OZ', 'GRAM'],
            //                 },
            //             ]
            //         },
            //         {
            //             type: 'divider',
            //             inputType: 'divide'
            //         },
            //     ]
            // },
        ];
     }

     addNormal(){
         this.regConfig.splice(0, 0, 
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
                                type: 'input',
                                label: '#PO',
                                name: 'itemPoCodes',
                                disable: true,
                            },
                            {
                                type: 'input',
                                label: 'Supplier',
                                name: 'itemSuppliers',
                                disable: true,
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
         );
    }
     addTable(){
         var index = (this.regConfig[0] && this.regConfig[0]['name'] === 'usedItemsNormal')? 1 : 0;
         this.regConfig.splice(index, 0,
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
                                type: 'input',
                                label: '#PO',
                                name: 'itemPoCodes',
                                disable: true,
                            },
                            {
                                type: 'input',
                                label: 'Supplier',
                                name: 'itemSuppliers',
                                disable: true,
                            },
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
         );
     }

     ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

}