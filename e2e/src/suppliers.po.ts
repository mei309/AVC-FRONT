import { browser } from 'protractor';
import { TestField } from './testfield.interface';
export class SuppliersPo {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl+'Main/supready/NewSupplier') as Promise<unknown>;
  }

  newSupplierFileds(supplierName: string, supplyCategory: string[]): TestField[] {
    return [
        {
            type: 'input',
            placeholder: 'supplier name',
            value: supplierName,
        },
        {
            type: 'selectMulti',
            multiValue: supplyCategory,
            placeholder: 'Supply category',
        },  
        {
            type: 'input',
            placeholder: 'Legal english name',
            value: 'english name',
        },
        {
            type: 'input',
            placeholder: 'Legal vietnamese name',
            value: 'local name',
        },
        {
            type: 'input',
            placeholder: 'Company license',
            value: 'license',
        },
        {
            type: 'input',
            placeholder: 'Tax code',
            value: 'tax code',
        },
        {
            type: 'input',
            placeholder: 'Registered location',
            value: 'registration location',
        },
        // {
        //     type: 'input',
        //     placeholder: 'Street address',
        //     value: 'street address',
        // },
        // {
        //     type: 'select',
        //     value: 'Vietnam',
        // },
        // {
        //     type: 'select',
        //     value: 'Da Nang',
        //     placeholder: 'City/State',
        // },



          {
            type: 'array',
            placeholder: 'phonesmain',
            multiValue: ['234'],
          },
        //   {
        //     type: 'array',
        //     label: 'Email',
        //     inputType: 'text',
        //     name: 'emails',
        //   },
        //   {
        //     type: 'array',
        //     label: 'Fax',
        //     inputType: 'number',
        //     name: 'faxes',
        //   },
        //   {
        //     type: 'bigexpand',
        //     placeholder: 'bank accounts',
        //     collections: [
        //           {
        //             type: 'input',
        //             placeholder: 'Owner name',
        //             value: 'ownerName',
        //           },
        //           {
        //             type: 'input',
        //             placeholder: 'Account number',
        //             value: 'accountNo',
        //           },
        //           // {
        //           //   type: 'selectgroup',
        //           //   inputType: 'bankName',
        //           //   options: this.genral.getBranches(),
        //           //   collections: [
        //           //     {
        //           //       type: 'select',
        //           //       label: 'Bank',
        //           //     },
        //           //     {
        //           //       type: 'select',
        //           //       label: 'Branch',
        //           //       name: 'branch',
        //           //     },
        //           //   ]
        //           // },
        //     ],
        // },
       
    //   {
    //     type: 'bigexpand',
    //     label: 'Contact person',
    //     name: 'companyContacts',
    //     collections: [
    //       {
    //         type: 'bignotexpand',
    //         name: 'person',
    //         collections: [
    //           {
    //             type: 'input',
    //             label: 'Name',
    //             inputType: 'text',
    //             name: 'name',
    //           },
    //           {
    //             type: 'bignotexpand',
    //             name: 'contactDetails',
    //             collections: [
    //               {
    //                 type: 'bignotexpand',
    //                 name: 'addresses',
    //                 collections: [
    //                   {
    //                     type: 'textarry',
    //                     label: 'Street address',
    //                     inputType: 'text',
    //                     name: 'streetAddress',
    //                   },
    //                   {
    //                     type: 'selectgroup',
    //                     inputType: 'countryName',
    //                     options: this.genral.getWearhouses(),
    //                     collections: [
    //                       {
    //                         type: 'select',
    //                         label: 'Country',
    //                       },
    //                       {
    //                         type: 'select',
    //                         label: 'City/State',
    //                         name: 'city',
    //                       },
    //                     ]
    //                   },
    //                 ],
    //               },
    //               {
    //                 type: 'array',
    //                 label: 'Phone',
    //                 inputType: 'number',
    //                 name: 'phones',
    //               },
    //               {
    //                 type: 'array',
    //                 label: 'Email',
    //                 inputType: 'text',
    //                 name: 'emails',
    //               },
    //               {
    //                 type: 'array',
    //                 label: 'Fax',
    //                 inputType: 'number',
    //                 name: 'faxes',
    //               },
    //             ]
    //           },
    //           {
    //             type: 'popup',
    //             label: 'ID infromtion',
    //             name: 'idCard',
    //             collections: [
    //               {
    //                 type: 'input',
    //                 label: 'ID number',
    //                 name: 'idNumber',
    //                 inputType: 'text'
    //               },
    //               {
    //                 type: 'date',
    //                 label: 'ID date of issue',
    //                 name: 'dateOfIssue',
    //               },
    //               {
    //                 type: 'input',
    //                 label: 'ID place of issue',
    //                 name: 'placeOfIssue',
    //                 inputType: 'text'
    //               },
    //               {
    //                 type: 'select',
    //                 label: 'Nationality',
    //                 name: 'nationality',
    //                 options: this.genral.getWearhouses(),
    //               },
    //               {
    //                 type: 'date',
    //                 label: 'Date of birth',
    //                 name: 'dob',
    //               },
    //               {
    //                 type: 'button',
    //                 label: 'Save ID',
    //                 name: 'submit',
    //               }
    //             ]
    //           },
    //         ]
    //       },
    //       {
    //         type: 'select',
    //         label: 'Position',
    //         name: 'position',
    //         options: this.genral.getCompanyPosition(),
    //       },
    //       {
    //         type: 'divider',
    //         inputType: 'divide'
    //       },
    //     ],
    //   },
      {
        type: 'button',
        text: 'Save',
      }
    ];
  }
}