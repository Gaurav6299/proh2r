import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable, SelectItem } from 'primeng/primeng';
import { environment } from '../../../../../../environments/environment';
import { LeaveService } from '../../../../leave.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
declare var $: any;

@Component({
  selector: 'app-application-rejected',
  templateUrl: './application-rejected.component.html',
  styleUrls: ['./application-rejected.component.scss']
})
export class ApplicationRejectedComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChild("dt1") dt: DataTable;
  showHideFilter = false;
  panelFirstWidth: any;
  panelFirstHeight: any;
  displayedColumns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'leaveName', header: 'Leave Category' },
    { field: 'startDate', header: 'Start Date' },
    { field: 'endDate', header: 'End Date' },
    { field: 'numberOfLeave', header: 'Total Leave Days' },
    { field: 'leaveStatus', header: 'Status' },
    { field: 'action', header: 'Actions' }
  ];
  filterByCategory: SelectItem[] = [];
  filterByEmp: SelectItem[] = [];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  rejectedRequest = [];
  leaveStatus = [
    { statusName: 'Level 1 Approval Pending', statusValue: 'LEVEL1PENDING' },
    { statusName: 'Level 2 Approval Pending', statusValue: 'LEVEL2PENDING' },
    { statusName: 'Level 1 Cancellation Pending', statusValue: 'LEVEL1CANCEL' },
    { statusName: 'Level 2 Cancellation Pending', statusValue: 'LEVEL2CANCEL' },
    { statusName: 'Approved', statusValue: 'APPROVED' },
    { statusName: 'Cancelled', statusValue: 'CANCELLED' },
    { statusName: 'Rejected', statusValue: 'REJECTED' },
    { statusName: 'Deleted', statusValue: 'DELETED' }];
  status: any;
  errorMessage: any;
  action: any;
  notificationMsg: any;
  constructor(private service: LeaveService, public dialog: MatDialog) {
    var rolesArr = KeycloakService.getUserRole();
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
  ngOnInit() {
    this.service.getApplicationRejectedRequest().subscribe((data) => {
      if (data != null) {
        this.rejectedRequest = [];
        data.forEach(element => {
          if (!this.allBand.some(band => band.label === element.band)) {
            this.allBand.push({
              label: element.band, value: element.band
            });
          }
          if (!this.allDepartment.some(department => department.label === element.department)) {
            this.allDepartment.push({
              label: element.department, value: element.department
            });
          }
          if (!this.allDesignation.some(designation => designation.label === element.designation)) {
            this.allDesignation.push({
              label: element.designation, value: element.designation
            });
          }
          if (!this.allLocation.some(location => location.label === element.location)) {
            this.allLocation.push({
              label: element.location, value: element.location
            });
          }
          console.log('element.isHalfDay----' + element.halfDays);
          this.status = '';
          this.leaveStatus.forEach(statusInfo => {
            if (element.leaveStatus === statusInfo.statusValue) {
              this.status = statusInfo.statusName;
            }
          });
          if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
            this.filterByEmp.push({
              label: element.empName, value: element.empName + ' - ' + element.empCode
            });
          }
          if (!this.filterByCategory.some(leaveName => leaveName.label === element.leaveName)) {
            this.filterByCategory.push({
              label: element.leaveName, value: element.leaveName
            });
          }
          this.rejectedRequest.push({
            leaveId: element.leaveId,
            empCode: element.empCode,
            empName: element.empName + ' - ' + element.empCode,
            leaveName: element.leaveName,
            startDate: element.startDate,
            endDate: element.endDate,
            isHalfDay: element.isHalfDay,
            leaveHalfDays: element.leaveHalfDays,
            numberOfLeave: element.numberOfLeave,
            leaveStatus: this.status,
            reason: element.reason,
            uploadDoc: element.leaveAttachmentName,
            uploadDocPath: element.leaveAttachmentPath,
            location: element.location,
            band: element.band,
            department: element.department,
            designation: element.designation
          });
        });
        this.dt.reset();
      }
    });
  }
  viewLeaveInfo(data: any) {
    const dialogRef = this.dialog.open(ViewLeaveRejectedReqComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
@Component({
  templateUrl: './view-Leave.component.html',
})
export class ViewLeaveRejectedReqComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ViewLeaveRejectedReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log('Leave Information  :   ' + JSON.stringify(data));
  }
  ngOnInit() { }
  downloadAttachment(data: any) {
    if (data !== null)
      window.open(environment.storageServiceBaseUrl + data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}