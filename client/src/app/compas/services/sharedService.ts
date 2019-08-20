import { Subject, Observable } from 'rxjs';

export class MySharedService {
  username: string;
  isAuthenticated: boolean;
  rights: any;
  rightId: any;
  configs: any;
  branch: any;
  group: any;
  timeout: any = 10000;
  // dataChange: Observable<any>;

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable(); }

  constructor() {
    //   this.dataChange = new Observable((observer:Observer) {
    //     this.dataChangeObserver = observer;
    //   });
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
}
