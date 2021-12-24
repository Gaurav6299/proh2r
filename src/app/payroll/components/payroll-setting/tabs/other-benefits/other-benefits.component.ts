import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Inject } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-other-benefits',
  templateUrl: './other-benefits.component.html',
  styleUrls: ['./other-benefits.component.scss']
})
export class OtherBenefitsComponent implements OnInit {

  columns = [
    { field: 'labelName', header: 'Custom Label' },
    { field: 'actions', header: 'Actions' },
  ]
  dialogHeader: any;
  @ViewChild('myOtherBenefitsForm') form;
  @ViewChild("dt1") dt: DataTable;
  otherBenefitsForm: FormGroup;
  otherBenefitsList = [];
  isLeftVisible: any;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.otherBenefitsForm = this.fb.group({
      isAttendanceEffected: ['', Validators.required],
      benefitId: [''],
      labelName: ['', Validators.required]
    })
    this.isLeftVisible = false;
    this.getAllOtherBenefits();
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

  addOtherBenefits() {
    this.dialogHeader = "Adding Other Benefit";
    $('.divtoggleDiv')[1].style.display = 'block';
    this.otherBenefitsForm.reset();
    this.form.resetForm();
  }

  editOtherBenefits(element: any) {
    this.otherBenefitsForm.reset();
    this.isLeftVisible = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.dialogHeader = 'Editing Other Benefit';
    this.otherBenefitsForm.controls.benefitId.setValue(element.benefitId);
    this.otherBenefitsForm.controls.labelName.setValue(element.labelName);
    this.otherBenefitsForm.controls.isAttendanceEffected.setValue(element.isAttendanceEffected + "");
  }

  saveOtherBenefits() {
    if (this.otherBenefitsForm.valid) {
      this.serviceApi.post("/v1/payroll-settings/add/benefits", this.otherBenefitsForm.value).subscribe(res => {
        this.getAllOtherBenefits();
        this.isLeftVisible = false;
        $('.divtoggleDiv')[1].style.display = 'block';
        this.setPanel();
      }, (err) => {

      }, () => {
        this.dt.reset();
      });
    } else {
      Object.keys(this.otherBenefitsForm.controls).forEach(field => { // {1}
        const control = this.otherBenefitsForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  getAllOtherBenefits() {
    this.otherBenefitsList = [];
    this.serviceApi.get("/v1/payroll-settings/get-all/benfits").subscribe(res => {
      this.otherBenefitsList = res;
    });
  }

  updateOtherBenefits() {
    if (this.otherBenefitsForm.valid) {
      this.serviceApi.put("/v1/payroll-settings/update/benefits", this.otherBenefitsForm.value).subscribe(res => {
        this.dt.reset();
        this.getAllOtherBenefits();
        this.isLeftVisible = false;
        $('.divtoggleDiv')[1].style.display = 'block';
        this.setPanel();
      }, (err) => {

      }, () => {

      });
    } else {
      Object.keys(this.otherBenefitsForm.controls).forEach(field => { // {1}
        const control = this.otherBenefitsForm.get(field);            // {2}
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


  deleteOtherBenefits(element: any) {
    console.log(element);
    const dialogRef = this.dialog.open(DeleteOtherBenefitsDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { benefitId: element.benefitId, action: 'delete' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
          } else if (result.status === 'Error') {
          }
        }

        this.getAllOtherBenefits();
      }
    });

  }

}

@Component({
  selector: 'app-delete-other-deductions-dialog',
  templateUrl: 'delete-other-deductions.component.html',
  styleUrls: ['./other-benefit-dialog.component.scss']
})
export class DeleteOtherBenefitsDialogComponent implements OnInit {
  action: any;
  error: any;
  fixedDeductionDialog: FormGroup;
  dialogHeader: any;
  requiredTextField;
  isValidFormSubmitted = true;
  benefitId: any;
  paragraphData: 'What would you want to call this deduction? *';
  constructor(private _fb: FormBuilder, public dialogRef: MatDialogRef<DeleteOtherBenefitsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.benefitId = data.benefitId;
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
    this.serviceApi.delete('/v1/payroll-settings/delete/benefit/' + +this.benefitId).subscribe(
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

