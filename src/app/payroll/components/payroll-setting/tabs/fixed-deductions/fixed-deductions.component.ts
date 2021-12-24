import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { element } from 'protractor';
import { Jsonp } from '@angular/http/src/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-fixed-deductions',
  templateUrl: './fixed-deductions.component.html',
  styleUrls: ['./fixed-deductions.component.scss']
})
export class FixedDeductionsComponent implements OnInit {
  deductionList = [];
  errorMessage: any;
  action: any;
  panelFirstWidth: any;
  panelFirstHeight: any;
  error: any;
  isValidFormSubmitted = true;
  requiredTextField;
  notificationMsg: any;
  isLeftVisible: any;
  fixedDeductionDialog: FormGroup;
  dialogHeader: any;
  @ViewChild('myFixedDeductionDialog') form;
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'labelName', header: 'Deduction Name' },
    { field: 'actions', header: 'Actions' },
  ]
  constructor(private fb: FormBuilder, private http: Http, public dialog: MatDialog, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.getAllFixedDeductions();
    const rolesArr = KeycloakService.getUserRole();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));

    this.fixedDeductionDialog = this.fb.group({
      deductionid: [],
      labelName: [null, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      isAttendanceEffected: ['', Validators.required]
    });
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
  ngOnInit(): void {
  }
  getAllFixedDeductions() {
    this.setPanel();
    this.deductionList = [];
    this.serviceApi.get('/v1/payroll-settings/get-all/deductions').subscribe(
      res => {
        if (res !== null) {
          res.forEach(element1 => {
            this.deductionList.push({
              deductionid: element1.deductionid,
              labelName: element1.labelName,
              isAttendanceEffected: element1.isAttendanceEffected
            });
          });

        } else {
          console.log('Data not exist');
        }
        console.log(JSON.stringify(res));
      }, (err) => {
      }, () => {
        this.dt.reset();
      }
    );
  }

  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }
  addDeduction() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.fixedDeductionDialog.reset();
    this.dialogHeader = 'Add New Fixed Deduction';
    this.form.resetForm();
  }

  editDeduction(element: any) {
    this.isLeftVisible = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.dialogHeader = 'Edit Fixed Deduction';
    this.fixedDeductionDialog.controls.deductionid.setValue(element.deductionid);
    this.fixedDeductionDialog.controls.labelName.setValue(element.labelName);
    this.fixedDeductionDialog.controls.isAttendanceEffected.setValue('' + element.isAttendanceEffected)
  }

  saveFixedDeductionData() {
    if (this.fixedDeductionDialog.valid) {
      this.isValidFormSubmitted = true;
      this.serviceApi.post('/v1/payroll-settings/add/deductions', this.fixedDeductionDialog.value).subscribe(
        res => {
          this.action = 'Response';
          this.successNotification(res.message);
        }, error => {
          this.action = 'Error';
          this.error = error.message;
        }, () => {
          this.getAllFixedDeductions();
          this.isLeftVisible = false;
          $('.divtoggleDiv')[1].style.display = 'block';
          this.setPanel();
        }
      );
    } else {
      Object.keys(this.fixedDeductionDialog.controls).forEach(field => { // {1}
        const control = this.fixedDeductionDialog.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateFixedDeductionData() {
    if (this.fixedDeductionDialog.valid) {
      this.isValidFormSubmitted = true;
      this.serviceApi.put('/v1/payroll-settings/update/deductions', this.fixedDeductionDialog.value).subscribe(
        res => {
          this.action = 'Response';
          this.successNotification(res.message);
        }, error => {
          this.action = 'Error';
          this.error = error.message;
        }, () => {
          this.getAllFixedDeductions();
          this.isLeftVisible = false;
          $('.divtoggleDiv')[1].style.display = 'block';
          this.setPanel();
        }
      );
    } else {
      Object.keys(this.fixedDeductionDialog.controls).forEach(field => { // {1}
        const control = this.fixedDeductionDialog.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  deleteDeduction(element: any) {
      const dialogRef = this.dialog.open(FixedDeductionsDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { deductionid: element.deductionid, action: 'delete', message: this.errorMessage, status: this.action }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
            } else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }

          this.getAllFixedDeductions();
        }
        console.log('The dialog was closed');
      });
  }
}

@Component({
  selector: 'app-fixed-deductions-dialog',
  templateUrl: 'fixed-deductions-dialog.component.html',
  styleUrls: ['./fixed-deductions-dialog.component.scss']
})
export class FixedDeductionsDialogComponent implements OnInit {
  action: any;
  error: any;
  fixedDeductionDialog: FormGroup;
  dialogHeader: any;
  requiredTextField;
  isValidFormSubmitted = true;
  deductionId: any;
  paragraphData: 'What would you want to call this deduction? *';
  constructor(private _fb: FormBuilder, public dialogRef: MatDialogRef<FixedDeductionsDialogComponent>,
    private http: Http, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    console.log(data);
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.deductionId = data.deductionid;


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
  deleteDeduction() {
    this.serviceApi.delete('/v1/payroll-settings/delete/deductions/' + +this.deductionId).subscribe(
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
