import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersService } from './orders.service';
@Component({
    selector: 'receive-procss',
    template: `
    <dynamic-form *ngIf="isRealodReady" [fields]="regConfig" [mainLabel]="'Receive Cashew Without Order'" (submit)="submit($event)">
    </dynamic-form>
    `
  })
export class ReceiveProcssComponent implements OnInit {
    navigationSubscription;
    isRealodReady: boolean = true;

    regConfig: FieldConfig[];

    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
        private localService: OrdersService, private genral: Genral, private location: Location, public dialog: MatDialog) {
    }


    ngOnInit() {
        this.regConfig = [
            {
                type: 'bigoutside',
                name: 'poCode',
                collections: [
                    {
                        type: 'select',
                        label: 'Supplier',
                        name: 'supplier',
                        options: this.genral.getSupplierCashew(),
                        disable: true,
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
                        disable: true,
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
            {
                type: 'date',
                label: 'Receiving date',
                value: new Date(),
                name: 'recordedTime',
                options: 'withTime',
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
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        options: this.genral.getItemsRawCashew(),
                    },
                    
                    {
                        type: 'inputselect',
                        name: 'receivedOrderUnits',
                        collections: [
                            {
                                type: 'input',
                                label: ' Received weight',
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
                                        type: 'array',
                                        label: 'Samples (+-from unit weight)',
                                        inputType: 'numeric',
                                        name: 'aLotSamples',
                                        options: 3,
                                        collections: 30,
                                    },
                                    {
                                        type: 'input',
                                        label: 'Avrage weight (full weight)',
                                        name: 'avgWeight',
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
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
              this.isRealodReady = false;
              this.cdRef.detectChanges();
              this.isRealodReady = true;
            }
        });
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
                
                    if(ele['samplesWeight'].hasOwnProperty('avgWeight')) {
                        ele['avgTestedWeight'] = ele['samplesWeight']['avgWeight'];
                        ele['numberOfSamples'] = ele['samplesWeight']['numberOfSamples'];
                        if(ele['samplesWeight']['aLotSamples'] && ele['samplesWeight']['aLotSamples'].length) {
                            ele['avgTestedWeight'] = (+ele['avgTestedWeight'] + ((ele['samplesWeight']['aLotSamples'].reduce((b, c) => +b + +c['value'] + +ele['unitAmount']['amount'], 0))/ele['samplesWeight']['aLotSamples'].length))/2;
                            ele['numberOfSamples'] = ele['numberOfSamples'] + ele['samplesWeight']['aLotSamples'].length;
                        }
                    } else if(ele['samplesWeight'].hasOwnProperty('aLotSamples')) {
                        ele['avgTestedWeight'] = (ele['samplesWeight']['aLotSamples'].reduce((b, c) => +b + +c['value'] + +ele['unitAmount']['amount'], 0))/ele['samplesWeight']['aLotSamples'].length;
                        ele['numberOfSamples'] = ele['samplesWeight']['aLotSamples'].length;
                    }
                    delete ele['samplesWeight'];
                }
            });
        }); 
        this.localService.addReceiveCashewNoOrder(value).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
                width: '80%',
                data: {order: val, fromNew: true, type: 'Cashew receive'}
            });
            dialogRef.afterClosed().subscribe(data => {
                if(data === 'Edit receive' || data === 'Receive bouns') {
                    this.router.navigate(['../CashewReceived',{poCode: val['poCode']['id'], id: val['id']}], { relativeTo: this._Activatedroute });
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

    ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }
    
  }


