import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ServiceGuard } from './compas/services/service.guard';
import { MySharedService } from './compas/services/sharedService';
import { DashboardComponent } from './compas/dashboard/dashboard.component';
import { UserProfileComponent } from './compas/administration/user-profile/user-profile.component';
import { AccessControlComponent } from './compas/administration/access-control/access-control.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToastrModule } from 'ngx-toastr';
import { EnrolledCustomersComponent } from './compas/reports/enrolled-customers/enrolled-customers.component';
import { LoginComponent } from './compas/authentication/login/login.component';
import { StatsComponent } from './compas/dashboardcomponents/stats/stats.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { ChartistModule } from 'ng-chartist';
import { VerifyUsersComponent } from './compas/administration/verify-users/verify-users.component';
import { BlockUIModule } from 'ng-block-ui';
import { PendingChangesGuard } from './compas/guards/pending-changes-guard.guard';
import { ConfirmDialogComponent } from './compas/compas-component/confirm-dialog/confirm-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BlockElementComponent } from './compas/compas-component/block-element/block-element.component';
import { ApproveCustomersComponent } from './compas/customers/approve-customers/approve-customers.component';
import { CountryComponent } from './compas/regions/country/country.component';
import { BranchComponent } from './compas/regions/branch/branch.component';
import { ChannelComponent } from './compas/configs/channel/channel.component';
import { TableComponent } from './compas/components/table/table.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CustomersComponent } from './compas/customers/customers/customers.component';
import { StaffComponent } from './compas/customers/staff/staff.component';
import { IdentifyCustomerComponent } from './compas/customers/identify-customer/identify-customer.component';
import { WaiveComponent } from './compas/configs/waive/waive.component';
import { WaivedCustomersComponent } from './compas/configs/waived-customers/waived-customers.component';
import { WaiveBranchComponent } from './compas/configs/waive-branch/waive-branch.component';
import { WaiveCountryComponent } from './compas/configs/waive-country/waive-country.component';
import { WaivedCountryComponent } from './compas/configs/waived-country/waived-country.component';
import { WaivedBranchComponent } from './compas/configs/waived-branch/waived-branch.component';
import { WaiveChannelComponent } from './compas/configs/waive-channel/waive-channel.component';
import { WaivedChannelsComponent } from './compas/configs/waived-channels/waived-channels.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IdleComponent } from './compas/idle/idle.component';
import { WebSocketServiceService } from './compas/services/web-socket-service.service';
import { RptbranchesComponent } from './compas/reports/rptbranches/rptbranches.component';
import { ReportsTestComponent } from './compas/reports/reports-test/reports-test.component';
import { RptsyslogsComponent } from './compas/reports/rptsyslogs/rptsyslogs.component';
import { DashStatsComponent } from './compas/dashboardcomponents/dash-stats/dash-stats.component';
import { AppInfoCardComponent } from './compas/dashboardcomponents/app-info-card/app-info-card.component';
import { VerifyTellerComponent } from './compas/configs/verify-teller/verify-teller.component';
import { VerifyCustomerDetailsComponent } from './compas/customers/verify-customer-details/verify-customer-details.component';
import { BlockUiTemplateComponent } from './block-ui-temp.component';
import { BlockUIHttpModule } from "ng-block-ui/http";
import { DeleteCustomerComponent } from './compas/customers/delete-customer/delete-customer.component';
import { ConvertStaffToCustomerComponent } from './compas/customers/convert-staff-to-customer/convert-staff-to-customer.component';

// import { stompConfig } from './compas/services/web-socket-config';

import { ProgressBarModalComponent } from './progressbar-modal.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { DataTablesModule } from 'angular-datatables';
import { DetachCustomerComponent } from './compas/customers/detach-customer/detach-customer.component';
import { DetachStaffComponent } from './compas/configs/detach-staff/detach-staff.component';
import { EnrolledStaffComponent } from './compas/reports/enrolled-staff/enrolled-staff.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    LoginComponent,
    DashboardComponent,
    UserProfileComponent,
    AccessControlComponent,
    EnrolledCustomersComponent,
    StatsComponent,
    CustomersComponent,
    StaffComponent,
    VerifyUsersComponent,
    ConfirmDialogComponent,
    BlockElementComponent,
    ApproveCustomersComponent,
    CountryComponent,
    BranchComponent,
    ChannelComponent,
    TableComponent,
    IdentifyCustomerComponent,
    WaiveComponent,
    WaivedCustomersComponent,
    WaiveBranchComponent,
    WaiveCountryComponent,
    WaivedCountryComponent,
    WaivedBranchComponent,
    WaiveChannelComponent,
    WaivedChannelsComponent,
    IdleComponent,
    RptbranchesComponent,
    RptsyslogsComponent,
    DashStatsComponent,
    AppInfoCardComponent,
    VerifyTellerComponent,
    VerifyCustomerDetailsComponent,
    BlockUiTemplateComponent,
    DeleteCustomerComponent,
    ProgressBarModalComponent,
    DeleteCustomerComponent,
    ConvertStaffToCustomerComponent,
    DetachCustomerComponent,
    DetachStaffComponent,
    EnrolledStaffComponent,
    ReportsTestComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    NgxChartsModule,
    ReactiveFormsModule,
    ChartsModule,
    ChartistModule,
    ModalModule.forRoot(),
    BlockUIModule.forRoot({
      template: BlockUiTemplateComponent
    }),
    BlockUIHttpModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(Approutes, { useHash: false, preloadingStrategy: PreloadAllModules }),
    PerfectScrollbarModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBUb3jDWJQ28vDJhuQZxkC0NXr_zycm8D0' }),
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SmartTableModule,
    ToastrModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    DataTablesModule
  ],
  entryComponents: [ConfirmDialogComponent, BlockUiTemplateComponent, ProgressBarModalComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    ServiceGuard,
    MySharedService,
    PendingChangesGuard,
    WebSocketServiceService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
