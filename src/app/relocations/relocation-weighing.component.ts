import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { RelocationsDetailsDialogComponent } from './relocations-details-dialog.component';
import { RelocationsService } from './relocations.service';
@Component({
    selector: 'relocation-weighing',
    template: `
    <fieldset *ngIf="isDataAvailable" [ngStyle]="{'width':'90%'}">
        <legend><h1 i18n>Cleaning cashew process</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
    </fieldset>
    <div *ngIf="isFormAvailable">
        <exp-imp-relocation [beginData]="putData" [newUsed]="newUsed" [num]="num" (submitExIm)="submit($event)">
        </exp-imp-relocation>
    </div>
    `
  })
export class RelocationWeighingComponent implements OnInit {
    navigationSubscription;

    form: FormGroup;
    isDataAvailable: boolean = false
    isFormAvailable: boolean = false;
    poConfig;
    putData;
    newUsed;
    num: number = 0;
    
    submit(value: any) {
        this.localService.addEditRelocationTransfer(value, this.putData? false : true).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(RelocationsDetailsDialogComponent, {
                width: '80%',
                data: {relocationsItem: cloneDeep(val), fromNew: true, type: this.num? 'Clean transfering amounts' : 'Raw transfering amounts'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === $localize`Edit`) {
                    this.isFormAvailable = false;
                    this.cdRef.detectChanges();
                    this.localService.getStorageTransferWithStorage(val['id'], [val['poCode']['id']], this.num).pipe(take(1)).subscribe( val1 => {
                        this.putData = val1[0];
                        this.newUsed = val1[1];
                        this.isFormAvailable = true;
                    });
                } else {
                    this.router.navigate(['../RelocationsReports', {number: this.num}], { relativeTo: this._Activatedroute });
                }
            });
            
        });
    }

      constructor(private _Activatedroute:ActivatedRoute, private router: Router, private fb: FormBuilder, private cdRef: ChangeDetectorRef,
         private localService: RelocationsService, public dialog: MatDialog) {
        }


    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('num')) {
                this.num = +params.get('num');
            }
            if(params.get('id')) {
                this.localService.getStorageTransferWithStorage(+params.get('id'), (params.getAll('poCodes')).map(el=>parseInt(el)), this.num).pipe(take(1)).subscribe( val => {
                    this.putData = val[0];
                    this.newUsed = val[1];
                    this.isFormAvailable = true;
                });
            } else {
                this.setBeginChoose();
                this.setRegConfig();
            } 
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.isDataAvailable = false;
                this.isFormAvailable = false;
                this.putData = null;
                this.newUsed = null;
                this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
                    if(params.get('num')) {
                        this.num = +params.get('num');
                    } else {
                        this.num = 0;
                    }
                });
                if(this.poConfig) {
                    this.form.get('poCode').setValue(null);
                } else {
                    this.setBeginChoose();
                }
                this.setRegConfig();
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
                this.localService.getStorageByPo(selectedValue['id'], this.num).pipe(take(1)).subscribe( val => {
                    this.newUsed = val;
                    this.isFormAvailable = true;
                }); 
                this.isDataAvailable = false;
            }
        });
        this.isDataAvailable = true;
    }
    setRegConfig(){
        this.poConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.getAllPos(this.num),
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