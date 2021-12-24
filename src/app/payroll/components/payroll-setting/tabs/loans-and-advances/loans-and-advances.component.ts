import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Inject } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-loans-and-advances',
  templateUrl: './loans-and-advances.component.html',
  styleUrls: ['./loans-and-advances.component.scss']
})
export class LoansAndAdvancesComponent implements OnInit {
  columns = [
    // { field: 'loanAndAdvanceType', header: 'Type' },
    { field: 'categoryLabel', header: 'Label' },
    { field: 'actions', header: 'Actions' },
  ]
  dialogHeader: any;
  @ViewChild('myLoansAndAdvancesForm') form;
  @ViewChild("dt1") dt: DataTable;
  loansAndAdvancesForm: FormGroup;
  loansAndAdvancesList = [];
  isLeftVisible: any;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.loansAndAdvancesForm = this.fb.group({
      loanCategoryId: [''],
      categoryLabel: ['', Validators.required]
    })
    this.isLeftVisible = false;
    this.getAllLoansAndAdvances();
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

  addLoansAndAdvances() {
    this.dialogHeader = "Add New Category";
    $('.divtoggleDiv')[1].style.display = 'block';
    this.loansAndAdvancesForm.reset();
    this.form.resetForm();
  }

  editLoansAndAdvances(element: any) {
    this.loansAndAdvancesForm.reset();
    this.isLeftVisible = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.dialogHeader = 'Edit Category';

    this.loansAndAdvancesForm.controls.categoryLabel.setValue(element.categoryLabel);
    this.loansAndAdvancesForm.controls.loanCategoryId.setValue(element.loanCategoryId);
  }

  saveLoansAndAdvances() {
    if (this.loansAndAdvancesForm.valid) {
      const body = {
        "categoryLabel": this.loansAndAdvancesForm.controls.categoryLabel.value
      }
      this.serviceApi.post("/v1/loan/loan-category", body).subscribe(res => {
        this.getAllLoansAndAdvances();
        this.isLeftVisible = false;
        $('.divtoggleDiv')[1].style.display = 'block';
        this.setPanel();
      }, (err) => {

      }, () => {
        this.dt.reset();
      });
    } else {
      Object.keys(this.loansAndAdvancesForm.controls).forEach(field => { // {1}
        const control = this.loansAndAdvancesForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  getAllLoansAndAdvances() {
    this.loansAndAdvancesList = [];
    this.serviceApi.get("/v1/loan/loan-category").subscribe(res => {
      this.loansAndAdvancesList = res;
    });
  }

  updateLoansAndAdvances() {
    if (this.loansAndAdvancesForm.valid) {
      const body = {
        "categoryLabel": this.loansAndAdvancesForm.controls.categoryLabel.value,
      }
      this.serviceApi.put("/v1/loan/loan-category/" + this.loansAndAdvancesForm.controls.loanCategoryId.value, body).subscribe(res => {
        this.dt.reset();
        this.getAllLoansAndAdvances();
        this.isLeftVisible = false;
        $('.divtoggleDiv')[1].style.display = 'block';
        this.setPanel();
      }, (err) => {

      }, () => {

      });
    } else {
      Object.keys(this.loansAndAdvancesForm.controls).forEach(field => { // {1}
        const control = this.loansAndAdvancesForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }



  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
      // $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }


  deleteLoansAndAdvances(element: any) {
    const dialogRef = this.dialog.open(DeleteLoansAdvancesDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { loanCategoryId: element.loanCategoryId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.getAllLoansAndAdvances();
            this.successNotification(result.message);
          } else if (result.status === 'Error') {
          }
        }


      }
    });

  }

}

@Component({
  selector: 'app-delete-loans-advances-dialog',
  templateUrl: 'delete-loans-advances.component.html',
  styleUrls: ['./delete-loans-advances-dialog.component.scss']
})
export class DeleteLoansAdvancesDialogComponent implements OnInit {
  action: any;
  error: any;
  fixedDeductionDialog: FormGroup;
  dialogHeader: any;
  requiredTextField;
  isValidFormSubmitted = true;
  loanCategoryId: any;
  paragraphData: 'What would you want to call this deduction? *';
  constructor(private _fb: FormBuilder, public dialogRef: MatDialogRef<DeleteLoansAdvancesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.loanCategoryId = data.loanCategoryId;
  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }
  deleteOtherBenefits() {
    this.serviceApi.delete('/v1/loan/loan-category/' + +this.loanCategoryId).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, error => {
        this.action = 'Error';
        this.error = error.message;
        this.close();
      }
    );
  }

}


