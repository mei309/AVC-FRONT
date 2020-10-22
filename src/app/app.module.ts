import { NgxMatDateAdapter, NgxMatNativeDateModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
import { NgxMatDateFnsDateModule, NGX_MAT_DATEFNS_DATE_FORMATS } from "ngx-mat-datefns-date-adapter";
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyDateAdapter, NgxDateFnsDateAdapterMine, NG_MAT_DATEFNS_DATE_FORMATS_MY } from './detatime';
import { Globals } from './global-params.component';
import { LoginComponent } from './Login.component';
import { MainComponent } from './main.component';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { LoadingService } from './service/loading-service.service';
import { SheardModule } from './sheard.module';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    // LocaleService,
  ],
  exports: [
    LoginComponent,
    // BrowserAnimationsModule,
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
    NgxMatDateFnsDateModule,

    NgxMatNativeDateModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    { provide: LOCALE_ID, useValue: "en-GB" }, 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

    { provide: NgxMatDateAdapter, useClass: NgxDateFnsDateAdapterMine, deps: [MAT_DATE_LOCALE]},
    // { provide: DateAdapter, useClass: MyDateAdapter},
    {provide: NGX_MAT_DATE_FORMATS, useValue: NG_MAT_DATEFNS_DATE_FORMATS_MY},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_DATEFNS_DATE_FORMATS_MY},
    // { provide: }
    //otherProviders...
    Globals,
    LoadingService,
  ],
})
export class AppModule {}
