import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { MySharedService } from './sharedService';
import { Router } from '@angular/router';
import { Urls } from './url';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;
  otc: any = {};
  // API_URL = 'rest/v1';
  API_URL = new Urls();
  headers = { 'Content-Type': 'application/json'};
  constructor(private http: HttpClient, private sharedService: MySharedService, private router: Router) {

  }
  getGlobals() {
    return this.http.get(`${this.API_URL.url}/dashboard/configs`);
  }
  login(user) {
    return this.http.post(`${this.API_URL.url}/sysusers/auth`, user);
  }

  printAuth(user) {
    return this.http.post(`${this.API_URL.url}/sysusers/print/auth`, user);
  }

  logOutUser() {
    this.sharedService.setAuth(false);
    sessionStorage.removeItem('otc');
    sessionStorage.removeItem('bio.glob#$$#');
    this.router.navigate(['/auth']);
  }
}
