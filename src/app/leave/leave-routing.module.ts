import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveComponent } from './components/leave/leave.component';

// tslint:disable-next-line:max-line-length
import { LeaveApplicationComponent, AddSingleLeaveApplication, MultipleLeaveApplication, EditIndividualLeaveAssignment } from './components/leave-application/leave-application.component';
import { LeaveBalanceComponent } from './components/leave-balance/leave-balance.component';
import { RolloverComponent, GenerateRolloverComponent, DeleteRolloverComponent } from './components/rollover/rollover.component';
import { LeaveSettingsComponent } from './components/leave-settings/leave-settings.component';
import { GeneralLeaveSettingComponent } from './components/leave-settings/tabs/general-leave-setting/general-leave-setting.component';
// tslint:disable-next-line:max-line-length
import { LeaveCategoriesSettingComponent, DeleteLeaveCategories } from './components/leave-settings/tabs/leave-categories-setting/leave-categories-setting.component';
import { LeaveTamplatesComponent, DeleteLeaveTamplate } from './components/leave-settings/tabs/leave-tamplates/leave-tamplates.component';
// tslint:disable-next-line:max-line-length
import { LeftRightLeveCategoriesyPanesComponent } from './components/leave-settings/tabs/leave-categories-setting/left-right-leve-categoriesy-panes/left-right-leve-categoriesy-panes.component';
// tslint:disable-next-line:max-line-length
import { LeftRightLeavetemplateSettingComponent } from './components/leave-settings/tabs/leave-tamplates/left-right-leavetemplate-setting/left-right-leavetemplate-setting.component';
// tslint:disable-next-line:max-line-length
import { LeaveAssignmentComponent, AssignLeaveTemplate, AssignLeaveSupervisor, UploadTemplateAssignment, UploadSupervisor, AddLeaveTemplateAssignment, EditLeaveTemplateAssignment, LeaveDelete, AddLeaveHistory } from './components/leave-settings/tabs/leave-assignment/leave-assignment.component';
// tslint:disable-next-line:max-line-length
import { DynamicLeaveCategoriesComponent } from './components/leave-settings/tabs/leave-tamplates/dynomictab/dynamic-leave-categories/dynamic-leave-categories.component';
import { CompOffsComponent } from './components/comp-offs/comp-offs.component';
import { AccessChildGuard } from '../services/access-permission.guard';
import { ShortLeaveComponent } from './components/short-leave/short-leave/short-leave.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveComponent, canActivateChild: [AccessChildGuard],
    children: [
      { path: '', component: LeaveSettingsComponent, data: {role: 'proH2R_leave_settings'} },
      { path: 'settings', component: LeaveSettingsComponent, data: {role: 'proH2R_leave_settings'} },
      { path: 'settings/:id', component: LeaveSettingsComponent, data: {role: 'proH2R_leave_settings'} },
      { path: 'leave-application', component: LeaveApplicationComponent, data: {role: 'proH2R_leave_application'} },
      { path: 'comp-offs', component: CompOffsComponent, data: {role: 'proH2R_leave_grant'} },
      { path: 'leave-balance', component: LeaveBalanceComponent, data: {role: 'proH2R_leave_balance'} },
      { path: 'rollover', component: RolloverComponent },
      { path: 'short-leave', component: ShortLeaveComponent, data: {role: 'proH2R_leave_application'} }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
