import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { QcService } from './qc.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'qc-machins',
    template: `
    <dynamic-form [fields]="regConfig" [mainLabel]="'Machins check'" (submit)="submit($event)" (cancel)="cancel()">
    </dynamic-form>
    `
  })

// tslint:disable-next-line: component-class-suffix
export class QcMachinsComponent implements OnInit, OnDestroy {

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
         private localService: QcService, private genral: Genral, private location: Location, public dialog: MatDialog) {
        }


      ngOnInit() {
        

        this.regConfig = [
            {
                type: 'select',
                label: 'Machine name',
                name: 'Line',
                options: this.genral.getCities(),
            },
            {
                type: 'input',
                label: 'Quality',
                name: 'EB',
                inputType: 'text'
            },
            {
                type: 'input',
                label: 'Status',
                name: 'EC',
                inputType: 'text'
            },
            {
                type: 'input',
                label: 'Cleanins',
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


