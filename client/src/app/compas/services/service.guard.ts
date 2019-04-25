import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { MySharedService } from './sharedService';


@Injectable()
export class ServiceGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private globalService: MySharedService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.globalService.isAuthenticated) {
      return true;
    }  else if (localStorage.getItem('otc')) {
      this.globalService.setAuth(true);
      const globalObject = JSON.parse(localStorage.getItem('otc'));
      this.globalService.setUsername(globalObject.username);
      this.globalService.setRights(globalObject.rights);
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
