import { FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
export interface Validator {
  name: string;
  validator?: any;
  message?: string;
}

export class FieldConfig {
  label?: string;
  name?: string;
  inputType?: string;
  options?: any;
  collections?: any;
  type: string;
  value?: any;
  validations?: Validator[];
  disable?: boolean;
}

export interface DropNormal {
  value: string;
  id: number;
}

export interface DropCashewItems {
  value: string;
  id: number;
  productionUse: string;
  group: string;
  grade: string;
}

export interface DropNormalPLine extends DropNormal {
  productionFunctionality: string;
}

export interface OneColumn {
  type?: string;
  name: string;
  label?: string;
  titel?: string;
  options?: string[] | Observable<string[]> | string | ReplaySubject<any[]>;
  search?: string;
  compare?: Compare | string;
  collections?: any;
  group?: string;
}


export interface Compare {
  name?: string;
  type?: string;
  condition?: string;
  condVar?: string;
}

export interface FieldShow {
  label?: string;
  name?: string;
  type: string;
  collections?: any;
}




export function allOrNoneRequired(kids: Validator[]): ValidatorFn {
  return (fg: FormGroup): ValidationErrors | null => {
    if(!fg.dirty) {
      return null;
    }
    if(checkEmpty(fg)) {
      return null;
    }
    return (kidsValdaite(kids, fg))
             ? null
             : {allOrNoneRequired: true};
  };
}
function kidsValdaite(kids: Validator[], fg: FormGroup) : boolean {
  return kids.every(element => {
    if(element.hasOwnProperty('validator')) {
      if(fg.get(element.name) instanceof FormArray){
        return (fg.get(element.name) as FormArray).controls.some(ft => {
            if(ft) {
              return kidsValdaite(element.validator, ft as FormGroup)
            } else {
              return false;
            }
          });
      } else {
        return (kidsValdaite(element.validator, (fg.get(element.name) as FormGroup)));
      }
    } else {
      if(fg && fg.get(element.name) && fg.get(element.name).value){
          if(fg.get(element.name) instanceof FormArray){
            const controls = Object.values((fg.get(element.name) as FormArray).controls);
            return (controls.some(fm => {
              if(fm.value.value) {
                return true;
              }
            }));
          } else{
            return true;
          }
      } else {
        return false;
      }
    }
  });
}
export function checkEmpty(fg: FormGroup): boolean{
  const controls = Object.values(fg.controls);
  if(controls.every(fc => {
      if(fc instanceof FormGroup){
        return checkEmpty(fc);
      } else if(fc instanceof FormArray){
        return fc.controls.every(ft => {return checkEmpty(ft as FormGroup)});
      } else {
        if(fc.value) {
          return false;
        } else {
          return true;
        }
      }
    })) {
    return true;
  } else{
    return false;
  }
}

export function atLeastOneRequired(): ValidatorFn {
  return (formValue: FormArray): ValidationErrors | null => {
    const controls = Object.values(formValue.controls);
    var legal = controls.some(fa => {
      if((fa as FormGroup).contains('id')) {
        return true;
      } else if(fa.pristine) {
        return false;
      } else if(checkEmpty(fa as FormGroup)) {
        return false;
      } else {
        return true;
      }
    });
    return legal? null : {atLeastOneRequired: true};
  }
}



// ADD THIS MODULE IN YOUR PROJECT, AND LOAD IT IN THE MAIN CLASS
import {MatInput} from '@angular/material/input';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

/**
 * Fix for the MatInput required asterisk.
 */
Object.defineProperty(MatInput.prototype, 'required', {
	get: function (): boolean {
		if (this._required) {
			return this._required;
		}

		// The required attribute is set
		// when the control return an error from validation with an empty value
		if (this.ngControl && this.ngControl.control && this.ngControl.control.validator) {
			const emptyValueControl = Object.assign({}, this.ngControl.control);
			(emptyValueControl as any).value = null;
			return 'required' in (this.ngControl.control.validator(emptyValueControl) || {});
		}
		return false;
	},
	set: function (value: boolean) {
		this._required = coerceBooleanProperty(value);
	}
});
