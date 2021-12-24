import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { Console } from '@angular/core/src/console';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';

declare var $: any;

@Component({
  selector: 'app-variable-allowances',
  templateUrl: './variable-allowances.component.html',
  styleUrls: ['./variable-allowances.component.scss']
})
export class VariableAllowancesComponent implements OnInit, AfterViewInit {
  allSelections = [];
  errorMessage: any;
  action: any;
  variableAllowance = [];
  frequencies = [
    { value: "MONTHLY", viewValue: "Monthly" },
    // { value: "BI_MONTHLY", viewValue: "Bi Monthly" },
    { value: "QUARTERLY", viewValue: "Quarterly" },
    { value: "HALF_YEARLY", viewValue: "Half Yearly" },
    { value: "YEARLY", viewValue: "Yearly" }
  ];

  columns = [
    { field: 'allowanceName', header: 'Allowance Name' },
    { field: 'allowPF', header: 'PF' },
    { field: 'allowESIC', header: 'ESIC' },
    { field: 'allowLWF', header: 'LWF' },
    { field: 'allowProfessionalTax', header: 'PT' },
    { field: 'allowIncomeTax', header: 'IT' },
    { field: 'paymentFrequency', header: 'Frequency' },
    { field: 'actions', header: 'Actions' },
  ]
  years = [];

  months = [
    { value: "JANUARY", viewValue: "January" },
    { value: "FEBRUARY", viewValue: "February" },
    { value: "MARCH", viewValue: "March" },
    { value: "APRIL", viewValue: "April" },
    { value: "MAY", viewValue: "May" },
    { value: "JUNE", viewValue: "June" },
    { value: "JULY", viewValue: "July" },
    { value: "AUGUST", viewValue: "August" },
    { value: "SEPTEMBER", viewValue: "September" },
    { value: "OCTOBER", viewValue: "October" },
    { value: "NOVEMBER", viewValue: "November" },
    { value: "DECEMBER", viewValue: "Deccember" }
  ];


  enteringAmountWays = [
    { value: 'MANUAL_AT_THE_TIME_OF_RUNNING_PAYROLL', viewValue: 'Manually at the time of running payroll' },
    { value: 'FIXED_AMOUNT', viewValue: 'Fixed Amount' },
    { value: 'PERCENTAGE_BASIC_DA_OR_BASIC', viewValue: 'Percentage of(Basic + DA) paid (or Basic if DA is not applicable)' },
    { value: 'PERCENTAGE_OF_GROSS_SALARY', viewValue: 'Percentage of gross salary paid' },
  ];


  regimes = [
    { value: 'NEW', viewValue: 'New Regime', type: 'Select All' },
    { value: 'OLD', viewValue: 'Old Regime', type: 'Select All' }
  ]

  @ViewChild('myVariableAllanceForm') form;
  @ViewChild("dt1") dt: DataTable;
  updateButtonVisible: any;
  addButtonVisible: any;
  myControl = new FormControl();
  selectedEmployee = new FormControl();

  displayedColumns = ['allowanceName', 'action'];

  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  isValidFormSubmitted = true;
  requiredTextField;
  formHeader: any;

  public variableAllowanceForm: FormGroup;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.years.push({ value: (new Date().getFullYear() - 2) + "", viewValue: (new Date().getFullYear() - 2) + "" });
    this.years.push({ value: (new Date().getFullYear() - 1) + "", viewValue: (new Date().getFullYear() - 1) + "" });
    this.years.push({ value: new Date().getFullYear() + "", viewValue: new Date().getFullYear() + "" });
    this.years.push({ value: (new Date().getFullYear() + 1) + "", viewValue: (new Date().getFullYear() + 1) + "" });
    this.getAllVariableAllowanceTableData();
    const rolesArr = KeycloakService.getUserRole();
    this.setPanel();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));
    this.getAllDepartments();
    // this.getAllSubDepartments();
    // this.getOrganizationProfile();
    this.getAllDesignations();
    this.getAllOrgLocations();
    this.getAllBands();
    this.getAllEmployees();
  }

  ngOnInit() {
    this.variableAllowanceForm = this.fb.group({
      allowanceId: [],
      allowanceName: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      affectPF: ['', Validators.required],
      affectESIC: ['', Validators.required],
      affectLWF: ['', Validators.required],
      affectProfessionalTax: ['', Validators.required],
      affectIncomeTax: ['', Validators.required],
      incomeTaxDeductionType: [''],
      showInCTC: ['', Validators.required],
      paymentFrequency: ['', Validators.required],
      effMonth: ['', Validators.required],
      effYear: ['', Validators.required],
      hasEndingPeriod: ['', Validators.required],
      allowanceEndMonth: [''],
      allowanceEndYear: [''],
      variableAllowanceAmountType: ['', Validators.required],
      variableAllowance: [''],
      variableAllowanceApplyTo: [],
      taxRegime: [],
      isEffectByAttendance: ['', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    // if ($('.divtoggleDiv').length > 0) {
    //   this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
    //   console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
    //   this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
    //   console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
    //   $('.divtoggleDiv')[1].style.display = 'none';
    // }
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  changeAffectIncomeTax(event: any) {
    console.log(event.value);
    this.variableAllowanceForm.controls.incomeTaxDeductionType.clearValidators();
    this.variableAllowanceForm.controls.incomeTaxDeductionType.reset();
    this.variableAllowanceForm.controls.taxRegime.clearValidators();
    this.variableAllowanceForm.controls.taxRegime.reset();
    if (event.value === "true") {
      this.variableAllowanceForm.controls.incomeTaxDeductionType.setValidators(Validators.required);
      this.variableAllowanceForm.controls.taxRegime.setValidators(Validators.required);
    }
    this.variableAllowanceForm.controls.incomeTaxDeductionType.updateValueAndValidity();
    this.variableAllowanceForm.controls.taxRegime.updateValueAndValidity();
  }

  changeEndingPeriod(event: any) {
    console.log(event.value);
    this.variableAllowanceForm.controls.allowanceEndMonth.reset();
    this.variableAllowanceForm.controls.allowanceEndYear.reset();
    this.variableAllowanceForm.controls.allowanceEndMonth.clearValidators();
    this.variableAllowanceForm.controls.allowanceEndYear.clearValidators();
    if (event.value === "true") {
      this.variableAllowanceForm.controls.allowanceEndMonth.setValidators(Validators.required);
      this.variableAllowanceForm.controls.allowanceEndYear.setValidators(Validators.required);
    }
    this.variableAllowanceForm.controls.allowanceEndMonth.updateValueAndValidity();
    this.variableAllowanceForm.controls.allowanceEndYear.updateValueAndValidity();
  }

  selectVariableAllowanceAmountType() {
    console.log(this.variableAllowanceForm.controls.variableAllowanceAmountType.value);
    this.variableAllowanceForm.controls.variableAllowance.clearValidators();
    this.variableAllowanceForm.controls.variableAllowance.reset();
    if (this.variableAllowanceForm.controls.variableAllowanceAmountType.value != 'MANUAL_AT_THE_TIME_OF_RUNNING_PAYROLL') {
      this.variableAllowanceForm.controls.variableAllowance.setValidators(Validators.required);
    }
    this.variableAllowanceForm.controls.variableAllowance.updateValueAndValidity();
  }
  getAllEmployees() {
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {
          this.allSelections = [...this.allSelections, {
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode,
            type: "All Employees"
          }];
        });
      }, (err) => {

      }, () => {

      });
  }
  getAllBands() {
    this.serviceApi.get("/v1/organization/getAll/bands").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {

            this.allSelections = [...this.allSelections, {
              value: element.bandId,
              viewValue: element.bandName,
              type: 'All Bands'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getAllSubDepartments() {
    this.serviceApi.get("/v1/organization/sub-department").subscribe(res => {
      res.forEach(element => {

        this.allSelections = [...this.allSelections, {
          value: element.subDeptId,
          viewValue: element.subDeptName,
          type: 'All Sub Departments'
        }];
      });
    }, (err) => {

    }, () => {

    });
  }

  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").subscribe(
      res => {
        res.forEach(element => {

          this.allSelections = [...this.allSelections, {
            value: element.deptId,
            viewValue: element.deptName,
            type: 'All Departments'
          }];
        });

      }, (err) => {

      }, () => {

      });
  }
  getOrganizationProfile() {
    // this.orgProfile = [];
    this.serviceApi.get("/v1/organization/orgProfileInfo").subscribe(res => {
      res.forEach(element => {
        // this.orgProfile.push({
        //   "value": element.orgProfileId,
        //   "viewValue": element.organizationBasicInfo.companyName
        // });
        this.allSelections = [...this.allSelections, {
          value: element.orgProfileId,
          viewValue: element.organizationBasicInfo.companyName,
          type: 'All Organization Profile'
        }];
      });
    }, (err) => {

    }, () => {

    });
  }
  getAllDesignations() {
    this.serviceApi.get("/v1/organization/getAll/designations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {

            this.allSelections = [...this.allSelections, {
              value: element.id,
              viewValue: element.designationName,
              type: 'All Designations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });

  }
  getAllOrgLocations() {
    this.serviceApi.get("/v1/organization/orgLocations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {

            this.allSelections = [...this.allSelections, {
              value: element.locationId,
              viewValue: element.locationCode.toUpperCase() + ' - ' + element.cityName,
              type: 'All Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

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
  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }
  getAllVariableAllowanceTableData() {
    this.variableAllowance = [];
    this.serviceApi.get('/v1/payroll-settings/variable-allowance').subscribe(
      res => {
        this.variableAllowance = res;
      }, (err) => {
      }, () => {
        this.dt.reset();
      }
    );
  }

  /*****below method call when select multple employee from holiday modal***** */

  /*****above code clossed here***** */


  addFixedAllowance() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addButtonVisible = true;
    this.updateButtonVisible = false;
    this.formHeader = 'Add New Variable Allowances';
    console.log('addFixedAllowance is called');
    this.variableAllowanceForm.reset();
    this.form.resetForm();
  }

  saveVariableAllowances(data: any) {
    console.log('Enter to Save New Variable Allowances ' + this.variableAllowanceForm.value);
    let deptId = [];
    let bandId = [];
    let designationId = [];
    let locationId = [];
    let appliedEmployee = [];

    if (this.variableAllowanceForm.valid ) {
      console.log(this.variableAllowanceForm.value);

      let selections = this.variableAllowanceForm.controls.variableAllowanceApplyTo.value;
      selections != null ? selections.forEach(element => {
        if (element.type === 'All Departments') {
          deptId.push(element.value);
        } else if (element.type === 'All Bands') {
          bandId.push(element.value);
        } else if (element.type === 'All Designations') {
          designationId.push(element.value)
        } else if (element.type === 'All Employees') {
          appliedEmployee.push(element.value)
        } else {
          locationId.push(element.value);
        }
      }) : '';
      const body = {
        "allowESIC": this.variableAllowanceForm.controls.affectESIC.value,
        "allowIncomeTax": this.variableAllowanceForm.controls.affectIncomeTax.value,
        "allowLWF": this.variableAllowanceForm.controls.affectLWF.value,
        "allowPF": this.variableAllowanceForm.controls.affectPF.value,
        "allowProfessionalTax": this.variableAllowanceForm.controls.affectProfessionalTax.value,
        "allowanceId": 0,
        "allowanceName": this.variableAllowanceForm.controls.allowanceName.value,
        "assignedEmpCode": appliedEmployee,
        "bandId": bandId,
        "departmentId": deptId,
        "designationId": designationId,
        "effMonth": this.variableAllowanceForm.controls.effMonth.value,
        "effYear": this.variableAllowanceForm.controls.effYear.value,
        "endMonth": this.variableAllowanceForm.controls.allowanceEndMonth.value,
        "endYear": this.variableAllowanceForm.controls.allowanceEndYear.value,
        "hasEndingPeriod": this.variableAllowanceForm.controls.hasEndingPeriod.value,
        "incomeTaxDeductionType": this.variableAllowanceForm.controls.incomeTaxDeductionType.value,
        "isDefaultAllowance": false,
        "locationId": locationId,
        "paymentFrequency": this.variableAllowanceForm.controls.paymentFrequency.value,
        "showInCTC": this.variableAllowanceForm.controls.showInCTC.value,
        "taxRegime": this.variableAllowanceForm.controls.taxRegime.value,
        "variableAllowanceAmount": this.variableAllowanceForm.controls.variableAllowance.value,
        "variableAllowanceAmountType": this.variableAllowanceForm.controls.variableAllowanceAmountType.value,
        "isEffectByAttendance": this.variableAllowanceForm.controls.isEffectByAttendance.value
      }
      this.isValidFormSubmitted = true;

      this.serviceApi.post('/v1/payroll-settings/variable-allowance', body).subscribe(
        res => {
          console.log('Sucessfully Variable Allowance Data Saves');
          this.successNotification(res.message);
        }, err => {
          // this.warningNotification(err.message);
          console.log('Something Gone wrong on saving the Variable Allowance');
        }, () => {
          this.getAllVariableAllowanceTableData();
          this.isLeftVisible = false;
          this.setPanel();
        }
      );

    } else {
      Object.keys(this.variableAllowanceForm.controls).forEach(field => { // {1}
        const control = this.variableAllowanceForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  saveUpdatedVariableAllowances(data: any) {
    console.log('Enter to Save Updated Variable Allowances ' + this.variableAllowanceForm.controls.allowanceId.value);
    let deptId = [];
    let bandId = [];
    let designationId = [];
    let locationId = [];
    let appliedEmployee = [];

    if (this.variableAllowanceForm.valid ) {
      let selections = this.variableAllowanceForm.controls.variableAllowanceApplyTo.value;
      selections != null ? selections.forEach(element => {
        if (element.type === 'All Departments') {
          deptId.push(element.value);
        } else if (element.type === 'All Bands') {
          bandId.push(element.value);
        } else if (element.type === 'All Designations') {
          designationId.push(element.value)
        } else if (element.type === 'All Employees') {
          appliedEmployee.push(element.value)
        } else {
          locationId.push(element.value);
        }
      }) : '';
      const formBody = {
        "allowESIC": this.variableAllowanceForm.controls.affectESIC.value,
        "allowIncomeTax": this.variableAllowanceForm.controls.affectIncomeTax.value,
        "allowLWF": this.variableAllowanceForm.controls.affectLWF.value,
        "allowPF": this.variableAllowanceForm.controls.affectPF.value,
        "allowProfessionalTax": this.variableAllowanceForm.controls.affectProfessionalTax.value,
        "allowanceId": 0,
        "allowanceName": this.variableAllowanceForm.controls.allowanceName.value,
        "assignedEmpCode": appliedEmployee,
        "bandId": bandId,
        "departmentId": deptId,
        "designationId": designationId,
        "effMonth": this.variableAllowanceForm.controls.effMonth.value,
        "effYear": this.variableAllowanceForm.controls.effYear.value,
        "endMonth": this.variableAllowanceForm.controls.allowanceEndMonth.value,
        "endYear": this.variableAllowanceForm.controls.allowanceEndYear.value,
        "hasEndingPeriod": this.variableAllowanceForm.controls.hasEndingPeriod.value,
        "incomeTaxDeductionType": this.variableAllowanceForm.controls.incomeTaxDeductionType.value,
        "isDefaultAllowance": false,
        "locationId": locationId,
        "paymentFrequency": this.variableAllowanceForm.controls.paymentFrequency.value,
        "showInCTC": this.variableAllowanceForm.controls.showInCTC.value,
        "taxRegime": this.variableAllowanceForm.controls.taxRegime.value,
        "variableAllowanceAmount": this.variableAllowanceForm.controls.variableAllowance.value,
        "variableAllowanceAmountType": this.variableAllowanceForm.controls.variableAllowanceAmountType.value,
        "isEffectByAttendance": this.variableAllowanceForm.controls.isEffectByAttendance.value
      }


      this.isValidFormSubmitted = true;
      this.serviceApi.put('/v1/payroll-settings/variable-allowance/' + +this.variableAllowanceForm.controls.allowanceId.value, formBody)
        .subscribe(
          res => {
            console.log('Sucessfully Update the Variable Allowance Data in the Database And the Response is >> ' + res);
            this.successNotification(res.message);
          }, err => {
            // this.warningNotification(err.message);
            console.log('Something gone Wrong in the Update the Variable Allowance Data in Database and the Error is >> ' + err);
          }, () => {
            this.getAllVariableAllowanceTableData();
            this.isLeftVisible = false;
            this.setPanel();
          });
    } else {
      Object.keys(this.variableAllowanceForm.controls).forEach(field => { // {1}
        const control = this.variableAllowanceForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  editAllowance(element: any) {
    console.log(element)
      this.isLeftVisible = !this.isLeftVisible;
      this.formHeader = 'Edit Variable Allowances';
      $('.divtoggleDiv')[1].style.display = 'block';
      this.updateButtonVisible = true;
      this.addButtonVisible = false;
      let selections = [];
      element.departmentIds != null ? element.departmentIds.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'All Departments'
        });
      }) : '';
      element.bandIds != null ? element.bandIds.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'All Bands'
        });
      }) : '';
      element.locationIds != null ? element.locationIds.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'Locations'
        });
      }) : '';
      element.designationIds != null ? element.designationIds.forEach(element => {
        selections.push({
          value: element.id,
          viewValue: element.name,
          type: 'All Designations'
        });
      }) : '';
      element.assignedEmployees != null ? element.assignedEmployees.forEach(element => {
        selections.push({
          value: element.empCode,
          viewValue: element.name + '-' + element.empCode,
          type: 'All Employees'
        });
      }) : "";

      this.variableAllowanceForm.controls.allowanceId.setValue(element.allowanceId);
      this.variableAllowanceForm.controls.allowanceName.setValue(element.allowanceName);
      this.variableAllowanceForm.controls.affectPF.setValue('' + element.allowPF);
      this.variableAllowanceForm.controls.affectESIC.setValue('' + element.allowESIC);
      this.variableAllowanceForm.controls.affectLWF.setValue('' + element.allowLWF);
      this.variableAllowanceForm.controls.affectProfessionalTax.setValue('' + element.allowProfessionalTax);
      this.variableAllowanceForm.controls.affectIncomeTax.setValue('' + element.allowIncomeTax);
      this.variableAllowanceForm.controls.incomeTaxDeductionType.setValue(element.incomeTaxDeductionType);

      this.variableAllowanceForm.controls.paymentFrequency.setValue(element.paymentFrequency);
      this.variableAllowanceForm.controls.effMonth.setValue('' + element.effMonth);
      if (element.effYear != null) {
        this.variableAllowanceForm.controls.effYear.setValue("" + element.effYear);
      } else {
        this.variableAllowanceForm.controls.effYear.setValue(element.effYear);
      }

      this.variableAllowanceForm.controls.hasEndingPeriod.setValue('' + element.hasEndingPeriod);
      this.variableAllowanceForm.controls.allowanceEndMonth.setValue(element.endMonth);
      if (element.allowanceEndYear != null) {
        this.variableAllowanceForm.controls.allowanceEndYear.setValue("" + element.endYear);
      } else {
        this.variableAllowanceForm.controls.allowanceEndYear.setValue(element.endYear);
      }

      this.variableAllowanceForm.controls.variableAllowanceAmountType.setValue(element.variableAllowanceAmountType);
      this.variableAllowanceForm.controls.variableAllowance.setValue(element.variableAllowanceAmount);

      this.variableAllowanceForm.controls.showInCTC.setValue('' + element.showInCTC);
      this.variableAllowanceForm.controls.variableAllowanceApplyTo.setValue(selections);
      this.variableAllowanceForm.controls.taxRegime.setValue(element.taxRegime);
      this.variableAllowanceForm.controls.isEffectByAttendance.setValue('' + element.isEffectByAttendance);
  }



  selectEmployee() {
    console.log('selected Employee called');
    this.variableAllowanceForm.controls.selectedEmployeeList.setValue(this.selectedEmployee.value);
  }

  deleteVariableAllowanceData(data: any) {
    console.log(data);
    this.action = '';
      console.log('Employee On Delete-->' + data);
      const dialogRef = this.dialog.open(VariableAllowanceDeleteComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { allowanceId: data.allowanceId, message: this.errorMessage, status: this.action }
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
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }
          // tslint:disable-next-line:one-line
          console.log('The dialog was closed');
          this.getAllVariableAllowanceTableData();

        }


      });
  }

}

@Component({
  templateUrl: 'variable-allowances-delete.component.html',
  styleUrls: ['delete-dialog-model.scss']
})
export class VariableAllowanceDeleteComponent implements OnInit {
  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<VariableAllowanceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onDelete() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.allowanceId);
    const val = this.data.allowanceId;
    this.serviceApi.delete('/v1/payroll-settings/variable-allowance/' + +val).subscribe(
      res => {
        console.log('Fixed Allowances Successfully Deleted');
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {
        console.log('Something gone Wrong to delete the Fixed Allowance from Database');
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

export interface Element {
  allowanceId: number;
  allowanceName: string;
  isDefaultAllowance: boolean;
  allowPF: boolean;
  allowESIC: boolean;
  allowLWF: boolean;
  allowProfessionalTax: boolean;
  allowIncomeTax: boolean;
  showInCTC: boolean;
  paymentFrequency: string;
  effMonth: string;
  effYear: string;
  allowanceEndMonth: string;
  allowanceEndYear: string;
  hasEndingPeriod: boolean;
  variableAllowanceAmountType: string;
  variableAllowanceAmount: string;
  wayOfEnteringAmount: string;
  fixedAmount: string;
  basicDaPercentage: string;
  grossSalaryPercentage: string;
  variableAllowanceApplyTo: string;
  isEffectByAttendance: boolean;
}
const ELEMENT_DATA: Element[] = [];
