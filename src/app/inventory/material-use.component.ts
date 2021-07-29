import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { cloneDeep } from 'lodash-es';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';

@Component({
    selector: 'material-use',
    template: `
    <div *ngIf="isFormAvailable">
        <dynamic-form [fields]="regConfigUse" [putData]="dataSource" mainLabel="Material use" (submitForm)="submit($event)" i18n-mainLabel>
        </dynamic-form>
    </div>
    `
  })
export class MaterialUsageComponent implements OnInit {
    navigationSubscription;

    isFormAvailable: boolean = false;
    regConfigUse: FieldConfig[];
    dataSource;

    submit(value: any) {
        var arr = [];
        if(value['materialUsed']) {
            value['materialUsed'].forEach(element => {
                element['storageMoves'] = element['storageMoves'].filter(amou => amou.numberUsedUnits);
                element['groupName'] = 'meterialUsedPos';
            });
            value['materialUsed'] = value['materialUsed'].filter(amou => amou.storageMoves.length);
            arr = arr.concat(value['materialUsed']);
            delete value['materialUsed'];
        }
        value['storageMovesGroups'] = arr;
        
        this.localService.addEditMaterialUse(value, this.dataSource? false : true).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
                width: '80%',
                data: {inventoryItem: cloneDeep(val), fromNew: true, type: $localize`Material usage`}
            });
            dialogRef.afterClosed().subscribe(result => {
                if(result === 'Edit') {
                    // this.isDataAvailable = false;
                    this.isFormAvailable = false;
                    this.dataSource = null;
                    this.cdRef.detectChanges();
                    this.localService.getStroageUse(val['id']).pipe(take(1)).subscribe( val1 => {
                        this.dataSource = val1;
                        this.isFormAvailable = true;
                    }); 
                } else {
                    this.router.navigate(['../Reports', {number: 0}], { relativeTo: this._Activatedroute });
                }
            });
        });
    }

    constructor(private cdRef: ChangeDetectorRef,
        private localService: InventoryService, private genral: Genral, public dialog: MatDialog,
        private _Activatedroute:ActivatedRoute, private router: Router,) {
       }
    


   ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                this.localService.getStroageUse(+params.get('id')).pipe(take(1)).subscribe( val => {
                    val['materialUsed'] = val['storageMovesGroups'];
                    delete val['storageMovesGroups'];
                    this.dataSource = val;
                    this.isFormAvailable = true;
                });
            } else {
                this.isFormAvailable = true;
            }
        });
        this.setRegConfig();
       

       
       this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
            this.isFormAvailable = false;
            this.dataSource = null;
            this.cdRef.detectChanges();
            this.isFormAvailable = true;
        }
    });
   }

   setRegConfig() {
    this.regConfigUse = [
        {
            type: 'date',
            label: $localize`Date`,
            value: 'timeNow',
            name: 'recordedTime',
            options: 'withTime',
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: $localize`Date Required`,
                }
            ]
        },
        {
            type: 'select',
            label: $localize`Production line`,
            value: 'General Use',
            name: 'productionLine',
            options: this.genral.getProductionLine('GENERAL_USE'),
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: $localize`Production line Required`,
                }
            ]
        },
        {
            type: 'textarry',
            label: $localize`Remarks`,
            inputType: 'text',
            name: 'remarks',
        },
        {
            type: 'bigexpand',
            name: 'materialUsed',
            label: $localize`Material used`,
            options: 'aloneNoAdd',
            collections: [
                {
                    type: 'materialUsage',
                    // label: 'Transfer from',
                    name: 'storageMoves',
                    options: 'numberUsedUnits',
                    collections: [
                        {
                            type: 'selectgroup',
                            inputType: 'supplierName',
                            // options: this.localService.getAllPosRoastPacked(),
                            disable: true,
                            collections: [
                                {
                                    type: 'select',
                                    label: $localize`Supplier`,
                                },
                                {
                                    type: 'select',
                                    label: $localize`#PO`,
                                    name: 'itemPo',
                                    collections: 'somewhere',
                                },
                            ]
                        },
                        {
                            type: 'select',
                            label: $localize`Item`,
                            name: 'item',
                            disable: true,
                        },
                        {
                            type: 'date',
                            label: $localize`Process date`,
                            name: 'itemProcessDate',
                            disable: true,
                        },
                        {
                            type: 'input',
                            label: $localize`Weight unit`,
                            name: 'measureUnit',
                            disable: true,
                        },
                        {
                            type: 'bignotexpand',
                            name: 'storage',
                            collections: [
                                {
                                    type: 'input',
                                    label: $localize`Number of units`,
                                    name: 'numberUnits',
                                    disable: true,
                                },
                                {
                                    type: 'input',
                                    name: 'unitAmount',
                                    label: $localize`Unit weight`,
                                    disable: true,
                                //     collections: [
                                //         {
                                //             type: 'input',
                                //             label: 'Unit weight',
                                //             name: 'amount',
                                //         },
                                //         {
                                //             type: 'select',
                                //             label: 'Weight unit',
                                //             name: 'measureUnit',
                                //         },
                                //     ]
                                },
                                {
                                    type: 'select',
                                    label: $localize`Warehouse location`,
                                    name: 'warehouseLocation',
                                    disable: true,
                                },
                                {
                                    type: 'input',
                                    label: $localize`Number available units`,
                                    name: 'numberAvailableUnits',
                                    disable: true,
                                },
                            ]
                        },
                    ],
                },
            ]
        },
        {
            type: 'button',
            label: $localize`Submit`,
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

  