import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../services/api-common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-active-employees',
  templateUrl: './active-employees.component.html',
  styleUrls: ['./active-employees.component.scss']
})
export class ActiveEmployeesComponent implements OnInit {
  processId: any;
  @ViewChild("dt1") dt: DataTable;
  monthName: any;
  activeAttendanceRecords = [];
  selectedRows = [];
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'action', header: 'Action' },
  ];
  isLeftVisible: any;

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
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.monthName = params['monthYear'];
      this.processId = params['id'];
      this.getAllActiveAttendanceRecord(this.monthName);
    });
    console.log(this.monthName);
    console.log(this.processId);
  }

  ngOnInit() {
  }
  cancelAttendanceProcess() {
    this.router.navigate(['/attendance/attendance-process']);
  }
  getAllActiveAttendanceRecord(monthYear: any) {
    this.activeAttendanceRecords = [];
    this.serviceApi.get('/v1/attendance/process/' + monthYear).subscribe(res => {
      this.activeAttendanceRecords = res.pendingList;
    }, (err) => {

    }, () => {
      this.selectedRows = [];
      console.log(this.activeAttendanceRecords);
    })

  }

  viewAttendanceRecords(record: any) {
    console.log(record);
    const dialogRef = this.dialog.open(AttendanceRecordsDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { month: this.monthName, empCode: record.empCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
          } else if (result.status === 'Error') {
          }
        }
        this.getAllActiveAttendanceRecord(this.monthName);
      }
    });
  }
  submitAttendanceRecord() {
    console.log(this.selectedRows);
    if (this.selectedRows.length > 0) {
      var empCode = this.selectedRows.map(row => row.empCode);
      const body = {
        "empCodes": empCode,
        "monthYear": this.monthName,
        "processId": (this.processId != undefined) ? this.processId : 0
      }

      this.serviceApi.post('/v1/attendance/process/', body).subscribe(res => {
        this.selectedRows = [];
        this.successNotification(res.message);
        // this.getAllActiveAttendanceRecord(this.monthName);
        this.cancelAttendanceProcess();
      }, (err) => {

      }, () => {
        console.log(this.activeAttendanceRecords);
      })
    } else {
      this.warningNotification("Please select employee first.");
    }
  }
}

@Component({
  templateUrl: './attendance-record.component.html',
  styleUrls: ['./active-employees.component.scss']
})
export class AttendanceRecordsDialogComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  action: any;
  error: any;
  dialogHeader: any;
  requiredTextField;
  isValidFormSubmitted = true;
  benefitId: any;
  attendanceRecords = [];
  isReasonSelectable
  columns = [
    { field: 'date', header: 'Date' },
    { field: 'beforeStatus', header: 'Status' },
    { field: 'actions', header: 'Action' },
  ];

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
  constructor(public dialogRef: MatDialogRef<AttendanceRecordsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, public dialog: MatDialog) {
    console.log(this.data);
    this.getAttendanceRecord(this.data.empCode, this.data.month);
  }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  getAttendanceRecord(empCode: any, monthYear: any) {
    this.attendanceRecords = [];
    this.serviceApi.get('/v1/attendance/process/' + monthYear + '/' + empCode).subscribe(res => {
      this.attendanceRecords = res;
    }, (err) => {
    }, () => {
      console.log(this.attendanceRecords);
    })
  }
  regularize(event: any) {
    const dialogRef = this.dialog.open(RegularizeAttendanceRecordsComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { event: event, empCode: this.data.empCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.status != "Error") {
        this.getAttendanceRecord(this.data.empCode, this.data.month);
        this.successNotification(result.message);
      }
    });
  }

  applyLeave(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(LeaveApplicationComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { event: event, empCode: this.data.empCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.status != "Error") {
        this.getAttendanceRecord(this.data.empCode, this.data.month);
        this.successNotification(result.message);
      }
    });
  }

  initiateOndutyRequest(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(OndutyRequestDialogComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: { event: event, empCode: this.data.empCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getAttendanceRecord(this.data.empCode, this.data.month);
          }
        }
      }
    });
  }
}

@Component({
  templateUrl: './regularize-attendance-record.component.html',
  styleUrls: ['./active-employees.component.scss']
})
export class RegularizeAttendanceRecordsComponent implements OnInit {

  @ViewChild("dt1") dt: DataTable;
  action: any;
  error: any;
  dialogHeader: any;
  requiredTextField;
  isValidFormSubmitted = true;
  benefitId: any;
  public NewRegularizeRequest: FormGroup;
  regReasons = [];
  regRequestObj: any;
  readonly: Boolean = false;
  columns = [
    { field: 'date', header: 'Date' },
    { field: 'status', header: 'Status' },
    { field: 'actions', header: 'Action' },
  ];
  assignShift: any;
  regShiftList = [];
  constructor(public dialogRef: MatDialogRef<RegularizeAttendanceRecordsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder, private datePipe: DatePipe) {
    console.log(this.data);
    this.regRequestObj = this.data.event.regRequestObj;
    console.log(this.regRequestObj);
    this.getRegularizationRequest();
    // this.dt.reset();
    this.readonly = false;
  }

  ngOnInit() {
    this.NewRegularizeRequest = this._fb.group(
      {
        empCode: [this.data.empCode, Validators.required],
        regReqDate: [this.data.event.date, Validators.required],
        requestType: ['', Validators.required],
        checkInTime: [],
        checkOutTime: [],
        shift: [, Validators.required],
        reason: [, Validators.required],
        comment: ['']
      }
    );
    if (this.regRequestObj != null) {
      this.readonly = true;
      this.NewRegularizeRequest.controls.requestType.setValue(this.regRequestObj.requestType);
      this.NewRegularizeRequest.controls.checkInTime.setValue(new Date(this.regRequestObj.checkInTime));
      this.NewRegularizeRequest.controls.checkOutTime.setValue(new Date(this.regRequestObj.checkOutTime));
      this.NewRegularizeRequest.controls.shift.setValue(this.regRequestObj.shift);
      this.NewRegularizeRequest.controls.reason.setValue(+this.regRequestObj.regularizationReasonId);
      this.NewRegularizeRequest.controls.comment.setValue(this.regRequestObj.regularizationComments);
    }
    console.log(this.readonly);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  getRegularizationRequest() {
    this.regReasons = [];
    let date = this.datePipe.transform(this.data.event.date, 'dd-MM-yyyy');
    this.serviceApi.get('/v1/attendance/regularization/get-shift-employee/' + this.data.empCode + '/' + date).subscribe(
      res => {
        this.assignShift = res;
        this.NewRegularizeRequest.controls.shift.setValue(this.assignShift.shiftRecordId);
      },
      err => { },
      () => { }
    );
    this.regShiftList = [];
    this.serviceApi.get('/v1/attendance/settings/shift/').subscribe(
      res => {
        res.forEach(element => {
          this.regShiftList = [...this.regShiftList, element];
        });
      },
      err => { },
      () => { }
    );
    this.serviceApi.get('/v1/attendance/settings/regularizationReason/').
      subscribe(
        res => {
          res.forEach(element => {
            this.regReasons.push({
              reasonId: element.reasonId,
              assignedReason: element.reason,
            });
          });
        }, (err) => {

        }, () => {
          console.log(this.regReasons);
        });
  }
  onChangeReqType(value) {
    var date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();
    let selectedDate
    selectedDate = this.data.event.date;
    if (value === 'CHECK_IN') {
      this.NewRegularizeRequest.controls.checkInTime.setValue(this.datePipe.transform(selectedDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      this.NewRegularizeRequest.controls.checkOutTime.setValue(null);
      // this.NewRegularizeRequest.controls.checkInTime.setValidators(Validators.required)
      // this.NewRegularizeRequest.controls.checkOutTime.clearValidators();
      // this.NewRegularizeRequest.controls.checkOutTime.updateValueAndValidity();
    }
    else if (value === 'CHECK_OUT') {
      this.NewRegularizeRequest.controls.checkOutTime.setValue(this.datePipe.transform(selectedDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      this.NewRegularizeRequest.controls.checkInTime.setValue(null);
      // this.NewRegularizeRequest.controls.checkOutTime.setValidators(Validators.required)
      // this.NewRegularizeRequest.controls.checkInTime.clearValidators();
      // this.NewRegularizeRequest.controls.checkInTime.updateValueAndValidity();
    }
    else if (value === 'CHECKIN_AND_CHECKOUT') {
      this.NewRegularizeRequest.controls.checkInTime.setValue(this.datePipe.transform(selectedDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      this.NewRegularizeRequest.controls.checkOutTime.setValue(this.datePipe.transform(selectedDate, 'dd-MM-yyyy') + ' ' + hh + ':' + mm);
      // this.NewRegularizeRequest.controls.checkInTime.setValidators(Validators.required)
      // this.NewRegularizeRequest.controls.checkOutTime.setValidators(Validators.required)
      // this.NewRegularizeRequest.controls.checkInTime.setValue(null);
      // this.NewRegularizeRequest.controls.checkOutTime.setValue(null);
    }

  }

  approveRegularizationRequest() {
    if (this.NewRegularizeRequest.valid) {
      return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.regRequestObj.regId + '/action?action=approve&&comments=approved', null).
        subscribe(
          res => {

            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {

            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.NewRegularizeRequest.controls).forEach(field => { // {1}
        const control = this.NewRegularizeRequest.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  onSubmitRequest() {
    if (this.NewRegularizeRequest.valid) {

      let checkInTime = this.datePipe.transform(this.NewRegularizeRequest.controls.checkInTime.value, 'dd-MM-yyyy HH:mm');
      let checkOutTime = this.datePipe.transform(this.NewRegularizeRequest.controls.checkOutTime.value, 'dd-MM-yyyy HH:mm');
      var body = {
        'empCode': this.data.empCode,
        'regularizationDate': [this.NewRegularizeRequest.controls.regReqDate.value],
        'requestType': this.NewRegularizeRequest.controls.requestType.value,
        'regularizationReason': this.NewRegularizeRequest.controls.reason.value,
        'regularizationComments': this.NewRegularizeRequest.controls.comment.value,
        'checkInTime': checkInTime,
        'checkOutTime': checkOutTime,
        'shiftRecordId': this.NewRegularizeRequest.controls.shift.value,

      };

      return this.serviceApi.post('/v1/attendance/process/applyRegularization', body).
        subscribe(
          res => {

            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {

            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.NewRegularizeRequest.controls).forEach(field => { // {1}
        const control = this.NewRegularizeRequest.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }




}

@Component({
  templateUrl: './leave-application.component.html',
  styleUrls: ['./active-employees.component.scss']
})
export class LeaveApplicationComponent implements OnInit {
  public addNewLeave: FormGroup;
  divShow = false;
  employeeList = [];
  categoryList = [];
  categoryInfo = [];
  halfDayOption: any;
  uploadDoc: any;
  currentFileUpload: File;
  isCommentMandatory: any;
  uploadDocMandatory: any;
  halfDayvalue = [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];
  error = 'Error Message';
  action: any;
  leaveApplicationObj: any;
  empCode: any;
  readonly: boolean = false;
  pendingApplCount: any;
  leaveBal: any;
  showData: boolean = false;
  minDate: Date;
  maxDate: Date;
  dayHalfs = [{ value: 'First_Half', viewValue: 'First Half' }, { value: 'Second_Half', viewValue: 'Second Half' }]

  columns = [
    { field: 'date', header: 'Date' },
    { field: 'half', header: 'Half' },
  ]
  constructor(public dialogRef: MatDialogRef<LeaveApplicationComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private datePipe: DatePipe) {
    console.log(this.data);
    this.empCode = this.data.empCode;
    this.addNewLeave = this._fb.group(
      {
        leaveId: [''],
        leaveCategory: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        halfDay: false,
        halfDayDate: [],
        halfDayDates: this._fb.array([]),
        reason: [''],
        uploadDoc: [],
        empRelation: ['None'],
        expirationDate: [''],
        childDeliveryDate: [''],
        empNeedExtension: []
      }
    );
    this.addNewLeave.controls.startDate.setValue(new Date(this.data.event.date));
    this.addNewLeave.controls.endDate.setValue(new Date(this.data.event.date));
    this.leaveApplicationObj = this.data.event.leaveApplicationObj;
    if (this.leaveApplicationObj != null) {
      this.readonly = true;
      this.halfDayOption = true;
      let leaveHalfDays = [];
      this.addNewLeave.controls.leaveCategory.setValue(this.leaveApplicationObj.leaveName);
      this.addNewLeave.controls.startDate.setValue(this.datePipe.transform(new Date(this.leaveApplicationObj.startDate), "dd-MM-yyyy"));
      this.addNewLeave.controls.endDate.setValue(this.datePipe.transform(new Date(this.leaveApplicationObj.endDate), "dd-MM-yyyy"));

      this.addNewLeave.controls.halfDay.setValue(this.leaveApplicationObj.isHalfDay);
      this.addNewLeave.controls.halfDayDate.setValue(leaveHalfDays);
      this.addNewLeave.controls.leaveId.setValue(this.leaveApplicationObj.leaveId);
      this.addNewLeave.controls.empRelation.setValue(this.leaveApplicationObj.employeeRelations);
      this.addNewLeave.controls.expirationDate.setValue(this.leaveApplicationObj.expirationDate);
      this.addNewLeave.controls.childDeliveryDate.setValue(this.leaveApplicationObj.childDeliveryDate);
      this.addNewLeave.controls.reason.setValue(this.leaveApplicationObj.reason);
      $(':radio:not(:checked)').attr('disabled', true);
    }
    this.selectedValue(this.empCode);
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.currentFileUpload = file;
    }
  }
  selectedValue(data: any) {
    this.categoryList = [];
    this.categoryInfo = [];
    console.log('emp code--------- ' + data);
    this.serviceApi.get('/v1/leave/leaveapplication/template/' + data).
      subscribe(
        // this.http.get('assets/data/Leave/leaveTemplate.json').subscribe
        // (
        res => {
          console.log('Comment mendatory.. ' + res.isCommentMadatory);
          this.isCommentMandatory = res.isCommentMadatory;
          res.leaveTemplateCategories.forEach(element1 => {
            this.categoryList.push({
              id: element1.leaveCategories.categoryId,
              name: element1.leaveCategories.leaveName
            });
            this.categoryInfo.push({
              id: element1.leaveCategories.categoryId,
              name: element1.leaveCategories.leaveName,
              halfDayOption: element1.leaveCategories.halfDayOption,
              uploadDocument: element1.leaveCategories.uploadDocument,
              uploadingDocMandatory: element1.leaveCategories.uploadingDocMandatory,
              needLeaveExtension: element1.needToExtendDays,
            });

          });
          if (this.isCommentMandatory) {
            this.addNewLeave.controls.reason.setValidators(Validators.required);
          } else {
            this.addNewLeave.controls.reason.clearValidators();
          }
          this.addNewLeave.controls.reason.updateValueAndValidity();

        });
    this.divShow = true;
  }


  selectDates() {
    //  this.dates = [];
    console.log(this.addNewLeave.controls.halfDayDate.value);
    const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
    formArr.controls = [];
    this.addNewLeave.controls.halfDayDate.value.forEach(element => {
      let date = this.datePipe.transform(element, 'yyyy-MM-dd');
      // const resultObject = this.exists(element, this.dates);
      // if(!resultObject){
      // this.dates = [...this.dates,element];
      formArr.push(this._fb.group({
        date: [date],
        half: [null]
      }));
      // }
    });
  }



  onChangeCategory(category: any) {
    console.log('category Id ' + category);
    this.categoryInfo.forEach(element => {
      if (element.name === category.name) {
        this.halfDayOption = element.halfDayOption;
        this.uploadDoc = element.uploadDocument;
        this.uploadDocMandatory = element.uploadingDocMandatory;
      }
    });
    this.serviceApi.get('/v1/leave/leaveapplication/leaveData/' + this.empCode + '/' + category.id).
      subscribe(
        // this.http.get('assets/data/Leave/leaveTemplate.json').subscribe
        // (
        res => {
          if (res != null) {
            this.pendingApplCount = res.pendingApplications;
            this.leaveBal = res.remainingBal;
            this.showData = true;
          }
        });
    this.addNewLeave.controls.halfDay.setValue(false);
    this.addNewLeave.controls.halfDayDate.setValue(null);
    this.addNewLeave.controls.halfDayDate.clearValidators();
    this.addNewLeave.controls.halfDayDate.reset();
    const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
    formArr.controls = [];
    if (this.halfDayOption) {
      this.addNewLeave.controls.halfDay.setValidators(Validators.required);
    }
    this.addNewLeave.controls.halfDayDate.updateValueAndValidity();

    this.addNewLeave.controls.empRelation.clearValidators();
    this.addNewLeave.controls.expirationDate.clearValidators();
    if (category.name === 'Bereavement Leave') {
      this.addNewLeave.controls.empRelation.setValidators(Validators.required);
      this.addNewLeave.controls.expirationDate.setValidators(Validators.required);
    }
    this.addNewLeave.controls.empRelation.updateValueAndValidity();
    this.addNewLeave.controls.expirationDate.updateValueAndValidity();
    if (this.uploadDoc) {
      this.addNewLeave.controls.uploadDoc.clearValidators();
      if (this.uploadDocMandatory) {
        this.addNewLeave.controls.uploadDoc.setValidators(Validators.required);
      }
      this.addNewLeave.controls.uploadDoc.updateValueAndValidity();
    } else {
      this.addNewLeave.controls.uploadDoc.clearValidators();
      this.addNewLeave.controls.uploadDoc.updateValueAndValidity();
    }
  }

  selectrange() {
    this.addNewLeave.controls.halfDayDate.setValue(null);
    this.addNewLeave.controls.halfDayDate.reset();
    this.minDate = new Date(this.addNewLeave.controls.startDate.value);
    this.maxDate = new Date(this.addNewLeave.controls.endDate.value);
    const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
    formArr.controls = [];
    this.addNewLeave.controls.halfDayDate.clearValidators();
    if (this.addNewLeave.controls.halfDay.value) {
      this.addNewLeave.controls.halfDayDate.setValidators(Validators.required);
    }
    this.addNewLeave.controls.halfDayDate.updateValueAndValidity();
  }

  onChangeSelection() {
    this.addNewLeave.controls.halfDayDate.reset();
    if (this.addNewLeave.controls.halfDay.value) {
      this.addNewLeave.controls.halfDayDate.setValue(null);
      this.addNewLeave.controls.halfDayDate.setValidators(Validators.required);
      this.minDate = new Date(this.addNewLeave.controls.startDate.value);
      this.maxDate = new Date(this.addNewLeave.controls.endDate.value);
    }
    else {
      this.addNewLeave.controls.halfDayDate.clearValidators();
      const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
      formArr.controls = [];
    }
    this.addNewLeave.controls.halfDayDate.updateValueAndValidity();
  }

  submitAppliation() {
    if (this.addNewLeave.valid) {
      const formData = new FormData();
      const file = <File>this.currentFileUpload;
      console.log('form value ' + JSON.stringify(this.addNewLeave.value));
      let leaveHalfDaysList = [];
      this.addNewLeave.controls.halfDayDates.value.forEach(element => {
        leaveHalfDaysList.push(element.date + "#" + element.half)
      });;

      formData.append("empCode", this.empCode);
      formData.append("startDate", this.datePipe.transform(this.addNewLeave.controls.startDate.value, 'yyyy-MM-dd'));
      formData.append("endDate", this.datePipe.transform(this.addNewLeave.controls.endDate.value, 'yyyy-MM-dd'));
      formData.append("isHalfDay", this.addNewLeave.controls.halfDay.value);
      formData.append("leaveHalfDaysList", JSON.stringify(leaveHalfDaysList));
      formData.append("leaveName", this.addNewLeave.controls.leaveCategory.value.name);
      formData.append("reason", this.addNewLeave.controls.reason.value);
      formData.append("employeeRelations", this.addNewLeave.controls.empRelation.value);
      formData.append("expirationDate", this.addNewLeave.controls.expirationDate.value);
      formData.append("childDeliveryDate", this.addNewLeave.controls.childDeliveryDate.value);
      if (file !== undefined) { formData.append("file", file, file.name); }


      // formData.forEach((value,key) => {
      //   console.log(key+" "+value)
      // });
      console.log(formData);
      this.serviceApi.postWithFormData('/v1/attendance/process/applyLeave', formData).
        subscribe(
          res => {

            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {

            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {
      Object.keys(this.addNewLeave.controls).forEach(field => { // {1}
        const control = this.addNewLeave.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  approveAppliation() {
    this.serviceApi.put("/v1/leave/leaveapplication/admin/" + this.leaveApplicationObj.leaveId + "/action?action=APPROVE&&comments=approved", "").subscribe(res => {
      this.action = 'Response';
      this.error = res.message;
      this.close();
    }, (err) => {
      this.action = 'Error';
      this.error = err.message;
      this.close();
    }, () => {

    })
  }
}

@Component({
  templateUrl: 'on-duty-requests.dialog.html',
})
export class OndutyRequestDialogComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  action: any;
  error: any;
  message
  title: any;
  employeeList = [];
  onDutyRequestForm: FormGroup;
  shiftStartTime
  shiftEndTime
  defaultOndutyTimings: boolean = true
  makeCommentMandatory: boolean = false
  isReasonSelectable: boolean = true
  onDutyRequestReasons = []
  onDutyRequestList = [];
  canApplyRequestForMultipleDays: boolean = true;
  notemplateAssigned: boolean = false;
  selectedEmployee
  minDate: any;
  maxDate: any;
  onDutyRequestObj: any;
  readonly: Boolean = false;
  columnsOD = [
    { field: 'date', header: 'Date' },
    { field: 'shiftName', header: 'Shift Name' },
    { field: 'shiftTimings', header: 'Shift Durations' },
    { field: 'shiftStartTime', header: 'Start Time' },
    { field: 'shiftEndTime', header: 'End Time' },
    { field: 'remarks', header: 'Remarks' },
  ]
  dates: any[];
  empCode: any;
  compareFn = (a: any, b: any) => (a && b) && (a.onDutyReasonId == b.onDutyReasonId);
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
  constructor(public dialogRef: MatDialogRef<OndutyRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private datePipe: DatePipe, private fb: FormBuilder,) {
    this.title = this.data.title;
    this.empCode = this.data.empCode
    this.onDutyRequestForm = this.fb.group({
      applicationId: [0],
      selectedEmployee: [this.empCode],
      onDutyDuration: [null],
      datesArray: this.fb.array([]),
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      reason: [null],
      comments: [null]
    });
    this.onDutyRequestForm.controls.startDate.setValue(new Date(this.data.event.date));
    this.onDutyRequestForm.controls.endDate.setValue(new Date(this.data.event.date));
    this.onDutyRequestObj = this.data.event.onDutyRequestObj;
    this.changeEmployee(this.empCode);
    if (this.onDutyRequestObj != null) {
      this.readonly = true;
      this.onDutyRequestForm.controls.startDate.setValue(this.datePipe.transform(new Date(this.onDutyRequestObj.startDate), "dd-MM-yyyy"));
      this.onDutyRequestForm.controls.endDate.setValue(this.datePipe.transform(new Date(this.onDutyRequestObj.endDate), "dd-MM-yyyy"));
      this.onDutyRequestForm.controls.reason.setValue(this.onDutyRequestObj.reason);
      this.onDutyRequestForm.controls.applicationId.setValue(+this.onDutyRequestObj.applicationId);
      this.onDutyRequestForm.controls.comments.setValue(this.onDutyRequestObj.comment);
    }
  }

  ngOnInit() {
    this.onSelectDate();
  }
  enableValidations() {
    const control = this.onDutyRequestForm.get("datesArray") as FormArray;
    for (let i = control.length - 1; i >= 0; i--) {
      if (control.controls[i].value.odApplicable) {
        control.controls[i]['controls'].onDutyStartTiming.setValidators([Validators.required])
        control.controls[i]['controls'].onDutyStartTiming.updateValueAndValidity();

        control.controls[i]['controls'].onDutyEndTiming.setValidators([Validators.required])
        control.controls[i]['controls'].onDutyEndTiming.updateValueAndValidity();
      }
    }
  }
  checkDates() {
    if (this.onDutyRequestForm.controls.startDate.value > this.onDutyRequestForm.controls.endDate.value) {
      this.warningNotification("Start date can not be greater than end date");
      this.onDutyRequestForm.controls.startDate.setValue(null);
      this.onDutyRequestForm.controls.endDate.setValue(null);
      while (this.datesArray.length !== 0) {
        this.datesArray.removeAt(0)
      }
      return false;
    }
    return true;
  }
  checkStartTimeAndEndTime() {
    const control = this.onDutyRequestForm.get("datesArray") as FormArray;
    for (let i = control.length - 1; i >= 0; i--) {
      if ((control.controls[i].value.onDutyStartTiming >= control.controls[i].value.onDutyEndTiming) && control.controls[i].value.odApplicable) {
        return false;
      }
    }
    return true;
  }
  createItem(element): FormGroup {
    return this.fb.group({
      date: [element.date],
      firstHalfEnd: [element.firstHalfEnd],
      firstHalfStart: [element.firstHalfStart],
      odApplicable: [element.odApplicable],
      remarks: [element.remarks],
      secondHalfEnd: [element.secondHalfEnd],
      secondHalfStart: [element.secondHalfStart],
      shiftEndTime: [element.shiftEndTime],
      shiftName: [element.shiftName],
      shiftStartTime: [element.shiftStartTime],
      onDutyDuration: [null],
      onDutyStartTiming: [],
      onDutyEndTiming: []
    });
  }
  get datesArray(): FormArray {
    return this.onDutyRequestForm.get('datesArray') as FormArray;
  }
  onSelectDate() {
    if (this.onDutyRequestForm.controls.startDate.value && this.onDutyRequestForm.controls.endDate.value && this.checkDates()) {
      let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      let startDate = this.onDutyRequestForm.controls.startDate.value.toLocaleDateString('en-GB', options).replaceAll('/', '-');
      let endDate = this.onDutyRequestForm.controls.endDate.value.toLocaleDateString('en-GB', options).replaceAll('/', '-');
      this.onDutyRequestList = [];
      this.serviceApi.get('/v1/attendance/on-duty/request/' + startDate + '/' + endDate + '/' + this.empCode).subscribe(res => {
        while (this.datesArray.length !== 0) {
          this.datesArray.removeAt(0)
        }
        const control = (<FormArray>this.onDutyRequestForm.controls['datesArray']) as FormArray;
        res.forEach(element => {
          control.push(this.createItem(element));
        });
        this.enableValidations();
        console.log("Printing Response");
        console.log(res);
      },
        (err) => {
        }, () => {
          this.dt.reset();
        });
    }
  }
  onChangeDurations(event: any, rowData: any, rowIndex) {
    console.log(event, rowData, rowData);
    if (event.value == "fullDay") {
      rowData.controls.onDutyStartTiming.setValue(new Date(rowData.controls.shiftStartTime.value.split(" ").map(part => part.split("-").reverse().join("-")).join(" ")))
      rowData.controls.onDutyEndTiming.setValue(new Date(rowData.controls.shiftEndTime.value.split(" ").map(part => part.split("-").reverse().join("-")).join(" ")))
    }
    if (event.value == "firstHalf") {
      rowData.controls.onDutyStartTiming.setValue(new Date(rowData.controls.firstHalfStart.value.split(" ").map(part => part.split("-").reverse().join("-")).join(" ")))
      rowData.controls.onDutyEndTiming.setValue(new Date(rowData.controls.firstHalfEnd.value.split(" ").map(part => part.split("-").reverse().join("-")).join(" ")))
    }
    if (event.value == "secondHalf") {
      rowData.controls.onDutyStartTiming.setValue(new Date(rowData.controls.secondHalfStart.value.split(" ").map(part => part.split("-").reverse().join("-")).join(" ")))
      rowData.controls.onDutyEndTiming.setValue(new Date(rowData.controls.secondHalfEnd.value.split(" ").map(part => part.split("-").reverse().join("-")).join(" ")))
    }
  }
  changeEmployee(empCode) {
    this.onDutyRequestReasons = [];
    this.datesArray.removeAt(0)
    this.serviceApi.get('/v1/attendance/settings/onduty-assignments/' + empCode).
      subscribe(
        res => {
          if (res != null) {
            this.notemplateAssigned = false;
            this.defaultOndutyTimings = res.onDutyTemplate.defaultShiftTimingStatus;
            this.makeCommentMandatory = res.onDutyTemplate.commentMandatory;
            this.canApplyRequestForMultipleDays = res.onDutyTemplate.multipleDaysApplicable;
            if (this.makeCommentMandatory) {
              this.onDutyRequestForm.controls.comments.setValidators([Validators.required])
              this.onDutyRequestForm.controls.comments.updateValueAndValidity();
            } else {
              this.onDutyRequestForm.controls.comments.clearValidators();
              this.onDutyRequestForm.controls.comments.updateValueAndValidity();
            }
          } else {
            this.notemplateAssigned = true;
          }
        });
    this.serviceApi.get('/v1/attendance/on-duty/reasons/by/' + empCode).
      subscribe(
        res => {
          this.isReasonSelectable = res.reasonFlag
          res.onDutyReasonList.forEach(element => {
            this.onDutyRequestReasons.push({
              onDutyReasonId: element.onDutyReasonId,
              reason: element.reason,
            });
          });
          if (this.isReasonSelectable) {
            this.onDutyRequestForm.controls.reason.setValidators([Validators.required])
            this.onDutyRequestForm.controls.reason.updateValueAndValidity();
          }
        });
  }
  differenceBetweenDates(startDate, endDate): number {
    var date1 = new Date(startDate);
    var date2 = new Date(endDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  submitOndutyRequest() {
    if (this.onDutyRequestForm.valid) {
      if (this.checkStartTimeAndEndTime()) {
        console.log(this.onDutyRequestForm.value)
        const control = this.onDutyRequestForm.get("datesArray") as FormArray;
        let datesArray = []
        for (let i = control.length - 1; i >= 0; i--) {
          if (control.controls[i].value.odApplicable) {
            control.controls[i].value.onDutyStartTiming = this.datePipe.transform(new Date(control.controls[i].value.onDutyStartTiming), 'dd-MM-yyyy HH:mm');
            control.controls[i].value.onDutyEndTiming = this.datePipe.transform(new Date(control.controls[i].value.onDutyEndTiming), 'dd-MM-yyyy HH:mm');
            datesArray.push({
              "date": control.controls[i].value.date,
              "endTime": control.controls[i].value.onDutyEndTiming,
              "onDutyRequestDetailId": 0,
              "remarks": control.controls[i].value.remarks,
              "shiftTimings": control.controls[i].value.shiftStartTime + " - " + control.controls[i].value.shiftEndTime,
              "startTime": control.controls[i].value.onDutyStartTiming
            })
          }
        }
        let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const body = {
          "applicationId": 0,
          "empReason": (this.isReasonSelectable === true) ? +this.onDutyRequestForm.controls.reason.value.onDutyReasonId : '',
          "empCode": this.empCode,
          "startDate": this.onDutyRequestForm.controls.startDate.value.toLocaleDateString('en-GB', options).replaceAll('/', '-'),
          "endDate": this.onDutyRequestForm.controls.endDate.value.toLocaleDateString('en-GB', options).replaceAll('/', '-'),
          "comments": this.onDutyRequestForm.controls.comments.value,
          "onDutyRequestDetailsList": datesArray
        }
        return this.serviceApi.post('/v1/attendance/process/applyOnDuty/', body).
          subscribe(
            res => {
              this.action = 'Response';
              this.message = res.message;
              this.close();
            },
            err => {
              console.log('there is something error.....  ' + err.message);
              this.action = 'Error';
              this.onDutyRequestForm.reset();
              while (this.datesArray.length !== 0) {
                this.datesArray.removeAt(0)
              }
            });
      } else {
        this.warningNotification("Please select correct Start Time and End Time for the selected date range");
      }
    } else {
      Object.keys(this.onDutyRequestForm.controls).forEach(field => {
        const control = this.onDutyRequestForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  approveRequest() {
    if (this.onDutyRequestForm.valid) {
      const body = {
        "comments": 'Approved',
      }
      this.serviceApi.post('/v1/attendance/on-duty/request/approve/' + this.onDutyRequestObj.applicationId, body).
        subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.onDutyRequestForm.controls).forEach(field => { // {1}
        const control = this.onDutyRequestForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}
