import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './components/reports/reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatSelectModule, MatButtonModule, MatListModule, MatTableDataSource, MatCheckboxModule, MatSlideToggleModule } from '@angular/material';
import { CustomReportComponent } from './components/custom-report/custom-report.component';
import { AddCustomReportComponent } from './components/add-custom-report/add-custom-report.component';
import { ReportSettingComponent } from './components/report-setting/report-setting.component';
import { CategoryComponent, AddReportCategoryComponent, DeleteReportCategoryComponent } from './components/report-setting/tabs/category/category.component';
import { Proh2rReportsComponent, AddUpdateProh2rReportsComponent, DeleteProh2rReportsTemplateComponent } from './components/report-setting/tabs/proh2r-reports/proh2r-reports.component';
import { GroupReportListComponent, AddReportsComponent, DeleteGroupReportListComponent, AssignGroupComponent, AssignUserComponent } from './components/report-setting/tabs/group-report-list/group-report-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    NgSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSlideToggleModule,
    MultiSelectModule,
    TableModule,
    PaginatorModule
  ],
  declarations: [
    GroupReportListComponent,
    ReportsComponent,
    AddReportsComponent,
    DeleteGroupReportListComponent,
    CustomReportComponent,
    AddCustomReportComponent,
    CategoryComponent,
    AddReportCategoryComponent,
    DeleteReportCategoryComponent,
    ReportSettingComponent,
    Proh2rReportsComponent,
    AddUpdateProh2rReportsComponent,
    DeleteProh2rReportsTemplateComponent,
    AssignGroupComponent,
    AssignUserComponent,
  ],
  entryComponents: [
    AddReportsComponent,
    DeleteGroupReportListComponent,
    AddReportCategoryComponent,
    DeleteReportCategoryComponent,
    AddUpdateProh2rReportsComponent,
    DeleteProh2rReportsTemplateComponent,
    AssignGroupComponent,
    AssignUserComponent,
  ]
})
export class ReportsModule { }
