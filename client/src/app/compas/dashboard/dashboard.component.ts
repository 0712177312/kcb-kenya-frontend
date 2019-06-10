import { Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/debounceTime';
@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    constructor() {

    }
ngOnInit() {

}

}
