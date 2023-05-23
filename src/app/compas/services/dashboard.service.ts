import { Urls } from './url';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MySharedService } from './sharedService';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  API_URL = new Urls();

  constructor(private http: HttpClient, private globalService: MySharedService) { }

  getStats() {
    return this.http.get(`${this.API_URL.url}/dashboard/stats`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getInforCard() {
    return this.http.get(`${this.API_URL.url}/dashboard/cardinfo`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getBstats() {
    return this.http.get(`${this.API_URL.url}/dashboard/topbranches`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

}
