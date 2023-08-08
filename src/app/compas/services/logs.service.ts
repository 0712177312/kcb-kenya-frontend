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
    const token = this.globalService.getTokens();
    return this.http.post(`${this.API_URL.url}/sysLog`, {
      ...log,
      loginType: token.loginType,
    }, this.globalService.getTokenHeader());
  }
}
