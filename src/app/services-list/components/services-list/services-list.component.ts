import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { ModuleService } from '../../../services/module.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
  responsive = true;
  cols = 1;
  accessibleModules: any[] = [];
  isDashboardAvailable: any = false;
  isOrganizationAvailable: any = false;
  isAlertsAvailable: any = false;
  isCalendarAvailable: any = false;
  isEmployeesAvailable: any = false;
  isLeaveAvailable: any = false;
  isAttendanceAvailable: any = false;
  isTimesheetsAvailable: any = false;
  isTaxationAvailable: any = false;
  isExpensesAvailable: any = false;
  isPayrollAvailable: any = false;
  isReportsAvailable: any = false;
  isSeparationAvailable: any = false;
  roles: any;
  constructor() { }

  ngOnInit() {
    this.accessibleModules = ModuleService.accessibleModules;
    let rolesArr = KeycloakService.getUserRole();
    if ((rolesArr.includes("proH2R_calendar_admin_full_access")) && this.accessibleModules.includes("calendar")) this.isCalendarAvailable = true;
    if (rolesArr.includes("proH2R_dashboard_full_access") && this.accessibleModules.includes("dashboard")) this.isDashboardAvailable = true;
    if ((rolesArr.includes("proH2R_organization_admin_full_access") || rolesArr.includes("proH2R_organization_admin_restricted_access")) && this.accessibleModules.includes("organization")) this.isOrganizationAvailable = true;
    if ((rolesArr.includes("proH2R_employees_admin_full_access") || rolesArr.includes("proH2R_employees_admin_restricted_access")) && this.accessibleModules.includes("employees")) this.isEmployeesAvailable = true;
    if ((rolesArr.includes("proH2R_attendance_admin_full_access") || rolesArr.includes("proH2R_attendance_admin_restricted_access")) && this.accessibleModules.includes("attendance")) this.isAttendanceAvailable = true;
    if ((rolesArr.includes("proH2R_leave_admin_full_access") || rolesArr.includes("proH2R_leave_admin_restricted_access")) && this.accessibleModules.includes("leave")) this.isLeaveAvailable = true;
    if ((rolesArr.includes("proH2R_expense_admin_full_access") || rolesArr.includes("proH2R_expense_admin_restricted_access")) && this.accessibleModules.includes("expenses")) this.isExpensesAvailable = true;
    if (this.accessibleModules.includes('alerts')) this.isAlertsAvailable = true;
    if ((rolesArr.includes("proH2R_separation_admin_full_access") || rolesArr.includes("proH2R_separation_admin_restricted_access")) && this.accessibleModules.includes("separation")) this.isSeparationAvailable = true;
    if ((rolesArr.includes("proH2R_timesheets_admin_full_access") || rolesArr.includes("proH2R_timesheets_admin_restricted_access")) && this.accessibleModules.includes("timesheets")) this.isTimesheetsAvailable = true;
    if ((rolesArr.includes("proH2R_payroll_admin_full_access") || rolesArr.includes("proH2R_payroll_admin_restricted_access")) && this.accessibleModules.includes("payroll")) this.isPayrollAvailable = true;
    if ((rolesArr.includes("proH2R_taxation_admin_full_access") || rolesArr.includes("proH2R_taxation_admin_restricted_access")) && this.accessibleModules.includes("taxation")) this.isTaxationAvailable = true;
    if ((rolesArr.includes("proH2R_reports_admin_full_access")) && this.accessibleModules.includes("reports")) this.isReportsAvailable = true;

  }

}
