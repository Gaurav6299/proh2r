import { Component, OnInit } from '@angular/core';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
import { Http } from '@angular/http';
@Component({
  selector: 'app-encashment-and-recovery-fnf-employees',
  templateUrl: './encashment-and-recovery-fnf-employees.component.html',
  styleUrls: ['./encashment-and-recovery-fnf-employees.component.scss']
})
export class EncashmentAndRecoveryFnfEmployeesComponent implements OnInit {
  columns = [
    { field: '', header: 'Employee Code' },
    { field: '', header: 'Employee Name' },
    { field: '', header: 'Leave Encashment/Recovery' },
    { field: '', header: 'Notice Period Recovery' },
    { field: '', header: 'Gratuity' },
    { field: '', header: 'Actions' },
  ];
  constructor(private http: Http, private runPayroll: RunPayroll) { }

  ngOnInit() {
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
  onNoClick(): void {
  }
}
