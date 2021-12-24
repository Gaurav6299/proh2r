import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeSheetsComponent } from './components/time-sheets/time-sheets.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TimeApprovalComponent } from './components/time-approval/time-approval.component';
import { AccessChildGuard } from '../services/access-permission.guard';

const routes: Routes = [
  {
    path: '',
    component: TimeSheetsComponent, canActivateChild: [AccessChildGuard],
    children: [
      { path: '', component: ProjectsComponent, data: {role: 'proH2R_timesheets_projects'} },
      { path: 'projects', component: ProjectsComponent, data: {role: 'proH2R_timesheets_projects'} },
      { path: 'tracker/:projectId', component: TrackerComponent, data: {role: 'proH2R_timesheets_projects'} },
      { path: 'timesheet', component: TimesheetComponent, data: {role: 'proH2R_timesheets'} },
      { path: 'settings', component: SettingsComponent, data: {role: 'proH2R_timesheets_settings'} },
      { path: 'time-approval', component: TimeApprovalComponent, data: {role: 'proH2R_time_approvals'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetsRoutingModule { }
