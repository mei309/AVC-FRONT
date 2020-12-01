import { browser, by, element, protractor } from 'protractor';

export class LoginPage {

  login() {
    browser.driver.get(browser.baseUrl);
    element(by.css('app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('eli'); 
    element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('309'); 
    var elementToClick = element(by.buttonText('Login'));
    browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementToClick), 1000)
    .then ( function () {
        elementToClick.click();
    });
  }
}