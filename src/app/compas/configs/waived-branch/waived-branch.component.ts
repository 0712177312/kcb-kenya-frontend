import { LogsService } from './../../services/logs.service';
import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { BlockUI, NgBlockUI, BlockUIService } from 'ng-block-ui';
import { AdministrationService } from '../../services/administration.service';
import { ToastrService } from 'ngx-toastr';
import { MySharedService } from '../../services/sharedService';
import { RegionService } from '../../services/region.service';
import { LocalDataSource } from 'ng2-smart-table';

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
      private regionService: RegionService, private logs: LogsService) {}
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
    onSubmit() {
      this.submited = true;
      console.log('works..');
    }

    gtbranches() {
      this.blockUI.start('Loading data...');
      this.regionService.getWaivedBranches().subscribe(data => {
        this.branches = data;
        console.log('custs', this.branches);
        this.branches = this.branches.collection;
        console.log('branches##', this.branches);
        this.source = new LocalDataSource(this.branches);
        this.blockUI.stop();
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 4000 });
      });
    }
    gtActiveCountries() {
      this.regionService.getActiveCountries().subscribe(data => {
        this.response = data;
        this.activeCountries = this.response.hashset;
        console.log('countries##', this.activeCountries);
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in loading active country data.', 'Error!', { timeOut: 4000 });
      });
    }

  approveBranchWave() {
    if (this.rightId === this.branch.createdBy) {
      this.log(this.rightId, 'to approve branch waive they added ' + this.branch.id);
      return this.toastr.warning('User cannot reject branch waive they added.', 'Warning!', { timeOut: 4000 });
    }
    const bra = {
      'id': this.branch.id,
      'waivedApprovedBy': this.rightId

    };
          this.regionService.approveWaivedBranches(bra).subscribe(res => {
              this.blockUI.stop();
              this.response = res;
              if (this.response.status === false) {
                  this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 4000 });
              }
              if (this.response.status === true) {
                this.log(this.rightId, 'approved branch waive ' + this.branch.id);
                  this.editMode = false;
                  this.gtbranches();
                  this.branchDetails = {};
                  this.submited = false;
                  return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 4000 });
              }
          }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error updating data.', 'Error!', { timeOut: 4000 });
          });
    }
    rejectBranch() {
      if (this.rightId === this.branch.createdBy) {
         this.log(this.rightId, 'to reject branch waive they added ' + this.branch.id);
         return this.toastr.warning('User cannot reject branch waive they added.', 'Warning!', { timeOut: 4000 });
      }
      const bra = {
        'id': this.branch.id,
        'waivedApprovedBy': this.rightId
      };
            this.regionService.rejectBranchWaive(bra).subscribe(res => {
                this.blockUI.stop();
                this.response = res;
                if (this.response.status === false) {
                  this.log(this.rightId, 'failed to reject branch waive ' + this.branch.id);
                    this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 4000 });
                }
                if (this.response.status === true) {
                  this.log(this.rightId, 'rejected branch waive ' + this.branch.id);
                    this.editMode = false;
                    this.gtbranches();
                    this.branchDetails = {};
                    this.submited = false;
                    return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 4000 });
                }
            }, error => {
              this.blockUI.stop();
              return this.toastr.error('Error updating data.', 'Error!', { timeOut: 4000 });
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
      this.branch.action = $event.data.waived;
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
