import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Urls } from './url';
import { MySharedService } from './sharedService';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  API_URL = new Urls();
  constructor(private http: HttpClient, private globalService: MySharedService) { }

  gtCountries() {
    return  this.http.get(`${this.API_URL.url}/gtCountries`, this.globalService.getTokenHeader());
  }

  upCountry(country) {
    return this.http.post(`${this.API_URL.url}/upCountry`, country, this.globalService.getTokenHeader());
  }

  getBranches()  {
    return this.http.get(`${this.API_URL.url}/gtBranches`, this.globalService.getTokenHeader());
  }

  upBranch(branch) {
    return this.http.post(`${this.API_URL.url}/upBranch`, branch, this.globalService.getTokenHeader());
  }

  getActiveBranches() {
    return this.http.get(`${this.API_URL.url}/gtActiveBranches`, this.globalService.getTokenHeader());
  }

  getActiveCountries() {
    return this.http.get(`${this.API_URL.url}/gtActiveCountries`, this.globalService.getTokenHeader());
  }

  getWaivedBranches() {
    return this.http.get(`${this.API_URL.url}/gtWaivedBranches`, this.globalService.getTokenHeader());
  }

  approveWaivedBranches(branch) {
    return this.http.post(`${this.API_URL.url}/approveBranchWaive`, branch, this.globalService.getTokenHeader());
  }

  getCountriesToWaive() {
    return this.http.get(`${this.API_URL.url}/gtCountriesToWaive`, this.globalService.getTokenHeader());
  }

  approveWaivedCountry(country) {
    return this.http.post(`${this.API_URL.url}`, country, this.globalService.getTokenHeader());
  }

  waiveCountry(country) {
    return this.http.post(`${this.API_URL.url}/waiveCountry`, country, this.globalService.getTokenHeader());
  }

  waivedCountry() {
    return this.http.get(`${this.API_URL.url}/gtWaivedCountries`, this.globalService.getTokenHeader());
  }

  approveCountryWaive(country) {
    return this.http.post(`${this.API_URL.url}/approveCountryWaive`, country, this.globalService.getTokenHeader());
  }

  getBranchesToWaive() {
    return this.http.get(`${this.API_URL.url}/getBranchesToWaive`, this.globalService.getTokenHeader());
  }

  waiveBranch(branch) {
    return this.http.post(`${this.API_URL.url}/waiveBranch`, branch, this.globalService.getTokenHeader());
  }

  rejectBranchWaive(bran) {
    return this.http.post(`${this.API_URL.url}/rejectBranchWaive`, bran, this.globalService.getTokenHeader());
  }

  rejectCountryWaive(cou) {
    return this.http.post(`${this.API_URL.url}/rejectCountryWaive`, cou, this.globalService.getTokenHeader());
  }
  getCountryBranches(country) {
    return this.http.get(`${this.API_URL.url}/gtActiveCountryBranches?ctry=${country}`, this.globalService.getTokenHeader());
  }
}
