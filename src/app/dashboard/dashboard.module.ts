import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ApproveMultipleExpenseRequestDialogComponent, ApproveMultipleRegularizationDialogComponent, ApproveRegularizationDialogComponent, ApproveRejectTimesheetComponent, ApproveSingleExpenseApplication, CancelExpenseApplicationRequest, CancelRegularizationDialogComponent, DashboardComponent, RejectRegularizationDialogComponent, RejectSingleExpenseApplication, ReportDialogComponent, ShowExpenseDialogComponent, ShowExpenseHistoryDialogComponent, TimeSheetsDescriptionDialogComponent, ViewRegularizationReqComponent } from './components/dashboard/dashboard.component';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatTooltipModule } from '@angular/material';
import { TooltipModule } from 'primeng/tooltip';
import { OwlModule } from 'ngx-owl-carousel';
import { MatTabsModule } from '@angular/material/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/primeng';
import { MdePopoverModule } from '@material-extended/mde';
import { NgxEchartsModule } from 'ngx-echarts';
@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    TooltipModule,
    MatTabsModule,
    TableModule,
    MultiSelectModule,
    MatTabsModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MdePopoverModule,
    OwlModule,
    DragulaModule.forRoot(),
    NgSelectModule,
    NgxEchartsModule
  ],
  declarations: [DashboardComponent, ReportDialogComponent, TimeSheetsDescriptionDialogComponent, ApproveRegularizationDialogComponent, RejectRegularizationDialogComponent, CancelRegularizationDialogComponent, ApproveMultipleRegularizationDialogComponent, ViewRegularizationReqComponent, ApproveSingleExpenseApplication, RejectSingleExpenseApplication, ShowExpenseHistoryDialogComponent, CancelExpenseApplicationRequest, ApproveMultipleExpenseRequestDialogComponent, ShowExpenseDialogComponent, ApproveRejectTimesheetComponent],
  entryComponents: [ReportDialogComponent, TimeSheetsDescriptionDialogComponent, ApproveRegularizationDialogComponent, RejectRegularizationDialogComponent, CancelRegularizationDialogComponent, ApproveMultipleRegularizationDialogComponent, ViewRegularizationReqComponent, ApproveSingleExpenseApplication, RejectSingleExpenseApplication, ShowExpenseHistoryDialogComponent, CancelExpenseApplicationRequest, ApproveMultipleExpenseRequestDialogComponent, ShowExpenseDialogComponent, ApproveRejectTimesheetComponent]
})
export class DashboardModule { }
