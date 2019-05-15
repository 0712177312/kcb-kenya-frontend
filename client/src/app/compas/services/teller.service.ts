import { Injectable } from '@angular/core';
import { Urls } from './url';
import { MySharedService } from './sharedService';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TellerService {
  API_URL = new Urls();
  CUST_D = 'assets/teller.json';
  // TEL_SVC = 'http://172.17.74.91:8055/api/userSearch';
  ur: any;
  constructor(private http: HttpClient, private globalService: MySharedService) {}
  getConfigs() {
    this.ur = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return this.ur;
  }
  getTellers() {
    return this.http.get(`${this.API_URL.url}/tellers/gtTellers`);
  }
  getTellerDetail(teller)  {
     return this.http.get(`${this.API_URL.url}/tellers/gtTeller?tellr=${teller}`);
  }
  checkTellerExists(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/checkTeller`, teller);
  }
  getTellerDetails(teller) {
    return this.http.post(`${this.getConfigs().cobanking}/userSearch`, teller);
  }
  addTeller(teller) {
    return  this.http.post(`${this.API_URL.url}/tellers/upTellerDetails`, teller);
  }
  approveTeller(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/approveTeller`, teller);
  }
  getTellersToApprove() {
    return this.http.get(`${this.API_URL.url}/tellers/tellersToApprove`);
  }
  getTllrDetails() {
      return this.http.get(this.CUST_D);
  }
  getBranchTellers(branch) {
    return this.http.get(`${this.API_URL.url}/tellers/gtBranchTellers?branch=${branch}`);
  }
  upgradeTellerProfile(cust) {
    return this.http.post(`${this.API_URL.url}/tellers/upgradeCustomerProfile`, cust);
  }

  rejectTellerApproval(tellerDetails){
    return this.http.post(`${this.API_URL.url}/tellers/rejectTellerApproval`, tellerDetails);
  }
}
