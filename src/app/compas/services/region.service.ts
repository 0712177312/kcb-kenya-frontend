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
    return  this.http.get(`${this.API_URL.url}/gtCountries`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  upCountry(country) {
    return this.http.post(`${this.API_URL.url}/upCountry`, country,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getBranches()  {
    return this.http.get(`${this.API_URL.url}/gtBranches`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  upBranch(branch) {
    return this.http.post(`${this.API_URL.url}/upBranch`, branch,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getActiveBranches() {
    return this.http.get(`${this.API_URL.url}/gtActiveBranches`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getActiveCountries() {
    return this.http.get(`${this.API_URL.url}/gtActiveCountries`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getWaivedBranches() {
    return this.http.get(`${this.API_URL.url}/gtWaivedBranches`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  approveWaivedBranches(branch) {
    return this.http.post(`${this.API_URL.url}/approveBranchWaive`, branch,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getCountriesToWaive() {
    return this.http.get(`${this.API_URL.url}/gtCountriesToWaive`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  approveWaivedCountry(country) {
    return this.http.post(`${this.API_URL.url}`, country,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  waiveCountry(country) {
    return this.http.post(`${this.API_URL.url}/waiveCountry`, country,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  waivedCountry() {
    return this.http.get(`${this.API_URL.url}/gtWaivedCountries`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  approveCountryWaive(country) {
    return this.http.post(`${this.API_URL.url}/approveCountryWaive`, country,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getBranchesToWaive() {
    return this.http.get(`${this.API_URL.url}/getBranchesToWaive`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  waiveBranch(branch) {
    return this.http.post(`${this.API_URL.url}/waiveBranch`, branch,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  rejectBranchWaive(bran) {
    return this.http.post(`${this.API_URL.url}/rejectBranchWaive`, bran,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  rejectCountryWaive(cou) {
    return this.http.post(`${this.API_URL.url}/rejectCountryWaive`, cou,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  getCountryBranches(country) {
    return this.http.get(`${this.API_URL.url}/gtActiveCountryBranches?ctry=${country}`,   { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
}
