import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatNativeDateModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { LayoutModule } from '@angular/cdk/layout';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatDateFormats, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
// import localeENIL from '@angular/common/locales/en-IL';
// import { registerLocaleData } from '@angular/common';
// registerLocaleData(localeENIL);
// import { NgxMatDateFnsDateModule, NGX_MAT_DATEFNS_DATE_FORMATS } from "ngx-mat-datefns-date-adapter";
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { MyDateAdapter, NgxDateFnsDateAdapterMine, NG_MAT_DATEFNS_DATE_FORMATS_MY } from './detatime';
import { Globals } from './global-params.component';
import { LoginComponent } from './Login.component';
import { MainComponent } from './main.component';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { LoadingService } from './service/loading-service.service';
import { SheardModule } from './sheard.module';
// import { DateFnsConfigurationService, DateFnsModule } from 'ngx-date-fns';
// import { enGB } from "date-fns/locale";
// // import { DateFnsDateAdapter, MAT_DATE_FNS_DATE_FORMATS, NGDateFnsDateAdapter, NG_MAT_DATE_FNS_DATE_FORMATS } from './detetime2';
// import { NgxMatDateFnsDateModule } from 'ngx-mat-datefns-date-adapter';
// import { MAT_DATEFNS_DATE_FORMATS_MY, MyDateAdapter, NgxDateFnsDateAdapterMine, NG_MAT_DATEFNS_DATE_FORMATS_MY } from './detatime';
// const enGBConfig = new DateFnsConfigurationService();
// enGBConfig.setLocale(enGB);
// export class AppDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//     console.log(date.toUTCString());
//       return date.toUTCString();
//   }
// }
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export const NG_MAT_DATEFNS_DATE_FORMATS_MY: NgxMatDateFormats  = {
    parse: {
        dateInput: "l, LTS",
        // monthInput: "MMMM",
        // timeInput: "LT",
        // datetimeInput: "L LT"
      },
      display: { 
        dateInput: { month: 'short', year: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
        monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
      }
    
  };

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    // LocaleService,
  ],
  exports: [
    LoginComponent,
    BrowserAnimationsModule,
    // BrowserModule,
    ],
  imports: [
    FlexLayoutModule,
    BrowserAnimationsModule,
    SheardModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    // NgxMatDateFnsDateModule,
    MatNativeDateModule,
    // NgxMatDateFnsDateModule,
    // DateFnsModule.forRoot(),
    NgxMatNativeDateModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    { provide: LOCALE_ID, useValue: 'en-GB' }, 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    // { provide: DateFnsConfigurationService, useValue: enGBConfig },
    // { provide: NgxMatDateAdapter, useClass: NgxMatNativeDateModule},
    {provide: NGX_MAT_DATE_FORMATS, useValue: NG_MAT_DATEFNS_DATE_FORMATS_MY},
    // {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    // { provide: }
    //otherProviders...
    Globals,
    LoadingService,
  ],
})
export class AppModule {}
