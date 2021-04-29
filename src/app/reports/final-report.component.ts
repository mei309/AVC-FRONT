import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'final-report',
  template:`
    <fieldset [ngStyle]="{'width':'90%'}">
        <legend><h1 i18n>PO# Details</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
        <mat-tab-group *ngIf="isDataAvailable">
            <mat-tab label="Summary" i18n-label>
                <ng-template matTabContent>
                    <final-report-summary [poCode]="poCode">
                    </final-report-summary>
                </ng-template>
            </mat-tab>
            <mat-tab label="Full details" i18n-label>
                <ng-template matTabContent>
                    <final-report-full [poCode]="poCode">
                    </final-report-full>
                </ng-template>
            </mat-tab>
            <mat-tab label="Graphs" i18n-label>
                <ng-template matTabContent>
                    <final-report-charts *ngIf="finalReport" [finalReport]="finalReport">
                    </final-report-charts>
                    <mat-spinner *ngIf="!finalReport"></mat-spinner>
                </ng-template>
            </mat-tab>
            <mat-tab label="Final report" i18n-label>
                <ng-template matTabContent>
                    <final-report-table *ngIf="finalReport" [dataSource]="finalReport">
                    </final-report-table>
                    <mat-spinner *ngIf="!finalReport"></mat-spinner>
                </ng-template>
            </mat-tab>
        </mat-tab-group>
        <mat-spinner *ngIf="!isDataAvailable && poCode"></mat-spinner>
    </fieldset>
  ` ,
})
export class FinalReportComponent {

    @ViewChild(MatAccordion) accordion: MatAccordion;
    navigationSubscription;

    
    form: FormGroup;
    poCode: number;
    poConfig: FieldConfig[];
    finalReport;
    isDataAvailable = false;

    constructor(private router: Router, private cdRef:ChangeDetectorRef, private fb: FormBuilder, private localService: ReportsService, private _Activatedroute: ActivatedRoute, private genral: Genral) {}
    
    ngOnInit() {
        this.form = this.fb.group({poCode: this.fb.control('')});
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('poCode')) {
                this.poCode = +params.get('poCode');
                this.isDataAvailable = true;
                // this.localService.getAllProcesses(this.poCode).pipe(take(1)).subscribe( val => {
                //     this.poDetails = val;
                //     this.isDataAvailable = true;
                // });
                this.localService.getPoFinalReport(this.poCode).pipe(take(1)).subscribe( val1 => {
                    this.finalReport = val1;
                });
                this.localService.getAllPoCodes().pipe(take(1)).subscribe( val1 => {
                    this.form.get('poCode').setValue(val1.find(element => element.id === this.poCode));
                });
            }
        });  
        this.form.get('poCode').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id')) {
                if(selectedValue['id'] !== this.poCode) {
                    this.isDataAvailable = false;
                    this.poCode = selectedValue['id'];
                    this.finalReport = null;
                    this.cdRef.detectChanges();
                    this.isDataAvailable = true;
                    // this.localService.getAllProcesses(this.poCode).pipe(take(1)).subscribe( val => {
                    //     this.poDetails = val;
                    //     this.isDataAvailable = true;
                    // });
                    this.localService.getPoFinalReport(this.poCode).pipe(take(1)).subscribe( val1 => {
                        this.finalReport = val1;
                    });
                }
                
            }
        }); 
        this.poConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.getAllPoCodes(),
                collections: [
                    {
                        type: 'select',
                        label: $localize`Supplier`,
                    },
                    {
                        type: 'select',
                        label: $localize`#PO`,
                        name: 'poCode',
                        collections: 'somewhere',
                    },
                ]
            },
        ];
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
              this.isDataAvailable = false;
              this.finalReport = null;
              this.form.get('poCode').setValue(null);
              this.cdRef.detectChanges();
              this.isDataAvailable = true;
            }
        }); 
    }



      ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }
}