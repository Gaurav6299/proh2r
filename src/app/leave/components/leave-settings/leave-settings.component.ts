import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { LeaveCategoriesSettingComponent } from './tabs/leave-categories-setting/leave-categories-setting.component';
import { LeaveTamplatesComponent } from './tabs/leave-tamplates/leave-tamplates.component';
import { LeaveAssignmentComponent } from './tabs/leave-assignment/leave-assignment.component'
import { GeneralLeaveSettingComponent } from './tabs/general-leave-setting/general-leave-setting.component';
declare var $: any;

@Component({
  selector: 'app-leave-settings',
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.scss']
})

export class LeaveSettingsComponent implements OnInit {
  @ViewChild(LeaveCategoriesSettingComponent) categoryChild: LeaveCategoriesSettingComponent;
  @ViewChild(LeaveTamplatesComponent) tempChild: LeaveTamplatesComponent;
  @ViewChild(LeaveAssignmentComponent) leaveAssign: LeaveAssignmentComponent;
  @ViewChild(GeneralLeaveSettingComponent) generalLeaveSettingComponent: GeneralLeaveSettingComponent;
  panelFirstWidth: any;
  panelFirstHeight: any;
  public selectedTab = 1;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(res =>
      this.selectedTab = res.id);
  }

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
    this.leaveAssign.employeeLeaveAssignment.reset();
    console.log(event)
    // this.leaveAssign.applyFilter(null);
    // alert("this.leaveAssign.applyFilter");
    if (event.index === 0) {
      this.generalLeaveSettingComponent.getAllGeneralSettingRecord();

    }
    if (event.index === 1) {
      this.tempChild.nextStep = 1;
      this.categoryChild.isLeftVisible = false;
      this.categoryChild.getAllLeaveSettingData();

    }
    else if (event.index === 2) {
      this.tempChild.nextStep = 1;
      this.tempChild.isLeftVisible = false;
      this.tempChild.getAllLeaveSettingData();
    }
    else if (event.index === 3) {
      this.leaveAssign.getLeaveAssignment();

    }

  }
}
