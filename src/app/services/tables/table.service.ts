import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TableService {
  apiUrl = environment.apiUrl;
  rootUrl: string = '/tables';

  constructor(private http: HttpClient) { }

  getTables() {
    const url = this.apiUrl + this.rootUrl + '?nd=' + Date.now();
    return this.http.get(url);
  }

  getTable(id) {
    const url = this.apiUrl + this.rootUrl + '/' + id + '?nd=' + Date.now();
    return this.http.get(url);
  }

  updateTable(id, model) {
    const url = this.apiUrl + this.rootUrl + '/' + id;
    return this.http.put(url, model).toPromise();
  }
}
