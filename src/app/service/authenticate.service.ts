import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { jwt_decode } from 'jwt-decode';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);


  destroySubject$: Subject<void> = new Subject();

  refreshTokenInProgress = false;

  // tokenRefreshedSource = new Subject();
  // tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  mainurl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {
    if(sessionStorage.getItem('token')) {
      this.tokenSubject.next(sessionStorage.getItem('token'));
    }
  }

  public get isLoggedIn() : boolean {
    return this.tokenSubject.getValue()? true : false;
  }

  public get currentTokenValue(): string {
    return this.tokenSubject.getValue();
  }
  waitInit(): Observable<any> {
    return this.tokenSubject.asObservable();
  }

  refreshToken() {
    this.tokenSubject.next(null);
  }

  
	authenticate(username, password) {
      return this.http.post<any>(this.mainurl+'authenticate',{username,password}).pipe(
       map(
         userData => { 
          sessionStorage.setItem('username',username);
          let tokenStr= 'Bearer '+userData.token;
          sessionStorage.setItem('token', tokenStr);
          this.tokenSubject.next(tokenStr);
          const tokenPayload = parseJwt(userData.token);
          sessionStorage.setItem('id', tokenPayload.id);
          sessionStorage.setItem('roles', JSON.stringify(tokenPayload.roles));
          // this.globals.setGlobalPermission(tokenPayload.roles);
          return userData;
         })
      );
    }
  
  logOut() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    this.tokenSubject.next(null);
    this.router.navigate(['/']);
  }
  
  // isUserLoggedIn() {
  //   let user = sessionStorage.getItem('username');
  //   return !(user === null);
  // }

  ngOnDestroy() {
        this.destroySubject$.next();
  }

}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};
