
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { CountinersService } from './countiners.service';
@Component({
    selector: 'countiners-booking-component',
    template: `
    <dynamic-form [putData]="putData" [mainLabel]="'Cashew order'" [fields]="regConfig" (submit)="submit($event)">
    </dynamic-form>
    `
  })
export class CountinersBookingComponent implements OnInit {
    
    putData: any = null;
    regConfig: FieldConfig[];


    constructor(private router: Router, private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
        private localService: CountinersService, private genral: Genral, private dialog: MatDialog) {
       }


     ngOnInit() {
        this.regConfig = [
            {
                type: 'date',
                label: 'Contract date',
                value: new Date(),
                name: 'recordedTime',
                options: 'withTime',
                disable: true,
            },
            {
                type: 'input',
                label: 'Person in charge',
                name: 'personInCharge',
                inputType: 'text',
            },
            {
                type: 'select',
                label: 'Logistics company',
                name: 'logisticsCompany',
                options: this.genral.getAllItemsCashew(),
            },
            {
                type: 'bigexpand',
                label: 'Booked containers',
                name: 'bookedContainers',
                value: 'required',
                collections: [
                    {
                        type: 'input',
                        label: 'Bill number',
                        name: 'billNumber',
                    },
                    {
                        type: 'input',
                        label: 'Vessel',
                        name: 'vessel',
                    },
                    {
                        type: 'input',
                        label: 'Shipping company',
                        name: 'shippingCompany',
                    },
                    {
                        type: 'select',
                        label: 'Destination port',
                        name: 'destinationPort',
                        options: this.genral.getShippingPorts(),
                        // disable: true,
                    },
                    {
                        type: 'date',
                        label: 'Etd',
                        name: 'etd',
                        // value: new Date()
                    },
                    {
                        type: 'selectNormal',
                        label: 'Container type',
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
                label: 'Submit',
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
        console.log(value);
        
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




