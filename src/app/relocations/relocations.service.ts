import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RelocationsService {

  inventorysurl = environment.baseUrl +'inventory/';

  constructor(private http: HttpClient) {
  } 

  getTransferCounts() {
    return this.http.get(this.inventorysurl+'getTransferCounts');
  }
  
  getStorageRelocations(functionality: string) {
    return this.http.get(this.inventorysurl+'getStorageRelocations/'+functionality);
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

  getCashewInventoryOrder() {
    return this.http.get(this.inventorysurl+'getCashewInventoryOrder');
  }

  getGeneralInventoryItem() {
    return this.http.get(this.inventorysurl+'getGeneralInventoryItem');
  }

  getGeneralInventoryByPo() {
    return this.http.get(this.inventorysurl+'getGeneralInventoryByPo');
  }

  getGeneralInventoryOrder() {
    return this.http.get(this.inventorysurl+'getGeneralInventoryOrder');
  }

  getStorageByPo (poCode: number, type: string): Observable<any> {
    if(type === 'Raw') {
      return this.http.get(this.inventorysurl+'getStorageRawPo/'+poCode);
    } else {
      return this.http.get(this.inventorysurl+'getStorageCleanPo/'+poCode);
    }
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
  
  getStorageTransferWithStorage(id: number, pos: Array<number>, type: string) {
    let response1 = this.http.get(this.inventorysurl+'getStorageRelocation/'+id);
    if(type === 'Raw') {
      return forkJoin([response1, this.http.get(this.inventorysurl+'getStorageRawPo/'+pos)]);
    } else {
      return forkJoin([response1, this.http.get(this.inventorysurl+'getStorageCleanPo/'+pos)]);
    }
  }

  getAllPos (item: string): Observable<any> {
      return this.http.get(this.inventorysurl+'getAllPos/'+item);
  }

}
