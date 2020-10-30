import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { QcService } from './qc.service';
import { QcDetailsDialogComponent } from './qc-details-dialog.component';
import {cloneDeep} from 'lodash-es';
@Component({
    selector: 'qc-receive',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [mainLabel]="type" [putData]="putData" (submit)="submit($event)">
        </dynamic-form>
    </div>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class QcReceiveComponent implements OnInit {
    navigationSubscription;

    regConfig: FieldConfig[];
    putData;
    isDataAvailable: boolean = false;
    type = 'QC receiving (weights)';

    submit(value: any) {
        if(value.hasOwnProperty('processItems')) {
            value['processItems'][0]['item'] = value['testedItems'][0]['item'];
        }
        // value['percentageItems']['testedItemsP'].forEach(element => {
        //     element['precentage'] = true;
        // });
        // if(value['testedItemsW']){
        //     value['testedItems'] = value['testedItemsW'].concat(value['percentageItems']['testedItemsP']);
        // } else {
        //     value['testedItems'] = value['percentageItems']['testedItemsP'];
        // }
        // delete value['percentageItems'];
        // delete value['testedItemsW'];
        const fromNew: boolean = this.putData === null || this.putData === undefined;
        if(this.type === 'QC receiving (weights)') {
            // value['localType']
            this.localService.addEditCashewReceiveCheck(value, fromNew).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(QcDetailsDialogComponent, {
                    width: '80%',
                    data: {qcCheck: cloneDeep(val), fromNew: true, type: 'Raw cashew check'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === 'Edit') { 
                        this.isDataAvailable = false;
                        this.putData = val;
                        this.cdRef.detectChanges();
                        this.isDataAvailable = true;
                    } else {
                        this.router.navigate(['../AllQC', {number:0}], { relativeTo: this._Activatedroute });
                    }
                    
                });
            });
        } else {
            this.localService.addEditCashewRoastCheck(value, fromNew).pipe(take(1)).subscribe( val => {
                const dialogRef = this.dialog.open(QcDetailsDialogComponent, {
                    width: '80%',
                    data: {qcCheck: cloneDeep(val), fromNew: true, type: 'Roast cashew check'}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === 'Edit') { 
                        this.isDataAvailable = false;
                        this.putData = val;
                        this.cdRef.detectChanges();
                        this.isDataAvailable = true;
                    } else {
                        this.router.navigate(['../AllQC', {number:1}], { relativeTo: this._Activatedroute });
                    }
                    
                });
            });
        }
    }
      

    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef: ChangeDetectorRef,
        private localService: QcService, private genral: Genral, private location: Location, public dialog: MatDialog) {
       }

      ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                var id = +params.get('id');
                this.localService.getQcCheck(id).pipe(take(1)).subscribe( val => {
                    // var arrWeight = [];
                    // var arrPercentage = [];
                    // val['testedItems'].forEach(element => {
                    //     if(element['precentage']) {
                    //         arrWeight.push(element);
                    //     } else {
                    //         arrPercentage.push(element);
                    //     }
                    // });
                    // delete val['testedItems'];
                    // val['testedItemsW'] = arrWeight;
                    // val['testedItemsP'] = arrPercentage;
                    // val['percentageItems'] = {testedItemsP: arrPercentage};
                    this.putData = val;
                    this.isDataAvailable = true;
                });
            } else {
                this.isDataAvailable = true;
            }
            this.preperReg();
            if(params.get('roast')) {
                this.regConfig.splice(2, 1);
                this.type = 'QC roasting (weights)';
            }
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.putData = null;
                this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
                    if(params.get('roast')) {
                        if(this.type === 'QC receiving (weights)') {
                            this.regConfig.splice(2, 1);
                            this.type = 'QC roasting (weights)';
                        }
                    } else {
                        if(this.type === 'QC roasting (weights)') {
                            this.regConfig.splice(2, 0, {
                                            type: 'radiobutton',
                                            name: 'checkedBy',
                                            label: 'Checked by',
                                            value: 'avc lab',
                                            options: this.genral.getQcCheckOrganzition(),
                                            validations: [
                                                {
                                                    name: 'required',
                                                    validator: Validators.required,
                                                    message: 'Required',
                                                }
                                            ]
                                        });
                            this.type = 'QC receiving (weights)';
                        }
                    }
                });
                this.cdRef.detectChanges();
                this.isDataAvailable = true;
            }
        });
    }

    preperReg() {
        this.regConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.getPoCashewCodesOpenPending(),
                disable: true,
                collections: [
                    {
                        type: 'select',
                        label: 'Supllier',
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
                                message: '#PO Required',
                            }
                        ]
                    },
                ]
            },
            {
                type: 'date',
                label: 'Date',
                value: new Date(),
                name: 'recordedTime',
                options: 'withTime',
                // disable: true,
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Date Required',
                    }
                ]
            },
            {
              type: 'radiobutton',
              name: 'checkedBy',
              label: 'Checked by',
              value: 'avc lab',
              options: this.genral.getQcCheckOrganzition(),
              validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Required',
                    }
                ]
            },
            {
                type: 'input',
                label: 'Inspector',
                name: 'inspector',
            },
            {
                type: 'input',
                label: 'Sample taker',
                name: 'sampleTaker',
            },
            {
                type: 'bigexpand',
                name: 'testedItems',
                label: 'Weights',
                options: 'tabs',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        options: this.genral.getAllItemsCashew(),
                        // disable: true,
                    },
                    {
                        type: 'input',
                        label: 'Number of samples',
                        name: 'numberOfSamples',
                        inputType: 'numeric',
                    },
                    {
                        type: 'input',
                        label: 'Sample Weight',
                        name: 'sampleWeight',
                        inputType: 'numeric',
                        options: 3,
                    },
                    {
                        type: 'selectNormal',
                        label: 'Weight unit',
                        name: 'measureUnit',
                        options: ['OZ', 'GRAM'],
                    },
                    {
                        type: 'percentinput',
                        label: 'Humidity',
                        name: 'humidity',
                    },
                    {
                        type: 'input',
                        label: 'Whole count per Lb',
                        name: 'wholeCountPerLb',
                        inputType: 'numeric',
                    },
                    {
                        type: 'inputtopercentage',
                        label: 'Small size',
                        name: 'smallSize',
                        collections: 'wholeCountPerLb',
                    },
                    {
                        type: 'inputtopercentage',
                        label: 'WS',
                        name: 'ws',
                        inputType: 'measureUnit',
                        options: 3,
                        collections: 'sampleWeight',
                    },
                    {
                        type: 'inputtopercentage',
                        label: 'LP',
                        name: 'lp',
                        inputType: 'measureUnit',
                        options: 3,
                        collections: 'sampleWeight',
                    },
                    {
                        type: 'inputtopercentage',
                        label: 'Breakage',
                        name: 'breakage',
                        inputType: 'measureUnit',
                        options: 3,
                        collections: 'sampleWeight',
                    },
                    {
                        type: 'inputtopercentage',
                        label: 'Foreign material',
                        name: 'foreignMaterial',
                        inputType: 'measureUnit',
                        options: 3,
                        collections: 'sampleWeight',
                    },
                    {
                        type: 'calculatefew',
                        name: 'damage',
                        label: 'Damage',
                        options: 'measureUnit',
                        inputType: '+',
                        value: 'sampleWeight',
                        collections: [
                            {
                                type: 'input',
                                label: 'Mold',
                                name: 'mold',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Dirty',
                                name: 'dirty',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Light dirty',
                                name: 'lightDirty',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Deacy',
                                name: 'decay',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Insect damage',
                                name: 'insectDamage',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Testa',
                                name: 'testa',
                                inputType: 'numeric',
                                options: 3,
                            },  
                        ]
                    },
                    {
                        type: 'calculatefew',
                        name: 'defects',
                        label: 'Defects',
                        options: 'measureUnit',
                        inputType: '+',
                        value: 'sampleWeight',
                        collections: [
                            {
                                type: 'input',
                                label: 'Scrohed',
                                name: 'scorched',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Deep cut',
                                name: 'deepCut',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Off colour',
                                name: 'offColour',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Shrivel',
                                name: 'shrivel',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Desert/dark',
                                name: 'desert',
                                inputType: 'numeric',
                                options: 3,
                            },
                            {
                                type: 'input',
                                label: 'Deep spot',
                                name: 'deepSpot',
                                inputType: 'numeric',
                                options: 3,
                            },
                        ]
                    },
                    {
                        type: 'inputtopercentage',
                        label: 'Totel weight lost after roasting',
                        name: 'rostingWeightLoss',
                        inputType: 'measureUnit',
                        options: 3,
                        collections: 'sampleWeight',
                    },
                    {
                        type: 'radiobutton',
                        label: 'Rosted color',
                        name: 'colour',
                        options: ['NOT_OK', 'OK'],
                    },
                    {
                        type: 'radiobutton',
                        label: 'Flavour',
                        name: 'flavour',
                        options: ['NOT_OK', 'OK'],
                    },
                ],
                validations: [
                    {
                      name: 'item',
                      message: 'a check must have a item and sample weight',
                    },
                    {
                      name: 'sampleWeight',
                    },
                    {
                        name: 'measureUnit',
                    }
                ]
            },
            // {
            //     type: 'popup',
            //     label: 'Percentage testes',
            //     name: 'percentageItems',
            //     collections: [
            //         {
            //             type: 'bigexpand',
            //             name: 'testedItemsP',
            //             label: 'Percentage',
            //             options: 'tabs',
            //             collections: [
            //                 {
            //                     type: 'select',
            //                     label: 'Item descrption',
            //                     name: 'item',
            //                     options: this.genral.getAllItemsCashew(),
            //                     // disable: true,
            //                 },
            //                 {
            //                     type: 'input',
            //                     label: 'Number of samples',
            //                     name: 'numberOfSamples',
            //                     inputType: 'numeric',
            //                 },
            //                 {
            //                     type: 'input',
            //                     label: 'Sample Weight',
            //                     name: 'sampleWeight',
            //                     inputType: 'numeric',
            //                     options: 3,
            //                 },
            //                 {
            //                     type: 'selectNormal',
            //                     label: 'Weight unit',
            //                     name: 'measureUnit',
            //                     options: ['OZ', 'GRAM'],
            //                 },
            //                 {
            //                     type: 'input',
            //                     label: 'Whole count per Lb',
            //                     name: 'wholeCountPerLb',
            //                     inputType: 'numeric',
            //                 },
            //                 {
            //                     type: 'percentinput',
            //                     label: 'Small size',
            //                     name: 'smallSize',
            //                 },
            //                 {
            //                     type: 'percentinput',
            //                     label: 'WS',
            //                     name: 'ws',
            //                 },
            //                 {
            //                     type: 'percentinput',
            //                     label: 'LP',
            //                     name: 'lp',
            //                 },
            //                 {
            //                     type: 'percentinput',
            //                     label: 'Humidity',
            //                     name: 'humidity',
            //                 },
            //                 {
            //                     type: 'percentinput',
            //                     label: 'Breakage',
            //                     name: 'breakage',
            //                 },
            //                 {
            //                     type: 'percentinput',
            //                     label: 'Foreign material',
            //                     name: 'foreignMaterial',
            //                 },
            //                 {
            //                     type: 'calculatefew',
            //                     name: 'damage',
            //                     label: 'Damage (%)',
            //                     inputType: '+',
            //                     options: 'box',
            //                     collections: [
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Mold',
            //                             name: 'mold',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Dirty',
            //                             name: 'dirty',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Light dirty',
            //                             name: 'lightDirty',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Deacy',
            //                             name: 'decay',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Insect damage',
            //                             name: 'insectDamage',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Testa',
            //                             name: 'testa',
            //                         },  
            //                     ]
            //                 },
            //                 {
            //                     type: 'calculatefew',
            //                     name: 'defects',
            //                     label: 'Defects',
            //                     inputType: '+',
            //                     options: 'box',
            //                     collections: [
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Scrohed',
            //                             name: 'scorched',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Deep cut',
            //                             name: 'deepCut',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Off colour',
            //                             name: 'offColour',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Shrivel',
            //                             name: 'shrivel',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Desert/dark',
            //                             name: 'desert',
            //                         },
            //                         {
            //                             type: 'percentinput',
            //                             label: 'Deep spot',
            //                             name: 'deepSpot',
            //                         },
            //                     ]
            //                 },
            //                 {
            //                     type: 'percentinput',
            //                     label: 'Totel weight lost after roasting',
            //                     name: 'rostingWeightLoss',
            //                 },
            //                 {
            //                     type: 'radiobutton',
            //                     label: 'Rosted color',
            //                     name: 'colour',
            //                     options: ['NOT_OK', 'OK'],
            //                 },
            //                 {
            //                     type: 'radiobutton',
            //                     label: 'Flavour',
            //                     name: 'flavour',
            //                     options: ['NOT_OK', 'OK'],
            //                 },
            //             ],
            //             validations: [
            //                 {
            //                 name: 'item',
            //                 message: 'a check must have a item and sample weight',
            //                 },
            //                 {
            //                 name: 'sampleWeight',
            //                 },
            //                 {
            //                     name: 'measureUnit',
            //                 }
            //             ]
            //         },
            //         {
            //             type: 'button',
            //             label: 'Submit',
            //             name: 'submit',
            //         }
            //     ]
            // },
            {
                type: 'bigexpand',
                name: 'processItems',
                label: 'Storage(if stored)',
                options: 'aloneNoAdd',
                collections: [
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
                                        label: 'Unit weight',
                                        name: 'amount',
                                        inputType: 'numeric',
                                        options: 3,
                                    },
                                    {
                                        type: 'select',
                                        label: 'Weight unit',
                                        name: 'measureUnit',
                                        options: ['OZ', 'GRAM'],
                                    },
                                ]
                            },
                            {
                                type: 'input',
                                label: 'Number of units',
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
                        ]
                    },
                ]
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
          
      }

      ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

}


// {
//     type: 'inputpercentage',
//     label: 'Mold',
//     name: 'mold',
//     inputType: 'measureUnit',
//     options: 3,
//     collections: 'sampleWeight',
// },
// {
//     type: 'inputpercentage',
//     label: 'Dirty',
//     name: 'dirty',
//     inputType: 'measureUnit',
//     options: 3,
//     collections: 'sampleWeight',
// },
// {
//     type: 'inputpercentage',
//     label: 'Light dirty',
//     name: 'lightDirty',
//     inputType: 'measureUnit',
//     options: 3,
//     collections: 'sampleWeight',
// },
// {
//     type: 'inputpercentage',
//     label: 'Deacy',
//     name: 'decay',
//     inputType: 'measureUnit',
//     options: 3,
//     collections: 'sampleWeight',
// },
// {
//     type: 'inputpercentage',
//     label: 'Insect damage',
//     name: 'insectDamage',
//     inputType: 'measureUnit',
//     options: 3,
//     collections: 'sampleWeight',
// },
// {
//     type: 'inputpercentage',
//     label: 'Testa',
//     name: 'testa',
//     inputType: 'measureUnit',
//     options: 3,
//     collections: 'sampleWeight',
// },



// {
                    //     type: 'calculatefew',
                    //     name: 'defects',
                    //     label: 'Defects',
                    //     options: 'box',
                    //     inputType: '+',
                    //     value: 'sampleWeight',
                    //     collections: [
                    //         {
                    //             type: 'inputpercentage',
                    //             label: 'Scrohed',
                    //             name: 'scorched',
                    //             inputType: 'measureUnit',
                    //             options: 3,
                    //             collections: 'sampleWeight',
                    //         },
                    //         {
                    //             type: 'inputpercentage',
                    //             label: 'Deep cut',
                    //             name: 'deepCut',
                    //             inputType: 'measureUnit',
                    //             options: 3,
                    //             collections: 'sampleWeight',
                    //         },
                    //         {
                    //             type: 'inputpercentage',
                    //             label: 'Off colour',
                    //             name: 'offColour',
                    //             inputType: 'measureUnit',
                    //             options: 3,
                    //             collections: 'sampleWeight',
                    //         },
                    //         {
                    //             type: 'inputpercentage',
                    //             label: 'Shrivel',
                    //             name: 'shrivel',
                    //             inputType: 'measureUnit',
                    //             options: 3,
                    //             collections: 'sampleWeight',
                    //         },
                    //         {
                    //             type: 'inputpercentage',
                    //             label: 'Desert/dark',
                    //             name: 'desert',
                    //             inputType: 'measureUnit',
                    //             options: 3,
                    //             collections: 'sampleWeight',
                    //         },
                    //         {
                    //             type: 'inputpercentage',
                    //             label: 'Deep spot',
                    //             name: 'deepSpot',
                    //             inputType: 'measureUnit',
                    //             options: 3,
                    //             collections: 'sampleWeight',
                    //         },
                    //     ]
                    // },