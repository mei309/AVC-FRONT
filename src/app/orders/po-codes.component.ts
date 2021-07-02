import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OrdersService } from './orders.service';
@Component({
    selector: 'po-codes',
    template: `
    <h1 style="text-align:center" i18n>#POS</h1>
    <div class="centerButtons">
        <button mat-raised-button color="primary" (click)="newDialog()" i18n>Add #PO</button>
    </div>
    <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
        (selectedIndexChange)="changed($event)" class="spac-print">
        <mat-tab label="Cashew" i18n-label>
        </mat-tab>
        <mat-tab label="General" i18n-label>
        </mat-tab>
    </mat-tab-group>
    <search-details [dataSource]="posSource" [oneColumns]="columnsPos" (details)="newDialog($event)">
    </search-details>
    `
  })
export class PoCodesComponent implements OnInit {
    navigationSubscription;

    posSource;
    columnsPos;

    tabIndex: number = 0;

    suppliersChangable = new ReplaySubject<any[]>();
    contractTypesChangable = new ReplaySubject<any[]>();
    
    constructor(private router: Router, private _Activatedroute: ActivatedRoute, private cdRef:ChangeDetectorRef,
        private genral: Genral, private localService: OrdersService, public dialog: MatDialog) {
      }

    ngOnInit() {
        this.columnsPos = [
            {
                type: 'normal',
                name: 'code',
                label: $localize`Code`,
            },
            {
                type: 'normal',
                name: 'supplierName',
                label: $localize`Supplier`,
                search: 'selectObj',
                options: this.suppliersChangable,
            },
            {
                type: 'normal',
                name: 'contractTypeCode',
                label: $localize`Contract type code`,
                search: 'selectObj',
                options: this.contractTypesChangable,
            },
            {
                type: 'normal',
                name: 'contractTypeSuffix',
                label: $localize`Suffix`,
            },
            {
                type: 'normal',
                name: 'value',
                label: $localize`Display`,
            },
        ];
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('number')) {
              this.tabIndex = +params.get('number');
              this.changed(+params.get('number'));
            } else {
              this.changed(0);
            }
        });
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
          // If it is a NavigationEnd event re-initalise the component
          if (e instanceof NavigationEnd) {
            this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
              if(params.get('number')) {
                this.tabIndex = +params.get('number');
                this.changed(+params.get('number'));
              } else {
                this.changed(0);
              }
            });
          }
        });
    }

    newDialog(value?: any): void {
        const dialogRef = this.dialog.open(AddEditPoDialog, {
          width: '80%',
          height: '80%',
          data: {poCode: value? value['id'] : null, tab: this.tabIndex}
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data === 'success') {
                this.changed(this.tabIndex, true);
            }
        });
    }

    changed(event, isSame?: boolean) {
        switch (+event) {
          case 0:
            this.posSource = null;
            if(!isSame) {
                this.genral.getSuppliersCashew().pipe(take(1)).subscribe(val => {
                    this.suppliersChangable.next(val);
                });
                this.localService.getCashewContractTypes().pipe(take(1)).subscribe(val => {
                    this.contractTypesChangable.next(val);
                });
            }
            var ind = this.columnsPos.findIndex((em) => em['name'] === 'productCompany');
            if(ind === -1) {
                this.columnsPos.push({
                        type: 'select',
                        label: $localize`Product company`,
                        name: 'productCompany',
                        search: 'select',
                        options: this.localService.getSuppliersGroups(),
                    });
                this.columnsPos = this.columnsPos.slice();
            }
            this.localService.findAllPoCodes().pipe(take(1)).subscribe(value => {
                this.posSource = value;
            });
            this.cdRef.detectChanges();
            break;
          case 1:
            this.posSource = null;
            if(!isSame) {
                this.genral.getSuppliersGeneral().pipe(take(1)).subscribe(val => {
                    this.suppliersChangable.next(val);
                });
                this.localService.getGeneralContractTypes().pipe(take(1)).subscribe(val => {
                    this.contractTypesChangable.next(val);
                });
                var ind = this.columnsPos.findIndex((em) => em['name'] === 'productCompany');
                if(ind !== -1) {
                    this.columnsPos.splice(ind, 1);
                    this.columnsPos = this.columnsPos.slice();
                }
            }
            this.localService.findAllGeneralPoCodes().pipe(take(1)).subscribe(value => {
                this.posSource = value;
            });
            this.cdRef.detectChanges();
            break;
          default:
            break;
        }
      }

    ngOnDestroy(){
        if (this.navigationSubscription) {  
            this.navigationSubscription.unsubscribe();
        }
        this.suppliersChangable.unsubscribe();
        this.contractTypesChangable.unsubscribe();
    }
}

@Component({
  selector: 'add-edit-po',
  template: `
    <div *ngIf="isDataAvailable">
        <dynamic-form [putData]="putData" [fields]="poConfig" [mainLabel]="this.poCode? 'Edit PO#' : 'Add PO#'" (submitForm)="submit($event)" popup="true">
        </dynamic-form>
    </div>
  `,
})
export class AddEditPoDialog {
 
    poConfig;
    putData;
    mainLabel: string;
    poCode: number;
    isDataAvailable: boolean = false;

    tab: number;

    ngOnInit(){
        // if(!this.mainLabel.startsWith('Add mix')) {
            if(this.poCode) {
                this.localService.getPoCode(+this.poCode).pipe(take(1)).subscribe( val => {
                    this.putData = val;
                    this.isDataAvailable = true;
                });
            } else {
                this.isDataAvailable = true;
            }
            this.poConfig = [
                {
                    type: 'select',
                    label: $localize`Supplier`,
                    name: 'supplier',
                    options: this.getSuppliers(this.tab),
                    validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: $localize`Supplier Required`,
                        }
                    ]
                },
                {
                    type: 'select',
                    label: $localize`PO initial`,
                    name: 'contractType',
                    options: this.getContractTypes(this.tab),
                    validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: $localize`PO initial Required`,
                        }
                    ]
                },
                {
                    type: 'input',
                    label: $localize`#PO`,
                    inputType: 'number',
                    name: 'code',
                    disable: true,
                },
                ...this.tab? [] : [
                    {
                        type: 'select',
                        label: $localize`Product company`,
                        name: 'productCompany',
                        options: this.localService.getSuppliersGroups(),
                    }
                ],
                {
                    type: 'button',
                    label: $localize`Submit`,
                    name: 'submit',
                }
            ];
    }
    
    constructor(private localService: OrdersService, public dialogRef: MatDialogRef<AddEditPoDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.poCode = data.poCode;
            this.tab = data.tab;
        }
    
    submit(value: any) {
        if(this.tab === 0) {
            this.localService.addEditPoCode(value, this.poCode? false : true).pipe(take(1)).subscribe( val => {
                this.dialogRef.close('success');
            });
        } else {
            this.localService.addEditGeneralPoCode(value, this.poCode? false : true).pipe(take(1)).subscribe( val => {
                this.dialogRef.close('success');
            });
        }
    }

    getSuppliers(tab: number): Observable<any> {
        if(tab === 0) {
            return this.localService.getCashewSuppliers();
        } else {
            return this.localService.getGeneralSuppliers();
        }
      }
  
  
  
      getContractTypes(tab: number): Observable<any> {
        if(tab === 0) {
            return this.localService.getCashewContractTypes();
        } else {
            return this.localService.getGeneralContractTypes();
        }
      }

    onNoClick(): void {
        this.dialogRef.close('closed');
    }

}

