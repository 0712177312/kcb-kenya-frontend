import { LogsService } from './../../services/logs.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { LocalDataSource } from '../../../../../node_modules/ng2-smart-table';
import { AdministrationService } from '../../services/administration.service';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { AppService } from '../../services/app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MySharedService } from '../../services/sharedService';
import { Urls } from '../../services/url';

import { HttpClient } from '@angular/common/http';
import { Right } from '../../models/Right';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-access-control',
    templateUrl: './access-control.component.html',
    styleUrls: ['./access-control.component.css']
})
export class AccessControlComponent implements OnInit, OnDestroy {

    API_URL = new Urls();
    groups: any;
    types: any;
    res: any;
    userGroups: any = [];
    rights: any = [];
    initRights: any = [];
    userGroup: any = {};
    asignedRights = [];
    rightDisabled= false;
    update = false;
    updatedRights: Right[] = [];
    originalGroupRights: Right[] = [];
    originalGroupRightsString = '';
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
    constructor(private apiService: AdministrationService, private toastr: ToastrService,@Inject(DOCUMENT) private document: any,
         private logs: LogsService,private globalService: MySharedService, private http: HttpClient) {
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
        this.rights = this.userGroup.rights.slice();

        this.originalGroupRights = this.rights.slice();

        // console.log('Here are the rights on edit: this.rights');
        // console.log(JSON.stringify(this.rights));
        this.originalGroupRightsString = JSON.stringify(this.rights);

  
    }
    
    getGroupsAndUserRights() {
        this.blockUI.start('Loading group data...');
        this.apiService.getUserGroupsAndRights().subscribe(data => {
            this.groups = JSON.parse(data);
            console.log(this.groups);
            this.blockUI.stop();
            if (this.groups.status === true) {
                this.userGroups = this.groups.hashset;
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
            this.res = JSON.parse(res);
            if (this.res.status === true) {
                this.initRights = this.res.hashset;
            } else {
                return this.toastr.warning('No rights to assign.', 'Warning!', { timeOut: 4000 });
            }
        }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 4000 });
        });
    }


    addGroup() {
        console.log("inside add group")
        if (this.userGroup.groupCode === '') {
            this.toastr.warning('Please specify the group code', 'Alert!', { timeOut: 4000 });
        } else if (this.userGroup.groupName === '') {
            this.toastr.warning('Please specify the group name', 'Alert!', { timeOut: 4000 });
        } else {
            // console.log('rights ##############################', this.rights);
            // console.log('rights ##############################', this.rights.length);
           // this.userGroup.rights = this.rights;
            for (let l = 0; l < this.rights.length; l++) {
                if (this.rights[l].allowView === true || this.rights[l].allowEdit === true
                      || this.rights[l].allowAdd === true || this.rights[l].allowDelete === true) {
                    this.asignedRights.push(this.rights[l]);
                    // console.log('assigned rights', this.asignedRights);
                }
            }
            this.userGroup.rights = this.asignedRights;
            // console.log(this.userGroup);
            let userGroup = this.userGroup;
            this.blockUI.start('Updating user group details...');
            this.apiService.addUserGroup(userGroup).subscribe(res => {
                console.log("response from the server :: "+res);

                this.res = res;

                //response from the server :: {"respCode":"000","respMessage":"user group updated successfully","status":true,"version":"1.0.0","hashset":null,"collection":null}
               
                this.response = JSON.parse(this.res);
                console.log("response from the server :: "+this.response.status);
                if (this.response.status === false) {
                    this.log(this.rightId, this.response.respMessage);
                    this.blockUI.stop();
                    return this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 4000 });
                }
                if (this.response.status === true) {
                    if (this.userGroup.id === 0) {
                        this.log(this.rightId, 'added group ' + userGroup.groupName);
                    } else {
                        this.log(this.rightId, 'modified group ' + userGroup.id);
                    }
                    this.editMode = false;
                    this.asignedRights = [];
                    this.rights = [];
                    userGroup = {};
                    this.getGroupsAndUserRights();
                    this.blockUI.stop();
                    return this.toastr.success(this.response.respMessage, 'Success!', { timeOut: 4000 });
                }
            }, error => {
                this.log(this.rightId, 'server error updating user group ');
                this.blockUI.stop();
                return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 4000 });
            });
        }
    }
   
  
    //added this by 12/04/2024
    // changeGroup(){
    //     if (this.update) {
    //         this.editGroup();
    //     } else {
    //         this.addGroup();
    //     }
    // }

    
  
  
 
    
    cancel() {
        this.userGroup = {};
        this.editMode = false;
        this.rights = [];
       this.rightDisabled=false
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

    enableAllowView(right){
        if(!right.allowAdd){
            right.allowView = true;
        }
    }

    enableAllowView2(right){
        if(!right.allowEdit){
            right.allowView = true;
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
        editButtonContent: '<a class="btn btn-block btn-outline-success m-r-10" (click)="update=true"><i class="fas fa-check-circle text-info-custom"></i></a>',
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
