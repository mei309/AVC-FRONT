import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
import { ReplaySubject, Observable } from 'rxjs';
@Component({
    selector: 'receive-cashew',
    template: `
    <div *ngIf="isFirstDataAvailable">
        <dynamic-form [fields]="poConfig" [mainLabel]="'PO# receving'" (submit)="goNext($event)">
        </dynamic-form>
    </div>
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="putData" [mainLabel]="'Receving cashew order'" (submit)="submit($event)">
        </dynamic-form>
    </div>
    <div *ngIf="onlyBouns">
        <just-show [oneColumns]="regConfig" [dataSource]="putData" [mainLabel]="'Receive bonus'" (submit)="submitBouns($event)">
        </just-show>
    </div>
    `
  })
export class ReceiveCashewComponent implements OnInit {
    navigationSubscription;

    OrderdItems = new ReplaySubject<any[]>();
    putData: any = null;
    isDataAvailable: boolean = false;
    isFirstDataAvailable: boolean = false;
    
    fromNew: boolean = true;

    onlyBouns: boolean = false;

    poConfig: FieldConfig[];
    regConfig: FieldConfig[];

    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
        private localService: OrdersService, private genral: Genral, public dialog: MatDialog) {
    }

    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('poCode')) {
                var po: number = +params.get('poCode');
                    if(params.get('id')) {
                        this.localService.getReceive(+params.get('id')).pipe(take(1)).subscribe( val => {
                            if('EDITABLE' !== val['editStatus']) {
                                this.putData = val;
                                this.setUpRegConfigLock();
                            } else{
                                this.setUpOrderItemsEditRecieving(po, val);
                            }
                        });
                        this.fromNew = false;
                    } else {
                        this.setUpOrderItems(po);
                    }
            } else {
                this.poConfig = [
                    {
                        type: 'selectgroup',
                        inputType: 'supplierName',
                        options: this.localService.getPoCashewCodesOpen(),
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
                        type: 'button',
                        label: 'Submit',
                        name: 'submit',
                    }
                ];
                this.isFirstDataAvailable = true;
            }
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
              this.isDataAvailable = false;
              this.isFirstDataAvailable = false;
              this.putData =  null;
              this.cdRef.detectChanges();
              this.isFirstDataAvailable = true;
            }
        });
    }

    // setUpWhenOrder(val, po) {
    //     this.localService.getOrderPO(po).pipe(take(1)).subscribe( val2 => {
    //         var orderdItems = [];
    //         val['receiptItems'].forEach(element => {
    //             var orderitemTemp = val2['orderItems'].find(x => x.item.id == element.item.id);
    //             orderitemTemp['itemDescrption'] = orderitemTemp['item']['value'];
    //             orderitemTemp['finalUnits'] = orderitemTemp['numberUnits']['value'];
    //             element['orderItem'] = orderitemTemp;
    //             var newArray = [];
    //             element['storageForms'].forEach(storage => {
    //                 if(storage['className'] === 'ExtraAdded') {
    //                     newArray.push(storage);
    //                     element['storageForms'].splice(element['storageForms'].indexOf(storage), 1);
    //                 }
    //             });
    //             if(newArray.length) {
    //                 element['bouns'] = {'extraAdded': newArray};
    //             }
    //             orderdItems.push(element);
    //         });
            
    //         val2['orderItems'].forEach(element => {
    //             if(!element.received) {
    //                 element['itemDescrption'] = element['item']['value'];
    //                 element['finalUnits'] = element['numberUnits']['value'];
    //                 orderdItems.push(
    //                     {
    //                         orderItem: element,
    //                         item: element['item'],
    //                     }
    //                 );
    //             }
    //         });
    //         val['receiptItems'] = orderdItems;
    //         this.putData = val;
    //         this.isDataAvailable = false;
    //         this.cdRef.detectChanges();
    //         this.isDataAvailable = true;
    //     });
    // }

    goNext($event) {
        this.setUpOrderItems($event['poCode']['id']);
        this.isFirstDataAvailable = false;
    }

    setUpOrderItems(idnum: number) {
        this.localService.getOrderPO(idnum).pipe(take(1)).subscribe( val => {
            this.OrderdItems.next(val['orderItems']);
            this.putData = {poCode: val['poCode']};
            this.isDataAvailable = true;
        });
        this.setUpRegConfig(false);
    }


    setUpOrderItemsEditRecieving(idnum: number, val) {
        this.localService.getOrderPO(idnum).pipe(take(1)).subscribe( value => {
            this.OrderdItems.next(value['orderItems']);
            var recivingItems = [];
            val['receiptItems'].forEach(element => {
                if(element['orderItem']) {
                    element['orderItem'] = value['orderItems'].find(xx => xx.id === element['orderItem']['id']);
                }
                var newArray = [];
                var newArrayExtra = [];
                element['storageForms'].forEach(storage => {
                    if(storage['className'] === 'ExtraAdded') {
                        newArrayExtra.push(storage);
                    } else {
                        if (storage['avgTestedWeight']) {
                            storage['samplesWeight'] = {sampleContainerWeight: [{value: storage['sampleContainerWeight']}], numberOfSamples: storage['numberOfSamples'], avgTestedWeight: storage['avgTestedWeight'], sampleWeights: storage['sampleWeights']};
                            delete storage['sampleContainerWeight'];
                            delete storage['numberOfSamples'];
                            delete storage['avgTestedWeight'];
                        }
                        newArray.push(storage);
                    }
                });
                if(newArrayExtra.length) {
                    element['bouns'] = {extraAdded: newArrayExtra};
                }
                element['storageForms'] = newArray;
                recivingItems.push(element);
            });
            val['receiptItems'] = recivingItems;
            this.putData = val;
            this.setUpRegConfig(true);
            this.isDataAvailable = true;
        });
    }
    

    setUpRegConfig (disable: boolean) {
        this.regConfig = [
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
                    },
                ]
            },
            {
                type: 'date',
                label: 'Receiving date',
                value: new Date(),
                name: 'recordedTime',
                options: 'withTime',
                // disable: disable,
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Receiving date Required',
                    }
                ]
            },
            {
                type: 'bigexpand',
                label: 'Receive product',
                name: 'receiptItems',
                value: 'required',
                // options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'selectLine',
                        name: 'orderItem',
                        label: 'Orderd item',
                        options: this.getOrderdItems(),
                        collections: [
                            {
                                name: 'item',
                                type: 'value'
                            }, 
                            {
                                name: 'numberUnits',
                                type: 'value'
                            }, 
                            // {
                            //     name: 'unitPrice',
                            //     type: 'value'
                            // },
                            // {
                            //     name:'deliveryDate'
                            // },
                        ],
                    },
                    {
                        type: 'select',
                        label: 'Item reciving',
                        name: 'item',
                        options: this.genral.getItemsRawCashew(),
                    },
                    
                    {
                        type: 'inputselect',
                        name: 'receivedOrderUnits',
                        options: 'orderItem',
                        inputType: 'parentnumberUnits',
                        collections: [
                            {
                                type: 'input',
                                label: 'Received weight',
                                name: 'amount',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'select',
                                label: 'Measure unit',
                                name: 'measureUnit',
                                options: ['LBS', 'KG'],
                            },
                        ]
                    },
                    {
                        type: 'inputselect',
                        name: 'unitPrice',
                        options: 'orderItem',
                        inputType: 'parentunitPrice',
                        collections: [
                            {
                                type: 'input',
                                label: 'Price per unit',
                                name: 'amount',
                                inputType: 'numeric',
                                options: 2,
                            },
                            {
                                type: 'select',
                                label: 'Currency',
                                name: 'currency',
                                options: ['USD', 'VND'],
                            },
                        ]
                    },
                    {
                        type: 'inputselect',
                        name: 'extraRequested',
                        collections: [
                            {
                                type: 'input',
                                label: 'Extra requseted',
                                name: 'amount',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'select',
                                label: 'Weight unit',
                                name: 'measureUnit',
                                options: ['KG', 'LBS'],
                            },
                        ]
                    },
                    {
                        type: 'popup',
                        label: 'Extra received',
                        name: 'bouns',
                        collections: [
                            {
                                type: 'bigexpand',
                                name: 'extraAdded',
                                options: 'Inline',
                                collections: [
                                    {
                                        type: 'inputselect',
                                        name: 'unitAmount',
                                        collections: [
                                            {
                                                type: 'input',
                                                label: 'Bag weight',
                                                name: 'amount',
                                                inputType: 'numeric',
                                                options: 3,
                                            },
                                            {
                                                type: 'select',
                                                label: 'Weight unit',
                                                name: 'measureUnit',
                                                options: ['KG', 'LBS'],
                                            },
                                        ]
                                    },
                                    {
                                        type: 'input',
                                        label: 'Number of bags',
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
                                        message: 'a received storage must have unit weight, measure unit and number of bags',
                                    },
                                    {
                                        name: 'numberUnits',
                                    },
                                ]
                            },
                            {
                                type: 'button',
                                label: 'Save',
                                name: 'submit',
                            }
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'newlinespace'
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
                                        label: 'Bag weight',
                                        name: 'amount',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'select',
                                        label: 'Measure unit',
                                        name: 'measureUnit',
                                        options: ['KG', 'LBS'],
                                    },
                                ]
                            },
                            {
                                type: 'input',
                                label: 'Number of bags',
                                name: 'numberUnits',
                                inputType: 'numeric',
                            },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                options: this.genral.getStorage(),
                            },
                            {
                                type: 'popup',
                                label: 'Samples',
                                name: 'samplesWeight',
                                inputType: true,
                                collections: [
                                    {
                                        type: 'array',
                                        label: 'Empty bag weight',
                                        name: 'sampleContainerWeight',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'arrayordinal',
                                        label: 'Samples (+-from unit weight)',
                                        // inputType: 'numeric',
                                        name: 'sampleWeights',
                                        options: 3,
                                        collections: 30,
                                    },
                                    {
                                        type: 'input',
                                        label: 'Avrage weight (full weight)',
                                        name: 'avgTestedWeight',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'input',
                                        label: 'number of samples (if put avrage)',
                                        name: 'numberOfSamples',
                                        inputType: 'numeric',
                                    },
                                    {
                                        type: 'button',
                                        label: 'Submit',
                                        name: 'submit',
                                    }
                                ]
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
                                message: 'a received storage must have weight, measure unit and number of bags',
                            },
                            {
                                name: 'numberUnits',
                            },
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
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
                label: 'Submit',
                name: 'submit',
            }
        ];
    }

      getOrderdItems (): Observable<any> {
        return this.OrderdItems.asObservable();
      }


      
    submit(value: any) {
            value['receiptItems'].forEach(element => {
                if(element['bouns']) {
                    element['extraAdded'] = element['bouns']['extraAdded'];
                    delete element['bouns'];
                }
                if(!element['extraRequested']['amount']) {
                    delete element['extraRequested'];
                }
                if(!element['receivedOrderUnits']['amount']) {
                    delete element['receivedOrderUnits'];
                }
                if(!element['unitPrice']['amount']) {
                    delete element['unitPrice'];
                }
                element['storageForms'].forEach(ele => {
                    if(ele['samplesWeight']) {
                        ele['sampleContainerWeight'] = (ele['samplesWeight']['sampleContainerWeight'].reduce((b, c) => +b + +c['value'], 0))/ele['samplesWeight']['sampleContainerWeight'].length;
                        ele['avgTestedWeight'] = ele['samplesWeight']['avgTestedWeight'];
                        ele['numberOfSamples'] = ele['samplesWeight']['numberOfSamples'];
                        ele['sampleWeights'] = ele['samplesWeight']['sampleWeights'];
                        
                        // if(ele['samplesWeight'].hasOwnProperty('avgWeight')) {
                        //     ele['avgTestedWeight'] = ele['samplesWeight']['avgWeight'];
                        //     ele['numberOfSamples'] = ele['samplesWeight']['numberOfSamples'];
                        //     if(ele['samplesWeight']['aLotSamples'] && ele['samplesWeight']['aLotSamples'].length) {
                        //         ele['avgTestedWeight'] = (+ele['avgTestedWeight'] + ((ele['samplesWeight']['aLotSamples'].reduce((b, c) => +b + +c['value'] + +ele['unitAmount']['amount'], 0))/ele['samplesWeight']['aLotSamples'].length))/2;
                        //         ele['numberOfSamples'] = ele['numberOfSamples'] + ele['samplesWeight']['aLotSamples'].length;
                        //     }
                        // } else if(ele['samplesWeight'].hasOwnProperty('aLotSamples')) {
                        //     ele['avgTestedWeight'] = (ele['samplesWeight']['aLotSamples'].reduce((b, c) => +b + +c['value'] + +ele['unitAmount']['amount'], 0))/ele['samplesWeight']['aLotSamples'].length;
                        //     ele['numberOfSamples'] = ele['samplesWeight']['aLotSamples'].length;
                        // }
                        delete ele['samplesWeight'];
                    }
                });
            }); 
            console.log(value);
            
            this.localService.addEditRecivingCashewOrder(value, this.fromNew).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
                    width: '80%',
                    data: {order: val, fromNew: true, type: 'Cashew receive'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if(data === 'Edit receive' || data === 'Receive extra') {
                        this.fromNew = false;
                        this.isDataAvailable = false;
                        this.setUpOrderItemsEditRecieving(+val['poCode']['code'], val)
                        this.cdRef.detectChanges();
                    } else if(data === 'Edit order') {
                        this.router.navigate(['../NewCashewOrder',{id: val['poCode']['id']}], { relativeTo: this._Activatedroute });
                    } 
                    // else if(data === 'Sample weights') {
                    //     this.router.navigate(['../SampleWeights',{poCode: JSON.stringify(event['poCode'])}], { relativeTo: this._Activatedroute });
                    // } 
                    else {
                        this.router.navigate(['../CashewOrders', {number: 1}], { relativeTo: this._Activatedroute });
                    }
                });
            });
    }


    submitBouns(value: any) {
            this.localService.receiveExtra(value, this.putData['id']).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
                    width: '80%',
                    data: {order: val, fromNew: true, type: 'Cashew receive'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === 'Receive bouns') {
                        this.putData = val;
                        this.setUpRegConfigLock();
                        this.cdRef.detectChanges();
                    } 
                    // else if(data === 'Sample weights') {
                    //     this.router.navigate(['../SampleWeights',{poCode: JSON.stringify(event['poCode'])}], { relativeTo: this._Activatedroute });
                    //   }
                      else {
                        this.router.navigate(['../CashewOrders', {number: 2}], { relativeTo: this._Activatedroute });
                    }
                });
            });
        }



    setUpRegConfigLock () {
        this.onlyBouns = true;
        this.regConfig = [
            {
                type: 'name2',
                label: '#PO',
                name: 'poCode',
                collections: 'supplierName',
            },
            {
                type: 'dateTime',
                label: 'Date and time',
                name: 'recordedTime',
            },
            {
                type: 'arrayGroup',
                label: 'Received products',
                name: 'receiptItems',
                collections: [
                    // {
                    //     name: 'id',
                    //     titel: 'id',
                    //     type: 'idGroup',
                    // },
                    {
                        type: 'nameId',
                        name: 'item',
                        label: 'Item descrption',
                        group: 'item',
                    },
                    {
                        type: 'kidArray',
                        label: 'Amounts',
                        name: 'storageForms',
                        collections: [
                            {
                                type: 'nameId',
                                label: 'Bag weight',
                                name: 'unitAmount',
                                // collections: 'measureUnit',
                            },
                            {
                                type: 'normal',
                                label: 'Number of bags',
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
                            {
                                type: 'normal',
                                label: 'Empty bag weight',
                                name: 'sampleContainerWeight',
                            },
                            {
                                type: 'normal',
                                label: 'Number of samples',
                                name: 'numberOfSamples',
                            },
                            {
                                type: 'normal',
                                label: 'Avrage weight',
                                name: 'avgTestedWeight',
                            },
                        ],
                    },
                    {
                        type: 'nameId',
                        name: 'extraRequested',
                        label: 'Extra requseted',
                        group: 'item',
                    },
                    {
                        type: 'popup',
                        label: 'Extra receive',
                        name: 'bouns',
                        group: 'item',
                        collections: [
                            {
                                type: 'bigexpand',
                                name: 'extraAdded',
                                label: 'Extra receive',
                                options: 'NoFrame',
                                collections: [
                                    {
                                        type: 'inputselect',
                                        name: 'unitAmount',
                                        collections: [
                                            {
                                                type: 'input',
                                                label: 'Bag weight',
                                                name: 'amount',
                                                inputType: 'numeric',
                                                options: 3,
                                            },
                                            {
                                                type: 'select',
                                                label: 'Weight unit',
                                                name: 'measureUnit',
                                                options: ['KG', 'LBS'],
                                            },
                                        ]
                                    },
                                    {
                                        type: 'input',
                                        label: 'Number of bags',
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
                                        message: 'a received storage must have weight, measure unit and number of bags',
                                    },
                                    {
                                        name: 'numberUnits',
                                    },
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

    ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

}
