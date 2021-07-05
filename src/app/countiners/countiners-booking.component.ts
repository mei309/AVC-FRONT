
import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { CountinersService } from './countiners.service';
@Component({
    selector: 'countiners-booking-component',
    template: `
    <dynamic-form [putData]="putData" mainLabel="Cashew order" [fields]="regConfig" (submitForm)="submit($event)" i18n-mainLabel>
    </dynamic-form>
    `
  })
export class CountinersBookingComponent implements OnInit {
    
    putData: any = null;
    regConfig: FieldConfig[];


    constructor(private genral: Genral, private localService: CountinersService) {
       }


     ngOnInit() {
        this.regConfig = [
            {
                type: 'date',
                label: $localize`Contract date`,
                value: 'timeNow',
                name: 'recordedTime',
                options: 'withTime',
                disable: true,
            },
            {
                type: 'input',
                label: $localize`Person in charge`,
                name: 'personInCharge',
                inputType: 'text',
            },
            {
                type: 'select',
                label: $localize`Logistics company`,
                name: 'logisticsCompany',
                options: this.genral.getAllItemsCashew(),
            },
            {
                type: 'bigexpand',
                label: $localize`Booked containers`,
                name: 'bookedContainers',
                value: 'required',
                collections: [
                    {
                        type: 'input',
                        label: $localize`Bill number`,
                        name: 'billNumber',
                    },
                    {
                        type: 'input',
                        label: $localize`Vessel`,
                        name: 'vessel',
                    },
                    {
                        type: 'input',
                        label: $localize`Shipping company`,
                        name: 'shippingCompany',
                    },
                    {
                        type: 'select',
                        label: $localize`Destination port`,
                        name: 'destinationPort',
                        options: this.localService.getShippingPorts(),
                        // disable: true,
                    },
                    {
                        type: 'date',
                        label: $localize`Etd`,
                        name: 'etd',
                        // value: new Date()
                    },
                    {
                        type: 'selectNormal',
                        label: $localize`Container type`,
                        name: 'containerType',
                        value: '_20FEET',
                        options: this.genral.getShippingContainerType(),
                        // disable: true,
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ],
                // validations: [
                    // {
                    //     name: 'numberUnits',
                    //     message: 'a orderd item must have weight and price and delivery date',
                    //     validator: [
                    //         {
                    //             name: 'amount',
                    //         },
                    //         {
                    //             name: 'measureUnit',
                    //         },
                    //     ],
                    // },
                    // {
                    //     name: 'deliveryDate',
                    // }, 
                // ]
            },
            {
                type: 'button',
                label: $localize`Submit`,
                name: 'submit',
            }
        ]
   }

    submit(value: any) { 
        value['orderItems'].forEach(element => {
            if(!element['unitPrice']['amount']) {
                delete element['unitPrice'];
            }
        });
        const fromNew: boolean = this.putData === null || this.putData === undefined;
        // this.localService.addEditCashewOrder(value, fromNew).pipe(take(1)).subscribe( val => {
        //     const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
        //         width: '80%',
        //         data: {order: val, fromNew: true, type: 'Cashew order'}
        //     });
        //     dialogRef.afterClosed().subscribe(data => {
        //         if (data === 'Edit order') {
        //             this.putData = val;
        //             this.isDataAvailable = false;
        //             this.setRegEdit();
        //             this.addRestReg();
        //             this.cdRef.detectChanges();
        //             this.isDataAvailable = true;
        //         } else if(data === 'Receive') {
        //             this.router.navigate(['../CashewReceived',{poCode: val['poCode']['id']}], { relativeTo: this._Activatedroute });
        //         } 
        //         // else if(data === 'Sample weights') {
        //         //     this.router.navigate(['../SampleWeights',{poCode: JSON.stringify(event['poCode'])}], { relativeTo: this._Activatedroute });
        //         //   }
        //           else {
        //             this.router.navigate(['../CashewOrders'], { relativeTo: this._Activatedroute });
        //         }
        //     });
        // });
    }

  }




