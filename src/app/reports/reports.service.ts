
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getFinalSummery (po: number) {
    return this.http.get(this.reportsurl+'getFinalSummery/'+po);
  }

  getAllPoCodes (): Observable<any> {
    return this.http.get(this.reportsurl+'getAllPoCodes');
  }

  allProductionByTime (begin: string, end: string) {
    const params = new HttpParams()
      .set('begin',  begin)
      .set('end', end);
    return this.http.get(this.reportsurl+'allProductionByTime',{params});
  }

  getCashewInventoryPacked () {
    return this.http.get(this.reportsurl+'getCashewInventoryPacked');
  }

  getCashewInventoryBullk () {
    return this.http.get(this.reportsurl+'getCashewInventoryBullk');
  }
  
  getCashewInventoryFinished (date: Date) {
    return this.http.get(this.reportsurl+'getCashewInventoryFinished/'+date.getTime()/1000);
  }
  
  getCashewInventoryBagged (date: Date) {
    return this.http.get(this.reportsurl+'getCashewInventoryBagged/'+date.getTime()/1000);
  }

  getCashewInventoryRaw (date: Date) {
    return this.http.get(this.reportsurl+'getCashewInventoryRaw/'+date.getTime()/1000);
  }

  getCashewExportReport (firstDate: Date, secondDate: Date) {
    return this.http.get(this.reportsurl+'getCashewExportReport/'+firstDate.getTime()/1000+'/'+secondDate.getTime()/1000);
  }

  getBulkPackCashewItems (packageType: string) {
    return this.http.get(this.reportsurl+'getBulkPackCashewItems/'+packageType);
  }

  getSuppliersGroups (): Observable<any> {
    return this.http.get(this.reportsurl+'getSuppliersGroups');
  }

}
