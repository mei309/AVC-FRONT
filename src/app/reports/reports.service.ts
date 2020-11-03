
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  reportsurl = environment.baseUrl +'reports/';

  constructor(private http: HttpClient) {
  } 

  getAllProcesses (po: number) {
    return this.http.get(this.reportsurl+'getAllProcesses/'+po);
  }

  getPoFinalReport (po: number) {
    return this.http.get(this.reportsurl+'getPoFinalReport/'+po);
  }

  getAllPoCodes (): Observable<any> {
    return this.http.get(this.reportsurl+'getAllPoCodes');
  }

}
