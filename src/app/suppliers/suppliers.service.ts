import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  supplyurl = environment.baseUrl+ 'suppliers/';

  constructor(private http: HttpClient) {
  } 

  addSupplier (value): Observable<any> {
    return this.http.post(this.supplyurl+'addSupplier', value);
  }

  getSupplier(id: number) {
    return this.http.get(this.supplyurl+'supplierDetails/'+id);
  }

  getSuplliers() {
    return this.http.get(this.supplyurl+'allSuppliers');
  }

  editMainSupplier (value): Observable<any> {
    return this.http.put(this.supplyurl+'editMainSupplier', value);
  }

  editContactInfo (value, companyId: number): Observable<any> {
    return this.http.put(this.supplyurl+'editContactInfo/'+companyId, value);
  }

  editContactPersons (value, companyId: number): Observable<any> {
    return this.http.put(this.supplyurl+'editContactPersons/'+companyId, value);
  }

  editPaymentAccounts (value, contactId: number, companyId: number): Observable<any> {
    return this.http.put(this.supplyurl+'editPaymentAccounts/'+contactId+'/'+companyId, value);
  }

  // removeSupplier (id: number) {
  //   return this.http.delete(this.supplyurl+'removeSupplier/'+id);
  // }
}
