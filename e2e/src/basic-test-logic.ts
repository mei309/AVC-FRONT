import { TestField } from './testfield.interface';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatButtonHarness} from '@angular/material/button/testing';

export async function putDataTest(fileds: TestField[], loader: HarnessLoader) {
    const submitButt = fileds.pop();
    fileds.forEach(async fc => {
        switch (fc.type) {
            case 'input':
                const input1 = await loader.getHarness(MatInputHarness.with({placeholder: fc.placeholder}));
                await input1.setValue(fc.value);
                break;
            case 'button':
                const loginButton = await loader.getHarness(MatButtonHarness.with({text: fc.text}));
                await loginButton.click();
                
        }
    });
    const loginButton = await loader.getHarness(MatButtonHarness.with({text: submitButt.text}));
    await loginButton.click();
}