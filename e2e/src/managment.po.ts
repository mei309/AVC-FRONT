import { browser } from 'protractor';
import { TestField } from './testfield.interface';
export class ManagmentPo {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl+'Main/manager/ManagerSetup') as Promise<unknown>;
  }

  putSupplyCategoriesFileds(supplyName: string, supplyGroup: string): TestField[] {
    return [
      {
        type: 'input',
        value: supplyName,
        placeholder: 'Descrption',
      },
      {
        type: 'select',
        value: supplyGroup,
        placeholder: 'Supply group',
      },
      {
        type: 'button',
        text: 'Submit',
      }
    ];
  }

  putItemFileds(itemName: string, measureUnit: string, itemGroup: string, itemProduction: string): TestField[] {
    return [
      {
        type: 'input',
        value: itemName,
        placeholder: 'Descrption',
      },
      {
        type: 'select',
        value: measureUnit,
        placeholder: 'Default measure unit (only for bulk)',
      },
      // {
      //   type: 'input',
      //   value: '',
      //   placeholder: 'Unit weight (only for packed)',
      // },
      // {
      //   type: 'select',
      //   value: 'KG',
      //   beginvalue: 'KG',
      //   placeholder: 'Weight unit',
      // },
      {
        type: 'select',
        value: itemGroup,
        placeholder: 'Item group',
      },
      {
        type: 'select',
        value: itemProduction,
        placeholder: 'Production use',
      },
      {
        type: 'button',
        text: 'Submit',
      }
    ];
  }

  putContractTypesFileds(contractName: string, code: string, currency: string, suffix?: string): TestField[] {
    return [
      {
        type: 'input',
        value: contractName,
        placeholder: 'Descrption',
      },
      {
        type: 'input',
        value: code,
        placeholder: 'Code',
      },
      {
        type: 'input',
        value: currency,
        placeholder: 'Currency',
      },
      {
        type: 'input',
        value: suffix,
        placeholder: 'Suffix',
      },
      {
        type: 'button',
        text: 'Submit',
      }
    ];
  }


}