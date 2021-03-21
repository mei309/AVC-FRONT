
import { HttpClient } from '@angular/common/http';
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

  getCashewOrdersOpen () {
    return this.http.get(this.ordersurl+'getCashewOrdersOpen');
  }

  getPendingCashew(): Observable<any> {
    return this.http.get(this.ordersurl+'getPendingCashew');
  }

  getReceivedCashew() {
    return this.http.get(this.ordersurl+'getReceivedCashew');
  }

  getHistoryCashewOrders() {
    return this.http.get(this.ordersurl+'getHistoryCashewOrders');
  }

  findCashewReceiptsHistory() {
    return this.http.get(this.ordersurl+'findCashewReceiptsHistory');
  }
  
  getAllCashewReciveRejected() {
    return this.http.get(this.ordersurl+'getAllCashewReciveRejected');
  }

  getGeneralOrdersOpen () {
    return this.http.get(this.ordersurl+'getGeneralOrdersOpen');
  }

  getPendingGeneral() {
    return this.http.get(this.ordersurl+'getPendingGeneral');
  }

  getReceivedGeneral() {
    return this.http.get(this.ordersurl+'getReceivedGeneral');
  }

  getAllGeneralOrders() {
    return this.http.get(this.ordersurl+'getAllGeneralOrders');
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

  findAllPoCodes (): Observable<any> {
    return this.http.get(this.ordersurl+'findAllPoCodes');
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

  addEditMixPoCode (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.ordersurl+'addMixPoCode', value);
    } else {
      return this.http.put(this.ordersurl+'editMixPoCode', value);
    }
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

}
