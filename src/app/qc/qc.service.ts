import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DropNormal } from '../field.interface';
@Injectable({
  providedIn: 'root'
})
export class QcService {

  qcurl = environment.baseUrl +'qc/';

  constructor(private http: HttpClient) {
  } 


  addEditCashewReceiveCheck (value, type: string, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.qcurl+'addCashewReceiveCheck/'+ type, value);
    } else {
      return this.http.put(this.qcurl+'editCashewReceiveCheck', value);
    }
  }

  addEditCashewRoastCheck (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.qcurl+'addCashewRoastCheck', value);
    } else {
      return this.http.put(this.qcurl+'editCashewReceiveCheck', value);
    }
  }

  getQcCheck (id: number): Observable<any> {
    return this.http.get(this.qcurl+'getQcCheck/'+ id);
  }

  getRawQC (): Observable<any> {
    return this.http.get(this.qcurl+'getRawQC');
  }

  getRoastQC (): Observable<any> {
    return this.http.get(this.qcurl+'getRoastQC');
  }

  getPoCashewCodesOpenPending (): Observable<any> {
    return this.http.get(this.qcurl+'getPoCashewCodesOpenPending');
  }

  getSupplierCashew (): Observable<any> {
    return this.http.get(this.qcurl+'getCashewSuppliers');
  }

}
