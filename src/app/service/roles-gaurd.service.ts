import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RolesGaurdService implements CanLoad {
  constructor() { }

  canLoad(route: Route): boolean {
    if(sessionStorage.getItem('roles').includes('ROLE_SYSTEM_MANAGER')) {
      return true;
    }
    return false;
  }

}
