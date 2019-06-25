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
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.css']
})
export class DeleteCustomerComponent implements OnInit {

  isVerified = false;
  profType = '';
  profForm = false;
  tellerInq: any;

  locl: any;

  tellerForm: FormGroup;
  form: FormGroup;
  response: any = null;

  otc: any = {};
  rightId: any;

  tellerRemoveFunctionToLoad: string;
  customerRemoveFunctionToLoad: string;


  constructor(private tellerSvc: TellerService, private apiService: BioService,
    private fb: FormBuilder, private custSvc: CustomerService,
    private toastr: ToastrService, private logs: LogsService, private globalService: MySharedService,
    private router: Router) { }

  ngOnInit() {
    this.profType = '1';
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
  }

  getCustomer(customer) {
    if (customer === '') {
      return this.toastr.warning('Kindly provide a valid customer/staff id to continue', ' Warning!', { timeOut: 4000 });
    }

    console.log(this.profType);
    if (this.profType === '1') {
      this.customerEnquire(customer);
    } else if (this.profType === '2') {
      this.tellerEnquire(customer);
    }
  }

  initCustomerProfile() {
    if (this.locl.customer.id != null) {
      console.log("locl.customer is not null");
      // customer obtained thus the details will be displayed
      this.customerRemoveFunctionToLoad = "deleteCustomer";
      this.form = this.fb.group({
        customerId: new FormControl(this.locl.customer.customerId, []),
        customerName: new FormControl(this.locl.customer.customerName, []),
        gender: new FormControl(this.locl.customer.gender, []),
        customerIdNumber: new FormControl(this.locl.customer.customerIdNumber, []),
        phoneNumber: new FormControl(this.locl.customer.phoneNumber, []),
        branchCode: new FormControl(this.locl.customer.branchCode, [])
      });
    } else {
      console.log("locl.customer is null");
      this.customerRemoveFunctionToLoad = "deleteCustomerNotOnDb";
      // customer not obtained thus only the customer id will be displayed
      this.form = this.fb.group({
        customerId: new FormControl("enter the customerid / cif"),
        customerName: new FormControl(""),
        gender: new FormControl(""),
        customerIdNumber: new FormControl(""),
        phoneNumber: new FormControl(""),
        branchCode: new FormControl("")
      });
    }

    this.isVerified = true;
    this.profForm = true;
    console.log("rightid" + this.rightId);
    console.log("username" + this.globalService.username);
  }

  initTellerProfile() {
    if (this.locl.teller.id != null) {
      this.tellerRemoveFunctionToLoad = "deleteTeller";
      //teller details obtained thus the details will be displayed
      this.tellerForm = this.fb.group({
        customerId: new FormControl(this.locl.teller.customerId, []),
        tellerEmail: new FormControl(this.locl.teller.tellerEmail, []),
        tellerName: new FormControl(this.locl.teller.tellerName, []),
        departmentCode: new FormControl(this.locl.teller.departmentCode, [])
      });
    } else {
      this.tellerRemoveFunctionToLoad = "deleteTellerNotOnDb";
      // teller details not obtained thus only the customer id will be displayed
      this.tellerForm = this.fb.group({
        customerId: new FormControl("enter the customerid / cif"),
        tellerEmail: new FormControl(""),
        tellerName: new FormControl(""),
        departmentCode: new FormControl("")
      });
    }

    this.isVerified = true;
    this.profForm = false;
  }

  deleteCustomerDetails() {
    console.log('in deleteCustomerDetails() of delete-customer-component.ts');
    const customerDetails = {
      'customerId': this.form.get('customerId').value,
      'deletedBy': this.rightId
    };
    this.custSvc.removeCustomer(customerDetails).subscribe((response) => {
      this.response = response;
      if(this.response.status === true){
        this.log(this.rightId, "selected to remove customer with customerId: " + customerDetails.customerId + " .Awaiting authorization");
        this.isVerified = false;
        this.router.navigate(['./']);
        return this.toastr.success('Customer queued for removal. Awaiting authorization', ' Success!');
      }else{
        this.log(this.rightId, "attempted to select to remove customer of customerId: " + customerDetails.customerId + "");
        return this.toastr.error('An error occurred. Customer not queued for removal', ' Error!', { timeOut: 4000 });
      }
    }, error => {
      return this.toastr.error('Error while attempting to queue the customer for removal.', 'Error!', { timeOut: 4000 });
    });
  }

  deleteCustomerDetailsNotOnDb(){
    console.log('in deleteCustomerDetailsNotOnDb() of delete-customer.component.ts');
    const customerDetails = {
      'customerId': this.form.get('customerId').value,
      'deletedBy': this.rightId
    };
    this.custSvc.removeCustomer(customerDetails).subscribe((response) => {
      this.response = response;
      if(this.response.status === true){
        this.log(this.rightId, "removed the customer details of customer with customerId: " + customerDetails.customerId + " from the database");
      }else{
        this.log(this.rightId, "attempted to remove the customer details of customer with customerId: " + customerDetails.customerId + " from the database");
      }
      this.apiService.afisRemove(customerDetails).subscribe((response) => {
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
        return this.toastr.error('Error while attempting to remove the customer details', 'Error!', { timeOut: 4000 });
      });
    }, error => {
      return this.toastr.error('Error while attempting to remove the customer.', 'Error!', { timeOut: 4000 });
    });
  }

  deleteTellerDetails() {
    console.log("in deleteTellerDetails()");
    const tellerDetails = {
      'customerId': this.tellerForm.get('customerId').value,
      'deletedBy': this.rightId
    };
    this.tellerSvc.removeTeller(tellerDetails).subscribe((response) => {
      this.response = response;
      if(this.response.status === true){
        this.log(this.rightId, "selected to remove teller with customerId: " + tellerDetails.customerId + " .Awaiting authorization");
        this.isVerified = false;
        this.router.navigate(['./']);
        return this.toastr.success('Teller queued for removal. Awaiting authorization', ' Success!');
      }else{
        this.log(this.rightId, "attempted to select to remove teller of customerId: " + tellerDetails.customerId + "");
        return this.toastr.error('An error occurred. Teller not queued for removal', ' Error!', { timeOut: 4000 });
      }
    }, error => {
      return this.toastr.error('Error while attempting to queue the teller for removal.', 'Error!', { timeOut: 4000 });
    });
  }

  deleteTellerDetailsNotOnDb(){
    console.log("in deleteTellerDetailsNotOnDb()");
    const tellerDetails = {
      'customerId': this.tellerForm.get('customerId').value,
      'deletedBy': this.rightId
    };
    this.tellerSvc.removeTeller(tellerDetails).subscribe((response) => {
      this.response = response;
      if(this.response.status === true){
        this.log(this.rightId, "removed the staff details of staff with customerId: " + tellerDetails.customerId + " from the database");
      }else{
        this.log(this.rightId, "attempted to remove the staff details of staff with customerId: " + tellerDetails.customerId + " from the database");
      }
      this.apiService.afisRemove(tellerDetails).subscribe((response) => {
        this.response = response;
        if (this.response.status === true) {
          this.log(this.rightId, "removed the staff details of staff with customerId: " + tellerDetails.customerId + " from abis");
          this.isVerified = false;
          this.router.navigate(['./']);
          return this.toastr.success('Teller removed successfully', ' Success!');
        } else {
          this.log(this.rightId, "attempted to remove staff details of staff with customerId: " + tellerDetails.customerId + " from abis");
          return this.toastr.error('Teller not removed successfully', ' Error!', { timeOut: 4000 });
        }
      }, error => {
        return this.toastr.error('Error while attempting to remove the teller details', 'Error!', { timeOut: 4000 });
      });
    }, error => {
      return this.toastr.error('Error while attempting to remove the teller.', 'Error!', { timeOut: 4000 });
    });
  }

  customerEnquire(customer) {
    const custom = {
      'mnemonic': customer
    };
    this.custSvc.obtainCustomerDetails(custom).subscribe(data => {
      this.locl = data;
      if (this.locl.status === true) {
        this.initCustomerProfile();
        return this.toastr.success('Customer id is valid', ' Success!');
      } else {
        if (!customer.startsWith('ID')) {
          //continue to the delete page only if id does not start with 'ID'
          this.locl.customer = {};
          this.locl.customer.customerId = customer;
          this.initCustomerProfile();
        }
        return this.toastr.warning('Customer id is was not found', ' Warning!');
      }
    }, error => {
      return this.toastr.error('Error while searching for the customer to delete', 'Error!', { timeOut: 4000 });
    });
  }

  tellerEnquire(teller) {
    const tellr = {
      'tellerId': teller
    };
    this.tellerSvc.obtainTellerDetails(tellr).subscribe(data => {
      this.locl = data;
      if (this.locl.status === true) {
        this.initTellerProfile();
        return this.toastr.success('Teller id is valid', ' Success!');
      } else {
        //continue to the delete page only if id does not start with 'KE'
        if (!teller.startsWith('KE')) {
          this.locl = null;
          this.locl = {};
          this.locl.teller = {};
          console.log(this.locl);
          this.locl.teller.customerId = teller;
          this.initTellerProfile();
        }
        return this.toastr.warning('Teller id is was not found', ' Warning!');
      }
    }, error => {
      return this.toastr.error('Error while searching for the teller to delete', 'Error!', { timeOut: 4000 });
    });
  }

  cancel() {
    this.isVerified = false;
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

  cancelEnquiry() {
    this.router.navigate(['./']);
  }
}
