import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { UserAccountService } from './user-account.service';

@Component({
  selector: 'pass-change',
  template:`
  <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}">
    <dynamic-form [fields]="regConfig" mainLabel="Change Passsword" (submitForm)="changePass($event)" i18n-mainLabel>
    </dynamic-form>
  </div>
  ` ,
})
export class PassChangeComponent {

  regConfig: FieldConfig[] = [
    {
      type: 'input',
      name: 'oldPassword',
      label: $localize`Old password`,
      inputType: 'password',
      validations: [
        {
          name: 'required',
          validator: Validators.required,
          message: $localize`Old password Required`
        }
      ]
    },
    {
        type: 'input',
        name: 'newPassword',
        label: $localize`New password`,
        inputType: 'password',
        validations: [
            {
                name: 'required',
                validator: Validators.required,
                message: $localize`New password Required`
            }
        ]
    },
    {
        type: 'input',
        name: 'confirmPassword',
        label: $localize`Confirm password`,
        inputType: 'password',
        validations: [
            {
                name: 'required',
                validator: Validators.required,
                message: $localize`Confirm password Required`
            }
        ]
    },
    {
      type: 'button',
      label: $localize`Submit`,
      name: 'submit'
    }
  ];

  constructor(private router: Router, private LocalService: UserAccountService,  private _snackBar: MatSnackBar) {}

  ngOnInit() {
	}

    changePass(value) {
        if(value['newPassword'] === value['confirmPassword']) {
            delete value['confirmPassword'];
            this.LocalService.passChange(value).pipe(take(1)).subscribe(val => {
                this._snackBar.open($localize`Changed password successfully`, 'ok', {
                    duration: 5000,
                    verticalPosition:'top'
                  });
                  this.router.navigate(['Main/']);
            });
        } else {
            alert($localize`Passwords aren\`t equal`);
        }
	}

}



