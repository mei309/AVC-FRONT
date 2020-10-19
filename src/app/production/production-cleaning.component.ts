import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
@Component({
    selector: 'production-cleaning',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1>Cleaning cashew process</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <export-import [beginData]="putData" [newUsed]="newUsed" [mainLabel]="'Clean'" (submit)="submit($event)">
        </export-import>
    </div>
    `
  })
export class ProductionCleaningComponent implements OnInit {
    navigationSubscription;

    form: FormGroup;
    isDataAvailable: boolean = false
    isFormAvailable: boolean = false;
    poConfig;
    putData;
    newUsed;

    poID: number;
    submit(value: any) {
        this.localService.addEditCleaningTransfer(value, this.putData? false : true).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
                width: '80%',
                data: {productionCheck: val, fromNew: true, type: 'Cleaning'}
              });
              dialogRef.afterClosed().subscribe(result => {
                  if (result === 'Edit') {
                    this.isFormAvailable = false;
                    this.cdRef.detectChanges();
                    this.localService.getTransferProductionWithStorage(val['id'], val['poCode']['id'], 'raw').pipe(take(1)).subscribe( val => {
                        this.putData = val[0];
                        this.newUsed = val[1]
                        this.isFormAvailable = true;
                    });
                  } else {
                    this.router.navigate(['../Productions'], { relativeTo: this._Activatedroute });
                  }
              });
            
        });
    }

      constructor(private _Activatedroute:ActivatedRoute, private router: Router, private fb: FormBuilder, private cdRef: ChangeDetectorRef,
         private localService: ProductionService, private genral: Genral, private location: Location, public dialog: MatDialog) {
        }


    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                this.localService.getTransferProductionWithStorage(+params.get('id'), +params.get('poCode'), 'raw').pipe(take(1)).subscribe( val => {
                    this.putData = val[0];
                    this.newUsed = val[1]
                    this.isFormAvailable = true;
                });
                this.poID = +params.get('id');
            } else {
                this.form = this.fb.group({});
                this.form.addControl('poCode', this.fb.control(''));
                this.form.get('poCode').valueChanges.subscribe(selectedValue => {
                    if(selectedValue && selectedValue.hasOwnProperty('id') && this.poID != selectedValue['id']) { 
                        this.localService.getStorageRawPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
                            this.newUsed = val;
                            console.log(val);
                            
                            this.isFormAvailable = true;
                        }); 
                        this.isDataAvailable = false;
                        this.poID = selectedValue['id'];
                    }
                });
                this.isDataAvailable = true;
                this.setPoConfig();   
            } 
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.isFormAvailable = false;
                this.putData = null;
                this.newUsed = null;
                this.cdRef.detectChanges();
                if(!this.poConfig) {
                    this.setPoConfig();
                }
                this.isDataAvailable = true;
            }
        });
    }
    setPoConfig() {
        this.poConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.getAllPosRaw(),
                collections: [
                    {
                        type: 'select',
                        label: 'Supplier',
                    },
                    {
                        type: 'select',
                        label: '#PO',
                        name: 'poCode',
                        collections: 'somewhere',
                    },
                ]
            },
        ];
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

  }