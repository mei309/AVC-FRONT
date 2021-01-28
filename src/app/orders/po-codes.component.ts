import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OrdersService } from './orders.service';
@Component({
    selector: 'po-codes',
    template: `
    <h1 style="text-align:center">#POS</h1>
    <div class="centerButtons">
        <button class="raised-margin" mat-raised-button color="primary" (click)="newDialog()">Add #PO</button>
        <button class="raised-margin" mat-raised-button color="primary" (click)="newMixDialog()">Add mix #PO's</button>
    </div>
    <search-details [dataSource]="posSource" [oneColumns]="columnsPos" (details)="editDialog($event)">
    </search-details>
    `
  })
export class PoCodesComponent implements OnInit {
    
    posSource;
    columnsPos;
    
    constructor(private localService: OrdersService, public dialog: MatDialog) {
      }

    ngOnInit() {
        this.columnsPos = [
            {
                type: 'normal',
                name: 'code',
                label: 'Code',
            },
            {
                type: 'normal',
                name: 'supplierName',
                label: 'Supplier',
                search: 'selectAsyncObject',
                options: this.localService.getAllSuppliers(),
            },
            {
                type: 'normal',
                name: 'contractTypeCode',
                label: 'Contract type code',
            },
            {
                type: 'normal',
                name: 'contractTypeSuffix',
                label: 'Suffix',
            },
        ];
        this.localService.findAllPoCodes().pipe(take(1)).subscribe(value => {
            this.posSource = value;
        });
    }

    newDialog(): void {
        const dialogRef = this.dialog.open(AddEditPoDialog, {
          width: '80%',
          height: '80%',
          data: {mainLabel: 'Add PO#'}
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data && data !== 'closed') {
                this.localService.addEditPoCode(data, true).pipe(take(1)).subscribe( val => {
                    this.localService.findAllPoCodes().pipe(take(1)).subscribe(value => {
                        this.posSource = value;
                    });
                });
            }
        });
    }

    editDialog(value: any): void {
        const dialogRef = this.dialog.open(AddEditPoDialog, {
          width: '80%',
          height: '80%',
          data: {poCode: value['id'], mainLabel: 'Edit PO#'}
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data && data !== 'closed') {
                this.localService.addEditPoCode(data, false).pipe(take(1)).subscribe( val => {
                    this.localService.findAllPoCodes().pipe(take(1)).subscribe(value => {
                        this.posSource = value;
                    });
                });
            }
        });
    }

    newMixDialog(): void {
        const dialogRef = this.dialog.open(AddEditPoDialog, {
          width: '80%',
          height: '80%',
          data: {mainLabel: 'Add mix #PO'}
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data && data !== 'closed') {
                // this.localService.addEditPoCode(data, true).pipe(take(1)).subscribe( val => {
                //     this.localService.findAllPoCodes().pipe(take(1)).subscribe(value => {
                //         this.posSource = value;
                //     });
                // });
            }
        });
    }

}

@Component({
  selector: 'add-edit-po',
  template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [putData]="putData" [fields]="poConfig" [mainLabel]="mainLabel" (submitForm)="submit($event)" popup="true">
        </dynamic-form>
    </div>
  `,
})
export class AddEditPoDialog {
 
    poConfig;
    putData;
    mainLabel: string;
    poCode: number;
    isDataAvailable: boolean = false;

    ngOnInit(){
        if(!this.mainLabel.startsWith('Add mix')) {
            if(this.poCode) {
                this.localService.getPoCode(+this.poCode).pipe(take(1)).subscribe( val => {
                    this.putData = val;
                    this.isDataAvailable = true;
                });
            } else {
                this.isDataAvailable = true;
            }
            this.poConfig = [
                {
                    type: 'select',
                    label: 'Supplier',
                    name: 'supplier',
                    options: this.localService.getAllSuppliers(),
                    validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'Supplier Required',
                        }
                    ]
                },
                {
                    type: 'select',
                    label: 'PO initial',
                    name: 'contractType',
                    options: this.genral.getContractType(),
                    validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'PO initial Required',
                        }
                    ]
                },
                {
                    type: 'input',
                    label: '#PO',
                    inputType: 'number',
                    name: 'code',
                    disable: true,
                },
                {
                    type: 'button',
                    label: 'Submit',
                    name: 'submit',
                }
            ];
        } else{
            this.isDataAvailable = true;
            this.poConfig = [
                {
                    type: 'bigexpand',
                    name: 'origionPoCodes',
                    label: 'Mixed PO#s',
                    options: 'aloneInline',
                    collections: [
                        {
                            type: 'selectgroup',
                            inputType: 'supplierName',
                            options: this.localService.findAllPoCodes(),
                            collections: [
                                {
                                    type: 'select',
                                    label: 'Supplier',
                                },
                                {
                                    type: 'select',
                                    label: '#PO',
                                    name: 'poCode',
                                    collections: 'somewhere',
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
                    type: 'input',
                    label: 'Display value',
                    inputType: 'text',
                    name: 'display',
                    // disable: true,
                },
                {
                    type: 'button',
                    label: 'Submit',
                    name: 'submit',
                }
            ];
        }
    }
    
    constructor(private genral: Genral, private localService: OrdersService, public dialogRef: MatDialogRef<AddEditPoDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.poCode = data.poCode;
            this.mainLabel = data.mainLabel
        }
    
    submit(value: any) {
        this.dialogRef.close(value);
    }


    onNoClick(): void {
        this.dialogRef.close('closed');
    }

}

