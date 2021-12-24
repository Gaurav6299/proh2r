import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlexiBenefitsComponent } from './components/flexi-benefits/flexi-benefits.component';

const routes: Routes = [
  {
    path: '',
    component: FlexiBenefitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlexiBenefitsRoutingModule { }
