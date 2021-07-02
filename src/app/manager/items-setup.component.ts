import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {isEqual} from 'lodash-es';
import { take } from 'rxjs/operators';
import { FieldConfig, OneColumn } from '../field.interface';
import { ManagerService } from './manager.service';
import { EditDialogComponent } from './edit-dialog.component';
import { Genral } from '../genral.service';

@Component({
    selector: 'items-setup',
    template: `
    <div style="text-align: center;">
        <h1 i18n>Items setup</h1>
        <mat-button-toggle-group [(ngModel)]="choosedOne" (change)="updateNew()" class="no-print">
            <mat-button-toggle value="Cbulk" i18n>Cashew bulk items (material)</mat-button-toggle>
            <mat-button-toggle value="Cpacked" i18n>Cashew packed items</mat-button-toggle>
            <mat-button-toggle value="Gbulk" i18n>General bulk items (material)</mat-button-toggle>
            <mat-button-toggle value="Gpacked" i18n>General packed items</mat-button-toggle>
            <mat-button-toggle value="waste" i18n>Waste items</mat-button-toggle>
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
export class ItemsSetupComponent {

    choosedOne: string;
    setupSource;
    columnsSetup: OneColumn[];
    regConfigTemp: FieldConfig[];

    constructor(private localService: ManagerService, private genral: Genral, public dialog: MatDialog) {
    }


    updateNew() {
        this.setupSource = null;
        this.localService.getItemsSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
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
        if(this.choosedOne.startsWith('C')) {
            this.columnsSetup.push(
                {
                    name: 'grade',
                    label: $localize`Grade`,
                    search: 'select',
                    options: this.getCashewGrades(),
                },
                {
                    name: 'saltLevel',
                    label: $localize`Salt level`,
                    search: 'select',
                    options: this.getSaltLevel(),
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'grade',
                    label: $localize`Grade`,
                    type: 'selectNormal',
                    options: this.getCashewGrades(),
                },
                {
                    name: 'saltLevel',
                    label: $localize`Salt level`,
                    type: 'selectNormal',
                    options: this.getSaltLevel(),
                }
            );
            if(this.choosedOne.endsWith('packed')) {
                this.columnsSetup.push(
                    {
                        name: 'brand',
                        label: $localize`Brand`,
                        search: 'normal',
                    },
                    {
                        name: 'code',
                        label: $localize`Code`,
                        search: 'select',
                        options: this.getSaltLevel(),
                    },
                    {
                        name: 'numBags',
                        label: $localize`Bags in box`,
                        search: 'select',
                        options: this.getSaltLevel(),
                    },
                    {
                        type: 'checkBool',
                        name: 'whole',
                        label: $localize`Whole`,
                        search: 'none',
                    },
                    {
                        type: 'checkBool',
                        name: 'roast',
                        label: $localize`Roast`,
                        search: 'none',
                    },
                    {
                        type: 'checkBool',
                        name: 'toffee',
                        label: $localize`Toffee`,
                        search: 'none',
                    }
                );
                this.regConfigTemp.push(
                    {
                        name: 'brand',
                        label: $localize`Brand`,
                        type: 'input',
                    },
                    {
                        name: 'code',
                        label: $localize`Code`,
                        type: 'input',
                    },
                    {
                        type: 'input',
                        label: $localize`Bags in box`,
                        name: 'numBags',
                        inputType: 'numeric',
                    },
                    {
                        type: 'checkbox',
                        label: $localize`Whole`,
                        name: 'whole',
                    },
                    {
                        type: 'checkbox',
                        label: $localize`Roast`,
                        name: 'roast',
                    },
                    {
                        type: 'checkbox',
                        label: $localize`Toffee`,
                        name: 'toffee',
                    }
                );
            }
        }
        if(this.choosedOne.endsWith('packed')) {
            this.columnsSetup.push(
                {
                    type: 'weight',
                    label: $localize`Bag weight`,
                    name: 'unit',
                    search: 'normal',
                    // collections: 'measureUnit',
                }
            );
            this.regConfigTemp.push(
                {
                    type: 'inputselect',
                    name: 'unit',
                    // disable: true,
                    collections: [
                        {
                            type: 'input',
                            label: $localize`Unit weight`,
                            name: 'amount',
                            inputType: 'numeric',
                            options: 3,
                        },
                        {
                            type: 'select',
                            label: $localize`Weight unit`,
                            name: 'measureUnit',
                            options: this.genral.getMeasureUnit(),
                        },
                    ]
                }
            );
        } else {
            this.columnsSetup.push(
                {
                    name: 'measureUnit',
                    label: $localize`Default measure unit`,
                    search: 'select',
                    options: this.getMU(this.choosedOne.charAt(0)),
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'measureUnit',
                    label: $localize`Default measure unit`,
                    type: 'selectNormal',
                    options: this.getMU(this.choosedOne.charAt(0)),
                    // disable: true,
                }
            );
        }
        this.columnsSetup.push(
            {
                name: 'productionUse',
                label: $localize`Production use`,
                search: 'select',
                options: this.getProductionUse(this.choosedOne.charAt(0)),
            }
        );
        this.regConfigTemp.push(
            {
                name: 'productionUse',
                label: $localize`Production use`,
                type: 'selectNormal',
                options: this.getProductionUse(this.choosedOne.charAt(0)),
            }
        );
        
        this.regConfigTemp.push(
            {
                name: 'submit',
                label: $localize`Submit`,
                type: 'button',
            }
        );
    }


    getProductionUse(type: string) {
        switch (type) {
            case 'C':
                return ['RAW_KERNEL', 'CLEAN', 'ROAST', 'TOFFEE', 'PACKED'];
            case 'G':
                return ['INGREDIENTS', 'PACKING_SUPPLYES', 'GENERAL_INVENTORY'];
            default:
                return ['WASTE'];
        }
    }

    getCashewGrades() {
        return ['W240', 'W320', 'W340', 'W350', 'W360', 'W450', 'AW', 'DW', 'DW_CUT', 'DW_SCRAPE', 'SK', 'SW320', 'WB', 'WS', 'WSLP'];
    }

    getSaltLevel() {
        return ['NS', 'S', 'LS'];
    }

    getMU(type: string) {
        switch (type) {
            case 'C':
                return this.genral.getBulkMU();
            // case 'G':
            //     return this.genral.getMeasureUnit();
            default:
                return this.genral.getMeasureUnit();
        }
    }


    newDialog(value?: any): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
          width: '80%',
          height: '80%',
          data: {regConfig: this.regConfigTemp, mainLabel: this.choosedOne, type: value? 'editItem' : 'Item', putData: value? value : null},
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data === 'success') {
                this.localService.getItemsSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
                    this.setupSource = <any[]>value;
                });
            }
        });
      }


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
    //         //     this.localService.removeItem(this.choosedOne, value).pipe(take(1)).subscribe( val => {
    //         //         this.setupSource.pop(value);
    //         //     });
    //         // }
    //         else if (!isEqual(value, data)) {
    //             this.localService.editItem(this.choosedOne, data).pipe(take(1)).subscribe( val => {
    //                 this.columnsSetup.forEach(va => {
    //                     value[va.name] = val[va.name];
    //                 })
    //             });
    //         }
    //     });
    //   }

  }