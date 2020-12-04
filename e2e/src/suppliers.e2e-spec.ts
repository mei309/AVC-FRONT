import { browser, logging } from "protractor";
import {HarnessLoader} from '@angular/cdk/testing';
import {ProtractorHarnessEnvironment} from '@angular/cdk/testing/protractor';
import { putDataTest } from './basic-test-logic';
import { SuppliersPo } from './suppliers.po';
import {MatDialogHarness} from '@angular/material/dialog/testing';
describe('test 3', () => {

    let page: SuppliersPo;

    let loader: HarnessLoader;

    beforeEach(() => {
        page = new SuppliersPo();
        loader = ProtractorHarnessEnvironment.loader();
    });

    it('should add new cashew supplier', async () => {
        page.navigateTo();
        await putDataTest(page.newSupplierFileds('Nah Trang', ['cashew']), loader);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main/supready/NewSupplier');
        let popupLoader = await loader.getHarness(MatDialogHarness.with({selector: '.app-supplier-details-dialog'}));
        expect(popupLoader).toBeTruthy();
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
  