import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { CountinersService } from './countiners.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'countiners-arrival',
    template: `
      <dynamic-form [fields]="regConfig" [mainLabel]="'Countiners arrival'" (submit)="submit($event)" (cancel)="cancel()">
      </dynamic-form>
    `
  })
export class CountinersArrivalComponent implements OnInit, OnDestroy {
    destroySubject$: Subject<void> = new Subject();

    @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;
    

    regConfig: FieldConfig[];

    submit(value: any) {
    //   this.localService.setOrder(value).pipe(takeUntil(this.destroySubject$)).subscribe( val => {
    //          // tslint:disable-next-line: no-use-before-declare
        
    //   });
    }
    cancel() {
        this.location.back();
       }

      constructor(private _Activatedroute:ActivatedRoute,
         private localService: CountinersService, private genral: Genral, private location: Location, public dialog: MatDialog) {
        }


      ngOnInit() {
        

        this.regConfig = [
            {
                type: 'select',
                label: 'Booking number',
                name: 'itekkm',
                options: this.genral.getCountries(),
            },
            {
                type: 'select',
                label: 'Countiner size',
                name: 'itekkmmmm',
                options: this.genral.getCountries(),
            },
            {
                type: 'input',
                label: 'Countiner number',
                name: 'weight',
                inputType: 'number',
            },
            {
                type: 'input',
                label: 'Seal number',
                name: 'wejjight',
                inputType: 'number',
            },
            {
                type: 'date',
                label: 'Date',
                value: new Date(),
                name: 'Date',
            },
            {
                type: 'select',
                label: 'Driver',
                name: 'itkkkem',
                options: this.genral.getCountries(),
            },
            {
                type: 'input',
                label: 'Name',
                name: 'wejjiggggght',
                inputType: 'text',
            },
            {
                type: 'textarray',
                label: 'Address',
                name: 'wejjigmmmht',
                inputType: 'text',
            },
            {
                type: 'array',
                label: 'Phone',
                inputType: 'number',
                name: 'phones',
            },
            {
                type: 'array',
                label: 'Email',
                inputType: 'text',
                name: 'emails',
                validations: [
                    {
                        name: 'pattern',
                        validator: Validators.pattern(
                            '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
                        ),
                        message: 'Invalid email'
                    }
                ]
            },
            {
                type: 'input',
                label: 'Truck number',
                name: 'wejjlllight',
                inputType: 'number',
            },
            {
                type: 'input',
                label: 'ID number',
                name: 'wejjijjsght',
                inputType: 'number',
            },
            {
                type: 'input',
                label: 'place of issue',
                name: 'wejkkkoojijjsght',
                inputType: 'text',
            },
            {
                type: 'button',
                label: 'Submit bouns',
                name: 'submit',
            }
        ];
       }

        
       ngOnDestroy() {
        this.destroySubject$.next();
      }

  }


