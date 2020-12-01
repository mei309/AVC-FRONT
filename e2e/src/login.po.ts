import { browser } from 'protractor';
import { TestField } from './testfield.interface';
export class LoginPo {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  logInFileds(): TestField[] {
    return [
      {
        type: 'input',
        value: 'eli',
        placeholder: 'Name',
      },
      {
        type: 'input',
        value: '309',
        placeholder: 'Password',
      },
      {
        type: 'button',
        text: 'Login',
      }
    ];
  }
}