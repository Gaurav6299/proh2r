import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollComponent } from './components/payroll/payroll.component';
import { DialogOverview } from './components/payroll-setting/tabs/variable-deductions/variable-deductions.component';
// import { DialogOverview } from './payroll/payroll-setting/tabs/variable-deductions/variable-deductions.component';
import { CtcTemplatesComponent } from './components/ctc-templates/ctc-templates.component';
import { PayrollSettingComponent } from './components/payroll-setting/payroll-setting.component';
import { PayslipsComponent, GeneratePayslipComponent } from './components/payslips/payslips.component';
import { ProcessOffcyclePaymentsComponent, ProcessOffcycleLoackComponent, GenerateProcessOffcycleComponent } from './components/process-offcycle-payments/process-offcycle-payments.component';
import { RunPayrollComponent } from './components/run-payroll/run-payroll.component';
import { GeneralSettingsComponent, AddUpdatePFTemplateComponent, DeletePFTemplateComponent } from './components/payroll-setting/tabs/general-settings/general-settings.component';
import { FixedAllowancesComponent, FixedAllowanceDeleteComponent } from './components/payroll-setting/tabs/fixed-allowances/fixed-allowances.component';
import { VariableAllowancesComponent, VariableAllowanceDeleteComponent } from './components/payroll-setting/tabs/variable-allowances/variable-allowances.component';
// tslint:disable-next-line:max-line-length
import { FixedDeductionsComponent, FixedDeductionsDialogComponent } from './components/payroll-setting/tabs/fixed-deductions/fixed-deductions.component';
import { VariableDeductionsComponent } from './components/payroll-setting/tabs/variable-deductions/variable-deductions.component';
import { VariableAllowanceContentComponent } from './components/payroll-setting/tabs/variable-allowances/variable-allowance-content/variable-allowance-content.component';
import { AddEditAllowanceComponent } from './components/payroll-setting/tabs/fixed-allowances/add-edit-allowance/add-edit-allowance.component';
import { VariableDeductionsContentComponent } from './components/payroll-setting/tabs/variable-deductions/variable-deductions-content/variable-deductions-content.component';
import { PayrollHistoryComponent, GeneratePayrollComponent, UploadPriviousMonthSalaryComponent, DeletePayrollDetailsComponent, GeneratedPayrollLockComponent, ApproverRunningPayrollDialogComponent, RejectRunningPayrollDialogComponent, PayrollApprovalDialogComponent } from './components/run-payroll/payroll-history/payroll-history.component';
import { PayrollMonthlyComponent } from './components/run-payroll/payroll-monthly/payroll-monthly.component';
import { PendingEmployeesComponent, EmployeeOnHoldDialogComponent } from './components/run-payroll/payroll-monthly/stepper/step1/employee-selection/pending-employees/pending-employees.component';
import { EmployeesOnHoldComponent, EmployeeUnHoldDialogComponent } from './components/run-payroll/payroll-monthly/stepper/step1/employee-selection/employees-on-hold/employees-on-hold.component';
import { FnfEmployeesComponent } from './components/run-payroll/payroll-monthly/stepper/step1/employee-selection/fnf-employees/fnf-employees.component';
import { ProcessedEmployeesComponent, SelectedEmployeesRerunDialogComponent, UploadSelectedEmployeesRerunDialogComponent } from './components/run-payroll/payroll-monthly/stepper/step1/employee-selection/processed-employees/processed-employees.component';
import { MonthlyOffcyclePaymentComponent } from './components/process-offcycle-payments/monthly-offcycle-payment/monthly-offcycle-payment.component';
import { ViewPaySlipComponent } from './components/payslips/actions/view-pay-slip/view-pay-slip.component';
import { PublishPaySlipComponent, EmployeePublishDialogComponent } from './components/payslips/actions/publish-pay-slip/publish-pay-slip.component';
import { UnPublishPaySlipComponent, EmployeeUnPublishDialogComponent } from './components/payslips/actions/un-publish-pay-slip/un-publish-pay-slip.component';
import { ViewComponent } from './components/payslips/actions/view-pay-slip/view/view.component';
import { TaxPayslipComponent } from './components/payslips/actions/view-pay-slip/tax-payslip/tax-payslip.component';
import { DetailedPayslipComponent } from './components/payslips/actions/view-pay-slip/detailed-payslip/detailed-payslip.component';
import { FnfPayslipComponent } from './components/payslips/actions/view-pay-slip/fnf-payslip/fnf-payslip.component';
import { CtcTemplatesSettingsComponent, DeleteCtcTemplateComponent } from './components/ctc-templates/tabs/ctc-templates-settings/ctc-templates-settings.component';
import { AddCtcTemplatesComponent } from './components/ctc-templates/add-ctc-templates/add-ctc-templates.component';

import { CtcTemplateContentComponent } from './components/ctc-templates/add-ctc-templates/ctc-template-content/ctc-template-content.component';
import { ProcessEmployeeOffcyclePaymentComponent, RerunSelectedEmployeeActionComponent } from './components/process-offcycle-payments/monthly-offcycle-payment/stepper/step1/employee-selection/process-employee-offcycle-payment/process-employee-offcycle-payment.component';
import { ActiveEmployeeOffcyclePaymentComponent } from './components/process-offcycle-payments/monthly-offcycle-payment/stepper/step1/employee-selection/active-employee-offcycle-payment/active-employee-offcycle-payment.component';
import { OffcyclePayUploadVariablePaysComponent, VariablePaysOffcyclePayementsComponent, UploadDataOffcycleVariablePayComponent, ClearVariablePaysOffcyclePayementsComponent } from './components/process-offcycle-payments/monthly-offcycle-payment/stepper/step2/offcycle-pay-upload-variable-pays/offcycle-pay-upload-variable-pays.component';
import { ActiveEmployeeComponent, AddLOPComponent, UpdateLOPDaysComponent, UploadLOPDaysComponent } from './components/run-payroll/payroll-monthly/stepper/step2/upload-attendance/active-employee/active-employee.component';
import { FnfEmployeeComponent } from './components/run-payroll/payroll-monthly/stepper/step2/upload-attendance/fnf-employee/fnf-employee.component';
import { OffcyclePaymentFlexiBenifitsComponent, OffcyclePaymentsReimbursableAmountComponent } from './components/process-offcycle-payments/monthly-offcycle-payment/stepper/step3/offcycle-payment-flexi-benifits/offcycle-payment-flexi-benifits.component';

// tslint:disable-next-line:max-line-length
import { DatePipe } from '@angular/common';
import { FlexiBenefitsActiveEmployeeComponent, FlexiBenifitsRunPayrollActiveEmpComponent, RunPayrollReimbursableRecordActiveEmpComponent, UploadDataRunPayrollFlexiBenifitsActiveEmpComponent } from './components/run-payroll/payroll-monthly/stepper/step6/flexi-benefits-active-employee/flexi-benefits-active-employee.component';
import { FlexiBenefitsFnfEmployeeComponent, RunPayrollReimbursableRecordFnfEmpComponent } from './components/run-payroll/payroll-monthly/stepper/step6/flexi-benefits-fnf-employee/flexi-benefits-fnf-employee.component';
import { ManageLeftRightAddArrearsComponent } from './components/run-payroll/payroll-monthly/stepper/step4/manual-adjust-arrears/manage-left-right-add-arrears/manage-left-right-add-arrears.component';
import {
  ManualAdjustArrearsComponent, AddSalaryRevisionComponent, AddManualArrearsComponent, AddNewArrearDaysComponent,
  DeleteArrearDaysComponent, DeleteManualArrearsComponent, DeleteMonthArrearDaysComponent
} from './components/run-payroll/payroll-monthly/stepper/step4/manual-adjust-arrears/manual-adjust-arrears.component';
import { RunPayroll } from './service/run-payroll.service';
import { PayrollMonthYearComponent } from './components/run-payroll/payroll-history/payroll-history.component';
import {
  MatTabsModule,
  MatStepperModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatTableModule,
  MatDialogModule,
  MatPaginatorModule,
  MatRadioModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatTooltipModule,
  MatIconModule,
  MatAutocompleteModule,
  MatSlideToggleModule

} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeDeductionsComponent, EmployeeDeductionDeleteDialogComponent } from './components/payroll-setting/tabs/employee-deductions/employee-deductions.component';
import { EmployerContributionsComponent, EmployerContributionDeleteDialogComponent } from './components/payroll-setting/tabs/employer-contributions/employer-contributions.component';
import { FixedDeductionContentComponent } from './components/payroll-setting/tabs/fixed-deductions/fixed-deduction-content/fixed-deduction-content.component';
import { EditCtcTemplateComponent } from './components/ctc-templates/edit-ctc-template/edit-ctc-template.component';
import { StatusPipe, ManualPipe } from '../services/statuspipe';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from '../../app/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoanAndAdvancesActiveEmployeesComponent, UpdateLoansAndAdvancesDialogComponent } from './components/run-payroll/payroll-monthly/stepper/step4/loan-and-advances-active-employees/loan-and-advances-active-employees.component';
import { LoanAndAdvancesFnfEmployeesComponent } from './components/run-payroll/payroll-monthly/stepper/step4/loan-and-advances-fnf-employees/loan-and-advances-fnf-employees.component';
import { EncashmentAndRecoveryFnfEmployeesComponent } from './components/run-payroll/payroll-monthly/stepper/step5/encashment-and-recovery-fnf-employees/encashment-and-recovery-fnf-employees.component';
import { RunPayrollUploadVariableActiveEmployeeComponent, VariablePaysRunPayrollActiveEmpComponent, ClearVariablePaysRunPayrollActiveEmpComponent, UploadDataRunPayrollVariablePayActiveEmpComponent } from './components/run-payroll/payroll-monthly/stepper/step3/run-payroll-upload-variable-active-employee/run-payroll-upload-variable-active-employee.component';
import { RunPayrollUploadVariableFnfEmployeeComponent, UploadDataRunPayrollVariablePayFnfEmpComponent } from './components/run-payroll/payroll-monthly/stepper/step3/run-payroll-upload-variable-fnf-employee/run-payroll-upload-variable-fnf-employee.component';
import { ArrearsActiveEmployeeComponent, UploadArrearsActiveEmplRunPayrollComponent, ViewManualArrearComponent, UpdateManualArrearComponent, LOPReversalArrearComponent } from './components/run-payroll/payroll-monthly/stepper/step6/arrears-active-employee/arrears-active-employee.component';
import { ArrearsFnfEmployeeComponent, UploadArrearsFnfEmplRunPayrollComponent } from './components/run-payroll/payroll-monthly/stepper/step6/arrears-fnf-employee/arrears-fnf-employee.component';
import { OffcycleDataServiceService } from './service/offcycle-data-service.service';
import { OffcyclePaymentActiveEmployeeComponent } from './components/run-payroll/payroll-monthly/stepper/step7/offcycle-payment-active-employee/offcycle-payment-active-employee.component';
import { ItPtActiveEmployeeComponent, IncomeTaxOverWriteActiovEmplComponent, UpdateIncomeTaxOverWriteActiovEmplComponent } from './components/run-payroll/payroll-monthly/stepper/step8/it-pt-active-employee/it-pt-active-employee.component';
import { ItPtFnfEmployeeComponent } from './components/run-payroll/payroll-monthly/stepper/step8/it-pt-fnf-employee/it-pt-fnf-employee.component';
import { RunPayrollCompleteComponent } from './components/run-payroll/payroll-monthly/stepper/step9/run-payroll-complete/run-payroll-complete.component';
import { OtherBenefitsComponent, DeleteOtherBenefitsDialogComponent } from '../payroll/components/payroll-setting/tabs/other-benefits/other-benefits.component';
import { LoansAndAdvancesComponent, DeleteLoansAdvancesDialogComponent } from '../payroll/components/payroll-setting/tabs/loans-and-advances/loans-and-advances.component';
import { FixedContributionComponent, AddUpdateLWFSlabComponent, DeleteLWFSlabComponent, AddUpdatePTSlabComponent, ConfigurePTStateComponent, DeletePTSlabComponent, AddUpdatePTStateComponent, DeletePTStateComponent, AddESICContributionComponent, AddESICCellingAmountComponent, DeleteESICCellingComponent, DeleteESICContributionComponent } from './components/payroll-setting/tabs/fixed-contribution/fixed-contribution.component';
import { DropdownModule, InputTextModule } from 'primeng/primeng';
import { FixedContributionLeftRightPanesComponent } from './components/payroll-setting/tabs/fixed-contribution/fixed-contribution-left-right-panes/fixed-contribution-left-right-panes/fixed-contribution-left-right-panes.component';
import { TooltipModule } from 'primeng/tooltip';
import { EditCtcTemplatePercentageComponent } from './components/ctc-templates/ctc-template-percentage/ctc-template-percentage.component';

import { DeleteFlexiBenefitsDialogComponent, FlexiBenefitsComponent } from './components/payroll-setting/tabs/flexi-benefits/flexi-benefits.component';
import { SalaryRegisterComponent, SalaryRegisterDialogComponent } from './components/run-payroll/payroll-monthly/stepper/step8/salary-register/salary-register.component';
import { LopReversalComponent, ViewLOPDetailsComponent, SyncWithPayrollComponent } from './components/lop-reversal/lop-reversal.component';
import { AccessComponentGuard } from '../services/access-permission.guard';
@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MatTabsModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule,
    TableModule,
    MultiSelectModule,
    SharedModule,
    NgSelectModule,
    DropdownModule,
    TooltipModule,
    InputTextModule,
    MatIconModule
  ],
  declarations: [
    PayrollComponent,
    DialogOverview,
    CtcTemplatesComponent,
    PayrollSettingComponent,
    PayslipsComponent, GeneratePayslipComponent,
    ProcessOffcyclePaymentsComponent, ProcessOffcycleLoackComponent, GenerateProcessOffcycleComponent,
    RunPayrollComponent,
    GeneralSettingsComponent,
    FixedAllowancesComponent, FixedAllowanceDeleteComponent,
    VariableAllowancesComponent, VariableAllowanceDeleteComponent,
    FixedDeductionsComponent, FixedDeductionsDialogComponent,
    VariableDeductionsComponent,
    VariableAllowanceContentComponent,
    AddEditAllowanceComponent,
    VariableDeductionsContentComponent,
    PayrollHistoryComponent,
    GeneratePayrollComponent,
    UploadPriviousMonthSalaryComponent,
    DeletePayrollDetailsComponent,
    GeneratedPayrollLockComponent,
    PayrollMonthlyComponent,
    PendingEmployeesComponent, EmployeeOnHoldDialogComponent,
    EmployeesOnHoldComponent, EmployeeUnHoldDialogComponent,
    FnfEmployeesComponent,
    ProcessedEmployeesComponent,
    SelectedEmployeesRerunDialogComponent,
    UploadSelectedEmployeesRerunDialogComponent,
    MonthlyOffcyclePaymentComponent,
    ViewPaySlipComponent,
    PublishPaySlipComponent,
    UnPublishPaySlipComponent,
    ViewComponent,
    TaxPayslipComponent,
    DetailedPayslipComponent,
    FnfPayslipComponent,
    CtcTemplatesSettingsComponent, DeleteCtcTemplateComponent,
    AddCtcTemplatesComponent,
    EditCtcTemplatePercentageComponent,
    CtcTemplateContentComponent,
    ProcessEmployeeOffcyclePaymentComponent,
    RerunSelectedEmployeeActionComponent,
    ActiveEmployeeOffcyclePaymentComponent,
    OffcyclePayUploadVariablePaysComponent,
    VariablePaysOffcyclePayementsComponent,
    UploadDataOffcycleVariablePayComponent,
    ClearVariablePaysOffcyclePayementsComponent,
    ActiveEmployeeComponent,
    AddLOPComponent,
    UploadLOPDaysComponent,
    UpdateLOPDaysComponent,
    FnfEmployeeComponent,
    OffcyclePaymentFlexiBenifitsComponent,
    OffcyclePaymentsReimbursableAmountComponent,
    RunPayrollUploadVariableActiveEmployeeComponent,
    VariablePaysRunPayrollActiveEmpComponent,
    ClearVariablePaysRunPayrollActiveEmpComponent,
    UploadDataRunPayrollVariablePayActiveEmpComponent,
    RunPayrollUploadVariableFnfEmployeeComponent,
    UploadDataRunPayrollVariablePayFnfEmpComponent,
    ArrearsActiveEmployeeComponent,
    UploadArrearsActiveEmplRunPayrollComponent,
    ViewManualArrearComponent,
    LOPReversalArrearComponent,
    UpdateManualArrearComponent,
    ArrearsFnfEmployeeComponent,
    UploadArrearsFnfEmplRunPayrollComponent,
    OffcyclePaymentActiveEmployeeComponent,
    FlexiBenefitsActiveEmployeeComponent,
    UploadDataRunPayrollFlexiBenifitsActiveEmpComponent,
    FlexiBenifitsRunPayrollActiveEmpComponent,
    RunPayrollReimbursableRecordActiveEmpComponent,
    FlexiBenefitsFnfEmployeeComponent,
    RunPayrollReimbursableRecordFnfEmpComponent,
    ItPtActiveEmployeeComponent,
    IncomeTaxOverWriteActiovEmplComponent,
    UpdateIncomeTaxOverWriteActiovEmplComponent,
    ItPtFnfEmployeeComponent,
    RunPayrollCompleteComponent,
    ManageLeftRightAddArrearsComponent,
    ManualAdjustArrearsComponent,
    AddSalaryRevisionComponent,
    AddManualArrearsComponent,
    AddNewArrearDaysComponent,
    DeleteArrearDaysComponent,
    DeleteManualArrearsComponent,
    DeleteMonthArrearDaysComponent,
    ApproverRunningPayrollDialogComponent,
    RejectRunningPayrollDialogComponent,
    PayrollMonthYearComponent,
    EmployeePublishDialogComponent,
    EmployeeUnPublishDialogComponent,
    EmployeeDeductionsComponent,
    EmployerContributionsComponent,
    EmployeeDeductionDeleteDialogComponent,
    EmployerContributionDeleteDialogComponent,
    FixedDeductionContentComponent,
    EditCtcTemplateComponent,
    StatusPipe,
    ManualPipe,
    AddUpdatePFTemplateComponent,
    DeletePFTemplateComponent,
    LoanAndAdvancesActiveEmployeesComponent,
    LoanAndAdvancesFnfEmployeesComponent,
    EncashmentAndRecoveryFnfEmployeesComponent,
    OtherBenefitsComponent,
    LoansAndAdvancesComponent,
    DeleteOtherBenefitsDialogComponent,
    DeleteLoansAdvancesDialogComponent,
    FixedContributionComponent,
    FixedContributionLeftRightPanesComponent,
    AddUpdateLWFSlabComponent,
    DeleteLWFSlabComponent,
    AddUpdatePTSlabComponent,
    ConfigurePTStateComponent,
    DeletePTSlabComponent,
    AddUpdatePTStateComponent,
    DeletePTStateComponent,
    AddESICContributionComponent,
    AddESICCellingAmountComponent,
    DeleteESICCellingComponent,
    DeleteESICContributionComponent,
    UpdateLoansAndAdvancesDialogComponent,
    FlexiBenefitsComponent,
    DeleteFlexiBenefitsDialogComponent,
    SalaryRegisterComponent,
    SalaryRegisterDialogComponent,
    PayrollApprovalDialogComponent,
    LopReversalComponent,
    ViewLOPDetailsComponent,
    SyncWithPayrollComponent
  ],
  entryComponents: [
    GeneratePayslipComponent,
    ProcessOffcycleLoackComponent,
    GenerateProcessOffcycleComponent,
    FixedAllowanceDeleteComponent,
    VariableAllowanceDeleteComponent,
    FixedDeductionsDialogComponent,
    GeneratePayrollComponent,
    UploadPriviousMonthSalaryComponent,
    DeletePayrollDetailsComponent,
    GeneratedPayrollLockComponent,
    EmployeeOnHoldDialogComponent,
    EmployeeUnHoldDialogComponent,
    ProcessedEmployeesComponent,
    SelectedEmployeesRerunDialogComponent,
    UploadSelectedEmployeesRerunDialogComponent,
    RerunSelectedEmployeeActionComponent,
    VariablePaysOffcyclePayementsComponent,
    UploadDataOffcycleVariablePayComponent,
    ClearVariablePaysOffcyclePayementsComponent,
    AddLOPComponent,
    UploadLOPDaysComponent,
    UpdateLOPDaysComponent,
    OffcyclePaymentsReimbursableAmountComponent,
    VariablePaysRunPayrollActiveEmpComponent,
    ClearVariablePaysRunPayrollActiveEmpComponent,
    UploadDataRunPayrollVariablePayActiveEmpComponent,
    UploadDataRunPayrollVariablePayFnfEmpComponent,
    UploadArrearsActiveEmplRunPayrollComponent,
    ViewManualArrearComponent,
    LOPReversalArrearComponent,
    UpdateManualArrearComponent,
    UploadArrearsFnfEmplRunPayrollComponent,
    UploadDataRunPayrollFlexiBenifitsActiveEmpComponent,
    FlexiBenifitsRunPayrollActiveEmpComponent,
    RunPayrollReimbursableRecordActiveEmpComponent,
    RunPayrollReimbursableRecordFnfEmpComponent,
    IncomeTaxOverWriteActiovEmplComponent,
    UpdateIncomeTaxOverWriteActiovEmplComponent,
    AddSalaryRevisionComponent,
    AddManualArrearsComponent,
    AddNewArrearDaysComponent,
    DeleteArrearDaysComponent,
    DeleteManualArrearsComponent,
    DeleteMonthArrearDaysComponent,
    DialogOverview,
    DeleteCtcTemplateComponent,
    ApproverRunningPayrollDialogComponent,
    RejectRunningPayrollDialogComponent,
    PayrollMonthYearComponent,
    EmployeePublishDialogComponent,
    EmployeeUnPublishDialogComponent,
    EmployeeDeductionDeleteDialogComponent,
    EmployerContributionDeleteDialogComponent,
    AddUpdatePFTemplateComponent,
    DeletePFTemplateComponent,
    DeleteOtherBenefitsDialogComponent,
    DeleteLoansAdvancesDialogComponent,
    AddUpdateLWFSlabComponent,
    DeleteLWFSlabComponent,
    AddUpdatePTSlabComponent,
    ConfigurePTStateComponent,
    DeletePTSlabComponent,
    AddUpdatePTStateComponent,
    DeletePTStateComponent,
    AddESICContributionComponent,
    AddESICCellingAmountComponent,
    DeleteESICCellingComponent,
    DeleteESICContributionComponent,
    UpdateLoansAndAdvancesDialogComponent,
    DeleteFlexiBenefitsDialogComponent,
    SalaryRegisterDialogComponent,
    PayrollApprovalDialogComponent,
    ViewLOPDetailsComponent,
    SyncWithPayrollComponent
  ],
  providers: [
    OffcycleDataServiceService,
    RunPayroll,
    DatePipe,
    AccessComponentGuard,
  ]
})
export class PayrollModule { }
