import { browser, by, element, protractor } from 'protractor';

export class ManagmentPage {
  
  addItem(key: string, prudoction: string, mesuareUnit: string, group: string) {
    browser.get(browser.baseUrl+'Main/manager/ManagerSetup');
    element(by.css('mat-button-toggle:nth-of-type(8)>button[name="mat-button-toggle-group-0"]>span')).click();
    element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
    element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(key);
    element(by.css('app-select-normal:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option>span', mesuareUnit)).click();
    element(by.css('app-select-normal:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option>span', group)).click();
    element(by.css('app-select-normal:nth-of-type(3)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option>span', prudoction)).click();
    return this.submitAndWait(element(by.buttonText('Submit')));
  }

  addSupplyCategory(key: string, supplyGroup: string) {
    browser.get(browser.baseUrl+'Main/manager/ManagerSetup');
    element(by.css('mat-button-toggle:nth-of-type(6)>button[name="mat-button-toggle-group-0"]>span')).click();
    element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
    element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(key);
    element(by.css('app-select-normal>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option>span', supplyGroup)).click();
    return this.submitAndWait(element(by.buttonText('Submit')));
  }

  addContractType(key: string, code: string, currency: string, suffix?: string) {
    browser.get(browser.baseUrl+'Main/manager/ManagerSetup');
    element(by.css('mat-button-toggle:nth-of-type(9)>button[name="mat-button-toggle-group-0"]>span')).click();
    element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
    element(by.css('app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(key);
    element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(code);
    element(by.css('app-select-normal>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option>span', currency)).click();
    element(by.css('app-input:nth-of-type(3)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    if(suffix){
      element(by.css('app-input:nth-of-type(3)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(suffix);
    }
    return this.submitAndWait(element(by.buttonText('Submit')));
  }

  




  // bulkKgProductRaw(obj: string) {
  //   browser.get(browser.baseUrl+'Main/manager/ManagerSetup');
  //   element(by.css('mat-button-toggle:nth-of-type(8)>button[name="mat-button-toggle-group-0"]>span')).click();
  //   element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
  //   element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(obj);
  //   element(by.css('app-select-normal:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.css('mat-option>span')).click();
  //   element(by.css('app-select-normal:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.css('mat-option>span')).click();
  //   element(by.css('app-select-normal:nth-of-type(3)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.cssContainingText('mat-option>span', 'RAW_KERNEL')).click();
  //   return this.submitAndWait(element(by.buttonText('Submit')));
  // }

  // bulkKgProductClean(obj: string) {
  //   browser.get(browser.baseUrl+'Main/manager/ManagerSetup');
  //   element(by.css('mat-button-toggle:nth-of-type(8)>button[name="mat-button-toggle-group-0"]>span')).click();
  //   element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
  //   element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(obj);
  //   element(by.css('app-select-normal:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.css('mat-option>span')).click();
  //   element(by.css('app-select-normal:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.css('mat-option>span')).click();
  //   element(by.css('app-select-normal:nth-of-type(3)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.cssContainingText('mat-option>span', 'CLEAN')).click();
  //   return this.submitAndWait(element(by.buttonText('Submit')));
  // }

  // bulkKgProductRoast(obj: string) {
  //   browser.get(browser.baseUrl+'Main/manager/ManagerSetup');
  //   element(by.css('mat-button-toggle:nth-of-type(8)>button[name="mat-button-toggle-group-0"]>span')).click();
  //   element(by.css('managment-setup>div:nth-of-type(1)>div:nth-of-type(1)>button:nth-of-type(1)>span:nth-of-type(1)')).click();
  //   element(by.css('app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(obj);
  //   element(by.css('app-select-normal:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.css('mat-option>span')).click();
  //   element(by.css('app-select-normal:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.css('mat-option>span')).click();
  //   element(by.css('app-select-normal:nth-of-type(3)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
  //   element(by.cssContainingText('mat-option>span', 'ROAST')).click();
  //   return this.submitAndWait(element(by.buttonText('Submit')));
  // }

  submitAndWait(elementToClick) {
    return browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementToClick), 1000)
    .then (() => {
        elementToClick.click();
        return browser.wait(protractor.ExpectedConditions.not(protractor.ExpectedConditions.presenceOf(elementToClick)), 1000)
        .then (() => {
            return true;
        }).catch(() => {
          return false;
        });
    }).catch(() => {
      return false;
    });
  }
}













