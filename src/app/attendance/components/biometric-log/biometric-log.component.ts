import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Body } from '@angular/http/src/body';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../app/services/api-common.service';
declare var $: any;

@Component({
  selector: 'app-biometric-log',
  templateUrl: './biometric-log.component.html',
  styleUrls: ['./biometric-log.component.scss']
})
export class BiometricLogComponent implements OnInit {
  biometricLogData: any[];
  selectedRows: any = [];
  @ViewChild('dt1') dt: DataTable;
  // fromDate: any;
  // toDate: any;
  columns = [
    { field: 'localDateTimeStamp', header: 'Generated At' },
    { field: 'from', header: 'Start Date' },
    { field: 'to', header: 'End Date' },
    { field: 'processed', header: 'Status' },
    { field: 'action', header: 'Action' },
  ];
  action: string;
  error: any;
  biometricLogForm: FormGroup;
  notificationMsg: any;
  constructor(private _fb: FormBuilder, private serviceApi: ApiCommonService, private datePipe: DatePipe, public dialog: MatDialog, private route: ActivatedRoute,) {
    // this.getBiometricLogData();
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

  getBiometricLogData() {
    if (this.biometricLogForm.valid) {
      let fromDate = this.datePipe.transform(this.biometricLogForm.value.startDate, 'dd-MM-yyyy');
      let toDate = this.datePipe.transform(this.biometricLogForm.value.endDate, 'dd-MM-yyyy');
      console.log(fromDate);
      console.log(toDate);

      this.biometricLogData = [];
      this.serviceApi.get('/v1/attendance/biometric/' + fromDate + '/' + toDate).subscribe(res => {
        this.biometricLogData = res;
      }, (err) => {
      }, () => {
        this.dt.reset();
      })
    } else {
      Object.keys(this.biometricLogForm.controls).forEach(field => { // {1}
        const control = this.biometricLogForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }


  }
  ngOnInit() {
    this.biometricLogForm = this._fb.group(
      {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      }
    );
  }

  rerun(element: any) {
    console.log(element.biometricLogId);
    let dialogRef = this.dialog.open(LambdaTriggerDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { biometricLogId: element.biometricLogId }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getBiometricLogData();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }
    });
    


  }
  close() {
    throw new Error('Method not implemented.');
  }




}
@Component({
  // selector: 'app-employee-un-hold-dialog',
  templateUrl: 'lambda-trigger-Dialog.component.html',
  styleUrls: ['./dialog.scss']
})
export class LambdaTriggerDialogComponent implements OnInit{

  dataValue: any;
  error = 'Error Message';
  action: any;
  public runValidation: FormGroup;
  id: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<LambdaTriggerDialogComponent>,
    private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.id = data.biometricLogId;
  }



  ngOnInit() {
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  submitAppliation() {
    console.log(this.id);

    let body = {
      "biometricLogId": this.id
    }
    this.serviceApi.post('/v1/attendance/biometric/trigger', body).subscribe(
      res => {
        console.log('success.....');
        this.action = 'Response';
        this.error = res.message;
        this.close();
        // this.successNotification(res.message);
        // this.getBiometricLogData();
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
      }, () => {
      }
    )
    
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}