import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { jwt_decode } from 'jwt-decode';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  tokenInit$ = this.tokenSubject.asObservable();


  destroySubject$: Subject<void> = new Subject();

  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  mainurl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {
      this.tokenSubject.next(sessionStorage.getItem('token'));
  }

  public get isLoggedIn() : boolean {
    return this.tokenSubject.getValue()? true : false;
  }

  public get currentTokenValue(): string {
    return this.tokenSubject.getValue();
  }
  waitInit(): Observable<any> {
    return new Observable(observer => {
      this.tokenInit$.subscribe(token => {
        if(token) {
          observer.next();
          observer.complete();
        }
      });
    });
  }
  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
          this.tokenRefreshed$.subscribe(() => {
              observer.next();
              observer.complete();
          });
      });
    } else {
      if(sessionStorage.getItem('username')) {
        this.refreshTokenInProgress = true;
        var person = prompt("Please enter your password again", "");
        return this.authenticate(sessionStorage.getItem('username'), person).pipe(
          switchMap((data) => {
            this.refreshTokenInProgress = false;
            this.tokenRefreshedSource.next();
            this.tokenRefreshedSource.complete();
            return data;
          }));
      } else {
        this.logOut();
        window.alert('Incorrect username or password you are redirected to login');
        return throwError('');
      }
    }
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
  
  isUserLoggedIn() {
    let user = sessionStorage.getItem('username');
    return !(user === null);
  }

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
