import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { SpecialOrdersService } from './special-orders.service';
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'new-special-order',
    template: `
    <dynamic-form [putData]="putData" [fields]="regConfig" [mainLabel]="'special order'" (submitForm)="submit($event)" (cancel)="cancel()">
    </dynamic-form>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class NewSpecialOrderComponent implements OnInit, OnDestroy {

    destroySubject$: Subject<void> = new Subject();

    @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;
    
    regConfig: FieldConfig[];
    putData: any = null;

    submit(value: any) {
      console.log('asdes');

      this.localService.setOrder(value).pipe(takeUntil(this.destroySubject$)).subscribe( val => {
             // tslint:disable-next-line: no-use-before-declare
        
      });
    }
    cancel() {
        this.location.back();
       }

      constructor(private _Activatedroute:ActivatedRoute,
         private localService: SpecialOrdersService, private genral: Genral, private location: Location, public dialog: MatDialog) {
        }


      ngOnInit() {
        this._Activatedroute.paramMap.pipe(takeUntil(this.destroySubject$)).subscribe(params => {
          if (params.get('id')) {
            this.putData = this.localService.takeData();
          }
        });
        

        this.regConfig = [
            {
                type: 'select',
                label: 'Destination',
                name: 'destination',
                options: this.genral.getCountries(),
            },
            {
                type: 'date',
                label: 'Orderd date',
                value: new Date(),
                name: 'orderdDate',
            },
            {
                type: 'bigexpand',
                label: 'Orderd products',
                name: 'cashew',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption(bag)',
                        name: 'item',
                        options: this.genral.getCountries(),
                    },
                    {
                        type: 'input',
                        label: 'Units',
                        name: 'units',
                        inputType: 'number',
                    },
                    {
                        type: 'select',
                        label: 'Units per case',
                        name: 'unitsType',
                        options: this.genral.getCountries(),
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


