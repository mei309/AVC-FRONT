import { forkJoin } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getAllProduction(processName: string, rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
    return this.http.get(this.productionurl+'allProduction/'+processName, {params});
  }
  getAllCleaning(rangeDate) {
    return this.getAllProduction('CASHEW_CLEANING', rangeDate);
  }
  getAllRoasting(rangeDate) {
    return this.getAllProduction('CASHEW_ROASTING', rangeDate);
  }
  getAllToffee(rangeDate) {
    return this.getAllProduction('CASHEW_TOFFEE', rangeDate);
  }
  getAllPacking(rangeDate) {
    return this.getAllProduction('PACKING', rangeDate);
  }
  getAllQcPacking(rangeDate) {
    return this.getAllProduction('BAD_QUALITY_PACKING', rangeDate);
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
  addEditToffeeTransfer(value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.productionurl+'addToffeeTransfer', value);
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
  addEditQcPackingTransfer(value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.productionurl+'addQcPackingTransfer', value);
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
  getAllPosToPack(withPacked: boolean): Observable<any> {
    return this.http.get(this.productionurl+'getAllPosToPack/'+withPacked);
  }
  getAllPosQc(withCleaned: boolean){
    return this.http.get(this.productionurl+'getAllPosQc/'+withCleaned);
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
  getStorageToPackPo (poCode: number, withPacked: boolean): Observable<any> {
    return this.http.get(this.productionurl+'getStorageToPackPo/'+poCode+'/'+withPacked);
  }
  getStorageQcPo (poCode: number, withCleaned: boolean): Observable<any> {
    return this.http.get(this.productionurl+'getStorageQcPo/'+poCode+'/'+withCleaned);
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
      case 'toPack':
        return forkJoin([response1, this.http.get(this.productionurl+'getStorageToPackPo/'+poCode+'/false')]);
      case 'toPackWithPacked':
        return forkJoin([response1, this.http.get(this.productionurl+'getStorageToPackPo/'+poCode+'/true')]);
      case 'qc':
        return forkJoin([response1, this.http.get(this.productionurl+'getStorageQcPo/'+poCode)]);
      default:
        break;
    }
    // return forkJoin([response1, response2]);
  }

  getMixProductionWithStorage(id: number, pos: Array<number>, withPacked: boolean) {
    let response1 = this.http.get(this.productionurl+'getProduction/'+id);
    return forkJoin([response1, this.http.get(this.productionurl+'getStorageToPackPos/'+pos+'/'+withPacked)]);
  }

  getMixStorageToPackPos(pos: Array<number>, withPacked: boolean) {
    return this.http.get(this.productionurl+'getStorageToPackPos/'+pos+'/'+withPacked);
  }

  getMixQcProductionWithStorage(id: number, pos: Array<number>, withCleaned: boolean) {
    let response1 = this.http.get(this.productionurl+'getProduction/'+id);
    return forkJoin([response1, this.http.get(this.productionurl+'getStorageQcPos/'+pos+'/'+withCleaned)]);
  }

  getMixStorageQcPos(pos: Array<number>, withCleaned: boolean) {
    return this.http.get(this.productionurl+'getStorageQcPos/'+pos+'/'+withCleaned);
  }

}
