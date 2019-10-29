import { LogsService } from './../../services/logs.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'node_modules/ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { MySharedService } from '../../services/sharedService';
import { CustomerService } from '../../services/customer.service';
import { DOCUMENT } from '@angular/platform-browser';
import { Applicant } from '../../models/applicant';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BioService } from '../../services/bio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  user: any = {};
  bio: any = {};
  bios: any = [];
  response: any;
  usermodel: any = {};
  afisAuth: any = {};
  fingerprint = [];
  verifyUser: any = {};
  menus: any;
  storageObject: any = {};

  userAssignedRights: any;

  constructor(private authService: AuthService, private appService: AppService, private toastr: ToastrService,
    private router: Router, private apiService: BioService, private globalService: MySharedService,
    private logs: LogsService,
    private custSvc: CustomerService, @Inject(DOCUMENT) private document: any) {
    this.user.username = '';
    this.user.password = '';
  }

  loginform = true;
  recoverform = false;
  ngOnInit() {
    console.log("Initialization:  " + localStorage.getItem('bio.glob#$$#'));
    localStorage.getItem('bio.glob#$$#') ? this.doNothing() : this.getGlobals();
  }
  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
  log(userId, activity) {
    const log = {
      'userId': userId,
      'activity': activity
    };
    this.logs.log(log).subscribe((data) => {

    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
  }
  login() {
    if (this.user.username === '') {
      return this.toastr.warning('Please specify the user name', 'Alert!', { timeOut: 1500 });
    } else if (this.user.password === '') {
      return this.toastr.warning('Please specify the password', 'Alert!', { timeOut: 1500 });
    } else {
      this.authService.login(this.user).subscribe(res => {
        // this.blockUI.start('Authenticating user...');
        this.response = res;
        console.log(this.response);
        if (this.response.status === false) {
          this.log(0, 'failed to log in ' + this.user.username);
          this.blockUI.stop();
          return this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
        }
        if (this.response.status === true) {
          this.appService.getUserAssignedRights(this.response.model.group).subscribe(resp => {
            this.userAssignedRights = resp;
            if (this.userAssignedRights.status === true) {
              this.log(this.response.model.id, 'logged in');
              this.appService.getUserMenus(this.response.model.group).subscribe(resp => {
                this.menus = resp;

                if (this.menus.status === true) {
                  this.storageObject.username = this.user.username;
                  this.storageObject.rightId = this.response.model.id;
                  this.storageObject.rights = this.menus.collection;
                  this.storageObject.branch = this.response.model.branch;
                  this.storageObject.group = this.response.model.group;
                  this.storageObject.userAssignedRights = this.userAssignedRights.collection;

                  localStorage.setItem('otc', JSON.stringify(this.storageObject));
                  this.globalService.setAuth(true);
                  this.globalService.setRightId(this.user.id);
                  this.globalService.setUsername(this.user.username);
                  this.globalService.setRights(this.menus.collection);
                  this.globalService.setBranch(this.response.model.branch);
                  this.globalService.setGroup(this.response.model.group);
                  this.globalService.setUserAssignedRights(this.userAssignedRights.collection);
                  this.router.navigate(['/dashboard']);
                  this.getGlobals();
                } else {
                  this.storageObject.username = this.user.username;
                  this.storageObject.rightId = this.user.id;
                  this.storageObject.rights = this.menus.collection;
                  this.storageObject.branch = this.user.branch;
                  this.storageObject.group = this.response.model.group;
                  this.storageObject.userAssignedRights = this.userAssignedRights.collection;

                  localStorage.setItem('otc', JSON.stringify(this.storageObject));
                  this.globalService.setAuth(true);
                  this.globalService.setRightId(this.user.id);
                  this.globalService.setUsername(this.user.username);
                  this.globalService.setRights(this.menus.collection);
                  this.globalService.setBranch(this.response.model.branch);
                  this.globalService.setGroup(this.response.model.group);
                  this.globalService.setUserAssignedRights(this.userAssignedRights.collection);
                  this.getGlobals();
                  this.router.navigate(['/dashboard']);
                  //  this.blockUI.stop();
                  return this.toastr.warning(this.menus.respMessage, 'Alert!', { timeOut: 1500 });
                }
              });
            } else {
              this.blockUI.stop();
              return this.toastr.warning(this.response.respMessage, 'User Assigned Rights not fetched!', { timeOut: 1500 });
            }
          });
        }
      }, error => {
        this.log(0, 'server error ' + this.user.username);
        this.blockUI.stop();
        return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
      });
    }
  }

  captureFP() {
    if (this.user.username === '') {
      this.toastr.warning('Please specify the user name to proceed', 'Warning!', { timeOut: 1500 });
    }
    this.apiService.capturePrint().subscribe(data => {
      this.bio = data;
      console.log("fingerprint received: " + this.bio);
      if (this.bio.ErrorCode === 0) {

        if (this.bio !== null && this.bio.BMPBase64.length > 0) {
          this.document.getElementById('finger').src =
            'data:image/bmp;base64,' + this.bio.BMPBase64;
          this.verifyUser.singlePrint = {
            position: 0,
            fingerPrint: this.bio.BMPBase64
          };
          this.verifyUser.transactionType = 'L';
          this.verifyUser.customerId = this.user.username;
          this.verifyUser.transactionId = '';
          this.afisVerifyUser();
        }

      } else {
        return this.toastr.warning('failed to Capture finger print, please retry', 'Warning!');
      }
    });
  }

  afisVerifyUser() {
    if (this.user.username === '') {
      return this.toastr.warning('Please specify the user name to continue', 'Alert!', { timeOut: 1500 });
    } else {
      this.blockUI.start('Verifying user finger print...');
      this.apiService.afisVer(this.verifyUser).subscribe(dat => {
        this.response = dat;

        if (this.response.status === true) {

          // this.toastr.success('Profile verified successfully', ' Success!');
          this.printAuth();
        } else {
          this.blockUI.stop();
          return this.toastr.warning(this.response.message, 'Warning!', { timeOut: 3000 });
        }
      }, error => {
        this.log(0, 'server error ' + this.user.username);
        this.blockUI.stop();
        return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
      });
    }
  }


  printAuth() {
    // this.user.customerId = '';
    // this.user.transactionType = 'L';
    this.authService.printAuth(this.user).subscribe(res => {
      this.response = res;

      if (this.response.status === false) {
        return this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
      }
      if (this.response.status === true) {
        this.appService.getUserMenus(this.response.model.group).subscribe(resp => {
          this.menus = resp;
          this.blockUI.stop();
          if (this.menus.status === true) {
            this.storageObject.username = this.user.username;
            this.storageObject.rightId = this.response.model.id;
            this.storageObject.rights = this.menus.collection;
            this.storageObject.branch = this.response.model.branch;
            this.storageObject.group = this.response.model.group;
            this.storageObject.userAssignedRights = this.userAssignedRights.collection;

            localStorage.setItem('otc', JSON.stringify(this.storageObject));
            this.globalService.setAuth(true);
            this.globalService.setRightId(this.user.id);
            this.globalService.setUsername(this.user.username);
            this.globalService.setRights(this.menus.collection);
            this.globalService.setBranch(this.response.model.branch);
            this.globalService.setGroup(this.response.model.group);
            this.globalService.setUserAssignedRights(this.userAssignedRights.collection);
            this.router.navigate(['/dashboard']);
          } else {
            this.storageObject.username = this.user.username;
            this.storageObject.rightId = this.user.id;
            this.storageObject.rights = this.menus.collection;
            this.storageObject.branch = this.user.branch;
            this.storageObject.group = this.response.model.group;
            this.storageObject.userAssignedRights = this.userAssignedRights.collection;
            localStorage.setItem('otc', JSON.stringify(this.storageObject));
            this.globalService.setAuth(true);
            this.globalService.setRightId(this.user.id);
            this.globalService.setUsername(this.user.username);
            this.globalService.setRights(this.menus.collection);
            this.globalService.setBranch(this.response.model.branch);
            this.globalService.setGroup(this.response.model.group);
            this.globalService.setUserAssignedRights(this.userAssignedRights.collection);
            this.router.navigate(['/dashboard']);
            return this.toastr.warning(this.menus.respMessage, 'Alert!', { timeOut: 1500 });
          }
        }, error => {
          this.blockUI.stop();
          return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 1500 });
        });
      }
    });
  }

  getGlobals() {
    this.authService.getGlobals().subscribe(data => {
      console.log("Data Configs:: " + this.globalService.decryptData(data));
      localStorage.setItem('bio.glob#$$#', JSON.stringify(this.globalService.decryptData(data)));
    }, error => {
      return this.toastr.error('Error in loading configs.', 'Error!', { timeOut: 1500 });
    });
  }

  doNothing() {

  }
}
