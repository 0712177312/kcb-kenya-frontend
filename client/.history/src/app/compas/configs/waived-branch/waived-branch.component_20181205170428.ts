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
    constructor(private blockUIService: BlockUIService,
      private apiService: AdministrationService, private toastr: ToastrService,
       private globalService: MySharedService,
      private regionService: RegionService) {}
    branches: any = [];
    settings = settings;
    branch: any = {};
    title: string;
    country: any = {};
    rightId: any;
    branchDetails: any = {};
    isNew = false;
    selectedPersonId: any ;
    editMode = false;
    activeCountries: any = [];
    staticAlertClosed: any = false;
    submited = false;
    otc: any;
    response: any = {};
    button: any;
    is_edit = false;
    source: LocalDataSource;
    ngOnInit() {
      this.gtbranches();
      this.otc = JSON.parse(localStorage.getItem('otc'));
      this.rightId = this.otc.rightId;
      console.log('right id', this.rightId);
      setTimeout(() => (this.staticAlertClosed = true), 8000);
    }

    onSubmit() {
      this.submited = true;
      console.log('works..');
    }

    gtbranches() {
      this.blockUI.start('Loading data...');
      this.regionService.getBranchesToWaive().subscribe(data => {
        this.branches = data;
        console.log('custs', this.branches);
        this.branches = this.branches.collection;
        console.log('branches##', this.branches);
        this.source = new LocalDataSource(this.branches);
        this.blockUI.stop();
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
      });
    }
    gtActiveCountries() {
      this.regionService.getActiveCountries().subscribe(data => {
        this.response = data;
        this.activeCountries = this.response.collection;
        console.log('countries##', this.activeCountries);
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in loading active country data.', 'Error!', { timeOut: 1500 });
      });
    }

  waiveBranch() {
    const bra = {
      'id': this.branch.id,
      'waivedBy': this.rightId

    };
          this.regionService.waiveBranch(bra).subscribe(res => {
              this.blockUI.stop();
              this.response = res;
              if (this.response.status === false) {
                  this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 4000 });
              }
              if (this.response.status === true) {
                  this.editMode = false;
                  this.gtbranches();
                  this.branchDetails = {};
                  this.submited = false;
                  return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 4000 });
              }
          }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error updating data.', 'Error!', { timeOut: 1500 });
          });
    }
    cancel() {
      this.editMode = false;
      this.submited = false;
      this.gtbranches();
    }
    initEditBranch($event) {
      this.gtActiveCountries();
      this.branch.id = $event.data.id;
      this.branch.branchCode = $event.data.branchCode;
      this.branch.branchName = $event.data.branchName;
      this.branch.status = $event.data.status;
      this.branch.createdBy = $event.data.createdBy;
      this.branch.countryCode = $event.data.countryCode;
      this.branch.waived = 'N',
      this.branch.waivedBy = 0,
      this.branch.waivedApprovedBy = 0,
      this.editMode  = true;
      this.title  = 'Add Channel';
      this.button  = 'Add Channel';
      this.is_edit  = true;
      this.isNew  = true;
    }
  }

  export let settings = {
    mode: 'external',
    actions: {
        delete: false,
        add: false,
        position: 'right',
    },
   // selectMode: 'multi',
    columns: {
      id: {
        title: '#',
        filter: true
      },
      branchCode: {
            title: 'Branch Code',
            filter: true
        },
      branchName: {
            title: 'Branch Name',
            filter: true
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
