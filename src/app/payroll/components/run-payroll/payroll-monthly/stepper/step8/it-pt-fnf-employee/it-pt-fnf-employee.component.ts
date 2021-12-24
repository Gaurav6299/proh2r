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
import { element } from 'protractor';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
@Component({
  selector: 'app-it-pt-fnf-employee',
  templateUrl: './it-pt-fnf-employee.component.html',
  styleUrls: ['./it-pt-fnf-employee.component.scss']
})
export class ItPtFnfEmployeeComponent implements OnInit {
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Tax Calculation Method' },
    { field: '', header: 'Income Tax Overwrite Amount' },
    { field: '', header: 'Professional Tax Overwrite Amount' },
    { field: '', header: 'Actions' },
  ];
  selectedRows: any = [];
  constructor(private fb: FormBuilder, private http: Http, public dialog: MatDialog, private runPayroll: RunPayroll) {
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
  ngOnInit() {
  }

}

