import { LogsService } from './../../services/logs.service';
import { Component, OnInit} from '@angular/core';
import { BlockUI, NgBlockUI, BlockUIService } from 'ng-block-ui';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'app-waive-channel',
  templateUrl: './waive-channel.component.html',
  styleUrls: ['./waive-channel.component.css']
})
export class WaiveChannelComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private blockUIService: BlockUIService, private toastr: ToastrService,
    private conSvc: ConfigsService, private fb: FormBuilder, private logs: LogsService) {}
  channels: any = [];
  settings = settings;
  form: FormGroup;
  title: string;
  country: any = {};
  rightId: any;
  channelDetails: any = {};
  isNew = false;
  channel: any = {};
  editMode = false;
  submited = false;
  otc: any;
  response: any = {};
  staticAlertClosed: any = false;
  button: any;
  is_edit = false;
  source: LocalDataSource;
  ngOnInit() {
    this.gtChannels();
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    console.log('right id', this.rightId);
    setTimeout(() => (this.staticAlertClosed = true), 8000);
  }

  onSubmit() {
    this.submited = true;
    console.log('works..');
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
  get f() { return this.form.controls; }

  gtChannels() {
    this.blockUI.start('Loading data...');
    this.conSvc.getChannelsToWaive().subscribe(data => {
      this.channels = JSON.parse(data);
      console.log('custs', this.channels);
      this.channels = this.channels.hashset;
      console.log('channels##', this.channels);
      this.source = new LocalDataSource(this.channels);
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

addChannel() {
  if ( this.channel.createdBy === this.rightId) {
    return this.toastr.warning('User can not waive channel they created', 'Alert!', { timeOut: 4000 });
  }
  const chann = {
    'id': this.channel.id,
    'waivedBy': this.rightId
  };
        this.conSvc.waiveChannel(chann).subscribe(res => {
            this.blockUI.stop();
            this.response = JSON.parse(res);
            if (this.response.status === true) {
                this.editMode = false;
                this.gtChannels();
                this.channelDetails = {};
                return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 4000 });
            } else {
              return this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 4000 });
            }
        }, error => {
          this.blockUI.stop();
          return this.toastr.error('Error updating data.', 'Error!', { timeOut: 1500 });
        });
  }
  cancel() {
    this.editMode = false;
    this.submited = false;
    this.gtChannels();
  }

  initEditChannel($event) {
    console.log('channel' , $event.data);
      this.channel.channelCode = $event.data.channelCode;
      this.channel.channelName = $event.data.channelName;
      this.channel.status = $event.data.status;
      this.channel.createdBy = $event.data.createdBy;
      this.channel.id = $event.data.id;
      this.editMode = true;
      this.title = 'Add Channel';
      this.button = 'Add Channel';
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
    count: {
      title: '#',
      filter: true
    },
    channelCode: {
          title: 'Channel Code',
          filter: true
      },
   channelName: {
          title: 'Channel Name',
          filter: true
      },
      activeStatus: {
          title: 'Status',
          filter: false
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
