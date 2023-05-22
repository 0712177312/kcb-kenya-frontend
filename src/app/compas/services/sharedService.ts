import { Subject, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

export class MySharedService {
  username: string;
  isAuthenticated: boolean;
  rights: any;
  rightId: any;
  configs: any;
  branch: any;
  group: any;
  timeout: any = 10000;
  userAssignedRights: any;
  // dataChange: Observable<any>;

  encPassword = environment.encryptKey; 

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable(); }

  constructor() {
    //   this.dataChange = new Observable((observer:Observer) {
    //     this.dataChangeObserver = observer;
    //   });
  }

  getConfigs() {
    const configs = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return configs;
  }

  getTokens(){
    const tokens = JSON.parse(localStorage.getItem('auth'));
    return tokens
  }

  getTokenHeader() {
    const localheaders = new HttpHeaders({
      'Authorization': `Bearer ${this.getTokens().access_token}`,
      'Access-Control-Expose-Headers': 'Authorization'
    });
    const headers = { headers: localheaders };
    return headers;
  }

  encryptData(data) {
    const akey2 = CryptoJS.enc.Utf8.parse(this.encPassword);
    const iv2 = CryptoJS.enc.Utf8.parse(this.encPassword);
    const encData = CryptoJS.AES.encrypt(JSON.stringify(data), akey2, {
      keySize: 16,
      iv: iv2,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    data = encData;
    return data;
  }

  decryptData(data: string): string {
    const akey2 = CryptoJS.enc.Utf8.parse(this.encPassword);
    const iv2 = CryptoJS.enc.Utf8.parse(this.encPassword);
    const bytes  = CryptoJS.AES.decrypt(data.toString(), akey2, {
      keySize: 16,
      iv: iv2,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData;
  }

  setUsername(username) {
    this.username = username;
    //   this.dataChangeObserver.next(this.data);
  }

  setRightId(rightId) {
    this.rightId = rightId;
  }

  setRights(rights) {
    this.rights = rights;
  }

  setAuth(auth) {
    this.isAuthenticated = auth;
  }

  setConfigs(configs) {
    this.configs = configs;
  }

  setBranch(branch) {
    this.branch = branch;
  }

  setGroup(group) {
    this.group = group;
  }

  setUserAssignedRights(userAssignedRights) {
    this.userAssignedRights = userAssignedRights;
  }
}
