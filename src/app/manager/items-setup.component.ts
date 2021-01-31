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
    selector: 'items-setup',
    template: `
    <div style="text-align: center;">
        <h1>Items setup</h1>
        <mat-button-toggle-group [(ngModel)]="choosedOne" (change)="updateNew()">
            <mat-button-toggle value="bulkCItems">Cashew bulk items</mat-button-toggle>
            <mat-button-toggle value="packedCItems">Cashew packed items</mat-button-toggle>
            <mat-button-toggle value="bulkGItems">General bulk items</mat-button-toggle>
            <mat-button-toggle value="packedGItems">General packed items</mat-button-toggle>
            <mat-button-toggle value="wasteItems">Waste items</mat-button-toggle>
        </mat-button-toggle-group>
        <h2>{{choosedOne}}</h2>
        <div *ngIf="choosedOne" style="display: inline-block; text-align: left;">
            <button class="raised-margin" mat-raised-button color="primary" (click)="newDialog()">Add {{choosedOne}}</button>
            <search-details [dataSource]="setupSource" [oneColumns]="columnsSetup" (details)="editDialog($event)">
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
        this.localService.getAllSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
            this.setupSource = <any[]>value;
            console.log(value);
            
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
        if('packedItems' === this.choosedOne) {
            this.columnsSetup.push(
                {
                    type: 'weight',
                    label: 'Bag weight',
                    name: 'unit',
                    // collections: 'measureUnit',
                },
                {
                    name: 'itemGroup',
                    label: 'Item group',
                    search: 'select',
                    options: this.genral.getItemGroup(),
                },
                {
                    name: 'productionUse',
                    label: 'Production use',
                    search: 'select',
                    options: this.genral.getProductionUse(),
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
                            label: 'Unit weight (only for packed)',
                            name: 'amount',
                            inputType: 'numeric',
                            options: 3,
                        },
                        {
                            type: 'select',
                            label: 'Weight unit',
                            name: 'measureUnit',
                            options: this.genral.getMeasureUnit(),
                        },
                    ]
                },
                {
                    name: 'itemGroup',
                    label: 'Item group',
                    type: 'selectNormal',
                    options: this.genral.getItemGroup(),
                },
                {
                    name: 'productionUse',
                    label: 'Production use',
                    type: 'selectNormal',
                    // inputType: 'multiple',
                    options: this.genral.getProductionUse(),

                }
            );
        } else {
            this.columnsSetup.push(
                {
                    name: 'measureUnit',
                    label: 'Default measure unit',
                    search: 'select',
                    options: this.genral.getMeasureUnit(),
                },
                {
                    name: 'itemGroup',
                    label: 'Item group',
                    search: 'select',
                    options: this.genral.getItemGroup(),
                },
                {
                    name: 'productionUse',
                    label: 'Production use',
                    search: 'select',
                    options: this.genral.getProductionUse(),
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'measureUnit',
                    label: 'Default measure unit (only for bulk)',
                    type: 'selectNormal',
                    options: this.genral.getMeasureUnit(),
                    disable: true,
                },
                {
                    name: 'itemGroup',
                    label: 'Item group',
                    type: 'selectNormal',
                    options: this.genral.getItemGroup(),
                },
                {
                    name: 'productionUse',
                    label: 'Production use',
                    type: 'selectNormal',
                    // inputType: 'multiple',
                    options: this.genral.getProductionUse(),

                }
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


    newDialog(): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
          width: '80%',
          height: '80%',
          data: {regConfig: this.regConfigTemp, mainLabel: 'Add '+this.choosedOne},
        });
        dialogRef.afterClosed().subscribe(data => {
            if(!(!data || data === 'closed' || data === 'remove')) {
                this.localService.addNewSetup(this.choosedOne, data).pipe(take(1)).subscribe( val => {
                    this.localService.getAllSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
                        this.setupSource = <any[]>value;
                    });
                });
            }
        });
      }


      editDialog(value: any): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
          width: '80%',
          height: '80%',
          data: {putData: value, regConfig: this.regConfigTemp, mainLabel: 'Edit '+this.choosedOne},
        });
        dialogRef.afterClosed().subscribe(data => {
            if(!data || data === 'closed') {
            } else if(data === 'remove') {
                this.localService.removeSetup(this.choosedOne, value).pipe(take(1)).subscribe( val => {
                    this.setupSource.pop(value);
                });
            } else if (!isEqual(value, data)) {
                this.localService.editSetup(this.choosedOne, data).pipe(take(1)).subscribe( val => {
                    this.columnsSetup.forEach(va => {
                        value[va.name] = val[va.name];
                    })
                });
            }
        });
      }

  }