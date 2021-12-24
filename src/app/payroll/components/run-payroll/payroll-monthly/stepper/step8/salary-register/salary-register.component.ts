import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-salary-register',
  templateUrl: './salary-register.component.html',
  styleUrls: ['./salary-register.component.scss']
})
export class SalaryRegisterComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();
  salaryRegisterList = [];
  columns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'empCode', header: 'Employee Code' },
    { field: 'totalFixedAllowanceAmount', header: 'Total Fixed Allowances' },
    { field: 'totalOtherBenefitsAmount', header: 'Total Other Benefits' },
    { field: 'totalEmployeeDeductionAmount', header: 'Total Employee Satutory Deductions' },
    { field: 'totalEmployerContributionAmount', header: 'Total Employer Statutory Contributions' },
    { field: 'totalFixedDeductionAmount', header: 'Total Fixed Deductions' },
    { field: 'totalVariableAllowanceAmount', header: 'Total Variable Allowances' },
    { field: 'totalVariableDeductionAmount', header: 'Total Variable Deductions' },
    { field: 'totalLoanAmount', header: 'Total Loans' },
    { field: 'totalAdvanceAmount', header: 'Total Advances' },
    { field: 'totalFlexiBenefitsAmount', header: 'Total Flexi Benefits' },
    { field: 'ctcAmount', header: 'Total CTC' },
    { field: 'totalGrossSalary', header: 'Total Gross Salary' },
    { field: 'totalNetPaymentAmount', header: 'Total Take Home' },
    { field: 'actions', header: 'Actions' },
  ];
  constructor(public dialog: MatDialog, private runPayroll: RunPayroll, private serviceApi: ApiCommonService, private router: Router) { }
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
  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
    this.messageEvent.emit('previous-' + currentStep);
  }
  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }

  onProceed() {

    this.serviceApi.put('/v1/payroll/runPayroll/save/' + this.runPayrollId, {}).subscribe(
      res => {
        this.cancel();
      },
      err => {
      },
      () => { }
    );

  }
  viewSalaryRegisterDialog(event: any) {
    const dialogRef = this.dialog.open(SalaryRegisterDialogComponent, {
      width: '1100px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          if (result.message) {
            this.successNotification(result.message);
          }
        }
      }
    });
  }

  previewSalary() {
    this.salaryRegisterList = [];
    this.serviceApi.get2('/v1/payroll/runPayroll/preview/' + this.runPayrollId).subscribe(
      res => {
        this.salaryRegisterList = res;
      },
      err => {
      },
      () => { }
    );
  }
}

@Component({
  templateUrl: 'salary-register-dialog.html',
  styleUrls: ['salary-register-dialog.scss']
})
export class SalaryRegisterDialogComponent implements OnInit {
  salaryRegisterList = [];
  actions: any;
  error: any;
  message
  title: any;
  grossEarnings: any;
  grossDeductions: any;
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
  constructor(public dialogRef: MatDialogRef<SalaryRegisterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data);
    this.grossDeductions = 0.00;
    this.grossEarnings = 0.00;
    this.data.runPayrollFixedAllowances.forEach(element => {
      this.grossEarnings += element.totalAmount
    });
    this.data.runPayrollOtherBenefits.forEach(element => {
      this.grossEarnings += element.fieldValue
    });
    this.data.runPayrollVariableAllowances.forEach(element => {
      this.grossEarnings += element.fieldValue
    });
    this.data.runPayrollFlexiBenefits.forEach(element => {
      this.grossEarnings += element.fieldValue
    });
    this.grossEarnings += this.data.manualArrearAmount;

    this.data.runPayrollFixedDeductions.forEach(element => {
      this.grossDeductions += element.fieldValue
    });
    this.data.runPayrollEmployeeDeductions.forEach(element => {
      this.grossDeductions += element.totalAmount
    });
    this.data.runPayrollVariableDeductions.forEach(element => {
      this.grossDeductions += element.fieldValue
    });
  }
  ngOnInit() { }

  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}
