import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
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
  
  getStorageRelocations() {
    return this.http.get(this.inventorysurl+'getStorageRelocations');
  }

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
  
  getStorageRelocation (id: number): Observable<any> {
    return this.http.get(this.inventorysurl+'getStorageRelocation/'+id);
  }

  getPoCashewCodesInventory (): Observable<any> {
    return this.http.get(this.inventorysurl+'getPoCashewCodesInventory');
  }
  
  getAllPosRoast() {
    return this.http.get(this.inventorysurl+'getAllPos/ROAST');
  }

  getStorageTransferWithStorage(id: number, pos: Array<number>) {
    let response1 = this.http.get(this.inventorysurl+'getStorageRelocation/'+id);
    return forkJoin([response1, this.http.get(this.inventorysurl+'getStorageTransferPo/'+pos)]);
  }

}
