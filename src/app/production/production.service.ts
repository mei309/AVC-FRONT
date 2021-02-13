import { forkJoin } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  productionurl = environment.baseUrl +'production/';

  constructor(private http: HttpClient) {
  } 

  getAllProduction(processName: string) {
    return this.http.get(this.productionurl+'allProduction/'+processName);
  }
  getAllCleaning() {
    return this.getAllProduction('CASHEW_CLEANING');
  }
  getAllRoasting() {
    return this.getAllProduction('CASHEW_ROASTING');
  }
  getAllPacking() {
    return this.getAllProduction('PACKING');
  }

  addEditCleaningTransfer(value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.productionurl+'addCleaningTransfer', value);
    } else {
      return this.http.put(this.productionurl+'editProductionTransfer', value);
    }
  }
  addEditRoastingTransfer(value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.productionurl+'addRoastingTransfer', value);
    } else {
      return this.http.put(this.productionurl+'editProductionTransfer', value);
    }
  }
  addEditPackingTransfer(value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.productionurl+'addPackingTransfer', value);
    } else {
      return this.http.put(this.productionurl+'editProductionTransfer', value);
    }
  }


  getProduction (id: number): Observable<any> {
    return this.http.get(this.productionurl+'getProduction/'+id);
  }

  getAllPosRaw() {
    return this.http.get(this.productionurl+'getAllPos/RAW_KERNEL');
  }
  getAllPosClean() {
    return this.http.get(this.productionurl+'getAllPos/CLEAN');
  }
  getAllPosRoast() {
    return this.http.get(this.productionurl+'getAllPos/ROAST');
  }

  findFreeMixPoCodes() {
    return this.http.get(this.productionurl+'findFreeMixPoCodes');
  }

  getStorageRawPo (poCode: number): Observable<any> {
    return this.http.get(this.productionurl+'getStorageRawPo/'+poCode);
  }
  getStorageCleanPo (poCode: number): Observable<any> {
    return this.http.get(this.productionurl+'getStorageCleanPo/'+poCode);
  }
  getStorageRoastPo (poCode: number): Observable<any> {
    return this.http.get(this.productionurl+'getStorageRoastPo/'+poCode);
  }

  getProductionWithStorage(id: number, poCode: number, processType: string) {
    // this.http.get(this.productionurl+'getTransferProduction/'+id);
    let response1 = this.http.get(this.productionurl+'getProduction/'+id);
    switch (processType) {
      case 'raw':
        return forkJoin([response1, this.http.get(this.productionurl+'getStorageRawPo/'+poCode)]);
      case 'clean':
        return forkJoin([response1, this.http.get(this.productionurl+'getStorageCleanPo/'+poCode)]);
      case 'roast':
        return forkJoin([response1, this.http.get(this.productionurl+'getStorageRoastPo/'+poCode)]);
      default:
        break;
    }
    // return forkJoin([response1, response2]);
  }

  getMixStorageRoastPo(pos: Array<number>) {
    let observables = [];
    pos.forEach(a => {
      let response1 = this.http.get(this.productionurl+'getStorageRoastPo/'+a);
      observables.push(response1);
    });
    
    return forkJoin(observables);
  }

}
