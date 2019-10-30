import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from './url';
import { MySharedService } from './sharedService';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  API_URL = new Urls();
  headers: { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient, private globalService: MySharedService) { }

  getUserProfiles() {
    return this.http.get(`${this.API_URL.url}/allUsers`, this.globalService.getTokenHeader());
  }

  getUserProfilesByBranchExcludingCurrentUser(branchCode, groupId, userId){
    return this.http.get(`${this.API_URL.url}/allUsersByBranchExcludingCurrentUser?branchCode=${branchCode}&groupid=${groupId}&userId=${userId}`, {responseType: 'text', headers: this.globalService.getTokenHeader().headers});
  }

  getUserGroupsAndRights() {
    return this.http.get(`${this.API_URL.url}/usergroups/gtUserGroups`, this.globalService.getTokenHeader());
  }

  getUserGroups() {
    return this.http.get(`${this.API_URL.url}/usergroups`, this.globalService.getTokenHeader());
  }

  getUserTypes() {
    return this.http.get(`${this.API_URL.url}/usergrouptypes`, this.globalService.getTokenHeader());
  }

  addUserGroup(userGroup) {
    return this.http.post(`${this.API_URL.url}/usergroups/assignrights`, userGroup, this.globalService.getTokenHeader());
  }

  getAllUserMenus() {
    return this.http.get(`${this.API_URL.url}/rightsmenulist`, this.globalService.getTokenHeader());
  }

  addUserProfile(userProfile) {
    return this.http.post(`${this.API_URL.url}/upUser`, userProfile, {responseType: 'text', headers: this.globalService.getTokenHeader().headers});
  }

  getUserGroupsByUserType(userTypeId) {
    return this.http.get(`${this.API_URL.url}/user/gtGroupsByUserType/` + userTypeId, this.globalService.getTokenHeader());
  }


  getUserRightsByUserType(userTypeId) {
    return this.http.get(`${this.API_URL.url}/userGroups/gtRights/` + userTypeId, this.globalService.getTokenHeader());
  }

  getUsersToApprove() {
    return this.http.get(`${this.API_URL.url}/users/toverify`, this.globalService.getTokenHeader());
  }

  approveUsers(users) {
    return this.http.post(`${this.API_URL.url}/users/verifyusers`, users, this.globalService.getTokenHeader());
  }

  gtUsernames() {
    return this.http.get(`${this.API_URL.url}/dashboard/stats`, this.globalService.getTokenHeader());
  }

  getUserMenus(group) {
    return this.http.get(`${this.API_URL.url}/menulist/group?groupId=` + group, this.globalService.getTokenHeader());
  }

  getUserGroupRights() {
    return this.http.get(`${this.API_URL.url}/usergroups/gtRights`, this.globalService.getTokenHeader());
  }

  editUserProfile(userProfile){
    return this.http.post(`${this.API_URL.url}/editUserProfile`, userProfile, {responseType: 'text', headers: this.globalService.getTokenHeader().headers});
  }

}
