import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from './url';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  API_URL = new Urls();
  headers: { 'Content-Type': 'application/json' };
  constructor(private http: HttpClient) { }

  getUserProfiles() {
    return this.http.get(`${this.API_URL.url}/allUsers`);
  }

  getUserProfilesByBranchExcludingCurrentUser(branchCode, groupId, userId){
    return this.http.get(`${this.API_URL.url}/allUsersByBranchExcludingCurrentUser?branchCode=${branchCode}&groupid=${groupId}&userId=${userId}`);
  }

  getUserGroupsAndRights() {
    return this.http.get(`${this.API_URL.url}/usergroups/gtUserGroups`);
  }

  getUserGroups() {
    return this.http.get(`${this.API_URL.url}/usergroups`);
  }

  getUserTypes() {
    return this.http.get(`${this.API_URL.url}/usergrouptypes`);
  }

  addUserGroup(userGroup) {
    return this.http.post(`${this.API_URL.url}/usergroups/assignrights`, userGroup);
  }

  getAllUserMenus() {
    return this.http.get(`${this.API_URL.url}/rightsmenulist`);
  }

  addUserProfile(userProfile) {
    return this.http.post(`${this.API_URL.url}/upUser`, userProfile);
  }

  getUserGroupsByUserType(userTypeId) {
    return this.http.get(`${this.API_URL.url}/user/gtGroupsByUserType/` + userTypeId);
  }


  getUserRightsByUserType(userTypeId) {
    return this.http.get(`${this.API_URL.url}/userGroups/gtRights/` + userTypeId);
  }

  getUsersToApprove() {
    return this.http.get(`${this.API_URL.url}/users/toverify`);
  }

  approveUsers(users) {
    return this.http.post(`${this.API_URL.url}/users/verifyusers`, users);
  }

  gtUsernames() {
    return this.http.get(`${this.API_URL.url}/dashboard/stats`);
  }

  getUserMenus(group) {
    return this.http.get(`${this.API_URL.url}/menulist/group?groupId=` + group);
  }

  getUserGroupRights() {
    return this.http.get(`${this.API_URL.url}/usergroups/gtRights`);
  }

  editUserProfile(userProfile){
    return this.http.post(`${this.API_URL.url}/editUserProfile`, userProfile);
  }

}
