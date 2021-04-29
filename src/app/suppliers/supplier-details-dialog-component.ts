import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuppliersService } from './suppliers.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-supplier-details-dialog',
    template: `
    <button printTitle="Supplier Details" printSectionId="print-section-supplier" printLazyLoad class="example-icon" mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title i18n>Supplier Details</h1>
    <mat-dialog-content id="print-section-supplier">
        <h1 class="only-print" i18n>Supplier Details</h1>
        <show-details [oneColumns]="regShow" [dataSource]="supllier">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">       
      <button class="raised-margin" mat-raised-button color="accent" (click)="editClick()" i18n>Edit</button>
      <button class="raised-margin" mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial i18n>Close</button>
    </mat-dialog-actions>
    
    `,
})
export class SupplierDetailsDialogComponent {
    id;
    fromNew: boolean;
    supllier: any;

    regShow = [
      {
        type: 'normal',
        label: $localize`supplier name`,
        name: 'name',
      },
      {
        type: 'nameId',
        label: $localize`Supply category`,
        name: 'supplyCategories',
      },    
      {
        type: 'normal',
        label: $localize`Legal english name`,
        name: 'englishName',
      },
      {
        type: 'normal',
        label: $localize`Legal vietnamese name`,
        name: 'localName',
      },
      {
        type: 'normal',
        label: $localize`Company license`,
        name: 'license',
      },
      {
        type: 'normal',
        label: $localize`Tax code`,
        name: 'taxCode',
      },
      {
        type: 'normal',
        label: $localize`Registered location`,
        name: 'registrationLocation',
      },
      {
        type: 'object',
        label: $localize`Contact info`,
        name: 'contactDetails',
        collections: [
          {
            type: 'parent',
            name: 'addresses',
            collections: [
              {
                type: 'normal',
                label: $localize`Street address`,
                name: 'streetAddress',
              },
              {
                type: 'name2',
                label: $localize`City/State`,
                name: 'city',
                collections:'countryName',
              },
            ]
          },
          {
            type: 'nameId',
            label: $localize`Phone`,
            name: 'phones',
          },
          {
            type: 'nameId',
            label: $localize`Email`,
            name: 'emails',
          },
          {
            type: 'nameId',
            label: $localize`Fax`,
            name: 'faxes',
          },
          {
            type: 'array',
            label: $localize`bank accounts`,
            name: 'paymentAccounts',
            collections: [
              {
                type: 'parent',
                name: 'bankAccount',
                collections: [
                  {
                    type: 'normal',
                    label: $localize`Owner name`,
                    name: 'ownerName',
                  },
                  {
                    type: 'normal',
                    label: $localize`Account number`,
                    name: 'accountNo',
                  },
                  {
                    type: 'name2',
                    label: $localize`Branch`,
                    name: 'branch',
                    collections: 'bankName',
                  },  
                ]
              },
            ]
          },
        ]
      },
      {
        type: 'array',
        label: $localize`Contact person`,
        name: 'companyContacts',
        collections: [
          {
            type: 'parent',
            name: 'person',
            collections: [
              {
                type: 'normal',
                label: $localize`Name`,
                name: 'name',
              },
              {
                type: 'parent',
                name: 'contactDetails',
                collections: [
                  {
                    type: 'parent',
                    name: 'addresses',
                    collections: [
                      {
                        type: 'normal',
                        label: $localize`Street address`,
                        name: 'streetAddress',
                      },
                      {
                        type: 'name2',
                        label: $localize`City/State`,
                        name: 'city',
                        collections:'countryName',
                      },
                    ]
                  },
                  {
                    type: 'nameId',
                    label: $localize`Phone`,
                    name: 'phones',
                  },
                  {
                    type: 'nameId',
                    label: $localize`Email`,
                    name: 'emails',
                  },
                  {
                    type: 'nameId',
                    label: $localize`Fax`,
                    name: 'faxes',
                  },
                ]
              },
              {
                type: 'parent',
                label: $localize`ID infromtion`,
                name: 'idCard',
                collections: [
                  {
                    type: 'normal',
                    label: $localize`ID number`,
                    name: 'idNumber',
                  },
                  {
                    type: 'normal',
                    label: $localize`ID date of issue`,
                    name: 'dateOfIssue',
                  },
                  {
                    type: 'normal',
                    label: $localize`ID place of issue`,
                    name: 'placeOfIssue',
                  },
                  {
                    type: 'normal',
                    label: $localize`Date of birth`,
                    name: 'dob',
                  },
                  {
                    type: 'nameId',
                    label: $localize`Nationality`,
                    name: 'nationality',
                  },
                ]
              },
            ]
          },
          {
            type: 'nameId',
            label: $localize`Position`,
            name: 'position',
          },
        ]
      },
    ];
    constructor(private LocalService: SuppliersService, public dialogRef: MatDialogRef<SupplierDetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: any) {
        this.id = data.id;
        this.supllier = data.supplier;
        this.fromNew = data.fromNew;
    }

    ngOnInit() {
      if(!this.fromNew) {
        this.LocalService.getSupplier(this.id).pipe(take(1)).subscribe( val => {
          this.supllier = val;  
        });
      }
    }

    onNoClick(): void {
      this.dialogRef.close('closed');
    }


    editClick(): void {
      this.dialogRef.close($localize`edit`);
    }
    
}
