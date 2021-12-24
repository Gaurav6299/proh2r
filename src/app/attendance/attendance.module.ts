import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
// import{NgxMaterialTimepickerEventService} from 'ngx-material-timepicker';
import { SettingsComponent } from './components/settings/settings.component';
import { AttendanceRecordsComponent, BulkAttendanceResponeModelComponent, BulkRegularizationResponeModelComponent } from './components/attendance-records/attendance-records.component';
import { RegularizationRequestsComponent } from './components/regularization-requests/regularization-requests.component';
import { AttendanceAuditComponent, AddDatePickerDialog, ImportToProH2RDialog } from './components/attendance-audit/attendance-audit.component';
import { AttendanceTemplatesComponent, TemplateDeleteComponent, AddLocationComponent, DeleteLocationComponent } from './components/settings/tabs/attendance-templates/attendance-templates.component';
import { LeftRightPanesComponent } from './components/settings/tabs/attendance-templates/left-right-panes/left-right-panes.component';
import { GeneralAttendanceSettingsComponent, addGeneralAttendaceSetting, DeleteBAttendanceGeneralSetting, AddOnDutyResons } from './components/settings/tabs/general-attendance-settings/general-attendance-settings.component';
import { NewRegularizationReqComponent, UploadAttendanceComponent, AddBulkRegReqComponent } from './components/attendance-records/attendance-records.component';
import { ClearRegularizationReqComponent } from './components/attendance-records/attendance-records.component';
import { AttendanceRecordsPanesComponent } from './components/attendance-records/attendance-records-panes/attendance-records-panes.component';
import { TemplateAssignmentComponent, AssignAttendenceTemplate, AssignSupervisorsComponent, DeleteTemplateComponent, UploadAttendenceTemplateComponent, UploadAttendenceSupervisorsComponent, AddAttendenceTemplateComponent, EditAttendenceTemplateComponent, OpenAttendanceHistory, BulkUploadTemplateAssignment, AttendanceBulkUploadResponseComponent } from './components/settings/tabs/template-assignment/template-assignment.component';
import { SharedModule } from '../shared.module'
import {
  MatTabsModule,
  MatTableModule,
  MatInputModule,
  MatPaginatorModule,
  MatDialogModule,
  MatButtonModule,
  MatDatepickerModule,
  MatRadioModule,
  MatNativeDateModule,
  MatListModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttendanceShiftComponent, AttdShiftDeleteDialogComponent } from './components/settings/tabs/attendance-shift/attendance-shift.component';
import { AddEditAttendanceComponent } from './components/settings/tabs/attendance-shift/add-edit-attendance/add-edit-attendance.component';
import {
  AttendanceShiftAssignmentComponent, AssignShiftDeleteComponent, AddShiftAssignmentsComponent,
  ShiftHistoryDialogComponent, ShiftAssignUploadDialogComponent, ShiftBulkUploadResponseComponent, BulkUploadShiftAssignment
} from './components/settings/tabs/attendance-shift-assignment/attendance-shift-assignment.component';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
// import { ReplaceUnderscorePipe } from '../services/ReplaceUnderscorePipe';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { OndutyAttendanceTemplateComponent, DeleteOndutyTemplateComponent } from './components/settings/tabs/onduty-attendance-template/onduty-attendance-template.component';
import { OndutyAttendanceTemplateAssignmentComponent, BulkOndutyAttendanceTemplateAssignmentComponent, DeleteOnDutyTemplateAssignmentComponent, BulkUploadOnDutyTemplateAssignment, OnDutyBulkUploadResponseComponent } from './components/settings/tabs/onduty-attendance-template-assignment/onduty-attendance-template-assignment.component';
import { OnDutyRequestsComponent, TeamOndutyRequestDialogComponent } from './components/on-duty-requests/on-duty-requests.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FileValidator } from '../organization/components/documents/tabs/company-policy-documents/file-input.validator';
import { RosterRecordsComponent, BulkRosterComponent, DeleteRostersDialogComponent, UpdateRostersDialogComponent, BulkUploadRosterRecordsComponent } from './components/roster-records/roster-records.component';
import { CalendarModule } from 'primeng/primeng';
import { MdePopoverModule } from '@material-extended/mde';
import { AttendanceProcessComponent, AttendanceProcessSyncDialogComponent, GenerateAttendanceProcessComponent } from './components/attendance-process/attendance-process/attendance-process.component';
import { ActiveEmployeesComponent, AttendanceRecordsDialogComponent, RegularizeAttendanceRecordsComponent, LeaveApplicationComponent, OndutyRequestDialogComponent } from './components/attendance-process/active-employees/active-employees.component';
import { BulkRerunForUploadEmployeesComponent, ProcessedEmployeesComponent, RerunSelectedEmployeesComponent } from './components/attendance-process/processed-employees/processed-employees.component';
import { PickListModule } from 'primeng/picklist';
import { AttendanceProcessTabComponent } from './components/attendance-process/attendance-process-tab/attendance-process-tab.component';
import { AttendanceValidationComponent, RunValidationDialogComponent } from './components/attendance-validation/attendance-validation.component';
import { BiometricLogComponent, LambdaTriggerDialogComponent } from './components/biometric-log/biometric-log.component';
import { AttendanceService } from './attendance.service';
import { AddApproveDialogComponent, ApproveMultipleDialogComponent, EditApproveDialogComponent, PendingRegRequestComponent, RejectApproveDialogComponent, RejectMultipleDialogComponent, ViewRegularizationPendingReqComponent } from './components/regularization-requests/tabs/pending-reg-request/pending-reg-request.component';
import { ApprovedRegRequestComponent, CancelledRegularizationReqDialogComponent, ViewRegularizationApprovedReqComponent } from './components/regularization-requests/tabs/approved-reg-request/approved-reg-request.component';
import { RejectedRegRequestComponent, ViewRegularizationRejectedReqComponent } from './components/regularization-requests/tabs/rejected-reg-request/rejected-reg-request.component';
import { CancelledRegRequestComponent, ViewRegularizationCancelledReqComponent } from './components/regularization-requests/tabs/cancelled-reg-request/cancelled-reg-request.component';
import { ApproveOndutyRequestDialogComponent, PendingOndutyRequestComponent, RejectOnDutyRequestsDialogComponent, ViewOndutyPendingRequestDialogComponent } from './components/on-duty-requests/tabs/pending-onduty-request/pending-onduty-request.component';
import { ApprovedOndutyRequestComponent, CancelOndutyRequestDialogComponent, ViewOndutyApprovedRequestDialogComponent } from './components/on-duty-requests/tabs/approved-onduty-request/approved-onduty-request.component';
import { CancelledOndutyRequestComponent, ViewOndutyCancelledRequestDialogComponent } from './components/on-duty-requests/tabs/cancelled-onduty-request/cancelled-onduty-request.component';
import { RejectedOndutyRequestComponent, ViewOndutyRejectedRequestDialogComponent } from './components/on-duty-requests/tabs/rejected-onduty-request/rejected-onduty-request.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { AccessChildGuard } from '../services/access-permission.guard';
@NgModule({
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    CalendarModule,
    MdePopoverModule,
    MatCardModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBxd-Rce45qk0zl-Q4128bKpaNGXoZMTy8',
      libraries: ['places']
    }),
    TableModule,
    PaginatorModule,
    MultiSelectModule,
    CheckboxModule,
    SharedModule,
    PickListModule,
    ColorPickerModule
  ],
  declarations: [
    AttendanceComponent,
    SettingsComponent,
    AttendanceRecordsComponent,
    RegularizationRequestsComponent,
    AddApproveDialogComponent,
    EditApproveDialogComponent,
    CancelledRegularizationReqDialogComponent,
    ApproveMultipleDialogComponent,
    RejectMultipleDialogComponent,
    RejectApproveDialogComponent,
    ViewRegularizationPendingReqComponent,
    ViewRegularizationApprovedReqComponent,
    ViewRegularizationCancelledReqComponent,
    ViewRegularizationRejectedReqComponent,
    AttendanceAuditComponent,
    AddDatePickerDialog,
    ImportToProH2RDialog,
    AttendanceTemplatesComponent,
    LeftRightPanesComponent,
    GeneralAttendanceSettingsComponent,
    addGeneralAttendaceSetting,
    AddOnDutyResons,
    DeleteBAttendanceGeneralSetting,
    NewRegularizationReqComponent,
    AddBulkRegReqComponent,
    UploadAttendanceComponent,
    ClearRegularizationReqComponent,
    AttendanceRecordsPanesComponent,
    TemplateAssignmentComponent,
    AssignAttendenceTemplate,
    AssignSupervisorsComponent,
    DeleteTemplateComponent,
    UploadAttendenceTemplateComponent,
    UploadAttendenceSupervisorsComponent,
    AddAttendenceTemplateComponent,
    EditAttendenceTemplateComponent,
    OpenAttendanceHistory,
    AttendanceShiftComponent,
    AddEditAttendanceComponent,
    AttdShiftDeleteDialogComponent,
    AttendanceShiftAssignmentComponent,
    AssignShiftDeleteComponent,
    AddShiftAssignmentsComponent,
    ShiftHistoryDialogComponent,
    ShiftAssignUploadDialogComponent,
    TemplateDeleteComponent,
    AddLocationComponent,
    DeleteLocationComponent,
    BulkAttendanceResponeModelComponent,
    OndutyAttendanceTemplateComponent,
    OndutyAttendanceTemplateAssignmentComponent,
    DeleteOndutyTemplateComponent,
    BulkOndutyAttendanceTemplateAssignmentComponent,
    DeleteOnDutyTemplateAssignmentComponent,
    OnDutyRequestsComponent,
    ApproveOndutyRequestDialogComponent,
    RejectOnDutyRequestsDialogComponent,
    TeamOndutyRequestDialogComponent,
    CancelOndutyRequestDialogComponent,
    ViewOndutyPendingRequestDialogComponent,
    ViewOndutyApprovedRequestDialogComponent,
    ViewOndutyRejectedRequestDialogComponent,
    ViewOndutyCancelledRequestDialogComponent,
    BulkRegularizationResponeModelComponent,
    RosterRecordsComponent,
    BulkRosterComponent,
    DeleteRostersDialogComponent,
    UpdateRostersDialogComponent,
    AttendanceProcessComponent,
    ActiveEmployeesComponent,
    AttendanceRecordsDialogComponent,
    RegularizeAttendanceRecordsComponent,
    ProcessedEmployeesComponent,
    GenerateAttendanceProcessComponent,
    BulkRerunForUploadEmployeesComponent,
    RerunSelectedEmployeesComponent,
    LeaveApplicationComponent,
    AttendanceProcessSyncDialogComponent,
    AttendanceProcessTabComponent,
    OndutyRequestDialogComponent,
    AttendanceValidationComponent,
    RunValidationDialogComponent,
    BiometricLogComponent,
    LambdaTriggerDialogComponent,
    BulkUploadRosterRecordsComponent,
    PendingRegRequestComponent,
    ApprovedRegRequestComponent,
    RejectedRegRequestComponent,
    CancelledRegRequestComponent,
    PendingOndutyRequestComponent,
    ApprovedOndutyRequestComponent,
    CancelledOndutyRequestComponent,
    RejectedOndutyRequestComponent,
    BulkUploadTemplateAssignment,
    BulkUploadOnDutyTemplateAssignment,
    OnDutyBulkUploadResponseComponent,
    AttendanceBulkUploadResponseComponent,
    BulkUploadShiftAssignment,
    ShiftBulkUploadResponseComponent
  ],
  entryComponents: [
    AddApproveDialogComponent,
    EditApproveDialogComponent,
    CancelledRegularizationReqDialogComponent,
    ApproveMultipleDialogComponent,
    RejectMultipleDialogComponent,
    RejectApproveDialogComponent,
    ViewRegularizationPendingReqComponent,
    ViewRegularizationApprovedReqComponent,
    ViewRegularizationCancelledReqComponent,
    ViewRegularizationRejectedReqComponent,
    AddDatePickerDialog,
    ImportToProH2RDialog,
    addGeneralAttendaceSetting,
    AddOnDutyResons,
    DeleteBAttendanceGeneralSetting,
    UploadAttendanceComponent,
    AssignAttendenceTemplate,
    AssignSupervisorsComponent,
    DeleteTemplateComponent,
    UploadAttendenceTemplateComponent,
    UploadAttendenceSupervisorsComponent,
    AddAttendenceTemplateComponent,
    EditAttendenceTemplateComponent,
    OpenAttendanceHistory,
    NewRegularizationReqComponent,
    AddBulkRegReqComponent,
    AttdShiftDeleteDialogComponent,
    AssignShiftDeleteComponent,
    AddShiftAssignmentsComponent,
    ShiftHistoryDialogComponent,
    ShiftAssignUploadDialogComponent,
    ClearRegularizationReqComponent,
    TemplateDeleteComponent,
    AddLocationComponent,
    DeleteLocationComponent,
    BulkAttendanceResponeModelComponent,
    DeleteOndutyTemplateComponent,
    BulkOndutyAttendanceTemplateAssignmentComponent,
    DeleteOnDutyTemplateAssignmentComponent,
    ApproveOndutyRequestDialogComponent,
    RejectOnDutyRequestsDialogComponent,
    TeamOndutyRequestDialogComponent,
    CancelOndutyRequestDialogComponent,
    ViewOndutyPendingRequestDialogComponent,
    ViewOndutyApprovedRequestDialogComponent,
    ViewOndutyRejectedRequestDialogComponent,
    ViewOndutyCancelledRequestDialogComponent,
    BulkRegularizationResponeModelComponent,
    BulkRosterComponent,
    DeleteRostersDialogComponent,
    UpdateRostersDialogComponent,
    GenerateAttendanceProcessComponent,
    BulkRerunForUploadEmployeesComponent,
    RerunSelectedEmployeesComponent,
    AttendanceRecordsDialogComponent,
    RegularizeAttendanceRecordsComponent,
    LeaveApplicationComponent,
    AttendanceProcessSyncDialogComponent,
    OndutyRequestDialogComponent,
    RunValidationDialogComponent,
    LambdaTriggerDialogComponent,
    BulkUploadRosterRecordsComponent,
    BulkUploadTemplateAssignment,
    BulkUploadOnDutyTemplateAssignment,
    OnDutyBulkUploadResponseComponent,
    AttendanceBulkUploadResponseComponent,
    BulkUploadShiftAssignment,
    ShiftBulkUploadResponseComponent
  ],
  providers: [AttendanceService, AccessChildGuard]
})
export class AttendanceModule { }
