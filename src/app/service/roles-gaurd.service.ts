import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RolesGaurdService implements CanLoad {
  constructor() { }

  canLoad(route: Route): boolean {
      console.log(route);
      
    if (sessionStorage.getItem('username') === 'isral') {
      // const token = JSON.parse(sessionStorage.getItem('roles'));
      
      // if(token[0]['authority'] === 'ROLE_MANAGER') {
      //   return true;
      // } 
      return true;
    }
    // alert('only manager welcomed here');
    return false;
  }

}
