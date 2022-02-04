import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Logs } from 'selenium-webdriver';
import { LogsService } from '../../services/logs.service';
import { WebSocketServiceService } from '../../services/web-socket-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detach-customer',
  templateUrl: './detach-customer.component.html',
  styleUrls: ['./detach-customer.component.css']
})
export class DetachCustomerComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  otc: any = {};
  rightId: any;
  isVerified = false;
  editMode = false;
  isNew = false;
  customer: any = {};

  response: any = null;

  customers: any = [];

  title: string;
  button: string;

  account_number: any;

  settings = settings;

  // manage rights buttons
  canViewUserProfile;
  canAddUserProfile;
  canEditUserProfile;

  constructor(private apiService: BioService,
    private modalService: NgbModal,
    private modalService2: NgbModal, private logs: LogsService, private sockService: WebSocketServiceService,
    private custSvc: CustomerService, @Inject(DOCUMENT) private document: any,
    private toastr: ToastrService, private biosvc: BioService, private router: Router) { }

  ngOnInit() {
    this.gtCustomers();
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    this.getUserAssignedRights();
  }

  getUserAssignedRights() {
    const userAssignedRights = this.otc.userAssignedRights;
    console.log('userAssignedRights: ', userAssignedRights);
    let rightsIndex = -1;
    for (let i = 0; i < userAssignedRights[0].rights.length; i++) {
      console.log('userAssignedRights path: ' + userAssignedRights[0].rights[i].path);
      if (userAssignedRights[0].rights[i].path === '/masters/verifyprint-customer') {
        rightsIndex = i;
        break;
      }
    }

    if (rightsIndex >= 0) {
      this.canViewUserProfile = userAssignedRights[0].rights[rightsIndex].allowView;
      this.canAddUserProfile = userAssignedRights[0].rights[rightsIndex].allowAdd;
      this.canEditUserProfile = userAssignedRights[0].rights[rightsIndex].allowEdit;
    }
  }

  log(userId, activity) {
    const log = {
      'userId': userId,
      'activity': activity
    };
    this.logs.log(log).subscribe((data) => {
    }, error => {
      return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
  }

  initEditcustomer($event) {
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
    this.customer.createdBy = $event.data.createdBy;
    this.customer.usersId = $event.data.usersId;
    this.customer.deletedBy = $event.data.deletedBy;
    console.log("customer deletedBy: " + this.customer.deletedBy);
    this.isNew = false;
    this.title = 'Edit Profile';
    this.button = 'Update Profile';
  }

  gtCustomers() {
    this.blockUI.start('Loading Customer data...');
    this.custSvc.getCustomersToApproveDetach().subscribe((data: any) => {
      this.customers = data.collection;
    }, error => {
      return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 1500 });
    });
  }

  approveCustomerDetachment() {
    const customerDetails = {
      'customerId': this.customer.customerId
    };
    if(this.rightId == this.customer.deletedBy){
      return this.toastr.error('User cannot approve detachment of customer that they queued for removal', 'Error!', { timeOut: 4000 });
    }
    this.blockUI.start('Approving the Customer Detachment...');
    // update from compas and remove from abis
    this.custSvc.approveRemoveCustomer(customerDetails).subscribe((response) => {
      this.response = response;
      this.log(this.rightId, "approved removal of customer details of customer with customerId: " + customerDetails.customerId + " from the database");
      this.apiService.afisRemove(customerDetails).subscribe((response) => {
        this.blockUI.stop();
        this.response = response;
        if (this.response.status === true) {
          this.log(this.rightId, "removed the customer details of customer with customerId: " + customerDetails.customerId + " from abis");
          this.isVerified = false;
          this.router.navigate(['./']);
          return this.toastr.success('Customer removed successfully', ' Success!');
        } else {
          this.log(this.rightId, "attempted to remove customer details of customer with customerId: " + customerDetails.customerId + " from abis");
          return this.toastr.error('Customer not removed successfully', ' Error!', { timeOut: 4000 });
        }
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error while attempting to remove the customer details', 'Error!', { timeOut: 4000 });
      });
    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error while attempting to remove the customer.', 'Error!', { timeOut: 4000 });
    });
  }

  rejectCustomerDetachment() {
    // update from compas
    const customerDetails = {
      'customerId': this.customer.customerId
    };
    if (this.rightId == this.customer.deletedBy) {
      return this.toastr.error('User cannot reject detachment of customer that they queued for removal', 'Error!', { timeOut: 4000 });
    }
    this.blockUI.start('Rejecting the Customer...');
    this.custSvc.rejectRemoveCustomer(customerDetails).subscribe(data => {
      this.response = data;
      this.blockUI.stop();
      if (this.response.status === true) {
        this.editMode = false;
        this.log(this.rightId, 'rejected the removal of customer with customerId ' + customerDetails.customerId);
        this.gtCustomers();
        return this.toastr.success('Customer detachment was rejected successfully.', ' Success!');
      } else {
        this.log(this.rightId, 'attempted to reject the removal of customer with customerId ' + customerDetails.customerId);
        return this.toastr.success('Customer reject of detachment not done successfully..', ' Warning!');
      }
    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error while attempting to reject the detachment of the customer.', 'Error!', { timeOut: 4000 });
    });
  }

  ngOnDestroy() {
    this.editMode = false;
    this.customer = {};
  }

  cancel(){
    this.editMode = false;
    this.isVerified = false;
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
    editButtonContent: (this.canAddUserProfile === true) ? '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>' : '',
    saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    cancelButtonContent: '<i class="ti-close text-danger"></i>'
  },
  pager: {
    perPage: 200
  }
};


