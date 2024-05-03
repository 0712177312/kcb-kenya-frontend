import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from '../../services/reports.service';
@Component({
  selector: 'app-user-profile-report',
  templateUrl: './user-profile-report.component.html',
  styleUrls: ['./user-profile-report.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class UserProfileReportComponent implements OnInit {


  fromDate: Date;
  toDate: Date;
  response: any;
  userStatus = [];
  enrolledType: String;

  exportButtonDisabled: boolean;

  @ViewChild('dataTable') table;
  dataTable: any;
  dtOptions: any;

  otc: any = {};
  branch: any;
  groupid: any;
  constructor(calendar: NgbCalendar, private toastr: ToastrService,private reportSvc: ReportsService) { }

  ngOnInit() {

    this.userStatus = [{ name: 'UnVerified', id: 'N' }, { name: 'Verified', id: 'V' }];
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.branch = this.otc.branch;
    this.groupid = this.otc.group;
  }
  getUsersReport() {
    if (this.fromDate === undefined) {
      return this.toastr.warning('Kindly specify from date to continue', 'Warning!', { timeOut: 3000 });
    } else if (this.toDate === undefined) {
      return this.toastr.warning('Kindly specify to date to continue', 'Warning!', { timeOut: 3000 });
    } else {
      this.reportSvc.getUsersPreview(this.formatDate(this.fromDate), this.formatDate(this.toDate), this.enrolledType, this.branch, this.groupid).subscribe(data => {
        this.response = JSON.parse(data);
        this.response = this.response.collection;
        console.log(this.response);
      });
    }
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
  getPdfUserReport() {
    this.exportButtonDisabled = true;
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    };
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable(this.dtOptions);
  }
}
