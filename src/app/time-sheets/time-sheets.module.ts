import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSheetsRoutingModule } from './time-sheets-routing.module';
import { TimeSheetsComponent } from './components/time-sheets/time-sheets.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsLeftRightComponent } from './components/projects/projects-left-right/projects-left-right.component';
// tslint:disable-next-line: max-line-length
import { MatTabsModule, MatTableModule, MatInputModule, MatDialogModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule, MatTooltipModule, MatRadioModule, MatCheckboxModule, MatListModule, MatCardModule, MatPaginatorModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrackerComponent } from './components/tracker/tracker.component';
import { ActivityFeedTrackerComponent, ApproveRejectTimesheetsComponent } from './components/tracker/tab/activity-feed-tracker/activity-feed-tracker.component';
import { TaskTrackerComponent, DeleteTaskComponent } from './components/tracker/tab/task-tracker/task-tracker.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared.module';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { TableModule } from 'primeng/table';
import { SettingsComponent } from './components/settings/settings.component';
import { TimeSheetTemplateComponent, DeleteTimeSheetTemplateComponent } from './components/settings/tabs/time-sheet-template/time-sheet-template.component';
import { TimeSheetTemplateAssignmentComponent, BulkTimeSheetsTemplateAssignmentComponent, DeleteTimeSheetTemplateAssignment, BulkUploadResponseComponent, BulkUploadTemplateAssignment } from './components/settings/tabs/time-sheet-template-assignment/time-sheet-template-assignment.component';
import { MultiSelectModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/calendar';
import { MdePopoverModule } from '@material-extended/mde';
import { TimeApprovalComponent, ApproveRejectTimesheetComponent, ShowTimesheetDescriptionsComponent } from './components/time-approval/time-approval.component';
import { TitleCasePipe } from '@angular/common';
import { AccessChildGuard } from '../services/access-permission.guard';
@NgModule({
  imports: [
    CommonModule,
    TimeSheetsRoutingModule,
    MdePopoverModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    TableModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatListModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MultiSelectModule,
    NgSelectModule,
    SharedModule,
    CalendarModule,
    MatPaginatorModule,
  ],
  declarations: [TimeSheetsComponent,
    ProjectsComponent,
    ProjectsLeftRightComponent,
    TrackerComponent,
    ActivityFeedTrackerComponent,
    TaskTrackerComponent,
    TimesheetComponent,
    SettingsComponent,
    TimeSheetTemplateComponent,
    DeleteTimeSheetTemplateComponent,
    TimeSheetTemplateAssignmentComponent,
    BulkTimeSheetsTemplateAssignmentComponent,
    DeleteTimeSheetTemplateAssignment,
    TimeSheetsComponent,
    ProjectsComponent,
    ProjectsLeftRightComponent,
    TrackerComponent,
    ActivityFeedTrackerComponent,
    TaskTrackerComponent,
    TimesheetComponent,
    DeleteTaskComponent,
    TimeApprovalComponent,
    ApproveRejectTimesheetComponent,
    ShowTimesheetDescriptionsComponent,
    ApproveRejectTimesheetsComponent,
    BulkUploadTemplateAssignment,
    BulkUploadResponseComponent
  ],
  entryComponents: [
    DeleteTimeSheetTemplateComponent,
    BulkTimeSheetsTemplateAssignmentComponent,
    DeleteTimeSheetTemplateAssignment,
    DeleteTaskComponent,
    ApproveRejectTimesheetComponent,
    ShowTimesheetDescriptionsComponent,
    ApproveRejectTimesheetsComponent,
    BulkUploadTemplateAssignment,
    BulkUploadResponseComponent
  ], 
  providers: [
    TitleCasePipe,
    AccessChildGuard
  ]

})
export class TimeSheetsModule { }
