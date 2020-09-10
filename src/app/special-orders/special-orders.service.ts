
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SpecialOrdersService {


  destroySubject$: Subject<void> = new Subject();

  sharingData: JSON;

  ordersurl = environment.baseUrl+ '/getset/';

  constructor(private http: HttpClient) {
  } 

  setSupplier (value: JSON): Observable<any> {
    const headers = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
  };
    return this.http.post(this.ordersurl+'addsupllier', JSON.stringify(value), headers).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getSupplier(id: number) {
    return this.http.get(this.ordersurl+id+'/getsupllier').pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  
  setOrder (value: JSON): Observable<any> {
    const headers = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
  };
    return this.http.post(this.ordersurl+'addorder', JSON.stringify(value), headers).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  getSuplliers() {
    return this.http.get(this.ordersurl+'suplliers').pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


    
  keepData (data: JSON) {
    this.sharingData = data;
  }
  takeData (): JSON {
    return this.sharingData;
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\n${error.error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


  ngOnDestroy() {
        this.destroySubject$.next();
      }

}
