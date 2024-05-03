import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from './url';
import { Observable } from 'rxjs';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { MySharedService } from './sharedService';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  API_URL = new Urls();
  EXP_API = 'reports/enrolledCustomers?';
  constructor(private http: HttpClient, private globalService: MySharedService) { }

  getBranchesPrev(status) {
    return  this.http.get(`${this.API_URL.url}/gtBranchesPrev?status=` + status,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getCustomerPreview(fromDate, toDate, enrolledType, branchCode, groupId) {
    return  this.http.get(`${this.API_URL.url}/previewCustomers?FromDt=${fromDate}&ToDt=${toDate}&enrolledType=${enrolledType}&branchCode=${branchCode}&groupid=${groupId}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  getBioExemptionPreview(fromDate, toDate,  branchCode, groupId){
    return  this.http.get(`${this.API_URL.url}/previewBioExemption?FromDt=${fromDate}&ToDt=${toDate}&branchCode=${branchCode}&groupid=${groupId}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  
  }
  getStaffPreview(fromDate, toDate, enrolledType, branchCode, groupId) {
    return  this.http.get(`${this.API_URL.url}/tellers/previewStaff?FromDt=${fromDate}&ToDt=${toDate}&enrolledType=${enrolledType}&branchCode=${branchCode}&groupid=${groupId}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  
  getUsersPreview(fromDate, toDate, enrolledType, branchCode, groupId) {
    return  this.http.get(`${this.API_URL.url}/previewProfiles?FromDt=${fromDate}&ToDt=${toDate}&enrolledType=${enrolledType}&branchCode=${branchCode}&groupid=${groupId}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getConvertedCustomersStaffReport(fromDate, toDate, enrolledType, branchCode, groupId) {
    return  this.http.get(`${this.API_URL.url}/previewConvertedCustomersStaff?FromDt=${fromDate}&ToDt=${toDate}&enrolledType=${enrolledType}&branchCode=${branchCode}&groupid=${groupId}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }
  getPdfCustomerReport(fromDt, toDt) {
    return  this.http.get(`${this.EXP_API}reportType=BD&exportType=P&FromDt=${fromDt}&ToDt=${toDt}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getExcelCustomerReport(fromDt, toDt) {
    return  this.http.get(`${this.EXP_API}reportType=BD&exportType=E&FromDt=${fromDt}&ToDt=${toDt}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getCsvCustomerReport(fromDt, toDt) {
    return  this.http.get(`${this.EXP_API}reportType=BD&exportType=C&FromDt=${fromDt}&ToDt=${toDt}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getSystemLogs(fromDt, toDt, userId) {
    return  this.http.get(`${this.API_URL.url}/getSystemActivity?FromDt=${ fromDt }&ToDt=${toDt}&userId=${userId}`,  { responseType: 'text', headers: this.globalService.getTokenHeader().headers });
  }

  getSystemLogsForExporting(fromDt, toDt, userId){
    let options = new RequestOptions({responseType: ResponseContentType.Blob });
    return this.http.get(`${this.API_URL.url}/getSystemActivityForExporting?FromDt=${ fromDt }&ToDt=${toDt}&userId=${userId}`, {"responseType": "blob"});
  }

  getCustomerLogsForExporting(fromDate, toDate, enrolledType){
    let options = new RequestOptions({responseType: ResponseContentType.Blob });
    return this.http.get(`${this.API_URL.url}/getCustomerLogsForExporting?FromDt=${fromDate}&ToDt=${toDate}&enrolledType=${enrolledType}`, {"responseType": "blob"});
  }



}
