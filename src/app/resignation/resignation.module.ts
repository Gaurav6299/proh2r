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
  MatNativeDateModule,
  MatListModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
import { ResignationRoutingModule } from './resignation-routing.module';
import { ResignationComponent } from './components/resignation/resignation.component';
import { ResignationSettingsComponent } from './components/resignation-settings/resignation-settings.component';
import { ResignationTemplateComponent } from './components/resignation-settings/tabs/resignation-template/resignation-template.component';
import { BulkUploadResponseComponent, BulkUploadTemplateAssignment, ResignationAssignmentComponent } from './components/resignation-settings/tabs/resignation-assignment/resignation-assignment.component';
import { LeftRightResignationSettingsComponent } from './components/resignation-settings/tabs/resignation-template/left-right-resignation-settings/left-right-resignation-settings.component';
import { DeleteResignationTamplate } from './components/resignation-settings/tabs/resignation-template/resignation-template.component';
import { ResignationApplicationsComponent, ApproveRequestComponent, AddSeparationRequestComponent } from './components/resignation-applications/resignation-applications.component';
import { AddRequestLeftRightPanesComponent } from './components/resignation-applications/add-request-left-right-panes/add-request-left-right-panes.component';
import { AddResignationAssignment, EditResignationTemplateAssignment } from './components/resignation-settings/tabs/resignation-assignment/resignation-assignment.component';
import { ResignationDelete } from './components/resignation-settings/tabs/resignation-assignment/resignation-assignment.component';
import { SeparationtypesComponent, AddUpdateSeparationTypeComponent, DeleteSeparationComponent } from './components/resignation-settings/tabs/separationtypes/separationtypes.component';
import { InterviewquestionsComponent, AddUpdateInterviewQuestionsComponent, DeleteInterviewTemplateComponent } from './components/resignation-settings/tabs/interviewquestions/interviewquestions.component';
import { SharedModule } from '../shared.module'
import { AssetDeallocationComponent, ApproveDeallocationRequestComponent } from './components/asset-deallocation/asset-deallocation.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
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
    MatAutocompleteModule,
    MatTooltipModule,
    MatStepperModule,
    CommonModule,
    ResignationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MultiSelectModule,
    TableModule,
    NgSelectModule
  ],
  declarations: [
    ResignationComponent,
    ResignationSettingsComponent,
    ResignationTemplateComponent,
    ResignationAssignmentComponent,
    LeftRightResignationSettingsComponent,
    DeleteResignationTamplate,
    ResignationApplicationsComponent,
    AddRequestLeftRightPanesComponent,
    EditResignationTemplateAssignment,
    AddResignationAssignment,
    ResignationDelete,
    ApproveRequestComponent,
    SeparationtypesComponent,
    InterviewquestionsComponent,
    AddUpdateSeparationTypeComponent,
    DeleteSeparationComponent,
    AddUpdateInterviewQuestionsComponent,
    DeleteInterviewTemplateComponent,
    AddSeparationRequestComponent,
    AssetDeallocationComponent,
    ApproveDeallocationRequestComponent,
    BulkUploadTemplateAssignment,
    BulkUploadResponseComponent

  ],
  entryComponents: [
    DeleteResignationTamplate,
    EditResignationTemplateAssignment,
    AddResignationAssignment,
    ResignationDelete,
    ApproveRequestComponent,
    AddUpdateSeparationTypeComponent,
    DeleteSeparationComponent,
    AddUpdateInterviewQuestionsComponent,
    DeleteInterviewTemplateComponent,
    AddSeparationRequestComponent,
    ApproveDeallocationRequestComponent,
    BulkUploadTemplateAssignment,
    BulkUploadResponseComponent
   
  ]
})
export class ResignationModule { }
