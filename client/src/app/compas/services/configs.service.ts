import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Urls } from './url';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  API_URL = new Urls();
  constructor(private http: HttpClient) { }

    gtChannels() {
       return  this.http.get(`${this.API_URL.url}/gtchannels`);
    }

    upChannel(channel) {
      return this.http.post(`${this.API_URL.url}/upChannel`, channel);
    }

    waiveChannel(channel) {
      return this.http.post(`${this.API_URL.url}/waiveChannel`, channel);
    }

    getChannelsToWaive() {
      return this.http.get(`${this.API_URL.url}/gtChannelstoWaive`);
    }

    getWaivedChannels() {
      return this.http.get(`${this.API_URL.url}/gtWaivedchannels`);
    }

    approveWaivedChannel(channel) {
      return this.http.post(`${this.API_URL.url}/approveChannelWaive`, channel);
    }

    getCustomerToWaive(customer) {
      return this.http.post(`${this.API_URL.url}/gtCustomerToWaive`, customer);
    }

    getBranchToWaive(branch) {
      return this.http.get(`${this.API_URL.url}/gtBranchesToWaive?branchCode=` + branch);
    }

    waiveCustomer(customer) {
      return this.http.post(`${this.API_URL.url}/waiveCustomer`, customer);
    }

    waiveBranch(bran) {
      return this.http.post(`${this.API_URL.url}/waiveBranch`, bran);
    }

    rejectChannelWaive(channel) {
      return this.http.post(`${this.API_URL.url}/rejectChannel`, channel);
    }

}
