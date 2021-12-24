import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DataTable, SelectItem } from 'primeng/primeng';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../services/api-common.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AttendanceService } from '../../attendance.service';
declare var $: any;
@Component({
  selector: 'app-on-duty-requests',
  templateUrl: './on-duty-requests.component.html',
  styleUrls: ['./on-duty-requests.component.scss']
})
export class OnDutyRequestsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'startDateObj', header: 'Start Date' },
    { field: 'endDateObj', header: 'End Date' },
    { field: 'empReason', header: 'Reason' },
    { field: 'comments', header: 'Comments' },
    { field: 'onDutyRequestStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ];
  filterByEmp: SelectItem[] = [];
  filterByStatus: SelectItem[] = [];
  filterByReason: SelectItem[] = [];
  panelFirstWidth: any;
  panelFirstHeight: any;
  notificationMessage: any;
  getOnDutyRequestList = [];
  actions: any;
  employeeList: any = [];
  isReasonSelectable
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private attendanceService: AttendanceService) { }
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
  approveOndutyRequest(data: any) {
    // let dialogRef = this.dialog.open(ApproveOndutyRequestDialogComponent, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: data
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result != undefined) {
    //     if (result.status === 'Response') {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         this.successNotification(result.message);
    //         this.getAllOnDutyRequest();
    //       }
    //     }
    //   }
    // });
  }
  initiateOndutyRequest() {
    let dialogRef = this.dialog.open(TeamOndutyRequestDialogComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: {
        actions: 'add', title: "New Employee On Duty Request", employeeList: this.employeeList
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getAllOnDutyRequest();
          }
        }
      }
    });
  }
  rejectOnDutyRequest(data: any) {
    // console.log('Inside rejectApproval dialog');
    // const dialogRef = this.dialog.open(RejectOnDutyRequestsDialogComponent, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: data
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result != undefined) {
    //     if (result.status === 'Response') {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         this.successNotification(result.message);
    //         this.getAllOnDutyRequest();
    //       }
    //     }
    //   }
    // });
  }
  cancelOnDutyRequestDialog(data: any) {
    // console.log('Inside cancel request dialog');
    // // tslint:disable-next-line: no-use-before-declare
    // const dialogRef = this.dialog.open(CancelOndutyRequestDialogComponent, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: data
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // tslint:disable-next-line: triple-equals
    //   if (result != undefined) {
    //     if (result.status === 'Response') {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         this.successNotification(result.message);
    //         this.getAllOnDutyRequest();
    //       }
    //     }
    //   }
    // });
  }
  viewOnDutyRequest(data: any) {
    // const dialogRef = this.dialog.open(ViewOndutyRequestDialogComponent, {
    //   width: '900px',
    //   panelClass: 'custom-dialog-container',
    //   data: data
    // });
  }
  // getAllOnDutyRequest() {
  //   this.getOnDutyRequestList = [];
  //   this.serviceApi.get('/v1/attendance/on-duty/request/get-all').subscribe(res => {
  //     res.forEach(element => {
  //       if (!this.filterByEmp.some(employeeName => employeeName.label === element.employeeName)) {
  //         this.filterByEmp.push({
  //           label: element.employeeName, value: element.employeeName
  //         });
  //       }
  //       if (!this.filterByStatus.some(onDutyRequestStatus => onDutyRequestStatus.label === element.onDutyRequestStatus)) {
  //         this.filterByStatus.push({
  //           label: element.onDutyRequestStatus, value: element.onDutyRequestStatus
  //         });
  //       }
  //       if (!this.filterByReason.some(empReason => empReason.label === element.empReason)) {
  //         this.filterByReason.push({
  //           label: element.empReason, value: element.empReason
  //         });
  //       }
  //       this.getOnDutyRequestList.push({
  //         applicationId: element.applicationId,
  //         startDateObj: element.startDateObj,
  //         endDateObj: element.endDateObj,
  //         comments: element.comments,
  //         employeeName: element.employeeName,
  //         empReason: element.empReason,
  //         onDutyRequestStatus: element.onDutyRequestStatus,
  //         onDutyRequestDetailsList: element.onDutyRequestDetailsList,
  //         secondaryAppCommentsMandatory: element.secondaryAppCommentsMandatory,
  //         secondaryRejCommentsMandatory: element.secondaryRejCommentsMandatory,
  //         primaryAppCommentsMandatory: element.primaryAppCommentsMandatory,
  //         primaryRejCommentsMandatory: element.primaryRejCommentsMandatory
  //       });
  //     });
  //   },
  //     (err) => {
  //     }, () => {
  //       this.dt.reset();
  //     });

  // }
  getAllOnDutyRequest() {
    this.attendanceService.clearData();
    const url = '/v1/attendance/on-duty/request/get-all'
    return this.serviceApi.get(url)
      .subscribe(res => {
        this.attendanceService.sendOndutyRequestData(res.filter(x => (x.onDutyRequestStatus).toString().includes('LEVEL')), res.filter(x => (x.onDutyRequestStatus).toString() == ('APPROVED')), res.filter(x => (x.onDutyRequestStatus).toString() == "CANCELLED"), res.filter(x => (x.onDutyRequestStatus).toString() == "REJECTED"))
        return;
      });
  }

  onTabChange(event) {
    console.log(event);
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  message: string;
  receiveMessage($event) {
    this.message = $event;
    this.getAllOnDutyRequest();
  }
  ngOnInit() {
    this.getAllOnDutyRequest();
    this.getEmployees();
  }
  getEmployees() {
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employeeList.push({
              fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode, value: element.empCode
            });
          });
        });
  }
}


// @Component({
//   templateUrl: 'approve-onduty-request-dialog.html',
// })
// export class ApproveOndutyRequestDialogComponent implements OnInit {
//   actions: any;
//   error: any;
//   message
//   approveOnDutyRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<ApproveOndutyRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private fb: FormBuilder,) {
//     this.approveOnDutyRequest = this.fb.group({
//       comments: ['']
//     });
//     if (this.data.primaryAppCommentsMandatory || this.data.secondaryAppCommentsMandatory) {
//       this.approveOnDutyRequest.controls.comments.setValidators([Validators.required]);
//       this.approveOnDutyRequest.controls.comments.updateValueAndValidity();
//     }


//   }
//   approveRequest() {
//     const body = {
//       "comments": this.approveOnDutyRequest.controls.comments.value,
//     }
//     if (this.approveOnDutyRequest.valid) {
//       return this.serviceApi.post('/v1/attendance/on-duty/request/approve/' + this.data.applicationId, body).
//         subscribe(
//           res => {
//             this.actions = 'Response';
//             this.message = res.message;
//             this.close();
//           },
//           err => {
//             console.log('there is something error.....  ' + err.message);
//             this.actions = 'Error';
//           });
//     }
//     else {
//       Object.keys(this.approveOnDutyRequest.controls).forEach(field => {
//         const control = this.approveOnDutyRequest.get(field);
//         control.markAsTouched({ onlySelf: true });
//       });
//     }

//   }
//   ngOnInit() { }
//   close(): void {
//     this.data.message = this.message;
//     this.data.status = this.actions;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }
// }

// @Component({
//   templateUrl: 'reject-onduty-request-dialog.html',
// })
// export class RejectOnDutyRequestsDialogComponent implements OnInit {
//   actions: any;
//   error: any;
//   message
//   rejectOnDutyRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<RejectOnDutyRequestsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {

//     this.rejectOnDutyRequest = this._fb.group(
//       {
//         comments: [''],
//       });
//     if (this.data.primaryRejCommentsMandatory || this.data.secondaryRejCommentsMandatory) {
//       this.rejectOnDutyRequest.controls.comments.setValidators([Validators.required]);
//       this.rejectOnDutyRequest.controls.comments.updateValueAndValidity();
//     }
//   }
//   rejectRequest() {
//     const body = {
//       "comments": this.rejectOnDutyRequest.controls.comments.value,
//     }
//     if (this.rejectOnDutyRequest.valid) {
//       return this.serviceApi.post('/v1/attendance/on-duty/request/reject/' + this.data.applicationId, body).
//         subscribe(
//           res => {
//             this.actions = 'Response';
//             this.message = res.message;
//             this.close();
//           },
//           err => {
//             console.log('there is something error.....  ' + err.message);
//             this.actions = 'Error';
//           });
//     } else {
//       Object.keys(this.rejectOnDutyRequest.controls).forEach(field => {
//         const control = this.rejectOnDutyRequest.get(field);
//         control.markAsTouched({ onlySelf: true });
//       });
//     }
//   }
//   ngOnInit() {
//   }
//   close(): void {
//     this.data.message = this.message;
//     this.data.status = this.actions;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     console.log(this.data);
//     this.dialogRef.close(this.data);
//   }

// }

@Component({
  templateUrl: 'team-onduty-request-dialog.html',
})
export class TeamOndutyRequestDialogComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  actions: any;
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
  canApplyRequestForMultipleDays: boolean = true;
  notemplateAssigned: boolean = false;
  selectedEmployee
  minDate: any;
  maxDate: any;
  columnsOD = [
    { field: 'date', header: 'Date' },
    { field: 'shiftName', header: 'Shift Name' },
    { field: 'shiftTimings', header: 'Shift Durations' },
    { field: 'shiftStartTime', header: 'Start Time' },
    { field: 'shiftEndTime', header: 'End Time' },
    { field: 'remarks', header: 'Remarks' },
  ]
  onDutyRequestList = [];
  dates: any[];
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
  constructor(public dialogRef: MatDialogRef<TeamOndutyRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private datePipe: DatePipe, private fb: FormBuilder,) {
    this.title = this.data.title;
    this.employeeList = this.data.employeeList
    this.onDutyRequestForm = this.fb.group({
      applicationId: [0],
      selectedEmployee: [null, Validators.required],
      onDutyDuration: [null],
      datesArray: this.fb.array([]),
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      reason: [null],
      comments: [null]
    });
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
      this.serviceApi.get('/v1/attendance/on-duty/request/' + startDate + '/' + endDate + '/' + this.selectedEmployee).subscribe(res => {
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
  ngOnInit() {
  }
  changeEmployee(empCode) {
    this.selectedEmployee = empCode;
    this.onDutyRequestForm.reset();
    this.onDutyRequestReasons = [];
    this.onDutyRequestForm.controls.selectedEmployee.setValue(empCode);
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
            if (this.defaultOndutyTimings) {
              this.serviceApi.get('/v1/attendance/settings/shift/by/' + empCode).
                subscribe(
                  res => {
                    this.shiftStartTime = res[0].shiftStartTime
                    this.shiftEndTime = res[0].shiftEndTime
                    this.onDutyRequestForm.controls.onDutyStartTiming.setValue(this.shiftStartTime);
                    this.onDutyRequestForm.controls.onDutyEndTiming.setValue(this.shiftEndTime);
                    this.onDutyRequestForm.controls.onDutyStartTiming.updateValueAndValidity();
                    this.onDutyRequestForm.controls.onDutyEndTiming.updateValueAndValidity();
                  });
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
    this.onDutyRequestForm.controls.reason.setValue(empCode);
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
          "empCode": this.onDutyRequestForm.controls.selectedEmployee.value,
          "startDate": this.onDutyRequestForm.controls.startDate.value.toLocaleDateString('en-GB', options).replaceAll('/', '-'),
          "endDate": this.onDutyRequestForm.controls.endDate.value.toLocaleDateString('en-GB', options).replaceAll('/', '-'),
          "comments": this.onDutyRequestForm.controls.comments.value,
          "onDutyRequestDetailsList": datesArray
        }
        return this.serviceApi.post('/v1/attendance/on-duty/request/', body).
          subscribe(
            res => {
              this.actions = 'Response';
              this.message = res.message;
              this.close();
            },
            err => {
              console.log('there is something error.....  ' + err.message);
              this.actions = 'Error';
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
  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}

// @Component({
//   templateUrl: 'cancel-onduty-request-dialog.html',
// })
// export class CancelOndutyRequestDialogComponent implements OnInit {
//   action: any;
//   error: any;
//   constructor(public dialogRef: MatDialogRef<CancelOndutyRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) { }

//   cancelOnDutyRequest() {
//     // tslint:disable-next-line:max-line-length
//     return this.serviceApi.put('/v1/attendance/on-duty/request/cancel/' + this.data.applicationId, null).
//       subscribe(
//         res => {
//           console.log('Cancel Request Successfully...' + JSON.stringify(res));
//           this.action = 'Response';
//           this.error = res.message;
//           this.close();
//         },
//         err => {
//           console.log('there is something error.....  ' + err.message);
//           this.action = 'Error';
//           this.error = err.message;
//           this.close();
//         });
//   }
//   ngOnInit() {

//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }
// }

// @Component({
//   templateUrl: 'view-onduty-request-dialog.html',
// })
// export class ViewOndutyRequestDialogComponent {
//   dataColumns = [
//     { field: 'dateObj', header: 'Date' },
//     { field: 'shiftTimings', header: 'Shift Durations' },
//     { field: 'startTimeObj', header: 'Start Time' },
//     { field: 'endTimeObj', header: 'End Time' },
//     { field: 'remarks', header: 'Remarks' },
//   ]
//   ondutyShowList = [];
//   constructor(public dialogRef: MatDialogRef<ViewOndutyRequestDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any) {
//     data.onDutyRequestDetailsList.forEach(element => {
//       this.ondutyShowList.push({
//         "dateObj": element.dateObj,
//         "shiftTimings": element.shiftTimings,
//         "startTimeObj": element.startTimeObj,
//         "endTimeObj": element.endTimeObj,
//         "remarks": element.remarks
//       })
//     });
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
