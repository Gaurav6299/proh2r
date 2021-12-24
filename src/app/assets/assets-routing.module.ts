import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessComponentGuard } from '../services/access-permission.guard';
import { AssetsManagementComponent } from './assets-management/assets-management.component';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'assets-management'},
  {path:'assets-management',component:AssetsManagementComponent, canActivate: [AccessComponentGuard], data: {role: 'proH2R_asset_management'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
