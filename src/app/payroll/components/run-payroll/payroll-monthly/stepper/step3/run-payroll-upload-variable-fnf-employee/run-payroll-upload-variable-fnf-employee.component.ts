import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
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
@Component({
  selector: 'app-run-payroll-upload-variable-fnf-employee',
  templateUrl: './run-payroll-upload-variable-fnf-employee.component.html',
  styleUrls: ['./run-payroll-upload-variable-fnf-employee.component.scss']
})
export class RunPayrollUploadVariableFnfEmployeeComponent implements OnInit {
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Total Variable Allowances' },
    { field: '', header: 'Total Variable Deductions' },
    { field: '', header: 'Actions' },
  ];
  selectedRows: any = [];
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private runPayroll: RunPayroll) { }

  ngOnInit() {

  }
  onNoClick(): void {
  }

  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
  }

  onProceed() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(++currentStep);
  }

}

// @Component({
//   templateUrl: 'addEdit-runPayroll-variable-pays-dialog.html',
//   styleUrls: ['dialog-model.scss']
// })
// export class VariablePaysRunPayrollFnfEmpComponent implements OnInit {

//   constructor(private http: Http,
//     private fb: FormBuilder,
//     public dialogRef: MatDialogRef<VariablePaysRunPayrollFnfEmpComponent>,
//     @Inject(MAT_DIALOG_DATA) public data1: any) {
//   }
//   ngOnInit() {

//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

// @Component({
//   templateUrl: 'clear-runPayroll-variable-pays-dialog.html',
//   styleUrls: ['dialog-model.scss']
// })
// export class ClearVariablePaysRunPayrollFnfEmpComponent implements OnInit {

//   constructor(private http: Http,
//     private fb: FormBuilder,
//     public dialogRef: MatDialogRef<ClearVariablePaysRunPayrollFnfEmpComponent>,
//     @Inject(MAT_DIALOG_DATA) public data1: any) {
//   }
//   ngOnInit() {

//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

// ---------------- Start Of Process Offcycle Payements Upload Dailog Model
@Component({
  templateUrl: 'upload-data-variable-pay-component.html',
  styleUrls: ['dialog-model.scss']
})
export class UploadDataRunPayrollVariablePayFnfEmpComponent implements OnInit {

  fileToUpload: File = null;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadDataRunPayrollVariablePayFnfEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}





