import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
declare var $: any;
@Component({
  selector: 'app-activity-feed-tracker',
  templateUrl: './activity-feed-tracker.component.html',
  styleUrls: ['./activity-feed-tracker.component.scss']
})
export class ActivityFeedTrackerComponent implements OnInit {
  isLeftVisible;
  activityTrackerList = [];
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog) { }
  ngOnInit() {
    this.getAllActivityTracker();
  }

  getAllActivityTracker() {
    this.activityTrackerList = [];
    this.serviceApi.get('/v1/timesheets/activity/feed/').subscribe(
      res => {
        res.forEach(element => {
          this.activityTrackerList.push({
            'timeSheetId': element.feed.timeSheetId,
            'feedType': element.feedType,
            'message': element.message,
            'empCode': element.feed.empCode,
            'totalDay0': element.feed.totalDay0,
            'totalDay1': element.feed.totalDay1,
            'totalDay2': element.feed.totalDay2,
            'totalDay3': element.feed.totalDay3,
            'totalDay4': element.feed.totalDay4,
            'totalDay5': element.feed.totalDay5,
            'totalDay6': element.feed.totalDay6,
            'totalHours': element.feed.totalHours,
            'date': element.feed.date,
            'time': element.feed.time,
            'status': element.feed.status,
            'priority': element.feed.priority,
            'timeSheetApprovalStatus': element.feed.timeSheetApprovalStatus
          });
        });
      },
      err => {
      },
      () => {

      }
    );
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
  openApproveRejectTimesheetDialog(action: any, data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(ApproveRejectTimesheetsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { timeSheetId: data.timeSheetId, action: action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
            this.getAllActivityTracker();
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });

  }

}


@Component({
  templateUrl: './approve-reject-timeSheets.component.html'
})
export class ApproveRejectTimesheetsComponent implements OnInit {
  action: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<ApproveRejectTimesheetsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }

  ngOnInit() { }
  approveReject() {
    var action;
    switch (this.data.action) {
      case "approve": action = 'Approve'; break;
      case "reject": action = 'Reject'; break;
    }
    this.serviceApi.put('/v1/timesheets/admin/' + action + '/' + this.data.timeSheetId, {}).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );
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