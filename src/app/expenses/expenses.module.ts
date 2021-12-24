import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicExpenseCategoryComponent } from './components/settings/tab/expense-templates/template/dynamic-expense-category/dynamic-expense-category.component';
import { TemplateComponent } from './components/settings/tab/expense-templates/template/template.component';
import { ExpensesRoutingModule } from './expenses-routing.module';
import {
  ExpenseReportsComponent,
  AddSingleExpenseDialogComponent,
  AddMultipleExpenseDialogComponent,
  EditExpenseDialogComponent,
  AddExpenseDialogComponent,
  ShowErroreDialogComponent
} from '../expenses/components/expense-reports/expense-reports.component';
import { ExpenseReportRightPanesComponent } from '../expenses/components/expense-reports/expense-report-right-panes/expense-report-right-panes.component'
import { ExpenseProcessHistoryComponent, UndoProcessHistoryDialogComponent } from '../expenses/components/expense-process-history/expense-process-history.component';
import { ExpenseCategoriesComponent, DeleteExpenseDialog } from './components/settings/tab/expense-categories/expense-categories.component';
import { ExpenseTemplatesComponent, DeleteExpenseTemplateDialog } from './components/settings/tab/expense-templates/expense-templates.component';
import { TemplateAssignmentsComponent, AddExpenceAssigmentTemplate, EditExpenceAssigmentTemplate, BulkAssignExpenceTemplate, AssignSupervisorDialog, UploadTemplateAssignmentDialog, UploadSupervisorDialog, HistoryOfEmployeeExpenseAssignmentsDialog, DeleteExpenceAssingmentModel, BulkUploadTemplateAssignment, ExpenseBulkUploadResponseComponent } from './components/settings/tab/template-assignments/template-assignments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeftRightPanelComponent } from './components/settings/tab/expense-categories/left-right-panel/left-right-panel.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
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
  MatStepperModule,
  MatTooltipModule,
} from '@angular/material';
import { SettingsComponent } from './components/settings/settings.component';
import { StepperService } from "./components/settings/tab/expense-templates/service/stepper.service";
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/primeng';
import { ExpensesService } from './expenses.service';
import { CancelledExpensesComponent, ShowExpenseCancelDialogComponent, ShowExpenseCancelHistoryDialogComponent } from './components/expense-reports/tabs/cancelled-expenses/cancelled-expenses.component';
import { ApprovedExpensesComponent, CancelExpenseRequest, ShowExpenseApprovedDialogComponent, ShowExpenseApprovedHistoryDialogComponent } from './components/expense-reports/tabs/approved-expenses/approved-expenses.component';
import { RejectedExpensesComponent, ShowExpenseRejectedDialogComponent, ShowExpenseRejectedHistoryDialogComponent } from './components/expense-reports/tabs/rejected-expenses/rejected-expenses.component';
import { ApproveRejectMultipleRequestDialogComponent, ApproveSingleExpense, PendingExpensesComponent, RejectSingleExpense, ShowExpensePendingDialogComponent, ShowExpensePendingHistoryDialogComponent } from './components/expense-reports/tabs/pending-expenses/pending-expenses.component';
import { AccessComponentGuard } from '../services/access-permission.guard';
import { AdvanceCategoriesComponent, DeleteAdvanceCategoryDialog } from './components/settings/tab/advance-categories/advance-categories.component';
import { AdvanceTemplatesComponent, DeleteAdvanceTemplateDialog } from './components/settings/tab/advance-templates/advance-templates.component';
import { AddAdvanceAssigmentTemplate, AdvanceBulkUploadResponseComponent, AdvanceTemplateAssignmentComponent, AssignSupervisorAdvanceTemplate, BulkAssignAdvanceTemplate, BulkUploadAdvanceTemplateAssignment, DeleteAdvanceAssignmentModel, EditAdvanceAssigmentTemplate } from './components/settings/tab/advance-template-assignment/advance-template-assignment.component';
import { LeftRightPaneAdvanceTempComponent } from './components/settings/tab/advance-templates/left-right-pane-advance-temp/left-right-pane-advance-temp.component';
import { LeftRightPaneComponent } from './components/settings/tab/advance-categories/left-right-pane/left-right-pane.component';
import { AdvanceReportsComponent, TeamAdvanceRequestDialogComponent } from './components/advance-reports/advance-reports.component';
import { TeamAdvanceApprovedComponent, ShowApprovedAdvancesDialogComponent, CancelAdvanceRequest } from './components/advance-reports/tabs/team-advance-approved/team-advance-approved.component';
import { TeamAdvancePendingComponent, ApproveAdvanceComponent, RejectAdvanceComponent, ShowPendingAdvancesDialogComponent } from './components/advance-reports/tabs/team-advance-pending/team-advance-pending.component';
import { TeamAdvanceRejectedComponent, ShowRejectedAdvancesDialogComponent } from './components/advance-reports/tabs/team-advance-rejected/team-advance-rejected.component';
import { ShowCancelledAdvancesDialogComponent, TeamAdvanceCancelledComponent } from './components/advance-reports/tabs/team-advance-cancelled/team-advance-cancelled.component';

@NgModule({
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    ButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatStepperModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatFormFieldModule,
    NgSelectModule,
    TableModule,
    MultiSelectModule,
    PaginatorModule
  ],
  declarations: [
    ExpenseReportsComponent,
    ExpenseCategoriesComponent,
    ExpenseTemplatesComponent,
    ShowExpensePendingHistoryDialogComponent,
    ShowExpenseApprovedHistoryDialogComponent,
    ShowExpenseApprovedDialogComponent,
    ShowExpenseRejectedHistoryDialogComponent,
    ShowExpenseRejectedDialogComponent,
    ShowExpenseCancelHistoryDialogComponent,
    ShowExpenseCancelDialogComponent,
    ShowExpensePendingDialogComponent,
    CancelExpenseRequest,
    AddSingleExpenseDialogComponent,
    AddExpenseDialogComponent,
    EditExpenseDialogComponent,
    RejectSingleExpense,
    ApproveSingleExpense,
    AddMultipleExpenseDialogComponent,
    ExpenseReportRightPanesComponent,
    UndoProcessHistoryDialogComponent,
    ExpenseProcessHistoryComponent,
    ApproveRejectMultipleRequestDialogComponent,
    TemplateAssignmentsComponent,
    LeftRightPanelComponent,
    TemplateComponent,
    DynamicExpenseCategoryComponent,
    DeleteExpenseDialog,
    AddExpenceAssigmentTemplate,
    EditExpenceAssigmentTemplate,
    BulkAssignExpenceTemplate,
    AssignSupervisorDialog,
    UploadTemplateAssignmentDialog,
    UploadSupervisorDialog,
    HistoryOfEmployeeExpenseAssignmentsDialog,
    DeleteExpenceAssingmentModel,
    SettingsComponent,
    DeleteExpenseTemplateDialog,
    ShowErroreDialogComponent,
    CancelledExpensesComponent,
    ApprovedExpensesComponent,
    RejectedExpensesComponent,
    PendingExpensesComponent,
    BulkUploadTemplateAssignment,
    ExpenseBulkUploadResponseComponent,
    AdvanceCategoriesComponent,
    DeleteAdvanceCategoryDialog,
    AdvanceTemplatesComponent,
    AdvanceTemplateAssignmentComponent,
    LeftRightPaneAdvanceTempComponent,
    DeleteAdvanceTemplateDialog,
    AddAdvanceAssigmentTemplate,
    DeleteAdvanceAssignmentModel,
    EditAdvanceAssigmentTemplate,
    BulkUploadAdvanceTemplateAssignment,
    AdvanceBulkUploadResponseComponent,
    AssignSupervisorAdvanceTemplate,
    BulkAssignAdvanceTemplate,
    LeftRightPaneComponent,
    AdvanceReportsComponent,
    TeamAdvanceRequestDialogComponent,
    TeamAdvanceApprovedComponent,
    TeamAdvancePendingComponent,
    TeamAdvanceRejectedComponent,
    ApproveAdvanceComponent,
    RejectAdvanceComponent,
    ShowApprovedAdvancesDialogComponent,
    ShowPendingAdvancesDialogComponent,
    ShowRejectedAdvancesDialogComponent,
    TeamAdvanceCancelledComponent,
    ShowCancelledAdvancesDialogComponent,
    CancelAdvanceRequest
  ],
  entryComponents: [
    DeleteExpenseDialog,
    AddExpenceAssigmentTemplate,
    EditExpenceAssigmentTemplate,
    BulkAssignExpenceTemplate,
    AssignSupervisorDialog,
    UploadTemplateAssignmentDialog,
    UploadSupervisorDialog,
    HistoryOfEmployeeExpenseAssignmentsDialog,
    DeleteExpenceAssingmentModel,
    ShowExpensePendingHistoryDialogComponent,
    ShowExpenseApprovedHistoryDialogComponent,
    ShowExpenseApprovedDialogComponent,
    ShowExpenseRejectedHistoryDialogComponent,
    ShowExpenseRejectedDialogComponent,
    ShowExpenseCancelHistoryDialogComponent,
    ShowExpenseCancelDialogComponent,
    ShowExpensePendingDialogComponent,
    CancelExpenseRequest,
    AddSingleExpenseDialogComponent,
    AddExpenseDialogComponent,
    EditExpenseDialogComponent,
    RejectSingleExpense,
    ApproveSingleExpense,
    AddMultipleExpenseDialogComponent,
    ApproveRejectMultipleRequestDialogComponent,
    UndoProcessHistoryDialogComponent,
    DeleteExpenseTemplateDialog,
    ShowErroreDialogComponent,
    BulkUploadTemplateAssignment,
    ExpenseBulkUploadResponseComponent,
    DeleteAdvanceCategoryDialog,
    DeleteAdvanceTemplateDialog,
    AddAdvanceAssigmentTemplate,
    DeleteAdvanceAssignmentModel,
    EditAdvanceAssigmentTemplate,
    BulkUploadAdvanceTemplateAssignment,
    AdvanceBulkUploadResponseComponent,
    AssignSupervisorAdvanceTemplate,
    BulkAssignAdvanceTemplate,
    TeamAdvanceRequestDialogComponent,
    TeamAdvanceApprovedComponent,
    TeamAdvancePendingComponent,
    TeamAdvanceRejectedComponent,
    ApproveAdvanceComponent,
    RejectAdvanceComponent,
    ShowApprovedAdvancesDialogComponent,
    ShowPendingAdvancesDialogComponent,
    ShowRejectedAdvancesDialogComponent,
    ShowCancelledAdvancesDialogComponent,
    CancelAdvanceRequest
  ],
  providers: [
    ExpensesService,
    StepperService,
    AccessComponentGuard
  ]
})
export class ExpensesModule { }

