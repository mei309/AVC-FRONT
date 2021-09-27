import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Globals } from '../global-params.component';
@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanLoad {
  constructor(private myGlobal: Globals) { }

  canLoad(): boolean {
    if (this.myGlobal.isMe) {
      return true;
    }
    return false;
  }

}
