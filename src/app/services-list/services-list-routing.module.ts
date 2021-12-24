import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesListComponent } from './components/services-list/services-list.component';

const routes: Routes = [{
  path: '',
  component: ServicesListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesListRoutingModule { }
