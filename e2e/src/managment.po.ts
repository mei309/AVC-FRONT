import { browser } from 'protractor';
import { TestField } from './testfield.interface';
export class ManagmentPo {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl+'Main/manager/ManagerSetup') as Promise<unknown>;
  }

  putItemFileds(): TestField[] {
    return [
      {
        type: 'input',
        value: 'w-320-raw',
        placeholder: 'Descrption',
      },
      {
        type: 'input',
        value: '',
        placeholder: 'Unit weight (only for packed)',
      },
      {
        type: 'select',
        value: 'KG',
        beginvalue: 'KG',
      },
      {
        type: 'select',
        value: 'KG',
        beginvalue: '',
      },
      {
        type: 'select',
        value: 'PRODUCT',
        beginvalue: '',
      },
      {
        type: 'select',
        value: 'RAW_KERNEL',
        beginvalue: '',
      },
      {
        type: 'button',
        text: 'Login',
      }
    ];
  }
}