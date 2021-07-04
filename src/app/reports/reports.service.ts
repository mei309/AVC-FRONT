
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
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

  getFinalSummery (po: number) {
    return this.http.get(this.reportsurl+'getFinalSummery/'+po);
  }

  getAllPoCodes (): Observable<any> {
    return this.http.get(this.reportsurl+'getAllPoCodes');
  }

  allProductionByTime (rangeDate) {
    const params = new HttpParams()
      .set('begin',  rangeDate.begin)
      .set('end', rangeDate.end);
    return this.http.get(this.reportsurl+'allProductionByTime',{params});
  }

  getCashewInventoryPacked () {
    return this.http.get(this.reportsurl+'getCashewInventoryPacked');
  }

  getCashewInventoryBullk () {
    return this.http.get(this.reportsurl+'getCashewInventoryBullk');
  }
  
  getCashewInventoryFinished (date: moment.Moment) {
    const params = new HttpParams()
      .set('date', moment.utc(date).toISOString());
    return this.http.get(this.reportsurl+'getCashewInventoryFinished',{params});
  }
  
  getCashewInventoryBagged (date: moment.Moment) {
    const params = new HttpParams()
      .set('date', moment.utc(date).toISOString());
    return this.http.get(this.reportsurl+'getCashewInventoryBagged',{params});
  }

  getCashewInventoryRaw (date: moment.Moment) {
    const params = new HttpParams()
      .set('date', moment.utc(date).toISOString());
    return this.http.get(this.reportsurl+'getCashewInventoryRaw',{params});
  }

  getCashewExportReport (rangeDate) {
    const params = new HttpParams()
      .set('begin', rangeDate.begin)
      .set('end', rangeDate.end);
    return this.http.get(this.reportsurl+'getCashewExportReport',{params});
  }

  getBulkPackCashewItems (packageType: string) {
    return this.http.get(this.reportsurl+'getBulkPackCashewItems/'+packageType);
  }

  getSuppliersGroups (): Observable<any> {
    return this.http.get(this.reportsurl+'getSuppliersGroups');
  }

}
