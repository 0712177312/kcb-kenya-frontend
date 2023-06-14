import { Component, enableProdMode, OnDestroy, OnInit, ElementRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { Keepalive } from '@ng-idle/keepalive';
import { EventTargetInterruptSource, Idle } from '@ng-idle/core';
import { ProgressBarModalComponent } from '../app/progressbar-modal.component';

import { MySharedService } from '../app/compas/services/sharedService';
import { Router, ActivationEnd } from '@angular/router';
import { AuthService } from './compas/services/auth.service';

enableProdMode();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Session Timeout Demo';
  idleState = 'NOT_STARTED';
  timedOut = false;
  lastPing?: Date = null;
  progressBarPopup: NgbModalRef;

  constructor(private element: ElementRef, private idle: Idle, private keepalive: Keepalive,
    private ngbModal: NgbModal, private sharedService: MySharedService, private router: Router, private authService:AuthService) {
    //logout when the tab is closed
    window.onbeforeunload = function (e) {
      localStorage.removeItem('otc');
      localStorage.removeItem('bio.glob#$$#');
      sharedService.setAuth(false);
    };
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
    console.log("reset() function called for timer");
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
    this.authService.logout();
    this.resetTimeOut();
  }

  closeProgressForm() {
    this.progressBarPopup.close();
    this.resetTimeOut();
  }

  resetTimeOut() {
    //this.idle.stop();
    this.reset();
    // this.idle.onIdleStart.unsubscribe();
    // this.idle.onTimeoutWarning.unsubscribe();
    // this.idle.onIdleEnd.unsubscribe();
    // this.idle.onTimeout.observers.length = 0;
    // this.idle.onIdleStart.observers.length = 0;
    // this.idle.onIdleEnd.observers.length = 0;
    localStorage.removeItem('otc');
    localStorage.removeItem('bio.glob#$$#');
    this.sharedService.setAuth(false);
    this.router.navigate(['/auth']);
  }

  ngOnInit() {
    console.log("ngOnInit in app.component");
    //sets a timeout duration of user inactivity
    // + is added to convert from string to int
    // this.idle.setIdle(+JSON.parse(localStorage.getItem('bio.glob#$$#')).sessionIdle);
    this.idle.setIdle(120);
    ////console.log("session Idle duration: " + JSON.parse(localStorage.getItem('bio.glob#$$#')).sessionIdle);
    // sets a timeout duration of the popup asking if the user wants to stay on page. 
    // + is added to convert from string to int
    // this.idle.setTimeout(+JSON.parse(localStorage.getItem('bio.glob#$$#')).sessionTimeout);
    this.idle.setTimeout(120);
    ////console.log("session timeout duration: " + JSON.parse(localStorage.getItem('bio.glob#$$#')).sessionTimeout);
    // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
    this.idle.setInterrupts([
      new EventTargetInterruptSource(
        this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown mouseclick touchstart touchmove scroll mousemove')]);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NO_LONGER_IDLE';
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      this.timedOut = true;
      this.closeProgressForm();
    });

    this.idle.onIdleStart.subscribe(() => {
      // show progress form if page is not the login page
      if (this.router.url.indexOf("auth") === -1) {
        this.idleState = 'IDLE_START', this.openProgressForm(1);
      }else{
        this.reset();
      }
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
