import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, ChangeDetectorRef, ViewChildren, ElementRef, QueryList, Output, EventEmitter } from '@angular/core';
import { RunPayroll } from '../../../../../../service/run-payroll.service';
import { Http } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTable, MatInput } from '@angular/material';
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { RequestOptions } from '@angular/http';
import { DataTable } from 'primeng/primeng';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-loan-and-advances-active-employees',
  templateUrl: './loan-and-advances-active-employees.component.html',
  styleUrls: ['./loan-and-advances-active-employees.component.scss']
})
export class LoanAndAdvancesActiveEmployeesComponent implements OnInit {
  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();
  loansAndAdvances = [];
  @ViewChild("dt1") dt: DataTable;
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

  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'loanCategory', header: 'Loan Category' },
    { field: 'totalEMI', header: 'Total EMI' },
    { field: 'remainingEMI', header: 'Remaining EMI' },
    { field: 'currentMonthAmount', header: 'Amount' },
    { field: 'type', header: 'Type' },
    { field: 'disbursedAmount', header: 'Disbursed Amount' },
    { field: 'status', header: 'Status' },
    { field: 'actions', header: 'Actions' },
  ];


  constructor(private runPayroll: RunPayroll, private serviceApi: ApiCommonService, public dialog: MatDialog, private router: Router) { }

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
    const body = [];
    this.loansAndAdvances.forEach(loansAndAdvance => {
      if (loansAndAdvance.updateType == 'DISBURSEMENT') {
        body.push(
          {
            "employeeLoanDetailsId": loansAndAdvance.employeeLoanDetailsId,
            "totalDisbursedAmount": loansAndAdvance.currentMonthAmount,
            "type": "TOTALDISBURSEDAMOUNT"
          }
        )
      } else if (loansAndAdvance.updateType == 'RECOVERY') {
        body.push(
          {
            "employeeLoanDetailsId": loansAndAdvance.employeeLoanDetailsId,
            "amount": loansAndAdvance.currentMonthAmount,
            "type": "AMOUNT"
          }
        )
      }
    });
    this.serviceApi.put("/v1/loan/loan-advances", body).subscribe(res => {

      let currentStep;
      this.runPayroll.currentStep.subscribe(step => currentStep = step);
      this.runPayroll.changeData(++currentStep);
      this.messageEvent.emit('continue-' + currentStep);
    }, (err) => {

    }, () => {

    })

  }
  onNoClick(): void {
  }
  ngAfterViewInit() {
    console.log(this.runPayrollId);
    this.getAllLoanAndAdvances();
  }

  getAllLoanAndAdvances() {
    this.loansAndAdvances = [];
    this.serviceApi.get("/v1/loan/loan-advances/" + this.runPayrollId).subscribe(res => {
      this.loansAndAdvances = res;
      this.dt.reset();
    }, (err) => {

    }, () => {

    });
  }

  editDisbursedAmount(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(UpdateLoansAndAdvancesDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { event: event, type: "Disbursed" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.loansAndAdvances.forEach(element => {
              if (element.employeeLoanDetailsId == result.employeeLoanDetailsId) {
                element.currentMonthAmount = result.message;
                element.updateType = "DISBURSEMENT";
              }
            });
            // this.successNotification(result.message);
          } else if (result.status === 'Error') {
          }
        }
      }
    });
  }

  editRecoveryAmount(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(UpdateLoansAndAdvancesDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { event: event, type: "Recovery" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.loansAndAdvances.forEach(element => {
              if (element.employeeLoanDetailsId == result.employeeLoanDetailsId) {
                element.currentMonthAmount = result.message;
                element.updateType = "RECOVERY";
              }
            });
            // this.successNotification(result.message);
          } else if (result.status === 'Error') {
          }
        }
      }
    });
  }
}

@Component({
  templateUrl: './update-loans-advances.component.html',
  styleUrls: ['./loan-and-advances-active-employees.component.scss']
})
export class UpdateLoansAndAdvancesDialogComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  action: any;
  error: any;
  dialogHeader: any;
  amount: any;
  employeeLoanDetailsId: any;
  hasError: Boolean;

  constructor(public dialogRef: MatDialogRef<UpdateLoansAndAdvancesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, public dialog: MatDialog) {
    console.log(this.data);
    this.hasError = false;
    if (this.data.type == "Disbursed") {
      this.dialogHeader = "Update Disbursed Amount";
    } else {
      this.dialogHeader = "Update Recovery Amount";
    }
    this.amount = this.data.event.currentMonthAmount;


  }

  onSubmitRequest() {
    if (this.amount == null) {
      this.hasError = true;
      return;
    }
    this.action = 'Response';
    this.error = this.amount;
    this.employeeLoanDetailsId = this.data.event.employeeLoanDetailsId;
    this.close();
  }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.data.employeeLoanDetailsId = this.employeeLoanDetailsId;
    this.dialogRef.close(this.data);

  }


}
