import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/debounceTime';

import { MySharedService } from '../services/sharedService';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { Keepalive } from '@ng-idle/keepalive';
import { EventTargetInterruptSource, Idle } from '@ng-idle/core';
import { ProgressBarModalComponent } from '../../progressbar-modal.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {
  title = 'Session Timeout Demo';
  idleState = 'NOT_STARTED';
  timedOut = false;
  lastPing?: Date = null;
  progressBarPopup: NgbModalRef;
  constructor(private element: ElementRef, private idle: Idle, private keepalive: Keepalive,
    private ngbModal: NgbModal, private sharedService: MySharedService, private router: Router) {

  }

  ngOnDestroy() {
    //this.resetTimeOut();

  }

  reverseNumber(countdown: number) {
    return (300 - (countdown - 1));
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  openProgressForm(count: number) {
    this.progressBarPopup = this.ngbModal.open(ProgressBarModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    this.progressBarPopup.componentInstance.count = count;
    this.progressBarPopup.result.then((result: any) => {
      if (result !== '' && 'logout' === result) {
        this.logout();
      } else {
        this.reset();
      }
    });
  }

  logout() {
    this.resetTimeOut();
  }

  closeProgressForm() {
    this.progressBarPopup.close();
    this.resetTimeOut();
  }

  resetTimeOut() {
    this.idle.stop();
    // this.idle.onIdleStart.unsubscribe();
    // this.idle.onTimeoutWarning.unsubscribe();
    // this.idle.onIdleEnd.unsubscribe();
    this.idle.onTimeout.observers.length = 0;
    this.idle.onIdleStart.observers.length = 0;
    this.idle.onIdleEnd.observers.length = 0;
    localStorage.removeItem('otc');
    localStorage.removeItem('bio.glob#$$#');
    this.sharedService.setAuth(false);
    this.router.navigate(['/auth']);
  }

  ngOnInit() {
    this.idle.setIdle(300);
    // sets a timeout period of 5 minutes.
    this.idle.setTimeout(300);
    // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
    this.idle.setInterrupts([
      new EventTargetInterruptSource(
        this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown mouseclick touchstart touchmove scroll')]);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NO_LONGER_IDLE';
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      this.timedOut = true;
      this.closeProgressForm();
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE_START', this.openProgressForm(1);
    });

    this.idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'IDLE_TIME_IN_PROGRESS';
      this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
      this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
      this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
      this.progressBarPopup.componentInstance.countSeconds = countdown % 60;
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);
    /**
     *  // Keepalive can ping request to an HTTP location to keep server session alive
     * keepalive.request('<String URL>' or HTTP Request);
     * // Keepalive ping response can be read using below option
     * keepalive.onPing.subscribe(response => {
     * // Redirect user to logout screen stating session is timeout out if if response.status != 200
     * });
     */



    this.reset();
  }
}