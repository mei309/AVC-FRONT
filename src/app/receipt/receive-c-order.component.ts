import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ReplaySubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { ReceiptDialog } from './receipt-dialog.component';
import { ReceiptService } from './receipt.service';
@Component({
    selector: 'receive-c-order',
    template: `
    <fieldset *ngIf="isFirstDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1>PO# receving</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="putData" [mainLabel]="'Receving cashew order'" (submitForm)="submit($event)">
        </dynamic-form>
    </div>
    <div *ngIf="onlyBouns">
        <just-show [oneColumns]="regConfig" [dataSource]="putData" [mainLabel]="'Receive bonus'" (submitForm)="submitBouns($event)">
        </just-show>
    </div>
    `
  })
export class ReceiveCOrder implements OnInit {
    navigationSubscription;

    OrderdItems = new ReplaySubject<any[]>();
    putData: any = null;
    isDataAvailable: boolean = false;
    isFirstDataAvailable: boolean = false;
    
    fromNew: boolean = true;

    onlyBouns: boolean = false;

    poConfig: FieldConfig[];
    regConfig: FieldConfig[];

    form: FormGroup;
    poID: number;

    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
        private localService: ReceiptService, private genral: Genral, public dialog: MatDialog, private fb: FormBuilder) {
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
                                this.setOrderItemsEdit(po, val);
                            }
                        });
                        this.fromNew = false;
                    } else {
                        this.setUpOrderItems(po);
                    }
            } else {
                this.setBeginChoose();
            }
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.isFirstDataAvailable = false;
                this.putData =  null;
                this.poID = null;
                if(this.poConfig) {
                    this.form.get('poCode').setValue(null);
                } else {
                    this.setBeginChoose();
                }
                this.cdRef.detectChanges();
                this.isFirstDataAvailable = true;
            }
        });
    }

    setBeginChoose(){
        this.form = this.fb.group({});
        this.form.addControl('poCode', this.fb.control(''));
        this.form.get('poCode').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id') && this.poID != selectedValue['id']) { 
                this.setUpOrderItems(selectedValue['id']);
                this.isFirstDataAvailable = false;
                this.poID = selectedValue['id'];
            }
        });
        this.isFirstDataAvailable = true;
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
        ];
    }


    setUpOrderItems(idnum: number) {
        this.localService.getOrderPO(idnum).pipe(take(1)).subscribe( val => {
            this.OrderdItems.next(val['orderItems']);
            this.putData = {poCode: val['poCode']};
            this.isDataAvailable = true;
        });
        this.setUpRegConfig();
    }

    setOrderItemsEdit(ponum: number, val) {
        if(val['referencedOrder']) {
            this.localService.getOrder(val['referencedOrder']).pipe(take(1)).subscribe( value => {
                this.OrderdItems.next(value? value['orderItems'] : []);
                this.setUpEditRecieving(value? value['orderItems'] : [], val);
            });
        } else {
            this.localService.getOrderPO(ponum).pipe(take(1)).subscribe( value => {
                this.OrderdItems.next(value? value['orderItems'] : []);
                this.setUpEditRecieving(value? value['orderItems'] : [], val);
            });
        }
    }


    setUpEditRecieving(orderItems: any[], val) { 
            var recivingItems = [];
            val['receiptItems'].forEach(element => {
                if(element['orderItem']) {
                    element['orderItem'] = orderItems.find(xx => xx.id === element['orderItem']['id']);
                }
                var newArray = [];
                var newArrayExtra = [];
                element['storageForms'].forEach(storage => {
                    if(storage['className'] === 'ExtraAdded') {
                        newArrayExtra.push(storage);
                    } else {
                        if(storage['avgTestedWeight'] || storage['sampleWeights'] || storage['sampleContainerWeights']) {
                            storage['samplesWeight'] = {sampleContainerWeights: storage['sampleContainerWeights'], numberOfSamples: storage['numberOfSamples'], avgTestedWeight: storage['avgTestedWeight'], sampleWeights: storage['sampleWeights']};
                            delete storage['sampleContainerWeights'];
                            delete storage['numberOfSamples'];
                            delete storage['avgTestedWeight'];
                            delete storage['sampleWeights'];
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
            this.setUpRegConfig();
            this.isDataAvailable = true;
    }
    

    setUpRegConfig () {
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
                        collections: 'somewhere',
                        options: this.genral.getItemsRawCashew(),
                    },
                    {
                        type: 'selectMU',
                        label: 'Weight unit',
                        name: 'measureUnit',
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
                                        type: 'input',
                                        label: 'Bag weight',
                                        name: 'unitAmount',
                                        inputType: 'numeric',
                                        options: 3,
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
                                        options: this.genral.getWearhouses(),
                                    },
                                    {
                                        type: 'divider',
                                        inputType: 'divide'
                                    },
                                ],
                                validations: [
                                    {
                                        name: 'unitAmount',
                                        message: 'a received storage must have unit weight and number of bags',
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
                                type: 'input',
                                label: 'Bag weight',
                                name: 'unitAmount',
                                inputType: 'numeric',
                                options: 3,
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
                                options: this.genral.getWearhouses(),
                            },
                            {
                                type: 'popup',
                                label: 'Samples',
                                name: 'samplesWeight',
                                inputType: true,
                                collections: [
                                    // {
                                    //     type: 'array',
                                    //     label: 'Empty bag weight',
                                    //     name: 'sampleContainerWeight',
                                    //     inputType: 'numeric',
                                    //     options: 3,
                                    // },
                                    {
                                        type: 'arrayordinal',
                                        label: 'Empty bag weights',
                                        inputType: 'inline',
                                        name: 'sampleContainerWeights',
                                        options: 3,
                                        collections: 1,
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
                                message: 'a received storage must have weight and number of bags',
                            },
                            {
                                name: 'numberUnits',
                            },
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'titel',
                        label: 'Invoice amounts'
                    },
                    {
                        type: 'inputselect',
                        name: 'receivedOrderUnits',
                        options: 'orderItem',
                        inputType: 'parentnumberUnits',
                        collections: [
                            {
                                type: 'input',
                                label: 'Payable weight',
                                name: 'amount',
                                inputType: 'numeric',
                                options: 3,
                                validations: [
                                    {
                                        name: 'required',
                                        validator: Validators.required,
                                        message: 'Payable weight Required',
                                    }
                                ]
                            },
                            {
                                type: 'select',
                                label: 'Measure unit',
                                name: 'measureUnit',
                                value: 'LBS',
                                options: this.genral.getMeasureUnit(),
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
                        type: 'divider',
                        inputType: 'divide'
                    },
                ],
                validations: [
                    {
                        name: 'item',
                        message: 'a received item must have an item, measure unit and at least one storage',
                    },
                    {
                        name: 'measureUnit',
                    },
                    {
                        name: 'storageForms',
                        validator: [
                            {
                                name: 'unitAmount',
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
                        ele['sampleContainerWeights'] = ele['samplesWeight']['sampleContainerWeights']? ele['samplesWeight']['sampleContainerWeights'].filter(amou => amou.amount) : null;
                        ele['avgTestedWeight'] = ele['samplesWeight']['avgTestedWeight'];
                        ele['numberOfSamples'] = ele['samplesWeight']['numberOfSamples'];
                        ele['sampleWeights'] = ele['samplesWeight']['sampleWeights']? ele['samplesWeight']['sampleWeights'].filter(amou => amou.amount) : null;
                        delete ele['samplesWeight'];
                    }
                });
            }); 
            
            this.localService.addEditRecivingCashewOrder(value, this.fromNew).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(ReceiptDialog, {
                    width: '80%',
                    data: {receipt: cloneDeep(val), fromNew: true, type: 'Cashew'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if(data === 'Edit receive' || data === 'Receive extra') {
                        this.fromNew = false;
                        this.isDataAvailable = false;
                        this.OrderdItems = new ReplaySubject<any[]>();
                        this.setOrderItemsEdit(+val['poCode']['id'], val);
                        this.cdRef.detectChanges();
                    } 
                    // else if(data === 'Edit order') {
                    //     this.router.navigate(['Main/ordready/NewCashewOrder',{id: val['poCode']['id']}]);
                    // } 
                    else {
                        this.router.navigate(['../ReceiveCReports'], { relativeTo: this._Activatedroute });
                    }
                });
            });
    }


    submitBouns(value: any) {
            this.localService.receiveExtra(value, this.putData['id']).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(ReceiptDialog, {
                    width: '80%',
                    data: {receipt: cloneDeep(val), fromNew: true, type: 'Cashew'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === 'Receive bouns') {
                        this.putData = val;
                        this.setUpRegConfigLock();
                        this.cdRef.detectChanges();
                    } else {
                        this.router.navigate(['../ReceiveCReports', {number: 1}], { relativeTo: this._Activatedroute });
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
                                type: 'normal',
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
                                        type: 'input',
                                        label: 'Bag weight',
                                        name: 'unitAmount',
                                        inputType: 'numeric',
                                        options: 3,
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
                                        options: this.genral.getWearhouses(),
                                    },
                                    {
                                        type: 'divider',
                                        inputType: 'divide'
                                    },
                                ],
                                validations: [
                                    {
                                        name: 'unitAmount',
                                        message: 'a received storage must have weight and number of bags',
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
