import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { CounteinersDetailsDialogComponent } from './counteiners-details.component';
import { CountinersService } from './countiners.service';
@Component({
    selector: 'countiners-arrival',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [putData]="putData" [mainLabel]="'Countiners arrival'" [fields]="regConfig" (submitForm)="submit($event)">
        </dynamic-form>
    </div>
    `
  })
export class CountinersArrivalComponent implements OnInit, OnDestroy {
    navigationSubscription;
    
    putData: any = null;
    isDataAvailable = false;
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
            },
            {
                type: 'select',
                label: 'Product company',
                name: 'productCompany',
                options: this.localService.getShippingSuppliers(),
            },
            {
                type: 'bignotexpand',
                label: 'Shiping details',
                name: 'shipingDetails',
                value: 'required',
                collections: [
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
                        label: 'Loading port',
                        name: 'portOfLoading',
                        options: this.localService.getShippingPorts(),
                    },
                    {
                        type: 'date',
                        label: 'Etd',
                        name: 'etd',
                        // value: new Date()
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: 'Etd Required',
                            }
                        ]
                    },
                    {
                        type: 'select',
                        label: 'Destination port',
                        name: 'portOfDischarge',
                        options: this.localService.getShippingPorts(),
                    },
                    {
                        type: 'date',
                        label: 'Eta',
                        name: 'eta',
                        // value: new Date()
                        validations: [
                            {
                                name: 'required',
                                validator: Validators.required,
                                message: 'Eta Required',
                            }
                        ]
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ],
            },
            {
                type: 'bignotexpand',
                label: 'Container details',
                name: 'containerDetails',
                collections: [
                    {
                        type: 'input',
                        label: 'Container number',
                        name: 'containerNumber',
                        validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'Container number Required',
                        }
                        ]
                    },
                    {
                        type: 'input',
                        label: 'Seal number',
                        name: 'sealNumber',
                        validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'Seal number Required',
                        }
                        ]
                    },
                    {
                        type: 'selectNormal',
                        label: 'Container type',
                        name: 'containerType',
                    //   value: '20\'',
                        options: this.genral.getShippingContainerType(),
                        validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'Container type Required',
                        }
                        ]
                    },
                ],
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
       ];
       this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                var id = +params.get('id');
                this.localService.getContainerArrival(id).pipe(take(1)).subscribe( val => {
                    this.putData = val;
                    this.isDataAvailable = true;
                });
            } else {
                this.isDataAvailable = true;
            }
        });
       this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.putData = null;
                this.cdRef.detectChanges();
                this.isDataAvailable = true;
            }
        });
   }


    submit(value: any) { 
        const fromNew: boolean = this.putData === null || this.putData === undefined;
        this.localService.addEditContainerArrival(value, fromNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(CounteinersDetailsDialogComponent, {
                width: '80%',
                data: {loading: cloneDeep(val), fromNew: true, type: 'Arrivals'}
            });
            dialogRef.afterClosed().subscribe(data => {
                if (data === 'Edit') {
                    this.putData = val;
                    this.isDataAvailable = false;
                    this.cdRef.detectChanges();
                    this.isDataAvailable = true;
                } else {
                    this.router.navigate(['../CountinerReports'], { relativeTo: this._Activatedroute });
                }
            });
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

  }


