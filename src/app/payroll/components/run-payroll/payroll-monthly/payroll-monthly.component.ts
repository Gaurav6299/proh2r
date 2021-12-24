import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { RunPayroll } from '../../../service/run-payroll.service';
import { ActivatedRoute } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';
import { PendingEmployeesComponent } from './stepper/step1/employee-selection/pending-employees/pending-employees.component';
import { EmployeesOnHoldComponent } from './stepper/step1/employee-selection/employees-on-hold/employees-on-hold.component';
import { ProcessedEmployeesComponent } from './stepper/step1/employee-selection/processed-employees/processed-employees.component';
import { ActiveEmployeeComponent } from './stepper/step2/upload-attendance/active-employee/active-employee.component';
import { LoanAndAdvancesActiveEmployeesComponent } from './stepper/step4/loan-and-advances-active-employees/loan-and-advances-active-employees.component';
import { RunPayrollUploadVariableActiveEmployeeComponent } from './stepper/step3/run-payroll-upload-variable-active-employee/run-payroll-upload-variable-active-employee.component';
import { FlexiBenefitsActiveEmployeeComponent } from './stepper/step6/flexi-benefits-active-employee/flexi-benefits-active-employee.component';
import { Router } from '@angular/router';
import { ItPtActiveEmployeeComponent } from './stepper/step8/it-pt-active-employee/it-pt-active-employee.component';
import { SalaryRegisterComponent } from './stepper/step8/salary-register/salary-register.component';
import { ArrearsActiveEmployeeComponent } from './stepper/step6/arrears-active-employee/arrears-active-employee.component';

@Component({
  selector: 'app-payroll-monthly',
  templateUrl: './payroll-monthly.component.html',
  styleUrls: ['./payroll-monthly.component.scss']
})
export class PayrollMonthlyComponent implements OnInit {
  @ViewChild(PendingEmployeesComponent) tempChild: PendingEmployeesComponent;
  @ViewChild(EmployeesOnHoldComponent) shiftChild: EmployeesOnHoldComponent;
  @ViewChild(ProcessedEmployeesComponent) shiftChild1: ProcessedEmployeesComponent;
  @ViewChild(ActiveEmployeeComponent) step2: ActiveEmployeeComponent;
  @ViewChild(LoanAndAdvancesActiveEmployeesComponent) step4: LoanAndAdvancesActiveEmployeesComponent;
  @ViewChild(FlexiBenefitsActiveEmployeeComponent) step6: FlexiBenefitsActiveEmployeeComponent;
  @ViewChild(ItPtActiveEmployeeComponent) step7: ItPtActiveEmployeeComponent;
  @ViewChild(SalaryRegisterComponent) salaryRegisterComponentChild: SalaryRegisterComponent;
  @ViewChild(RunPayrollUploadVariableActiveEmployeeComponent) step3: RunPayrollUploadVariableActiveEmployeeComponent;
  @ViewChild(ArrearsActiveEmployeeComponent) arrearsActiveEmployeeComponentChild: ArrearsActiveEmployeeComponent;

  currentStep = 0;
  year: number;
  month: string;

  currentTab = 0;
  @ViewChild('stepper') stepper: MatStepper;
  panelFirstWidth: any;
  panelFirstHeight: any;
  tabChanged: any = false;
  runPayrollId: any;
  monthYear: string;

  constructor(
    private runPayroll: RunPayroll,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.runPayroll.currentStep.subscribe(step => this.currentStep = step);

    this.route.params.subscribe(res => {
      this.month = res.month;
      this.year = res.year;
      this.runPayrollId = res.id;
      this.monthYear = this.month + "-" + this.year;
      console.log('year -->' + this.year);
      console.log('month -->' + this.month);
    });
  }
  ngOnInit() {

  }



  onLinkClick(event: MatTabChangeEvent) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
    this.currentTab = event.index;

    console.log(event);
    if (event.index === 0) {
      this.tempChild.getData();
    } else if (event.index === 1) {
      this.shiftChild.getData();
    } else if (event.index === 2) {
      this.shiftChild1.getData();
    }
  }

  onTabChange(event) {
    console.log(event);
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  receiveMessage($event, stepper: MatStepper) {
    // alert();
    console.log('receiveMessage called -->');
    console.log($event);
    let event = $event.split('-');
    let message = event[0];
    let step = +event[1]
    // alert($event);
    if (message == 'continue') {
      if (step == 2) {
        this.step2.getData();
      } else if (step == 3) {
        this.step3.getAllVariables();
      } else if (step == 4) {
        this.step4.getAllLoanAndAdvances();
      } else if (step == 5) {
        // this.arrearsActiveEmployeeComponentChild.getAllArrears();
        this.arrearsActiveEmployeeComponentChild.getArrearDisbursementStatus();
      } else if (step == 6) {
        this.step6.getAllFlexiBenifits();
      } else if (step == 7) {
        this.step7.getallItAndPtData();
      } else if (step == 8) {
        this.salaryRegisterComponentChild.previewSalary();
      }
      this.stepper.next();
    } else {
      if (step == 1) {
        this.tempChild.getData();
      } else if (step == 2) {
        this.step2.getData();
      } else if (step == 3) {
        this.step3.getAllVariables();
      } else if (step == 4) {
        this.step4.getAllLoanAndAdvances();
      } else if (step == 5) {
        // this.arrearsActiveEmployeeComponentChild.getAllArrears();
        this.arrearsActiveEmployeeComponentChild.getArrearDisbursementStatus();
      } else if (step == 6) {
        this.step6.getAllFlexiBenifits();
      } else if (step == 7) {
        this.step7.getallItAndPtData();
      } else if (step == 8) {
        this.salaryRegisterComponentChild.previewSalary();
      }
      this.stepper.previous();
    }

  }

  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }

  // selectedTabChange(event) {
  //   console.log(event);
  //   // if (event.index === 1) {
  //   //   this.tempChild.isLeftVisible = false;
  //   // }
  // }

  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step =>
      currentStep = step);
    // if (currentStep > 1) {
    //   this.runPayroll.changeData(--currentStep);
    // }

    currentStep > 1 ? this.runPayroll.changeData(--currentStep) : this.runPayroll.changeData(1);
  }

}
