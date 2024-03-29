import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { take } from 'rxjs/operators';
import { FieldConfig } from './field.interface';
import { AuthenticateService } from './service/authenticate.service';

@Component({
  selector: 'app-login',
  template:`
  <span style="color: LightGray">version 9.5</span>
  <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}">
    <dynamic-form [fields]="regConfig" mainLabel="Login Form" (submitForm)="doLogin($event)" i18n-mainLabel>
    </dynamic-form>
  </div>
  ` ,
})
export class LoginComponent {

  regConfig: FieldConfig[] = [
    {
      type: 'input',
      name: 'name',
      label: $localize`Name`,
      validations: [
        {
          name: 'required',
          validator: Validators.required,
          message: $localize`Name Required`
        },
        // {
        //   name: 'pattern',
        //   validator: Validators.pattern('^[a-zA-Z ]+$'),
        //   message: 'Accept only text'
        // }
      ]
    },
    {
      type: 'input',
      name: 'password',
      label: $localize`Password`,
      inputType: 'password',
      validations: [
        {
          name: 'required',
          validator: Validators.required,
          message: $localize`Password Required`
        }
      ]
    },
    {
      type: 'button',
      label: $localize`Login`,
      name: 'submit'
    }
  ];

  constructor(private router: Router, private genralService: AuthenticateService, updates: SwUpdate) {
    updates.available.pipe(take(1)).subscribe(event => {
        console.log(event);

      // if (promptUser(event)) {
        updates.activateUpdate().then(() => document.location.reload());
      // }
    });
  }

  ngOnInit() {
		if(this.genralService.isLoggedIn) {
			this.router.navigateByUrl('Main');
		}
	}

  doLogin(value) {
		if(value['name'] && value['password']) {
			this.genralService.authenticate(value['name'], value['password']).pipe(take(1)).subscribe((result)=> {
        this.router.navigate(['/Main']);
			}, () => {
				// alert('Either invalid credentials or something went wrong');
			});
		}
	}

}



