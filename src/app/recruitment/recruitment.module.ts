import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  MatOptionModule,
  MatNativeDateModule,
  MatListModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatStepperModule,
  MatOption
} from '@angular/material';
import { RecruitmentRoutingModule } from './recruitment-routing.module';
// tslint:disable-next-line:max-line-length
import { RecruitmentFieldsComponent, EditRecruitmentSectionDialogComponent, DeleteRecruitmentFieldDialogComponent } from './components/recruitment-fields/recruitment-fields.component';
import { AddEditFieldsComponent } from './components/recruitment-fields/add-edit-fields/add-edit-fields.component';
import { RecruitmentConfigurationComponent } from './components/recruitment-configuration/recruitment-configuration.component';
// tslint:disable-next-line:max-line-length

import { InterviewSchedulCalendarComponent, InterviewEventCalanderDialogComponent, InterviewEventViewDialogComponent } from './components/interview-schedul-calendar/interview-schedul-calendar.component';
import { CandidateReportComponent, CandidateDialog } from './components/candidate-report/candidate-report.component';

import { PersonalDetailsComponent } from './components/candidate-report/personal-details/personal-details.component';
import { EducationalDetailsComponent } from './components/candidate-report/educational-details/educational-details.component';
import { EmploymentDetailsComponent } from './components/candidate-report/employment-details/employment-details.component';
import { LeftRightPanesComponent } from './components/candidate-report/left-right-panes/left-right-panes.component';
import { CandidateLetterConfigurationComponent } from './components/candidate-letter-configuration/candidate-letter-configuration.component';
import { CandidatesOfferLetterComponent, SendMailOfferLetterDialogComponent, } from './components/candidate-letter-configuration/tabs/candidates-offer-letter/candidates-offer-letter.component';
import { CandidatesAppointmentLetterComponent, SendMailAppointmentLetterDialogComponent } from './components/candidate-letter-configuration/tabs/candidates-appointment-letter/candidates-appointment-letter.component';
import { AddEditOfferLetterComponent } from './components/candidate-letter-configuration/tabs/candidates-offer-letter/add-edit-offer-letter/add-edit-offer-letter.component';
import { AddEditCandidatesAppointmentLetterComponent } from './components/candidate-letter-configuration/tabs/candidates-appointment-letter/add-edit-candidates-appointment-letter/add-edit-candidates-appointment-letter.component';
import { UpdateStatusComponent, UpdateStatusDialog } from './components/update-status/update-status.component';

@NgModule({
  imports: [
    CommonModule,
    RecruitmentRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatStepperModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  declarations: [
    RecruitmentFieldsComponent,
    AddEditFieldsComponent,
    RecruitmentConfigurationComponent,
    EditRecruitmentSectionDialogComponent,
    DeleteRecruitmentFieldDialogComponent,
    InterviewSchedulCalendarComponent,
    InterviewEventCalanderDialogComponent,
    InterviewEventViewDialogComponent,
    CandidateReportComponent,
    PersonalDetailsComponent,
    EducationalDetailsComponent,
    EmploymentDetailsComponent,
    LeftRightPanesComponent,
    CandidateLetterConfigurationComponent,
    CandidatesOfferLetterComponent,
    CandidatesAppointmentLetterComponent,
    SendMailOfferLetterDialogComponent,
    SendMailAppointmentLetterDialogComponent,
    AddEditOfferLetterComponent,
    AddEditCandidatesAppointmentLetterComponent,

    UpdateStatusComponent,
    UpdateStatusDialog,
    CandidateDialog
  ],
  entryComponents: [
    RecruitmentConfigurationComponent,
    EditRecruitmentSectionDialogComponent,
    DeleteRecruitmentFieldDialogComponent,
    InterviewEventCalanderDialogComponent,
    InterviewEventViewDialogComponent,
    SendMailOfferLetterDialogComponent,
    SendMailAppointmentLetterDialogComponent,

    UpdateStatusDialog,
    CandidateDialog
  ]
})
export class RecruitmentModule { }
