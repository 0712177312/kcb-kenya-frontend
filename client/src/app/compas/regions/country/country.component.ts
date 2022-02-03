import { RegionService } from './../../services/region.service';
import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { Applicant } from '../../models/applicant';
import { DomSanitizer, SafeResourceUrl, SafeUrl, Title } from '@angular/platform-browser';
import { IfStmt } from '@angular/compiler';
import { BlockUI, NgBlockUI, BlockUIService } from 'ng-block-ui';
import { filter } from 'rxjs/operators';
import { AdministrationService } from '../../services/administration.service';
import { MySharedService } from '../../services/sharedService';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private blockUIService: BlockUIService, private custSvc: CustomerService,
    private renderer: Renderer2, private apiService: AdministrationService, private toastr: ToastrService,
    private bioService: BioService, private fb: FormBuilder, private globalService: MySharedService,
    @Inject(DOCUMENT) private document: any, private regionService: RegionService, private logs: LogsService) {}
  countries: any = [];
  settings = settings;
  form: FormGroup;
  title: string;
  staticAlertClosed = false;
  country: any = {};
  rightId: any;
  countryDetails: any = {};
  isNew = false;
  editMode = false;
  submited = false;
  otc: any;
  response: any = {};
  button: any;
  is_edit = true;
  source: LocalDataSource;

    // manage rights buttons
    canViewUserProfile;
    canAddUserProfile;
    canEditUserProfile;

  ngOnInit() {
    this.gtCountries();
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    console.log('right id', this.rightId);
    setTimeout(() => (this.staticAlertClosed = true), 8000);
    this.getUserAssignedRights();
  }

    getUserAssignedRights() {
        const userAssignedRights = this.otc.userAssignedRights;
        console.log('userAssignedRights: ', userAssignedRights);
        let rightsIndex = -1;
        for (let i = 0; i < userAssignedRights[0].rights.length; i++) {
            console.log('userAssignedRights path: ' + userAssignedRights[0].rights[i].path);
            if (userAssignedRights[0].rights[i].path === '/regions/countries') {
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

  gtCountries() {
    this.blockUI.start('Loading data...');
    this.custSvc.gtCountries().subscribe(data => {
      this.countries = data;
      console.log('custs', this.countries);
      this.countries = this.countries.collection;
      console.log('countries##', this.countries);
      this.source = new LocalDataSource(this.countries);
      this.blockUI.stop();
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
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

  addCountry() {
    this.countryDetails = this.form.value;
    console.log('works..', this.countryDetails);
    this.submited = true;
    this.findInvalidControls();

    if (this.form.invalid) {
        return this.toastr.warning('Kindly ensure all fields are correctly entered', 'Alert!', { timeOut: 1500 });
    } else {
        this.countryDetails = this.form.value;
        console.log('country ', this.countryDetails);
        console.log('country details', this.countryDetails);
        this.regionService.upCountry(this.countryDetails).subscribe(res => {
            this.blockUI.stop();
            this.response = res;
            if (this.response.status === false) {
                this.log(this.rightId, 'failed to add country');
                this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
            }
            if (this.response.status === true) {
                if (this.countryDetails === 0 ) {
                      this.log(this.rightId, 'added country ' + this.countryDetails.name);
                } else {
                    this.log(this.rightId, 'updated country details ' + this.countryDetails.id);
                }
                this.editMode = false;
                this.gtCountries();
                this.countryDetails = {};
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
    this.country = {};
    this.gtCountries();
  }
  initAddCountry() {
    this.form = this.fb.group({
        id: new FormControl(0),
        countryCode: new FormControl('', [Validators.required, Validators.minLength(2)]),
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        status: new FormControl(false),
        createdBy: new FormControl(this.rightId),
        verified: 'N',
        waived: 'N',
        waivedBy: 0,
        waivedApprovedBy: 0
    });
    this.editMode = true;
    this.title = 'Add Country';
    this.button = 'Add Country';
    this.is_edit = false;
    this.isNew = true;
  }

  initEditCountry($event) {
      this.form = this.fb.group({
          countryCode: new FormControl( $event.data.countryCode,
             [ Validators.required, Validators.minLength(2)]),
          name: new FormControl($event.data.name, [ Validators.required, Validators.minLength(3),
                  Validators.minLength(2)]),
          status: new FormControl($event.data.status),
          createdBy: new FormControl($event.data.createdBy, Validators.required),
          id: new FormControl($event.data.id, Validators.required)
      });
      this.editMode = true;
      this.title = 'Add Country';
      this.button = 'Add Country';
      this.is_edit = true;
      this.isNew = true;
  }
}

export let settings = {
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
    countryCode: {
          title: 'Country Code',
          filter: true
      },
      name: {
          title: 'Country Name',
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
