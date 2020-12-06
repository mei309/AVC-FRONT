import { TestField } from './testfield.interface';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import { browser } from 'protractor';
import {ComponentHarness, BaseHarnessFilters, HarnessPredicate} from '@angular/cdk/testing';

// interface BigExpandHarnessFilters extends BaseHarnessFilters {
//     /** Filters based on the trigger text for the menu. */
//     target?: string | RegExp;
//   }


// class BigExpandHarness extends ComponentHarness {
//     static hostSelector = 'app-bigexpand';
//     /** Creates a `HarnessPredicate` used to locatr a particular `MyMenuHarness`. */
//     static with(options: BigExpandHarnessFilters): HarnessPredicate<BigExpandHarness> {
//       return new HarnessPredicate(BigExpandHarness, options)
//           .addOption('target text', options.target,
//               (harness, text) => HarnessPredicate.stringMatches(harness.getTarget(), text));
//     }
//     async getTarget(): Promise<string> {
//         const host = await this.host();
//         return host.getAttribute('target');
//       } 
// }
// class ArrayHarness extends ComponentHarness {
//     static hostSelector = 'app-array';
//     /** Creates a `HarnessPredicate` used to locatr a particular `MyMenuHarness`. */
//     static with(options: BigExpandHarnessFilters): HarnessPredicate<ArrayHarness> {
//       return new HarnessPredicate(ArrayHarness, options)
//           .addOption('target text', options.target,
//               (harness, text) => HarnessPredicate.stringMatches(harness.getTarget(), text));
//     }
//     async getTarget(): Promise<string> {
//         const host = await this.host();
//         return host.getAttribute('target');
//       }   
// }
  
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
            case 'array':
                // const inputs3 = await loader.getAllHarnesses(MatInputHarness.with({placeholder: fc.placeholder}));
                const inputs3 = await loader.getChildLoader('#'+fc.placeholder);
                const inputs4 = await inputs3.getAllHarnesses(MatInputHarness);
                let fieldnum = 0;
                inputs4.forEach(async a => {
                    if(fc.multiValue[fieldnum]) {
                        await a.setValue(fc.multiValue[fieldnum]);
                    }
                    fieldnum++;
                });
                break;
            case 'bigexpand':
            //     const inputs4 = await loader.getHarness(BigExpandHarness.with({target: fc.placeholder}));
                const inputs5 = await loader.getChildLoader('#'+fc.placeholder);
                this.putDataTest(fc.collections, inputs5);
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