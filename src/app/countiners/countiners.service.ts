
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DropNormal } from '../field.interface';
@Injectable({
  providedIn: 'root'
})
export class CountinersService {

  sharingData: JSON;

  contianerurl = environment.baseUrl +'container/';

  shippingPorts = new ReplaySubject<DropNormal[]>();

  constructor(private http: HttpClient) {
    this.http.get(this.contianerurl+'getSetUpContianer').pipe(take(1)).subscribe(value => {
      this.shippingPorts.next(value[0]);
    });
  }


  addEditLoading (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.contianerurl+'addLoading', value);
    } else {
      return this.http.put(this.contianerurl+'editLoading', value);
    }
  }

  addEditShipmentCode (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.contianerurl+'addShipmentCode', value);
    } else {
      return this.http.put(this.contianerurl+'editShipmentCode', value);
    }
  }

  addEditContainerArrival (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.contianerurl+'addContainerArrival', value);
    } else {
      return this.http.put(this.contianerurl+'editContainerArrival', value);
    }
  }

  getContainerArrival (id: number) {
    return this.http.get(this.contianerurl+'getContainerArrival/'+id);
  }

  getLoading (id: number) {
    return this.http.get(this.contianerurl+'getLoading/'+id);
  }

  getLoadingExportDoc (id: number) {
    return this.http.get(this.contianerurl+'getLoadingExportDoc/'+id);
  }

  getLoadingSecurityDoc (id: number) {
    return this.http.get(this.contianerurl+'getLoadingSecurityDoc/'+id);
  }

  getAllLoadings () {
    return this.http.get(this.contianerurl+'getAllLoadings');
  }


  getStorageRoastPackedPo (poCode: number): Observable<any> {
    return this.http.get(this.contianerurl+'getStorageRoastPackedPo/'+poCode);
  }

  getAllPosRoastPacked() {
    return this.http.get(this.contianerurl+'getAllPosRoastPacked');
  }

  findFreeShipmentCodes () {
    return this.http.get(this.contianerurl+'findFreeShipmentCodes');
  }

  findFreeArrivals () {
    return this.http.get(this.contianerurl+'findFreeArrivals');
  }

  findShipmentCodes () {
    return this.http.get(this.contianerurl+'findShipmentCodes');
  }

  findContainerArrivals () {
    return this.http.get(this.contianerurl+'findContainerArrivals');
  }

  getShippingPorts (): Observable<any> {
    return this.shippingPorts.asObservable();
  }

}