
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  ordersurl = environment.baseUrl +'orders/';

  constructor(private http: HttpClient) {
  }

  addEditCashewOrder (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.ordersurl+'addCashewOrder', value);
    } else {
      return this.http.put(this.ordersurl+'editOrder', value);
    }
  }


  addEditGenralOrder (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.ordersurl+'addGeneralOrder', value);
    } else {
      return this.http.put(this.ordersurl+'editOrder', value);
    }
  }

  addEditRecivingCashewOrder (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.ordersurl+'receiveCashewOrder', value);
    } else {
      return this.http.put(this.ordersurl+'editReciving', value);
    }
  }

  addReceiveCashewNoOrder (value): Observable<any> {
      return this.http.post(this.ordersurl+'receiveCashewNoOrder', value);
  }

  addEditRecivingGenralOrder (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.ordersurl+'receiveGeneralOrder', value);
    } else {
      return this.http.put(this.ordersurl+'editReciving', value);
    }
  }

  // addEditReceiveSample (value, fromNew: boolean): Observable<any> {
  //   if(fromNew) {
  //     return this.http.post(this.ordersurl+'receiveSample', value);
  //   } else {
  //     return this.http.put(this.ordersurl+'editReceiveSample', value);
  //   }
  // }

  receiveExtra (value, reciptId: number): Observable<any> {
    return this.http.post(this.ordersurl+'receiveExtra/'+reciptId, value);
  }

  getOrder (id: number) {
    return this.http.get(this.ordersurl+'orderDetails/'+id);
  }

  getOrderPO (po: number) {
    return this.http.get(this.ordersurl+'orderDetailsPo/'+po);
  }

  getReceive (id: number) {
    return this.http.get(this.ordersurl+'receiveDetails/'+id);
  }

  getCashewOrdersOpen (){
    return this.http.get(this.ordersurl+'getCashewOrdersOpen');
  }

  getPendingCashew(): Observable<any> {
    return this.http.get(this.ordersurl+'getPendingCashew');
  }

  getReceivedCashew() {
    return this.http.get(this.ordersurl+'getReceivedCashew');
  }

  getHistoryCashewOrders(rangeDate) {
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
      params = new HttpParams();
    }
    return this.http.get(this.ordersurl+'getHistoryCashewOrders', {params});
  }

  findCashewReceiptsHistory() {
    return this.http.get(this.ordersurl+'findCashewReceiptsHistory');
  }

  getAllCashewReciveRejected() {
    return this.http.get(this.ordersurl+'getAllCashewReciveRejected');
  }

  getGeneralOrdersOpen (){
    return this.http.get(this.ordersurl+'getGeneralOrdersOpen');
  }

  getPendingGeneral() {
    return this.http.get(this.ordersurl+'getPendingGeneral');
  }

  getReceivedGeneral() {
    return this.http.get(this.ordersurl+'getReceivedGeneral');
  }

  getAllGeneralOrders(rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
    return this.http.get(this.ordersurl+'getAllGeneralOrders', {params});
  }


  getPoCashewCodesOpen (): Observable<any> {
    return this.http.get(this.ordersurl+'getCashewPoOpen');
  }
  getPoCashewCodesOpenPending (): Observable<any> {
    return this.http.get(this.ordersurl+'getPoCashewCodesOpenPending');
  }


  getCashewSuppliers (): Observable<any> {
    return this.http.get(this.ordersurl+'getCashewSuppliers');
  }

  getGeneralSuppliers (): Observable<any> {
    return this.http.get(this.ordersurl+'getGeneralSuppliers');
  }
  getPoGeneralCodesOpen (): Observable<any> {
    return this.http.get(this.ordersurl+'getGeneralPoOpen');
  }
  getPoGeneralCodesOpenPending (): Observable<any> {
    return this.http.get(this.ordersurl+'getPoGeneralCodesOpenPending');
  }

  findFreePoCodes (): Observable<any> {
    return this.http.get(this.ordersurl+'findFreePoCodes');
  }

  findFreeGeneralPoCodes(): Observable<any> {
    return this.http.get(this.ordersurl+'findFreeGeneralPoCodes');
  }

  findAllProductPoCodes (): Observable<any> {
    return this.http.get(this.ordersurl+'findAllProductPoCodes');
  }

  findAllGeneralPoCodes (): Observable<any> {
    return this.http.get(this.ordersurl+'findAllGeneralPoCodes');
  }

  getPoCode(po: number) {
    return this.http.get(this.ordersurl+'getPoCode/'+po);
  }

  addEditPoCode (value, fromNew: boolean): Observable<any> {
      if(fromNew) {
        return this.http.post(this.ordersurl+'addPoCode', value);
      } else {
        return this.http.put(this.ordersurl+'editPoCode', value);
      }
  }

  addEditGeneralPoCode (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.ordersurl+'addGeneralPoCode', value);
    } else {
      return this.http.put(this.ordersurl+'editGeneralPoCode', value);
    }
}

  addEditMixPoCode (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.ordersurl+'addMixPoCode', value);
    } else {
      return this.http.put(this.ordersurl+'editMixPoCode', value);
    }
  }

  closeOrder(processId: number, close: boolean) {
    return this.http.patch(this.ordersurl+'closeOrder/'+processId, close);
  }

  getAllSuppliers (): Observable<any> {
      return this.http.get(this.ordersurl+'getAllSuppliers');
    }


    getCashewContractTypes (): Observable<any> {
      return this.http.get(this.ordersurl+'getCashewContractTypes');
    }

    getGeneralContractTypes (): Observable<any> {
      return this.http.get(this.ordersurl+'getGeneralContractTypes');
    }

    getSuppliersGroups (): Observable<any> {
      return this.http.get(this.ordersurl+'getSuppliersGroups');
    }


}
