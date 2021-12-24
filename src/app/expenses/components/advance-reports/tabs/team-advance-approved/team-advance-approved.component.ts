import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ExpensesService } from '../../../../../expenses/expenses.service';
declare var $: any
@Component({
  selector: 'app-team-advance-approved',
  templateUrl: './team-advance-approved.component.html',
  styleUrls: ['./team-advance-approved.component.scss']
})
export class TeamAdvanceApprovedComponent implements OnInit {
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
  approvedRequest: any;
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
    this.service.getTeamAdvanceApprovedRequest().subscribe((data) => {
      if (data != null) {
        this.approvedRequest = [];
        data.forEach(element => {
          this.approvedRequest.push({
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
    let dialogRef = this.dialog.open(ShowApprovedAdvancesDialogComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data: element,
    });
  }

  cancelApplication(advanceApplicationId: any) {
    console.log('Inside cancel request dialog');
    const dialogRef = this.dialog.open(CancelAdvanceRequest, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data:{ advanceApplicationId: advanceApplicationId},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.messageEvent.emit();
            this.expenseService.changedStatus(true);
          }
        }
      }
    });
  }
}

@Component({
  templateUrl: './cancel-expense-request.html',
})
export class CancelAdvanceRequest implements OnInit {
  action: any;
  error: any;
  constructor(public dialogRef: MatDialogRef<CancelAdvanceRequest>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) { }
  cancelRequest() {
    const body = {
      "advanceApprovalId": this.data.advanceApplicationId
    }
    return this.serviceApi.put('/v1/advance/application/cancel/admin', body).
      subscribe(
        res => {
          console.log('Cancel Request Successfully...' + JSON.stringify(res));
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


// Show Advances
@Component({
  templateUrl: 'show-advance-request-dialog.html',
})
export class ShowApprovedAdvancesDialogComponent {
  constructor(
    public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowApprovedAdvancesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}