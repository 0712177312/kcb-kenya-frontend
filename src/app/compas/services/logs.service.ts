import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from './url';
import { MySharedService } from './sharedService';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  API_URL = new Urls();
  constructor(private http: HttpClient, private globalService: MySharedService) { }

  log(log) {
      return  this.http.post(`${this.API_URL.url}/sysLog`, log, this.globalService.getTokenHeader() );
  }
}
