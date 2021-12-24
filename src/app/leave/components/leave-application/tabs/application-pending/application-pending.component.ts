import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTable, SelectItem } from 'primeng/primeng';
import { LeaveService } from '../../../../leave.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { environment } from '../../../../../../environments/environment';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-application-pending',
  templateUrl: './application-pending.component.html',
  styleUrls: ['./application-pending.component.scss']
})

export class ApplicationPendingComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
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
  @ViewChild("dt1") dt: DataTable;
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  selection = new SelectionModel<Element>(true, []);
  pendingRequest = [];
  checkedRowData = [];
  employeeLeaveApplication: FormGroup;
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
  constructor(private service: LeaveService, public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) {
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
    this.service.getApplicationPendingRequest().subscribe((data) => {
      if (data != null) {
        this.pendingRequest = [];
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
          this.pendingRequest.push({
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
    this.employeeLeaveApplication = this.fb.group({
      assignLeaveApplication: [],
    });
  }
  selectedValue(value: any) {
    if (value === 'approveMultipleRequest') {
      if (this.checkedRowData.length > 0) {
        console.log('Inside approve dialog');
        console.log(this.checkedRowData);
        const dialogRef = this.dialog.open(ApproveLeaveMultipleRequest, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: this.checkedRowData
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            if (result.status === 'Response') {
              console.log(result);
              this.notificationMsg = result.message;
              this.selection.clear();
              this.checkedRowData = [];
              this.successNotification(this.notificationMsg);
              this.messageEvent.emit();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
            }
          }
        });
      } else {
        this.checkedRowData = [];
        this.selection.clear();
        this.warningNotification('Select employee first');
      }
    }
    else if (value === 'rejectMultipleRequest') {
      console.log('true');
      console.log('value....' + value);
      this.openDialogRejectMultipleRequest();
    }
    else if (value === 'bulkApproveCancelLeave') {
      console.log('true');
      console.log('value....' + value);
      this.openDialogBulkApproveCancelLeave();
    }
    else if (value === 'bulkRejectCancelLeave') {
      console.log('true');
      console.log('value....' + value);
      this.openDialogBulkRejectCancelLeave();
    }
  }
  viewLeaveInfo(data: any) {
    const dialogRef = this.dialog.open(ViewLeavePendingReqComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialogApproveMultipleRequest() {
    console.log('Inside upload Template Assignment');
    const dialogRef = this.dialog.open(ApproveLeaveMultipleRequest, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialogRejectMultipleRequest() {
    console.log('Inside upload Supervisor');
    const dialogRef = this.dialog.open(RejectLeaveMultipleRequest, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialogBulkApproveCancelLeave() {
    console.log('Inside upload Supervisor');
    const dialogRef = this.dialog.open(BulkApproveCancelLeave, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialogBulkRejectCancelLeave() {
    console.log('Inside Bulk Reject');
    const dialogRef = this.dialog.open(BulkRejectCancelLeave, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  approveIndividualLeave(leaveId: any) {
      this.action = '';
      console.log('Inside Bulk Reject');
      const dialogRef = this.dialog.open(ApproveIndividualLeave, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { leaveId: leaveId, message: this.errorMessage, status: this.action }
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
  deleteIndividualleave(id: any) {
      this.action = '';
      console.log('Leave ID ---- ' + id);
      const dialogRef = this.dialog.open(DeleteLeaveRequest, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { id: id, message: this.errorMessage, status: this.action }
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
      });
  }
  rejectLeaveRequest(leaveId: any) {
      this.action = '';
      console.log('Inside Bulk Reject');
      const dialogRef = this.dialog.open(RejectIndividualLeave, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { leaveId: leaveId, message: this.errorMessage, status: this.action }
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
}

// view-Leave
@Component({
  templateUrl: './view-Leave.component.html',
})
export class ViewLeavePendingReqComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ViewLeavePendingReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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
// ApproveLeaveMultipleRequest
@Component({
  templateUrl: './ApproveLeaveMultipleRequest.component.html',
})
export class ApproveLeaveMultipleRequest implements OnInit {
  approveMultipleLeavesRequest: FormGroup;
  action: any;
  error: any;
  checkedRowData = [];
  constructor(public dialogRef: MatDialogRef<ApproveLeaveMultipleRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    console.log(data.checkedRowData);
    console.log('data-->' + data.checkedRowData);
    data.checkedRowData.forEach(element => {
      this.checkedRowData.push(element.leaveId);
    });
    this.approveMultipleLeavesRequest = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  ngOnInit() { }
  approveMultiRequest() {
    if (this.approveMultipleLeavesRequest.valid) {
      console.log('Comment Value.......' + this.approveMultipleLeavesRequest.controls.usrComment.value);
      console.log('Comment Value.......' + this.approveMultipleLeavesRequest.controls.usrComment.value);
      console.log(this.checkedRowData);
      const body = {
        "action": "APPROVE",
        "comment": this.approveMultipleLeavesRequest.controls.usrComment.value,
        "reqIds": this.checkedRowData,
      }
      this.serviceApi.put('/v1/leave/leaveapplication/bulkAction', body).subscribe(
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
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// RejectLeaveMultipleRequest
@Component({
  templateUrl: './RejectLeaveMultipleRequest.component.html',
})
export class RejectLeaveMultipleRequest implements OnInit {
  rejectMultipleLeavesRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<RejectLeaveMultipleRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    this.rejectMultipleLeavesRequest = this._fb.group(
      {
        usrComment: [],
      });
  }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// BulkApproveCancelLeave
@Component({
  templateUrl: './BulkApproveCancelLeave.component.html',
})
export class BulkApproveCancelLeave implements OnInit {
  bulkApproveMultipleLeavesRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<BulkApproveCancelLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    this.bulkApproveMultipleLeavesRequest = this._fb.group(
      {
        usrComment: [],
      });
  }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// BulkRejectCancelLeave
@Component({
  templateUrl: './BulkRejectCancelLeave.component.html',
})
export class BulkRejectCancelLeave implements OnInit {
  bulkRejectMultipleLeavesRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<BulkRejectCancelLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    this.bulkRejectMultipleLeavesRequest = this._fb.group(
      {
        attendenceTemplate: [data.attendenceTemplate],
      });
  }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './ApproveIndividualLeave.component.html',
})
export class ApproveIndividualLeave implements OnInit {
  error: any;
  action: any;
  approveIndividualLeavesRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApproveIndividualLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.approveIndividualLeavesRequest = this._fb.group(
      {
        usrComment: [],
      });
  }
  approveAppliation() {
    if (this.approveIndividualLeavesRequest.valid) {
      console.log('Comment Value.......' + this.approveIndividualLeavesRequest.controls.usrComment.value);
      this.serviceApi.put('/v1/leave/leaveapplication/admin/' + this.data.leaveId + '/action?action=APPROVE&&comments=' + this.approveIndividualLeavesRequest.controls.usrComment.value, null).
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
// RejectIndividualLeave
@Component({
  templateUrl: './RejectIndividualLeave.component.html',
})
export class RejectIndividualLeave implements OnInit {
  action: any;
  error: any;
  rejectIndividualLeavesRequest: FormGroup;
  leaveId: any;
  constructor(public dialogRef: MatDialogRef<RejectIndividualLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.rejectIndividualLeavesRequest = this._fb.group(
      {
        usrComment: [],
      });
  }
  rejectRequest() {
    if (this.rejectIndividualLeavesRequest.valid) {
      console.log('Comment Value.......' + this.rejectIndividualLeavesRequest.controls.usrComment.value);
      this.serviceApi.put('/v1/leave/leaveapplication/admin/' + this.data.leaveId + '/action?action=REJECT&&comments=' + this.rejectIndividualLeavesRequest.controls.usrComment.value, null).
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
// DeleteLeaveRequest
@Component({
  templateUrl: './DeleteLeaveRequest.component.html',
})
export class DeleteLeaveRequest implements OnInit {
  action: any;
  error: any;
  rejectIndividualLeavesRequest: FormGroup;
  leaveId: any;
  constructor(public dialogRef: MatDialogRef<DeleteLeaveRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
    this.leaveId = data.id;
  }
  deleteRequest() {
    console.log('Inside Reject Request ' + this.leaveId);
    this.serviceApi.delete('/v1/leave/leaveapplication/admin/' + this.leaveId).
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
