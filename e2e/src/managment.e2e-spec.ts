import { HarnessLoader } from '@angular/cdk/testing';
import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { browser, logging } from "protractor";
import { putDataTest } from './basic-test-logic';
import { ManagmentPo } from './managment.po';
import {MatButtonToggleHarness} from '@angular/material/button-toggle/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatDialogHarness} from '@angular/material/dialog/testing';
describe('test 2', () => {

    let page: ManagmentPo;

    let loader: HarnessLoader;
    
    beforeEach(() => {
        page = new ManagmentPo();
        loader = ProtractorHarnessEnvironment.loader();
    });

    // it('should add supply category', async () => {
    //     page.navigateTo();
    //     const toggleButton = await loader.getHarness(MatButtonToggleHarness.with({text: 'Supply categories'}));
    //     await toggleButton.toggle();
    //     const newButton = await loader.getHarness(MatButtonHarness.with({text: 'Add SupplyCategories'}));
    //     await newButton.click();
    //     let popupLoader = await loader.getChildLoader(MatDialogHarness.hostSelector);
    //     await putDataTest(page.putSupplyCategoriesFileds('cashew', 'CASHEW'), popupLoader);
    //     expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main/manager/ManagerSetup');
    // });

    // it('should add item', async () => {
    //     page.navigateTo();
    //     const toggleButton = await loader.getHarness(MatButtonToggleHarness.with({text: 'Items'}));
    //     await toggleButton.toggle();
    //     const newButton = await loader.getHarness(MatButtonHarness.with({text: 'Add Items'}));
    //     await newButton.click();
    //     let popupLoader = await loader.getChildLoader(MatDialogHarness.hostSelector);
    //     await putDataTest(page.putItemFileds('W320-RAW', 'KG', 'PRODUCT', 'RAW_KERNEL'), popupLoader);
    //     expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main/manager/ManagerSetup');
    // });


    // it('should add contract type', async () => {
    //     page.navigateTo();
    //     const toggleButton = await loader.getHarness(MatButtonToggleHarness.with({text: 'Contract types'}));
    //     await toggleButton.toggle();
    //     const newButton = await loader.getHarness(MatButtonHarness.with({text: 'Add ContractTypes'}));
    //     await newButton.click();
    //     let popupLoader = await loader.getChildLoader(MatDialogHarness.hostSelector);
    //     await putDataTest(page.putContractTypesFileds('vat-v', 'vat', 'VND', 'v'), popupLoader);
    //     expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main/manager/ManagerSetup');
    // });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
  