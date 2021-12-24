import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { ApiCommonService } from '../../../../services/api-common.service'
import { element } from 'protractor';
import { Router } from '@angular/router';
import { ValidationMessagesService } from '../../../../validation-messages.service';
declare var $: any;
@Component({
  selector: 'app-edit-ctc-template',
  templateUrl: './edit-ctc-template.component.html',
  styleUrls: ['./edit-ctc-template.component.scss']
})
export class EditCtcTemplateComponent implements OnInit {
  public headerText: any;
  public newCTCTemplateForm: FormGroup;
  public fixedAllowanceForm: FormGroup;
  public fixedDeductionsForm: FormGroup;
  public employeeDeductionsForm: FormGroup;
  public employerContributionsForm: FormGroup;
  // public otherBenefitsForm: FormGroup;
  public variableAllowanceForm: FormGroup;
  public variableDeducationForm: FormGroup;
  public checkBox: FormGroup;
  selectedEmployee = new FormControl();
  myControl = new FormControl();
  panelOpenState = false;
  isLeftVisible = false;
  fixedSalaryAllowance = [];
  variableSalaryDeductions = [];
  variableSalaryAllowance = [];
  fixedSalaryDeductions = [];
  employerContribution = [];
  employeeDeductions = [];
  otherBenefits = [];
  fixedSalaryAllowanceDyn = [];
  variableSalaryAllowanceDyn = [];
  variableDeductionsDyn = [];
  newfixedSalaryAllowance = [];
  newfixedSalaryDeductions = [];
  newEmployerContributions = [];
  newOtherBenefits = [];
  newEmployeeDeductions = [];
  ctcTemplateId: any;
  addCreateButton: boolean;
  updatebutton: boolean;
  saveNewCTC: boolean;
  updateExistCTC: boolean;
  message = [];
  message1 = [];
  indexValue = [];
  selectedIndex: any;
  editFixedAllowanceDependentId = [];
  options = [
    { value: -1, viewValue: 'Gross Salary/CTC', type: '' },
  ];
  optionsData = this.options;
  selectData = [];
  dependentId = [];
  id: number;
  editField: any;
  dependentOnList: any;
  index: any;
  criteriaArr = [
    { value: 'AMOUNT', viewValue: 'Amount' },
    { value: 'PERCENTAGE', viewValue: 'Percentage' },
    // { value: 'AMOUNT', viewValue: 'Manual' },
  ];

  DeductionArr = [
    { value: 'AMOUNT', viewValue: 'Amount' },
    { value: 'PERCENTAGE', viewValue: 'Percentage' },
    // { value: 'AMOUNT', viewValue: 'Manual' },
    // { value: 'AMOUNT', viewValue: 'Manual' },
  ];
  // pfArr = [
  //   { value: '12% Of PF Salary', viewValue: '12% Of PF Salary' },
  //   { value: 'PF Ceiling', viewValue: 'PF Ceiling' },
  // ]

  isValidFormSubmitted = true;
  requiredTextFields;
  requiredDropdownFields;
  notificationMsg: any;
  action: any;
  newVariableDeductions: any[];
  newVariableAllowance = [];
  gratuityIndex: number;

  @ViewChildren('c1') c1: any;

  constructor(private route: ActivatedRoute, private _fb: FormBuilder,
    private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService,
    private router: Router) {
    this.getData();
    // this.getAllVariableAllowance();
    // this.getAllVariableDeduction();
    this.validationMessagesService.currentRequiredTextField.subscribe(message =>
      this.requiredTextFields = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownFields = message);
    this.ctcTemplateId = null;
    this.route.params.subscribe(res => {
      if ((res.id != null) && (res.id !== 'undefined')) {
        this.ctcTemplateId = res.id;
        console.log('Enter in the Edit Section For Id : ' + this.ctcTemplateId);
        this.editCTCFunction(this.ctcTemplateId);
      } else {
        console.log('Enter in the Add Section');
        this.addCTCFunction();
      }
    });

    this.newCTCTemplateForm = this._fb.group({
      templateLabel: ['', [
        Validators.required
      ]],
      ctcTemplateId: []
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
  get fieldMaster(): FormArray {
    return this.fixedAllowanceForm.get('fieldMaster') as FormArray;
  }
  receiveMessage($event) {
    console.log('event' + $event);
    const val = $event.split('=');
    const dependentValue = val[0];
    const final = val[0].split(',');
    let dependentIds = [];
    final.forEach(
      element1 => {
        let dependentId = element1.split('/');
        dependentIds.push({
          value: dependentId[0],
          type: dependentId[1]
        });
      }
    );

    this.index = +val[1];

    const control = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
    const data = <FormGroup>control.at(this.index);
    data.controls.dependentAllowanceIds.setValue(dependentIds);
    this.dependentId = [];
  }
  receiveMessage1($event) {
    console.log('event' + $event);
    const val = $event.split('=');
    const dependentValue = val[0];
    const final = val[0].split(',');
    let dependentIds = [];
    final.forEach(
      element1 => {
        let dependentId = element1.split('/');
        dependentIds.push({
          value: dependentId[0],
          type: dependentId[1]
        });
      }
    );

    this.index = +val[1];

    const control = <FormArray>this.fixedDeductionsForm.controls['fieldMaster'];
    const data = <FormGroup>control.at(this.index);
    data.controls.dependentDeductionIds.setValue(dependentIds);
    this.dependentId = [];
  }
  receiveMessage2($event) {
    console.log('event' + $event);
    const val = $event.split('=');
    const dependentValue = val[0];
    const final = val[0].split(',');
    let dependentIds = [];
    final.forEach(
      element1 => {
        let dependentId = element1.split('/');
        dependentIds.push({
          value: dependentId[0],
          type: dependentId[1]
        });
      }
    );

    this.index = +val[1];

    const control = <FormArray>this.employerContributionsForm.controls['fieldMaster'];
    const data = <FormGroup>control.at(this.gratuityIndex);
    data.controls.allowanceIds.setValue(dependentIds);
    this.dependentId = [];
  }

  ngOnInit() {
    this.initializationFormFunction();
  }

  initializationFormFunction() {
    console.log('ngOnInit Function Call for getting the Form Value');


    this.checkBox = this._fb.group({
    });

    this.fixedAllowanceForm = this._fb.group({
      fieldMaster: this._fb.array([
      ])
    });

    this.fixedDeductionsForm = this._fb.group({
      fieldMaster: this._fb.array([
      ])
    });

    this.employeeDeductionsForm = this._fb.group({
      fieldMaster: this._fb.array([
      ])
    });

    this.employerContributionsForm = this._fb.group({
      fieldMaster: this._fb.array([
      ])
    });
    // this.otherBenefitsForm = this._fb.group({
    //   fieldMaster: this._fb.array([
    //   ])
    // });
    this.variableAllowanceForm = this._fb.group({
      fieldMaster: this._fb.array([
      ])
    });

    this.variableDeducationForm = this._fb.group({
      fieldMaster: this._fb.array([
      ])
    });
  }

  addCTCFunction() {
    console.log('Enter in the Add Function');
    this.addCreateButton = true;
    this.updatebutton = false;
    this.headerText = 'Add New';
  }
  // getAllVariableAllowance() {
  //   this.variableSalaryAllowance = [];
  //   console.log('Enter in the Getting all data of Variable Allowance in table');
  //   this.serviceApi.get('/v1/payroll/settings/allowances/variable').subscribe(
  //     res => {
  //       console.log('Enter in the Successfully Retriving the Data From the Datbase Function And Response >>' + res);
  //       if (res != null) {
  //         this.variableSalaryAllowance = res;
  //       }
  //     }, err => {

  //     }, () => {

  //     }
  //   );
  // }

  // getAllVariableDeduction() {
  //   this.variableSalaryDeductions = [];
  //   console.log('Enter in the Function To get all variable Deductions From Database');
  //   this.serviceApi.get('/v1/payroll/settings/deductions/variable').subscribe(
  //     res => {
  //       console.log('Enter to Retriving Data From Database of Variable Deduction and the Response is ' + res);
  //       if (res != null) {
  //         this.variableSalaryDeductions = res;
  //       }
  //     }, err => {
  //       console.log('Somrthing gone Wrong Of Retriving Variable Deduction');
  //     }, () => {

  //     });
  // }

  editCTCFunction(val: any) {
    this.headerText = 'Edit';
    this.addCreateButton = false;
    this.updatebutton = true;

    let responseJsonData;
    console.log('Enter in the Edit CTC Template Action Mehtod Call : ' + val);
    this.serviceApi.get('/v1/ctc-template/get/' + +val).subscribe(
      res => {
        responseJsonData = res;
      }, err => {
        console.log('Something gone Wrong in the Retriving');
      },
      () => {
        this.newCTCTemplateForm.controls.templateLabel.setValue(responseJsonData.ctcTemplateName);
        this.newCTCTemplateForm.controls.ctcTemplateId.setValue(responseJsonData.ctcTemplateId);
        responseJsonData.ctcFixedAllowanceList.forEach(element => {
          console.log('Length Of the Array is >>>> ' + element.length);
          if (element.fixedAllowanceId != null) {
            const result = element.fixedAllowanceId;
            let dependentAllowanceIds = [];
            if (element.valueType == 'PERCENTAGE') {
              element.headsList.forEach(dependentData => {
                if (dependentData.gross == true) {
                  dependentAllowanceIds.push({
                    value: -1,
                    viewValue: 'Gross Salary/CTC',
                    type: ''
                  });
                } else if (dependentData.fixedAllowanceId != null && dependentData.fixedAllowanceId != 0) {
                  dependentAllowanceIds.push({
                    value: dependentData.fixedAllowanceId,
                    viewValue: dependentData.fixedAllowanceName,
                    type: 'FA'
                  });
                } else if (dependentData.otherBenefitId != null && dependentData.otherBenefitId != 0) {
                  dependentAllowanceIds.push({
                    value: dependentData.otherBenefitId,
                    viewValue: dependentData.otherBenefitName,
                    type: 'OB'
                  });
                }
              });
            }
            this.fixedSalaryAllowance.forEach(element1 => {
              if (result === element1.allowanceId) {
                element1.dependentAllowanceIds = dependentAllowanceIds;
                element1.fieldValue = true;
                element1.criteria = element.valueType;
                element1.value = element.value;
                element1.minimumAmount = element.minAmountValue;
                element1.id = element.id;
                this.fixedSalaryAllowanceDyn.push(element1);
              }
            });
          }
          if (element.otherBenefitId != null) {
            const result = element.otherBenefitId;
            let dependentAllowanceIds = [];
            if (element.valueType == 'PERCENTAGE') {
              element.ctcOtherBenefitsHeads.forEach(dependentData => {
                if (dependentData.gross == true) {
                  dependentAllowanceIds.push({
                    value: -1,
                    viewValue: 'Gross Salary/CTC',
                    type: ''
                  });
                } else if (dependentData.fixedAllowanceId != null && dependentData.fixedAllowanceId != 0) {
                  dependentAllowanceIds.push({
                    value: dependentData.fixedAllowanceId,
                    viewValue: dependentData.fixedAllowanceName,
                    type: 'FA'
                  });
                } else if (dependentData.otherBenefitId != null && dependentData.otherBenefitId != 0) {
                  dependentAllowanceIds.push({
                    value: dependentData.otherBenefitId,
                    viewValue: dependentData.otherBenefitName,
                    type: 'OB'
                  });
                }
              });
            }
            this.otherBenefits.forEach(element1 => {
              if (result === element1.allowanceId) {
                element1.dependentAllowanceIds = dependentAllowanceIds;
                element1.fieldValue = true;
                element1.criteria = element.valueType;
                element1.value = element.value;
                element1.minimumAmount = element.minAmountValue;
                // this.otherBenefits.push(element1);
                element1.id = element.id

              }
            });
          }
          // this.editFixedAllowanceDependentId.push(element.fixedAllowance);
        });

        responseJsonData.ctcFixedDeductions.forEach(element => {
          const result = element.fixedDeductionId;
          let dependentAllowanceIds = [];
          if (element.valueType == 'PERCENTAGE') {
            element.deductionHeads.forEach(dependentData => {
              if (dependentData.gross == true) {
                dependentAllowanceIds.push({
                  value: -1,
                  viewValue: 'Gross Salary/CTC',
                  type: ''
                });
              } else if (dependentData.fixedAllowanceId != null && dependentData.fixedAllowanceId != 0) {
                dependentAllowanceIds.push({
                  value: dependentData.fixedAllowanceId,
                  viewValue: dependentData.fixedAllowanceName,
                  type: 'FA'
                });
              } else if (dependentData.otherBenefitId != null && dependentData.otherBenefitId != 0) {
                dependentAllowanceIds.push({
                  value: dependentData.otherBenefitId,
                  viewValue: dependentData.otherBenefitName,
                  type: 'OB'
                });
              }
            });
          }
          console.log('Enter in the Edit function and the Respose Api value : ' + result);
          this.fixedSalaryDeductions.forEach(element1 => {
            if (result === element1.deductionid) {
              element1.dependentAllowanceIds = dependentAllowanceIds;
              element1.fieldValue = true;
              element1.criteria = element.valueType;
              element1.value = element.value;
              element1.minimumAmount = element.minAmountValue;
              element1.id = element.ctcFixedDeductionId
            }
          });
        });

        this.employeeDeductions.forEach(element1 => {
          if (element1.employeeDeductionName == 'PF Employee Deduction' && responseJsonData.pfDeductible == true) {
            element1.fieldValue = true;
          }
          if (element1.employeeDeductionName == 'LWF Employee Deduction' && responseJsonData.lwfdeductible == true) {
            element1.fieldValue = true;
          }
          if (element1.employeeDeductionName == 'ESIC Employee Deduction' && responseJsonData.esicDeductible == true) {
            element1.fieldValue = true;
          }
          if (element1.employeeDeductionName == 'PT Deduction' && responseJsonData.ptdeductible == true) {
            element1.fieldValue = true;
          }
          if (element1.employeeDeductionName == 'Income Tax Deduction' && responseJsonData.incomeTaxDeductible == true) {
            element1.fieldValue = true;
          }
        });
        this.employerContribution.forEach(element1 => {
          if (element1.employerContributionName == 'PF Employer Contribution' && responseJsonData.pfDeductible == true) {
            element1.fieldValue = true;
          }
          if (element1.employerContributionName == 'LWF Employer Contribution' && responseJsonData.lwfdeductible == true) {
            element1.fieldValue = true;
          }
          if (element1.employerContributionName == 'ESIC Employer Contribution' && responseJsonData.esicDeductible == true) {
            element1.fieldValue = true;
          }
          if (element1.employerContributionName == 'Gratuity' && responseJsonData.gratuityDeductible == true) {
            let dependentAllowanceIds = [];
            responseJsonData.ctcGratuityComponents.forEach(dependentData => {
              if (dependentData.gross == true) {
                dependentAllowanceIds.push({
                  value: -1,
                  viewValue: 'Gross Salary/CTC',
                  type: ''
                });
              } else if (dependentData.fixedAllowanceId != null && dependentData.fixedAllowanceId != 0) {
                dependentAllowanceIds.push({
                  value: dependentData.fixedAllowanceId,
                  viewValue: dependentData.fixedAllowanceName,
                  type: 'FA'
                });
              } else if (dependentData.otherBenefitId != null && dependentData.otherBenefitId != 0) {
                dependentAllowanceIds.push({
                  value: dependentData.otherBenefitId,
                  viewValue: dependentData.otherBenefitName,
                  type: 'OB'
                });
              }
            });

            element1.allowanceIds = dependentAllowanceIds;
            element1.fieldValue = true;
            element1.value = responseJsonData.gratuityPercent;
          }
        });
      }
    );

  }
  searchEmployeeName(data: any) {
    console.log('My method called >>>>> ' + data);
  }
  activeInputField(index: any) {
    console.log('-------------' + index);
    this.options = [
      { value: -1, viewValue: 'Gross Salary/CTC', type: '' },
    ];
    this.indexValue = index;
    console.log(this.fixedAllowanceForm.controls.fieldMaster.value[index].criteria);
    this.selectedIndex = index;
    for (let i = 0; i <= index; i++) {
      const control = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
      const data = <FormGroup>control.at(i);
      if (this.fixedAllowanceForm.controls.fieldMaster.value[i].criteria === 'AMOUNT') {
        data.controls.dependentAllowanceIds.setValue([]);
      }
      console.log(this.fixedAllowanceForm);
      const resultObject = this.exists(this.fixedAllowanceForm.controls.fieldMaster.value[i].fixedAllowance, this.options);
      if (resultObject) {
        console.log('option already exists');
        data.controls.dropdownElemnets.patchValue(this.options);
      } else {
        if (index > i) {
          this.options.push({
            value: this.fixedAllowanceForm.controls.fieldMaster.value[i].fixedAllowance.allowanceId,
            viewValue: this.fixedAllowanceForm.controls.fieldMaster.value[i].fixedAllowance.allowanceName,
            type: this.fixedAllowanceForm.controls.fieldMaster.value[i].fixedAllowance.type
          });
        }
        data.controls.dropdownElemnets.patchValue(this.options);

      }
      console.log(data.controls.dropdownElemnets.value)
    }
    const control1 = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
    const data = <FormGroup>control1.at(index);
    data.controls.value.clearValidators();
    data.controls.value.updateValueAndValidity();
    data.controls.value.reset();
    data.controls.value.setValidators(Validators.required);
    data.controls.value.updateValueAndValidity();

    let control = this.fixedAllowanceForm.controls.fieldMaster.value[this.selectedIndex];
    let sameDataExist = this.exists(control.fixedAllowance, control.dropdownElemnets);
    if (sameDataExist) {
      let optionData = {
        value: this.fixedAllowanceForm.controls.fieldMaster.value[this.selectedIndex].fixedAllowance.allowanceId,
        viewValue: this.fixedAllowanceForm.controls.fieldMaster.value[this.selectedIndex].fixedAllowance.allowanceName,
        type: this.fixedAllowanceForm.controls.fieldMaster.value[this.selectedIndex].fixedAllowance.type
      };
      let dataIndex;
      control.dropdownElemnets.forEach(element => {
        if (element.value == optionData.value && element.type == optionData.type) {
          dataIndex = control.dropdownElemnets.indexOf(element);
        }
      });
      control.dropdownElemnets.splice(dataIndex, 1);
    }
  }
  activeInputField1(index: any) {
    console.log('-------------' + index);
    this.indexValue = index;
    //   console.log(this.fixedDeductionsForm.controls.fieldMaster.value[index].criteria);
    //   this.selectedIndex = index;
    for (let i = 0; i <= index; i++) {
      if (this.fixedDeductionsForm.controls.fieldMaster.value[i].criteria === 'AMOUNT') {
        const control = <FormArray>this.fixedDeductionsForm.controls['fieldMaster'];
        const data = <FormGroup>control.at(i);
        data.controls.dependentDeductionIds.setValue([]);
      }
    }
    const control = <FormArray>this.fixedDeductionsForm.controls['fieldMaster'];
    const data = <FormGroup>control.at(index);
    data.controls.value.clearValidators();
    data.controls.value.updateValueAndValidity();
    data.controls.value.reset();
    data.controls.value.setValidators(Validators.required);
    data.controls.value.updateValueAndValidity();
  }
  dropdownOfAllwoances() {
    this.newfixedSalaryAllowance.forEach(allowance => {
      if (allowance.fieldValue == true) {
        this.message1.push({
          value: allowance.allowanceId,
          viewValue: allowance.allowanceName,
          type: allowance.type
        })
      }
    });
  }
  exists(allowance, myArray) {
    let exists: Boolean = false;
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].value === allowance.allowanceId && myArray[i].type === allowance.type) {
        exists = true;
      }
    }
    return exists;
  }
  checkfixedAllowanceExits(nameKey, myArray) {
    console.log(nameKey);
    let exists: Boolean = false;
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].allowanceId === nameKey.allowanceId && myArray[i].type == nameKey.type) {
        exists = true;
      } else {

      }
    }
    return exists;
  }
  // proccedNextStepAdd() {
  //   this.initializationFormFunction();

  //   if (this.newCTCTemplateForm.valid) {
  //     this.isValidFormSubmitted = true;
  //     this.isLeftVisible = true;
  //     this.saveNewCTC = true;
  //     this.updateExistCTC = false;


  //     this.newEmployeeDeductions = [];
  //     this.newEmployerContributions = [];
  //     this.newfixedSalaryAllowance = [];
  //     this.newfixedSalaryDeductions = [];
  //     this.newVariableDeductions = [];
  //     this.newVariableAllowance = [];

  //     this.fixedSalaryAllowanceDyn.forEach(element => {
  //       if (element.fieldValue === true && this.fixedSalaryAllowanceDyn.indexOf(element) < (this.fixedSalaryAllowanceDyn.length - 1)) {
  //         this.newfixedSalaryAllowance.push(element);
  //         console.log(this.newfixedSalaryAllowance.length);
  //       }
  //     });

  //     this.otherBenefits.forEach(element => {
  //       if (element.fieldValue === true) {
  //         this.newfixedSalaryAllowance.push(element);
  //       }
  //     });

  //     this.fixedSalaryAllowanceDyn.forEach(element => {
  //       if (element.fieldValue === true && this.fixedSalaryAllowanceDyn.indexOf(element) == (this.fixedSalaryAllowanceDyn.length - 1)) {
  //         this.newfixedSalaryAllowance.push(element);
  //         console.log(this.newfixedSalaryAllowance.length);
  //       }
  //     });

  //     this.fixedSalaryDeductions.forEach(element => {
  //       if (element.fieldValue === true) {
  //         this.newfixedSalaryDeductions.push(element);
  //       }
  //     });
  //     this.employerContribution.forEach(element => {
  //       if (element.fieldValue === true) {
  //         this.newEmployerContributions.push(element);
  //       }
  //     });
  //     this.employeeDeductions.forEach(element => {
  //       if (element.fieldValue === true) {
  //         this.newEmployeeDeductions.push(element);
  //       }
  //     });

  //     this.variableDeductionsDyn.forEach(element => {
  //       if (element.fieldValue === true) {
  //         this.newVariableDeductions.push(element);
  //       }
  //     });

  //     this.variableSalaryAllowanceDyn.forEach(element => {
  //       if (element.fieldValue === true) {
  //         this.newVariableAllowance.push(element);
  //       }
  //     });


  //     // End of  SET aLL selected Value from First form To Second Form

  //     this.newfixedSalaryAllowance.forEach(data => {
  //       console.log(data);
  //       const control = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
  //       console.log('-----------------------------------------------' + control.value + '---' + data);
  //       if (this.newfixedSalaryAllowance.indexOf(data) == (this.newfixedSalaryAllowance.length - 1)) {
  //         // const fAExists = this.checkfixedAllowanceExits(data.allowanceId, control.value);
  //         control.push(
  //           this._fb.group({
  //             'criteria': ['BALANCE'],
  //             'dependentAllowanceIds': [[]],
  //             'fixedAllowance': this._fb.group({
  //               'allowanceId': [data.allowanceId],
  //               'allowESIC': [data.allowESIC],
  //               'allowExempt': [data.allowExempt],
  //               'allowIncomeTax': [data.allowIncomeTax],
  //               'allowLWF': [data.allowLWF],
  //               'allowPF': [data.allowPF],
  //               'allowProfessionalTax': [data.allowProfessionalTax],
  //               'allowanceName': [data.allowanceName],
  //               'exemptLimit': [data.exemptLimit],
  //               'isDefaultAllowance': [data.isDefaultAllowance],
  //               'paymentFrequency': [data.paymentFrequency],
  //               'showInCTC': [data.showInCTC],
  //               'type': [data.type],
  //             }),
  //             'minimumAmount': [],
  //             'value': []
  //           })
  //         );
  //       } else {
  //         // const control = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
  //         console.log(data);
  //         // const fAExists = this.checkfixedAllowanceExits(data.allowanceId, control.value);
  //         control.push(
  //           this._fb.group({
  //             'criteria': ['AMOUNT', [Validators.required]],
  //             'dependentAllowanceIds': [[]],
  //             'fixedAllowance': this._fb.group({
  //               'allowanceId': [data.allowanceId],
  //               'allowESIC': [data.allowESIC],
  //               'allowExempt': [data.allowExempt],
  //               'allowIncomeTax': [data.allowIncomeTax],
  //               'allowLWF': [data.allowLWF],
  //               'allowPF': [data.allowPF],
  //               'allowProfessionalTax': [data.allowProfessionalTax],
  //               'allowanceName': [data.allowanceName],
  //               'exemptLimit': [data.exemptLimit],
  //               'isDefaultAllowance': [data.isDefaultAllowance],
  //               'paymentFrequency': [data.paymentFrequency],
  //               'showInCTC': [data.showInCTC],
  //               'type': [data.type],
  //             }),
  //             'minimumAmount': [data.minimumAmount],
  //             'value': [data.value]
  //           })
  //         );
  //       }
  //     });
  //     this.newfixedSalaryDeductions.forEach(data => {
  //       const control = <FormArray>this.fixedDeductionsForm.controls['fieldMaster'];
  //       control.push(
  //         this._fb.group({
  //           criteria: ['AMOUNT', [Validators.required]],
  //           dependentDeductionIds: [[]],
  //           fixedDeduction: this._fb.group({
  //             deductionId: [data.deductionid],
  //             deductionName: [data.deductionName],
  //             type: [data.type]
  //           }),
  //           minimumAmount: [data.minimumAmount],
  //           value: [data.value]
  //         })
  //       );
  //     });


  //     this.newEmployerContributions.forEach(data => {
  //       const control = <FormArray>this.employerContributionsForm.controls['fieldMaster'];
  //       control.push(
  //         this._fb.group({
  //           // criteria: [data.criteria],
  //           allowanceIds: [data.allowanceIds],
  //           // employerContributionId: [data.employerContributionId],
  //           employerContributionName: [data.employerContributionName],
  //           value: [data.value]
  //         })
  //       );

  //       if (data.employerContributionName == 'Gratuity') {
  //         this.gratuityIndex = this.newEmployerContributions.indexOf(data);
  //       }
  //     });


  //     this.newEmployeeDeductions.forEach(data => {
  //       const control = <FormArray>this.employeeDeductionsForm.controls['fieldMaster'];
  //       control.push(
  //         this._fb.group({
  //           // criteria: [data.criteria],
  //           // deductionIds: [data.deductionIds],
  //           // employeeDeductionId: [data.employeeDeductionId],
  //           employeeDeductionName: [data.employeeDeductionName],
  //           value: [data.value]
  //         })
  //       );
  //     });
  //     // this.newOtherBenefits.forEach(data => {
  //     //   const control = <FormArray>this.otherBenefitsForm.controls['fieldMaster'];
  //     //   control.push(
  //     //     this._fb.group({
  //     //       criteria: [data.criteria],
  //     //       otherBenefitId: [data.deductionIds],
  //     //       // employeeDeductionId: [data.employeeDeductionId],
  //     //       otherBenefitName: [data.otherBenefitName],
  //     //       value: [data.value]
  //     //     })
  //     //   );
  //     // });
  //     this.newVariableAllowance.forEach(data => {
  //       const control = <FormArray>this.variableAllowanceForm.controls['fieldMaster'];
  //       control.push(
  //         this._fb.group({
  //           criteria: ['AMOUNT'],
  //           variableAllowance: this._fb.group({
  //             allowanceId: [data.allowanceId],
  //             allowanceName: [data.allowanceName]
  //           }),


  //           // employeeDeductionName: [data.employeeDeductionName],
  //           // value: [data.value]
  //         })
  //       );
  //     });


  //     this.newVariableDeductions.forEach(data => {
  //       const control = <FormArray>this.variableDeducationForm.controls['fieldMaster'];
  //       control.push(
  //         this._fb.group({
  //           criteria: ['AMOUNT'],

  //           // employeeDeductionId: [data.employeeDeductionId],

  //           variableDeduction: this._fb.group({
  //             deductionId: [data.deductionId],
  //             deductionName: [data.deductionName],
  //           }),
  //           // value: [data.value]
  //         })
  //       );
  //     });


  //     this.dropdownOfAllwoances();
  //   } else {
  //     Object.keys(this.newCTCTemplateForm.controls).forEach(field => { // {1}
  //       const control = this.newCTCTemplateForm.get(field);            // {2}
  //       control.markAsTouched({ onlySelf: true });       // {3}
  //     });
  //   }
  // }
  proccedNextStepUpdate() {
    console.log('Enter for Proceeding Next Step for Update');
    this.initializationFormFunction();

    if (this.newCTCTemplateForm.valid) {
      this.isValidFormSubmitted = true;
      this.isLeftVisible = true;
      this.saveNewCTC = false;
      this.updateExistCTC = true;

      this.editField = 'editField';

      this.newEmployeeDeductions = [];
      this.newEmployerContributions = [];
      this.newfixedSalaryAllowance = [];
      this.newfixedSalaryDeductions = [];
      this.newVariableDeductions = [];

      this.fixedSalaryAllowanceDyn.forEach(element => {
        if (element.fieldValue === true && element.allowanceType != 'SPECIAL') {
          this.newfixedSalaryAllowance.push(element);
          console.log(this.newfixedSalaryAllowance.length);
        }
      });

      this.otherBenefits.forEach(element => {
        if (element.fieldValue === true) {
          this.newfixedSalaryAllowance.push(element);
        }
      });

      this.fixedSalaryAllowanceDyn.forEach(element => {
        if (element.fieldValue === true && element.allowanceType == 'SPECIAL') {
          this.newfixedSalaryAllowance.push(element);
          console.log(this.newfixedSalaryAllowance.length);
        }
      });


      this.fixedSalaryDeductions.forEach(element => {
        if (element.fieldValue === true) {
          this.newfixedSalaryDeductions.push(element);
        }
      });
      this.employerContribution.forEach(element => {
        if (element.fieldValue === true) {
          this.newEmployerContributions.push(element);
        }
      });
      this.employeeDeductions.forEach(element => {
        if (element.fieldValue === true) {
          this.newEmployeeDeductions.push(element);
        }
      });

      this.variableDeductionsDyn.forEach(element => {
        if (element.fieldValue === true) {
          this.newVariableDeductions.push(element);
        }
      });

      this.variableSalaryAllowanceDyn.forEach(element => {
        if (element.fieldValue === true) {
          this.newVariableAllowance.push(element);
        }
      });
      // // End of  SET aLL selected Value from First form To Second Form

      this.newfixedSalaryAllowance.forEach(data => {
        console.log(data);
        this.editFixedAllowanceDependentId.push(data);
        const control = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
        console.log('-----------------------------------------------' + control.value + '---' + data);
        if (this.newfixedSalaryAllowance.indexOf(data) == (this.newfixedSalaryAllowance.length - 1)) {
          // const fAExists = this.checkfixedAllowanceExits(data.allowanceId, control.value);
          control.push(
            this._fb.group({
              'criteria': ['BALANCE'],
              'dependentAllowanceIds': [[]],
              'fixedAllowance': this._fb.group({
                'ctcAllowanceId': [data.id],
                'allowanceId': [data.allowanceId],
                'allowESIC': [data.allowESIC],
                'allowExempt': [data.allowExempt],
                'allowIncomeTax': [data.allowIncomeTax],
                'allowLWF': [data.allowLWF],
                'allowPF': [data.allowPF],
                'allowProfessionalTax': [data.allowProfessionalTax],
                'allowanceName': [data.allowanceName],
                'exemptLimit': [data.exemptLimit],
                'isDefaultAllowance': [data.isDefaultAllowance],
                'paymentFrequency': [data.paymentFrequency],
                'showInCTC': [data.showInCTC],
                'type': [data.type],
              }),
              'minimumAmount': [],
              'value': [],
              'dropdownElemnets': []
            })
          );
        } else {
          if (data.criteria === 'BALANCE') {
            control.push(
              this._fb.group({
                'criteria': [null, [Validators.required]],
                'dependentAllowanceIds': [data.dependentAllowanceIds],
                'fixedAllowance': this._fb.group({
                  'ctcAllowanceId': [data.id],
                  'allowanceId': [data.allowanceId],
                  'allowESIC': [data.allowESIC],
                  'allowExempt': [data.allowExempt],
                  'allowIncomeTax': [data.allowIncomeTax],
                  'allowLWF': [data.allowLWF],
                  'allowPF': [data.allowPF],
                  'allowProfessionalTax': [data.allowProfessionalTax],
                  'allowanceName': [data.allowanceName],
                  'exemptLimit': [data.exemptLimit],
                  'isDefaultAllowance': [data.isDefaultAllowance],
                  'paymentFrequency': [data.paymentFrequency],
                  'showInCTC': [data.showInCTC],
                  'type': [data.type],
                }),
                'minimumAmount': [data.minimumAmount],
                'value': [data.value, [Validators.required]],
                'dropdownElemnets': []
              })
            );
          } else {
            control.push(
              this._fb.group({
                'criteria': [data.criteria, [Validators.required]],
                'dependentAllowanceIds': [data.dependentAllowanceIds],
                'fixedAllowance': this._fb.group({
                  'ctcAllowanceId': [data.id],
                  'allowanceId': [data.allowanceId],
                  'allowESIC': [data.allowESIC],
                  'allowExempt': [data.allowExempt],
                  'allowIncomeTax': [data.allowIncomeTax],
                  'allowLWF': [data.allowLWF],
                  'allowPF': [data.allowPF],
                  'allowProfessionalTax': [data.allowProfessionalTax],
                  'allowanceName': [data.allowanceName],
                  'exemptLimit': [data.exemptLimit],
                  'isDefaultAllowance': [data.isDefaultAllowance],
                  'paymentFrequency': [data.paymentFrequency],
                  'showInCTC': [data.showInCTC],
                  'type': [data.type],
                }),
                'minimumAmount': [data.minimumAmount],
                'value': [data.value, [Validators.required]],
                'dropdownElemnets': []
              })
            );
          }
        }
      });
      const control = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
      control.value.forEach(element => {
        if (element.criteria == 'PERCENTAGE') {
          this.options = [
            { value: -1, viewValue: 'Gross Salary/CTC', type: '' },
          ];
          let index = control.value.indexOf(element);
          for (let i = 0; i < index; i++) {
            this.options.push({
              value: this.fixedAllowanceForm.controls.fieldMaster.value[i].fixedAllowance.allowanceId,
              viewValue: this.fixedAllowanceForm.controls.fieldMaster.value[i].fixedAllowance.allowanceName,
              type: this.fixedAllowanceForm.controls.fieldMaster.value[i].fixedAllowance.type
            });
          }
          let form = <FormGroup>control.controls[index];
          form.controls['dropdownElemnets'].setValue(this.options);
          element.dropdownElemnets = this.options;
        }
      });

      this.newfixedSalaryDeductions.forEach(data => {
        const control = <FormArray>this.fixedDeductionsForm.controls['fieldMaster'];
        control.push(
          this._fb.group({
            criteria: [data.criteria, [Validators.required]],
            dependentDeductionIds: [data.dependentAllowanceIds],
            fixedDeduction: this._fb.group({
              ctcFixedDeductionId: [data.id],
              deductionId: [data.deductionid],
              deductionName: [data.deductionName],
              type: [data.type]
            }),
            minimumAmount: [data.minimumAmount],
            value: [data.value, [Validators.required]]
          })
        );
      });

      this.newEmployerContributions.forEach(data => {
        const control = <FormArray>this.employerContributionsForm.controls['fieldMaster'];
        if (data.employerContributionName == 'Gratuity') {
          this.gratuityIndex = this.newEmployerContributions.indexOf(data);
          control.push(
            this._fb.group({
              // criteria: [data.criteria],
              allowanceIds: [data.allowanceIds],
              // employerContributionId: [data.employerContributionId],
              employerContributionName: [data.employerContributionName],
              value: [data.value, [Validators.required]]
            })
          );
        } else {
          control.push(
            this._fb.group({
              // criteria: [data.criteria],
              allowanceIds: [data.allowanceIds],
              // employerContributionId: [data.employerContributionId],
              employerContributionName: [data.employerContributionName],
              value: [data.value]
            })
          );
        }
      });

      this.newEmployeeDeductions.forEach(data => {
        const control = <FormArray>this.employeeDeductionsForm.controls['fieldMaster'];
        control.push(
          this._fb.group({
            // criteria: [data.criteria],
            // deductionIds: [data.deductionIds],
            // employeeDeductionId: [data.employeeDeductionId],
            employeeDeductionName: [data.employeeDeductionName],
            value: [data.value]
          })
        );
      });
      // this.newOtherBenefits.forEach(data => {
      //   const control = <FormArray>this.otherBenefitsForm.controls['fieldMaster'];
      //   control.push(
      //     this._fb.group({
      //       criteria: [data.criteria],
      //       otherBenefitId: [data.deductionIds],
      //       // employeeDeductionId: [data.employeeDeductionId],
      //       otherBenefitName: [data.otherBenefitName],
      //       value: [data.value]
      //     })
      //   );
      // });
      // this.newVariableAllowance.forEach(data => {
      //   const control = <FormArray>this.variableAllowanceForm.controls['fieldMaster'];
      //   control.push(
      //     this._fb.group({
      //       criteria: ['AMOUNT'],
      //       variableAllowance: this._fb.group({
      //         allowanceId: [data.allowanceId],
      //         allowanceName: [data.allowanceName]
      //       }),


      //       // employeeDeductionName: [data.employeeDeductionName],
      //       // value: [data.value]
      //     })
      //   );
      // });


      // this.newVariableDeductions.forEach(data => {
      //   const control = <FormArray>this.variableDeducationForm.controls['fieldMaster'];
      //   control.push(
      //     this._fb.group({
      //       criteria: ['AMOUNT'],

      //       // employeeDeductionId: [data.employeeDeductionId],

      //       variableDeduction: this._fb.group({
      //         deductionId: [data.deductionId],
      //         deductionName: [data.deductionName],
      //       }),
      //       // value: [data.value]
      //     })
      //   );
      // });


      this.dropdownOfAllwoances();


    } else {
      Object.keys(this.newCTCTemplateForm.controls).forEach(field => { // {1}
        const control = this.newCTCTemplateForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  onClickCheckedFixedAllowance(event: any, allowanceName: any) {
    console.log('Enter to checked the Fixed Allowance Data >> ' + event.checked);
    this.fixedAllowanceForm.reset();
    if (event.checked) {

      this.fixedSalaryAllowance.forEach(element => {
        if (element.allowanceName === allowanceName) {
          element.fieldValue = event.checked;
          let exists = this.checkfixedAllowanceExits(element, this.fixedSalaryAllowanceDyn)
          if (exists) {
            this.fixedSalaryAllowanceDyn.forEach(element => {
              if (element.allowanceName === allowanceName) {
                element.fieldValue = event.checked;
              }
            });
          } else {
            this.fixedSalaryAllowanceDyn.push({
              'allowanceId': element.allowanceId,
              'fieldValue': event.checked,
              'allowanceName': allowanceName,
              'type': 'FA'
            });
          }


        }
      });
    } else {
      console.log('Not Selected');
      this.fixedSalaryAllowanceDyn.forEach(element => {
        if (element.allowanceName === allowanceName) {
          element.fieldValue = false;
        }
      });
      this.fixedSalaryAllowance.forEach(element => {
        if (element.allowanceName === allowanceName) {
          element.fieldValue = false;
        }
      });
    }
  }

  onClickCheckedVariableAllowance(event: any, allowanceName: any) {
    this.fixedAllowanceForm.reset();
    console.log(this.variableSalaryAllowance);
    if (event.checked) {

      this.variableSalaryAllowance.forEach(element => {
        if (element.allowanceName === allowanceName) {
          element.fieldValue = event.checked;
          this.variableSalaryAllowanceDyn.push({
            'allowanceId': element.allowanceId,
            'fieldValue': event.checked,
            'allowanceName': allowanceName
          });

        }
      });
    } else {
      console.log('Not Selected');
      this.variableSalaryAllowanceDyn.forEach(element => {
        if (element.allowanceName === allowanceName) {
          element.fieldValue = false;
        }
      });
      this.variableSalaryAllowance.forEach(element => {
        if (element.allowanceName === allowanceName) {
          element.fieldValue = false;
        }
      });
    }

  }

  onClickCheckedVariableDeducations(event: any, variableDeduction: any) {

    if (event.checked) {
      this.variableSalaryDeductions.forEach(element => {
        if (element.deductionName === variableDeduction) {
          console.log(element);
          element.fieldValue = event.checked;
          this.variableDeductionsDyn.push({
            'deductionId': element.deductionId,
            'fieldValue': event.checked,
            'deductionName': element.deductionName
          });
        }
      });
    } else {
      console.log('Not Selected');
      this.variableDeductionsDyn.forEach(element => {
        if (element.deductionName === variableDeduction) {
          element.fieldValue = false;
        }
      });
      this.variableSalaryDeductions.forEach(element => {
        if (element.deductionName === variableDeduction) {
          element.fieldValue = false;
        }
        console.log(element);
      });
    }
  }

  onClickCheckedEmployerContribution(event: any, employerContribution: any) {
    console.log(event);
    console.log(employerContribution);
    var employerContributionName = employerContribution.employerContributionName;
    this.employerContribution.forEach(element => {
      console.log('Name Of Allowance : ' + employerContributionName);
      if (element.employerContributionName === employerContributionName) {
        element.fieldValue = event.checked;
      }
    });
    if (employerContribution.type != undefined) {
      this.employeeDeductions.forEach(element => {
        if (element.type === employerContribution.type) {
          element.fieldValue = event.checked;
        }
      })
    }


  }
  onClickCheckedEmployeDeduction(event: any, employeeDeduction: any) {
    var employeeDeductionName = employeeDeduction.employeeDeductionName;
    this.employeeDeductions.forEach(element => {
      if (element.employeeDeductionName === employeeDeductionName) {
        console.log(element.employeeDeductionName);
        element.fieldValue = event.checked;
      }
    });
    if (employeeDeduction.type != undefined) {
      this.employerContribution.forEach(element => {
        if (element.type === employeeDeduction.type) {
          element.fieldValue = event.checked;
        }
      })
    }
  }
  onClickCheckedOtherBenefits(event: any, otherBenefitName: any) {
    this.otherBenefits.forEach(element => {
      if (element.allowanceName === otherBenefitName) {
        console.log(element.otherBenefitName);
        element.fieldValue = event.checked;
      }
    });
  }
  onClickChekedFixedSalaryDeduction(event: any, deductionName: any) {
    this.fixedSalaryDeductions.forEach(element => {
      if (element.deductionName === deductionName) {
        element.fieldValue = event.checked;
      }
    });
  }
  deleteVariableDeduction(deductionName: any) {
    this.variableSalaryDeductions.forEach(element1 => {
      if (element1.deductionName === deductionName) {
        element1.fieldValue = false;
      }
    });
    console.log(this.variableDeductionsDyn);
    this.variableDeductionsDyn.forEach(element1 => {
      if (element1.deductionName === deductionName) {
        element1.fieldValue = false;
      }
    });

  }
  deleteVariableAllowance(allowanceName: any) {
    console.log(this.variableSalaryAllowance);
    this.variableSalaryAllowance.forEach(element1 => {
      if (element1.allowanceName === allowanceName) {
        element1.fieldValue = false;
      }
    });
    console.log(this.variableSalaryAllowanceDyn);
    this.variableSalaryAllowanceDyn.forEach(element1 => {
      if (element1.allowanceName === allowanceName) {
        element1.fieldValue = false;
      }
    });

  }
  deleteFixedAllowance(allowanceName: any) {
    console.log('delete allowance -->');
    this.fixedSalaryAllowance.forEach(element1 => {
      if (element1.allowanceName === allowanceName) {
        element1.fieldValue = false;
      }
    });
    this.fixedSalaryAllowanceDyn.forEach(element1 => {
      if (element1.allowanceName === allowanceName) {
        element1.fieldValue = false;
      }
    });
  }

  deleteEmployerContribution(employerContribution: any) {
    this.employerContribution.forEach(element => {
      if (element.employerContributionName === employerContribution.employerContributionName) {
        element.fieldValue = false;
      }
    });
    if (employerContribution.type != undefined) {
      this.employeeDeductions.forEach(element => {
        if (element.type === employerContribution.type) {
          element.fieldValue = false;
        }
      });
    }
  }

  deleteEmployerDeduction(employeeDeduction: any) {
    this.employeeDeductions.forEach(element => {
      if (element.employeeDeductionName === employeeDeduction.employeeDeductionName) {
        element.fieldValue = false;
      }
    });
    if (employeeDeduction.type != undefined) {
      this.employerContribution.forEach(element => {
        if (element.type === employeeDeduction.type) {
          element.fieldValue = false;
        }
      });
    }
  }

  deleteOtherBenfits(otherBenefitName: any) {
    this.otherBenefits.forEach(element => {
      if (element.allowanceName === otherBenefitName) {
        element.fieldValue = false;
      }
    });
  }

  deleteFixedSalaryDeduction(deductionName: any) {
    this.fixedSalaryDeductions.forEach(element => {
      if (element.deductionName === deductionName) {
        element.fieldValue = false;
      }
    });
  }

  getData() {
    this.getAllFixedAllowance();
    this.getAllFixedDeduction();
    this.getAllEmployerContribution();
    this.getAllEmployeeDeduction();
    this.getAllOtherBenefits()
  }
  // Getting Methods of All Fields Shoing in the Screen For Checked
  getAllFixedAllowance() {
    this.fixedSalaryAllowance = [];
    this.serviceApi.get('/v1/payroll-settings/fixed-allowances').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            if (element.allowanceType == 'SPECIAL') {
              this.fixedSalaryAllowance.push({
                'id': element.id,
                'allowanceId': element.fixedAllowanceId,
                'allowanceName': element.allowanceName,
                'allowanceType': element.allowanceType,
                'fieldValue': true,
                'isDefaultAllowance': element.isDefault,
                'allowPF': element.pfEnable,
                'allowESIC': element.esicEnable,
                'allowLWF': element.lwfEnable,
                'allowProfessionalTax': element.pfEnable,
                'allowIncomeTax': element.tdsEnable,
                'type': 'FA'
              });
            } else {
              this.fixedSalaryAllowance.push({
                'id': element.id,
                'allowanceId': element.fixedAllowanceId,
                'allowanceName': element.allowanceName,
                'allowanceType': element.allowanceType,
                'fieldValue': false,
                'isDefaultAllowance': element.isDefault,
                'allowPF': element.pfEnable,
                'allowESIC': element.esicEnable,
                'allowLWF': element.lwfEnable,
                'allowProfessionalTax': element.pfEnable,
                'allowIncomeTax': element.tdsEnable,
                'type': 'FA'
              });
            }
          });
        }
      });
  }

  getAllFixedDeduction() {
    this.fixedSalaryDeductions = [];
    this.serviceApi.get('/v1/payroll-settings/get-all/deductions').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.fixedSalaryDeductions.push({
              'deductionid': element.deductionid,
              'deductionName': element.labelName,
              'fieldValue': false,
              'type': 'FD'
            });
          });
        } else {
        }
      });
  }

  getAllEmployerContribution() {
    this.employerContribution = [];

    this.employerContribution.push({
      'employerContributionName': 'PF Employer Contribution',
      'fieldValue': false,
      'type': 'PF'
    },
      {
        'employerContributionName': 'LWF Employer Contribution',
        'fieldValue': false,
        'type': 'LWF'
      },
      {
        'employerContributionName': 'ESIC Employer Contribution',
        'fieldValue': false,
        'type': 'ESIC'
      },
      {
        'employerContributionName': 'Gratuity',
        'fieldValue': false,
      });
  }

  getAllEmployeeDeduction() {
    this.employeeDeductions = [];
    this.employeeDeductions.push({
      'employeeDeductionName': 'PF Employee Deduction',
      'fieldValue': false,
      'type': 'PF'
    },
      {
        'employeeDeductionName': 'LWF Employee Deduction',
        'fieldValue': false,
        'type': 'LWF'
      },
      {
        'employeeDeductionName': 'ESIC Employee Deduction',
        'fieldValue': false,
        'type': 'ESIC'
      },
      {
        'employeeDeductionName': 'PT Deduction',
        'fieldValue': false,
      },
      {
        'employeeDeductionName': 'Income Tax Deduction',
        'fieldValue': false,
      });
  }
  getAllOtherBenefits() {
    this.otherBenefits = [];
    this.serviceApi.get('/v1/payroll-settings/get-all/benfits').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.otherBenefits.push({
              'allowanceId': element.benefitId,
              'allowanceName': element.labelName,
              'fieldValue': false,
              'type': 'OB'
            });
          });
        } else {
        }
      });
  }

  // End Of Getting Methods of All Fields Shoing in the Screen For Checked

  saveCTCTemplate() {
    console.log('Enter in the Sae Function : ' + this.newCTCTemplateForm.controls.templateLabel.value);
    console.log(this.fixedAllowanceForm.value);
    console.log(this.fixedDeductionsForm.value);
    console.log(this.employerContributionsForm.value);
    console.log(this.employeeDeductionsForm.value);
    if (this.fixedAllowanceForm.valid) {

      let ctcFixedAllowanceList = [];
      let ctcFixedDeductionsList = [];
      let ctcGratuityComponents = [];

      let esicDeductible = false;
      let incomeTaxDeductible = false;
      let lwfdeductible = false;
      let pfDeductible = false;
      let ptdeductible = false;
      let gratuityDeductible = false;



      this.fixedAllowanceForm.value.fieldMaster.forEach(element => {
        let ctcOtherBenefitsHeads = [];
        let headsList = [];
        let otherBenefitId = null;
        let fixedAllowanceId = null;
        if (element.fixedAllowance.type == 'FA') {
          fixedAllowanceId = element.fixedAllowance.allowanceId;
          element.dependentAllowanceIds.forEach(element1 => {
            if (element1.type == '') {
              headsList.push({
                "fixedAllowanceId": 0,
                "gross": true
              });
            } else if (element1.type == 'FA') {
              headsList.push({
                "fixedAllowanceId": element1.id,
                "gross": false
              });
            }
          });

        } else if (element.fixedAllowance.type == 'OB') {
          otherBenefitId = element.fixedAllowance.allowanceId,
            element.dependentAllowanceIds.forEach(element1 => {
              if (element1.type == '') {
                ctcOtherBenefitsHeads.push({
                  "fixedAllowanceId": 0,
                  "gross": true,
                  "otherBenefitId": 0
                });
              } else if (element1.type == 'FA') {
                ctcOtherBenefitsHeads.push({
                  "fixedAllowanceId": element1.id,
                  "gross": false,
                  "otherBenefitId": 0
                });
              } else if (element1.type == 'OB') {
                ctcOtherBenefitsHeads.push({
                  "fixedAllowanceId": 0,
                  "gross": false,
                  "otherBenefitId": element1.id
                });
              }
            });

        }
        ctcFixedAllowanceList.push({
          "id": null,
          "minAmountValue": element.minimumAmount != null ? element.minimumAmount : 0,
          "ctcOtherBenefitsHeads": ctcOtherBenefitsHeads,
          "headsList": headsList,
          "value": element.value,
          "valueType": element.criteria,
          "fixedAllowanceId": fixedAllowanceId,
          "otherBenefitId": otherBenefitId
        });
      });

      this.fixedDeductionsForm.value.fieldMaster.forEach(deduction => {

        let deductionHeads = [];
        deduction.dependentDeductionIds.forEach(element1 => {
          if (element1.type == '') {
            deductionHeads.push({
              "fixedAllowanceId": 0,
              "gross": true,
              "otherBenefitsId": 0
            });
          } else if (element1.type == 'FA') {
            deductionHeads.push({
              "fixedAllowanceId": element1.id,
              "gross": false,
              "otherBenefitsId": 0
            });
          } else if (element1.type == 'OB') {
            deductionHeads.push({
              "fixedAllowanceId": 0,
              "gross": false,
              "otherBenefitsId": element1.id
            });
          }
        });

        ctcFixedDeductionsList.push(
          {
            "id": null,
            "deductionHeads": deductionHeads,
            "fixedDeductionId": deduction.fixedDeduction.deductionId,
            "minAmountValue": deduction.minimumAmount,
            "value": deduction.value,
            "valueType": deduction.criteria
          }
        );
      });


      this.employerContributionsForm.value.fieldMaster.forEach(employerContribution => {
        if (employerContribution.employerContributionName == 'PF Employer Contribution') {
          pfDeductible = true;
        }
        if (employerContribution.employerContributionName == 'LWF Employer Contribution') {
          lwfdeductible = true;
        }
        if (employerContribution.employerContributionName == 'ESIC Employer Contribution') {
          esicDeductible = true
        }
        if (employerContribution.employerContributionName == 'Gratuity') {
          gratuityDeductible = true
          employerContribution.allowanceIds.forEach(element1 => {
            if (element1.type == '') {
              ctcGratuityComponents.push({
                "fixedAllowanceId": 0,
                "gross": true,
                "otherBenefitId": 0
              });
            } else if (element1.type == 'FA') {
              ctcGratuityComponents.push({
                "fixedAllowanceId": element1.id,
                "gross": false,
                "otherBenefitId": 0
              });
            } else if (element1.type == 'OB') {
              ctcGratuityComponents.push({
                "fixedAllowanceId": 0,
                "gross": false,
                "otherBenefitId": element1.id
              });
            }
          });
        }
      });

      this.employeeDeductionsForm.value.fieldMaster.forEach(employeeDeduction => {
        if (employeeDeduction.employeeDeductionName == 'PF Employee Deduction') {
          pfDeductible = true;
        }
        if (employeeDeduction.employeeDeductionName == 'LWF Employee Deduction') {
          lwfdeductible = true;
        }
        if (employeeDeduction.employeeDeductionName == 'ESIC Employee Deduction') {
          esicDeductible = true
        }
        if (employeeDeduction.employeeDeductionName == 'PT Deduction') {
          ptdeductible = true
        }
        if (employeeDeduction.employeeDeductionName == 'Income Tax Deduction') {
          incomeTaxDeductible = true
        }
      });


      const body = {
        "ctcFixedAllowanceList": ctcFixedAllowanceList,
        "ctcFixedDeductions": ctcFixedDeductionsList,
        "ctcGratuityComponents": ctcGratuityComponents,
        "gratuityDeductible": gratuityDeductible,
        "gratuityPercent": 0,
        "ctcTemplateName": this.newCTCTemplateForm.controls.templateLabel.value,
        "esicDeductible": esicDeductible,
        "incomeTaxDeductible": incomeTaxDeductible,
        "lwfdeductible": lwfdeductible,
        "pfDeductible": pfDeductible,
        "ptdeductible": ptdeductible
      };
      console.log('Save Data :::: ' + JSON.stringify(body));
      this.serviceApi.post('/v1/ctc-template/', body).subscribe(
        res => {
          console.log('Template Successfully Saved...');
          if (res != null) {
            this.successNotification('Template successfully Saved');
          } else {
            console.log('There is no data in Database');
          }
        }, err => {
          console.log('Something gone Wrong');
          console.log('err -->' + err);
          // this.warningNotification(err.message);
        }, () => {
          this.getData();
          this.closeForm();
        });
    } else {
      Object.keys(this.fixedAllowanceForm.controls).forEach(field => { // {1}
        const control = this.fixedAllowanceForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }


  }

  saveUpdatedCTCTemplate() {
    console.log('Enter in the Sae Function : ' + this.newCTCTemplateForm.controls.templateLabel.value);
    console.log(this.fixedAllowanceForm.value);
    console.log(this.fixedDeductionsForm.value);
    console.log(this.employerContributionsForm.value);
    console.log(this.employeeDeductionsForm.value);
    if (this.fixedAllowanceForm.valid && this.fixedDeductionsForm.valid && this.employerContributionsForm.valid) {
      let ctcFixedAllowanceList = [];
      let ctcFixedDeductionsList = [];
      let ctcGratuityComponents = [];
      let esicDeductible = false;
      let incomeTaxDeductible = false;
      let lwfdeductible = false;
      let pfDeductible = false;
      let ptdeductible = false;
      let gratuityDeductible = false;
      let gratuityPercent = 0;
      this.fixedAllowanceForm.value.fieldMaster.forEach(element => {
        let ctcOtherBenefitsHeads = [];
        let headsList = [];
        let otherBenefitId = null;
        let fixedAllowanceId = null;
        if (element.fixedAllowance.type == 'FA') {
          fixedAllowanceId = element.fixedAllowance.allowanceId;
          element.dependentAllowanceIds.forEach(element1 => {
            if (element1.type == '') {
              headsList.push({
                "fixedAllowanceId": 0,
                "gross": true
              });
            } else if (element1.type == 'FA') {
              headsList.push({
                "fixedAllowanceId": element1.value,
                "gross": false
              });
            }
          });

        } else if (element.fixedAllowance.type == 'OB') {
          otherBenefitId = element.fixedAllowance.allowanceId,
            element.dependentAllowanceIds.forEach(element1 => {
              if (element1.type == '') {
                ctcOtherBenefitsHeads.push({
                  "fixedAllowanceId": 0,
                  "gross": true,
                  "otherBenefitId": 0
                });
              } else if (element1.type == 'FA') {
                ctcOtherBenefitsHeads.push({
                  "fixedAllowanceId": element1.value,
                  "gross": false,
                  "otherBenefitId": 0
                });
              } else if (element1.type == 'OB') {
                ctcOtherBenefitsHeads.push({
                  "fixedAllowanceId": 0,
                  "gross": false,
                  "otherBenefitId": element1.value
                });
              }
            });

        }
        ctcFixedAllowanceList.push({
          "id": element.fixedAllowance.ctcAllowanceId,
          "minAmountValue": element.minimumAmount != null ? element.minimumAmount : 0,
          "ctcOtherBenefitsHeads": ctcOtherBenefitsHeads,
          "headsList": headsList,
          "value": element.value,
          "valueType": element.criteria,
          "fixedAllowanceId": fixedAllowanceId,
          "otherBenefitId": otherBenefitId
        });
      });

      this.fixedDeductionsForm.value.fieldMaster.forEach(deduction => {

        let deductionHeads = [];
        deduction.dependentDeductionIds.forEach(element1 => {
          if (element1.type == '') {
            deductionHeads.push({
              "fixedAllowanceId": 0,
              "gross": true,
              "otherBenefitsId": 0
            });
          } else if (element1.type == 'FA') {
            deductionHeads.push({
              "fixedAllowanceId": element1.value,
              "gross": false,
              "otherBenefitsId": 0
            });
          } else if (element1.type == 'OB') {
            deductionHeads.push({
              "fixedAllowanceId": 0,
              "gross": false,
              "otherBenefitsId": element1.value
            });
          }
        });

        ctcFixedDeductionsList.push(
          {
            "ctcFixedDeductionId": deduction.fixedDeduction.ctcFixedDeductionId,
            "deductionHeads": deductionHeads,
            "fixedDeductionId": deduction.fixedDeduction.deductionId,
            "minAmountValue": deduction.minimumAmount,
            "value": deduction.value,
            "valueType": deduction.criteria
          }
        );
      });


      this.employerContributionsForm.value.fieldMaster.forEach(employerContribution => {
        if (employerContribution.employerContributionName == 'PF Employer Contribution') {
          pfDeductible = true;
        }
        if (employerContribution.employerContributionName == 'LWF Employer Contribution') {
          lwfdeductible = true;
        }
        if (employerContribution.employerContributionName == 'ESIC Employer Contribution') {
          esicDeductible = true
        }
        if (employerContribution.employerContributionName == 'Gratuity') {
          gratuityDeductible = true;
          gratuityPercent = employerContribution.value;
          employerContribution.allowanceIds.forEach(element1 => {
            if (element1.type == '') {
              ctcGratuityComponents.push({
                "fixedAllowanceId": 0,
                "gross": true,
                "otherBenefitId": 0
              });
            } else if (element1.type == 'FA') {
              ctcGratuityComponents.push({
                "fixedAllowanceId": element1.value,
                "gross": false,
                "otherBenefitId": 0
              });
            } else if (element1.type == 'OB') {
              ctcGratuityComponents.push({
                "fixedAllowanceId": 0,
                "gross": false,
                "otherBenefitId": element1.value
              });
            }
          });
        }
      });

      this.employeeDeductionsForm.value.fieldMaster.forEach(employeeDeduction => {
        if (employeeDeduction.employeeDeductionName == 'PF Employee Deduction') {
          pfDeductible = true;
        }
        if (employeeDeduction.employeeDeductionName == 'LWF Employee Deduction') {
          lwfdeductible = true;
        }
        if (employeeDeduction.employeeDeductionName == 'ESIC Employee Deduction') {
          esicDeductible = true
        }
        if (employeeDeduction.employeeDeductionName == 'PT Deduction') {
          ptdeductible = true
        }
        if (employeeDeduction.employeeDeductionName == 'Income Tax Deduction') {
          incomeTaxDeductible = true
        }
      });


      const body = {
        "ctcFixedAllowanceList": ctcFixedAllowanceList,
        "ctcFixedDeductions": ctcFixedDeductionsList,
        "ctcGratuityComponents": ctcGratuityComponents,
        "gratuityDeductible": gratuityDeductible,
        "gratuityPercent": gratuityPercent,
        "ctcTemplateName": this.newCTCTemplateForm.controls.templateLabel.value,
        "ctcTemplateId": this.newCTCTemplateForm.controls.ctcTemplateId.value,
        "esicDeductible": esicDeductible,
        "incomeTaxDeductible": incomeTaxDeductible,
        "lwfdeductible": lwfdeductible,
        "pfDeductible": pfDeductible,
        "ptdeductible": ptdeductible
      };
      console.log(JSON.stringify(body));
      this.serviceApi.put('/v1/ctc-template/', body).subscribe(
        res => {
          console.log('Sucessfully Updated');
          this.successNotification('Template Sucessfully Updated');
        }, err => {
          console.log('Something Gone Wrong');
          console.log('err -->' + err);
          // this.warningNotification(err.message);
        }, () => {
          this.getData();
          this.closeForm();
        });
    } else {
      const control1 = <FormArray>this.fixedAllowanceForm.controls['fieldMaster'];
      for (let i = 0; i < control1.length; i++) {
        const data = <FormGroup>control1.at(i);
        Object.keys(data.controls).forEach(field => { // {1}
          const control1 = data.get(field);            // {2}
          control1.markAsTouched({ onlySelf: true });       // {3}
        });
      }
      const control2 = <FormArray>this.fixedDeductionsForm.controls['fieldMaster'];
      for (let i = 0; i < control2.length; i++) {
        const data = <FormGroup>control2.at(i);
        Object.keys(data.controls).forEach(field => { // {1}
          const control1 = data.get(field);            // {2}
          control1.markAsTouched({ onlySelf: true });       // {3}
        });
      }
      const control3 = <FormArray>this.employerContributionsForm.controls['fieldMaster'];
      for (let i = 0; i < control3.length; i++) {
        const data = <FormGroup>control3.at(i);
        Object.keys(data.controls).forEach(field => { // {1}
          const control1 = data.get(field);            // {2}
          control1.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    }
  }

  closeForm() {
    this.router.navigate(['/payroll/ctc-templates']);
    // routerLink="/payroll/ctc-templates"

  }
}


