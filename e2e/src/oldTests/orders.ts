import { browser, by, element, protractor } from 'protractor';

export class OrdersPage {

  addCashewOrder(supplier: string, contractType: string, item: string) {
    browser.get(browser.baseUrl+'Main/ordready/NewCashewOrder');
    element(by.css('app-bigoutside>app-select:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option:nth-of-type(4)>span', supplier)).click();
    element(by.css('app-select:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option>span', contractType)).click();
    // element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    // element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('abe');
    element(by.css('app-bigexpand>fieldset>app-select>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.cssContainingText('mat-option:nth-of-type(1)>span', item)).click();
    element(by.css('app-input-select:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>input')).click();
    element(by.css('app-input-select:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>input')).sendKeys('35000');
    element(by.css('app-input-select:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>input')).click();
    element(by.css('app-input-select:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>input')).sendKeys('1.14');
    // element(by.css('app-bigexpand>fieldset>app-date>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.css('mat-radio-button:nth-of-type(2)>label>div:nth-of-type(1)>div:nth-of-type(1)')).click();
    element(by.css('mat-radio-button:nth-of-type(2)>label>div:nth-of-type(1)>input[name="mat-radio-group-0"]')).click();
    var elementToClick = element(by.buttonText('Submit'));
    return browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementToClick), 1000)
    .then (() => {
        elementToClick.click();
        return browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id('print-section-orders'))), 1000)
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



// browser.driver.manage().window().setSize(1280, 680);
// element(by.css('app-bigoutside>app-select:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
// element(by.css('mat-option:nth-of-type(4)>span')).click();
// element(by.css('app-select:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
// element(by.css('mat-option>span')).click();
// element(by.css('app-bigoutside>app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
// element(by.css('app-bigoutside>app-input>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).clear().sendKeys('122');
// element(by.css('path')).click();
// element(by.css('path')).click();
// element(by.css('path')).click();
// element(by.css('form>fieldset:nth-of-type(1)>app-date:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>input')).click();
// element(by.css('path')).click();
// element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
// element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).clear().sendKeys('abe');
// element(by.css('app-bigexpand>fieldset>app-select>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
