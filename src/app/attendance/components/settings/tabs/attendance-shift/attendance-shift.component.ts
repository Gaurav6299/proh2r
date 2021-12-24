import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { validateConfig } from '@angular/router/src/config';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { concat } from 'rxjs/operator/concat';
import { element } from 'protractor';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { delay } from 'rxjs/operators';
import * as moment from 'moment';
import { DataTable, SelectItem } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-attendance-shift',
  templateUrl: './attendance-shift.component.html',
  styleUrls: ['./attendance-shift.component.scss']
})
export class AttendanceShiftComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line:max-line-length
  @ViewChild('attendanceShiftFormTemplateform') form;
  displayedColumns = [
    { field: 'shiftName', header: 'Shift Name' },
    { field: 'shiftStartTime', header: 'Starts From' },
    { field: 'shiftEndTime', header: 'Ends At' },
    // { field: 'shiftRecordId', header: 'Effective From' },
    { field: 'action', header: 'Action' }
  ];
  dataSource = new MatTableDataSource<Element>();
  // dataSource = ELEMENT_DATA;
  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  showHideAllowanceExemptionField: any;
  showhideExemptionLimit: any;
  updateButton: any;
  saveButton: any;
  backButton: any;
  shiftRecordDataTable = [];
  creditFullDay: any;
  creditHalfDay: any;
  notificationMsg: any;
  action: any;
  minumumHourFullDay: FormControl;
  allowanceTypes = [
    { value: 'Others', viewValue: 'Others' }
  ];

  @ViewChild("dt1") dt: DataTable;
  requiredTextField;
  public attendanceShiftForm: FormGroup;
  allSelections = [];
  selectedItems = []
  selectedTime: any;
  check1: boolean;
  addShiftTitle = "Add New Shift";
  updateShiftTitle = "Update Shift";
  // OfShiftShowHideTemplateForm: boolean;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService, private atp: AmazingTimePickerService) {
    this.getAllShiftRecordsData();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    var rolesArr = KeycloakService.getUserRole();
    console.log('has role------' + JSON.stringify(KeycloakService.getUserRole()));
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
  //   open(){
  //     const amazingTimePicker = this.atp.open({
  //         time:  this.selectedTime,
  //         theme: 'light',
  //         arrowStyle: {
  //             background: 'cyan',
  //             color: 'white'
  //         }
  //     });
  //     amazingTimePicker.afterClose().subscribe(time => {
  //         this.selectedTime = time;
  //     });
  // }
  ngOnInit() {
    this.getCriteria();
    this.attendanceShiftForm = this.fb.group({
      shiftRecordId: [],
      shiftName: [null, Validators.required],
      colorCode: [null],
      areTimingSame: [],
      shiftStartTime: [],
      shiftEndTime: [],
      allSelections: [],
      minHoursForFullDay: [null],
      minMinutForFullDay: [null, [Validators.min(0), Validators.max(60)]],
      minHoursForHalfDay: [null],
      minMinutForHalfDay: [null],
      minHrsForCreditFullDay: [null, [Validators.min(0), Validators.max(24)]],
      minHrsForCreditHalfDay: [null, [Validators.min(0), Validators.max(24)]],
      isHalfDayApplicable: [null],
      earliestArrival: [null, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
      latestDeparture: [null, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
      secondHalfDuration: [null, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
      firstHalfDuration: [null, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
      nextDayShiftOutTime: [null, Validators.required],
      attendanceShiftType: [null, Validators.required],
      offShift: [null, Validators.required]
    });
  }
  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations()
  }
  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").pipe(delay(500)).subscribe(
      res => {
        res.forEach(element => {
          // var elemets = { id: element.deptId, type: 'Departments' };
          // console.log(elemets);
          this.allSelections = [...this.allSelections, {
            value: element.deptId,
            viewValue: element.deptName,
            type: 'Departments'
          }];
        });

      }, (err) => {

      }, () => {

      });
  }
  getAllBands() {
    this.serviceApi.get("/v1/organization/getAll/bands").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.bandId, type: 'Bands' };
            this.allSelections = [...this.allSelections, {
              value: element.bandId,
              viewValue: element.bandName,
              type: 'Bands'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getAllDesignations() {
    this.serviceApi.get("/v1/organization/getAll/designations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.id, type: 'Designations' };
            this.allSelections = [...this.allSelections, {
              value: element.id,
              viewValue: element.designationName,
              type: 'Designations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });

  }
  getAllOrgLocations() {
    this.serviceApi.get("/v1/organization/orgLocations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.locationId, type: 'Locations' };
            this.allSelections = [...this.allSelections, {
              value: element.locationId,
              viewValue: element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  openTimePicker(type: any) {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      if (type === 'startTime') {
        this.attendanceShiftForm.controls.shiftStartTime.setValue(time);
      } else {
        this.attendanceShiftForm.controls.shiftEndTime.setValue(time);
      }

      if (moment(this.attendanceShiftForm.controls.shiftStartTime.value, "HH:mm", true).isValid() && moment(this.attendanceShiftForm.controls.shiftEndTime.value, "HH:mm", true).isValid()) {

        let diff = moment(this.attendanceShiftForm.controls.shiftEndTime.value, 'HH:mm').diff(moment(this.attendanceShiftForm.controls.shiftStartTime.value, 'HH:mm'));
        if (diff < 0) {
          var MINUTES = +(1440 - moment.duration(moment(this.attendanceShiftForm.controls.shiftStartTime.value, 'HH:mm').diff(moment("00:00", 'HH:mm'))).asMinutes());
          MINUTES += +moment.duration(moment(this.attendanceShiftForm.controls.shiftEndTime.value, 'HH:mm').diff(moment("00:00", 'HH:mm'))).asMinutes();
          MINUTES = MINUTES / 2;
          var m = MINUTES % 60;
          var h = (MINUTES - m) / 60;
          var HHMM = (h < 10 ? "0" : "") + h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
          this.attendanceShiftForm.controls.firstHalfDuration.setValue(HHMM);
          this.attendanceShiftForm.controls.secondHalfDuration.setValue(HHMM);
          return;
        }
        var MINUTES = Math.floor(moment.duration(diff).asMinutes() / 2);
        var m = MINUTES % 60;
        var h = (MINUTES - m) / 60;
        var HHMM = (h < 10 ? "0" : "") + h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
        this.attendanceShiftForm.controls.firstHalfDuration.setValue(HHMM);
        this.attendanceShiftForm.controls.secondHalfDuration.setValue(HHMM);

      }
    });


  }

  setPanel() {
    console.log(this.isLeftVisible);
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  addNewAttendanceShift() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.attendanceShiftForm.reset();
    this.updateButton = false;
    this.saveButton = true;
    this.form.resetForm();
    if (this.attendanceShiftForm.controls.colorCode.value == null) {
      this.attendanceShiftForm.controls.colorCode.setValue('#4f4f4f');
    }

    // Object.keys(this.attendanceShiftForm.controls).forEach(field => { // {1}
    //   const control = this.attendanceShiftForm.get(field);            // {2}
    //   control.markAsPristine({ onlySelf: true });       // {3}
    // });

  }

  cancelShiftForm() {
    this.attendanceShiftForm.reset();
    this.form.resetForm();
    this.isLeftVisible = false;
    this.setPanel();
  }

  editAttendanceShiftRecord(data: any) {
    this.check1 = true;
      this.isLeftVisible = !this.isLeftVisible;
      $('.divtoggleDiv')[1].style.display = 'block';
      this.updateButton = true;
      this.saveButton = false;
      let selections = [];
      data.departmentId != null ? data.departmentId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Departments'
        });
      }) : '';
      data.bandId != null ? data.bandId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Bands'
        });
      }) : '';
      data.locationId != null ? data.locationId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Locations'
        });
      }) : '';
      data.designationId != null ? data.designationId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Designations'
        });
      }) : '';
      console.log(selections);
      const fullTimeLimit = data.minHrsForCreditFullDay.split(':');
      const halfTimeLimit = data.minHrsForCreditHalfDay.split(':');
      this.attendanceShiftForm = this.fb.group({
        shiftRecordId: [data.shiftRecordId],
        shiftName: [data.shiftName],
        colorCode: [data.colorCode],
        areTimingSame: '' + true,
        shiftStartTime: [data.shiftStartTime],
        shiftEndTime: [data.shiftEndTime],
        allSelections: [selections],
        minHoursForFullDay: [Number(fullTimeLimit[0])],
        minMinutForFullDay: [Number(fullTimeLimit[1])],
        minHoursForHalfDay: [Number(halfTimeLimit[0])],
        minMinutForHalfDay: [Number(halfTimeLimit[1])],
        minHrsForCreditFullDay: [data.minHrsForCreditFullDay],
        minHrsForCreditHalfDay: [data.minHrsForCreditHalfDay],
        isHalfDayApplicable: [data.isHalfDayApplicable],
        earliestArrival: [data.earliestArrival, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
        latestDeparture: [data.latestDeparture, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
        secondHalfDuration: [data.secondHalfDuration, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
        firstHalfDuration: [data.firstHalfDuration, [Validators.required, Validators.pattern("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]],
        nextDayShiftOutTime: [data.nextDayShiftOutTime, Validators.required],
        attendanceShiftType: [data.attendanceShiftType, Validators.required],
        offShift: [data.offShift]
      });
      this.attendanceShiftForm.controls.isHalfDayApplicable.setValue('' + data.isHalfDayApplicable);
      this.attendanceShiftForm.controls.nextDayShiftOutTime.setValue('' + data.nextDayShiftOutTime);
      this.attendanceShiftForm.controls.attendanceShiftType.setValue('' + data.attendanceShiftType);
      this.attendanceShiftForm.controls.offShift.setValue('' + data.offShift);
  }

  saveNewShiftRecord(attendanceShiftForm: any) {
    this.check1 = true;
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    if ((this.attendanceShiftForm.controls.shiftName.value &&
      this.attendanceShiftForm.controls.shiftStartTime.value &&
      this.attendanceShiftForm.controls.shiftEndTime.value && this.attendanceShiftForm.valid) || (this.attendanceShiftForm.controls.offShift.value && this.attendanceShiftForm.controls.shiftName.value)) {
      this.check1 = false;
      this.isLeftVisible = !this.isLeftVisible;
      this.setPanel();
      let selections = this.attendanceShiftForm.controls.allSelections.value;
      if (selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else {
            locationIds.push(element.value);
          }
        });
      }
      if (this.attendanceShiftForm.controls.minMinutForFullDay.value === null) {
        if (this.attendanceShiftForm.controls.minHoursForFullDay.value < 10) {
          this.creditFullDay = '0' + this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '00' + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value >= 10) {
          this.creditFullDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '00' + ':00';
        }
      } else {
        if (this.attendanceShiftForm.controls.minHoursForFullDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value < 10) {

          this.creditFullDay = '0' + this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value >= 10) {

          this.creditFullDay = '0' + this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value < 10) {

          this.creditFullDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value >= 10) {

          this.creditFullDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';
        }
      }
      if (this.attendanceShiftForm.controls.minMinutForHalfDay.value === null) {
        this.attendanceShiftForm.controls.minHoursForHalfDay.setValue('0')
        if (this.attendanceShiftForm.controls.minHoursForHalfDay.value < 10) {
          this.creditHalfDay = '0' + this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':00:00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10) {
          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':00:00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10) {
          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':00:00';
        }
      } else {
        if (this.attendanceShiftForm.controls.minHoursForHalfDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value < 10) {

          this.creditHalfDay = '0' + this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value >= 10) {

          this.creditHalfDay = '0' + this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value < 10) {

          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value >= 10) {

          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';
        }
      }
      if (this.attendanceShiftForm.controls.attendanceShiftType.value === 'FIXED_TIME') {
        this.creditFullDay = null;
      }
      if ((this.attendanceShiftForm.controls.attendanceShiftType.value === 'FIXED_TIME' && this.attendanceShiftForm.controls.isHalfDayApplicable.value === null)) {
        this.creditHalfDay = null;
      }
      if (this.attendanceShiftForm.controls.isHalfDayApplicable.value === 'false') {
        this.creditHalfDay = null;
      }
      const body = {
        "bandId": bandIds,
        "departmentId": deptIds,
        "designationId": designationIds,
        "locationId": locationIds,
        'shiftRecordId': 0,
        'shiftName': this.attendanceShiftForm.controls.shiftName.value,
        'colorCode': this.attendanceShiftForm.controls.colorCode.value,
        'areTimingSame': true,
        'shiftStartTime': this.attendanceShiftForm.controls.shiftStartTime.value + ':00',
        'shiftEndTime': this.attendanceShiftForm.controls.shiftEndTime.value + ':00',
        'minHrsForCreditFullDay': this.creditFullDay,
        'minHrsForCreditHalfDay': this.creditHalfDay,
        'isHalfDayApplicable': this.attendanceShiftForm.controls.isHalfDayApplicable.value,
        "earliestArrival": this.attendanceShiftForm.controls.earliestArrival.value,
        "latestDeparture": this.attendanceShiftForm.controls.latestDeparture.value,
        "firstHalfDuration": this.attendanceShiftForm.controls.firstHalfDuration.value,
        "secondHalfDuration": this.attendanceShiftForm.controls.secondHalfDuration.value,
        "nextDayShiftOutTime": this.attendanceShiftForm.controls.nextDayShiftOutTime.value,
        "attendanceShiftType": this.attendanceShiftForm.controls.attendanceShiftType.value,
        "offShift": this.attendanceShiftForm.controls.offShift.value
      };

      console.log(JSON.stringify(body));
      this.serviceApi.post('/v1/attendance/settings/shift/', body).subscribe(
        res => {
          if (res != null) {
            console.log('Data Sucessfully Saved');
            this.getAllShiftRecordsData();
            this.successNotification(res.message);
          } else {
            console.log('Something gone wrong');
            this.attendanceShiftForm.reset();
          }
        },
        err => {
          console.log('there is something error.....  ');
          // this.warningNotification(err.message);
          this.attendanceShiftForm.reset();
        }
      );

      // this.attendanceShiftForm.markAsPristine();
    } else {
      Object.keys(this.attendanceShiftForm.controls).forEach(field => { // {1}
        const control = this.attendanceShiftForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateShiftRecord(attendanceShiftForm: any) {
    this.check1 = true;
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    if ((this.attendanceShiftForm.controls.shiftName.value &&
      this.attendanceShiftForm.controls.shiftStartTime.value &&
      this.attendanceShiftForm.controls.shiftEndTime.value && this.attendanceShiftForm.valid) || (this.attendanceShiftForm.controls.offShift.value && this.attendanceShiftForm.controls.shiftName.value)) {
      console.log('Enter to Update the Existing Attendance Shift record ::: ');
      this.check1 = false;
      const val = this.attendanceShiftForm.controls.shiftRecordId.value;
      console.log(this.attendanceShiftForm.controls.allSelections);
      let selections = this.attendanceShiftForm.controls.allSelections.value;
      if (selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else {
            locationIds.push(element.value);
          }
        });
      }

      if (this.attendanceShiftForm.controls.minMinutForFullDay.value === null) {
        if (this.attendanceShiftForm.controls.minHoursForFullDay.value < 10) {
          this.creditFullDay = '0' + this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '00' + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value >= 10) {
          this.creditFullDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '00' + ':00';
        }
      } else {
        if (this.attendanceShiftForm.controls.minHoursForFullDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value < 10) {

          this.creditFullDay = '0' + this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value >= 10) {

          this.creditFullDay = '0' + this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value < 10) {

          this.creditFullDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForFullDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForFullDay.value >= 10) {

          this.creditFullDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForFullDay.value + ':00';
        }
      }

      if (this.attendanceShiftForm.controls.minMinutForHalfDay.value === null) {
        if (this.attendanceShiftForm.controls.minHoursForHalfDay.value < 10) {
          this.creditHalfDay = '0' + this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':00:00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value < 10) {
          this.creditHalfDay = '0' + this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':00:00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10) {
          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':00:00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10) {
          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':00:00';
        }
      } else {
        if (this.attendanceShiftForm.controls.minHoursForHalfDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value < 10) {

          this.creditHalfDay = '0' + this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value < 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value >= 10) {

          this.creditHalfDay = '0' + this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value < 10) {

          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForHalfDay.value
            + ':' + '0' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';

        } else if (this.attendanceShiftForm.controls.minHoursForHalfDay.value >= 10
          && this.attendanceShiftForm.controls.minMinutForHalfDay.value >= 10) {

          this.creditHalfDay = this.attendanceShiftForm.controls.minHoursForFullDay.value
            + ':' + this.attendanceShiftForm.controls.minMinutForHalfDay.value + ':00';
        }
      }

      if (this.attendanceShiftForm.controls.attendanceShiftType.value === 'FIXED_TIME') {
        this.creditFullDay = null;
      }
      if ((this.attendanceShiftForm.controls.attendanceShiftType.value === 'FIXED_TIME' && this.attendanceShiftForm.controls.isHalfDayApplicable.value === null)) {
        this.creditHalfDay = null;
      }
      if (this.attendanceShiftForm.controls.isHalfDayApplicable.value === 'false') {
        this.creditHalfDay = null;
      }
      const body = {
        "bandId": bandIds,
        "departmentId": deptIds,
        "designationId": designationIds,
        "locationId": locationIds,
        'shiftName': this.attendanceShiftForm.controls.shiftName.value,
        'colorCode': this.attendanceShiftForm.controls.colorCode.value,
        'areTimingSame': true,
        'shiftStartTime': this.attendanceShiftForm.controls.shiftStartTime.value + ':00',
        'shiftEndTime': this.attendanceShiftForm.controls.shiftEndTime.value + ':00',
        'minHrsForCreditFullDay': this.creditFullDay,
        'minHrsForCreditHalfDay': this.creditHalfDay,
        'isHalfDayApplicable': this.attendanceShiftForm.controls.isHalfDayApplicable.value,
        "earliestArrival": this.attendanceShiftForm.controls.earliestArrival.value,
        "latestDeparture": this.attendanceShiftForm.controls.latestDeparture.value,
        "firstHalfDuration": this.attendanceShiftForm.controls.firstHalfDuration.value,
        "secondHalfDuration": this.attendanceShiftForm.controls.secondHalfDuration.value,
        "nextDayShiftOutTime": this.attendanceShiftForm.controls.nextDayShiftOutTime.value,
        "attendanceShiftType": this.attendanceShiftForm.controls.attendanceShiftType.value,
        "offShift": this.attendanceShiftForm.controls.offShift.value,
      };
      this.serviceApi.put('/v1/attendance/settings/shift/' + +val, body).subscribe(
        res => {
          console.log(res);
          this.successNotification(res.message);
          this.isLeftVisible = !this.isLeftVisible;
          this.getAllShiftRecordsData();
          this.setPanel();
        },
        err => {
        }, () => {
          this.dt.reset();
        });
      //   res => {
      //     if (res != null) {
      //       console.log('Data Sucessfully Saved' + JSON.stringify(res));
      //       this.getAllShiftRecordsData();
      //       this.successNotification(res.message);
      //     } else {
      //       console.log('Something gone wrong');
      //     }
      //     this.attendanceShiftForm.reset();
      //   }, err => {
      //     console.log('there is something error.....  ');
      //     this.attendanceShiftForm.reset();
      //   }
      // );
    } else {
      Object.keys(this.attendanceShiftForm.controls).forEach(field => { // {1}
        const control = this.attendanceShiftForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  cancelAddAllowanceForm() {
    this.backButton = false;
    this.attendanceShiftForm.reset();
    this.form.resetForm();
    this.setPanel();
  }
  applyValidation() {
    if (this.attendanceShiftForm.controls.attendanceShiftType.value === 'FIXED_DURATION') {
      this.attendanceShiftForm.controls.minHoursForFullDay.setValue(null)
      this.attendanceShiftForm.controls.minMinutForFullDay.setValue(null)
      this.attendanceShiftForm.controls.minHoursForFullDay.setValidators([Validators.required, Validators.min(0), Validators.max(24)]);
      this.attendanceShiftForm.controls.minHoursForFullDay.updateValueAndValidity();
      this.attendanceShiftForm.controls.isHalfDayApplicable.setValidators(Validators.required);
      this.attendanceShiftForm.controls.isHalfDayApplicable.updateValueAndValidity();
    }
    else if (this.attendanceShiftForm.controls.attendanceShiftType.value === 'FIXED_TIME') {
      this.attendanceShiftForm.controls.minHoursForFullDay.setValue(null)
      this.attendanceShiftForm.controls.minMinutForFullDay.setValue(null)
      this.attendanceShiftForm.controls.minHoursForHalfDay.setValue(null)
      this.attendanceShiftForm.controls.minMinutForHalfDay.setValue(null)
      this.attendanceShiftForm.controls.isHalfDayApplicable.setValue(null)
    }
    else {
      this.attendanceShiftForm.controls.minHoursForFullDay.clearValidators();
      this.attendanceShiftForm.controls.minHoursForFullDay.updateValueAndValidity();
      this.attendanceShiftForm.controls.minMinutForFullDay.clearValidators();
      this.attendanceShiftForm.controls.minMinutForFullDay.updateValueAndValidity();
      this.attendanceShiftForm.controls.isHalfDayApplicable.clearValidators();
      this.attendanceShiftForm.controls.isHalfDayApplicable.updateValueAndValidity();
      this.attendanceShiftForm.controls.minMinutForHalfDay.clearValidators();
      this.attendanceShiftForm.controls.minMinutForHalfDay.updateValueAndValidity();
    }
  }
  halfDayApplicable() {
    if (this.attendanceShiftForm.controls.isHalfDayApplicable.value === 'true') {
      this.attendanceShiftForm.controls.minHoursForHalfDay.setValue(null)
      this.attendanceShiftForm.controls.minMinutForHalfDay.setValue(null)
      this.attendanceShiftForm.controls.minHoursForHalfDay.setValidators([Validators.required, Validators.min(0),
      Validators.max(24)]);
      this.attendanceShiftForm.controls.minHoursForHalfDay.updateValueAndValidity();
      this.attendanceShiftForm.controls.minMinutForHalfDay.setValidators([Validators.min(0), Validators.max(60)])
      this.attendanceShiftForm.controls.minMinutForHalfDay.updateValueAndValidity();
    }
    else if (this.attendanceShiftForm.controls.isHalfDayApplicable.value === 'false') {
      this.attendanceShiftForm.controls.minHoursForHalfDay.setValue(null);
      this.attendanceShiftForm.controls.minMinutForHalfDay.setValue(null);
      this.attendanceShiftForm.controls.minMinutForHalfDay.clearValidators();
      this.attendanceShiftForm.controls.minHoursForHalfDay.clearValidators();
      this.attendanceShiftForm.controls.minHoursForHalfDay.updateValueAndValidity();
      this.attendanceShiftForm.controls.minMinutForHalfDay.updateValueAndValidity();
    }
  }
  onChangeOfShift() {
    if (this.attendanceShiftForm.controls.offShift.value === 'false') {
      this.attendanceShiftForm.controls.shiftStartTime.setValue(null);
      this.attendanceShiftForm.controls.shiftEndTime.setValue(null);
    }
  }

  deleteShiftRecord(data: any) {
      this.action = '';
      this.notificationMsg = '';
      const dialogRef = this.dialog.open(AttdShiftDeleteDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { shiftRecordId: data.shiftRecordId, message: this.notificationMsg, status: this.action }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getAllShiftRecordsData();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
          // tslint:disable-next-line:one-line
        }
      });
  }
  getAllShiftRecordsData() {
    this.shiftRecordDataTable = [];

    console.log('Enter to get All Shift Data Table Data');
    this.serviceApi.get2('/v1/attendance/settings/shift/').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            if (element.offShift == true) {
              this.shiftRecordDataTable.push({
                shiftRecordId: element.shiftRecordId,
                shiftName: element.shiftName,
                colorCode: element.colorCode,
                areTimingSame: element.areTimingSame,
                shiftStartTime: 'NA',
                shiftEndTime: 'NA',
                minHrsForCreditFullDay: element.minHrsForCreditFullDay,
                minHrsForCreditHalfDay: element.minHrsForCreditHalfDay,
                departmentId: element.departmentIds,
                locationId: element.locationIds,
                designationId: element.designationIds,
                bandId: element.bandIds,
                isHalfDayApplicable: element.isHalfDayApplicable,
                earliestArrival: element.earliestArrival,
                latestDeparture: element.latestDeparture,
                firstHalfDuration: element.firstHalfDuration,
                secondHalfDuration: element.secondHalfDuration,
                nextDayShiftOutTime: element.nextDayShiftOutTime,
                attendanceShiftType: element.attendanceShiftType,
                offShift: element.offShift
              });
            }
            else if (element.offShift == false) {
              this.shiftRecordDataTable.push({
                shiftRecordId: element.shiftRecordId,
                shiftName: element.shiftName,
                colorCode: element.colorCode,
                areTimingSame: element.areTimingSame,
                shiftStartTime: element.shiftStartTime,
                shiftEndTime: element.shiftEndTime,
                minHrsForCreditFullDay: element.minHrsForCreditFullDay,
                minHrsForCreditHalfDay: element.minHrsForCreditHalfDay,
                departmentId: element.departmentIds,
                locationId: element.locationIds,
                designationId: element.designationIds,
                bandId: element.bandIds,
                isHalfDayApplicable: element.isHalfDayApplicable,
                earliestArrival: element.earliestArrival,
                latestDeparture: element.latestDeparture,
                firstHalfDuration: element.firstHalfDuration,
                secondHalfDuration: element.secondHalfDuration,
                nextDayShiftOutTime: element.nextDayShiftOutTime,
                attendanceShiftType: element.attendanceShiftType,
                offShift: element.offShift
              });
            }
          });
          this.dataSource = new MatTableDataSource(this.shiftRecordDataTable);
        } else {
          console.log('There is no Data Available');
        }
      }, err => {
        console.log('Enter in the Error Block');
        if (err.status === 404 || err.statusText === 'OK') {
          this.shiftRecordDataTable = [];
          this.dataSource = new MatTableDataSource(this.shiftRecordDataTable);
        }
      }, () => {
        this.dt.reset();

      }
    );
  }
}

// ---------------- Attendance Shift delete model start ------------------------
@Component({
  templateUrl: 'attendance-shift-delete-dialog.html',
  styleUrls: ['delete-dialog-model.scss']
})
export class AttdShiftDeleteDialogComponent implements OnInit {
  action: any;
  error: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AttdShiftDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onDelete() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.shiftRecordId);
    const val = this.data.shiftRecordId;
    this.serviceApi.delete('/v1/attendance/settings/shift/' + +val).subscribe(
      res => {
        console.log('Applied Leave Successfully...' + JSON.stringify(res));
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );
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
// ---------------------- Attendance Shift delete model end ------------------------

export interface Element {
  shiftRecordId: number;
  shiftName: string;
  colorCode: string;
  areTimingSame: boolean;
  shiftStartTime: string;
  shiftEndTime: string;
  minHrsForCreditFullDay: string;
  minHrsForCreditHalfDay: string;
}