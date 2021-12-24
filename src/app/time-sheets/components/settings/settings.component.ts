import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimeSheetTemplateComponent } from './tabs/time-sheet-template/time-sheet-template.component';
import { TimeSheetTemplateAssignmentComponent } from './tabs/time-sheet-template-assignment/time-sheet-template-assignment.component';
declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild(TimeSheetTemplateAssignmentComponent) TimesheetTemplateAssignmentComponentChild: TimeSheetTemplateAssignmentComponent;
  @ViewChild(TimeSheetTemplateComponent) TimesheetTemplateComponentChild: TimeSheetTemplateComponent;

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
      this.TimesheetTemplateComponentChild.isLeftVisible = false;
      this.TimesheetTemplateComponentChild.check1 = false;
      this.TimesheetTemplateComponentChild.getTimeSheetsTemplate();
    }
    else if (event.index === 1) {
      this.TimesheetTemplateAssignmentComponentChild.getAllTimeSheetAssignments();
      this.TimesheetTemplateAssignmentComponentChild.getAllTimeSheetsTemplate();
      this.TimesheetTemplateAssignmentComponentChild.getEmployeeList();
    }
  }

}
