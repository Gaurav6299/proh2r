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
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { environment } from '../../../../../../../../environments/environment';
import { UploadFileService } from '../../../../../../../services/UploadFileService.service';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-run-payroll-upload-variable-active-employee',
  templateUrl: './run-payroll-upload-variable-active-employee.component.html',
  styleUrls: ['./run-payroll-upload-variable-active-employee.component.scss']
})
export class RunPayrollUploadVariableActiveEmployeeComponent implements OnInit, AfterViewInit {
  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();
  variablesList = [];
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'totalVariableAllAmnt', header: 'Total Variable Allowances' },
    { field: 'totalVariableDedAmnt', header: 'Total Variable Deductions' },
    { field: 'actions', header: 'Actions' },
  ];
  selectedRows: any = [];

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
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private runPayroll: RunPayroll, private serviceApi: ApiCommonService, private router: Router) { }

  ngOnInit() { }
  ngAfterViewInit() {
  }
  onNoClick(): void {
  }

  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }

  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
    this.messageEvent.emit('previous-' + currentStep);
  }

  onProceed() {
    this.serviceApi.put("/v1/payroll/runPayroll/save/variables/" + this.runPayrollId, this.variablesList).subscribe(res => {
      let currentStep;
      this.runPayroll.currentStep.subscribe(step => currentStep = step);
      this.runPayroll.changeData(++currentStep);
      this.messageEvent.emit('continue-' + currentStep);
    }, (err) => {

    }, () => {

    })
  }

  getAllVariables() {
    this.variablesList = [];
    this.serviceApi.get("/v1/payroll/runPayroll/get/variables/" + this.runPayrollId).subscribe(res => {
      this.variablesList = res;
      this.dt.reset();
    }, (err) => {

    }, () => {

    })

  }

  updateVariable(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(VariablePaysRunPayrollActiveEmpComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { event: event, runPayrollId: this.runPayrollId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.variablesList.forEach(variable => {
              if (variable.empCode == result.empCode) {
                variable.variableAllowances = result.message.variableAllowances;
                variable.variableDeductions = result.message.variableDeductions
              }
            });
            this.variablesList.forEach(variable => {
              if (variable.empCode == result.empCode) {
                var totalVariableAllAmnt = 0;
                variable.variableAllowances.forEach(element => {
                  totalVariableAllAmnt += element.value;
                });
                var totalVariableDedAmnt = 0;
                variable.variableDeductions.forEach(element => {
                  totalVariableDedAmnt += element.value;
                });
                variable.totalVariableAllAmnt = totalVariableAllAmnt;
                variable.totalVariableDedAmnt = totalVariableDedAmnt;
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

  uploadVariables() {
    const dialogRef = this.dialog.open(UploadDataRunPayrollVariablePayActiveEmpComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { runPayrollId: this.runPayrollId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.getAllVariables();
          }
          // this.successNotification(result.message);
          else if (result.status === 'Error') {
          }
        }
      }
    });
  }

}

@Component({
  templateUrl: 'addEdit-runPayroll-variable-pays-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class VariablePaysRunPayrollActiveEmpComponent implements OnInit {
  variablePaysForm: FormGroup;
  dynamicFileds = [];
  i = 0;
  action: any;
  error: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<VariablePaysRunPayrollActiveEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
    this.variablePaysForm = this.fb.group({
      runPayrollId: [this.data.runPayrollId],
      variableAllowances: this.fb.array([]),
      variableDeductions: this.fb.array([])
    });
    let variableAllowancesLength = this.data.event.variableAllowances.length - 1;
    let variableDeductionsLength = this.data.event.variableDeductions.length - 1;
    while (variableAllowancesLength >= 0) {
      this.getVariableAllowanceFormArray();
      variableAllowancesLength--;
    }
    while (variableDeductionsLength >= 0) {
      this.getVariableDeductionsFormArray();
      variableDeductionsLength--;
    }
    this.variablePaysForm.controls.variableAllowances.patchValue(this.data.event.variableAllowances);
    this.variablePaysForm.controls.variableDeductions.patchValue(this.data.event.variableDeductions);
  }

  getVariableAllowanceFormArray() {
    let control = <FormArray>this.variablePaysForm.controls.variableAllowances;
    control.push(this.fb.group({
      variableAllowanceId: [''],
      labelName: [''],
      value: ['', Validators.required]
    }));
  }

  getVariableDeductionsFormArray() {
    let control = <FormArray>this.variablePaysForm.controls.variableDeductions;
    control.push(this.fb.group({
      variableDeductionId: [''],
      labelName: [''],
      value: ['', Validators.required]
    }));
  }

  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate() {
    if (!this.variablePaysForm.valid) {
      return;
    }
    this.action = 'Response';
    this.error = this.variablePaysForm.value;
    this.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.data.empCode = this.data.event.empCode;
    this.dialogRef.close(this.data);

  }
}

@Component({
  templateUrl: 'clear-runPayroll-variable-pays-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class ClearVariablePaysRunPayrollActiveEmpComponent implements OnInit {
  offcycleVariablePaysForm: FormGroup;
  dynamicFileds = [];
  i = 0;
  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClearVariablePaysRunPayrollActiveEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any) {
    console.log('data-->' + data1);
    this.offcycleVariablePaysForm = this.fb.group({
      fieldMaster: this.fb.array([
      ])
    });

    const headers = new Headers({
      // 'Authorization': 'Bearer ' + bearerData,
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({ headers: headers });
    // const body = new URLSearchParams();
    //    this.http.get(this.baseUrl + '/v1/organization/employeefields/section', options).subscribe(
    this.http.get('assets/data/processPayroll/customFields.json', options).map(res => res.json()).subscribe(
      // tslint:disable-next-line:max-line-length
      // this.http.get(this.baseUrl + '/v1/organization/allFieldBySectionName/Basic Information', options).subscribe(
      res => {
        console.log('res -->' + res);
        res.forEach(element1 => {
          console.log('element -->' + element1);
          this.dynamicFileds.push(element1);
        });
        this.dynamicFileds.forEach(data => {
          console.log('sectionName -->' + data.sectionName);
          if (data.employeeProfileLocation === 'Variable Pays') {
            const control = <FormArray>this.offcycleVariablePaysForm.controls['fieldMaster'];
            control.push(
              this.fb.group({
                sectionId: [data.sectionId],
                sectionName: [data.sectionName],
                sectionLocation: [data.employeeProfileLocation],
                accessLevel: [data.accessLevel],
                editable: [false],
                fields: this.fb.array([
                ]),
              })
            );
            data.fields.forEach(fieldsData => {
              this.initFieldMaster(this.i, fieldsData);
            });
            this.i++;
          }
        });
      },
      error => {
        console.log('err -->' + error);
      }
    );
  }

  get fieldMaster(): FormArray {
    return this.offcycleVariablePaysForm.get('fieldMaster') as FormArray;
  }

  initFieldMaster(i: any, fieldsData: any) {
    console.log('i-->' + i);
    console.log('fieldName -->' + fieldsData.fieldName);
    const control = (<FormArray>this.offcycleVariablePaysForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
    control.push(
      this.fb.group({
        fieldId: [fieldsData.fieldId],
        fieldName: [fieldsData.fieldName],
        fieldPlaceholderValue: ['Enter Text'],
        fieldValue: [fieldsData.fieldValue],
        fieldDescription: [fieldsData.fieldDescription],
        fieldType: [fieldsData.fieldType],
        accessLevel: [fieldsData.accessLevel],
        includeInOnboarding: [fieldsData.includeInOnboarding],
        default: [fieldsData.default],
        sensitive: [fieldsData.sensitive],
        options: [fieldsData.options],
        mandatory: [fieldsData.mandatory],
      })
    );

  }


  ngOnInit() {

  }




  onNoClick(): void {
    this.dialogRef.close();
  }



}

@Component({
  templateUrl: 'upload-data-variable-pay-component.html',
  styleUrls: ['dialog-model.scss']
})
export class UploadDataRunPayrollVariablePayActiveEmpComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFilesName: string;
  message: any;
  notificationMsg: any;
  action: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadDataRunPayrollVariablePayActiveEmpComponent>,
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
    this.serviceApi.get("/v1/payroll/runPayroll/download/variablesheet/" + this.data.runPayrollId).subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.url);
    })

  }

  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/payroll/runPayroll/upload/variables/' + this.data.runPayrollId;

    this.uploadService.pushFileToStorage(this.currentFileUpload, url).subscribe(event => {
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        if (event != null) {
          this.message = "Variables Uploaded Successfully";
          this.action = 'Response';
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


