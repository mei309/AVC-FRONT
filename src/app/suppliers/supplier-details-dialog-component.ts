import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuppliersService } from './suppliers.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-supplier-details-dialog',
    template: `
    <button printTitle="Supplier Details" [useExistingCss]="true" printSectionId="print-section-supplier" ngxPrint class="example-icon" mat-mini-fab style="float: right;">
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title>Supplier Details</h1>
    <mat-dialog-content id="print-section-supplier">
        <h1 class="only-print">Supplier Details</h1>
        <show-details [oneColumns]="regShow" [dataSource]="supllier">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">       
      <button class="raised-margin" mat-raised-button color="accent" (click)="editClick()">Edit</button>
      <button class="raised-margin" mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial>Close</button>
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
        label: 'supplier name',
        name: 'name',
      },
      {
        type: 'nameId',
        label: 'Supply category',
        name: 'supplyCategories',
      },    
      {
        type: 'normal',
        label: 'Legal english name',
        name: 'englishName',
      },
      {
        type: 'normal',
        label: 'Legal vietnamese name',
        name: 'localName',
      },
      {
        type: 'normal',
        label: 'Company license',
        name: 'license',
      },
      {
        type: 'normal',
        label: 'Tax code',
        name: 'taxCode',
      },
      {
        type: 'normal',
        label: 'Registered location',
        name: 'registrationLocation',
      },
      {
        type: 'object',
        label: 'Contact info',
        name: 'contactDetails',
        collections: [
          {
            type: 'parent',
            name: 'addresses',
            collections: [
              {
                type: 'normal',
                label: 'Street address',
                name: 'streetAddress',
              },
              {
                type: 'name2',
                label: 'City/State',
                name: 'city',
                collections:'countryName',
              },
            ]
          },
          {
            type: 'nameId',
            label: 'Phone',
            name: 'phones',
          },
          {
            type: 'nameId',
            label: 'Email',
            name: 'emails',
          },
          {
            type: 'nameId',
            label: 'Fax',
            name: 'faxes',
          },
          {
            type: 'array',
            label: 'bank accounts',
            name: 'paymentAccounts',
            collections: [
              {
                type: 'parent',
                name: 'bankAccount',
                collections: [
                  {
                    type: 'normal',
                    label: 'Owner name',
                    name: 'ownerName',
                  },
                  {
                    type: 'normal',
                    label: 'Account number',
                    name: 'accountNo',
                  },
                  {
                    type: 'name2',
                    label: 'Branch',
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
        label: 'Contact person',
        name: 'companyContacts',
        collections: [
          {
            type: 'parent',
            name: 'person',
            collections: [
              {
                type: 'normal',
                label: 'Name',
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
                        label: 'Street address',
                        name: 'streetAddress',
                      },
                      {
                        type: 'name2',
                        label: 'City/State',
                        name: 'city',
                        collections:'countryName',
                      },
                    ]
                  },
                  {
                    type: 'nameId',
                    label: 'Phone',
                    name: 'phones',
                  },
                  {
                    type: 'nameId',
                    label: 'Email',
                    name: 'emails',
                  },
                  {
                    type: 'nameId',
                    label: 'Fax',
                    name: 'faxes',
                  },
                ]
              },
              {
                type: 'parent',
                label: 'ID infromtion',
                name: 'idCard',
                collections: [
                  {
                    type: 'normal',
                    label: 'ID number',
                    name: 'idNumber',
                  },
                  {
                    type: 'normal',
                    label: 'ID date of issue',
                    name: 'dateOfIssue',
                  },
                  {
                    type: 'normal',
                    label: 'ID place of issue',
                    name: 'placeOfIssue',
                  },
                  {
                    type: 'normal',
                    label: 'Date of birth',
                    name: 'dob',
                  },
                  {
                    type: 'nameId',
                    label: 'Nationality',
                    name: 'nationality',
                  },
                ]
              },
            ]
          },
          {
            type: 'nameId',
            label: 'Position',
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
          console.log(val);
          
        });
      }
    }

    onNoClick(): void {
      this.dialogRef.close('closed');
    }


    editClick(): void {
      this.dialogRef.close('edit');
    }
    
}
