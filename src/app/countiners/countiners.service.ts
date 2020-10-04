
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CountinersService {

  sharingData: JSON;

  contianerurl = environment.baseUrl +'container/';

  constructor(private http: HttpClient) {
  }


  addEditLoading (value, fromNew: boolean) {
    if(fromNew) {
      return this.http.post(this.contianerurl+'addLoading', value);
    } else {
      return this.http.put(this.contianerurl+'editLoading', value);
    }
  }

  getLoading (id: number) {
    return this.http.get(this.contianerurl+'getLoading/'+id);
  }

  getLoadingExportDoc (id: number) {
    return this.http.get(this.contianerurl+'getLoadingExportDoc/'+id);
  }

  getLoadingSecurityDoc (id: number) {
    return this.http.get(this.contianerurl+'getLoadingSecurityDoc/'+id);
  }

  getAllLoadings () {
    return this.http.get(this.contianerurl+'getAllLoadings');
  }


  getStorageRoastPackedPo (poCode: number): Observable<any> {
    return this.http.get(this.contianerurl+'getStorageRoastPackedPo/'+poCode);
  }

  getAllPosRoastPacked() {
    return this.http.get(this.contianerurl+'getAllPosRoastPacked');
  }

}