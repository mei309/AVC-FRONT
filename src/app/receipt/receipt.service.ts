import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  receipturl = environment.baseUrl +'orders/';

  constructor(private http: HttpClient) {
  } 
  
  addEditRecivingCashewOrder (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.receipturl+'receiveCashewOrder', value);
    } else {
      return this.http.put(this.receipturl+'editReciving', value);
    }
  }

  addReceiveCashewNoOrder (value): Observable<any> {
      return this.http.post(this.receipturl+'receiveCashewNoOrder', value);
  }

  addEditRecivingGenralOrder (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.receipturl+'receiveGeneralOrder', value);
    } else {
      return this.http.put(this.receipturl+'editReciving', value);
    }
  }

  getOrder (id: number) {
    return this.http.get(this.receipturl+'orderDetails/'+id);
  }

  getOrderPO (po: number) {
    return this.http.get(this.receipturl+'orderDetailsPo/'+po);
  }

  receiveExtra (value, reciptId: number): Observable<any> {
    return this.http.post(this.receipturl+'receiveExtra/'+reciptId, value);
  }

  getReceive (id: number) {
    return this.http.get(this.receipturl+'receiveDetails/'+id);
  }

  getPendingCashew() {
    // let params: HttpParams;
    // if(rangeDate.begin) {
    //   if(rangeDate.end) {
    //     params = new HttpParams().
    //     set('begin',  rangeDate.begin).
    //     set('end', rangeDate.end);
    //   } else {
    //     params = new HttpParams().
    //     set('begin',  rangeDate.begin);
    //   }
    // } else {
    //   params = new HttpParams()
    // }
    return this.http.get(this.receipturl+'getPendingCashew');
  }

  getReceivedCashew(rangeDate) {
    let params: HttpParams;
    if(rangeDate.begin) {
      if(rangeDate.end) {
        params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
      } else {
        params = new HttpParams().
        set('begin',  rangeDate.begin);
      }
    } else {
      params = new HttpParams()
    }
    return this.http.get(this.receipturl+'getReceivedCashew',{params});
  }

  findCashewReceiptsHistory(rangeDate) {
    let params: HttpParams;
    if(rangeDate.begin) {
      if(rangeDate.end) {
        params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
      } else {
        params = new HttpParams().
        set('begin',  rangeDate.begin);
      }
    } else {
      params = new HttpParams()
    }
    return this.http.get(this.receipturl+'findCashewReceiptsHistory',{params});
  }
  
  findGeneralReceiptsHistory(rangeDate) {
    let params: HttpParams;
    if(rangeDate.begin) {
      if(rangeDate.end) {
        params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
      } else {
        params = new HttpParams().
        set('begin',  rangeDate.begin);
      }
    } else {
      params = new HttpParams()
    }
    return this.http.get(this.receipturl+'findGeneralReceiptsHistory',{params});
  }

  getPendingGeneral() {
    return this.http.get(this.receipturl+'getPendingGeneral');
  }

  getReceivedGeneral(rangeDate) {
    let params: HttpParams;
    if(rangeDate.begin) {
      if(rangeDate.end) {
        params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
      } else {
        params = new HttpParams().
        set('begin',  rangeDate.begin);
      }
    } else {
      params = new HttpParams()
    }
    return this.http.get(this.receipturl+'getReceivedGeneral',{params});
  }

  
  getPoCashewCodesOpen (): Observable<any> {
    return this.http.get(this.receipturl+'getCashewPoOpen');
  }
  getPoCashewCodesOpenPending (): Observable<any> {
    return this.http.get(this.receipturl+'getPoCashewCodesOpenPending');
  }


  getSupplierGeneral (): Observable<any> {
    return this.http.get(this.receipturl+'getGeneralSuppliers');
  }
  getPoGeneralCodesOpen (): Observable<any> {
    return this.http.get(this.receipturl+'getGeneralPoOpen');
  }
  getPoGeneralCodesOpenPending (): Observable<any> {
    return this.http.get(this.receipturl+'getPoGeneralCodesOpenPending');
  }

  findFreePoCodes (): Observable<any> {
    return this.http.get(this.receipturl+'findFreePoCodes');
  }

}
