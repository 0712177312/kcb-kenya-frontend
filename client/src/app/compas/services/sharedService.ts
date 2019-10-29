import { Subject, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

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

  encPassword = '@compulynx#54321';

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable(); }

  constructor() {
    //   this.dataChange = new Observable((observer:Observer) {
    //     this.dataChangeObserver = observer;
    //   });
  }

  getConfigs() {
    let configs = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return configs;
  }

  getTokenHeader() {
    let localheaders = new HttpHeaders({
      'Authorization': this.getConfigs().jwt,
      "Access-Control-Expose-Headers": "Authorization"
    });
    let headers = { headers: localheaders };
    return headers;
  }

  encrpytData(data) {
    console.log('sending: ', data);
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

  setUserAssignedRights(userAssignedRights){
    this.userAssignedRights = userAssignedRights;
  }
}
