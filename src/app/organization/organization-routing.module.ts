import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationComponent } from './components/organization/organization.component';
import { DocumentsComponent } from './components/documents/documents.component';
// import { HolidaysComponent } from './components/holidays/holidays.component';
import { EmployeeFieldsComponent } from './components/employee-fields/employee-fields.component';
import { ManageAdministratorsComponent } from './components/manage-administrators/manage-administrators.component';
import { EmployeeTreeComponent } from './components/employee-tree/employee-tree.component';
import { OrganizationSetupComponent } from './components/organization-setup/organization-setup.component';
import { AccessComponentGuard } from '../services/access-permission.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'organization-setup'
  },
  { path: 'organization-setup', component: OrganizationSetupComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_organization_setup'} },
  { path: 'documents', component: DocumentsComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_documents'} },
  { path: 'employee-fields', component: EmployeeFieldsComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_employee_fields'} },
  { path: 'manage-administrators', component: ManageAdministratorsComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_access_management'} },
  { path: 'employee-tree', component: EmployeeTreeComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_employee_tree'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
