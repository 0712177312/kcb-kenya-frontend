import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Urls } from './url';
import { MySharedService } from './sharedService';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  API_URL = new Urls();
  RESP = 'assets/response.json';
  constructor(private http: HttpClient, private globalService: MySharedService) { }

  updCustomer (customer) {
    return this.http.post(`${this.API_URL.url}/store` , customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  gtCustomers () {
    return this.http.get(`${this.RESP}`);
  }

  findByAccountNumber(customer) {
    return this.http.post(`${this.API_URL.url}/checkCustomer`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  gtCountries() {
    return this.http.get(`${this.API_URL.url}/gtCountries`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  gtBranches() {
    return this.http.get(`${this.API_URL.url}/branches`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getCustomersToAuthorize(customer) {
    return this.http.post(`${this.API_URL.url}/customersToApprove`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  afisApprove(customer) {
    return this.http.post(`${this.API_URL.url}/customers/afisapprove`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getWaivedCustomers() {
    return this.http.get(`${this.API_URL.url}/gtWaivedCustomers`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getCustomerToVerify(customer) {
    return this.http.post(`${this.API_URL.url}/getCustomerToVerify`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  approveCustomerWaive(customer) {
    return this.http.post(`${this.API_URL.url}/approveCustomerWaive`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  rejectCustomerWaive(customer) {
    return this.http.post(`${this.API_URL.url}/rejectCustomerWaive`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  rejectCustomerEnrollment(customerDetails){
    return this.http.post(`${this.API_URL.url}/rejectCustomerEnrollment`, customerDetails,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  updateProfileDetails(profile) {
    return this.http.post(`${this.API_URL.url}/verifyProfileDetails`, profile,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  removeProfileDetails(profile) {
    return this.http.post(`${this.API_URL.url}/rejectProfileDetails`, profile,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  removeCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/deleteCustomer`, customerDetails,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  checkCustomerExists(customer){
    return this.http.post(`${this.API_URL.url}/checkCustomerByCustomerId`, customer,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  
  }
  obtainCustomerDetails(customer){
    return this.http.post(`${this.API_URL.url}/obtainCustomerDetails`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  convertStaffToCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/convertStaffToCustomer`, customerDetails,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getCustomersToApproveDetach(){
    return this.http.get(`${this.API_URL.url}/customersToApproveDetach`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  approveRemoveCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/approveRemoveCustomer`, customerDetails,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  rejectRemoveCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/rejectRemoveCustomer`, customerDetails,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
}
