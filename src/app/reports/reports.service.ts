
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import { DropNormal } from '../field.interface';
import { take } from 'rxjs/operators';
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
