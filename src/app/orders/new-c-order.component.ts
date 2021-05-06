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
        <dynamic-form [putData]="putData" mainLabel="Cashew order" [fields]="regConfig" (submitForm)="submit($event)" i18n-mainLabel>
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
                        options: this.genral.getItemsRawCashew(),
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
                                collections: [
                                    {
                                        type: 'input',
                                        label: $localize`Weight`,
                                        name: 'amount',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'select',
                                        label: $localize`Weight unit`,
                                        name: 'measureUnit',
                                        value: 'LBS',
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
                                        options: 3,
                                    },
                                    {
                                        type: 'select',
                                        label: $localize`Currency`,
                                        name: 'currency',
                                        options: ['USD', 'VND'],
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
                        type: 'radiobutton',
                        label: $localize`Defects`,
                        name: 'defects',
                        inputType: 'withInput',
                        options: ['By supplier sample', 'By standard'],
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
                label: $localize`Submit`,
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
                if (data === $localize`Edit order`) {
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


