import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
@Component({
  selector: 'app-loan-and-advances-fnf-employees',
  templateUrl: './loan-and-advances-fnf-employees.component.html',
  styleUrls: ['./loan-and-advances-fnf-employees.component.scss']
})
export class LoanAndAdvancesFnfEmployeesComponent implements OnInit {
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Total Loans' },
    { field: '', header: 'Total Advances' },
    { field: '', header: 'Actions' },
  ];
  constructor(private http: Http, private runPayroll: RunPayroll) { }
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
  ngOnInit() {
  }

}
