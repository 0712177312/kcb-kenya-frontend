import { Component, enableProdMode, OnDestroy, OnInit } from '@angular/core';

import { MySharedService } from '../app/compas/services/sharedService';
enableProdMode();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private sharedService: MySharedService) {
    window.onbeforeunload = function (e) {
      localStorage.removeItem('otc');
      localStorage.removeItem('bio.glob#$$#');
      sharedService.setAuth(false);
    };
  }
}
