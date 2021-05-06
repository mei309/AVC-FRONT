import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
import { cloneDeep } from 'lodash-es';
@Component({
    selector: 'production-packing',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1 i18n>Packing cashew process</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <export-import [beginData]="putData" [newUsed]="newUsed" [posArray]="posArray" [mainLabel]="'Pack'" (submitExIm)="submit($event)">
        </export-import>
    </div>
    `
})
export class ProductionPackingComponent implements OnInit {
    navigationSubscription;

    form: FormGroup;
    isDataAvailable: boolean = false;
    isFormAvailable: boolean = false;
    poConfig;
    putData;
    newUsed;

    posArray;

    submit(value: any) {
        this.localService.addEditPackingTransfer(value, this.putData? false : true).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
                width: '80%',
                data: {productionCheck: cloneDeep(val), fromNew: true, type: 'Packing'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === $localize`Edit`) {
                    this.isFormAvailable = false;
                    this.cdRef.detectChanges();
                    if(val['weightedPos']) {
                        console.log(this.posArray);
                        
                        let pos = val['weightedPos'].map(a => a.poCode.id);
                        this.localService.getMixProductionWithStorage(val['id'], pos).pipe(take(1)).subscribe( val => {
                            this.putData = val[0];
                            this.newUsed = val[1]
                            this.isFormAvailable = true;
                        });
                    } else {
                        this.localService.getProductionWithStorage(val['id'], val['poCode']['id'], 'roast').pipe(take(1)).subscribe( val => {
                            this.putData = val[0];
                            this.newUsed = val[1];
                            this.isFormAvailable = true;
                        });
                    }
                } else {
                    this.router.navigate(['../Productions', {number: 3}], { relativeTo: this._Activatedroute });
                }
            });
            
        });
    }

    constructor(private _Activatedroute:ActivatedRoute, private router: Router, private fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private localService: ProductionService, public dialog: MatDialog) {
        }


    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                this.localService.getMixProductionWithStorage(+params.get('id'), params.get('poCodes')).pipe(take(1)).subscribe( val => {
                    this.putData = val[0];
                    this.newUsed = val[1]
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
                this.posArray = null;
                if(this.poConfig) {
                    this.form.get('poCode').setValue(null);
                    this.form.get('mixPos').setValue(null);
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
        this.form.addControl('mixPos', this.fb.control(''));
        this.form.get('mixPos').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('weightedPos')) {//&& selectedValue['poCode']
                this.posArray = selectedValue['weightedPos'];
                let pos = selectedValue['weightedPos'].map(a => a.poCode.id);
                this.localService.getMixStorageRoastPos(pos).pipe(take(1)).subscribe( val => {
                    this.newUsed = val;
                    this.isFormAvailable = true;
                }); 
                this.isDataAvailable = false;
            }
        });
        this.form.get('poCode').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id')) { 
                this.localService.getStorageRoastPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
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
                options: this.localService.getAllPosRoast(),
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
            {
                type: 'popup',
                label: $localize`Mix #PO`,
                name: 'mixPos',
                collections: [
                    {
                        type: 'bigexpand',
                        name: 'weightedPos',
                        label: $localize`Mixed PO#s`,
                        options: 'aloneInline',
                        collections: [
                            {
                                type: 'selectgroup',
                                inputType: 'supplierName',
                                options: this.localService.getAllPosRoast(),
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
                            // {
                            //     type: 'input',
                            //     label: 'Weight percentage',
                            //     name: 'weight',
                            //     inputType: 'numeric',
                            //     options: 3,
                            //     validations: [
                            //         {
                            //             name: 'required',
                            //             validator: Validators.required,
                            //             message: 'Weight percentage Required',
                            //         },
                            //         {
                            //             name: 'max',
                            //             validator: Validators.max(1),
                            //             message: '1 is the maximum',
                            //         }
                            //     ]
                            // },
                            {
                                type: 'divider',
                                inputType: 'divide'
                            },
                        ]
                    },
                    {
                        type: 'button',
                        label: $localize`Submit`,
                        name: 'submit',
                    }
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


