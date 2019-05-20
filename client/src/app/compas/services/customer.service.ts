import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Urls } from './url';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  API_URL = new Urls();
  RESP = 'assets/response.json';
  constructor(private http: HttpClient) { }

  updCustomer (customer) {
    return this.http.post(`${this.API_URL.url}/store` , customer);
  }
  gtCustomers () {
    return this.http.get(`${this.RESP}`);
  }

  findByAccountNumber(customer) {
    return this.http.post(`${this.API_URL.url}/checkCustomer`, customer);
  }

  gtCountries() {
    return this.http.get(`${this.API_URL.url}/gtCountries`);
  }

  gtBranches() {
    return this.http.get(`${this.API_URL.url}/branches`);
  }

  getCustomersToAuthorize() {
    return this.http.get(`${this.API_URL.url}/customersToApprove`);
  }

  afisApprove(customer) {
    return this.http.post(`${this.API_URL.url}/customers/afisapprove`, customer);
  }

  getWaivedCustomers() {
    return this.http.get(`${this.API_URL.url}/gtWaivedCustomers`);
  }

  getCustomerToVerify(customer) {
    return this.http.post(`${this.API_URL.url}/getCustomerToVerify`, customer);
  }

  approveCustomerWaive(customer) {
    return this.http.post(`${this.API_URL.url}/approveCustomerWaive`, customer);
  }

  rejectCustomerWaive(customer) {
    return this.http.post(`${this.API_URL.url}/rejectCustomerWaive`, customer);
  }

  removeFromAbis(customer){
    return this.http.post(`${this.API_URL.url}/delete`, customer);
  }

  rejectCustomerEnrollment(customerDetails){
    return this.http.post(`${this.API_URL.url}/rejectCustomerEnrollment`, customerDetails);
  }

  updateProfileDetails(profile) {
    return this.http.post(`${this.API_URL.url}/verifyProfileDetails`, profile);
  }

  removeProfileDetails(profile) {
    return this.http.post(`${this.API_URL.url}/rejectProfileDetails`, profile);
  }

}
