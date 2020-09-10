import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
@Component({
    selector: 'production-packing',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1>Packing cashew process</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <export-import [beginData]="putData" [isNew]="isNew" [mainLabel]="'Packing cashew process'" (submit)="submit($event)">
        </export-import>
    </div>
    `
})
export class ProductionPackingComponent implements OnInit {
    form: FormGroup;
    isDataAvailable: boolean = false;
    isFormAvailable: boolean = false;
    poConfig;
    putData;
    poID: number;
    isNew: boolean = true;
    submit(value: any) {
        this.localService.addEditPackingTransfer(value, this.isNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
                width: '80%',
                data: {productionCheck: val, fromNew: true, type: 'Packing'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'Edit') {
                    this.isFormAvailable = false;
                    this.isNew = false;
                    this.cdRef.detectChanges();
                    this.localService.getTransferProduction(val['id']).pipe(take(1)).subscribe( val1 => {
                        this.putData = val1;
                        this.isFormAvailable = true;
                    });
                } else {
                    this.router.navigate(['../Productions', {number: 2}], { relativeTo: this._Activatedroute });
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
                this.localService.getTransferProduction(+params.get('id')).pipe(take(1)).subscribe( val => {
                    this.putData = val;
                    this.isFormAvailable = true;
                }); 
                this.isNew = false;
                this.poID = +params.get('id');
            } else {
                this.form = this.fb.group({});
                this.form.addControl('poCode', this.fb.control(''));
                this.form.get('poCode').valueChanges.subscribe(selectedValue => {
                    if(selectedValue && selectedValue.hasOwnProperty('code') && this.poID !== selectedValue['id']) { 
                        this.localService.getStorageRoastPo(selectedValue['id']).pipe(take(1)).subscribe( val => {
                            this.putData = val;
                            this.isFormAvailable = true;
                        }); 
                        this.isDataAvailable = false;
                        this.poID = selectedValue['id'];
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
        });
    }

}


