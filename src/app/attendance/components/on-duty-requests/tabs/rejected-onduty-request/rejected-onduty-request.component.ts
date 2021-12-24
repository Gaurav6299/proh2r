import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataTable, SelectItem } from 'primeng/primeng';
import { AttendanceService } from '../../../../attendance.service';
declare var $: any;

@Component({
  selector: 'app-rejected-onduty-request',
  templateUrl: './rejected-onduty-request.component.html',
  styleUrls: ['./rejected-onduty-request.component.scss']
})
export class RejectedOndutyRequestComponent implements OnInit {
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
  rejectedRequest = [];
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
  viewOnDutyRequest(data: any) {
    const dialogRef = this.dialog.open(ViewOndutyRejectedRequestDialogComponent, {
      width: '900px',
      panelClass: 'custom-dialog-container',
      data: data
    });
  }
  ngOnInit() {
    this.service.getOndutyRejectedRequest().subscribe((data) => {
      if (data != null) {
        this.rejectedRequest = [];
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
          this.rejectedRequest.push({
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
  templateUrl: 'view-onduty-request-dialog.html',
})
export class ViewOndutyRejectedRequestDialogComponent {
  dataColumns = [
    { field: 'dateObj', header: 'Date' },
    { field: 'shiftTimings', header: 'Shift Durations' },
    { field: 'startTimeObj', header: 'Start Time' },
    { field: 'endTimeObj', header: 'End Time' },
    { field: 'remarks', header: 'Remarks' },
  ]
  ondutyShowList = [];
  constructor(public dialogRef: MatDialogRef<ViewOndutyRejectedRequestDialogComponent>,
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