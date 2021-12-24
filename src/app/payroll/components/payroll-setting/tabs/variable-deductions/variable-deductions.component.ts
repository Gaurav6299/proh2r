import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataSource } from '@angular/cdk/collections';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { DataTable } from 'primeng/components/datatable/datatable';
declare var $: any;
@Component({
  selector: 'app-variable-deductions',
  templateUrl: './variable-deductions.component.html',
  styleUrls: ['./variable-deductions.component.scss']
})
export class VariableDeductionsComponent implements OnInit, AfterViewInit {
  errorMessage: any;
  action: any;
  public variableDeductionForm: FormGroup;
  @ViewChild('myVariableDeductionsForm') form;
  @ViewChild("dt1") dt: DataTable;
  isLeftVisible = false;
  Specific = false;
  Some = false;
  button = false;
  panelFirstWidth: any;
  panelFirstHeight: any;
  isValidFormSubmitted = true;
  variableDeductionTableList = [];
  requiredTextField;
  formHeader: any;
  years = [];
  myControl = new FormControl();
  selectedEmployee = new FormControl();
  columns = [
    { field: 'deductionName', header: 'Deduction Name' },
    { field: 'paymentFrequency', header: 'Frequency' },
    { field: 'actions', header: 'Actions' },
  ];
  frequencies = [
    { value: "MONTHLY", viewValue: "Monthly" },
    // { value: "BI_MONTHLY", viewValue: "Bi Monthly" },
    { value: "QUARTERLY", viewValue: "Quarterly" },
    { value: "HALF_YEARLY", viewValue: "Half Yearly" },
    { value: "YEARLY", viewValue: "Yearly" }
  ];

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
  Year = [
    { value: '2017', viewValue: '2017' },
    { value: '2018', viewValue: '2018' },
  ];

  enteringAmountWays = [
    { value: 'MANUAL_AT_THE_TIME_OF_RUNNING_PAYROLL', viewValue: 'Manually at the time of running payroll' },
    { value: 'FIXED_AMOUNT', viewValue: 'Fixed Amount' },
    { value: 'PERCENTAGE_BASIC_DA_OR_BASIC', viewValue: 'Percentage of(Basic + DA) paid (or Basic if DA is not applicable)' },
    { value: 'PERCENTAGE_OF_GROSS_SALARY', viewValue: 'Percentage of gross salary paid' },
  ];



  displayedColumns = ['deductionName', 'deductionId'];
  dataSource = new MatTableDataSource<DeductionsData>();
  updateButton = false;
  allSelections = [];


  constructor(public dialog: MatDialog, private _fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.years.push({ value: (new Date().getFullYear() - 2) + "", viewValue: (new Date().getFullYear() - 2) + "" });
    this.years.push({ value: (new Date().getFullYear() - 1) + "", viewValue: (new Date().getFullYear() - 1) + "" });
    this.years.push({ value: new Date().getFullYear() + "", viewValue: new Date().getFullYear() + "" });
    this.years.push({ value: (new Date().getFullYear() + 1) + "", viewValue: (new Date().getFullYear() + 1) + "" });
    this.getAllVariableDeductionTableList();
    const rolesArr = KeycloakService.getUserRole();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);

    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));
    this.getAllDepartments();
    this.getAllDesignations();
    this.getAllOrgLocations();
    this.getAllBands();
    this.getAllEmployees();
  }

  changeHasEndingPeriod(event: any) {
    console.log(event);
    this.variableDeductionForm.controls.deductionEndMonth.clearValidators();
    this.variableDeductionForm.controls.deductionEndYear.clearValidators();
    if (event.value === 'true') {
      this.variableDeductionForm.controls.deductionEndMonth.setValidators([Validators.required]);
      this.variableDeductionForm.controls.deductionEndYear.setValidators([Validators.required]);
    } else {
      this.variableDeductionForm.controls.deductionEndMonth.setValue(null);
      this.variableDeductionForm.controls.deductionEndYear.setValue(null);
    }
    this.variableDeductionForm.controls.deductionEndMonth.updateValueAndValidity();
    this.variableDeductionForm.controls.deductionEndYear.updateValueAndValidity();
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
  ngOnInit() {
    this.variableDeductionForm = this._fb.group({
      deductionId: [''],
      deductionName: ['', Validators.required],
      effMonth: ['', Validators.required],
      effYear: ['', Validators.required],
      hasEndingPeriod: ['', Validators.required],
      deductionEndMonth: [''],
      deductionEndYear: [''],
      paymentFrequency: ['', Validators.required],
      showInCTC: ['', Validators.required],
      variableDeduction: [''],
      variableDeductionAmountType: ['', Validators.required],
      variableDeductionApplyTo: [],
      isEffectByAttendance: ['', Validators.required]
    });
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



  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';

      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }
  clickForSpecific() {
    this.Specific = true;
    this.Some = false;

  }
  selectVariableDeductionAmountType() {
    this.variableDeductionForm.controls.variableDeduction.clearValidators();
    if (this.variableDeductionForm.controls.variableDeductionAmountType.value === 'FIXED_AMOUNT' || this.variableDeductionForm.controls.variableDeductionAmountType.value === 'PERCENTAGE_BASIC_DA_OR_BASIC' || this.variableDeductionForm.controls.variableDeductionAmountType.value === 'PERCENTAGE_OF_GROSS_SALARY') {
      this.variableDeductionForm.controls.variableDeduction.setValidators([Validators.required]);
    } else {
      this.variableDeductionForm.controls.variableDeduction.setValue(null);
    }
    this.variableDeductionForm.controls.variableDeduction.updateValueAndValidity();
  }


  selectDeductionType() {
    this.variableDeductionForm.controls.variableDeduction.setValue(null);
  }

  clickForAll() {
    this.Some = false;
    this.Specific = false;
  }



  // tslint:disable-next-line:member-ordering
  // optionsData = this.options;
  searchEmployeeName(data: any) {
    // console.log('my method called' + data);
    // this.optionsData = this.options.filter(option =>
    //   option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  }
  addDeductions() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.variableDeductionForm.reset();
    this.form.resetForm();
    this.formHeader = 'Add New Variable Deductions';
    this.updateButton = false;
  }

  editVariableDeduction(element: any) {
    this.formHeader = 'Edit Variable Deductions';
    this.updateButton = true;
      this.isLeftVisible = !this.isLeftVisible;
      $('.divtoggleDiv')[1].style.display = 'block';
      console.log(element);
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


      // this.variableDeductionForm.patchValue(element);
      this.variableDeductionForm.controls.deductionId.setValue(element.deductionId);
      this.variableDeductionForm.controls.deductionName.setValue(element.deductionName);
      this.variableDeductionForm.controls.showInCTC.setValue('' + element.showInCTC);
      this.variableDeductionForm.controls.hasEndingPeriod.setValue('' + element.hasEndingPeriod);
      this.variableDeductionForm.controls.paymentFrequency.setValue(element.paymentFrequency);
      this.variableDeductionForm.controls.effMonth.setValue('' + element.effMonth);
      if (element.effYear != null) {
        this.variableDeductionForm.controls.effYear.setValue("" + element.effYear);
      } else {
        this.variableDeductionForm.controls.effYear.setValue(element.effYear);
      }
      this.variableDeductionForm.controls.deductionEndMonth.setValue(element.deductionEndMonth);
      if (element.deductionEndYear != null) {
        this.variableDeductionForm.controls.deductionEndYear.setValue("" + element.deductionEndYear);
      } else {
        this.variableDeductionForm.controls.deductionEndYear.setValue(element.deductionEndYear);
      }
      this.variableDeductionForm.controls.variableDeductionAmountType.setValue(element.variableDeductionAmountType);
      this.variableDeductionForm.controls.variableDeduction.setValue(element.variableDeduction);
      this.variableDeductionForm.controls.variableDeductionApplyTo.setValue(selections);
      this.variableDeductionForm.controls.isEffectByAttendance.setValue('' + element.isEffectByAttendance);
  }

  getAllVariableDeductionTableList() {
    this.variableDeductionTableList = [];
    console.log('Enter in the Function To get all variable Deductions From Database');
    this.serviceApi.get('/v1/payroll-settings/variable-deduction').subscribe(
      res => {
        console.log('Enter to Retriving Data From Database of Variable Deduction and the Response is ' + res);
        if (res != null) {
          console.log('There is Data In Database');
          res.forEach(element => {
            this.variableDeductionTableList.push(
              {
                deductionId: element.deductionId,
                deductionName: element.deductionName,
                showInCTC: element.showInCTC,
                paymentFrequency: element.paymentFrequency,
                effMonth: element.effMonth,
                effYear: element.effYear,
                hasEndingPeriod: element.hasEndingPeriod,
                deductionEndMonth: element.endMonth,
                deductionEndYear: element.endYear,
                variableDeductionAmountType: element.variableDeductionAmountType,
                variableDeduction: element.variableDeductionAmount,
                assignedEmployees: element.assignedEmployees,
                bandIds: element.bandIds,
                departmentIds: element.departmentIds,
                designationIds: element.designationIds,
                locationIds: element.locationIds,
                isEffectByAttendance: element.isEffectByAttendance
              });
          });
          this.dataSource = new MatTableDataSource<DeductionsData>(this.variableDeductionTableList);
        }
      },
      (err) => {
      },
      () => {
        this.dt.reset();
        console.log('Somrthing gone Wrong Of Retriving Variable Deduction');
      }
    );
  }

  saveVariableDeduction(data: any) {
    console.log('Enter to Save the Variable Deduction ' + this.variableDeductionForm.value);
    let deptId = [];
    let bandId = [];
    let designationId = [];
    let locationId = [];
    let appliedEmployee = [];
    if (this.variableDeductionForm.valid) {
      console.log(this.variableDeductionForm.value);

      let selections = this.variableDeductionForm.controls.variableDeductionApplyTo.value;
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
        "assignedEmpCode": appliedEmployee,
        "bandId": bandId,
        "deductionId": 0,
        "deductionName": this.variableDeductionForm.controls.deductionName.value,
        "departmentId": deptId,
        "designationId": designationId,
        "effMonth": this.variableDeductionForm.controls.effMonth.value,
        "effYear": this.variableDeductionForm.controls.effYear.value,
        "endMonth": this.variableDeductionForm.controls.deductionEndMonth.value,
        "endYear": this.variableDeductionForm.controls.deductionEndYear.value,
        "hasEndingPeriod": this.variableDeductionForm.controls.hasEndingPeriod.value,
        "isDefaultAllowance": false,
        "locationId": locationId,
        "paymentFrequency": this.variableDeductionForm.controls.paymentFrequency.value,
        "showInCTC": this.variableDeductionForm.controls.showInCTC.value,
        "variableDeductionAmount": this.variableDeductionForm.controls.variableDeduction.value,
        "variableDeductionAmountType": this.variableDeductionForm.controls.variableDeductionAmountType.value,
        "isEffectByAttendance": this.variableDeductionForm.controls.isEffectByAttendance.value
      };
      this.isValidFormSubmitted = true;
      this.serviceApi.post('/v1/payroll-settings/variable-deduction', formBody).subscribe(
        res => {
          console.log('Variable Deduction Successfully Saved...');
          this.successNotification(res.message);
          this.getAllVariableDeductionTableList();
          this.updateButton = true;
          if (res != null) {
            console.log('The Responsed Value Of Variable Deduction is : ' + JSON.stringify(res));
          } else {
            console.log('There is No Any Return Statement');
          }
        }, err => {
          // this.warningNotification(err.message);
          console.log('Something gone Wrong on Saving Data of Variable Deduction');
        }, () => {
          this.isLeftVisible = false;
          this.setPanel();
        }
      );
    } else {
      Object.keys(this.variableDeductionForm.controls).forEach(field => { // {1}
        const control = this.variableDeductionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  saveUpdateVariableDeduction(data: any) {
    console.log('Enter in Update the Variable Deduction');
    let deptId = [];
    let bandId = [];
    let designationId = [];
    let locationId = [];
    let appliedEmployee = [];
    if (this.variableDeductionForm.valid) {
      this.isValidFormSubmitted = true;
      let selections = this.variableDeductionForm.controls.variableDeductionApplyTo.value;
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
        "assignedEmpCode": appliedEmployee,

        "bandId": bandId,

        "deductionId": 0,
        "deductionName": this.variableDeductionForm.controls.deductionName.value,
        "departmentId": deptId,

        "designationId": designationId,

        "effMonth": this.variableDeductionForm.controls.effMonth.value,
        "effYear": this.variableDeductionForm.controls.effYear.value,
        "endMonth": this.variableDeductionForm.controls.deductionEndMonth.value,
        "endYear": this.variableDeductionForm.controls.deductionEndYear.value,
        "hasEndingPeriod": this.variableDeductionForm.controls.hasEndingPeriod.value,
        "isDefaultAllowance": false,
        "locationId": locationId,
        "paymentFrequency": this.variableDeductionForm.controls.paymentFrequency.value,
        "showInCTC": this.variableDeductionForm.controls.showInCTC.value,
        "variableDeductionAmount": this.variableDeductionForm.controls.variableDeduction.value,
        "variableDeductionAmountType": this.variableDeductionForm.controls.variableDeductionAmountType.value,
        "isEffectByAttendance": this.variableDeductionForm.controls.isEffectByAttendance.value
      };
      this.serviceApi.put('/v1/payroll-settings/variable-deduction/' + +this.variableDeductionForm.controls.deductionId.value, formBody)
        .subscribe(
          res => {
            console.log('Variable Deduction successfully Saved ... ');
            this.successNotification(res.message);
            this.getAllVariableDeductionTableList();
            if (res != null) {
              console.log('Response Data After Update the Variable Deduction : ' + JSON.stringify(res));
            } else {
              console.log('There is no Response After Updated');
            }

          },
          err => {
            // this.warningNotification(err.message);
          }, () => {
            this.isLeftVisible = false;
            this.setPanel();
          });

    } else {
      Object.keys(this.variableDeductionForm.controls).forEach(field => { // {1}
        const control = this.variableDeductionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  openDeleteDialog(data: any) {
      console.log('Enter in Delete Function To Delete The Variable Deduction -->' + data);
      const dialogRef = this.dialog.open(DialogOverview, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { deductionId: data.deductionId, message: this.errorMessage, status: this.action }
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
        }
        this.variableDeductionTableList = [];
        this.dataSource = new MatTableDataSource<DeductionsData>(this.variableDeductionTableList);
        this.getAllVariableDeductionTableList();
      });
  }
}

@Component({
  templateUrl: 'delete-dialog-overview.html',
  styleUrls: ['./delete-dialog-model.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverview {
  action: any;
  error: any;

  constructor(
    public dialogRef: MatDialogRef<DialogOverview>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete() {
    console.log(' Enter in the Dialog Function to Delete The Variable Deduction ---->' + this.data.deductionId);
    const val = this.data.deductionId;
    this.serviceApi.delete('/v1/payroll-settings/variable-deduction/' + +val).subscribe(
      res => {
        console.log('Variable Deduction Successfully Deleted');
        this.action = 'Response';
        this.error = res.message;
        this.close();
      }, err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
        console.log('Something gone Wrong to delete the Variable Deduction from Database');
      }
    );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}



export interface DeductionsData {
  deductionId: number;
  deductionName: string;
  showInCTC: boolean;
  paymentFrequency: string;
  effMonth: string;
  effYear: any;
  hasEndingPeriod: boolean;
  deductionEndMonth: string;
  deductionEndYear: any;
  variableDeductionAmountType: string;
  variableDeductionAmount: number;
  isEffectByAttendance: boolean;
}
const ELEMENT_DATA: DeductionsData[] = [];

