import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ReceiptDialog } from './receipt-dialog.component';
import { ReceiptService } from './receipt.service';
@Component({
    selector: 'receive-c-alone',
    template: `
    <dynamic-form *ngIf="isRealodReady" [fields]="regConfig" [mainLabel]="'Receive Cashew Without Order'" (submitForm)="submit($event)">
    </dynamic-form>
    `
  })
export class ReceiveCAlone implements OnInit {
    navigationSubscription;
    isRealodReady: boolean = true;

    regConfig: FieldConfig[];

    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
        private localService: ReceiptService, private genral: Genral, public dialog: MatDialog) {
    }


    ngOnInit() {
        this.regConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.findFreePoCodes(),
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
                                options: 3,
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
                        message: 'a received item must have an item, and at least one storage',
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
                    ele['sampleContainerWeights'] = ele['samplesWeight']['sampleContainerWeights']? ele['samplesWeight']['sampleContainerWeights'].filter(amou => amou.amount) : null;
                    ele['avgTestedWeight'] = ele['samplesWeight']['avgTestedWeight'];
                    ele['numberOfSamples'] = ele['samplesWeight']['numberOfSamples'];
                    ele['sampleWeights'] = ele['samplesWeight']['sampleWeights']? ele['samplesWeight']['sampleWeights'].filter(amou => amou.amount) : null;
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

        this.localService.addReceiveCashewNoOrder(value).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(ReceiptDialog, {
                width: '80%',
                data: {receipt: val, fromNew: true, type: 'Cashew'}
            });
            dialogRef.afterClosed().subscribe(data => {
                if(data === 'Edit receive' || data === 'Receive bouns') {
                    this.router.navigate(['../ReceiveCOrder', {poCode: val['poCode']['id'], id: val['id']}], { relativeTo: this._Activatedroute });
                } else {
                    this.router.navigate(['../ReceiveCReports'], { relativeTo: this._Activatedroute });
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


