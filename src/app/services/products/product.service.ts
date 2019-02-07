import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = environment.apiUrl;
  rootUrl: string = '/products';

  constructor(private http: HttpClient) { }

  getProductList() {
    const url = this.apiUrl + this.rootUrl + '/list?nd=' + Date.now();
    return this.http.get(url);
  }
}
