import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from './../genral.service';
import { SupplierDetailsDialogComponent } from './supplier-details-dialog-component';
import { SuppliersService } from './suppliers.service';

@Component({
    selector: 'new-supplier',
    template: `
    <dynamic-form *ngIf="isRealodReady" [fields]="regConfig" [mainLabel]="'New supplier'" (submit)="submit($event)">
    </dynamic-form>
    `
  })
export class NewSupplierComponent implements OnInit {
  navigationSubscription;
  isRealodReady: boolean = true;

  regConfig: FieldConfig[];

  constructor(private _Activatedroute:ActivatedRoute, private router: Router, private cdRef:ChangeDetectorRef,
    private LocalService: SuppliersService, private genral: Genral, private dialog: MatDialog) {
      
  }

  ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.isRealodReady = false;
        this.cdRef.detectChanges();
        this.isRealodReady = true;
      }
    });
    this.regConfig = [
      {
        type: 'input',
        label: 'supplier name',
        inputType: 'text',
        name: 'name',
        validations: [
          {
            name: 'required',
            validator: Validators.required,
            message: 'Required'
          },
        ]
      },
      {
        type: 'select',
        label: 'Supply category',
        name: 'supplyCategories',
        inputType: 'multiple',
        options: this.genral.getSupplyType(),
        validations: [
          {
            name: 'required',
            validator: Validators.required,
            message: 'Required',
          }
        ]
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
        type: 'bigoutside',
        label: 'Contact info',
        name: 'contactDetails',
        inputType: 'alone',
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
                    value: 'Vietnam',
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
            // validations: [
            //   {
            //     name: 'pattern',
            //     validator: Validators.pattern(
            //       '[0-9\+\-\]{0-10}$'
            //     ),
            //     message: 'Invalid phone'
            //   }
            // ]
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
            // validations: [
            //   {
            //     name: 'pattern',
            //     validator: Validators.pattern(
            //       '^[0-9+-]'
            //     ),
            //     message: 'Invalid fax'
            //   }
            // ]
          },
          {
            type: 'bigexpand',
            label: 'bank accounts',
            name: 'paymentAccounts',
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
        ]
      },
      {
        type: 'bigexpand',
        label: 'Contact person',
        name: 'companyContacts',
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
              message: 'a person must have a name',
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

  submit(value: any) {
    this.LocalService.addSupplier(value).pipe(take(1)).subscribe( val => {
      const dialogRef = this.dialog.open(SupplierDetailsDialogComponent, {
          width: '80%',
          data: {supplier: val, fromNew: true}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'edit') {
              this.router.navigate(['../EditSupplier', {id: val['id']}], { relativeTo: this._Activatedroute });
            } else {
              this.router.navigate(['../Suppliers'], { relativeTo: this._Activatedroute });
            }
        });
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

}


