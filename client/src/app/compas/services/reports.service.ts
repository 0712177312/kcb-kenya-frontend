import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Urls } from './url';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  API_URL = new Urls();
  EXP_API = 'reports/enrolledCustomers?';
  constructor(private http: HttpClient) { }

  getBranchesPrev(status) {
    return  this.http.get(`${this.API_URL.url}/gtBranchesPrev?status=` + status);
  }

  getCustomerPreview(fromDate, toDate, enrolledType) {
    return  this.http.get(`${this.API_URL.url}/previewCustomers?FromDt=${fromDate}&ToDt=${toDate}&enrolledType=${enrolledType}`);
  }

  getPdfCustomerReport(fromDt, toDt) {
    return  this.http.get(`${this.EXP_API}reportType=BD&exportType=P&FromDt=${fromDt}&ToDt=${toDt}`);
  }

  getExcelCustomerReport(fromDt, toDt) {
    return  this.http.get(`${this.EXP_API}reportType=BD&exportType=E&FromDt=${fromDt}&ToDt=${toDt}`);
  }

  getCsvCustomerReport(fromDt, toDt) {
    return  this.http.get(`${this.EXP_API}reportType=BD&exportType=C&FromDt=${fromDt}&ToDt=${toDt}`);
  }

  getSystemLogs(fromDt, toDt, userId) {
    return  this.http.get(`${this.API_URL.url}/getSystemActivity?FromDt=${ fromDt }&ToDt=${toDt}&userId=${userId}`);
  }



}
