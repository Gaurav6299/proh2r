import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccessModuleGuard } from './services/access-permission.guard';

const routes: Routes = [
  {
    path: 'services',
    loadChildren: 'app/services-list/services-list.module#ServicesListModule'
  },
  {
    path: 'dashboard',
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
    canLoad: [AccessModuleGuard],
    data: { role: ['proH2R_dashboard_full_access'], module: 'dashboard' }
  },
  {
    path: 'organization', canLoad: [AccessModuleGuard], data: { role: ['proH2R_organization_admin_full_access', 'proH2R_organization_admin_restricted_access'], module: 'organization' },
    loadChildren: 'app/organization/organization.module#OrganizationModule'
  },

  {
    path: 'employees', canLoad: [AccessModuleGuard], data: { role: ['proH2R_employees_admin_full_access', 'proH2R_employees_admin_restricted_access'], module: 'employees' },
    loadChildren: 'app/employees/employees.module#EmployeesModule'
  },
  {
    path: 'calendar',
    loadChildren: 'app/calendar/calendar.module#CalendarModule',
    canLoad: [AccessModuleGuard],
    data: { role: ['proH2R_calendar_admin_full_access'], module: 'calendar' }
  },
  {
    path: 'roster',
    loadChildren: 'app/roster/roster.module#RosterModule'
  },
  {
    path: 'attendance', canLoad: [AccessModuleGuard], data: { role: ['proH2R_attendance_admin_full_access', 'proH2R_attendance_admin_restricted_access'], module: 'attendance' },
    loadChildren: 'app/attendance/attendance.module#AttendanceModule'
  },
  {
    path: 'leave', canLoad: [AccessModuleGuard], data: { role: ['proH2R_leave_admin_full_access', 'proH2R_leave_admin_restricted_access'], module: 'leave' },
    loadChildren: 'app/leave/leave.module#LeaveModule'
  },
  {
    path: 'expenses',
    loadChildren: 'app/expenses/expenses.module#ExpensesModule',
    canLoad: [AccessModuleGuard],
    data: { role: ['proH2R_expense_admin_full_access', 'proH2R_expense_admin_restricted_access'], module: 'expenses' }
  },
  {
    path: 'alerts',
    loadChildren: 'app/alerts/alerts.module#AlertsModule',
    canLoad: [AccessModuleGuard],
    data: { role: [], module: 'alerts' }
  },
  {
    path: 'flexi-benefits',
    loadChildren: 'app/flexi-benefits/flexi-benefits.module#FlexiBenefitsModule'
  },
  {
    path: 'payroll',
    loadChildren: 'app/payroll/payroll.module#PayrollModule',
    canLoad: [AccessModuleGuard],
    data: { role: ['proH2R_payroll_admin_full_access', 'proH2R_payroll_admin_restricted_access'], module: 'payroll' }
  },
  {
    path: 'tds-configuration', canLoad: [AccessModuleGuard], data: { role: ['proH2R_taxation_admin_full_access', 'proH2R_taxation_admin_restricted_access'], module: 'taxation' },
    loadChildren: 'app/tds-configuration/tds-configuration.module#TDSConfigurationModule'
  },
  {
    path: 'reports',
    loadChildren: 'app/reports/reports.module#ReportsModule',
    canLoad: [AccessModuleGuard],
    data: { role: ['proH2R_reports_admin_full_access'], module: 'reports' }
  },
  {
    path: 'timeSheets', canLoad: [AccessModuleGuard], data: { role: ['proH2R_timesheets_admin_full_access', 'proH2R_timesheets_admin_restricted_access'], module: 'timesheets' },
    loadChildren: 'app/time-sheets/time-sheets.module#TimeSheetsModule'
  },
  {
    path: 'recruitment',
    loadChildren: 'app/recruitment/recruitment.module#RecruitmentModule'
  },
  {
    path: '',
    redirectTo: 'services',
    pathMatch: 'full'
  },
  {
    path: 'separation',
    loadChildren: 'app/resignation/resignation.module#ResignationModule',
    canLoad: [AccessModuleGuard],
    data: { role: ['proH2R_separation_admin_full_access', 'proH2R_separation_admin_restricted_access'], module: 'separation' }
  },
  {
    path: 'assets', canLoad: [AccessModuleGuard], data: { role: ['proH2R_organization_admin_full_access', 'proH2R_organization_admin_restricted_access'], module: 'organization' },
    loadChildren: 'app/assets/assets.module#AssetsModule'
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
