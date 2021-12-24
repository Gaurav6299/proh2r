import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './components/organization/organization.component';
import { AddSignatoryTemplateDialog } from './components/documents/tabs/letter-templates/letter-templates.component';
import { CompanyPolicyDocumentsComponent, DeleteCompanyDocDialog, OrgAddCompanyPolicyDocumentInfoComponent, OrgEditCompanyPolicyDocumentInfoComponent } from './components/documents/tabs/company-policy-documents/company-policy-documents.component';
import { EmployeeDocumentCategoriesComponent, DeleteEmpDocDialog, DeleteCategoryDialog, OrgAddCategory, CategoryDetailsComponent } from './components/documents/tabs/employee-document-categories/employee-document-categories.component';
import { LetterTemplatesComponent, DeleteSignatoryDialog, DeleteLetterDialog, DeleteFooterDialog, DeleteHeaderDialog } from './components/documents/tabs/letter-templates/letter-templates.component';
import { GeneratedLettersComponent, DeleteGeneratedLetters, PublishEmpLetter, GenerateEmpLetter } from './components/documents/tabs/generated-letters/generated-letters.component';
import { CkeditorModule } from '../ckeditor/ckeditor.module';
import { DocumentsComponent } from './components/documents/documents.component';
import { EmployeeFieldsComponent, DeleteEmployeeSectionDialogComponent, EditSectionDialogComponent, DeleteFieldDialogComponent } from './components/employee-fields/employee-fields.component';
import { ManageAdministratorsComponent, EditAdministratorsComponent, DeleteDialogAdministratorsComponent } from './components/manage-administrators/manage-administrators.component';
import { EmployeeTreeComponent } from './components/employee-tree/employee-tree.component';
import { OrgProfileComponent, AddUpdateCompanyProfileComponent, DeleteCompanyProfileComponent, SubOrganizationImageCropperComponent } from './components/organization-setup/tabs/org-profile/org-profile.component';
import { OrgLocationsComponent } from './components/organization-setup/tabs/org-locations/org-locations.component';
import { LocationDialogComponent, DeleteLocationDialogComponent, ModifyLocationDialogComponent } from './components/organization-setup/tabs/org-locations/org-locations.component';
import { OrgBankInfoComponent, OrgAddBankInformation, OrgDeleteBankInformation } from './components/organization-setup/tabs/org-bank-info/org-bank-info.component';
import { OrgSigDetailsComponent, OrgAddSigInformation, OrgSigDeleteInformation } from './components/organization-setup/tabs/org-sig-details/org-sig-details.component';
import { OrganizationHeaderComponent, OrganizationImageCropperComponent, } from './components/organization-header/organization-header.component';
import { MangeEditContentComponent } from './components/manage-administrators/mange-edit-content/mange-edit-content.component';
import { AddFieldsComponent } from './components/employee-fields/add-fields/add-fields.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LeftRightPanelsComponent } from './components/documents/tabs/company-policy-documents/left-right-panels/left-right-panels.component';
import { EmployeeDocumentPanelComponent } from './components/documents/tabs/employee-document-categories/employee-document-panel/employee-document-panel.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DialogModule } from 'primeng/dialog';
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
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooleanPipe } from '../services/BooleanPipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatIconModule } from '@angular/material/icon';
import { OrganizationSetupComponent } from './components/organization-setup/organization-setup.component';
import { OrganizationService } from './components/organization-setup/tabs/org-profile/organization.service';
import { ImagePreloadDirective } from './components/organization-header/image-preload.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrgDepartmentsComponent, AddUpdateDepartmentComponent, DeleteDepartmentComponent, AssignSubDepartmentComponent } from './components/organization-setup/tabs/org-departments/org-departments.component';
import { OrgDesignationsComponent, AddUpdateDesignationComponent, DeleteDesignationComponent } from './components/organization-setup/tabs/org-designations/org-designations.component';
import { OrgBandsComponent, AddBandComponent, DeleteBandComponent } from './components/organization-setup/tabs/org-bands/org-bands.component';
import { OrgHolidaysComponent, HolidayDialogComponent, HolidayEditDialogComponent, DeleteHoliDayDialogComponent } from './components/organization-setup/tabs/org-holidays/org-holidays.component';
import { SharedModule } from '../shared.module';
import { OrgSubDepartmentsComponent, AddUpdateSubDepartmentComponent, DeleteSubDepartmentComponent } from './components/organization-setup/tabs/org-sub-departments/org-sub-departments.component';
import { LeftRightPanesComponent } from './components/organization-setup/tabs/org-profile/left-right-panes/left-right-panes.component';
import { DeleteDialogManagementDashboardComponent, ManagementDashboardAccessComponent } from './components/management-dashboard-access/management-dashboard-access.component';
import { AccessComponentGuard } from '../services/access-permission.guard';
import { CheckboxModule, PanelModule } from 'primeng/primeng';
import { FileValueAccessor } from './components/documents/tabs/company-policy-documents/file-control-value-accessor';
import { FileValidator } from './components/documents/tabs/company-policy-documents/file-input.validator';

@NgModule({
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    OrganizationChartModule,
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
    FormsModule,
    CheckboxModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    ImageCropperModule,
    MatIconModule,
    NgSelectModule,
    MultiSelectModule,
    TableModule,
    PaginatorModule,
    PanelModule,
    SharedModule,
    CkeditorModule,
    DialogModule
  ],
  declarations: [
    OrgAddSigInformation,
    OrgSigDeleteInformation,
    OrganizationComponent,
    DocumentsComponent,
    AddSignatoryTemplateDialog,
    CompanyPolicyDocumentsComponent,
    OrgAddCompanyPolicyDocumentInfoComponent,
    OrgEditCompanyPolicyDocumentInfoComponent,
    EmployeeDocumentCategoriesComponent,
    LetterTemplatesComponent,
    GeneratedLettersComponent,
    OrganizationSetupComponent,
    DocumentsComponent,
    HolidayDialogComponent,
    HolidayEditDialogComponent,
    DeleteHoliDayDialogComponent,
    EmployeeFieldsComponent,
    DeleteEmployeeSectionDialogComponent,
    EditSectionDialogComponent,
    DeleteFieldDialogComponent,
    ManageAdministratorsComponent,
    EditAdministratorsComponent,
    DeleteDialogAdministratorsComponent,
    EmployeeTreeComponent,
    OrgProfileComponent,
    OrgLocationsComponent,
    LocationDialogComponent,
    DeleteLocationDialogComponent,
    ModifyLocationDialogComponent,
    OrgBankInfoComponent,
    OrgAddBankInformation,
    OrgDeleteBankInformation,
    OrgSigDetailsComponent,
    OrganizationHeaderComponent,
    MangeEditContentComponent,
    AddFieldsComponent,
    LeftRightPanelsComponent,
    EmployeeDocumentPanelComponent,
    DeleteEmpDocDialog,
    DeleteCompanyDocDialog,
    DeleteSignatoryDialog,
    DeleteLetterDialog,
    DeleteFooterDialog,
    DeleteHeaderDialog,
    DeleteGeneratedLetters,
    PublishEmpLetter,
    GenerateEmpLetter,
    BooleanPipe,
    DeleteCategoryDialog,
    OrgAddCategory,
    CategoryDetailsComponent,
    OrganizationImageCropperComponent,
    SubOrganizationImageCropperComponent,
    AddUpdateDepartmentComponent,
    AddUpdateSubDepartmentComponent,
    DeleteDepartmentComponent,
    AddBandComponent,
    DeleteBandComponent,
    ImagePreloadDirective,
    DeleteDesignationComponent,
    AddUpdateDesignationComponent,
    OrgDepartmentsComponent,
    OrgDesignationsComponent,
    OrgBandsComponent,
    OrgHolidaysComponent,
    OrgSubDepartmentsComponent,
    DeleteSubDepartmentComponent,
    AssignSubDepartmentComponent,
    LeftRightPanesComponent,
    AddUpdateCompanyProfileComponent,
    DeleteCompanyProfileComponent,
    ManagementDashboardAccessComponent,
    DeleteDialogManagementDashboardComponent,
    FileValueAccessor,
    FileValidator
  ],
  entryComponents: [
    OrgAddSigInformation,
    OrgAddCategory,
    OrgSigDeleteInformation,
    AddSignatoryTemplateDialog,
    HolidayDialogComponent,
    HolidayEditDialogComponent,
    DeleteHoliDayDialogComponent,
    EditSectionDialogComponent,
    DeleteEmployeeSectionDialogComponent,
    DeleteFieldDialogComponent,
    DeleteDialogAdministratorsComponent,
    LocationDialogComponent,
    DeleteLocationDialogComponent,
    ModifyLocationDialogComponent,
    OrgAddBankInformation,
    OrgDeleteBankInformation,
    DeleteEmpDocDialog,
    OrgAddCompanyPolicyDocumentInfoComponent,
    OrgEditCompanyPolicyDocumentInfoComponent,
    DeleteCompanyDocDialog,
    DeleteSignatoryDialog,
    DeleteLetterDialog,
    DeleteFooterDialog,
    DeleteHeaderDialog,
    DeleteGeneratedLetters,
    PublishEmpLetter,
    GenerateEmpLetter,
    DeleteCategoryDialog,
    OrganizationImageCropperComponent,
    SubOrganizationImageCropperComponent,
    AddUpdateDepartmentComponent,
    AddUpdateSubDepartmentComponent,
    DeleteDepartmentComponent,
    AddBandComponent,
    DeleteBandComponent,
    AddUpdateDesignationComponent,
    DeleteDesignationComponent,
    DeleteSubDepartmentComponent,
    AssignSubDepartmentComponent,
    AddUpdateCompanyProfileComponent,
    DeleteCompanyProfileComponent,
    DeleteDialogManagementDashboardComponent
  ],
  providers: [OrganizationService, AccessComponentGuard]
})
export class OrganizationModule { }
