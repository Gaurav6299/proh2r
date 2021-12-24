import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-attendance-validation',
  templateUrl: './attendance-validation.component.html',
  styleUrls: ['./attendance-validation.component.scss']
})
export class AttendanceValidationComponent implements OnInit {
  attandanceValidationData = [];
  attendanceValidationDataMonthList = [];
  @ViewChild('dt1') dt: DataTable;
  columns = [
    { field: 'generateAt', header: 'Generated At' },
    { field: 'fromDate', header: 'Start Date' },
    { field: 'toDate', header: 'End Date' },
    { field: 'status', header: 'Status' },
  ];
  monthList = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  month: any;
  attendanceMonthList = [];
  runPayrollId: any;
  notificationMsg: any;
  selectedRows: any[];

  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog, private route: ActivatedRoute,) {
    const date = new Date();
    const monthName = this.monthList[date.getMonth()];
    const yearName = date.getFullYear();
    this.month = monthName + '-' + yearName;
    this.getAttandanceValidationData(this.month);
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
  getAttandanceValidationDataMonthList() {
    this.serviceApi.get('/v1/attendance/attendanceRecords/attendanceMonthYearList').subscribe(
      res => {
        res != null ? res.forEach(element => {
          this.attendanceMonthList = [...this.attendanceMonthList, element];
        }) : this.attendanceMonthList = [];
      }
    );
  }
  getAttandanceValidationData(month: any) {
    this.attandanceValidationData = [];
    this.serviceApi.get('/v1/attendance/attendanceaudit/get/attd-validation' + '/' + month).subscribe(res => {
      res.forEach(element => {
        this.attandanceValidationData.push({
          "validationId": element.validationId,
          "fromDate": element.fromDate,
          "toDate": element.toDate,
          "generateAt": element.generateAt,
          "status": element.completed ? "Completed" : "In-Process"
        });
      });
    }, (err) => {
    }, () => {
      this.getAttandanceValidationDataMonthList();
      this.dt.reset();
    })

  }


  ngOnInit() {
  }


  runValidation() {
    console.log("run validation........");

    let dialogRef = this.dialog.open(RunValidationDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getAttandanceValidationData(this.month);
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            this.warningNotification(this.notificationMsg);
          }
        }
      }
    });
  }
}

@Component({
  // selector: 'app-employee-un-hold-dialog',
  templateUrl: 'run-validation-dialog.component.html',
  styleUrls: ['./dialog.scss']
})
export class RunValidationDialogComponent implements OnInit {
  dataValue: any;
  error = 'Error Message';
  action: any;
  empCodeList: any;
  runPayrollId: any;
  public runValidation: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<RunValidationDialogComponent>,
    private apiCommonService: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.runValidation = this._fb.group(
      {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitAppliation() {
    console.log(this.runValidation.value);
    if (this.runValidation.valid) {
      const body = {
        "endDate": this.runValidation.value.endDate,
        "startDate": this.runValidation.value.startDate
      };
      this.apiCommonService.put('/v1/attendance/attendanceaudit/validate/record', body).subscribe(
        res => {
          console.log('success.....');
          this.action = 'Response';
          this.error = res.message;
          this.close();

        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          // this.close();
        }, () => {
        }
      );
    } else {
      Object.keys(this.runValidation.controls).forEach(field => { // {1}
        const control = this.runValidation.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}