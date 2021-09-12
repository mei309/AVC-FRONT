import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RolesGaurdService implements CanLoad {
  constructor() { }

  canLoad(route: Route): boolean {
    const token = JSON.parse(sessionStorage.getItem('roles'));

    if(token[0]['authority'] === 'ROLE_SYSTEM_MANAGER') {
      return true;
    }
    return false;
  }

}
