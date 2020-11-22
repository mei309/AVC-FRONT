import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { QcService } from './qc.service';

@Component({
    selector: 'qc-roasting',
    template: `
    <h1 style="text-align:center">
      Roasting cashew form
    </h1>
    <mat-horizontal-stepper linear #stepper>
        <mat-step >
            <dynamic-form [fields]="regConfig" (submitForm)="goNext($event)" (cancel)="cancel()">
            </dynamic-form>
        </mat-step>
        <mat-step >
            <mat-tab-group (selectedIndexChange)="changed($event)">
                <mat-tab label="Roaster tempeture and times">
                    <dynamic-form [fields]="regConfigTempeture" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Roaster oil test">
                    <dynamic-form [fields]="regConfigOiltest" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Roasted product check">
                    <dynamic-form [fields]="regConfigProductCheck" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Bacteria check">
                    <dynamic-form [fields]="regConfigBactria" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
            </mat-tab-group>
        </mat-step>
    </mat-horizontal-stepper>
    `
  })
export class QcRoastingComponent implements OnInit, OnDestroy {

    destroySubject$: Subject<void> = new Subject();

    @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;
    @ViewChild('stepper', {static: false}) private myStepper: MatStepper;



    regConfig: FieldConfig[];
    regConfigTempeture: FieldConfig[];
    regConfigOiltest: FieldConfig[];
    regConfigProductCheck: FieldConfig[];
    regConfigBactria: FieldConfig[];
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
         private localService: QcService, private genral: Genral, private location: Location, public dialog: MatDialog) {
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

        this.regConfigTempeture = [
            {
                type: 'radiobutton',
                label: 'roaster',
                name: 'roaster',
                options: ['4000', '2000'],
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Required'
                    },
                ]
            },
            {
                type: 'array',
                label: 'Thermocouple Reading ',
                name: 'Thermocouple Reading ',
                inputType: 'text',
                collections: '6',
            },
            {
                type: 'input',
                label: 'Belt Speed',
                name: 'Belt Speed',
                inputType: 'text'
            },
            {
                type: 'input',
                label: 'Actual Time Product in Oil/Roaster',
                name: 'Actual Time Product in Oil/Roaster',
                inputType: 'text'
            },
            {
                type: 'array',
                label: 'Circular Chart Reading',
                name: 'Circular Chart Reading',
                inputType: 'text',
                collections: '4',
            },
            {
                type: 'input',
                label: 'Digital Analog Dial Time',
                name: 'Digital Analog Dial Time',
                inputType: 'text'
            },
            {
                type: 'textarry',
                label: 'Remarks',
                name: 'remarks',
                inputType: 'text'
            },
            {
                type: 'select',
                label: 'Operater',
                name: 'operater',
                options: this.genral.getCities(),
            },
            {
                type: 'input',
                label: 'Password',
                name: 'Password',
                inputType: 'text'
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];

        this.regConfigOiltest = [
            {
                type: 'radiobutton',
                label: 'roaster',
                name: 'roaster',
                options: ['4000', '2000'],
            },
            {
                type: 'input',
                label: 'oil quality',
                name: 'oil quality',
                inputType: 'text'
            },
            {
                type: 'textarry',
                label: 'Remarks',
                name: 'remarks',
                inputType: 'text'
            },
            {
                type: 'select',
                label: 'Operater',
                name: 'operater',
                options: this.genral.getCities(),
            },
            {
                type: 'input',
                label: 'Password',
                name: 'Password',
                inputType: 'text'
            },
            {
                type: 'button',
                label: 'Submit order',
                name: 'submit',
            }
        ];


        this.regConfigProductCheck = [
            {
                type: 'input',
                label: 'sampeled weight (oz)',
                name: 'sampeled weight (oz)',
                inputType: 'number'
            },
            {
                type: 'input',
                label: 'salt%',
                name: 'salt%',
                inputType: 'number'
            }, 
            {
                type: 'input',
                label: 'count',
                name: 'count',
                inputType: 'number'
            },
            {
                type: 'input',
                label: 'defect (oz)',
                name: 'defect (oz)',
                inputType: 'number'
            },
            {
                type: 'input',
                label: 'breakage (oz)',
                name: 'breakage (oz)',
                inputType: 'number'
            },
            {
                type: 'radiobutton',
                label: 'product lebeling',
                name: 'product lebeling',
                options: ['ok', 'not ok'],
            },
            {
                type: 'input',
                label: 'humidity(%)',
                name: 'humidity(%)',
                inputType: 'number'
            }, 
            {
                type: 'textarry',
                label: 'Remarks',
                name: 'remarks',
                inputType: 'text'
            },
            {
                type: 'select',
                label: 'Operater',
                name: 'operater',
                options: this.genral.getCities(),
            },
            {
                type: 'input',
                label: 'Password',
                name: 'Password',
                inputType: 'text'
            },
            {
                type: 'button',
                label: 'Submit order',
                name: 'submit',
            }
        ];

        this.regConfigBactria = [
            {
                type: 'radiobutton',
                label: 'roaster',
                name: 'roaster',
                options: ['4000', '2000'],
            },
            {
                type: 'input',
                label: 'EB',
                name: 'EB',
                inputType: 'text'
            },
            {
                type: 'input',
                label: 'EC',
                name: 'EC',
                inputType: 'text'
            },
            {
                type: 'textarry',
                label: 'Remarks',
                name: 'remarks',
                inputType: 'text'
            },
            {
                type: 'select',
                label: 'Operater',
                name: 'operater',
                options: this.genral.getCities(),
            },
            {
                type: 'input',
                label: 'Password',
                name: 'Password',
                inputType: 'text'
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
 
        
       }

       ngOnDestroy() {
        this.destroySubject$.next();
      }

  }


