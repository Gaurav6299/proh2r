
import { Component, OnInit, ViewChild } from '@angular/core';
import { ResignationTemplateComponent } from './tabs/resignation-template/resignation-template.component';
import { MatTabChangeEvent } from '@angular/material';
import { ResignationAssignmentComponent } from './tabs/resignation-assignment/resignation-assignment.component';
import { SeparationtypesComponent } from './tabs/separationtypes/separationtypes.component';
import { InterviewquestionsComponent } from './tabs/interviewquestions/interviewquestions.component';


@Component({
  selector: 'app-resignation-settings',
  templateUrl: './resignation-settings.component.html',
  styleUrls: ['./resignation-settings.component.scss']
})
export class ResignationSettingsComponent implements OnInit {
  @ViewChild(ResignationTemplateComponent) tempChild: ResignationTemplateComponent;

  @ViewChild(ResignationAssignmentComponent) resignationAssignmentComponentChild: ResignationAssignmentComponent;

  @ViewChild(SeparationtypesComponent) separationtypesComponentChild: SeparationtypesComponent;

  @ViewChild(InterviewquestionsComponent) interviewquestionsComponentChild: InterviewquestionsComponent;

  @ViewChild(ResignationTemplateComponent) resignationTemplateComponentChild: ResignationTemplateComponent;


  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab = 0;
  constructor() { }

  ngOnInit() {
  }
  onTabChange() {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  selectedTabChange(event) {
    console.log(event)
    if (event.index === 0) {
      this.separationtypesComponentChild.getSeparationType();
    }
    if (event.index === 1) {
      this.interviewquestionsComponentChild.getExitInterviewQuestionType();
      this.interviewquestionsComponentChild.getSeparationTypes();
    }
    if (event.index === 2) {
      this.resignationTemplateComponentChild.getEmployee();

      this.resignationTemplateComponentChild.getAllTemplate();
      this.resignationTemplateComponentChild.isLeftVisible = false;
      
     }
    if (event.index === 3) {
      this.resignationAssignmentComponentChild.getResignationAssignment();
      this.resignationAssignmentComponentChild.getResignationTemplate();
    }
  }
}
