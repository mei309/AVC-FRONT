import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DropNormal } from '../field.interface';
@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  supplyurl = environment.baseUrl+ 'suppliers/';

  cities = new ReplaySubject<DropNormal[]>();
  countries = new ReplaySubject<DropNormal[]>();
  companyPosition = new ReplaySubject<DropNormal[]>();
  supplyType = new ReplaySubject<DropNormal[]>();
  branches = new ReplaySubject<DropNormal[]>();

  constructor(private http: HttpClient) {
    this.http.get(this.supplyurl+'getSetUpSuppliers').pipe(take(1)).subscribe(value => {
        this.cities.next(value[0]);
        this.countries.next(value[1]);
        this.companyPosition.next(value[2]);
        this.supplyType.next(value[3]);
        this.branches.next(value[4]);
    });
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

  getCities (): Observable<any> {
    return this.cities.asObservable();
  }
  getCountries (): Observable<any> {
    return this.countries.asObservable();
  }
  getCompanyPosition (): Observable<any> {
    return this.companyPosition.asObservable();
  }
  getSupplyType (): Observable<any> {
    return this.supplyType.asObservable();
  }
  getBranches (): Observable<any> {
    return this.branches.asObservable();
  }

  // removeSupplier (id: number) {
  //   return this.http.delete(this.supplyurl+'removeSupplier/'+id);
  // }
}
