import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Globals } from '../global-params.component';
@Injectable({
  providedIn: 'root'
})
export class RolesGaurdService implements CanLoad {
  constructor(private myGlobal: Globals) { }

  canLoad(route: Route): boolean {
    if(this.myGlobal.isManager) {
      return true;
    }
    return false;
  }

}
