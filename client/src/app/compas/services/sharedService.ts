import { Subject, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable(); }

  constructor() {
    //   this.dataChange = new Observable((observer:Observer) {
    //     this.dataChangeObserver = observer;
    //   });
  }

  getTokenHeader() {
    let localheaders = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU3MzEzOTM0NH0.xeWe8cTzxagG3XLM_lxUJU1HF6c6AolZdokUtKEk1uYXEtpmDMgrZL3LkqvTgStTIlXpmBqM8piaUt2Y8DJRPQ',
      "Access-Control-Expose-Headers": "Authorization"
    });
    let headers = { headers: localheaders };
    return headers;
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
