import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './components/employees/employees.component';

import { AddNewEmployeeComponent } from './components/add-new-employee/add-new-employee.component';
import { BasicInformationComponent } from './components/add-new-employee/tabs/basic-information/basic-information.component';
import { EmploymentInformationComponent } from './components/add-new-employee/tabs/employment-information/employment-information.component';
import { SalaryInformationComponent } from './components/add-new-employee/tabs/salary-information/salary-information.component';
import { OtherInformationComponent, DeleteTemplateAssignment, EmployeeLeaveAssignment, EmployeeShiftAssignment, EmployeeAttendenceAssignment, EmployeeExpenseAssignment } from './components/add-new-employee/tabs/other-information/other-information.component';
import { EmployeesMainComponent, EmployeeHoldModelComponent, EmployeeDeleteModelComponent, EmployeeInviteModelComponent, BulkEmployeeInviteModelComponent, BulkUploadSalaryComponent, BulkOnboardComponent, EmployeeChangeStatusComponent, ResetPasswordDialogComponent, BulkEmployeeInviteResponeModelComponent, UploadPerquisitesFileAttachmentDialogComponent, UploadEmployeesInvestmentDialogComponent, BulkUploadEmployeeDetailsComponent } from './components/employees-main/employees-main.component';
import { EditEmployeeComponent, ImageCropperComponent } from './components/edit-employee/edit-employee.component';
import { SalaryDetailsComponent } from './components/edit-employee/tab/salary-details/salary-details.component';

import { SalaryInfoComponent, DeleteSalaryInfoComponent } from './components/edit-employee/tab/salary-details/salary-info/salary-info.component';
import { StatutoryDetailsComponent, VariableDeductionsDialogComponent } from './components/edit-employee/tab/statutory-details/statutory-details.component';
import { StatutoryDetailComponent } from './components/add-new-employee/tabs/statutory-detail/statutory-detail.component';
import { OtherDetailsComponent } from './components/edit-employee/tab/other-details/other-details.component';
import { EmployeeTerminationComponent } from './components/employee-termination/employee-termination.component';
import { TerminationInformationComponent } from './components/employee-termination/tabs/termination-information/termination-information.component';
import { PersonalDetailsComponent } from './components/edit-employee/tab/personal-details/personal-details.component';
import { EmploymentDetailsComponent } from './components/edit-employee/tab/employment-details/employment-details.component';
import { AddCtcComponent } from './components/edit-employee/tab/salary-details/add-ctc/add-ctc.component';
import { AddEmployeeService } from './services/add-employee/add-employee.service';
import {
  MatTabsModule,
  MatStepperModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatTableModule,
  MatDialogModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatRadioModule,
  MatNativeDateModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DocumentDetailsComponent,
  UploadDocumentComponent
} from './components/edit-employee/tab/document-details/document-details.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Data } from './services/data.service';
import { AssetDetailsComponent, CreateUpdateAllocationComponent, DeleteAssetAllocationComponent } from './components/edit-employee/tab/asset-details/asset-details.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from '../../app/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CtcComponent } from './components/edit-employee/tab/salary-details/ctc/ctc.component';
import { LoansComponent, ApplyUpdateLoanComponent, DeleteLoanComponent } from './components/edit-employee/tab/loans/loans.component';
import { TaxComponent } from './components/edit-employee/tab/tax/tax.component';
import { TaxDeclarationsComponent } from './components/tax-declarations/tax-declarations.component';
import { ChapterViDeductionsComponent, ChapterViDeductionUploadFileAttachmentDialogComponent, ViewChapterVIDeductionTransactionHistoryDialogComponent } from './components/tax-declarations/tabs/chapter-vi-deductions/chapter-vi-deductions.component';
import { Employees80CDeductionsComponent, UploadFileAttachmentDialogComponent, ViewTransactionHistoryDialogComponent } from './components/tax-declarations/tabs/employees80-c-deductions/employees80-c-deductions.component';
import { IncomeLossOnHousePropertyComponent, UploadIncomeLossHousePropertyFileAttachmentDialogComponent, ViewIncomeLossHousePropertyTransactionHistoryDialogComponent } from './components/tax-declarations/tabs/income-loss-on-house-property/income-loss-on-house-property.component';
import { OtherIncomeInfoComponent, UploadOtherIncomeFileAttachmentDialogComponent, ViewOtherInfoTransactionHistoryDialogComponent } from './components/tax-declarations/tabs/other-income-info/other-income-info.component';
import { PerquisitesComponent, ViewPerquisitesTransactionHistoryDialogComponent } from './components/tax-declarations/tabs/perquisites/perquisites.component';
import { PreviousEmploymentInformationComponent, UploadPreviousEmploymentInfoFileAttachmentDialogComponent, ViewPreviousEmploymentInfoTransactionHistoryDialogComponent } from './components/tax-declarations/tabs/previous-employment-information/previous-employment-information.component';
import { RentInformationComponent, UploadRentAttachmentDialogComponent, ViewRentDetailsTransactionHistoryDialogComponent } from './components/tax-declarations/tabs/rent-information/rent-information.component';
import { ButtonModule } from 'primeng/primeng';
import { TaxCalculationDialogComponent, TaxCalculatorComponent } from './components/tax-calculator/tax-calculator/tax-calculator.component';
import { ExemptionsAndDeductionsComponent } from './components/tax-calculator/tabs/exemptions-and-deductions/exemptions-and-deductions.component';
import { FixedAndVariableAllowanceComponent } from './components/tax-calculator/tabs/fixed-and-variable-allowance/fixed-and-variable-allowance.component';
import { TaxCalculationRegimeComponent } from './components/tax-calculator/tabs/tax-calculation-regime/tax-calculation-regime.component';
import { AccessComponentGuard } from '../services/access-permission.guard';
import { EmployeeDetailReportComponent } from './components/employee-detail-report/employee-detail-report.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {FieldsetModule} from 'primeng/fieldset';
import {CheckboxModule} from 'primeng/checkbox';
@NgModule({
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    MatTabsModule,
    MatStepperModule,
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
    MatTooltipModule,
    MatCheckboxModule,
    ImageCropperModule,
    MatSlideToggleModule,
    TableModule,
    MultiSelectModule,
    SharedModule,
    ButtonModule,
    NgSelectModule,
    MatExpansionModule,
    FieldsetModule,CheckboxModule
  ],
  declarations: [
    EmployeesComponent,
    AddNewEmployeeComponent,
    BasicInformationComponent,
    EmploymentInformationComponent,
    SalaryInformationComponent,
    OtherInformationComponent,
    EmployeeLeaveAssignment,
    EmployeeShiftAssignment,
    EmployeeAttendenceAssignment,
    EmployeeExpenseAssignment,
    EmployeeChangeStatusComponent,
    EmployeesMainComponent,
    EmployeeHoldModelComponent,
    EmployeeDeleteModelComponent,
    EmployeeInviteModelComponent,
    BulkEmployeeInviteModelComponent,
    EditEmployeeComponent,
    SalaryDetailsComponent,
    CtcComponent,
    SalaryInfoComponent,
    DeleteSalaryInfoComponent,
    StatutoryDetailsComponent,
    StatutoryDetailComponent,
    OtherDetailsComponent,
    EmployeeTerminationComponent,
    TerminationInformationComponent,
    PersonalDetailsComponent,
    EmploymentDetailsComponent,
    AddCtcComponent,
    DocumentDetailsComponent,
    UploadDocumentComponent,
    DeleteTemplateAssignment,
    BulkEmployeeInviteModelComponent,
    // BulkEmployeeInviteResponeModelComponent,
    BulkUploadSalaryComponent,
    ImageCropperComponent,
    VariableDeductionsDialogComponent,
    AssetDetailsComponent,
    CreateUpdateAllocationComponent,
    DeleteAssetAllocationComponent,
    BulkOnboardComponent,
    ResetPasswordDialogComponent,
    LoansComponent,
    ApplyUpdateLoanComponent,
    DeleteLoanComponent,
    TaxComponent,
    ChapterViDeductionsComponent,
    Employees80CDeductionsComponent,
    IncomeLossOnHousePropertyComponent,
    OtherIncomeInfoComponent,
    ViewOtherInfoTransactionHistoryDialogComponent,
    UploadOtherIncomeFileAttachmentDialogComponent,
    PerquisitesComponent,
    PreviousEmploymentInformationComponent,
    RentInformationComponent,
    ViewChapterVIDeductionTransactionHistoryDialogComponent,
    ChapterViDeductionUploadFileAttachmentDialogComponent,
    ViewTransactionHistoryDialogComponent,
    UploadFileAttachmentDialogComponent,
    ViewRentDetailsTransactionHistoryDialogComponent,
    UploadRentAttachmentDialogComponent,
    ViewPerquisitesTransactionHistoryDialogComponent,
    UploadPerquisitesFileAttachmentDialogComponent,
    ViewIncomeLossHousePropertyTransactionHistoryDialogComponent,
    UploadIncomeLossHousePropertyFileAttachmentDialogComponent,
    ViewPreviousEmploymentInfoTransactionHistoryDialogComponent,
    UploadPreviousEmploymentInfoFileAttachmentDialogComponent,
    TaxDeclarationsComponent,
    UploadEmployeesInvestmentDialogComponent,
    TaxCalculatorComponent,
    ExemptionsAndDeductionsComponent,
    FixedAndVariableAllowanceComponent,
    TaxCalculationRegimeComponent,
    TaxCalculationDialogComponent,
    BulkUploadEmployeeDetailsComponent,
    EmployeeDetailReportComponent
  ],
  entryComponents: [
    EmployeeChangeStatusComponent,
    EmployeeLeaveAssignment,
    EmployeeShiftAssignment,
    EmployeeAttendenceAssignment,
    EmployeeExpenseAssignment,
    EmployeeHoldModelComponent,
    EmployeeDeleteModelComponent,
    EmployeeInviteModelComponent,
    BulkEmployeeInviteModelComponent,
    UploadDocumentComponent,
    DeleteTemplateAssignment,
    BulkEmployeeInviteResponeModelComponent,
    BulkUploadSalaryComponent,
    ImageCropperComponent,
    VariableDeductionsDialogComponent,
    CreateUpdateAllocationComponent,
    DeleteAssetAllocationComponent,
    BulkOnboardComponent,
    ResetPasswordDialogComponent,
    DeleteSalaryInfoComponent,
    ApplyUpdateLoanComponent,
    DeleteLoanComponent,
    ViewChapterVIDeductionTransactionHistoryDialogComponent,
    ChapterViDeductionUploadFileAttachmentDialogComponent,
    ViewTransactionHistoryDialogComponent,
    UploadFileAttachmentDialogComponent,
    ViewRentDetailsTransactionHistoryDialogComponent,
    UploadRentAttachmentDialogComponent,
    ViewPerquisitesTransactionHistoryDialogComponent,
    UploadPerquisitesFileAttachmentDialogComponent,
    ViewIncomeLossHousePropertyTransactionHistoryDialogComponent,
    UploadIncomeLossHousePropertyFileAttachmentDialogComponent,
    ViewPreviousEmploymentInfoTransactionHistoryDialogComponent,
    UploadPreviousEmploymentInfoFileAttachmentDialogComponent,
    ViewOtherInfoTransactionHistoryDialogComponent,
    UploadOtherIncomeFileAttachmentDialogComponent,
    UploadEmployeesInvestmentDialogComponent,
    TaxCalculationDialogComponent,
    BulkUploadEmployeeDetailsComponent
  ],
  providers: [
    AddEmployeeService,
    Data,
    AccessComponentGuard
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EmployeesModule { }
