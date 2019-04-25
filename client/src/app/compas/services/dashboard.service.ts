import { Urls } from './url';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  API_URL = new Urls();

  constructor(private http: HttpClient) { }

  getStats() {
      return  this.http.get(`${this.API_URL.url}/dashboard/stats`);
  }

  getInforCard() {
    return this.http.get(`${this.API_URL.url}/dashboard/cardinfo`);
  }

  getBstats() {
    return this.http.get(`${this.API_URL.url}/dashboard/topbranches`);
  }

}
