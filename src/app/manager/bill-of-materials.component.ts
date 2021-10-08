import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FieldConfig, OneColumn } from '../field.interface';
import { ManagerService } from './manager.service';
import { EditDialogComponent } from './edit-dialog.component';
import { Genral } from '../genral.service';
import { take } from 'rxjs';

@Component({
    selector: 'bill-of-materials',
    template: `
    <div style="text-align: center;">
        <h1 class="no-print" i18n>Bill Of materials</h1>
        <div style="text-align: left;">
          <button style="text-align: left;" class="left30-button" mat-raised-button color="primary" (click)="newDialog()">{{'Bom' | namingPipe : 'add'}}</button>
        </div>
        <search-details [dataSource]="setupSource" [oneColumns]="columnsSetup" (details)="newDialog($event)">
        </search-details>
    </div>
    `
  })
export class BillOfMaterialsComponent {

    setupSource;
    columnsSetup: OneColumn[];
    regConfigTemp: FieldConfig[];

    constructor(private localService: ManagerService, private genral: Genral, public dialog: MatDialog) {
    }


    ngOnInit() {
        this.setupSource = null;
        this.localService.getAllBoms().pipe(take(1)).subscribe(value => {
            this.setupSource = <any[]>value;
        });
        this.columnsSetup = [
          {
            type: 'nameId',
            name: 'product',
            label: $localize`Product descrption`,
            search: 'selectObjObj',
            options: this.genral.getItemsCashew('All'),
          },
          {
            type: 'weight',
            name: 'defaultBatch',
            label: $localize`Payable units`,
            search: 'object',
          },
        ];
        this.regConfigTemp = [
          {
              type: 'selectItem',
              label: $localize`Item descrption`,
              name: 'product',
              disable: true,
              options: this.genral.getItemsCashew('All'),
          },
          {
              type: 'inputselect',
              name: 'defaultBatch',
              options: 'product',
              inputType: 'second',
              collections: [
                  {
                      type: 'input',
                      label: $localize`Weight`,
                      name: 'amount',
                      inputType: 'numeric',
                      options: 3,
                  },
                  {
                      type: 'select',
                      label: $localize`Weight unit`,
                      name: 'measureUnit',
                      value: 'LBS',
                      options: this.genral.getMeasureUnit(),
                  },
              ]
          },
          {
            type: 'bigexpand',
            name: 'bomList',
            label: $localize`Materials amounts`,
            collections: [
              {
                  type: 'selectItem',
                  label: $localize`Item descrption`,
                  name: 'material',
                  options: this.genral.getItemsGeneral(),
              },
              {
                  type: 'inputselect',
                  name: 'defaultAmount',
                  options: 'material',
                  inputType: 'second',
                  collections: [
                      {
                          type: 'input',
                          label: $localize`Weight`,
                          name: 'amount',
                          inputType: 'numeric',
                          options: 3,
                      },
                      {
                          type: 'select',
                          label: $localize`Weight unit`,
                          name: 'measureUnit',
                          value: 'LBS',
                          options: this.genral.getMeasureUnit(),
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
              name: 'submit',
              label: $localize`Submit`,
              type: 'button',
          }
        ];
    }




    newDialog(value?: any): void {
      let dialogRef;
      if(value) {
        this.localService.getItemBom(value.product.id).pipe(take(1)).subscribe(val => {
          dialogRef = this.dialog.open(EditDialogComponent, {
            width: '80%',
            height: '80%',
            data: {regConfig: this.regConfigTemp, mainLabel: 'Bom', type: 'editBom', putData: val},
          });
          dialogRef.afterClosed().subscribe(data => {
            if(data === 'success') {
                this.localService.getAllBoms().pipe(take(1)).subscribe(value => {
                    this.setupSource = <any[]>value;
                });
            }
          });
        });
      } else {
        dialogRef = this.dialog.open(EditDialogComponent, {
          width: '80%',
          height: '80%',
          data: {regConfig: this.regConfigTemp, mainLabel: 'Bom', type: 'Bom', putData: null},
        });
        dialogRef.afterClosed().subscribe(data => {
          if(data === 'success') {
              this.localService.getAllBoms().pipe(take(1)).subscribe(value => {
                  this.setupSource = <any[]>value;
              });
          }
        });
      }
    }

  }
