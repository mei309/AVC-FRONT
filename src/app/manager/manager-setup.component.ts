import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {isEqual} from 'lodash-es';
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
        <h1>Setup managment</h1>
        <mat-button-toggle-group [(ngModel)]="choosedOne" (change)="updateNew()">
            <mat-button-toggle value="Countries">Countries</mat-button-toggle>
            <mat-button-toggle value="Cities">Cities</mat-button-toggle>
            <mat-button-toggle value="Banks">Banks</mat-button-toggle>
            <mat-button-toggle value="BankBranches">Branchs</mat-button-toggle>
            <mat-button-toggle value="Warehouses">Warehouses</mat-button-toggle>
            <mat-button-toggle value="SupplyCategories">Supply categories</mat-button-toggle>
            <mat-button-toggle value="CompanyPositions">Company positions</mat-button-toggle>
            <mat-button-toggle value="ContractTypes">Contract types</mat-button-toggle>
            <mat-button-toggle value="ProductionLines">Production lines</mat-button-toggle>
            <mat-button-toggle value="CashewStandards">Cashew standerts</mat-button-toggle>
            <mat-button-toggle value="ShippingPorts">Shipping ports</mat-button-toggle>
        </mat-button-toggle-group>
        <h2>{{choosedOne}}</h2>
        <div *ngIf="choosedOne" style="display: inline-block; text-align: left;">
            <button class="raised-margin" mat-raised-button color="primary" (click)="newDialog()">{{choosedOne | namingPipe : false}}</button>
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
        this.localService.getAllSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
            this.setupSource = <any[]>value;
        });
        this.columnsSetup = [
            {
                name: 'value',
                label: 'Descrption',
                search: 'normal',
            }
        ];
        this.regConfigTemp = [
            {
                name: 'value',
                label: 'Descrption',
                type: 'input',
            }
        ];
        if(['SupplyCategories', 'ContractTypes'].includes(this.choosedOne)) {
            this.columnsSetup.push(
                {
                    name: 'supplyGroup',
                    label: 'Supply group',
                    search: 'select',
                    options: this.genral.getSupplyGroup(),
                },
            );
            this.regConfigTemp.push(
                {
                    name: 'supplyGroup',
                    label: 'Supply group',
                    type: 'selectNormal',
                    options: this.genral.getSupplyGroup(),
                },
            );
            if('ContractTypes' === this.choosedOne) {
                this.columnsSetup.push(
                    {
                        name: 'code',
                        label: 'Code',
                        search: 'normal',
                    },
                    {
                        name: 'currency',
                        label: 'Currency',
                        search: 'normal',
                    },
                    {
                        name: 'suffix',
                        label: 'Suffix',
                        search: 'normal',
                    },
                );
                this.regConfigTemp.push(
                    {
                        name: 'code',
                        label: 'Code',
                        type: 'input',
                    },
                    {
                        name: 'currency',
                        label: 'Currency',
                        type: 'selectNormal',
                        options: ['USD', 'VND'],
                    },
                    {
                        name: 'suffix',
                        label: 'Suffix',
                        type: 'input',
                    },
                );
            }
        } else if('ShippingPorts' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    name: 'code',
                    label: 'Code',
                    search: 'normal',
                },
            );
            this.regConfigTemp.push(
                {
                    name: 'code',
                    label: 'Code',
                    type: 'input',
                },
            );
        } else if('Cities' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    type: 'nameId',
                    name: 'country',
                    label: 'Country',
                    search: 'object',
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'country',
                    label: 'Country',
                    type: 'select',
                    options: this.localService.getCountries(),
                }
            );
        } else if('BankBranches' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    type: 'nameId',
                    name: 'bank',
                    label: 'Bank',
                    search: 'object',
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'bank',
                    label: 'Bank',
                    type: 'select',
                    options: this.localService.getBanks(),
                }
            );
        } else if('ProductionLines' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    name: 'productionFunctionality',
                    label: 'Production functionality',
                    search: 'object',
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'productionFunctionality',
                    label: 'Production functionality',
                    type: 'selectNormal',
                    options: this.genral.getProductionFunctionality(),
                }
            );
        } else if('Warehouses' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    name: 'weightCapacityKg',
                    label: 'Weight capacity Kg',
                    search: 'normal',
                },
                {
                    name: 'volumeSpaceM3',
                    label: 'Volume space M3',
                    search: 'normal',
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'weightCapacityKg',
                    label: 'Weight capacity Kg',
                    type: 'input',
                },
                {
                    name: 'volumeSpaceM3',
                    label: 'Volume space M3',
                    type: 'input',
                }
            );
        } else if('CashewStandards' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    type: 'nameId',
                    name: 'items',
                    label: 'Item descrption',
                    // search: 'selectAsyncObject',
                    // options: this.genral.getAllItemsCashew(),
                },
                {
                    name: 'standardOrganization',
                    label: 'Standard organization',
                    search: 'normal',
                },
                {
                    name: 'wholeCountPerLb',
                    label: 'Whole count per Lb',
                    search: 'normal',
                },
                {
                    name: 'smallSize',
                    label: 'Small size',
                    search: 'normal',
                },
                {
                    name: 'ws',
                    label: 'WS',
                    search: 'normal',
                },
                {
                    name: 'lp',
                    label: 'LP',
                    search: 'normal',
                },
                {
                    name: 'humidity',
                    label: 'Humidity',
                    search: 'normal',
                },
                {
                    name: 'breakage',
                    label: 'Breakage',
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
                    label: 'Total damage',
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
                    label: 'Total defects',
                    search: 'normal',
                },
                {
                    name: 'totalDefectsAndDamage',
                    label: 'Total defects + damage',
                    search: 'normal',
                },
                {
                    name: 'rostingWeightLoss',
                    label: 'Total weight lost after roasting',
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
                    type: 'select',
                    label: 'Item descrption',
                    name: 'items',
                    inputType: 'multiple',
                    collections: 'somewhere',
                    options: this.genral.getAllItemsCashew(),
                    validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'Item Required',
                        }
                    ]
                },
                {
                    type: 'radiobutton',
                    name: 'standardOrganization',
                    label: 'Standard organzion',
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
                    label: 'Humidity',
                    name: 'humidity',
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
                    label: 'Damage',
                    options: 'box',
                    inputType: '+',
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
                    options: 'box',
                    inputType: '+',
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
                    type: 'calculatefew',
                    label: 'All totels',
                    options: 'box',
                    inputType: '+',
                    collections: [
                        {
                            type: 'percentinput',
                            label: 'Total damage',
                            name: 'totalDamage',
                        }, 
                        {
                            type: 'input',
                            label: 'Total defects',
                            name: 'totalDefects',
                        },
                        {
                            type: 'percentinput',
                            label: 'Total defects + damage',
                            name: 'totalDefectsAndDamage',
                        },
                        {
                            type: 'percentinput',
                            label: 'Total weight lost after roasting',
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
                label: 'Submit',
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