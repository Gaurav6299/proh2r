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
  selector: 'app-arrears-fnf-employee',
  templateUrl: './arrears-fnf-employee.component.html',
  styleUrls: ['./arrears-fnf-employee.component.scss']
})
export class ArrearsFnfEmployeeComponent implements OnInit {
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Manual Arrears' },
    { field: '', header: 'Arrear Days' },
    { field: '', header: 'Salary Revision Arrears' },
    { field: '', header: 'Actions' },
  ];
  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private http: Http, private runPayroll: RunPayroll) {
  }

  ngOnInit() { }

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
  onNoClick(): void {
  }
}

@Component({
  templateUrl: 'arrears-upload-dialog-component.html',
  styleUrls: ['dialog-model.scss']
})
export class UploadArrearsFnfEmplRunPayrollComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadArrearsFnfEmplRunPayrollComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

