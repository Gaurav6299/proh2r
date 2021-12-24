import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './components/alerts/alerts.component';
import { PendingRequestsComponent } from './components/alerts/pending-requests/pending-requests.component';
import { SetupIssuesComponent } from './components/alerts/setup-issues/setup-issues.component';
import { ProcessAlertsComponent } from './components/alerts/process-alerts/process-alerts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatTabsModule,
  MatTableModule,
  MatInputModule,
  MatPaginatorModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatRadioModule,
  MatNativeDateModule,
  MatListModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatStepperModule
} from '@angular/material';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
@NgModule({
  imports: [
    CommonModule,
    AlertsRoutingModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatStepperModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    TableModule,
    PaginatorModule
  ],
  declarations: [AlertsComponent,
    PendingRequestsComponent,
    SetupIssuesComponent,
    ProcessAlertsComponent]
})
export class AlertsModule { }
