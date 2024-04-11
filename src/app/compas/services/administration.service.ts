import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from './url';
import { MySharedService } from './sharedService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  API_URL = new Urls();
  headers: { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient, private globalService: MySharedService) { }

  getUserProfiles() {
    return this.http.get(`${this.API_URL.url}/allUsers`, {
      responseType: 'text',
      headers: this.globalService.getTokenHeader().headers
    });
  }

  getUserProfilesByBranchExcludingCurrentUser(branchCode, groupId, userId) {
    return this.http.get(`${this.API_URL.url}/allUsersByBranchExcludingCurrentUser?branchCode=${branchCode}&groupid=${groupId}&userId=${userId}`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getUserGroupsAndRights() {
    return this.http.get(`${this.API_URL.url}/usergroups/gtUserGroups`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getUserGroups() {
    return this.http.get(`${this.API_URL.url}/usergroups`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getUserTypes() {
    return this.http.get(`${this.API_URL.url}/usergrouptypes`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  addUserGroup(userGroup): Observable<any> {
    return this.http.post(`${this.API_URL.url}/usergroups/assignrights`, userGroup, this.globalService.getTokenHeader());
  }
  // async addUserGroup(userGroup): Promise<any> {
  //   try {
  //     const response = await this.http.post(`${this.API_URL.url}/usergroups/assignrights`, userGroup, this.globalService.getTokenHeader()).toPromise();
  //     return response;
      
  //   } catch (error) {
  //     throw error; // Re-throwing error for error handling in addGroup function
  //   }
  // }


  getAllUserMenus() {
    return this.http.get(`${this.API_URL.url}/rightsmenulist`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  addUserProfile(userProfile) {
    return this.http.post(`${this.API_URL.url}/upUser`, userProfile, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getUserGroupsByUserType(userTypeId) {
    return this.http.get(`${this.API_URL.url}/user/gtGroupsByUserType/` + userTypeId, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }


  getUserRightsByUserType(userTypeId) {
    return this.http.get(`${this.API_URL.url}/userGroups/gtRights/` + userTypeId, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getUsersToApprove() {
    return this.http.get(`${this.API_URL.url}/users/toverify`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  approveUsers(users) {
    return this.http.post(`${this.API_URL.url}/users/verifyusers`,users, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  gtUsernames() {
    return this.http.get(`${this.API_URL.url}/dashboard/stats`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getUserMenus(group) {
    return this.http.get(`${this.API_URL.url}/menulist/group?groupId=` + { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getUserGroupRights() {
    return this.http.get(`${this.API_URL.url}/usergroups/gtRights`, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  editUserProfile(userProfile) {
    return this.http.post(`${this.API_URL.url}/editUserProfile`, userProfile, { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

}
