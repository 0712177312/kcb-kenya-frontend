import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import { NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BioService } from '../../services/bio.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LogsService } from '../../services/logs.service';
import { WebSocketServiceService } from '../../services/web-socket-service.service';

@Component({
    selector: 'app-identify-customer',
    templateUrl: './identify-customer.component.html',
    styleUrls: ['./identify-customer.component.css']
})
export class IdentifyCustomerComponent implements OnInit, OnDestroy {
    @BlockUI() blockUI: NgBlockUI;
    fileText: any;
    enroleMode = true;
    inquireMode = false;
    locl: any;
    indentify = false;
    account_number: any;
    toCaptureBtns = ['right', 'thumbs', 'left'];
    btnClass = false;
    btnsCaptured = [];
    captured = ['T5', 'L6', 'L7', 'L8', 'L9', 'T0', 'R1', 'R2', 'R3', 'R4'];
    searchText;
    cust: any = {};
    missing: any = [];
    String: any = {};
    profiles: any = [];
    identifyFingerPrints = [];
    respimage: any = [];
    custbios = [];
    otc: any = {};
    bios: any = [];
    fingerprint = [];
    leftMissing: any = [];
    rightMissing: any = [];
    thumbsMissing: any = [];
    capturedThumbs: any = [];
    capturedRPrints: any = [];
    capturedFings: any = [];
    customers: any = [];
    countries: any = [];
    userGroups: any = [];
    fingerPrints: any = [];
    resp: any;
    bioflag: any;
    profileSource: any;
    branches: any;
    toCapture: any;
    result: any;
    bioDetails = true;
    profDetails = false;
    fsource;
    bio;
    myBehaviorSubject$;
    accountNumber;
    missingStatus = false;
    matchedCustomers: any = [];
    rightId: any;
    element: HTMLImageElement;
    userProfiles: any = [];
    userProfile: any = {};
    customer: any = {};
    leftFP: any = {};
    rightFP: any = {};
    thumbsFP: any = {};
    customes: any = [];
    afi: any = {};
    hands: any = {};
    hand: any = {};
    greetings: String[] = [];
    groups: any;
    response: any = null;
    editMode = false;
    isNew = false;
    isVerified = false;
    title: string;
    button: string;
    source: LocalDataSource;
    disabled: boolean;
    name: string;
    private stompClient = null;
    constructor(private apiService: BioService,
        private modalService: NgbModal, private logs: LogsService, private sockService: WebSocketServiceService,
        private custSvc: CustomerService, @Inject(DOCUMENT) private document: any,
        private toastr: ToastrService, private router: Router) {

    }
    settings = settings;
    loading = false;
    ngOnInit() {
        this.otc = JSON.parse(localStorage.getItem('otc'));
        this.rightId = this.otc.rightId;
        console.log('right id', this.rightId);
    }

    setConnected(connected: boolean) {
        this.disabled = !connected;

        if (connected) {
            this.greetings = [];
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
        // this.apiService.leftFing().subscribe((data) => {
        this.btnClass = false;
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

    private getRightPrint(data) {
        console.log('works');
        //   this.apiService.rightFing().subscribe((data) => {
        const ar = [1, 2, 3, 4];
        let pngs = [];
        this.btnClass = false;
        this.rightMissing.forEach((rm) => {
            this.remove(ar, rm);
            pngs = ar;
            console.log('fings fings &&&', pngs);
        });

        this.rightFP = data;
        if (pngs.length > 0) {
            pngs.forEach((item, i) => {
                const fo = this.rightFP.rightHand.filter(print =>
                    Number(print.Position) === i);
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
        let count: any = 0;
        console.log('captured fingerprints', this.btnsCaptured);
        this.btnClass = true;
        if (fin === 'left' && this.leftMissing.length === 4) {
            return this.toastr.warning('No Left hand prints to capture, already specified all are missing ', 'Alert!', { timeOut: 4000 });
        }
        if (fin === 'thumbs' && this.thumbsMissing.length === 2) {
            return this.toastr.warning('No thumbs to capture , you already specified all are missing', 'Alert!', { timeOut: 4000 });
        }
        if (fin === 'right' && this.rightMissing.length === 4) {
            return this.toastr.warning('No right hand prints to capture, already specified all are missing', 'Alert!', { timeOut: 4000 });
        }
        if (this.leftMissing.length > 0 || this.rightMissing.length || this.thumbsMissing.length) {
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
            this.missingStatus = false;
            this.btnClass = false;
        }
        this.hand = {
            'req': fin
        };
        console.log({ 'name': fin, 'missingStatus': this.missingStatus, 'missingCount': count, 'missing': this.missing });
        // this.stompClient.send(
        //   '/app/getImage',
        //   {},
        //   JSON.stringify({ 'name': fin, 'missingStatus': this.missingStatus,
        //   'missingCount': count, 'missing': this.missing })
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

    showGreeting(message) {
        console.log('message', message);
        this.greetings.push(message);
    }
    addProf() {
        console.log('works');
    }

    initInquiry() {
        this.account_number = '';
        this.editMode = true;
        this.isVerified = false;
        this.isNew = true;
    }

    getMatchedCustomers(data) {
        console.log('data ###@@', data);
        this.blockUI.start('Identify Customer data...');
        this.apiService.getMatchedCustomers(data).subscribe((response) => {
            this.blockUI.stop();
            this.cust = response;
            if (this.cust.status === true) {
                console.log('customes', this.cust);
                // this.source = this.cust;
                this.indentify = true;
                this.customers = this.cust.collection;
                console.log('customer', this.customers);
                return this.customers;
            } else {
                return this.toastr.error('Error Getting data.', 'Error!', { timeOut: 1500 });
            }
        }, error => {
            this.blockUI.stop();
            return this.toastr.error('Error updating data.', 'Error!', { timeOut: 1500 });
        });
    }

    identifyCustomerDetails() {
        this.bioflag = 0;
        const cust: any = {};
        cust.fingerPrints = this.fingerPrints;
        console.log('abis $$$', this.customer);
        this.blockUI.start('Verify Customer data...');

        //Don't allow identify without finger prints
        if (this.fingerPrints.length > 0) {
            this.apiService.afisIdentify(cust).subscribe((response) => {
                this.response = response;
                if (this.response.status === true && this.response.candidates.length > 0) {
                    this.profiles.push(this.response.candidates);
                    console.log('uploaded afis##', this.response);
                    console.log('applicants', this.profiles);
                    const cu: any = {};
                    for (let k = 0; k < this.response.candidates.length; k++) {
                        this.matchedCustomers.push({ 'customerId': this.response.candidates[k].applicant.externalId });
                        console.log('cu%%% cu', cu);
                    }
                    this.matchedCustomers.push(cu);
                    console.log('cu%%% got', this.matchedCustomers);
                    this.getMatchedCustomers(this.matchedCustomers);

                    // return this.identifyCustomer(cu);
                    //   } else {
                    //     this.toastr.warning('no applicant with specified fingerprints found ', 'Warning!');
                    //   }
                } else {
                    this.blockUI.stop();
                    this.toastr.warning('Customer with specifed fingerprints was not found or not yet enrolled', 'Warning!');
                }
            }, error => {
                this.blockUI.stop();
                return this.toastr.error('Error verifying data.', 'Error!', { timeOut: 1500 });
            });
        } else {
            this.blockUI.stop();
            return this.toastr.error('Capture atleast one finger print.', 'Error!', { timeOut: 1500 });
        }
    }

    cancelEnr() {
        this.editMode = false;
        this.customer = {};
        this.customer.bios = [];
        this.bios = [];
        this.cust = {};
        this.fingerprint = [];
        this.fingerPrints = [];
        this.btnsCaptured = [];
        this.btnClass = false;
        this.disconnect();
        this.router.navigate(['./']);
    }

    resetDevice() {
        this.element = document.createElement('img');
        this.customer.fingerPrints = [];
        this.customer = {};
        this.capturedFings = [];
        this.btnClass = false;
        this.capturedRPrints = [];
        // this.sendName('stop');
        this.fingerPrints = [];
        this.capturedThumbs = [];
        let captS: any;
        console.log('captured', this.captured);
        for (let i = 0; i < this.captured.length; i++) {
            captS = this.captured[i];
            console.log('position', captS);
            this.document.getElementById(captS).src = 'assets/images/enroll/' + captS + '.png';
            (<HTMLInputElement>document.getElementById('left')).disabled = false;
            (<HTMLInputElement>document.getElementById('thumbs')).disabled = false;
            (<HTMLInputElement>document.getElementById('right')).disabled = false;
        }
        return this.toastr.success('Device was reset successfully .. .', 'Success!', { timeOut: 3000 });
    }



    cancel() {
        this.userProfile = {};
        this.editMode = false;
        this.account_number = '';
        this.bios = [];
        this.custbios = [];
        this.customer = {};
        this.btnClass = false;
        this.btnsCaptured = [];

    }

    ngOnDestroy() {
        // ...
        this.cust = {};
        this.missing = [];
        this.String = {};
        this.profiles = [];
        this.identifyFingerPrints = [];
        this.respimage = [];
        this.custbios = [];
        this.otc = {};
        this.bios = [];
        this.fingerprint = [];
        this.leftMissing = [];
        this.rightMissing = [];
        this.thumbsMissing = [];
        this.customers = [];
        this.countries = [];
        this.userGroups = [];
        this.fingerPrints = [];
        this.resp = {};
        this.branches = [];
        this.bioDetails = true;
        this.profDetails = false;
        this.accountNumber = '';
        this.missingStatus = false;
        this.matchedCustomers = [];
        this.userProfiles = [];
        this.userProfile = {};
        this.customer = {};
        this.leftFP = {};
        this.rightFP = {};
        this.thumbsFP = {};
        this.customes = [];
        this.afi = {};
        this.hands = {};
        this.hand = {};
        this.response = null;
        this.editMode = false;
        this.isNew = false;
        this.disconnect();
        this.isVerified = false;
        console.log('destroyed');
    }


}
export let settings = {
    mode: 'external',
    actions: {
        delete: false,
        position: 'right',
        add: false,
        edit: false
    },
    columns: {
        id: {
            title: '##',
            filter: false
        },
        customerName: {
            title: 'Full Name',
            filter: false
        },
        customerIdNumber: {
            title: 'Customer IdNumber',
            filter: false
        },
        phoneNumber: {
            title: 'Phone Number',
            filter: false
        },
        gender: {
            title: 'Gender',
            filter: false
        },
        country: {
            title: 'Nationality',
            filter: false
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
    rowClassFunction: function (row) {
        if (row.editable) { return 'editable'; }
        return '';

    }
};
