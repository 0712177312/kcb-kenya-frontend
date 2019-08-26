import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Urls } from './url';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  API_URL = new Urls();
  constructor(private http: HttpClient) { }
  getUserMenus(group) {
    return this.http.get(`${this.API_URL.url}/menulist/group?groupId=` + group);
  }


  getUserAssignedRights(groupId){
    return this.http.get(`${this.API_URL.url}/usergroups/getUserGroupUsingGroupId?groupId=` + groupId);
  }
}
