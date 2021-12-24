import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { AddCustomReportComponent } from './components/add-custom-report/add-custom-report.component';
import { ReportSettingComponent } from './components/report-setting/report-setting.component';
import { CustomReportComponent } from './components/custom-report/custom-report.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      // { path: '', component: GroupReportListComponent },
      // { path: 'group-report-list', component: GroupReportListComponent },
      { path: '', component: ReportSettingComponent },
      { path: 'reports-setting', component: ReportSettingComponent },
      // { path: 'custom-report', component: CustomReportComponent },
      // { path: 'add-custom-report', component: AddCustomReportComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
