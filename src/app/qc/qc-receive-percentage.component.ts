import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { QcDetailsDialogComponent } from './qc-details-dialog.component';
import { QcService } from './qc.service';
@Component({
    selector: 'qc-receive-percentage',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="regConfig" [mainLabel]="type" [putData]="putData" (submit)="submit($event)">
        </dynamic-form>
    </div>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class QcReceivePercentageComponent implements OnInit {
    navigationSubscription;

    regConfig: FieldConfig[];
    putData;
    isDataAvailable: boolean = false;
    type = 'QC receiving (percentage)';

    submit(value: any) {
        if(value.hasOwnProperty('processItems')) {
            value['processItems'][0]['item'] = value['testedItems'][0]['item'];
        }
        value['testedItems'].forEach(element => {
            element['precentage'] = true;
        });
        const fromNew: boolean = this.putData === null || this.putData === undefined;
        if(this.type === 'QC receiving (percentage)') {
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
        private localService: QcService, private genral: Genral, public dialog: MatDialog) {
       }

      ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                var id = +params.get('id');
                this.localService.getQcCheck(id).pipe(take(1)).subscribe( val => {
                    this.putData = val;
                    this.isDataAvailable = true;
                });
            } else {
                this.isDataAvailable = true;
            }
            this.preperReg();
            if(params.get('roast')) {
                this.regConfig.splice(2, 1);
                this.type = 'QC roasting (percentage)';
            }
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.putData = null;
                this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
                    if(params.get('roast')) {
                        if(this.type === 'QC receiving (percentage)') {
                            this.regConfig.splice(2, 1);
                            this.type = 'QC roasting (percentage)';
                        }
                    } else {
                        if(this.type === 'QC roasting (percentage)') {
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
                            this.type = 'QC receiving (percentage)';
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
                options: this.localService.getPoCashew(this.type.startsWith('QC roasting')),
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
                label: 'Testes',
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
                        type: 'percentinput',
                        label: 'Small size',
                        name: 'smallSize',
                    },
                    {
                        type: 'percentinput',
                        label: 'WS',
                        name: 'ws',
                    },
                    {
                        type: 'percentinput',
                        label: 'LP',
                        name: 'lp',
                    },
                    {
                        type: 'percentinput',
                        label: 'Breakage',
                        name: 'breakage',
                    },
                    {
                        type: 'percentinput',
                        label: 'Foreign material',
                        name: 'foreignMaterial',
                    },
                    {
                        type: 'calculatefew',
                        name: 'damage',
                        label: 'Damage (%)',
                        inputType: '+',
                        options: 'box',
                        collections: [
                            {
                                type: 'percentinput',
                                label: 'Mold',
                                name: 'mold',
                            },
                            {
                                type: 'percentinput',
                                label: 'Dirty',
                                name: 'dirty',
                            },
                            {
                                type: 'percentinput',
                                label: 'Light dirty',
                                name: 'lightDirty',
                            },
                            {
                                type: 'percentinput',
                                label: 'Deacy',
                                name: 'decay',
                            },
                            {
                                type: 'percentinput',
                                label: 'Insect damage',
                                name: 'insectDamage',
                            },
                            {
                                type: 'percentinput',
                                label: 'Testa',
                                name: 'testa',
                            },  
                        ]
                    },
                    {
                        type: 'calculatefew',
                        name: 'defects',
                        label: 'Defects',
                        inputType: '+',
                        options: 'box',
                        collections: [
                            {
                                type: 'percentinput',
                                label: 'Scrohed',
                                name: 'scorched',
                            },
                            {
                                type: 'percentinput',
                                label: 'Deep cut',
                                name: 'deepCut',
                            },
                            {
                                type: 'percentinput',
                                label: 'Off colour',
                                name: 'offColour',
                            },
                            {
                                type: 'percentinput',
                                label: 'Shrivel',
                                name: 'shrivel',
                            },
                            {
                                type: 'percentinput',
                                label: 'Desert/dark',
                                name: 'desert',
                            },
                            {
                                type: 'percentinput',
                                label: 'Deep spot',
                                name: 'deepSpot',
                            },
                        ]
                    },
                    {
                        type: 'percentinput',
                        label: 'Total weight lost after roasting',
                        name: 'rostingWeightLoss',
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