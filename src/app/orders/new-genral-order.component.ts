import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
@Component({
    selector: 'new-genral-order',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [putData]="putData" [mainLabel]="'General order'" [fields]="regConfig" (submit)="submit($event)">
        </dynamic-form>
    </div>
    `
  })
export class NewGenralOrderComponent implements OnInit {
    
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
                   this.isDataAvailable = true;
               });
               this.setRegEdit();
           } else {
               this.isDataAvailable = true;
               this.regConfig = [
                   {
                       type: 'bigoutside',
                       name: 'poCode',
                       collections: [
                           {
                               type: 'select',
                               label: 'Supplier',
                               name: 'supplier',
                               options: this.localService.getSupplierGeneral(),
                               validations: [
                                   {
                                       name: 'required',
                                       validator: Validators.required,
                                       message: 'Supplier Required',
                                   }
                               ]
                           },
                           {
                               type: 'select',
                               label: 'PO initial',
                               name: 'contractType',
                               options: this.genral.getContractType(),
                               validations: [
                                   {
                                       name: 'required',
                                       validator: Validators.required,
                                       message: 'PO initial Required',
                                   }
                               ]
                           },
                           {
                               type: 'input',
                               label: '#PO',
                               inputType: 'number',
                               name: 'code',
                               disable: true,
                           },
                       ]
                   },
               ];
           }
       });
       this.addRestReg();
   }

   setRegEdit() {
        this.regConfig = [
            {
                type: 'bigoutside',
                name: 'poCode',
                collections: [
                    {
                        type: 'input',
                        label: 'Supplier',
                        name: 'supplierName',
                        disable: true,
                    },
                    {
                        type: 'input',
                        label: 'PO initial',
                        name: 'contractTypeCode',
                        disable: true,
                    },
                    {
                        type: 'input',
                        label: '#PO',
                        inputType: 'number',
                        name: 'code',
                        disable: true,
                    },
                ]
            },
        ];
   }

   addRestReg() {
    this.regConfig.push(
        {
            type: 'date',
            label: 'Contract date',
            value: new Date(),
            name: 'recordedTime',
            options: 'withTime',
            disable: true,
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
                    options: this.genral.getItemsGeneral(),
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
                            options: 'item',
                            inputType: 'measureUnit',
                            collections: [
                                {
                                    type: 'input',
                                    label: 'Amount',
                                    name: 'amount',
                                    inputType: 'numeric',
                                    options: 3,
                                },
                                {
                                    type: 'select',
                                    label: 'Weight unit',
                                    name: 'measureUnit',
                                    options: ['LBS', 'KG'],
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
            label: 'Submit',
            name: 'submit',
        }
    );
   }

    submit(value: any) { 
        const fromNew: boolean = this.putData === null || this.putData === undefined;
        this.localService.addEditGenralOrder(value, fromNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
                width: '80%',
                data: {order: val, fromNew: true, type: 'General order'}
            });
            dialogRef.afterClosed().subscribe(data => {
                if (data === 'Edit order') {
                    this.putData = val;
                    this.isDataAvailable = false;
                    this.setRegEdit();
                    this.addRestReg();
                    this.cdRef.detectChanges();
                    this.isDataAvailable = true;
                } else if(data === 'Receive') {
                    this.router.navigate(['../GenralReceived',{poCode: val['poCode']['id']}], { relativeTo: this._Activatedroute });
                } 
                // else if(data === 'Sample weights') {
                //     this.router.navigate(['../SampleWeights',{poCode: JSON.stringify(event['poCode'])}], { relativeTo: this._Activatedroute });
                // }
                else {
                    this.router.navigate(['../GenralOrders'], { relativeTo: this._Activatedroute });
                }
            });
        });
    }

  }


