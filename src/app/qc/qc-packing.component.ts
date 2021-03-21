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
import { QcService } from './qc.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'qc-packing',
    template: `
    <h1 style="text-align:center">
      Packing cashew form
    </h1>
    <mat-horizontal-stepper linear #stepper>
        <mat-step >
            <dynamic-form [fields]="regConfig" (submitForm)="goNext($event)" (cancel)="cancel()">
            </dynamic-form>
        </mat-step>
        <mat-step >
            <mat-tab-group (selectedIndexChange)="changed($event)">
                <mat-tab label="X-ray check">
                    <dynamic-form [fields]="regConfigXray" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Matel detector check">
                    <dynamic-form [fields]="regConfigMatel" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="bag product check">
                    <dynamic-form [fields]="regConfigBagProduct" (submitForm)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Didnt pass ditactor 3 times">
                    <dynamic-form [fields]="regConfig3Pass" (submitForm)="submit($event)" (cancel)="cancel()">
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

// tslint:disable-next-line: component-class-suffix
export class QcPackingComponent implements OnInit, OnDestroy {

    destroySubject$: Subject<void> = new Subject();

    @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;
    @ViewChild('stepper', {static: false}) private myStepper: MatStepper;



    regConfig: FieldConfig[];
    regConfigXray: FieldConfig[];
    regConfigMatel: FieldConfig[];
    regConfig3Pass: FieldConfig[];
    regConfigBagProduct: FieldConfig[];
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
                        options: this.genral.getWearhouses(),
                    },
                    {
                        type: 'select',
                        label: '#PO',
                        name: 'po',
                        options: this.genral.getWearhouses(),
                    },
                ]
            },
            {
                type: 'select',
                label: 'Product',
                name: 'Product',
                options: this.genral.getWearhouses(),
            },
            {
                type: 'date',
                label: 'Date',
                value: new Date(),
                name: 'Date',
            },
            {
                type: 'select',
                label: 'Line',
                name: 'Line',
                options: this.genral.getWearhouses(),
            },
            {
                type: 'button',
                label: 'Next',
                name: 'submit',
            }
        ];

        this.regConfigXray = [
            {
                type: 'radiobutton',
                label: 'Sus ball(0.6-0.8mm)',
                name: 'Sus ball',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'SuS wire(0.4-0.7mm)',
                name: 'SuS wire',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'Glass ball(3-5mm)',
                name: 'Glass ball',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'Aluminum ball(5-7mm)',
                name: 'Aluminum ball',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'Ceramic ball(2-5mm)',
                name: 'Ceramic ball',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'Memory test and Consecutive test',
                name: 'Memory test',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'Do buckets have locks ?',
                name: 'do buckets have locks',
                options: ['yes', 'no'],
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
                options: this.genral.getWearhouses(),
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

        this.regConfigMatel = [
            {
                type: 'radiobutton',
                label: 'fe(1.2)',
                name: 'fe',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'SuS wire(2.0)',
                name: 'SuS wire',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'non fee(2.0)',
                name: 'non fee',
                options: ['ok', 'not ok'],
            },
            {
                type: 'radiobutton',
                label: 'Memory test and Consecutive test',
                name: 'Memory test',
                options: ['ok', 'not ok'],
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
                options: this.genral.getWearhouses(),
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

        this.regConfigBagProduct = [
            {
                type: 'input',
                label: 'Sample weight',
                name: 'sampleWeight',
                inputType: 'number',
            },
            {
                type: 'inputpercentage',
                label: 'Split/butts/broken',
                name: 'weijjjghtff',
                inputType: 'number',
                collections: 'sampleWeight',
            },
            {
                type: 'inputpercentage',
                label: 'Defects',
                name: 'weightff',
                inputType: 'number',
                collections: 'sampleWeight',
            },
            {
                type: 'inputpercentage',
                label: 'Oxygen',
                name: 'weightfhhhf',
                inputType: 'number',
                collections: 'sampleWeight',
            },
            {
                type: 'inputpercentage',
                label: 'Salt',
                name: 'weigggghtff',
                inputType: 'number',
                collections: 'sampleWeight',
            },
            {
                type: 'inputpercentage',
                label: 'Taste',
                name: 'weiyyyyghtff',
                inputType: 'number',
                collections: 'sampleWeight',
            },
            {
                type: 'inputpercentage',
                label: 'Foreign materials',
                name: 'whheightff',
                inputType: 'number',
                collections: 'sampleWeight',
            },
            {
                type: 'inputpercentage',
                label: 'Weight on can',
                name: 'whheightfhhhf',
                inputType: 'number',
                collections: 'sampleWeight',
            },
            {
                type: 'input',
                label: 'Bag code',
                name: 'Amounttt',
                inputType: 'number'
            },
            {
                type: 'input',
                label: 'Overall packing',
                name: 'Amouujynt',
                inputType: 'number'
            },
            {
                type: 'input',
                label: 'Date and stamp',
                name: 'Amounhht',
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
                options: this.genral.getWearhouses(),
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

        this.regConfig3Pass = [
            {
                type: 'input',
                label: 'Amount',
                name: 'Amount',
                inputType: 'number'
            },
            {
                type: 'input',
                label: 'Foreign object discoverd',
                name: 'foreign object discoverd',
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
                options: this.genral.getWearhouses(),
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
        ]

        this.regConfigBactria = [
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
                options: this.genral.getWearhouses(),
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


