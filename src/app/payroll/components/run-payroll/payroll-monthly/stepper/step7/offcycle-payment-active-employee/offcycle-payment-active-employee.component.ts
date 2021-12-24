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
@Component({
  selector: 'app-offcycle-payment-active-employee',
  templateUrl: './offcycle-payment-active-employee.component.html',
  styleUrls: ['./offcycle-payment-active-employee.component.scss']
})
export class OffcyclePaymentActiveEmployeeComponent implements OnInit {
  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Total Variable Allowances' },
    { field: '', header: 'Total Variable Deductions' },
  ];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private runPayroll: RunPayroll) { }

  ngOnInit() { }
  onNoClick(): void {
  }

  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
    this.messageEvent.emit('previous-' + currentStep);
  }
  onProceed() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(++currentStep);
    this.messageEvent.emit('continue-' + currentStep);
  }
}


