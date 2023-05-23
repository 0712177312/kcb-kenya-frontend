import { LogsService } from './../../services/logs.service';
import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { BlockUI, NgBlockUI, BlockUIService } from 'ng-block-ui';
import { CustomerService } from '../../services/customer.service';
import { AdministrationService } from '../../services/administration.service';
import { ToastrService } from 'ngx-toastr';
import { BioService } from '../../services/bio.service';
import { ConfigsService } from '../../services/configs.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MySharedService } from '../../services/sharedService';
import { DOCUMENT } from '@angular/platform-browser';
import { RegionService } from '../../services/region.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
    constructor(private blockUIService: BlockUIService, private custSvc: CustomerService,
      private renderer: Renderer2, private apiService: AdministrationService, private toastr: ToastrService,
      private bioService: BioService, private conSvc: ConfigsService, private fb: FormBuilder, private globalService: MySharedService,
      @Inject(DOCUMENT) private document: any, private regionService: RegionService, private logs: LogsService) {}
    branches: any = [];
    
    form: FormGroup;
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

    // manage rights buttons
    canViewUserProfile;
    canAddUserProfile;
    canEditUserProfile;

    settings;

    ngOnInit() {
      this.gtbranches();
      this.otc = JSON.parse(localStorage.getItem('otc'));
      this.rightId = this.otc.rightId;
      console.log('right id', this.rightId);
      setTimeout(() => (this.staticAlertClosed = true), 8000);
      this.getUserAssignedRights();
      this.settings = {
          mode: 'external',
          actions: {
              delete: false,
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
              editButtonContent: (this.canEditUserProfile === true) ? '<a class="btn btn-block btn-outline-success m-r-10"> <i class="fas fa-check-circle text-info-custom"></i></a>' : '',
              saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
              cancelButtonContent: '<i class="ti-close text-danger"></i>'
          },
          add: {
              // tslint:disable-next-line:max-line-length
              addButtonContent: (this.canAddUserProfile === true) ? '<a class="btn btn-block btn-outline-info m-r-10"> <i class="fas fa-plus-circle"></i></a>' : '',
              createButtonContent: '<i class="nb-checkmark"></i>',
              cancelButtonContent: '<i class="nb-close"></i>',
          },
          attr: {
              class: 'table-bordered table-striped'
          },
      };

    }
    getUserAssignedRights() {
        const userAssignedRights = this.otc.userAssignedRights;
        console.log('userAssignedRights: ', userAssignedRights);
        let rightsIndex = -1;
        for (let i = 0; i < userAssignedRights[0].rights.length; i++) {
            console.log('userAssignedRights path: ' + userAssignedRights[0].rights[i].path);
            if (userAssignedRights[0].rights[i].path === '/regions/branches') {
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

    onSubmit() {
      this.submited = true;
      console.log('works..');
    }

    get f() { return this.form.controls; }

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

    gtbranches() {
      this.blockUI.start('Loading data...');
      this.regionService.getBranches().subscribe(data => {
        this.branches = JSON.parse(data);
        console.log('custs', this.branches);
        this.branches = this.branches.hashset;
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
        this.response = JSON.parse(data);
        this.activeCountries = this.response.hashset;
        console.log('countries##', this.activeCountries);
      }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in loading active country data.', 'Error!', { timeOut: 1500 });
      });
    }

    findInvalidControls() {
      const invalid = [];
      const controls = this.form.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              invalid.push(name);
              // return this.toastr.warning('Please enter valid ' + name, 'Alert!', { timeOut: 1500 });
              console.log('invalid', invalid);
          }
      }
      return invalid;
  }

  addBranch() {
      this.branchDetails = this.form.value;
      console.log('works..', this.branchDetails);
      this.submited = true;
      this.findInvalidControls();

      if (this.form.invalid) {
          return this.toastr.warning('Kindly ensure all fields are correctly entered', 'Alert!', { timeOut: 1500 });
      } else {
          this.branchDetails = this.form.value;
          console.log('Branch ', this.branchDetails);
          console.log('Branch details', this.branchDetails);
          this.regionService.upBranch(this.branchDetails).subscribe(res => {
              this.blockUI.stop();
              this.response = JSON.parse(res);
              if (this.response.status === false) {
                  this.log(this.rightId, this.response.respMessage );
                  this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
              }
              if (this.response.status === true) {
                  if ( this.branchDetails.id === 0 ) {
                     this.log(this.rightId, 'added branch   ' + this.branchDetails.branchName);
                   } else {
                     this.log(this.rightId, 'updated branch with id  ' + this.branchDetails.id);
                  }
                  this.editMode = false;
                  this.gtbranches();
                  this.branchDetails = {};
                  this.submited = false;
                  return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 1500 });
              }
          }, error => {
            this.log(this.rightId, 'problem server access');
            this.blockUI.stop();
            return this.toastr.error('Error updating data.', 'Error!', { timeOut: 1500 });
          });
      }
    }
   cancel() {
      this.editMode = false;
      this.submited = false;
      this.gtbranches();
    }

    initAddBranch() {
      this.gtActiveCountries();
      this.form = this.fb.group({
          id: new FormControl(0),
          branchCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
          branchName: new FormControl('', [Validators.required, Validators.minLength(3)]),
          status: new FormControl(false),
          createdBy: new FormControl(this.rightId),
          countryCode: new FormControl('', [Validators.required]),
          waived: 'N',
          waivedBy: 0,
          waivedApprovedBy: 0,
      });
      this.editMode = true;
      this.title = 'Add Channel';
      this.button = 'Add Channel';
      this.is_edit = false;
      this.isNew = true;
    }

    initEditBranch($event) {
      this.gtActiveCountries();
        this.form = this.fb.group({
            branchCode: new FormControl($event.data.branchCode, [ Validators.required,
                    Validators.minLength(2), Validators.pattern('[0-9]*')]),
           branchName: new FormControl($event.data.branchName, [ Validators.required, Validators.minLength(3),
                    Validators.minLength(2)]),
            status: new FormControl($event.data.status),
            createdBy: new FormControl($event.data.createdBy, Validators.required),
            id: new FormControl($event.data.id, Validators.required),
            countryCode: new FormControl($event.data.countryCode, Validators.required)
        });
        this.editMode = true;
        this.title = 'Add Country';
        this.button = 'Add Country';
        this.is_edit = true;
        this.isNew = true;
    }
  }

  // export let settings = {
  //   mode: 'external',
  //   actions: {
  //       delete: false,
  //       position: 'right',
  //   },
  //  // selectMode: 'multi',
  //   columns: {
  //     id: {
  //       title: '#',
  //       filter: true
  //     },
  //     branchCode: {
  //           title: 'Branch Code',
  //           filter: true
  //       },
  //     branchName: {
  //           title: 'Branch Name',
  //           filter: true
  //       }
  //   },
  //   edit: {
  //       // tslint:disable-next-line:max-line-length
  //       editButtonContent: '<a class="btn btn-block btn-outline-success m-r-10"> <i class="fas fa-check-circle text-info-custom"></i></a>',
  //       saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
  //       cancelButtonContent: '<i class="ti-close text-danger"></i>'
  //   },
  //   add: {
  //       // tslint:disable-next-line:max-line-length
  //       addButtonContent: '<a class="btn btn-block btn-outline-info m-r-10"> <i class="fas fa-plus-circle"></i></a>',
  //       createButtonContent: '<i class="nb-checkmark"></i>',
  //       cancelButtonContent: '<i class="nb-close"></i>',
  //   },
  //   attr: {
  //     class: 'table-bordered table-striped'
  //   },
  // };
