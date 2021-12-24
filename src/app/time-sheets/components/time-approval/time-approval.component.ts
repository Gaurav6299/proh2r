import { Component, OnInit, Inject } from '@angular/core';
import { ApiCommonService } from '../../../services/api-common.service';
import * as moment from 'moment';
import { TitleCasePipe } from '@angular/common';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSort } from '@angular/material';
declare var $: any;
@Component({
  selector: 'app-time-approval',
  templateUrl: './time-approval.component.html',
  styleUrls: ['./time-approval.component.scss']
})
export class TimeApprovalComponent implements OnInit {
  values = []
  calendarStartDate: Date;
  calendarEndDate: Date;
  dateIndex: any;
  selectedMonthYear: any;
  timesheets = [];
  visibleTimesheets = [];
  day0: any;
  day1: any;
  day2: any;
  day3: any;
  day4: any;
  day5: any;
  day6: any;
  columns = [
    { field: 'empName', header: 'Account Member' },
    { field: 'empCode', header: 'Employee Code' },
    { field: 'workWeekHours', header: 'Work Week' },
    { field: 'day0', header: 'Sun' },
    { field: 'day1', header: 'Mon' },
    { field: 'day2', header: 'Tue' },
    { field: 'day3', header: 'Wed' },
    { field: 'day4', header: 'Thu' },
    { field: 'day5', header: 'Fri' },
    { field: 'day6', header: 'Sat' },
    { field: 'totalHours', header: 'Total' },
    { field: 'timeSheetApprovalStatus', header: 'Status' },
    { field: 'action', header: 'Actions' },
  ];
  monthList = [];
  statusFilter = [];
  constructor(private titlecasePipe: TitleCasePipe, private serviceApi: ApiCommonService, public dialog: MatDialog, ) {
    this.values[0] = new Date(moment().startOf('month').startOf("isoWeek").subtract('days', 1).toDate());
    this.values[1] = new Date(moment().startOf('month').endOf("isoWeek").subtract('days', 1).toDate());
    this.setColumnsName();
    this.getMonthList();
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
  changeColor(timeSheetApprovalStatus: any) {
    return timeSheetApprovalStatus === 'DRAFT' ? '#0084ff' : timeSheetApprovalStatus === 'APPROVED' ? '#008000' : timeSheetApprovalStatus === 'LEVEL_1_PENDING' ? '#ffa500' : timeSheetApprovalStatus === 'LEVEL_2_PENDING' ? '#ffa500' : timeSheetApprovalStatus === 'LEVEL_1_REJECTED' ? '#f44336' : timeSheetApprovalStatus === 'LEVEL_2_REJECTED' ? '#f44336' : timeSheetApprovalStatus === 'N/A' ? '#777777' : '';
  }
  ngOnInit() { }
  setColumnsName() {
    this.day0 = moment(this.values[0]);
    this.day1 = moment(this.values[0]).add(1, 'days');
    this.day2 = moment(this.values[0]).add(2, 'days');
    this.day3 = moment(this.values[0]).add(3, 'days');
    this.day4 = moment(this.values[0]).add(4, 'days');
    this.day5 = moment(this.values[0]).add(5, 'days');
    this.day6 = moment(this.values[0]).add(6, 'days');
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
    this.day0 = moment(this.values[0]);
    this.day1 = moment(this.values[0]).add(1, 'days');
    this.day2 = moment(this.values[0]).add(2, 'days');
    this.day3 = moment(this.values[0]).add(3, 'days');
    this.day4 = moment(this.values[0]).add(4, 'days');
    this.day5 = moment(this.values[0]).add(5, 'days');
    this.day6 = moment(this.values[0]).add(6, 'days');
    this.filterVisibleTimesheets();
  }


  getMonthList() {
    this.monthList = []
    this.serviceApi.get("/v1/attendance/attendanceRecords/attendanceMonthYearList").subscribe(res => {
      this.monthList = res;
    }, (err) => {

    }, () => {
      this.selectedMonthYear = this.monthList[6];
      const monthYear = this.selectedMonthYear.split('-');
      this.getTimesheets(this.selectedMonthYear);
      this.selectMonth();
    })
  }
  selectMonth() {
    this.calendarStartDate = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').startOf("isoWeek").subtract('days', 1).toDate());
    var calendarEndMoment = moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").endOf('month');
    this.calendarEndDate = new Date(calendarEndMoment.add(6 - calendarEndMoment.day(), 'days').toDate());
    console.log(this.calendarStartDate);
    console.log(this.calendarEndDate);
    this.values[0] = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').startOf("isoWeek").subtract('days', 1).toDate());
    this.values[1] = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').endOf("isoWeek").subtract('days', 1).toDate());
    this.getTimesheets(this.selectedMonthYear);
  }
  nextWeek() {
    var monthEndDate = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").endOf('month').toDate());
    var monthStartDate = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').toDate());
    var start = moment(this.values[0]);
    var end = moment(this.values[1]);
    var nextSunday = start.add('days', 7);
    if (!moment(nextSunday.toDate()).isBetween(monthStartDate, monthEndDate)) {
      return;
    }
    this.values[0] = nextSunday.toDate();
    this.values[1] = nextSunday.add('days', 6).toDate();
    this.filterVisibleTimesheets();
  }

  previousWeek() {
    var monthEndDate = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").endOf('month').toDate());
    var monthStartDate = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').toDate());
    var start = moment(this.values[0]);
    var end = moment(this.values[1]);
    var nextSunday = start.subtract('days', 7);
    var nextSaturday = end.subtract('days', 7);
    if (!(moment(nextSunday.toDate()).isBetween(monthStartDate, monthEndDate) || moment(nextSaturday.toDate()).isBetween(monthStartDate, monthEndDate))) {
      return;
    }
    this.values[0] = nextSunday.toDate();
    this.values[1] = nextSunday.add('days', 6).toDate();
    this.filterVisibleTimesheets();
  }

  getTimesheets(monthYear: any) {
    this.timesheets = [];
    this.serviceApi.get("/v1/timesheets/getall/admin/" + monthYear).subscribe(res => {
      this.statusFilter.push({})
      this.timesheets = res;
    }, (err) => {

    }, () => {
      this.filterVisibleTimesheets();

    });

  }

  filterVisibleTimesheets() {
    this.setColumnsName();
    this.statusFilter = [];
    this.visibleTimesheets = this.timesheets.filter(timesheet => {
      timesheet.empName = timesheet.empName.split("-")[0].trim();
      if (timesheet.timeSheetApprovalStatus != null) {
        if (timesheet.day0 != null) {
          timesheet.day0['timeSheetApprovalStatus'] = timesheet.timeSheetApprovalStatus
        }
        else {
          timesheet.day0 = { "timeSheetApprovalStatus": timesheet.timeSheetApprovalStatus }
        }
      }
      else {
        timesheet.day0 = { "timeSheetApprovalStatus": 'N/A' }
      }


      if (timesheet.timeSheetApprovalStatus != null) {
        if (timesheet.day1 != null) {
          timesheet.day1['timeSheetApprovalStatus'] = timesheet.timeSheetApprovalStatus
        }
        else {
          timesheet.day1 = { "timeSheetApprovalStatus": timesheet.timeSheetApprovalStatus }
        }
      }
      else {
        timesheet.day1 = { "timeSheetApprovalStatus": 'N/A' }
      }

      if (timesheet.timeSheetApprovalStatus != null) {
        if (timesheet.day2 != null) {
          timesheet.day2['timeSheetApprovalStatus'] = timesheet.timeSheetApprovalStatus
        }
        else {
          timesheet.day2 = { "timeSheetApprovalStatus": timesheet.timeSheetApprovalStatus }
        }
      }
      else {
        timesheet.day2 = { "timeSheetApprovalStatus": 'N/A' }
      }

      if (timesheet.timeSheetApprovalStatus != null) {
        if (timesheet.day3 != null) {
          timesheet.day3['timeSheetApprovalStatus'] = timesheet.timeSheetApprovalStatus
        }
        else {
          timesheet.day3 = { "timeSheetApprovalStatus": timesheet.timeSheetApprovalStatus }
        }
      }
      else {
        timesheet.day3 = { "timeSheetApprovalStatus": 'N/A' }
      }

      if (timesheet.timeSheetApprovalStatus != null) {
        if (timesheet.day4 != null) {
          timesheet.day4['timeSheetApprovalStatus'] = timesheet.timeSheetApprovalStatus
        }
        else {
          timesheet.day4 = { "timeSheetApprovalStatus": timesheet.timeSheetApprovalStatus }
        }
      }
      else {
        timesheet.day4 = { "timeSheetApprovalStatus": 'N/A' }
      }

      if (timesheet.timeSheetApprovalStatus != null) {
        if (timesheet.day5 != null) {
          timesheet.day5['timeSheetApprovalStatus'] = timesheet.timeSheetApprovalStatus
        }
        else {
          timesheet.day5 = { "timeSheetApprovalStatus": timesheet.timeSheetApprovalStatus }
        }
      }
      else {
        timesheet.day5 = { "timeSheetApprovalStatus": 'N/A' }
      }

      if (timesheet.timeSheetApprovalStatus != null) {
        if (timesheet.day6 != null) {
          timesheet.day6['timeSheetApprovalStatus'] = timesheet.timeSheetApprovalStatus
        }
        else {
          timesheet.day6 = { "timeSheetApprovalStatus": timesheet.timeSheetApprovalStatus }
        }
      }
      else {
        timesheet.day6 = { "timeSheetApprovalStatus": 'N/A' }
      }

      if ((timesheet.fromDate === moment(this.values[0]).format("YYYY-MM-DD")) && (timesheet.toDate === moment(this.values[1]).format("YYYY-MM-DD"))) {
        let found = this.statusFilter.filter(obj => {
          if (obj.value === timesheet.timeSheetApprovalStatus) {
            return true;
          }
          if (timesheet.timeSheetApprovalStatus == null) {
            return true;
          }
        })
        if (!found.length && timesheet.timeSheetApprovalStatus != null) {
          this.statusFilter.push({ label: timesheet.timeSheetApprovalStatus, value: timesheet.timeSheetApprovalStatus })
        }
        return true;
      } else {
        return false;
      }
    });
    console.log(this.visibleTimesheets);
  }

  openApproveRejectTimesheetDialog(action: any, data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(ApproveRejectTimesheetComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { timeSheetId: data.timeSheetId, action: action, fromDate: this.values[0], toDate: this.values[1], empCode: data.empCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);

            this.getMonthList();
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });

  }

  showTimesheetDescriptions(timesheetDescription: any) {
    console.log(timesheetDescription);
    if (timesheetDescription.timeSheetDayItemDescriptions == undefined) {
      return;
    }
    const dialogRef = this.dialog.open(ShowTimesheetDescriptionsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { timesheetDescription: timesheetDescription }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}



@Component({
  selector: 'app-approve-reject-timesheet',
  templateUrl: './approve-reject-dialog.component.html'
})
export class ApproveRejectTimesheetComponent implements OnInit {
  action: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<ApproveRejectTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }

  ngOnInit() {
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  approveReject() {
    var action;
    if (this.data.action == 'send reminder for ') {
      this.sendReminder();
      return;
    }
    switch (this.data.action) {
      case "approve": action = 'Approve'; break;
      case "reject": action = 'Reject'; break;
      // case "send reminder for ": action = 'Reminder'; break;
      case "cancel": action = 'Cancel'; break;
    }
    this.serviceApi.put('/v1/timesheets/admin/' + action + '/' + this.data.timeSheetId, {}).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );
  }

  sendReminder() {
    console.log(this.data);
    var body;
    if (this.data.timeSheetId != null) {
      body = {
        "empCode": null,
        "fromDate": null,
        "timeSheetId": this.data.timeSheetId,
        "toDate": null
      }
    } else {
      body = {
        "empCode": this.data.empCode,
        "fromDate": moment(this.data.fromDate).format("YYYY-MM-DD"),
        "timeSheetId": null,
        "toDate": moment(this.data.toDate).format("YYYY-MM-DD")
      }
    }
    console.log(body);
    this.serviceApi.put('/v1/timesheets/admin/reminder', body).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );


  }
}

@Component({
  selector: 'app-approve-reject-timesheet',
  templateUrl: './show-timesheet.component.html',
  styleUrls: ['./show-timesheet.component.scss']
})
export class ShowTimesheetDescriptionsComponent implements OnInit {
  action: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<ShowTimesheetDescriptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }

  ngOnInit() {
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

}
