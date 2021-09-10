
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  Schedulesurl = environment.baseUrl + 'schedule/';

  constructor(private http: HttpClient) {
  }

  getAllCashewOrders(rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
    return this.http.get(this.Schedulesurl+'getAllCashewOrders', {params});
  }

  getAllGeneralOrders(rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
    return this.http.get(this.Schedulesurl+'getAllGeneralOrders', {params});
  }
}
