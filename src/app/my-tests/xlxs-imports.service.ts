import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class XlxsService {
  
    xlxsurl = environment.baseUrl +'xlxsimport/';
    constructor(private http: HttpClient) {
    } 


    
// for importing data
  addAllNewSetup(table: string, value) {
    return this.http.post(this.xlxsurl+'addAllNewSetup/'+table, value);
  }

  


  // for importing data
  addAllCashewOrders (value): Observable<any> {
    return this.http.post(this.xlxsurl+'addAllCashewOrders', value);
  }

  // for importing data
  addAllReceiveCashewOrder (value): Observable<any> {
    return this.http.post(this.xlxsurl+'addAllReceiveCashewOrder', value);
  }

  
  // for importing data
  addAllCashewReceiveCheck (value): Observable<any> {
    return this.http.post(this.xlxsurl+'addAllCashewReceiveCheck', value);
  }

  // for importing data
  addAllAproveFinal (value): Observable<any> {
    return this.http.post(this.xlxsurl+'approveAll', value);
  }

  
  // for importing data
  addAllSupplier (value): Observable<any> {
    return this.http.post(this.xlxsurl+'addAllSupplier', value);
  }
  
}
  