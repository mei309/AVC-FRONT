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
    <dynamic-form *ngIf="isRealodReady" [fields]="regConfig" mainLabel="New supplier" (submitForm)="submit($event)" i18n-mainLabel>
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
        label: $localize`supplier name`,
        inputType: 'text',
        name: 'name',
        validations: [
          {
            name: 'required',
            validator: Validators.required,
            message: $localize`Required`
          },
        ]
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
        type: 'bigoutside',
        label: $localize`Contact info`,
        name: 'contactDetails',
        inputType: 'alone',
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
              },
              {
                type: 'selectgroup',
                inputType: 'countryName',
                options: this.LocalService.getCities(),
                collections: [
                  {
                    type: 'select',
                    label: $localize`Country`,
                    value: 'Vietnam',
                  },
                  {
                    type: 'select',
                    label: $localize`City/State`,
                    name: 'city',
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
            collections: 'phonesmain',
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
            label: $localize`Email`,
            inputType: 'text',
            name: 'emails',
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
            label: $localize`bank accounts`,
            name: 'paymentAccounts',
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
        ]
      },
      {
        type: 'bigexpand',
        label: $localize`Contact person`,
        name: 'companyContacts',
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
                      },
                      {
                        type: 'selectgroup',
                        inputType: 'countryName',
                        options: this.LocalService.getCities(),
                        collections: [
                          {
                            type: 'select',
                            label: $localize`Country`,
                          },
                          {
                            type: 'select',
                            label: $localize`City/State`,
                            name: 'city',
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
                    collections: 'phoneschild'
                  },
                  {
                    type: 'array',
                    label: $localize`Email`,
                    inputType: 'text',
                    name: 'emails',
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
            }
        ]
      },
      {
        type: 'button',
        label: $localize`Save`,
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
            if (result === $localize`edit`) {
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


