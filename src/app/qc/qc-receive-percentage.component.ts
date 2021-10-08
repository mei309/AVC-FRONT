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
        <dynamic-form [fields]="regConfig" [mainLabel]="type" [putData]="putData" (submitForm)="submit($event)">
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
                    data: {qcCheck: cloneDeep(val), fromNew: true, type: $localize`Raw cashew check`}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === $localize`Edit`) {
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
                    data: {qcCheck: cloneDeep(val), fromNew: true, type: $localize`Roast cashew check`}
                });
                dialogRef.afterClosed().subscribe(data => {
                    if (data === $localize`Edit`) {
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
            if(params.get('roast')) {
                this.type = 'QC roasting (percentage)';
                this.preperReg();
                this.regConfig.splice(2, 1);
            } else {
                this.preperReg();
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
                            this.type = 'QC roasting (percentage)';
                            this.preperReg();
                            this.regConfig.splice(2, 1);
                        }
                    } else {
                        if(this.type === 'QC roasting (percentage)') {
                            this.type = 'QC receiving (percentage)';
                            this.preperReg();
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
                label: 'withAllPos',
                options: this.localService.getPoCashew(this.type.startsWith('QC roasting')),
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
                                message: $localize`#PO Required`,
                            }
                        ]
                    },
                ]
            },
            {
                type: 'date',
                label: $localize`Date`,
                value: 'timeNow',
                name: 'recordedTime',
                options: 'withTime',
                // disable: true,
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Date Required`,
                    }
                ]
            },
            {
              type: 'radiobutton',
              name: 'checkedBy',
              label: $localize`Checked by`,
              value: 'avc lab',
              options: this.genral.getQcCheckOrganzition(),
              validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Required`,
                    }
                ]
            },
            {
                type: 'input',
                label: $localize`Inspector`,
                name: 'inspector',
            },
            {
                type: 'input',
                label: $localize`Sample taker`,
                name: 'sampleTaker',
            },
            {
                type: 'select',
                label: $localize`Production line`,
                value: 'firstVal',
                name: 'productionLine',
                options: this.genral.getProductionLine('QC_CHECK'),
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Production line Required`,
                    }
                ]
            },
            {
                type: 'bigexpand',
                name: 'testedItems',
                label: $localize`Testes`,
                options: 'tabs',
                collections: [
                    {
                        type: 'select',
                        label: $localize`Item descrption`,
                        name: 'item',
                        collections: 'somewhere',
                        options: this.localService.getItemsCashewBulk(this.type.startsWith('QC roasting')),
                        // disable: true,
                    },
                    {
                        type: 'input',
                        label: $localize`Number of samples`,
                        name: 'numberOfSamples',
                        inputType: 'numeric',
                    },
                    {
                        type: 'input',
                        label: $localize`Sample Weight`,
                        name: 'sampleWeight',
                        inputType: 'numeric',
                        options: 3,
                    },
                    {
                        type: 'selectNormal',
                        label: $localize`Weight unit`,
                        name: 'measureUnit',
                        options: ['OZ', 'GRAM', 'LBS'],
                    },
                    {
                        type: 'percentinput',
                        label: $localize`Humidity`,
                        name: 'humidity',
                    },
                    {
                        type: 'input',
                        label: $localize`Whole count per Lb`,
                        name: 'wholeCountPerLb',
                        inputType: 'numeric',
                    },
                    {
                        type: 'percentinput',
                        label: $localize`Small size`,
                        name: 'smallSize',
                    },
                    {
                        type: 'percentinput',
                        label: $localize`WS`,
                        name: 'ws',
                    },
                    {
                        type: 'percentinput',
                        label: $localize`LP`,
                        name: 'lp',
                    },
                    {
                        type: 'percentinput',
                        label: $localize`Breakage`,
                        name: 'breakage',
                    },
                    {
                        type: 'percentinput',
                        label: $localize`Foreign material`,
                        name: 'foreignMaterial',
                    },
                    {
                        type: 'calculatefew',
                        name: 'damage',
                        label: $localize`Damage (%)`,
                        inputType: '+',
                        options: 'box',
                        collections: [
                            {
                                type: 'percentinput',
                                label: $localize`Mold`,
                                name: 'mold',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Dirty`,
                                name: 'dirty',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Light dirty`,
                                name: 'lightDirty',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Deacy`,
                                name: 'decay',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Insect damage`,
                                name: 'insectDamage',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Testa`,
                                name: 'testa',
                            },
                        ]
                    },
                    {
                        type: 'calculatefew',
                        name: 'defects',
                        label: $localize`Defects`,
                        inputType: '+',
                        options: 'box',
                        collections: [
                            {
                                type: 'percentinput',
                                label: $localize`Scrohed`,
                                name: 'scorched',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Deep cut`,
                                name: 'deepCut',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Off colour`,
                                name: 'offColour',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Shrivel`,
                                name: 'shrivel',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Desert/dark`,
                                name: 'desert',
                            },
                            {
                                type: 'percentinput',
                                label: $localize`Deep spot`,
                                name: 'deepSpot',
                            },
                        ]
                    },
                    {
                        type: 'percentinput',
                        label: $localize`Total weight lost after roasting`,
                        name: 'rostingWeightLoss',
                    },
                    {
                        type: 'radiobutton',
                        label: $localize`Rosted color`,
                        name: 'colour',
                        options: ['NOT_OK', 'OK'],
                    },
                    {
                        type: 'radiobutton',
                        label: $localize`Flavour`,
                        name: 'flavour',
                        options: ['NOT_OK', 'OK'],
                    },
                ],
                validations: [
                    {
                      name: 'item',
                      message: $localize`a check must have a item and sample weight`,
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
                label: $localize`Storage(if stored)`,
                options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'selectNormal',
                        label: $localize`Weight unit`,
                        name: 'measureUnit',
                        // inputType: 'item',
                        options: this.genral.getMeasureUnit(),
                    },
                    {
                        type: 'bigexpand',
                        label: $localize`Amounts`,
                        name: 'storageForms',
                        options: 'aloneNoAddNoFrameInline',
                        collections: [
                            {
                                type: 'input',
                                label: $localize`Number of units`,
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
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
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

      ngOnDestroy() {
        if (this.navigationSubscription) {
           this.navigationSubscription.unsubscribe();
        }
      }

}
