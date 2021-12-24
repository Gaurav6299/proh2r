import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ApiCommonService } from '../../../../app/services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var $: any;
@Component({
  selector: 'app-lop-reversal',
  templateUrl: './lop-reversal.component.html',
  styleUrls: ['./lop-reversal.component.scss']
})
export class LopReversalComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  sync: Boolean = false;
  lopHistoryId: any;
  monthList = [];
  lopReversalList = [];
  selectedMonthYear: any;
  columns = [
    { field: 'sno', header: 'Sr.No' },
    { field: 'empCode', header: 'Emp Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'actions', header: 'Actions' }
  ]
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

  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getMonthYearRecord();
  }

  getMonthYearRecord() {
    this.monthList = [];
    this.serviceApi.get("/v1/attendance/attendanceRecords/attendanceMonthYearList").subscribe(
      res => {
        res != null ? res.forEach(element => {
          this.monthList.push(element);
        }) : this.monthList = [];
      }, (err) => {

      }, () => {
        this.selectedMonthYear = this.selectedMonthYear!=null ? this.selectedMonthYear : this.monthList[6];
        this.selectMonth();
      }
    );
  }

  selectMonth() {
    this.lopReversalList = [];
    this.sync = false;
    this.lopHistoryId = null;
    this.serviceApi.get("/v1/lop-reversal/get/" + this.selectedMonthYear).subscribe(
      res => {
        this.lopHistoryId = res.lopHistoryId;
        this.lopReversalList = res.lopReversals;
        this.sync = res.sync;
      }, (err) => {

      }, () => {
        this.dt.reset();
      }
    );
  }

  viewLOPDialog(event: any) {
    const dialogRef = this.dialog.open(ViewLOPDetailsComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          console.log(result);
          var LOPReversalArr = [];
          result.response.forEach(element => {
            if (element.lopReversedCount != null) {
              LOPReversalArr.push({
                "date": element.date,
                "lopReversalsId": element.lopReversalsId,
                "lopReversedCount": element.lopReversedCount,
                "lopCount": element.lopCount
              });
            }
          });
          this.saveLOPReversal(LOPReversalArr, this.lopHistoryId, result.empCode);
        }
      }
    });
  }

  saveLOPReversal(details: any, lopHistoryId: any, empCode: any) {
    // console.log(details);
    const body = {
      "lopHistoryId": lopHistoryId,
      "lopObjs": [
        {
          "details": details,
          "empCode": empCode
        }
      ]
    }
    // console.log(body);
    this.serviceApi.put('/v1/lop-reversal/save', body).subscribe(res => {
      this.successNotification(res.message);
      this.getMonthYearRecord();
    }, (err) => {

    }, () => {

    });

  }

  syncWithPayroll() {
    const dialogRef = this.dialog.open(SyncWithPayrollComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { lopHistoryId: this.lopHistoryId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          this.successNotification(result.message);
          this.getMonthYearRecord();
        }
      }
    });
  }
}

@Component({
  templateUrl: 'view-lop-details-dialog.html',
  styleUrls: ['./lop-reversal.component.scss']
})
export class ViewLOPDetailsComponent implements OnInit {
  error = 'Error Message';
  action: any;
  lop = [
    { field: '0.5', header: '0.5' },
    { field: '1', header: '1' },
  ];
  columns = [
    { field: 'date', header: 'Date' },
    { field: 'lopCount', header: 'LOP Count' },
    { field: 'lopReversedCount', header: 'Reversal Count' },
    { field: 'action', header: 'Action' }
  ]
  lopReversalList = [];
  constructor(
    public dialogRef: MatDialogRef<ViewLOPDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private datePipe: DatePipe) {
    console.log(data);
    this.lopReversalList = this.data.details;
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
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  selectLOPDays(element: any, event: any) {
    console.log(event);
    console.log(element);
    this.lopReversalList.forEach(row => {
      if (row.date == element.date) {
        if (event == undefined) {
          row.lopReversedCount = null;
        } else {
          row.lopReversedCount = +event.field
        }
      }
    })
  }

  onSave() {
    if (this.validateLOPReversal()) {
      this.data.status = 'Response';
      this.data.response = this.lopReversalList;
      this.dialogRef.close(this.data);
    }
  }

  validateLOPReversal() {
    for (var i = 0; i < this.lopReversalList.length; i++) {
      if (this.lopReversalList[i].lopReversedCount != null) {
        if (this.lopReversalList[i].lopCount < this.lopReversalList[i].lopReversedCount) {
          this.warningNotification("LOP Reversal count cannot exceed LOP Count for " + this.datePipe.transform(this.lopReversalList[i].date, 'dd-MM-yyyy'));
          return false;
        }
      }
    }
    return true;
  }


}


@Component({
  templateUrl: 'sync-with-payroll-dialog.html',
  styleUrls: ['./lop-reversal.component.scss']
})
export class SyncWithPayrollComponent implements OnInit {

  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<SyncWithPayrollComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private datePipe: DatePipe) {
    console.log(data);
  }


  ngOnInit() {
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  syncWithPayroll() {
    const body = {
      "lopHistoryId": this.data.lopHistoryId
    }
    this.serviceApi.put("/v1/lop-reversal/sync", body).subscribe(res => {
      this.action = 'Response';
      this.error = res.message;
      this.close();
    }, (err) => {
      this.action = 'Error';
      this.error = err.message;
      this.close();
    }, () => {

    })
  }
}
