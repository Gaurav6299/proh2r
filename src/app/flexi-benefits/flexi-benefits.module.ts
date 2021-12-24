import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexiBenefitsRoutingModule } from './flexi-benefits-routing.module';
import { FlexiBenefitsComponent } from './components/flexi-benefits/flexi-benefits.component';

@NgModule({
  imports: [
    CommonModule,
    FlexiBenefitsRoutingModule
  ],
  declarations: [FlexiBenefitsComponent]
})
export class FlexiBenefitsModule { }
