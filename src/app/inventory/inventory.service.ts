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
  
  getStorageRelocations(functionality: string) {
    return this.http.get(this.inventorysurl+'getStorageRelocations/'+functionality);
  }

  addEditMaterialUse (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.inventorysurl+'addMaterialUse', value);
    } else {
      return this.http.put(this.inventorysurl+'editMaterialUse', value);
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

  getMaterialUses() {
    return this.http.get(this.inventorysurl+'getMaterialUses');
  }

  getGeneralInventoryOrder() {
    return this.http.get(this.inventorysurl+'getGeneralInventoryOrder');
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

  getMaterialUse (id: number): Observable<any> {
    return this.http.get(this.inventorysurl+'getMaterialUse/'+id);
  }

  getPoCashewCodesInventory (): Observable<any> {
    return this.http.get(this.inventorysurl+'getPoCashewCodesInventory');
  }
  

  getStorageTransferWithStorage(id: number, pos: Array<number>) {
    let response1 = this.http.get(this.inventorysurl+'getStorageRelocation/'+id);
    return forkJoin([response1, this.http.get(this.inventorysurl+'findAllPoCodes')]);
  }

  getStorageByPo (poCode: number): Observable<any> {
        return this.http.get(this.inventorysurl+'getStoragePo/'+poCode);
  }

  getAllPos (): Observable<any> {
      return this.http.get(this.inventorysurl+'findAllPoCodes');
  }

}
