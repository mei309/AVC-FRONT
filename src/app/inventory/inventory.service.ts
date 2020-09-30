import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReplaySubject, Observable } from 'rxjs';
import { DropNormal } from '../field.interface';
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  inventorysurl = environment.baseUrl +'inventory/';

  constructor(private http: HttpClient) {
  } 

  getTransferCounts() {
    return this.http.get(this.inventorysurl+'getTransferCounts');
  }
  
  // getStorageTransfersTable() {
  //   return this.http.get(this.inventorysurl+'getStorageTransfersTable');
  // }

  addEditTransfer (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.inventorysurl+'addStorageTransfer', value);
    } else {
      return this.http.put(this.inventorysurl+'editStorageTransfer', value);
    }
  }

  addEditRelocationTransfer (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.inventorysurl+'addRelocationTransfer', value);
    } else {
      return this.http.put(this.inventorysurl+'editRelocationTransfer', value);
    }
  }

  getCashewInventoryItem() {
    return this.http.get(this.inventorysurl+'getCashewInventoryItem');
  }

  getCashewInventoryByPo() {
    return this.http.get(this.inventorysurl+'getCashewInventoryByPo');
  }

  getGeneralInventoryItem() {
    return this.http.get(this.inventorysurl+'getGeneralInventoryItem');
  }

  getGeneralInventoryByPo() {
    return this.http.get(this.inventorysurl+'getGeneralInventoryByPo');
  }

  getStorageByPo (poCode: number): Observable<any> {
    return this.http.get(this.inventorysurl+'getStorageTransferPo/'+poCode);
  }

  getStorageByItem (itemId: number): Observable<any> {
    return this.http.get(this.inventorysurl+'getStorageTransferItem/'+itemId);
  }

  getStorageTransfer (id: number): Observable<any> {
    return this.http.get(this.inventorysurl+'getStorageTransfer/'+id);
  }

  getPoCashewCodesInventory (): Observable<any> {
    return this.http.get(this.inventorysurl+'getPoCashewCodesInventory');
  }
  
  getAllPosRoast() {
    return this.http.get(this.inventorysurl+'getAllPos/ROAST');
  }

}
