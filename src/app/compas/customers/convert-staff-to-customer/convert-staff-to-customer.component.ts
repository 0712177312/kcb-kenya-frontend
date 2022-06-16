import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BioService } from '../../services/bio.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LogsService } from '../../services/logs.service';
import { TellerService } from '../../services/teller.service';
import { MySharedService } from '../../services/sharedService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-convert-staff-to-customer',
  templateUrl: './convert-staff-to-customer.component.html',
  styleUrls: ['./convert-staff-to-customer.component.css']
})
export class ConvertStaffToCustomerComponent implements OnInit {

  isVerified = false;
  tellerInq: any;
  tellerResponse: any;
  convertStaffToCustomerResponse: any;
  tellerForm: FormGroup;
  response: any = null;
  otc: any = {};
  rightId: any;
  staffId: any;

  constructor(private tellerSvc: TellerService, private apiService: BioService,
    private fb: FormBuilder, private custSvc: CustomerService,
    private toastr: ToastrService, private logs: LogsService, private globalService: MySharedService,
    private router: Router) { }

  ngOnInit() {
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
  }

  getStaff(teller) {
    let idPattern = new RegExp(/^KE[0-9]{1,15}$/);
    let result = idPattern.test(teller);

    if (result) {
      this.getTeller(teller);
    } else {
      console.log('not a valid id');
      return this.toastr.warning("Staff Id Should be in format KE1234")
    }

  }

  validateStaffId(event: any) {
    let regExpr = new RegExp(/^[A-Z|a-z|0-9]+$/);
    let result = regExpr.test(event.key);
    return result;
  }

  getTeller(teller) {
    if (teller === '') {
      return this.toastr.warning('Kindly provide a valid staff id to continue', ' Warning!', { timeOut: 4000 });
    }

    // check if the staff id entered is valid
    const tellerDetails = {
      'tellerId': teller
    };
    this.tellerSvc.checkStaffApproved(tellerDetails).subscribe(data => {
      this.tellerResponse = data;
      if (this.tellerResponse.status === true) {
        this.initTellerProfile();
        return this.toastr.success('Staff with the specified id was found', 'Success!');
      } else {
        return this.toastr.warning('Staff with the specific id was not found or not approved', ' Warning!');
      }
    }, error => {
      return this.toastr.error('Error while searching for the staff details', 'Error!', { timeOut: 4000 });
    });


  }

  initTellerProfile() {
    this.tellerForm = this.fb.group({
      customerId: new FormControl(this.tellerResponse.teller.customerId, []),
      tellerEmail: new FormControl(this.tellerResponse.teller.tellerEmail, []),
      tellerName: new FormControl(this.tellerResponse.teller.tellerName, []),
      departmentCode: new FormControl(this.tellerResponse.teller.departmentCode, [])
    });
    this.isVerified = true;
  }

  upgradeStaffToCustomer() {
    const customerDetails = {
      "createdBy": this.tellerResponse.teller.createdBy,
      "createdOn": this.tellerResponse.teller.createdOn,
      "customerId": this.tellerResponse.teller.customerId,
      "deletedBy": this.tellerResponse.teller.deletedBy,
      "deletedOn": this.tellerResponse.teller.deletedOn,
      "rejectedBy": this.tellerResponse.teller.rejectedBy,
      "rejectedOn": this.tellerResponse.teller.rejectedOn,
      //the customer id number of the customer will be the teller id of the person who was staff
      "customerIdNumber": this.tellerResponse.teller.tellerId,
      "customerName": this.tellerResponse.teller.tellerName,
      "customerType": "CUST",
      "verified": this.tellerResponse.teller.verified,
      "verifiedBy": this.tellerResponse.teller.verifiedBy,
      "verifiedOn": this.tellerResponse.teller.approvedOn,
      //the mnemonic number of the customer will be the teller id of the person who was staff
      "mnemonic": this.tellerResponse.teller.tellerId,
      "waived": "N",
      "branchCode": this.tellerResponse.teller.deptCode
    };
    this.custSvc.convertStaffToCustomer(customerDetails).subscribe((response) => {
      this.convertStaffToCustomerResponse = response;
      if (this.convertStaffToCustomerResponse.status === true) {
        this.isVerified = false;
        this.log(this.rightId, "converted the staff with tellerid: " + this.tellerResponse.teller.tellerId + " to customer");
        return this.toastr.success('Conversion of staff to customer performed successfully', 'Success!', { timeOut: 3000 });
      } else {
        this.log(this.rightId, "attempted to convert the staff with tellerid: " + this.tellerResponse.teller.tellerId + " to customer");
        return this.toastr.error('Conversion of staff to customer not performed successfully', 'Error!', { timeOut: 4000 });
      }
    }, error => {
      return this.toastr.error('Error while attempting to convert staff to customer', 'Error!', { timeOut: 4000 });
    })
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

  cancel() {
    this.isVerified = false;
    this.router.navigate(['./']);
  }


}
