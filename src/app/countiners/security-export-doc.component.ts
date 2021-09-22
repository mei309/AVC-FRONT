import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { CountinersService } from './countiners.service';

@Component({
  selector: 'security-export-doc',
  template:`
  <button printTitle="{{type}} details" printSectionId="print-section-continers" printLazyLoad class="example-icon" mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title id="print" i18n>{{type}} details</h1>
    <mat-dialog-content id="print-section-continers">
        <h1 class="only-print" i18n>{{type}} details</h1>
        <show-details [dataSource]="dataSource" [oneColumns]="isSecurity? regSecurity : regExport">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <button class="raised-margin" mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial i18n>Close</button>
    </mat-dialog-actions>
  ` ,
})
export class SecurityExportDocComponent {
    id: number;
    dataSource;
    type;
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
            this.type = $localize`Security Doc`;
        } else {
            this.localService.getLoadingExportDoc(this.id).pipe(take(1)).subscribe( val => {
                this.dataSource = val;
            });
            this.type = $localize`Export Doc`;
        }
    }

    onNoClick(): void {
        this.dialogRef.close('closed');
    }


    regSecurity = [
        {
            type: 'parent',
            name: 'exportInfo',
            collections: [
              {
                type: 'nameId',
                label: $localize`Shipment code`,
                name: 'shipmentCode',
              },
              {
                type: 'dateTime',
                label: $localize`Process date`,
                name: 'processDate',
              },
            ]
        },
        {
            type: 'weight2',
            label: $localize`Gross total`,
            name: 'grossTotal',
        },
        {
            type: 'array',
            label: $localize`Loaded items`,
            name: 'loadedStorages',
            collections: [
                {
                    type: 'arrayVal',
                    name: 'poCodes',
                    label: $localize`PO#`,
                },
                {
                    type: 'normal',
                    label: $localize`Item descrption`,
                    name: 'item',
                },
                {
                    type: 'weight',
                    label: $localize`Unit amount`,
                    name: 'unitAmount',
                    // collections: 'measureUnit',
                },
                {
                    type: 'normal',
                    label: $localize`Number of units`,
                    name: 'numberUnits',
                },
                {
                    type: 'normal',
                    label: $localize`Number of boxes`,
                    name: 'numberBoxes',
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
                label: $localize`shipmentCode`,
                name: 'shipmentCode',
              },
              {
                type: 'dateTime',
                label: $localize`processDate`,
                name: 'processDate',
              },
            ]
        },
        {
            type: 'weight2',
            label: $localize`Net total`,
            name: 'netTotal',
        },
        {
            type: 'array',
            label: $localize`Loaded items`,
            name: 'loadedTotals',
            collections: [
                {
                    type: 'arrayVal',
                    label: $localize`#PO`,
                    name: 'poCodes',
                },
                {
                    type: 'nameId',
                    label: $localize`Item descrption`,
                    name: 'item',
                },
                {
                    type: 'weight2',
                    label: $localize`Row total`,
                    name: 'totalRow',
                },
            ]
        },
      ];

}
