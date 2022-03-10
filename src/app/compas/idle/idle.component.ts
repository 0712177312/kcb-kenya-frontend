import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MySharedService } from '../services/sharedService';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.css']
})


export class IdleComponent implements OnInit {


  constructor(private sharedService: MySharedService, private authService: AuthService) {

  }


  ngOnInit() {

  }


}
