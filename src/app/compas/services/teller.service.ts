import { Injectable } from '@angular/core';
import { Urls } from './url';
import { MySharedService } from './sharedService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TellerService {
  API_URL = new Urls();
  CUST_D = 'assets/teller.json';
  // TEL_SVC = 'http://172.17.74.91:8055/api/userSearch';
  ur: any;
  constructor(private http: HttpClient, private globalService: MySharedService) { }
  getConfigs() {
    this.ur = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return this.ur;
  }
  getTellers() {
    return this.http.get(`${this.API_URL.url}/tellers/gtTellers`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  getTellerDetail(teller) {
    return this.http.get(`${this.API_URL.url}/tellers/gtTeller?tellr=${teller}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  checkTellerExists(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/checkTeller`, teller,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getTellerDetails(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/staff_inquiry`, teller,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  addTeller(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/upTellerDetails`, teller,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  approveTeller(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/approveTeller`, teller,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  getTellersToApprove(branchCode, groupid) {
    return this.http.get(`${this.API_URL.url}/tellers/tellersToApprove?branchCode=${branchCode}&groupid=${groupid}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  getTllrDetails() {
    return this.http.get(this.CUST_D);
  }
  getBranchTellers(branch) {
    return this.http.get(`${this.API_URL.url}/tellers/gtBranchTellers?branch=${branch}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  upgradeTellerProfile(cust) {
    return this.http.post(`${this.API_URL.url}/tellers/upgradeCustomerProfile`, cust,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  rejectTellerApproval(tellerDetails) {
    return this.http.post(`${this.API_URL.url}/tellers/rejectTellerApproval`, tellerDetails,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  removeTeller(tellerDetails) {
    return this.http.post(`${this.API_URL.url}/tellers/removeTeller`, tellerDetails,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  checkStaffApproved(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/checkStaffApproved`, teller,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  obtainTellerDetails(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/obtainTellerDetails`, teller,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getTellersToApproveDetach() {
    return this.http.get(`${this.API_URL.url}/tellers/tellersToApproveDetach`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  approveRemoveTeller(tellerDetails) {
    return this.http.post(`${this.API_URL.url}/tellers/approveRemoveTeller`, tellerDetails,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }


  rejectRemoveTeller(tellerDetails) {
    return this.http.post(`${this.API_URL.url}/tellers/rejectRemoveTeller`, tellerDetails,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
}
