import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
import { cloneDeep } from 'lodash-es';
@Component({
    selector: 'new-cashew-order',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [putData]="putData" [mainLabel]="'Cashew order'" [fields]="regConfig" (submitForm)="submit($event)">
        </dynamic-form>
    </div>
    `
  })
export class NewCashewOrder implements OnInit {
    navigationSubscription;
    
    putData: any = null;
    isDataAvailable = false;
    regConfig: FieldConfig[];


    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
        private localService: OrdersService, private genral: Genral, private dialog: MatDialog) {
       }


     ngOnInit() {
       this.regConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.findFreePoCodes(),
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
                        collections: 'somewhere',
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: 'PO code Required',
                            }
                        ]
                    },
                ]
            },
            {
                type: 'date',
                label: 'Contract date',
                value: new Date(),
                name: 'recordedTime',
                options: 'withTime',
                // disable: true,
            },
            {
                type: 'input',
                label: 'Person in charge',
                name: 'personInCharge',
                inputType: 'text',
            },
            {
                type: 'bigexpand',
                label: 'Orderd products',
                name: 'orderItems',
                value: 'required',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        options: this.genral.getItemsRawCashew(),
                        disable: true,
                    },
                    {
                        type: 'calculatefew',
                        label: 'price',
                        inputType: '*',
                        collections: [
                            {
                                type: 'inputselect',
                                name: 'numberUnits',
                                collections: [
                                    {
                                        type: 'input',
                                        label: 'Weight',
                                        name: 'amount',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'select',
                                        label: 'Weight unit',
                                        name: 'measureUnit',
                                        options: this.genral.getMeasureUnit(),
                                    },
                                ]
                            },
                            {
                                type: 'inputselect',
                                name: 'unitPrice',
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
                        ]
                    },
                    {
                        type: 'date',
                        label: 'Delivery date',
                        name: 'deliveryDate',
                        // value: new Date()
                    },
                    {
                        type: 'radiobutton',
                        label: 'Defects',
                        name: 'defects',
                        inputType: 'withInput',
                        options: ['By supplier sample', 'By standard'],
                    },
                    {
                        type: 'textarry',
                        label: 'Remarks',
                        inputType: 'text',
                        name: 'remarks',
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ],
                validations: [
                    {
                        name: 'numberUnits',
                        message: 'a orderd item must have weight and price and delivery date',
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
                        name: 'deliveryDate',
                    }, 
                ]
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
       ];
       this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                var id = +params.get('id');
                this.localService.getOrderPO(id).pipe(take(1)).subscribe( val => {
                    this.putData = val;
                    this.isDataAvailable = true;
                });
            } else {
                this.isDataAvailable = true;
            }
        });
       this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.putData = null;
                this.cdRef.detectChanges();
                this.isDataAvailable = true;
            }
        });
   }


    submit(value: any) { 
        value['orderItems'].forEach(element => {
            if(!element['unitPrice']['amount']) {
                delete element['unitPrice'];
            }
        });
        const fromNew: boolean = this.putData === null || this.putData === undefined;
        this.localService.addEditCashewOrder(value, fromNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
                width: '80%',
                data: {order: cloneDeep(val), fromNew: true, type: 'Cashew'}
            });
            dialogRef.afterClosed().subscribe(data => {
                if (data === 'Edit order') {
                    this.putData = val;
                    this.isDataAvailable = false;
                    this.cdRef.detectChanges();
                    this.isDataAvailable = true;
                } else if(data === 'Receive') {
                    this.router.navigate(['Main/receiptready/ReceiveCOrder',{poCode: val['poCode']['id']}]);
                } else {
                    this.router.navigate(['../OrdersCReports'], { relativeTo: this._Activatedroute });
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


