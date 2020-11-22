import { browser, by, element } from 'protractor';

export class ManagmentPage {

  addNew() {
    browser.get(browser.baseUrl+'Main/manager/ManagerSetup');
    element(by.css('mat-button-toggle:nth-of-type(6)>button[name="mat-button-toggle-group-0"]>span')).click();
    element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
    element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('CASHEW');
    element(by.css('div:nth-of-type(15)>button:nth-of-type(1)')).click();
    element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
    element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('GENERAL ');
    element(by.css('app-select-normal>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.css('div:nth-of-type(15)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
    element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
    element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('NONE');
    element(by.css('app-select-normal>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.css('mat-option>span')).click();
    element(by.css('div:nth-of-type(15)>button:nth-of-type(1)')).click();
    // element(by.css('div:nth-of-type(15)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
  }
}


