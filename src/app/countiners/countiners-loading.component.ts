import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { CounteinersDetailsDialogComponent } from './counteiners-details.component';
import { CountinersService } from './countiners.service';
import { diff } from '../libraries/diffArrayObjects.interface';
@Component({
    selector: 'countiners-loading',
    template: `
    <div *ngIf="!loading">
      <dynamic-form [fields]="beginConfig" [mainLabel]="'Continer information'" (submit)="onLoad($event)">
      </dynamic-form>
    </div>
    <div *ngIf="loading">
        <ng-container dynamicField [field]="poConfig" [group]="form">
        </ng-container>
        <div *ngIf="isFormAvailable">
            <dynamic-form [fields]="regConfig" [putData]="dataSource" [mainLabel]="'Material to export'" (submit)="submit($event)">
            </dynamic-form>
        </div>
    </div>
    `
  })
export class CountinersLoadingComponent {
    form: FormGroup;
    
    choosedPos = [];
    poConfig: FieldConfig;
    regConfig: FieldConfig[];
    beginConfig: FieldConfig[];
    
    dataSource = {usedItemsTable: [], usedItemsNormal: []};
    firstData;
    processData;
    loading: boolean = false;
    isNew: boolean = true;
    isFormAvailable: boolean = false;

    submit(value: any) {
        var arr = [];
        if(value['usedItemsNormal']) {
            value['usedItemsNormal'].forEach(element => {
                if(this.isNew) {
                    var arrNormal = [];
                    element['usedItems'].forEach(elem => {
                        if(elem['numberExport']) {
                            arrNormal.push({storage: elem, numberUnits: elem['numberExport']});
                        }
                    });
                    element['usedItems'] = arrNormal;
                } else {
                    element['usedItems'].forEach(elem => {
                        if(elem['numberExport']) {
                            elem['numberUnits'] = elem['numberExport'];
                        }
                    });
                } 
                element['groupName'] = 'normal';
            });
            arr = arr.concat(value['usedItemsNormal']);
            delete value['usedItemsNormal'];
        }
        if(value['usedItemsTable']) {
            value['usedItemsTable'].forEach(element => {
                element['usedItem']['amounts'] = element['usedItem']['amounts'].filter(amou => amou.take);
                if(this.isNew) {
                    element['usedItem']['amounts'].forEach(ele => {
                        ele['storageId'] = ele['id'];
                        delete ele['id'];
                        ele['storageVersion'] = ele['version'];
                        delete ele['version'];
                    });
                }
                element['groupName'] = 'table';
            });
            arr = arr.concat(value['usedItemsTable']);
            delete value['usedItemsTable'];
        }
        this.firstData['usedItemGroups'] = arr;


        var proccesItems = [];
        this.processData.forEach(element => {
            if(element) {
                element['storage']['amounts'].forEach(et => {
                    delete et['id'];
                    delete et['version'];
                });
                // element['storage']['warehouseLocation'] = element['warehouseLocation'];
                delete element['storage']['item'];
                var cpoyProcess = {item: element['item'], groupName: element['groupName'], storage: element['storage']}
                proccesItems.push(cpoyProcess);
            }
        });
        this.firstData['processItems'] = proccesItems;

        
        console.log(this.firstData);
        
        this.localService.addEditLoading(this.firstData, this.isNew).pipe(take(1)).subscribe( val => {
            const dialogRef = this.dialog.open(CounteinersDetailsDialogComponent, {
                width: '80%',
                data: {inventoryItem: val, fromNew: true, type: 'Inventory item'}
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'Edit') {
                    // this.isFormAvailable = false;
                    // this.cdRef.detectChanges();
                    // this.localService.getStorageTransfer(val['id']).pipe(take(1)).subscribe( val1 => {
                    //     this.fillEdit(val1);
                    // });
                } else {
                    this.router.navigate(['../CountinerReports'], { relativeTo: this._Activatedroute });
                }
            });
        });
      
    }
      

    constructor(private fb: FormBuilder, private _Activatedroute:ActivatedRoute, private router: Router, private cdRef:ChangeDetectorRef,
        private localService: CountinersService, private genral: Genral, private location: Location, public dialog: MatDialog) {
    }

    

    addToForm(val) { 
        this.processData = val;

        var arrNormal = [];
        var arrTable = [];
        val.forEach(element => {
            if(element['storage']) {
                element['storage']['item'] = element['item'];
                arrTable.push({usedItem: element['storage']});
            } else if(element['storageForms']) {
                element['storageForms'].forEach(ele => {
                    ele['item'] = element['item'];
                });
                arrNormal.push({usedItems: element['storageForms']});
            }
        });
        if(arrTable.length) {
            this.dataSource['usedItemsTable'] = arrTable;
        }
        if(arrNormal.length) {
            this.dataSource['usedItemsNormal'] = this.dataSource['usedItemsNormal'].concat(arrNormal);
        }
    }

    cleanUnwanted() {
        if(!this.dataSource['usedItemsTable'].length) {
            this.regConfig.splice(1, 1);
        }
        if(!this.dataSource['usedItemsNormal'].length) {
            this.regConfig.splice(0, 1);
        }
    }


    onLoad(value) {
        this.firstData = value;
        this.preperReg();
        this.loading = true;
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('id')) {
                // var id = +params.get('id');
                // this.localService.getStorageTransfer(id).pipe(take(1)).subscribe( val => {
                //     this.fillEdit(val);
                // });
            } else {
                this.form = this.fb.group({});
                this.form.addControl('poCodes', this.fb.array([this.fb.group({poCode: null})]));
                
                this.form.get('poCodes').valueChanges.subscribe(selectedValue => {
                    selectedValue = selectedValue.filter(ele => ele.poCode);
                    if(selectedValue.length && !isEqual(selectedValue, this.choosedPos)) {
                        var result = diff(this.choosedPos, selectedValue, 'poCode', { updatedValues: 1});
                        var numberOfObsrevers = result['added'].length + result['removed'].length;
                        result['added'].forEach(el => {
                            this.localService.getStorageRoastPackedPo(el.poCode.id).pipe(take(1)).subscribe( val => {
                                this.addToForm(val);
                                numberOfObsrevers--;
                                if(!numberOfObsrevers) {
                                    this.cleanUnwanted();
                                    this.isFormAvailable = true;
                                }
                            });
                        });
                        result['removed'].forEach(el => {
                            numberOfObsrevers--;
                            if(!numberOfObsrevers) {
                                this.cleanUnwanted();
                                this.isFormAvailable = true;
                            }
                        });
                        this.choosedPos = selectedValue;
                    }
                });
                
                this.poConfig =
                    {
                        type: 'bigexpand',
                        name: 'poCodes',
                        label: 'Loading PO#s',
                        options: 'aloneInline',
                        collections: [
                            {
                                type: 'selectgroup',
                                inputType: 'supplierName',
                                options: this.localService.getAllPosRoastPacked(),
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
                                type: 'divider',
                                inputType: 'divide'
                            },
                        ]
                    };

            }
        });
    }

    ngOnInit () {
        this.beginConfig = [
            {
                type: 'date',
                label: 'Date',
                value: new Date(),
                name: 'recordedTime',
                options: 'withTime',
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: 'Date Required',
                    }
                ]
            },
            {
              type: 'bignotexpand',
              label: 'Shipment code',
              name: 'ShipmentCode',
              collections: [
                  {
                      type: 'input',
                      label: 'Code',
                      name: 'code',
                      validations: [
                        {
                            name: 'required',
                            validator: Validators.required,
                            message: 'Code Required',
                        }
                      ]
                  },
                  {
                      type: 'select',
                      label: 'Destination port',
                      name: 'portOfDischarge',
                      options: this.genral.getShippingPorts(),
                      // disable: true,
                  },
              ],
            },
            {
              type: 'bignotexpand',
              label: 'Container details',
              name: 'containerDetails',
              collections: [
                  {
                      type: 'input',
                      label: 'Container number',
                      name: 'containerNumber',
                  },
                  {
                      type: 'input',
                      label: 'Seal number',
                      name: 'sealNumber',
                  },
                  {
                      type: 'selectNormal',
                      label: 'Container type',
                      name: 'containerType',
                      value: '20\'',
                      options: this.genral.getShippingContainerType(),
                  },
              ],
            },
            {
              type: 'bignotexpand',
              label: 'Shiping details',
              name: 'shipingDetails',
              value: 'required',
              collections: [
                  {
                      type: 'input',
                      label: 'Booking number',
                      name: 'bookingNumber',
                  },
                  {
                      type: 'input',
                      label: 'Vessel',
                      name: 'vessel',
                  },
                  {
                      type: 'input',
                      label: 'Shipping company',
                      name: 'shippingCompany',
                  },
                  {
                      type: 'select',
                      label: 'Loading port',
                      name: 'portOfLoading',
                      options: this.genral.getShippingPorts(),
                  },
                  {
                      type: 'date',
                      label: 'Etd',
                      name: 'etd',
                      // value: new Date()
                  },
                  {
                      type: 'select',
                      label: 'Destination port',
                      name: 'portOfDischarge',
                      options: this.genral.getShippingPorts(),
                  },
                  {
                    type: 'date',
                    label: 'Eta',
                    name: 'eta',
                    // value: new Date()
                  },
              ],
            },
            {
              type: 'button',
              label: 'Load',
              name: 'submit',
            }
        ];
    }

    preperReg(){
        this.regConfig = [
            {
                type: 'bigexpand',
                name: 'usedItemsNormal',
                label: 'Transfer from',
                options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'tableWithInput',
                        // label: 'Transfer from',
                        name: 'usedItems',
                        options: 'numberExport',
                        collections: [
                            {
                                type: 'select',
                                label: 'Item',
                                name: 'item',
                                disable: true,
                            },
                            {
                                type: 'inputselect',
                                name: 'unitAmount',
                                label: 'Unit weight',
                                disable: true,
                                collections: [
                                    {
                                        type: 'input',
                                        label: 'Unit weight',
                                        name: 'amount',
                                    },
                                    {
                                        type: 'select',
                                        label: 'Weight unit',
                                        name: 'measureUnit',
                                    },
                                ]
                            },
                            {
                                type: 'input',
                                label: 'Number of units',
                                name: 'numberUnits',
                                disable: true,
                            },
                            {
                                type: 'input',
                                label: 'Used units',
                                name: 'usedUnits',
                                disable: true,
                            },
                            {
                                type: 'select',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                disable: true,
                            },
                            {
                                type: 'nothing',
                                name: 'storage',
                                // disable: true,
                            },
                        ]
                    },
                ],
            },
            {
                type: 'bigexpand',
                name: 'usedItemsTable',
                label: 'Transfer from',
                options: 'aloneNoAdd',
                collections: [
                    {
                        type: 'bignotexpand',
                        name: 'usedItem',
                        // label: 'Transfer from',
                        options: 'aloneNoAdd',
                        collections: [
                            {
                                type: 'inputReadonlySelect',
                                label: 'Item descrption',
                                name: 'item',
                                disable: true,
                            },
                            {
                                type: 'inputReadonly',
                                label: 'Weight unit',
                                name: 'measureUnit',
                                disable: true,
                            },
                            {
                                type: 'inputReadonlySelect',
                                label: 'Warehouse location',
                                name: 'warehouseLocation',
                                disable: true,
                            },
                            {
                                type: 'inputReadonly',
                                label: 'Empty container weight',
                                name: 'containerWeight',
                                disable: true,
                            },
                            {
                                type: 'arrayordinal',
                                label: 'Unit weight',
                                name: 'amounts',
                                inputType: 'choose',
                                options: 3,
                                collections: 30,
                            },
                        ]
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

}