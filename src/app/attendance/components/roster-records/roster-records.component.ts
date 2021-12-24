import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiCommonService } from '../../../../app/services/api-common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { FileValidator } from '../attendance-records/file-input.validator';
import { environment } from '../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-roster-records',
  templateUrl: './roster-records.component.html',
  styleUrls: ['./roster-records.component.scss']
})
export class RosterRecordsComponent implements OnInit {
  visibleRosters: any[];
  selectedMonthYear: any;
  action: any;
  notificationMsg: any;
  columns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'empCode', header: 'Employee Code' },
    { field: 'day0', header: 'Sun' },
    { field: 'day1', header: 'Mon' },
    { field: 'day2', header: 'Tue' },
    { field: 'day3', header: 'Wed' },
    { field: 'day4', header: 'Thu' },
    { field: 'day5', header: 'Fri' },
    { field: 'day6', header: 'Sat' },
  ];
  filterByEmp: SelectItem[] = [];
  rosters = [];
  values = [];
  shifts = [];
  bulkAction = [];
  selectedDaysList = [];
  calendarStartDate: Date;
  calendarEndDate: Date;
  dateIndex: any;
  monthList = [];
  multiSelect: Boolean = false;
  day0: any;
  day1: any;
  day2: any;
  day3: any;
  day4: any;
  day5: any;
  day6: any;
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog) {
    this.values[0] = new Date(moment().startOf('month').startOf("isoWeek").subtract('days', 1).toDate());
    this.values[1] = new Date(moment().startOf('month').endOf("isoWeek").subtract('days', 1).toDate());
    this.setColumnsName();
    this.getMonthYearRecord();
    this.getAllShifts();
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


  onMultiSelectChange() {
    if (!this.multiSelect) {
      this.bulkAction.forEach(element2 => {
        $('.' + element2.sectionClass).removeClass('selectClass');
      });
      this.bulkAction = []
      this.selectedDaysList = [];
    }
  }

  getRostersRecord() {
    this.rosters = [];
    this.serviceApi.get("/v1/attendance/rosters/" + this.selectedMonthYear).subscribe(
      res => {
        res.forEach(element => {
          if (!this.filterByEmp.some(employeeName => employeeName.label === element.employeeName)) {
            this.filterByEmp.push({
              label: element.employeeName, value: element.employeeName
            });
          }
        });
        this.rosters = res;
      }, (err) => {

      }, () => {
        this.filterVisibleRosterRecords();
      }
    );
  }

  getAllShifts() {
    this.shifts = [];
    this.serviceApi.get("/v1/attendance/settings/shift/").subscribe(
      res => {
        this.shifts = res;
      }, (err) => {

      }, () => {
      }
    );
  }
  bulkUploadRosterRecords() {
    let dialogRef = this.dialog.open(BulkUploadRosterRecordsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { monthList: this.monthList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getRostersRecord();
        } else if (result.status === 'Error') {
          this.notificationMsg = result.message;
        }
      }
    });
  }

  selectRoster(record: any, className: any) {
    console.log(record);
    console.log(className);
    var day = record.date;
    if (this.multiSelect) {
      if ($('.' + className).hasClass('selectClass')) {
        $('.' + className).removeClass('selectClass');
        this.bulkAction = this.bulkAction.filter(function (item) {
          return item.sectionClass != className;
        })
        this.selectedDaysList = this.selectedDaysList.filter(function (item) {
          return item.date !== day;
        })
      }
      else {
        $('.' + className).addClass('selectClass');
        this.bulkAction.push({ sectionClass: className, hasSelectClass: true });
        this.selectedDaysList.push({
          "date": day,
          "empCode": record.empCode,
          shiftId: record.shiftId,
          rosterId: record.rosterId
        });

      }
    }
    else if (!this.multiSelect) {
      let dialogRef = this.dialog.open(BulkRosterComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          empCode: record.empCode,
          shifts: this.shifts,
          date: record.date,
          shiftId: record.shiftId,
          rosterId: record.rosterId,
          frequency: record.frequency,
          type: 'single'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.successNotification(result.message);
              this.getRostersRecord();
              this.bulkAction = []
              this.selectedDaysList = [];
            }
          }
        }
      });
    }
  }

  selectBulkRosterDialog() {
    console.log(this.selectedDaysList);
    if (this.selectedDaysList.length !== 0) {
      let dialogRef = this.dialog.open(BulkRosterComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          shifts: this.shifts,
          selectedDaysList: this.selectedDaysList,
          type: 'bulk'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.successNotification(result.message);
              this.getRostersRecord();
              this.selectedDaysList = [];
            }
          }
        }
      });
    }
    else {
      this.warningNotification('Please Select Roster Records First');
    }
  }

  changeColor(record: any) {
    if (record == undefined) {
      return;
    }
    return record.shift === 'NA' ? '#777777' : '#0084ff';
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
    this.filterVisibleRosterRecords();
  }
  ngOnInit() {
  }

  setColumnsName() {
    this.day0 = moment(this.values[0]);
    this.day1 = moment(this.values[0]).add(1, 'days');
    this.day2 = moment(this.values[0]).add(2, 'days');
    this.day3 = moment(this.values[0]).add(3, 'days');
    this.day4 = moment(this.values[0]).add(4, 'days');
    this.day5 = moment(this.values[0]).add(5, 'days');
    this.day6 = moment(this.values[0]).add(6, 'days');
  }

  getMonthYearRecord() {
    this.monthList = [];
    this.serviceApi.get("/v1/attendance/attendanceRecords/attendanceMonthYearList").subscribe(
      res => {
        res != null ? res.forEach(element => {
          this.monthList = [...this.monthList, element]
        }) : this.monthList = [];
      }, (err) => {

      }, () => {
        this.selectedMonthYear = this.monthList[6];
        this.selectMonth();
        this.getRostersRecord();
      }
    );
  }
  selectMonth() {
    this.calendarStartDate = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').startOf("isoWeek").subtract('days', 1).toDate());
    var calendarEndMoment = moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").endOf('month');
    this.calendarEndDate = new Date(calendarEndMoment.add(6 - calendarEndMoment.day(), 'days').toDate());
    console.log(this.calendarStartDate);
    console.log(this.calendarEndDate);
    this.values[0] = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').startOf("isoWeek").subtract('days', 1).toDate());
    this.values[1] = new Date(moment(this.selectedMonthYear.split("-")[1] + "-" + this.selectedMonthYear.split("-")[0], "YYYY-MMM").startOf('month').endOf("isoWeek").subtract('days', 1).toDate());
    this.getRostersRecord();
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
    this.filterVisibleRosterRecords();
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
    this.filterVisibleRosterRecords();
  }

  filterVisibleRosterRecords() {
    this.setColumnsName();
    this.visibleRosters = [];
    this.rosters.forEach((roster, j) => {
      this.visibleRosters[j] = {};
      this.visibleRosters[j].empCode = roster.empCode,
        this.visibleRosters[j].employeeName = roster.employeeName,

        roster.monthlyRosterVO.forEach(record => {
          if (moment(record.date).isSame(moment(this.values[0]).format("YYYY-MM-DD"))) {
            this.visibleRosters[j].day0 = {
              "day0": record.date, "shift": record.shift, "empCode": roster.empCode, "date": record.date, "rosterId": record.rosterId, "frequency": record.frequency, "shiftId": record.shiftId
            }
          }
          if (moment(record.date).isSame(moment(this.values[0]).add(1, 'days').format("YYYY-MM-DD"))) {
            this.visibleRosters[j].day1 = {
              "day1": record.date, "shift": record.shift, "empCode": roster.empCode, "date": record.date, "rosterId": record.rosterId, "frequency": record.frequency, "shiftId": record.shiftId
            }
          }
          if (moment(record.date).isSame(moment(this.values[0]).add(2, 'days').format("YYYY-MM-DD"))) {
            this.visibleRosters[j].day2 = {
              "day2": record.date, "shift": record.shift, "empCode": roster.empCode, "date": record.date, "rosterId": record.rosterId, "frequency": record.frequency, "shiftId": record.shiftId
            }
          }
          if (moment(record.date).isSame(moment(this.values[0]).add(3, 'days').format("YYYY-MM-DD"))) {
            this.visibleRosters[j].day3 = {
              "day3": record.date, "shift": record.shift, "empCode": roster.empCode, "date": record.date, "rosterId": record.rosterId, "frequency": record.frequency, "shiftId": record.shiftId
            }
          }
          if (moment(record.date).isSame(moment(this.values[0]).add(4, 'days').format("YYYY-MM-DD"))) {
            this.visibleRosters[j].day4 = {
              "day4": record.date, "shift": record.shift, "empCode": roster.empCode, "date": record.date, "rosterId": record.rosterId, "frequency": record.frequency, "shiftId": record.shiftId
            }
          }
          if (moment(record.date).isSame(moment(this.values[0]).add(5, 'days').format("YYYY-MM-DD"))) {
            this.visibleRosters[j].day5 = {
              "day5": record.date, "shift": record.shift, "empCode": roster.empCode, "date": record.date, "rosterId": record.rosterId, "frequency": record.frequency, "shiftId": record.shiftId
            }
          }
          if (moment(record.date).isSame(moment(this.values[0]).add(6, 'days').format("YYYY-MM-DD"))) {
            this.visibleRosters[j].day6 = {
              "day6": record.date, "shift": record.shift, "empCode": roster.empCode, "date": record.date, "rosterId": record.rosterId, "frequency": record.frequency, "shiftId": record.shiftId
            }
          }

        })
    });

  }

}
@Component({
  selector: 'app-bulk-roster-dialog',
  templateUrl: 'bulk-roster.component.html',
  styleUrls: ['./roster-records.component.scss']
})
export class BulkRosterComponent {
  shifts = [];
  action: any;
  error: any;
  shiftId: any;
  public rosterAssignment: FormGroup;
  header: any;
  frequency = [
    { value: "DAILY", viewValue: "Daily" },
    { value: "WEEKLY", viewValue: "Weekly" }
  ]

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<BulkRosterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService, private datePipe: DatePipe, public dialog: MatDialog) {
    this.shifts = data.shifts;
    this.shiftId = data.shiftId;
    console.log(this.data);
    this.rosterAssignment = this._fb.group(
      {
        amendStartDate: [""],
        empCode: ["", Validators.required],
        endsOnApplicable: [""],
        endsOnDate: [""],
        repeatFlag: ["", Validators.required],
        rosterChangeType: [],
        rosterFrequency: ['NA', [Validators.required]],
        rosterId: [""],
        rosterStartDate: ["", Validators.required],
        shiftId: ["", Validators.required],
      }
    );
    this.rosterAssignment.controls.repeatFlag.setValue(false);
    this.rosterAssignment.controls.empCode.setValue(this.data.empCode);
    this.rosterAssignment.controls.rosterStartDate.setValue(this.datePipe.transform(this.data.date, 'yyyy-MM-dd'));
    this.rosterAssignment.controls.rosterId.setValue(this.data.rosterId);
    if (this.shiftId != null) {
      this.rosterAssignment.controls.shiftId.setValue(+this.shiftId);
    }

    if (this.data.type === 'bulk') {
      this.header = "Bulk Shift Assignment";
      console.log(this.data.selectedDaysList);
      this.rosterAssignment.controls.empCode.setValue(this.data.selectedDaysList[0].empCode);
      this.rosterAssignment.controls.rosterStartDate.setValue(this.data.selectedDaysList[0].date);
    } else {
      this.header = "Shift Assignment";
    }


  }

  onChangeRepeatFlag(event: any) {
    console.log(event);
    this.rosterAssignment.controls.rosterFrequency.clearValidators();
    this.rosterAssignment.controls.endsOnApplicable.clearValidators();
    if (event.checked == true) {
      this.rosterAssignment.controls.rosterFrequency.setValidators(Validators.required)
      this.rosterAssignment.controls.endsOnApplicable.setValidators(Validators.required)
    } else {
      this.rosterAssignment.controls.rosterFrequency.setValue("NA");
    }
    this.rosterAssignment.controls.rosterFrequency.updateValueAndValidity();
    this.rosterAssignment.controls.endsOnApplicable.updateValueAndValidity();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onEndDateSelection(event: any) {
    console.log(event);
    this.rosterAssignment.controls.endsOnDate.setValue(this.datePipe.transform(event, 'yyyy-MM-dd'));
  }

  onChangeEndsOnApplicableFlag(event: any) {
    console.log(event);
    this.rosterAssignment.controls.endsOnDate.clearValidators();
    if (event.value == "true") {
      this.rosterAssignment.controls.endsOnDate.setValidators(Validators.required)
    }
    this.rosterAssignment.controls.endsOnDate.updateValueAndValidity();
  }

  saveRosters() {
    console.log(this.rosterAssignment.valid);
    console.log("saveRosters");
    if (this.rosterAssignment.valid) {
      var body = [];
      if (this.data.type === 'single') {
        body.push(this.rosterAssignment.value)
      } else {
        this.data.selectedDaysList.forEach(element => {
          if (element.rosterId == null) {
            body.push({
              empCode: element.empCode,
              endsOnApplicable: this.rosterAssignment.controls.endsOnApplicable.value,
              endsOnDate: this.rosterAssignment.controls.endsOnDate.value,
              repeatFlag: this.rosterAssignment.controls.repeatFlag.value,
              rosterFrequency: this.rosterAssignment.controls.rosterFrequency.value,
              rosterId: element.rosterId,
              rosterStartDate: element.date,
              shiftId: this.rosterAssignment.controls.shiftId.value,
            })
          } else {
            body.push({
              empCode: element.empCode,
              endsOnApplicable: this.rosterAssignment.controls.endsOnApplicable.value,
              endsOnDate: this.rosterAssignment.controls.endsOnDate.value,
              repeatFlag: this.rosterAssignment.controls.repeatFlag.value,
              rosterFrequency: this.rosterAssignment.controls.rosterFrequency.value,
              rosterId: element.rosterId,
              rosterStartDate: element.date,
              shiftId: this.rosterAssignment.controls.shiftId.value,
              amendStartDate: element.date,
              rosterChangeType: "CURRENT_DATE",
            })
          }

        });
      }

      this.serviceApi.post("/v1/attendance/rosters/", body).
        subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
    } else {
      Object.keys(this.rosterAssignment.controls).forEach(field => { // {1}
        const control = this.rosterAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateRosters() {
    alert();
    console.log("updateRosters");
    if (this.rosterAssignment.valid) {
      var body = [];
      if (this.data.type === 'single') {
        body.push(this.rosterAssignment.value)
      } else {
        this.data.selectedDaysList.forEach(element => {
          body.push({
            empCode: element.empCode,
            endsOnApplicable: this.rosterAssignment.controls.endsOnApplicable.value,
            endsOnDate: this.rosterAssignment.controls.endsOnDate.value,
            repeatFlag: this.rosterAssignment.controls.repeatFlag.value,
            rosterFrequency: this.rosterAssignment.controls.rosterFrequency.value,
            rosterId: element.rosterId,
            rosterStartDate: element.date,
            shiftId: this.rosterAssignment.controls.shiftId.value,
          })
        });
      }
      const dialogRef = this.dialog.open(UpdateRostersDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: body
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            this.action = 'Response';
            this.error = result.message;
            this.close();
          }
        }
      });
    } else {
      Object.keys(this.rosterAssignment.controls).forEach(field => { // {1}
        const control = this.rosterAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  openDeleteRostersDialog() {

    const dialogRef = this.dialog.open(DeleteRostersDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: { rosterStartDate: this.rosterAssignment.controls.rosterStartDate.value, rosterId: this.rosterAssignment.controls.rosterId.value }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.action = 'Response';
        this.error = result.message;
        this.close();
      }
    });
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}



@Component({
  templateUrl: 'delete-rosters.dialog.component.html',
  styleUrls: ['./roster-records.component.scss']
})
export class DeleteRostersDialogComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  separationReqId: any;
  deletionType = new FormControl('', Validators.required);

  constructor(public dialogRef: MatDialogRef<DeleteRostersDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder, ) {

    console.log(data);
  }


  deleteRoster() {
    const body = {
      "date": this.data.rosterStartDate,
      "deletionType": this.deletionType.value,
      "rosterId": this.data.rosterId
    }
    console.log(this.deletionType.valid);
    if (this.deletionType.valid) {
      this.serviceApi.put("/v1/attendance/rosters/delete", body).
        subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
    }
    else {
      this.deletionType.markAsTouched({ onlySelf: true });
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}



@Component({
  templateUrl: 'update-roster.component.html',
  styleUrls: ['./roster-records.component.scss']
})
export class UpdateRostersDialogComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  separationReqId: any;
  updatationType = new FormControl('', Validators.required);

  constructor(public dialogRef: MatDialogRef<UpdateRostersDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder, ) {

    console.log(data);
  }


  updateRoster() {
    this.data.forEach((element, i) => {
      this.data[i].amendStartDate = element.rosterStartDate;
      this.data[i].rosterChangeType = this.updatationType.value;
    });
    if (this.updatationType.valid) {
      this.serviceApi.post("/v1/attendance/rosters/", this.data).
        subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
    } else {
      this.updatationType.markAsTouched({ onlySelf: true });
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'bulk-upload-roster-records.component.html',
  styleUrls: ['./bulk-upload-roster-records.component.scss']
})
export class BulkUploadRosterRecordsComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  uploadBulkRosterRecords: FormGroup
  monthList: any = [];
  month: any;
  selectMonth: any;
  selectedFiles: FileList;
  selectedFilesName: string;
  currentFileUpload: File;
  constructor(public dialogRef: MatDialogRef<BulkUploadRosterRecordsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.monthList = data.monthList;
    const date = new Date();
    const monthName = this.monthList[date.getMonth()];
    this.month = monthName;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadRoster() {
    this.selectMonth = this.uploadBulkRosterRecords.controls.month.value
    this.serviceApi.get('/v1/attendance/rosters/download/bulk-roster/' + this.selectMonth).subscribe(
      res => {
        window.open(environment.storageServiceBaseUrl + res.url);
      }
    );
  }
  uploadFormat() {
    $('#uploadFile').click();
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
    this.uploadBulkRosterRecords.controls.file.setValue(this.selectedFiles ? this.selectedFilesName : null)
  }
  ngOnInit() {
    this.uploadBulkRosterRecords = this._fb.group({
      month: [null, Validators.required],
      file: ['', [FileValidator.validate]]
    })
  }
  upload(selectMonthYear) {
    console.log('upload method called-->');
    if (this.uploadBulkRosterRecords.valid && this.uploadBulkRosterRecords.controls.file.value != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
      const file = <File>this.currentFileUpload;
      let formdata: FormData = new FormData();
      formdata.append('file', file);
      this.serviceApi.postWithFormData('/v1/attendance/rosters/bulk-upload/' + selectMonthYear, formdata).subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
        });
    } else {
      Object.keys(this.uploadBulkRosterRecords.controls).forEach(field => {
        const control = this.uploadBulkRosterRecords.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.uploadBulkRosterRecords.controls.file.setValidators([Validators.required])
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
