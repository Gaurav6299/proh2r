import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecruitmentConfigurationComponent } from './components/recruitment-configuration/recruitment-configuration.component';
import { RecruitmentFieldsComponent } from './components/recruitment-fields/recruitment-fields.component';
import { InterviewSchedulCalendarComponent } from './components/interview-schedul-calendar/interview-schedul-calendar.component';
import { CandidateReportComponent } from './components/candidate-report/candidate-report.component';
import { CandidateLetterConfigurationComponent } from './components/candidate-letter-configuration/candidate-letter-configuration.component';
import { UpdateStatusComponent } from './components/update-status/update-status.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentConfigurationComponent,
    children: [
      { path: '', component: RecruitmentFieldsComponent },
       { path: 'recruitment-fields', component: RecruitmentFieldsComponent },
       { path: 'interview-Schedular', component: InterviewSchedulCalendarComponent },
       { path: 'candidate-report', component: CandidateReportComponent },
       { path: 'candidate-letter-configuration', component: CandidateLetterConfigurationComponent },
       { path: 'update-status', component: UpdateStatusComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentRoutingModule { }
