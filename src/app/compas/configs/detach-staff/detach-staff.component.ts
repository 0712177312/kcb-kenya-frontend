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
import { TellerService } from '../../services/teller.service';

@Component({
  selector: 'app-detach-staff',
  templateUrl: './detach-staff.component.html',
  styleUrls: ['./detach-staff.component.css']
})
export class DetachStaffComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  otc: any = {};
  rightId: any;
  isVerified = false;
  editMode = false;
  isNew = false;
  teller: any = {};

  response: any = null;

  tellers: any = [];

  title: string;
  button: string;

  account_number: any;


  // manage rights buttons
  canViewUserProfile;
  canAddUserProfile;
  canEditUserProfile;

  settings;


  constructor(private apiService: BioService,
    private modalService: NgbModal,
    private modalService2: NgbModal, private logs: LogsService, private sockService: WebSocketServiceService,
    private tellerSvc: TellerService, @Inject(DOCUMENT) private document: any,
    private toastr: ToastrService, private biosvc: BioService, private router: Router) { }

  ngOnInit() {
    this.gtStaff();
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    this.getUserAssignedRights();
    this.settings = {
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
        tellerName: {
          title: 'Staff Name',
          filter: true
        },
        customerId: {
          title: 'customerId',
          filter: true
        }

      },
      edit: {
        // tslint:disable-next-line:max-line-length
        editButtonContent: (this.canEditUserProfile === true) ? '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>' : '',
        saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
        cancelButtonContent: '<i class="ti-close text-danger"></i>'
      },
      pager: {
        perPage: 200
      }
    };
  }

  getUserAssignedRights() {
    const userAssignedRights = this.otc.userAssignedRights;
    console.log('userAssignedRights: ', userAssignedRights);
    let rightsIndex = -1;
    for (let i = 0; i < userAssignedRights[0].rights.length; i++) {
      console.log('userAssignedRights path: ' + userAssignedRights[0].rights[i].path);
      if (userAssignedRights[0].rights[i].path === '/masters/verifyprint-staff') {
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

  initEditStaff($event) {
    this.editMode = true;
    this.isVerified = true;
    this.teller.tellerName = $event.data.tellerName;
    this.teller.customerId = $event.data.customerId;
    this.teller.deletedBy = $event.data.deletedBy;
    console.log("teller deletedby: " + this.teller.deletedBy);
    console.log("right id: " + this.rightId);
    this.isNew = false;
    this.title = 'Edit Profile';
    this.button = 'Update Profile';
  }

  gtStaff() {
    this.blockUI.start('Loading Staff data...');
    this.tellerSvc.getTellersToApproveDetach().subscribe((data: any) => {
      this.blockUI.stop();
      const res = JSON.parse(data)
      this.tellers = res.hashset;
    }, error => {
      this.blockUI.stop();
      return this.toastr.error(`Error: ${error.respMessage}`, 'Error!', { timeOut: 1500 });
    });
  }

  approveStaffDetachment() {
    const staffDetails = {
      'customerId': this.teller.customerId
    };
    if(this.rightId == this.teller.deletedBy){ 
      return this.toastr.error('User cannot approve detachment of staff that they queued for removal', 'Error!', { timeOut: 4000 });
    }
    this.blockUI.start('Approving the Staff Detachment...');
    // update from compas and remove from abis
    this.tellerSvc.approveRemoveTeller(staffDetails).subscribe((response) => {
      this.response = JSON.parse(response);
      this.log(this.rightId, "approved removal of staff details of staff with customerId: " + staffDetails.customerId + " from the database");
      this.apiService.afisRemove(staffDetails).subscribe((response:any) => {
        this.blockUI.stop();
        this.response = JSON.parse(response);
        if (this.response.status === true) {
          this.log(this.rightId, "removed the staff details of staff with customerId: " + staffDetails.customerId + " from abis");
          this.isVerified = false;
          this.router.navigate(['./']);
          return this.toastr.success('Staff removed successfully', ' Success!');
        } else {
          this.log(this.rightId, "attempted to remove staff details of customer with customerId: " + staffDetails.customerId + " from abis");
          return this.toastr.error('Staff not removed successfully', ' Error!', { timeOut: 4000 });
        }
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error while attempting to remove the staff details', 'Error!', { timeOut: 4000 });
      });
    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error while attempting to remove the staff.', 'Error!', { timeOut: 4000 });
    });
  }

  rejectStaffDetachment() {
    // update from compas
    const staffDetails = {
      'customerId': this.teller.customerId
    };
    if (this.rightId == this.teller.deletedBy) {
      return this.toastr.error('User cannot reject detachment of staff that they queued for removal', 'Error!', { timeOut: 4000 });
    }
    this.blockUI.start('Rejecting the Staff...');
    this.tellerSvc.rejectRemoveTeller(staffDetails).subscribe(data => {
      this.response = JSON.parse(data);
      this.blockUI.stop();
      if (this.response.status === true) {
        this.editMode = false;
        this.log(this.rightId, 'rejected the removal of staff with customerId ' + staffDetails.customerId);
        this.gtStaff();
        return this.toastr.success('Staff detachment was rejected successfully.', ' Success!');
      } else {
        this.log(this.rightId, 'attempted to reject the removal of staff with customerId ' + staffDetails.customerId);
        return this.toastr.success('Staff reject of detachment not done successfully..', ' Warning!');
      }
    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error while attempting to reject the detachment of the staff.', 'Error!', { timeOut: 4000 });
    });
  }

  ngOnDestroy() {
    this.editMode = false;
    this.teller = {};
  }

  cancel(){
    this.editMode = false;
    this.isVerified = false;
  }

}

// export let settings = {
//   mode: 'external',
//   actions: {
//     delete: false,
//     add: false,
//     position: 'right',
//   },
//   columns: {
//     counter: {
//       title: '#',
//       filter: false
//     },
//     tellerName: {
//       title: 'Teller Name',
//       filter: true
//     },
//     customerId: {
//       title: 'customerId',
//       filter: true
//     }
//
//   },
//   edit: {
//     // tslint:disable-next-line:max-line-length
//     editButtonContent: (this.canAddUserProfile === true) ? '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>' : '',
//     saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
//     cancelButtonContent: '<i class="ti-close text-danger"></i>'
//   },
//   pager: {
//     perPage: 200
//   }
// };
