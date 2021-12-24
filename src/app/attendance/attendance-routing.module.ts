import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './components/attendance/attendance.component';

import { SettingsComponent } from './components/settings/settings.component';
import { AttendanceRecordsComponent } from './components/attendance-records/attendance-records.component';
import { RegularizationRequestsComponent } from './components/regularization-requests/regularization-requests.component';
import { AttendanceAuditComponent } from './components/attendance-audit/attendance-audit.component';
import { OnDutyRequestsComponent } from './components/on-duty-requests/on-duty-requests.component';
import { RosterRecordsComponent } from './components/roster-records/roster-records.component';
import { AttendanceProcessComponent } from './components/attendance-process/attendance-process/attendance-process.component';
import { ActiveEmployeesComponent } from './components/attendance-process/active-employees/active-employees.component';
import { AttendanceProcessTabComponent } from './components/attendance-process/attendance-process-tab/attendance-process-tab.component';
import { ProcessedEmployeesComponent } from './components/attendance-process/processed-employees/processed-employees.component';
import { AttendanceValidationComponent } from './components/attendance-validation/attendance-validation.component';
import { BiometricLogComponent } from './components/biometric-log/biometric-log.component';
import { AccessChildGuard } from '../services/access-permission.guard';
import { fullCalendar } from 'jquery';

const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent, canActivateChild: [AccessChildGuard],
    children: [
      { path: '', component: SettingsComponent },
      { path: 'settings', component: SettingsComponent, data: {role: 'proH2R_attendance_settings'} },
      { path: 'settings/:id', component: SettingsComponent, data: {role: 'proH2R_attendance_settings'} },
      { path: 'attendance-records', component: AttendanceRecordsComponent, data: {role: 'proH2R_attendance_records'} },
      { path: 'regularization-requests', component: RegularizationRequestsComponent, data: {role: 'proH2R_regularization_requests'} },
      { path: 'attendance-audit', component: AttendanceAuditComponent, data: {role: 'proH2R_attendance_audit'} },      
      { path: 'onDuty-requests', component: OnDutyRequestsComponent, data: {role: 'proH2R_on_duty_requests'} },
      { path: 'roster-records', component: RosterRecordsComponent, data: {role: 'proH2R_roster_records'} },
      { path: 'attendance-process', component: AttendanceProcessComponent, data: {role: 'proH2R_attendance_process'} },
      { path: 'attendance-process-tab/:monthYear/:id', component: AttendanceProcessTabComponent, data: {role: 'proH2R_attendance_process'} },
      { path: 'attendance-process-tab/:monthYear', component: AttendanceProcessTabComponent, data: {role: 'proH2R_attendance_process'} },
      { path: 'attendance-validation', component: AttendanceValidationComponent, data: {role: 'proH2R_attendance_reconciliation'} },
      { path: 'biometric-log', component: BiometricLogComponent, data: {role: 'proH2R_biometric_logs'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
