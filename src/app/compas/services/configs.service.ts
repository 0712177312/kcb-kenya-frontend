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
       return  this.http.get(`${this.API_URL.url}/gtchannels`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    upChannel(channel) {
      return this.http.post(`${this.API_URL.url}/upChannel`, channel,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    waiveChannel(channel) {
      return this.http.post(`${this.API_URL.url}/waiveChannel`, channel,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    getChannelsToWaive() {
      return this.http.get(`${this.API_URL.url}/gtChannelstoWaive`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    getWaivedChannels() {
      return this.http.get(`${this.API_URL.url}/gtWaivedchannels`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    approveWaivedChannel(channel) {
      return this.http.post(`${this.API_URL.url}/approveChannelWaive`, channel,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    getCustomerToWaive(customer) {
      return this.http.post(`${this.API_URL.url}/gtCustomerToWaive`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    getBranchToWaive(branch) {
      return this.http.get(`${this.API_URL.url}/gtBranchesToWaive?branchCode=` + branch,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    waiveCustomer(customer) {
      return this.http.post(`${this.API_URL.url}/waiveCustomer`, customer,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    waiveBranch(bran) {
      return this.http.post(`${this.API_URL.url}/waiveBranch`, bran,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

    rejectChannelWaive(channel) {
      return this.http.post(`${this.API_URL.url}/rejectChannel`, channel,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
    }

}
