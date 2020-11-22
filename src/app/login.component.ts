import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from './field.interface';
import { AuthenticateService } from './service/authenticate.service';

@Component({
  selector: 'app-login',
  template:`
  <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}">
    <dynamic-form [fields]="regConfig" [mainLabel]="'Login Form'" (submitForm)="doLogin($event)">
    </dynamic-form>
  </div>
  ` ,
})
export class LoginComponent {

  regConfig: FieldConfig[] = [
    {
      type: 'input',
      name: 'name',
      label: 'Name',
      validations: [
        {
          name: 'required',
          validator: Validators.required,
          message: 'Name Required'
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
      label: 'Password',
      inputType: 'password',
      validations: [
        {
          name: 'required',
          validator: Validators.required,
          message: 'Password Required'
        }
      ]
    },
    {
      type: 'button',
      label: 'Login',
      name: 'submit'
    }
  ];

  constructor(private router: Router, private genralService: AuthenticateService) {}

  ngOnInit() {
		if(this.genralService.isUserLoggedIn()) {
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



