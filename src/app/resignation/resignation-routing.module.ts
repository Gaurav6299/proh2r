import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResignationSettingsComponent } from './components/resignation-settings/resignation-settings.component';
import { ResignationComponent } from './components/resignation/resignation.component';
import { ResignationApplicationsComponent } from './components/resignation-applications/resignation-applications.component';
import { AssetDeallocationComponent } from './components/asset-deallocation/asset-deallocation.component';
import { AccessComponentGuard } from '../services/access-permission.guard';

const routes: Routes = [
  {
    path: '',
    component: ResignationComponent,
    children: [
      { path: '', component: ResignationSettingsComponent },
      {
        path: 'separation-settings', component: ResignationSettingsComponent, canActivate: [AccessComponentGuard],
        data: { role: 'proH2R_separation_settings' }
      },
      {
        path: 'separation-application', component: ResignationApplicationsComponent, canActivate: [AccessComponentGuard],
        data: { role: 'proH2R_separation_requests' }
      },
      {
        path: 'asset-deallocation', component: AssetDeallocationComponent, canActivate: [AccessComponentGuard],
        data: { role: 'proH2R_asset_deallocation_requests' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResignationRoutingModule { }
