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
        <button class="raised-margin" mat-raised-button color="primary" (click)="addDialog()">Add #PO</button>
    </div>
    <button class="raised-margin" mat-raised-button color="primary" (click)="addDialog()">Add #PO</button>
    <search-details [dataSource]="posSource" [oneColumns]="columnsPos">
    </search-details>
    `
  })
export class PoCodesComponent implements OnInit {
    
    posSource;
    columnsPos;
    
    constructor(private localService: OrdersService, private genral: Genral, public dialog: MatDialog) {
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
                options: this.genral.getSupplierCashew(),
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
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data && data !== 'closed') {
                this.localService.addPoCode(data).pipe(take(1)).subscribe( val => {
                    this.localService.findAllPoCodes().pipe(take(1)).subscribe(value => {
                        this.posSource = value;
                    });
                });
            }
        });
    }

    // editProcessAlerts(localValue: any) {
    //     (details)="editDialog($event)"
    // }
}

@Component({
  selector: 'add-edit-po',
  template: `
  <dynamic-form [fields]="poConfig" mainLabel="'Add #PO'" (submitForm)="submit($event)">
    </dynamic-form>
  `,
})
export class AddEditPoDialog {
 
    poConfig;
    
  

    ngOnInit(){
        this.poConfig = [
                    {
                        type: 'select',
                        label: 'Supplier',
                        name: 'supplier',
                        options: this.genral.getSupplierCashew(),
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
    }
    
    constructor(private genral: Genral, public dialogRef: MatDialogRef<AddEditPoDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            
        }
    
    submit(value: any) {
        this.dialogRef.close(value);
    }


    onNoClick(): void {
        this.dialogRef.close('closed');
    }

}

