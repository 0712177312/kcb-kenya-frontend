import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Urls } from './url';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  API_URL = new Urls();
  constructor(private http: HttpClient) { }

  gtCountries() {
    return  this.http.get(`${this.API_URL.url}/gtCountries`);
  }

  upCountry(country) {
    return this.http.post(`${this.API_URL.url}/upCountry`, country);
  }

  getBranches()  {
    return this.http.get(`${this.API_URL.url}/gtBranches`);
  }

  upBranch(branch) {
    return this.http.post(`${this.API_URL.url}/upBranch`, branch);
  }

  getActiveBranches() {
    return this.http.get(`${this.API_URL.url}/gtActiveBranches`);
  }

  getActiveCountries() {
    return this.http.get(`${this.API_URL.url}/gtActiveCountries`);
  }

  getWaivedBranches() {
    return this.http.get(`${this.API_URL.url}/gtWaivedBranches`);
  }

  approveWaivedBranches(branch) {
    return this.http.post(`${this.API_URL.url}/approveBranchWaive`, branch);
  }

  getCountriesToWaive() {
    return this.http.get(`${this.API_URL.url}/gtCountriesToWaive`);
  }

  approveWaivedCountry(country) {
    return this.http.post(`${this.API_URL.url}`, country);
  }

  waiveCountry(country) {
    return this.http.post(`${this.API_URL.url}/waiveCountry`, country);
  }

  waivedCountry() {
    return this.http.get(`${this.API_URL.url}/gtWaivedCountries`);
  }

  approveCountryWaive(country) {
    return this.http.post(`${this.API_URL.url}/approveCountryWaive`, country);
  }

  getBranchesToWaive() {
    return this.http.get(`${this.API_URL.url}/getBranchesToWaive`);
  }

  waiveBranch(branch) {
    return this.http.post(`${this.API_URL.url}/waiveBranch`, branch);
  }

  rejectBranchWaive(bran) {
    return this.http.post(`${this.API_URL.url}/rejectBranchWaive`, bran);
  }

  rejectCountryWaive(cou) {
    return this.http.post(`${this.API_URL.url}/rejectCountryWaive`, cou);
  }
  getCountryBranches(country) {
    return this.http.get(`${this.API_URL.url}/gtActiveCountryBranches?ctry=${country}`);
  }
}
