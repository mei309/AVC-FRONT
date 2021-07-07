import { HttpClient, HttpParams } from '@angular/common/http';
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
  
  getStorageRelocations(functionality: string, rangeDate) {
    var params: HttpParams;
    if(rangeDate.begin) {
      params = new HttpParams()
      .set('begin',  rangeDate.begin)
      .set('end', rangeDate.end);
    } else {
      params = new HttpParams();
    }
    return this.http.get(this.inventorysurl+'getStorageRelocations/'+functionality, {params});
  }

  addEditMaterialUse (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.inventorysurl+'addMaterialUse', value);
    } else {
      return this.http.put(this.inventorysurl+'editMaterialUse', value);
    }
  }

  addEditCashewUse (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.inventorysurl+'addCashewUse', value);
    } else {
      return this.http.put(this.inventorysurl+'editCashewUse', value);
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

  getMaterialUses(rangeDate) {
    var params: HttpParams;
    if(rangeDate.begin) {
      params = new HttpParams()
      .set('begin',  rangeDate.begin)
      .set('end', rangeDate.end);
    } else {
      params = new HttpParams();
    }
    return this.http.get(this.inventorysurl+'getMaterialUses', {params});
  }

  getCashewUses(rangeDate) {
    var params: HttpParams;
    if(rangeDate.begin) {
      params = new HttpParams()
      .set('begin',  rangeDate.begin)
      .set('end', rangeDate.end);
    } else {
      params = new HttpParams();
    }
    return this.http.get(this.inventorysurl+'getCashewUses', {params});
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

  getStroageUse (id: number): Observable<any> {
    return this.http.get(this.inventorysurl+'getStroageUse/'+id);
  }

  getPoCashewCodesInventory (): Observable<any> {
    return this.http.get(this.inventorysurl+'getPoCashewCodesInventory');
  }
  

  getStorageTransferWithStorage(id: number, pos: Array<number>) {
    let response1 = this.http.get(this.inventorysurl+'getStorageRelocation/'+id);
    return forkJoin([response1, this.http.get(this.inventorysurl+'getStoragePo/'+pos+'/'+id)]);
  }

  getStorageByPo (poCode: number, id?: number): Observable<any> {
        return this.http.get(id? this.inventorysurl+'getStoragePo/'+poCode+'/'+id : this.inventorysurl+'getStoragePo/'+poCode);
  }

  getAllPos (): Observable<any> {
      return this.http.get(this.inventorysurl+'findAllPoCodes');
  }

  getAllCashewPos(): Observable<any> {
    return this.http.get(this.inventorysurl+'getAllCashewPos');
  }

  getAllStorageCashew(poCode: number): Observable<any> {
    return this.http.get(this.inventorysurl+'getAllStorageCashew/'+poCode);
  }

  getUsageWithStorage(id: number, poCode: number) {
    // this.http.get(this.productionurl+'getTransferProduction/'+id);
    let response1 = this.http.get(this.inventorysurl+'getStroageUse/'+id);
    return forkJoin([response1, this.http.get(this.inventorysurl+'getAllStorageCashew/'+poCode)]);
  }
}
