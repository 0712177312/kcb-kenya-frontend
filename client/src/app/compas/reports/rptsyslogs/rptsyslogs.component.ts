import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from '../../services/reports.service';
import { AdministrationService } from '../../services/administration.service';

@Component({
  selector: 'app-rptsyslogs',
  templateUrl: './rptsyslogs.component.html',
  styleUrls: ['./rptsyslogs.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class RptsyslogsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public submited: boolean;
  fromDate: Date;
  url: any;
  toDate: Date;
  response: any;
  brachStatus: any = '';
  filtered = false;
  logs: any = [];
  userId: any;
  pdf_url: any;
  users: any;
  usersResp = [];
  csv_url: any;
  resp: any = {};
  xls_url: any;
  constructor(calendar: NgbCalendar, private userSvc: AdministrationService, private toastr: ToastrService,
    private reportSvc: ReportsService) {
  }

  ngOnInit() {
    this.getUsers();
  }
  get today() {
    return new Date();
  }
  // http://localhost:9000/compas/reports/enrolledCustomers?reportType=BD&exportType=P&FromDt=2018-12-12&ToDt=2019-12-12&userId=21
  getLogsRpt() {
    this.logs = [];
    if (this.fromDate === undefined) {
      return this.toastr.warning('Kindly specify from date to continue', 'Warning!', { timeOut: 4000 });
    } else if (this.toDate === undefined) {
      return this.toastr.warning('Kindly specify to date to continue', 'Warning!', { timeOut: 4000 });
    } else if (this.userId === undefined) {
      return this.toastr.warning('Kindly specify to user to continue', 'Warning!', { timeOut: 4000 });
    } else {
      this.reportSvc.getSystemLogs(this.formatDate(this.fromDate), this.formatDate(this.toDate), this.userId).subscribe(data => {
        this.resp = data;
        if (this.resp.collection.length <= 0) {
          return this.toastr.warning('No items found', 'Alert', { timeOut: 4000 });
        }
        if (this.resp.status === true && this.resp.collection.length > 0) {
          this.logs = this.resp.collection;
        } else {
          return this.toastr.warning(this.resp.respMessage, 'Alert', { timeOut: 4000 });
        }
      }, error => {
        this.blockUI.stop();
        return this.toastr.error(this.resp.respMessage, 'Error!', { timeOut: 4000 });
      });
    }
  }

  getUsers() {
    this.userSvc.getUserProfiles().subscribe(data => {
      this.users = data;
      if (this.users.status === true) {
        this.usersResp = this.users.collection;
      } else {
        return this.toastr.warning('No users found', 'Warning!', { timeOut: 4000 });
      }
    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
  }

  getPdfCustomerReport() {
    console.log(this.fromDate);
    console.log('clicked....');
    // tslint:disable-next-line:max-line-length
    this.pdf_url = `reports/enrolledCustomers?reportType=BD&exportType=P&FromDt=${this.formatDate(this.fromDate)}&ToDt=${this.formatDate(this.toDate)}&userId=${this.userId}`;
  }
  geteCsvCustomerReport() {
    console.log(this.fromDate);
    console.log('clicked....');
    // tslint:disable-next-line:max-line-length
    this.csv_url = `reports/enrolledCustomers?reportType=BD&exportType=C&FromDt=${this.formatDate(this.fromDate)}&ToDt=${this.formatDate(this.toDate)}&userId=${this.userId}`;
  }
  getExcelCustomerReport() {
    console.log(this.fromDate);
    console.log('clicked....');
    // tslint:disable-next-line:max-line-length
    this.xls_url = `reports/enrolledCustomers?reportType=BD&exportType=E&FromDt=${this.formatDate(this.fromDate)}&ToDt=${this.formatDate(this.toDate)}&userId=${this.userId}`;
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }

  getUserActivityCsv() {
    if (this.fromDate === undefined) {
      return this.toastr.warning('Kindly specify from date to continue', 'Warning!', { timeOut: 4000 });
    } else if (this.toDate === undefined) {
      return this.toastr.warning('Kindly specify to date to continue', 'Warning!', { timeOut: 4000 });
    } else if (this.userId === undefined) {
      return this.toastr.warning('Kindly specify to user to continue', 'Warning!', { timeOut: 4000 });
    } else {
      this.reportSvc.getSystemLogsForExporting(this.formatDate(this.fromDate), this.formatDate(this.toDate), this.userId).subscribe(data => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(data);
        a.download = "UserAcitivity.csv";
        // start download
        a.click();
      }, error => {
        return this.toastr.error("Error occurred while attempting to create the csv file", 'Error!', { timeOut: 4000 });
      });
    }
  }
}
