import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ExpensesService } from '../../../../../expenses/expenses.service';
import { ApiCommonService } from '../../../../../services/api-common.service';
declare var $: any
@Component({
  selector: 'app-team-advance-pending',
  templateUrl: './team-advance-pending.component.html',
  styleUrls: ['./team-advance-pending.component.scss']
})
export class TeamAdvancePendingComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  @Output() messageEvent = new EventEmitter<string>();
  message: string;
  columns = [
    { field: 'empCode', header: 'Employee Name' },
    { field: 'advanceAmount', header: 'Amount' },
    { field: 'advanceCategoryName', header: 'Category Name' },
    { field: 'comments', header: 'Comments' },
    { field: 'applicationStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  pendingRequest: any;
  action: string;
  notificationMsg: any;
  constructor(private service: ExpensesService, public dialog: MatDialog, private expenseService: ExpensesService) {
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
  ngOnInit() {
    this.service.getTeamAdvancePendingRequest().subscribe((data) => {
      if (data != null) {
        this.pendingRequest = [];
        data.forEach(element => {
          this.pendingRequest.push({
            empCode: element.empCode,
            advanceCategoryId: element.advanceCategoryId,
            advanceApplicationId: element.advanceApplicationId,
            advanceCategoryName: element.advanceCategoryName,
            advanceAmount: element.advanceAmount,
            comments: element.comments,
            applicationStatus: element.applicationStatus,
          });
        });
        this.dt.reset();
      }
    });
  }
  showAdvanceHistoryDialog(element: any) {
    let dialogRef = this.dialog.open(ShowPendingAdvancesDialogComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data: element,
    });
  }
  approveSingleAdvance(advanceApplicationId: any) {
    this.action = '';
    console.log('Inside Bulk Reject');
    const dialogRef = this.dialog.open(ApproveAdvanceComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { advanceApplicationId: advanceApplicationId, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          console.log(result);
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.messageEvent.emit();
          this.expenseService.changedStatus(true);
        } else if (result.status === 'Error') {
          this.notificationMsg = result.message;
        }
      }
    });
  }
  rejectSingleAdvance(advanceApplicationId: any) {
    this.action = '';
    console.log('Inside Bulk Reject');
    const dialogRef = this.dialog.open(RejectAdvanceComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { advanceApplicationId: advanceApplicationId, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          console.log(result);
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.messageEvent.emit();
          this.expenseService.changedStatus(true);
        } else if (result.status === 'Error') {
          this.notificationMsg = result.message;
        }
      }
    });
  }
}

// Show Advances
@Component({
  templateUrl: 'show-advance-request-dialog.html',
})
export class ShowPendingAdvancesDialogComponent {
  constructor(
    public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowPendingAdvancesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: './approve-advance-request.html',
})
export class ApproveAdvanceComponent implements OnInit {
  action: any;
  error: any;
  approveApplication: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApproveAdvanceComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.approveApplication = this._fb.group(
      {
        usrComment: ['', Validators.required],
      });
  }
  approveAppliation() {
    if (this.approveApplication.valid) {
      const body = {
        "advanceApprovalId": this.data.advanceApplicationId
      }
      return this.serviceApi.put('/v1/advance/application/approve/admin', body).
        subscribe(
          res => {
            console.log('Approve Successfully...' + JSON.stringify(res));
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
      Object.keys(this.approveApplication.controls).forEach(field => {
        const control = this.approveApplication.get(field);
        control.markAsTouched({ onlySelf: true });
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
  templateUrl: './reject-advance-request.html',
})
export class RejectAdvanceComponent implements OnInit {
  action: any;
  error: any;
  rejectApplication: FormGroup;
  constructor(public dialogRef: MatDialogRef<RejectAdvanceComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.rejectApplication = this._fb.group({
      usrComment: ['', Validators.required],
    });
  }
  rejectRequest() {
    if (this.rejectApplication.valid) {
      const body = {
        "advanceApprovalId": this.data.advanceApplicationId
      }
      return this.serviceApi.put('/v1/advance/application/reject', body).
        subscribe(
          res => {
            console.log('Approve Successfully...' + JSON.stringify(res));
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
      Object.keys(this.rejectApplication.controls).forEach(field => {
        const control = this.rejectApplication.get(field);
        control.markAsTouched({ onlySelf: true });
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
