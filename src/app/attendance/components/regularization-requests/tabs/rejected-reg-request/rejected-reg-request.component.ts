import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { AttendanceService } from '../../../../attendance.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable, SelectItem } from 'primeng/primeng';
import { SelectionModel } from '@angular/cdk/collections';
declare var $: any;

@Component({
  selector: 'app-rejected-reg-request',
  templateUrl: './rejected-reg-request.component.html',
  styleUrls: ['./rejected-reg-request.component.scss']
})
export class RejectedRegRequestComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'regularizationDate', header: 'Date' },
    { field: 'requestType', header: 'Type' },
    { field: 'checkInTime', header: 'Requested Check-In' },
    { field: 'checkOutTime', header: 'Requested Check-Out' },
    { field: 'regularizationComments', header: 'Reason' },
    { field: 'regularizationStatus', header: 'Status' },
    { field: 'action', header: 'Actions' },
  ];
  filterByEmp: SelectItem[] = [];
  filterByType: SelectItem[] = [];
  filterByStatus: SelectItem[] = [];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  checkedRowData = [];
  allBand = [];
  rejectedRequest = [];
  showHideFilter = false;
  assignedAttendenceData = [];
  regularizationDate: any;
  regularizeRecords: any;
  regReason: any;
  regReasons: any;
  regStatus = [
    { statusKey: 'PENDING', statusValue: 'Pending' },
    { statusKey: 'APPROVED', statusValue: 'Approved' },
    { statusKey: 'REJECTED', statusValue: 'Rejected' },
    { statusKey: 'CANCELLED', statusValue: 'Cancelled' }
  ];
  public regularizationRequest: FormGroup;
  action: any;
  notificationMsg: any;
  selection = new SelectionModel<Element>(true, []);
  constructor(private service: AttendanceService, public dialog: MatDialog, private serviceApi: ApiCommonService, private fb: FormBuilder) {
    this.regReasons = [];
    this.serviceApi.get('/v1/attendance/settings/regularizationReason/' + KeycloakService.getUsername()).
      subscribe(
        res => {
          console.log('Reason List-------------' + JSON.stringify(res));
          res.forEach(element => {
            this.regReasons.push({
              reasonId: element.reasonId,
              assignedReason: element.assignedReason,
            });
          });
        });
    this.hasRegularizeReason();
    var rolesArr = KeycloakService.getUserRole();
  }
  ngOnInit() {
    let tempStatus = '';
    this.service.getRegularizationRejectedRequest().subscribe((data) => {
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
          if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
            this.filterByEmp.push({
              label: element.empName, value: element.empName
            });
          }
          if (!this.filterByType.some(requestType => requestType.label === element.requestType)) {
            this.filterByType.push({
              label: element.requestType, value: element.requestType
            });
          }
          tempStatus = '';
          console.log('Inside for each element' + JSON.stringify(element))
          this.regStatus.forEach(statusObj => {
            if (statusObj.statusKey === element.regularizationStatus) {
              tempStatus = statusObj.statusValue;
            }
          });
          this.rejectedRequest.push({
            regularizationRequestsId: element.regularizationRequestsId,
            empCode: element.empCode,
            empName: element.empName,
            regularizationDate: element.regularizationDate,
            appliedOnDate: element.appliedOnDate,
            attendanceTemplate: element.attendanceTemplate,
            requestType: element.requestType,
            checkInTime: element.checkInTime,
            checkOutTime: element.checkOutTime,
            regularizationReason: element.regularizationReason,
            regularizationComments: element.regularizationComments,
            regularizationStatus: tempStatus,
            location: element.location,
            band: element.band,
            department: element.department,
            designation: element.designation
          })
        });
        this.dt.reset();
      }
    });
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
  hasRegularizeReason() {
    this.serviceApi.get('/v1/attendance/settings/general/').
      subscribe(
        res => {
          this.regReason = res.modifyEmpRegReq;
        },
      );
  }
  viewRegularizationRequest(regDetails: any) {
    let dialogRef = this.dialog.open(ViewRegularizationRejectedReqComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        date: regDetails.regularizationDate[0],
        appliedOnDate: regDetails.appliedOnDate,
        attendanceTemplate: regDetails.attendanceTemplate,
        requestType: regDetails.requestType,
        requestedCheckIn: regDetails.checkInTime,
        requestedCheckOut: regDetails.checkOutTime,
        regularizationReason: regDetails.regularizationReason,
        regularizationComments: regDetails.regularizationComments,
        status: regDetails.regularizationStatus,
        reasonList: this.regReasons
      }
    });
  }
}
@Component({
  templateUrl: 'view-regularization-request.html',
})
export class ViewRegularizationRejectedReqComponent {
  constructor(public dialogRef: MatDialogRef<ViewRegularizationRejectedReqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('View regularization data' + JSON.stringify(data));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
