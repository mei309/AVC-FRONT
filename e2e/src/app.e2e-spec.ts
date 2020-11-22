import { LoginPage } from './login';
import { browser, by, element, logging } from 'protractor';
import { ManagmentPage } from './managment';
import { SuppliersPage } from './suppliers';

describe('workspace-project App', () => {

  beforeEach(() => {
    element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('trang nu');
    element(by.css('mat-chip-list>div>input')).click();
    element(by.css('div:nth-of-type(196)>button:nth-of-type(1)')).click();

  });

  it('should login with eli', () => {
    let page = new LoginPage();
    page.login();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main');
  });
  
  it('should add new supply category (chasew & general & none)', () => {
    let managment = new ManagmentPage();
    managment.addNew();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main/manager/ManagerSetup');
  });

  it('should add new supplier', () => {
    let suppliers = new SuppliersPage();
    suppliers.addNew();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main/supready/NewSupplier');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
