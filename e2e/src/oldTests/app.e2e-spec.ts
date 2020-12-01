import { LoginPage } from './login';
import { browser, by, element, logging } from 'protractor';
import { ManagmentPage } from './managment';
import { SuppliersPage } from './suppliers';
import { OrdersPage } from './orders';

describe('workspace-project App', () => {

  beforeEach(() => {
    // element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).click();
    // element(by.css('form>fieldset:nth-of-type(1)>app-input:nth-of-type(1)>mat-form-field>div:nth-of-type(1)>div:nth-of-type(1)>div>input')).sendKeys('trang nu');
    // element(by.css('mat-chip-list>div>input')).click();
    // element(by.css('div:nth-of-type(196)>button:nth-of-type(1)')).click();

  });

  // it('should login with eli', async () => {
  //   let page = new LoginPage();
  //   await page.login();
  //   expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main');
  // });
  
  // it('should add new items (w320 raw & clean & roast)', async () => {
  //   let managment = new ManagmentPage();
  //   expect(managment.addItem('w320-RAW', 'KG', 'PRODUCT', 'RAW_KERNEL')).toBeTruthy();
  //   // expect(managment.addItem('w320-RAW', 'KG', 'PRODUCT', 'RAW_KERNEL')).toBeTruthy();
  //   // expect(managment.addItem('w320-RAW', 'KG', 'PRODUCT', 'RAW_KERNEL')).toBeTruthy();
  //   expect(managment.addItem('w320-CLEAN', 'KG', 'PRODUCT', 'CLEAN')).toBeTruthy();
  //   expect(managment.addItem('w320-ROAST', 'KG', 'PRODUCT', 'ROAST')).toBeTruthy();
  // });
  // it('should add new supply categoris (cashew & general & none)', async () => {
  //   let managment = new ManagmentPage();
  //   expect(managment.addSupplyCategory('cashew', 'CASHEW')).toBeTruthy();
  //   expect(managment.addSupplyCategory('general', 'GENERAL')).toBeTruthy();
  //   expect(managment.addSupplyCategory('none', 'NONE')).toBeTruthy();
  // });
  // it('should add new contract type (imp & imp-v)', async () => {
  //   let managment = new ManagmentPage();
  //   expect(managment.addContractType('IMP', 'IMP', 'USD')).toBeTruthy();
  //   expect(managment.addContractType('IMP', 'IMP-V', 'VND', 'v')).toBeTruthy();
  // });
  
  // it('should add new supplier', () => {
  //   let suppliers = new SuppliersPage();
  //   expect(suppliers.addNew('TRUNG NAM', 'cashew')).toBeTruthy();
  // });

  // it('should add new cashew order', () => {
  //   let orders = new OrdersPage();
  //   expect(orders.addCashewOrder('TRUNG NAM', 'avc-v', 'w320-RAW')).toBeTruthy();
  // });

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});
