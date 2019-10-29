import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { MySharedService } from './sharedService';
import { Router } from '@angular/router';
import { Urls } from './url';
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  requestOptions: any = {};

  redirectUrl: string;
  otc: any = {};
  // API_URL = 'rest/v1';
  API_URL = new Urls();
  constructor(private http: HttpClient, private sharedService: MySharedService, private router: Router
    , private globalService: MySharedService) {



  }

  getGlobals() {
    return this.http.get(`${this.API_URL.url}/dashboard/configs`, { responseType: 'text' });
  }
  login(user) {
    return this.http.post(`${this.API_URL.url}/sysusers/auth`, user, this.globalService.getTokenHeader());
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
