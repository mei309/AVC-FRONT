import { browser, by, element, protractor } from 'protractor';

export class SuppliersPage {

  addNew(key: string, supplyGroup: string) {
    browser.get(browser.baseUrl+'Main/supready/NewSupplier');
    element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys(key);
    element(by.css('mat-chip-list>div>input')).click();
    element(by.cssContainingText('mat-option>span', supplyGroup)).click();
    // element(by.css('form>fieldset:nth-of-type(1)')).click();
    var elementToClick = element(by.buttonText('Save'));
    return browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementToClick), 1000)
    .then (() => {
        elementToClick.click();
        return browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id('print-section-supplier'))), 1000)
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