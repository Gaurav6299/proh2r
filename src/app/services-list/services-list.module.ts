import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesListRoutingModule } from './services-list-routing.module';
import { ServicesListComponent } from './components/services-list/services-list.component';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  imports: [
    CommonModule,
    ServicesListRoutingModule,
    MatGridListModule
  ],
  declarations: [ServicesListComponent]
})
export class ServicesListModule { }
