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
    <h1 style="text-align:center" i18n>Edit Supplier</h1>
    <div *ngIf="isDataAvalible">
      <mat-tab-group [(selectedIndex)]="tabIndex">
          <mat-tab label="Supplier" i18n-label>
              <dynamic-form [putData]="putData" [fields]="regConfig" (submitForm)="submitMain($event)">
              </dynamic-form>
          </mat-tab>
          <mat-tab label="Contact details" i18n-label>
              <dynamic-form [putData]="putData1" [fields]="regConfigContact" (submitForm)="submitContact($event)">
              </dynamic-form>
          </mat-tab>
          <mat-tab label="Contact people" i18n-label>
              <dynamic-form [putData]="putData2" [fields]="regConfigPeople" (submitForm)="submitPeople($event)">
              </dynamic-form>
          </mat-tab>
          <mat-tab label="Bank accounts" i18n-label>
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
        label: $localize`supplier name`,
        inputType: 'text',
        name: 'name',
        disable: true,
      },
      {
        type: 'selectMultipile',
        label: $localize`Supply category`,
        name: 'supplyCategories',
        options: this.LocalService.getSupplyType(),
        validations: [
          {
            name: 'required',
            validator: Validators.required,
            message: $localize`Required`,
          }
        ]
      },
      {
        type: 'input',
        label: $localize`Legal english name`,
        name: 'englishName',
      },
      {
        type: 'input',
        label: $localize`Legal vietnamese name`,
        name: 'localName',
      },
      {
        type: 'input',
        label: $localize`Company license`,
        name: 'license',
      },
      {
        type: 'input',
        label: $localize`Tax code`,
        name: 'taxCode',
      },
      {
        type: 'input',
        label: $localize`Registered location`,
        name: 'registrationLocation',
      },
      {
        type: 'button',
        label: $localize`Submit`,
        name: 'submit'
      }
    ];

    this.regConfigContact = [
      {
        type: 'bigoutside',
        label: $localize`Contact info`,
        name: 'contactDetails',
        collections: [
          {
            type: 'bignotexpand',
            name: 'addresses',
            collections: [
              {
                type: 'textarry',
                label: $localize`Street address`,
                inputType: 'text',
                name: 'streetAddress',
                autocomplete: 'my-streetAddress',
              },
              {
                type: 'selectgroup',
                inputType: 'countryName',
                options: this.LocalService.getCities(),
                collections: [
                  {
                    type: 'select',
                    label: $localize`Country`,
                    autocomplete: 'my-country',
                  },
                  {
                    type: 'select',
                    label: $localize`City/State`,
                    name: 'city',
                    autocomplete: 'my-city',
                  },
                ]
              },
            ],
            validations: [
              {
                name: 'streetAddress',
                message: $localize`a address must have a street and city`,
              },
              {
                name: 'city',
              }
            ]
          },
          {
            type: 'array',
            label: $localize`Phone`,
            inputType: 'number',
            name: 'phones',
            autocomplete: 'my-phones',
          },
          {
            type: 'array',
            label: $localize`Email`,
            inputType: 'text',
            name: 'emails',
            autocomplete: 'my-emails',
            validations: [
              {
                name: 'pattern',
                validator: Validators.pattern(
                  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
                ),
                message: $localize`Invalid email`
              }
            ]
          },
          {
            type: 'array',
            label: $localize`Fax`,
            inputType: 'number',
            name: 'faxes',
            autocomplete: 'my-faxes',
          },
        ]
      },
      {
        type: 'button',
        label: $localize`Submit`,
        name: 'submit'
      }
    ];

    this.regConfigPeople = [
      {
        type: 'bigexpand',
        label: $localize`Contact person`,
        name: 'companyContacts',
        options: 'NoFrame',
        collections: [
          {
            type: 'bignotexpand',
            name: 'person',
            collections: [
              {
                type: 'input',
                label: $localize`Name`,
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
                        label: $localize`Street address`,
                        inputType: 'text',
                        name: 'streetAddress',
                        autocomplete: 'my-streetAddress',
                      },
                      {
                        type: 'selectgroup',
                        inputType: 'countryName',
                        options: this.LocalService.getCities(),
                        collections: [
                          {
                            type: 'select',
                            label: $localize`Country`,
                            autocomplete: 'my-country',
                          },
                          {
                            type: 'select',
                            label: $localize`City/State`,
                            name: 'city',
                            autocomplete: 'my-city',
                          },
                        ]
                      },
                    ],
                    validations: [
                      {
                        name: 'streetAddress',
                        message: $localize`a address must have a street and city`,
                      },
                      {
                        name: 'city',
                      }
                    ]
                  },
                  {
                    type: 'array',
                    label: $localize`Phone`,
                    inputType: 'number',
                    name: 'phones',
                    autocomplete: 'my-phones',
                  },
                  {
                    type: 'array',
                    label: $localize`Email`,
                    inputType: 'text',
                    name: 'emails',
                    autocomplete: 'my-emails',
                    validations: [
                      {
                        name: 'pattern',
                        validator: Validators.pattern(
                          '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
                        ),
                        message: $localize`Invalid email`
                      }
                    ]
                  },
                  {
                    type: 'array',
                    label: $localize`Fax`,
                    inputType: 'number',
                    name: 'faxes',
                    autocomplete: 'my-faxes',
                  },
                ]
              },
              {
                type: 'popup',
                label: $localize`ID infromtion`,
                name: 'idCard',
                collections: [
                  {
                    type: 'input',
                    label: $localize`ID number`,
                    name: 'idNumber',
                    inputType: 'text'
                  },
                  {
                    type: 'date',
                    label: $localize`ID date of issue`,
                    name: 'dateOfIssue',
                  },
                  {
                    type: 'input',
                    label: $localize`ID place of issue`,
                    name: 'placeOfIssue',
                    inputType: 'text'
                  },
                  {
                    type: 'select',
                    label: $localize`Nationality`,
                    name: 'nationality',
                    options: this.LocalService.getCountries(),
                  },
                  {
                    type: 'date',
                    label: $localize`Date of birth`,
                    name: 'dob',
                  },
                  {
                    type: 'button',
                    label: $localize`Save ID`,
                    name: 'submit',
                  }
                ]
              },
            ]
          },
          {
            type: 'select',
            label: $localize`Position`,
            name: 'position',
            options: this.LocalService.getCompanyPosition(),
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
              message: $localize`a person must have a name`,
            },
        ]
      },
      {
        type: 'button',
        label: $localize`Submit`,
        name: 'submit'
      }
    ];

    this.regConfigBanks = [
      {
        type: 'bigexpand',
        label: $localize`bank accounts`,
        name: 'paymentAccounts',
        options: 'NoFrame',
        collections: [
          {
            type: 'bignotexpand',
            name: 'bankAccount',
            collections: [
              {
                type: 'input',
                label: $localize`Owner name`,
                name: 'ownerName',
              },
              {
                type: 'input',
                label: $localize`Account number`,
                name: 'accountNo',
                inputType: 'text'
              },
              {
                type: 'selectgroup',
                inputType: 'bankName',
                options: this.LocalService.getBranches(),
                collections: [
                  {
                    type: 'select',
                    label: $localize`Bank`,
                  },
                  {
                    type: 'select',
                    label: $localize`Branch`,
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
              message: $localize`a bank must have owner name and account and branch`,
            }
        ]
      },
      {
        type: 'button',
        label: $localize`Submit`,
        name: 'submit'
      }
    ];
  }

  preperDetailes(val) {
    this.putData = val;
    if(val['contactDetails']) {
      var temp = val['contactDetails'];
      if(temp['paymentAccounts']) {
        this.putData3 = {'paymentAccounts': temp['paymentAccounts']};
      }
      delete temp['paymentAccounts'];
      this.putData1 = {'contactDetails': temp};
    }
    delete this.putData['contactDetails'];
    if(val['companyContacts']) {
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
    if(value['contactDetails']){
      value['contactDetails']['phones'] = value['contactDetails']['phones']?.filter(a => a.value);
      value['contactDetails']['emails'] = value['contactDetails']['emails']?.filter(a => a.value);
      value['contactDetails']['faxes'] = value['contactDetails']['faxes']?.filter(a => a.value);
    }


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
    value['companyContacts']?.forEach(ele => {
      if(ele['person'] && ele['person']['contactDetails']) {
        ele['person']['contactDetails']['phones'] = ele['person']['contactDetails']['phones']?.filter(a => a.value);
        ele['person']['contactDetails']['emails'] = ele['person']['contactDetails']['emails']?.filter(a => a.value);
        ele['person']['contactDetails']['faxes'] = ele['person']['contactDetails']['faxes']?.filter(a => a.value);
      }
    });

    this.cleanAndOrdinal(this.putData2);
    var resultNew = diff(this.putData2['companyContacts'], value['companyContacts'], 'id');
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
    var resultNew = diff(this.putData3['paymentAccounts'], value['paymentAccounts'], 'id');

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


