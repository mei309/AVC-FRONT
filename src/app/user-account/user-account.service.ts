import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  todourl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

   getMassage(processId, maasageId, value: string) {
    return this.http.get(this.todourl+'getMassage/'+processId + '/' + maasageId +'/'+ value);
  }

  getTask(id:number, value: string) {
    return this.http.get(this.todourl+'getTask/'+id +'/'+ value);
  }

  // approveTaskAndManagment(id, approve: string, snapshot): Observable<any> {
  //   return this.http.post(this.todourl+'approveTaskAndManagment/' + id + '/' + approve, snapshot);
  // }

  // setMassageTask(id, approve: string): Observable<any> {
  //   return this.http.get(this.todourl+'setMassageTask/' + id + '/' + approve);
  // }

  passChange(passwords): Observable<any> {
    return this.http.post(this.todourl+'passChange', passwords);
  }
}
