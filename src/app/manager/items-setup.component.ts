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
        <h1>Items setup</h1>
        <mat-button-toggle-group [(ngModel)]="choosedOne" (change)="updateNew()">
            <mat-button-toggle value="Cbulk">Cashew bulk items</mat-button-toggle>
            <mat-button-toggle value="Cpacked">Cashew packed items</mat-button-toggle>
            <mat-button-toggle value="Gbulk">General bulk items</mat-button-toggle>
            <mat-button-toggle value="Gpacked">General packed items</mat-button-toggle>
            <mat-button-toggle value="waste">Waste items</mat-button-toggle>
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
export class ItemsSetupComponent {

    choosedOne: string;
    setupSource;
    columnsSetup: OneColumn[];
    regConfigTemp: FieldConfig[];

    constructor(private localService: ManagerService, private genral: Genral, public dialog: MatDialog) {
    }


    updateNew() {
        this.localService.getItemsSetupTable(this.choosedOne).pipe(take(1)).subscribe(value => {
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
        if(this.choosedOne.endsWith('packed')) {
            this.columnsSetup.push(
                {
                    type: 'weight',
                    label: 'Bag weight',
                    name: 'unit',
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
                            label: 'Unit weight',
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
                }
            );
        } else {
            this.columnsSetup.push(
                {
                    name: 'measureUnit',
                    label: 'Default measure unit',
                    search: 'select',
                    options: this.getMU(this.choosedOne.charAt(0)),
                }
            );
            this.regConfigTemp.push(
                {
                    name: 'measureUnit',
                    label: 'Default measure unit',
                    type: 'selectNormal',
                    options: this.getMU(this.choosedOne.charAt(0)),
                    // disable: true,
                }
            );
        }
        this.columnsSetup.push(
            {
                name: 'productionUse',
                label: 'Production use',
                search: 'select',
                options: this.getProductionUse(this.choosedOne.charAt(0)),
            }
        );
        this.regConfigTemp.push(
            {
                name: 'productionUse',
                label: 'Production use',
                type: 'selectNormal',
                options: this.getProductionUse(this.choosedOne.charAt(0)),
            }
        );
        
        this.regConfigTemp.push(
            {
                name: 'submit',
                label: 'Submit',
                type: 'button',
            }
        );
    }


    getProductionUse(type: string) {
        switch (type) {
            case 'C':
                return ['RAW_KERNEL', 'CLEAN', 'ROAST', 'PACKED'];
            case 'G':
                return ['INGREDIENTS', 'PACKING_SUPPLYES'];
            default:
                return ['WASTE'];
        }
    }

    getMU(type: string) {
        switch (type) {
            case 'C':
                return this.genral.getBulkMU();
            case 'G':
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