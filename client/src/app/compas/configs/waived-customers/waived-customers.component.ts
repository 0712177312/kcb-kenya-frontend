import { LogsService } from './../../services/logs.service';
import { Component, OnInit, Inject } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { Applicant } from '../../models/applicant';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-waived-customers',
  templateUrl: './waived-customers.component.html',
  styleUrls: ['./waived-customers.component.css']
})
export class WaivedCustomersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  fileText: any;
  enroleMode = true;
  inquireMode = false;
  locl: any;
  account_number: any;

  searchText;
  closeResult: string;
  String: any = {};
  matchResp: any;
  customerNo: any;
  leftMissing: any = [];
  rightMissing: any = [];
  thumbsMissing: any = [];
  missing: any = [];
  missingStatus = false;
  resp: any;
  element: HTMLImageElement;
  $event: NgbTabChangeEvent;
  defaultSrc = 'assets/images/enroll/noImage_1.png';
  retries = 0;
  is_edit = true;
  custbios = [];
  fingresp: any;
  custResp: any;
  profileSource: any;
  branches: any;
  pbuno: any;
  result: any;
  respimage: any = [];
  bioDetails = true;
  profDetails = false;
  fsource;
  fingerPrints = [];
  bios: any = [];
  fingerprint = [];
  printCount: any;
  bio;
  myBehaviorSubject$;
  accountNumber: any;
  raws = [];
  profpic: any;
  custForm: FormGroup;
  custInquiry: any;
  respo: any;
  observable$;
  searchSubject$ = new Subject<string>();
  public customer: any = {};
  public groups: any;
  public customers: any = [];
  public userGroups: any = [];
  public response: any = null;
  public editMode = false;
  public isNew = false;
  public afi: any = {};
  public isVerified = false;
  public title: string;
  public button: string;
  source: LocalDataSource;
  length: any;
  otc: any = {};
  rightId: any;
  dupResult: number;
  disabled: boolean;
  greetings: any[];
  stompClient: any;
  hands: any;
  leftFP: any;
  rightFP: any;
  thumbsFP: any;
  hand: { 'req': any; };
  constructor( private apiService: BioService, private domSanitizer: DomSanitizer,
      private modalService: NgbModal,
      private modalService2: NgbModal, private logs: LogsService,
      private custSvc: CustomerService, @Inject(DOCUMENT) private document: any,
      private toastr: ToastrService, private biosvc: BioService) {
}
settings = settings;

ngOnInit() {
    this.gtCustomers();
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
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

initEditcustomer($event) {
    console.log('customer', $event.data);
    this.editMode = true;
    this.isVerified = true;
    this.customer.id = $event.data.id;
    this.customer.active = $event.data.active;
    this.customer.branchId = $event.data.branchId;
    this.customer.customerName = $event.data.customerName;
    this.customer.gender = $event.data.gender;
    this.customer.customerIdNumber = $event.data.customerIdNumber;
    this.customer.phoneNumber = $event.data.phoneNumber;
    this.customer.country = $event.data.country;
    this.customer.nationality = $event.data.nationality;
    this.customer.customerId = $event.data.customerId;
    this.customer.mnemonic = $event.data.mnemonic;
     if (this.customer.waived === 'A') {
      this.customer.action = 'N';
     } else {
      this.customer.action = 'W';
     }
    this.customer.createdBy = $event.data.createdBy;
    this.customer.usersId = $event.data.usersId;
    this.isNew = false;
    this.title = 'Edit Profile';
    this.button = 'Update Profile';
}

gtCustomers() {
  this.blockUI.start('Loading data...');
  this.custSvc.getWaivedCustomers().subscribe(data => {
    this.customers = data;
    console.log('custs', this.customers);
    this.customers = this.customers.collection;
    this.source = this.customers;
    console.log('customers##', this.customers);
    this.blockUI.stop();
  }, error => {
    this.blockUI.stop();
    return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
 });
}

  approveCustomerWaive() {
    if (this.rightId === this.customer.createdBy) {
      this.log(this.rightId, 'to approve customer waive they enrolled ' + this.customer.customerId);
      return this.toastr.warning('User cannot approve customer waive they enrolled.', 'Warning!', { timeOut: 4000 });
    }
     if (this.customer.action === 'W') {
        this.customer.waived = 'A';
     } else {
      this.customer.waived = this.customer.action;
     }
      const cust = {
        'customerId': this.customer.customerId,
        'waived': this.customer.waived,
        'waivedApprovedBy': this.rightId
      };
      console.log('works %%%', cust);
     this.blockUI.start('updating customer details...');
      this.custSvc.approveCustomerWaive(cust).subscribe(data => {
        this.blockUI.stop();
        this.response = data;
        if (this.response.status === true) {
          this.log(this.rightId, 'approved customer waive ' + this.customer.customerId);
          this.editMode = false;
          this.customer = {};
          this.gtCustomers();
          return this.toastr.success(this.response.respMessage, 'Success');
        } else {
          this.log(this.rightId, 'failed approved customer waive ' + this.customer.customerId);
          return this.toastr.warning(this.response.respMessage, 'Alert');
        }
      }, error => {
        this.log(this.rightId, 'server error when approving customer waive ' + this.customer.customerId);
        this.blockUI.stop();
        return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
     });
  }

  rejectCustomer() {
    if (this.rightId === this.customer.createdBy) {
      this.log(this.rightId, 'to reject customer waive they enrolled ' + this.customer.customerId);
      return this.toastr.warning('User cannot approve customer waive they enrolled.', 'Warning!', { timeOut: 4000 });
    }

    const cust = {
      'customerId': this.customer.customerId,
      'waivedApprovedBy': this.rightId
    };
    this.blockUI.start('updating customer details...');
    this.custSvc.rejectCustomerWaive(cust).subscribe(data => {
      this.blockUI.stop();
      this.response = data;
      if (this.response.status === true) {
        this.log(this.rightId, 'rejected customer waive ' + this.customer.customerId);
        this.editMode = false;
        this.customer = {};
        this.gtCustomers();
        return this.toastr.success(this.response.respMessage, 'Success');
      } else {
        this.log(this.rightId, 'failed to rejected customer waive ' + this.customer.customerId);
        return this.toastr.warning(this.response.respMessage, 'Alert');
      }
    }, error => {
      this.blockUI.stop();
      this.log(this.rightId, 'server error rejecting customer waive ' + this.customer.customerId);
      return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
   });
  }

cancel() {
    this.editMode = false;
    this.account_number = '';
    this.bios = [];
    this.custbios = [];
    this.customer = {};
    this.profpic = '';

}


}
export let settings = {
mode: 'external',
actions: {
    delete: false,
    add: false,
    position: 'right',
},
columns: {
    counter: {
        title: '#',
        filter: false
    },
    customerName: {
          title: 'Customer Name',
          filter: true
    },
    customerId: {
      title: 'Customer ID',
      filter: true
    },
    country: {
      title: 'Country',
      filter: true
    },
    phoneNumber: {
        title: 'Email Address',
        filter: true
    },
    customerIdNumber: {
        title: 'Customer ID Number',
        filter: true
    },
    enrolledOn: {
      title: 'Enrolled On',
      filter: true
   },
   createdBy: {
    title: 'Enrolled By',
    filter: true
   }

},
edit: {
    // tslint:disable-next-line:max-line-length
    editButtonContent: '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>',
    saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    cancelButtonContent: '<i class="ti-close text-danger"></i>'
},
pager: {
  perPage: 200
  }
};
