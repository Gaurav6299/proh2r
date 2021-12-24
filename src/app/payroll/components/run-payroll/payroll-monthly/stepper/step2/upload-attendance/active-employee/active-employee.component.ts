import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, FormControlName, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { element } from 'protractor';
import 'fullcalendar';
import { RunPayroll } from '../../../../../../../service/run-payroll.service';
import { ApiCommonService } from '../../../../../../../../services/api-common.service';
import { d } from '@angular/core/src/render3';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-active-employee',
  templateUrl: './active-employee.component.html',
  styleUrls: ['./active-employee.component.scss']
})
export class ActiveEmployeeComponent implements OnInit, AfterViewInit {
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'totalDays', header: 'Total Days' },
    { field: 'lopDays', header: 'LOP Days' },
    { field: 'payableDays', header: 'Payable Days' },
    { field: 'action', header: 'Actions' },
  ];
  selectedRows: any = [];
  @Input() runPayrollId: any;
  @Input() monthYear: any;
  @Output() messageEvent = new EventEmitter();
  attendaceProcessDetails = [];
  currState: boolean = false;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private runPayroll: RunPayroll, private serviceApi: ApiCommonService, private router: Router) {

  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    // console.log("step2");
    // this.getData();
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
  getData() {
    this.attendaceProcessDetails = [];
    this.serviceApi.get('/v1/payroll/runPayroll/empAttendance/' + this.runPayrollId).subscribe(
      res => {
        if (res != undefined) {
          this.attendaceProcessDetails = res;
        }
      },
      err => {
      },
      () => { }
    );
  }
  onNoClick(): void {
  }

  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }

  updateAttendace(element: any) {
    console.log(element);

    const dialogRef = this.dialog.open(AddLOPComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { runPayrollId: this.runPayrollId, element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result !== undefined) {
      //   console.log('Result value ..... ' + JSON.stringify(result));
      //   if (result.status === 'Response') {
      //     let obj = result.response;
      //     let index = this.attendaceProcessDetails.indexOf(element);
      //     this.attendaceProcessDetails.splice(index, 1, obj);
      //   } else if (result.status === 'Error') {
      //     this.getData();
      //   }
      // }else{
      //   this.getData();
      // }
      this.getData();
    });
  }

  toggleEdit(element: any) {
    console.log(element);

    const dialogRef = this.dialog.open(UpdateLOPDaysComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.status === 'Response') {
          let index = this.attendaceProcessDetails.indexOf(element);
          element.lopDays = result.lopdays;
          element.payableDays = result.payableDays;
          this.attendaceProcessDetails.splice(index, 1, element);
        } else if (result.status === 'Error') {
        }
      }
    });
  }

  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
    this.messageEvent.emit('previous-' + currentStep);
  }

  onProceed() {
    console.log(this.attendaceProcessDetails);
    let attendaceProcessDetailsList = [];
    this.attendaceProcessDetails.forEach(element => {
      attendaceProcessDetailsList.push({
        "empCode": element.empCode,
        "totalLopDays": element.lopDays,
        "totalPayableDays": element.payableDays
      })
    });

    this.serviceApi.put('/v1/payroll/runPayroll/updateAttendanceProcess/' + this.runPayrollId, attendaceProcessDetailsList).subscribe(
      res => {
        if (res != undefined) {
          let currentStep;
          this.runPayroll.currentStep.subscribe(step => currentStep = step);
          this.runPayroll.changeData(++currentStep);
          this.messageEvent.emit('continue-' + currentStep);
        }
      },
      err => {
        console.log('err -->' + err);
        console.log('there is something error.....  ' + err.message);
        this.warningNotification(err.message);
      },
      () => { }
    );
  }

}
@Component({
  selector: 'app-active-employee-add-lop',
  templateUrl: './app-active-employee-add-lop.html',
  styleUrls: ['./app-active-employee-add-lop.scss']
})
export class AddLOPComponent implements OnInit, AfterViewInit {

  columns = [
    { field: 'date', header: 'Date' },
    { field: 'afterProcessStatus', header: 'Current Status' },
    { field: 'actions', header: 'Action' },
  ];
  attendanceRecords = [];
  data: any;
  error: any;
  action: any;
  updateAttendanceData = [];
  runPayrollId: any;
  empCode: any;


  constructor(private http: Http,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddLOPComponent>,
    private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data1: any) {
    console.log('data-->' + data1.element.attendanceData);

    this.attendanceRecords = data1.element.attendanceData;
    this.runPayrollId = data1.runPayrollId;
    this.updateAttendanceData = [];
    this.empCode = data1.element.empCode;
  }

  ngOnInit() {


  }

  ngAfterViewInit() {

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

  updateDateSatus(element: any) {
    const dialogRef = this.dialog.open(UploadLOPDaysComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));

        let exist = false;
        let add = true;
        if (this.updateAttendanceData.length > 0) {
          this.updateAttendanceData.forEach(element => {
            if (element.attendanceDate == result.date) {
              element.updatedFirstHalfStatus = result.firstStatus;
              element.updatedSecondHalfStatus = result.SecondStatus;
              exist = true;
            } else {
              add = true;
            }
          });
        }
        if (!exist && add) {
          // if (result.status == 'LOP') {
          this.updateAttendanceData.push(
            {
              "attendanceDate": result.date,
              "updatedFirstHalfStatus": result.firstStatus,
              "updatedSecondHalfStatus": result.SecondStatus,
              // "updatedStatus": result.status
            }
          );
        }
        let index = this.attendanceRecords.indexOf(element);
        element.updatedFirstHalfStatus = result.firstStatus;
        element.updatedSecondHalfStatus = result.SecondStatus;
        if (element.updatedFirstHalfStatus == 'HDP' && element.updatedSecondHalfStatus == 'HDP') {
          element.updatedStatus = "P"
        } else if (element.updatedFirstHalfStatus == 'LOP' && element.updatedSecondHalfStatus == 'LOP') {
          element.updatedStatus = "LOP"
        } else if (element.updatedFirstHalfStatus == 'WO' && element.updatedSecondHalfStatus == 'WO') {
          element.updatedStatus = "WO"
        } else if (element.updatedFirstHalfStatus == 'H' && element.updatedSecondHalfStatus == 'H') {
          element.updatedStatus = "H"
        }
        else {
          element.updatedStatus = element.updatedFirstHalfStatus + "+" + element.updatedSecondHalfStatus;
        }
        // element.afterProcessStatus = result.status;
        console.log(JSON.stringify(element));
        this.attendanceRecords.splice(index, 1, element);
      }
      console.log('Result value ..... ', (this.updateAttendanceData));
    });
  }

  confirm() {
    console.log(this.updateAttendanceData);
    this.serviceApi.put('/v1/payroll/runPayroll/updateLopDays/' + this.runPayrollId + '/' + this.empCode, this.updateAttendanceData).subscribe(
      res => {
        console.log('Enter Successfully Makes Un Hold');
        this.action = 'Response';
        this.closeDialog(res);
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.error = err.message;
        // this.warningNotification(this.error);
      }, () => {
      }
    );
  }

  onNoClick(): void {
    this.updateAttendanceData = [];
    this.attendanceRecords.forEach(element => {
      if (element.updateDateSatus != undefined) {
        element.updateDateSatus = undefined;
      }
    });
    this.dialogRef.close();
    console.log('dialog closed');
  }

  closeDialog(response: any) {
    this.data = {
      response: response,
      status: this.action
    }
    this.dialogRef.close(this.data);
  }

}

@Component({
  selector: 'app-active-employee-upload-lop',
  templateUrl: './app-active-employee-upload-lop.html',
  styleUrls: ['./app-active-employee-upload-lop.scss']
})
export class UploadLOPDaysComponent implements OnInit, AfterViewInit {
  requestType1: any;
  requestType2: any;
  date: any;

  status1 = [{
    value: "Loss of Pay", viewValue: "Loss of Pay"
  },
  {
    value: "Present", viewValue: "Present"
  }
  ]
  status2 = [{ value: "HDP", viewValue: "HDP" }, { value: "LOP", viewValue: "LOP" }]
  statusFirstHalfWO = [{ value: "LOP", viewValue: "LOP" }, { value: "HDP", viewValue: "HDP" }, { value: "WO", viewValue: "WO" }];
  statusSecondHalfWO = [{ value: "LOP", viewValue: "LOP" }, { value: "WO", viewValue: "WO" }];
  statusH = [{ value: "H", viewValue: "H" }, { value: "LOP", viewValue: "LOP" }];
  data: any;
  error: any;
  action: any;
  elementData: any;
  status: any;
  requestType3: any;
  FirstStatus: any;
  SecondStatus: any;
  showHideDiv: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadLOPDaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any) {
    console.log('data-->' + data1);
    this.showHideDiv = data1.element.afterProcessStatus;
    this.date = data1.element.date;
    this.status = this.data1.element.updatedStatus == undefined ? this.data1.element.afterProcessStatus : this.data1.element.updatedStatus;
    this.FirstStatus = this.data1.element.afterProcessFirstHalfStatus;
    this.SecondStatus = this.data1.element.afterProcessSecondHalfStatus;
    if (this.data1.element.updatedFirstHalfStatus != undefined || this.data1.element.updatedSecondHalfStatus != undefined) {
      this.requestType1 = this.data1.element.updatedFirstHalfStatus == undefined ? this.FirstStatus : this.data1.element.updatedFirstHalfStatus;
      this.requestType2 = this.data1.element.updatedSecondHalfStatus == undefined ? this.SecondStatus : this.data1.element.updatedSecondHalfStatus;
    } else {
      if (this.FirstStatus == 'HDP' && this.SecondStatus == 'HDP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'LOP' && this.SecondStatus == 'LOP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'HDP' && this.SecondStatus == 'LOP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'LOP' && this.SecondStatus == 'HDP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'LOP' && this.SecondStatus.includes('HD(')) {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'HDP' && this.SecondStatus.includes('HD(')) {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'LOP' && this.SecondStatus == 'OD') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'HDP' && this.SecondStatus == 'OD') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus.includes('HD(') && this.SecondStatus == 'LOP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus.includes('HD(') && this.SecondStatus == 'HDP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'OD' && this.SecondStatus == 'LOP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'OD' && this.SecondStatus == 'HDP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'WO' && this.SecondStatus == 'WO') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'WO' && this.SecondStatus == 'HDP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'HDP' && this.SecondStatus == 'WO') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'WO' && this.SecondStatus == 'LOP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'LOP' && this.SecondStatus == 'WO') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.SecondStatus;
      } else if (this.FirstStatus == 'H') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.requestType1;
      } else if (this.FirstStatus == 'LOP') {
        this.requestType1 = this.FirstStatus;
        this.requestType2 = this.requestType1;
      }
    }
  }

  CurrentStatus() {
    if (this.requestType1 == 'HDP' && this.requestType2 == 'HDP') {
      this.status = "P";
    } else if (this.requestType1 == 'LOP' && this.requestType2 == 'LOP') {
      this.status = "LOP";
    } else if (this.requestType1 == 'HDP' && this.requestType2 == 'LOP') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'LOP' && this.requestType2 == 'HDP') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'LOP' && this.requestType2.includes('HD(')) {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'HDP' && this.requestType2.includes('HD(')) {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1.includes('HD(') && this.requestType2 == 'LOP') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1.includes('HD(') && this.requestType2 == 'HDP') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'LOP' && this.requestType2.includes('OD')) {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'HDP' && this.requestType2.includes('OD')) {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1.includes('OD') && this.requestType2 == 'LOP') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1.includes('OD') && this.requestType2 == 'HDP') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'WO' && this.requestType2 == 'WO') {
      this.status = "WO";
    } else if (this.requestType1 == 'HDP' && this.requestType2 == 'WO') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'WO' && this.requestType2 == 'LOP') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'LOP' && this.requestType2 == 'WO') {
      this.status = this.requestType1 + "+" + this.requestType2;
    } else if (this.requestType1 == 'H') {
      this.requestType2 = 'H'
      this.status = "H";
    } else if (this.requestType1 == 'LOP') {
      this.requestType2 = 'LOP'
      this.status = "LOP";
    }
  }
  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  confirm() {
    console.log(this.requestType1);
    console.log(this.requestType2);
    // console.log(this.requestType3);
    // if (this.status == 'Present' || this.status == 'Loss of Pay') {
    //   this.elementData = {
    //     date: this.date,
    //     firstStatus: this.requestType1,
    //     SecondStatus: this.requestType2
    //   }
    // } else {
    //   if (this.status == 'HDP + HDA') {
    //     if (this.requestType2 == 'HDP' && this.requestType3 == 'HDP') {
    //       this.elementData = {
    //         date: this.date,
    //         status: 'Present'
    //       }
    //     } else if (this.requestType2 == 'HDA' && this.requestType3 == 'HDA') {
    //       this.elementData = {
    //         date: this.date,
    //         status: 'Loss of Pay'
    //       }
    //     } else {
    //       this.elementData = {
    //         date: this.date,
    //         status: 'HDP + HDA'
    //       }
    //     }
    //   } else if (this.status.includes('HDP + HD(')) {
    //     let second = this.status.split(" + ")[1];
    //     this.elementData = {
    //       date: this.date,
    //       status: this.requestType2 + ' + ' + second
    //     }
    //   } else if (this.status.includes('HDA + HD(')) {
    //     let second = this.status.split(" + ")[1];
    //     this.elementData = {
    //       date: this.date,
    //       status: this.requestType2 + ' + ' + second
    //     }
    //   }
    // }
    this.elementData = {
      date: this.date,
      firstStatus: this.requestType1,
      SecondStatus: this.requestType2
    }
    this.dialogRef.close(this.elementData);
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log('dialog closed');
  }

  closeDialog() {

  }


}

@Component({
  // selector: 'app-active-employee-upload-lop',
  templateUrl: './app-active-employee-update-lop.html',
  styleUrls: ['./app-active-employee-update-lop.scss']
})
export class UpdateLOPDaysComponent implements OnInit, AfterViewInit {
  requestType: any;
  date: any;

  data: any;
  error: any;
  action: any;
  elementData: any;
  newForm: FormGroup;
  object: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateLOPDaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any) {
    console.log('data-->' + data1);
    this.object = this.data1.element;

  }

  ngOnInit() {
    this.newForm = this.fb.group(
      {
        empCode: [],
        empName: [],
        lopdays: [],
        payableDays: []
      }
    );

    if (this.object != null) {
      this.newForm.controls.empCode.setValue(this.object.empCode);
      this.newForm.controls.empName.setValue(this.object.empName);
      this.newForm.controls.lopdays.setValue(+this.object.lopDays);
      this.newForm.controls.payableDays.setValue(+this.object.payableDays);
    }
  }

  ngAfterViewInit() {

  }

  confirm() {
    console.log(this.newForm);
    this.elementData = {
      empCode: this.newForm.value.empCode,
      empName: this.newForm.value.empName,
      lopdays: this.newForm.value.lopdays,
      payableDays: this.newForm.value.payableDays,
      status: 'Response'
    }
    this.dialogRef.close(this.elementData);
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log('dialog closed');
  }

  closeDialog() {

  }


}
export interface Element {
  recordId: string;
  employeeCode: string;
  employeeName: string;
  totalDays: string;
  lopDays: string;
  payableDays: string;

}
export interface Element {
  recordId: string;
  employeeCode: string;
  employeeName: string;
  totalDays: string;
  lopDays: string;
  payableDays: string;

}
