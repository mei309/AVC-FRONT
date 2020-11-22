import { browser, by, element } from 'protractor';

export class SuppliersPage {

  addNew() {
    browser.get(browser.baseUrl+'Main/supready/NewSupplier');
    element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('TRUNG NAM');
    element(by.css('mat-chip-list>div>input')).click();
    element(by.css('form>fieldset:nth-of-type(1)')).click();
    element(by.css('div:nth-of-type(196)>button:nth-of-type(1)>span:nth-of-type(1)')).click();

  }
}