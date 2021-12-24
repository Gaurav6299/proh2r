import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTabChangeEvent } from '@angular/material';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { validateConfig } from '@angular/router/src/config';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';

declare var $: any;

@Component({
  selector: 'app-fixed-allowances',
  templateUrl: './fixed-allowances.component.html',
  styleUrls: ['./fixed-allowances.component.scss']
})
export class FixedAllowancesComponent implements OnInit, AfterViewInit {
  action: any;


  readonly = true;
  readwrite = false;
  errorMessage: any;
  @ViewChild('myAllowanceInformationForm') form;
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'allowanceName', header: 'Allowance Name' },
    { field: 'pfEnable', header: 'PF' },
    { field: 'esicEnable', header: 'ESIC' },
    { field: 'lwfEnable', header: 'LWF' },
    { field: 'ptEnable', header: 'PT' },
    { field: 'tdsEnable', header: 'TDS' },
    { field: 'exemptionType', header: 'Exemption Type' },
    { field: 'actions', header: 'Actions' },
  ]

  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;

  showHideAllowanceExemptionField: any;
  showhideExemptionLimit: any;
  updateButton: any;
  saveButton: any;
  backButton: any;
  fixedAllowanceTableData = [];

  formHeader: any;
  isValidFormSubmitted = true;
  requiredTextField;
  notificationMsg: any;

  public allowanceInformationForm: FormGroup;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.getAllFixedAllowanceTableData();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
  }

  ngOnInit() {
    this.allowanceInformationForm = this.fb.group({
      fixedAllowanceId: [],
      allowanceName: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      pfEnable: ['', Validators.required],
      esicEnable: ['', Validators.required],
      lwfEnable: ['', Validators.required],
      ptEnable: ['', Validators.required],
      tdsEnable: ['', Validators.required],
      arrearsEnable: ['', Validators.required],
      arrearCalculationType: [null],
      exemptionType: ['', Validators.required],
      gratuityBase: ['', Validators.required],
      oneTimeTaxEnable: ['', Validators.required],
      isDefault: [''],
      isEffectByAttendance: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
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


  selectArrearEligibility(event: any) {
    this.allowanceInformationForm.controls.arrearCalculationType.clearValidators();
    if (event.value == 'true') {
      this.allowanceInformationForm.controls.arrearCalculationType.setValidators(Validators.required);
      this.allowanceInformationForm.controls.arrearCalculationType.setValue(null);
    } else {
      this.allowanceInformationForm.controls.arrearCalculationType.setValue("NONE");
    }
    this.allowanceInformationForm.controls.arrearCalculationType.updateValueAndValidity();
  }

  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';

      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }

  addFixedAllowance() {
    $('.divtoggleDiv')[1].style.display = 'block';
    console.log('addFixedAllowance is called');
    this.updateButton = false;
    this.backButton = true;
    this.saveButton = true;

    this.formHeader = 'Add New Fixed Allowances';
    this.allowanceInformationForm.reset();
    this.allowanceInformationForm.get('allowanceName').enable();
    this.form.resetForm();
  }

  cancelAddAllowanceForm() {
    this.backButton = false;
  }

  editAllowance(element: any) {
    this.formHeader = 'Edit Fixed Allowances';
    this.isLeftVisible = !this.isLeftVisible;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.allowanceInformationForm.get('allowanceName').enable();
    this.allowanceInformationForm.controls.fixedAllowanceId.setValue(element.fixedAllowanceId);
    this.allowanceInformationForm.controls.allowanceName.setValue(element.allowanceName);
    this.allowanceInformationForm.controls.pfEnable.setValue('' + element.pfEnable);
    this.allowanceInformationForm.controls.esicEnable.setValue('' + element.esicEnable);
    this.allowanceInformationForm.controls.lwfEnable.setValue('' + element.lwfEnable);
    this.allowanceInformationForm.controls.ptEnable.setValue('' + element.ptEnable);
    this.allowanceInformationForm.controls.tdsEnable.setValue('' + element.tdsEnable);
    this.allowanceInformationForm.controls.exemptionType.setValue('' + element.exemptionType);
    this.allowanceInformationForm.controls.oneTimeTaxEnable.setValue('' + element.oneTimeTaxEnable);
    this.allowanceInformationForm.controls.gratuityBase.setValue('' + element.gratuityBase);
    this.allowanceInformationForm.controls.arrearsEnable.setValue('' + element.arrearsEnable);
    this.allowanceInformationForm.controls.isDefault.setValue('' + element.isDefault);
    this.allowanceInformationForm.controls.isEffectByAttendance.setValue('' + element.isEffectByAttendance);
    this.allowanceInformationForm.controls.arrearCalculationType.setValue('' + element.arrearCalculationType);

    this.updateButton = true;
    this.saveButton = false;
  }

  saveFixedAllowanceData() {
    if (this.allowanceInformationForm.valid) {
      this.isValidFormSubmitted = true;
      this.serviceApi.post('/v1/payroll-settings/fixed-allowances', this.allowanceInformationForm.value).subscribe(
        res => {
          this.getAllFixedAllowanceTableData();
          this.successNotification(res.message);
        }, err => {
        }, () => {
          this.isLeftVisible = false;
          this.setPanel();
        }
      );
    } else {
      Object.keys(this.allowanceInformationForm.controls).forEach(field => { // {1}
        const control = this.allowanceInformationForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateFixedAllowanceData() {
    if (this.allowanceInformationForm.valid) {
      this.isValidFormSubmitted = true;
      this.serviceApi.put('/v1/payroll-settings/fixed-allowances/' + +this.allowanceInformationForm.controls.fixedAllowanceId.value, this.allowanceInformationForm.value).subscribe(
        res => {
          this.successNotification(res.message);
          this.getAllFixedAllowanceTableData();
        }, err => {
          console.log('Something Gone Wrong In Update the Fixed Allowance');
        }, () => {
          this.isLeftVisible = false;
          this.setPanel();
        }
      );
    } else {
      Object.keys(this.allowanceInformationForm.controls).forEach(field => { // {1}
        const control = this.allowanceInformationForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  deleteFixedAllowanceData(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(FixedAllowanceDeleteComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { fixedAllowanceId: data.fixedAllowanceId, message: this.errorMessage, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);
          }
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
          }
        }

        this.getAllFixedAllowanceTableData();

      }

    });

  }


  getAllFixedAllowanceTableData() {
    this.fixedAllowanceTableData = [];
    this.serviceApi.get('/v1/payroll-settings/fixed-allowances').subscribe(
      res => {
        if (res != null) {
          this.fixedAllowanceTableData = res;
        }
      }, (err) => {
      }, () => {
        this.dt.reset();
      }
    );
  }
}

@Component({
  templateUrl: 'fixed-allowances-delete.component.html',
  styleUrls: ['delete-dialog-model.scss']
})
export class FixedAllowanceDeleteComponent implements OnInit {
  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<FixedAllowanceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onDelete() {
    const val = this.data.fixedAllowanceId;
    this.serviceApi.delete('/v1/payroll-settings/fixed-allowances/' + +val).subscribe(
      res => {
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {

        this.action = 'Error';
        this.error = err.message;
        this.close();

      }
    );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
