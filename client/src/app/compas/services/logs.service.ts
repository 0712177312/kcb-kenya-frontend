import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from './url';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  API_URL = new Urls();
  constructor(private http: HttpClient) { }

  log(log) {
      return  this.http.post(`${this.API_URL.url}/sysLog`, log);
  }
}
