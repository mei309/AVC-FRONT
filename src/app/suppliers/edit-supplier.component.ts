import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from './../genral.service';
import { SupplierDetailsDialogComponent } from './supplier-details-dialog-component';
import { SuppliersService } from './suppliers.service';
// import diff_arrays_of_objects from 'diff-arrays-of-objects';
import { diff } from '../libraries/diffArrayObjects.interface';
import { cloneDeep } from 'lodash-es';

@Component({
    selector: 'edit-supplier',
    template: `
    <h1 style="text-align:center">
      Edit Supplier
    </h1>
    <div *ngIf="isDataAvalible">
      <mat-tab-group [(selectedIndex)]="tabIndex">
          <mat-tab label="Supplier">
              <dynamic-form [putData]="putData" [fields]="regConfig" (submitForm)="submitMain($event)">
              </dynamic-form>
          </mat-tab>
          <mat-tab label="Contact details">
              <dynamic-form [putData]="putData1" [fields]="regConfigContact" (submitForm)="submitContact($event)">
              </dynamic-form>
          </mat-tab>
          <mat-tab label="Contact people">
              <dynamic-form [putData]="putData2" [fields]="regConfigPeople" (submitForm)="submitPeople($event)">
              </dynamic-form>
          </mat-tab>
          <mat-tab label="Bank accounts">
              <dynamic-form [putData]="putData3" [fields]="regConfigBanks" (submitForm)="submitAccounts($event)">
              </dynamic-form>
          </mat-tab>
      </mat-tab-group>
    </div>
    `
  })
export class EditSupplierComponent implements OnInit {
  tabIndex: number = 0;

  regConfig: FieldConfig[];
  regConfigContact: FieldConfig[];
  regConfigPeople: FieldConfig[];
  regConfigBanks: FieldConfig[];
  putData: any = null;
  putData1: any = null;
  putData2: any = null;
  putData3: any = null;
  id: number;
  isDataAvalible: boolean = false;


  
  constructor(private _Activatedroute:ActivatedRoute, private cdRef:ChangeDetectorRef,
    private LocalService: SuppliersService, private genral: Genral, public dialog: MatDialog) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
        this.id = +params.get('id');
        this.LocalService.getSupplier(this.id).pipe(take(1)).subscribe( val => {
            this.preperDetailes(val);
            this.isDataAvalible = true;
        });
    });
    this.regConfig = [
      {
        type: 'input',
        label: 'supplier name',
        inputType: 'text',
        name: 'name',
        disable: true,
      },
      {
        type: 'select',
        label: 'Supply category',
        name: 'supplyCategories',
        inputType: 'multiple',
        // disable: true,
      },    
      {
        type: 'input',
        label: 'Legal english name',
        name: 'englishName',
      },
      {
        type: 'input',
        label: 'Legal vietnamese name',
        name: 'localName',
      },
      {
        type: 'input',
        label: 'Company license',
        name: 'license',
      },
      {
        type: 'input',
        label: 'Tax code',
        name: 'taxCode',
      },
      {
        type: 'input',
        label: 'Registered location',
        name: 'registrationLocation',
      },   
      {
        type: 'button',
        label: 'Save',
        name: 'submit'
      }
    ];

    this.regConfigContact = [
      {
        type: 'bigoutside',
        label: 'Contact info',
        name: 'contactDetails',
        collections: [
          {
            type: 'bignotexpand',
            name: 'addresses',
            collections: [
              {
                type: 'textarry',
                label: 'Street address',
                inputType: 'text',
                name: 'streetAddress',
              },
              {
                type: 'selectgroup',
                inputType: 'countryName',
                options: this.genral.getCities(),
                collections: [
                  {
                    type: 'select',
                    label: 'Country',
                  },
                  {
                    type: 'select',
                    label: 'City/State',
                    name: 'city',
                  },
                ]
              },
            ],
            validations: [
              {
                name: 'streetAddress',
                message: 'a address must have a street and city',
              },
              {
                name: 'city',
              }
            ]
          },
          {
            type: 'array',
            label: 'Phone',
            inputType: 'number',
            name: 'phones',
          },
          {
            type: 'array',
            label: 'Email',
            inputType: 'text',
            name: 'emails',
            validations: [
              {
                name: 'pattern',
                validator: Validators.pattern(
                  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
                ),
                message: 'Invalid email'
              }
            ]
          },
          {
            type: 'array',
            label: 'Fax',
            inputType: 'number',
            name: 'faxes',
          },
        ]
      },
      {
        type: 'button',
        label: 'Save',
        name: 'submit'
      }
    ];

    this.regConfigPeople = [
      {
        type: 'bigexpand',
        label: 'Contact person',
        name: 'companyContacts',
        options: 'NoFrame',
        collections: [
          {
            type: 'bignotexpand',
            name: 'person',
            collections: [
              {
                type: 'input',
                label: 'Name',
                inputType: 'text',
                name: 'name',
                disable: true,
              },
              {
                type: 'bignotexpand',
                name: 'contactDetails',
                collections: [
                  {
                    type: 'bignotexpand',
                    name: 'addresses',
                    collections: [
                      {
                        type: 'textarry',
                        label: 'Street address',
                        inputType: 'text',
                        name: 'streetAddress',
                      },
                      {
                        type: 'selectgroup',
                        inputType: 'countryName',
                        options: this.genral.getCities(),
                        collections: [
                          {
                            type: 'select',
                            label: 'Country',
                          },
                          {
                            type: 'select',
                            label: 'City/State',
                            name: 'city',
                          },
                        ]
                      },
                    ],
                    validations: [
                      {
                        name: 'streetAddress',
                        message: 'a address must have a street and city',
                      },
                      {
                        name: 'city',
                      }
                    ]
                  },
                  {
                    type: 'array',
                    label: 'Phone',
                    inputType: 'number',
                    name: 'phones',
                  },
                  {
                    type: 'array',
                    label: 'Email',
                    inputType: 'text',
                    name: 'emails',
                    validations: [
                      {
                        name: 'pattern',
                        validator: Validators.pattern(
                          '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
                        ),
                        message: 'Invalid email'
                      }
                    ]
                  },
                  {
                    type: 'array',
                    label: 'Fax',
                    inputType: 'number',
                    name: 'faxes',
                  },
                ]
              },
              {
                type: 'popup',
                label: 'ID infromtion',
                name: 'idCard',
                collections: [
                  {
                    type: 'input',
                    label: 'ID number',
                    name: 'idNumber',
                    inputType: 'text'
                  },
                  {
                    type: 'date',
                    label: 'ID date of issue',
                    name: 'dateOfIssue',
                  },
                  {
                    type: 'input',
                    label: 'ID place of issue',
                    name: 'placeOfIssue',
                    inputType: 'text'
                  },
                  {
                    type: 'select',
                    label: 'Nationality',
                    name: 'nationality',
                    options: this.genral.getCountries(),
                  },
                  {
                    type: 'date',
                    label: 'Date of birth',
                    name: 'dob',
                  },
                  {
                    type: 'button',
                    label: 'Save ID',
                    name: 'submit',
                  }
                ]
              },
            ]
          },
          {
            type: 'select',
            label: 'Position',
            name: 'position',
            options: this.genral.getCompanyPosition(),
          },
          {
            type: 'divider',
            inputType: 'divide'
          },
        ],
        validations: [
            {
              name: 'person',
              validator: [
                {
                  name: 'name',
                },
              ],
              message: 'a person must have a name and position',
            },
            {
              name: 'position',
            },
        ]
      },
      {
        type: 'button',
        label: 'Save',
        name: 'submit'
      }
    ];

    this.regConfigBanks = [
      {
        type: 'bigexpand',
        label: 'bank accounts',
        name: 'paymentAccounts',
        options: 'NoFrame',
        collections: [
          {
            type: 'bignotexpand',
            name: 'bankAccount',
            collections: [
              {
                type: 'input',
                label: 'Owner name',
                name: 'ownerName',
              },
              {
                type: 'input',
                label: 'Account number',
                name: 'accountNo',
                inputType: 'text'
              },
              {
                type: 'selectgroup',
                inputType: 'bankName',
                options: this.genral.getBranches(),
                collections: [
                  {
                    type: 'select',
                    label: 'Bank',
                  },
                  {
                    type: 'select',
                    label: 'Branch',
                    name: 'branch',
                  },
                ]
              },
            ]
          },
          {
            type: 'divider',
            inputType: 'divide'
          },
        ],
        validations: [
            {
              name: 'bankAccount',
              validator: [
                {
                  name: 'ownerName',
                },
                {
                  name: 'accountNo',
                },
                {
                  name: 'branch',
                }
              ],
              message: 'a bank must have owner name and account and branch',
            }
        ]
      },
      {
        type: 'button',
        label: 'Save',
        name: 'submit'
      }
    ];
  }

  preperDetailes(val) {
    this.putData = val;
    if(val.hasOwnProperty('contactDetails') && val['contactDetails']) {
      var temp = val['contactDetails'];
      if(temp.hasOwnProperty('paymentAccounts') && temp['paymentAccounts'] !== null) {
        this.putData3 = {'paymentAccounts': temp['paymentAccounts']};
      }
      delete temp['paymentAccounts'];
      this.putData1 = {'contactDetails': temp};
    }
    delete this.putData['contactDetails'];
    if(val.hasOwnProperty('companyContacts') && val['companyContacts'] !== null) {
      this.putData2 = {'companyContacts': val['companyContacts']};
    }
    delete this.putData['companyContacts'];
  }

  submitMain(value: any) {
    this.LocalService.editMainSupplier(value).pipe(take(1)).subscribe( val => {
      const dialogRef = this.dialog.open(SupplierDetailsDialogComponent, {
        width: '80%',
        data: {supplier: val, fromNew: true},
      });
      dialogRef.afterClosed().subscribe(data => {
        this.isDataAvalible = false;
        this.cdRef.detectChanges();
        this.preperDetailes(val);
        this.tabIndex = 0;
        this.isDataAvalible = true;
      });
    });
  }

  submitContact(value: any) {
    this.LocalService.editContactInfo(value['contactDetails'], this.id).pipe(take(1)).subscribe( val => {
      const dialogRef = this.dialog.open(SupplierDetailsDialogComponent, {
        width: '80%',
        data: {supplier: cloneDeep(val), fromNew: true},
      });
      dialogRef.afterClosed().subscribe(data => {
        
        this.isDataAvalible = false;
        this.cdRef.detectChanges();
        this.preperDetailes(val);
        this.tabIndex = 1;
        this.isDataAvalible = true;
      });
    });
  }

  submitPeople(value: any) {
    this.cleanAndOrdinal(this.putData2);
    var resultNew = diff(this.putData2['companyContacts'] ? this.putData2['companyContacts'] : [], value['companyContacts'], 'id');
    console.log(resultNew);
    
    this.LocalService.editContactPersons(resultNew, this.id).pipe(take(1)).subscribe( val => {
      const dialogRef = this.dialog.open(SupplierDetailsDialogComponent, {
        width: '80%',
        data: {supplier: cloneDeep(val), fromNew: true},
      });
      dialogRef.afterClosed().subscribe(data => {
        this.isDataAvalible = false;
        this.cdRef.detectChanges();
        this.preperDetailes(val);
        this.tabIndex = 2;
        this.isDataAvalible = true;
      });
    });
  }

  submitAccounts(value: any) {
    this.cleanAndOrdinal(this.putData3);
    var resultNew = diff(this.putData3['paymentAccounts'] ? this.putData3['paymentAccounts'] : [], value['paymentAccounts'], 'id');
    
    this.LocalService.editPaymentAccounts(resultNew, this.putData1['contactDetails']['id'], this.id).pipe(take(1)).subscribe( val => {
      const dialogRef = this.dialog.open(SupplierDetailsDialogComponent, {
        width: '80%',
        data: {supplier: cloneDeep(val), fromNew: true},
      });
      dialogRef.afterClosed().subscribe(data => {
        this.isDataAvalible = false;
        this.cdRef.detectChanges();
        this.preperDetailes(val);
        this.tabIndex = 3;
        this.isDataAvalible = true;
      });
    });
  }

  cleanAndOrdinal(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || propName === 'ordinal') {
        delete obj[propName];
      } else if(Array.isArray(obj[propName])) {
        obj[propName].forEach(fc => {
          this.cleanAndOrdinal(fc);
        });
        obj[propName] = obj[propName].filter(f => f);
        if(!obj[propName].length){
          delete obj[propName];
        }
      } else if(typeof obj[propName] === 'object') {
        if(!this.cleanAndOrdinal(obj[propName])) {
          delete obj[propName];
        }
      }
    }
    if(!Object.keys(obj).length){
      return false;
    }
    return true;
  }

  

}


