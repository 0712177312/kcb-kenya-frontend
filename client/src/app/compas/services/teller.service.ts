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
    return this.http.get(`${this.API_URL.url}/tellers/gtTellers`, this.globalService.getTokenHeader());
  }
  getTellerDetail(teller)  {
     return this.http.get(`${this.API_URL.url}/tellers/gtTeller?tellr=${teller}`, this.globalService.getTokenHeader());
  }
  checkTellerExists(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/checkTeller`, teller, this.globalService.getTokenHeader());
  }

  getTellerDetails(teller) {
    return this.http.post(`${this.getConfigs().cobanking}/userSearch`, teller);
  }
  addTeller(teller) {
    return  this.http.post(`${this.API_URL.url}/tellers/upTellerDetails`, teller, this.globalService.getTokenHeader());
  }
  approveTeller(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/approveTeller`, teller, this.globalService.getTokenHeader());
  }
  getTellersToApprove(branchCode,groupid) {
    return this.http.get(`${this.API_URL.url}/tellers/tellersToApprove?branchCode=${branchCode}&groupid=${groupid}`, this.globalService.getTokenHeader());
  }
  getTllrDetails() {
      return this.http.get(this.CUST_D);
  }
  getBranchTellers(branch) {
    return this.http.get(`${this.API_URL.url}/tellers/gtBranchTellers?branch=${branch}`, this.globalService.getTokenHeader());
  }
  upgradeTellerProfile(cust) {
    return this.http.post(`${this.API_URL.url}/tellers/upgradeCustomerProfile`, cust, this.globalService.getTokenHeader());
  }

  rejectTellerApproval(tellerDetails){
    return this.http.post(`${this.API_URL.url}/tellers/rejectTellerApproval`, tellerDetails, this.globalService.getTokenHeader());
  }

  removeTeller(tellerDetails){
    return this.http.post(`${this.API_URL.url}/tellers/removeTeller`, tellerDetails, this.globalService.getTokenHeader());
  }

  checkStaffApproved(teller) {
    return this.http.post(`${this.API_URL.url}/tellers/checkStaffApproved`, teller, this.globalService.getTokenHeader());
  }

  obtainTellerDetails(teller){
    return this.http.post(`${this.API_URL.url}/tellers/obtainTellerDetails`, teller, this.globalService.getTokenHeader());
  }

  getTellersToApproveDetach(){
    return this.http.get(`${this.API_URL.url}/tellers/tellersToApproveDetach`, this.globalService.getTokenHeader());
  }

  approveRemoveTeller(tellerDetails){
    return this.http.post(`${this.API_URL.url}/tellers/approveRemoveTeller`, tellerDetails, this.globalService.getTokenHeader());
  }

  
  rejectRemoveTeller(tellerDetails){
    return this.http.post(`${this.API_URL.url}/tellers/rejectRemoveTeller`, tellerDetails, this.globalService.getTokenHeader());
  }
}
