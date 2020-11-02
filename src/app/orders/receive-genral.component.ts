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
    selector: 'receive-genral',
    template: `
    <div *ngIf="isFirstDataAvailable">
        <dynamic-form [fields]="poConfig" [mainLabel]="'PO# receving'" (submit)="goNext($event)">
        </dynamic-form>
    </div>
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [putData]="putData" [mainLabel]="'Receving general order'" (submit)="submit($event)">
        </dynamic-form>
    </div>
    `
  })
export class ReceiveGenralComponent implements OnInit {
    navigationSubscription;

    OrderdItems = new ReplaySubject<any[]>();
    putData: any = null;
    isDataAvailable: boolean = false;
    isFirstDataAvailable: boolean = false;
    
    fromNew: boolean = true;

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
                            this.setUpOrderItems(po, false);
                            this.putData = val;
                            this.setUpRegConfig(true);
                            this.isDataAvailable = true;
                        });
                        this.fromNew = false;
                    } else {
                        this.setUpOrderItems(po, true);
                        this.setUpRegConfig(false);
                    }
            } else {
                this.poConfig = [
                    {
                        type: 'selectgroup',
                        inputType: 'supplierName',
                        options: this.localService.getPoGeneralCodesOpen(),
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

    goNext($event) {
        this.setUpOrderItems($event['poCode']['id'], true);
        this.isFirstDataAvailable = false;
        this.setUpRegConfig(false);
    }

    setUpOrderItems(idnum: number, setPutData: boolean) {
        this.localService.getOrderPO(idnum).pipe(take(1)).subscribe( val => {
            this.OrderdItems.next(val['orderItems']);
            if(setPutData) {
                this.putData = {poCode: val['poCode']};
                this.isDataAvailable = true;
            }
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
                            {
                                name: 'unitPrice',
                                type: 'value'
                            },
                            {
                                name:'deliveryDate'
                            },
                        ],
                    },
                    {
                        type: 'select',
                        label: 'Item reciving',
                        name: 'item',
                        options: this.genral.getItemsGeneral(),
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
                if(!element['unitPrice']['amount']) {
                    delete element['unitPrice'];
                }
            });
            console.log(value);
            
            this.localService.addEditRecivingGenralOrder(value, this.fromNew).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
                    width: '80%',
                    data: {order: val, fromNew: true, type: 'general receive'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === 'Edit receive') {
                        this.fromNew = false;
                        this.isDataAvailable = false;
                        this.setUpOrderItems(+val['poCode']['code'], false)
                        this.putData = val;
                        this.cdRef.detectChanges();
                        this.isDataAvailable = true;
                    } else if(data === 'Edit order') {
                        this.router.navigate(['../NewGenralOrder',{id: val['poCode']['id']}], { relativeTo: this._Activatedroute });
                    } else {
                        this.router.navigate(['../GenralOrders', {number: 1}], { relativeTo: this._Activatedroute });
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
