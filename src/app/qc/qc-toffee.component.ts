import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { QcService } from './qc.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'qc-toffee',
    template: `
    <h1 style="text-align:center">
      Toffee form
    </h1>
    <mat-horizontal-stepper [linear]="true" #stepper>
        <mat-step >
            <dynamic-form [fields]="regConfig" (submit)="goNext($event)" (cancel)="cancel()">
            </dynamic-form>
        </mat-step>
        <mat-step >
            <mat-tab-group (selectedIndexChange)="changed($event)">
                <mat-tab label="Bacteria check???">
                    <dynamic-form [fields]="regConfigBactria" (submit)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
                <mat-tab label="Magnets check???">
                    <dynamic-form [fields]="regConfigMagnets" (submit)="submit($event)" (cancel)="cancel()">
                    </dynamic-form>
                </mat-tab>
            </mat-tab-group>
        </mat-step>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class QcToffeeComponent implements OnInit, OnDestroy {

    destroySubject$: Subject<void> = new Subject();

    @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;
    @ViewChild('stepper', {static: false}) private myStepper: MatStepper;



    regConfig: FieldConfig[];
    regConfigBactria: FieldConfig[];
    regConfigMagnets: FieldConfig[];
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

        

        this.regConfigBactria = [
            {
                type: 'select',
                label: 'Line',
                name: 'Line',
                options: this.genral.getCities(),
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
 
        this.regConfigMagnets = [
            {
                type: 'select',
                label: 'Raw station',
                name: 'Raw station',
                options: this.genral.getCities(),
            },
            {
                type: 'input',
                label: 'Volume before',
                name: 'volume before',
                inputType: 'text'
            },
            {
                type: 'input',
                label: 'Volume after',
                name: 'volume after',
                inputType: 'text'
            },
            {
                type: 'select',
                label: 'Hygiene status',
                name: 'hygiene status',
                options: this.genral.getCities(),
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


