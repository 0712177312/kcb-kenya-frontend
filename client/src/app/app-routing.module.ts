import { WaiveChannelComponent } from './compas/configs/waive-channel/waive-channel.component';
import { WaivedCountryComponent } from './compas/configs/waived-country/waived-country.component';
import { WaivedBranchComponent } from './compas/configs/waived-branch/waived-branch.component';
import { BranchComponent } from './compas/regions/branch/branch.component';
import { ChannelComponent } from './compas/configs/channel/channel.component';
import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './compas/authentication/login/login.component';
import { ServiceGuard } from './compas/services/service.guard';
import { DashboardComponent } from './compas/dashboard/dashboard.component';
import { AccessControlComponent } from './compas/administration/access-control/access-control.component';
import { UserProfileComponent } from './compas/administration/user-profile/user-profile.component';
import { EnrolledCustomersComponent } from './compas/reports/enrolled-customers/enrolled-customers.component';
import { VerifyUsersComponent } from './compas/administration/verify-users/verify-users.component';
import { ApproveCustomersComponent } from './compas/customers/approve-customers/approve-customers.component';
import { CountryComponent } from './compas/regions/country/country.component';
import { CustomersComponent } from './compas/customers/customers/customers.component';
import { IdentifyCustomerComponent } from './compas/customers/identify-customer/identify-customer.component';
import { WaiveComponent } from './compas/configs/waive/waive.component';
import { WaivedCustomersComponent } from './compas/configs/waived-customers/waived-customers.component';
import { WaiveBranchComponent } from './compas/configs/waive-branch/waive-branch.component';
import { WaiveCountryComponent } from './compas/configs/waive-country/waive-country.component';
import { WaivedChannelsComponent } from './compas/configs/waived-channels/waived-channels.component';
import { RptsyslogsComponent } from './compas/reports/rptsyslogs/rptsyslogs.component';
import { RptbranchesComponent } from './compas/reports/rptbranches/rptbranches.component';
import { VerifyTellerComponent } from './compas/configs/verify-teller/verify-teller.component';
import { VerifyCustomerDetailsComponent } from './compas/customers/verify-customer-details/verify-customer-details.component';
export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'administration/userProfile',
        component: UserProfileComponent,
        canActivate: [ServiceGuard],
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'masters/identifycustomer',
        component: IdentifyCustomerComponent,
        canActivate: [ServiceGuard],
      },
      {
        path: 'administration/accessControl',
        component: AccessControlComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'customers/customers',
        component: CustomersComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'reports/customers',
        component: EnrolledCustomersComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/approveusers',
        component: VerifyUsersComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/approvecustomers',
        component: ApproveCustomersComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/verifycustomer-details',
        component: VerifyCustomerDetailsComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'regions/countries',
        component: CountryComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'regions/branches',
        component: BranchComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/verifyEnrolledTellers',
        component: VerifyTellerComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'configs/channels',
        component: ChannelComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waive',
        component: WaiveComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waivedcustomers',
        component: WaivedCustomersComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waiveBranches',
        component: WaiveBranchComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waivedBranches',
        component: WaivedBranchComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waiveCountry',
        component: WaiveCountryComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waivedcountry',
        component: WaivedCountryComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waivedChannels',
        component: WaivedChannelsComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'masters/waiveChannel',
        component: WaiveChannelComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'reports/rptbranches',
        component: RptbranchesComponent,
        canActivate: [ServiceGuard]
      },
      {
        path: 'reports/rptsyslogs',
        component: RptsyslogsComponent,
        canActivate: [ServiceGuard]
      }
    ]
  },
  { path: 'auth', component: LoginComponent },
  {
    path: '**',
    redirectTo: '/authentication/404'
  }
];
