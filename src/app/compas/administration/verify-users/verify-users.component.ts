import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-verify-users',
  templateUrl: './verify-users.component.html',
  styleUrls: ['./verify-users.component.css']
})
export class VerifyUsersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private apiSvc: AdministrationService, private toastr: ToastrService,
     private logs: LogsService) { }
  fromDate: any;
  toDate: any;
  response: any = {};
  users: any = [];
  user: any = {};
  arrs = [];
  rightId: any;
  approve = [];
  otc: any = {};
  apusers: any = [];
  ngOnInit() {
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    this.getUsersToVerify();
  }

  initApproval() {
   // this.user.isActive = false;
    this.user = {};
    this.approve = [];
  }
  log(userId, activity) {
    const log = {
        'userId': userId,
        'activity': activity
    };
    this.logs.log(log).subscribe((data) => {
        console.log('logged', data);
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
}
  getUsersToVerify() {
    this.initApproval();
    this.users = [];
    this.apiSvc.getUsersToApprove().subscribe(data => {
      this.response = JSON.parse(data);
       this.arrs = this.response.toverify;
       console.log('users to approve', this.arrs);
      if (this.arrs.length > 0) {
       for (let i = 0; i < this.arrs.length; i++) {
         const user = {
            userId: this.arrs[i].id,
            fullName: this.arrs[i].fullName,
            groupName: this.arrs[i].groupName,
            counter: this.arrs[i].counter,
            createdAt: this.arrs[i].createdAt,
            createdBy: this.arrs[i].createdBy,
            isActive: false
        };
        this.users.push(user);
        }
      this.users.sort((a, b) => a.counter > b.counter);
      console.log('reponse', this.users);
    } else {
      return  this.toastr.warning(this.response.respMessage, 'Alert!', { timeOut: 1500 });
    }

    });
  }

  verifyUsers() {
   for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].isActive) {
         if (this.users[i].updatedBy === this.rightId) {
          this.toastr.warning('User cannot approve user/s they enrolled', 'Alert!', { timeOut: 1500 });
          return;  
           } else {
         console.log('users', this.users[i].isActive);
         this.approve.push({'id': this.users[i].userId,'approvedBy': this.rightId});
         console.log('to approve', this.approve);
        }
      }
    }
    console.log('user', this.user.isActive);
     this.apusers = this.approve;
     console.log(this.apusers);
    if (this.apusers.length <= 0) {
      return  this.toastr.warning('Kindly select at least one user to approve', 'Alert!', { timeOut: 1500 });
     }
     this.blockUI.start('Approving data...');
     this.apiSvc.approveUsers(this.apusers).subscribe((res:any) => {
       this.response = JSON.parse(res);
      console.log(this.response);
       if (this.response.status === true) {
         for (let i of this.apusers) {
           console.log('i', i);
              this.log(this.rightId, 'approved user id' + i.id);
         }
         this.users = [];
         this.fromDate = '';
         this.toDate = '';
          this.blockUI.stop();
           this.toastr.success(this.response.respMessage, 'Success!', {timeOut: 3000});
           return;
       } else {
          this.blockUI.stop();
           this.toastr.warning(this.response.respMessage, 'Alert!', {timeOut: 3000});
           return;
       }
     });
  }

}
