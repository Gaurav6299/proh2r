import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable, SelectItem } from 'primeng/primeng';
import { environment } from '../../../../../../environments/environment';
import { LeaveService } from '../../../../leave.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-application-approved',
  templateUrl: './application-approved.component.html',
  styleUrls: ['./application-approved.component.scss']
})

export class ApplicationApprovedComponent implements OnInit {
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
  approvedRequest = [];
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
    this.service.getApplicationApprovedRequest().subscribe((data) => {
      if (data != null) {
        this.approvedRequest = [];
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
          this.approvedRequest.push({
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
  cancelLeaveRequest(leave: any) {
      this.action = '';
      console.log('Inside Bulk Reject');
      const dialogRef = this.dialog.open(CancelIndividualLeaveRequest, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { leaveId: leave.leaveId, message: this.errorMessage, status: this.action, empCode: leave.empCode }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
              this.messageEvent.emit();
            }
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
            }
          }
        }
        console.log('The dialog was closed');
      });
  }
  viewLeaveInfo(data: any) {
    const dialogRef = this.dialog.open(ViewLeaveApprovedReqComponent, {
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
export class ViewLeaveApprovedReqComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ViewLeaveApprovedReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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
// CancelIndividualLeaveRequest
@Component({
  templateUrl: './CancelIndividualLeaveRequest.component.html',
})
export class CancelIndividualLeaveRequest implements OnInit {
  action: any;
  error: any;
  cancelIndividualLeavesRequest: FormGroup;
  isCommentMandatory: any;
  constructor(public dialogRef: MatDialogRef<CancelIndividualLeaveRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.cancelIndividualLeavesRequest = this._fb.group(
      {
        usrComment: [],
      });
    this.serviceApi.get('/v1/leave/leaveapplication/template/' + data.empCode).
      subscribe(
        res => {
          console.log('Comment mendatory.. ' + res.isCommentMadatory);
          this.isCommentMandatory = res.isCommentMadatory;
          if (this.isCommentMandatory) {
            this.cancelIndividualLeavesRequest.controls.usrComment.setValidators(Validators.required);
          } else {
            this.cancelIndividualLeavesRequest.controls.usrComment.clearAsyncValidators();
          }
          this.cancelIndividualLeavesRequest.controls.usrComment.updateValueAndValidity();
        });
  }
  cancelAppliation() {
    if (this.cancelIndividualLeavesRequest.valid) {
      console.log('Comment Value.......' + this.cancelIndividualLeavesRequest.controls.usrComment.value);
      this.serviceApi.put('/v1/leave/leaveapplication/admin/' + this.data.leaveId + '/action?action=CANCEL&&comments=' + this.cancelIndividualLeavesRequest.controls.usrComment.value, null).
        subscribe(
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
          });
    } else {
      Object.keys(this.cancelIndividualLeavesRequest.controls).forEach(field => {
        const control = this.cancelIndividualLeavesRequest.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  ngOnInit() { }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
