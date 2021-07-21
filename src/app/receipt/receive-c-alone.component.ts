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
    <dynamic-form *ngIf="isRealodReady" [fields]="regConfig" mainLabel="Receive Cashew Without Order" (submitForm)="submit($event)" i18n-mainLabel>
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
                label: $localize`Receiving date`,
                value: 'timeNow',
                name: 'recordedTime',
                options: 'withTime',
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Receiving date Required`,
                    }
                ]
            },
            {
                type: 'bigexpand',
                label: $localize`Receive product`,
                name: 'receiptItems',
                value: 'required',
                collections: [
                    {
                        type: 'select',
                        label: $localize`Item descrption`,
                        name: 'item',
                        collections: 'somewhere',
                        options: this.genral.getItemsCashew('Raw'),
                    },
                    {
                        type: 'selectMU',
                        label: $localize`Weight unit`,
                        name: 'measureUnit',
                    },
                    {
                        type: 'inputselect',
                        name: 'extraRequested',
                        collections: [
                            {
                                type: 'input',
                                label: $localize`Extra requseted`,
                                name: 'amount',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'select',
                                label: $localize`Weight unit`,
                                name: 'measureUnit',
                                options: ['KG', 'LBS'],
                            },
                        ]
                    },
                    {
                        type: 'popup',
                        label: $localize`Extra received`,
                        name: 'bouns',
                        collections: [
                            {
                                type: 'bigexpand',
                                name: 'extraAdded',
                                options: 'Inline',
                                collections: [
                                    {
                                        type: 'input',
                                        label: $localize`Bag weight`,
                                        name: 'unitAmount',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'input',
                                        label: $localize`Number of bags`,
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
                                    {
                                        name: 'unitAmount',
                                        message: $localize`a received storage must have unit weight and number of bags`,
                                    },
                                    {
                                        name: 'numberUnits',
                                    },
                                ]
                            },
                            {
                                type: 'button',
                                label: $localize`Save`,
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
                        label: $localize`Amounts`,
                        name: 'storageForms',
                        options: 'Inline',
                        collections: [
                            {
                                type: 'input',
                                label: $localize`Bag weight`,
                                name: 'unitAmount',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: $localize`Number of bags`,
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
                                type: 'popup',
                                label: $localize`Samples`,
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
                                        label: $localize`Empty bag weights`,
                                        inputType: 'inline',
                                        name: 'sampleContainerWeights',
                                        options: 3,
                                        collections: 1,
                                    },
                                    {
                                        type: 'arrayordinal',
                                        label: $localize`Samples (+-from unit weight)`,
                                        // inputType: 'numeric',
                                        name: 'sampleWeights',
                                        options: 3,
                                        collections: 30,
                                    },
                                    {
                                        type: 'input',
                                        label: $localize`Avrage weight (full weight)`,
                                        name: 'avgTestedWeight',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'input',
                                        label: $localize`number of samples (if put avrage)`,
                                        name: 'numberOfSamples',
                                        inputType: 'numeric',
                                    },
                                    {
                                        type: 'button',
                                        label: $localize`Submit`,
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
                                message: $localize`a received storage must have weight and number of bags`,
                            },
                            {
                                name: 'numberUnits',
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
                        collections: [
                            {
                                type: 'input',
                                label: $localize`Payable weight`,
                                name: 'amount',
                                inputType: 'numeric',
                                options: 3,
                                validations: [
                                    {
                                        name: 'required',
                                        validator: Validators.required,
                                        message: $localize`Payable weight Required`,
                                    }
                                ]
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
                label: $localize`Submit`,
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
                if(data === $localize`Edit receive` || data === $localize`Receive bouns`) {
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


