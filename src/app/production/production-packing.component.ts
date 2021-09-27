import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
import { cloneDeep } from 'lodash-es';
@Component({
    selector: 'production-packing',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1 i18n>Packing cashew process</h1></legend>
        <mat-checkbox [checked]="withPacked" style="padding-right: 10px" (change)="setWithPacked($event.checked)" i18n>With packed</mat-checkbox>
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

    withPacked: boolean = false;

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
                        let pos = val['weightedPos'].map(a => a.poCode.id);
                        this.withPacked = dialogRef.componentInstance.withPacked;
                        this.setEditData(val['id'], pos, dialogRef.componentInstance.addPos);
                    } else {
                        this.localService.getProductionWithStorage(val['id'], val['poCode']['id'], this.withPacked || dialogRef.componentInstance.withPacked? 'toPackWithPacked' : 'toPack').pipe(take(1)).subscribe( val => {
                            this.putData = val[0];
                            this.newUsed = val[1];
                            this.isFormAvailable = true;
                        });
                    }
                } else if(result === $localize`Go to full production report`) {
                    this.router.navigate(['Main/reports/ProductionsByTime']);
                } else {
                    this.router.navigate(['../Productions', {number: 3}], { relativeTo: this._Activatedroute });
                }
            });

        });
    }

    setEditData(id, pos: Array<number>, addPos) {
        if(addPos) {
            this.form = this.fb.group({});
            this.form.addControl('mixPos', this.fb.control(''));
            this.isDataAvailable = true;
            this.form.get('mixPos').valueChanges.pipe(distinctUntilChanged()).subscribe(selectedValue => {
                if(selectedValue && selectedValue.hasOwnProperty('weightedPos')) {
                    this.posArray = selectedValue['weightedPos'];
                    pos = pos.concat(selectedValue['weightedPos'].map(a => a.poCode.id));
                    this.localService.getMixProductionWithStorage(id, pos, this.withPacked).pipe(take(1)).subscribe( val => {
                        this.putData = val[0];
                        this.newUsed = val[1]
                        this.isFormAvailable = true;
                    });
                    this.isDataAvailable = false;
                }
            });
            this.setPoConfig(this.withPacked, true);
        } else {
            this.localService.getMixProductionWithStorage(id, pos, this.withPacked).pipe(take(1)).subscribe( val => {
                this.putData = val[0];
                this.newUsed = val[1]
                this.isFormAvailable = true;
            });
        }
    }

    constructor(private _Activatedroute:ActivatedRoute, private router: Router, private fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private localService: ProductionService, public dialog: MatDialog) {
        }


    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                this.withPacked = params.get('withPacked') === 'true';
                this.setEditData(+params.get('id'), (params.get('poCodes')).split(',').map(Number), params.get('addPos') === 'true');
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
        this.form.get('mixPos').valueChanges.pipe(distinctUntilChanged()).subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('weightedPos')) {//&& selectedValue['poCode']
                this.posArray = selectedValue['weightedPos'];
                let pos = selectedValue['weightedPos'].map(a => a.poCode.id);
                this.localService.getMixStorageToPackPos(pos, this.withPacked).pipe(take(1)).subscribe( val => {
                    this.newUsed = val;
                    this.isFormAvailable = true;
                });
                this.isDataAvailable = false;
            }
        });
        this.form.get('poCode').valueChanges.pipe(distinctUntilChanged()).subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id')) {
                this.localService.getStorageToPackPo(selectedValue['id'], this.withPacked).pipe(take(1)).subscribe( val => {
                    this.newUsed = val;
                    this.isFormAvailable = true;
                });
                this.isDataAvailable = false;
            }
        });
        this.isDataAvailable = true;
        this.setPoConfig(false, false);
    }

    setPoConfig(withPack: boolean, onlyMix: boolean) {
        this.poConfig = [
            ...onlyMix? [] : [
                {
                    type: 'selectgroup',
                    inputType: 'supplierName',
                    options: this.localService.getAllPosToPack(withPack),
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
                }
            ],
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
                                options: this.localService.getAllPosToPack(withPack),
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

    setWithPacked($event){
        this.withPacked = $event;
        this.setPoConfig($event, !this.form.contains('poCode'));
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
           this.navigationSubscription.unsubscribe();
        }
      }

}


