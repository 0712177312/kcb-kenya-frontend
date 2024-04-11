import { LogsService } from './../../services/logs.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegionService } from '../../services/region.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'app-waive',
  templateUrl: './waive.component.html',
  styleUrls: ['./waive.component.css']
})

export class WaiveComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  otc: any = {};
  rightId: any;
  editMode: any = false;
  settings = settings;
  customer: any = {};
  customerId: any;
  is_edit: any = false;
  activeBranches: any = [];
  response: any = {};
  countries: any = [];
  source: LocalDataSource;
  staticAlertClosed = false;
  constructor( private toastr: ToastrService, private configService: ConfigsService,
    private logs: LogsService, private regionService: RegionService) { }

  ngOnInit() {
    this.gtCountries();
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    console.log('right id', this.rightId);
    setTimeout(() => (this.staticAlertClosed = true), 8000);
  }

  log(userId, activity) {
    const log = {
        'userId': userId,
        'activity': activity
    };
    this.logs.log(log).subscribe((data) => {
        console.log('logged');
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
  }
  gtCountries() {
    this.blockUI.start('Loading data...');
    this.regionService.getActiveCountries().subscribe(data => {
        this.countries = JSON.parse(data);
        console.log('countries', this.countries);
        this.countries = this.countries.hashset;
        console.log('countries##', this.countries);
        this.blockUI.stop();
      });
  }

  waiveCustomer() {
    if (this.customer.createdBy === this.rightId) {
      return this.toastr.error('User cannot waive customer they enrolled, kindly contact admin.', 'Error!', { timeOut: 1500 });
    } else {
    this.blockUI.start('updating customer details ...');
    const cust = {
      'waivedBy': this.rightId,
      'customerId' : this.customer.customerId,
      'reason':""
    };
    console.log('customer to waive', cust);
    this.configService.waiveCustomer(cust).subscribe(data => {
     this.response = JSON.parse(data);
     this.blockUI.stop();
     if  (this.response.status === true) { 
         console.log('customer', this.customer);
         this.editMode = false;
         this.customer = {};
         this.customerId = '';
         return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 1500 });
        } else {
            return this.toastr.warning(this.response.respMessage, 'Error!', { timeOut: 1500 });
       }
    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
       });
     }
  }

  cancel() {
    this.editMode = false;
    this.customer = {};
    this.customerId = '';
  }

  gtActivebranches() {
    this.regionService.getActiveBranches().subscribe(data => {
      this.response = JSON.parse(data);
      this.activeBranches = this.response.hashset;
    }, error => {
      return this.toastr.error('Error in loading branch data.', 'Error!', { timeOut: 1500 });
    });
  }
initEditcustomer() {
  console.log('customer', this.customer);
  this.editMode = true;
  this.is_edit = true;
  this.customer.id = this.customer.id;
  this.customer.active = this.customer.active;
  this.customer.branchId = this.customer.branchId;
  this.customer.customerName = this.customer.customerName;
  this.customer.gender = this.customer.gender;
  this.customer.customerIdNumber = this.customer.customerIdNumber;
  this.customer.phoneNumber = this.customer.phoneNumber;
  this.customer.country = this.customer.country;
  this.customer.nationality = this.customer.nationality;
  this.customer.customerId = this.customer.customerId;
  this.customer.mnemonic = this.customer.mnemonic;
  this.customer.createdBy = this.customer.createdBy;
  this.customer.usersId = this.customer.usersId;
}

  getCustomerToWaive() {
    this.blockUI.start('Loading data...');
    const custom = {
      'customerId': this.customerId
    };

    this.configService.getCustomerToWaive(custom).subscribe(data => {
     this.response = JSON.parse(data);
     this.blockUI.stop();
     if  (this.response.status === true) {
         this.customer = this.response.customer;
         console.log('customer', this.customer);
         this.editMode = true;
         this.initEditcustomer();
     } else {
        return this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
     }

    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
    });
  }
}

export let settings = {
  mode: 'external',
  actions: {
      delete: false,
      position: 'right',
  },
 // selectMode: 'multi',
  columns: {
    id: {
      title: '#',
      filter: true
    },
    channelCode: {
          title: 'Channel Code',
          filter: true
      },
   channelName: {
          title: 'Channel Name',
          filter: true
      },
      activeStatus: {
          title: 'Status',
          filter: false
      }
  },
  edit: {
      // tslint:disable-next-line:max-line-length
      editButtonContent: '<a class="btn btn-block btn-outline-success m-r-10"> <i class="fas fa-check-circle text-info-custom"></i></a>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>'
  },
  add: {
      // tslint:disable-next-line:max-line-length
      addButtonContent: '<a class="btn btn-block btn-outline-info m-r-10"> <i class="fas fa-plus-circle"></i></a>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
  },
  attr: {
    class: 'table-bordered table-striped'
  },
};
