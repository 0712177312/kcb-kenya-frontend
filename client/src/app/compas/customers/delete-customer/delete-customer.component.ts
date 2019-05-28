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

@Component({
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.css']
})
export class DeleteCustomerComponent implements OnInit {

  searchText;
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


  constructor(private tellerSvc: TellerService, private apiService: BioService,
    private fb: FormBuilder, private custSvc: CustomerService,
    private toastr: ToastrService, private logs: LogsService,  private globalService: MySharedService) { }

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
    this.form = this.fb.group({
      customerId: new FormControl(this.locl.customer.customerId, []),
      customerName: new FormControl(this.locl.customer.customerName, []),
      gender: new FormControl(this.locl.customer.gender, []),
      customerIdNumber: new FormControl(this.locl.customer.customerIdNumber, []),
      phoneNumber: new FormControl(this.locl.customer.phoneNumber, []),
      branchCode: new FormControl(this.locl.customer.branchCode, [])
    });

    this.isVerified = true;
    this.profForm = true;
    console.log("rightid" + this.rightId);
    console.log("username" + this.globalService.username);
  }

  initTellerProfile() {
    this.tellerForm = this.fb.group({
      testInput: new FormControl("test1", []),
      // id: new FormControl(0),
      tellerId: new FormControl(this.locl.teller.id, []),
      // tellerStatus: new FormControl(this.locl.payload.loginStatus, []),
      // deptCode: new FormControl(this.locl.payload.deptCode),
      // recordStatus: new FormControl(this.locl.payload.recordStatus, []),
      tellerEmail: new FormControl(this.locl.teller.tellerEmail, []),
      tellerName: new FormControl(this.locl.teller.tellerName, []),
      // tellerSignOnName: new FormControl(this.locl.payload.signOnName, [Validators.required]),
      departmentCode: new FormControl(this.locl.teller.departmentCode, []),
      // companyCode: new FormControl(this.locl.payload.companyCode),
      customerId: new FormControl(this.locl.teller.customerId, []),
      // verified: 'N',
      // customerType: 'TEllER',
      // waived: 'N',
      // waivedBy: 0,
      // waivedApprovedBy: 0,
      // enrollStatus: 'N',
      // verifiedBy: 0
    });

    this.isVerified = true;
    this.profForm = false;
    console.log(this.tellerForm.get('tellerName').value);
    console.log(this.tellerForm.get('tellerId').value);
  }

  deleteCustomerDetails() {
    const customerDetails = {
      'customerId': this.form.get('customerId').value, 
      'deletedBy' : this.rightId
    };
    this.custSvc.removeCustomer(customerDetails).subscribe((response) => {
      this.response = response;
      if (this.response.status === true) {
        this.apiService.afisRemove(customerDetails).subscribe((response) => {
          this.response = response;
          if (this.response.status === true) {
            this.isVerified = false;
            return this.toastr.success('Customer removed successfully', ' Success!');
          } else {
            return this.toastr.error('Customer not removed successfully', ' Error!', { timeOut: 4000 });
          }

        }, error => {
          return this.toastr.error('Error while attempting to remove the customer details', 'Error!', { timeOut: 4000 });
        });
      } else {
        return this.toastr.warning("Failed to remove the customer", 'Warning!');
      }
    }, error => {
      return this.toastr.error('Error while attempting to remove the customer.', 'Error!', { timeOut: 4000 });
    });
  }

  deleteTellerDetails() {//////////////
    // const teller = this.tellerForm.value;
    const tellerDetails = {
      'customerId': this.tellerForm.get('customerId').value,
      'deletedBy' : this.rightId
    };
    this.tellerSvc.removeTeller(tellerDetails).subscribe((response) => {
      this.response = response;
      if (this.response.status === true) {
        this.apiService.afisRemove(tellerDetails).subscribe((response) => {
          this.response = response;
          if (this.response.status === true) {
            this.isVerified = false;
            return this.toastr.success('Teller removed successfully', ' Success!');
          } else {
            return this.toastr.error('Teller not removed successfully', ' Error!', { timeOut: 4000 });
          }
        }, error => {
          return this.toastr.error('Error while attempting to remove the teller details', 'Error!', { timeOut: 4000 });
        });
      } else {
        return this.toastr.warning("Failed to remove the teller", 'Warning!');
      }
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
        return this.toastr.warning('Teller id is was not found', ' Warning!');
      }
    }, error => {
      return this.toastr.error('Error while searching for the teller to delete', 'Error!', { timeOut: 4000 });
    });
  }

  cancel(){
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
}
