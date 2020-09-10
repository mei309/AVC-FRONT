import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanLoad {
  constructor() { }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (sessionStorage.getItem('username') === 'isral309') {
      // const token = JSON.parse(sessionStorage.getItem('roles'));
      
      // if(token[0]['authority'] === 'ROLE_MANAGER') {
      //   return true;
      // } 
      return true;
    }
    // alert('only manager welcomed here');
    return true;
  }

}
