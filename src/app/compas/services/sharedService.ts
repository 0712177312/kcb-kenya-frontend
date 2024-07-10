import { Subject, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import * as Forge from 'node-forge';
import { environment } from 'src/environments/environment';
import { Buffer } from 'buffer'

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
  keySize = 256;
  privateKey = environment.privateKey;
  publicKey = environment.publicKey;

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

  getTokens() {
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

  getAbisClient() {
    const localData = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return localData ? localData.abis : ""
  }
  getCompasUri() {
    const localData = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return localData ? localData.compasUri : ""
  }

  getBioClients() {
    const localData = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    if(localData){
      const { secugen = "https://localhost:8443", greenbit = "https://localhost:8444/getImage/" } = localData;
      return [`${secugen}/SGIFPCapture`, `${greenbit}`]
    } else {
      return []
    }
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
    const bytes = CryptoJS.AES.decrypt(data.toString(), akey2, {
      keySize: 16,
      iv: iv2,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData;
  }

  encryptDataV2(data: any, key: string) {
    const key2 = CryptoJS.enc.Utf8.parse(key);
    const iv2 = CryptoJS.enc.Utf8.parse(key);
    const encData = CryptoJS.AES.encrypt(JSON.stringify(data), key2, {
      keySize: 16,
      iv: iv2,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    data = encData;
    return data;
  }

  decryptDataV2(data: string, key: string): string {
    const key2 = CryptoJS.enc.Base64.parse(key);
    const iv2 = CryptoJS.enc.Base64.parse(key);
    const bytes = CryptoJS.AES.decrypt(data, key2, {
      keySize: 16,
      iv: iv2,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData;
  }

  encryptWithPublicKey = (toEncrypt: any) => {
    const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    const encrypted = rsa.encrypt(toEncrypt, "RSAES-PKCS1-V1_5");
    return Forge.util.encode64(encrypted);
  }


  decryptWithPrivateKey = (toDecrypt: any) => {
    const rsa = Forge.pki.privateKeyFromPem(this.privateKey);
    const decrypted = rsa.decrypt(Forge.util.decode64(toDecrypt), "RSAES-PKCS1-V1_5");
    const base64Decrypted = Forge.util.encode64(decrypted);
    return base64Decrypted;
  }

  generateRandomEncryptionKey() {
    const key = CryptoJS.lib.WordArray.random(128 / 8);
    const keyHex = CryptoJS.enc.Hex.stringify(key);
    return keyHex;
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
