import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Urls } from './url';
import { MySharedService } from './sharedService';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  API_URL = new Urls();
  constructor(private http: HttpClient, private globalService: MySharedService) { }
  getUserMenus(group) {
    return this.http.get(`${this.API_URL.url}/menulist/group?groupId=` + group, this.globalService.getTokenHeader());
  }


  getUserAssignedRights(groupId){
   return this.http.get(`${this.API_URL.url}/usergroups/getUserGroupUsingGroupId?groupId=` + groupId,  this.globalService.getTokenHeader());
  }
}
