import { WebSocketServiceService } from './../../services/web-socket-service.service';
import { RegionService } from './../../services/region.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LogsService } from '../../services/logs.service';
import { TellerService } from '../../services/teller.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {
    fileText: any;
    enroleMode = true;
    inquireMode = false;
    locl: any;
    staffId: any;
    account_number = ' ';
    captured = ['T5', 'L6', 'L7', 'L8', 'L9', 'T0', 'R1', 'R2',  'R3', 'R4'];
    toCaptureBtns = ['right', 'thumbs', 'left'];
    btnsCaptured = [];
    searchText;
    String: any = {};
    tellerInq: any;
    submited = false;
    fings: any = [];
    resp: any;
    btnClass = false;
    element: HTMLImageElement;
    $event: NgbTabChangeEvent;
    custbios = [];
    custResp: any;
    profileSource: any;
    branches: any;
    toCapture: any;
    result: any;
    respimage: any = [];
    bioDetails = true;
    profDetails = false;
    fsource;
    enrolledFPrints = [];
    otc: any = {};
    bioconfigs: any = {};
    bios: any = [];
    fingerprint = [];
    bio;
    myBehaviorSubject$;
    accountNumber;
    profForm: boolean;
    rightId: any;
    await = false;
    profpic: any;
    form: FormGroup;
    tellerForm: FormGroup;
    missingFp: FormGroup;
    custInquiry: any;
    customer: any = {};
    customers: any = [];
    countries: any = [];
    response: any = null;
    editMode = false;
    leftFP: any = {};
    rightFP: any = {};
    thumbsFP: any = {};
    isNew = false;
    afi: any = {};
    isVerified = false;
    inquiryForm: FormGroup;
    capturedFings: any = [];
    capturedRPrints: any = [];
    capturedLPrints: any = [];
    capturedThumbs: any = [];
    title: string;
    profType = ' ';
    button: string;
    hands: any = {};
    source: LocalDataSource;
    length: any;
    leftMissing: any = [];
    rightMissing: any = [];
    thumbsMissing: any = [];
    missing: any = [];
    custrg: any = [];
    teller: any;
    missingStatus = false;
    greetings: string[] = [];
    disabled: boolean;
    isDisabled = true;
    hand: any = {};
    name: string;
    sockResp: any = {};
    private stompClient = null;
    constructor( private tellerSvc: TellerService, private apiService: BioService,
         private fb: FormBuilder, private sockService: WebSocketServiceService,
        private custSvc: CustomerService, @Inject(DOCUMENT) private document: any,
        private toastr: ToastrService, private regionService: RegionService, private logs: LogsService) {

  }
  settings = settings;
  companies: any[] = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  activeBranches: any = [];
  loading = false;
  companiesNames = ['Miškas', 'Žalias', 'Flexigen'];
  ngOnInit() {
    this.gtActivebranches();
       this.gtCustomers();
      this.gtCountries();
      // this.updateT4Customer(8851600, true);
      this.otc = JSON.parse(localStorage.getItem('otc'));
      this.rightId = this.otc.rightId;

      this.companiesNames.forEach((c, i) => {
        this.companies.push({ id: i, name: c });
        this.dropdownList = [
            { item_id: 0, item_text: 'RIGHT THUMB' },
            { item_id: 1, item_text: 'RIGHT INDEX' },
            { item_id: 2, item_text: 'RIGHT MIDDLE' },
            { item_id: 3, item_text: 'RIGHT RING' },
            { item_id: 4, item_text: 'RIGHT LITTLE' },
            { item_id: 5, item_text: 'LEFT THUMB' },
            { item_id: 6, item_text: 'LEFT INDEX' },
            { item_id: 7, item_text: 'LEFT MIDDLE' },
            { item_id: 8, item_text: 'LEFT RING' },
            { item_id: 9, item_text: 'LEFT LITTLE' }
          ];
          this.dropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: '',
            unSelectAllText: '',
            itemsShowLimit: 6,
            allowSearchFilter: true
          };
    });
  }
  getConfigs() {
    this.bioconfigs = JSON.parse(localStorage.getItem('bio.glob#$$#'));
    return this.bioconfigs;
  }
  addTag(name) {
    return { name: name, tag: true };
    }

  onItemSelect(item: any) {
      const thumbs = [0, 5];
      const rght = [1, 2, 3, 4];
      const fings = [6, 7, 8, 9];
      const lft = [6, 7, 8, 9];


      if (lft.includes(item.item_id)) {
          this.leftMissing.push(item.item_id);
          fings.splice(item.item_id, 1);
        this.fings.push(fings);



          this.enrolledFPrints.push({position: item.item_id, quality: 0, fingerPrint: 'missing'});


      } else if (rght.includes(item.item_id)) {
            this.rightMissing.push(item.item_id);
            this.enrolledFPrints.push({position: item.item_id, quality: 0, fingerPrint: 'missing'});


      } else if (thumbs.includes(item.item_id)) {
           this.thumbsMissing.push(item.item_id);
           this.enrolledFPrints.push({position: item.item_id, quality: 0, fingerPrint: 'missing'});


      }
  }


  onItemUnselect(item: any) {
       const ri = this.enrolledFPrints.filter(x => x.position === item.item_id);
       const rh = this.rightMissing.indexOf(item.item_id);
       const le = this.leftMissing.indexOf(item.item_id);
       const th = this.thumbsMissing.indexOf(item.item_id);
       if (rh > -1) {
        this.rightMissing.splice(ri, 1);

       }
       if (le > -1) {
         this.leftMissing.splice(le, 1);

      }
      if (th > -1) {
         this.thumbsMissing.splice(th, 1);

      }
     if (ri !== undefined) {
        for (let i = 0; i < this.enrolledFPrints.length; i++ ) {
        if (this.enrolledFPrints[i].position === item.item_id) {
            this.enrolledFPrints.splice(i, 1);
                }
            }


        }
  }
  onSelectAll(items: any) {

  }

addTagPromise(name) {
    return new Promise((resolve) => {
        this.loading = true;
        setTimeout(() => {
            resolve({ id: 5, name: name, valid: true });
            this.loading = false;
        }, 1000);
    });
}

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

private getFingerPrint(fin) {
       // this.btnsCaptured.push(fin);

    this.btnClass = true;

    let count: any = 0;
    if ( fin === 'left' && this.leftMissing.length === 4) {
        return this.toastr.warning('No Left hand prints to capture, already specified all are missing ', 'Alert!', { timeOut: 4000 });
    }

    if (fin === 'thumbs' && this.thumbsMissing.length === 2) {
        return this.toastr.warning('No thumbs to capture , you already specified all are missing', 'Alert!', { timeOut: 4000 });
    }
    if (fin === 'right' && this.rightMissing.length === 4) {
        return this.toastr.warning('No right hand prints to capture, already specified all are missing', 'Alert!', { timeOut: 4000 });
    }
      if ( this.leftMissing.length > 0 || this.rightMissing.length > 0 || this.thumbsMissing.length > 0 ) {
        this.missingStatus = true;
        if (fin === 'left') {
            count = 4 - this.leftMissing.length;
            this.missing = this.leftMissing;

          } else if (fin === 'right') {
              count = 4 - this.rightMissing.length;
             this.missing = this.rightMissing;

          } else if (fin === 'thumbs') {
              count = 2 - this.thumbsMissing.length;
             this.missing = this.thumbsMissing;

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

    // this.stompClient.send(
    //   '/app/getImage',
    //   {},
    //   JSON.stringify({ 'name': fin, 'missingStatus': this.missingStatus,
    //   'missingCount': count, 'missing': this.missing, 'customerId': this.account_number })
    // );
    this.apiService.getFingerPrintImage({ 'name': fin, 'missingStatus': this.missingStatus,
    'missingCount': count, 'missing': this.missing, 'customerId': this.account_number }).subscribe(data => {
        this.hands = data;
        if ( this.hands.status === true) {
            if (this.hands.hand === 'left') {
                 this.getLeftPrint(this.hands);
              // this.getLeftPrint();
             } else if ( this.hands.hand === 'right') {
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

    });
  }

  private showGreeting(message) {

    this.greetings.push(message);
}
disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

   this.setConnected(false);

}

log(userId, activity) {
    const log = {
        'userId': userId,
        'activity': activity
    };

    this.logs.log(log).subscribe((data) => {

    }, error => {
        return this.toastr.error('Error logging.', 'Error!', { timeOut: 4000 });
    });
}

remove(arr, item) {
    for (let i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}
containsObject(obj, list) {


    let i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return false;
        }
    }

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

        });

        this.leftFP = data;

        if (oj.length > 0) {

            oj.forEach((fp, i) => {
                const pri = this.leftFP.leftHand.filter(pos => Number(pos.position) === i);
                if (pri.length > 0) {
                    pri.forEach((res) => {
                        this.capturedFings.push({position: fp, quality: res.quality,
                            fingerPrint: res.fingerprint});
                        this.enrolledFPrints.push({position: fp, quality: res.quality,
                            fingerPrint: res.fingerprint});
                    });
                }
            });
        } else {
            let p = 6;
            this.leftFP.leftHand.forEach((print) => {
                this.capturedFings.push({position: p, quality: print.quality,
                    fingerPrint: print.fingerprint});
                this.enrolledFPrints.push({position: p, quality: print.quality,
                    fingerPrint: print.fingerprint});
                    p++;
            });
        }


           this.capturedFings.forEach((pt) => {
                const pp = pt.position;

                this.document.getElementById('L' + pp ).src = 'assets/images/enroll/SL' + pp + '.png';
           });
            this.btnsCaptured.push('left');

           (<HTMLInputElement>document.getElementById('left')).disabled = true;
      // });

}

private getRightPrint(data) {
    this.btnClass = false;

    // this.apiService.rightFing().subscribe((data) => {
       const ar = [1, 2, 3, 4];
       let pngs = [];

      this.rightMissing.forEach((rm) => {
         this.remove(ar, rm);
         pngs = ar;

      });

       this.rightFP = data;
          if (pngs.length > 0 ) {
                pngs.forEach((item, i) => {
                    const fo = this.rightFP.rightHand.filter(print =>
                        Number(print.position) === i );
                    if (fo.length > 0) {
                        fo.forEach((fpr) => {
                            this.enrolledFPrints.push({position: item, quality: fpr.quality, fingerPrint: fpr.fingerprint});
                            this.capturedRPrints.push({position: item, quality: fpr.quality, fingerPrint: fpr.fingerprint});
                        });
                    }
                });
          } else {
              let p = 1;
              this.rightFP.rightHand.forEach((print) => {
                this.capturedRPrints.push({position: p, quality: print.quality,
                    fingerPrint: print.fingerprint});
                this.enrolledFPrints.push({position: p, quality: print.quality,
                    fingerPrint: print.fingerprint});
                    p++;
              });
          }


          this.capturedRPrints.forEach((fing) => {
            const pt = fing.position;
            this.document.getElementById('R' + pt ).src = 'assets/images/enroll/SR' + pt + '.png';
          });
         this.btnsCaptured.push('right');

        (<HTMLInputElement>document.getElementById('right')).disabled = true;
   // });

}

private getThumbs(data) {
    this.btnClass = false;
    this.element = document.createElement('img');
    const toos = [0, 5];
    let ths = [];

    this.thumbsMissing.forEach((thumb) => {
        this.remove(toos, thumb);
        ths = toos;

    });

    this.thumbsFP = data;

        if ( ths.length > 0 ) {
            ths.forEach((pos, index) => {
                const thu = this.thumbsFP.thumbs.filter(thum => Number(thum.position) === index);
                if (thu.length > 0) {
                    thu.forEach((res) => {
                        this.enrolledFPrints.push({position: pos, quality: res.quality,
                            fingerPrint: res.fingerprint});
                            this.capturedThumbs.push({position: pos, quality: res.quality,
                                fingerPrint: res.fingerprint});
                    });
                }
            });
        } else {
            let t = 0;
            this.thumbsFP.thumbs.forEach((te) => {
                this.enrolledFPrints.push({position: t, quality: te.quality,
                    fingerPrint: te.fingerprint});
                    this.capturedThumbs.push({position: t, quality: te.quality,
                        fingerPrint: te.fingerprint});
                        t += 5;
            });
    }


    this.capturedThumbs.forEach((thumbs) => {
          const pt = thumbs.position;
         this.document.getElementById('T' + pt).src = 'assets/images/enroll/ST' + pt + '.png';
    });
    this.btnsCaptured.push('thumbs');

    (<HTMLInputElement>document.getElementById('thumbs')).disabled = true;
}

  initInquiry() {
    this.account_number = '';
    this.profType = '';
    this.editMode = true;
    this.isVerified = false;
    this.isNew = true;
    this.initInquery();
  }

  initInquery() {
    this.account_number = '';
    this.profType = '';
    this.staffId = '';
    this.editMode = true;
    this.isVerified = false;
    this.isNew = true;
    this.profType = '1';
    // this.inquiryForm = this.fb.group({
    //     profType: new FormControl('1', [Validators.required]),
    //     staffId: new FormControl('', [])
    // });
  }

  initTellerProfile() {

      this.tellerForm = this.fb.group({
        id: new FormControl(0),
        tellerId: new FormControl(this.tellerInq.payload.id, []),
        tellerStatus: new FormControl(this.tellerInq.payload.loginStatus, []),
        deptCode: new FormControl(this.tellerInq.payload.deptCode),
        recordStatus: new FormControl(this.tellerInq.payload.recordStatus, []),
        tellerEmail: new FormControl(this.tellerInq.payload.contactEmail, []),
        tellerName: new FormControl(this.tellerInq.payload.userName, []),
        tellerSignOnName: new FormControl(this.tellerInq.payload.signOnName, [Validators.required]),
        departmentCode: new FormControl(this.tellerInq.payload.departmentCode, [Validators.required]),
        companyCode: new FormControl(this.tellerInq.payload.companyCode),
        customerId: new FormControl(this.tellerInq.payload.cif, [Validators.required]),
        verified: 'N',
        customerType: 'TEllER',
        // waived: 'N',
        // waivedBy: 0,
        // waivedApprovedBy: 0,
        enrollStatus: 'N',
        verifiedBy: 0
    });
    this.missingFp = this.fb.group ({
        missingFingers: new FormControl()
    });

    this.editMode = true;
    this.isVerified = true;
    this.profForm = false;
    this.isNew = true;
    this.title = 'Add customer';
    this.button = 'Add customer';
  }
  initProfile() {
     this.form = this.fb.group({
        id: new FormControl(0),
        customerName: new FormControl(this.custInquiry.payload.shortName, [Validators.required]),
        active: new FormControl(false),
        createdBy: new FormControl(this.rightId),
        gender: new FormControl(this.custInquiry.payload.gender),
        customerIdNumber: new FormControl(this.custInquiry.payload.legalId),
        phoneNumber: new FormControl(this.custInquiry.payload.phoneNumber),
        country: new FormControl(this.custInquiry.payload.country),
        nationality: new FormControl(this.custInquiry.payload.nationality),
        mnemonic: new FormControl(this.custInquiry.payload.mnemonic, [Validators.required]),
        customerId: new FormControl(this.custInquiry.payload.id, [Validators.required]),
        branchCode: new FormControl(this.custInquiry.payload.accountOfficer, [Validators.required]),
        verified: 'N',
        customerType: 'CUST',
        waived: 'N',
        enrollStatus: 'N',
        waivedBy: 0,
        waivedApprovedBy: 0,
        verifiedBy: 0
      });
    this.missingFp = this.fb.group ({
        missingFingers: new FormControl()
    });

    this.editMode = true;
    this.isVerified = true;
    this.isNew = true;
    this.profForm = true;
    this.title = 'Add customer';
    this.button = 'Add customer';
    // this.gtBranches();
  }
  validateMissingFP($event: NgbTabChangeEvent) {

    if (this.thumbsMissing.length === 2) {
       $event.preventDefault();
       this.toastr.warning('empty thumbs', 'Alert!', { timeOut: 4000 });
   } else {

   }
}
  get c() { return this.tellerForm.controls; }
  get f() { return this.form.controls; }
  findInvalidControls() {
    const invalid = [];
     if (this.profType === '2') {
      const controls = this.tellerForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
            console.log('invalid', invalid);
        }
    }
     } else {
      const controls = this.form.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
            console.log('invalid', invalid);
        }
    }
     }

    return invalid;
  }
  onSubmit() {
    this.submited = true;
  }

  initEditcustomer($event) {
      this.gtActivebranches();

      this.form = this.fb.group ({
          id: new FormControl($event.data.id),
          customerName: new FormControl($event.data.customerName,
              [Validators.required, Validators.minLength(6), Validators.pattern('[a-zA-Z ]*')]),
          active: new FormControl($event.data.active),
          createdBy: new FormControl($event.data.createdBy),
          gender: new FormControl($event.data.gender, [Validators.required]),
          customerIdNumber: new FormControl($event.data.idNumber, [Validators.required,
            Validators.minLength(1), Validators.maxLength(15)]),
          phoneNumber: new FormControl($event.data.phoneNumber, [Validators.required]),
          country: new FormControl($event.data.country),
          nationality: new FormControl($event.data.nationality),
          mnemonic: new FormControl($event.data.mnemonic, [Validators.required]),
          customerId: new FormControl($event.data.customerId, [Validators.required]),
          verified: new FormControl($event.data.verified),
          verifiedBy: new FormControl($event.data.verifiedBy),
          customerType: new FormControl($event.data.customerType),
          branchCode: new FormControl($event.data.branchCode, [Validators.required])

      });
      this.editMode = true;
      this.isVerified = true;
      this.isNew = false;
      this.title = 'Edit Profile';
      this.button = 'Update Profile';

  }

  gtCustomers() {

    this.custSvc.gtCustomers().subscribe(data => {
      this.customers = data;

      this.customers = this.customers.collection;


    }, error => {

        return this.toastr.error('Error loading Customer data.', 'Error!', { timeOut: 4000 });
    });
  }

  gtCountries() {

    this.custSvc.gtCountries().subscribe(data => {
        this.countries = data;

        this.countries = this.countries.collection;


      });
  }

  gtBranches() {
      this.custSvc.gtBranches().subscribe(data => {
          this.branches = data;
      });
  }
  updateT4Customer(customer, status) {
      this.apiService.updateCustomerStatus(customer, status).subscribe(data => {
        this.customer = {};
        this.editMode = false;
        this.gtCustomers();
        this.enrolledFPrints = [];
        this.custInquiry = {};
        this.account_number = '';
        this.rightMissing = [];
        this.leftMissing = [];
        this.thumbsMissing = [];
        this.fings = [];
        this.capturedLPrints = [];
        this.capturedRPrints = [];
        return this.toastr.success('Profile details saved successfuly. Awaiting authorization', ' Success!');
      }, error => {

      });
  }
  storeTeller(teller) {

    this.tellerSvc.addTeller(teller).subscribe((response) => {
    this.response = response;
    if (this.response.status === true ) {
             if (teller.id === 0 ) {
                      this.log(this.rightId, 'added teller ' + this.customer.customerName);
              } else {
                  this.log(this.rightId, 'updated teller details  ' + this.customer.id);
              }
              this.customer = {};
              this.editMode = false;
              this.gtCustomers();
              this.enrolledFPrints = [];
              this.custInquiry = {};
              this.account_number = '';
              this.rightMissing = [];
              this.leftMissing = [];
              this.teller = {};
              this.thumbsMissing = [];
              this.fings = [];
              this.capturedLPrints = [];
              this.capturedRPrints = [];
              return this.toastr.success('Teller details saved successfuly. Awaiting authorization', ' Success!');
         } else {
              this.log(this.rightId, this.response.respMessage);

            return this.toastr.warning(this.response.respMessage, 'Warning!');
        }
  }, error => {
      this.log(this.rightId, 'error updating country details');

      return this.toastr.error('Error in updating Customer data.', 'Error!', { timeOut: 4000 });
    });
}
  storeCustomer() {

      this.apiService.addCustomer(this.customer).subscribe((response) => {
      this.response = response;
      if (this.response.status === true ) {
               if (this.customer.id === 0 ) {
                        this.log(this.rightId, 'added customer ' + this.customer.customerName);
                } else {
                    this.log(this.rightId, 'updated customer details  ' + this.customer.id);
                }
                this.customer = {};
                this.editMode = false;
                this.gtCustomers();
                this.enrolledFPrints = [];
                this.custInquiry = {};
                this.account_number = '';
                this.profType = '';
                this.rightMissing = [];
                this.leftMissing = [];
                this.thumbsMissing = [];
                this.fings = [];
                this.capturedLPrints = [];
                this.capturedRPrints = [];
                return this.toastr.success('Profile details saved successfuly. Awaiting authorization', ' Success!');
           } else {
                this.log(this.rightId, this.response.respMessage);

                return this.toastr.warning(this.response.respMessage, 'Warning!');
        }
    }, error => {
        this.log(this.rightId, 'error updating country details');

        return this.toastr.error('Error in updating Customer data.', 'Error!', { timeOut: 4000 });
      });
  }

  enrollCustomerDetails() {
      const missingCount = this.rightMissing.length + this.leftMissing.length + this.thumbsMissing;

      if (this.enrolledFPrints.length > 10) {
        return this.toastr.warning('It appears you have captured more than the required 10 finger prints, '
        + ' kindly reset device to continue!', 'Warning',
         { timeOut: 4000 });
       }
      if (missingCount === 0 && this.enrolledFPrints.length < 10 ) {
        this.log(this.rightId, 'trying to enroll less than 10 FP, ' + this.customer.customerName +
        ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);
         return this.toastr.error('Kindly ensure you have captured all the fingerprints to continue .', 'Error!', { timeOut: 4000 });
      }
        this.customer = this.form.value;
        this.customer.fingerPrints = this.enrolledFPrints;
        this.apiService.afisEnroll(this.customer).subscribe((response) => {
        this.response = response;

        if (this.response.status === true) {
                    this.log(this.rightId, 'enrolled ' + this.customer.customerName +
                    ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);
                this.storeCustomer();
            } else {
                this.log(this.rightId, 'failed to enroll ' + this.customer.customerName +
                    ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);
            this.toastr.warning(this.response.message + ' customer id ' + this.response.customerId + '' , 'Warning!', {timeOut: 4000});
           }
        }, error => {
            this.log(this.rightId, 'failed to enroll  ' + this.customer.customerName +
                    ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);
            return this.toastr.error('Error updating data.', 'Error!', { timeOut: 4000 });
        });
   // }
  }
  enrollTellerDetails() {
    const missingCount = this.rightMissing.length + this.leftMissing.length + this.thumbsMissing;

    if (this.enrolledFPrints.length > 10) {
      return this.toastr.warning('It appears you have captured more than the required 10 finger prints, '
      + ' kindly reset device to continue!', 'Warning',
       { timeOut: 4000 });
     }
    if (missingCount === 0 && this.enrolledFPrints.length < 10 ) {
      this.log(this.rightId, 'trying to enroll less than 10 FP, ' + this.teller.tellerName +
      ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);
       return this.toastr.error('Kindly ensure you have captured all the fingerprints to continue .', 'Error!', { timeOut: 4000 });
    }
       this.teller = this.tellerForm.value;
       this.teller.createdBy = this.rightId;

      // this.teller.fingerPrints = this.enrolledFPrints;
      const tller = {
          customerId: this.teller.customerId,
          fingerPrints: this.enrolledFPrints
      };
      this.apiService.afisEnroll(tller).subscribe((response) => {
      this.response = response;

      if (this.response.status === true) {
                  this.log(this.rightId, 'enrolled teller' + this.teller.tellerName +
                  ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);
                  this.teller.createdBy = this.rightId;
              this.storeTeller(this.teller);
          } else {
              this.log(this.rightId, 'failed to enroll teller ' + this.teller.tellerName +
                  ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);

          this.toastr.warning(this.response.message + ' teller id ' + this.response.customerId + '' , 'Warning!', {timeOut: 4000});
         }
      }, error => {
          this.log(this.rightId, 'failed to enroll  ' + this.teller.tellerName +
                  ' missing FP ' + missingCount + ' FP ' +  this.enrolledFPrints.length);

        return this.toastr.error('Error updating data.', 'Error!', { timeOut: 4000 });
    });
}
  cancelEnr() {
    this.editMode = false;
    this.customer = {};
    this.gtCustomers();
    this.rightMissing = [];
    this.leftMissing = [];
    this.account_number = '';
    this.profType = '';
    this.thumbsMissing = [];
    this.custInquiry = {};
    this.enrolledFPrints = [];
    this.enrolledFPrints = [];
    this.customer.fingerPrints = [];
    this.customer = {};
    this.capturedFings = [];
    this.fings = [];
    this.capturedRPrints = [];
    this.capturedLPrints = [];
    this.selectedItems = [];
    this.btnsCaptured = [];
    this.btnClass = false;
    this.capturedThumbs = [];
  }
  resetDevice() {
    this.element = document.createElement('img');
    this.enrolledFPrints = [];
    this.customer.fingerPrints = [];
    this.customer = {};
    this.capturedFings = [];
    this.fings = [];
    this.capturedRPrints = [];
    this.capturedLPrints = [];
    this.selectedItems = [];
    this.capturedThumbs = [];
    this.btnsCaptured = [];
    this.btnClass = false;
    let captS: any;

    for (let i = 0; i < this.captured.length; i++) {
        captS = this.captured[i];

        this.document.getElementById(captS).src = 'assets/images/enroll/' + captS + '.png';
        (<HTMLInputElement> document.getElementById('left')).disabled = false;
        (<HTMLInputElement> document.getElementById('thumbs')).disabled = false;
        (<HTMLInputElement> document.getElementById('right')).disabled = false;
    }

    return this.toastr.success('Device was reset successfully .. .', 'Success!', {timeOut: 3000});
  }
  gtActivebranches() {
    this.regionService.getActiveBranches().subscribe(data => {
      this.response = data;
      this.activeBranches = this.response.collection;
    }, error => {
      return this.toastr.error('Error in loading branch data.', 'Error!', { timeOut: 4000 });
    });
  }
  tellerInquiry(teller) {
    const tell = {
      'userName': this.getConfigs().authUsr,
      'passWord': this.getConfigs().authPs,
        'object': {
            'id': teller,
        }
      };
      const tellr = {
        'tellerId': teller
     };
    this.tellerSvc.checkTellerExists(tellr).subscribe(data => {
        this.locl = data;
        if ( this.locl.status === true) {

            return this.toastr.warning('Customer with specified account id number is already enrolled', ' Warning!', {timeOut: 3000});
        } else {
          this.tellerCoBankingInq(tell);
      }
     }, error => {

         return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
     });
  }
  customerInfInquiry(customer) {
    const custom = {
        'mnemonic': customer
     };
      const custo = {
        'userName': this.getConfigs().authUsr,
        'passWord': this.getConfigs().authPs,
        'object': {
             'mnemonic': customer
         }
    };
    this.custSvc.findByAccountNumber(custom).subscribe(data => {
        this.locl = data;
        if ( this.locl.status === true) {

            return this.toastr.warning('Customer with specified account id number is already enrolled', ' Warning!', {timeOut: 3000});
        } else {
          this.coBankingInq(custo);
    }
     }, error => {

         return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
     });
  }
    getCustomer (cust) {
        if (cust === '' ) {
            return this.toastr.warning('Kindly provide valid customer/staff id to continue', ' Warning!', {timeOut: 4000});
        }

        if (this.profType === '2') {
            this.tellerInquiry(cust);
        } else {
            this.customerInfInquiry(cust);
      }
   }
   tellerCoBankingInq(teller) {
     // this.tellerSvc.getTllrDetails().subscribe (data => {
     this.tellerSvc.getTellerDetails(teller).subscribe( data => {

     this.tellerInq = data;
     if (this.tellerInq.requestStatus === true && this.tellerInq.cif !== '') {
         this.account_number = ' ';
        this.initTellerProfile();


        return this.toastr.success('Teller id is valid, can proceed to enroll', ' Success!');
    }else if(this.tellerInq.requestStatus === true && this.tellerInq.cif === ''){
      // valid customer returned but they do not have a cif number attached
      return this.toastr.warning('cif number is invalid', ' Warning!');
    } else {

        return this.toastr.warning('Specified teller id was not found or invalid , kindly verify to proceed .', 'Warning!');
      }
    }, error => {

        return this.toastr.error('Error in inquiring teller data.', 'Error!', { timeOut: 4000 });
    });
}
   coBankingInq(customer) {
      // this.blockUI.start('Inquiring customer details...');
       // this.apiService.getCustomerDetails().subscribe (data => {
         this.apiService.getCustomerByAccountNo(customer).subscribe( data => {

        this.custInquiry = data;
        if (this.custInquiry.requestStatus === true && this.custInquiry.cif !== '') {
           this.initProfile();
           return this.toastr.success('Customer Account Number is valid, can proceed to enroll', ' Success!');
       }else if(this.custInquiry.requestStatus === true && this.custInquiry.cif === ''){
            // valid customer returned but they do not have a cif number attached
            return this.toastr.warning('Customer id is valid but account does not have a valid cif number', 'Warning!');
       } else {

           return this.toastr.warning('Specified customer id was not found or invalid , kindly verify to proceed .', 'Warning!');
       }
    }, error => {

        return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 4000 });
    });
 }


 validateCustomer($event: NgbTabChangeEvent) {
    this.findInvalidControls();
    //  this.element = document.createElement('img');
    this.submited = true;
    if (this.profType === '2') {
      if (this.tellerForm.invalid) {
        $event.preventDefault();
        this.toastr.warning('Kindly ensure all form fields are valid as highlighted!', 'Alert!', { timeOut: 4000 });
      }
  } else if (this.profType === '1') {
        if (this.form.invalid) {
          $event.preventDefault();
          this.toastr.warning('Kindly ensure all form fields are valid as highlighted!', 'Alert!', { timeOut: 4000 });
        }


  //  if (this.tellerForm.invalid || this.form.invalid) {

  } else if (this.thumbsMissing.length === 2 && this.rightMissing.length === 4 && this.leftMissing.length === 4) {
        $event.preventDefault();
        this.toastr.warning('No finger prints to enroll, you mentioned all fingerprints are missing!', 'Alert!', { timeOut: 4000 });
    }
}
  cancel() {
      this.editMode = false;
      this.account_number = '';
      this.bios = [];
      this.rightMissing = [];
      this.leftMissing = [];
      this.profType = '';
      this.thumbsMissing = [];
      this.custbios = [];
      this.customer = {};
      this.profpic = '';

  }

  ngOnDestroy() {
    this.disconnect();
    this.rightMissing = [];
    this.leftMissing = [];
    this.account_number = '';
    this.thumbsMissing = [];
    this.custInquiry = {};
    this.enrolledFPrints = [];
    this.enrolledFPrints = [];
    this.profType = '';
    this.customer.fingerPrints = [];
    this.customer = {};
    this.capturedFings = [];
    this.fings = [];
    this.capturedRPrints = [];
    this.capturedLPrints = [];
    this.capturedThumbs = [];
    this.selectedItems = [];
  }
}
export let settings = {
  mode: 'external',
  actions: {
      delete: false,
      edit: false,
      position: 'right',
  },
  columns: {
    customerName: {
        title: 'Full Name',
        filter: true
    },
    customerIdNumber: {
          title: 'Customer IdNumber',
          filter: true
      },
      phoneNumber: {
          title: 'Phone Number',
          filter: true
      },
      gender: {
          title: 'Gender',
          filter: true
      },
      country: {
        title: 'Nationality',
        filter: true
      }
  },
  edit: {
      // tslint:disable-next-line:max-line-length
      editButtonContent: '<a class="btn btn-block btn-outline-success m-r-10" ngbPopover="Edit Customer" triggers="mouseenter:mouseleave" popoverTitle="Edit Customer"> <i class="fas fa-check-circle text-info-custom" ></i></a>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>'
  },
  add: {
      // tslint:disable-next-line:max-line-length
      addButtonContent: '<a class="btn btn-block btn-outline-info m-r-10" ngbPopover="Add Customer" triggers="mouseenter:mouseleave" popoverTitle="Add Customer"> <i class="fas fa-plus-circle"></i></a>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
  },
  pager: {
    perPage: 200
    },
  rowClassFunction : function(row) {
            if (row.editable) { return 'editable'; }
            return '';

     }
};
