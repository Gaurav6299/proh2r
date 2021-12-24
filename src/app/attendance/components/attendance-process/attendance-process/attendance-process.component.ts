import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTabChangeEvent, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { ActiveEmployeesComponent } from '../active-employees/active-employees.component';
import { ProcessedEmployeesComponent } from '../processed-employees/processed-employees.component';
import { ApiCommonService } from '../../../../services/api-common.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-attendance-process',
  templateUrl: './attendance-process.component.html',
  styleUrls: ['./attendance-process.component.scss']
})
export class AttendanceProcessComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'attendanceProcessPeriod', header: 'Attendance Process Period' },
    { field: 'runDate', header: 'Run Date' },
    { field: 'processDetails', header: 'Process Details' },
    { field: 'syncWithPayroll', header: 'Export To Payroll' },
    { field: 'actions', header: 'Actions' }
  ];
  monthName: any;
  processId: any;
  check: boolean = true;
  attendanceProcessRecords = [];
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private router: Router) {
    this.processId = "";
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
  // ngAfterViewInit(): void {
  //   if ($('.divtoggleDiv').length > 0) {
  //     this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
  //     console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
  //     this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
  //     console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
  //     $('.divtoggleDiv')[1].style.display = 'none';
  //   }
  // }
  // setPanel() {
  //   $('.divtoggleDiv')[1].style.display = 'none';
  //   $('.divtoggleDiv').width(this.panelFirstWidth);
  // }
  // cancelPanel() {
  //   this.isLeftVisible = false;
  //   this.setPanel();
  // }
  // processAttendance() {
  //   this._router.navigate(['MyCompB', { id: "someId", id2: "another ID" }]);
  // }
  // cancelAttendanceProcess(event: any) {
  //   console.log(event);
  //   if (event == 'cancel') {
  //     this.cancelPanel();
  //     this.getAttendanceProcessRecord();
  //   }
  // }
  AttendanceProcessEdit(attendanceProcessRecord: any) {
    console.log(attendanceProcessRecord);
    this.processId = attendanceProcessRecord.processId;
    this.monthName = attendanceProcessRecord.attendanceProcessPeriod;
    this.router.navigate(['/attendance/attendance-process-tab/' + this.monthName + '/' + this.processId]);
    // $('.divtoggleDiv')[1].style.display = 'block';
    // this.isLeftVisible = true;
    // console.log(attendanceProcessRecord);
    // this.attendanceProcessObj = attendanceProcessRecord;
    // this.pendingEmployees = [];
    // this.processedEmployees = [];
    // let monthYear = attendanceProcessRecord.attendanceProcessPeriod;
    // this.monthName = monthYear;
    // this.serviceApi.get('/v1/attendance/process/' + monthYear).subscribe(res => {
    //   this.pendingEmployees = res.pendingList;
    //   this.processedEmployees = res.processedList;
    // }, (err) => {

    // }, () => {
    //   console.log(this.pendingEmployees);
    //   console.log(this.processedEmployees);
    //   console.log(this.attendanceProcessObj);
    // })
  }
  ngOnInit() {
    this.getAttendanceProcessRecord();
  }
  syncWithPayrollDialog(data: any) {
    let dialogRef = this.dialog.open(AttendanceProcessSyncDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
            this.getAttendanceProcessRecord();
          }
        }
      }
    });
  }
  getAttendanceProcessRecord() {
    this.attendanceProcessRecords = [];
    this.serviceApi.get('/v1/attendance/process/getall').subscribe(
      res => {
        this.attendanceProcessRecords = res.allAttendanceProcessRecords;
        this.monthName = res.newMonthName;
        this.check = res.newMonthProcess;
      }, () => {
        console.log('Enter into Else Bloack');
        this.dt.reset();
      });
  }

  generateAttendanceProcessDialog() {
    let dialogRef = this.dialog.open(GenerateAttendanceProcessComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // onTabChange(event: MatTabChangeEvent) {
  //   if (event.index === 0) {
  //     console.log('Inside Active Employees Tab...');
  //     this.activeChild.getAllActiveAttendanceRecord(this.monthName);
  //   }
  //   else if (event.index === 1) {
  //     console.log('Inside Processed Employees Tab...');
  //     this.processedChild.getEmployeeData(this.monthName);
  //   } else {
  //   }
  // }

}



@Component({
  templateUrl: 'generate-attendance-process-dialog.html',
})
export class GenerateAttendanceProcessComponent implements OnInit {
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
  constructor(public dialogRef: MatDialogRef<GenerateAttendanceProcessComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
  templateUrl: 'attendance-process-sync-dialog.html',
})
export class AttendanceProcessSyncDialogComponent implements OnInit {
  actions: any;
  error: any;
  message;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<AttendanceProcessSyncDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) { }
  syncAttendanceProcess() {
    // const body = null;
    return this.serviceApi.post('/v1/attendance/process/syncToPayroll/' + this.data.processId, null).
      subscribe(
      res => {
        this.actions = 'Response';
        this.message = res.message;
        this.close();
      },
      err => {
        console.log('there is something error.....  ' + err.message);
        this.actions = 'Error';
      });
  }

  ngOnInit() { }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}