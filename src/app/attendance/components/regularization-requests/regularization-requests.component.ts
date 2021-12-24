import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../../app/services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { DataTable, SelectItem } from 'primeng/primeng';
import { AttendanceService } from '../../attendance.service';
declare var $: any;
@Component({
  selector: 'app-regularization-requests',
  templateUrl: './regularization-requests.component.html',
  styleUrls: ['./regularization-requests.component.scss']
})
export class RegularizationRequestsComponent implements OnInit {
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
  @ViewChild("dt1") dt: DataTable;
  panelFirstWidth: any;
  panelFirstHeight: any;
  selectedRows = [];
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private attendanceService: AttendanceService, public dialog: MatDialog, private serviceApi: ApiCommonService, private fb: FormBuilder) {
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
    this.getAllRegRequest();
    this.hasRegularizeReason();
    var rolesArr = KeycloakService.getUserRole();
  }

  ngOnInit() {
    this.regularizationRequest = this.fb.group({
      approveRequest: [],
    });
  }
  ngAfterViewInit() {

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

  selectedRequest(data: any) {
    // console.log('........' + data);
    // var checkedRowData = [];
    // this.selectedRows.forEach(
    //   row => {
    //     checkedRowData.push(
    //       row.regularizationRequestsId
    //     );
    //   });

    // if (data === 'approveMultipleRequest') {
    //   if (this.selectedRows.length > 0) {
    //     console.log('Inside approve dialog');
    //     const dialogRef = this.dialog.open(ApproveMultipleDialogComponent, {
    //       width: '500px',
    //       panelClass: 'custom-dialog-container',
    //       data: {
    //         checkedRowData: checkedRowData
    //       }
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //       if (result !== undefined) {
    //         if (result.message) {
    //           console.log(result);
    //           this.notificationMsg = result.message;
    //           this.selection.clear();
    //           this.selectedRows = [];
    //           this.successNotification(this.notificationMsg);
    //           this.getAllRegRequest();
    //         }
    //       }
    //     });
    //   } else {
    //     this.selectedRows = [];
    //     this.selection.clear();
    //     this.warningNotification('Select a request first');
    //   }
    // }
    // // tslint:disable-next-line:one-line
    // else if (data === 'rejectMultipleRequest') {
    //   if (this.selectedRows.length > 0) {
    //     console.log('Inside approve dialog');
    //     const dialogRef = this.dialog.open(RejectMultipleDialogComponent, {
    //       // width: '500px',
    //       panelClass: 'custom-dialog-container',
    //       data: {
    //         checkedRowData: checkedRowData
    //       }
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');

    //       if (result.status === 'Response') {
    //         console.log(result);
    //         this.notificationMsg = result.message;
    //         this.selection.clear();
    //         this.selectedRows = [];
    //         this.successNotification(this.notificationMsg);
    //         this.getAllRegRequest();
    //       } else if (result.status === 'Error') {
    //         this.notificationMsg = result.message;
    //       }

    //     });
    //   } else {
    //     this.selectedRows = [];
    //     this.selection.clear();
    //     this.warningNotification('Select a request first');
    //   }
    // }
  }

  hasRegularizeReason() {
    this.serviceApi.get('/v1/attendance/settings/general/').
      subscribe(
        res => {
          this.regReason = res.modifyEmpRegReq;
        },
      );
  }
  // getAllRegRequest() {
  //   this.regularizeRecords = [];
  //   this.selectedRows = [];
  //   this.allBand = [];
  //   this.allDepartment = [];
  //   this.allDesignation = [];
  //   this.allLocation = [];
  //   let tempStatus = '';
  //   this.serviceApi.get('/v1/attendance/regularization/').
  //     subscribe(
  //       res => {

  //         res.forEach(element => {
  //           if (!this.allBand.some(band => band.label === element.band)) {
  //             this.allBand.push({
  //               label: element.band, value: element.band
  //             });
  //           }
  //           if (!this.allDepartment.some(department => department.label === element.department)) {
  //             this.allDepartment.push({
  //               label: element.department, value: element.department
  //             });
  //           }
  //           if (!this.allDesignation.some(designation => designation.label === element.designation)) {
  //             this.allDesignation.push({
  //               label: element.designation, value: element.designation
  //             });
  //           }
  //           if (!this.allLocation.some(location => location.label === element.location)) {
  //             this.allLocation.push({
  //               label: element.location, value: element.location
  //             });
  //           }
  //           if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
  //             this.filterByEmp.push({
  //               label: element.empName, value: element.empName
  //             });
  //           }
  //           if (!this.filterByType.some(requestType => requestType.label === element.requestType)) {
  //             this.filterByType.push({
  //               label: element.requestType, value: element.requestType
  //             });
  //           }
  //           if (!this.filterByStatus.some(regularizationStatus => regularizationStatus.label === element.regularizationStatus)) {
  //             this.filterByStatus.push({
  //               label: element.regularizationStatus, value: element.regularizationStatus[0].toUpperCase() + element.regularizationStatus.slice(1).toLowerCase()
  //             });
  //           }
  //           tempStatus = '';
  //           console.log('Inside for each element' + JSON.stringify(element))
  //           this.regStatus.forEach(statusObj => {
  //             if (statusObj.statusKey === element.regularizationStatus) {
  //               tempStatus = statusObj.statusValue;
  //             }
  //           });

  //           this.regularizeRecords.push({
  //             regularizationRequestsId: element.regularizationRequestsId,
  //             empCode: element.empCode,
  //             empName: element.empName,
  //             regularizationDate: element.regularizationDate,
  //             appliedOnDate: element.appliedOnDate,
  //             attendanceTemplate: element.attendanceTemplate,
  //             requestType: element.requestType,
  //             checkInTime: element.checkInTime,
  //             checkOutTime: element.checkOutTime,
  //             regularizationReason: element.regularizationReason,
  //             regularizationComments: element.regularizationComments,
  //             regularizationStatus: tempStatus,
  //             location: element.location,
  //             band: element.band,
  //             department: element.department,
  //             designation: element.designation

  //           })
  //         }, err => {
  //           if (err.status === 404 || err.statusText === 'OK') {
  //             this.regularizeRecords = [];
  //           }
  //         }, () => {

  //         }
  //         );

  //       }, (err) => {

  //       }, () => {
  //         this.dt.reset();
  //       });


  // }
  getAllRegRequest() {
    this.attendanceService.clearData();
    const url = '/v1/attendance/regularization/';
    return this.serviceApi.get(url)
      .subscribe(res => {
        this.attendanceService.sendRegularizationRequestData(res.filter(x => (x.regularizationStatus).toString() == "PENDING"), res.filter(x => (x.regularizationStatus).toString() == "APPROVED"), res.filter(x => (x.regularizationStatus).toString() == "CANCELLED"), res.filter(x => (x.regularizationStatus).toString() == "REJECTED"))
        return;
      });
  }
  onTabChange(event) {
    console.log(event);
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  message: string;
  receiveMessage($event) {
    this.message = $event;
    this.getAllRegRequest();
  }

  approveDialog(requestID: any) {
    //   console.log('Inside approve dialog');
    //   const dialogRef = this.dialog.open(AddApproveDialogComponent, {
    //     // width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { message: this.notificationMsg, status: this.action, regRequestID: requestID }
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.notificationMsg = result.message;
    //           this.successNotification(this.notificationMsg);

    //           this.getAllRegRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
  editRegRequest(regDetails: any): void {
    //   console.log('Inside edit dialog');
    //   const dialogRef = this.dialog.open(EditApproveDialogComponent, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: {
    //       regularizationRequestsId: regDetails.regularizationRequestsId,

    //       date: regDetails.regularizationDate[0],
    //       appliedOnDate: regDetails.appliedOnDate,
    //       attendanceTemplate: regDetails.attendanceTemplate,
    //       requestType: regDetails.requestType,
    //       requestedCheckIn: regDetails.checkInTime,
    //       requestedCheckOut: regDetails.checkOutTime,
    //       regularizationReason: regDetails.regularizationReason,
    //       regularizationComments: regDetails.regularizationComments,
    //       message: this.notificationMsg,
    //       status: this.action,
    //       hasRegReason: this.regReason,
    //       regReasonList: this.regReasons
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       // console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         // console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.notificationMsg = result.message;
    //           this.successNotification(this.notificationMsg);

    //           this.getAllRegRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
  viewRegularizationRequest(regDetails: any) {
    // let dialogRef = this.dialog.open(ViewRegularizationReqComponent, {
    //   // width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   // tslint:disable-next-line:max-line-length
    //   data: {
    //     date: regDetails.regularizationDate[0],
    //     appliedOnDate: regDetails.appliedOnDate,
    //     attendanceTemplate: regDetails.attendanceTemplate,
    //     requestType: regDetails.requestType,
    //     requestedCheckIn: regDetails.checkInTime,
    //     requestedCheckOut: regDetails.checkOutTime,
    //     regularizationReason: regDetails.regularizationReason,
    //     regularizationComments: regDetails.regularizationComments,
    //     status: regDetails.regularizationStatus,
    //     reasonList: this.regReasons
    //   }
    // });
  }
  cancelTeamRegRequest(requestID: any) {
    //   let dialogRef = this.dialog.open(DeleteApproveDialogComponent, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { message: this.notificationMsg, status: this.action, requestId: requestID }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       //  console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.notificationMsg = result.message;
    //           this.successNotification(this.notificationMsg);

    //           this.getAllRegRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
  rejectApprovalDialog(requestID: any) {
    //   console.log('Inside rejectApproval dialog');
    //   const dialogRef = this.dialog.open(RejectApproveDialogComponent, {
    //     // width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { message: this.notificationMsg, status: this.action, regRequestID: requestID }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.notificationMsg = result.message;
    //           this.successNotification(this.notificationMsg);

    //           this.getAllRegRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
}
// @Component({
//   templateUrl: './AddApproveDialog.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class AddApproveDialogComponent implements OnInit {
//   action: any;
//   error: any;
//   approveRegRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<AddApproveDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {

//     this.approveRegRequest = this._fb.group(
//       {
//         usrComment: ['', Validators.required],
//       });
//   }
//   approveRequest() {
//     if (this.approveRegRequest.valid) {
//       console.log('Comment Value.......' + this.approveRegRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       console.log('Comment Value.......' + this.approveRegRequest.controls.usrComment.value);
//       return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.data.regRequestID + '/action?action=approve&&comments=' + this.approveRegRequest.controls.usrComment.value, null).
//         subscribe(
//           res => {
//             console.log('Applied Leave Successfully...' + JSON.stringify(res));
//             this.action = 'Response';
//             this.error = res.message;
//             this.close();
//           },
//           err => {
//             console.log('there is something error.....  ' + err.message);
//             this.action = 'Error';
//             this.error = err.message;
//             this.close();
//           });
//     }
//     else {
//       Object.keys(this.approveRegRequest.controls).forEach(field => { // {1}
//         const control = this.approveRegRequest.get(field);            // {2}
//         control.markAsTouched({ onlySelf: true });       // {3}
//       });
//     }

//   }
//   ngOnInit() {

//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }
// }
// @Component({
//   templateUrl: './EditApproveDialog.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class EditApproveDialogComponent implements OnInit {
//   public editRegRequest: FormGroup;
//   action: any;
//   error: any;
//   empCode = KeycloakService.getUsername();
//   public NewRegularizeRequest: FormGroup;
//   regReasonList = [];
//   isRegReason: any;
//   date: any;
//   constructor(
//     private _fb: FormBuilder,
//     public dialogRef: MatDialogRef<EditApproveDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private serviceApi: ApiCommonService) {
//     // console.log('Inside Edit Regularization  ---- ' + JSON.stringify(data));
//     this.isRegReason = data.hasRegReason;
//   }
//   onChangeReqType(value) {
//     console.log('Inside On change request type ---');
//     if (value === 'CHECK_IN') {
//       this.editRegRequest.controls.checkInTime.setValidators(Validators.required)
//       this.editRegRequest.controls.checkInTime.setValue(this.data.requestedCheckIn);
//       this.editRegRequest.controls.checkOutTime.clearValidators();
//       this.editRegRequest.controls.checkOutTime.updateValueAndValidity();
//     }
//     else if (value === 'CHECK_OUT') {
//       this.editRegRequest.controls.checkOutTime.setValidators(Validators.required)
//       this.editRegRequest.controls.checkInTime.clearValidators();
//       this.editRegRequest.controls.checkInTime.updateValueAndValidity();
//     }
//     else if (value === 'CHECKIN_AND_CHECKOUT') {
//       this.editRegRequest.controls.checkInTime.setValidators(Validators.required)
//       this.editRegRequest.controls.checkOutTime.setValidators(Validators.required)
//     }

//   }
//   // Set FormControls value.... 
//   onUpdateRequest() {
//     if (this.editRegRequest.valid) {

//       console.log('form value ' + JSON.stringify(this.editRegRequest.value));
//       if (this.isRegReason) {
//         var body = {
//           'empCode': this.empCode,
//           'regularizationDate': [this.data.date],
//           'requestType': this.editRegRequest.controls.requestType.value,
//           'checkInTime': this.editRegRequest.controls.checkInTime.value,
//           'checkOutTime': this.editRegRequest.controls.checkOutTime.value,
//           'regularizationReason': '' + this.editRegRequest.controls.reason.value,
//           'regularizationComments': this.editRegRequest.controls.comment.value,
//         };
//       }
//       else {
//         var body = {
//           'empCode': this.empCode,
//           'regularizationDate': [this.data.date],
//           'requestType': this.editRegRequest.controls.requestType.value,
//           'checkInTime': this.editRegRequest.controls.checkInTime.value,
//           'checkOutTime': this.editRegRequest.controls.checkOutTime.value,
//           'regularizationReason': '',
//           'regularizationComments': this.editRegRequest.controls.comment.value,
//         };
//       }
//       console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
//       return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.data.regularizationRequestsId, body).
//         subscribe(
//           res => {
//             console.log('Applied Leave Successfully...' + JSON.stringify(res));
//             this.action = 'Response';
//             this.error = res.message;
//             this.close();
//           },
//           err => {
//             console.log('there is something error.....  ' + err.message);
//             this.action = 'Error';
//             this.error = err.message;
//             this.close();
//           });
//     }

//   }
//   ngOnInit() {
//     if (this.isRegReason) {
//       console.log('Inside Has regularization reason....' + this.data.regularizationReason);
//       this.editRegRequest = this._fb.group(
//         {
//           // selectEmployee: ['', Validators.required],
//           // regReqDate: [this.data.date, Validators.required],
//           requestType: [this.data.requestType, Validators.required],
//           checkInTime: [],
//           checkOutTime: [],
//           reason: [+this.data.regularizationReason, Validators.required],
//           comment: [this.data.regularizationComments],
//         }
//       );
//     }
//     else {
//       this.editRegRequest = this._fb.group(
//         {
//           // selectEmployee: ['', Validators.required],
//           // regReqDate: [this.data.date, Validators.required],
//           requestType: [this.data.requestType, Validators.required],
//           checkInTime: [],
//           checkOutTime: [],
//           comment: [this.data.regularizationComments],
//         }
//       );
//     }
//     if (this.data.requestType === 'CHECK_IN') {
//       this.editRegRequest.controls.checkInTime.setValue(this.data.requestedCheckIn);
//     }
//     else if (this.data.requestType === 'CHECK_OUT') {
//       this.editRegRequest.controls.checkOutTime.setValue(this.data.requestedCheckOut);
//     }
//     else if (this.data.requestType === 'CHECKIN_AND_CHECKOUT') {
//       this.editRegRequest.controls.checkInTime.setValue(this.data.requestedCheckIn);
//       this.editRegRequest.controls.checkOutTime.setValue(this.data.requestedCheckOut);
//     }
//   }

//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }

//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }


// }
// @Component({
//   templateUrl: './DeleteApproveDialog.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class DeleteApproveDialogComponent implements OnInit {
//   action: any;
//   error: any;
//   constructor(
//     public dialogRef: MatDialogRef<DeleteApproveDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private serviceApi: ApiCommonService) { }
//   cancelRegRequest() {
//     // tslint:disable-next-line:max-line-length
//     return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.data.requestId + '/action?action=cancel&&comments= ', null).
//       subscribe(
//         res => {
//           console.log('Applied Leave Successfully...' + JSON.stringify(res));
//           this.action = 'Response';
//           this.error = res.message;
//           this.close();
//         },
//         err => {
//           console.log('there is something error.....  ' + err.message);
//           this.action = 'Error';
//           this.error = err.message;
//           this.close();
//         });


//   }
//   ngOnInit() {

//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }
// }
// @Component({
//   templateUrl: './ApproveMultipleDialog.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class ApproveMultipleDialogComponent implements OnInit {
//   multiApproveDialog: FormGroup;
//   action: any;
//   error: any;
//   checkedRowData = [];
//   // tslint:disable-next-line:max-line-length
//   constructor(public dialogRef: MatDialogRef<ApproveMultipleDialogComponent>, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
//     console.log(data);
//     this.checkedRowData = data.checkedRowData;
//     this.multiApproveDialog = this._fb.group({
//       usrComment: ['', Validators.required],
//     });
//   }
//   ngOnInit() {
//   }
//   approveMultiRequest() {
//     if (this.multiApproveDialog.valid) {
//       console.log('Comment Value.......' + this.multiApproveDialog.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       console.log('Comment Value.......' + this.multiApproveDialog.controls.usrComment.value);
//       const body = {
//         "action": "APPROVE",
//         "comment": this.multiApproveDialog.controls.usrComment.value,
//         "reqIds": this.checkedRowData,
//       }
//       this.serviceApi.put('/v1/attendance/regularization/bulkAction', body).subscribe(
//         res => {
//           console.log('Applied Leave Successfully...' + JSON.stringify(res));
//           this.action = 'Response';
//           this.error = res.message;
//           this.close();
//         },
//         err => {
//           console.log('there is something error.....  ' + err.message);
//           this.action = 'Error';
//           this.error = err.message;
//           this.close();
//         });
//     }
//   }

//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
// @Component({
//   templateUrl: './RejectMultipleDialog.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class RejectMultipleDialogComponent implements OnInit {
//   rejectMultipleRegularizationRequest: FormGroup;
//   // tslint:disable-next-line:max-line-length
//   constructor(public dialogRef: MatDialogRef<RejectMultipleDialogComponent>, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,) {
//     this.rejectMultipleRegularizationRequest = this._fb.group({
//       usrComment: [],
//     });
//   }
//   ngOnInit() {

//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
// @Component({
//   templateUrl: './RejectIndividualDialog.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class RejectApproveDialogComponent implements OnInit {
//   action: any;
//   error: any;
//   rejectRegRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<RejectApproveDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {

//     this.rejectRegRequest = this._fb.group(
//       {
//         usrComment: ['', Validators.required],
//       });
//   }
//   rejectRequest() {
//     if (this.rejectRegRequest.valid) {

//       return this.serviceApi.put('/v1/attendance/regularization/admin/' + this.data.regRequestID + '/action?action=reject&&comments=' + this.rejectRegRequest.controls.usrComment.value, null).
//         subscribe(
//           res => {
//             console.log('Applied Leave Successfully...' + JSON.stringify(res));
//             this.action = 'Response';
//             this.error = res.message;
//             this.close();
//           },
//           err => {
//             console.log('there is something error.....  ' + err.message);
//             this.action = 'Error';
//             this.error = err.message;
//             this.close();
//           });
//     }
//     else {
//       Object.keys(this.rejectRegRequest.controls).forEach(field => { // {1}
//         const control = this.rejectRegRequest.get(field);            // {2}
//         control.markAsTouched({ onlySelf: true });       // {3}
//       });

//     }

//   }
//   ngOnInit() {

//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close(this.data);
//   }

// }
// @Component({
//   templateUrl: 'view-regularization-request.html',
//   styleUrls: ['./dialog.scss']
// })
// export class ViewRegularizationReqComponent {
//   constructor(
//     private _fb: FormBuilder,
//     public dialogRef: MatDialogRef<ViewRegularizationReqComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any) {
//     console.log('View regularization data' + JSON.stringify(data));
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

