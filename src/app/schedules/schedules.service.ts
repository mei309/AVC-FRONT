
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  Schedulesurl = environment.baseUrl + 'schedule/';

  constructor(private http: HttpClient) {
  } 

  getCashewOrdersOpen () {
    return this.http.get(this.Schedulesurl+'getCashewOrdersOpen');
  }

  getGeneralOrdersOpen () {
    return this.http.get(this.Schedulesurl+'getGeneralOrdersOpen');
  }
}
