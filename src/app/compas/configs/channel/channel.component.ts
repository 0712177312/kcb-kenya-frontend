import { LogsService } from './../../services/logs.service';
import { Component, OnInit} from '@angular/core';
import { BlockUI, NgBlockUI, BlockUIService } from 'ng-block-ui';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;

    constructor(private blockUIService: BlockUIService, private toastr: ToastrService,
       private conSvc: ConfigsService, private fb: FormBuilder, private logs: LogsService
      ) {}
    channels: any = [];

    form: FormGroup;
    title: string;
    country: any = {};
    rightId: any;
    channelDetails: any = {};
    isNew = false;
    editMode = false;
    submited = false;
    otc: any;
    response: any = {};
    staticAlertClosed: any = false;
    button: any;
    is_edit = false;
    source: LocalDataSource;

    canViewUserProfile: Boolean;
    canAddUserProfile: Boolean;
    canEditUserProfile: Boolean;

    settings;

    ngOnInit() {
      this.gtChannels();
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
            if (userAssignedRights[0].rights[i].path === '/configs/channels') {
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
      this.conSvc.gtChannels().subscribe(data => {
        this.channels = data;
        console.log('custs', this.channels);
        this.channels = this.channels.collection;
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
      this.channelDetails = this.form.value;
      console.log('works..', this.channelDetails);
      this.submited = true;
      this.findInvalidControls();

      if (this.form.invalid) {
          return this.toastr.warning('Kindly ensure all fields are correctly entered', 'Alert!', { timeOut: 1500 });
      } else {
          this.channelDetails = this.form.value;
          console.log('country ', this.channelDetails);
          console.log('country details', this.channelDetails);
          this.conSvc.upChannel(this.channelDetails).subscribe(res => {
              this.blockUI.stop();
              this.response = res;
              if (this.response.status === false) {
                  this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
              }
              if (this.response.status === true) {
                  this.editMode = false;
                  this.gtChannels();
                  this.channelDetails = {};
                  this.submited = false;
                  return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 1500 });
              }
          }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error updating data.', 'Error!', { timeOut: 1500 });
          });
      }
    }
    cancel() {
      this.editMode = false;
      this.submited = false;
      this.gtChannels();
    }
    initAddChannel() {
      this.form = this.fb.group({
          id: new FormControl(0),
          channelCode: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]),
          channelName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]),
          status: new FormControl(false),
          createdBy: new FormControl(this.rightId),
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

    initEditChannel($event) {
        this.form = this.fb.group({
            channelCode: new FormControl($event.data.channelCode, [ Validators.required,
                    Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]),
           channelName: new FormControl($event.data.channelName, [ Validators.required, Validators.minLength(3),
                    Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]),
            status: new FormControl($event.data.status),
            createdBy: new FormControl($event.data.createdBy, Validators.required),
            id: new FormControl($event.data.id, Validators.required)
        });
        this.editMode = true;
        this.title = 'Add Country';
        this.button = 'Add Country';
        this.is_edit = false;
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
  //     channelCode: {
  //           title: 'Channel Code',
  //           filter: true
  //       },
  //    channelName: {
  //           title: 'Channel Name',
  //           filter: true
  //       },
  //       activeStatus: {
  //           title: 'Status',
  //           filter: false
  //       }
  //   },
  //   edit: {
  //       // tslint:disable-next-line:max-line-length
  //       editButtonContent: (this.canAddUserProfile === true) ? '<a class="btn btn-block btn-outline-success m-r-10"> <i class="fas fa-check-circle text-info-custom"></i></a>' : '',
  //       saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
  //       cancelButtonContent: '<i class="ti-close text-danger"></i>'
  //   },
  //   add: {
  //       // tslint:disable-next-line:max-line-length
  //       addButtonContent: (this.canAddUserProfile === true) ? '<a class="btn btn-block btn-outline-info m-r-10"> <i class="fas fa-plus-circle"></i></a>' : '',
  //       createButtonContent: '<i class="nb-checkmark"></i>',
  //       cancelButtonContent: '<i class="nb-close"></i>',
  //   },
  //   attr: {
  //     class: 'table-bordered table-striped'
  //   },
  // };
