import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable, SelectItem } from 'primeng/primeng';
import { LeaveService } from '../../../../leave.service';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-comp-offs-approved',
  templateUrl: './comp-offs-approved.component.html',
  styleUrls: ['./comp-offs-approved.component.scss']
})

export class CompOffsApprovedComponent implements OnInit {
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
  deleteCompOffRequest(leaveId: any) {
      this.action = '';
      const dialogRef = this.dialog.open(DeleteCompOffApprovedRequestComponent, {
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
  viewLeaveInfo(formValue: any) {
    console.log('Form Information ----- ' + JSON.stringify(formValue));
    const dialogRef = this.dialog.open(ViewCompoffsApprovedReqComponent, {
      panelClass: 'custom-dialog-container',
      data: formValue,
    });
  }

  ngOnInit() {
    this.service.getCompOffsApprovedRequest().subscribe((data) => {
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
          this.approvedRequest.push({
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
  templateUrl: './delete-compOff-req.component.html',
})
export class DeleteCompOffApprovedRequestComponent implements OnInit {
  action: any;
  error: any;
  deleteIndividualLeavesRequest: FormGroup;
  leaveId: any;
  constructor(public dialogRef: MatDialogRef<DeleteCompOffApprovedRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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
@Component({
  templateUrl: './viewCompoffs-dialog.html',
})
export class ViewCompoffsApprovedReqComponent {
  constructor(public dialogRef: MatDialogRef<ViewCompoffsApprovedReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}