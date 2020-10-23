import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { CountinersService } from './countiners.service';

@Component({
  selector: 'security-export-doc',
  template:`
  <button class="example-icon" mat-mini-fab (click)="printWindow()" style="float: right;">
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title id="print">
        <span *ngIf="isSecurity">Security Doc</span>
        <span *ngIf="!isSecurity">Export Doc</span>
         details
    </h1>
    <mat-dialog-content>
        <show-details [dataSource]="dataSource" [oneColumns]="isSecurity? regSecurity : regExport" id="print-child">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <button class="raised-margin" mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial>Close</button>
    </mat-dialog-actions>
  ` ,
})
export class SecurityExportDocComponent {
    id: number;
    dataSource;

    isSecurity = false;
    readyForm = false;
    constructor(private localService: CountinersService, public dialogRef: MatDialogRef<SecurityExportDocComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.isSecurity = data.isSecurity;
        }
    ngOnInit() {
        if(this.isSecurity) {
            this.localService.getLoadingSecurityDoc(this.id).pipe(take(1)).subscribe( val => {
                this.dataSource = val;
                this.isSecurity = true;
            });
        } else {
            this.localService.getLoadingExportDoc(this.id).pipe(take(1)).subscribe( val => {
                this.dataSource = val;
                console.log(val);
                
            });
        }
    }

    onNoClick(): void {
        this.dialogRef.close('closed');
    }

    public printWindow(): void { 
        document.getElementById("section-to-print").setAttribute("id", "newDivId");
        window.print();
        document.getElementById("newDivId").setAttribute("id", "section-to-print");
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
                    type: 'nameId',
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