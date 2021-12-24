import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../services/api-common.service';
declare var $: any;
@Component({
  selector: 'app-flexi-benefits',
  templateUrl: './flexi-benefits.component.html',
  styleUrls: ['./flexi-benefits.component.scss']
})
export class FlexiBenefitsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  @ViewChild('myFlexiBenefitsForm') form;
  dialogHeader: any;
  columns = [
    { field: 'labelName', header: 'Label Name' },
    { field: 'actions', header: 'Actions' },
  ];
  flexiBenefitsForm: FormGroup;
  flexiBenefitsList = [];
  isLeftVisible: any;
  constructor(private serviceApi: ApiCommonService, private fb: FormBuilder, public dialog: MatDialog) {
    this.flexiBenefitsForm = this.fb.group({
      flexiBenefitId: [''],
      labelName: ['', Validators.required]
    });
    this.isLeftVisible = false;
    this.getAllFlexiBenefits();
  }
  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

  getAllFlexiBenefits() {
    this.flexiBenefitsList = [];
    this.serviceApi.get("/v1/payroll-settings/get-all/flexi").subscribe(res => {
      this.flexiBenefitsList = res;
    });
  }
  deleteflexiBenefitsDialog(element: any) {
    console.log(element);
    const dialogRef = this.dialog.open(DeleteFlexiBenefitsDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { flexiBenefitId: element.flexiBenefitId, action: 'delete' }
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
        this.getAllFlexiBenefits();
      }
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

  addflexiBenefits() {
    this.dialogHeader = "Adding Flexi Benefit";
    $('.divtoggleDiv')[1].style.display = 'block';
    this.flexiBenefitsForm.reset();
    this.form.resetForm();
  }
  editFlexiBenefits(element: any) {
    this.flexiBenefitsForm.reset();
    this.isLeftVisible = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.dialogHeader = 'Editing Flexi Benefit';
    this.flexiBenefitsForm.controls.flexiBenefitId.setValue(element.flexiBenefitId);
    this.flexiBenefitsForm.controls.labelName.setValue(element.labelName);
  }

  saveflexiBenefits() {
    if (this.flexiBenefitsForm.valid) {
      this.serviceApi.post("/v1/payroll-settings/save/flexi", this.flexiBenefitsForm.value).subscribe(res => {
        this.getAllFlexiBenefits();
        this.isLeftVisible = false;
        $('.divtoggleDiv')[1].style.display = 'block';
        this.setPanel();
      }, (err) => {

      }, () => {
        this.dt.reset();
      });
    } else {
      Object.keys(this.flexiBenefitsForm.controls).forEach(field => { // {1}
        const control = this.flexiBenefitsForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateFlexiBenefits() {
    if (this.flexiBenefitsForm.valid) {
      this.serviceApi.put("/v1/payroll-settings/update/flexi", this.flexiBenefitsForm.value).subscribe(res => {
        this.dt.reset();
        this.getAllFlexiBenefits();
        this.isLeftVisible = false;
        $('.divtoggleDiv')[1].style.display = 'block';
        this.setPanel();
      }, (err) => {
      }, () => {

      });
    } else {
      Object.keys(this.flexiBenefitsForm.controls).forEach(field => { // {1}
        const control = this.flexiBenefitsForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

}

@Component({
  templateUrl: 'delete-flexi-benfits.component.html',
})
export class DeleteFlexiBenefitsDialogComponent implements OnInit {
  action: any;
  error: any;
  flexiBenefitId: any;
  constructor(private _fb: FormBuilder, public dialogRef: MatDialogRef<DeleteFlexiBenefitsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.flexiBenefitId = data.flexiBenefitId;
  }
  ngOnInit() { }
  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }
  deleteflexiBenefits() {
    this.serviceApi.delete('/v1/payroll-settings/delete/flexi/' + +this.flexiBenefitId).subscribe(
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