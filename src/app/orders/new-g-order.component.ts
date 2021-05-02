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
    selector: 'new-genral-order',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [putData]="putData" mainLabel="General order" [fields]="regConfig" (submitForm)="submit($event)" i18n-mainLabel>
        </dynamic-form>
    </div>
    `
  })
export class NewGenralOrder implements OnInit {
    navigationSubscription;

    putData: any = null;
    isDataAvailable = false;
    regConfig: FieldConfig[];


    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
        private localService: OrdersService, private genral: Genral, private dialog: MatDialog) {
       }


     ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                var id = +params.get('id');
                this.localService.getOrderPO(id).pipe(take(1)).subscribe( val => {
                    this.putData = val;
                    this.setRegConfig(false);
                    this.isDataAvailable = true;
                });
            } else {
                this.setRegConfig(true);
                 this.isDataAvailable = true;
            }
        });
       this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.putData = null;
                this.setRegConfig(true);
                this.cdRef.detectChanges();
                this.isDataAvailable = true;
            }
        });
   }

   setRegConfig(isNew: boolean) {
    this.regConfig = [
        ...isNew? [
            {
                type: 'bigoutside',
                name: 'generalPoCode',
                collections: [
                    {
                        type: 'select',
                        label: $localize`Supplier`,
                        name: 'supplier',
                        options: this.localService.getGeneralSuppliers(),
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: $localize`Supplier Required`,
                            }
                        ]
                    },
                    {
                        type: 'select',
                        label: $localize`PO initial`,
                        name: 'contractType',
                        options: this.localService.getGeneralContractTypes(),
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: $localize`PO initial Required`,
                            }
                        ]
                    },
                    {
                        type: 'input',
                        label: $localize`Code`,
                        inputType: 'number',
                        name: 'code',
                        disable: true,
                    },
                ]
            },
        ]: [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.findFreePoCodes(),
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
                        collections: 'somewhere',
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: $localize`PO code Required`,
                            }
                        ]
                    },
                ]
            },
        ],
        {
            type: 'date',
            label: $localize`Contract date`,
            value: new Date(),
            name: 'recordedTime',
            options: 'withTime',
            // disable: true,
        },
        {
            type: 'input',
            label: $localize`Person in charge`,
            name: 'personInCharge',
            inputType: 'text',
        },
        {
            type: 'bigexpand',
            label: $localize`Orderd products`,
            name: 'orderItems',
            value: 'required',
            collections: [
                {
                    type: 'select',
                    label: $localize`Item descrption`,
                    name: 'item',
                    collections: 'somewhere',
                    options: this.genral.getItemsGeneral(),
                    // disable: true,
                },
                {
                    type: 'calculatefew',
                    label: $localize`price`,
                    inputType: '*',
                    collections: [
                        {
                            type: 'inputselect',
                            name: 'numberUnits',
                            options: 'item',
                            inputType: 'second',
                            collections: [
                                {
                                    type: 'input',
                                    label: $localize`Amount`,
                                    name: 'amount',
                                    inputType: 'numeric',
                                    options: 3,
                                },
                                {
                                    type: 'select',
                                    label: $localize`Weight unit`,
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
                                    label: $localize`Price per unit`,
                                    name: 'amount',
                                    inputType: 'numeric',
                                    options: 2,
                                },
                                {
                                    type: 'select',
                                    label: $localize`Currency`,
                                    name: 'currency',
                                    options: ['VND', 'USD'],
                                },
                            ]
                        },
                    ]
                },
                {
                    type: 'date',
                    label: $localize`Delivery date`,
                    name: 'deliveryDate',
                    // value: new Date()
                },
                {
                    type: 'textarry',
                    label: $localize`Remarks`,
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
                    message: $localize`a orderd item must have weight and price and delivery date`,
                },
                {
                    name: 'unitPrice',
                },
                {
                    name: 'deliveryDate',
                }, 
            ]
        },
        {
            type: 'button',
            label: $localize`Submit`,
            name: 'submit',
        }
    ];
   }
   

    submit(value: any) { 
        value['orderItems'].forEach(element => {
            if(!element['unitPrice']['amount']) {
                delete element['unitPrice'];
            }
        });
        const fromNew: boolean = this.putData === null || this.putData === undefined;
        this.localService.addEditGenralOrder(value, fromNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
                width: '80%',
                data: {order: cloneDeep(val), fromNew: true, type: 'General'}
            });
            dialogRef.afterClosed().subscribe(data => {
                if (data === $localize`Edit order`) {
                    this.putData = val;
                    this.isDataAvailable = false;
                    this.setRegConfig(false);
                    this.cdRef.detectChanges();
                    this.isDataAvailable = true;
                } else if(data === $localize`Receive`) {
                    this.router.navigate(['Main/receiptready/ReceiveGOrder',{poCode: val['poCode']['id']}]);
                } else {
                    this.router.navigate(['../OrdersGReports'], { relativeTo: this._Activatedroute });
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


