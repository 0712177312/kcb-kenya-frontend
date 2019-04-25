import { LogsService } from './../../services/logs.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from '../../../../../node_modules/ng2-smart-table';
import { AdministrationService } from '../../services/administration.service';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { AppService } from '../../services/app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-access-control',
    templateUrl: './access-control.component.html',
    styleUrls: ['./access-control.component.css']
})
export class AccessControlComponent implements OnInit, OnDestroy {
    groups: any;
    types: any;
    res: any;
    userGroups: any = [];
    rights: any = [];
    initRights: any = [];
    userGroup: any = {};
    asignedRights = [];
    response: any = null;
    is_edit: any = false;
    editMode = false;
    rightView = false;
    rightAdd = false;
    rightEdit = false;
    rightDelete = false;
    title: string;
    button: string;
    rightId: any;
    otc: any = {};
    source: LocalDataSource;
    @BlockUI() blockUI: NgBlockUI;
    constructor(private apiService: AdministrationService, private toastr: ToastrService,
         private logs: LogsService) {
        this.userGroup.id = 0;
        this.userGroup.groupName = '';
        this.userGroup.groupCode = '';
        this.userGroup.active = true;
        this.source = new LocalDataSource(this.userGroups); // create the source
    }
    settings = settings;

    ngOnInit() {
        this.getGroupsAndUserRights();
        this.initUserRights();
        this.otc = JSON.parse(localStorage.getItem('otc'));
        this.rightId = this.otc.rightId;
        console.log('right id', this.rightId);
        // this.initUserRights();
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
    initAddGroup() {
        this.initUserRights();
        this.userGroup.id = 0;
        this.userGroup.groupName = '';
        this.userGroup.groupCode = '';
        this.userGroup.active = true;
        this.editMode = true;
        this.is_edit = false;
        this.rights = this.initRights;
        this.title = 'Add user group';
        this.button = 'Add group';
    }
    initEditGroup($event) {
        this.editMode = true;
        this.userGroup = $event.data;
        this.is_edit = true;
        console.log('event####', $event);
        this.title = 'Edit user group';
        this.button = 'Update user group';
        this.rights = this.userGroup.rights;
    }
    
    getGroupsAndUserRights() {
        this.blockUI.start('Loading group data...');
        this.apiService.getUserGroupsAndRights().subscribe(data => {
            this.groups = data;
            console.log(this.groups);
            this.blockUI.stop();
            if (this.groups.status === true) {
                this.userGroups = this.groups.collection;
                this.source = new LocalDataSource(this.userGroups);
            } else {
                return this.toastr.warning(this.groups.respMessage, 'Warning!', { timeOut: 4000 });
            }
        }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error in loading group data.', 'Error!', { timeOut: 4000 });
        });
    }
    initUserRights() {
        this.apiService.getUserGroupRights().subscribe(res => {
            this.res = res;
            if (this.res.status === true) {
                this.initRights = this.res.collection;
            } else {
                return this.toastr.warning('No rights to assign.', 'Warning!', { timeOut: 4000 });
            }
        }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 4000 });
        });
    }
    addGroup() {
        if (this.userGroup.groupCode === '') {
            this.toastr.warning('Please specify the group code', 'Alert!', { timeOut: 4000 });
        } else if (this.userGroup.groupName === '') {
            this.toastr.warning('Please specify the group name', 'Alert!', { timeOut: 4000 });
        } else {
            console.log('rights ##############################', this.rights);
            console.log('rights ##############################', this.rights.length);
           // this.userGroup.rights = this.rights;
            for (let l = 0; l < this.rights.length; l++) {
                if (this.rights[l].allowView === true || this.rights[l].allowEdit === true
                      || this.rights[l].allowAdd === true || this.rights[l].allowDelete === true) {
                    this.asignedRights.push(this.rights[l]);
                    console.log('assigned rights', this.asignedRights);
                }
            }
            this.userGroup.rights = this.asignedRights;
            console.log(this.userGroup);
            this.blockUI.start('Updating user group details...');
            this.apiService.addUserGroup(this.userGroup).subscribe(res => {
                this.res = res;
                if (this.res.status === false) {
                    this.log(this.rightId, this.res.respMessage);
                    this.blockUI.stop();
                    return this.toastr.warning(this.res.respMessage, 'Alert!', { timeOut: 4000 });
                }
                if (this.res.status === true) {
                    if (this.userGroup.id === 0) {
                        this.log(this.rightId, 'added group ' + this.userGroup.groupName);
                    } else {
                        this.log(this.rightId, 'modified group ' + this.userGroup.id);
                    }
                    this.editMode = false;
                    this.asignedRights = [];
                    this.rights = [];
                    this.userGroup = {};
                    this.getGroupsAndUserRights();
                    this.blockUI.stop();
                    return this.toastr.success(this.res.respMessage, 'Success!', { timeOut: 4000 });
                }
            }, error => {
                this.log(this.rightId, 'server error updating user group ');
                this.blockUI.stop();
                return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 4000 });
            });
        }
    }
    cancel() {
        this.userGroup = {};
        this.editMode = false;
        this.rights = [];
    }

    selectAllViewRights() {
        for (let i = 0; i < this.rights.length; i++) {
            this.rights[i].allowView = this.rightView;
        }
    }
    selectAllAddRights() {
        for (let i = 0; i < this.rights.length; i++) {
            this.rights[i].allowAdd = this.rightAdd;
        }
    }
    selectAllEditRights() {
        for (let i = 0; i < this.rights.length; i++) {
            this.rights[i].allowEdit = this.rightEdit;
        }
    }

    ngOnDestroy() {
        //
        this.userGroups = [];
        this.rights = [];
        this.initRights = [];
        this.userGroup = {};
        this.asignedRights = [];
        this.response = null;
    }

}


export let settings = {
    mode: 'external',
    actions: {
        delete: false,
        position: 'right',
    },
    columns: {
        id: {
            title: '#',
            filter: false
        },
        groupCode: {
            title: 'Code',
            filter: true
        },
        groupName: {
            title: 'Name',
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
};
