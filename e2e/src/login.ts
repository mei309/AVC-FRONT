import { browser, by, element } from 'protractor';

export class LoginPage {

  login() {
    browser.driver.get(browser.baseUrl);
    element(by.css('app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('eli'); 
    element(by.css('app-input:nth-of-type(2)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('309'); 
    element(by.css('button:nth-of-type(1)>span:nth-of-type(1)')).click();
  }
}