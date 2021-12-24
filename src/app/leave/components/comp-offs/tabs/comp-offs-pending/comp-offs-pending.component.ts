import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable, SelectItem } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../../../../leave.service';
declare var $: any;
@Component({
  selector: 'app-comp-offs-pending',
  templateUrl: './comp-offs-pending.component.html',
  styleUrls: ['./comp-offs-pending.component.scss']
})
export class CompOffsPendingComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  @Output() messageEvent = new EventEmitter<string>();
  displayedColumns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'appliedOn', header: 'Applied On' },
    { field: 'appliedFor', header: 'Applied For' },
    { field: 'usedOn', header: 'Used On' },
    { field: 'comment', header: 'Comment' },
    { field: 'leaveStatus', header: 'Status' },
    { field: 'action', header: 'Actions' }
  ];
  filterByEmp: SelectItem[] = [];;
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  panelFirstWidth: any;
  panelFirstHeight: any;
  pendingRequest = [];
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
  action: any;
  errorMessage: any;
  empCode: any;
  constructor(private service: LeaveService, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.empCode = KeycloakService.getUsername();
    console.log('Logged in user Full Name :::' + KeycloakService.getFullName());
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
  viewLeaveInfo(formValue: any) {
    console.log('Form Information ----- ' + JSON.stringify(formValue));
    const dialogRef = this.dialog.open(ViewCompoffsPendingReqComponent, {
      panelClass: 'custom-dialog-container',
      data: formValue,
    });
  }

  editCompOffReq(leaveDetails: any) {
      this.action = '';
      const dialogRef = this.dialog.open(EditCompOffRequestComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: leaveDetails,
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
  approveIndividualCompOffReq(leaveId: any) {
      this.action = '';
      console.log('Inside Bulk Reject');
      const dialogRef = this.dialog.open(ApproveIndividualCompOffReqComponent, {
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
  rejectLeaveRequest(leaveId: any) {
      this.action = '';
      const dialogRef = this.dialog.open(RejectCompOffRequestComponent, {
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

  deleteCompOffRequest(leaveId: any) {
      this.action = '';
      const dialogRef = this.dialog.open(DeleteCompOffRequestComponent, {
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
  ngOnInit() {
    this.service.getCompOffsPendingRequest().subscribe((data) => {
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
          this.status = '';
          this.leaveStatus.forEach(statusInfo => {
            if (element.leaveStatus === statusInfo.statusValue) {
              this.status = statusInfo.statusName;
            }
          });
          if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
            this.filterByEmp.push({
              label: element.empName, value: element.empName
            });
          }
          this.pendingRequest.push({
            compOffId: element.compOffId,
            usedOn: element.usedOn,
            empName: element.empName,
            appliedOn: element.appliedOn,
            appliedFor: element.appliedFor,
            leaveStatus: this.status,
            comment: element.comment,
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
}

@Component({
  templateUrl: './edit-compOff-request.component.html',
})
export class EditCompOffRequestComponent implements OnInit {
  empCode = KeycloakService.getUsername();
  action: any;
  error: any;
  editCompOffRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<EditCompOffRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    console.log('Edit Compoff Form value.........' + JSON.stringify(data));
    this.editCompOffRequest = this._fb.group(
      {
        compOffDate: ['', Validators.required],
        reason: ['', Validators.required]
      }
    );
  }
  updateAppliation() {
    console.log('Inside Comp off Request -------------------------');
    if (this.editCompOffRequest.valid) {
      console.log('form value ' + JSON.stringify(this.editCompOffRequest.value));
      var body = {
        'empCodeList': [this.empCode],
        'categoryName': 'Comp Offs',
        'appliedFor': this.editCompOffRequest.controls.compOffDate.value,
        'comment': this.editCompOffRequest.controls.reason.value,
      };
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/leave/compoffEarnings/updateCompOffByAdmin/' + this.data.compOffId, body).
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
  ngOnInit() {
    this.editCompOffRequest.controls.compOffDate.setValue(this.data.appliedFor);
    this.editCompOffRequest.controls.reason.setValue(this.data.comment);
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
  templateUrl: './viewCompoffs-dialog.html',
})

export class ViewCompoffsPendingReqComponent {
  constructor(public dialogRef: MatDialogRef<ViewCompoffsPendingReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
  }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: './reject-compOff.component.html',
})
export class RejectCompOffRequestComponent implements OnInit {
  action: any;
  error: any;
  rejectIndividualLeavesRequest: FormGroup;
  leaveId: any;
  constructor(public dialogRef: MatDialogRef<RejectCompOffRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.rejectIndividualLeavesRequest = this._fb.group(
      {
        usrComment: [],
      });
  }
  rejectRequest() {
    if (this.rejectIndividualLeavesRequest.valid) {
      console.log('Compoff id ' + this.data.leaveId);
      console.log('Comment Value.......' + this.rejectIndividualLeavesRequest.controls.usrComment.value);
      return this.serviceApi.put('/v1/leave/compoffEarnings/compOffActionBySupervisor/' + this.data.leaveId + '/action?action=REJECT&&comments=' + this.rejectIndividualLeavesRequest.controls.usrComment.value, null).
        subscribe(
          res => {
            console.log('Successfully...' + JSON.stringify(res));
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

@Component({
  templateUrl: './approve-individual-compOff.component.html',
})
export class ApproveIndividualCompOffReqComponent implements OnInit {
  error: any;
  action: any;
  approveIndividualCompOffRequest: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApproveIndividualCompOffReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.approveIndividualCompOffRequest = this._fb.group(
      {
        usrComment: [],
      });
  }
  approveAppliation() {
    if (this.approveIndividualCompOffRequest.valid) {
      console.log('Comment Value.......' + this.approveIndividualCompOffRequest.controls.usrComment.value);
      return this.serviceApi.put('/v1/leave/compoffEarnings/compOffActionBySupervisor/' + this.data.leaveId + '/action?action=APPROVE&&comments=' + this.approveIndividualCompOffRequest.controls.usrComment.value, null).
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


@Component({
  templateUrl: './delete-compOff-req.component.html',
})
export class DeleteCompOffRequestComponent implements OnInit {
  action: any;
  error: any;
  deleteIndividualLeavesRequest: FormGroup;
  leaveId: any;
  constructor(public dialogRef: MatDialogRef<DeleteCompOffRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.deleteIndividualLeavesRequest = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  deleteRequest() {
    if (this.deleteIndividualLeavesRequest.valid) {
      console.log('Compoff id ' + this.data.leaveId);
      console.log('Comment Value.......' + this.deleteIndividualLeavesRequest.controls.usrComment.value);
      return this.serviceApi.delete('/v1/leave/compoffEarnings/deleteCompOffByAdmin/' + this.data.leaveId).
        subscribe(
          res => {
            console.log('Successfully...' + JSON.stringify(res));
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
    else {
      Object.keys(this.deleteIndividualLeavesRequest.controls).forEach(field => {
        const control = this.deleteIndividualLeavesRequest.get(field);
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
