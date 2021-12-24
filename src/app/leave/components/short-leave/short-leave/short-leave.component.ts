import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../services/api-common.service';

declare var $: any;

@Component({
  selector: 'app-short-leave',
  templateUrl: './short-leave.component.html',
  styleUrls: ['./short-leave.component.scss']
})
export class ShortLeaveComponent implements OnInit {
  @ViewChild("dt1") dt1: DataTable;
  @ViewChild("dt2") dt2: DataTable;
  @ViewChild("dt3") dt3: DataTable;
  @ViewChild("dt4") dt4: DataTable;
  panelFirstWidth: number;
  panelFirstHeight: number;
  action: string;
  errorMessage: any;
  shortLeavesList: any[];
  columns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'slDate', header: 'Date' },
    { field: 'startTime', header: 'Start Time' },
    { field: 'endTime', header: 'End Time' },
    { field: 'durationInMinutes', header: 'Total Duration(in minutes)' },
    { field: 'reason', header: 'Reason' },
    { field: 'status', header: 'Status' },
    { field: 'action', header: 'Actions' }
  ];
  pendingShortLeaves: any[];
  approvedShortLeaves: any[];
  cancelledShortLeaves: any[];
  rejectedShortLeaves: any[];
  checkedRowData: any[] = [];
  filterPendingByEmp: any = [];
  filterApprovedByEmp: any = [];
  filterCancelledByEmp: any = [];
  filterRejectedByEmp: any = [];
  notificationMsg: any;


  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) { }

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
    this.getAllShortLeaves();
  }

  onTabChange(event) {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

  /**
   * GET METHOD to fetch all short leaves 
   */
  getAllShortLeaves() {
    this.shortLeavesList = [];
    this.serviceApi.get("/v1/short/leave/return/short-leaves").subscribe(res => {
      res.forEach(element => {
        this.shortLeavesList.push({
          durationInMinutes: element.durationInMinutes,
          empCode: element.empCode,
          employeeName: element.employeeName,
          endTime: element.endTime,
          shortLeaveId: element.shortLeaveId,
          slDate: element.slDate,
          startTime: element.startTime,
          status: element.status,
          reason: element.reason == null?'-': element.reason
        })
      });
      this.sortAllShortLeaves();
    },
      err => { },
      () => {
        this.dt1.reset();
        this.dt2.reset();
        this.dt3.reset();
        this.dt4.reset();
      })
  }

  /**
   * Sorting all short leaves array depending on Status
   */
  sortAllShortLeaves() {
    this.pendingShortLeaves = this.shortLeavesList.filter(leave => leave.status.includes('Pending'));
    this.pendingShortLeaves.forEach(element => {
      if (!this.filterPendingByEmp.some(emp => emp.label === element.employeeName)) {
        this.filterPendingByEmp.push({
          label: element.employeeName, value: element.employeeName
        });
      }
    })
    this.approvedShortLeaves = this.shortLeavesList.filter(leave => leave.status === 'Approved');
    this.approvedShortLeaves.forEach(element => {
      if (!this.filterApprovedByEmp.some(emp => emp.label === element.employeeName)) {
        this.filterApprovedByEmp.push({
          label: element.employeeName, value: element.employeeName
        });
      }
    })
    this.cancelledShortLeaves = this.shortLeavesList.filter(leave => leave.status === 'Cancelled');
    this.cancelledShortLeaves.forEach(element => {
      if (!this.filterCancelledByEmp.some(emp => emp.label === element.employeeName)) {
        this.filterCancelledByEmp.push({
          label: element.employeeName, value: element.employeeName
        });
      }
    })
    this.rejectedShortLeaves = this.shortLeavesList.filter(leave => leave.status === 'Rejected');
    this.rejectedShortLeaves.forEach(element => {
      if (!this.filterRejectedByEmp.some(emp => emp.label === element.employeeName)) {
        this.filterRejectedByEmp.push({
          label: element.employeeName, value: element.employeeName
        });
      }
    })
  }

  /**
   * to open dialog for add new short leave
   */
  addShortLeaveDialog() {
    this.action = '';
    console.log('Inside Dialog leave');
    const dialogRef = this.dialog.open(AddShortLeave, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.errorMessage, status: this.action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);
            this.getAllShortLeaves();
          }
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
          }
        }
      }
    });
  }

  /**
   * to open dialog to fetch short leave info for the employee
   */
  viewLeaveInfo(data: any) {
    const dialogRef = this.dialog.open(ViewLeaveComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * to open dialog for performing action on the leave
   */
  actionOnLeave(shortLeaveId: any, action: any) {    
    const dialogRef = this.dialog.open(ActionOnShortLeave, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { shortLeaveId: shortLeaveId, selectedAction: action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.action == 'Response') {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllShortLeaves();
        } else if (result.action === 'Error') {
          this.notificationMsg = result.message;
        }
      }
    });
  }

  /**
   * to open dialog for performing action on the leave
   */
   bulkActionOnLeave(action: any) {    
     if (this.checkedRowData.length>0) {
    const dialogRef = this.dialog.open(BulkActionOnShortLeave, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { shortLeaves: this.checkedRowData, selectedAction: action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.action == 'Response') {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllShortLeaves();
          this.checkedRowData = [];
        } else if (result.action === 'Error') {
          this.notificationMsg = result.message;
        }
      }
    });
  }
  else this.warningNotification("Please select atleast one row")
  }
}

/**
 * ADD NEW SHORT LEAVE COMPONENT
 */
@Component({
  templateUrl: '../add-short-leave.component.html',
  styleUrls: ['./dialog.scss']
})
export class AddShortLeave implements OnInit {
  shortLeaveForm: FormGroup;
  employeeList: any[] = [];
  action: any;
  error: any;
  generalSettings: any;
  maxDuration: any;

  constructor(public dialogRef: MatDialogRef<AddShortLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService, private fb: FormBuilder) {
    this.shortLeaveForm = this.fb.group({
      selectedEmployee: [null, Validators.required],
      slDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      durationInMinutes: [0],
      slApplicationLimit: [null],
      reason: [null]
    });
  }

  ngOnInit() { 
    this.getEmployeesList();
  }

  /**
   * GET METHOD to get list of all employees
   */
  getEmployeesList() {
    this.employeeList = [];
    this.serviceApi.get('/v1/leave/settings/general/return/short/leave/employees').subscribe(
      res => {
        res.empList.forEach(element => {
          this.employeeList.push({
            fullName: element.employeeName,
            value: element.empCode
          });
        });
        this.shortLeaveForm.controls.durationInMinutes.setValidators([Validators.max(res.maxDurationInMins), Validators.min(1)]);
        this.shortLeaveForm.controls.slApplicationLimit.setValue(res.slApplicationLimit);
        this.maxDuration = res.maxDurationInMins
      }
    );
  }

  addNewShortLeave() {
    if (this.shortLeaveForm.valid) {
      const date = new DatePipe('en-US').transform(this.shortLeaveForm.get('slDate').value, 'dd-MM-yyyy');
      const startTime = new DatePipe('en-US').transform(this.shortLeaveForm.get('startTime').value, 'dd-MM-yyyy HH:mm');
      const endTime = new DatePipe('en-US').transform(this.shortLeaveForm.get('endTime').value, 'dd-MM-yyyy HH:mm');

      let body = {
        "durationInMinutes": this.shortLeaveForm.get('durationInMinutes').value,
        "empCode": this.shortLeaveForm.get('selectedEmployee').value,
        "endTime": endTime,
        "reason": this.shortLeaveForm.get('reason').value,
        "shortLeaveId": null,
        "slDate": date,
        "startTime": startTime,
        "status": null
      }
      this.serviceApi.post("/v1/short/leave/", body).subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
          this.close();
        },
        () => {

        })
    }
    else {
      Object.keys(this.shortLeaveForm.controls).forEach(field => {
        const control = this.shortLeaveForm.get(field);
        control!.markAsTouched({ onlySelf: true });
      });
    }
  }

  onTimeChange($event: any) {
    const startTime = new Date(this.shortLeaveForm.get('startTime').value);
    const endTime = new Date(this.shortLeaveForm.get('endTime').value);
    let timeDiff = endTime.getTime() - startTime.getTime();
    timeDiff = Math.round(timeDiff / (1000 * 60));
    this.shortLeaveForm.get('durationInMinutes').setValue(timeDiff);
  }

  close(): void {
    this.data.status = this.action;
    this.data.message = this.error;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

/**
 * VIEW SHORT LEAVE COMPONENT
 */
@Component({
  templateUrl: '../view-short-leave.component.html',
})
export class ViewLeaveComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ViewLeaveComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

/**
 * ACTION SHORT LEAVE
 */
@Component({
  templateUrl: '../action-on-short-leave.component.html',
})
export class ActionOnShortLeave implements OnInit {
  error: any;
  action: any;
  status: any;
  leaveInfo: any;
  selectedAction: any;

  constructor(public dialogRef: MatDialogRef<ActionOnShortLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
    this.selectedAction = this.data.selectedAction;
    if (this.selectedAction == 'APPROVED') this.action = 'Approve';
    else if (this.selectedAction == 'REJECTED') this.action = 'Reject';
    else if (this.selectedAction == 'CANCELLED') this.action = 'Cancel';
  }

  /**
   * selected action to be performed on leave
   */
  actionOnShortLeave() {
    let body = {
      "action": this.data.selectedAction,
      "shortLeaveId": this.data.shortLeaveId
    }
    this.serviceApi.put('/v1/short/leave/admin', body).
      subscribe(
        res => {
          console.log('Successful...');
          this.status = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.status = 'Error';
          this.error = err.message;
          this.close();
        });
  }
  ngOnInit() { }
  close(): void {
    this.data.action = this.status;
    this.data.message = this.error;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

/**
 * BULK ACTION SHORT LEAVE
 */
 @Component({
  templateUrl: '../action-on-short-leave.component.html',
})
export class BulkActionOnShortLeave implements OnInit {
  error: any;
  action: any;
  status: any;
  leaveInfo: any;
  selectedAction: any;
  shortLeaveIds: any[] = [];

  constructor(public dialogRef: MatDialogRef<BulkActionOnShortLeave>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
    this.selectedAction = this.data.selectedAction;
    if (this.selectedAction == 'APPROVED') this.action = 'Approve';
    this.data.shortLeaves.forEach(ele => this.shortLeaveIds.push(ele.shortLeaveId))
  }

  /**
   * selected action to be performed on leave
   */
  actionOnShortLeave() {
    let body = {
      "action": this.selectedAction,
      "shortLeaveId": this.shortLeaveIds
    }
    this.serviceApi.put('/v1/short/leave/bulk-action/admin', body).
      subscribe(
        res => {
          console.log('Successful...');
          this.status = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.status = 'Error';
          this.error = err.message;
          this.close();
        });
  }
  ngOnInit() { }
  close(): void {
    this.data.action = this.status;
    this.data.message = this.error;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

