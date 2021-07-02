import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QcService {

  qcurl = environment.baseUrl +'qc/';

  constructor(private http: HttpClient) {
  } 


  addEditCashewReceiveCheck (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.qcurl+'addCashewReceiveCheck', value);
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

  getPoCashew (roast: boolean): Observable<any> {
    return this.http.get(this.qcurl+'getPoCashew/'+roast);
  }

  getItemsCashewBulk (roast: boolean): Observable<any> {
      return this.http.get(this.qcurl+'getItemsCashewBulk/'+ roast);
  }

}
