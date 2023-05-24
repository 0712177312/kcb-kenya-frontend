import { LogsService } from './../../services/logs.service';
import { RegionService } from './../../services/region.service';
import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BlockUI, NgBlockUI, BlockUIService } from 'ng-block-ui';

@Component({
  selector: 'app-waive-country',
  templateUrl: './waive-country.component.html',
  styleUrls: ['./waive-country.component.css']
})
export class WaiveCountryComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private blockUIService: BlockUIService, private toastr: ToastrService,
     private regionService: RegionService, private logs: LogsService) {}
  countries: any = [];
  settings = settings;
  form: FormGroup;
  title: string;
  staticAlertClosed = false;
  country: any = {};
  rightId: any;
  is_edit = false;
  countryDetails: any = {};
  isNew = false;
  editMode = false;
  submited = false;
  otc: any;
  response: any = {};
  button: any;
  source: LocalDataSource;
  ngOnInit() {
    this.gtCountries();
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
        this.blockUI.stop();
        return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
}

  gtCountries() {
    this.blockUI.start('Loading data...');
    this.regionService.getCountriesToWaive().subscribe(data => {
      this.countries = JSON.parse(data);
      console.log('custs', this.countries);
      this.countries = this.countries.hashset;
      console.log('countries##', this.countries);
      this.source = new LocalDataSource(this.countries);
      this.blockUI.stop();
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
    });
  }

waiveCountry() {
  const cou = {
    'id': this.country.id,
    'waivedBy': this.rightId
  };
  this.regionService.waiveCountry(cou).subscribe(data => {
    this.response = JSON.parse(data);
    this.blockUI.stop();
    if (this.response.status === true) {
      this.editMode = false;
      this.country = {};
      this.gtCountries();
      return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 1500 });
    } else {
      return this.toastr.success(this.response.respMessage, 'Alert!', { timeOut: 1500 });
    }
  }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
  });
}

  cancel() {
    this.editMode = false;
    this.gtCountries();
  }

  initEditCountry($event) {
     this.country.id = $event.data.id;
     this.country.countryCode = $event.data.countryCode;
     this.country.status = $event.data.status;
     this.country.createdBy = $event.data.createdBy;
     this.country.name =  $event.data.name;
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
      add: false,
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
      editButtonContent: '<a class="btn btn-block btn-outline-success m-r-10"> <i class="fas fa-check-circle text-info-custom"></i></a>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>'
  },
  // add: {
  //     // tslint:disable-next-line:max-line-length
  //     addButtonContent: '<a class="btn btn-block btn-outline-info m-r-10"> <i class="fas fa-plus-circle"></i></a>',
  //     createButtonContent: '<i class="nb-checkmark"></i>',
  //     cancelButtonContent: '<i class="nb-close"></i>',
  // },
  attr: {
    class: 'table-bordered table-striped'
  },
};
