import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ReplaySubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { ReceiptService } from './receipt.service';
import { ReceiptDialog } from './receipt-dialog.component';
@Component({
    selector: 'receive-g-order',
    template: `
    <fieldset *ngIf="isFirstDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1 i18n>PO# receving</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="putData" mainLabel="Receving general order" (submitForm)="submit($event)" i18n-mainLabel>
        </dynamic-form>
    </div>
    `
  })
export class ReceiveGOrder implements OnInit {
    navigationSubscription;

    OrderdItems = new ReplaySubject<any[]>();
    putData: any = null;
    isDataAvailable: boolean = false;
    isFirstDataAvailable: boolean = false;

    fromNew: boolean = true;

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
                            this.setOrderItemsEdit(po, val);
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
        this.form.get('poCode').valueChanges.pipe(distinctUntilChanged()).subscribe(selectedValue => {
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
                options: this.localService.getPoGeneralCodesOpen(),
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
            val['receiptItems'].forEach(element => {
                if(element['orderItem']) {
                    element['orderItem'] = orderItems.find(xx => xx.id === element['orderItem']['id']);
                }
            });
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
                        label: $localize`Supplier`,
                    },
                    {
                        type: 'select',
                        label: $localize`#PO`,
                        name: 'poCode',
                    },
                ]
            },
            {
                type: 'date',
                label: $localize`Receiving date`,
                value: 'timeNow',
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
                label: $localize`Receive product`,
                name: 'receiptItems',
                value: 'required',
                // options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'selectLine',
                        name: 'orderItem',
                        label: $localize`Orderd item`,
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
                        ],
                    },
                    {
                        type: 'select',
                        label: $localize`Item reciving`,
                        name: 'item',
                        collections: 'somewhere',
                        inputType: 'orderItem',
                        options: this.genral.getItemsGeneral(),
                    },
                    {
                        type: 'selectMU',
                        label: $localize`Weight unit`,
                        name: 'measureUnit',
                    },
                    {
                        type: 'divider',
                        inputType: 'newlinespace'
                    },
                    {
                        type: 'bigexpand',
                        label: $localize`Amounts`,
                        name: 'storageForms',
                        options: 'Inline',
                        collections: [
                            {
                                type: 'input',
                                label: $localize`Unit amount`,
                                name: 'unitAmount',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: $localize`Number of units`,
                                name: 'numberUnits',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'select',
                                label: $localize`Warehouse location`,
                                name: 'warehouseLocation',
                                collections: 'somewhere',
                                options: this.genral.getWearhouses(),
                            },
                            {
                                type: 'divider',
                                inputType: 'divide'
                            },
                        ],
                        validations: [
                            // {
                            //     name: 'unitAmount',

                            // },
                            {
                                name: 'numberUnits',
                                message: $localize`a received storage must have number of bags`,
                            },
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'titel',
                        label: $localize`Invoice amounts`
                    },
                    {
                        type: 'inputselect',
                        name: 'receivedOrderUnits',
                        options: 'orderItem',
                        inputType: 'parentnumberUnits',
                        collections: [
                            {
                                type: 'input',
                                label: $localize`Payable amount`,
                                name: 'amount',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'select',
                                label: $localize`Measure unit`,
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
                                label: $localize`Price per unit`,
                                name: 'amount',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'select',
                                label: $localize`Currency`,
                                name: 'currency',
                                options: ['VND', 'USD'],
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
                        message: $localize`a received item must have an item, and at least one storage`,
                    },
                    {
                        name: 'storageForms',
                        validator: [
                            // {
                            //     name: 'unitAmount',
                            // },
                            {
                                name: 'numberUnits',
                            },
                        ],
                    }
                ]
            },
            {
                type: 'button',
                label: $localize`Submit`,
                name: 'submit',
            }
        ];
    }

    getOrderdItems (): Observable<any> {
        return this.OrderdItems.asObservable();
    }

    submit(value: any) {
            value['receiptItems'].forEach(element => {
                if(!element['unitPrice']['amount']) {
                    delete element['unitPrice'];
                }
                if(!element['receivedOrderUnits']['amount']) {
                    delete element['receivedOrderUnits'];
                }
            });

            this.localService.addEditRecivingGenralOrder(value, this.fromNew).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(ReceiptDialog, {
                    width: '80%',
                    data: {receipt: cloneDeep(val), fromNew: true, type: 'General'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === $localize`Edit receive`) {
                        this.fromNew = false;
                        this.isDataAvailable = false;
                        this.setOrderItemsEdit(+val['poCode']['id'], val);
                        this.cdRef.detectChanges();
                    }
                    // else if(data === 'Edit order') {
                    //     this.router.navigate(['Main/ordready/NewGenralOrder',{id: val['poCode']['id']}]);
                    // }
                    else {
                        this.router.navigate(['../ReceiveGReports'], { relativeTo: this._Activatedroute });
                    }
                });
            });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
           this.navigationSubscription.unsubscribe();
        }
      }

}
