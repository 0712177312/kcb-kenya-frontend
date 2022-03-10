import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Urls } from './url';
import { MySharedService } from './sharedService';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  API_URL = new Urls();
  constructor(private http: HttpClient, private globalService: MySharedService) { }

    gtChannels() {
       return  this.http.get(`${this.API_URL.url}/gtchannels`, this.globalService.getTokenHeader());
    }

    upChannel(channel) {
      return this.http.post(`${this.API_URL.url}/upChannel`, channel, this.globalService.getTokenHeader());
    }

    waiveChannel(channel) {
      return this.http.post(`${this.API_URL.url}/waiveChannel`, channel, this.globalService.getTokenHeader());
    }

    getChannelsToWaive() {
      return this.http.get(`${this.API_URL.url}/gtChannelstoWaive`, this.globalService.getTokenHeader());
    }

    getWaivedChannels() {
      return this.http.get(`${this.API_URL.url}/gtWaivedchannels`, this.globalService.getTokenHeader());
    }

    approveWaivedChannel(channel) {
      return this.http.post(`${this.API_URL.url}/approveChannelWaive`, channel, this.globalService.getTokenHeader());
    }

    getCustomerToWaive(customer) {
      return this.http.post(`${this.API_URL.url}/gtCustomerToWaive`, customer, this.globalService.getTokenHeader());
    }

    getBranchToWaive(branch) {
      return this.http.get(`${this.API_URL.url}/gtBranchesToWaive?branchCode=` + branch, this.globalService.getTokenHeader());
    }

    waiveCustomer(customer) {
      return this.http.post(`${this.API_URL.url}/waiveCustomer`, customer, this.globalService.getTokenHeader());
    }

    waiveBranch(bran) {
      return this.http.post(`${this.API_URL.url}/waiveBranch`, bran, this.globalService.getTokenHeader());
    }

    rejectChannelWaive(channel) {
      return this.http.post(`${this.API_URL.url}/rejectChannel`, channel, this.globalService.getTokenHeader());
    }

}
