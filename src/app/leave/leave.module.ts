import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveComponent } from './components/leave/leave.component';
import { LeaveApplicationComponent, AddSingleLeaveApplication, MultipleLeaveApplication, EditIndividualLeaveAssignment } from './components/leave-application/leave-application.component';
import { BulkUploadLeaveBalanceDialogComponent, LeaveBalanceComponent } from './components/leave-balance/leave-balance.component';
import { RolloverComponent, GenerateRolloverComponent, DeleteRolloverComponent } from './components/rollover/rollover.component';
import { LeaveSettingsComponent } from './components/leave-settings/leave-settings.component';
import { GeneralLeaveSettingComponent } from './components/leave-settings/tabs/general-leave-setting/general-leave-setting.component';
import { LeaveCategoriesSettingComponent, DeleteLeaveCategories } from './components/leave-settings/tabs/leave-categories-setting/leave-categories-setting.component';
import { LeaveTamplatesComponent, DeleteLeaveTamplate } from './components/leave-settings/tabs/leave-tamplates/leave-tamplates.component';
import { LeftRightLeveCategoriesyPanesComponent } from './components/leave-settings/tabs/leave-categories-setting/left-right-leve-categoriesy-panes/left-right-leve-categoriesy-panes.component';
import { LeftRightLeavetemplateSettingComponent } from './components/leave-settings/tabs/leave-tamplates/left-right-leavetemplate-setting/left-right-leavetemplate-setting.component';
import { LeaveAssignmentComponent, AssignLeaveTemplate, AssignLeaveSupervisor, UploadTemplateAssignment, UploadSupervisor, AddLeaveTemplateAssignment, EditLeaveTemplateAssignment, LeaveDelete, AddLeaveHistory, BulkUploadTemplateAssignment, LeaveTemplateBulkUploadResponseComponent } from './components/leave-settings/tabs/leave-assignment/leave-assignment.component';
import { DynamicLeaveCategoriesComponent } from './components/leave-settings/tabs/leave-tamplates/dynomictab/dynamic-leave-categories/dynamic-leave-categories.component';
import { StepperService } from './service/stepper.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import {
  MatTabsModule,
  MatTableModule,
  MatInputModule,
  MatPaginatorModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatRadioModule,
  MatNativeDateModule,
  MatListModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CompOffsComponent,
  CompoffsReqComponent,
} from './components/comp-offs/comp-offs.component';
import { SharedModule } from '../shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { BulkEmployeeInviteResponeModelComponent } from '../../app/employees/components/employees-main/employees-main.component';
import { LeaveService } from './leave.service';
import { ApproveIndividualCompOffReqComponent, CompOffsPendingComponent, DeleteCompOffRequestComponent, EditCompOffRequestComponent, RejectCompOffRequestComponent, ViewCompoffsPendingReqComponent } from './components/comp-offs/tabs/comp-offs-pending/comp-offs-pending.component';
import { CompOffsApprovedComponent, DeleteCompOffApprovedRequestComponent, ViewCompoffsApprovedReqComponent } from './components/comp-offs/tabs/comp-offs-approved/comp-offs-approved.component';
import { CompOffsRejectedComponent, ViewCompoffsRejectedReqComponent } from './components/comp-offs/tabs/comp-offs-rejected/comp-offs-rejected.component';
import { ApplicationPendingComponent, ApproveIndividualLeave, ApproveLeaveMultipleRequest, BulkApproveCancelLeave, BulkRejectCancelLeave, DeleteLeaveRequest, RejectIndividualLeave, RejectLeaveMultipleRequest, ViewLeavePendingReqComponent } from './components/leave-application/tabs/application-pending/application-pending.component';
import { ApplicationApprovedComponent, CancelIndividualLeaveRequest, ViewLeaveApprovedReqComponent } from './components/leave-application/tabs/application-approved/application-approved.component';
import { ApplicationRejectedComponent, ViewLeaveRejectedReqComponent } from './components/leave-application/tabs/application-rejected/application-rejected.component';
import { ApplicationCancelledComponent, ViewLeaveCancelledReqComponent } from './components/leave-application/tabs/application-cancelled/application-cancelled.component';
import { AccessChildGuard } from '../services/access-permission.guard';
import { ActionOnShortLeave, AddShortLeave, BulkActionOnShortLeave, ShortLeaveComponent, ViewLeaveComponent } from './components/short-leave/short-leave/short-leave.component';
// 'src/app/employees/components/employees-main/employees-main.component';
// import { BulkEmployeeInviteResponeModelComponent } from '../employees/components/employees-main/employees-main.component';
// import { ReplaceUnderscorePipe } from '../services/ReplaceUnderscorePipe';

@NgModule({
  imports: [
    CommonModule,
    LeaveRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    SharedModule,
    NgSelectModule,
    MultiSelectModule,
    TableModule,
    TooltipModule,
    CalendarModule
  ],
  declarations: [
    LeaveComponent,
    LeaveApplicationComponent,
    ViewLeavePendingReqComponent,
    ViewLeaveApprovedReqComponent,
    ViewLeaveRejectedReqComponent,
    ViewLeaveCancelledReqComponent,
    AddSingleLeaveApplication,
    MultipleLeaveApplication,
    RejectLeaveMultipleRequest,
    ApproveLeaveMultipleRequest,
    BulkApproveCancelLeave,
    BulkRejectCancelLeave,
    EditIndividualLeaveAssignment,
    RejectIndividualLeave,
    DeleteLeaveRequest,
    ApproveIndividualLeave,
    CancelIndividualLeaveRequest,
    LeaveBalanceComponent,
    RolloverComponent,
    GenerateRolloverComponent,
    DeleteRolloverComponent,
    LeaveSettingsComponent,
    GeneralLeaveSettingComponent,
    LeaveCategoriesSettingComponent,
    DeleteLeaveCategories,
    LeaveTamplatesComponent,
    DeleteLeaveTamplate,
    LeftRightLeveCategoriesyPanesComponent,
    LeftRightLeavetemplateSettingComponent,
    LeaveAssignmentComponent,
    AssignLeaveTemplate,
    AssignLeaveSupervisor,
    UploadTemplateAssignment,
    UploadSupervisor,
    AddLeaveTemplateAssignment,
    EditLeaveTemplateAssignment,
    LeaveDelete,
    AddLeaveHistory,
    DynamicLeaveCategoriesComponent,
    CompOffsComponent,
    CompoffsReqComponent,
    EditCompOffRequestComponent,
    ViewCompoffsPendingReqComponent,
    RejectCompOffRequestComponent,
    DeleteCompOffRequestComponent,
    DeleteCompOffApprovedRequestComponent,
    ApproveIndividualCompOffReqComponent,
    BulkUploadLeaveBalanceDialogComponent,
    CompOffsPendingComponent,
    CompOffsApprovedComponent,
    CompOffsRejectedComponent,
    ViewCompoffsApprovedReqComponent,
    ViewCompoffsRejectedReqComponent,
    ApplicationPendingComponent,
    ApplicationApprovedComponent,
    ApplicationRejectedComponent,
    ApplicationCancelledComponent,
    ShortLeaveComponent,
    ViewLeaveComponent,
    ActionOnShortLeave,
    AddShortLeave,
    BulkActionOnShortLeave,
    BulkUploadTemplateAssignment,
    LeaveTemplateBulkUploadResponseComponent
  ],
  entryComponents: [
    AddSingleLeaveApplication,
    MultipleLeaveApplication,
    RejectLeaveMultipleRequest,
    ApproveLeaveMultipleRequest,
    BulkApproveCancelLeave,
    BulkRejectCancelLeave,
    EditIndividualLeaveAssignment,
    RejectIndividualLeave,
    DeleteLeaveRequest,
    ApproveIndividualLeave,
    CancelIndividualLeaveRequest,
    GenerateRolloverComponent,
    DeleteRolloverComponent,
    DeleteLeaveCategories,
    DeleteLeaveTamplate,
    AssignLeaveTemplate,
    AssignLeaveSupervisor,
    UploadTemplateAssignment,
    UploadSupervisor,
    AddLeaveTemplateAssignment,
    EditLeaveTemplateAssignment,
    LeaveDelete,
    AddLeaveHistory,
    ViewLeavePendingReqComponent,
    ViewLeaveApprovedReqComponent,
    ViewLeaveRejectedReqComponent,
    ViewLeaveCancelledReqComponent,
    CompoffsReqComponent,
    ViewCompoffsPendingReqComponent,
    EditCompOffRequestComponent,
    RejectCompOffRequestComponent,
    DeleteCompOffRequestComponent,
    DeleteCompOffApprovedRequestComponent,
    ApproveIndividualCompOffReqComponent,
    BulkUploadLeaveBalanceDialogComponent,
    LeaveBalanceComponent,
    BulkEmployeeInviteResponeModelComponent,
    ViewCompoffsApprovedReqComponent,
    ViewCompoffsRejectedReqComponent,
    ViewLeaveComponent,
    ActionOnShortLeave,
    AddShortLeave,
    BulkActionOnShortLeave,
    BulkUploadTemplateAssignment,
    LeaveTemplateBulkUploadResponseComponent
  ],
  providers: [
    LeaveService,
    StepperService,
    AccessChildGuard
  ]

})
export class LeaveModule { }
