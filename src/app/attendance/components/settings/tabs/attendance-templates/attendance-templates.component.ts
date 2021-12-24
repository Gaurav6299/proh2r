import { Component, OnInit, ViewChild, AfterViewInit, OnChanges, Inject, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatPaginator, MatSort, MatRadioChange } from '@angular/material';
// import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Routes } from '@angular/router';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { element } from '@angular/core/src/render3/instructions';
import { MouseEvent, GoogleMapsAPIWrapper, MarkerManager, AgmMap, MapsAPILoader } from '@agm/core'
import { delay } from 'rxjs/operators';
import { DataTable, SelectItem } from 'primeng/primeng';
declare var google;
declare var $: any;

@Component({
  selector: 'app-attendance-templates',
  templateUrl: './attendance-templates.component.html',
  styleUrls: ['./attendance-templates.component.scss']
})
export class AttendanceTemplatesComponent implements OnChanges, AfterViewInit {
  columns = [
    { field: 'templateName', header: 'Template Name' },
    { field: 'totalEmpCovered', header: 'No. Of Employee Covered' },
    { field: 'action', header: 'Action' }
  ]
  @ViewChild("dt1") dt: DataTable;
  locationDataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  panelFirstWidth: any;
  panelFirstHeight: any;
  attendanceTemplateSettings: FormGroup;
  attendanceRegularizationSettings: FormGroup;
  LateMarksAndEarlyCheckOuts: FormGroup;
  overTimePolicy: FormGroup;
  addEditHeader: any;
  isLeftVisible: any;
  getAttendanceTemplateDataArray = [];
  getAttendanceTemplateDataArray1 = [];
  templateSettingsSteps = 1;
  notification = 0;
  templateResponse: any;
  overTime: any;
  supervisorList = [];
  nextStepNo: any;
  addLateMarkPolicy: any;
  addEarlyMarkPolicy: any;
  addLateEarlyMarkPolicy: any;
  overTimeCalculated: any;
  attdIPconfigList: any;
  notificationMsg: any;
  action: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  requiredDateButton;
  isDisabled: any = false;
  editTemplateName: any;
  slectedId: any;
  checkAdmin: boolean;
  check1: boolean;
  myControl = new FormControl();
  optionsData = this.supervisorList;
  displayedColumnsLocations = ['locationName', 'longitude', 'latitude', 'radius', 'actions'];
  dataSourceLocations: MatTableDataSource<Element>;
  locationsList = [];
  allSelections = [];
  leaveCategory = [];
  showHideSeqDays: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  empRegReqNotifToAdmin: boolean = false;
  empRegReqNotifToSupervisor: boolean = false;
  supRegReqNotifToAdmin: boolean = false;
  supRegReqNotifToEmp: boolean = false;
  adminRegReqNotifToSup: boolean = false;
  adminRegReqNotifToEmp: boolean = false;

  weeklyOffs = [{ value: '1', viewValue: 'Mon', selected: false },
  { value: '2', viewValue: 'Tue', selected: false },
  { value: '3', viewValue: 'Wed', selected: false },
  { value: '4', viewValue: 'Thu', selected: false },
  { value: '5', viewValue: 'Fri', selected: false },
  { value: '6', viewValue: 'Sat', selected: false },
  { value: '7', viewValue: 'Sun', selected: false }
  ]
  weeklyOffsHalfDays = [{ value: '1', viewValue: 'Mon', selected: false, disabled: true },
  { value: '2', viewValue: 'Tue', selected: false, disabled: true },
  { value: '3', viewValue: 'Wed', selected: false, disabled: true },
  { value: '4', viewValue: 'Thu', selected: false, disabled: true },
  { value: '5', viewValue: 'Fri', selected: false, disabled: true },
  { value: '6', viewValue: 'Sat', selected: false, disabled: true },
  { value: '7', viewValue: 'Sun', selected: false, disabled: true }
  ]
  seqAppDays = [{ value: '1', viewValue: 'Mon', selected: false, disabled: true },
  { value: '2', viewValue: 'Tue', selected: false, disabled: true },
  { value: '3', viewValue: 'Wed', selected: false, disabled: true },
  { value: '4', viewValue: 'Thu', selected: false, disabled: true },
  { value: '5', viewValue: 'Fri', selected: false, disabled: true },
  { value: '6', viewValue: 'Sat', selected: false, disabled: true },
  { value: '7', viewValue: 'Sun', selected: false, disabled: true }
  ]

  hierarchy = [];
  selectedHierarchy = [];

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.locationDataSource.filter = filterValue;
  }

  getAttendanceProcessHierarchy(tempId: any) {
    this.hierarchy = [];
    this.selectedHierarchy = [];
    var url = '';
    if (tempId != "") {
      url = "/v1/attendance/settings/templates/hierarchy?tempId=" + tempId;
    } else {
      url = "/v1/attendance/settings/templates/hierarchy";
    }

    this.serviceApi.get(url).subscribe(
      res => {
        this.hierarchy = res.available;
        this.selectedHierarchy = res.selected;
      }, (err) => {

      }, () => {
        console.log(JSON.stringify(this.leaveCategory));
      });
  }

  getAllLeaveCategories() {
    this.leaveCategory = [];
    this.serviceApi.get('/v1/leave/settings/leaveCategories').subscribe(
      res => {
        res.forEach(element => {
          this.leaveCategory = [...this.leaveCategory, {
            "categoryId": element.categoryId,
            "leaveName": element.leaveName
          }];
        });
      }, (err) => {

      }, () => {
        console.log(JSON.stringify(this.leaveCategory));
      });

  }
  openAddLocationDialog() {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      width: '1200px',
      height: '600px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.templateResponse, title: "Add New Location" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

            this.getAllLocations();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }
  openUpdateLocation(data: any) {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      width: '1200px',
      height: '600px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.templateResponse, locationInfo: data, title: "Update Location" }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

            this.getAllLocations();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }

    });
  }
  openDeleteLocationDialog(locationRestrictionsId: any) {
    const dialogRef = this.dialog.open(DeleteLocationComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { locationRestrictionsId: locationRestrictionsId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.successNotification(result.message);
          this.getAllLocations();
        }
      }
    });
  }

  onMove(event: any) {
    event.items.forEach((element, i) => {
      if (element.value == 'LOP' || element.value == 'PRESENT') {
        this.warningNotification('You cannot unselect the ' + element.viewValue + ' Day category');
        this.selectedHierarchy.push(element);
        var index = this.hierarchy.findIndex(hierarchy => hierarchy.value == element.value);
        if (index != undefined)
          this.hierarchy.splice(index, 1);
      }

    });

  }
  getAllLocations() {
    this.locationsList = [];
    this.serviceApi.get('/v1/attendance/settings/templates/location/' + this.templateResponse).subscribe(res => {
      res.forEach(element => {
        this.locationsList.push(element);
      });
    }, (err) => {

    }, () => {
      this.locationDataSource = new MatTableDataSource(this.locationsList);
      this.locationDataSource.paginator = this.paginator;
      this.locationDataSource.sort = this.sort;
      console.log(this.locationsList);
    });

  }
  constructor(private serviceApi: ApiCommonService, private fb: FormBuilder, public dialog: MatDialog,
    private validationMessagesService: ValidationMessagesService, private ref: ChangeDetectorRef) {
    console.log(this.isLeftVisible);
    this.attendanceTemplateSettings = this.fb.group({
      attdTemplateId: [],
      templateName: [],
      attdcaptureModes: [],
      singleMissingCheckInCheckOut: [],
      minHourForWeek: [],
      minMinutesForWeek: [],
      empReceiveNotification: [null, Validators.required],
      // minHourForFullDay: [null, Validators.required],
      // minMinuteForFullDay: [null, Validators.required],
      // halfDayApplicable: [null, Validators.required],
      // minHoursForHalfDay: [null],
      // minMinuteForHalfDay: [null],
      supervisorReceiveNotification: [null, Validators.required],
      commentMandatoryforRegReq: [null, Validators.required],
      attendanceApprovalType: [null, Validators.required],
      templateApprover: [],
      allSelections: [],
      weeklyOffs: new FormControl([]),
      weekOffSequence: [null, Validators.required],
      halfAppDays: new FormControl([]),
      seqAppDays: new FormControl([]),
      isLateComingEarlyGoingAllowed: [null, Validators.required],
      lateComingAndEarlyGoingDays: [null],
      graceTimeLimit: [null],
      isDefaultersLeaveDeductible: [null, Validators.required],
      leaveCategory: [null],
      templateFrequency: [null]
    });
    this.getListOfSupervisor();
    // this.getAllLocations();
    this.attendanceRegularizationSettings = this.fb.group({
      restrictIpAddress: [null, Validators.required],
      restrictCheckInCheckOutLocation: [null, Validators.required],
      restrictedGeoLocationType: [null],
      attRegularizationTemplateId: [],
      empRegularizeOwnAttendance: ['', Validators.required],
      empRegReqNotifToSupervisor: [],
      supervisorRegSubordinateAtt: [null, Validators.required],
      supRegReqNotifToAdmin: [],
      supRegReqNotifToEmp: [],
      adminEditRegularizeAtt: [null, Validators.required],
      empRegReqNotifToAdmin: [],
      adminRegReqNotifToSup: [],
      adminRegReqNotifToEmp: [],
      attdEmailNotification: [null],
      adminShouldReceiveNotification: [],
      supervisorShouldReceiveNotification: [],
      employeesShouldReceiveNotification: [],
      attdIPconfig: this.fb.array([this.initItemRows()])
    });
    this.getAttendanceTemplateData();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    var rolesArr = KeycloakService.getUserRole();
    this.getAllLeaveCategories();

  }

  ngOnInit() {
    this.getCriteria();

    this.attendanceTemplateSettings.controls.halfAppDays.valueChanges.subscribe(e => {
      this.attendanceTemplateSettings.controls.halfAppDays.patchValue(e, { emitEvent: false });
    });
    this.attendanceTemplateSettings.controls.seqAppDays.valueChanges.subscribe(e => {
      this.attendanceTemplateSettings.controls.seqAppDays.patchValue(e, { emitEvent: false });
    });
  }

  ngOnChanges() {
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
  searchEmployeeName(data: any) {
    this.optionsData = this.supervisorList.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }
  setPanel() {
    console.log(this.isLeftVisible);
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  addPolicy() {
    $('.divtoggleDiv')[1].style.display = 'block';
  }


  getListOfSupervisor() {
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
      res => {
        res.forEach(element => {

          console.log('element.empFirstName' + element.empFirstName);
          this.supervisorList.push({
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode
          });
        });

      },
      () => {
        console.log('Enter into Else Bloack');
      }
      );
  }
  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").pipe(delay(500)).subscribe(
      res => {
        res.forEach(element => {

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
            if (element.locationCode != null) {
              this.allSelections = [...this.allSelections, {
                value: element.locationId,
                viewValue: element.locationCode.toUpperCase() + ' - ' + element.cityName,
                type: 'Locations'
              }];
            }
          });
        }
      }, (err) => {

      }, () => {

      });
  }


  getAttendanceTemplateData() {
    let ipAddress = [];
    this.getAttendanceTemplateDataArray = []
    this.serviceApi.get2('/v1/attendance/settings/templates/')
      .subscribe(
      res => {
        console.log('Get Template records....' + JSON.stringify(res));
        res.forEach(element => {
          ipAddress = [];
          console.log('************');
          console.log(element);
          if (element.attendanceRegularizationTemplateVO !== null
            && element.attendanceRegularizationTemplateVO.attdIPconfigVOList !== null) {
            element.attendanceRegularizationTemplateVO.attdIPconfigVOList.forEach(element => {
              console.log('.........fjfid');
              console.log(element);
              ipAddress.push({
                ipAddress: element.ipAddress
              });
            });
          }

          this.getAttendanceTemplateDataArray.push({
            attdTemplateId: element.attdTemplateId,
            templateName: element.templateName,
            totalEmpCovered: element.totalEmpCovered,
            attdcaptureModes: element.attdcaptureModes,
            singleMissingCheckInCheckOut: element.singleMissingCheckInCheckOut,
            minHourForWeek: element.minHourForWeek,
            empReceiveNotification: element.empReceiveNotification,
            // halfDayApplicable: element.halfDayApplicable,
            // minHourForFullDay: element.minHourForFullDay,
            // minHoursForHalfDay: element.minHoursForHalfDay,
            supervisorReceiveNotification: element.supervisorReceiveNotification,
            commentMandatoryforRegReq: element.commentMandatoryforRegReq,
            attendanceApprovalType: element.attendanceApprovalType,
            templateApprover: element.templateApprover,

            restrictIpAddress: (element.attendanceRegularizationTemplateVO != null && element.attendanceRegularizationTemplateVO.restrictIpAddress != null) ? element.attendanceRegularizationTemplateVO.restrictIpAddress : null,
            restrictCheckInCheckOutLocation: (element.attendanceRegularizationTemplateVO != null && element.attendanceRegularizationTemplateVO.restrictCheckInCheckOutLocation != null) ? "" + element.attendanceRegularizationTemplateVO.restrictCheckInCheckOutLocation + "" : null,
            restrictedGeoLocationType: (element.attendanceRegularizationTemplateVO != null && element.attendanceRegularizationTemplateVO.restrictedGeoLocationType != null) ? element.attendanceRegularizationTemplateVO.restrictedGeoLocationType : null,
            empRegularizeOwnAttendance: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.empRegularizeOwnAttendance : null,
            empRegReqNotifToSupervisor: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.empRegReqNotifToSupervisor : null,
            supervisorRegSubordinateAtt: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.supervisorRegSubordinateAtt : null,
            supRegReqNotifToAdmin: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.supRegReqNotifToAdmin : null,
            supRegReqNotifToEmp: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.supRegReqNotifToEmp : null,
            adminEditRegularizeAtt: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.adminEditRegularizeAtt : null,
            empRegReqNotifToAdmin: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.empRegReqNotifToAdmin : null,
            adminRegReqNotifToSup: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.adminRegReqNotifToSup : null,
            adminRegReqNotifToEmp: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.adminRegReqNotifToEmp : null,
            attdEmailNotification: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.attdEmailNotification : null,
            adminShouldReceiveNotification: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.adminShouldReceiveNotification : null,
            supervisorShouldReceiveNotification: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.supervisorShouldReceiveNotification : null,
            employeesShouldReceiveNotification: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.employeesShouldReceiveNotification : null,
            attRegularizationTemplateId: element.attendanceRegularizationTemplateVO != null ? element.attendanceRegularizationTemplateVO.attRegularizationTemplateId : null,
            attdIPconfigList: ipAddress,
            departmentId: element.departmentId,
            locationId: element.locationId,
            designationId: element.designationId,
            bandId: element.bandId,
            weekOff: element.weekOff,
            isLateComingEarlyGoingAllowed: element.lateComingEarlyGoingAllowed,
            lateComingAndEarlyGoingDays: element.lateComingAndEarlyGoingDays,
            graceTimeLimit: element.graceTimeLimit,
            isDefaultersLeaveDeductible: element.defaultersLeaveDeductible,
            leaveCategory: (element.leaveCategory === "") ? null : element.leaveCategory,
            templateFrequency: element.templateFrequency
          });

        })

      },
      err => {
        console.log('error in saving');
      },

      () => {
        this.dt.reset();
        console.log('completed');
        console.log('this.getAttendanceTemplateData.............................................');
        console.log(this.getAttendanceTemplateDataArray);

      }
      );
  }
  getData() {
    this.getAttendanceTemplateData();
  }

  onChange(event: any, value) {
    if (event) {
      let i = this.weeklyOffsHalfDays.findIndex(x => x.value === value);
      this.weeklyOffsHalfDays[i].disabled = false;
      let y = this.seqAppDays.findIndex(x => x.value === value);
      this.seqAppDays[y].disabled = false;
      this.attendanceTemplateSettings.controls.halfAppDays.updateValueAndValidity();
      this.attendanceTemplateSettings.controls.seqAppDays.updateValueAndValidity();
    } else {
      let i = this.weeklyOffsHalfDays.findIndex(x => x.value === value);
      this.weeklyOffsHalfDays[i].disabled = true;
      let y = this.seqAppDays.findIndex(x => x.value === value);
      this.seqAppDays[y].disabled = true;
      this.attendanceTemplateSettings.controls.halfAppDays.updateValueAndValidity();
      this.attendanceTemplateSettings.controls.seqAppDays.updateValueAndValidity();

      if (this.attendanceTemplateSettings.controls.halfAppDays.value != null) {
        this.attendanceTemplateSettings.controls.halfAppDays.value.forEach((element, index) => {
          if (element === value) {
            this.attendanceTemplateSettings.controls.halfAppDays.value.splice(index, 1);
            this.attendanceTemplateSettings.controls.halfAppDays.updateValueAndValidity();
            return;
          }

        });
      }
      if (this.attendanceTemplateSettings.controls.seqAppDays.value != null) {
        this.attendanceTemplateSettings.controls.seqAppDays.value.forEach((element, index) => {
          if (element === value) {
            this.attendanceTemplateSettings.controls.seqAppDays.value.splice(index, 1);
            this.attendanceTemplateSettings.controls.seqAppDays.updateValueAndValidity();
            return;
          }

        });
      }
    }
  }



  addNewTemplate() {
    this.weeklyOffs = [{ value: '1', viewValue: 'Mon', selected: false },
    { value: '2', viewValue: 'Tue', selected: false },
    { value: '3', viewValue: 'Wed', selected: false },
    { value: '4', viewValue: 'Thu', selected: false },
    { value: '5', viewValue: 'Fri', selected: false },
    { value: '6', viewValue: 'Sat', selected: false },
    { value: '7', viewValue: 'Sun', selected: false }
    ]
    this.weeklyOffsHalfDays = [{ value: '1', viewValue: 'Mon', selected: false, disabled: true },
    { value: '2', viewValue: 'Tue', selected: false, disabled: true },
    { value: '3', viewValue: 'Wed', selected: false, disabled: true },
    { value: '4', viewValue: 'Thu', selected: false, disabled: true },
    { value: '5', viewValue: 'Fri', selected: false, disabled: true },
    { value: '6', viewValue: 'Sat', selected: false, disabled: true },
    { value: '7', viewValue: 'Sun', selected: false, disabled: true }
    ]
    this.seqAppDays = [{ value: '1', viewValue: 'Mon', selected: false, disabled: true },
    { value: '2', viewValue: 'Tue', selected: false, disabled: true },
    { value: '3', viewValue: 'Wed', selected: false, disabled: true },
    { value: '4', viewValue: 'Thu', selected: false, disabled: true },
    { value: '5', viewValue: 'Fri', selected: false, disabled: true },
    { value: '6', viewValue: 'Sat', selected: false, disabled: true },
    { value: '7', viewValue: 'Sun', selected: false, disabled: true }
    ]
    this.showHideSeqDays = false;
    this.templateSettingsSteps = 1;
    this.attendanceTemplateSettings.reset();
    this.editTemplateName = false;
    this.attendanceRegularizationSettings.reset();
    this.attendanceTemplateSettings.controls.weekOffSequence.setValue("NONE");
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.getAttendanceProcessHierarchy('');
  }
  cancelPanel() {
    this.attendanceTemplateSettings.reset();
    this.isLeftVisible = false;
    this.setPanel();
  }
  deleteAttendanceTemplate(value: any) {
    this.slectedId = value.attdTemplateId;
      this.action = '';
      this.notificationMsg = '';
      const dialogRef = this.dialog.open(TemplateDeleteComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          id: this.slectedId
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getAttendanceTemplateData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }

          }
        }
      });
  }

  editTemplate(element: any) {
    this.weeklyOffs = [{ value: '1', viewValue: 'Mon', selected: false },
    { value: '2', viewValue: 'Tue', selected: false },
    { value: '3', viewValue: 'Wed', selected: false },
    { value: '4', viewValue: 'Thu', selected: false },
    { value: '5', viewValue: 'Fri', selected: false },
    { value: '6', viewValue: 'Sat', selected: false },
    { value: '7', viewValue: 'Sun', selected: false }
    ]
    this.weeklyOffsHalfDays = [{ value: '1', viewValue: 'Mon', selected: false, disabled: true },
    { value: '2', viewValue: 'Tue', selected: false, disabled: true },
    { value: '3', viewValue: 'Wed', selected: false, disabled: true },
    { value: '4', viewValue: 'Thu', selected: false, disabled: true },
    { value: '5', viewValue: 'Fri', selected: false, disabled: true },
    { value: '6', viewValue: 'Sat', selected: false, disabled: true },
    { value: '7', viewValue: 'Sun', selected: false, disabled: true }
    ]
    this.seqAppDays = [{ value: '1', viewValue: 'Mon', selected: false, disabled: true },
    { value: '2', viewValue: 'Tue', selected: false, disabled: true },
    { value: '3', viewValue: 'Wed', selected: false, disabled: true },
    { value: '4', viewValue: 'Thu', selected: false, disabled: true },
    { value: '5', viewValue: 'Fri', selected: false, disabled: true },
    { value: '6', viewValue: 'Sat', selected: false, disabled: true },
    { value: '7', viewValue: 'Sun', selected: false, disabled: true }
    ]
    this.check1 = false;
    this.editTemplateName = true;
      this.isLeftVisible = !this.isLeftVisible;
      this.templateSettingsSteps = 1;
      $('.divtoggleDiv')[1].style.display = 'block';
      console.log(element);
      let selections = [];
      element.departmentId != null ? element.departmentId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Departments'
        });
      }) : '';
      element.bandId != null ? element.bandId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Bands'
        });
      }) : '';
      element.locationId != null ? element.locationId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Locations'
        });
      }) : '';
      element.designationId != null ? element.designationId.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Designations'
        });
      }) : '';
      console.log(selections);
      this.attendanceTemplateSettings.reset();
      console.log('edit attendance Template');

      this.attendanceTemplateSettings.controls.attdcaptureModes.setValue(element.attdcaptureModes);

      // console.log(this.attendanceRegularizationSettings.controls.restrictIpAddress.value);
      this.attendanceTemplateSettings.controls.attdTemplateId.setValue(element.attdTemplateId);
      this.attendanceTemplateSettings.controls.templateName.setValue(element.templateName);
      this.attendanceTemplateSettings.controls.singleMissingCheckInCheckOut.setValue(element.singleMissingCheckInCheckOut);
      var hhmm = element.minHourForWeek.split(":")
      this.attendanceTemplateSettings.controls.minHourForWeek.setValue(hhmm[0]);
      this.attendanceTemplateSettings.controls.minMinutesForWeek.setValue(hhmm[1]);
      this.attendanceTemplateSettings.controls.empReceiveNotification.setValue('' + element.empReceiveNotification);
      // this.attendanceTemplateSettings.controls.minHourForFullDay.setValue(element.minHourForFullDay.split(":")[0]);
      // this.attendanceTemplateSettings.controls.minMinuteForFullDay.setValue(element.minHourForFullDay.split(":")[1]);
      // this.attendanceTemplateSettings.controls.halfDayApplicable.setValue('' + element.halfDayApplicable);
      this.attendanceTemplateSettings.controls.supervisorReceiveNotification.setValue('' + element.supervisorReceiveNotification);
      // this.attendanceTemplateSettings.controls.minHoursForHalfDay.setValue(element.minHoursForHalfDay.split(":")[0]);
      // this.attendanceTemplateSettings.controls.minMinuteForHalfDay.setValue(element.minHoursForHalfDay.split(":")[1]);
      this.attendanceTemplateSettings.controls.commentMandatoryforRegReq.setValue('' + element.commentMandatoryforRegReq);
      this.attendanceTemplateSettings.controls.attendanceApprovalType.setValue(element.attendanceApprovalType);
      this.attendanceTemplateSettings.controls.templateApprover.setValue(element.templateApprover);
      this.attendanceTemplateSettings.controls.allSelections.patchValue(selections);


      this.attendanceTemplateSettings.controls.isLateComingEarlyGoingAllowed.patchValue("" + element.isLateComingEarlyGoingAllowed);
      this.attendanceTemplateSettings.controls.lateComingAndEarlyGoingDays.patchValue(element.lateComingAndEarlyGoingDays);
      this.attendanceTemplateSettings.controls.graceTimeLimit.patchValue(element.graceTimeLimit);
      this.attendanceTemplateSettings.controls.isDefaultersLeaveDeductible.patchValue("" + element.isDefaultersLeaveDeductible);
      this.attendanceTemplateSettings.controls.leaveCategory.patchValue((element.leaveCategory != null) ? +element.leaveCategory : null);
      this.attendanceTemplateSettings.controls.templateFrequency.setValue(element.templateFrequency);



      // this.attendanceRegularizationSettings.controls.attdIPconfig.setValue(element.ipAddress);
      const arr1 = [];
      const arr2 = [];
      const arr3 = [];
      if (element.weekOff.weekOffDays != null) {
        element.weekOff.weekOffDays.forEach(element => {
          arr1.push(element);
          this.weeklyOffsHalfDays.forEach(element1 => {
            if (element1.value === element) {
              element1.disabled = false;
            }
          })
          this.seqAppDays.forEach(element2 => {
            if (element2.value === element) {
              element2.disabled = false;
            }
          })
        });
        this.attendanceTemplateSettings.controls.weeklyOffs.setValue(arr1);
      }
      if (element.weekOff.halfAppDays != null) {
        element.weekOff.halfAppDays.forEach(element => {
          arr2.push(element);

        });
        this.attendanceTemplateSettings.controls.halfAppDays.setValue(arr2);
      }
      if (element.weekOff.seqAppDays != null) {
        element.weekOff.seqAppDays.forEach(element => {
          arr3.push(element)

        });
        this.attendanceTemplateSettings.controls.seqAppDays.setValue(arr3);
      }
      this.attendanceTemplateSettings.controls.weeklyOffs.updateValueAndValidity();
      this.attendanceTemplateSettings.controls.halfAppDays.updateValueAndValidity();
      this.attendanceTemplateSettings.controls.seqAppDays.updateValueAndValidity();
      this.attendanceTemplateSettings.controls.weekOffSequence.setValue(element.weekOff.weekOffSequence);
      this.attendanceRegularizationSettings.controls.attRegularizationTemplateId.setValue(element.attRegularizationTemplateId);
      this.attendanceRegularizationSettings.controls.restrictIpAddress.setValue('' + element.restrictIpAddress);
      this.attendanceRegularizationSettings.controls.empRegularizeOwnAttendance.setValue('' + element.empRegularizeOwnAttendance);

      this.attendanceRegularizationSettings.controls.empRegReqNotifToSupervisor.setValue(false + element.empRegReqNotifToSupervisor);
      this.attendanceRegularizationSettings.controls.supRegReqNotifToAdmin.setValue(false + element.supRegReqNotifToAdmin);
      this.attendanceRegularizationSettings.controls.supRegReqNotifToEmp.setValue(false + element.supRegReqNotifToEmp);
      this.attendanceRegularizationSettings.controls.adminEditRegularizeAtt.setValue('' + element.adminEditRegularizeAtt);
      this.attendanceRegularizationSettings.controls.empRegReqNotifToAdmin.setValue(false + element.empRegReqNotifToAdmin);
      this.attendanceRegularizationSettings.controls.adminRegReqNotifToSup.setValue(false + element.adminRegReqNotifToSup);
      this.attendanceRegularizationSettings.controls.adminRegReqNotifToEmp.setValue(false + element.adminRegReqNotifToEmp);
      this.attendanceRegularizationSettings.controls.attdEmailNotification.setValue(element.attdEmailNotification);

      this.attendanceRegularizationSettings.controls.restrictCheckInCheckOutLocation.setValue(element.restrictCheckInCheckOutLocation);
      this.attendanceRegularizationSettings.controls.restrictedGeoLocationType.setValue(element.restrictedGeoLocationType);

      if (element.adminShouldReceiveNotification) {

        this.attendanceRegularizationSettings.controls.adminShouldReceiveNotification.setValue('' + element.adminShouldReceiveNotification);
      }
      if (element.supervisorShouldReceiveNotification) {
        this.attendanceRegularizationSettings.controls.supervisorShouldReceiveNotification.setValue('' + element.supervisorShouldReceiveNotification);
      }
      if (element.employeesShouldReceiveNotification) {
        this.attendanceRegularizationSettings.controls.employeesShouldReceiveNotification.setValue('' + element.employeesShouldReceiveNotification);
      }
      this.attendanceRegularizationSettings.controls.supervisorRegSubordinateAtt.setValue('' + element.supervisorRegSubordinateAtt);
      const control = <FormArray>this.attendanceRegularizationSettings.controls['attdIPconfig'];
      while (control.length !== 0) {
        control.removeAt(0);
      }
      element.attdIPconfigList.forEach(element1 => {
        console.log('Controls.....' + element1.ipAddress);
        control.push(
          this.fb.group({
            ipAddress: [element1.ipAddress]
          })
        );
      });

      if (element.weekOff.weekOffSequence === "EVEN" || element.weekOff.weekOffSequence === "ODD") {
        this.showHideSeqDays = true;
      }
    this.getAttendanceProcessHierarchy(this.attendanceTemplateSettings.controls.attdTemplateId.value);
  }

  lateComingOrEarlyGoingApplicable(event: any) {
    console.log(event);
    this.attendanceTemplateSettings.controls.lateComingAndEarlyGoingDays.clearValidators();
    this.attendanceTemplateSettings.controls.graceTimeLimit.clearValidators();
    this.attendanceTemplateSettings.controls.leaveCategory.clearValidators();
    this.attendanceTemplateSettings.controls.isDefaultersLeaveDeductible.clearValidators();
    this.attendanceTemplateSettings.controls.templateFrequency.clearValidators();
    if (event.value == "false") {
      this.attendanceTemplateSettings.controls.lateComingAndEarlyGoingDays.setValue(null);
      this.attendanceTemplateSettings.controls.graceTimeLimit.setValue(null);
      this.attendanceTemplateSettings.controls.leaveCategory.setValue(null);
      this.attendanceTemplateSettings.controls.isDefaultersLeaveDeductible.setValue(null);
      this.attendanceTemplateSettings.controls.templateFrequency.setValue(null);
    } else {
      this.attendanceTemplateSettings.controls.lateComingAndEarlyGoingDays.setValidators(Validators.required);
      this.attendanceTemplateSettings.controls.graceTimeLimit.setValidators(Validators.required);
      this.attendanceTemplateSettings.controls.leaveCategory.setValidators(Validators.required);
      this.attendanceTemplateSettings.controls.isDefaultersLeaveDeductible.setValidators(Validators.required);
      this.attendanceTemplateSettings.controls.templateFrequency.setValidators(Validators.required);
    }
    this.attendanceTemplateSettings.controls.lateComingAndEarlyGoingDays.updateValueAndValidity();
    this.attendanceTemplateSettings.controls.graceTimeLimit.updateValueAndValidity();
    this.attendanceTemplateSettings.controls.leaveCategory.updateValueAndValidity();
    this.attendanceTemplateSettings.controls.isDefaultersLeaveDeductible.updateValueAndValidity();
    this.attendanceTemplateSettings.controls.templateFrequency.updateValueAndValidity();
  }

  isDefaultersLeaveDeductibleChange(event: any) {
    console.log(event);
    this.attendanceTemplateSettings.controls.leaveCategory.clearValidators();
    if (event.value == "true") {
      this.attendanceTemplateSettings.controls.leaveCategory.setValidators(Validators.required);
    } else {
      this.attendanceTemplateSettings.controls.leaveCategory.setValue(null);
    }
    this.attendanceTemplateSettings.controls.leaveCategory.updateValueAndValidity();
  }

  selectedRadioButton(event: any) {
    console.log(event.value);
    if (event.value == 'EMPLOYEEWISE') {
      this.attendanceTemplateSettings.controls.templateApprover.setValue(null)
    }
  }
  selectedIpAddress(event: any) {
    console.log(event.value)

    if (event.value == 'false') {
      const control = <FormArray>this.attendanceRegularizationSettings.controls['attdIPconfig'];
      while (control.length !== 0) {
        control.removeAt(0);
      }
    }
    else {
      const control = <FormArray>this.attendanceRegularizationSettings.controls['attdIPconfig'];
      while (control.length !== 0) {
        control.removeAt(0);
      }
    }
  }

  // isHalfDayApplicable() {
  //   if (this.attendanceTemplateSettings.controls.halfDayApplicable.value === 'true') {
  //     this.attendanceTemplateSettings.controls.minHoursForHalfDay.setValue(null)
  //     this.attendanceTemplateSettings.controls.minHoursForHalfDay.setValidators([Validators.required, Validators.min(0), Validators.max(24)]);
  //   } else {
  //     this.attendanceTemplateSettings.controls.minHoursForHalfDay.clearValidators();
  //     this.attendanceTemplateSettings.controls.minHoursForHalfDay.updateValueAndValidity();
  //   }
  // }
  attendanceApprovalType() {
    if (this.attendanceTemplateSettings.controls.attendanceApprovalType.value === 'TEMPLATEWISE') {
      this.myControl.reset();
      this.attendanceTemplateSettings.controls.templateApprover.setValue(null);
      this.attendanceTemplateSettings.controls.templateApprover.setValidators([Validators.required]);
    } else if (this.attendanceTemplateSettings.controls.attendanceApprovalType.value === 'EMPLOYEEWISE') {
      this.attendanceTemplateSettings.controls.templateApprover.clearValidators();
      this.attendanceTemplateSettings.controls.templateApprover.updateValueAndValidity();
    }
  }
  resetSearch() {
    this.myControl.setValue('');
    this.optionsData = this.supervisorList;
  }
  selectedEmpReg(event: any) {
    console.log(event.value);
    if (event.value) {
      this.adminRegReqNotifToEmp = false;
      this.empRegReqNotifToSupervisor = false;
    }
    // if (event.value == 'false') {
    //   this.attendanceRegularizationSettings.controls.adminRegReqNotifToEmp.setValue(false);
    //   this.attendanceRegularizationSettings.controls.empRegReqNotifToSupervisor.setValue(false);
    // } else {
    //   this.attendanceRegularizationSettings.controls.adminRegReqNotifToEmp.setValue(false);
    //   this.attendanceRegularizationSettings.controls.empRegReqNotifToSupervisor.setValue(false);
    // }
  }
  selectedSubordinate(event: any) {
    console.log(event.value);
    if (event.value) {
      this.supRegReqNotifToAdmin = false;
      this.supRegReqNotifToEmp = false;
    }
    // if (event.value == 'false') {
    //   this.attendanceRegularizationSettings.controls.supRegReqNotifToAdmin.setValue(false);
    //   this.attendanceRegularizationSettings.controls.supRegReqNotifToEmp.setValue(false);
    // }
    // else {
    //   this.attendanceRegularizationSettings.controls.supRegReqNotifToAdmin.setValue(false);
    //   this.attendanceRegularizationSettings.controls.supRegReqNotifToEmp.setValue(false);
    // }
  }
  selectedRegularize(event: any) {
    console.log(event.value);
    if (event.value) {
      this.adminRegReqNotifToSup = false;
      this.adminRegReqNotifToEmp = false;
    }
    // if (event.value == 'false') {
    //   this.attendanceRegularizationSettings.controls.adminRegReqNotifToSup.setValue(false);
    //   this.attendanceRegularizationSettings.controls.adminRegReqNotifToEmp.setValue(false);
    // }
  }

  selectedRadioButton1(event: any) {
    console.log(event.value);
    if (event.value == 'DONTNOTIFY') {
      this.attendanceRegularizationSettings.controls.adminShouldReceiveNotification.setValue(false)
      this.attendanceRegularizationSettings.controls.supervisorShouldReceiveNotification.setValue(false)
      this.attendanceRegularizationSettings.controls.employeesShouldReceiveNotification.setValue(false)
    }
    else {
      console.log('Inside else')
    }
  }

  addNewRow() {
    console.log('print.....');
    const control = <FormArray>this.attendanceRegularizationSettings.controls['attdIPconfig'];
    control.push(this.initItemRows());
  }
  deleteRow(index: number) {
    const control = <FormArray>this.attendanceRegularizationSettings.controls['attdIPconfig'];
    control.removeAt(index);
  }

  initItemRows() {
    const ipPattern =
      "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    console.log('print .....');
    return this.fb.group({
      ipAddress: ['', [Validators.required, Validators.pattern(ipPattern)]]

    });
  }

  saveFirstStepRecord(attendanceTemplateValidate: any) {
    var check = attendanceTemplateValidate;
    this.check1 = true;
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    console.log(check.valid);
    if (check.valid && this.attendanceTemplateSettings.controls.templateName.value && this.attendanceTemplateSettings.controls.attdcaptureModes.value && this.attendanceTemplateSettings.controls.singleMissingCheckInCheckOut.value && this.attendanceTemplateSettings.controls.minHourForWeek.value && this.attendanceTemplateSettings.controls.minMinutesForWeek.value) {
      this.isValidFormSubmitted = true;
      this.isDisabled = true;
      let selections = this.attendanceTemplateSettings.controls.allSelections.value;
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

      var body = {
        'bandId': bandIds,
        'departmentId': deptIds,
        'designationId': designationIds,
        'locationId': locationIds,
        "templateName": this.attendanceTemplateSettings.controls.templateName.value,
        "attendanceApprovalType": this.attendanceTemplateSettings.controls.attendanceApprovalType.value,
        "empReceiveNotification": this.attendanceTemplateSettings.controls.empReceiveNotification.value,
        "attdcaptureModes": this.attendanceTemplateSettings.controls.attdcaptureModes.value,
        "minHourForWeek": this.attendanceTemplateSettings.controls.minHourForWeek.value + ":" + this.attendanceTemplateSettings.controls.minMinutesForWeek.value,
        // "minHourForFullDay": this.attendanceTemplateSettings.controls.minHourForFullDay.value + ":" + this.attendanceTemplateSettings.controls.minMinuteForFullDay.value,
        "commentMandatoryforRegReq": this.attendanceTemplateSettings.controls.commentMandatoryforRegReq.value,
        // "halfDayApplicable": this.attendanceTemplateSettings.controls.halfDayApplicable.value,
        // "minHoursForHalfDay": this.attendanceTemplateSettings.controls.minHoursForHalfDay.value + ":" + this.attendanceTemplateSettings.controls.minMinuteForHalfDay.value,
        "supervisorReceiveNotification": " " + this.attendanceTemplateSettings.controls.supervisorReceiveNotification.value,
        "templateApprover": this.attendanceTemplateSettings.controls.templateApprover.value,
        "singleMissingCheckInCheckOut": this.attendanceTemplateSettings.controls.singleMissingCheckInCheckOut.value,
        "weekOffDays": this.attendanceTemplateSettings.controls.weeklyOffs.value,
        "weekOffSequence": this.attendanceTemplateSettings.controls.weekOffSequence.value,
        "halfAppDays": this.attendanceTemplateSettings.controls.halfAppDays.value,
        "seqAppDays": this.attendanceTemplateSettings.controls.seqAppDays.value,
        "lateComingEarlyGoingAllowed": this.attendanceTemplateSettings.controls.isLateComingEarlyGoingAllowed.value,
        "lateComingAndEarlyGoingDays": this.attendanceTemplateSettings.controls.lateComingAndEarlyGoingDays.value,
        "graceTimeLimit": this.attendanceTemplateSettings.controls.graceTimeLimit.value,
        "defaultersLeaveDeductible": this.attendanceTemplateSettings.controls.isDefaultersLeaveDeductible.value,
        "leaveCategory": this.attendanceTemplateSettings.controls.leaveCategory.value,
        "templateFrequency": this.attendanceTemplateSettings.controls.templateFrequency.value,
        "attendanceHierarchy": this.selectedHierarchy.map(hierarchy => hierarchy.value)
      }
      console.log('.......' + JSON.stringify(body));

      if (this.attendanceTemplateSettings.controls.attdTemplateId.value != null) {
        console.log('Inside if');
        this.check1 = false;
        return this.serviceApi.put('/v1/attendance/settings/templates/' + this.attendanceTemplateSettings.controls.attdTemplateId.value, body)

          .subscribe(
          res => {
            console.log('Attendance Data Updated successfully');
            this.successNotification('Attendance Template Updated Successfully');
            console.log(res);
            this.templateResponse = res.attdTemplateId
            console.log(this.templateResponse)

          },
          err => {
            console.log('there is error in edit api');
            // this.warningNotification(err.message);
            console.log(err)
          },
          () => {
            this.templateSettingsSteps = 2
            this.getAllLocations();
          }
          )
      }

      else {
        console.log('Inside else');
        this.check1 = false;
        return this.serviceApi.post('/v1/attendance/settings/templates/', body)

          .subscribe(
          res => {
            this.successNotification('Attendance Data Saved Successfully');
            console.log(res);
            this.templateResponse = res.attdTemplateId
            console.log(this.templateResponse)

          },
          err => {
            // this.warningNotification(err.message);

          },
          () => {
            this.templateSettingsSteps = 2
            this.getAllLocations();
          },

        )
      }

    }
    else {
      Object.keys(this.attendanceTemplateSettings.controls).forEach(field => { // {1}
        const control = this.attendanceTemplateSettings.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });

    }

  }

  selectRoutineType($event: MatRadioChange) {
    if (this.attendanceTemplateSettings.controls.weekOffSequence.value === 'ODD' || this.attendanceTemplateSettings.controls.weekOffSequence.value === 'EVEN') {
      this.showHideSeqDays = true;
      this.attendanceTemplateSettings.controls.seqAppDays.setValidators([Validators.required]);
      this.attendanceTemplateSettings.controls.seqAppDays.updateValueAndValidity();
    } else {
      this.showHideSeqDays = false;
      this.attendanceTemplateSettings.controls.seqAppDays.setValue([]);
      this.attendanceTemplateSettings.controls.seqAppDays.clearValidators();
      this.attendanceTemplateSettings.controls.seqAppDays.updateValueAndValidity();
    }
  }
  selectedMarksDeduction(event: any) {
    if (event.value === 'COMBINATION') {
      console.log('Inside if' + event.value);
      const controlLateMarks = <FormArray>this.LateMarksAndEarlyCheckOuts.controls['lateMarkDeductions'];
      while (controlLateMarks.length !== 0) {
        controlLateMarks.removeAt(0);
      }
      const controlEarlyMarks = <FormArray>this.LateMarksAndEarlyCheckOuts.controls['earlyMarkDeductions'];
      while (controlEarlyMarks.length !== 0) {
        controlEarlyMarks.removeAt(0);
      }
    } else if (event.value === 'INDIVIDUAL') {
      console.log('Inside else' + event.value);
      const controlLateAndEarlyMarks = <FormArray>this.LateMarksAndEarlyCheckOuts.controls['lateAndEarlyMarkDeductionList'];
      while (controlLateAndEarlyMarks.length !== 0) {
        controlLateAndEarlyMarks.removeAt(0);
      }
    }
  }

  applyValidation() {
    this.attendanceRegularizationSettings.controls.restrictedGeoLocationType.clearValidators();
    if (this.attendanceRegularizationSettings.controls.restrictCheckInCheckOutLocation.value == 'true') {
      this.attendanceRegularizationSettings.controls.restrictedGeoLocationType.setValidators([Validators.required]);
    }
    this.attendanceRegularizationSettings.controls.restrictedGeoLocationType.updateValueAndValidity();


  }

  saveSecondStep() {

    if (this.attendanceRegularizationSettings.valid) {
      this.isDisabled = false;
      console.log('INSIDE IF');
      this.isValidFormSubmitted = true;

      let attdIPconfig = [];
      const control = <FormArray>this.attendanceRegularizationSettings.controls.attdIPconfig;
      control.controls.forEach(element => {
        console.log('element');
        console.log(element);
        attdIPconfig.push({
          'ipAddress': element.value.ipAddress
        });
      });
      console.log('save method callled');
      var body = {
        "restrictIpAddress": this.attendanceRegularizationSettings.controls.restrictIpAddress.value,
        "attdIPconfig": attdIPconfig,
        "attendanceTemplates":
          {
            attdTemplateId: this.templateResponse,
          },
        "empRegularizeOwnAttendance": this.attendanceRegularizationSettings.controls.empRegularizeOwnAttendance.value,
        "empRegReqNotifToAdmin": this.attendanceRegularizationSettings.controls.empRegReqNotifToAdmin.value,
        "supRegReqNotifToEmp": this.attendanceRegularizationSettings.controls.supRegReqNotifToEmp.value,
        "supervisorRegSubordinateAtt": this.attendanceRegularizationSettings.controls.supervisorRegSubordinateAtt.value,
        "adminRegReqNotifToSup": this.attendanceRegularizationSettings.controls.adminRegReqNotifToSup.value,
        "empRegReqNotifToSupervisor": this.attendanceRegularizationSettings.controls.empRegReqNotifToSupervisor.value,
        "adminEditRegularizeAtt": this.attendanceRegularizationSettings.controls.adminEditRegularizeAtt.value,
        "supRegReqNotifToAdmin": this.attendanceRegularizationSettings.controls.supRegReqNotifToEmp.value,
        "adminRegReqNotifToEmp": this.attendanceRegularizationSettings.controls.adminRegReqNotifToEmp.value,
        "adminShouldReceiveNotification": this.attendanceRegularizationSettings.controls.adminShouldReceiveNotification.value,
        "supervisorShouldReceiveNotification": this.attendanceRegularizationSettings.controls.supervisorShouldReceiveNotification.value,
        "employeesShouldReceiveNotification": this.attendanceRegularizationSettings.controls.employeesShouldReceiveNotification.value,
        "attdEmailNotification": this.attendanceRegularizationSettings.controls.attdEmailNotification.value,
        "restrictCheckInCheckOutLocation": this.attendanceRegularizationSettings.controls.restrictCheckInCheckOutLocation.value,
        "restrictedGeoLocationType": this.attendanceRegularizationSettings.controls.restrictedGeoLocationType.value,
      }
      console.log('.......' + JSON.stringify(body));

      if (this.attendanceRegularizationSettings.controls.attRegularizationTemplateId.value != null) {
        console.log('Inside if');
        return this.serviceApi.put('/v1/attendance/settings/templates/regularization/' + this.attendanceRegularizationSettings.controls.attRegularizationTemplateId.value, body)

          .subscribe(
          res => {
            console.log('completed');
            this.isLeftVisible = false;
            if ($('.divtoggleDiv').length > 0) {
              $('.divtoggleDiv')[1].style.display = 'none';

              $('.divtoggleDiv').width(this.panelFirstWidth);
            }
            this.getAttendanceTemplateData();
            //  console.log('Attendance Data Updated successfully');
            this.successNotification('Attendance Template Updated Successfully');
            console.log(res);

          }, err => {
            console.log('there is error in edit api');
            // this.warningNotification(err.message);
            console.log(err);
          }, () => {
            // console.log('completed');
            // this.isLeftVisible = false;
            // if ($('.divtoggleDiv').length > 0) {
            //   $('.divtoggleDiv')[1].style.display = 'none';

            //   $('.divtoggleDiv').width(this.panelFirstWidth);
            // }
            // this.getAttendanceTemplateData();
          }
          )
      } else {
        console.log('Inside else');
        return this.serviceApi.post('/v1/attendance/settings/templates/regularization', body)

          .subscribe(
          res => {
            console.log(res);
            this.successNotification('Attendance Template Saved Succesfully');
            console.log('data saved succesfully');
          },
          error => {
            console.log(error);
            error = error;
            // this.warningNotification(error.message);
            console.log('error in saving data');
          },
          () => {
            console.log('completed');
            this.isLeftVisible = false;
            if ($('.divtoggleDiv').length > 0) {
              $('.divtoggleDiv')[1].style.display = 'none';

              $('.divtoggleDiv').width(this.panelFirstWidth);
            }
            this.getAttendanceTemplateData();
          }
          );
      }
    }
    else {
      console.log('Inside else');
      Object.keys(this.attendanceRegularizationSettings.controls).forEach(field => { // {1}
        const control = this.attendanceRegularizationSettings.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  // overTimePolicySteps() {
  //   if (this.attendanceTemplateSettings.controls.overtimeApplicable.value === 'true') {
  //     this.templateSettingsSteps = 4;
  //     this.nextStepNo = 4;
  //   }
  // }
  //   setStepNo() {
  //     if (this.attendanceTemplateSettings.controls.lateEarlyMarks.value === 'true') {
  //       this.templateSettingsSteps = 3;
  //       this.nextStepNo = 3;
  //     }
  //     // tslint:disable-next-line:one-line
  //     else {
  //       this.templateSettingsSteps = 2;
  //     }
  //   }
  // }
}
export interface Element {
  templateName: string;
  noOfEmpCovered: string;

  actions: string;
}


const ELEMENT_DATA: Element[] = [];

@Component({
  templateUrl: './delete-template-Dialog.component.html',
  styleUrls: ['./dialog-model.component.scss']
})
export class TemplateDeleteComponent implements OnInit {
  action: string;
  error: any;
  id: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<TemplateDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.id = this.data.id;
  }

  deleteTempData() {
    this.serviceApi.delete('/v1/attendance/settings/templates/' + this.id).subscribe(
      res => {
        if (res != null) {
          console.log('Shift Record Successfully Deleted');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        } else {
          console.log('Template Record doesnot Exist');
        }
      }, err => {
        console.log('Something gone Wrong to delete the Template Record from Database');
        console.log('there is some error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );
  }

  ngOnInit() { }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['./add-location-dialog.component.scss']
})
export class AddLocationComponent implements OnInit {
  circleRadius: number = 50;
  latitude: number = 0.0;
  longitude: number = 0.0;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  action: any;
  error: any;
  message: any;
  addLocation: FormGroup;
  attdTemplateId: any;
  title: any;
  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, public dialogRef: MatDialogRef<AddLocationComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    console.log(this.data);
    this.title = this.data.title;
    this.attdTemplateId = this.data.message;
    this.addLocation = this._fb.group({
      locationRestrictionsId: [''],
      locationName: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      radius: [50, Validators.required]
    });

  }
  setRadius() {
    console.log(this.addLocation.controls.radius.value);
    if (this.addLocation.controls.radius.value != null)
      this.circleRadius = +this.addLocation.controls.radius.value.toFixed(2);
  }

  saveLocation() {
    console.log(this.addLocation.value);
    if (this.addLocation.valid) {
      this.serviceApi.post('/v1/attendance/settings/templates/save/location/' + this.attdTemplateId, this.addLocation.value).subscribe(
        res => {
          if (res != null) {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          }
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }, () => {

        });
    } else {
      Object.keys(this.addLocation.controls).forEach(field => {
        const control = this.addLocation.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }

  updateLocation() {
    const body = {
      "locationName": this.addLocation.controls.locationName.value,
      "latitude": this.addLocation.controls.latitude.value,
      "longitude": this.addLocation.controls.longitude.value,
      "radius": this.addLocation.controls.radius.value,
    }
    if (this.addLocation.valid) {
      this.serviceApi.put("/v1/attendance/settings/templates/update/location/" + this.addLocation.controls.locationRestrictionsId.value, body).
        subscribe(
        res => {
          if (res != null) {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          }
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });

    } else {
      Object.keys(this.addLocation.controls).forEach(field => {
        const control = this.addLocation.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.addLocation.controls.latitude.setValue(this.latitude);
          this.addLocation.controls.longitude.setValue(this.longitude);
          this.zoom = 18;
        });
      });
    });
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.addLocation.controls.latitude.setValue(this.latitude);
        this.addLocation.controls.longitude.setValue(this.longitude);
        this.zoom = 18;
        if (this.data.action === 'update') {
          this.addLocation.controls.locationRestrictionsId.setValue(this.data.locationInfo.locationRestrictionsId);
          this.addLocation.controls.locationName.setValue(this.data.locationInfo.locationName);
          this.addLocation.controls.latitude.setValue(this.data.locationInfo.latitude);
          this.addLocation.controls.longitude.setValue(this.data.locationInfo.longitude);
          this.addLocation.controls.radius.setValue(this.data.locationInfo.radius);
          this.circleRadius = this.data.locationInfo.radius;
          this.latitude = +this.data.locationInfo.latitude;
          this.longitude = +this.data.locationInfo.longitude;
        }
        this.getAddress(this.latitude, this.longitude);
      });
    }

  }
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;

    this.addLocation.controls.latitude.setValue(this.latitude);
    this.addLocation.controls.longitude.setValue(this.longitude);
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
}


@Component({
  templateUrl: 'delete-location-dialog.component.html',
})
export class DeleteLocationComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('Location Id for deletion----' + data.locationRestrictionsId);
  }
  deleteLocation() {
    this.serviceApi.delete('/v1/attendance/settings/templates/delete/location/' + this.data.locationRestrictionsId).subscribe(
      res => {
        console.log('Location Delete Saved...' + JSON.stringify(res));
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
      }, () => {

      });

  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
