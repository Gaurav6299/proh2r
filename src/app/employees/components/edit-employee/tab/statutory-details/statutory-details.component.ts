import { Component, OnInit, Input, Output, EventEmitter, Inject, } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { AddEmployeeService } from '../../../../services/add-employee/add-employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';

declare var $: any;
@Component({
  selector: 'app-statutory-details',
  templateUrl: './statutory-details.component.html',
  styleUrls: ['./statutory-details.component.scss']
})
export class StatutoryDetailsComponent implements OnInit {
  @Input() currentTab: string;
  @Output() currentTabEvent = new EventEmitter<string>();
  public satutoryDetails: FormGroup;
  isValidFormSubmitted = true;
  dataCollectedValue = [];
  empCode: string;
  readonly = true;
  readwrite = false;
  lwfStates = [];
  ptStates = [];
  lwfStatesName: any;
  ptStatesName: any;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder,
    private http: Http, private serviceApi: ApiCommonService,
    private addEmployeeService: AddEmployeeService, private router: Router) {
    this.route.params.subscribe(res =>
      this.empCode = res.id);

    this.serviceApi.get('/v1/payroll-settings/lwf-states').subscribe(
      res => {
        res.forEach(element => {
          this.lwfStates.push({
            value: element.stateId,
            viewValue: element.stateName
          })
        });
      },
      err => { },
      () => { }
    );

    this.serviceApi.get('/v1/payroll-settings/pt-states').subscribe(
      res => {
        res.forEach(element => {
          if (element.isEligible) {
            this.ptStates.push({
              value: element.stateId,
              viewValue: element.stateName
            })
          }
        });

      },
      err => { },
      () => { }
    );
  }

  taxRegime = [
    { value: 'NEW_REGIME', viewValue: 'New Regime' },
    { value: 'OLD_REGIME', viewValue: 'Old Regime' }
  ];


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
    this.satutoryDetails = this.fb.group({
      empCode: [null],
      empEsicNumber: [''],
      empPfNumber: [''],
      empUanNumber: [''],
      isDailyWageApplicable: [''],
      isEmployeePfCaped: [''],
      isEmployerPfCaped: [''],
      isEsicDeductible: [''],
      isGratuityEligible: [''],
      isIncomeTaxDeductible: [''],
      isLwfDeductible: ['',],
      isPfDeuctible: [''],
      isProfessionalTaxDeductible: [''],
      pfContributionPecentage: [''],
      pfJoiningDate: [''],
      pfWage: [''],
      statuatoryId: [''],
      taxRegime: [''],
      taxRegimeUpdateAt: [],
      taxRegimeUpdateBy: [],
      lwfStateId: [null],
      ptState: [null],
      isRoundOffApplicable: ['']
    })
    // this.satutoryDetails.controls['lwfStateId'];
    // this.satutoryDetails.controls['ptState'];
  }
  lwfDeductable() {
    this.satutoryDetails.controls.lwfStateId.clearValidators();
    this.satutoryDetails.controls.lwfStateId.setValue(null);
    if (this.satutoryDetails.controls.isLwfDeductible.value == 'true') {
      // this.satutoryDetails.controls.lwfStateId.setValidators(Validators.required);
    }
    this.satutoryDetails.controls.lwfStateId.updateValueAndValidity();
  }
  ptDeductable() {
    this.satutoryDetails.controls.ptState.clearValidators();
    this.satutoryDetails.controls.ptState.setValue(null);
    if (this.satutoryDetails.controls.isProfessionalTaxDeductible.value == 'true') {
      // this.satutoryDetails.controls.ptState.setValidators(Validators.required);
    }
    this.satutoryDetails.controls.ptState.updateValueAndValidity();
  }
  saveStatutory(value: any) {
    this.satutoryDetails.controls.empCode.setValue(this.empCode);
    const formBody = this.satutoryDetails.value;
    if (this.satutoryDetails.valid) {
      this.isValidFormSubmitted = true;
      this.serviceApi.post('/v1/employee/profile/statuatory', this.satutoryDetails.value).subscribe(
        res => {
          this.successNotification(res.message);
        }, err => { },
        () => {
          this.getStatutoryInfo();
          this.readwrite = false;
          this.readonly = true;
        });
    } else {
      Object.keys(this.satutoryDetails.controls).forEach(field => {
        const control = this.satutoryDetails.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }

  }

  getStatutoryInfo() {
    this.satutoryDetails.reset();
    this.serviceApi.get('/v1/employee/profile/statuatory/' + this.empCode).subscribe(
      res => {
        if (res.statuatoryId != undefined) {
          this.satutoryDetails.patchValue(res);
          this.satutoryDetails.controls.statuatoryId.setValue(res.statuatoryId);
          this.satutoryDetails.controls.isDailyWageApplicable.setValue(res.isDailyWageApplicable + "");
          this.satutoryDetails.controls.isPfDeuctible.setValue(res.isPfDeuctible + "");
          this.satutoryDetails.controls.isEmployeePfCaped.setValue(res.isEmployeePfCaped + "");
          this.satutoryDetails.controls.isEmployerPfCaped.setValue(res.isEmployerPfCaped + "");
          this.satutoryDetails.controls.isEsicDeductible.setValue(res.isEsicDeductible + "");
          this.satutoryDetails.controls.isProfessionalTaxDeductible.setValue(res.isProfessionalTaxDeductible + "");
          this.satutoryDetails.controls.isLwfDeductible.setValue(res.isLwfDeductible + "");
          this.satutoryDetails.controls.isGratuityEligible.setValue(res.isGratuityEligible + "");
          this.satutoryDetails.controls.isIncomeTaxDeductible.setValue(res.isIncomeTaxDeductible + "");
          this.satutoryDetails.controls.taxRegime.setValue(res.taxRegime);
          this.satutoryDetails.controls.taxRegimeUpdateAt.setValue(res.taxRegimeUpdateAt);
          this.satutoryDetails.controls.taxRegimeUpdateBy.setValue(res.taxRegimeUpdateBy);
          this.satutoryDetails.controls.pfJoiningDate.setValue(res.pfJoiningDate);
          this.satutoryDetails.controls.lwfStateId.setValue(res.lwfStateId);
          this.satutoryDetails.controls.ptState.setValue(res.ptState);
          this.satutoryDetails.controls.isRoundOffApplicable.setValue(res.isRoundOffApplicable+"");
          var lwfStatesName = this.lwfStates.find(o => o.value == res.lwfStateId);
          this.lwfStatesName = lwfStatesName != undefined ? lwfStatesName.viewValue : "";

          var ptStatesName = this.ptStates.find(o => o.value == res.ptState);
          this.ptStatesName = ptStatesName != undefined ? ptStatesName.viewValue : "";
        }
      },
      error => {
        console.log('There is something Wrong in json');
      }
    );
  }
  editForm(data: any) {
    this.readwrite = true;
    this.readonly = false;
    console.log(data.value);
    const formData = data.value;
  }

  cancelForm() {
    this.getStatutoryInfo();
    this.readwrite = false;
    this.readonly = true;
  }

}




@Component({
  selector: 'app-variable-deductions',
  templateUrl: './variable-deductions-dialog.html',
  styleUrls: ['./statutory-details.component.scss']
})
export class VariableDeductionsDialogComponent implements OnInit {
  variableDeductionsArr = [];
  variableDeductionForm: FormGroup;
  instalmentArr = [];
  action: any;
  error: any;
  request: any;

  ngOnInit() {
    this.variableDeductionForm = this._fb.group({
      "deductionId": [null, Validators.required],
      "instalment": [null, Validators.required],
      "totalAmount": [null, Validators.required],
      "empCode": [null]
    });
    this.variableDeductionForm.controls.empCode.setValue(this.router.url.substring(this.router.url.lastIndexOf('/') + 1, this.router.url.length));

  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  constructor(public dialogRef: MatDialogRef<VariableDeductionsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http, private router: Router) {
    for (var i = 1; i <= 12; i++)
      this.instalmentArr.push(i);
    this.getDeductionsName();


  }

  getDeductionsName() {
    this.serviceApi.get('/v1/payroll/settings/deductions/variable').subscribe(res => {
      console.log(res);
      res.forEach(element => {
        this.variableDeductionsArr.push(
          {
            "deductionId": element.deductionId,
            "deductionName": element.deductionName
          }
        )
      });

    }, (err) => {

    }, () => {

    });
  }

  saveDeducaton() {
    console.log(JSON.stringify(this.variableDeductionForm.value));
    this.serviceApi.post('/v1/employee/profile/variable-deduction/' + this.variableDeductionForm.controls.deductionId.value, this.variableDeductionForm.value).subscribe(res => {
      console.log(res);
      this.action = 'Response';
      this.error = res.message;
      this.close();
    }, (err) => {
      this.action = 'Error';
      this.error = err.message;
      this.close();
    }, () => {

    })

  }

}
