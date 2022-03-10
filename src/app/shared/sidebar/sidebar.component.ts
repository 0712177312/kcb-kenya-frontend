import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../compas/services/app.service';
import { MySharedService } from '../../compas/services/sharedService';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  menu: any = { collection: [{ headerClass: '' }], menus: [] };
  public sidebarnavItems: any[];
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private globalService: MySharedService
  ) { }

  // End open close
  ngOnInit() {
      this.sidebarnavItems = this.globalService.rights.sort((a, b) => a.headerPos - b.headerPos);
    //  console.log(this.globalService.rights.sort((a, b) => a.headerPos - b.headerPos));
  }
}
