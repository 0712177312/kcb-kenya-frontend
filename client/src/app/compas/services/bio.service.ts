import { IdentifyCustomerComponent } from './../customers/identify-customer/identify-customer.component';
import { Applicant } from './../models/applicant';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MySharedService } from './sharedService';
import 'rxjs/add/operator/catch';
import { Urls } from './url';
@Injectable({
  providedIn: 'root'
})
export class BioService {
  uris: any = {};
  results: any;
  API_URL = new Urls();
  // GREEN = 'https://localhost:8444/getImage/';
  GREEN: any;
  // AFIS_URL = 'http://172.16.21.72:8080/AbisClient'; // http://172.16.21.72:8080
  AFIS_URL: any;
  CUST_D = 'assets/details.json';
  ID = 'assets/identify.json';
  right = 'assets/right.json';
  left = 'assets/left.json';
  // MEM_API = 'http://172.17.74.91:8055/api/search';
  MEM_API: any;
  // T24 = 'http://172.17.74.91:9095/kcb/api/customer';
  T24: any;

  constructor(private http: HttpClient, private globalService: MySharedService) {
    // this.uris =  this.getConfigs();
    //  this.MEM_API = this.uris.cobanking;
    //  this.GREEN = this.uris.greenbit;
    //  this.AFIS_URL = this.uris.abis;
    //  this.T24 = this.uris.t24;
    //  console.log('vv', this.uris);
  }
  getConfigs() {
    this.uris = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return this.uris;
  }
  getCustomer(accountNumber) {
    return this.http.get(`${this.API_URL.url}/customers/${accountNumber}`, this.globalService.getTokenHeader())
      .catch((err: HttpErrorResponse) => {
        console.error('An error occurred:', err.error);
        return err.error;
      });
  }

  capturePrint() {
    console.log(`${this.getConfigs().secugen}/SGIFPCapture`);
    return this.http.post(`${this.getConfigs().secugen}/SGIFPCapture`, "t");
  }

  getCustomers() {
    return this.http.get(`${this.API_URL.url}/customers`, this.globalService.getTokenHeader());
  }

  addCustomer(customer) {
    return this.http.post(`${this.API_URL.url}/upCustomerDetails`, customer, this.globalService.getTokenHeader());
  }

  upCustomerBio(bios) {
    return this.http.post(`${this.API_URL.url}/customers/upbio`, bios, this.globalService.getTokenHeader());
  }

  afisEnroll(applicant) {
    return this.http.post(`${this.getConfigs().abis}/Enroll`, applicant);
  }

  afisVerify(applicant) {
    return this.http.post(`${this.getConfigs().abis}/verifyMultiple`, applicant);
  }

  afisVer(applicant) {
    return this.http.post(`${this.getConfigs().abis}/verify`, applicant);
  }

  afisIdentify(applicant) {
    return this.http.post(`${this.getConfigs().abis}/identify`, applicant);
  }

  afisRemove(applicant){
    return this.http.post(`${this.getConfigs().abis}/delete`, applicant);
  }

  appoveCustomer(cust) {
    return this.http.post(`${this.API_URL.url}/approveCustomer`, cust, this.globalService.getTokenHeader());
  }

  getCustomerByAccountNo(customer) {
    return this.http.post(`${this.getConfigs().cobanking}/search`, customer);
  }

  getCustomerDetails() {
    return this.http.get(this.CUST_D);
  }

  leftFing() {
    return this.http.get(this.left);
  }

  rightFing() {
    return this.http.get(this.right);
  }

  getMatchedCustomers(customers) {
    return this.http.post(`${this.API_URL.url}/getMatchedCustomers`, customers, this.globalService.getTokenHeader());
  }

  getFingerPrintImage(hand) {
    return this.http.post(`${this.getConfigs().greenbit}`, hand);
  }

  updateCustomerStatus(customer, status) {
    return this.http.get(`${this.getConfigs().t24}/${customer}/${status}`);
  }
}


