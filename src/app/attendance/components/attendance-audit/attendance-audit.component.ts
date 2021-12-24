import { Component, OnInit, ViewChild, Inject, ViewChildren, QueryList } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';
import { MdePopoverTrigger } from '@material-extended/mde';
@Component({
  selector: 'app-attendance-audit',
  templateUrl: './attendance-audit.component.html',
  styleUrls: ['./attendance-audit.component.scss']
})
export class AttendanceAuditComponent implements OnInit {
  // @ViewChild(MdePopoverTrigger, { read: MdePopoverTrigger }) trigger: MdePopoverTrigger;
  // @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;
  // @ViewChild(MdePopoverTrigger) trigger2: MdePopoverTrigger;
  // @ViewChild(MdePopoverTrigger) trigger3: MdePopoverTrigger;
  @ViewChildren(MdePopoverTrigger) trigger: QueryList<MdePopoverTrigger>;
  @ViewChild("dt1") dt: DataTable;
  data: string;
  actions: any;
  error: any;
  message
  month: any;
  date: Date;
  selectedIndex: any;
  flag = false;
  columns = [
    { field: 'empCode', header: 'Employee Name' },
    { field: 'attendanceDate', header: 'Date' },
    { field: 'locationName', header: 'work Location' },
    { field: 'checkIn', header: 'Check_In' },
    { field: 'checkOut', header: 'Check_Out' },
    { field: 'checkInStatus', header: 'Early Mark Status' },
    { field: 'checkOutStatus', header: 'Late Mark Status' },
    { field: 'duration', header: 'Duration' },
    { field: 'deviationHours', header: 'Deviation Hours' },
    { field: 'shiftTiming', header: 'Shift Timings' },
    { field: 'attendanceStatus', header: 'Status' },
    { field: 'attendanceProcessStatus', header: 'After Processing' }
  ];
  monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  assignedAttendenceData = [];
  public attendanceAuditForm: FormGroup;
  openDatePicker = false;
  openDropdown = false;
  openAttaendanceTemplate = false;
  openSupervisorTemplate = false;
  opendayStatusOptions = false; count5 = 0;
  openTotalHoursWorked = false; count6 = 0;
  checkInStatus = false; count7 = 0;
  checkOutStatus = false; count8 = 0;
  lateAndEarlyStatus = false; count9 = 0;
  openWorkLocation = false;
  openCatnterTemplate = false;
  shiftStatus = false; count10 = 0;
  count = 0; count1 = 0; count2 = 0; count3 = 0; count4 = 0;
  empList = [];
  checkinList = [];
  checkoutList = [];
  attdStatusList = [];
  totalHoursWorkedList = [];
  templatesList = [];
  shiftsList = [];
  locationsList = [];
  departmentsList = [];
  lateAndEarlyStatusList = [];
  supervisorsList = [];
  monthStartDay;
  monthEndDay;
  selectedMonth;
  displayPetDetailsDialog: boolean = false;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http, private atp: AmazingTimePickerService) { }

  ngOnInit() {
    this.getAllAttendanceAudit();
    this.attendanceAuditForm = this.fb.group({
      monthAttendance: [],
      fromDate: [],
      toDate: [],
      fromTime: [],
      toTime: [],
      fromCheckInTime: [],
      toCheckInTime: [],
      fromCheckOutTime: [],
      toCheckOutTime: [],
      attendanceStatusList: [],
      selectworkingOption: [],
      workedHours: [],
      workingHours: [],
      employeeName: [],
      empName: [],
      wLocation: [],
      WorkLocation: [],
      attendanceTemplate: [],
      attTemplate: [],
      attendanceSupervisor: [],
      attSupervisor: [],
      checkInTimeOptions: [],
      checkTime: [],
      checkOut: [],
      checkOutTimeOption: [],
      inputCheckInTime: [],
      inputCheckOutTime: [],
      dept: [],
      department: [],
      dayStatus: [],
      dayStatusOptions: [],
      checkedShift: [],
      shiftStatus: [],
      lateAndEarlyStatus: [],
      lateAndEarlyMarkStatus: []
    });
    const date = new Date();
    this.changeMonth(this.monthList[date.getMonth()]);
    this.attendanceAuditForm.controls.monthAttendance.setValue(this.monthList[date.getMonth()]);

  }
  getAllAttendanceAudit() {
    this.empList = [];
    this.checkinList = [];
    this.checkoutList = [];
    this.attdStatusList = [];
    this.totalHoursWorkedList = [];
    this.templatesList = [];
    this.shiftsList = [];
    this.locationsList = [];
    this.departmentsList = [];
    this.lateAndEarlyStatusList = [];
    this.supervisorsList = [];
    this.serviceApi.get('/v1/attendance/attendanceaudit/audit-options').subscribe(res => {
      this.empList = res.empList;
      this.checkinList = res.checkin;
      this.checkoutList = res.checkout;
      this.attdStatusList = res.attdStatus;
      this.totalHoursWorkedList = res.totalHoursWorked;
      this.templatesList = res.templates;
      this.shiftsList = res.shifts;
      this.locationsList = res.locations;
      this.departmentsList = res.departments;
      this.lateAndEarlyStatus = res.lateAndEarlyStatus;
      this.supervisorsList = res.supervisors;
      console.log(res);
    },
      (err) => {
      }, () => {

      });
  }
  resetFilterValue(event: MatCheckboxChange): void {
    if (this.attendanceAuditForm.controls.workedHours.value === false) {
      this.attendanceAuditForm.controls.selectworkingOption.setValue(null);
      this.attendanceAuditForm.controls.workingHours.setValue(null);
      this.attendanceAuditForm.controls.toTime.setValue('');
      this.attendanceAuditForm.controls.fromTime.setValue('');
    }
    if (this.attendanceAuditForm.controls.checkTime.value === false) {
      this.attendanceAuditForm.controls.checkInTimeOptions.setValue(null);
      this.attendanceAuditForm.controls.inputCheckInTime.setValue(null);
      this.attendanceAuditForm.controls.toCheckInTime.setValue('');
      this.attendanceAuditForm.controls.fromCheckInTime.setValue('');
    }
    if (this.attendanceAuditForm.controls.checkOut.value === false) {
      this.attendanceAuditForm.controls.checkOutTimeOption.setValue(null);
      this.attendanceAuditForm.controls.inputCheckOutTime.setValue(null);
      this.attendanceAuditForm.controls.toCheckOutTime.setValue('');
      this.attendanceAuditForm.controls.fromCheckOutTime.setValue('');
    }
  }
  onFilterChangeTotalHour(ob) {
    console.log('Filter changed...');
    let selectedValue = ob.value;
    console.log(selectedValue);
    this.attendanceAuditForm.controls.workingHours.setValue(null);
  }
  onFilterChangeCheckInTime(ob) {
    console.log('Filter changed...');
    let selectedValue = ob.value;
    console.log(selectedValue);
    this.attendanceAuditForm.controls.inputCheckInTime.setValue(null);
  }
  onFilterChangeCheckOutTime(ob) {
    console.log('Filter changed...');
    let selectedValue = ob.value;
    console.log(selectedValue);
    this.attendanceAuditForm.controls.inputCheckOutTime.setValue(null);
  }
  changeMonth(month) {
    const date = new Date();
    this.monthStartDay = new Date(date.getFullYear(), this.monthList.indexOf(month), 1);
    console.log(date.getMonth(), this.monthList.indexOf(month));
    this.attendanceAuditForm.controls.fromDate.setValue(this.monthStartDay.toLocaleDateString('en-CA'));
    this.monthEndDay = new Date(date.getFullYear(), this.monthList.indexOf(month) + 1, 0);
    this.attendanceAuditForm.controls.toDate.setValue(this.monthEndDay.toLocaleDateString('en-CA'));
  }
  applyAttendanceAuditFilter() {
    if (this.attendanceAuditForm.valid) {
      const body = {
        "attendanceCycle": '',
        "attendanceStatusList": this.attendanceAuditForm.controls.attendanceStatusList.value,
        "attendanceTemplateId": this.attendanceAuditForm.controls.attTemplate.value,
        "checkIn": this.attendanceAuditForm.controls.inputCheckInTime.value,
        "checkInBetween": this.attendanceAuditForm.controls.checkInTimeOptions.value == 'Between' ? this.attendanceAuditForm.controls.inputCheckInTime.value : null,
        "checkInGreaterThan": this.attendanceAuditForm.controls.checkInTimeOptions.value == 'Greater than' ? this.attendanceAuditForm.controls.inputCheckInTime.value : null,
        "checkInLessThan": this.attendanceAuditForm.controls.checkInTimeOptions.value == 'Less than' ? this.attendanceAuditForm.controls.inputCheckInTime.value : null,
        "checkOut": this.attendanceAuditForm.controls.inputCheckOutTime.value,
        "checkOutBetween": this.attendanceAuditForm.controls.checkOutTimeOption.value == 'Between' ? this.attendanceAuditForm.controls.inputCheckOutTime.value : null,
        "checkOutGreaterThan": this.attendanceAuditForm.controls.checkOutTimeOption.value == 'Greater than' ? this.attendanceAuditForm.controls.inputCheckOutTime.value : null,
        "checkOutLessThan": this.attendanceAuditForm.controls.checkOutTimeOption.value == 'Less than' ? this.attendanceAuditForm.controls.inputCheckOutTime.value : null,
        "departmentIds": this.attendanceAuditForm.controls.department.value,
        "empCodes": this.attendanceAuditForm.controls.empName.value,
        "startDate": this.attendanceAuditForm.controls.fromDate.value,
        "endDate": this.attendanceAuditForm.controls.toDate.value,
        "lateAndEarlyMarkStatus": this.attendanceAuditForm.controls.lateAndEarlyMarkStatus.value,
        "locationNames": this.attendanceAuditForm.controls.wLocation.value,
        "shifts": this.attendanceAuditForm.controls.shiftStatus.value,
        "supervisor": this.attendanceAuditForm.controls.attSupervisor.value,
        "totalHoursWorked": this.attendanceAuditForm.controls.workingHours.value,
        "totalHoursWorkedBetween": this.attendanceAuditForm.controls.selectworkingOption.value == 'Between' ? this.attendanceAuditForm.controls.workingHours.value : null,
        "totalHoursWorkedGreaterThan": this.attendanceAuditForm.controls.selectworkingOption.value == 'Greater than' ? this.attendanceAuditForm.controls.workingHours.value : null,
        "totalHoursWorkedLessThan": this.attendanceAuditForm.controls.selectworkingOption.value == 'Less than' ? this.attendanceAuditForm.controls.workingHours.value : null
      };
      return this.serviceApi.put('/v1/attendance/attendanceaudit/auditAttendance', body).
        subscribe(
          res => {
            this.actions = 'Response';
            this.message = res.message;
            this.assignedAttendenceData = res;
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.actions = 'Error';
          }, () => {
            this.dt.reset();
          });
    } else {
      Object.keys(this.attendanceAuditForm.controls).forEach(field => {
        const control = this.attendanceAuditForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  CancelAuditFilter() {
    this.attendanceAuditForm.reset();
  }
  openTimePicker(event: any, type: any) {
    console.log(type);
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      if (type === 'toTime') {
        this.attendanceAuditForm.controls.toTime.setValue(time);
      } else if (type === 'fromTime') {
        this.attendanceAuditForm.controls.fromTime.setValue(time);
      } else if (type === 'toCheckInTime') {
        this.attendanceAuditForm.controls.toCheckInTime.setValue(time);
      } else if (type === 'fromCheckInTime') {
        this.attendanceAuditForm.controls.fromCheckInTime.setValue(time);
      } else if (type === 'toCheckOutTime') {
        this.attendanceAuditForm.controls.toCheckOutTime.setValue(time);
      } else {
        this.attendanceAuditForm.controls.fromCheckOutTime.setValue(time);
      }
    });
  }
  closePopover(id) {
    console.log(this.trigger.toArray());
    const length = this.trigger.toArray().length;
    switch (id) {
      case 0: if (length >= 1) {
        this.trigger.toArray()[0].closePopover();
      } break;
      case 1: if (length > 1) {
        this.trigger.toArray()[0].closePopover();
        this.trigger.toArray()[1].closePopover();
      } else {
        this.trigger.toArray()[0].closePopover();
      } break;
      case 2: if (length > 2) {
        this.trigger.toArray()[2].closePopover();
      } else if (length === 2) {
        this.trigger.toArray()[1].closePopover();
      } else if (length === 1) {
        this.trigger.toArray()[0].closePopover();
      } break;
    }
  }
  applyValues(id: number) {
    if (this.attendanceAuditForm.controls.workedHours.value === true && this.attendanceAuditForm.controls.selectworkingOption.value === 'Between') {
      var toTime = this.attendanceAuditForm.controls.toTime.value;
      var fromTime = this.attendanceAuditForm.controls.fromTime.value;
      this.attendanceAuditForm.controls.workingHours.setValue(fromTime + '-' + toTime);
    }
    if (this.attendanceAuditForm.controls.checkTime.value === true && this.attendanceAuditForm.controls.checkInTimeOptions.value === 'Between') {
      var toCheckInTime = this.attendanceAuditForm.controls.toCheckInTime.value;
      var fromCheckInTime = this.attendanceAuditForm.controls.fromCheckInTime.value;
      this.attendanceAuditForm.controls.inputCheckInTime.setValue(fromCheckInTime + '-' + toCheckInTime);
    }
    if (this.attendanceAuditForm.controls.checkOut.value === true && this.attendanceAuditForm.controls.checkOutTimeOption.value === 'Between') {
      var toCheckOutTime = this.attendanceAuditForm.controls.toCheckOutTime.value;
      var fromCheckOutTime = this.attendanceAuditForm.controls.fromCheckOutTime.value;
      this.attendanceAuditForm.controls.inputCheckOutTime.setValue(fromCheckOutTime + '-' + toCheckOutTime);
    }
    this.closePopover(id);
  }
  // selectDate() {
  //   console.log("....Inside select date dialog......");
  //   console.log('Inside approve dialog');
  //   const dialogRef = this.dialog.open(AddDatePickerDialog, {
  //     width: '500px',
  //     panelClass: 'custom-dialog-container',
  //     data: {}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
  importToProh2r(action: any) {
    if (action === 'Import to ProH2R') {
      const dialogRef = this.dialog.open(ImportToProH2RDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }
}
@Component({
  templateUrl: './AddDatePickerDialog.component.html',
  styleUrls: ['./AddDatePickerDialog.component.scss']
})

export class AddDatePickerDialog implements OnInit {
  dateRange: FormGroup
  constructor(public dialogRef: MatDialogRef<AddDatePickerDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    this.dateRange = this._fb.group({
      fromDate: [],
      toDate: [],
    })
  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// import to proh2r
@Component({
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class ImportToProH2RDialog implements OnInit {
  dateRange: FormGroup;
  constructor(public dialogRef: MatDialogRef<ImportToProH2RDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
export interface Element {
  empName: string;
  date: string;
  typeofRequest: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  status: string;
  actions: string;
}

