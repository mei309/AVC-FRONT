import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Login.component';
import { MainComponent } from './main.component';
import { SheardModule } from './sheard.module';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { Globals } from './global-params.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingService } from './service/loading-service.service';

// import localeENVI from '@angular/common/locales/en-VI';
// import { registerLocaleData } from '@angular/common';
// registerLocaleData(localeENVI);

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
    BrowserAnimationsModule,
    SheardModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    // { provide: LOCALE_ID, useValue: "en-IL" }, 
    //otherProviders...
    Globals,
    LoadingService,
  ],
})
export class AppModule {}
