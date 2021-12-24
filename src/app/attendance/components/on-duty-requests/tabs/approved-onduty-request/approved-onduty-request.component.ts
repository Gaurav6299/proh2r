import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataTable, SelectItem } from 'primeng/primeng';
import { AttendanceService } from '../../../../attendance.service';
declare var $: any;

@Component({
  selector: 'app-approved-onduty-request',
  templateUrl: './approved-onduty-request.component.html',
  styleUrls: ['./approved-onduty-request.component.scss']
})

export class ApprovedOndutyRequestComponent implements OnInit {
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
  approvedRequest = [];
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
  cancelOnDutyRequestDialog(data: any) {
    console.log('Inside cancel request dialog');
    const dialogRef = this.dialog.open(CancelOndutyRequestDialogComponent, {
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
    const dialogRef = this.dialog.open(ViewOndutyApprovedRequestDialogComponent, {
      width: '900px',
      panelClass: 'custom-dialog-container',
      data: data
    });
  }
  ngOnInit() {
    this.service.getOndutyApprovedRequest().subscribe((data) => {
      if (data != null) {
        this.approvedRequest = [];
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
          this.approvedRequest.push({
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
  templateUrl: 'cancel-onduty-request-dialog.html',
})
export class CancelOndutyRequestDialogComponent implements OnInit {
  action: any;
  error: any;
  constructor(public dialogRef: MatDialogRef<CancelOndutyRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) { }
  cancelOnDutyRequest() {
    return this.serviceApi.put('/v1/attendance/on-duty/request/cancel/' + this.data.applicationId, null).
      subscribe(
        res => {
          console.log('Cancel Request Successfully...' + JSON.stringify(res));
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
@Component({
  templateUrl: 'view-onduty-request-dialog.html',
})
export class ViewOndutyApprovedRequestDialogComponent {
  dataColumns = [
    { field: 'dateObj', header: 'Date' },
    { field: 'shiftTimings', header: 'Shift Durations' },
    { field: 'startTimeObj', header: 'Start Time' },
    { field: 'endTimeObj', header: 'End Time' },
    { field: 'remarks', header: 'Remarks' },
  ]
  ondutyShowList = [];
  constructor(public dialogRef: MatDialogRef<ViewOndutyApprovedRequestDialogComponent>,
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