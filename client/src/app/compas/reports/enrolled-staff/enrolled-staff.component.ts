import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enrolled-staff',
  templateUrl: './enrolled-staff.component.html',
  styleUrls: ['./enrolled-staff.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})

export class EnrolledStaffComponent implements OnInit {

  fromDate: Date;
  toDate: Date;
  response: any;
  staffStatus = [];
  enrolledType: String;

  exportButtonDisabled: boolean;

  @ViewChild('dataTable') table;
  dataTable: any;
  dtOptions: any;

  constructor(calendar: NgbCalendar, private toastr: ToastrService, private reportSvc: ReportsService) { }

  ngOnInit() {
    this.staffStatus = [{ name: 'Enrolled', id: 'N' }, { name: 'Verified', id: 'A' }, { name: 'Rejected', id: 'R' }, { name: 'Deleted', id: 'AD' }];
  }

  getStaffReport() {
    if (this.fromDate === undefined) {
      return this.toastr.warning('Kindly specify from date to continue', 'Warning!', { timeOut: 3000 });
    } else if (this.toDate === undefined) {
      return this.toastr.warning('Kindly specify to date to continue', 'Warning!', { timeOut: 3000 });
    } else {
      this.reportSvc.getStaffPreview(this.formatDate(this.fromDate), this.formatDate(this.toDate), this.enrolledType).subscribe(data => {
        this.response = data;
        this.response = this.response.collection;
      });
    }
  }

  getPdfStaffReport() {
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
