import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ApiCommonService } from '../../../../../src/app/services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import * as moment from 'moment';
declare var $: any;
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  values = []
  selectedDay: any;
  selectedIndex: any;
  day0: any;
  day1: any;
  day2: any;
  day3: any;
  day4: any;
  day5: any;
  day6: any;
  isSubmitted: boolean;
  data = {
    empCode: '',
    fromDate: '',
    timeSheetApprovalStatus: '',
    timeSheetId: '',
    toDate: '',
    totalDeviationHours: '',
    totalHours: '',
    workWeekHours: '',
    timeSheetLineResVOS: [
      {
        projectId: '',
        taskId: '',
        taskName: '',
        totalHours: '',
        projectName: '',
        timeSheetLineItemId: '',
        day0: {
          date: '',
          day: '',
          totalDuration: '',
          timeSheetDayItemDescriptions: [{
            fromTime: '',
            hours: '',
            notes: '',
            timeSheetDayItemDescriptionId: '',
            toTime: '',
          }]
        },
        day1: {
          date: '',
          day: '',
          totalDuration: '',
          timeSheetDayItemDescriptions: [{
            fromTime: '',
            hours: '',
            notes: '',
            timeSheetDayItemDescriptionId: '',
            toTime: '',
          }]
        },
        day2: {
          date: '',
          day: '',
          totalDuration: '',
          timeSheetDayItemDescriptions: [{
            fromTime: '',
            hours: '',
            notes: '',
            timeSheetDayItemDescriptionId: '',
            toTime: '',
          }]
        },
        day3: {
          date: '',
          day: '',
          totalDuration: '',
          timeSheetDayItemDescriptions: [{
            fromTime: '',
            hours: '',
            notes: '',
            timeSheetDayItemDescriptionId: '',
            toTime: '',
          }]
        },
        day4: {
          date: '',
          day: '',
          totalDuration: '',
          timeSheetDayItemDescriptions: [{
            fromTime: '',
            hours: '',
            notes: '',
            timeSheetDayItemDescriptionId: '',
            toTime: '',
          }]
        },
        day5: {
          date: '',
          day: '',
          totalDuration: '',
          timeSheetDayItemDescriptions: [{
            fromTime: '',
            hours: '',
            notes: '',
            timeSheetDayItemDescriptionId: '',
            toTime: '',
          }]
        },
        day6: {
          date: '',
          day: '',
          totalDuration: '',
          timeSheetDayItemDescriptions: [{
            fromTime: '',
            hours: '',
            notes: '',
            timeSheetDayItemDescriptionId: '',
            toTime: '',
          }]
        },
      }
    ]
  }
  timesheetTemplate = [];
  private newAttribute: any = {};
  projectTaskArr = [];
  timeSheetLineItem: FormGroup;
  descriptionLineItem: FormGroup;
  startDate: any;
  endDate: any;
  dateIndex: any;
  @ViewChild('myCalendar') datePicker;
  @ViewChildren(MdePopoverTrigger) trigger: QueryList<MdePopoverTrigger>;
  // @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;
  employeesList = [];
  selectedEmployee: any;
  displayDateInCell: any;
  constructor(private serviceApi: ApiCommonService, private fb: FormBuilder, private atp: AmazingTimePickerService) {
    this.isSubmitted = false;
    this.timeSheetLineItem = this.fb.group({
      empCode: ["", Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      timeSheetApprovalStatus: [''],
      timeSheetId: [''],
      totalDeviationHours: [''],
      totalHours: ['00:00'],
      workWeekHours: [''],
      totalDay0Hours: [''],
      totalDay1Hours: [''],
      totalDay2Hours: [''],
      totalDay3Hours: [''],
      totalDay4Hours: [''],
      totalDay5Hours: [''],
      totalDay6Hours: [''],
      timeSheetLineResVOS: this.fb.array([])
    });

    this.descriptionLineItem = this.fb.group({
      date: [''],
      day: [''],
      totalDayHours: [''],
      timeSheetDayItemId: [''],
      timeSheetDayItemDescriptions: this.fb.array([this.getDescriptionFormArray()])
    });
    this.setCurrentDate('default');
    this.getEmployeesList();
    this.timeSheetLineItem.controls.fromDate.setValue(moment(this.values[0]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.toDate.setValue(moment(this.values[1]).format('YYYY-MM-DD'));
    this.setLines();


    this.getProjectAndTask();
    // this.getTimeSheet();
  }
  getEmployeesList() {
    this.employeesList = [];
    this.serviceApi.get("/v1/timesheets/admin/employees").subscribe(res => {
      res.forEach(element => {
        this.employeesList = [...this.employeesList, {
          "value": element.split("-")[1].trim(),
          "viewValue": element.split("-")[0].trim()
        }];
      });
    }, (err) => {

    }, () => {
      if (this.employeesList.length > 0) {
        this.selectedEmployee = this.employeesList[0].value
        this.timeSheetLineItem.controls.empCode.setValue(this.employeesList[0].value);
        this.getTimeSheetTemplate();
      }

    });
  }
  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    },
      {
        type: 'success',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }
  warningNotification(warningMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'error',
      message: warningMessage,
    },
      {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

  closeCalendar() {
    this.datePicker.overlayVisible = false;
  }
  selectEmployee() {
    console.log(this.selectedEmployee);
    this.timeSheetLineItem.controls.empCode.setValue(this.selectedEmployee);
    this.timeSheetLineItem.controls.timeSheetApprovalStatus.setValue('');
    this.timeSheetLineItem.controls.totalDay0Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay1Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay2Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay3Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay4Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay5Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay6Hours.setValue('');
    this.getTimeSheetTemplate();
    this.getProjectAndTask();
    this.getTimeSheet();
    this.isSubmitted = false;
    this.timeSheetLineItem.controls.workWeekHours.setValue(this.timesheetTemplate['hoursForWorkWeek']);
  }

  setCurrentDate(event: any) {
    this.dateIndex = 0;

    this.startDate = new Date(moment().startOf("isoWeek").subtract('days', 1).toDate());

    this.endDate = new Date(moment().endOf("isoWeek").subtract('days', 1).toDate());

    this.values[0] = this.startDate;
    this.values[1] = this.endDate;
    const control = this.timeSheetLineItem.get("timeSheetLineResVOS") as FormArray;
    for (let i = control.length - 1; i >= 0; i--) {
      control.controls[i].value.fromDate = moment(this.values[0]).format('YYYY-MM-DD');
      control.controls[i].value.toDate = moment(this.values[1]).format('YYYY-MM-DD');
    }

    this.day0 = moment(this.values[0]);
    this.day1 = moment(this.values[0]).add(1, 'days');
    this.day2 = moment(this.values[0]).add(2, 'days');
    this.day3 = moment(this.values[0]).add(3, 'days');
    this.day4 = moment(this.values[0]).add(4, 'days');
    this.day5 = moment(this.values[0]).add(5, 'days');
    this.day6 = moment(this.values[0]).add(6, 'days');
    this.timeSheetLineItem.controls.fromDate.setValue(moment(this.values[0]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.toDate.setValue(moment(this.values[1]).format('YYYY-MM-DD'));
    if (event == 'click') {
      this.timeSheetLineItem.controls.totalDay0Hours.setValue('');
      this.timeSheetLineItem.controls.totalDay1Hours.setValue('');
      this.timeSheetLineItem.controls.totalDay2Hours.setValue('');
      this.timeSheetLineItem.controls.totalDay3Hours.setValue('');
      this.timeSheetLineItem.controls.totalDay4Hours.setValue('');
      this.timeSheetLineItem.controls.totalDay5Hours.setValue('');
      this.timeSheetLineItem.controls.totalDay6Hours.setValue('');
      this.timeSheetLineItem.controls.timeSheetApprovalStatus.setValue('');
      this.getTimeSheet();
      this.timeSheetLineItem.controls.workWeekHours.setValue(this.timesheetTemplate['hoursForWorkWeek']);
    }
    this.isSubmitted = false;

  }

  nextStartDateAndEndDate() {
    this.dateIndex = this.dateIndex + 1;
    var today = moment();
    var daystoSunday = 0 - (today.isoWeekday()) + (7 * this.dateIndex);
    var nextSunday = today.add('days', daystoSunday);
    this.values[0] = nextSunday.toDate();
    this.values[1] = nextSunday.add('days', 6).toDate();
    const control = this.timeSheetLineItem.get("timeSheetLineResVOS") as FormArray;
    for (let i = control.length - 1; i >= 0; i--) {
      control.controls[i].value.fromDate = moment(this.values[0]).format('YYYY-MM-DD');
      control.controls[i].value.toDate = moment(this.values[1]).format('YYYY-MM-DD');
    }

    this.day0 = moment(this.values[0]);
    this.day1 = moment(this.values[0]).add(1, 'days');
    this.day2 = moment(this.values[0]).add(2, 'days');
    this.day3 = moment(this.values[0]).add(3, 'days');
    this.day4 = moment(this.values[0]).add(4, 'days');
    this.day5 = moment(this.values[0]).add(5, 'days');
    this.day6 = moment(this.values[0]).add(6, 'days');
    this.timeSheetLineItem.controls.fromDate.setValue(moment(this.values[0]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.toDate.setValue(moment(this.values[1]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.timeSheetApprovalStatus.setValue('');
    this.timeSheetLineItem.controls.totalDay0Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay1Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay2Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay3Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay4Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay5Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay6Hours.setValue('');
    this.getTimeSheet();
    this.timeSheetLineItem.controls.workWeekHours.setValue(this.timesheetTemplate['hoursForWorkWeek']);
    this.isSubmitted = false;
  }

  previousStartDateAndEndDate() {
    this.dateIndex = this.dateIndex - 1;
    var today = moment();
    var daystoSunday = 0 - (today.isoWeekday()) + (7 * this.dateIndex);
    var nextSunday = today.add('days', daystoSunday);
    this.values[0] = nextSunday.toDate();
    this.values[1] = nextSunday.add('days', 6).toDate();
    const control = this.timeSheetLineItem.get("timeSheetLineResVOS") as FormArray;
    for (let i = control.length - 1; i >= 0; i--) {
      control.controls[i].value.fromDate = moment(this.values[0]).format('YYYY-MM-DD');
      control.controls[i].value.toDate = moment(this.values[1]).format('YYYY-MM-DD');
    }

    this.day0 = moment(this.values[0]);
    this.day1 = moment(this.values[0]).add(1, 'days');
    this.day2 = moment(this.values[0]).add(2, 'days');
    this.day3 = moment(this.values[0]).add(3, 'days');
    this.day4 = moment(this.values[0]).add(4, 'days');
    this.day5 = moment(this.values[0]).add(5, 'days');
    this.day6 = moment(this.values[0]).add(6, 'days');
    this.timeSheetLineItem.controls.fromDate.setValue(moment(this.values[0]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.toDate.setValue(moment(this.values[1]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.totalDay0Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay1Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay2Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay3Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay4Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay5Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay6Hours.setValue('');
    this.timeSheetLineItem.controls.timeSheetApprovalStatus.setValue('');
    this.getTimeSheet();
    this.timeSheetLineItem.controls.workWeekHours.setValue(this.timesheetTemplate['hoursForWorkWeek']);
    this.isSubmitted = false;
  }

  getDateRange(evt) {
    console.log(evt);
    const start = new Date(evt);
    start.setDate(start.getDate() - start.getDay());
    this.values[0] = new Date(start);
    console.log(this.values[0])
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    this.values[1] = new Date(end);
    console.log(this.values[1])
    var selectedDate = moment(this.values[0]);
    var currentDate = moment(this.startDate);
    var diff = selectedDate.diff(currentDate, 'days') //
    this.dateIndex = diff / 7;
    this.startDate = this.values[0].toDateString();
    this.endDate = this.values[1].toDateString();
    const control = this.timeSheetLineItem.get("timeSheetLineResVOS") as FormArray;
    for (let i = control.length - 1; i >= 0; i--) {
      control.controls[i].value.fromDate = moment(this.values[0]).format('YYYY-MM-DD');
      control.controls[i].value.toDate = moment(this.values[1]).format('YYYY-MM-DD');
    }

    this.day0 = moment(this.values[0]);
    this.day1 = moment(this.values[0]).add(1, 'days');
    this.day2 = moment(this.values[0]).add(2, 'days');
    this.day3 = moment(this.values[0]).add(3, 'days');
    this.day4 = moment(this.values[0]).add(4, 'days');
    this.day5 = moment(this.values[0]).add(5, 'days');
    this.day6 = moment(this.values[0]).add(6, 'days');
    this.timeSheetLineItem.controls.fromDate.setValue(moment(this.values[0]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.toDate.setValue(moment(this.values[1]).format('YYYY-MM-DD'));
    this.timeSheetLineItem.controls.totalDay0Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay1Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay2Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay3Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay4Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay5Hours.setValue('');
    this.timeSheetLineItem.controls.totalDay6Hours.setValue('');
    this.timeSheetLineItem.controls.timeSheetApprovalStatus.setValue('');
    this.getTimeSheet();
    this.timeSheetLineItem.controls.workWeekHours.setValue(this.timesheetTemplate['hoursForWorkWeek']);
    this.isSubmitted = false;
  }
  addDescription(line: any, index: any, day: any) {
    console.log(this.trigger.toArray());
    if (this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != '' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'DRAFT' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'LEVEL_1_REJECTED' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'LEVEL_2_REJECTED') {
      return;
    }
    // this.trigger.togglePopover();
    console.log(index + "-" + day);
    console.log(line.controls);
    this.selectedIndex = index;
    this.selectedDay = day;
    if (this.selectedDay == 'day0') {
      this.displayDateInCell = this.day0.format('ddd').toString() + ",   " + this.day0.format("MMM") + " " + this.day0.format('D')
      this.trigger.toArray()[7 * index + 0].togglePopover();
    }
    if (this.selectedDay == 'day1') {
      this.displayDateInCell = this.day1.format('ddd').toString() + ",   " + this.day1.format("MMM") + " " + this.day1.format('D')
      this.trigger.toArray()[7 * index + 1].togglePopover();
    }
    if (this.selectedDay == 'day2') {
      this.displayDateInCell = this.day2.format('ddd').toString() + ",   " + this.day2.format("MMM") + " " + this.day2.format('D')
      this.trigger.toArray()[7 * index + 2].togglePopover();
    }
    if (this.selectedDay == 'day3') {
      this.displayDateInCell = this.day3.format('ddd').toString() + ",   " + this.day3.format("MMM") + " " + this.day3.format('D')
      this.trigger.toArray()[7 * index + 3].togglePopover();
    }
    if (this.selectedDay == 'day4') {
      this.displayDateInCell = this.day4.format('ddd').toString() + ",   " + this.day4.format("MMM") + " " + this.day4.format('D')
      this.trigger.toArray()[7 * index + 4].togglePopover();
    }
    if (this.selectedDay == 'day5') {
      this.displayDateInCell = this.day5.format('ddd').toString() + ",   " + this.day5.format("MMM") + " " + this.day5.format('D')
      this.trigger.toArray()[7 * index + 5].togglePopover();
    }
    if (this.selectedDay == 'day6') {
      this.displayDateInCell = this.day6.format('ddd').toString() + ",   " + this.day6.format("MMM") + " " + this.day6.format('D')
      this.trigger.toArray()[7 * index + 6].togglePopover();
    }
    const control = <FormArray>this.descriptionLineItem.controls['timeSheetDayItemDescriptions'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay] != null) {
      var temp = this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay];
      this.descriptionLineItem.controls.date.setValue(temp.date);
      this.descriptionLineItem.controls.day.setValue(temp.day);
      this.descriptionLineItem.controls.timeSheetDayItemId.setValue(temp.timeSheetDayItemId);
      this.descriptionLineItem.controls.totalDayHours.setValue(temp.totalDayHours);
      const formArray = new FormArray([]);
      let control = <FormArray>this.descriptionLineItem.controls.timeSheetDayItemDescriptions;
      for (let x of temp.timeSheetDayItemDescriptions) {
        control.push(this.fb.group({
          fromTime: x.fromTime,
          toTime: x.toTime,
          hours: x.hours,
          notes: x.notes,
          timeSheetDayItemDescriptionId: x.timeSheetDayItemDescriptionId,
        }));
      }
    } else {
      this.descriptionLineItem = this.fb.group({
        date: [''],
        day: [''],
        totalDayHours: [''],
        timeSheetDayItemId: [''],
        timeSheetDayItemDescriptions: this.fb.array([this.getDescriptionFormArray()])
      });
    }
  }
  openTimePicker(event: any, type: any, index: any) {
    console.log(type + "--" + index);
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      if (type === 'toTime') {
        this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].toTime.setValue(time);
      } else {
        this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].fromTime.setValue(time);
      }
      var toTime = this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].toTime.value;
      var fromTime = this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].fromTime.value;
      if (toTime != "" && fromTime != "") {
        if (moment(toTime, 'HH:mm').isBefore(moment(fromTime, 'HH:mm'))) {
          this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].toTime.setValue("");
          this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].fromTime.setValue("");
          this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].hours.setValue("");
          this.warningNotification("From Time cannot exceed To Time.");
          return;
        }
      }
      if (toTime != "" && fromTime != "") {
        let diff = moment(toTime, 'HH:mm').diff(moment(fromTime, 'HH:mm'));
        var duration = moment.duration(diff);
        this.descriptionLineItem.controls.timeSheetDayItemDescriptions['controls'][index]['controls'].hours.setValue([(Math.floor(duration.asHours()).toString().length < 2) ? "0" + Math.floor(duration.asHours()) : Math.floor(duration.asHours()), (duration.minutes().toString().length < 2) ? "0" + duration.minutes() : duration.minutes()].join(':'));
      }
    });

  }

  insertNewDescription() {
    let control = <FormArray>this.descriptionLineItem.controls.timeSheetDayItemDescriptions;
    control.push(this.fb.group({
      fromTime: [''],
      toTime: [''],
      hours: [''],
      notes: [''],
      timeSheetDayItemDescriptionId: ['']
    }));
  }

  getDescriptionFormArray() {
    return this.fb.group({
      fromTime: [''],
      toTime: [''],
      hours: [''],
      notes: [''],
      timeSheetDayItemDescriptionId: ['']
    });
  }

  deleteDescription(index: any) {
    const line = this.descriptionLineItem.get('timeSheetDayItemDescriptions') as FormArray;
    line.removeAt(index);
  }
  saveDescription() {
    const timeSheetDayItemDescriptionsControl = <FormArray>this.descriptionLineItem.controls['timeSheetDayItemDescriptions'];
    if (this.timesheetTemplate['timeCaptureType'] == 'TIMEWISE') {
      for (let i = timeSheetDayItemDescriptionsControl.length - 1; i >= 0; i--) {
        timeSheetDayItemDescriptionsControl.controls[i]['controls'].fromTime.setValidators(Validators.required)
        timeSheetDayItemDescriptionsControl.controls[i]['controls'].toTime.setValidators(Validators.required)
        timeSheetDayItemDescriptionsControl.controls[i]['controls'].fromTime.updateValueAndValidity()
        timeSheetDayItemDescriptionsControl.controls[i]['controls'].toTime.updateValueAndValidity()
      }
    } else {
      for (let i = timeSheetDayItemDescriptionsControl.length - 1; i >= 0; i--) {
        if (!moment(timeSheetDayItemDescriptionsControl.controls[i]['controls'].hours.value, "HH:mm", true).isValid()) {
          this.warningNotification("Invalid Duration format, Correct format is 'HH:mm'");
          return;
        }
        timeSheetDayItemDescriptionsControl.controls[i]['controls'].hours.setValidators(Validators.required)
        timeSheetDayItemDescriptionsControl.controls[i]['controls'].hours.updateValueAndValidity()
      }
    }
    if ((!this.descriptionLineItem.valid) || (timeSheetDayItemDescriptionsControl.length == 0)) {
      return;
    }
    var temp = this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex];
    var arrayControl = this.descriptionLineItem.value;
    const sum = arrayControl.timeSheetDayItemDescriptions.reduce((acc, time) => acc.add(moment.duration(time.hours)), moment.duration());
    var totalSum = [(Math.floor(sum.asHours()).toString().length < 2) ? "0" + Math.floor(sum.asHours()) : Math.floor(sum.asHours()), (sum.minutes().toString().length < 2) ? "0" + sum.minutes() : sum.minutes()].join(':');
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay] = arrayControl;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].totalDayHours = totalSum;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'] = moment.duration("00:00");
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day0'] != null) {

      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'] = moment.duration(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day0'].totalDayHours);
    }
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day1'] != null) {
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].add(moment.duration(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day1'].totalDayHours));

    }
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day2'] != null) {
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].add(moment.duration(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day2'].totalDayHours));

    }
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day3'] != null) {
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].add(moment.duration(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day3'].totalDayHours));

    }
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day4'] != null) {
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].add(moment.duration(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day4'].totalDayHours));

    }
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day5'] != null) {
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].add(moment.duration(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day5'].totalDayHours));

    }
    if (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day6'] != null) {
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].add(moment.duration(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['day6'].totalDayHours));
    }

    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'] = ([(Math.floor(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].asHours()).toString().length < 2) ? "0" + Math.floor(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].asHours()) : Math.floor(this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].asHours()), (this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].minutes().toString().length < 2) ? "0" + this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].minutes() : this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex]['totalHours'].minutes()].join(':'));
    const control = <FormArray>this.timeSheetLineItem.controls['timeSheetLineResVOS'];
    if (this.selectedDay == 'day0') {
      this.trigger.toArray()[7 * this.selectedIndex + 0].togglePopover();
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].date = this.day0.format('YYYY-MM-DD')
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].day = this.day0.format('dddd');
      var day0Sum = moment.duration("00:00");
      for (let i = control.length - 1; i >= 0; i--) {
        if (control.value[i]['day0'] != null)
          day0Sum.add(moment.duration(control.value[i]['day0'].totalDayHours));
      }
      this.timeSheetLineItem.controls.totalDay0Hours.setValue([(Math.floor(day0Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day0Sum.asHours()) : Math.floor(day0Sum.asHours()), (day0Sum.minutes().toString().length < 2) ? "0" + day0Sum.minutes() : day0Sum.minutes()].join(':'));
    }
    if (this.selectedDay == 'day1') {
      this.trigger.toArray()[7 * this.selectedIndex + 1].togglePopover();
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].date = this.day1.format('YYYY-MM-DD')
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].day = this.day1.format('dddd');
      var day1Sum = moment.duration("00:00");
      for (let i = control.length - 1; i >= 0; i--) {
        if (control.value[i]['day1'] != null)
          day1Sum.add(moment.duration(control.value[i]['day1'].totalDayHours));
      }
      this.timeSheetLineItem.controls.totalDay1Hours.setValue([(Math.floor(day1Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day1Sum.asHours()) : Math.floor(day1Sum.asHours()), (day1Sum.minutes().toString().length < 2) ? "0" + day1Sum.minutes() : day1Sum.minutes()].join(':'));
    }
    if (this.selectedDay == 'day2') {
      this.trigger.toArray()[7 * this.selectedIndex + 2].togglePopover();
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].date = this.day2.format('YYYY-MM-DD')
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].day = this.day2.format('dddd');
      var day2Sum = moment.duration("00:00");
      for (let i = control.length - 1; i >= 0; i--) {
        if (control.value[i]['day2'] != null)
          day2Sum.add(moment.duration(control.value[i]['day2'].totalDayHours));
      }
      this.timeSheetLineItem.controls.totalDay2Hours.setValue([(Math.floor(day2Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day2Sum.asHours()) : Math.floor(day2Sum.asHours()), (day2Sum.minutes().toString().length < 2) ? "0" + day2Sum.minutes() : day2Sum.minutes()].join(':'));
    }
    if (this.selectedDay == 'day3') {
      this.trigger.toArray()[7 * this.selectedIndex + 3].togglePopover();
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].date = this.day3.format('YYYY-MM-DD')
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].day = this.day3.format('dddd');
      var day3Sum = moment.duration("00:00");
      for (let i = control.length - 1; i >= 0; i--) {
        if (control.value[i]['day3'] != null)
          day3Sum.add(moment.duration(control.value[i]['day3'].totalDayHours));
      }

      this.timeSheetLineItem.controls.totalDay3Hours.setValue([(Math.floor(day3Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day3Sum.asHours()) : Math.floor(day3Sum.asHours()), (day3Sum.minutes().toString().length < 2) ? "0" + day3Sum.minutes() : day3Sum.minutes()].join(':'));
    }
    if (this.selectedDay == 'day4') {
      this.trigger.toArray()[7 * this.selectedIndex + 4].togglePopover();
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].date = this.day4.format('YYYY-MM-DD')
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].day = this.day4.format('dddd');
      var day4Sum = moment.duration("00:00");
      for (let i = control.length - 1; i >= 0; i--) {
        if (control.value[i]['day4'] != null)
          day4Sum.add(moment.duration(control.value[i]['day4'].totalDayHours));
      }
      this.timeSheetLineItem.controls.totalDay4Hours.setValue([(Math.floor(day4Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day4Sum.asHours()) : Math.floor(day4Sum.asHours()), (day4Sum.minutes().toString().length < 2) ? "0" + day4Sum.minutes() : day4Sum.minutes()].join(':'));
    }
    if (this.selectedDay == 'day5') {
      this.trigger.toArray()[7 * this.selectedIndex + 5].togglePopover();
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].date = this.day5.format('YYYY-MM-DD')
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].day = this.day5.format('dddd');
      var day5Sum = moment.duration("00:00");
      for (let i = control.length - 1; i >= 0; i--) {
        if (control.value[i]['day5'] != null)
          day5Sum.add(moment.duration(control.value[i]['day5'].totalDayHours));
      }
      this.timeSheetLineItem.controls.totalDay5Hours.setValue([(Math.floor(day5Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day5Sum.asHours()) : Math.floor(day5Sum.asHours()), (day5Sum.minutes().toString().length < 2) ? "0" + day5Sum.minutes() : day5Sum.minutes()].join(':'));
    }
    if (this.selectedDay == 'day6') {
      this.trigger.toArray()[7 * this.selectedIndex + 6].togglePopover();
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].date = this.day6.format('YYYY-MM-DD')
      this.timeSheetLineItem.controls.timeSheetLineResVOS.value[this.selectedIndex][this.selectedDay].day = this.day6.format('dddd');
      var day6Sum = moment.duration("00:00");
      for (let i = control.length - 1; i >= 0; i--) {
        if (control.value[i]['day6'] != null)
          day6Sum.add(moment.duration(control.value[i]['day6'].totalDayHours));
      }
      this.timeSheetLineItem.controls.totalDay6Hours.setValue([(Math.floor(day6Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day6Sum.asHours()) : Math.floor(day6Sum.asHours()), (day6Sum.minutes().toString().length < 2) ? "0" + day6Sum.minutes() : day6Sum.minutes()].join(':'));
    }
    var totalWorkingHour = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      totalWorkingHour.add(moment.duration(control.value[i]['totalHours']));
    }
    this.timeSheetLineItem.controls.totalHours.setValue([(Math.floor(totalWorkingHour.asHours()).toString().length < 2) ? "0" + Math.floor(totalWorkingHour.asHours()) : Math.floor(totalWorkingHour.asHours()), (totalWorkingHour.minutes().toString().length < 2) ? "0" + totalWorkingHour.minutes() : totalWorkingHour.minutes()].join(':'));
    console.log(temp);
  }

  closePopover() {
    // this.trigger.togglePopover();
    switch (this.selectedDay) {
      case "day0": this.trigger.toArray()[7 * this.selectedIndex + 0].togglePopover(); break;
      case "day1": this.trigger.toArray()[7 * this.selectedIndex + 1].togglePopover(); break;
      case "day2": this.trigger.toArray()[7 * this.selectedIndex + 2].togglePopover(); break;
      case "day3": this.trigger.toArray()[7 * this.selectedIndex + 3].togglePopover(); break;
      case "day4": this.trigger.toArray()[7 * this.selectedIndex + 4].togglePopover(); break;
      case "day5": this.trigger.toArray()[7 * this.selectedIndex + 5].togglePopover(); break;
      case "day6": this.trigger.toArray()[7 * this.selectedIndex + 6].togglePopover(); break;
    }
  }

  calculateTotal() {
    const control = <FormArray>this.timeSheetLineItem.controls['timeSheetLineResVOS'];
    var day0Sum = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.value[i]['day0'] != null)
        day0Sum.add(moment.duration(control.value[i]['day0'].totalDayHours));
    }
    this.timeSheetLineItem.controls.totalDay0Hours.setValue([(Math.floor(day0Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day0Sum.asHours()) : Math.floor(day0Sum.asHours()), (day0Sum.minutes().toString().length < 2) ? "0" + day0Sum.minutes() : day0Sum.minutes()].join(':'));

    var day1Sum = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.value[i]['day1'] != null)
        day1Sum.add(moment.duration(control.value[i]['day1'].totalDayHours));
    }
    this.timeSheetLineItem.controls.totalDay1Hours.setValue([(Math.floor(day1Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day1Sum.asHours()) : Math.floor(day1Sum.asHours()), (day1Sum.minutes().toString().length < 2) ? "0" + day1Sum.minutes() : day1Sum.minutes()].join(':'));

    var day2Sum = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.value[i]['day2'] != null)
        day2Sum.add(moment.duration(control.value[i]['day2'].totalDayHours));
    }
    this.timeSheetLineItem.controls.totalDay2Hours.setValue([(Math.floor(day2Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day2Sum.asHours()) : Math.floor(day2Sum.asHours()), (day2Sum.minutes().toString().length < 2) ? "0" + day2Sum.minutes() : day2Sum.minutes()].join(':'));

    var day3Sum = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.value[i]['day3'] != null)
        day3Sum.add(moment.duration(control.value[i]['day3'].totalDayHours));
    }
    this.timeSheetLineItem.controls.totalDay3Hours.setValue([(Math.floor(day3Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day3Sum.asHours()) : Math.floor(day3Sum.asHours()), (day3Sum.minutes().toString().length < 2) ? "0" + day3Sum.minutes() : day3Sum.minutes()].join(':'));

    var day4Sum = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.value[i]['day4'] != null)
        day4Sum.add(moment.duration(control.value[i]['day4'].totalDayHours));
    }
    this.timeSheetLineItem.controls.totalDay4Hours.setValue([(Math.floor(day4Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day4Sum.asHours()) : Math.floor(day4Sum.asHours()), (day4Sum.minutes().toString().length < 2) ? "0" + day4Sum.minutes() : day4Sum.minutes()].join(':'));

    var day5Sum = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.value[i]['day5'] != null)
        day5Sum.add(moment.duration(control.value[i]['day5'].totalDayHours));
    }
    this.timeSheetLineItem.controls.totalDay5Hours.setValue([(Math.floor(day5Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day5Sum.asHours()) : Math.floor(day5Sum.asHours()), (day5Sum.minutes().toString().length < 2) ? "0" + day5Sum.minutes() : day5Sum.minutes()].join(':'));

    var day6Sum = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.value[i]['day6'] != null)
        day6Sum.add(moment.duration(control.value[i]['day6'].totalDayHours));
    }
    this.timeSheetLineItem.controls.totalDay6Hours.setValue([(Math.floor(day6Sum.asHours()).toString().length < 2) ? "0" + Math.floor(day6Sum.asHours()) : Math.floor(day6Sum.asHours()), (day6Sum.minutes().toString().length < 2) ? "0" + day6Sum.minutes() : day6Sum.minutes()].join(':'));
    var totalWorkingHour = moment.duration("00:00");
    for (let i = control.length - 1; i >= 0; i--) {
      totalWorkingHour.add(moment.duration(control.value[i]['totalHours']));
    }
    this.timeSheetLineItem.controls.totalHours.setValue([(Math.floor(totalWorkingHour.asHours()).toString().length < 2) ? "0" + Math.floor(totalWorkingHour.asHours()) : Math.floor(totalWorkingHour.asHours()), (totalWorkingHour.minutes().toString().length < 2) ? "0" + totalWorkingHour.minutes() : totalWorkingHour.minutes()].join(':'));

  }

  deleteLine(index: any) {
    if (this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != '' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'DRAFT' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'LEVEL_1_REJECTED' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'LEVEL_2_REJECTED') {
      return;
    }
    const line = this.timeSheetLineItem.get('timeSheetLineResVOS') as FormArray;
    line.removeAt(index);
    this.calculateTotal();
  }
  addNewLine(event: any) {
    if (this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != '' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'DRAFT' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'LEVEL_1_REJECTED' && this.timeSheetLineItem.controls.timeSheetApprovalStatus.value != 'LEVEL_2_REJECTED' && event == 'click') {
      return;
    }
    let control = <FormArray>this.timeSheetLineItem.controls.timeSheetLineResVOS;
    control.push(
      this.fb.group({
        projectName: [''],
        projectId: ['', Validators.required],
        taskId: ['', Validators.required],
        taskName: [''],
        totalHours: ['00:00'],
        timeSheetLineItemId: [''],
        day0: [null],
        day1: [null],
        day2: [null],
        day3: [null],
        day4: [null],
        day5: [null],
        day6: [null]
      })
    )
  }
  setLines() {
    let control = <FormArray>this.timeSheetLineItem.controls.timeSheetLineResVOS;
    this.data.timeSheetLineResVOS.forEach(x => {
      control.push(this.fb.group({
        projectName: [''],
        projectId: ['', Validators.required],
        taskId: ['', Validators.required],
        taskName: [''],
        totalHours: ['00:00'],
        timeSheetLineItemId: [''],
        day0: [null],
        day1: [null],
        day2: [null],
        day3: [null],
        day4: [null],
        day5: [null],
        day6: [null]
      }))
    })
  }

  setDescriptions(x, day: any) {
    let arr = new FormArray([])
    if (day == 'day0') {
      x.day0.forEach(y => {
        arr.push(this.fb.group({
          fromTime: [],
          toTime: [''],
          hours: [''],
          notes: [''],
          date: [''],
          timeSheetDayItemDescriptionId: ['']
        }))
      });
    }
    else if (day == 'day1') {
      x.day1.forEach(y => {
        arr.push(this.fb.group({
          fromTime: [],
          toTime: [''],
          hours: [''],
          notes: [''],
          date: [''],
          timeSheetDayItemDescriptionId: ['']
        }))
      });
    }
    else if (day == 'day2') {
      x.day2.forEach(y => {
        arr.push(this.fb.group({
          fromTime: [],
          toTime: [''],
          hours: [''],
          notes: [''],
          date: [''],
          timeSheetDayItemDescriptionId: ['']
        }))
      });
    }
    else if (day == 'day3') {
      x.day3.forEach(y => {
        arr.push(this.fb.group({
          fromTime: [],
          toTime: [''],
          hours: [''],
          notes: [''],
          date: [''],
          timeSheetDayItemDescriptionId: ['']
        }))
      });
    }
    else if (day == 'day4') {
      x.day4.forEach(y => {
        arr.push(this.fb.group({
          fromTime: [],
          toTime: [''],
          hours: [''],
          notes: [''],
          date: [''],
          timeSheetDayItemDescriptionId: ['']
        }))
      });
    }
    else if (day == 'day5') {
      x.day5.forEach(y => {
        arr.push(this.fb.group({
          fromTime: [],
          toTime: [''],
          hours: [''],
          notes: [''],
          date: [''],
          timeSheetDayItemDescriptionId: ['']
        }))
      });
    }
    else if (day == 'day6') {
      x.day6.forEach(y => {
        arr.push(this.fb.group({
          fromTime: [],
          toTime: [''],
          hours: [''],
          notes: [''],
          date: [''],
          timeSheetDayItemDescriptionId: ['']
        }))
      });
    }

    return arr;
  }

  ngOnInit() {
  }

  getTimeSheet() {
    const descriptioncontrol = <FormArray>this.descriptionLineItem.controls['timeSheetDayItemDescriptions'];
    for (let i = descriptioncontrol.length - 1; i >= 0; i--) {
      descriptioncontrol.removeAt(i);
    }
    this.insertNewDescription();
    this.timeSheetLineItem.controls.timeSheetId.reset();
    this.timeSheetLineItem.controls.totalHours.setValue("00:00");
    this.timeSheetLineItem.controls.workWeekHours.reset();
    const lineItemcontrol = <FormArray>this.timeSheetLineItem.controls['timeSheetLineResVOS'];
    for (let i = lineItemcontrol.length - 1; i >= 0; i--) {
      lineItemcontrol.removeAt(i);
    }
    if (this.selectedEmployee === undefined) {
      this.setLines();
      return;
    }

    this.serviceApi.get('/v1/timesheets/getall/' + this.selectedEmployee + "/" + this.timeSheetLineItem.controls.fromDate.value + "/" + this.timeSheetLineItem.controls.toDate.value).subscribe(res => {
      if (res.empCode != null && res.timeSheetLineResVOS != null) {
        res.timeSheetLineResVOS.forEach(addLine => this.addNewLine('default'));
        this.timeSheetLineItem.patchValue(res);
      } else {
        this.setLines();
      }

      // sdfds
      // this.timeSheetLineItem.setControl('timeSheetLineResVOS',  new FormControl(res.timeSheetLineResVOS));
    }, (err) => {

    }, () => {

    });
    this.getProjectAndTask();
  }

  addNewDescription(control: any) {
    console.log(control);
    control.push(
      this.fb.group({
        date: [''],
        day: [''],
        totalDayHours: [''],
        timeSheetDayItemId: [''],
        timeSheetDayItemDescriptions: this.fb.array([])
      }))
  }


  addNewTimeSheetEntity() {

  }

  getProjectAndTask() {
    this.projectTaskArr = []
    if (this.timeSheetLineItem.controls.empCode.value == "")
      return;
    this.serviceApi.get('/v1/timesheets/projecTaskList/' + this.timeSheetLineItem.controls.empCode.value  + "/" + this.timeSheetLineItem.controls.fromDate.value + "/" + this.timeSheetLineItem.controls.toDate.value).subscribe(res => {
      this.projectTaskArr = res;
    }, (err) => {

    }, () => {

    });
  }

  saveTimeSheet(type: any) {
    console.log(this.timeSheetLineItem.value);
    this.isSubmitted = true;
    const control = this.timeSheetLineItem.get("timeSheetLineResVOS") as FormArray;
    if (this.timeSheetLineItem.valid && control.length > 0) {
      this.timeSheetLineItem.controls.timeSheetApprovalStatus.setValue(type);
      this.serviceApi.post('/v1/timesheets/admin', this.timeSheetLineItem.value).subscribe(res => {
        this.successNotification(res.message);
      }, (err) => {

      }, () => {
        this.getTimeSheet();
      });
    } else {
      if (control.length == 0) {
        this.warningNotification("Please fill atleast one timesheet line");
      }
      Object.keys(this.timeSheetLineItem.controls).forEach(field => { // {1}
        const control = this.timeSheetLineItem.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }

  getTask(task: any, index: any) {
    const select = this.projectTaskArr.find(_ => _.projectId == task);
    if (select != undefined && select.Tasks.length == 1) {
      // var selectedTask = select.Tasks[0];
      // this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskId.setValue(selectedTask.taskId)
      // this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskName.setValue(selectedTask.taskName)
    }
    return select ? select.Tasks : select;
  }


  selectProject(index: any) {
    this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskId.setValue("")
    this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskName.setValue("")
    const select = this.projectTaskArr.find(_ => _.projectId == this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.projectId.value);
    if (select != undefined && select.Tasks.length > 0) {
      var selectedTask = select.Tasks[0];
      this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskId.setValue(selectedTask.taskId)
      this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskName.setValue(selectedTask.taskName)
    }
    var selectedProject = this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].projectId;
    console.log(selectedProject);
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day0 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day1 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day2 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day3 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day4 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day5 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day6 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].totalHours = "00:00";
    this.calculateTotal();
  }
  selectTask(index: any) {
    const select = this.projectTaskArr.find(_ => _.projectId == this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.projectId.value);
    if (select != undefined) {
      var selectedTask = select.Tasks.find(_ => _.taskId == this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskId.value);
      this.timeSheetLineItem.controls.timeSheetLineResVOS['controls'][index].controls.taskName.setValue(selectedTask.taskName)
    }
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day0 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day1 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day2 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day3 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day4 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day5 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].day6 = null;
    this.timeSheetLineItem.controls.timeSheetLineResVOS.value[index].totalHours = "00:00";
    this.calculateTotal();
  }

  getTimeSheetTemplate() {
    console.log(this.selectedEmployee);
    console.log(this.timeSheetLineItem.controls.empCode.value);
    this.timesheetTemplate = [];
    this.serviceApi.get("/v1/timesheets/template-assignment/" + this.timeSheetLineItem.controls.empCode.value).subscribe(res => {
      this.serviceApi.get("/v1/timesheets/template/" + res.templateId).subscribe(res => {
        this.timesheetTemplate = res;
      }, (err) => {

      }, () => {
        console.log(this.timesheetTemplate);
        this.timeSheetLineItem.controls.workWeekHours.setValue(this.timesheetTemplate['hoursForWorkWeek']);
        this.getDateRange(new Date());
      });
    }, (err) => {

    }, () => {

    })
  }


}
