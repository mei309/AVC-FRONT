import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from './../genral.service';
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'genral-count',
    template: `
      <dynamic-form [fields]="regConfig" [mainLabel]="'Genral count'" (submitForm)="submit($event)" (cancel)="cancel()">
      </dynamic-form>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class GenralCountComponent implements OnInit, OnDestroy {

    destroySubject$: Subject<void> = new Subject();

    @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;
    
    regConfig: FieldConfig[];

    submit(value: any) {
      /*this.localService.setOrder(value).pipe(takeUntil(this.destroySubject$)).subscribe( val => {
             // tslint:disable-next-line: no-use-before-declare
        
      });**/
    }
    cancel() {
        this.location.back();
       }

      constructor(private genral: Genral, private location: Location, public dialog: MatDialog) {
        }


      ngOnInit() {
        
        
        this.regConfig = [
            {
                type: 'date',
                label: 'Date',
                value: new Date(),
                name: 'Date',
            },
            {
                type: 'input',
                label: 'Staff',
                name: 'Staff',
            },
            {
                type: 'bigexpand',
                label: 'Product',
                name: 'Product',
                collections: [
                    {
                        type: 'select',
                        label: 'Item descrption',
                        name: 'item',
                        options: this.genral.getCountries(),
                    },
                    {
                        type: 'input',
                        label: 'Quantity',
                        name: 'quantity',
                        inputType: 'number',
                    },
                    {
                        type: 'select',
                        label: 'Storge location',
                        name: 'StorgeLocation',
                        options: this.genral.getCountries()
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            {
                type: 'button',
                label: 'Submit count',
                name: 'submit',
            }
        ];
       }

       ngOnDestroy() {
        this.destroySubject$.next();
      }

  }


