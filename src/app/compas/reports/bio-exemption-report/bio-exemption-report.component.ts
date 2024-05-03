import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bio-exemption-report',
  templateUrl: './bio-exemption-report.component.html',
  styleUrls: ['./bio-exemption-report.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class BioExemptionReportComponent implements OnInit {
  fromDate: Date;
  url: any;
  toDate: Date;
  response: any;

  otc: any = {};
  branch: any;
  groupid: any;
  constructor(calendar: NgbCalendar, private toastr: ToastrService,
    private reportSvc: ReportsService) { }

  ngOnInit() {

    
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.branch = this.otc.branch;
    this.groupid = this.otc.group;
  }
  getCustomersReport() {
    if (this.fromDate === undefined) {
      return this.toastr.warning('Kindly specify from date to continue', 'Warning!', { timeOut: 3000 });
    } else if (this.toDate === undefined) {
      return this.toastr.warning('Kindly specify to date to continue', 'Warning!', { timeOut: 3000 });
    } else {
      console.log('dates $$$$', this.toDate, this.fromDate);
      this.reportSvc.getBioExemptionPreview(this.formatDate(this.fromDate), this.formatDate(this.toDate), this.branch, this.groupid).subscribe(data => {
        this.response = JSON.parse(data);
        this.response = this.response.hashset;
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
}
