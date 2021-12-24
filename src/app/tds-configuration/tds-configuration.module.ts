import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TDSConfigurationRoutingModule } from './tds-configuration-routing.module';
import { DefineTaxComponent } from './components/define-tax/define-tax.component';
import { TaxExemptionComponent } from './components/tax-exemption/tax-exemption.component';
import { TDSConfigurationComponent } from './components/tds-configuration/tds-configuration.component';
import { CalendarModule, MultiSelectModule, TabViewModule } from 'primeng/primeng';
import { AmazingTimePickerModule } from 'amazing-time-picker';
// tslint:disable-next-line: max-line-length
import { MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../shared.module';
import { TaxablePayItemComponent, updateExeptionDialogComponent } from './components/define-tax/tabs/taxable-pay-item/taxable-pay-item.component';
import { addUpdateTaxCriteriaDialogComponent, DeleteTaxCriteriaDialog, TaxPayerTypeComponent } from './components/define-tax/tabs/tax-payer-type/tax-payer-type.component';
import { addUpdateTaxDialogComponent, DeleteTaxSlabDialog, TaxComponent } from './components/define-tax/tabs/tax/tax.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TaxDeclarationsComponent } from './components/tax-declarations/tax-declarations.component';
import { TaxYearComponent } from './components/tax-declarations/tabs/tax-year/tax-year.component';
import { AddUpdateTaxDeclarationCategoryDialogComponent, DeleteTaxDeclarationCategoriesComponent, TaxDeclarationCategoriesComponent } from './components/tax-declarations/tabs/tax-declaration-categories/tax-declaration-categories.component';
import { AddUpdateTaxDeclarationCategorySettingDialogComponent, DeleteTaxDeclarationCategorysettingsComponent, TaxDeclarationCategorySettingsComponent, updateTaxDeclarationSettingsDialog } from './components/tax-declarations/tabs/tax-declaration-category-settings/tax-declaration-category-settings.component';
import { EmployeeTaxDeclarationsComponent } from './components/tax-declarations/tabs/employee-tax-declarations/employee-tax-declarations.component';
import { LockUnlockEmployeeComponent, LockUnlockEmployeesDialogComponent } from './components/tax-declarations/tabs/lock-unlock-employee/lock-unlock-employee.component';
import { AddUpdateDirectExemptionDialogComponent, DeleteDirectExemptionComponent, DirectExemptionComponent } from './components/tax-exemption/tabs/direct-exemption/direct-exemption.component';
import { IndirectExemptionComponent, UpdateInDirectExemptionDialogComponent } from './components/tax-exemption/tabs/indirect-exemption/indirect-exemption.component';
import { ETDSComponent } from './components/e-tds/e-tds.component';
import { ChallanBatchComponent } from './components/e-tds/tabs/challan-batch/challan-batch.component';
import { ChallanEntryComponent } from './components/e-tds/tabs/challan-entry/challan-entry.component';
import { CompanyInformationComponent } from './components/e-tds/tabs/company-information/company-information.component';
import { GenerateChallanComponent } from './components/e-tds/tabs/generate-challan/generate-challan.component';
import { GenerateReportComponent } from './components/e-tds/tabs/generate-report/generate-report.component';
import { AccessChildGuard } from '../services/access-permission.guard';

@NgModule({
  imports: [
    CommonModule,
    TDSConfigurationRoutingModule,
    TabViewModule,
    AmazingTimePickerModule,
    MatTabsModule,
    NgSelectModule,
    MatTableModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    TableModule,
    MultiSelectModule,
    SharedModule
  ],
  declarations: [DefineTaxComponent, TaxExemptionComponent, TDSConfigurationComponent, TaxablePayItemComponent, TaxPayerTypeComponent, TaxComponent, updateExeptionDialogComponent, addUpdateTaxDialogComponent, addUpdateTaxCriteriaDialogComponent, DeleteTaxCriteriaDialog, DeleteTaxSlabDialog, TaxDeclarationsComponent, TaxYearComponent, TaxDeclarationCategoriesComponent, TaxDeclarationCategorySettingsComponent, EmployeeTaxDeclarationsComponent, LockUnlockEmployeeComponent, AddUpdateTaxDeclarationCategoryDialogComponent, AddUpdateTaxDeclarationCategorySettingDialogComponent, DeleteTaxDeclarationCategorysettingsComponent, DeleteTaxDeclarationCategoriesComponent, DirectExemptionComponent, IndirectExemptionComponent, AddUpdateDirectExemptionDialogComponent, DeleteDirectExemptionComponent, UpdateInDirectExemptionDialogComponent, ETDSComponent, ChallanBatchComponent, ChallanEntryComponent, CompanyInformationComponent, GenerateChallanComponent, GenerateReportComponent, updateTaxDeclarationSettingsDialog, LockUnlockEmployeesDialogComponent],
  entryComponents: [updateExeptionDialogComponent, addUpdateTaxDialogComponent, addUpdateTaxCriteriaDialogComponent, DeleteTaxCriteriaDialog, DeleteTaxSlabDialog, AddUpdateTaxDeclarationCategoryDialogComponent, AddUpdateTaxDeclarationCategorySettingDialogComponent, DeleteTaxDeclarationCategorysettingsComponent, DeleteTaxDeclarationCategoriesComponent, AddUpdateDirectExemptionDialogComponent, DeleteDirectExemptionComponent, UpdateInDirectExemptionDialogComponent, updateTaxDeclarationSettingsDialog, LockUnlockEmployeesDialogComponent],
  providers: [AccessChildGuard]
})
export class TDSConfigurationModule { }
