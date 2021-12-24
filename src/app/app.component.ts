import { Component, OnInit, Inject, AfterViewInit, ViewChild, ChangeDetectorRef, OnChanges, ElementRef, NgZone } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';
import { KeycloakService } from '../app/keycloak/keycloak.service';
import { UploadFileService } from './services/UploadFileService.service';
import { ApiCommonService } from './services/api-common.service';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from './services/spinner.service';
import { MatSidenav } from '@angular/material/sidenav';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { MouseEvent, GoogleMapsAPIWrapper, MarkerManager, AgmMap, MapsAPILoader } from '@agm/core'
import { Observable } from 'rxjs';
declare var $: any;
declare var google;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  isAvailable: boolean,
  subMenus: SubMenu[];
}

declare interface SubMenu {
  path: string;
  title: string;
  class: string;
  tooltip: string;
  isAvailable: boolean;
  role: string;
}
export let ROUTES: RouteInfo[] = [
  {
    path: 'services', title: 'Services', icon: 'apps', class: '', isAvailable: true,
    subMenus: []
  },
  {
    path: 'dashboard', title: 'Dashboard', icon: 'home', class: '', isAvailable: true,
    subMenus: []
  },
  {
    path: 'organization', title: 'Organization', icon: 'account_balance', class: '', isAvailable: false,
    subMenus: [

      { path: 'organization-setup', title: 'Organization Setup', class: '', tooltip: 'Create company profile and signatory details', isAvailable: false, role: 'proH2R_organization_setup' },
      { path: 'employee-fields', title: 'Employee Fields', class: '', tooltip: 'Create and manage employee profile section', isAvailable: false, role: 'proH2R_employee_fields' },
      { path: 'employee-tree', title: 'Employee Tree', class: '', tooltip: 'Hierarchical view of the organization', isAvailable: false, role: 'proH2R_employee_tree' },
      { path: 'documents', title: 'Documents', class: '', tooltip: 'Upload,View ,Assign and create templates and documents', isAvailable: false, role: 'proH2R_documents' },
      { path: 'assets', title: 'Asset Management', class: '', tooltip: 'Create ,Identify and allocate asset categories and asset', isAvailable: false, role: 'proH2R_asset_management' },
      { path: 'manage-administrators', title: 'Access Management', class: '', tooltip: 'Manage and access administrator rights', isAvailable: false, role: 'proH2R_access_management' },
    ]
  },
  {
    path: 'employees', title: 'Employees', icon: 'people', class: '', isAvailable: false,
    subMenus: []
  },
  {
    path: 'calendar', title: 'Calendar', icon: 'date_range', class: '', isAvailable: false,
    subMenus: []
  },
  // {
  //   path: 'roster', title: 'Roster', icon: 'av_timer', class: '',
  //   subMenus: [
  //     { path: 'roster-records', title: 'Roster Records', class: '' },
  //     { path: 'shifts', title: 'Shifts', class: '' }
  //   ]
  // },
  {
    path: 'attendance', title: 'Attendance', icon: 'content_paste', class: '', isAvailable: false,
    subMenus: [
      { path: 'settings', title: 'Settings', class: '', tooltip: '', isAvailable: false, role: 'proH2R_attendance_settings' },
      { path: 'attendance-records', title: 'Attendance Records', class: '', tooltip: '', isAvailable: false, role: 'proH2R_attendance_records' },
      { path: 'roster-records', title: 'Roster Records', class: '', tooltip: '', isAvailable: false, role: 'proH2R_roster_records' },
      { path: 'regularization-requests', title: 'Regularization Requests', class: '', tooltip: '', isAvailable: false, role: 'proH2R_regularization_requests' },
      { path: 'onDuty-requests', title: 'On Duty Requests', class: '', tooltip: '', isAvailable: false, role: 'proH2R_on_duty_requests' },
      { path: 'attendance-audit', title: 'Attendance Audit', class: '', tooltip: '', isAvailable: false, role: 'proH2R_attendance_audit' },
      { path: 'attendance-process', title: 'Attendance Process', class: '', tooltip: '', isAvailable: false, role: 'proH2R_attendance_process' },
      { path: 'attendance-validation', title: 'Attendance Reconciliation', class: '', tooltip: '', isAvailable: false, role: 'proH2R_attendance_reconciliation' },
      { path: 'biometric-log', title: 'Biometric Logs', class: '', tooltip: '', isAvailable: false, role: 'proH2R_biometric_logs' },

    ]
  },
  {
    path: 'timeSheets', title: 'Time Sheets', icon: 'update', class: '', isAvailable: false,
    subMenus: [
      { path: 'settings', title: 'Settings', class: '', tooltip: '', isAvailable: false, role: 'proH2R_timesheets_settings' },
      { path: 'projects', title: 'Projects', class: '', tooltip: '', isAvailable: false, role: 'proH2R_timesheets_projects' },
      { path: 'timesheet', title: 'Timesheets', class: '', tooltip: '', isAvailable: false, role: 'proH2R_timesheets' },
      { path: 'time-approval', title: 'Time Approvals', class: '', tooltip: '', isAvailable: false, role: 'proH2R_time_approvals' },
    ]
  },
  {
    path: 'leave', title: 'Leave', icon: 'local_airport', class: '', isAvailable: false,
    subMenus: [
      { path: 'settings', title: 'Settings', class: '', tooltip: '', isAvailable: false, role: 'proH2R_leave_settings' },
      { path: 'comp-offs', title: 'Leave Grant', class: '', tooltip: '', isAvailable: false, role: 'proH2R_leave_grant' },
      { path: 'leave-balance', title: 'Leave Balance', class: '', tooltip: '', isAvailable: false, role: 'proH2R_leave_balance' },
      { path: 'leave-application', title: 'Leave Application', class: '', tooltip: '', isAvailable: false, role: 'proH2R_leave_application' },
      { path: 'short-leave', title: 'Short Leave', class: '', tooltip: '', isAvailable: false, role: 'proH2R_leave_application' },
      // { path: 'rollover', title: 'Rollover', class: '' }
    ]
  },
  {
    path: 'expenses', title: 'Expenses', icon: 'sync', class: '', isAvailable: false,
    subMenus: [
      { path: 'settings', title: 'Settings', class: '', tooltip: '', isAvailable: false, role: 'proH2R_expense_settings' },
      { path: 'expense-reports', title: 'Expense Reports', class: '', tooltip: '', isAvailable: false, role: 'proH2R_expense_reports' },
      { path: 'advance-reports', title: 'Advance Reports', class: '', tooltip: '', isAvailable: false, role: 'proH2R_expense_reports' },
      // { path: 'expense-process-history', title: 'Expense Process History', class: '' }
    ]
  },
  {
    path: 'alerts', title: 'Alerts', icon: 'report', class: '', isAvailable: true,
    subMenus: [
      { path: 'setup-issues', title: 'Setup Issues', class: '', tooltip: '', isAvailable: true, role: '' },
      { path: 'pending-requests', title: 'Pending Requests', class: '', tooltip: '', isAvailable: true, role: '' },
      // { path: 'process-alerts', title: 'Process Alerts', class: '' }
    ]
  },

  // {
  //   path: 'flexibenefits', title: 'Flexi Benefits', icon: 'payment', class: '',
  //   subMenus: [

  //     { path: 'flexi-benefit', title: 'Flexi Benefits', class: '' },
  //     { path: 'employee-balance', title: 'Employee Balance', class: '' },
  //     { path: 'setting', title: 'Setting', class: '' },

  //     // { path: 'process-offcycle-payments', title: 'Process Offcycle Payments', class: '' },
  //     // { path: 'payslips', title: 'Payslips', class: '' },
  //     // { path: 'payroll-setting', title: 'Payroll Setting', class: '' },
  //     // { path: 'ctc-templates', title: 'CTC Templates', class: '' }
  //   ]
  // },
  {
    path: 'payroll', title: 'Payroll', icon: 'payment', class: '', isAvailable: false,
    subMenus: [
      { path: 'payroll-setting', title: 'Settings', class: '', tooltip: '', isAvailable: false, role: 'proH2R_payroll_settings' },
      { path: 'ctc-templates', title: 'CTC Templates', class: '', tooltip: '', isAvailable: false, role: 'proH2R_ctc_templates' },
      // { path: 'loans-applications', title: 'Loans Applications', class: '', tooltip: '' },
      { path: 'lop-reversal', title: 'LOP Reversal', class: '', tooltip: '', isAvailable: false, role: 'proH2R_lop_reversal' },
      { path: 'run-payroll', title: 'Run Payroll', class: '', tooltip: '', isAvailable: false, role: 'proH2R_run_payroll' },
      { path: 'payslips', title: 'Payslips', class: '', tooltip: '', isAvailable: false, role: 'proH2R_payslips' },
      // { path: 'process-offcycle-payments', title: 'Process Offcycle Payments', class: '' },

    ]
  },
  {
    path: 'tds-configuration', title: 'Taxation', icon: 'calculate', class: '', isAvailable: false,
    subMenus: [
      { path: 'settings', title: 'Settings', class: '', tooltip: '', isAvailable: false, role: 'proH2R_taxation_settings' },
      { path: 'tax-exemptions', title: 'Tax Exemptions', class: '', tooltip: '', isAvailable: false, role: 'proH2R_tax_exemptions' },
      { path: 'tax-declarations', title: 'Tax Declarations', class: '', tooltip: '', isAvailable: false, role: 'proH2R_tax_declarations' },
      { path: 'eTDS', title: 'eTDS', class: '', tooltip: '', isAvailable: false, role: 'proH2R_taxation_etds' },
    ]
  },
  {
    path: 'reports', title: 'Reports', icon: 'assessment', class: '', isAvailable: false,
    subMenus: [
      // { path: 'reports-setting', title: 'Settings', class: '', tooltip: '' },
      // { path: 'custom-report', title: 'Custom Reports', class: '', tooltip: '' },

    ]
  },
  {
    path: 'separation', title: 'Separation', icon: 'link', class: '', isAvailable: true,
    subMenus: [
      { path: 'separation-settings', title: 'Settings', class: '', tooltip: '', isAvailable: false, role: 'proH2R_separation_settings' },
      { path: 'separation-application', title: 'All Separation Requests', class: '', tooltip: '', isAvailable: false, role: 'proH2R_separation_requests' },
      { path: 'asset-deallocation', title: 'Asset Deallocation Requests', class: '', tooltip: '', isAvailable: false, role: 'proH2R_asset_deallocation_requests' }
      // { path: 'payslips', title: 'Payslips', class: '' },
      // { path: 'payroll-setting', title: 'Payroll Setting', class: '' },
      // { path: 'ctc-templates', title: 'CTC Templates', class: '' }
    ]
  }



  //  {
  //   path: 'recruitment', title: 'Recruitment', icon: 'work_outline', class: '', isAvailable: true,
  //   subMenus: [
  //     { path: 'recruitment-fields', title: 'Recruitment Fields', class: '' },
  //     { path: 'candidate-report', title: 'Candidate Report', class: '' },
  //     { path: 'candidate-letter-configuration', title: 'Generate Letter', class: '' },
  //     { path: 'interview-Schedular', title: 'Interview Schedular', class: '' },
  //     { path: 'update-status', title: 'Update Status', class: '' },
  //     { path: 'candidate-offer-letter', title: 'Offer Letter', class: '' },

  //   ]
  // }

  // {
  //   path: 'reports', title: 'Reports', icon: 'assessment', class: '',
  //   subMenus: []
  // }

  // ,
  // { path: 'timesheet', title: 'Timesheet',  icon: 'equalizer', class: '' },
  // { path: 'payroll', title: 'Payroll',  icon: 'location_on', class: '' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  logoPath: string = "https://proh2r.com/auth/resources/3.4.3.final/login/proh2r/img/" + environment.realm + ".png"
  @ViewChild(ApiCommonService) apiChild: ApiCommonService;
  @ViewChild('sidenav') sidenav: MatSidenav;
  // redirectPath: string = (environment.realm === "NileRealm") ? "/niletechnologies/emp" : "/niletechinnovations/emp";
  redirectPath: string = ""
  profilePicUrl: any = null;
  reason = '';
  userName: any
  emailId: string;
  positionedAs: any;
  ipAddress = '';
  private geoCoder;
  zoom: number;
  address: string;
  accessibleModules: any;
  // coordinates: { latitude: number; longitude: number; };
  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
  showLoader: boolean;
  baseUrl = environment.baseUrl;
  ipstack_access_key = environment.ipstack_access_key;
  title = 'app';
  position = 'after';
  isSidenavOpen = false;
  sidenavWidth = '230px';
  mainMArginLeft = '230px';
  mainPanelWidth = '';
  menuItems: any[];
  lastDayWorkingHour: any;
  isAuthorized: boolean = false;
  userFullName: string = 'full name';
  @ViewChild('search')
  public searchElementRef: ElementRef;
  circleRadius: number = 50;
  // latitude: number = 0.0;
  // longitude: number = 0.0;

  profileId;
  designation;
  joiningDate;
  workingLocation;
  profilePercent;
  initials;
  apiLoader = false;
  defaultImgUrlSidePanel = "assets/images/noUser.jpg";
  freezeButtonStatus: boolean = true;
  constructor(private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private spinnerService: SpinnerService,
    private cdRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private router: Router, public dialog: MatDialog,
    private http: HttpClient, private apiCommonService: ApiCommonService) {

    this.spinnerService.currentLoaderState.subscribe(state => this.apiLoader = state);
    console.log('base url is -->' + this.baseUrl);
    $("#routing-div").addClass("hide");
    $("#loading-div").addClass("hide");
    this.getProfileData();
    this.closeNav();
    this.userName = KeycloakService.getFullName();
    this.getProfilePicture();
    this.empCode = KeycloakService.getUsername();
    this.emailId = KeycloakService.getEmailId();
    switch (environment.realm) {
      case "NileTechInnovationsRealm": this.redirectPath = "/niletechinnovations/emp";
        break;
      case "ZonesRealm": this.redirectPath = "/zones/emp";
        break;
      case "ColorPlastRealm": this.redirectPath = "/colorplast/emp";
        break;
      case "NileTechnologies": this.redirectPath = "/niletechnologies/emp";
        break;
      case "LogixGridRealm": this.redirectPath = "/logixgrid/emp";
        break;
      case "InfinitySolutionsRealm": this.redirectPath = "/infinitysolutions/emp";
        break;
      case "NS3TechSolutionsRealm": this.redirectPath = "/ns3techsolutions/emp";
        break;
      case "HPAdhesivesRealm": this.redirectPath = "/hpadhesives/emp";
        break;
    }

  }
  defaultImgUrl = "assets/images/user.png";
  getProfilePicture() {
    var empCode = KeycloakService.getUsername();
    this.apiCommonService.get('/v1/employee/profile/' + empCode + '/header').subscribe(res => {
      console.log(res);
      if (res.empCode === empCode) {
        this.profilePicUrl = res.docId;
        this.positionedAs = res.positionedAs;
        this.freezeButtonStatus = res.freezeButtonStatus;
      }
    }, (err) => {

    }, () => {
      console.log(this.profilePicUrl);
    });
  }
  getProfileData() {
    this.apiCommonService.get('/v1/employee/profile/' + KeycloakService.getUsername() + '/header').
      subscribe(
        res => {
          console.log('<------------------ Employee Profile Information At Time Login ---------------------->');

          this.userName = res.empName;
          this.profileId = res.docId;
          this.designation = res.positionedAs;
          this.joiningDate = res.joinedOn;
          this.workingLocation = res.worksAt;
          this.profilePercent = res.profileCompletedRatio;
          const name = <string>res.empName;
          const names = name != null ? name.includes(' ') ? name.split(' ') : [] : [];
          this.initials = names.length > 0 ? names[0].charAt(0) + names[1].charAt(0) : '';
          this.accessibleModules = res.accessibleModule;

        },
        error => {

        },
        () => {
          this.userFullName = KeycloakService.getFullName();
          var rolesArr = KeycloakService.getUserRole();

          console.log('Logged in User Name :::' + KeycloakService.getUsername());
          var rolesArr = KeycloakService.getUserRole();
          console.log('Has role ----' + JSON.stringify(rolesArr));

          if (rolesArr.includes("restrictAdmin")) {
            this.isAuthorized = true;
            ROUTES.forEach(menuItem => {
              console.log('menu item ------ ' + JSON.stringify(menuItem));
              // Dashboard tab hide/show
              if (menuItem.title === 'Dashboard') {
                if (rolesArr.includes("proH2R_dashboard_full_access") && this.accessibleModules.includes("dashboard")) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Organization tab hide/show
              if (menuItem.title === 'Organization') {
                if ((rolesArr.includes("proH2R_organization_admin_full_access") || rolesArr.includes("proH2R_organization_admin_restricted_access")) && this.accessibleModules.includes("organization")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Employees tab hide/show
              if (menuItem.title === 'Employees') {
                if ((rolesArr.includes("proH2R_employees_admin_full_access") || rolesArr.includes("proH2R_employees_admin_restricted_access")) && this.accessibleModules.includes("employees")) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Calendar tab hide/show
              if (menuItem.title === 'Calendar') {
                if ((rolesArr.includes("proH2R_calendar_admin_full_access")) && this.accessibleModules.includes("calendar")) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Attendance tab hide/show
              if (menuItem.title === 'Attendance') {
                if ((rolesArr.includes("proH2R_attendance_admin_full_access") || rolesArr.includes("proH2R_attendance_admin_restricted_access")) && this.accessibleModules.includes("attendance")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Leave tab hide/show
              if (menuItem.title === 'Leave') {
                if ((rolesArr.includes("proH2R_leave_admin_full_access") || rolesArr.includes("proH2R_leave_admin_restricted_access")) && this.accessibleModules.includes("leave")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Expenses tab hide/show
              if (menuItem.title === 'Expenses') {
                if ((rolesArr.includes("proH2R_expense_admin_full_access") || rolesArr.includes("proH2R_expense_admin_restricted_access")) && this.accessibleModules.includes("expenses")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Alerts tab hide/show
              if (menuItem.title === 'Alerts') {
                if (this.accessibleModules.includes('alerts')) {
                  menuItem.isAvailable = true;
                  if (menuItem.subMenus.length > 0) menuItem.subMenus.forEach(subMenu => subMenu.isAvailable = true)
                }
                else menuItem.isAvailable = false;
              }
              // Resignation tab hide/show
              if (menuItem.title === 'Separation') {
                if ((rolesArr.includes("proH2R_separation_admin_full_access") || rolesArr.includes("proH2R_separation_admin_restricted_access")) && this.accessibleModules.includes("separation")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Time sheet tab hide/show
              if (menuItem.title === 'Time Sheets') {
                if ((rolesArr.includes("proH2R_timesheets_admin_full_access") || rolesArr.includes("proH2R_timesheets_admin_restricted_access")) && this.accessibleModules.includes("timesheets")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Payroll tab hide/show
              if (menuItem.title === 'Payroll') {
                if ((rolesArr.includes("proH2R_payroll_admin_full_access") || rolesArr.includes("proH2R_payroll_admin_restricted_access")) && this.accessibleModules.includes("payroll")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Taxation tab hide/show
              if (menuItem.title === 'Taxation') {
                if ((rolesArr.includes("proH2R_taxation_admin_full_access") || rolesArr.includes("proH2R_taxation_admin_restricted_access")) && this.accessibleModules.includes("taxation")) {
                  menuItem.isAvailable = true;
                  menuItem.subMenus.forEach(subMenu => {
                    if (rolesArr.find(role => role == subMenu.role)) {
                      subMenu.isAvailable = true;
                    }
                    else { subMenu.isAvailable = false; }
                  })
                } else {
                  menuItem.isAvailable = false;
                }
              }
              // Reports tab hide/show
              if (menuItem.title === 'Reports') {
                if ((rolesArr.includes("proH2R_reports_admin_full_access")) && this.accessibleModules.includes("reports")) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              this.menuItems = ROUTES.filter(menuItem => menuItem);

            });
          }
          if (rolesArr.includes("admin")) {
            this.isAuthorized = true;
            ROUTES.forEach(menuItem => {
              if (menuItem.title === 'Dashboard') {
                if (this.accessibleModules.includes('dashboard')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Organization') {
                if (this.accessibleModules.includes('organization')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Employees') {
                if (this.accessibleModules.includes('employees')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Calendar') {
                if (this.accessibleModules.includes('calendar')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Attendance') {
                if (this.accessibleModules.includes('attendance')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Timesheets') {
                if (this.accessibleModules.includes('timesheets')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Leave') {
                if (this.accessibleModules.includes('leave')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Expenses') {
                if (this.accessibleModules.includes('expenses')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Payroll') {
                if (this.accessibleModules.includes('payroll')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Taxation') {
                if (this.accessibleModules.includes('taxation')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Reports') {
                if (this.accessibleModules.includes('reports')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Separation') {
                if (this.accessibleModules.includes('separation')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
              if (menuItem.title === 'Alerts') {
                if (this.accessibleModules.includes('alerts')) {
                  menuItem.isAvailable = true;
                } else {
                  menuItem.isAvailable = false;
                }
              }
            })
            this.menuItems = ROUTES.filter(menuItem => menuItem);

          }
          if (!rolesArr.includes("admin") && !rolesArr.includes("restrictAdmin")) {
            this.isAuthorized = false;
            this.logout();
          }
        }
      );
  }
  duration: any = "00:00:00";
  start = new Date();
  intervalRef = null;




  // seconds = 0
  // minutes = 0
  // hours = 0
  // t: any

  // timer() {
  //   this.t = setTimeout(() => {
  //     this.seconds++;
  //     if (this.seconds >= 60) {
  //       this.seconds = 0;
  //       this.minutes++;
  //       if (this.minutes >= 60) {
  //         this.minutes = 0;
  //         this.hours++;
  //       }
  //     }

  //     this.duration = (this.hours ? (this.hours > 9 ? this.hours : "0" + this.hours) : "00") + ":" + (this.minutes ? (this.minutes > 9 ? this.minutes : "0" + this.minutes) : "00") + ":" + (this.seconds > 9 ? this.seconds : "0" + this.seconds);

  //     this.timer();
  //   }, 1000);
  // }

  timer(start) {
    this.intervalRef = setInterval(_ => {
      let count = (new Date()).valueOf() - (moment(start)).valueOf();

      // var x = moment(new Date().)
      // var y = moment(start)

      // var count=+moment.duration(x.diff(y)).as('milliseconds');
      let d = Math.floor(count / (60 * 60 * 1000 * 24) * 1);
      let h = Math.floor((count % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
      let m = Math.floor(((count % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
      let s = Math.floor((((count % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);
      // console.log(h+""+m+""+s)
      // this.duration=h + ":" + m + ":" + s;
      this.duration = (h ? (h > 9 ? h : "0" + h) : "00") + ":" + (m ? (m > 9 ? m : "0" + m) : "00") + ":" + (s > 9 ? s : "0" + s);

    }, 10);
  }

  /*Stop*/

  //clearTimeout(t);

  /* Clear button */
  clear() {
    this.duration = "00:00:00";
    // this.seconds = 0; this.minutes = 0; this.hours = 0;
  }

  time: Date;
  startClock(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }


  ngOnInit() {
    // this.http.get<{ ip: string }>('http://api.ipstack.com/check?access_key=' + this.ipstack_access_key)
    //   .subscribe(data => {
    //     console.log('th data', data);
    //     this.ipAddress = data.ip
    //   });
    // this.getProfileData();
    this.startClock();
    this.getMarKAttendanceRecords();
    console.log('Logged in user Full Name :::' + KeycloakService.getFullName());
    this.spinnerService.currentLoaderState.subscribe((state) => {
      this.apiLoader = state
      if (this.apiLoader === true) {
        console.log('In if block' + this.apiLoader);
        this.spinner.show();
      } else if (this.apiLoader === false) {
        console.log('In else block' + this.apiLoader);
        this.spinner.hide();
      }

    });

  }
  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    },
      {
        type: 'success',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }
  warningNotification(warningMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'error',
      message: warningMessage,
    },
      {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }
  // private setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 18;
  //     },
  //       (error) => {
  //         console.log(error);
  //         switch (error.code) {
  //           case error.PERMISSION_DENIED:
  //             this.warningNotification("Please enable location service to check in.");
  //             break;
  //           case error.POSITION_UNAVAILABLE:
  //             this.warningNotification("Location information is unavailable.");
  //             break;
  //           case error.TIMEOUT:
  //             this.warningNotification("The request to get user location timed out.");
  //             break;
  //           default:
  //             this.warningNotification("An unknown error occurred.");
  //             break;
  //         }
  //       });
  //   }
  //   console.log(this.latitude);
  //   console.log(this.longitude);

  // }

  // getAddress(latitude, longitude) {
  //   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
  //     console.log(results);
  //     console.log(status);
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 18;
  //         this.address = results[0].formatted_address;
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }

  //   });
  // }


  //load Places Autocomplete


  ngAfterViewInit() {
    console.log('Inside after view init method');
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.spinner.show();
      } else if (event instanceof RouteConfigLoadEnd) {
        this.spinner.hide();
      }
    });

    console.log('Inside after view init method Ends');

  }



  toggleSidenav() {
    console.log('clicked');
    if (this.isSidenavOpen) {
      // sidenav is open, so close it
      this.closeNav();
      setTimeout(() => this.isSidenavOpen = false, 40);
      // this.isSidenavOpen = false;
    } else {
      // sidenav is closed, so open it
      this.openNav();
      setTimeout(() => this.isSidenavOpen = true, 40);
      // this.isSidenavOpen = true;
    }
  }

  logout() {
    KeycloakService.logout();
  }
  openNav() {
    // console.log('open sidenav');
    this.sidenavWidth = '230px';
    let newWidth = $('#mainPanel').width() - 150;
    this.mainPanelWidth = newWidth + 'px';
    console.log('opening sidenav :: main panel width -->' + this.mainPanelWidth);
  }

  closeNav() {
    // console.log('close sidenav');
    this.sidenavWidth = '80px';
    let newWidth = $('#mainPanel').width() + 150;
    this.mainPanelWidth = newWidth + 'px';
    console.log('closing sidenav :: main panel width -->' + this.mainPanelWidth);
  }

  onResize(event) {
    console.log(event.target.innerWidth);
    let newWidth = event.target.innerWidth - $('#mySidenav').width();
    this.mainPanelWidth = newWidth + 'px';
    // console.log('on window resize:: main panel width -->' + this.mainPanelWidth);
  }

  linkClicked(i) {
    // console.log('linkClicked');
    console.log(this.menuItems[i].path);
    var selector = 'a[href^="#' + this.menuItems[i].path + '"]';
    // $('a[href^='#organization']').children()[2].classList.toggle('down')
    $(selector).children()[2].classList.toggle('down');
    // $('.rotate').toggleClass('down');
  }
  subMenulinkClicked() {
    console.log('subMenulinkClicked');
  }

  onMouseEnterMenuItem(e) {
    let item = '#menulink' + e;
    if ($(item)[0]) {
      // console.log('Mouse Enter '+e)
      // console.log($(item)[0]);
      $(item)[0].style.display = 'block';
      $(item)[0].style.position = 'fixed';
      $(item)[0].style.left = '71px';
      // console.log('Offset top = ' + ($(item).parent().position().top - 220));
      const topStyle = ($(item).parent().position().top) + 'px';
      $(item)[0].style.top = topStyle;
      // $(item)[0].style.height='100%';
      $(item)[0].style.backgroundColor = '#ededed';
      // tslint:disable-next-line:max-line-length
      $(item)[0].style.boxShadow = '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)';
      // const menuItemStyle=''display': 'block', 'position' : 'fixed','left': '71px','top': '70px','height': '100%','background-color': '#ededed','box-shadow': '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)'';
    }
  }
  // Punchin Dialgoue
  // openDialog(): void {
  //   console.log('inside dialg method');
  //   const dialogRef = this.dialog.open(AddAttendenceInformation, {
  //     width: '600px',
  //     data: { lastDayWorkingHour: this.lastDayWorkingHour, }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('the dialog was closed');
  //   });
  // }

  onMouseLeaveMenuItem(e) {
    var item = '#menulink' + e;
    if ($(item)[0]) {
      // console.log('Mouse Leave '+e)
      // console.log($(item)[0]);
      $(item)[0].style.display = 'none';

      // tslint:disable-next-line:max-line-length
      // var menuItemStyle=''display': 'block', 'position' : 'fixed','left': '71px','top': '70px','height': '100%','background-color': '#ededed','box-shadow': '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)'';
    }
  }

  empCode: any;
  action: any;
  error: any;
  punchInHours = '00';
  punchInMinutes = '00';
  punchInSecond = '00';

  punchOutHours = '00';
  punchOutMinutes = '00';
  punchOutSecond = '00';

  durationInHours = '00';
  durationInMinutes = '00';

  punchInDate: Date;
  punchOutDate: Date;
  recordCount = 0;
  getMarKAttendanceRecords() {

    console.log('getMarKAttendanceRecords called');
    this.apiCommonService.get('/v1/attendance/attendanceRecords/getMarkAttendance/' + this.empCode).subscribe(
      res => {
        console.log(res);
        let firstResponse = null;
        let lastResponse = null;
        if (res !== null) {
          const usersJson: any[] = res;
          this.recordCount = usersJson.length;
          var checkoutArr = [];
          var checkInArr = [];
          checkoutArr = usersJson.filter(json => json.markAttendanceType == 'CHECKOUT');
          checkInArr = usersJson.filter(json => json.markAttendanceType == 'CHECKIN');

          this.timer(res[0].localTimeLog);
          let punchInDate: Date;
          let punchOutDate: Date;

          console.log(usersJson);
          console.log(usersJson.length);

          if (checkInArr.length > 0) {
            this.freezeButtonStatus = checkInArr[0].buttonStatus;
            firstResponse = checkInArr[0];
            console.log('record for punchIn');
            console.log(firstResponse);
            punchInDate = new Date(firstResponse.localTimeLog);
            if (punchInDate.getHours() < 10) {
              this.punchInHours = '0' + punchInDate.getHours();
            } else {
              this.punchInHours = '' + punchInDate.getHours();
            }

            if (punchInDate.getMinutes() < 10) {
              this.punchInMinutes = '0' + punchInDate.getMinutes();
            } else {
              this.punchInMinutes = '' + punchInDate.getMinutes();
            }

            if (punchInDate.getSeconds() < 10) {
              this.punchInSecond = '0' + punchInDate.getSeconds();
            } else {
              this.punchInSecond = '' + punchInDate.getSeconds();
            }

          }
          if (checkoutArr.length > 0) {
            lastResponse = checkoutArr[checkoutArr.length - 1];
            punchOutDate = new Date(lastResponse.localTimeLog);
            if (punchOutDate.getHours() < 10) {
              this.punchOutHours = '0' + punchOutDate.getHours();
            } else {
              this.punchOutHours = '' + punchOutDate.getHours();
            }

            if (punchOutDate.getMinutes() < 10) {
              this.punchOutMinutes = '0' + punchOutDate.getMinutes();
            } else {
              this.punchOutMinutes = '' + punchOutDate.getMinutes();
            }

            if (punchOutDate.getSeconds() < 10) {
              this.punchOutSecond = '0' + punchOutDate.getSeconds();
            } else {
              this.punchOutSecond = '' + punchOutDate.getSeconds();
            }

            const duration = lastResponse.duration;
            if (duration < 10) {
              this.durationInHours = '0' + duration;
            } else {
              this.durationInHours = '' + duration;
            }
            if (checkInArr.length == 0) {
              this.freezeButtonStatus = false;
            }

          }

        }

      },
      err => {
        console.log(err);
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
      },
      () => {

        console.log('On complete /v1/attendance/attendanceRecords/getMarkAttendance/');

      }
    );
  }


  punchInTimeStart() {
    console.log('punchin time start');
    const body = {
      deviceType: 'WEBCHECKIN',
      duration: '00:00',
      accuracy: '',
      empCode: KeycloakService.getUsername(),
      ipAddress: this.ipAddress,
      latitude: '',
      // localTimeLog: punchInDate.toLocaleString('en-GB'),
      logId: 0,
      markAttendanceType: 'CHECKIN',
      longitude: ''
    };

    this.apiCommonService.post('/v1/attendance/attendanceRecords/', body).subscribe(
      res => {
        console.log("PUNCHIN RECORD SENT")
        console.log(res)
        const punchInDate = new Date();
        if (punchInDate.getHours() < 10) {
          this.punchInHours = '0' + punchInDate.getHours();
        } else {
          this.punchInHours = '' + punchInDate.getHours();
        }

        if (punchInDate.getMinutes() < 10) {
          this.punchInMinutes = '0' + punchInDate.getMinutes();
        } else {
          this.punchInMinutes = '' + punchInDate.getMinutes();
        }

        if (punchInDate.getSeconds() < 10) {
          this.punchInSecond = '0' + punchInDate.getSeconds();
        } else {
          this.punchInSecond = '' + punchInDate.getSeconds();
        }
        this.successNotification(res.message)
      },
      err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
      }, () => {
        console.log('Post Request Complete');
        this.getMarKAttendanceRecords();

      }
    );

  }

  punchOutTime() {
    // due to resion of geolocation not working
    const body = {
      duration: '00:00',
      accuracy: '',
      deviceType: 'WEBCHECKIN',
      empCode: KeycloakService.getUsername(),
      ipAddress: this.ipAddress,
      latitude: '',
      // localTimeLog: punchOutDate.toLocaleString('en-GB'),
      logId: 0,
      markAttendanceType: 'CHECKOUT',
      longitude: ''
    };
    this.apiCommonService.post('/v1/attendance/attendanceRecords/', body).subscribe(
      res => {
        const punchOutDate = new Date();
        if (punchOutDate.getHours() < 10) {
          this.punchOutHours = '0' + punchOutDate.getHours();
        } else {
          this.punchOutHours = '' + punchOutDate.getHours();
        }

        if (punchOutDate.getMinutes() < 10) {
          this.punchOutMinutes = '0' + punchOutDate.getMinutes();
        } else {
          this.punchOutMinutes = '' + punchOutDate.getMinutes();
        }

        if (punchOutDate.getSeconds() < 10) {
          this.punchOutSecond = '0' + punchOutDate.getSeconds();
        } else {
          this.punchOutSecond = '' + punchOutDate.getSeconds();
        }
        this.successNotification("You are successfully Punched Out")
      },
      err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
      },
      () => {
        console.log('Post Request Complete');
        this.getMarKAttendanceRecords();

      }
    );


  }

}
export interface MyCoordiantes {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
}

