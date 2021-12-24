import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessChildGuard } from '../services/access-permission.guard';
import { DefineTaxComponent } from './components/define-tax/define-tax.component';
import { ETDSComponent } from './components/e-tds/e-tds.component';
import { TaxDeclarationsComponent } from './components/tax-declarations/tax-declarations.component';
import { TaxExemptionComponent } from './components/tax-exemption/tax-exemption.component';
import { TDSConfigurationComponent } from './components/tds-configuration/tds-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: TDSConfigurationComponent, canActivateChild: [AccessChildGuard],
    children: [
      { path: '', component: DefineTaxComponent, data: {role: 'proH2R_taxation_settings'} },
      { path: 'settings', component: DefineTaxComponent, data: {role: 'proH2R_taxation_settings'} },
      { path: 'tax-exemptions', component: TaxExemptionComponent, data: {role: 'proH2R_tax_exemptions'} },
      { path: 'tax-declarations', component: TaxDeclarationsComponent, data: {role: 'proH2R_tax_declarations'} },
      { path: 'eTDS', component: ETDSComponent, data: {role: 'proH2R_taxation_etds'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TDSConfigurationRoutingModule { }
