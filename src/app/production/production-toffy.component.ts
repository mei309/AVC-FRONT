import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ProductionService } from './production.service';
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'production-toffy',
    template: `
    <h1 style="text-align:center">
      Toffy process
    </h1>
    <mat-horizontal-stepper [linear]="true" #stepper>
        <mat-step >
            <dynamic-form [fields]="regConfig" (submitForm)="goNext($event)" (cancel)="cancel()">
            </dynamic-form>
        </mat-step>
        <mat-step >
            <mat-tab-group (selectedIndexChange)="changed($event)">
                <mat-tab label="Wearhouse export amounts">
                    <dynamic-form [fields]="regConfigWearhouse" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Toffy products">
                    <dynamic-form [fields]="regConfigToffy" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Waste & resources">
                    <dynamic-form [fields]="regConfigWaste" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
            </mat-tab-group>
        </mat-step>
    </mat-horizontal-stepper>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class ProductionToffyComponent implements OnInit, OnDestroy {

    destroySubject$: Subject<void> = new Subject();

    @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;
    @ViewChild('stepper', {static: false}) private myStepper: MatStepper;



    regConfig: FieldConfig[];
    regConfigWearhouse: FieldConfig[];
    regConfigToffy: FieldConfig[];
    regConfigWaste: FieldConfig[];
    step = 0;

    goNext(value) {
        this.myStepper.next();
    }

    changed(value) {
        console.log(value);
        this.step = value;
    }
    submit(value: any) {
      console.log('asdes');

    //   this.localService.setOrder(value).pipe(takeUntil(this.destroySubject$)).subscribe( val => {
    //          // tslint:disable-next-line: no-use-before-declare
        
    //   });
    }
    cancel() {
        this.location.back();
       }

      constructor(private _Activatedroute:ActivatedRoute,
         private localService: ProductionService, private genral: Genral, private location: Location, public dialog: MatDialog) {
        }


      ngOnInit() {
        

        this.regConfig = [
            {
                type: 'selectgroup',
                inputType: 'Supllier',
                collections: [
                    {
                        type: 'select',
                        label: 'Supllier',
                        name: 'supllier',
                        options: this.genral.getCountries(),
                    },
                    {
                        type: 'select',
                        label: '#PO',
                        name: 'po',
                        options: this.genral.getCities(),
                    },
                ]
            },
            {
                type: 'select',
                label: 'Product',
                name: 'Product',
                options: this.genral.getCities(),
            },
            {
                type: 'date',
                label: 'Date',
                value: new Date(),
                name: 'Date',
            },
            {
                type: 'button',
                label: 'Next',
                name: 'submit',
            }
        ];

        this.regConfigWearhouse = [
            {
                type: 'bigexpand',
                label: 'Amounts',
                name: 'ggg',
                collections: [
                    {
                        type: 'input',
                        label: 'Bag number',
                        name: 'EB1',
                        inputType: 'number'
                    },
                    {
                        type: 'inputselect',
                        collections: [
                            {
                                type: 'input',
                                label: 'Unit weight',
                                name: 'weight',
                                inputType: 'number',
                            },
                            {
                                type: 'select',
                                label: 'Weight unit',
                                name: 'weightType',
                                options: ['KG', 'LB'],
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
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];

        this.regConfigToffy = [
            {
                type: 'bigexpand',
                label: 'Amounts',
                name: 'ggg',
                collections: [
                    {
                        type: 'input',
                        label: 'Bag number',
                        name: 'EB1e',
                        inputType: 'number'
                    },
                    {
                        type: 'inputselect',
                        collections: [
                            {
                                type: 'input',
                                label: 'Unit weight',
                                name: 'weight',
                                inputType: 'number',
                            },
                            {
                                type: 'select',
                                label: 'Weight unit',
                                name: 'weightType',
                                options: ['KG', 'LB'],
                            },
                        ]
                    },
                    {
                        type: 'select',
                        label: 'Storage location',
                        name: 'Branch',
                        options: this.genral.getCities(),
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            {
                type: 'button',
                label: 'Submit order',
                name: 'submit',
            }
        ];

        this.regConfigWaste = [
            {
                type: 'input',
                label: 'Time duration',
                name: 'EB1',
                inputType: 'number'
            },
            {
                type: 'input',
                label: 'Number of workers',
                name: 'EB4',
                inputType: 'number'
            },
            {
                type: 'bigexpand',
                label: 'Materials used',
                name: 'ggg',
                collections: [
                    {
                        type: 'select',
                        label: 'Material',
                        name: 'Branch16',
                        options: this.genral.getCities(),
                    },
                    {
                        type: 'input',
                        label: 'Amount',
                        name: 'EB1yy',
                        inputType: 'number'
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            {
                type: 'button',
                label: 'Submit order',
                name: 'submit',
            }
        ];
 


       }

       ngOnDestroy() {
        this.destroySubject$.next();
      }

  }


