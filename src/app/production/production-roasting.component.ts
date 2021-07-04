import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
import { cloneDeep } from 'lodash-es';
@Component({
    selector: 'production-roasting',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1 i18n>Roasting cashew process</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <export-import [beginData]="putData" [newUsed]="newUsed" [mainLabel]="'Roast'" (submitExIm)="submit($event)">
        </export-import>
    </div>
    `
})
export class ProductionRoastingComponent implements OnInit {
    navigationSubscription;

    form: FormGroup;
    isDataAvailable: boolean = false;
    isFormAvailable: boolean = false;
    poConfig;
    putData;
    newUsed;

    submit(value: any) {
        this.localService.addEditRoastingTransfer(value, this.putData? false : true).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
                width: '80%',
                data: {productionCheck: cloneDeep(val), fromNew: true, type: 'Roasting'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === $localize`Edit`) {
                    this.isFormAvailable = false;
                    this.cdRef.detectChanges();
                    this.localService.getProductionWithStorage(val['id'], val['poCode']['id'], 'clean').pipe(take(1)).subscribe( val => {
                        this.putData = val[0];
                        this.newUsed = val[1];
                        this.isFormAvailable = true;
                    });
                } else {
                    this.router.navigate(['../Productions', {number: 1}], { relativeTo: this._Activatedroute });
                }
            });
            
        });
    }

    constructor(private _Activatedroute:ActivatedRoute, private router: Router, private fb: FormBuilder, private cdRef:ChangeDetectorRef,
        private localService: ProductionService, public dialog: MatDialog) {
        }


    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                this.localService.getProductionWithStorage(+params.get('id'), +params.get('poCode'), 'clean').pipe(take(1)).subscribe( val => {
                    this.putData = val[0];
                    this.newUsed = val[1];
                    this.isFormAvailable = true;
                });
            } else {
                this.setBeginChoose();
            }
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.isFormAvailable = false;
                this.putData = null;
                this.newUsed = null;
                if(this.poConfig) {
                    this.form.get('poCode').setValue(null);
                } else {
                    this.setBeginChoose();
                }
                this.cdRef.detectChanges();
                this.isDataAvailable = true;
            }
        });
    }
    setBeginChoose() {
        this.form = this.fb.group({});
        this.form.addControl('poCode', this.fb.control(''));
        this.form.get('poCode').valueChanges.pipe(distinctUntilChanged()).subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id')) { 
                this.localService.getStorageCleanPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
                    this.newUsed = val;
                    this.isFormAvailable = true;
                }); 
                this.isDataAvailable = false;
            }
        });
        this.isDataAvailable = true;
        this.poConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.getAllPosClean(),
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
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

}