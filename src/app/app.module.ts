import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { LayoutModule } from '@angular/cdk/layout';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Globals } from './global-params.component';
import { LoginComponent } from './Login.component';
import { MainComponent } from './main.component';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { LoadingService } from './service/loading-service.service';
import { SheardModule } from './sheard.module';

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
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_MOMENT_FORMATS_MY},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS_MY},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    Globals,
    LoadingService,
  ],
})
export class AppModule {}
