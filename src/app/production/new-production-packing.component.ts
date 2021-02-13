import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
import { cloneDeep } from 'lodash-es';
@Component({
    selector: 'new-production-packing',
    template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [fields]="poConfig" [mainLabel]="'Packing cashew process'" (submitForm)="goNext($event)">
        </dynamic-form>
    </div>
    <div *ngIf="isFormAvailable">
        <export-import [beginData]="putData" [newUsed]="newUsed" [mainLabel]="'Pack'" (submitExIm)="submit($event)">
        </export-import>
    </div>
    `
})
export class NewProductionPackingComponent implements OnInit {
    navigationSubscription;

    form: FormGroup;
    isDataAvailable: boolean = false;
    isFormAvailable: boolean = false;
    poConfig;
    putData;
    newUsed;
    
    isNew = true;

    poID: number;
    submit(value: any) {
        this.localService.addEditPackingTransfer(value, this.isNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
                width: '80%',
                data: {productionCheck: cloneDeep(val), fromNew: true, type: 'Packing'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'Edit') {
                    this.isFormAvailable = false;
                    this.cdRef.detectChanges();
                    this.localService.getProductionWithStorage(val['id'], val['poCode']['id'], 'roast').pipe(take(1)).subscribe( val => {
                        this.putData = val[0];
                        this.newUsed = val[1];
                        this.isNew = false;
                        this.isFormAvailable = true;
                    });
                } else {
                    this.router.navigate(['../Productions', {number: 2}], { relativeTo: this._Activatedroute });
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
                this.localService.getProductionWithStorage(+params.get('id'), +params.get('poCode'), 'roast').pipe(take(1)).subscribe( val => {
                    this.putData = val[0];
                    this.newUsed = val[1];
                    this.isNew = false;
                    this.isFormAvailable = true;
                });
                this.poID = +params.get('id');
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
                this.isNew = true;
                this.newUsed = null;
                this.poID = null;
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
    goNext(event) {
        this.putData = event;
        let pos = event['weightedPos'].map(a => a.poCode.id);
        this.localService.getMixStorageRoastPo(pos).pipe(take(1)).subscribe( val => {
            this.newUsed = [];
            val.forEach(a => {
                this.newUsed = this.newUsed.concat(a);
            });
            this.isDataAvailable = false;
            this.isFormAvailable = true;
        }); 
    }

    setBeginChoose() {
        this.isDataAvailable = true;
        this.poConfig = [
            {
                type: 'bigexpand',
                name: 'weightedPos',
                label: 'Mixed PO#s',
                options: 'aloneInline',
                collections: [
                    {
                        type: 'selectgroup',
                        inputType: 'supplierName',
                        options: this.localService.getAllPosRoast(),
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
                    {
                        type: 'input',
                        label: 'Weight',
                        name: 'weight',
                        inputType: 'numeric',
                        options: 3,
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }

}


