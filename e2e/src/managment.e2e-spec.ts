import { HarnessLoader } from '@angular/cdk/testing';
import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { browser, logging } from "protractor";
import { putDataTest } from './basic-test-logic';
import { ManagmentPo } from './managment.po';
import {MatButtonToggleHarness} from '@angular/material/button-toggle/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
describe('test 2', () => {

    let page: ManagmentPo;

    let loader: HarnessLoader;
    
    beforeEach(() => {
        page = new ManagmentPo();
        loader = ProtractorHarnessEnvironment.loader();
    });

    it('should add item', async () => {
        page.navigateTo();
        await putDataTest(page.putItemFileds(), loader);
        const toggleButton = await loader.getHarness(MatButtonToggleHarness.with({text: 'Items'}));
        await toggleButton.toggle();
        const newButton = await loader.getHarness(MatButtonHarness.with({text: 'Add Items'}));
        await newButton.click();
        // // let popupLoader = await loader.getChildLoader(MatDialogHarness.hostSelector);
        // const input1 = await loader.getHarness(MatInputHarness.with({placeholder: 'Descrption'}));
        // await input1.setValue('w320-raw');
        // const input2 = await loader.getHarness(MatAutocompleteHarness.with({value: ''}));
        // await input2.selectOption({text: 'KG'});
        // const input3 = await loader.getHarness(MatAutocompleteHarness.with({value: ''}));
        // await input3.selectOption({text: 'PRODUCT'});
        // const input4 = await loader.getHarness(MatAutocompleteHarness.with({value: ''}));
        // await input4.selectOption({text: 'RAW_KERNEL'});
        // const submitButton = await loader.getHarness(MatButtonHarness.with({text: 'Submit'}));
        // await submitButton.click();
        // expect(popupLo);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main/manager/ManagerSetup');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
  