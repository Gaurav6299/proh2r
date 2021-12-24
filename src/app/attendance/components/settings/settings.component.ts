import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceTemplatesComponent } from './tabs/attendance-templates/attendance-templates.component';
import { AttendanceShiftComponent } from './tabs/attendance-shift/attendance-shift.component';
import { AttendanceShiftAssignmentComponent } from './tabs/attendance-shift-assignment/attendance-shift-assignment.component';
import { TemplateAssignmentComponent } from './tabs/template-assignment/template-assignment.component';
import { GeneralAttendanceSettingsComponent } from './tabs/general-attendance-settings/general-attendance-settings.component';
import { OndutyAttendanceTemplateAssignmentComponent } from './tabs/onduty-attendance-template-assignment/onduty-attendance-template-assignment.component';
import { OndutyAttendanceTemplateComponent } from './tabs/onduty-attendance-template/onduty-attendance-template.component';
declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild(AttendanceTemplatesComponent) tempChild: AttendanceTemplatesComponent;
  @ViewChild(AttendanceShiftComponent) shiftChild: AttendanceShiftComponent;
  @ViewChild(AttendanceShiftAssignmentComponent) shiftAssignChild: AttendanceShiftAssignmentComponent;
  @ViewChild(TemplateAssignmentComponent) tempAssignChild: TemplateAssignmentComponent;
  @ViewChild(GeneralAttendanceSettingsComponent) generalAttendanceSettingsComponentChild: GeneralAttendanceSettingsComponent;
  @ViewChild(OndutyAttendanceTemplateAssignmentComponent) ondutyAttendanceTemplateAssignmentComponentChild: OndutyAttendanceTemplateAssignmentComponent;
  @ViewChild(OndutyAttendanceTemplateComponent) ondutyAttendanceTemplateComponentChild: OndutyAttendanceTemplateComponent;


  panelFirstWidth: any;
  panelFirstHeight: any;
  tabChanged: any = false;
  selectedTab = 1;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(res =>
      this.selectedTab = res.id
    );
  }
  ngOnInit() {
  }

  onTabChange(event) {
    console.log(event);
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  selectedTabChange(event) {
    console.log(event);
    if (event.index === 0) {
      this.generalAttendanceSettingsComponentChild.getAllAttendeceSettingData();

      this.generalAttendanceSettingsComponentChild.getRegularizationReasonSettingStatus();
    }
    if (event.index === 1) {
      this.tempChild.isLeftVisible = false;
      this.tempChild.check1 = false;
      this.tempChild.getAttendanceTemplateData();
    } else if (event.index === 2) {
      this.tempAssignChild.clearFilter();
      this.tempAssignChild.attendenceAssignTemplate();
    }
    else if (event.index === 3) {
      this.tempAssignChild.clearFilter();
      this.ondutyAttendanceTemplateComponentChild.isLeftVisible = false;
      this.ondutyAttendanceTemplateComponentChild.getOndutyAttendanceTemplate();
    }
    else if (event.index === 4) {
      this.tempAssignChild.clearFilter();
      this.ondutyAttendanceTemplateAssignmentComponentChild.getAllOnDutyAssignments();
      this.ondutyAttendanceTemplateAssignmentComponentChild.getAllOnDutyAttendanceTemplate();
      this.ondutyAttendanceTemplateAssignmentComponentChild.getEmployeeList();
      ;
    } else if (event.index === 5) {
      this.shiftChild.isLeftVisible = false;
      this.shiftChild.check1 = false;
      this.shiftChild.getAllShiftRecordsData();
    } else if (event.index === 6) {
      this.shiftAssignChild.clearFilter();
      this.shiftAssignChild.getShiftAssignmentTableData();
    }
  }

}
