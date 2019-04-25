import { RegionService } from './../../services/region.service';
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { BioService } from '../../services/bio.service';
import { DOCUMENT } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomersComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    fileText: any;
    enroleMode = true;
    inquireMode = false;
    locl: any;
    account_number: any;
    fingerpos = [
      'LEFT_THUMB',
      'LEFT_INDEX',
      'LEFT_MIDDLE',
      'LEFT_RING',
      'LEFT_LITTLE',
      'RIGHT_THUMB',
      'RIGHT_INDEX',
      'RIGHT_MIDDLE',
      'RIGHT_RING',
      'RIGHT_LITTLE'
    ];
    imagSrc = 'assets/images/default.jpeg';
    // captured = ['R0', 'R1', 'R2', 'R3', 'R4', 'L0', 'L1', 'L2', 'L3', 'L4'];
    captured = ['L5',
        'L0',
        'L1',
        'L2',
        'L3',
        'R5',
        'R0',
        'R1',
        'R2',
        'R3'];
    searchText;
    raws: any = [];
    closeResult: string;
    String: any = {};
    matchResp: any;
    submited = false;
    customerNo: any;
    resp: any;
    bioflag: any;
    element: HTMLImageElement;
    $event: NgbTabChangeEvent;
    defaultSrc = 'assets/images/enroll/noImage_1.png';
    retries = 0;
    custbios = [];
    fingresp: any;
    custResp: any;
    profileSource: any;
    branches: any;
    toCapture: any;
    result: any;
    respimage: any = [];
    bioDetails = true;
    profDetails = false;
    fsource;
    fingerPrints = [];
    otc: any = {};
    bios: any = [];
    fingerprint = [];
    bio;
    myBehaviorSubject$;
    accountNumber;
    rightId: any;
    profpic: any;
    form: FormGroup;
    missingFp: FormGroup;
    custInquiry: any;
    observable$;
    searchSubject$ = new Subject<string>();
    public userProfiles: any = [];
    public userProfile: any = {};
    public customer: any = {};
    public groups: any;
    public customers: any = [];
    public countries: any = [];
    public userGroups: any = [];
    public response: any = null;
    public editMode = false;
    public leftFP: any = {};
    public rightFP: any = {};
    public thumbsFP: any = {};
    public isNew = false;
    public afi: any = {};
    public isVerified = false;
    public title: string;
    public button: string;
    public hands: any = {};
    source: LocalDataSource;
    length: any;
    leftMissing: any = [];
    rightMissing: any = [];
    thumbsMissing: any = [];
    missing: any = [];
    missingStatus = false;
    dupResult: number;
    description = 'KCB BIO Socket';
    greetings: string[] = [];
    disabled: boolean;
    hand: any = {};
    name: string;
    private stompClient = null;
    constructor( private apiService: BioService, private fb: FormBuilder,
        private custSvc: CustomerService, @Inject(DOCUMENT) private document: any,
        private toastr: ToastrService, private regionService: RegionService) {

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
      this.gtCustomers();
      this.gtCountries();
      this.otc = JSON.parse(localStorage.getItem('otc'));
      this.rightId = this.otc.rightId;
      console.log('right id', this.rightId);
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
          this.selectedItems = [
            { item_id: 3, item_text: 'Pune' },
            { item_id: 4, item_text: 'Navsari' }
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
  addTag(name) {
    return { name: name, tag: true };
    }
  onItemSelect(item: any) {
      const thumbs = [0, 5];
      const rght = [1, 2, 3, 4];
      const fings = [6, 7, 8, 9];
      const lft = [6, 7, 8, 9];
      console.log(this.missing);
      console.log(item);
      if (lft.includes(item.item_id)) {
          this.leftMissing.push(item.item_id);
          // this.fings.splice(item.item_id);
          this.remove(fings, item.item_id);
          console.log('fings ***', fings);
        //  this.fingerPrints.push({position: item.item_id, quality: 0, fingerPrint: 'missing'});
          console.log('left missing', this.leftMissing);
          console.log('finger prints', this.fingerPrints);
      } else if (rght.includes(item.item_id)) {
            this.rightMissing.push(item.item_id);
            // this.fingerPrints.push({position: item.item_id, quality: 0, fingerPrint: 'missing'});
            console.log('missing right', this.rightMissing);
            console.log('finger prints', this.fingerPrints);
      } else if (thumbs.includes(item.item_id)) {
           this.thumbsMissing.push(item.item_id);
           // this.fingerPrints.push({position: item.item_id, quality: 0, fingerPrint: 'missing'});
           console.log('thumbs ', this.thumbsMissing);
           console.log('finger prints', this.fingerPrints);
      }
  }

  remove(arr, item) {
    for (let i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}
  onItemUnselect(item: any) {
       const ri = this.fingerPrints.filter(x => x.position === item.item_id);
       const rh = this.rightMissing.indexOf(item.item_id);
       const le = this.leftMissing.indexOf(item.item_id);
       const th = this.thumbsMissing.indexOf(item.item_id);
       if (rh > -1) {
        this.rightMissing.splice(ri, 1);
       }
      if (ri !== undefined) {
                for (let i = 0; i < this.fingerPrints.length; i++ ) {
                if (this.fingerPrints[i].position === item.item_id) {
                    this.fingerPrints.splice(i, 1);
                   }
         }
        console.log('missing right', this.rightMissing);
        console.log('fingerprints%%%%%', this.fingerPrints);
      } else if (le > -1) {
         this.leftMissing.splice(le, 1);
         console.log('left missing', this.leftMissing);
      } else if (th > -1) {
         this.thumbsMissing.splice(th, 1);
         console.log('thumbs ', this.thumbsMissing);
      }
  }
  onSelectAll(items: any) {
    console.log(items);
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

  connect() {
    const socket = new SockJS('https://localhost:8444/greenbitSocket');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/greenbitResponse', function (greeting) {
          _this.hands = JSON.parse(greeting.body);
          console.log('hands', _this.hands);
      if ( _this.hands.status === true) {
          if (_this.hands.hand === 'left') {
            _this.getLeftPrint(_this.hands);
           } else if ( _this.hands.hand === 'right') {
            _this.getRightPrint(_this.hands);
          } else if (_this.hands.hand === 'thumbs') {
              _this.getThumbs(_this.hands);
          }
        } else {
            return _this.toastr.warning(_this.hands.responseMessage, 'Alert!', { timeOut: 1500 });
        }
      });
    });
  }

 getLeftPrint(data) {
     const poos = [6, 7, 8, 9];
     // this.leftMissing , 6,7;
    // this.leftMissing.indexOf(poos) < -1
     // 0,1
        this.leftFP = data;
        let po = 6;
        this.element = document.createElement('img');
        const imgId = this.fingerpos[po];
        const captS = this.captured[po];
        const btnid = 'BTN_' + imgId;
        console.log('left print', this.leftFP);
                for (let i = 0 ; i < this.leftFP.leftHand.length; i++) {
                    console.log('status &&&&&*', this.leftMissing.includes(po));
                    this.fingerPrints.push({position: po, quality: this.leftFP.leftHand[i].quality,
                        fingerPrint: this.leftFP.leftHand[i].fingerprint});

          }
    // for (let p = 0; p < poos.length; p++) {

        po += 1;
     // }
        console.log('finger prints ', this.fingerPrints);
        for ( let j = 0; j < this.fingerPrints.length; j++) {
            console.log('cuptured ', captS );
            this.document.getElementById('L' + j ).src = 'assets/images/enroll/SL' + j + '.png';
            po++;
        }
        (<HTMLInputElement>document.getElementById('LEFT_HANDS')).disabled = true;
}

getRightPrint(data) {
    let po = 6;
    this.element = document.createElement('img');
    const imgId = this.fingerpos[po];
    const captS = this.captured[po];
    const btnid = 'BTN_' + imgId;
    console.log('left print', this.leftFP);
        this.rightFP = data;
        let r =  1;
        console.log('right print', this.rightFP);
        for (let i = 0 ; i < this.rightFP.rightHand.length; i++) {
            this.fingerPrints.push({position: r, quality: this.rightFP.rightHand[i].quality,
                fingerPrint: this.rightFP.rightHand[i].fingerprint});
                r += 1;
        }
        console.log('finger prints ', this.fingerPrints);
        for ( let j = 0; j < this.fingerPrints.length; j++) {
            console.log('cuptured ', captS );
            this.document.getElementById('R' + j ).src = 'assets/images/enroll/SR' + j + '.png';
            po++;
        }
        (<HTMLInputElement>document.getElementById('RIGHT_HANDS')).disabled = true;
}

getThumbs(data) {
        this.element = document.createElement('img');
        this.thumbsFP = data;
        let t = 0;
        console.log('thumbs print', this.thumbsFP);
        for (let i = 0 ; i < this.thumbsFP.thumbs.length; i++) {
            this.fingerPrints.push({position: t, quality: this.thumbsFP.thumbs[i].quality,
                fingerPrint: this.thumbsFP.thumbs[i].fingerprint});
                t += 5;
        }
        this.document.getElementById('R5' ).src = 'assets/images/enroll/SR5.png';
        this.document.getElementById('L5' ).src = 'assets/images/enroll/SL5.png';
        (<HTMLInputElement>document.getElementById('THUMBS')).disabled = true;
}

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

   this.setConnected(false);
      console.log('Disconnected!');
    }

  sendName(fin) {
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
      if ( this.leftMissing.length > 0 || this.rightMissing.length || this.thumbsMissing.length ) {
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
          }
      }
      this.hand = {
          'req': fin
      };
     console.log({ 'name': fin, 'missingStatus': this.missingStatus,
     'missingCount': count, 'missing': this.missing });
    this.stompClient.send(
      '/app/getImage',
      {},
      JSON.stringify({ 'name': fin, 'missingStatus': this.missingStatus,
      'missingCount': count, 'missing': this.missing })
    );
  }

  showGreeting(message) {
      console.log('message', message);
    this.greetings.push(message);
  }
  addProf () {
    console.log('works');
  }

  initInquiry() {
    this.account_number = '';
    this.editMode = true;
    this.isVerified = false;
    this.isNew = true;
  }

  initProfile() {
     this.connect();
     this.gtActivebranches();
    this.form = this.fb.group({
        id: new FormControl(0),
        customerName: new FormControl(this.custInquiry.payload.shortName,
            [Validators.required, Validators.minLength(6), Validators.pattern('[a-zA-Z ]*')]),
        active: new FormControl(false),
        createdBy: new FormControl(this.rightId),
        gender: new FormControl(this.custInquiry.payload.gender, [Validators.required]),
        customerIdNumber: new FormControl(this.custInquiry.payload.legalId, [Validators.required]),
        phoneNumber: new FormControl(this.custInquiry.payload.phoneNumber, [Validators.required]),
        country: new FormControl(this.custInquiry.payload.country),
        nationality: new FormControl(this.custInquiry.payload.nationality),
        mnemonic: new FormControl(this.custInquiry.payload.mnemonic, [Validators.required]),
        customerId: new FormControl(this.custInquiry.payload.id, [Validators.required]),
        branchCode: new FormControl(this.custInquiry.payload.accountOfficer, [Validators.required]),
        verified: 'N',
        customerType: 'CUST',
        waived: 'N',
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
    this.title = 'Add customer';
    this.button = 'Add customer';
    // this.gtBranches();
  }
  validateMissingFP($event: NgbTabChangeEvent) {
      console.log('missing thumbs ', this.thumbsMissing);
    if (this.thumbsMissing.length === 2) {
       $event.preventDefault();
       this.toastr.warning('empty thumbs', 'Alert!', { timeOut: 1500 });
   } else {
        console.log('works...');
   }
}
  get f() { return this.form.controls; }

  findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
            console.log('invalid', invalid);
        }
    }
    return invalid;
  }
  onSubmit() {
    this.submited = true;
  }

  initEditcustomer($event) {
      this.gtActivebranches();
      console.log('data', $event.data);
      this.form = this.fb.group({
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
    this.blockUI.start('Loading data...');
    this.custSvc.gtCustomers().subscribe(data => {
      this.customers = data;
      console.log('custs', this.customers);
      this.customers = this.customers.collection;
      console.log('customers##', this.customers);
      this.blockUI.stop();
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error loading Customer data.', 'Error!', { timeOut: 1500 });
    });
  }

  gtCountries() {
    this.blockUI.start('Loading data...');
    this.custSvc.gtCountries().subscribe(data => {
        this.countries = data;
        console.log('countries', this.countries);
        this.countries = this.countries.collection;
        console.log('customers##', this.countries);
        this.blockUI.stop();
      });
  }

  gtBranches() {
      this.custSvc.gtBranches().subscribe(data => {
          this.branches = data;
      });
  }
  storeCustomer() {
      console.log('customer', this.customer);
      this.apiService.addCustomer(this.customer).subscribe((response) => {
      this.response = response;
      if (this.response.status === true ) {
                this.customer = {};
                this.editMode = false;
                this.gtCustomers();
                this.fingerPrints = [];
                this.custInquiry = {};
                this.account_number = '';
                this.rightMissing = [];
                this.leftMissing = [];
                this.thumbsMissing = [];
                return this.toastr.success('Profile details saved successfuly. Awaiting authorization', ' Success!');
           } else {
                this.customer = {};
                this.editMode = false;
                this.gtCustomers();
                this.fingerPrints = [];
                this.account_number = '';
                this.blockUI.stop();
                return this.toastr.warning(this.response.respMessage, 'Warning!');
        }
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in updating Customer data.', 'Error!', { timeOut: 1500 });
      });
  }

  enrollCustomerDetails() {
        this.customer = this.form.value;
        this.bioflag = 0;
        this.customer.fingerPrints = this.fingerPrints;
        console.log('abis $$$', this.customer);
        this.blockUI.start('Updating Customer data...');
        this.apiService.afisEnroll(this.customer).subscribe((response) => {
        this.response = response;
        console.log('uploaded afis##');
        if (this.response.status === true) {
                this.storeCustomer();
            } else {
            this.blockUI.stop();
            this.toastr.warning(this.response.message + ' customer id ' + this.response.customerId + '' , 'Warning!', {timeOut: 4000});
           }
        }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error updating data.', 'Error!', { timeOut: 1500 });
        });
   // }
  }

  cancelEnr() {
    this.editMode = false;
    this.customer = {};
    this.gtCustomers();
    this.rightMissing = [];
    this.leftMissing = [];
    this.account_number = '';
    this.thumbsMissing = [];
    this.custInquiry = {};
    this.fingerPrints = [];
  }

  resetDevice() {
    this.element = document.createElement('img');
    this.fingerPrints = [];
    this.customer.fingerPrints = [];
    let captS: any;
    console.log('captured', this.captured);
    for (let i = 0; i < this.captured.length; i++) {
       // const imgId = this.fingerpos[i];
        captS = this.captured[i];
        console.log('position', captS);
        // this.document.getElementById(imgId).src = this.defaultSrc;
        // const btnid = 'BTN_' + imgId;
        this.document.getElementById(captS).src = 'assets/images/enroll/' + captS + '.png';
        (<HTMLInputElement> document.getElementById('LEFT_HANDS')).disabled = false;
        (<HTMLInputElement> document.getElementById('THUMBS')).disabled = false;
        (<HTMLInputElement> document.getElementById('LEFT_HANDS')).disabled = false;
    }
    console.log('removed bios', this.fingerPrints);
    return this.toastr.success('Device was reset successfully .. .', 'Success!', {timeOut: 3000});
  }
  gtActivebranches() {
    this.regionService.getActiveBranches().subscribe(data => {
      this.response = data;
      this.activeBranches = this.response.collection;
    }, error => {
      return this.toastr.error('Error in loading branch data.', 'Error!', { timeOut: 1500 });
    });
  }
  getCustomer (cust) {
      console.log('customer', cust);
    const customer = {
        'object': {
            'mnemonic': cust
         }
    };
    if (cust === '' ) {
        return this.toastr.warning('Kindly provide valid customer id to continue', ' Warning!', {timeOut: 3000});
    } else {
     const custo = {
        'gifNumber': cust
     };
     console.log('cust0###', custo);
     this.blockUI.start('Loading data...');
     this.custSvc.findByAccountNumber(custo).subscribe(data => {
           this.locl = false;
            console.log('locl', this.locl);
            if ( this.locl === true) {
                this.blockUI.stop();
                return this.toastr.warning('Customer with specified account id number is already enrolled', ' Warning!', {timeOut: 3000});
            } else {
              this.coBankingInq(customer);
        }
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 1500 });
      });
  }
}


   coBankingInq(customer) {
     this.apiService.getCustomerDetails().subscribe (data => {
     // this.apiService.getCustomerByAccountNo(customer).subscribe( data => {
        console.log('customer', customer);
        this.custInquiry = data;
        if (this.custInquiry.requestStatus === true) {
           this.isVerified = true;
           this.initProfile();
           console.log('response', this.custInquiry.payload);
           this.blockUI.stop();
           return this.toastr.success('Customer Account Number is valid, can proceed to enroll', ' Success!');
       } else {
           this.isVerified = false;
           this.blockUI.stop();
           return this.toastr.warning('Specified customer id was not found or invalid , kindly verify to proceed .', 'Warning!');
       }
    }, error => {
        this.blockUI.stop();
        return this.toastr.error('Error in inquiring Customer data.', 'Error!', { timeOut: 1500 });
    });
 }


 validateCustomer($event: NgbTabChangeEvent) {
     this.element = document.createElement('img');
    this.submited = true;
    this.findInvalidControls();
   if (this.form.invalid) {
        $event.preventDefault();
        this.toastr.warning('Kindly ensure all form fields are valid as highlighted!', 'Alert!', { timeOut: 1500 });
    } else if (this.thumbsMissing.length === 2 && this.rightMissing.length === 4 && this.leftMissing.length === 4) {
        $event.preventDefault();
        this.toastr.warning('No finger prints to enroll, you mentioned all fingerprints are missing!', 'Alert!', { timeOut: 1500 });
    }
}

  cancel() {
      this.userProfile = {};
      this.editMode = false;
      this.account_number = '';
      this.bios = [];
      this.rightMissing = [];
      this.leftMissing = [];
      this.thumbsMissing = [];
      this.custbios = [];
      this.customer = {};
      this.profpic = '';

  }
}
export let settings = {
  mode: 'external',
  actions: {
      delete: false,
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
