import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ExpensesService } from '../../../../../expenses/expenses.service';
declare var $: any
@Component({
  selector: 'app-team-advance-cancelled',
  templateUrl: './team-advance-cancelled.component.html',
  styleUrls: ['./team-advance-cancelled.component.scss']
})
export class TeamAdvanceCancelledComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'empCode', header: 'Employee Name' },
    { field: 'advanceAmount', header: 'Amount' },
    { field: 'advanceCategoryName', header: 'Category Name' },
    { field: 'comments', header: 'Comments' },
    { field: 'applicationStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  cancelledRequest: any;
  constructor(private service: ExpensesService, public dialog: MatDialog) {
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
    this.service.getTeamAdvanceCancelledRequest().subscribe((data) => {
      if (data != null) {
        this.cancelledRequest = [];
        data.forEach(element => {
          this.cancelledRequest.push({
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
    let dialogRef = this.dialog.open(ShowCancelledAdvancesDialogComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data: element,
    });
  }
}

// Show Advances
@Component({
  templateUrl: 'show-advance-request-dialog.html',
})
export class ShowCancelledAdvancesDialogComponent {
  constructor(
    public innerDialog: MatDialog,
    public dialogRef: MatDialogRef<ShowCancelledAdvancesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}