import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from './../genral.service';
import { InventoryService } from './inventory.service';
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'cashew-count',
    template: `
      <dynamic-form [fields]="regConfig" [mainLabel]="'Cashew count'" (submit)="submit($event)" (cancel)="cancel()">
      </dynamic-form>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class CashewCountComponent implements OnInit, OnDestroy {

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

      constructor(private _Activatedroute:ActivatedRoute,
         private localService: InventoryService, private genral: Genral, private location: Location, public dialog: MatDialog) {
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
                        type: 'select',
                        label: 'PO#',
                        name: 'PO',
                        options: this.genral.getCountries(),
                    },
                    {
                        type: 'inputselect',
                        collections: [
                            {
                                type: 'input',
                                label: 'Weight per bag',
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


