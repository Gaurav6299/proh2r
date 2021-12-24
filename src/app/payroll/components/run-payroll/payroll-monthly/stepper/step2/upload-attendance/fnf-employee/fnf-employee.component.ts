import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
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
import { RunPayroll } from '../../../../../../../service/run-payroll.service';
@Component({
  selector: 'app-fnf-employee',
  templateUrl: './fnf-employee.component.html',
  styleUrls: ['./fnf-employee.component.scss']
})
export class FnfEmployeeComponent implements OnInit, AfterViewInit {
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Total Days' },
    { field: '', header: 'LOP Days' },
    { field: '', header: 'Payable Days' },
    { field: '', header: 'Actions' },
  ];
  selectedRows: any = [];
  @Output() stepEvent = new EventEmitter<string>();
  selection = new SelectionModel<Element>(true, []);
  constructor(private runPayroll: RunPayroll) { }
  ngOnInit() { }
  ngAfterViewInit() { }
  onNoClick(): void { }
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

  onClickEditAttendanceDialog() {
  }

}
