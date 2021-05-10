import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { FieldConfig, OneColumn } from '../field.interface';
import { ManagerService } from './manager.service';
import { EditDialogComponent } from './edit-dialog.component';
import { Genral } from '../genral.service';
import { Validators } from '@angular/forms';

@Component({
    selector: 'managment-setup',
    template: `
    <div style="text-align: center;">
        <h1 i18n>Setup managment</h1>
        <mat-button-toggle-group [(ngModel)]="choosedOne" (change)="updateNew()">
            <mat-button-toggle value="Countries" i18n>Countries</mat-button-toggle>
            <mat-button-toggle value="Cities" i18n>Cities</mat-button-toggle>
            <mat-button-toggle value="Banks" i18n>Banks</mat-button-toggle>
            <mat-button-toggle value="BankBranches" i18n>Branchs</mat-button-toggle>
            <mat-button-toggle value="Warehouses" i18n>Warehouses</mat-button-toggle>
            <mat-button-toggle value="SupplyCategories" i18n>Supply categories</mat-button-toggle>
            <mat-button-toggle value="CompanyPositions" i18n>Company positions</mat-button-toggle>
            <mat-button-toggle value="ContractTypes" i18n>Contract types</mat-button-toggle>
            <mat-button-toggle value="ProductionLines" i18n>Production lines</mat-button-toggle>
            <mat-button-toggle value="CashewStandards" i18n>Cashew standerts</mat-button-toggle>
            <mat-button-toggle value="ShippingPorts" i18n>Shipping ports</mat-button-toggle>
        </mat-button-toggle-group>
        <h2 *ngIf="choosedOne">{{choosedOne | namingPipe : 'none'}}</h2>
        <div *ngIf="choosedOne" style="display: inline-block; text-align: left;">
            <button class="raised-margin" mat-raised-button color="primary" (click)="newDialog()">{{choosedOne | namingPipe : 'add'}}</button>
            <search-details [dataSource]="setupSource" [oneColumns]="columnsSetup" (details)="newDialog($event)">
            </search-details>
        </div>
    </div>
    
    `
  })
export class ManagmentSetupComponent {

    choosedOne: string;
    setupSource;
    columnsSetup: OneColumn[];
    regConfigTemp: FieldConfig[];

    constructor(private localService: ManagerService, private genral: Genral, public dialog: MatDialog) {
    }


    updateNew() {
        this.setupSource = null;
        this.localService.getAllSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
            this.setupSource = <any[]>value;
        });
        this.columnsSetup = [
            {
                name: 'value',
                label: $localize`Descrption`,
                search: 'normal',
            }
        ];
        this.regConfigTemp = [
            {
                name: 'value',
                label: $localize`Descrption`,
                type: 'input',
            }
        ];
        if(['SupplyCategories', 'ContractTypes'].includes(this.choosedOne)) {
            this.columnsSetup.push(
                {
                    name: 'supplyGroup',
                    label: $localize`Supply group`,
                    search: 'select',
                    options: this.genral.getSupplyGroup(),
                },
            );
            this.regConfigTemp.push(
                {
                    name: 'supplyGroup',
                    label: $localize`Supply group`,
                    type: 'selectNormal',
                    options: this.genral.getSupplyGroup(),
                },
            );
            if('ContractTypes' === this.choosedOne) {
                this.columnsSetup.push(
                    {
                        name: 'code',
                        label: $localize`Code`,
                        search: 'normal',
                    },
                    {
                        name: 'currency',
                        label: $localize`Currency`,
                        search: 'normal',
                    },
                    {
                        name: 'suffix',
                        label: $localize`Suffix`,
                        search: 'normal',
                    },
                );
                this.regConfigTemp.push(
                    {
                        name: 'code',
                        label: $localize`Code`,
                        type: 'input',
                    },
                    {
                        name: 'currency',
                        label: $localize`Currency`,
                        type: 'selectNormal',
                        options: ['USD', 'VND'],
                    },
                    {
                        name: 'suffix',
                        label: $localize`Suffix`,
                        type: 'input',
                    },
                );
            }
        } else if('ShippingPorts' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    name: 'code',
                    label: $localize`Code`,
                    search: 'normal',
                },
            );
            this.regConfigTemp.push(
                {
                    name: 'code',
                    label: $localize`Code`,
                    type: 'input',
                },
            );
        } else if('Cities' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    type: 'nameId',
                    name: 'country',
                    label: $localize`Country`,
                    search: 'object',
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'country',
                    label: $localize`Country`,
                    type: 'select',
                    options: this.localService.getCountries(),
                }
            );
        } else if('BankBranches' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    type: 'nameId',
                    name: 'bank',
                    label: $localize`Bank`,
                    search: 'object',
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'bank',
                    label: $localize`Bank`,
                    type: 'select',
                    options: this.localService.getBanks(),
                }
            );
        } else if('ProductionLines' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    name: 'productionFunctionality',
                    label: $localize`Production functionality`,
                    search: 'select',
                    options: this.genral.getProductionFunctionality(),
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'productionFunctionality',
                    label: $localize`Production functionality`,
                    type: 'selectNormal',
                    options: this.genral.getProductionFunctionality(),
                }
            );
        } else if('Warehouses' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    name: 'weightCapacityKg',
                    label: $localize`Weight capacity Kg`,
                    search: 'normal',
                },
                {
                    name: 'volumeSpaceM3',
                    label: $localize`Volume space M3`,
                    search: 'normal',
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'weightCapacityKg',
                    label: $localize`Weight capacity Kg`,
                    type: 'input',
                },
                {
                    name: 'volumeSpaceM3',
                    label: $localize`Volume space M3`,
                    type: 'input',
                }
            );
        } else if('CashewStandards' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    type: 'nameId',
                    name: 'items',
                    label: $localize`Item descrption`,
                    search: 'none',
                    // options: this.genral.getAllItemsCashew(),
                },
                {
                    name: 'standardOrganization',
                    label: $localize`Standard organization`,
                    search: 'normal',
                },
                {
                    name: 'wholeCountPerLb',
                    label: $localize`Whole count per Lb`,
                    search: 'normal',
                },
                {
                    name: 'smallSize',
                    label: $localize`Small size`,
                    search: 'normal',
                },
                {
                    name: 'ws',
                    label: $localize`WS`,
                    search: 'normal',
                },
                {
                    name: 'lp',
                    label: $localize`LP`,
                    search: 'normal',
                },
                {
                    name: 'humidity',
                    label: $localize`Humidity`,
                    search: 'normal',
                },
                {
                    name: 'breakage',
                    label: $localize`Breakage`,
                    search: 'normal',
                },
                // {
                //     type: 'normal',
                //     titel: 'Foreign material',
                //     name: 'foreignMaterial',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Mold',
                //     name: 'mold',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Dirty/light dirty',
                //     name: 'dirty',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Deacy',
                //     name: 'decay',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Insect damage',
                //     name: 'insectDamage',
                // },
                {
                    name: 'totalDamage',
                    label: $localize`Total damage`,
                    search: 'normal',
                },
                // {
                //     type: 'normal',
                //     titel: 'Testa',
                //     name: 'testa',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Scrohed',
                //     name: 'scorched',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Deep cut',
                //     name: 'deepCut',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Off colour',
                //     name: 'offColour',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Shrivel',
                //     name: 'shrivel',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Desert/dark',
                //     name: 'desert',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Deep spot',
                //     name: 'deepSpot',
                // },
                { 
                    name: 'totalDefects',
                    label: $localize`Total defects`,
                    search: 'normal',
                },
                {
                    name: 'totalDefectsAndDamage',
                    label: $localize`Total defects + damage`,
                    search: 'normal',
                },
                {
                    name: 'rostingWeightLoss',
                    label: $localize`Total weight lost after roasting`,
                    type: 'normal',
                },
                // {
                //     type: 'normal',
                //     titel: 'Rosted color',
                //     name: 'colour',
                // },
                // {
                //     type: 'normal',
                //     titel: 'Flavour',
                //     name: 'flavour',
                // },
            );
            this.regConfigTemp.push(
                {
                    type: 'selectMultipile',
                    label: $localize`Item descrption`,
                    name: 'items',
                    collections: 'somewhere',
                    options: this.genral.getAllItemsCashew(),
                    validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: $localize`Item Required`,
                        }
                    ]
                },
                {
                    type: 'radiobutton',
                    name: 'standardOrganization',
                    label: $localize`Standard organzion`,
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
                    label: $localize`Humidity`,
                    name: 'humidity',
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
                    label: $localize`Damage`,
                    options: 'box',
                    inputType: '+',
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
                    options: 'box',
                    inputType: '+',
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
                    type: 'calculatefew',
                    label: $localize`All totels`,
                    options: 'box',
                    inputType: '+',
                    collections: [
                        {
                            type: 'percentinput',
                            label: $localize`Total damage`,
                            name: 'totalDamage',
                        }, 
                        {
                            type: 'input',
                            label: $localize`Total defects`,
                            name: 'totalDefects',
                        },
                        {
                            type: 'percentinput',
                            label: $localize`Total defects + damage`,
                            name: 'totalDefectsAndDamage',
                        },
                        {
                            type: 'percentinput',
                            label: $localize`Total weight lost after roasting`,
                            name: 'rostingWeightLoss',
                        },
                    ]
                },
                // {
                //     type: 'radiobutton',
                //     label: 'Rosted color',
                //     name: 'colour',
                //     options: ['NOT_OK', 'OK'],
                // },
                // {
                //     type: 'radiobutton',
                //     label: 'Flavour',
                //     name: 'flavour',
                //     options: ['NOT_OK', 'OK'],
                // },
            );
        }
        this.regConfigTemp.push(
            {
                name: 'submit',
                label: $localize`Submit`,
                type: 'button',
            }
        );
    }


    newDialog(value?: any): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
          width: '80%',
          height: '80%',
          data: {regConfig: this.regConfigTemp, mainLabel: this.choosedOne, type: value? 'editSetup' : 'Setup', putData: value? value : null},
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data === 'success') {
                this.localService.getAllSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
                    this.setupSource = <any[]>value;
                });
            }
        });
      }


    //   !(!data || data === 'closed' || data === 'remove')
    //   editDialog(value: any): void {
    //     const dialogRef = this.dialog.open(EditDialogComponent, {
    //       width: '80%',
    //       height: '80%',
    //       data: {putData: value, regConfig: this.regConfigTemp, mainLabel: 'Edit '+this.choosedOne},
    //     });
    //     dialogRef.afterClosed().subscribe(data => {
    //         if(!data || data === 'closed') {
    //         } 
    //         // else if(data === 'remove') {
    //         //     this.localService.removeSetup(this.choosedOne, value).pipe(take(1)).subscribe( val => {
    //         //         this.setupSource.pop(value);
    //         //     });
    //         // } 
    //         else if (!isEqual(value, data)) {
    //             this.localService.editSetup(this.choosedOne, data).pipe(take(1)).subscribe( val => {
    //                 this.columnsSetup.forEach(va => {
    //                     value[va.name] = val[va.name];
    //                 })
    //             });
    //         }
    //     });
    //   }

  }