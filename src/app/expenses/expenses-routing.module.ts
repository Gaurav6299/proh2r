import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { ExpenseReportsComponent } from './components/expense-reports/expense-reports.component';
import { ExpenseReportRightPanesComponent } from '../expenses/components/expense-reports/expense-report-right-panes/expense-report-right-panes.component'
import { ExpenseProcessHistoryComponent } from '../expenses/components/expense-process-history/expense-process-history.component';
import { AccessComponentGuard } from '../services/access-permission.guard';
import { AdvanceReportsComponent } from './components/advance-reports/advance-reports.component';
const routes: Routes = [
  {
    path: '',
    component: SettingsComponent
  },
  {
    path: 'settings', component: SettingsComponent,
    canActivate: [AccessComponentGuard],
    data: { role: 'proH2R_expense_settings' }
  },
  { path: 'settings/:id', component: SettingsComponent },
  {
    path: 'expense-reports', component: ExpenseReportsComponent,
    canActivate: [AccessComponentGuard],
    data: { role: 'proH2R_expense_reports' }
  },
  { path: 'advance-reports', component: AdvanceReportsComponent },
  { path: 'expense-process-history', component: ExpenseProcessHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
