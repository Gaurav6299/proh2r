import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
@Component({
  selector: 'app-run-payroll-complete',
  templateUrl: './run-payroll-complete.component.html',
  styleUrls: ['./run-payroll-complete.component.scss']
})
export class RunPayrollCompleteComponent implements OnInit {

  constructor(private runPayroll: RunPayroll, private router: Router) { }
  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }
  ngOnInit() {
  }

}
