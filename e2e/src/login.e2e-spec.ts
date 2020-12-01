import { browser, logging } from "protractor";
import { LoginPo } from './login.po';
import {HarnessLoader} from '@angular/cdk/testing';
import {ProtractorHarnessEnvironment} from '@angular/cdk/testing/protractor';
import { putDataTest } from './basic-test-logic';
describe('test 1', () => {

    let page: LoginPo;

    let loader: HarnessLoader;

    beforeEach(() => {
        page = new LoginPo();
        loader = ProtractorHarnessEnvironment.loader();
    });

    it('should log in', async () => {
        page.navigateTo();
        await putDataTest(page.logInFileds(), loader);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl+'Main');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
  