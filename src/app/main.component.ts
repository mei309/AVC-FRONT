import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Genral } from './genral.service';
import { AuthenticateService } from './service/authenticate.service';
import { LoadingService } from './service/loading-service.service';
import { Globals } from './global-params.component';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent {
  // public visibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // this.visibility = this.loadingService.visibility;
  language: FormControl;
  languageList = [
    { code: 'en-US', label: 'US' },
    // { code: 'en-UK', label: 'UK' },
    { code: 'vi', label: 'Tiếng Việt' },
    // { code: 'INDIA', label: 'हिंदी' },
  ];

  destroySubject$: Subject<void> = new Subject();

  todo: number = 0;
  massages: number = 0;

  constructor(@Inject(LOCALE_ID) private _locale: string, private _adapter: DateAdapter<any>, public myGlobal: Globals,
    private genral: Genral, private genralService: AuthenticateService, public loadingService: LoadingService) {
    this.language = new FormControl(this.languageList.find(lang => lang.code === this._locale));
    this._adapter.setLocale(this._locale);
    this.genral.doInitiel();
  }

  ngOnInit() {
    this.genral.getNumOfTodo().pipe(takeUntil(this.destroySubject$)).subscribe(value => {
      this.todo = value;
    });
    this.genral.getNumOfMassages().pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      this.massages = val;
    });
  }

  onInitilRefresh() {
    this.genral.backToInitil();
  }

  logout() {
    this.genralService.logOut();
  }
  onPrint() {
    window.print();
  }

  navigateTo(value){
    this._adapter.setLocale(this._locale);
    window.location.href = window.location.origin+'/'+value.code;
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
