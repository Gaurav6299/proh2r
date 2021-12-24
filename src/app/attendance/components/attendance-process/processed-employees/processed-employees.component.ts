import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { datepickerLocale } from 'fullcalendar';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../services/api-common.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-processed-employees',
  templateUrl: './processed-employees.component.html',
  styleUrls: ['./processed-employees.component.scss']
})
export class ProcessedEmployeesComponent implements OnInit {
  @ViewChild("dt2") dt: DataTable;
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' }
  ];
  isLeftVisible: any;
  processedEmployees = [];
  selectedRows = [];
  notificationMsg: any;
  monthName: any;
  processId: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.monthName = params['monthYear'];
      this.processId = params['id'];
      // this.getAllProcessedAttendanceRecord(this.monthName);
    });
    console.log(this.monthName);
    console.log(this.processId);
  }

  getAllProcessedAttendanceRecord(monthYear) {
    this.processedEmployees = [];
    this.serviceApi.get('/v1/attendance/process/' + monthYear).subscribe(res => {
      this.processedEmployees = res.processedList;
    }, (err) => {

    }, () => {
      this.selectedRows = [];
      console.log(this.processedEmployees);
    })
  }
  bulkRerunForUploadEmployeesDialog() {
    let dialogRef = this.dialog.open(BulkRerunForUploadEmployeesComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  rerunSelectedEmployeesDialog() {
    console.log(this.selectedRows);
    if (this.selectedRows.length == 0) {
      this.warningNotification('Select an employee first');
    } else {
      let empList = [];
      this.selectedRows.forEach(element => {
        empList.push(element.empCode);
      });
      let dialogRef = this.dialog.open(RerunSelectedEmployeesComponent, {
        width: '600px',
        panelClass: 'custom-dialog-container',
        data: {
          empCodeList: empList,
          processId: this.processId,
          processPeriod: this.monthName
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
              this.getAllProcessedAttendanceRecord(this.monthName);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              this.warningNotification(this.notificationMsg);
            }
          }
          this.selectedRows = [];
        }
      });
    }
  }

  ngOnInit() {
    this.selectedRows = [];
  }


  warningNotification(warningMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'error',
      message: warningMessage,
    }, {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    }, {
        type: 'success',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

}
@Component({
  templateUrl: 'bulk-rerun-upload-employees-dialog.html',
})
export class BulkRerunForUploadEmployeesComponent implements OnInit {
  actions: any;
  error: any;
  message: any
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
  constructor(public dialogRef: MatDialogRef<BulkRerunForUploadEmployeesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'rerun-selected-employees-dialog.html',
})
export class RerunSelectedEmployeesComponent implements OnInit {
  actions: any;
  error: any;
  message: any
  processId: any;
  processPeriod: any;
  empList = [];
  action: string;
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
  constructor(public dialogRef: MatDialogRef<RerunSelectedEmployeesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {

    this.processId = data.processId;
    this.processPeriod = data.processPeriod;
    this.empList = data.empCodeList

  }

  submit() {
    const body = {
      "empCodes": this.empList,
      "monthYear": this.processPeriod,
      "processId": this.processId
    }
    this.serviceApi.put('/v1/attendance/process/rollback', body).subscribe(
      res => {
        if (res != null) {
          this.actions = 'Response';
          this.message = res.message;
          this.close();
          console.log('Successfully rollback');
        }
      }, (err) => {
        this.action = 'Error';
        this.message = err.message;
        this.close();
      }, () => {
      })
  }

  ngOnInit() {
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}