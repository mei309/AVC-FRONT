// import { Injectable } from '@angular/core';
// import { registerLocaleData } from '@angular/common';
// import localeENVN from '@angular/common/locales/en-VI';
// import localeEN from '@angular/common/locales/en';
// import localeENUK from '@angular/common/locales/en-GB';
// import localeVN from '@angular/common/locales/vi';

// @Injectable({ providedIn: 'root' })
// export class LocaleService {

//     private _locale: string;

//     set locale(value: string) {
//         this._locale = value;
//     }
//     get locale(): string {
//         console.log(this._locale);
        
//         return this._locale || 'en';
//     }

//     registerCulture(culture: string) {
//         console.log(culture);
        
//         if (!culture) {
//             return;
//         }
//         this.locale = culture;
//         switch (culture) {
//             case 'en-US': {
//                 registerLocaleData(localeEN);
//                 break;
//             }
//             case 'en-UK': {
//                 registerLocaleData(localeENUK);
//                 break;
//             }
//             case 'en-VI': {
//                 registerLocaleData(localeENVN);
//                 break;
//             }
//             case 'vi': {
//                 registerLocaleData(localeVN);
//                 break;
//             }
//         }
//         // window.location.reload();
//     }
//     changeLanguage(lang: string) {
//         // spinner.show();  // <-- start any loader
//         setTimeout(() => {
//                 this.session.registerCulture(lang);
//                 // spinner.hide();  // <-- stop the loader
//               }, 1000);
//       }
//       <p>Choose language:</p>
//     <button (click)="changeLanguage('en-GB')">English</button>
//     <button (click)="changeLanguage('vi')">Vietnamese</button>
// }

// {provide: LOCALE_ID, deps: [LocaleService], useFactory: (LocaleService: { locale: string; }) => LocaleService.locale},
