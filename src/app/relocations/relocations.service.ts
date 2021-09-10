import { HttpClient, HttpParams } from '@angular/common/http';
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

  getStorageRelocations(functionality: string, rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
    return this.http.get(this.inventorysurl+'getStorageRelocations/'+functionality, {params});
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

  getStorageByPo (poCode: number, num: number, id?: number): Observable<any> {
    switch (num) {
      case 0:
        return this.http.get(id? this.inventorysurl+'getStorageRawPo/'+poCode+'/'+id: this.inventorysurl+'getStorageRawPo/'+poCode);
      case 1:
        return this.http.get(id? this.inventorysurl+'getStorageCleanPo/'+poCode+'/'+id: this.inventorysurl+'getStorageCleanPo/'+poCode);
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

  getStorageTransferWithStorage(id: number, pos: Array<number>, num: number) {
    let response1 = this.http.get(this.inventorysurl+'getStorageRelocation/'+id);
    switch (num) {
      case 0:
        return forkJoin([response1, this.http.get(this.inventorysurl+'getStorageRawPo/'+pos+'/'+id)]);
      case 1:
        return forkJoin([response1, this.http.get(this.inventorysurl+'getStorageCleanPo/'+pos+'/'+id)]);
    }
  }

  getAllPos (num: number): Observable<any> {
      switch (num) {
          case 0:
            return this.http.get(this.inventorysurl+'getAllPos/RAW_KERNEL');
          case 1:
            return this.http.get(this.inventorysurl+'getAllPos/CLEAN');
      }
  }

}
