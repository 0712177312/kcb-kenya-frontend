import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-rptbranches',
  templateUrl: './rptbranches.component.html',
  styleUrls: ['./rptbranches.component.css']
})
export class RptbranchesComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public submited: boolean;
  fromDate: any;
  url: any;
  toDate: any;
  response: any;
  brachStatus: any = '';
  filtered = false;
  branches: any = [];
  pdf_url: any;
  csv_url: any;
  resp: any = {};
  xls_url: any;
  constructor(calendar: NgbCalendar, private toastr: ToastrService,
    private reportSvc: ReportsService) {
  }

  filters = [
    {id: 'A', name: 'All Branches'},
    {id: 'W', name: 'Waived Branches'}
  ];

  ngOnInit() {
  }
  getBranchesReports() {
    this.branches = [];
    console.log('status', this.brachStatus);
      this.reportSvc.getBranchesPrev(this.brachStatus).subscribe(data => {
        this.resp = data;
        if (this.resp.status === true) {
          this.branches = this.resp.collection;
        } else {
            return this.toastr.warning(this.resp.respMessage, 'Alert', {timeOut: 3000});
        }
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
  }

}
