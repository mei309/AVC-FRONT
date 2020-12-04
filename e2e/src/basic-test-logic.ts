import { TestField } from './testfield.interface';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import { browser } from 'protractor';
export async function putDataTest(fileds: TestField[], loader: HarnessLoader) {
    const submitButt = fileds.pop();
    fileds.forEach(async fc => {
        switch (fc.type) {
            case 'input':
            case 'select':
                const input1 = await loader.getHarness(MatInputHarness.with({placeholder: fc.placeholder}));
                await input1.setValue(fc.value);
                break;
            case 'selectMulti':
                const input2 = await loader.getHarness(MatInputHarness.with({placeholder: fc.placeholder}));
                fc.multiValue.forEach(async a => {
                    await input2.setValue(a);
                    await input2.blur();
                });
                break;
            case 'aray':
                const inputs3 = await loader.getAllHarnesses(MatInputHarness.with({placeholder: fc.placeholder}));
                let fieldnum = 0;
                inputs3.forEach(async a => {
                    await a.setValue(fc.multiValue[fieldnum]);
                    fieldnum++;
                });
                break;
            case 'button':
                const loginButton = await loader.getHarness(MatButtonHarness.with({text: fc.text}));
                await loginButton.click();
                break;
        }
    });
    const loginButton = await loader.getHarness(MatButtonHarness.with({text: submitButt.text}));
    await loginButton.click();
}
// let popupLoader = await loader.getChildLoader(MatDialogHarness.hostSelector);