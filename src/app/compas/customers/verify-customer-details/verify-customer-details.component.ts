import { Component, OnInit, Inject } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocalDataSource } from 'ng2-smart-table';
import { BioService } from '../../services/bio.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogsService } from '../../services/logs.service';
import { WebSocketServiceService } from '../../services/web-socket-service.service';
import { CustomerService } from '../../services/customer.service';
import { DOCUMENT } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RegionService } from '../../services/region.service';
import { Profile } from 'selenium-webdriver/firefox';
import { TellerService } from '../../services/teller.service';

@Component({
  selector: 'app-verify-customer-details',
  templateUrl: './verify-customer-details.component.html',
  styleUrls: ['./verify-customer-details.component.css']
})
export class VerifyCustomerDetailsComponent implements OnInit {
  otc: any;
  rightId: any;
  account_number: string;
  form: FormGroup;
  tellerForm: FormGroup;
  isDisabled = true;
  bioconfigs: any = {};
  isProfile: boolean;
  tellerInq: any;
  editMode: boolean;
  isVerified: boolean;
  isNew: boolean;
  cust: any;
  indentify: boolean;
  customers: any;
  userProfile: {};
  isVerify = false;
  tellerProfile: any;
  fingerprints: any[];
  custbios: any[];
  tellerdata: any;
  customer: any;
  btnClass: boolean;
  btnsCaptured: any[];
  profType = '2';
  response: any;
  activeBranches = [];
  locl: any = {};

  constructor(private apiService: BioService, private tellerSvc: TellerService,
    private modalService: NgbModal, private fb: FormBuilder, private logs: LogsService, private sockService: WebSocketServiceService,
    private custSvc: CustomerService,
    private toastr: ToastrService, private regionService: RegionService, private router: Router) {

  }
  settings = settings;
  loading = false;
  ngOnInit() {
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    console.log('right id', this.rightId);
  }


  log(userId, activity) {
    const log = {
      'userId': userId,
      'activity': activity
    };
    this.logs.log(log).subscribe((data) => {
      console.log('logged');
    }, error => {
      return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
  }

  validateStaffId(event: any) {
    let regExpr = new RegExp(/^[A-Z|a-z|0-9]+$/);
    let result = regExpr.test(event.key);
    return result;
  }



  initInquiry() {
    this.account_number = '';
    this.editMode = true;
    this.isVerified = false;
    this.isNew = true;
  }

  getCustomer(cust) {
    if (cust === '') {
      return this.toastr.warning('Kindly provide valid customer/staff id to continue', ' Warning!', { timeOut: 4000 });
    }

    if (this.profType === '2') {
      this.tellerInquiry(cust);
    } else {
      this.customerInfInquiry(cust);
    }
  }

  tellerInquiry(teller) {

    let idPattern = new RegExp(/^KE[0-9]{1,15}$/);
    let result = idPattern.test(teller);

    if (result) {
      const tellr = {
        'tellerId': teller
      };
      this.tellerSvc.checkTellerExists(tellr).subscribe(data => {
        this.locl = data;
        if (this.locl.status === true) {

          return this.toastr.warning('staff with specified details already exists', ' Warning!', { timeOut: 3000 });
        } else {
          const tell = {
            'userName': this.getConfigs().authUsr,
            'passWord': this.getConfigs().authPs,
            'object': {
              'id': teller,
            }
          };
          this.tellerCoBankingInq(tell);
        }
      }, error => {
        return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
      });
    } else {
      console.log('invalid id');
      return this.toastr.error('Staff ID should match pattern KE1234', 'Error!', { timeOut: 4000 });
    }

  }
  tellerCoBankingInq(teller) {
    // this.tellerSvc.getTllrDetails().subscribe (data => {
    this.tellerSvc.getTellerDetails(teller).subscribe((data: any) => {

      if (data.payload !== null) {
        if (data.message === 'Success' && data.requestStatus === true) {
          this.tellerInq = data;

          if (this.tellerInq.payload.cif !== null && this.tellerInq.payload.cif !== '') {
            this.isVerified = true;
            this.account_number = ' ';
            this.initTellerProfile(this.tellerInq);
            return this.toastr.success('Staff id is valid, can proceed to enroll', ' Success!');
          } else if (this.tellerInq.payload.cif === '') {
            return this.toastr.warning('CIF number is invalid', ' Warning!');
          }
          else {
            return this.toastr.warning('Specified staff id was not found or invalid , kindly verify to proceed .', 'Warning!');
          }


        } else {
          return this.toastr.error('Error in inquiring Staff data.', 'Error!', { timeOut: 4000 });
        }

      } else {
        return this.toastr.warning('Specified staff id was not found or invalid , kindly verify to proceed .', 'Warning!');
      }
      // this.tellerInq = data;
      // if (this.tellerInq.requestStatus === true && (this.tellerInq.payload.cif !== '' || this.tellerInq.payload.cif !== null)) {
      //   this.isVerified = true;
      //   this.account_number = ' ';
      //   this.initTellerProfile(this.tellerInq);

      //   return this.toastr.success('Staff id is valid, can proceed to enroll', ' Success!');
      // } else if (this.tellerInq.requestStatus === true && this.tellerInq.payload.cif === '') {
      //   // valid staff returned but they do not have a cif number attached
      //   return this.toastr.warning('cif number is invalid', ' Warning!');
      // } else {

      //   return this.toastr.warning('Specified staff id was not found or invalid , kindly verify to proceed .', 'Warning!');
      // }
    }, error => {

      return this.toastr.error('Error in inquiring staff data.', 'Error!', { timeOut: 4000 });
    });
  }

  upgradeCustomerProfile() {

    this.tellerSvc.upgradeTellerProfile(this.tellerForm.value).subscribe(data => {
      this.tellerdata = data;
      if (this.tellerdata.status) {
        this.isVerified = false;
        this.tellerProfile = {};
        this.tellerdata = {};
        this.tellerForm.reset();
        this.tellerInq = {};
        return this.toastr.success('Staff details updated successfully.', 'Success!', { timeOut: 4000 });
      } else {
        return this.toastr.warning('Failed to update staff details.', 'Warning!', { timeOut: 4000 });
      }
    }, error => {
      return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
    });
  }
  getConfigs() {
    this.bioconfigs = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return this.bioconfigs;
  }

  initTellerProfile(event) {

    this.tellerForm = this.fb.group({
      id: new FormControl(0),
      tellerId: new FormControl(this.tellerInq.payload.id, []),
      tellerStatus: new FormControl(this.tellerInq.payload.loginStatus, []),
      deptCode: new FormControl(this.tellerInq.payload.deptCode),
      recordStatus: new FormControl(this.tellerInq.payload.recordStatus, []),
      tellerEmail: new FormControl(this.tellerInq.payload.contactEmail, []),
      tellerName: new FormControl(this.tellerInq.payload.userName, []),
      tellerSignOnName: new FormControl(this.tellerInq.payload.signOnName, [Validators.required]),
      departmentCode: new FormControl(this.tellerInq.payload.departmentCode, [Validators.required]),
      companyCode: new FormControl(this.tellerInq.payload.companyCode),
      customerId: new FormControl(this.tellerInq.payload.cif, [Validators.required]),
      verified: 'N',
      customerType: 'TEllER',
      // waived: 'N',
      // waivedBy: 0,
      // waivedApprovedBy: 0,
      enrollStatus: 'N',
      verifiedBy: 0,
      createdBy: new FormControl(this.rightId)
    });
    this.editMode = true;
    this.isVerified = true;
    this.isNew = true;
  }

  initProfile($event) {
    this.gtActivebranches();
    this.form = this.fb.group({
      id: new FormControl($event.id),
      customerName: new FormControl($event.customerName),
      active: new FormControl(false),
      createdBy: new FormControl(this.rightId),
      gender: new FormControl($event.gender),
      customerIdNumber: new FormControl($event.customerIdNumber),
      phoneNumber: new FormControl($event.phoneNumber),
      country: new FormControl($event.country),
      nationality: new FormControl($event.nationality),
      mnemonic: new FormControl($event.mnemonic, [Validators.required]),
      customerId: new FormControl($event.id, [Validators.required]),
      branchCode: new FormControl($event.accountOfficer, [Validators.required]),
      verified: 'N',
      customerType: 'CUST',
      waived: 'N',
      enrollStatus: 'N',
      waivedBy: 0,
      waivedApprovedBy: 0,
      verifiedBy: 0,
      fingerprints: new FormControl($event.fingerPrints.length)
    });

    this.editMode = true;
    this.isVerified = true;
    this.isNew = true;
  }
  gtActivebranches() {
    this.regionService.getActiveBranches().subscribe(data => {
      this.response = data;
      this.activeBranches = this.response.collection;
    }, error => {
      return this.toastr.error('Error in loading branch data.', 'Error!', { timeOut: 4000 });
    });
  }

  customerInfInquiry(customer) {
    const custom = {
      'mnemonic': customer
    };
    this.custSvc.getCustomerToVerify(custom).subscribe(data => {

      this.customer = data;
      if (this.customer.status === true) {
        this.isVerify = true;
        this.isProfile = false;
        this.initProfile(this.customer.customer);
        return this.toastr.success('Verify customer', ' Success!', { timeOut: 3000 });
      } else {
        return this.toastr.warning('No customer with specified number found to verify', ' Warning!', { timeOut: 3000 });
      }
    }, error => {
      return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
    });
  }

  verifyCustomerDetails() {
    const prof: any = {};
    if (this.profType === '2') {
      const { customerId, id } = this.tellerProfile.teller;
      prof.customerId = customerId;
      prof.profileType = 'TELLER';
      prof.profileId = id;
    } else {
      const { customerId, id } = this.customer.customer;
      prof.customerId = customerId;
      prof.profileType = 'CUSTOMER';
      prof.profileId = id;
    }
    console.log(prof);
    this.custSvc.updateProfileDetails(prof).subscribe(data => {
      this.response = data;
      if (this.response.status) {
        this.profType = '';
        this.customer = {};
        this.isVerified = false;
        this.isProfile = null;
        this.account_number = '';
        this.tellerProfile = {};
        this.log(this.rightId, 'verified enroll status of customer/staff id' + prof.customerId);
        return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 4000 });
      } else {
        this.log(this.rightId, 'failed to enroll customer');
        return this.toastr.warning(this.response.respMessage, 'Warning!', { timeOut: 4000 });
      }
    }, error => {
      return this.toastr.error('Error in updating Customer data.', 'Error!', { timeOut: 4000 });
    });
  }

  getTellerToUpgrade(teller) {
    const tell = {
      'userName': this.getConfigs().authUsr,
      'passWord': this.getConfigs().authPs,
      'object': {
        'id': teller,
      }
    };
    const tellr = {
      'tellerId': teller
    };
    this.tellerSvc.checkTellerExists(tellr).subscribe(data => {
      this.locl = data;
      if (this.locl.status === true) {
        return this.toastr.warning('Customer with specified account id number is already enrolled', ' Warning!', { timeOut: 3000 });
      } else {
        this.tellerCoBankingInq(tell);
      }
    }, error => {
      return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
    });
  }

  storeTeller(teller) {
    this.tellerSvc.addTeller(teller).subscribe((response) => {
      this.response = response;
      if (this.response.status === true) {
        if (teller.id === 0) {
          this.log(this.rightId, 'added Staff ' + this.customer.customerName);
        } else {
          this.log(this.rightId, 'updated teller details  ' + this.customer.id);
        }
        return this.toastr.success('Staff details saved successfuly. Awaiting authorization', ' Success!');
      } else {
        this.log(this.rightId, this.response.respMessage);
        return this.toastr.warning(this.response.respMessage, 'Warning!');
      }
    }, error => {
      this.log(this.rightId, 'error updating country details');
      return this.toastr.error('Error in updating Customer data.', 'Error!', { timeOut: 4000 });
    });
  }

  rejectCustomerDetails(cust) {
    const prof: any = {};
    if (this.profType === '2') {
      const { customerId, id } = this.tellerProfile.teller;
      prof.customerId = customerId;
      prof.profileType = 'TELLER';
      prof.profileId = id;
    } else {
      const { customerId, id } = this.customer.customer;
      prof.customerId = customerId;
      prof.profileType = 'CUSTOMER';
      prof.profileId = id;
    }
    console.log(prof);
    this.custSvc.removeProfileDetails(prof).subscribe(data => {
      this.response = data;
      if (this.response.status) {
        this.profType = '';
        this.customer = {};
        this.isVerified = false;
        this.isProfile = null;
        this.account_number = '';
        this.tellerProfile = {};
        this.log(this.rightId, 'removed enroll status of customer/Staff id' + prof.customerId);
        return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 4000 });
      } else {
        this.log(this.rightId, 'failed to remove customer' + prof.customerId);
        this.toastr.warning(this.response.respMessage, 'Warning!', { timeOut: 4000 });
      }
    }, error => {
      return this.toastr.error('Error in updating Customer data.', 'Error!', { timeOut: 4000 });
    });
  }

  enrollCustomer() {
    const prof: any = {};
    if (this.profType === '2') {
      const { customerId, fingerPrints, createdBy } = this.tellerProfile.teller;
      prof.customerId = customerId;
      prof.fingerPrints = fingerPrints;
      prof.createdBy = createdBy;
    } else {
      const { customerId, fingerPrints, createdBy } = this.customer.customer;
      prof.customerId = customerId;
      prof.fingerPrints = fingerPrints;
      prof.createdBy = createdBy;
    }
    if (prof.createdBy === this.rightId) {
      return this.toastr.warning('User cannot verify profile they enrolled.', 'Warning!', { timeOut: 4000 });
    }
    this.apiService.afisEnroll(prof).subscribe((response) => {
      this.response = response;
      if (this.response.status) {
        this.verifyCustomerDetails();
      } else {
        this.log(this.rightId, 'failed to enroll customer' + prof.customerId);
        this.toastr.warning(this.response.message + ' customer id ' + this.response.customerId + '', 'Warning!', { timeOut: 4000 });
      }
    }, error => {
      this.log(this.rightId, 'failed to verify profile ' + this.customer.customerId);
      return this.toastr.error('Error updating data.', 'Error!', { timeOut: 4000 });
    });
  }

  cancel() {
    this.userProfile = {};
    this.account_number = '';
    this.editMode = false;
    this.profType = '';
    this.customer = {};
    this.isVerify = false;
    this.isVerified = false;
    this.account_number = '';
    this.fingerprints = [];
    this.router.navigate(['./']);

  }



}
export let settings = {
  mode: 'external',
  actions: {
    delete: false,
    position: 'right',
    add: false,
    edit: false
  },
  columns: {
    id: {
      title: '##',
      filter: false
    },
    customerName: {
      title: 'Full Name',
      filter: false
    },
    customerIdNumber: {
      title: 'Customer IdNumber',
      filter: false
    },
    phoneNumber: {
      title: 'Phone Number',
      filter: false
    },
    gender: {
      title: 'Gender',
      filter: false
    },
    country: {
      title: 'Nationality',
      filter: false
    }
  },
  edit: {
    // tslint:disable-next-line:max-line-length
    editButtonContent: '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>',
    saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
    cancelButtonContent: '<i class="ti-close text-danger"></i>'
  },
  add: {
    // tslint:disable-next-line:max-line-length
    addButtonContent: '<a class="btn btn-block btn-outline-info m-r-10" ngbPopover="Add Customer" triggers="mouseenter:mouseleave" popoverTitle="Add Customer"> <i class="fas fa-plus-circle"></i></a>',
    createButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
  pager: {
    perPage: 200
  },
  rowClassFunction: function (row) {
    if (row.editable) { return 'editable'; }
    return '';

  }

};

