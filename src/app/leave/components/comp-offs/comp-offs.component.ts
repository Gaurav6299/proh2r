import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../../app/services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { DataTable, SelectItem } from 'primeng/primeng';
import { LeaveService } from '../../leave.service';
declare var $: any;

@Component({
  selector: 'app-comp-offs',
  templateUrl: './comp-offs.component.html',
  styleUrls: ['./comp-offs.component.scss']
})
export class CompOffsComponent implements OnInit {
  leaveApplicationsInfo = [];
  leaveCancellationCrudAdmin = false;
  @ViewChild("dt1") dt: DataTable;
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
  filterByEmp: SelectItem[] = [];
  filterByStatus: SelectItem[] = [];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  panelFirstWidth: any;
  panelFirstHeight: any;
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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


  constructor(private leaveService: LeaveService, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.empCode = KeycloakService.getUsername();
    console.log('Logged in user Full Name :::' + KeycloakService.getFullName());
    this.getLeaveRequestById();
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
  // getLeaveRequestById() {
  //   console.log('Employee Code.............................' + this.empCode);
  //   this.leaveApplicationsInfo = [];
  //   this.allBand = [];
  //   this.allDepartment = [];
  //   this.allDesignation = [];
  //   this.allLocation = [];
  //   this.serviceApi.get('/v1/leave/compoffEarnings/').
  //     subscribe(
  //       res => {
  //         console.log('Comp Offs Applications--------' + JSON.stringify(res));
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
  //           this.status = '';
  //           this.leaveStatus.forEach(statusInfo => {
  //             if (element.leaveStatus === statusInfo.statusValue) {
  //               this.status = statusInfo.statusName;
  //             }
  //           });
  //           if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
  //             this.filterByEmp.push({
  //               label: element.empName, value: element.empName
  //             });
  //           }
  //           if (!this.filterByStatus.some(leaveStatus => leaveStatus.label === element.leaveStatus)) {
  //             this.filterByStatus.push({
  //               label: element.leaveStatus, value: this.status
  //             });
  //           }
  //           this.leaveApplicationsInfo.push({
  //             compOffId: element.compOffId,
  //             usedOn: element.usedOn,
  //             empName: element.empName,
  //             appliedOn: element.appliedOn,
  //             appliedFor: element.appliedFor,
  //             leaveStatus: this.status,
  //             comment: element.comment,
  //             location: element.location,
  //             band: element.band,
  //             department: element.department,
  //             designation: element.designation
  //           });
  //         });
  //         this.dataSource = new MatTableDataSource(this.leaveApplicationsInfo);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       },
  //       err => {
  //         if (err.status === 404 || err.statusText === 'OK') {
  //           this.leaveApplicationsInfo = [];
  //           this.dataSource = new MatTableDataSource(this.leaveApplicationsInfo);
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }
  //       }, () => {
  //         this.dt.reset();
  //       }
  //     );
  // }
  getLeaveRequestById() {
    this.leaveService.clearData();
    const url = '/v1/leave/compoffEarnings/'
    return this.serviceApi.get(url)
      .subscribe(res => {
        this.leaveService.sendCompOffsData(res.filter(x => (x.leaveStatus).toString().includes('LEVEL')), res.filter(x => (x.leaveStatus).toString() == "APPROVED"), res.filter(x => (x.leaveStatus).toString() == "REJECTED"))
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
    this.getLeaveRequestById();
  }
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  viewLeaveInfo(formValue: any) {
    // console.log('Form Information ----- ' + JSON.stringify(formValue));
    // const dialogRef = this.dialog.open(ViewCompoffsReqComponent, {
    //   // width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: formValue,
    // });
  }
  applyLeaveRequest() {
    this.errorMessage = '';
    this.action = '';
    const dialogRef = this.dialog.open(CompoffsReqComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.errorMessage, status: this.action }
    });
    // dialogRef.close();
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);

            this.getLeaveRequestById();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
          }
        }
        // tslint:disable-next-line:one-line
      }
    });
  }
  editCompOffReq(leaveDetails: any) {
    //   this.action = '';
    //   const dialogRef = this.dialog.open(EditCompOffRequestComponent, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: leaveDetails,
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     // console.log('The dialog was closed....................' + result.message);
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.errorMessage = result.message;
    //           // this.showNotificationSuccess('top','center');
    //           this.successNotification(this.errorMessage);

    //           this.getLeaveRequestById();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //           //  this.showNotificationError('top','center');
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
  approveIndividualCompOffReq(leaveId: any) {
    //   this.action = '';
    //   console.log('Inside Bulk Reject');
    //   const dialogRef = this.dialog.open(ApproveIndividualCompOffReqComponent, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { leaveId: leaveId, message: this.errorMessage, status: this.action }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.errorMessage = result.message;
    //           this.successNotification(this.errorMessage);

    //           this.getLeaveRequestById();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }

    //     // this.getAllLeaveRequest();
    //     console.log('The dialog was closed');
    //   });
  }
  rejectLeaveRequest(leaveId: any) {
    //   this.action = '';
    //   // console.log('Inside Reject leave ID -----------------' + leaveId);
    //   const dialogRef = this.dialog.open(RejectCompOffRequestComponent, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { leaveId: leaveId, message: this.errorMessage, status: this.action }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.errorMessage = result.message;
    //           this.successNotification(this.errorMessage);

    //           this.getLeaveRequestById();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }

    //     console.log('The dialog was closed');
    //   });
  }

  deleteCompOffRequest(leaveId: any) {
    //   this.action = '';
    //   // console.log('Inside Reject leave ID -----------------' + leaveId);
    //   const dialogRef = this.dialog.open(DeleteCompOffRequestComponent, {
    //     // width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { leaveId: leaveId, message: this.errorMessage, status: this.action }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.errorMessage = result.message;
    //           this.successNotification(this.errorMessage);

    //           this.getLeaveRequestById();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }

    //     console.log('The dialog was closed');
    //   });
  }
  ngOnInit() { }
}



@Component({
  templateUrl: './compoffs-req-dialog.html',
  styleUrls: ['./dialog.scss']
})

export class CompoffsReqComponent {
  teamCompOffsRequest: FormGroup;
  employeeList = [];
  employeeListCopy = [];
  seletedEmployeesCode = [];
  mySelectedEmpList = [];
  action: any;
  error: any;
  myControl = new FormControl();
  selectedEmployeeList = new FormControl();
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5;
  }
  constructor(public dialogRef: MatDialogRef<CompoffsReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
    this.serviceApi.get('/v1/employee/').
      subscribe(
        res => {

          res.forEach(element => {
            // tslint:disable-next-line:max-line-length
            this.employeeList.push({ fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode, value: element.empCode });
          });
        });
    this.employeeListCopy = this.employeeList;


    this.teamCompOffsRequest = this._fb.group(
      {
        selectEmployee: ['', Validators.required],
        // leaveCategory: [],
        compOffDate: ['', Validators.required],
        // isHalfDay: ['', Validators.required],
        comment: ['', Validators.required]
      }
    );
    this.selectedEmployeeList.setValidators([Validators.required]);
  }
  submitAppliation() {
    console.log('Inside Comp off Request -------------------------');
    if (this.teamCompOffsRequest.valid) {
      //   this.onNoClick();
      console.log('form value ' + JSON.stringify(this.teamCompOffsRequest.value));
      var body = {
        'empCodeList': this.teamCompOffsRequest.controls.selectEmployee.value,
        'categoryName': 'Comp Offs',
        'appliedFor': this.teamCompOffsRequest.controls.compOffDate.value,
        // 'halfDay': this.teamCompOffsRequest.controls.isHalfDay.value,
        'comment': this.teamCompOffsRequest.controls.comment.value,
      };
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/leave/compoffEarnings/grantCompOffByAdmin', body).
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
    else {
      Object.keys(this.teamCompOffsRequest.controls).forEach(field => { // {1}
        const control = this.teamCompOffsRequest.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  searchEmployeeName(data: any) {
    // alert(this.myControl.value);
    if (this.myControl.value != null) {
      //   console.log('my method called' + data);value: element.empCode, viewValue: element.empFirstName
      this.employeeList = this.employeeListCopy.filter(option =>
        option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
      // } else {
      console.log('Enter in the backSpace' + this.myControl);
      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }
  onClickEvent() {
    console.log('::: Enter in the Reset function for Filter :::');
    this.employeeList = this.employeeListCopy;
    this.myControl.reset();
    console.log('::: Exit After call All get Employee :::');
  }
  selectEmpCode(data: any, event: any) {
    if (!this.seletedEmployeesCode.some(e => e === data)) {
      this.seletedEmployeesCode.push(data);
    } else {
      console.log(' Enter else block');
      this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
        console.log(' El ---- ' + el);
        return el !== data;
      });
    }
    for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
      this.mySelectedEmpList[i] = this.seletedEmployeesCode[i];
    }
    this.teamCompOffsRequest.controls.selectEmployee.setValue(this.seletedEmployeesCode);
  }
  onChangeEmployee() {

    this.myControl.reset();
    this.employeeList = this.employeeListCopy;
  }
  // tslint:disable-next-line:use-life-cycle-interface
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

// @Component({
//   templateUrl: './edit-compOff-request.component.html',
//   styleUrls: ['./dialog.scss']
// })

// export class EditCompOffRequestComponent implements OnInit {
//   empCode = KeycloakService.getUsername();
//   action: any;
//   error: any;
//   // halfDayvalue = [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];
//   editCompOffRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<EditCompOffRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {
//     console.log('Edit Compoff Form value.........' + JSON.stringify(data));
//     this.editCompOffRequest = this._fb.group(
//       {
//         compOffDate: ['', Validators.required],
//         // isHalfDay: ['', Validators.required],
//         reason: ['', Validators.required]
//       }
//     );
//   }
//   updateAppliation() {
//     console.log('Inside Comp off Request -------------------------');
//     if (this.editCompOffRequest.valid) {
//       //   this.onNoClick();
//       console.log('form value ' + JSON.stringify(this.editCompOffRequest.value));
//       var body = {
//         'empCodeList': [this.empCode],
//         'categoryName': 'Comp Offs',
//         'appliedFor': this.editCompOffRequest.controls.compOffDate.value,
//         // 'halfDay': this.editCompOffRequest.controls.isHalfDay.value,
//         'comment': this.editCompOffRequest.controls.reason.value,
//       };
//       console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
//       // tslint:disable-next-line:max-line-length
//       return this.serviceApi.put('/v1/leave/compoffEarnings/updateCompOffByAdmin/' + this.data.compOffId, body).
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
//   // tslint:disable-next-line:use-life-cycle-interface
//   ngOnInit() {
//     this.editCompOffRequest.controls.compOffDate.setValue(this.data.appliedFor);
//     // if (this.data.halfDay === 'Yes') {
//     //   this.editCompOffRequest.controls.isHalfDay.setValue(true);
//     // }
//     // else if (this.data.halfDay === 'No') {
//     //   this.editCompOffRequest.controls.isHalfDay.setValue(false);
//     // }

//     this.editCompOffRequest.controls.reason.setValue(this.data.comment);
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
//   templateUrl: './viewCompoffs-dialog.html',
//   styleUrls: ['./dialog.scss']
// })

// export class ViewCompoffsReqComponent {

//   constructor(public dialogRef: MatDialogRef<ViewCompoffsReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {

//   }
//   // tslint:disable-next-line:use-life-cycle-interface
//   ngOnInit() { }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

// @Component({
//   templateUrl: './reject-compOff.component.html',
//   styleUrls: ['./dialog.scss']
// })
// // t
// export class RejectCompOffRequestComponent implements OnInit {
//   action: any;
//   error: any;
//   rejectIndividualLeavesRequest: FormGroup;
//   leaveId: any;
//   constructor(public dialogRef: MatDialogRef<RejectCompOffRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
//     this.rejectIndividualLeavesRequest = this._fb.group(
//       {
//         usrComment: [],
//       });
//   }
//   rejectRequest() {
//     if (this.rejectIndividualLeavesRequest.valid) {
//       console.log('Compoff id ' + this.data.leaveId);
//       console.log('Comment Value.......' + this.rejectIndividualLeavesRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       return this.serviceApi.put('/v1/leave/compoffEarnings/compOffActionBySupervisor/' + this.data.leaveId + '/action?action=REJECT&&comments=' + this.rejectIndividualLeavesRequest.controls.usrComment.value, null).
//         subscribe(
//           res => {
//             console.log('Successfully...' + JSON.stringify(res));
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
//   templateUrl: './approve-individual-compOff.component.html',
//   styleUrls: ['./dialog.scss']
// })

// export class ApproveIndividualCompOffReqComponent implements OnInit {
//   error: any;
//   action: any;
//   approveIndividualCompOffRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<ApproveIndividualCompOffReqComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {

//     this.approveIndividualCompOffRequest = this._fb.group(
//       {
//         usrComment: [],
//       });
//   }
//   approveAppliation() {
//     if (this.approveIndividualCompOffRequest.valid) {
//       console.log('Comment Value.......' + this.approveIndividualCompOffRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       return this.serviceApi.put('/v1/leave/compoffEarnings/compOffActionBySupervisor/' + this.data.leaveId + '/action?action=APPROVE&&comments=' + this.approveIndividualCompOffRequest.controls.usrComment.value, null).
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
//   templateUrl: './delete-compOff-req.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class DeleteCompOffRequestComponent implements OnInit {
//   action: any;
//   error: any;
//   deleteIndividualLeavesRequest: FormGroup;
//   leaveId: any;
//   constructor(public dialogRef: MatDialogRef<DeleteCompOffRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
//     this.deleteIndividualLeavesRequest = this._fb.group(
//       {
//         usrComment: ['', Validators.required],
//       });
//   }
//   deleteRequest() {
//     if (this.deleteIndividualLeavesRequest.valid) {
//       console.log('Compoff id ' + this.data.leaveId);
//       console.log('Comment Value.......' + this.deleteIndividualLeavesRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       return this.serviceApi.delete('/v1/leave/compoffEarnings/deleteCompOffByAdmin/' + this.data.leaveId).
//         subscribe(
//           res => {
//             console.log('Successfully...' + JSON.stringify(res));
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
//       Object.keys(this.deleteIndividualLeavesRequest.controls).forEach(field => { // {1}
//         const control = this.deleteIndividualLeavesRequest.get(field);            // {2}
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