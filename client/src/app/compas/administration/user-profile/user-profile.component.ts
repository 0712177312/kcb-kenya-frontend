import { LogsService } from './../../services/logs.service';
import { Component, OnInit, ViewChild, Inject, Renderer, Renderer2, ViewEncapsulation, OnChanges } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { NgbTabChangeEvent, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Applicant } from '../../models/applicant';
import { NgBlockUI, BlockUI, BlockUIService } from 'ng-block-ui';
import { MySharedService } from '../../services/sharedService';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComponentCanDeactivate } from '../../guards/pending-changes-guard.guard';
import { TellerService } from '../../services/teller.service';
import { RegionService } from '../../services/region.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit, OnChanges { // ComponentCanDeactivate
    @BlockUI() blockUI: NgBlockUI;
    firstElement = 'block-element-1';
    blockInstances = [this.firstElement, 'block-element-2', 'block-element-3'];
    fingerpos = ['LEFT_THUMB', 'LEFT_INDEX', 'LEFT_MIDDLE', 'LEFT_RING', 'LEFT_LITTLE', 'RIGHT_THUMB',
        'RIGHT_INDEX', 'RIGHT_MIDDLE', 'RIGHT_RING', 'RIGHT_LITTLE'];
    public userProfiles: any = [];
    public userProfile: any = {};
    public groups: any;
    public userGroups: any = [];
    public response: any = null;
    public editMode = false;
    public isNew = true;
    countryResp: any;
    countries = [];
    branchesResp: any;
    branches = [];
    public title: string;
    public button: string;
    source: LocalDataSource;
    private base64textString: String = '';
    imagSrc = 'assets/images/default.jpeg';
    captured = ['L0', 'L1', 'L2', 'L3', 'L4', 'R0', 'R1', 'R2', 'R3', 'R4'];
    searchText;
    submited = false;
    globalService: any;
    matchResp: any;
    customerNo: any;
    element: HTMLImageElement;
    defaultSrc = 'assets/images/enroll/noImage_1.png';
    retries = 0;
    custResp: any;
    userProfileForm: any;
    otc: any = {};
    bioDetails = true;
    bb: any;
    tooltips: any;
    fingresp: any;
    service_handle: any = '';
    profDetails = false;
    closeResult: string;
    afisBio: any = {};
    fsource;
    model: any = {};
    is_edit = false;
    form: FormGroup;
    userForm: FormGroup;
    resp: any;
    fpdata: any;
    bios: any = [];
    username: any;
    formVal: FormGroup;
    bio: any;
    tellersResp: any;
    teller: any;
    tellers = [];
    rightId: any;
    myBehaviorSubject$;
    usernames = [];
    dashs: any = {};
    accountNumber;
    passPattern: any = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
    custForm: FormGroup;
    observable$;
    searchSubject$ = new Subject<string>();
    fingerprint = [];
    signupForm: any;
    tellerDet: any = {};
    username_check: boolean;
    myUsername: String;
    groupRights: any;
    storageObject: any = {};

    // user assigned rights for the logged in user
    canViewUserProfile: Boolean;
    canAddUserProfile: Boolean;
    canEditUserProfile: Boolean;

    constructor(private blockUIService: BlockUIService,
        private renderer: Renderer2, private regionSvc: RegionService, private apiService: AdministrationService,
        private toastr: ToastrService,
        private bioService: BioService, private tellerSvc: TellerService, private fb: FormBuilder,
        private modalService: NgbModal,
        private modalService2: NgbModal, private logs: LogsService,
        @Inject(DOCUMENT) private document: any) {
        this.source = new LocalDataSource(this.userProfiles); // create the source
    }
    settings = settings;

    ngOnInit() {
        //this.getTellers();
        this.getUserProfiles();
        this.getUserGroups();
        //this.getActiveBranches();
        this.getActiveCountries();
        this.otc = JSON.parse(localStorage.getItem('otc'));
        this.rightId = this.otc.rightId;
        console.log('right id', this.rightId);

        this.getUserAssignedRights();
    }

    getUserAssignedRights(){
        let userAssignedRights = this.otc.userAssignedRights;
        console.log("userAssignedRights: ", userAssignedRights);
        let rightsIndex = -1;
        for(let i = 0; i < userAssignedRights[0].rights.length; i++){
            console.log("userAssignedRights name: " + userAssignedRights[0].rights[i].rightName);
            if(userAssignedRights[0].rights[i].rightName == "User Profile"){
                rightsIndex = i;
                break;
            }
        }

        if(rightsIndex >= 0){
            this.canViewUserProfile = userAssignedRights[0].rights[rightsIndex].allowView;
            this.canAddUserProfile = userAssignedRights[0].rights[rightsIndex].allowAdd;
            this.canEditUserProfile = userAssignedRights[0].rights[rightsIndex].allowEdit;
        }
    }

    get f() { return this.form.controls; }

    getTellers(branch) {
        this.tellerSvc.getBranchTellers(branch).subscribe(data => {
            this.tellersResp = data;
            this.tellers = this.tellersResp.collection;
        }, error => {
            return this.toastr.error('Error fetching staff.', 'Error!', { timeOut: 4000 });
        });
    }
    ngOnChanges(changes) {
        console.log(changes);
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
        console.log('works...', this.form.value);
        if (this.form.invalid) {
            return;
        } else {
            console.log('works...');
        }
    }
    passwordConfirming(c: AbstractControl): { invalid: boolean } {
        if (c.get('password').value !== c.get('confirmPassword').value) {
            return { invalid: true };
        }
    }
    initEditUser($event) {
        if(this.canEditUserProfile === false){
            return this.toastr.warning('You are not allowed to edit a user profile', 'Warning!', { timeOut: 3000 });
        }
        this.form = this.fb.group({
            country: new FormControl($event.data.country, [Validators.required]),
            branch: new FormControl($event.data.branch, [Validators.required]),
            teller: new FormControl($event.data.teller, [Validators.required]),
            group: new FormControl($event.data.group, Validators.required),
            // password: new FormControl($event.data.password, Validators.required),
            // confirmPassword: new FormControl($event.data.password, Validators.required),
            status: new FormControl($event.data.status, Validators.required),
            createdBy: new FormControl($event.data.createdBy, Validators.required),
            id: new FormControl($event.data.id, Validators.required),
            approved: new FormControl($event.data.approved, Validators.required)
        });
        this.editMode = true;
        this.is_edit = true;
        this.title = 'Edit user profile';
        this.button = 'Update user';
        this.isNew = false;
    }

    getUserProfiles() {
        this.blockUI.start('Loading data...');
        this.apiService.getUserProfiles().subscribe(data => {
            this.blockUI.stop();
            this.response = data;
            this.userProfiles = this.response.collection;
            this.source = new LocalDataSource(this.userProfiles);
        });
    }

    getUsernames(username?: string) {
        console.log('works', username);
        this.apiService.gtUsernames().subscribe(data => {
            this.dashs = data;
            this.usernames = this.dashs.usrs;
            console.log('users', this.usernames);
            if (this.usernames.length > 0) {
                for (let i = 0; i < this.usernames.length; i++) {
                    console.log(this.usernames[i]);
                    if (this.usernames[i] === username) {
                        console.log('true..');
                        this.username = username;
                        console.log('user name', this.username);
                        return;
                    }
                }
            } else {
                this.username = '';
            }
        });
    }

    getUserGroups() {
        this.apiService.getUserGroups().subscribe(data => {
            this.groups = data;
            this.userGroups = this.groups.collection;
        });

    }
    doSomething(event) {
        console.log(event); // logs model value
    }
    initAddUser() {
        // tslint:disable-next-line:max-line-length
        if(this.canAddUserProfile === false){
            return this.toastr.warning('You are not allowed to add a user profile', 'Warning!', { timeOut: 3000 });
        }
        const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.form = this.fb.group({
            id: new FormControl(0),
            country: new FormControl('', [Validators.required]),
            branch: new FormControl('', [Validators.required]),
            teller: new FormControl('', [Validators.required]),
            group: new FormControl('', [Validators.required]),
            // password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20),
            // Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])),
            // confirmPassword:
            //     new FormControl('', [Validators.required, Validators.minLength(8)]),
            status: new FormControl(false),
            createdBy: new FormControl(this.rightId),
            // bios: new FormControl([]),
            approved: new FormControl('N')
        });
        this.editMode = true;
        this.title = 'Add user profile';
        this.button = 'Add user';
        this.is_edit = false;
        this.isNew = true;
    }
    getActiveCountries() {
        this.regionSvc.getActiveCountries().subscribe(data => {
            this.countryResp = data;
            if (this.countryResp.status === true) {
                this.countries = this.countryResp.collection;
                console.log('countries dts', this.countryResp.collection);
            } else {
                console.log('not countries enrolled');
            }
            // this.tellerDet.details = this.tellerDet.model;
        }, error => {
            console.log('error getting countries details');
        });
    }
    getActiveBranches(country) {
        console.log('country', country);
        this.regionSvc.getCountryBranches(country).subscribe(data => {
            this.branchesResp = data;
            if (this.branchesResp.status === true) {
                this.branches = this.branchesResp.collection;
                console.log('branches dts', this.branchesResp.collection);
            } else {
                console.log('not branches enrolled');
            }
            // this.tellerDet.details = this.tellerDet.model;
        }, error => {
            console.log('error getting branches details');
        });
    }
    getTellerDetail(teller) {
        this.tellerSvc.getTellerDetail(teller).subscribe(data => {
            this.tellerDet = data;
            if (this.tellerDet.status === true) {
                this.teller = this.tellerDet.teller;
                console.log('teller dts', this.tellerDet.teller);
            } else {
                console.log('not tellers enrolled');
            }
            // this.tellerDet.details = this.tellerDet.model;
        }, error => {
            console.log('error getting teller details');
        });
    }
    addUser() {
        switch (this.button) {
            case 'Update user':
                this.updateUser();
                break;
            default:
                console.log('user details', this.userProfile);
                console.log('user ', this.userProfile);
                if (this.form.invalid) {
                    return this.toastr.warning('Kindly ensure all fields are correctly entered', 'Success!', { timeOut: 1500 });
                } else {
                    this.userProfile = this.form.value;
                    this.userProfile = this.form.value;
                    this.userProfile.fullName = this.teller.tellerName;
                    this.userProfile.email = this.teller.tellerEmail;
                    this.userProfile.username = this.teller.tellerSignOnName;
                    console.log('user ', this.userProfile);
                    console.log('user profile details ####$$', this.userProfile);
                    this.apiService.addUserProfile(this.userProfile).subscribe(res => {
                        this.blockUI.stop();
                        this.response = res;
                        if (this.response.status === false) {
                            this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
                        }
                        if (this.response.status === true) {
                            this.editMode = false;
                            this.getUserProfiles();
                            // if (this.globalService.rightId === this.userProfile.id) {
                            //     this.apiService.getUserMenus(this.userProfile.group).subscribe(data => {
                            //         this.groupRights = data;
                            //         this.globalService.setRights(this.groupRights.collection);
                            //         this.storageObject.username = this.globalService.username;
                            //         this.storageObject.groupId = this.globalService.groupId;
                            //         this.storageObject.rightId = this.globalService.rightId;
                            //         this.storageObject.rights = this.groupRights.collection;
                            //         localStorage.setItem('otc', JSON.stringify(this.storageObject));
                            //     }, error => {
                            //         this.toastr.error('Error has occured', 'Oops!', { timeOut: 1500 });
                            //     });
                            // }
                            this.userProfile = {};
                            return this.toastr.success("Added successfully", 'Success!', { timeOut: 1500 });
                        }
                    });
                }
        }
    }

    updateUser() {
        if (this.form.invalid) {
            return this.toastr.warning('Kindly ensure all fields are correctly entered', 'Success!', { timeOut: 1500 });
        } else {
            this.userProfile = this.form.value;
            console.log("userProfile: "+ this.userProfile);
            this.apiService.editUserProfile(this.userProfile).subscribe(res => {
                this.blockUI.stop();
                this.response = res;
                if (this.response.status === false) {
                    this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
                }
                if (this.response.status === true) {
                    this.editMode = false;
                    this.getUserProfiles();
                    this.userProfile = {};
                    return this.toastr.success("Edited User Profile Successfully", 'Success!', { timeOut: 1500 });
                }
            });
        }
    }

    cancel() {
        this.editMode = false;
        this.userProfile = {};
        this.getUserProfiles();
        this.userProfile.bios = [];
        this.bios = [];
    }

    resetDevice() {
        this.element = document.createElement('img');
        this.bios = [];
        this.userProfile.bios = [];
        this.fingerprint = [];
        this.afisBio = {};
        for (let i = 0; i < this.captured.length; i++) {
            const imgId = this.fingerpos[i];
            const captS = this.captured[i];
            this.document.getElementById(imgId).src = this.defaultSrc;
            const btnid = 'BTN_' + imgId;
            this.document.getElementById(captS).src = 'assets/images/enroll/' + captS + '.png';
            (<HTMLInputElement>document.getElementById(btnid)).disabled = false;
        }
        console.log('removed bios', this.bios);
        console.log('removed profile print', this.userProfile.bios);
        console.log('removed profile print', this.afisBio);
        return this.toastr.success('Device was reset successfully .. .', 'Success!', { timeOut: 3000 });
    }

    validateUser($event: NgbTabChangeEvent) {
        if (this.userProfile.fullName === '') {
            $event.preventDefault();
            this.toastr.warning('Please specify the user full name', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.username === '') {
            $event.preventDefault();
            this.toastr.warning('Please specify the  user name', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.username === this.username) {
            console.log('username', this.username, 'this.', this.userProfile.username);
            $event.preventDefault();
            this.toastr.warning('Username already exists, kindly input another', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.email === '') {
            $event.preventDefault();
            this.toastr.warning('Please specify the user email', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.phone === '') {
            $event.preventDefault();
            this.toastr.warning('Please specify the user phone number', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.group === 0) {
            $event.preventDefault();
            this.toastr.warning('Please specify the user group', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.password === '') {
            $event.preventDefault();
            this.toastr.warning('Please specify the user password', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.password.length < 7) {
            $event.preventDefault();
            this.toastr.warning('The user password should be atleast 8 characters', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.confirmPassword === '') {
            $event.preventDefault();
            this.toastr.warning('Please confirm the user password', 'Alert!', { timeOut: 1500 });
        } else if (this.userProfile.password !== this.userProfile.confirmPassword) {
            $event.preventDefault();
            this.toastr.warning('The passwords do not match', 'Alert!', { timeOut: 1500 });
        }
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
            title: '##',
            filter: true
        },
        fullName: {
            title: 'Full name',
            filter: true
        },
        username: {
            title: 'User name',
            filter: true
        },
        email: {
            title: 'Email',
            filter: true
        }
        // phone: {
        //     title: 'Phone number',
        //     filter: true
        // }
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
