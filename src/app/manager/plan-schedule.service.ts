import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanScheduleService {

  planurl = environment.baseUrl +'planSchedule/';

  constructor(private http: HttpClient) {
  }

  getCashewInventoryRaw () {
    return this.http.get(this.planurl+'getCashewInventoryRaw');
  }

  getCashewInventoryClean() {
    return this.http.get(this.planurl+'getCashewInventoryClean');
  }
}
