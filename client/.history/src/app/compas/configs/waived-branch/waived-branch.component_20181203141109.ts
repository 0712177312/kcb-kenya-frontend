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
import { RegionService } from '../../services/region.service';

@Component({
  selector: 'app-waived-branch',
  templateUrl: './waived-branch.component.html',
  styleUrls: ['./waived-branch.component.css']
})
export class WaivedBranchComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  fileText: any;
  enroleMode = true;
  inquireMode = false;
  locl: any;
  account_number: any;

  searchText;
  closeResult: string;
  String: any = {};
  countries: any = [];
  matchResp: any;
  branch: any = {};
  customerNo: any;
  leftMissing: any = [];
  rightMissing: any = [];
  thumbsMissing: any = [];
  missing: any = [];
  missingStatus = false;
  resp: any;
  element: HTMLImageElement;
  $event: NgbTabChangeEvent;
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
      private modalService2: NgbModal,
      private regionService: RegionService, @Inject(DOCUMENT) private document: any,
      private toastr: ToastrService, private biosvc: BioService) {
}
settings = settings;

ngOnInit() {
    this.getBranches();
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
}

initEditbranch($event) {
    console.log('branch', $event.data);
    this.gtCountries();
    this.editMode = true;
    this.isVerified = true;
    this.branch.id = $event.data.id;
    this.branch.active = $event.data.active;
    this.branch.branchCode = $event.data.branchCode;
    this.branch.branchName = $event.data.customerName;
    this.branch.countryCode = $event.data.countryCode;
    this.branch.createdBy = $event.data.createdBy;
    this.isNew = false;
    this.title = 'Edit Branch';
    this.button = 'Update Branch';
}

getBranches() {
  this.blockUI.start('Loading data...');
  this.regionService.getWaivedBranches().subscribe(data => {
    this.branches = data;
    console.log('branches', this.branches);
    this.branches = this.branches.collection;
    this.source = this.branches;
    console.log('branches##', this.branches);
    this.source = this.branches;
    this.blockUI.stop();
  }, error => {
    this.blockUI.stop();
    return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 1500 });
 });
}

approveBranchwaive() {
      const cust = {
        'branchCode': this.branch.branchCode,
        'waivedApprovedBy': this.rightId
      };
      this.blockUI.start('updating customer details data...');
      this.regionService.approveWaivedBranches(cust).subscribe(data => {
        this.blockUI.stop();
        this.response = data;
        if (this.response.status === true) {
          this.editMode = false;
          this.branch = {};
          this.getBranches();
          return this.toastr.success(this.response.respMessage, 'Success');
        } else {
          return this.toastr.warning(this.response.respMessage, 'Alert');
        }
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 1500 });
     });
  }


  gtCountries() {
    this.blockUI.start('Loading data...');
    this.regionService.getActiveCountries().subscribe(data => {
        this.countries = data;
        console.log('countries', this.countries);
        this.countries = this.countries.collection;
        console.log('countries##', this.countries);
        this.blockUI.stop();
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
    branchCode: {
      title: 'Branch Code',
      filter: true
    },
    branchName: {
      title: 'Branch Name',
      filter: true
},
  //   country: {
  //     title: 'Country',
  //     filter: true
  //   },
  //   phoneNumber: {
  //       title: 'Email Address',
  //       filter: true
  //   },
  //   customerIdNumber: {
  //       title: 'Customer ID Number',
  //       filter: true
  //   },
  //   enrolledOn: {
  //     title: 'Enrolled On',
  //     filter: true
  //  },
  //  createdBy: {
  //   title: 'Enrolled By',
  //   filter: true
  //  }

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
