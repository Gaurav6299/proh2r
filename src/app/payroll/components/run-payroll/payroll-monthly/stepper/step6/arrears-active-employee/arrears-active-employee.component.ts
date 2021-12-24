import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, ChangeDetectorRef, ViewChildren, ElementRef, QueryList, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
import { Router } from '@angular/router';
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { UploadFileService } from '../../../../../../../services/UploadFileService.service';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { environment } from '../../../../../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-arrears-active-employee',
  templateUrl: './arrears-active-employee.component.html',
  styleUrls: ['./arrears-active-employee.component.scss']
})
export class ArrearsActiveEmployeeComponent implements OnInit {
  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();
  arrearList = [];
  @ViewChild("dt1") dt: DataTable;
  isArrearDisbursable: Boolean;
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'manualArrear', header: 'Manual Arrears' },
    { field: 'arrearDays', header: 'Arrear Days' },
    { field: 'lopReversalDays', header: 'LOP Reversal Days' },
    { field: 'fixedAllowanceTotal', header: 'Salary Revision Arrears' },
    { field: 'lopReversalTotal', header: 'LOP Reversal Arrears' },
    { field: 'totalArrear', header: 'Total Arrears' },
    { field: 'actions', header: 'Actions' },
  ];
  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private http: Http, private runPayroll: RunPayroll, private router: Router, private serviceApi: ApiCommonService) {
    this.isArrearDisbursable = false;
  }

  ngOnInit() {

  }
  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
    this.messageEvent.emit('previous-' + currentStep);
  }
  onChangeisArrearDisbursable(event: any) {
    console.log(event);
    this.serviceApi.put("/v1/payroll/runPayroll/disburse-arrear/" + this.runPayrollId + "/" + event.checked, {}).subscribe(res => {
      this.getArrearDisbursementStatus();
    });
  }
  getArrearDisbursementStatus() {
    this.serviceApi.get("/v1/payroll/runPayroll/arrear/disbursement-status/" + this.runPayrollId).subscribe(res => {
      if (res.message == "false")
        this.isArrearDisbursable = false;
      else
        this.isArrearDisbursable = true;
    }, (err) => {

    }, () => {
      this.getAllArrears();
    });

  }
  onProceed() {
    var body = [];
    this.arrearList.forEach(arrear => {
      body.push(
        {
          "manualArrear": arrear.manualArrear,
          "runPayrollEmployeeDetailsId": arrear.runPayrollEmployeeDetailsId
        }
      )
    });
    this.serviceApi.put("/v1/payroll/runPayroll/update/manual-arrear/" + this.runPayrollId, body).subscribe(res => {
      let currentStep;
      this.runPayroll.currentStep.subscribe(step => currentStep = step);
      this.runPayroll.changeData(++currentStep);
      this.messageEvent.emit('continue-' + currentStep);
    }, (err) => {

    }, () => {

    })


  }
  onNoClick(): void {
  }

  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }

  getAllArrears() {
    this.arrearList = [];
    this.serviceApi.get("/v1/payroll/runPayroll/arrears/" + this.runPayrollId).subscribe(res => {
      this.arrearList = res;
      this.dt.reset();
    }, (err) => {

    }, () => {

    })

  }

  uploadManualArrears() {
    const dialogRef = this.dialog.open(UploadArrearsActiveEmplRunPayrollComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { runPayrollId: this.runPayrollId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.getAllArrears();
          }
          // this.successNotification(result.message);
          else if (result.status === 'Error') {
          }
        }
      }
    });
  }

  updateManualArrear(event: any) {
    const dialogRef = this.dialog.open(UpdateManualArrearComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            console.log(result);
            this.arrearList.forEach(arrear => {
              if (arrear.empCode == result.empCode) {
                arrear.manualArrear = result.message;
              }
            });
            this.arrearList.forEach(arrear => {
              if (arrear.empCode == result.empCode) {
                arrear.totalArrear = arrear.manualArrear + arrear.fixedAllowanceTotal;
              }
            });
          }
          // this.successNotification(result.message);
          else if (result.status === 'Error') {
          }
        }
      }
    });
  }

  viewManualArrear(event: any) {
    console.log(event);
    if (event.fixedAllowanceList.length == 0) {
      return;
    }
    const dialogRef = this.dialog.open(ViewManualArrearComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  viewLOPReversalArrear(event: any) {
    console.log(event);
    if (event.lopReversalfixedAllowanceList.length == 0) {
      return;
    }
    const dialogRef = this.dialog.open(LOPReversalArrearComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

@Component({
  templateUrl: 'arrears-upload-dialog-component.html',
  styleUrls: ['dialog-model.scss']
})
export class UploadArrearsActiveEmplRunPayrollComponent implements OnInit {
  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFilesName: string;
  message: any;
  notificationMsg: any;
  action: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadArrearsActiveEmplRunPayrollComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private uploadService: UploadFileService) {
    console.log('data-->' + data);
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

  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  downloadFormat() {
    this.serviceApi.get("/v1/payroll/runPayroll/download/manual-arrear-sheet/" + this.data.runPayrollId).subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.url);
    })

  }

  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/payroll/runPayroll/upload/manual-arrear/' + this.data.runPayrollId;

    this.uploadService.pushFileToStorage(this.currentFileUpload, url).subscribe(event => {
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        if (event != null) {
          this.message = "Manual Arrear Uploaded Successfully";
          this.action = 'Response';
          this.successNotification(this.message);
          this.close();
        }
      }
    },
      err => {
        console.log('error :::' + err);
      }, () => {

      }
    );
  }

  uploadFormat() {
    $('#uploadFile').click();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
    // console.log(this.selectedFiles.item(0).name);
  }
}


@Component({
  templateUrl: 'view-arrers-breakup.component.html',
  styleUrls: ['dialog-model.scss']
})
export class ViewManualArrearComponent implements OnInit {
  message: any;
  notificationMsg: any;
  action: any;
  manualArrearForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ViewManualArrearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    console.log(data);
    this.manualArrearForm = this.fb.group({
      runPayrollEmployeeDetailsId: [this.data.runPayrollEmployeeDetailsId],
      fixedAllowanceList: this.fb.array([])
    });
    let fixedAllowanceListLength = this.data.fixedAllowanceList.length - 1;
    while (fixedAllowanceListLength >= 0) {
      this.setFixedAllowanceFormArray();
      fixedAllowanceListLength--;
    }
    this.manualArrearForm.controls.fixedAllowanceList.patchValue(this.data.fixedAllowanceList);

  }

  setFixedAllowanceFormArray() {
    let control = <FormArray>this.manualArrearForm.controls.fixedAllowanceList;
    control.push(this.fb.group({
      runPayrollArrearId: [''],
      allowanceName: [''],
      amount: ['', Validators.required]
    }));
  }

  ngOnInit() {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  templateUrl: 'update-manual-arrear.component.html',
  styleUrls: ['dialog-model.scss']
})
export class UpdateManualArrearComponent implements OnInit {
  message: any;
  notificationMsg: any;
  action: any;
  manualArrear: any;
  error: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateManualArrearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    console.log(data);
    this.manualArrear = this.data.manualArrear;

  }
  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate() {
    if (this.manualArrear == null || this.manualArrear == "") {
      return;
    }
    this.action = 'Response';
    this.error = this.manualArrear;
    this.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.data.runPayrollEmployeeDetailsId = this.data.runPayrollEmployeeDetailsId;
    this.dialogRef.close(this.data);

  }

}



@Component({
  templateUrl: 'view-lopreversal-arrers-breakup.component.html',
  styleUrls: ['dialog-model.scss']
})
export class LOPReversalArrearComponent implements OnInit {
  message: any;
  notificationMsg: any;
  action: any;
  arrearForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<LOPReversalArrearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    console.log(data);
    this.arrearForm = this.fb.group({
      runPayrollEmployeeDetailsId: [this.data.runPayrollEmployeeDetailsId],
      fixedAllowanceList: this.fb.array([])
    });
    let fixedAllowanceListLength = this.data.lopReversalfixedAllowanceList.length - 1;
    while (fixedAllowanceListLength >= 0) {
      this.setFixedAllowanceFormArray();
      fixedAllowanceListLength--;
    }
    this.arrearForm.controls.fixedAllowanceList.patchValue(this.data.lopReversalfixedAllowanceList);

  }

  setFixedAllowanceFormArray() {
    let control = <FormArray>this.arrearForm.controls.fixedAllowanceList;
    control.push(this.fb.group({
      runPayrollArrearId: [''],
      allowanceName: [''],
      amount: ['', Validators.required]
    }));
  }

  ngOnInit() {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}