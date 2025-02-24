import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Logs } from 'selenium-webdriver';
import { LogsService } from '../../services/logs.service';
import { WebSocketServiceService } from '../../services/web-socket-service.service';
import { TellerService } from '../../services/teller.service';

@Component({
  selector: 'app-verify-teller',
  templateUrl: './verify-teller.component.html',
  styleUrls: ['./verify-teller.component.css']
})
export class VerifyTellerComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  fileText: any;
  enroleMode = true;
  inquireMode = false;
  verificationType = 'SEC';
  locl: any;
  account_number: any;
  toCaptureBtns = ['right', 'thumbs', 'left'];
  btnClass = false;
  btnsCaptured = [];
  captured = ['T5', 'L6', 'L7', 'L8', 'L9', 'T0', 'R1', 'R2', 'R3', 'R4'];
  searchText;
  closeResult: string;
  String: any = {};
  matchResp: any;
  customerNo: any;
  leftMissing: any = [];
  rightMissing: any = [];
  thumbsMissing: any = [];
  missing: any = [];
  missingStatus = false;
  resp: any;
  element: HTMLImageElement;
  $event: NgbTabChangeEvent;
  retries = 0;
  is_edit = true;
  custbios = [];
  fingresp: any;
  custResp: any;
  profileSource: any;
  branches: any;
  pbuno: any;
  result: any;
  respimage: any = [];
  bioDetails = true;
  profDetails = false;
  fsource;
  fingerPrints = [];
  bios: any = [];
  fingerprint = [];
  printCount: any;
  bio;
  myBehaviorSubject$;
  accountNumber: any;
  raws = [];
  profpic: any;
  custForm: FormGroup;
  custInquiry: any;
  respo: any;
  observable$;
  searchSubject$ = new Subject<string>();
  teller: any = {};
  groups: any;
  tellers: any = [];
  userGroups: any = [];
  response: any = null;
  editMode = false;
  isNew = false;
  afi: any = {};
  isVerified = false;
  title: string;
  button: string;
  source: LocalDataSource;
  length: any;
  otc: any = {};
  rightId: any;
  dupResult: number;
  disabled: boolean;
  greetings: any[];
  capturedThumbs: any = [];
  capturedRPrints: any = [];
  capturedFings: any = [];
  stompClient: any;
  hands: any;
  leftFP: any;
  rightFP: any;
  thumbsFP: any;
  hand: { 'req': any; };
  branch: any;
  groupid: any;

  // manage rights buttons
  canViewUserProfile;
  canAddUserProfile;
  canEditUserProfile;

  constructor(private apiService: BioService,
    private modalService: NgbModal,
    private modalService2: NgbModal, private logs: LogsService, private sockService: WebSocketServiceService,
    private custSvc: CustomerService, @Inject(DOCUMENT) private document: any,
    private toastr: ToastrService, private tellerSvc: TellerService, private biosvc: BioService) {
  }
  settings;

  ngOnInit() {
    this.otc = JSON.parse(localStorage.getItem('otc'));
    this.rightId = this.otc.rightId;
    // the specific branch of the logged in user
    this.branch = this.otc.branch;
    this.groupid = this.otc.group;
    this.gtTellers();

    this.getUserAssignedRights();
    this.settings = {
      mode: 'external',
      actions: {
        delete: false,
        add: false,
        position: 'right',
      },
      columns: {
        counter: {
          title: '#',
          filter: false
        },
        tellerName: {
          title: 'Teller Name',
          filter: true
        },
        enrolledOn: {
          title: 'Enrolled On',
          filter: true
        },
        createdBy: {
          title: 'Enrolled By',
          filter: true
        }

      },
      edit: {
        // tslint:disable-next-line:max-line-length
        editButtonContent: (this.canEditUserProfile === true) ? '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>' : '',
        saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
        cancelButtonContent: '<i class="ti-close text-danger"></i>'
      },
      pager: {
        perPage: 200
      }
    };
  }

  getUserAssignedRights() {
    const userAssignedRights = this.otc.userAssignedRights;
    console.log('userAssignedRights: ', userAssignedRights);
    let rightsIndex = -1;
    for (let i = 0; i < userAssignedRights[0].rights.length; i++) {
      console.log('userAssignedRights path: ' + userAssignedRights[0].rights[i].path);
      if (userAssignedRights[0].rights[i].path === '/masters/verifyEnrolledTellers') {
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

  initEditcustomer($event) {
    console.log('customer', $event.data);
    this.editMode = true;
    this.isVerified = true;
    this.teller.id = $event.data.id;
    this.teller.active = $event.data.active;
    this.teller.branchId = $event.data.branchId;
    this.teller.tellerName = $event.data.tellerName;
    this.teller.customerId = $event.data.customerId;
    this.teller.mnemonic = $event.data.mnemonic;
    this.teller.createdBy = $event.data.createdBy;
    this.teller.usersId = $event.data.usersId;
    this.isNew = false;
    this.title = 'Edit Profile';
    this.button = 'Update Profile';
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  remove(arr, item) {
    for (let i = arr.length; i--;) {
      if (arr[i] === item) {
        arr.splice(i, 1);
      }
    }
  }
  containsObject(obj, list) {
    console.log('works %%%', obj);
    console.log('works %%%', list);
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return false;
      }
    }
    console.log('works %%%');
    return true;
  }
  private getLeftPrint(data) {
    this.btnClass = false;
    // this.apiService.leftFing().subscribe((data) => {
    let oj = [];
    const arr = [6, 7, 8, 9];

    this.leftMissing.forEach((lm) => {
      this.remove(arr, lm);
      oj = arr;
      console.log('fings fings &&&', oj);
    });

    this.leftFP = data;

    if (oj.length > 0) {
      oj.forEach((fp, i) => {
        const pri = this.leftFP.leftHand.filter(pos => Number(pos.position) === i);
        if (pri.length > 0) {
          pri.forEach((res) => {
            this.capturedFings.push({
              position: fp, quality: res.quality,
              fingerPrint: res.fingerprint
            });
            this.fingerPrints.push({
              position: fp, quality: res.quality,
              fingerPrint: res.fingerprint
            });
          });
        }
      });
    } else {
      let p = 6;
      this.leftFP.leftHand.forEach((print) => {
        this.capturedFings.push({
          position: p, quality: print.quality,
          fingerPrint: print.fingerprint
        });
        this.fingerPrints.push({
          position: p, quality: print.quality,
          fingerPrint: print.fingerprint
        });
        p++;
      });
    }
    console.log('finger prints ', this.fingerPrints);
    console.log('finger prints ', this.capturedFings);
    this.capturedFings.forEach((pt) => {
      const pp = pt.position;
      console.log('pos lll', pt.position);
      this.document.getElementById('L' + pp).src = 'assets/images/enroll/SL' + pp + '.png';
    });
    this.btnsCaptured.push('left');
    console.log('btns cp', this.btnsCaptured);
    (<HTMLInputElement>document.getElementById('left')).disabled = true;
    // });

  }

  secugenVerify() {
    if (this.teller.createdBy === this.rightId) {
      return this.toastr.warning('User cannot approve customer they enrolled', 'Alert!', { timeOut: 1500 });
    } else {
      this.apiService.capturePrint().subscribe((data: Array<object>) => {
        this.bio = data;
        const profilePrint: any = {};
        if (this.bio.ErrorCode === 0) {

          if (this.bio !== null && this.bio.BMPBase64.length > 0) {
            this.document.getElementById('finger').src =
              'data:image/bmp;base64,' + this.bio.BMPBase64;
            profilePrint.singlePrint = {
              position: 0,
              fingerPrint: this.bio.BMPBase64
            };
            profilePrint.transactionType = 'I';
            profilePrint.customerId = this.teller.customerId;
            profilePrint.transactionId = '';
            this.afisVerifyUser(profilePrint);
          }
        } else {
          return this.toastr.warning('failed to Capture finger print, please retry', 'Warning!');
        }
      });
    }
  }

  afisVerifyUser($event) {
    this.apiService.afisVer($event).subscribe(dat => {
      this.response = dat;

      if (this.response.status === true) {
        this.editMode = false;
        this.upCustDet();
      } else {
        return this.toastr.warning('Failed to verify. Try Again!', 'Warning!', { timeOut: 3000 });
      }
    }, error => {

      return this.toastr.error('Error in loading data.', 'Error!', { timeOut: 3000 });
    });
  }

  private getRightPrint(data) {
    this.btnClass = false;
    console.log('works');
    //   this.apiService.rightFing().subscribe((data) => {
    const ar = [1, 2, 3, 4];
    let pngs = [];

    this.rightMissing.forEach((rm) => {
      this.remove(ar, rm);
      pngs = ar;
      console.log('fings fings &&&', pngs);
    });

    this.rightFP = data;
    if (pngs.length > 0) {
      pngs.forEach((item, i) => {
        const fo = this.rightFP.rightHand.filter(print =>
          Number(print.position) === i);
        if (fo.length > 0) {
          fo.forEach((fpr) => {
            this.fingerPrints.push({ position: item, quality: fpr.quality, fingerPrint: fpr.fingerprint });
            this.capturedRPrints.push({ position: item, quality: fpr.quality, fingerPrint: fpr.fingerprint });
          });
        }
      });
    } else {
      let p = 1;
      this.rightFP.rightHand.forEach((print) => {
        this.capturedRPrints.push({
          position: p, quality: print.quality,
          fingerPrint: print.fingerprint
        });
        this.fingerPrints.push({
          position: p, quality: print.quality,
          fingerPrint: print.fingerprint
        });
        p++;
      });
    }
    console.log('finger prints ', this.fingerPrints);
    console.log('finger prints ', this.capturedRPrints);
    this.capturedRPrints.forEach((fing) => {
      const pt = fing.position;
      this.document.getElementById('R' + pt).src = 'assets/images/enroll/SR' + pt + '.png';
    });
    this.btnsCaptured.push('right');
    console.log('btns cp', this.btnsCaptured);
    (<HTMLInputElement>document.getElementById('right')).disabled = true;
    //  });

  }

  private getThumbs(data) {
    this.btnClass = false;
    this.element = document.createElement('img');
    const toos = [0, 5];
    let ths = [];

    this.thumbsMissing.forEach((thumb) => {
      this.remove(toos, thumb);
      ths = toos;
      console.log('fings fings &&&', ths);
    });

    this.thumbsFP = data;

    if (ths.length > 0) {
      ths.forEach((pos, index) => {
        const thu = this.thumbsFP.thumbs.filter(thum => Number(thum.position) === index);
        if (thu.length > 0) {
          thu.forEach((res) => {
            this.fingerPrints.push({
              position: pos, quality: res.quality,
              fingerPrint: res.fingerprint
            });
            this.capturedThumbs.push({
              position: pos, quality: res.quality,
              fingerPrint: res.fingerprint
            });
          });
        }
      });
    } else {
      let t = 0;
      this.thumbsFP.thumbs.forEach((te) => {
        this.fingerPrints.push({
          position: t, quality: te.quality,
          fingerPrint: te.fingerprint
        });
        this.capturedThumbs.push({
          position: t, quality: te.quality,
          fingerPrint: te.fingerprint
        });
        t += 5;
      });
    }
    console.log('captured finger prints ', this.fingerPrints);
    console.log('capture thumbs ', this.capturedThumbs);
    this.capturedThumbs.forEach((thumbs) => {
      const pt = thumbs.position;
      this.document.getElementById('T' + pt).src = 'assets/images/enroll/ST' + pt + '.png';
    });
    this.btnsCaptured.push('thumbs');
    console.log('btns cp', this.btnsCaptured);
    (<HTMLInputElement>document.getElementById('thumbs')).disabled = true;
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }
  private sendName(fin) {
    // this.btnsCaptured.push(fin);
    console.log('captured fingerprints', this.btnsCaptured);
    this.btnClass = true;

    let count: any = 0;
    if (fin === 'left' && this.leftMissing.length === 4) {
      return this.toastr.warning('No Left hand prints to capture, already specified all are missing ', 'Alert!', { timeOut: 4000 });
    }

    if (fin === 'thumbs' && this.thumbsMissing.length === 2) {
      return this.toastr.warning('No thumbs to capture , you already specified all are missing', 'Alert!', { timeOut: 4000 });
    }
    if (fin === 'right' && this.rightMissing.length === 4) {
      return this.toastr.warning('No right hand prints to capture, already specified all are missing', 'Alert!', { timeOut: 4000 });
    }
    if (this.leftMissing.length > 0 || this.rightMissing.length > 0 || this.thumbsMissing.length > 0) {
      this.missingStatus = true;
      if (fin === 'left') {
        count = 4 - this.leftMissing.length;
        this.missing = this.leftMissing;
        console.log('$$missing left', this.missing);
      } else if (fin === 'right') {
        count = 4 - this.rightMissing.length;
        this.missing = this.rightMissing;
        console.log('$$missing right', this.missing);
      } else if (fin === 'thumbs') {
        count = 2 - this.thumbsMissing.length;
        this.missing = this.thumbsMissing;
        console.log('$$missing thumbs', this.missing);
      } else if (fin === 'stop') {
        this.missing = [];
        count = 0;
        this.missingStatus = false;
      }
    }
    if (fin === 'stop') {
      this.missing = [];
      count = 0;
      this.btnClass = false;
      this.missingStatus = false;
    }

    this.hand = {
      'req': fin
    };
    console.log({ 'name': fin, 'missingStatus': this.missingStatus, 'missingCount': count, 'missing': this.missing });
    // this.stompClient.send(
    //   '/app/getImage',
    //   {},
    //   JSON.stringify({ 'name': fin, 'missingStatus': this.missingStatus,
    //   'missingCount': count, 'missing': this.missing, 'customerId': this.account_number })
    // );
    this.apiService.getFingerPrintImage({
      'name': fin, 'missingStatus': this.missingStatus,
      'missingCount': count, 'missing': this.missing, 'customerId': this.account_number
    }).subscribe(data => {
      this.hands = data;
      if (this.hands.status === true) {
        if (this.hands.hand === 'left') {
          this.getLeftPrint(this.hands);
          // this.getLeftPrint();
        } else if (this.hands.hand === 'right') {
          this.getRightPrint(this.hands);
          // this.getRightPrint();
        } else if (this.hands.hand === 'thumbs') {
          this.getThumbs(this.hands);
        }
      } else {
        this.btnClass = false;
        return this.toastr.warning(this.hands.responseMessage, 'Alert!', { timeOut: 4000 });
      }
    }, error => {
      console.log('error', error);
    });
  }
  // private sendName(fin) {
  //   let count: any = 0;
  //   if ( fin === 'left' && this.leftMissing.length === 4) {
  //       return this.toastr.warning('No Left hand prints to capture, already specified all are missing ', 'Alert!', { timeOut: 4000 });
  //   }
  //   if (fin === 'thumbs' && this.thumbsMissing.length === 2) {
  //       return this.toastr.warning('No thumbs to capture , you already specified all are missing', 'Alert!', { timeOut: 4000 });
  //   }
  //   if (fin === 'right' && this.rightMissing.length === 4) {
  //       return this.toastr.warning('No right hand prints to capture, already specified all are missing', 'Alert!', { timeOut: 4000 });
  //   }
  //     if ( this.leftMissing.length > 0 || this.rightMissing.length || this.thumbsMissing.length ) {
  //       this.missingStatus = true;
  //       if (fin === 'left') {
  //           count = 4 - this.leftMissing.length;
  //           this.missing = this.leftMissing;
  //           console.log('$$missing left', this.missing);
  //         } else if (fin === 'right') {
  //             count = 4 - this.rightMissing.length;
  //            this.missing = this.rightMissing;
  //            console.log('$$missing right', this.missing);
  //         } else if (fin === 'thumbs') {
  //             count = 2 - this.thumbsMissing.length;
  //            this.missing = this.thumbsMissing;
  //            console.log('$$missing thumbs', this.missing);
  //         } else if (fin === 'stop') {
  //                 this.missing = [];
  //                 count = 0;
  //                 this.btnClass = false;
  //                 this.missingStatus = false;
  //           }
  //       }
  //       if (fin === 'stop') {
  //         this.missing = [];
  //         count = 0;
  //         this.missingStatus = false;
  //       }
  //     this.hand = {
  //         'req': fin
  //     };
  //    console.log({ 'name': fin, 'missingStatus': this.missingStatus,
  //    'missingCount': count, 'missing': this.missing });
  //   // this.stompClient.send(
  //   //   '/app/getImage',
  //   //   {},
  //   //   JSON.stringify({ 'name': fin, 'missingStatus': this.missingStatus,
  //   //   'missingCount': count, 'missing': this.missing })
  //   // );
  //   this.apiService.getFingerPrintImage({ 'name': fin, 'missingStatus': this.missingStatus,
  //   'missingCount': count, 'missing': this.missing, 'customerId': this.account_number }).subscribe(data => {
  //       this.hands = data;
  //       if ( this.hands.status === true) {
  //           if (this.hands.hand === 'left') {
  //              this.getLeftPrint(this.hands);
  //           // this.getLeftPrint();
  //            } else if ( this.hands.hand === 'right') {
  //               this.getRightPrint(this.hands);
  //             // this.getRightPrint();
  //           } else if (this.hands.hand === 'thumbs') {
  //               this.getThumbs(this.hands);
  //           }
  //         } else {
  //             this.btnClass = false;
  //             return this.toastr.warning(this.hands.responseMessage, 'Alert!', { timeOut: 4000 });
  //         }
  //   }, error => {
  //       console.log('error', error);
  //   });
  // }

  showGreeting(message) {
    console.log('message', message);
    this.greetings.push(message);
  }

  gtTellers() {
    this.blockUI.start('Loading data...');
    this.tellerSvc.getTellersToApprove(this.branch, this.groupid).subscribe(data => {
      this.tellers = data;
      console.log('tellers', this.tellers);
      this.tellers = this.tellers.collection;
      console.log('tellers##', this.tellers);
      this.blockUI.stop();
    }, error => {
      this.blockUI.stop();
      return this.toastr.error('Error in inquiring Teller data.', 'Error!', { timeOut: 1500 });
    });
  }

  upCustDet() {
    const teller = {
      'customerId': this.teller.customerId,
      'verifiedBy': this.rightId,
      'verifiedOn': new Date()
    };
    console.log('timestamp', new Date());
    this.tellerSvc.approveTeller(teller).subscribe((response) => {
      this.response = response;


      if (this.response.status === true) {
        this.log(this.rightId, 'approved the enrollment of staff with customerId ' + this.teller.customerId);
        this.teller = {};
        this.editMode = false;
        this.gtTellers();
        this.blockUI.stop();
        return this.toastr.success('Profile details upddated successfuly.', ' Success!');
      } else {
        if(this.response.respMessage === 'HpptRestProcessor Failed'){
          this.log(this.rightId, 'attempted to approve the enrollment of staff with customerId ' + this.teller.customerId + ' .HpptRestProcessor Failed');
          this.blockUI.stop();
          return this.toastr.warning('Error while connecting to t24', 'Warning!');
        }else if(this.response.respMessage === 'HpptRestProcessor Exception'){
          this.log(this.rightId, 'attempted to approve the enrollment of staff with customerId ' + this.teller.customerId + ' .HpptRestProcessor Exception');
          this.blockUI.stop();
          return this.toastr.warning('Exception while connecting to t24', 'Warning!');
        }else{
          this.log(this.rightId, 'attempted to approve the enrollment of staff with customerId ' + this.teller.customerId);
          this.blockUI.stop();
          return this.toastr.warning('There was problem updating profile details .', 'Warning!');
        }
      }
    }, error => {
      this.log(this.rightId, 'attempted to approve the enrollment of staff with customerId ' + this.teller.customerId + 'but it failed due to an error');
      this.blockUI.stop();
      return this.toastr.error('Error aproving Staff.', 'Error!', { timeOut: 1500 });
    });
  }

  afisUpdate() {
    if (this.teller.usersId === this.rightId) {
      return this.toastr.warning('User cannot approve customer they enrolled', 'Alert!', { timeOut: 1500 });
    } else {
      console.log('customer', this.teller);
      const customer = {
        'customerId': this.teller.customerId,
        'fingerPrints': this.fingerPrints
      };
      console.log('customer to authorize..', customer);
      //Ensure finger prints are captured
      if (this.fingerPrints.length > 0) {
        this.biosvc.afisVerify(customer).subscribe(data => {
          this.respo = data;
          console.log('repo', this.respo);
          if (this.respo.status === true) {
            this.editMode = false;
            this.upCustDet();
          } else {
            this.blockUI.stop();
            return this.toastr.warning('Failed to verify. Try again', 'Warning!');
          }
        }, error => {
          this.blockUI.stop();
          return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 1500 });
        });
      } else {
        this.blockUI.stop();
        return this.toastr.error('Capture at least one finger print.', 'Error!', { timeOut: 1500 });
      }
    }
  }
  resetDevice() {
    this.fingerPrints = [];
    this.element = document.createElement('img');
    this.fingerPrints = [];
    this.teller.fingerPrints = [];
    this.btnClass = false;
    this.capturedFings = [];
    this.capturedRPrints = [];
    this.capturedThumbs = [];
    let captS: any;
    this.btnsCaptured = [];
    console.log('captured', this.captured);
    for (let i = 0; i < this.captured.length; i++) {
      captS = this.captured[i];
      console.log('position', captS);
      this.document.getElementById(captS).src = 'assets/images/enroll/' + captS + '.png';
      (<HTMLInputElement>document.getElementById('left')).disabled = false;
      (<HTMLInputElement>document.getElementById('thumbs')).disabled = false;
      (<HTMLInputElement>document.getElementById('right')).disabled = false;
    }
    console.log('removed bios', this.capturedRPrints);
    return this.toastr.success('Device was reset successfully .. .', 'Success!', { timeOut: 3000 });
  }

  rejectTeller() {
    const tellerDetails = {
      'customerId': this.teller.customerId,
      'rejectedBy': this.rightId
    };
    if (this.rightId == this.teller.createdBy) {
      return this.toastr.error('Cannot reject staff that one has created', 'Error!', { timeOut: 4000 });
    }
    this.blockUI.start('Rejecting the Staff...');
    //remove teller from database
    this.tellerSvc.rejectTellerApproval(tellerDetails).subscribe(data => {
      this.respo = data;
      if (this.respo.status === true) {
        this.log(this.rightId, 'rejected the staff ' + tellerDetails.customerId);
        //remove from abis
        this.biosvc.afisRemove(tellerDetails).subscribe(data => {
          if (this.respo.status === true) {
            this.editMode = false;
            this.log(this.rightId, 'removed staff details of ' + tellerDetails.customerId);
            this.gtTellers();
            return this.toastr.success('Staff was rejected successfully.', 'Success!');
          } else {
            this.log(this.rightId, 'attempted to remove staff details of ' + tellerDetails.customerId);
            return this.toastr.success('Staff was not removed successfully.', 'Warning!');
          }
        }, error => {
          return this.toastr.error('Error while attempting to remove the staff print details', 'Error!', { timeOut: 4000 });
        });
      } else {
        this.log(this.rightId, 'attempted to reject the staff ' + tellerDetails.customerId);
        return this.toastr.warning('There was a problem rejecting staff details. ', 'Warning!');
      }
    }, error => {
      return this.toastr.error('Error while attempting to reject the staff.', 'Error!', { timeOut: 4000 });
    });
  }

  open2(content) {
    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  open(content) {
    this.modalService2.open(content, { windowClass: 'dark-modal' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  cancelEnr() {
    this.editMode = false;
    this.teller = {};
    this.gtTellers();
    this.btnClass = false;
    this.teller.bios = [];
    this.bios = [];
    this.btnsCaptured = [];
    this.btnClass = false;
    this.fingerprint = [];
  }

  cancel() {
    this.btnClass = false;
    this.editMode = false;
    this.account_number = '';
    this.bios = [];
    this.custbios = [];
    this.teller = {};
    this.btnsCaptured = [];
    this.btnClass = false;
    this.profpic = '';

  }

  ngOnDestroy() {
    this.editMode = false;
    this.account_number = '';
    this.bios = [];
    this.custbios = [];
    this.disconnect();
    this.teller = {};
    this.profpic = '';
  }


}
// export let settings = {
//   mode: 'external',
//   actions: {
//     delete: false,
//     add: false,
//     position: 'right',
//   },
//   columns: {
//     counter: {
//       title: '#',
//       filter: false
//     },
//     tellerName: {
//       title: 'Teller Name',
//       filter: true
//     },
//     enrolledOn: {
//       title: 'Enrolled On',
//       filter: true
//     },
//     createdBy: {
//       title: 'Enrolled By',
//       filter: true
//     }
//
//   },
//   edit: {
//     // tslint:disable-next-line:max-line-length
//     editButtonContent: (this.canAddUserProfile === true) ? '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>' : '',
//     saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
//     cancelButtonContent: '<i class="ti-close text-danger"></i>'
//   },
//   pager: {
//     perPage: 200
//   }
// };
