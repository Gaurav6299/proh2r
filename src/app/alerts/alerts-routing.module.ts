import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertsComponent } from './components/alerts/alerts.component';
import { PendingRequestsComponent } from './components/alerts/pending-requests/pending-requests.component';
import { SetupIssuesComponent } from './components/alerts/setup-issues/setup-issues.component';
import { ProcessAlertsComponent } from './components/alerts/process-alerts/process-alerts.component';

const routes: Routes = [
  { path: '', component: PendingRequestsComponent },
  { path: 'pending-requests', component: PendingRequestsComponent },
  { path: 'setup-issues', component: SetupIssuesComponent },
  { path: 'process-alerts', component: ProcessAlertsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
