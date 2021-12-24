import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { DataTable, SelectItem } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { Console } from 'console';
import { LeaveService } from '../../leave.service';
declare var $: any;
@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit {
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
  filterByStatus: SelectItem[] = [];
  @ViewChild("dt1") dt: DataTable;
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  dataSource1: MatTableDataSource<Element>;
  selection = new SelectionModel<Element>(true, []);
  leaveApplicationsInfo = [];
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private leaveService: LeaveService, public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.getAllLeaveRequest();
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
    this.employeeLeaveApplication = this.fb.group({
      assignLeaveApplication: [],
    });
    this.dataSource1 = new MatTableDataSource<Element>(ELEMENT_DATA);
  }
  ngAfterViewInit() {
    // this.dataSource1 = new MatTableDataSource<Element>(ELEMENT_DATA);
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  masterToggle(element: any, event: any) {
    console.log(element);
    this.isAllSelected() ?
      (this.selection.clear(), this.checkedRowData = []) :
      this.dataSource1.data.forEach(row => this.selection.select(row));
    this.getRowMultipleData(this.dataSource1.data, event.checked);
  }
  getRowMultipleData(data: any, checked: any) {
    console.log(checked);
    if (checked) {
      this.checkedRowData = [];
      console.log('Enter in Select Multiple Records');
      data.forEach(element => {
        console.info(element);
        this.checkedRowData.push(
          element.leaveId
        );
      });
      console.log(JSON.stringify(this.checkedRowData));
    } else {
      console.log('Enter in un Select Multiple Records');
      this.checkedRowData = [];
      console.log(JSON.stringify(this.checkedRowData));
    }
  }
  getRowData(element: any, event: any) {
    if (event.checked) {
      console.log('if');
      console.log(element);
      this.checkedRowData.push(
        element.leaveId
      );
    } else {
      for (let i = 0; i < this.checkedRowData.length; i++) {
        if (this.checkedRowData[i] === element.leaveId) {
          this.checkedRowData.splice(i, 1);
        } else {
          console.log('Not Matched');
        }
      }
    }
  }
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }
  selectedValue(value: any) {
    if (value === 'addSingleApplication') {
      this.openDialogAddSingleLeaveApplication();
    }
    else if (value === 'addMultipleLeaveApplication') {
      console.log('true');
      console.log('value....' + value);
      this.openDialogAddMultipleLeaveApplication();
    }
    // else if (value === 'approveMultipleRequest') {
    //   if (this.checkedRowData.length > 0) {
    //     console.log('Inside approve dialog');
    //     console.log(this.checkedRowData);
    //     const dialogRef = this.dialog.open(ApproveLeaveMultipleRequest, {
    //       width: '500px',
    //       panelClass: 'custom-dialog-container',
    //       data: {
    //         checkedRowData: this.checkedRowData
    //       }
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //       if (result !== undefined) {
    //         if (result.status === 'Response') {
    //           console.log(result);
    //           this.notificationMsg = result.message;
    //           this.selection.clear();
    //           this.checkedRowData = [];
    //           this.successNotification(this.notificationMsg);
    //           this.getAllLeaveRequest();
    //         } else if (result.status === 'Error') {
    //           this.notificationMsg = result.message;
    //           // this.warningNotification(this.notificationMsg);
    //         }
    //       }
    //     });
    //   } else {
    //     this.checkedRowData = [];
    //     this.selection.clear();
    //     this.warningNotification('Select employee first');
    //   }

    // }
    // else if (value === 'rejectMultipleRequest') {
    //   console.log('true');
    //   console.log('value....' + value);
    //   this.openDialogRejectMultipleRequest();
    // }
    // else if (value === 'bulkApproveCancelLeave') {
    //   console.log('true');
    //   console.log('value....' + value);
    //   this.openDialogBulkApproveCancelLeave();
    // }
    // else if (value === 'bulkRejectCancelLeave') {
    //   console.log('true');
    //   console.log('value....' + value);
    //   this.openDialogBulkRejectCancelLeave();
    // }
  }
  openDialogAddSingleLeaveApplication() {
    this.action = '';
    console.log('Inside Dialog leave');
    const dialogRef = this.dialog.open(AddSingleLeaveApplication, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.errorMessage, status: this.action }
    });
    // dialogRef.close();
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);

            this.getAllLeaveRequest();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
            // this.warningNotification(this.errorMessage);
          }
        }
        // tslint:disable-next-line:one-line
      }
      this.employeeLeaveApplication.controls.assignLeaveApplication.setValue('');
    });
  }
  // editIndividualLeaveAssignment(value: any) {
  //     this.action = '';
  //     console.log('Edit Leave Application' + JSON.stringify(value));
  //     const dialogRef = this.dialog.open(EditIndividualLeaveAssignment, {
  //       width: '500px',
  //       panelClass: 'custom-dialog-container',
  //       data: {
  //         leaveId: value.leaveId,
  //         empCode: value.empCode,
  //         leaveCategory: value.leaveName,
  //         startDate: value.startDate,
  //         endDate: value.endDate,
  //         isHalfDay: value.isHalfDay,
  //         halfDays: value.halfDays,
  //         reason: value.reason,
  //         message: this.errorMessage,
  //         status: this.action,
  //         uploadDoc: value.uploadDoc
  //       }
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       // console.log('The dialog was closed....................' + result.message);
  //       if (result !== undefined) {
  //         console.log('Result value ..... ' + JSON.stringify(result));
  //         if (result.message) {
  //           console.log('Result value ..... ' + result.message);
  //           if (result.status === 'Response') {
  //             this.errorMessage = result.message;
  //             this.successNotification(this.errorMessage);
  //             this.getAllLeaveRequest();
  //           }
  //           // tslint:disable-next-line:one-line
  //           else if (result.status === 'Error') {
  //             this.errorMessage = result.message;
  //             // this.warningNotification(this.errorMessage);
  //           }
  //         }
  //         // tslint:disable-next-line:one-line
  //       }
  //       this.employeeLeaveApplication.controls.assignLeaveApplication.setValue('');
  //     });
  // }
  viewLeaveInfo(data: any) {
    // //  console.log('View Leave Details .... ' + JSON.stringify(data));
    // const dialogRef = this.dialog.open(ViewLeaveComponent, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: data
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  openDialogAddMultipleLeaveApplication() {
    console.log('Inside Dialog leaveSupervisor');
    const dialogRef = this.dialog.open(MultipleLeaveApplication, {

      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialogApproveMultipleRequest() {
    // console.log('Inside upload Template Assignment');
    // const dialogRef = this.dialog.open(ApproveLeaveMultipleRequest, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: {}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  openDialogRejectMultipleRequest() {
    // console.log('Inside upload Supervisor');
    // const dialogRef = this.dialog.open(RejectLeaveMultipleRequest, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: {}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  openDialogBulkApproveCancelLeave() {
    // console.log('Inside upload Supervisor');
    // const dialogRef = this.dialog.open(BulkApproveCancelLeave, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: {}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  openDialogBulkRejectCancelLeave() {
    // console.log('Inside Bulk Reject');
    // const dialogRef = this.dialog.open(BulkRejectCancelLeave, {
    //   width: '500px',
    //   panelClass: 'custom-dialog-container',
    //   data: {}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  approveIndividualLeave(leaveId: any) {
    //   this.action = '';
    //   console.log('Inside Bulk Reject');
    //   const dialogRef = this.dialog.open(ApproveIndividualLeave, {
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

    //           this.getAllLeaveRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //           // this.warningNotification(this.errorMessage);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }

    //     // this.getAllLeaveRequest();
    //     console.log('The dialog was closed');
    //   });
  }
  deleteIndividualleave(id: any) {
    //   this.action = '';
    //   console.log('Leave ID ---- ' + id);
    //   const dialogRef = this.dialog.open(DeleteLeaveRequest, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { id: id, message: this.errorMessage, status: this.action }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.errorMessage = result.message;
    //           this.successNotification(this.errorMessage);

    //           this.getAllLeaveRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //           // this.warningNotification(this.errorMessage);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }
    //   });
  }
  cancelLeaveRequest(leave: any) {
    //   this.action = '';
    //   console.log('Inside Bulk Reject');
    //   const dialogRef = this.dialog.open(CancelIndividualLeaveRequest, {
    //     width: '500px',
    //     panelClass: 'custom-dialog-container',
    //     data: { leaveId: leave.leaveId, message: this.errorMessage, status: this.action, empCode: leave.empCode }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result !== undefined) {
    //       console.log('Result value ..... ' + JSON.stringify(result));
    //       if (result.message) {
    //         console.log('Result value ..... ' + result.message);
    //         if (result.status === 'Response') {
    //           this.errorMessage = result.message;
    //           this.successNotification(this.errorMessage);

    //           this.getAllLeaveRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //           // this.warningNotification(this.errorMessage);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line

    //     }
    //     console.log('The dialog was closed');
    //   });
  }
  rejectLeaveRequest(leaveId: any) {
    //   this.action = '';
    //   console.log('Inside Bulk Reject');
    //   const dialogRef = this.dialog.open(RejectIndividualLeave, {
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

    //           this.getAllLeaveRequest();
    //         }
    //         // tslint:disable-next-line:one-line
    //         else if (result.status === 'Error') {
    //           this.errorMessage = result.message;
    //           // this.warningNotification(this.errorMessage);
    //         }
    //       }
    //       // tslint:disable-next-line:one-line
    //     }

    //     console.log('The dialog was closed');
    //   });
  }
  // getAllLeaveRequest() {
  //   console.log('Leave Template');
  //   this.leaveApplicationsInfo = [];
  //   this.serviceApi.get('/v1/leave/leaveapplication/').subscribe(res => {
  //       res.forEach(element => {
  //         if (!this.allBand.some(band => band.label === element.band)) {
  //           this.allBand.push({
  //             label: element.band, value: element.band
  //           });
  //         }
  //         if (!this.allDepartment.some(department => department.label === element.department)) {
  //           this.allDepartment.push({
  //             label: element.department, value: element.department
  //           });
  //         }
  //         if (!this.allDesignation.some(designation => designation.label === element.designation)) {
  //           this.allDesignation.push({
  //             label: element.designation, value: element.designation
  //           });
  //         }
  //         if (!this.allLocation.some(location => location.label === element.location)) {
  //           this.allLocation.push({
  //             label: element.location, value: element.location
  //           });
  //         }
  //         console.log('element.isHalfDay----' + element.halfDays);
  //         this.status = '';
  //         this.leaveStatus.forEach(statusInfo => {
  //           if (element.leaveStatus === statusInfo.statusValue) {
  //             this.status = statusInfo.statusName;
  //           }
  //         });
  //         if (!this.filterByEmp.some(empName => empName.label === element.empName)) {
  //           this.filterByEmp.push({
  //             label: element.empName, value: element.empName + ' - ' + element.empCode
  //           });
  //         }
  //         if (!this.filterByCategory.some(leaveName => leaveName.label === element.leaveName)) {
  //           this.filterByCategory.push({
  //             label: element.leaveName, value: element.leaveName
  //           });
  //         }
  //         if (!this.filterByStatus.some(leaveStatus => leaveStatus.label === element.leaveStatus)) {
  //           this.filterByStatus.push({
  //             label: element.leaveStatus, value: this.status
  //           });
  //         }
  //         this.leaveApplicationsInfo.push({
  //           leaveId: element.leaveId,
  //           empCode: element.empCode,
  //           empName: element.empName + ' - ' + element.empCode,
  //           leaveName: element.leaveName,
  //           startDate: element.startDate,
  //           endDate: element.endDate,
  //           isHalfDay: element.isHalfDay,
  //           leaveHalfDays: element.leaveHalfDays,
  //           numberOfLeave: element.numberOfLeave,
  //           leaveStatus: this.status,
  //           reason: element.reason,
  //           uploadDoc: element.leaveAttachmentName,
  //           uploadDocPath: element.leaveAttachmentPath,
  //           location: element.location,
  //           band: element.band,
  //           department: element.department,
  //           designation: element.designation

  //         });
  //       });
  //       this.dataSource1 = new MatTableDataSource(this.leaveApplicationsInfo);
  //       this.dataSource1.paginator = this.paginator;
  //       this.dataSource1.sort = this.sort;
  //     },
  //     err => {
  //       if (err.status === 404 || err.statusText === 'OK') {
  //         this.leaveApplicationsInfo = [];
  //         this.dataSource1 = new MatTableDataSource(this.leaveApplicationsInfo);
  //         this.dataSource1.paginator = this.paginator;
  //         this.dataSource1.sort = this.sort;
  //       }
  //     }, () => {
  //       this.dt.reset();
  //     });
  // }
  getAllLeaveRequest() {
    this.leaveService.clearData();
    const url = '/v1/leave/leaveapplication/'
    return this.serviceApi.get(url)
      .subscribe(res => {
        this.leaveService.sendApplicationData(res.filter(x => (x.leaveStatus).toString().includes('LEVEL')), res.filter(x => (x.leaveStatus).toString() == "APPROVED"), res.filter(x => (x.leaveStatus).toString() == "CANCELLED"), res.filter(x => (x.leaveStatus).toString() == "REJECTED"))
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
    this.getAllLeaveRequest();
  }
}
@Component({
  templateUrl: './add-new-leave.component.html',
  styleUrls: ['./dialog.scss']
})
export class AddSingleLeaveApplication implements OnInit {
  public addNewLeave: FormGroup;
  divShow = false;
  errorShow = false;
  employeeList = [];
  employeeListCopy = [];
  approverControl = new FormControl();
  categoryList = [];
  categoryInfo = [];
  halfDayOption: any;
  needLeaveExtension: any;
  uploadDoc: any;
  currentFileUpload: File;
  isCommentMandatory: any;
  uploadDocMandatory: any;
  halfDayvalue = [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];
  error = 'Error Message';
  action: any;
  pendingApplCount: any;
  leaveBal: any;
  showData: boolean = false;
  minDate: any;
  maxDate: any;

  dayHalfs = [{ value: 'First_Half', viewValue: 'First Half' }, { value: 'Second_Half', viewValue: 'Second Half' }]

  columns = [
    { field: 'date', header: 'Date' },
    { field: 'half', header: 'Day Half' },
  ]
  dates: any[];

  constructor(public dialogRef: MatDialogRef<AddSingleLeaveApplication>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http, private datePipe: DatePipe) {
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            // tslint:disable-next-line:max-line-length
            this.employeeList.push({ fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode, value: element.empCode });
          });
        });
    this.employeeListCopy = this.employeeList;

    this.addNewLeave = this._fb.group(
      {
        selectEmployee: [null, Validators.required],
        leaveCategory: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        halfDay: false,
        halfDayDate: [],
        halfDayDates: this._fb.array([]),
        uploadDoc: [],
        reason: [''],
        empRelation: ['None'],
        expirationDate: [''],
        childDeliveryDate: [''],
        // empNeedExtension:[]
      }
    );
  }

  selectDates() {
    //  this.dates = [];
    console.log(this.addNewLeave.controls.halfDayDate.value);
    const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
    formArr.controls = [];
    this.addNewLeave.controls.halfDayDate.value.forEach(element => {
      let date = this.datePipe.transform(element, 'yyyy-MM-dd');
      // const resultObject = this.exists(element, this.dates);
      // if(!resultObject){
      // this.dates = [...this.dates,element];
      formArr.push(this._fb.group({
        date: [date],
        half: [null, [Validators.required]]
      }));
      // }
    });
  }

  exists(nameKey, myArray) {
    let exists: Boolean = false;
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i] == nameKey) {
        exists = true;
      }
    }
    return exists;
  }

  // changeFormat(data:any){
  //   if(data=='Start'){
  //     let date = this.datePipe.transform( this.addNewLeave.controls.startDate.value, 'yyyy-MM-dd')
  //     this.addNewLeave.controls.startDate.setValue(date);
  //   }
  //   if(data=='End'){
  //     let date = this.datePipe.transform( this.addNewLeave.controls.endDate.value, 'yyyy-MM-dd')
  //     this.addNewLeave.controls.endDate.setValue(date);
  //   }
  // }

  selectrange() {
    this.addNewLeave.controls.halfDayDate.setValue(null);
    this.addNewLeave.controls.halfDayDate.reset();
    this.minDate = new Date(this.addNewLeave.controls.startDate.value);
    this.maxDate = new Date(this.addNewLeave.controls.endDate.value);
    const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
    formArr.controls = [];
    this.addNewLeave.controls.halfDayDate.clearValidators();
    if (this.addNewLeave.controls.halfDay.value) {
      this.addNewLeave.controls.halfDayDate.setValidators(Validators.required);
    }
    this.addNewLeave.controls.halfDayDate.updateValueAndValidity();
  }

  selectedValue(data: any) {
    this.categoryList = [];
    this.categoryInfo = [];
    console.log('emp code--------- ' + data);
    this.serviceApi.get('/v1/leave/leaveapplication/template/' + data).
      subscribe(
        // this.http.get('assets/data/Leave/leaveTemplate.json').subscribe
        // (
        res => {
          console.log('Comment mendatory.. ' + res.isCommentMadatory);
          this.isCommentMandatory = res.isCommentMadatory;
          res.leaveTemplateCategories.forEach(element1 => {
            this.categoryList.push({
              id: element1.leaveCategories.categoryId,
              name: element1.leaveCategories.leaveName
            });
            this.categoryInfo.push({
              id: element1.leaveCategories.categoryId,
              name: element1.leaveCategories.leaveName,
              halfDayOption: element1.leaveCategories.halfDayOption,
              uploadDocument: element1.leaveCategories.uploadDocument,
              uploadingDocMandatory: element1.leaveCategories.uploadingDocMandatory,
              needLeaveExtension: element1.needToExtendDays,
            });
          });
          if (this.isCommentMandatory) {
            this.addNewLeave.controls.reason.setValidators(Validators.required);
          } else {
            this.addNewLeave.controls.reason.clearAsyncValidators();
          }
          this.addNewLeave.controls.reason.updateValueAndValidity();
        });
    this.divShow = true;
  }

  onChangeCategory(category: any) {
    console.log('category Id ' + category);



    this.categoryInfo.forEach(element => {
      if (element.name === category.name) {
        this.halfDayOption = element.halfDayOption;
        this.uploadDoc = element.uploadDocument;
        this.uploadDocMandatory = element.uploadingDocMandatory;
        this.needLeaveExtension = element.needLeaveExtension;
      }
    });

    this.serviceApi.get('/v1/leave/leaveapplication/leaveData/' + this.addNewLeave.controls.selectEmployee.value + '/' + category.id).
      subscribe(
        // this.http.get('assets/data/Leave/leaveTemplate.json').subscribe
        // (
        res => {
          if (res != null) {
            this.pendingApplCount = res.pendingApplications;
            this.leaveBal = res.remainingBal;
            this.showData = true;
          }
        });
    this.addNewLeave.controls.halfDay.setValue(false);
    this.addNewLeave.controls.halfDayDate.setValue(null);
    this.addNewLeave.controls.halfDayDate.clearValidators();
    this.addNewLeave.controls.halfDayDate.reset();
    const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
    formArr.controls = [];
    if (this.halfDayOption) {
      this.addNewLeave.controls.halfDay.setValidators(Validators.required);
    }
    this.addNewLeave.controls.halfDayDate.updateValueAndValidity();
    if (this.uploadDoc) {
      this.addNewLeave.controls.uploadDoc.clearValidators();
      if (this.uploadDocMandatory) {
        this.addNewLeave.controls.uploadDoc.setValidators(Validators.required);
      }
      this.addNewLeave.controls.uploadDoc.updateValueAndValidity();
    } else {
      this.addNewLeave.controls.uploadDoc.clearValidators();
      this.addNewLeave.controls.uploadDoc.updateValueAndValidity();
    }
    this.addNewLeave.controls.empRelation.clearValidators();
    this.addNewLeave.controls.expirationDate.clearValidators();
    if (category.name === 'Bereavement Leave') {
      this.addNewLeave.controls.empRelation.setValidators(Validators.required);
      this.addNewLeave.controls.expirationDate.setValidators(Validators.required);
    }
    this.addNewLeave.controls.empRelation.updateValueAndValidity();
    this.addNewLeave.controls.expirationDate.updateValueAndValidity();

  }
  applyValidation() {
    this.addNewLeave.controls.halfDayDate.reset();
    console.log(this.addNewLeave.controls.halfDay.value);
    if (this.addNewLeave.controls.halfDay.value) {
      this.addNewLeave.controls.halfDayDate.setValue(null);
      this.addNewLeave.controls.halfDayDate.setValidators(Validators.required);
      this.minDate = new Date(this.addNewLeave.controls.startDate.value);
      this.maxDate = new Date(this.addNewLeave.controls.endDate.value);
    }
    else {
      this.addNewLeave.controls.halfDayDate.clearValidators();
      const formArr = <FormArray>this.addNewLeave.controls.halfDayDates;
      formArr.controls = [];
    }
    this.addNewLeave.controls.halfDayDate.updateValueAndValidity();

  }
  searchEmployeeNameForsupervisor(data: any) {
    // console.log(this.supervisorList);
    // this.approverList = this.approverListCopy;
    if (this.approverControl.value != null) {
      this.employeeList = this.employeeListCopy.filter(option =>
        option.fullName.toLowerCase().indexOf(this.approverControl.value.toLowerCase()) !== -1);
      // } else {

      // this.myControl.reset();
      // this.getAllEmployeeList();
      // this.employeeList = this.employeeLists.filter(option =>
      //   option.fullName.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
    }
  }
  clearapprover() {
    this.approverControl.reset();
    this.employeeList = this.employeeListCopy;
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.currentFileUpload = file;
    }
  }
  submitAppliation() {
    if (this.addNewLeave.valid) {
      //   this.onNoClick();
      const formData = new FormData();
      const file = <File>this.currentFileUpload;
      console.log('form value ' + JSON.stringify(this.addNewLeave.value));
      console.log('Array:::' + JSON.stringify(this.addNewLeave.controls.halfDayDates.value));
      let leaveHalfDaysList = [];
      this.addNewLeave.controls.halfDayDates.value.forEach(element => {
        leaveHalfDaysList.push(element.date + "#" + element.half)
      });;

      formData.append("empCode", this.addNewLeave.controls.selectEmployee.value);
      formData.append("startDate", this.datePipe.transform(this.addNewLeave.controls.startDate.value, 'yyyy-MM-dd'));
      formData.append("endDate", this.datePipe.transform(this.addNewLeave.controls.endDate.value, 'yyyy-MM-dd'));
      formData.append("isHalfDay", this.addNewLeave.controls.halfDay.value);
      formData.append("leaveHalfDaysList", JSON.stringify(leaveHalfDaysList));
      formData.append("leaveName", this.addNewLeave.controls.leaveCategory.value.name);
      formData.append("reason", this.addNewLeave.controls.reason.value);
      formData.append("employeeRelations", this.addNewLeave.controls.empRelation.value);
      formData.append("expirationDate", this.addNewLeave.controls.expirationDate.value);
      formData.append("childDeliveryDate", this.addNewLeave.controls.childDeliveryDate.value);
      if (file !== undefined) { formData.append("file", file, file.name); }



      console.log('Body ---------- Json data-------   ' + JSON.stringify(formData));
      this.serviceApi.postWithFormData('/v1/leave/leaveapplication/admin/', formData).
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
            // this.close();
          });
    }
    else {
      Object.keys(this.addNewLeave.controls).forEach(field => { // {1}
        const control = this.addNewLeave.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  ngOnInit() {

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
  templateUrl: './EditIndividualLeaveAssignment.component.html',
  styleUrls: ['./dialog.scss']
})
export class EditIndividualLeaveAssignment implements OnInit {
  categoryList = [];
  categoryInfo = [];
  halfDayOption = false;
  uploadDoc: any;

  isCommentMandatory: any;
  uploadDocMandatory: any;
  leaveId: any;
  leaveName: any;
  halfDayvalue = [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];
  action: any;
  error = 'Error message';
  editIndividualLeavesRequest: FormGroup;
  currentFileUpload: File;
  constructor(public dialogRef: MatDialogRef<EditIndividualLeaveAssignment>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
    console.log('form infromation ---- ' + JSON.stringify(data));
    this.leaveName = data.leaveCategory;
    this.editIndividualLeavesRequest = this._fb.group(
      {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        halfDay: [data.isHalfDay],
        halfDayDate: '',
        reason: [data.reason]
      });
    this.leaveId = data.leaveId;
    console.log('HAlf Day Date ----- ' + data.halfDays);
    console.log('Employee Code ----- ' + data.empCode);
    this.selectedValue(data);
  }
  selectedValue(data: any) {
    this.categoryList = [];
    //this.categoryInfo = [];
    console.log('Employee Code ----- ' + data.empCode);
    console.log('Editable Leave category........ 1' + data.leaveCategory);
    this.serviceApi.get('/v1/leave/leaveapplication/template/' + data.empCode).
      subscribe(
        // this.http.get('assets/data/Leave/leaveTemplate.json').subscribe
        // (
        res => {
          console.log('Comment mendatory.. ' + res.isCommentMadatory);
          this.isCommentMandatory = res.isCommentMadatory;
          res.leaveCategories.forEach(element => {
            console.log('Editable Leave category ........ 2 ' + element.leaveName);
            if (data.leaveCategory === element.leaveName) {
              console.log('Set Category information ----- ' + JSON.stringify(element));
              this.halfDayOption = element.halfDayOption;
              this.uploadDoc = element.uploadDocument;
              this.uploadDocMandatory = element.uploadingDocMandatory;
            }
          });
          //  console.log('Category Information ---- ' + JSON.stringify(this.categoryInfo));
        });
    if (this.halfDayOption) {
      // this.editIndividualLeavesRequest.controls.halfDayDate.setValidators(Validators.required);
      // this.editIndividualLeavesRequest.controls.halfDayDate.setValue(data.halfDays);
    }
    if (this.isCommentMandatory) {
      this.editIndividualLeavesRequest.controls.reason.setValidators(Validators.required);
    }
    this.editIndividualLeavesRequest.controls.startDate.setValue(data.startDate);
    this.editIndividualLeavesRequest.controls.endDate.setValue(data.endDate);

  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.currentFileUpload = file;
    }
  }
  updateAppliation() {
    if (this.editIndividualLeavesRequest.valid) {
      // this.onNoClick();
      const formData = new FormData();
      const file = <File>this.currentFileUpload;
      console.log('form value ' + JSON.stringify(this.editIndividualLeavesRequest.value));
      formData.append("empCode", this.data.empCode);
      formData.append("startDate", this.editIndividualLeavesRequest.controls.startDate.value);
      formData.append("endDate", this.editIndividualLeavesRequest.controls.endDate.value);
      formData.append("isHalfDay", this.editIndividualLeavesRequest.controls.halfDay.value);
      formData.append("halfDays", this.editIndividualLeavesRequest.controls.halfDayDate.value);
      formData.append("leaveName", this.data.leaveCategory);
      formData.append("reason", this.editIndividualLeavesRequest.controls.reason.value);
      if (file !== undefined) { formData.append("file", file, file.name); }

      console.log('Leave Id ----- ' + this.leaveId);
      console.log('Body ---------- Json data-------   ' + JSON.stringify(formData));
      this.serviceApi.putWithFormData('/v1/leave/leaveapplication/admin/' + this.leaveId, formData).
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
            // this.close();
          });
    }

  }
  ngOnInit() {

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
  templateUrl: './MultipleLeaveApplication.component.html',
  styleUrls: ['./dialog.scss']
})
export class MultipleLeaveApplication implements OnInit {
  public assignMultipleLeaves: FormGroup;
  divShow = false;
  supervisorList = [
    { value: 'Shantanu', viewValue: 'Shantanu Gupta' },
    { value: 'AmarNathan', viewValue: 'Amar Nathan' }
  ]
  constructor(public dialogRef: MatDialogRef<MultipleLeaveApplication>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    this.assignMultipleLeaves = this._fb.group(
      {
        multipleAssignLeaveCategory: [],
        multipleAssignLeaveEmployee: [],
        assignMultipleLeaveStartDate: [],
        assignMultipleLeaveEndDate: [],
        usrComment: [],
        assignMultipleLeavehalfDay: []
      }
    )
  }
  ngOnInit() {

  }
  selectedValue(value: any) {
    console.log('....' + value);
    this.divShow = true;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// @Component({
//   templateUrl: './view-Leave.component.html',
//   styleUrls: ['./dialog.scss']
// })

// export class ViewLeaveComponent implements OnInit {
//   constructor(public dialogRef: MatDialogRef<ViewLeaveComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
//   ) {
//     console.log('Leave Information  :   ' + JSON.stringify(data));
//   }
//   ngOnInit() {

//   }
//   downloadAttachment(data: any) {
//     if (data !== null)
//       window.open(environment.storageServiceBaseUrl + data);
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
// @Component({
//   templateUrl: './ApproveLeaveMultipleRequest.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class ApproveLeaveMultipleRequest implements OnInit {
//   approveMultipleLeavesRequest: FormGroup;
//   action: any;
//   error: any;
//   checkedRowData = [];
//   constructor(public dialogRef: MatDialogRef<ApproveLeaveMultipleRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {
//     console.log(data.checkedRowData);
//     console.log('data-->' + data.checkedRowData);
//     data.checkedRowData.forEach(element => {
//       this.checkedRowData.push(element.leaveId);

//     });
//     // this.checkedRowData = data.checkedRowData;
//     this.approveMultipleLeavesRequest = this._fb.group(
//       {
//         usrComment: ['', Validators.required],
//       });
//   }
//   ngOnInit() {

//   }
//   approveMultiRequest() {
//     if (this.approveMultipleLeavesRequest.valid) {
//       console.log('Comment Value.......' + this.approveMultipleLeavesRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       console.log('Comment Value.......' + this.approveMultipleLeavesRequest.controls.usrComment.value);
//       console.log(this.checkedRowData);
//       const body = {
//         "action": "APPROVE",
//         "comment": this.approveMultipleLeavesRequest.controls.usrComment.value,
//         "reqIds": this.checkedRowData,
//       }
//       this.serviceApi.put('/v1/leave/leaveapplication/bulkAction', body).subscribe(
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
//   templateUrl: './RejectLeaveMultipleRequest.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class RejectLeaveMultipleRequest implements OnInit {
//   rejectMultipleLeavesRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<RejectLeaveMultipleRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder) {
//     this.rejectMultipleLeavesRequest = this._fb.group(
//       {
//         usrComment: [],
//       });
//   }
//   ngOnInit() {

//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }
// @Component({
//   templateUrl: './BulkApproveCancelLeave.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class BulkApproveCancelLeave implements OnInit {
//   bulkApproveMultipleLeavesRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<BulkApproveCancelLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder) {
//     this.bulkApproveMultipleLeavesRequest = this._fb.group(
//       {
//         usrComment: [],
//       });
//   }
//   ngOnInit() {

//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }
// @Component({
//   templateUrl: './BulkRejectCancelLeave.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class BulkRejectCancelLeave implements OnInit {
//   bulkRejectMultipleLeavesRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<BulkRejectCancelLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder) {
//     this.bulkRejectMultipleLeavesRequest = this._fb.group(
//       {
//         attendenceTemplate: [data.attendenceTemplate],
//       });
//   }
//   ngOnInit() {

//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
// @Component({
//   templateUrl: './ApproveIndividualLeave.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class ApproveIndividualLeave implements OnInit {
//   error: any;
//   action: any;
//   approveIndividualLeavesRequest: FormGroup;
//   constructor(public dialogRef: MatDialogRef<ApproveIndividualLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {

//     this.approveIndividualLeavesRequest = this._fb.group(
//       {
//         usrComment: [],
//       });
//   }
//   approveAppliation() {
//     if (this.approveIndividualLeavesRequest.valid) {
//       console.log('Comment Value.......' + this.approveIndividualLeavesRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       this.serviceApi.put('/v1/leave/leaveapplication/admin/' + this.data.leaveId + '/action?action=APPROVE&&comments=' + this.approveIndividualLeavesRequest.controls.usrComment.value, null).
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
//   templateUrl: './RejectIndividualLeave.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class RejectIndividualLeave implements OnInit {
//   action: any;
//   error: any;
//   rejectIndividualLeavesRequest: FormGroup;
//   leaveId: any;
//   constructor(public dialogRef: MatDialogRef<RejectIndividualLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
//     this.rejectIndividualLeavesRequest = this._fb.group(
//       {
//         usrComment: [],
//       });
//   }
//   rejectRequest() {
//     if (this.rejectIndividualLeavesRequest.valid) {
//       console.log('Comment Value.......' + this.rejectIndividualLeavesRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       this.serviceApi.put('/v1/leave/leaveapplication/admin/' + this.data.leaveId + '/action?action=REJECT&&comments=' + this.rejectIndividualLeavesRequest.controls.usrComment.value, null).
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
//   templateUrl: './DeleteLeaveRequest.component.html',
//   styleUrls: ['./dialog.scss']
// })
// export class DeleteLeaveRequest implements OnInit {
//   action: any;
//   error: any;
//   rejectIndividualLeavesRequest: FormGroup;
//   leaveId: any;
//   constructor(public dialogRef: MatDialogRef<DeleteLeaveRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http) {
//     this.leaveId = data.id;

//     // this.rejectIndividualLeavesRequest = this._fb.group(
//     //   {
//     //     usrComment: [],
//     //   });

//   }
//   deleteRequest() {

//     console.log('Inside Reject Request ' + this.leaveId);
//     this.serviceApi.delete('/v1/leave/leaveapplication/admin/' + this.leaveId).
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
//   templateUrl: './CancelIndividualLeaveRequest.component.html',
//   styleUrls: ['./dialog.scss']
// })

// export class CancelIndividualLeaveRequest implements OnInit {
//   action: any;
//   error: any;
//   cancelIndividualLeavesRequest: FormGroup;
//   isCommentMandatory: any;
//   constructor(public dialogRef: MatDialogRef<CancelIndividualLeaveRequest>, @Inject(MAT_DIALOG_DATA) public data: any,
//     private _fb: FormBuilder, private serviceApi: ApiCommonService) {
//     this.cancelIndividualLeavesRequest = this._fb.group(
//       {
//         usrComment: [],
//       });
//     this.serviceApi.get('/v1/leave/leaveapplication/template/' + data.empCode).
//       subscribe(
//         res => {
//           console.log('Comment mendatory.. ' + res.isCommentMadatory);
//           this.isCommentMandatory = res.isCommentMadatory;
//           if (this.isCommentMandatory) {
//             this.cancelIndividualLeavesRequest.controls.usrComment.setValidators(Validators.required);
//           } else {
//             this.cancelIndividualLeavesRequest.controls.usrComment.clearAsyncValidators();
//           }
//           this.cancelIndividualLeavesRequest.controls.usrComment.updateValueAndValidity();
//         });

//   }

//   cancelAppliation() {
//     if (this.cancelIndividualLeavesRequest.valid) {
//       console.log('Comment Value.......' + this.cancelIndividualLeavesRequest.controls.usrComment.value);
//       // tslint:disable-next-line:max-line-length
//       this.serviceApi.put('/v1/leave/leaveapplication/admin/' + this.data.leaveId + '/action?action=CANCEL&&comments=' + this.cancelIndividualLeavesRequest.controls.usrComment.value, null).
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
//     } else {
//       Object.keys(this.cancelIndividualLeavesRequest.controls).forEach(field => { // {1}
//         const control = this.cancelIndividualLeavesRequest.get(field);            // {2}
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
export interface Element {
  empName: string;
  currentAttendenceTemp: string;
  biometricCode: string;
  biometricDeviceId: string;
  attendenceSupervisors: string;
  effectiveFrom: string;
  actions: string;
}
const ELEMENT_DATA: Element[] = [];
