import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { ToastrService } from 'ngx-toastr';
const my = new Date();


@Component({
  selector: 'app-enrolled-customers',
  templateUrl: './enrolled-customers.component.html',
  styleUrls: ['./enrolled-customers.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})


export class EnrolledCustomersComponent implements OnInit {
  public submited: boolean;
  fromDate: Date;
  url: any;
  toDate: Date;
  response: any;
  filtered = false;
  pdf_url: any;
  csv_url: any;
  xls_url: any;
  customerStatus = [];
  enrolledType: String;


  @ViewChild('dataTable') table;
  dataTable: any;
  dtOptions: any;

  showTable = false;
  constructor(calendar: NgbCalendar, private toastr: ToastrService,
    private reportSvc: ReportsService) {
  }

  ngOnInit() {
    console.log('init');
    this.customerStatus = [{ name: 'Enrolled', id: 'N' }, { name: 'Verified', id: 'A' }];
  }
  get today() {
    return new Date();
  }
  getCustomersReport() {
    if (this.fromDate === undefined) {
      return this.toastr.warning('Kindly specify from date to continue', 'Warning!', { timeOut: 3000 });
    } else if (this.toDate === undefined) {
      return this.toastr.warning('Kindly specify to date to continue', 'Warning!', { timeOut: 3000 });
    } else {
      console.log('dates $$$$', this.toDate, this.fromDate);
      this.reportSvc.getCustomerPreview(this.formatDate(this.fromDate), this.formatDate(this.toDate), this.enrolledType).subscribe(data => {
        this.filtered = true;
        this.response = data;
        this.response = this.response.collection;
        console.log(this.response);
      });
    }
  }
  getPdfCustomerReport() {
    console.log(this.fromDate);
    console.log('clicked....');
    // tslint:disable-next-line:max-line-length
    //this.pdf_url = `reports/enrolledCustomers?reportType=CER&exportType=P&FromDt=${this.formatDate(this.fromDate)}&ToDt=${this.formatDate(this.toDate)}&enrolledType=${this.enrolledType}`;
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    };
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable(this.dtOptions);
  }
  geteCsvCustomerReport() {
    console.log(this.fromDate);
    console.log('clicked....');
    // tslint:disable-next-line:max-line-length
    this.csv_url = `reports/enrolledCustomers?reportType=CER&exportType=P&FromDt=${this.formatDate(this.fromDate)}&ToDt=${this.formatDate(this.toDate)}&enrolledType=${this.enrolledType}`;
  }
  getExcelCustomerReport() {
    console.log(this.fromDate);
    console.log('clicked....');
    // tslint:disable-next-line:max-line-length
    this.xls_url = `reports/enrolledCustomers?reportType=CER&exportType=P&FromDt=${this.formatDate(this.fromDate)}&ToDt=${this.formatDate(this.toDate)}&enrolledType=${this.enrolledType}`;
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

  getCustomerReportCsv() {
    if (this.fromDate === undefined) {
      return this.toastr.warning('Kindly specify the initial date in order to proceed', 'Warning!', { timeOut: 3000 });
    } else if (this.toDate === undefined) {
      return this.toastr.warning('Kindly specify the final date in order to proceed', 'Warning!', { timeOut: 3000 });
    } else if (this.enrolledType === undefined) {
      return this.toastr.warning('Kindly specify the enrollment type in order to continue', 'Warning!', { timeOut: 4000 });
    } else {
      this.reportSvc.getCustomerLogsForExporting(this.formatDate(this.fromDate), this.formatDate(this.toDate), this.enrolledType).subscribe(data => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(data);
        a.download = "CustomerLogs.csv";
        // start download
        a.click();
      }, error => {
        return this.toastr.error("Error occurred while attempting to create the csv file", 'Error!', { timeOut: 4000 });
      });
    }
  }
}
