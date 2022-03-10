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
    return this.http.post(`${this.API_URL.url}/store` , customer, this.globalService.getTokenHeader());
  }
  gtCustomers () {
    return this.http.get(`${this.RESP}`);
  }

  findByAccountNumber(customer) {
    return this.http.post(`${this.API_URL.url}/checkCustomer`, customer, this.globalService.getTokenHeader());
  }

  gtCountries() {
    return this.http.get(`${this.API_URL.url}/gtCountries`, this.globalService.getTokenHeader());
  }

  gtBranches() {
    return this.http.get(`${this.API_URL.url}/branches`, this.globalService.getTokenHeader());
  }

  getCustomersToAuthorize(customer) {
    return this.http.post(`${this.API_URL.url}/customersToApprove`, customer, this.globalService.getTokenHeader());
  }

  afisApprove(customer) {
    return this.http.post(`${this.API_URL.url}/customers/afisapprove`, customer, this.globalService.getTokenHeader());
  }

  getWaivedCustomers() {
    return this.http.get(`${this.API_URL.url}/gtWaivedCustomers`, this.globalService.getTokenHeader());
  }

  getCustomerToVerify(customer) {
    return this.http.post(`${this.API_URL.url}/getCustomerToVerify`, customer, this.globalService.getTokenHeader());
  }

  approveCustomerWaive(customer) {
    return this.http.post(`${this.API_URL.url}/approveCustomerWaive`, customer, this.globalService.getTokenHeader());
  }

  rejectCustomerWaive(customer) {
    return this.http.post(`${this.API_URL.url}/rejectCustomerWaive`, customer, this.globalService.getTokenHeader());
  }

  rejectCustomerEnrollment(customerDetails){
    return this.http.post(`${this.API_URL.url}/rejectCustomerEnrollment`, customerDetails, this.globalService.getTokenHeader());
  }

  updateProfileDetails(profile) {
    return this.http.post(`${this.API_URL.url}/verifyProfileDetails`, profile, this.globalService.getTokenHeader());
  }

  removeProfileDetails(profile) {
    return this.http.post(`${this.API_URL.url}/rejectProfileDetails`, profile, this.globalService.getTokenHeader());
  }

  removeCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/deleteCustomer`, customerDetails, this.globalService.getTokenHeader());
  }

  obtainCustomerDetails(customer){
    return this.http.post(`${this.API_URL.url}/obtainCustomerDetails`, customer, this.globalService.getTokenHeader());
  }

  convertStaffToCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/convertStaffToCustomer`, customerDetails, this.globalService.getTokenHeader());
  }

  getCustomersToApproveDetach(){
    return this.http.get(`${this.API_URL.url}/customersToApproveDetach`, this.globalService.getTokenHeader());
  }

  approveRemoveCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/approveRemoveCustomer`, customerDetails, this.globalService.getTokenHeader());
  }

  rejectRemoveCustomer(customerDetails){
    return this.http.post(`${this.API_URL.url}/rejectRemoveCustomer`, customerDetails, this.globalService.getTokenHeader());
  }
}
