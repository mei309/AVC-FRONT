import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { CountinersService } from './countiners.service';
@Component({
    selector: 'shipment-codes',
    template: `
    <h1 style="text-align:center" i18n>Shipment codes</h1>
    <div class="centerButtons">
        <button mat-raised-button color="primary" (click)="newDialog()" i18n>Add code</button>
    </div>
    <search-details [dataSource]="shipmentSource" [oneColumns]="columnsShipment" (details)="newDialog($event)">
    </search-details>
    `
  })
export class ShipmentCodesComponent implements OnInit {

    shipmentSource;
    columnsShipment;

    constructor(private localService: CountinersService, public dialog: MatDialog) {
      }

    ngOnInit() {
        this.columnsShipment = [
            {
                type: 'normal',
                name: 'code',
                label: $localize`Code`,
            },
            {
                type: 'normal',
                label: $localize`Destination port`,
                name: 'portOfDischargeValue',
                // search: 'selectAsyncObject',
                // options: this.localService.getShippingPorts(),
            },
            {
                type: 'normal',
                name: 'value',
                label: $localize`Display`,
            },
        ];
        this.localService.findShipmentCodes().pipe(take(1)).subscribe(value => {
            this.shipmentSource = value;
        });
    }

    newDialog(value?: any): void {
        const dialogRef = this.dialog.open(AddEditShipmentDialog, {
          width: '80%',
          height: '80%',
          data: {
              putData: value? value : null
            }
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data === 'success') {
                this.localService.findShipmentCodes().pipe(take(1)).subscribe(value => {
                    this.shipmentSource = value;
                });
            }
        });
    }
}

@Component({
  selector: 'add-edit-shipment',
  template: `
        <dynamic-form [putData]="putData" [fields]="shipConfig" [mainLabel]="putData? 'Edit code' : 'Add code'" (submitForm)="submit($event)" popup="true">
        </dynamic-form>
  `,
})
export class AddEditShipmentDialog {

    shipConfig;
    putData;

    ngOnInit(){
            this.shipConfig = [
                {
                    type: 'input',
                    label: $localize`Code`,
                    inputType: 'number',
                    name: 'code',
                    disable: true,
                },
                {
                    type: 'select',
                    label: $localize`Destination port`,
                    name: 'portOfDischarge',
                    value: this.putData? this.putData['portOfDischargeValue'] : null,
                    options: this.localService.getShippingPorts(),
                    validations: [
                          {
                              name: 'required',
                              validator: Validators.required,
                              message: $localize`Destination port Required`,
                          }
                      ]
                },
                {
                    type: 'button',
                    label: $localize`Submit`,
                    name: 'submit',
                }
            ];
    }

    constructor(private localService: CountinersService, public dialogRef: MatDialogRef<AddEditShipmentDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.putData = data.putData;
        }

    submit(value: any) {
        this.localService.addEditShipmentCode(value, this.putData? false : true).pipe(take(1)).subscribe( val => {
            this.dialogRef.close('success');
        });
    }


    onNoClick(): void {
        this.dialogRef.close('closed');
    }

}

