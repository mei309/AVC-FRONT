
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  usersurl = environment.baseUrl +'managment/';
  
  constructor(private http: HttpClient) {
  } 

  getAllProcessTypeAlerts() {
    return this.http.get(this.usersurl+'getAllProcessTypeAlerts');
  }

  addAlertUsers (value): Observable<any> {
    return this.http.post(this.usersurl+'addAlertUsers', value);
  }

  addUser (value): Observable<any> {
    return this.http.post(this.usersurl+'addUser', value);
  }

  addUserPerson (value: JSON): Observable<any> {
    return this.http.post(this.usersurl+'addUserFromPerson', value);
  }

  getUser (id: number): Observable<any> {
    return this.http.get(this.usersurl+'getUser/'+id);
  }


  getAllUsers() {
    return this.http.get(this.usersurl+'getAllUsers');
  }
  
  // getAllBasicUsers() {
  //   return this.http.get(this.usersurl+'getAllBasicUsers');
  // }

  editUser (value): Observable<any> {
    return this.http.put(this.usersurl+'editUser', value);
  }

  getPersons (): Observable<any> {
    return this.http.get(this.usersurl+'getAllPersons');
  }

  getAllSetupTable(table: string){
    return this.http.get(this.usersurl+'getAllSetupTable/'+table);
  }

  addNewSetup(table: string, value) {
    return this.http.post(this.usersurl+'addNewSetup/'+table, value);
  }
  
  editSetup(table: string, value) {
    return this.http.put(this.usersurl+'editSetup/'+table, value);
  }

  removeSetup(table: string, value) {
    return this.http.delete(this.usersurl+'deleteSetup/'+table, value);
  }

  getCountries (): Observable<any> {
    return this.http.get(this.usersurl+'getCountries');
  }

  getBanks (): Observable<any> {
    return this.http.get(this.usersurl+'getBanks');
  }

  removeAllProcesses (val: number): Observable<any> {
    return this.http.delete(this.usersurl+'removeAllProcesses/'+val);
  }

  removeProcess (val: number): Observable<any> {
    return this.http.delete(this.usersurl+'removeProcess/'+val);
  }

}
