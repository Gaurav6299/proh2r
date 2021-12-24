import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  displayedColumns = ['loanCategoryLabel', 'totalEMI', 'totalDisbursementAmount', 'totalDisbursedAmount', 'loanStatus', 'actions'];
  loanApplications = [];
  empCode: any;
  dataSource = new MatTableDataSource<any>();
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private route: ActivatedRoute, private router: Router) {

    this.route.params.subscribe(res => {
      this.empCode = res.id;
      this.getAllLoanApplications();
    });
  }

  ngOnInit() {
  }

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

  getAllLoanApplications() {
    this.loanApplications = [];
    this.serviceApi.get("/v1/loan/loan-application/" + this.empCode).subscribe(res => {
      this.loanApplications = res;
    }, (err) => {

    }, () => {
      this.dataSource = new MatTableDataSource(this.loanApplications);
    });
  }

  addLoanApplication() {
    const dialogRef = this.dialog.open(ApplyUpdateLoanComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', empCode: this.empCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        if (result.action == 'Response') {
          this.successNotification(result.message);
          this.getAllLoanApplications();
        }
      }
    });
  }

  updateLoanDetails(event: any) {
    const dialogRef = this.dialog.open(ApplyUpdateLoanComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', empCode: this.empCode, details: event }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        if (result.action == 'Response') {
          this.successNotification(result.message);
          this.getAllLoanApplications();
        }
      }
    });
  }

  viewLoanDetails(event: any) {
    const dialogRef = this.dialog.open(ApplyUpdateLoanComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'view', details: event }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  deleteRecord(loanApplicationId: any) {
    const dialogRef = this.dialog.open(DeleteLoanComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { loanApplicationId: loanApplicationId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.action == 'Response') {
          this.successNotification(result.message);
          this.getAllLoanApplications();
        }
      }
    });
  }

}

@Component({
  templateUrl: './apply-update-loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class ApplyUpdateLoanComponent implements OnInit {
  error: any;
  message: any;
  loanCategories = [];
  emiOptions = [];
  empCode: any;
  action: any;
  title: any;
  loanApplication: FormGroup;
  constructor(public dialogRef: MatDialogRef<ApplyUpdateLoanComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    this.title = this.data.title;
    this.empCode = this.data.empCode

    this.loanApplication = this._fb.group({
      loanApplicationId: [''],
      empCode: [this.empCode, Validators.required],
      loanCategoryId: [null, Validators.required],
      loanCategoryLabel: [''],
      totalDisbursementAmount: [null, Validators.required],
      totalDisbursedAmount: [''],
      remainingAmount: [''],
      totalEMI: [null, Validators.required],
      remainingEMI: [''],
      loanStatus: ['']
    });


    if (this.action === 'add') {
      this.title = "Apply Loan/Advance";
    } else if (this.action === 'view') {
      this.title = "Loan/Advance Details";
      this.loanApplication.controls.loanCategoryLabel.setValue(this.data.details.loanCategoryLabel);
      this.loanApplication.controls.loanStatus.setValue(this.data.details.loanStatus);
      this.loanApplication.controls.remainingAmount.setValue(this.data.details.remainingAmount);
      this.loanApplication.controls.remainingEMI.setValue(this.data.details.remainingEMI);
      this.loanApplication.controls.totalDisbursedAmount.setValue(this.data.details.totalDisbursedAmount);
      this.loanApplication.controls.totalDisbursementAmount.setValue(this.data.details.totalDisbursementAmount);
      this.loanApplication.controls.totalEMI.setValue(this.data.details.totalEMI);
    }
    else if (this.action == 'update') {
      this.title = "Update Loan/Advance";
      this.loanApplication.controls.loanApplicationId.setValue(this.data.details.loanApplicationId);
      this.loanApplication.controls.loanCategoryId.setValue(this.data.details.loanCategoryId);
      this.loanApplication.controls.totalDisbursementAmount.setValue(this.data.details.totalDisbursementAmount);
      this.loanApplication.controls.totalEMI.setValue(this.data.details.totalEMI);
    }
    for (var i = 1; i <= 120; i++) {
      const emiAmount = (Math.round((this.loanApplication.get('totalDisbursementAmount').value / i)*100)/100).toFixed(2)
      this.emiOptions.push({
        viewValue: i + ' - ' + emiAmount + '/month',
        value: i
      });
    }

    if (this.loanApplication.get('totalDisbursementAmount').invalid) {
      this.loanApplication.get('totalEMI').reset()
      this.loanApplication.get('totalEMI').disable()
    }
    else this.loanApplication.get('totalEMI').enable()
    this.getAllLoansAndAdvances();
  }

  onChangeDisbursementAmount() {
    this.emiOptions = [];
    if (this.loanApplication.get('totalDisbursementAmount').invalid) {
      this.loanApplication.get('totalEMI').reset()
      this.loanApplication.get('totalEMI').disable();
    }
    else this.loanApplication.get('totalEMI').enable()
    for (var i = 1; i <= 120; i++) {
      const emiAmount = (Math.round((this.loanApplication.get('totalDisbursementAmount').value / i)*100)/100).toFixed(2)
      this.emiOptions.push({
        viewValue: i + ' - ' + emiAmount + '/month',
        value: i
      });
    }
  }

  getAllLoansAndAdvances() {
    this.loanCategories = [];
    this.serviceApi.get("/v1/loan/loan-category").subscribe(res => {
      this.loanCategories = res;
    });
  }

  ngOnInit() {
  }

  applyLoan() {
    if (this.loanApplication.valid) {
      const body = {
        "empCode": this.loanApplication.controls.empCode.value,
        "loanCategoryId": this.loanApplication.controls.loanCategoryId.value,
        "totalDisbursementAmount": this.loanApplication.controls.totalDisbursementAmount.value,
        "totalEMI": this.loanApplication.controls.totalEMI.value,
      }
      this.serviceApi.post("/v1/loan/loan-application", body).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.loanApplication.controls).forEach(field => {
        const control = this.loanApplication.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  close(): void {
    this.data.message = this.message;
    this.data.action = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  updateLoan() {
    if (this.loanApplication.valid) {
      const body = {
        "empCode": this.loanApplication.controls.empCode.value,
        "loanCategoryId": this.loanApplication.controls.loanCategoryId.value,
        "totalDisbursementAmount": this.loanApplication.controls.totalDisbursementAmount.value,
        "totalEMI": this.loanApplication.controls.totalEMI.value,
      }
      this.serviceApi.put("/v1/loan/loan-application/" + +this.loanApplication.controls.loanApplicationId.value, body).subscribe(res => {
        this.action = 'Response';
        this.message = res.message;
        this.close();
      }, (err) => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      });
    } else {
      Object.keys(this.loanApplication.controls).forEach(field => {
        const control = this.loanApplication.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }


}



@Component({
  templateUrl: './delete-loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class DeleteLoanComponent implements OnInit {
  error: any;
  message: any;
  empCode: any;
  action: any;
  loanApplicationId: any;

  constructor(public dialogRef: MatDialogRef<DeleteLoanComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.loanApplicationId = this.data.loanApplicationId;

  }

  ngOnInit() {
  }

  close(): void {
    this.data.message = this.message;
    this.data.action = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  onDelete() {
    this.serviceApi.delete("/v1/loan/loan-application/" + this.loanApplicationId).subscribe(res => {
      this.action = 'Response';
      this.message = res.message;
      this.close();
    }, (err) => {
      this.action = 'Error';
      this.error = err.message;
      this.close();
    }, () => {

    });
  }
}
