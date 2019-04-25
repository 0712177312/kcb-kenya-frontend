import { Component, OnInit, Inject } from '@angular/core';
import { WebSocketServiceService } from './../../services/web-socket-service.service';
import { RegionService } from './../../services/region.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dash-stats',
  templateUrl: './dash-stats.component.html',
  styleUrls: ['./dash-stats.component.css']
})

export class DashStatsComponent implements OnInit {
  response: any = {};
  stats: any = [];
  constructor( private dashSvc: DashboardService, private apiService: BioService,
     private fb: FormBuilder, private sockService: WebSocketServiceService,
    private custSvc: CustomerService,
    private toastr: ToastrService, private regionService: RegionService) {}

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.dashSvc.getBstats().subscribe(data => {
          this.response = data;
          if (this.response.status === true) {
              this.stats = this.response.collection;
          } else {
             return this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 4000 });
          }
    }, error => {
      return this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 4000 });
    });
  }
}
