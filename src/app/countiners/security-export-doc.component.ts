import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { OneColumn, FieldConfig } from '../field.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Genral } from '../genral.service';
import { CountinersService } from './countiners.service';

@Component({
  selector: 'security-export-doc',
  template:`
<fieldset *ngIf="readyForm" [ngStyle]="{'width':'90%'}">
    <ng-container *ngIf="isSecurity; else noSecurity">
        <legend><h1>Security Doc</h1></legend>
        <show-details [dataSource]="dataSource" [oneColumns]="regSecurity">
        </show-details>
    </ng-container>
    <ng-template #noSecurity>
        <legend><h1>Export Doc</h1></legend>
        <show-details [dataSource]="dataSource" [oneColumns]="regExport">
        </show-details>
    </ng-template>
</fieldset>
  ` ,
})
export class SecurityExportDocComponent {
    
    dataSource;

    isSecurity = false;
    readyForm = false;
    constructor(private fb: FormBuilder, private localService: CountinersService, private _Activatedroute: ActivatedRoute, private genral: Genral) {}

    ngOnInit() {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            var id = +params.get('id');
            if('Security' === params.get('docType')) {
                this.localService.getLoadingSecurityDoc(id).pipe(take(1)).subscribe( val => {
                    this.dataSource = val;
                    this.readyForm = true;
                    this.isSecurity = true;
                });
            } else {
                this.localService.getLoadingExportDoc(id).pipe(take(1)).subscribe( val => {
                    this.dataSource = val;
                    this.readyForm = true;
                });
            }
        });
    }


    regSecurity = [
        {
            type: 'parent',
            name: 'exportInfo',
            collections: [
              {
                type: 'nameId',
                label: 'Shipment code',
                name: 'shipmentCode',
              },
              {
                type: 'dateTime',
                label: 'Process date',
                name: 'processDate',
              },
            ]
        },
        {
            type: 'weight2',
            label: 'Gross total',
            name: 'grossTotal',
        },
        {
            type: 'array',
            label: 'Loaded items',
            name: 'loadedStorages',
            collections: [
                {
                    type: 'nameId',
                    label: '#PO',
                    name: 'poCode',
                    collections: 'supplierName',
                },
                {
                    type: 'normal',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight',
                    label: 'Bag amount',
                    name: 'unitAmount',
                    // collections: 'measureUnit',
                },
                {
                    type: 'normal',
                    label: 'Number of bags',
                    name: 'numberUnits',
                },
            ]
        },
    ];
    regExport = [
        {
            type: 'parent',
            name: 'exportInfo',
            collections: [
              {
                type: 'nameId',
                label: 'shipmentCode',
                name: 'shipmentCode',
              },
              {
                type: 'dateTime',
                label: 'processDate',
                name: 'processDate',
              },
            ]
        },
        {
            type: 'weight2',
            label: 'Net total',
            name: 'netTotal',
        },
        {
            type: 'array',
            label: 'Loaded items',
            name: 'loadedTotals',
            collections: [
                {
                    type: 'nameId',
                    label: '#PO',
                    name: 'poCode',
                    collections: 'supplierName',
                },
                {
                    type: 'normal',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight2',
                    label: 'Row total',
                    name: 'totalRow',
                },
            ]
        },
      ];

}