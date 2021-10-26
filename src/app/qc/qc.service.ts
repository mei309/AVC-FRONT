import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileUploaderComponent } from '../s3-files/file-uploader.component';
@Injectable({
  providedIn: 'root'
})
export class QcService {

  qcurl = environment.baseUrl +'qc/';

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }


  addEditCashewReceiveCheck (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.qcurl+'addCashewReceiveCheck', value);
    } else {
      return this.http.put(this.qcurl+'editCashewReceiveCheck', value);
    }
  }

  addEditCashewRoastCheck (value, fromNew: boolean): Observable<any> {
    if(fromNew) {
      return this.http.post(this.qcurl+'addCashewRoastCheck', value);
    } else {
      return this.http.put(this.qcurl+'editCashewReceiveCheck', value);
    }
  }

  getQcCheck (id: number): Observable<any> {
    return this.http.get(this.qcurl+'getQcCheck/'+ id);
  }

  getRawQC(rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
    return this.http.get(this.qcurl+'getRawQC',{params});
  }

  getRoastQC(rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
    return this.http.get(this.qcurl+'getRoastQC',{params});
  }

  getPoCashew (roast: boolean): Observable<any> {
    return this.http.get(this.qcurl+'getPoCashew/'+roast);
  }

  getItemsCashewBulk (roast: boolean): Observable<any> {
      return this.http.get(this.qcurl+'getItemsCashewBulk/'+ roast);
  }

  addImagesQc(processId: number) {
    const dialogRef = this.dialog.open(FileUploaderComponent, {
      width: '80%',
      disableClose: true,
      data: {processId: processId, functionUrl: 'addQcImage', type: 'QC', fileNames: ['RAW', 'ROASTED', 'SMALL SIZE', 'BREAKAGE', 'MOLD', 'DIRTY',
      'TESTA', 'ROASTED TESTA', 'DECAY', 'DEEP CUT', 'OFF COLOUR', 'DEEP SPOT', 'TOTAL DEFECT', 'TOTAL DEFECT ROASTING']},
    });
    dialogRef.afterClosed().subscribe(data => {
    });
  }

}
