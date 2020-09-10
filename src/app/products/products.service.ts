
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  sharingData: JSON;

  producturl = environment.baseUrl +'';

  constructor(private http: HttpClient) {
  } 

}
