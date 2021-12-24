import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable, SelectItem } from 'primeng/primeng';
import { LeaveService } from '../../../../leave.service';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-comp-offs-rejected',
  templateUrl: './comp-offs-rejected.component.html',
  styleUrls: ['./comp-offs-rejected.component.scss']
})

export class CompOffsRejectedComponent implements OnInit {
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
    const dialogRef = this.dialog.open(ViewCompoffsRejectedReqComponent, {
      panelClass: 'custom-dialog-container',
      data: formValue,
    });
  }

  ngOnInit() {
    this.service.getCompOffsRejectedRequest().subscribe((data) => {
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
          this.rejectedRequest.push({
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
  templateUrl: './viewCompoffs-dialog.html',
})
export class ViewCompoffsRejectedReqComponent {
  constructor(public dialogRef: MatDialogRef<ViewCompoffsRejectedReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}