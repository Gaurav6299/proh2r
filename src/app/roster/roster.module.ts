import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RosterRoutingModule } from './roster-routing.module';
import { RosterComponent } from './components/roster/roster.component';

@NgModule({
  imports: [
    CommonModule,
    RosterRoutingModule
  ],
  declarations: [RosterComponent]
})
export class RosterModule { }
