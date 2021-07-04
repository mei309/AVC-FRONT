import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatNativeDateModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { LayoutModule } from '@angular/cdk/layout';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatDateFormats, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
// import enUS from 'date-fns/esm/locale/en-US';
// import vi from 'date-fns/esm/locale/vi';
// import { NgxMatDateFnsDateModule, NGX_MAT_DATEFNS_DATE_ADAPTER_OPTIONS, NGX_MAT_DATEFNS_LOCALES } from 'ngx-mat-datefns-date-adapter';
// import localeENIL from '@angular/common/locales/en-IL';
// import { registerLocaleData } from '@angular/common';
// registerLocaleData(localeENIL);
// import { NgxMatDateFnsDateModule, NGX_MAT_DATEFNS_DATE_FORMATS } from "ngx-mat-datefns-date-adapter";
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgxDateFnsDateAdapterMine, NGX_MAT_DATEFNS_DATE_ADAPTER_OPTIONS_MINE } from './detatime';
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
// export const APP_DATE_FORMATS: MatDateFormats = {
//   parse: {
//     dateInput: 'P',
//   },
//   display: {
//     dateInput: 'MMM d, y HH:mm',
//     monthYearLabel: 'MMM d, y HH:mm',
//     dateA11yLabel: 'MMMM d, y HH:mm',
//     monthYearA11yLabel: 'MMMM y HH:mm'
//   }
// };

// export const NG_MAT_DATEFNS_DATE_FORMATS_MY: NgxMatDateFormats  = {
//     parse: {
//         dateInput: "Pp",
//         // monthInput: "MMMM",
//         // timeInput: "LT",
//         // datetimeInput: "L LT"
//       },
//       display: { 
//         dateInput: 'MMM d, y HH:mm',
//         monthYearLabel: 'MMM d, y HH:mm',
//         dateA11yLabel: 'MMMM d, y HH:mm',
//         monthYearA11yLabel: 'MMMM YYYY'
//       }
    
//   };

export const MAT_MOMENT_DATE_FORMATS_MY: MatDateFormats = {
  parse: {
    dateInput: 'l',
  },
  display: {
    dateInput: 'll',//'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const NGX_MAT_MOMENT_FORMATS_MY: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS',
  },
  display: {
    dateInput: 'lll',//'YYYY-MM-DD HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
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
    MatMomentDateModule,
    NgxMatMomentModule,
    // NgxMatDateFnsDateModule,
    // MatNativeDateModule,
    // NgxMatDateFnsDateModule,
    // DateFnsModule.forRoot(),
    // NgxMatDateFnsDateModule,
    // NgxMatNativeDateModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},

    // {provide: NGX_MAT_DATEFNS_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
    // // {provide: MAT_DATE_LOCALE, useValue: "en-US"},
    // {provide: NGX_MAT_DATEFNS_LOCALES, useValue: [enUS, vi]},
    // { provide: LOCALE_ID, useValue: 'en-GB' }, 
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    // { provide: DateFnsConfigurationService, useValue: enGBConfig },
    // {provide: NgxMatDateAdapter, useClass: NgxDateFnsDateAdapterMine},
    // {provide: NGX_MAT_DATEFNS_DATE_ADAPTER_OPTIONS_MINE, useValue: { useUtc: true }},
    {provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_MOMENT_FORMATS_MY},
    // {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS_MY},
    {provide: LocationStrategy, useClass: HashLocationStrategy},


    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    // {provide: NgxMatDateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]}
    // { provide: }
    //otherProviders...
    Globals,
    LoadingService,
  ],
})
export class AppModule {}
