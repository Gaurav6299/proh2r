import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { element } from 'protractor';
import { DataTable } from 'primeng/primeng';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'templateName', header: 'Template Name' },
    { field: 'allowancesName', header: 'Allowances Applicable' },
    { field: 'action', header: 'Actions' },
  ]
  pftTemplateAllowanceList = [];
  readonly = true;
  readwrite = false;
  hideShowDataPercentageFields: any;
  showHidePasswordField: any;
  editFieldSection = false;


  myControl = new FormControl();
  employeeList = [];
  adminList = [];
  options = [];

  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropDownField;
  notificationMsg: any;
  action: any;


  openAddTemplateDialog() {
    const dialogRef = this.dialog.open(AddUpdatePFTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, options: this.options, title: 'Add New Template' }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllTemplates();
        }
      }
    });

  }

  openUpdateTemplateDialog(data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(AddUpdatePFTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, templateInfo: data, options: this.options, title: 'Update Template' }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllTemplates();
        }
      }
    });

  }
  openDeleteTemplate(data: any) {
    const dialogRef = this.dialog.open(DeletePFTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { templateInfo: data, message: this.notificationMsg }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== null) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllTemplates();
        }
      }
    });
  }

  paybleCalculationList = [
    { value: 'FIXED_DAYS', viewValue: 'Fixed Days' },
    { value: 'EXCLUDE_WEEKLY_OFFS', viewValue: 'Exclude Weekly-Offs' },
    { value: 'EXCLUDE_WEEKLY_OFFS_AND_HOLIDAYS', viewValue: 'Exclude Weekly-Offs & Holidays' },
    { value: 'CALENDAR_DAYS_IN_PAYROLL_MONTH', viewValue: 'Calendar Dyas in the Payroll month' }
  ];

  lopsDaysList = [
    { value: 'Select', viewValue: 'Select' },
    { value: 'Select Dates', viewValue: 'Select Dates' },
    { value: 'Enter Number of Lops Days', viewValue: 'Enter Number of Lops Days' }
  ];

  encashmentDenomiatorArr = [
    { value: '26', viewValue: '26' },
    { value: '30', viewValue: '30' }
  ];
  leaveEncashmentRolloverMonthArr = [
    { value: 'JANUARY', viewValue: 'January', type: 'Select All' },
    { value: 'FEBRUARY', viewValue: 'February', type: 'Select All' },
    { value: 'MARCH', viewValue: 'March', type: 'Select All' },
    { value: 'APRIL', viewValue: 'April', type: 'Select All' },
    { value: 'MAY', viewValue: 'May', type: 'Select All' },
    { value: 'JUNE', viewValue: 'June', type: 'Select All' },
    { value: 'JULY', viewValue: 'July', type: 'Select All' },
    { value: 'AUGUST', viewValue: 'August', type: 'Select All' },
    { value: 'SEPTEMBER', viewValue: 'September', type: 'Select All' },
    { value: 'OCTOBER', viewValue: 'October', type: 'Select All' },
    { value: 'NOVEMBER', viewValue: 'November', type: 'Select All' },
    { value: 'DECEMBER', viewValue: 'December', type: 'Select All' }
  ];

  dayList = [
  ];

  // allowanceId = new FormControl();
  optionsData = this.options;
  selectedFileterData: any;
  dataCollectedValue = [];
  payrollLopDaysTypeArr = [
    { value: "SELECT_DATES", viewValue: "Select Dates" },
    { value: "NUMBER", viewValue: "Enter Number of LOP days" }
  ];
  public payrollGeneralSettingForm: FormGroup;
  constructor(private fb: FormBuilder, private http: Http, public dialog: MatDialog, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.getPayrollSettingFormInformation();
    this.getAllEmployeeList();
    // this.getAllAdminList();
    this.getAllDetailsForPayrollRunOn();
    this.getAllTemplates();
    const rolesArr = KeycloakService.getUserRole();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropDownField = message);
    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));
    for (let i = 1; i < 32; i++) {
      this.dayList.push({
        value: i,
        viewValue: i + ''
      });
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
  ngOnInit() {
    this.payrollGeneralSettingForm = this.fb.group({
      attendanceCycleBeginDay: ['', Validators.required],
      encashmentRolloverMonth: [''],
      grAllowanceNames: [''],
      grComponents: [''],
      gratuityPercentage: [''],
      isGratuityEligible: ['', Validators.required],
      isNoticePeriodRecovery: ['', Validators.required],
      isPasswordMandatory: ['', Validators.required],
      leAllowanceNames: [''],
      leComponents: [''],
      leaveEncashmentDenominator: [''],
      leaveRecoveryDenominator: [''],
      lrAllowanceNames: [''],
      lrComponents: ['', ],
      noticePeriodRecoveryDenominator: [''],
      npAllowanceNames: [''],
      npComponents: [''],
      password: [''],
      runPayrollDay: ['', Validators.required],
      runPayrollEmpCode: ['', Validators.required],
      settingsId: [''],
    });
  }

  isPayrollApproverAdminUserChange(event: any) {

  }

  statuatoryEffectsPayrollOffCycleChange(event: any) {

  }

  noticePeriodRecoveryApplicableChange(event: any) {
    this.payrollGeneralSettingForm.controls.noticePeriodRecoveryDenominator.clearValidators();
    this.payrollGeneralSettingForm.controls.npComponents.clearValidators();
    if (event.value === 'true') {
      this.payrollGeneralSettingForm.controls.noticePeriodRecoveryDenominator.setValidators([Validators.required]);
      this.payrollGeneralSettingForm.controls.npComponents.setValidators([Validators.required]);
    } else {
      this.payrollGeneralSettingForm.controls.noticePeriodRecoveryDenominator.setValue(null);
      this.payrollGeneralSettingForm.controls.npComponents.setValue(null);
      this.payrollGeneralSettingForm.controls.noticePeriodRecoveryDenominator.clearValidators();
      this.payrollGeneralSettingForm.controls.npComponents.clearValidators();
    }
    this.payrollGeneralSettingForm.controls.noticePeriodRecoveryDenominator.updateValueAndValidity();
    this.payrollGeneralSettingForm.controls.npComponents.updateValueAndValidity();
  }
  getPayrollSettingFormInformation() {
    this.serviceApi.get('/v1/payroll-settings/get/gerneral-setting').subscribe(
      res => {
        if (res.settingsId != null) {
          this.payrollGeneralSettingForm.patchValue(res);
          this.payrollGeneralSettingForm.controls.attendanceCycleBeginDay.setValue(res.attendanceCycleBeginDay + "");
          this.payrollGeneralSettingForm.controls.encashmentRolloverMonth.setValue(res.encashmentRolloverMonth);
          this.payrollGeneralSettingForm.controls.grAllowanceNames.setValue(res.grAllowanceNames);
          this.payrollGeneralSettingForm.controls.grComponents.setValue(res.grComponents);
          this.payrollGeneralSettingForm.controls.gratuityPercentage.setValue(res.gratuityPercentage + "");
          this.payrollGeneralSettingForm.controls.isGratuityEligible.setValue(res.isGratuityEligible + "");
          this.payrollGeneralSettingForm.controls.isNoticePeriodRecovery.setValue(res.isNoticePeriodRecovery + "");
          this.payrollGeneralSettingForm.controls.isPasswordMandatory.setValue(res.isPasswordMandatory + "");
          this.payrollGeneralSettingForm.controls.leAllowanceNames.setValue(res.leAllowanceNames + "");
          this.payrollGeneralSettingForm.controls.leComponents.setValue(res.leComponents);
          this.payrollGeneralSettingForm.controls.leaveEncashmentDenominator.setValue(res.leaveEncashmentDenominator + "");
          this.payrollGeneralSettingForm.controls.leaveRecoveryDenominator.setValue(res.leaveRecoveryDenominator + "");
          this.payrollGeneralSettingForm.controls.lrAllowanceNames.setValue(res.lrAllowanceNames + "");
          this.payrollGeneralSettingForm.controls.lrComponents.setValue(res.lrComponents);
          this.payrollGeneralSettingForm.controls.noticePeriodRecoveryDenominator.setValue(res.noticePeriodRecoveryDenominator);
          this.payrollGeneralSettingForm.controls.npAllowanceNames.setValue(res.npAllowanceNames);
          this.payrollGeneralSettingForm.controls.npComponents.setValue(res.npComponents);
          this.payrollGeneralSettingForm.controls.password.setValue(res.password + "");
          this.payrollGeneralSettingForm.controls.runPayrollDay.setValue(res.runPayrollDay + "");
          this.payrollGeneralSettingForm.controls.runPayrollEmpCode.setValue(res.runPayrollEmpCode + "");
          this.payrollGeneralSettingForm.controls.settingsId.setValue(res.settingsId + "");
        }
      },
      error => {
        console.log('There is something Wrong in json');
      }
    );
  }

  saveGeneralPayrollSetting(value: any) {
    const formBody = this.payrollGeneralSettingForm.value;
    // const dataCollect = []

    // if (dataCollect.length === 0 || dataCollect.length < 1) {
    //   this.dataCollectedValue = this.payrollGeneralSettingForm.value.allowanceId;
    // } else {
    //   this.dataCollectedValue = dataCollect;
    // }
    // var gratuityAllowances = [];
    // var leaveEncashmentAllowances = [];
    // var leaveRecoveryAllowances = [];
    // var noticePeriodRecoveryAllowances = [];
    // if (this.payrollGeneralSettingForm.valid) {
    //   if (formBody.isCompanyEligibleForGratuity == 'true') {
    //     formBody.gratuityAllowances.forEach(gratuityAllowance => {
    //       gratuityAllowances.push({
    //         "allowanceId": gratuityAllowance,
    //         "genSettingDependentType": "GRATUITY"
    //       });
    //     });
    //   }

    //   formBody.leaveEncashmentAllowances.forEach(leaveEncashmentAllowance => {
    //     leaveEncashmentAllowances.push({
    //       "allowanceId": leaveEncashmentAllowance,
    //       "genSettingDependentType": "LEAVE_ENCASHMENT"
    //     });
    //   });


    //   formBody.leaveRecoveryAllowances.forEach(leaveRecoveryAllowance => {
    //     leaveRecoveryAllowances.push({
    //       "allowanceId": leaveRecoveryAllowance,
    //       "genSettingDependentType": "LEAVE_RECOVERY"
    //     });
    //   });

    //   if (formBody.noticePeriodRecoveryApplicable == 'true') {
    //     formBody.noticePeriodRecoveryAllowances.forEach(noticePeriodRecoveryAllowance => {
    //       noticePeriodRecoveryAllowances.push({
    //         "allowanceId": noticePeriodRecoveryAllowance,
    //         "genSettingDependentType": "NOTICE_PERIOD_RECOVERY"
    //       });
    //     });
    //   }


    // const body = {
    //   "encashmentDenomiator": formBody.encashmentDenomiator,
    //   "gratuityAllowances": gratuityAllowances,
    //   "gratuityPercent": formBody.gratuityPercent,
    //   "isCompanyEligibleForGratuity": formBody.isCompanyEligibleForGratuity,
    //   "isPayableDaysEqualToAttendanceDays": formBody.isPayableDaysEqualToAttendanceDays,
    //   "isPayrollApproverAdminUser": formBody.isPayrollApproverAdminUser,
    //   "isSalaryRegisterProtected": formBody.isSalaryRegisterProtected,
    //   "leaveEncashmentAllowances": leaveEncashmentAllowances,
    //   "leaveEncashmentRolloverMonth": formBody.leaveEncashmentRolloverMonth,
    //   "leaveRecoveryAllowances": leaveRecoveryAllowances,
    //   "leaveRecoveryDenomiator": formBody.leaveRecoveryDenomiator,
    //   "noticePeriodRecoveryAllowances": noticePeriodRecoveryAllowances,
    //   "noticePeriodRecoveryApplicable": formBody.noticePeriodRecoveryApplicable,
    //   "noticeRecoveryDenomiator": formBody.noticeRecoveryDenomiator,
    //   "payrollApproverEmpCode": formBody.payrollApproverEmpCode,
    //   "payrollCycleRunDay": formBody.payrollCycleRunDay,
    //   "payrollLopDaysType": formBody.payrollLopDaysType,
    //   "payrollSettingId": formBody.payrollSettingId,
    //   "salaryRegisterPassword": formBody.salaryRegisterPassword,
    //   "startDayOfAttendanceCycle": formBody.startDayOfAttendanceCycle,
    //   "statuatoryEffectsPayrollOffCycle": formBody.statuatoryEffectsPayrollOffCycle,
    //   "weekOffPayable": formBody.weekOffPayable,
    // }


    if (this.payrollGeneralSettingForm.valid) {
      this.isValidFormSubmitted = true;
      this.serviceApi.put('/v1/payroll-settings/save/gerneral-setting', formBody).subscribe(
        res => {
          this.successNotification(res.message);
        }, err => {
        }, () => {
          this.getPayrollSettingFormInformation();
          this.cancelFunction();
        });
    } else {
      Object.keys(this.payrollGeneralSettingForm.controls).forEach(field => { // {1}
        const control = this.payrollGeneralSettingForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }

  edit(data: any) {
    this.readwrite = true;
    this.readonly = false;
    console.log(data.value);
    // const formData = data.value;
    const approverEmpCode = data.value.runPayrollEmpCode.split('-');
    const empCode: string = approverEmpCode[1];
    // this.selectedFileterData = [];
    // const selectedFileterDataTemp = [];

    // this.payrollGeneralSettingForm.controls.gratuityPercent.setValidators([this.validationMessagesService.numericValidation])
    // this.payrollGeneralSettingForm.controls.weekOffPayable.setValue(data.value.weekOffPayable);
    this.payrollGeneralSettingForm.patchValue(data);
    this.payrollGeneralSettingForm.controls.runPayrollDay.setValue(+data.value.runPayrollDay);
    this.payrollGeneralSettingForm.controls.runPayrollEmpCode.setValue(empCode + "");
    this.payrollGeneralSettingForm.controls.attendanceCycleBeginDay.setValue(+data.value.attendanceCycleBeginDay);
    this.payrollGeneralSettingForm.controls.noticePeriodRecoveryDenominator.setValue(data.value.noticePeriodRecoveryDenominator + "");
  }

  cancelFunction() {
    console.log('<<<<< Enter in the Cancel Function on Click Cancel Button');
    this.getPayrollSettingFormInformation();
    this.readwrite = false;
    this.readonly = true;
  }

  radioChangeGratutity(event: any) {

    this.payrollGeneralSettingForm.controls.gratuityPercentage.setValue(null);
    this.payrollGeneralSettingForm.controls.grComponents.setValue(null);


    if (this.payrollGeneralSettingForm.controls.isGratuityEligible.value === 'true') {
      this.payrollGeneralSettingForm.controls.gratuityPercentage.setValidators([Validators.required]);
      this.payrollGeneralSettingForm.controls.grComponents.setValidators([Validators.required]);
    } else {
      this.payrollGeneralSettingForm.controls.gratuityPercentage.clearValidators();
      this.payrollGeneralSettingForm.controls.gratuityPercentage.updateValueAndValidity();
      this.payrollGeneralSettingForm.controls.grComponents.clearValidators();
      this.payrollGeneralSettingForm.controls.grComponents.updateValueAndValidity();
    }
  }

  radioChangePasswordProtect(event: any) {
    if (event.value === 'true') {
      this.showHidePasswordField = true;
      this.payrollGeneralSettingForm.controls.password.setValidators([Validators.required]);
    } else {
      this.showHidePasswordField = false;
      this.payrollGeneralSettingForm.controls.password.setValue(null);
      this.payrollGeneralSettingForm.controls.password.clearValidators();
      this.payrollGeneralSettingForm.controls.password.updateValueAndValidity();
    }
  }

  // radioChangeTotalPaybleStatus(event: any) {
  //   if (event.value === 'true') {
  //     this.showHideTotalPaybleDaysAttdLyfeCycle = false;
  //     this.payrollGeneralSettingForm.controls.payableDays.setValue(null);
  //     this.payrollGeneralSettingForm.controls.payableDaysDenomination.setValue(null);
  //   } else {
  //     this.showHideTotalPaybleDaysAttdLyfeCycle = true;
  //     this.payrollGeneralSettingForm.controls.payableDays.setValue(null);
  //     this.payrollGeneralSettingForm.controls.payableDaysDenomination.setValue(null);
  //   }
  // }

  // onSelectPayrollCalculation(value: any) {
  //   if (value === 'FIXED_DAYS') {
  //     this.showHidePaybleCalculationField = true;
  //   } else {
  //     this.showHidePaybleCalculationField = false;
  //   }
  // }
  onClickApprovalType(value: any) {
    // if (this.payrollGeneralSettingForm.controls.isPayrollApproverAdminUser.value === 'true') {
    //   this.getAllAdminList();
    // }
  }
  cancel() {
    this.cancelFunction();
    // this.readwrite = false;
    // this.readonly = true;
  }

  /***** Search Data Here***** */
  searchGratuityComponents(data: any) {
    console.log('my method called' + data);
    this.optionsData = this.options.filter(option =>
      option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  }
  /*****above code clossed here***** */


  setComponentOnGratuityCalculation() {
    // this.payrollGeneralSettingForm.controls.allowanceId.setValue(this.allowanceId.value);
  }

  getAllTemplates() {
    this.pftTemplateAllowanceList = [];
    this.serviceApi.get('/v1/payroll-settings/get/pf-templates').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Response ----' + element);
            this.pftTemplateAllowanceList.push({
              'pfTemplateId': element.tempId,
              'templateName': element.templateName,
              'allowancesList': element.allowancesList,
              'allowancesName': element.allowancesName,
            });
          });
        } else {
        }
      },
      err => {
      },
      () => { console.log(this.pftTemplateAllowanceList) });
  }

  getAllEmployeeList() {
    return this.serviceApi.get('/v1/employee/user').subscribe(
      res => {
        res.forEach(element => {
          const empFullName = element.empFirstName + ' ' + element.empLastName;
          this.employeeList.push(
            {
              value: element.empCode,
              viewValue: empFullName + '-' + element.empCode
            });
        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }

  getAllAdminList() {
    console.log('Enter in the Function to get All Admin Employee List For Payroll Setting Owner');
    return this.serviceApi.get('/v1/organization/manageadmin/').subscribe(
      res => {
        res.forEach(element => {
          console.log('All Employee List Iterate' + element.empCode + '--' + element.empName);
          this.adminList.push({
            value: element.empCode,
            viewValue: element.empName + ' - ' + element.empCode
          });
        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }

  getAllDetailsForPayrollRunOn() {
    return this.serviceApi.get('/v1/payroll-settings/fixed-allowances').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Retriving the Element On which payroll get Calculated : ' + element.allowanceName);
            this.options.push({ fixedAllowanceId: element.fixedAllowanceId, name: element.allowanceName, type: "Select All" });
          });
        }

      }, err => {
      });
  }

}


@Component({
  templateUrl: 'add-update-pf-template.component.html',
})
export class AddUpdatePFTemplateComponent implements OnInit {
  action: String;
  message: any;
  public pfTemplateForm: FormGroup;
  pftTemplateAllowanceList = [];
  options = [];
  title: any;

  constructor(public dialogRef: MatDialogRef<AddUpdatePFTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.action = data.action;
    this.title = this.data.title;
    this.options = data.options;
    if (data.action === 'add') {
      this.pfTemplateForm = this._fb.group({
        tempId: [],
        allowancesList: ['', [
          Validators.required
        ]],
        templateName: ['', [
          Validators.required,
        ]]
      });
    } else if (data.action === 'update') {
      data.templateInfo.allowancesList
      this.pfTemplateForm = this._fb.group({
        tempId: [data.templateInfo.pfTemplateId],
        allowancesList: [data.templateInfo.allowancesList, Validators.required],
        templateName: [data.templateInfo.templateName, [
          Validators.required,
        ]]
      });
    }


  }
  // compareFn = (a: any, b: any) => a.allowanceId == b.allowanceId;
  ngOnInit() {
  }
  createPFTemplate() {
    if (this.pfTemplateForm.valid) {
      const body = this.pfTemplateForm.value
      this.serviceApi.post('/v1/payroll-settings/pf-template', body).subscribe(
        res => {
          console.log('Template Create Successfully Saved...' + JSON.stringify(res));
          if (res != null) {
            this.message = res.message;
            this.close();
          } else {
          }
        }, err => {
          console.log('Something gone Wrong');
          console.log('err -->' + err);
        }, () => {

        });
    } else {
      Object.keys(this.pfTemplateForm.controls).forEach(field => {
        const control = this.pfTemplateForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  updatePFTemplate() {
    if (this.pfTemplateForm.valid) {
      const body = this.pfTemplateForm.value;
      this.serviceApi.put('/v1/payroll-settings/update/pf-template', body).subscribe(
        res => {
          console.log('Template update Saved...' + JSON.stringify(res));
          if (res != null) {
            this.message = res.message;
            this.close();
          } else {
          }
        }, err => {
          console.log('err -->' + err);
        }, () => {
        });
    } else {
      Object.keys(this.pfTemplateForm.controls).forEach(field => {
        const control = this.pfTemplateForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: 'delete-pf-template.component.html',
})
export class DeletePFTemplateComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeletePFTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(data);
  }
  onDelete() {
    this.serviceApi.delete('/v1/payroll-settings/delete/pf-template/' + this.data.templateInfo.pfTemplateId).subscribe(
      res => {
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
      }, () => { });
  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}