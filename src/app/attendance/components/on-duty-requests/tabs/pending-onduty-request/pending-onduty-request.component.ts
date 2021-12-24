import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataTable, SelectItem } from 'primeng/primeng';
import { AttendanceService } from '../../../../attendance.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-pending-onduty-request',
  templateUrl: './pending-onduty-request.component.html',
  styleUrls: ['./pending-onduty-request.component.scss']
})

export class PendingOndutyRequestComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  @Output() messageEvent = new EventEmitter<string>();
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
  filterByReason: SelectItem[] = [];
  notificationMessage: any;
  pendingRequest = [];
  actions: any;
  employeeList: any = [];
  isReasonSelectable
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private service: AttendanceService) { }
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
    let dialogRef = this.dialog.open(ApproveOndutyRequestDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.messageEvent.emit();
          }
        }
      }
    });
  }
  rejectOnDutyRequest(data: any) {
    console.log('Inside rejectApproval dialog');
    const dialogRef = this.dialog.open(RejectOnDutyRequestsDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.messageEvent.emit();
          }
        }
      }
    });

  }
  viewOnDutyRequest(data: any) {
    const dialogRef = this.dialog.open(ViewOndutyPendingRequestDialogComponent, {
      width: '900px',
      panelClass: 'custom-dialog-container',
      data: data
    });
  }
  ngOnInit() {
    this.service.getOndutyPendingRequest().subscribe((data) => {
      if (data != null) {
        this.pendingRequest = [];
        data.forEach(element => {
          if (!this.filterByEmp.some(employeeName => employeeName.label === element.employeeName)) {
            this.filterByEmp.push({
              label: element.employeeName, value: element.employeeName
            });
          }
          if (!this.filterByReason.some(empReason => empReason.label === element.empReason)) {
            this.filterByReason.push({
              label: element.empReason, value: element.empReason
            });
          }
          this.pendingRequest.push({
            applicationId: element.applicationId,
            startDateObj: element.startDateObj,
            endDateObj: element.endDateObj,
            comments: element.comments,
            employeeName: element.employeeName,
            empReason: element.empReason,
            onDutyRequestStatus: element.onDutyRequestStatus,
            onDutyRequestDetailsList: element.onDutyRequestDetailsList,
            secondaryAppCommentsMandatory: element.secondaryAppCommentsMandatory,
            secondaryRejCommentsMandatory: element.secondaryRejCommentsMandatory,
            primaryAppCommentsMandatory: element.primaryAppCommentsMandatory,
            primaryRejCommentsMandatory: element.primaryRejCommentsMandatory
          });
        });
        this.dt.reset();
      }
    });
  }
}

@Component({
  templateUrl: 'approve-onduty-request-dialog.html',
})
export class ApproveOndutyRequestDialogComponent implements OnInit {
  actions: any;
  error: any;
  message
  approveOnDutyRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApproveOndutyRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private fb: FormBuilder,) {
    this.approveOnDutyRequest = this.fb.group({
      comments: ['']
    });
    if (this.data.primaryAppCommentsMandatory || this.data.secondaryAppCommentsMandatory) {
      this.approveOnDutyRequest.controls.comments.setValidators([Validators.required]);
      this.approveOnDutyRequest.controls.comments.updateValueAndValidity();
    }
  }
  approveRequest() {
    const body = {
      "comments": this.approveOnDutyRequest.controls.comments.value,
    }
    if (this.approveOnDutyRequest.valid) {
      return this.serviceApi.post('/v1/attendance/on-duty/request/approve/' + this.data.applicationId, body).
        subscribe(
          res => {
            this.actions = 'Response';
            this.message = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.actions = 'Error';
          });
    }
    else {
      Object.keys(this.approveOnDutyRequest.controls).forEach(field => {
        const control = this.approveOnDutyRequest.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }

  }
  ngOnInit() { }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'reject-onduty-request-dialog.html',
})
export class RejectOnDutyRequestsDialogComponent implements OnInit {
  actions: any;
  error: any;
  message
  rejectOnDutyRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<RejectOnDutyRequestsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {

    this.rejectOnDutyRequest = this._fb.group(
      {
        comments: [''],
      });
    if (this.data.primaryRejCommentsMandatory || this.data.secondaryRejCommentsMandatory) {
      this.rejectOnDutyRequest.controls.comments.setValidators([Validators.required]);
      this.rejectOnDutyRequest.controls.comments.updateValueAndValidity();
    }
  }
  rejectRequest() {
    const body = {
      "comments": this.rejectOnDutyRequest.controls.comments.value,
    }
    if (this.rejectOnDutyRequest.valid) {
      return this.serviceApi.post('/v1/attendance/on-duty/request/reject/' + this.data.applicationId, body).
        subscribe(
          res => {
            this.actions = 'Response';
            this.message = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.actions = 'Error';
          });
    } else {
      Object.keys(this.rejectOnDutyRequest.controls).forEach(field => {
        const control = this.rejectOnDutyRequest.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  ngOnInit() {
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
@Component({
  templateUrl: 'view-onduty-request-dialog.html',
})
export class ViewOndutyPendingRequestDialogComponent {
  dataColumns = [
    { field: 'dateObj', header: 'Date' },
    { field: 'shiftTimings', header: 'Shift Durations' },
    { field: 'startTimeObj', header: 'Start Time' },
    { field: 'endTimeObj', header: 'End Time' },
    { field: 'remarks', header: 'Remarks' },
  ]
  ondutyShowList = [];
  constructor(public dialogRef: MatDialogRef<ViewOndutyPendingRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    data.onDutyRequestDetailsList.forEach(element => {
      this.ondutyShowList.push({
        "dateObj": element.dateObj,
        "shiftTimings": element.shiftTimings,
        "startTimeObj": element.startTimeObj,
        "endTimeObj": element.endTimeObj,
        "remarks": element.remarks
      })
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}