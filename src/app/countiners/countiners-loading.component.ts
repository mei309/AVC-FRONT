import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isEqual, map } from 'lodash-es';
import { distinctUntilChanged, take, throttleTime } from 'rxjs/operators';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { diff } from '../libraries/diffArrayObjects.interface';
import { CounteinersDetailsDialogComponent } from './counteiners-details.component';
import { CountinersService } from './countiners.service';
import { cloneDeep } from 'lodash-es';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
@Component({
    selector: 'countiners-loading',
    template: `
    <h1 style="text-align:center" i18n>Loading</h1>
    <ng-container *ngIf="beginPage" mat-stretch-tabs>
            <dynamic-form #first [fields]="beginConfig" [putData]="putFirstData" mainLabel="Loading information" i18n-mainLabel>
            </dynamic-form>
            <ng-container dynamicField [field]="poConfig" [group]="form">
            </ng-container>
            <div *ngIf="isFormAvailable">
                <dynamic-form #second [fields]="regConfig" [putData]="dataSource" mainLabel="Material to load" i18n-mainLabel>
                </dynamic-form>
            </div>
    </ng-container>
    <div class="margin-top" style="text-align:right" *ngIf="isFormAvailable">
        <button type="button" (click)="oneClickChanged.next($event)" style="min-width:150px; margin-right: 45px" mat-raised-button color="primary" i18n>Submit</button>
        <button type="button" style="min-width:150px" mat-raised-button color="primary" (click)="onResetBoth()" i18n>Reset</button>
    </div>
    `
  })
export class CountinersLoadingComponent {
    navigationSubscription;

    @ViewChild('first', {static: false}) formFirst: DynamicFormComponent;
    @ViewChild('second', {static: false}) formSecond: DynamicFormComponent;

    allShipmentCodes = new ReplaySubject<any[]>();
    allContainers = new ReplaySubject<any[]>();

    form: FormGroup;

    choosedPos = [];
    poConfig: FieldConfig;
    regConfig: FieldConfig[] = [];
    beginConfig: FieldConfig[];

    oneClickChanged: Subject<any> = new Subject<any>();
    private oneClickOnlySubscription: Subscription;


    dataSource = {usedItemsTable: [], usedItemsNormal: [], materialUsed: []};
    isNew: boolean = true;
    isFormAvailable: boolean = false;
    beginPage: boolean = true;
    putFirstData;

    removeIds = [];
    // removeIdsTable = [];

    onSubmitBoth() {
            var firstData = this.formFirst.onSubmitOutside();
            var secondData = this.formSecond? this.formSecond.onSubmitOutside() : false;
            if(secondData && firstData) {
                var arr = [];
                if(secondData['usedItemsNormal']) {
                    secondData['usedItemsNormal'].forEach(element => {
                        element['storageMoves'] = element['storageMoves'].filter(amou => amou.numberUsedUnits);
                        element['groupName'] = 'normalPosLoading';
                    });
                    secondData['usedItemsNormal'] = secondData['usedItemsNormal'].filter(amou => amou.storageMoves.length);
                    arr = arr.concat(secondData['usedItemsNormal']);
                    delete secondData['usedItemsNormal'];
                }
                if(secondData['usedItemsTable']) {
                    secondData['usedItemsTable'].forEach(element => {
                        element['storageMove']['amounts'] = element['storageMove']['amounts'].filter(amou => amou.take);
                        element['storageMove']['amounts'].forEach(ele => {
                            if(!ele['storageId']) {
                                ele['storageId'] = ele['id'];
                                delete ele['id'];
                                ele['storageVersion'] = ele['version'];
                                delete ele['version'];
                            }
                        });
                        element['groupName'] = 'tablePosLoading';
                    });
                    secondData['usedItemsTable'] = secondData['usedItemsTable'].filter(amou => amou.storageMove.amounts.length);
                    arr = arr.concat(secondData['usedItemsTable']);
                    delete secondData['usedItemsTable'];
                }
                if(secondData['materialUsed']) {
                    secondData['materialUsed'].forEach(element => {
                        element['storageMoves'] = element['storageMoves'].filter(amou => amou.numberUsedUnits);
                        element['groupName'] = 'meterialUsedPos';
                    });
                    secondData['materialUsed'] = secondData['materialUsed'].filter(amou => amou.storageMoves.length);
                    arr = arr.concat(secondData['materialUsed']);
                    delete secondData['materialUsed'];
                }
                firstData['storageMovesGroups'] = arr;
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

                this.genral.getProductionLine('Loading').pipe(take(1)).subscribe( val1 => {
                    firstData['productionLine'] = val1[0];
                    this.localService.addEditLoading(firstData, this.isNew).pipe(take(1)).subscribe( val => {
                        const dialogRef = this.dialog.open(CounteinersDetailsDialogComponent, {
                            width: '80%',
                            data: {loading: cloneDeep(val), fromNew: true, type: 'Loading'}
                        });
                        dialogRef.afterClosed().subscribe(result => {
                            switch (result) {
                                case $localize`Edit`:
                                    this.beginPage = false;
                                    this.choosedPos = [];
                                    this.dataSource = {usedItemsTable: [], usedItemsNormal: [], materialUsed: []};
                                    this.putFirstData = null;
                                    this.removeIds = [];
                                    // this.removeIdsTable = [];
                                    this.cdRef.detectChanges();
                                    this.localService.getLoading(val['id']).pipe(take(1)).subscribe( val1 => {
                                        this.fillEdit(val1);
                                    });
                                    break;
                                case $localize`Security Doc`:
                                    this.router.navigate(['../SecurityExportDoc',{id: val['id'], docType: 'Security'}], { relativeTo: this._Activatedroute });
                                    break;
                                case $localize`Export Doc`:
                                    this.router.navigate(['../SecurityExportDoc',{id: val['id'], docType: 'Export'}], { relativeTo: this._Activatedroute });
                                    break;

                                default:
                                    this.router.navigate(['../CountinerReports', {number: 1}], { relativeTo: this._Activatedroute });
                                    break;
                            }
                        });
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
            // if(!this.dataSource['loadedItems']){
            //     this.dataSource['loadedItems'] = [];
            // }
        }
    }


    constructor(private fb: FormBuilder, private _Activatedroute:ActivatedRoute, private router: Router, private cdRef:ChangeDetectorRef,
        private localService: CountinersService, private genral: Genral, public dialog: MatDialog) {
    }


    addToForm(val) {
        var arrNormal = [];
        var arrTable = [];
        // var arrDeclared = [];
        var arrUsedItems = [];
        val?.forEach(element => {
            if(element['storage']) {
                // if((element['storage']['amounts'] = element['storage']['amounts'].filter(amou => !this.removeIdsTable.includes(amou.id))).length) {
                    element['storage']['item'] = element['item'];
                    element['storage']['itemPoCodes'] = element['poCodes'];
                    element['storage']['itemSuppliers'] = element['suppliers'];
                    element['storage']['measureUnit'] = element['measureUnit'];
                    element['storage']['itemProcessDate'] = element['itemProcessDate'];
                    element['storage']['amounts'].forEach(ele => {
                      ele['amount'] = ele['numberAvailableUnits'];
                      // this.removeIdsTable.push(ele['id']);
                    });
                    arrTable.push({storageMove: element['storage']});
                // }
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => {
                    if(!this.removeIds.includes(ele['id'])) {
                        arrUsedItems.push({itemPoCodes: element['poCodes'], itemSuppliers: element['suppliers'], item: element['item'], itemProcessDate: element['itemProcessDate'], measureUnit: element['measureUnit'], storage: ele});
                        delete ele['numberUsedUnits'];
                        this.removeIds.push(ele['id']);
                    }
                });
            }
            // arrDeclared.push({poCode: element['poCode'], item: element['item']});
        });
        if(arrUsedItems.length) {
            arrNormal.push({storageMoves: arrUsedItems});
        }
        if(arrTable.length) {
            this.dataSource['usedItemsTable'] = this.dataSource['usedItemsTable'].concat(arrTable);
        }
        if(arrNormal.length) {
            this.dataSource['usedItemsNormal'] = this.dataSource['usedItemsNormal'].concat(arrNormal);
        }
        // if(arrDeclared.length) {
        //     this.dataSource['loadedItems'] = this.dataSource['loadedItems'].concat(arrDeclared);
        // }
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

        this.form.get('poCodes').valueChanges.pipe(distinctUntilChanged()).subscribe(selectedValue => {
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
                label: $localize`Loading PO#s`,
                options: 'aloneInline',
                collections: [
                    {
                        type: 'selectgroup',
                        inputType: 'supplierName',
                        options: this.localService.getAllPosRoastPacked(),
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
        var arrMaterial = [];
        val['storageMovesGroups']?.forEach(element => {
            if(element['groupName'].startsWith('table')) {
                element['storageMove']['amounts'].forEach(ele => {
                    ele['take'] = true;
                    // this.removeIdsTable.push(ele['id']);
                });
                arrTable.push(element);
            } else if(element['groupName'].startsWith('normal')) {
                element['storageMoves'].forEach(el => {
                    el['storage']['numberAvailableUnits'] = el['numberAvailableUnits'];
                    this.removeIds.push(el['storage']['id']);
                });
                arrNormal.push(element);
            } else if(element['groupName'].startsWith('meterial')) {
                element['storageMoves'].forEach(el => {
                    el['storage']['numberAvailableUnits'] = el['numberAvailableUnits'];
                });
                arrMaterial.push(element);
            }
        });
        delete val['storageMovesGroups'];
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
        if(arrMaterial.length) {
            this.dataSource['materialUsed'] = arrMaterial;
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
                    this.localService.findFreeShipmentCodes().pipe(take(1)).subscribe(val1 => {
                        this.allShipmentCodes.next((<any[]>val1).concat(val['shipmentCode']));
                    });
                    this.localService.findFreeArrivals().pipe(take(1)).subscribe(val2 => {
                        this.allContainers.next((<any[]>val2).concat(val['arrival']));
                    });
                });
            } else {
                this.localService.findFreeShipmentCodes().pipe(take(1)).subscribe(val1 => {
                    this.allShipmentCodes.next(<any[]>val1);
                });
                this.localService.findFreeArrivals().pipe(take(1)).subscribe(val2 => {
                    this.allContainers.next(<any[]>val2);
                });
            }
        });
        this.isFormAvailable = true;
        this.beginConfig = [
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
                label: $localize`Shipment code`,
                name: 'shipmentCode',
                options: this.allShipmentCodes,
                // disable: true,
                collections: 'somewhere',
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Shipment code Required`,
                    }
                ]
            },
            {
                type: 'select',
                label: $localize`Container`,
                name: 'arrival',
                options: this.allContainers,
                // disable: true,
                collections: 'somewhere',
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Container Required`,
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
        this.oneClickOnlySubscription = this.oneClickChanged
          .pipe(
            throttleTime(1100),
            distinctUntilChanged()
          )
          .subscribe(event => {
            event.preventDefault();
            event.stopPropagation();
            this.onSubmitBoth();
          });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.beginPage = false;
                this.isFormAvailable = false;
                this.choosedPos = [];
                this.dataSource = {usedItemsTable: [], usedItemsNormal: [], materialUsed: []};
                this.removeIds = [];
                // this.removeIdsTable = [];
                this.putFirstData = null;
                this.preperChoosingPO();
                this.cdRef.detectChanges();
                this.beginPage = true;
                this.localService.findFreeShipmentCodes().pipe(take(1)).subscribe(val => {
                    this.allShipmentCodes.next(<any[]>val);
                });
                this.localService.findFreeArrivals().pipe(take(1)).subscribe(val => {
                    this.allContainers.next(<any[]>val);
                });
            }
        });
    }

    addLoaded(){
        this.regConfig = [
          {
              type: 'bigexpand',
              name: 'materialUsed',
              label: $localize`Material used`,
              options: 'aloneNoAdd',
              collections: [
                  {
                      type: 'materialUsage',
                      // label: 'Transfer from',
                      name: 'storageMoves',
                      collections: [
                          {
                              type: 'selectgroup',
                              inputType: 'supplierName',
                              // options: this.localService.getAllPosRoastPacked(),
                              disable: true,
                              collections: [
                                  {
                                      type: 'select',
                                      label: $localize`Supplier`,
                                  },
                                  {
                                      type: 'select',
                                      label: $localize`#PO`,
                                      name: 'itemPo',
                                      collections: 'somewhere',
                                  },
                              ]
                          },
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
        ];
     }

     addNormal(){
         this.regConfig.splice(0, 0,
            {
                type: 'bigexpand',
                name: 'usedItemsNormal',
                label: $localize`Transfer from`,
                options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'tableWithInput',
                        // label: 'Transfer from',
                        name: 'storageMoves',
                        options: 'numberUsedUnits',
                        collections: [
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
         );
    }
     addTable(){
         var index = (this.regConfig[0] && this.regConfig[0]['name'] === 'usedItemsNormal')? 1 : 0;
         this.regConfig.splice(index, 0,
             {
                type: 'bigexpand',
                name: 'usedItemsTable',
                label: $localize`Transfer from`,
                options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'bignotexpand',
                        name: 'storageMove',
                        // label: 'Transfer from',
                        options: 'aloneNoAdd',
                        collections: [
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
         );
     }

     ngOnDestroy() {
        if (this.navigationSubscription) {
           this.navigationSubscription.unsubscribe();
        }
        this.allShipmentCodes.unsubscribe();
        this.allContainers.unsubscribe();
        this.oneClickOnlySubscription.unsubscribe();
      }
}
