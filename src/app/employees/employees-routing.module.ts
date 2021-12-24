import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';

import { AddNewEmployeeComponent } from './components/add-new-employee/add-new-employee.component';
import { BasicInformationComponent } from './components/add-new-employee/tabs/basic-information/basic-information.component';
import { EmploymentInformationComponent } from './components/add-new-employee/tabs/employment-information/employment-information.component';
import { SalaryInformationComponent } from './components/add-new-employee/tabs/salary-information/salary-information.component';
import { OtherInformationComponent } from './components/add-new-employee/tabs/other-information/other-information.component';
import { EmployeesMainComponent } from './components/employees-main/employees-main.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { SalaryDetailsComponent } from './components/edit-employee/tab/salary-details/salary-details.component';
import { CtcComponent } from './components/edit-employee/tab/salary-details/ctc/ctc.component';
import { SalaryInfoComponent } from './components/edit-employee/tab/salary-details/salary-info/salary-info.component';
import { StatutoryDetailComponent } from './components/add-new-employee/tabs/statutory-detail/statutory-detail.component';
import { EmployeeTerminationComponent } from './components/employee-termination/employee-termination.component';
import { AddCtcComponent } from './components/edit-employee/tab/salary-details/add-ctc/add-ctc.component';
import { TaxDeclarationsComponent } from './components/tax-declarations/tax-declarations.component';
import { TaxCalculatorComponent } from './components/tax-calculator/tax-calculator/tax-calculator.component';
import { AccessComponentGuard } from '../services/access-permission.guard';
import { EmployeeDetailReportComponent } from './components/employee-detail-report/employee-detail-report.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent, 
    children: [
      { path: '', component: EmployeesMainComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_employees_main'} },
      {
        path: 'add-employee', component: AddNewEmployeeComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_add_employee'},
        children: [
          {
            path: '', redirectTo: 'basic'
          },
          {
            path: 'basic', component: BasicInformationComponent
          },
          {
            path: 'employment', component: EmploymentInformationComponent
          },
          {
            path: 'salary', component: SalaryInformationComponent
          },
          {
            path: 'statutory', component: StatutoryDetailComponent
          },
          {
            path: 'other', component: OtherInformationComponent
          }
        ]

      },
      {
        path: 'edit-employee/:id', component: EditEmployeeComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_edit_employee'},
        children: [
          {
            path: '', component: SalaryDetailsComponent,
            children: [
              { path: '', component: SalaryInfoComponent },
              { path: 'edit-ctc/:salaryId', component: CtcComponent },
              { path: 'add-ctc', component: AddCtcComponent },
            ]
          },
        ]
      },
      { path: 'employee-termination', component: EmployeeTerminationComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_employees_main'} },
      { path: 'taxDeclarations/:id/:taxationYear', component: TaxDeclarationsComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_employees_main'} },
      { path: 'tax_calculator/:id', component: TaxCalculatorComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_employees_main'} },
      { path: 'employee-details', component: EmployeeDetailReportComponent },
    ]
  },
  // {
  //   path:'employee',component:EmployeeDetailReportComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
