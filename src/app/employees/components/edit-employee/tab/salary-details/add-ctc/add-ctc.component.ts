import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ApiCommonService } from '../../../../../../services/api-common.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Data } from '../../../../../services/data.service';
import { Browser } from 'protractor';
import { IfStmt } from '@angular/compiler';
declare var $: any;

@Component({
  selector: 'app-add-ctc',
  templateUrl: './add-ctc.component.html',
  styleUrls: ['./add-ctc.component.scss']
})
export class AddCtcComponent implements OnInit {

  totalGrossSalary = 0;
  totalNetSalaryY = 0;
  totalNetSalaryM = 0;
  totalGrossSalaryY = 0;
  totalGrossSalaryM = 0;
  @Input() currentTab: string;
  @Output() currentTabEvent = new EventEmitter<string>();
  selectTimePeriod = '0';
  showFiexedAllowance = false;
  showOtherBenifits = false;
  showStatutoryContributions = false;
  showStatutoryDeductions = false;
  showFixedDeductions = false;
  showTaxStatutorySettings = false;
  showVariableDeduction = false;
  showVariableAllowance = false
  totalMonthlyAllowances = 0;
  totalYearlyAllowances = 0;
  totalMonthlyDeductions = 0;
  totalYearlyDeductions = 0;
  totalEmployerStatutoryContributionM = 0;
  totalEmployerStatutoryContributionY = 0;
  totalEmployeeStatutoryDeductionM = 0;
  totalEmployeeStatutoryDeductionY = 0;
  totalEmployeeVariableDeductionY = 0;
  totalEmployeeVariableDeductionM = 0;
  totalEmployeeVariableAllowanceY = 0;
  totalEmployeeVariableAllowanceM = 0;
  totalVariableAllowanceY = 0;
  totalNetSalaryIM = 0;
  totalNetSalaryIY = 0;
  salaryForm: FormGroup;
  ctcAllowancess = [];
  ctcOtherBenefits = [];
  ctcDeductionss = [];
  employerContributions = [];
  employeeDeductions = [];
  fixedDeductions = [];
  variableAllowances = [];
  variableDeductions = [];
  formRequestRegister = true;
  templates = [];
  empCode: string;
  selectedlwfSlab: any;
  selectedptSlab: any;
  templatesNames = [
    // { 'ctcTemplateId': '0', 'templateName': 'Enter Manually' }
  ];

  ctcFrequency = [
    { value: 'Monthly', viewValue: 'Monthly' },
    { value: 'Annualy', viewValue: 'Annually' }
  ]
  ngBooleanData = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' }
  ]
  amountTypes = [
    { value: 'AS_CTC', viewValue: 'As CTC' },
    { value: 'GROSS_SALARY', viewValue: 'Gross Salary' }
  ]

  response: any;
  parsedDateString: string;
  pfTemplates = [];
  otherBenefits = [];
  fixedSalaryDeductions = [];
  fixedSalaryAllowance = [];
  totalMonthlyBenefits: number = 0;
  totalYearlyBenefits: number = 0;
  statutoryDetails: any;
  esicCellingAmount: any;
  esicSlab: any;
  lwfSlabs = [];
  ptSlabs = [];
  lwfStatus: any;
  ptStatus: any;
  payedGross: any;
  lwfStatesList = [];
  ptStatesList = [];
  totalVariableDeductionY: number = 0;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private serviceApi: ApiCommonService, private router: Router, private data: Data) {
    console.log('routes-->' + this.route);
    this.totalGrossSalaryM = 0;
    this.totalGrossSalaryY = 0;
    this.totalNetSalaryIM = 0;
    this.totalNetSalaryIY = 0;
    this.empCode = this.data.storage.empCode
    console.log('current Emp Code -->' + this.empCode);
    this.serviceApi.get('/v1/ctc-template/get-all').subscribe(
      res => {
        this.templates = res;
        this.templates.push({
          ctcTemplateId: -1,
          ctcTemplateName: "Enter Manually"
        });
      }, err => {
        console.log('error block start');
      }, () => {
      }
    );
    this.serviceApi.get('/v1/payroll-settings/lwf-states').subscribe(
      res => {
        res.forEach(element => {
          this.lwfStatesList.push({
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
            this.ptStatesList.push({
              value: element.stateId,
              viewValue: element.stateName
            })
          }
        });

      },
      err => { },
      () => { }
    );

    this.serviceApi.get('/v1/payroll-settings/get/pf-templates').subscribe(
      res => {
        this.pfTemplates = res;
      }, err => {
        console.log('error block start');
      }, () => {
      });

    this.salaryForm = this.fb.group({
      empCode: [this.empCode],
      salaryEffectiveDate: [null, Validators.required],
      payrollEffectiveDate: [null, Validators.required],
      ctcFrequency: [null, Validators.required],
      ctcTemplateId: [null, Validators.required],
      amount: [null, Validators.required],
      amountType: ['AS_CTC'],
      isCurrentFlag: [true],


      isPFDeductible: [],
      isProvidentPensionDeductible: [false],
      isEmployeePFCaped: [],
      isEmployersPFCaped: [],
      providentFundWageAmount: [],
      pfTemplateId: [],
      isESICDeductible: [],
      isProfessionalTaxDeductible: [],
      isLWFDeductible: [],
      isGratuityApplicable: [],
      isIncomeTaxDeductible: [],
      lwfStateId: [null],
      ptStateId: [null],
      isRoundOffApplicable: [],

      ctcAllowances: this.fb.array([]),
      empCtcOtherBenefits: this.fb.array([]),
      ctcDeductions: this.fb.array([]),
      employerContribution: this.fb.array([]),
      employeeDeduction: this.fb.array([]),
      variableDeduction: this.fb.array([]),
      variableAllowance: this.fb.array([]),

      ctcExcludingVariables: 0,
      ctcIncludingVariables: 0,
      totalTakeHome: 0,
      empSalaryId: 0,
    });

    this.serviceApi.get('/v1/employee/profile/statuatory/' + this.empCode).subscribe(
      res => {
        if (res != undefined) {
          this.salaryForm.controls.isPFDeductible.setValue(res.isPfDeuctible != undefined ? res.isPfDeuctible : false);
          this.salaryForm.controls.isEmployeePFCaped.setValue(res.isEmployeePfCaped != undefined ? res.isEmployeePfCaped : false);
          this.salaryForm.controls.isEmployersPFCaped.setValue(res.isEmployerPfCaped != undefined ? res.isEmployerPfCaped : false);
          this.salaryForm.controls.providentFundWageAmount.setValue(res.pfWage != undefined ? res.pfWage : 0);
          this.salaryForm.controls.isESICDeductible.setValue(res.isEsicDeductible != undefined ? res.isEsicDeductible : false);
          this.salaryForm.controls.isProfessionalTaxDeductible.setValue(res.isProfessionalTaxDeductible != undefined ? res.isProfessionalTaxDeductible : false);
          this.salaryForm.controls.isLWFDeductible.setValue(res.isLwfDeductible != undefined ? res.isLwfDeductible : false);
          this.salaryForm.controls.isGratuityApplicable.setValue(res.isGratuityEligible != undefined ? res.isGratuityEligible : false);
          this.salaryForm.controls.isIncomeTaxDeductible.setValue(res.isIncomeTaxDeductible != undefined ? res.isIncomeTaxDeductible : false);
          this.salaryForm.controls.lwfStateId.setValue(res.lwfStateId != undefined ? res.lwfStateId : null);
          this.salaryForm.controls.ptStateId.setValue(res.ptState != undefined ? res.ptState : null);
          this.salaryForm.controls.isRoundOffApplicable.setValue(res.isRoundOffApplicable != undefined ? res.isRoundOffApplicable : false);
          this.getRequreForSalaryData();
        }
      }, err => {
        console.log('error block start');
      }, () => {

      });
    this.getData();

  }
  get ctcAllowances(): FormArray { return this.salaryForm.get('ctcAllowances') as FormArray; }
  get empCtcOtherBenefits(): FormArray { return this.salaryForm.get('empCtcOtherBenefits') as FormArray; }
  get employerContribution(): FormArray { return this.salaryForm.get('employerContribution') as FormArray; }
  get employeeDeduction(): FormArray { return this.salaryForm.get('employeeDeduction') as FormArray; }
  get ctcDeductions(): FormArray { return this.salaryForm.get('ctcDeductions') as FormArray; }
  get variableDeduction(): FormArray { return this.salaryForm.get('variableDeduction') as FormArray; }
  get variableAllowance(): FormArray { return this.salaryForm.get('variableAllowance') as FormArray; }
  ngOnInit() {
  }

  loadTemplate() {

    this.ctcAllowancess = [];
    this.ctcOtherBenefits = [];
    this.ctcDeductionss = [];
    // this.employerContributions = [];
    // this.employeeDeductions = [];
    // this.variableAllowances = [];
    // this.variableDeductions = [];

    console.log('calculateSalaryOnTemplate called successfully-->');
    console.log('templateName-->' + this.salaryForm.controls.ctcTemplateId.value);

    this.showFixedDeductions = false;
    console.log('calculateSalaryOnTemplate -->' + this.salaryForm.controls.amount.value);;


    this.formRequestRegister = false;
    if (this.salaryForm.controls.ctcTemplateId.value != -1) {
      this.serviceApi.get('/v1/ctc-template/get/' + this.salaryForm.controls.ctcTemplateId.value).subscribe(
        res => {

          res.ctcFixedAllowanceList.forEach(element => {
            console.log('Length Of the Array is >>>> ' + element.length);
            if (element.fixedAllowanceId != null) {
              // const result = element.fixedAllowanceId;
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
              // this.fixedSalaryAllowance.forEach(element1 => {
              // if (result === element1.allowanceId) {
              element.dependentAllowanceIds = dependentAllowanceIds;
              //   element1.ctcAllowanceId = element.id;
              //   element1.criteria = element.valueType;
              //   element1.value = element.value;
              //   element1.minimumAmount = element.minAmountValue;
              //   element1.ctcFixedAllowanceId = element.id;
              this.ctcAllowancess.push(element);
              // }
              // });
            }
            if (element.otherBenefitId != null) {
              // const result = element.otherBenefitId;
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
              // this.otherBenefits.forEach(element1 => {
              //   if (result === element1.allowanceId) {
              element.dependentAllowanceIds = dependentAllowanceIds;
              //     element1.fieldValue = true;
              //     element1.criteria = element.valueType;
              //     element1.value = element.value;
              //     element1.minimumAmount = element.minAmountValue;
              //     element1.ctcOtherBenefitId = element.id;
              this.ctcOtherBenefits.push(element);
              // }
              // });
            }
            // this.editFixedAllowanceDependentId.push(element.fixedAllowance);
          });

          res.ctcFixedDeductions.forEach(element => {
            // const result = element.fixedDeductionId;
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
            // console.log('Enter in the Edit function and the Respose Api value : ' + result);
            // this.fixedSalaryDeductions.forEach(element1 => {
            //   if (result === element1.deductionid) {
            element.dependentAllowanceIds = dependentAllowanceIds;
            // element1.fieldValue = true;
            // element1.criteria = element.valueType;
            // element1.value = element.value;
            // element1.minimumAmount = element.minAmountValue;
            // element1.ctcFixedDeductionId = element.ctcFixedDeductionId;
            this.ctcDeductionss.push(element);
            //   }
            // });
          });

          this.employeeDeductions.forEach(element1 => {
            if (element1.employeeDeductionName == 'PF Employee Deduction') {
              if (res.pfDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee PF Deduction';
            }
            if (element1.employeeDeductionName == 'LWF Employee Deduction') {
              if (res.lwfdeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee LWF Deduction';
            }
            if (element1.employeeDeductionName == 'ESIC Employee Deduction') {
              if (res.esicDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee ESIC Deduction';
            }
            if (element1.employeeDeductionName == 'PT Deduction') {
              if (res.ptdeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee PT Deduction';
            }
            if (element1.employeeDeductionName == 'Income Tax Deduction') {
              if (res.incomeTaxDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee Income Tax Deduction';
            }
          });



          this.employerContributions.forEach(element1 => {
            if (element1.employerContributionName == 'PF Employer Contribution') {
              if (res.pfDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employerContributionsName = 'Employer PF Contribution';
            }
            if (element1.employerContributionName == 'LWF Employer Contribution') {
              if (res.lwfdeductible == true) {
                element1.fieldValue = true;
              }
              element1.employerContributionsName = 'Employer LWF Contribution';
            }
            if (element1.employerContributionName == 'ESIC Employer Contribution') {
              if (res.esicDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employerContributionsName = 'Employer ESIC Contribution';
            }
            if (element1.employerContributionName == 'Gratuity') {
              let dependentAllowanceIds = [];
              res.ctcGratuityComponents.forEach(dependentData => {
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
              element1.employerContributionsName = 'Employer Gratuity Contribution'
              element1.allowanceIds = dependentAllowanceIds;
              if (res.gratuityDeductible == true) {
                element1.fieldValue = true;
              }
              element1.value = res.gratuityPercent;
            }
          });


          // this.ctcAllowancess = res.ctcAllowances;
          // this.ctcDeductionss = res.ctcDeductions;
          // this.employerContributions = res.ctcEmployerContributions;
          // this.employeeDeductions = res.ctcEmployeeDeductions;
          // this.variableAllowances = res.ctcVariableAllowances;
          // this.variableDeductions = res.ctcVariableDeductions
        },
        err => {
          console.error('ctcAllownance error -->' + err);
        },
        () => {
          console.log('on complete ctcGeneratic  response');
          // this.calculateGorssSalary();
          this.insertAllPayitems();
        }
      );
    } else {

      this.serviceApi.get('/v1/ctc-template/get/manually').subscribe(
        res => {

          res.ctcFixedAllowanceList.forEach(element => {
            console.log('Length Of the Array is >>>> ' + element.length);
            if (element.fixedAllowanceId != null) {
              // const result = element.fixedAllowanceId;
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
              // this.fixedSalaryAllowance.forEach(element1 => {
              // if (result === element1.allowanceId) {
              element.dependentAllowanceIds = dependentAllowanceIds;
              //   element1.ctcAllowanceId = element.id;
              //   element1.criteria = element.valueType;
              //   element1.value = element.value;
              //   element1.minimumAmount = element.minAmountValue;
              //   element1.ctcFixedAllowanceId = element.id;
              this.ctcAllowancess.push(element);
              // }
              // });
            }
            if (element.otherBenefitId != null) {
              // const result = element.otherBenefitId;
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
              // this.otherBenefits.forEach(element1 => {
              //   if (result === element1.allowanceId) {
              element.dependentAllowanceIds = dependentAllowanceIds;
              //     element1.fieldValue = true;
              //     element1.criteria = element.valueType;
              //     element1.value = element.value;
              //     element1.minimumAmount = element.minAmountValue;
              //     element1.ctcOtherBenefitId = element.id;
              this.ctcOtherBenefits.push(element);
              // }
              // });
            }
            // this.editFixedAllowanceDependentId.push(element.fixedAllowance);
          });

          res.ctcFixedDeductions.forEach(element => {
            // const result = element.fixedDeductionId;
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
            // console.log('Enter in the Edit function and the Respose Api value : ' + result);
            // this.fixedSalaryDeductions.forEach(element1 => {
            //   if (result === element1.deductionid) {
            element.dependentAllowanceIds = dependentAllowanceIds;
            // element1.fieldValue = true;
            // element1.criteria = element.valueType;
            // element1.value = element.value;
            // element1.minimumAmount = element.minAmountValue;
            // element1.ctcFixedDeductionId = element.ctcFixedDeductionId;
            this.ctcDeductionss.push(element);
            //   }
            // });
          });

          this.employeeDeductions.forEach(element1 => {
            if (element1.employeeDeductionName == 'PF Employee Deduction') {
              if (res.pfDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee PF Deduction';
            }
            if (element1.employeeDeductionName == 'LWF Employee Deduction') {
              if (res.lwfdeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee LWF Deduction';
            }
            if (element1.employeeDeductionName == 'ESIC Employee Deduction') {
              if (res.esicDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee ESIC Deduction';
            }
            if (element1.employeeDeductionName == 'PT Deduction') {
              if (res.ptdeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee PT Deduction';
            }
            if (element1.employeeDeductionName == 'Income Tax Deduction') {
              if (res.incomeTaxDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employeeDeductionsName = 'Employee Income Tax Deduction';
            }
          });



          this.employerContributions.forEach(element1 => {
            if (element1.employerContributionName == 'PF Employer Contribution') {
              if (res.pfDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employerContributionsName = 'Employer PF Contribution';
            }
            if (element1.employerContributionName == 'LWF Employer Contribution') {
              if (res.lwfdeductible == true) {
                element1.fieldValue = true;
              }
              element1.employerContributionsName = 'Employer LWF Contribution';
            }
            if (element1.employerContributionName == 'ESIC Employer Contribution') {
              if (res.esicDeductible == true) {
                element1.fieldValue = true;
              }
              element1.employerContributionsName = 'Employer ESIC Contribution';
            }
            if (element1.employerContributionName == 'Gratuity') {
              let dependentAllowanceIds = [];
              res.ctcGratuityComponents.forEach(dependentData => {
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
              element1.employerContributionsName = 'Employer Gratuity Contribution'
              element1.allowanceIds = dependentAllowanceIds;
              if (res.gratuityDeductible == true) {
                element1.fieldValue = true;
              }
              element1.value = res.gratuityPercent;
            }
          });


          // this.ctcAllowancess = res.ctcAllowances;
          // this.ctcDeductionss = res.ctcDeductions;
          // this.employerContributions = res.ctcEmployerContributions;
          // this.employeeDeductions = res.ctcEmployeeDeductions;
          // this.variableAllowances = res.ctcVariableAllowances;
          // this.variableDeductions = res.ctcVariableDeductions
        },
        err => {
          console.error('ctcAllownance error -->' + err);
        },
        () => {
          console.log('on complete ctcGeneratic  response');
          // this.calculateGorssSalary();
          this.insertAllPayitems();
        }
      );
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

  onStatutoryChange() {
    // this.resetForm();
    this.getRequreForSalaryData();
    this.calculateGorssSalary();
  }

  onCTCFrequencyChnage() {
    this.salaryForm.controls.amount.setValue(0);
    this.totalGrossSalaryM = 0;
    this.totalGrossSalaryY = 0;
    this.totalNetSalaryIM = 0;
    this.totalNetSalaryIY = 0;
    this.totalMonthlyAllowances = 0;
    this.totalYearlyAllowances = 0;
    this.totalMonthlyBenefits = 0;
    this.totalYearlyBenefits = 0;
    this.totalEmployerStatutoryContributionM = 0;
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    this.totalEmployeeStatutoryDeductionY = 0;
    this.totalMonthlyDeductions = 0;
    this.totalYearlyDeductions = 0;
    this.totalVariableAllowanceY = 0;
    this.totalVariableDeductionY = 0;
    this.totalNetSalaryM = 0;
    this.totalNetSalaryY = 0;
    const variableAllowance = <FormArray>this.salaryForm.controls['variableAllowance'];
    for (let i = variableAllowance.length - 1; i >= 0; i--) {
      variableAllowance.controls[i]['controls'].amount.setValue(0);
      variableAllowance.controls[i]['controls'].variableAllowance.setValue(null);
    }

    const variableDeduction = <FormArray>this.salaryForm.controls['variableDeduction'];
    for (let i = variableDeduction.length - 1; i >= 0; i--) {
      variableDeduction.controls[i]['controls'].amount.setValue(0);
      variableDeduction.controls[i]['controls'].variableDeduction.setValue(null);
    }
    if (this.salaryForm.controls.ctcTemplateId.value) {
      this.loadTemplate();
    }
  }
  calculateGorssSalary() {
    if (this.salaryForm.controls.ctcTemplateId.value == -1) {
      this.calculateCTCManually();
    } else {
      if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
        this.ctcAllowanceMonthly();
      } else if (this.salaryForm.controls.ctcFrequency.value === 'Annualy') {
        this.ctcAllowanceAnually();
      }
    }
  }
  ctcAllowanceMonthly() {
    this.calculateCtcAllowance();
    // this.calculateEmployeeDeduction();
    // this.calculateEmployerContribution();
    this.calculateNetSalaryMonthly();
  }
  ctcAllowanceAnually() {
    // this.calculateCtcAllowance();
    this.calculateCtcAllowanceAnually();
    // this.calculateEmployeeDeduction();
    // this.calculateEmployerContribution();
    this.calculateNetSalaryAnually();
  }

  insertAllPayitems() {

    const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    control0.controls = [];
    this.ctcAllowancess.forEach(element => {
      let index = this.ctcAllowancess.indexOf(element);
      control0.push(
        this.fb.group({
          'ctcAllowanceId': [element.id],
          'fixedAllowance': this.fb.group({
            'allowanceId': [element.fixedAllowanceId],
            'allowanceName': [element.fixedAllowanceName],
            'allowanceValue': [0],
            // 'isDefaultAllowance': [element.isDefaultAllowance],
            'allowPF': [element.pfEnable],
            'allowESIC': [element.esicEnable],
            'allowLWF': [element.lwfEnable],
            'allowProfessionalTax': [element.ptEnable],
            'allowIncomeTax': [element.tdsEnable],
            // 'allowExempt': [element.allowExempt],
            // 'exemptLimit': [element.exemptLimit],
            // 'showInCTC': [element.showInCTC],
            // 'paymentFrequency': [element.paymentFrequency],
          }),
          'criteria': [element.valueType],
          'value': [element.value],
          'dependentAllowanceIds': [element.dependentAllowanceIds],
          'minimumAmount': [element.minAmountValue]
        })
      );
    });


    const control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    control1.controls = [];
    this.ctcOtherBenefits.forEach(element => {
      let index = this.ctcOtherBenefits.indexOf(element);
      control1.push(
        this.fb.group({
          'ctcAllowanceId': [element.id],
          'fixedAllowance': this.fb.group({
            'allowanceId': [element.otherBenefitId],
            'allowanceName': [element.otherBenefitName],
            'allowanceValue': [0],
          }),
          'criteria': [element.valueType],
          'value': [element.value],
          'dependentAllowanceIds': [element.dependentAllowanceIds],
          'minimumAmount': [element.minAmountValue]
        })
      );
    });


    const control4 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    control4.controls = [];
    this.ctcDeductionss.forEach(ctcDeductionElement => {
      let index = this.ctcDeductionss.indexOf(ctcDeductionElement);
      control4.push(
        this.fb.group({
          'ctcDeductionId': [ctcDeductionElement.ctcFixedDeductionId],
          'fixedDeduction': this.fb.group({
            'deductionId': [ctcDeductionElement.fixedDeductionId],
            'deductionName': [ctcDeductionElement.fixedDeductionId],
            'deductionValue': [0],
          }),
          'criteria': [ctcDeductionElement.valueType],
          'value': [ctcDeductionElement.value],
          'dependentDeductionIds': [ctcDeductionElement.dependentAllowanceIds],
          'minimumAmount': [ctcDeductionElement.minAmountValue],
        })
      );
    });

    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    control3.controls = [];
    this.employeeDeductions.forEach(employeeDeductionEelement => {
      let index = this.employeeDeductions.indexOf(employeeDeductionEelement);
      control3.push(
        this.fb.group({
          'employeeDeductionName': [employeeDeductionEelement.employeeDeductionsName],
          'employeeDeductionValue': [0],
          'isDeductable': [employeeDeductionEelement.fieldValue],
          'value': [employeeDeductionEelement.value],
        })
      );

    });


    const control2 = <FormArray>this.salaryForm.controls['employerContribution'];
    control2.controls = [];
    this.employerContributions.forEach(employeeContributionElement => {
      let index = this.employerContributions.indexOf(employeeContributionElement);
      control2.push(
        this.fb.group({
          'employerContributionName': [employeeContributionElement.employerContributionsName],
          'dependentAllowanceList': [employeeContributionElement.allowanceIds],
          'employerContributionValue': [0],
          'isDeductable': [employeeContributionElement.fieldValue],
          'value': [employeeContributionElement.value],
        })
      );

    });


  }

  calculateCtcAllowance() {
    let alPercentSum = 0;
    let allAmountSum = 0;

    console.log('ctc allowance anually start');
    //ctc Allowance work start
    let minimumAmountForCtc = 0;
    let ctcAllowanceIndex = 0;
    let remainingAmount = this.salaryForm.controls.amount.value;
    let totalAllowance = 0;
    const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    this.ctcAllowancess.forEach(element => {
      let index = this.ctcAllowancess.indexOf(element);
      let amountSum = 0;
      if (element.valueType === 'AMOUNT') {
        const controlFormGroup = <FormGroup>control0.at(index);
        controlFormGroup.controls.value.setValue(element.value);
        const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;

        let allowanceAmount = (remainingAmount >= element.value) ? (element.value) : remainingAmount;

        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        amountSum = +amountSum + allowanceAmount;
        allAmountSum = allAmountSum + amountSum;
        fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
        remainingAmount = remainingAmount - allowanceAmount;
      } else if (element.valueType === 'PERCENTAGE') {

        let allowanceValueLocal = 0;
        let requiredCtcAllowance = [];
        let sum = 0;
        let doSum = false;
        element.dependentAllowanceIds.forEach(dependants => {
          if (dependants.value == -1) {
            sum = sum + this.salaryForm.controls.amount.value
          } else {
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowanceId === dependants.value) {
                sum = sum + element1.value.fixedAllowance.allowanceValue;
              }
            });
          }
        });

        allowanceValueLocal = (sum * element.value) / 100
        let allowanceAmount = (remainingAmount >= allowanceValueLocal) ? allowanceValueLocal : remainingAmount;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        alPercentSum = alPercentSum + allowanceAmount;
        // const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const controlFormGroup = <FormGroup>control0.at(index);
        controlFormGroup.controls.value.setValue(element.value);
        const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
        fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
        remainingAmount = remainingAmount - allowanceAmount;
        // }
      }

    });


    const control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    // control1.controls = [];
    this.ctcOtherBenefits.forEach(element => {
      let index = this.ctcOtherBenefits.indexOf(element);
      // control1.push(
      //   this.fb.group({
      //     'ctcAllowanceId': [element.ctcOtherBenefitId],
      //     'fixedAllowance': this.fb.group({
      //       'allowanceId': [element.allowanceId],
      //       'allowanceName': [element.allowanceName],
      //       'allowanceValue': [element.value],
      //     }),
      //     'criteria': [element.criteria],
      //     'value': [element.value],
      //     'dependentAllowanceIds': [element.dependentAllowanceIds],
      //     'minimumAmount': [element.minimumAmount]
      //   })
      // );
      let amountSum = 0;
      if (element.valueType === 'AMOUNT') {
        // if criteria type amount then we only set the values
        // const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const controlFormGroup = <FormGroup>control1.at(index);
        controlFormGroup.controls.value.setValue(element.value);
        const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
        // set the fixed amount in formcontrol

        let allowanceAmount = (remainingAmount >= element.value) ? (element.value) : remainingAmount;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        amountSum = +amountSum + allowanceAmount;
        allAmountSum = allAmountSum + amountSum;
        fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
        remainingAmount = remainingAmount - allowanceAmount;
      } else if (element.valueType === 'PERCENTAGE') {
        // if criteria type PERCENTAGE then we only set the values

        let allowanceValueLocal = 0;
        let requiredCtcAllowance = [];
        let sum = 0;
        let doSum = false;
        element.dependentAllowanceIds.forEach(dependants => {
          if (dependants.value == -1) {
            // it depend on ctc so calculate this percentage on ctc
            // allowanceValueLocal = +allowanceValueLocal + (this.salaryForm.controls.amount.value * element.value) / 100;
            // alPercentSum = alPercentSum + allowanceValueLocal;
            // const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
            sum = sum + this.salaryForm.controls.amount.value

            // const controlFormGroup = <FormGroup>control.at(index);
            // controlFormGroup.controls.value.setValue(element.value);
            // const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
            // fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceValueLocal);

            // doSum = false;
          } else {
            // it not depend on ctc
            // const control33 = <FormArray>this.salaryForm.controls['ctcAllowances'];
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowanceId === dependants.value) {
                sum = sum + element1.value.fixedAllowance.allowanceValue;
                // requiredCtcAllowance.push(element1);
              }
            });
            // doSum = true;
          }
        });
        // if (doSum) {
        //   requiredCtcAllowance.forEach(
        //     rquireElement => {
        //       sum = sum + rquireElement.value.fixedAllowance.allowanceValue;
        //     }
        //   );
        allowanceValueLocal = (sum * element.value) / 100
        let allowanceAmount = (remainingAmount >= allowanceValueLocal) ? allowanceValueLocal : remainingAmount;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        alPercentSum = alPercentSum + allowanceAmount;
        // const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const controlFormGroup = <FormGroup>control1.at(index);
        controlFormGroup.controls.value.setValue(element.value);
        const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
        fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
        remainingAmount = remainingAmount - allowanceAmount;
        // }

      }

      // totalBenefitAmount =  (alPercentSum + allAmountSum);

    });


    if (this.salaryForm.controls.amountType.value == 'GROSS_SALARY') {
      this.ctcAllowancess.forEach(element => {
        if (element.valueType === 'BALANCE') {
          let index = this.ctcAllowancess.indexOf(element);
          const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
          let allowanceAmount = this.salaryForm.controls.amount.value - (alPercentSum + allAmountSum);
          if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
            allowanceAmount = Math.round(allowanceAmount);
          }
          const controlFormGroup = <FormGroup>control0.at(index);
          controlFormGroup.controls.value.setValue(element.value);
          const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
          fixedAllowanceFormGroup.controls.allowanceValue
            .setValue(allowanceAmount);

          if (fixedAllowanceFormGroup.controls.allowanceValue.value < 0) {
            // this.salaryForm.controls.amount.setValue(0);
            console.log(fixedAllowanceFormGroup.controls.allowanceValue.value);
            this.setFormToZero();
          }
        }
      });
    }


    // ctc Allowance work end



    // ctcDeductions work start
    console.log('ctcDeduction start');
    const control4 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    // control4.controls = [];
    this.ctcDeductionss.forEach(ctcDeductionElement => {
      let index = this.ctcDeductionss.indexOf(ctcDeductionElement);
      // control4.push(
      //   this.fb.group({
      //     'ctcDeductionId': [ctcDeductionElement.ctcFixedDeductionId],
      //     'fixedDeduction': this.fb.group({
      //       'deductionId': [ctcDeductionElement.deductionid],
      //       'deductionName': [ctcDeductionElement.deductionName],
      //       'deductionValue': [],
      //     }),
      //     'criteria': [ctcDeductionElement.criteria],
      //     'value': [ctcDeductionElement.value],
      //     'dependentDeductionIds': [ctcDeductionElement.dependentAllowanceIds],
      //     'minimumAmount': [ctcDeductionElement.minimumAmount],
      //   })
      // );

      if (ctcDeductionElement.valueType === 'AMOUNT') {
        // if criteria type amount then we only set the values
        const controlFormGroup = <FormGroup>control4.at(index);
        controlFormGroup.controls.value.setValue(ctcDeductionElement.value);
        const fixedDeductionFormGroup = <FormGroup>controlFormGroup.controls.fixedDeduction;
        // set the fixed amount in formcontrol
        let allowanceAmount = ctcDeductionElement.value;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        fixedDeductionFormGroup.controls.deductionValue.setValue(allowanceAmount);
      } else if (ctcDeductionElement.valueType === 'PERCENTAGE') {
        // if criteria type PERCENTAGE then we only set the values

        let allowanceValueLocal = 0;
        let sum = 0;
        ctcDeductionElement.dependentAllowanceIds.forEach(dependants => {
          if (dependants.value == -1) {
            sum = sum + this.salaryForm.controls.amount.value
          } else {
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowanceId === dependants.value) {
                sum = sum + element1.value.fixedAllowance.allowanceValue;
              }
            });
          }
        });

        allowanceValueLocal = (sum * ctcDeductionElement.value) / 100
        let allowanceAmount = allowanceValueLocal;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        const controlFormGroup = <FormGroup>control4.at(index);
        controlFormGroup.controls.value.setValue(ctcDeductionElement.value);
        const fixedDeductionFormGroup = <FormGroup>controlFormGroup.controls.fixedDeduction;
        fixedDeductionFormGroup.controls.deductionValue.setValue(allowanceAmount);
      }



    });

    // ctcDeductions work end

    // console.log('ctcDeduction start');
    // this.variableDeductions.forEach(variableDeductionElement => {
    //   const control = <FormArray>this.salaryForm.controls['variableDeduction'];
    //   control.push(
    //     this.fb.group({
    //       'ctcVariableDeductionId': [variableDeductionElement.ctcVariableDeductionId],
    //       'variableDeduction': this.fb.group({
    //         'deductionId': [variableDeductionElement.deductionId],
    //         'deductionName': [variableDeductionElement.deductionName],
    //         'deductionValue': [variableDeductionElement.value],
    //       }),
    //       'criteria': [variableDeductionElement.criteria],
    //       'value': [variableDeductionElement.value],
    //       'dependentDeductionIds': [variableDeductionElement.dependentDeductionIds],
    //       'minimumAmount': [variableDeductionElement.minimumAmount],
    //     })
    //   );
    // });

    // this.variableAllowances.forEach(variableAllowanceElement => {
    //   const control = <FormArray>this.salaryForm.controls['variableAllowance'];
    //   control.push(
    //     this.fb.group({
    //       'ctcVariableAllowanceId': [variableAllowanceElement.ctcVariableAllowanceId],
    //       'variableAllowance': this.fb.group({
    //         'allowanceId': [variableAllowanceElement.allowanceId],
    //         'allowanceName': [variableAllowanceElement.allowanceName],
    //         'allowanceValue': [variableAllowanceElement.value],
    //       }),
    //       'criteria': [variableAllowanceElement.criteria],
    //       'value': [variableAllowanceElement.value],
    //       'dependentAllowanceIds': [variableAllowanceElement.dependentAllowanceIds],
    //       'minimumAmount': [variableAllowanceElement.minimumAmount],
    //     })
    //   );
    // });

    // employee deduction start
    console.log('employeeDeductions start');
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    // control3.controls = [];
    this.employeeDeductions.forEach(employeeDeductionEelement => {
      let index = this.employeeDeductions.indexOf(employeeDeductionEelement);
      // control3.push(
      //   this.fb.group({
      //     // 'criteria': [employeeDeductionEelement.employeeDeduction.criteria],
      //     // 'default': [employeeDeductionEelement.employeeDeduction.default],
      //     // 'dependentAllowanceList': this.fb.array([]),
      //     // 'employeeDeductionId': [employeeDeductionEelement.employeeDeductionId],
      //     'employeeDeductionName': [employeeDeductionEelement.employeeDeductionsName],
      //     'employeeDeductionValue': [0],
      //     'isDeductable': [employeeDeductionEelement.fieldValue],
      //     'value': [employeeDeductionEelement.value],
      //   })
      // );

      let deductionAmount = 0;
      if (employeeDeductionEelement.employeeDeductionName == 'PF Employee Deduction') {
        if (this.salaryForm.controls.isPFDeductible.value) {
          if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
            deductionAmount = (this.salaryForm.controls.providentFundWageAmount.value * 12) / 100;
            if (this.salaryForm.controls.isEmployeePFCaped.value) {
              deductionAmount = (this.salaryForm.controls.providentFundWageAmount.value >= 15000) ? (15000 * 12) / 100 : deductionAmount;
            }
          } else if (this.salaryForm.controls.pfTemplateId.value) {
            let sum = 0;
            this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowanceId === id) {
                  sum = sum + +element1.value.fixedAllowance.allowanceValue;
                }
              });
            });
            deductionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployeePFCaped.value) {
              deductionAmount = (sum >= 15000) ? (15000 * 12) / 100 : deductionAmount;
            }
          } else {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowPF) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            deductionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployeePFCaped.value) {
              deductionAmount = (sum >= 15000) ? (15000 * 12) / 100 : deductionAmount;
            }
          }
        }
      }

      if (employeeDeductionEelement.employeeDeductionName == 'ESIC Employee Deduction') {
        if ( this.salaryForm.controls.isESICDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowESIC) {
              sum = sum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          if (sum <= this.esicCellingAmount.maxAmount) {
            if (this.esicSlab.fromAmount <= sum && sum <= this.esicSlab.toAmount) {
              deductionAmount = Math.ceil((sum * this.esicSlab.employeePercentage) / 100);
            }
          }
        }
      }

      if (employeeDeductionEelement.employeeDeductionName == 'LWF Employee Deduction') {
        if ( this.salaryForm.controls.isLWFDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowLWF) {
              sum = sum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          this.lwfSlabs.forEach(element => {
            if (element.fromAmount <= sum && sum <= element.toAmount) {
              deductionAmount = element.employeeAmount;
              this.selectedlwfSlab = element;
            }
          });
        }
      }
      if (employeeDeductionEelement.employeeDeductionName == 'PT Deduction') {
        if ( this.salaryForm.controls.isProfessionalTaxDeductible.value) {
          let grossSum = 0;

          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowProfessionalTax) {
              grossSum = grossSum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          if (this.ptStatus == 'MONTHLY') {
            this.ptSlabs.forEach(element => {
              if (element.fromAmount <= grossSum && grossSum <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedptSlab = element;
              }
            });
          } else if (this.ptStatus == 'HALF_YEARLY') {
            this.ptSlabs.forEach(element => {
              if (element.fromAmount <= (grossSum * 2) && (grossSum * 2) <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedptSlab = element;
              }
            });
          } else if (this.ptStatus == 'YEARLY') {
            this.ptSlabs.forEach(element => {
              if (element.fromAmount <= (grossSum * 12) && (grossSum * 12) <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedptSlab = element;
              }
            });
          }
        }
      }
      if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
        deductionAmount = Math.round(deductionAmount);
      }
      const controlFormGroup = <FormGroup>control3.at(index);
      controlFormGroup.controls.employeeDeductionValue.setValue(deductionAmount);
    });
    // employee deduction end


    // employeer contribution start
    console.log('ctcEmployerContribution start');
    const control2 = <FormArray>this.salaryForm.controls['employerContribution'];
    // control2.controls = [];
    this.employerContributions.forEach(employeeContributionElement => {
      let index = this.employerContributions.indexOf(employeeContributionElement);
      // control2.push(
      //   this.fb.group({
      //     // 'criteria': [employeeContributionElement.criteria],
      //     // 'employerContributionId': [employeeContributionElement.employerContributionId],
      //     'employerContributionName': [employeeContributionElement.employerContributionsName],
      //     'dependentAllowanceList': [employeeContributionElement.allowanceIds],
      //     'employerContributionValue': [0],
      //     // 'default': [employeeContributionElement.default],
      //     'isDeductable': [employeeContributionElement.fieldValue],
      //     'value': [employeeContributionElement.value],
      //   })
      // );

      let contributionAmount = 0;
      if (employeeContributionElement.employerContributionName == 'PF Employer Contribution') {
        if (this.salaryForm.controls.isPFDeductible.value) {
          if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
            contributionAmount = (this.salaryForm.controls.providentFundWageAmount.value * 12) / 100;
            if (this.salaryForm.controls.isEmployersPFCaped.value) {
              contributionAmount = (this.salaryForm.controls.providentFundWageAmount.value >= 15000) ? (15000 * 12) / 100 : contributionAmount;
            }
          } else if (this.salaryForm.controls.pfTemplateId.value) {
            let sum = 0;
            this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowanceId === id) {
                  sum = sum + +element1.value.fixedAllowance.allowanceValue;
                }
              });
            });
            contributionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployersPFCaped.value) {
              contributionAmount = (sum >= 15000) ? (15000 * 12) / 100 : contributionAmount;
            }
          } else {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowPF) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            contributionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployersPFCaped.value) {
              contributionAmount = (sum >= 15000) ? (15000 * 12) / 100 : contributionAmount;
            }
          }
        }
      }
      if (employeeContributionElement.employerContributionName == 'ESIC Employer Contribution') {
        if (this.salaryForm.controls.isESICDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowESIC) {
              sum = sum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          if (sum <= this.esicCellingAmount.maxAmount) {
            if (this.esicSlab.fromAmount <= sum && sum <= this.esicSlab.toAmount) {
              contributionAmount = Math.ceil((sum * this.esicSlab.employerPercentage) / 100);
            }
          }
        }
      }

      if (employeeContributionElement.employerContributionName == 'LWF Employer Contribution') {
        if ( this.salaryForm.controls.isLWFDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowLWF) {
              sum = sum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          // if (this.lwfStatus == 'MONTHLY') {
          this.lwfSlabs.forEach(element => {
            if (element.fromAmount <= sum && sum <= element.toAmount) {
              contributionAmount = element.employerAmount;
              this.selectedlwfSlab = element;
            }
          });
          // }
        }
      }

      if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
        contributionAmount = Math.round(contributionAmount);
      }


      const controlFormGroup = <FormGroup>control2.at(index);
      controlFormGroup.controls.employerContributionValue.setValue(contributionAmount);
    });


    if (this.salaryForm.controls.amountType.value == 'AS_CTC') {
      this.ctcAllowancess.forEach(element => {
        if (element.valueType === 'BALANCE') {
          let index = this.ctcAllowancess.indexOf(element);
          let totalContribution = 0;
          let control2 = <FormArray>this.salaryForm.controls['employerContribution'];
          control2.controls.forEach(element => {
            if (element.value.employerContributionName == 'Employer LWF Contribution') {
              if (this.lwfStatus == 'MONTHLY') {
                totalContribution = totalContribution + +element.value.employerContributionValue;
              }
            } else {
              totalContribution = totalContribution + +element.value.employerContributionValue;
            }
          });
          let deductAmount = (alPercentSum + allAmountSum + totalContribution)
          let balanceAmount = this.salaryForm.controls.amount.value - deductAmount;


          if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
            balanceAmount = Math.round(balanceAmount);
          }

          const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
          const controlFormGroup = <FormGroup>control0.at(index);
          controlFormGroup.controls.value.setValue(element.value);
          const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
          fixedAllowanceFormGroup.controls.allowanceValue.setValue(balanceAmount);

          if (fixedAllowanceFormGroup.controls.allowanceValue.value < 0) {
            // this.salaryForm.controls.amount.setValue(0);
            console.log(fixedAllowanceFormGroup.controls.allowanceValue.value);
            this.setFormToZero();
          }
        }
      });
    }

    // employeer contribution end

    // this.showFixedDeductions = true;
    this.formRequestRegister = true;
    // this.showFiexedAllowance = true;
  }

  calculateCTCManually() {

    if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
      var sum = 0;
      for (var i = 0; i < control0.length; i++) {
        if (control0.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value != "")
          sum += +control0.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value;
      }
      this.totalMonthlyAllowances = sum;
      this.totalYearlyAllowances = 12 * sum;

      const control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
      var sum = 0;
      for (var i = 0; i < control1.length; i++) {
        if (control1.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value != "")
          sum += +control1.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value;
      }
      this.totalMonthlyBenefits = sum;
      this.totalYearlyBenefits = 12 * sum;

      const fdcontrol = <FormArray>this.salaryForm.controls['ctcDeductions'];
      var sum = 0;
      for (var i = 0; i < fdcontrol.length; i++) {
        if (fdcontrol.controls[i]['controls'].fixedDeduction.controls.deductionValue.value != "")
          sum += +fdcontrol.controls[i]['controls'].fixedDeduction.controls.deductionValue.value;
      }
      this.totalMonthlyDeductions = sum;
      this.totalYearlyDeductions = 12 * sum;



      ////////////////////////////////

      let control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      this.employeeDeductions.forEach(employeeDeductionEelement => {
        let index = this.employeeDeductions.indexOf(employeeDeductionEelement);


        let deductionAmount = 0;
        if (employeeDeductionEelement.employeeDeductionName == 'PF Employee Deduction') {
          if ( this.salaryForm.controls.isPFDeductible.value) {
            if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
              deductionAmount = (this.salaryForm.controls.providentFundWageAmount.value * 12) / 100;
              if (this.salaryForm.controls.isEmployeePFCaped.value) {
                deductionAmount = (this.salaryForm.controls.providentFundWageAmount.value >= 15000) ? (15000 * 12) / 100 : deductionAmount;
              }
            } else if (this.salaryForm.controls.pfTemplateId.value) {
              let sum = 0;
              this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
                control0.controls.forEach(element1 => {
                  if (element1.value.fixedAllowance.allowanceId === id) {
                    sum = sum + +element1.value.fixedAllowance.allowanceValue;
                  }
                });
              });
              deductionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployeePFCaped.value) {
                deductionAmount = (sum >= 15000) ? (15000 * 12) / 100 : deductionAmount;
              }
            } else {
              let sum = 0;
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowPF) {
                  sum = sum + +element1.value.fixedAllowance.allowanceValue;
                }
              });
              deductionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployeePFCaped.value) {
                deductionAmount = (sum >= 15000) ? (15000 * 12) / 100 : deductionAmount;
              }
            }
          }
        }

        if (employeeDeductionEelement.employeeDeductionName == 'ESIC Employee Deduction') {
          if ( this.salaryForm.controls.isESICDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowESIC) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            if (sum <= this.esicCellingAmount.maxAmount) {
              if (this.esicSlab.fromAmount <= sum && sum <= this.esicSlab.toAmount) {
                deductionAmount = Math.ceil((sum * this.esicSlab.employeePercentage) / 100);
              }
            }
          }
        }

        if (employeeDeductionEelement.employeeDeductionName == 'LWF Employee Deduction') {
          if ( this.salaryForm.controls.isLWFDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowLWF) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            this.lwfSlabs.forEach(element => {
              if (element.fromAmount <= sum && sum <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedlwfSlab = element;
              }
            });
          }
        }
        if (employeeDeductionEelement.employeeDeductionName == 'PT Deduction') {
          if ( this.salaryForm.controls.isProfessionalTaxDeductible.value) {
            let grossSum = 0;

            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowProfessionalTax) {
                grossSum = grossSum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            if (this.ptStatus == 'MONTHLY') {
              this.ptSlabs.forEach(element => {
                if (element.fromAmount <= grossSum && grossSum <= element.toAmount) {
                  deductionAmount = element.employeeAmount;
                  this.selectedptSlab = element;
                }
              });
            } else if (this.ptStatus == 'HALF_YEARLY') {
              this.ptSlabs.forEach(element => {
                if (element.fromAmount <= (grossSum * 2) && (grossSum * 2) <= element.toAmount) {
                  deductionAmount = element.employeeAmount;
                  this.selectedptSlab = element;
                }
              });
            } else if (this.ptStatus == 'YEARLY') {
              this.ptSlabs.forEach(element => {
                if (element.fromAmount <= (grossSum * 12) && (grossSum * 12) <= element.toAmount) {
                  deductionAmount = element.employeeAmount;
                  this.selectedptSlab = element;
                }
              });
            }
          }
        }

        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          deductionAmount = Math.round(deductionAmount);
        }

        const controlFormGroup = <FormGroup>control3.at(index);
        controlFormGroup.controls.employeeDeductionValue.setValue(deductionAmount);
      });



      console.log('ctcEmployerContribution start');
      let control2 = <FormArray>this.salaryForm.controls['employerContribution'];

      this.employerContributions.forEach(employeeContributionElement => {
        let index = this.employerContributions.indexOf(employeeContributionElement);

        let contributionAmount = 0;
        if (employeeContributionElement.employerContributionName == 'PF Employer Contribution') {
          if ( this.salaryForm.controls.isPFDeductible.value) {
            if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
              contributionAmount = (this.salaryForm.controls.providentFundWageAmount.value * 12) / 100;
              if (this.salaryForm.controls.isEmployersPFCaped.value) {
                contributionAmount = (this.salaryForm.controls.providentFundWageAmount.value >= 15000) ? (15000 * 12) / 100 : contributionAmount;
              }
            } else if (this.salaryForm.controls.pfTemplateId.value) {
              let sum = 0;
              this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
                control0.controls.forEach(element1 => {
                  if (element1.value.fixedAllowance.allowanceId === id) {
                    sum = sum + +element1.value.fixedAllowance.allowanceValue;
                  }
                });
              });
              contributionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployersPFCaped.value) {
                contributionAmount = (sum >= 15000) ? (15000 * 12) / 100 : contributionAmount;
              }
            } else {
              let sum = 0;
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowPF) {
                  sum = sum + +element1.value.fixedAllowance.allowanceValue;
                }
              });
              contributionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployersPFCaped.value) {
                contributionAmount = (sum >= 15000) ? (15000 * 12) / 100 : contributionAmount;
              }
            }
          }
        }
        if (employeeContributionElement.employerContributionName == 'ESIC Employer Contribution') {
          if ( this.salaryForm.controls.isESICDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowESIC) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            if (sum <= this.esicCellingAmount.maxAmount) {
              if (this.esicSlab.fromAmount <= sum && sum <= this.esicSlab.toAmount) {
                contributionAmount = Math.ceil((sum * this.esicSlab.employerPercentage) / 100);
              }
            }
          }
        }

        if (employeeContributionElement.employerContributionName == 'LWF Employer Contribution') {
          if ( this.salaryForm.controls.isLWFDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowLWF) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            this.lwfSlabs.forEach(element => {
              if (element.fromAmount <= sum && sum <= element.toAmount) {
                contributionAmount = element.employerAmount;
                this.selectedlwfSlab = element;
              }
            });
          }
        }
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          contributionAmount = Math.round(contributionAmount);
        }
        const controlFormGroup = <FormGroup>control2.at(index);
        controlFormGroup.controls.employerContributionValue.setValue(contributionAmount);
      });


      this.totalEmployerStatutoryContributionY = 0;
      this.totalEmployerStatutoryContributionM = 0;
      control2 = <FormArray>this.salaryForm.controls['employerContribution'];
      length = control2.length;
      control2.controls.forEach(element => {
        if (element.value.employerContributionName == 'Employer LWF Contribution') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + +element.value.employerContributionValue;
          }
        } else {
          this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + +element.value.employerContributionValue;
        }

        if (element.value.employerContributionName == 'Employer LWF Contribution') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue * 12) : +element.value.employerContributionValue * 12);
          } else if (this.lwfStatus == 'HALF_YEARLY') {
            this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue * 2) : +element.value.employerContributionValue * 2);
          } else if (this.lwfStatus == 'YEARLY') {
            this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue) : +element.value.employerContributionValue);
          }
        } else if (element.value.employerContributionName == 'Employer ESIC Contribution') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + Math.ceil(+element.value.employerContributionValue * 12);
        } else {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue * 12) : +element.value.employerContributionValue * 12);
        }
      });


      // calculate calculateMonthlyEmployerContributionSum end

      // calculate calculateMonthlyEmployeeDeductionSum start
      this.totalEmployeeStatutoryDeductionY = 0;
      this.totalEmployeeStatutoryDeductionM = 0;
      control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      length = control3.length;
      control3.controls.forEach(element => {
        if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
          }
        } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
          if (this.ptStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
          }
        } else {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
        }

        if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 12) : +element.value.employeeDeductionValue * 12);
          } else if (this.lwfStatus == 'HALF_YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 2) : +element.value.employeeDeductionValue * 2);
          } else if (this.lwfStatus == 'YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
          }
        } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
          if (this.ptStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 12) : +element.value.employeeDeductionValue * 12);
          } else if (this.ptStatus == 'HALF_YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 2) : +element.value.employeeDeductionValue * 2);
          } else if (this.ptStatus == 'YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
          }
        } else if (element.value.employeeDeductionName == 'Employee ESIC Deduction') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + Math.ceil(+element.value.employeeDeductionValue * 12);
        } else {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 12) : +element.value.employeeDeductionValue * 12);
        }
      });


      ////////////


    } else if (this.salaryForm.controls.ctcFrequency.value === 'Annualy') {
      const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
      var sum = 0;
      for (var i = 0; i < control0.length; i++) {
        if (control0.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value != "")
          sum += +control0.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value;
      }
      this.totalYearlyAllowances = sum;
      this.totalMonthlyAllowances = sum / 12;

      const control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
      var sum = 0;
      for (var i = 0; i < control1.length; i++) {
        if (control1.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value != "")
          sum += +control1.controls[i]['controls'].fixedAllowance.controls.allowanceValue.value;
      }
      this.totalYearlyBenefits = sum;
      this.totalMonthlyBenefits = sum / 12;


      const fdcontrol = <FormArray>this.salaryForm.controls['ctcDeductions'];
      var sum = 0;
      for (var i = 0; i < fdcontrol.length; i++) {
        if (fdcontrol.controls[i]['controls'].fixedDeduction.controls.deductionValue.value != "")
          sum += +fdcontrol.controls[i]['controls'].fixedDeduction.controls.deductionValue.value;
      }
      this.totalYearlyDeductions = sum;
      this.totalMonthlyDeductions = sum / 12;

      /////////////////////////////

      let control3 = <FormArray>this.salaryForm.controls['employeeDeduction']
      this.employeeDeductions.forEach(employeeDeductionEelement => {
        let index = this.employeeDeductions.indexOf(employeeDeductionEelement);

        let deductionAmount = 0;
        if (employeeDeductionEelement.employeeDeductionName == 'PF Employee Deduction') {
          if ( this.salaryForm.controls.isPFDeductible.value) {
            if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
              deductionAmount = ((this.salaryForm.controls.providentFundWageAmount.value * 12) / 100);
              if (this.salaryForm.controls.isEmployeePFCaped.value) {
                deductionAmount = ((+this.salaryForm.controls.providentFundWageAmount.value) / 12 >= 15000) ? ((15000 * 12) / 100) * 12 : deductionAmount;
              }
            } else if (this.salaryForm.controls.pfTemplateId.value) {
              let sum = 0;
              this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
                control0.controls.forEach(element1 => {
                  if (element1.value.fixedAllowance.allowanceId === id) {
                    sum = sum + +element1.value.fixedAllowance.allowanceValue;
                  }
                });
              });
              deductionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployeePFCaped.value) {
                deductionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : deductionAmount;
              }
            } else {
              let sum = 0;
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowPF) {
                  sum = sum + +element1.value.fixedAllowance.allowanceValue;
                }
              });
              deductionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployeePFCaped.value) {
                deductionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : deductionAmount;
              }
            }
          }
        }
        if (employeeDeductionEelement.employeeDeductionName == 'ESIC Employee Deduction') {
          if ( this.salaryForm.controls.isESICDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowESIC) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            if ((sum / 12) <= this.esicCellingAmount.maxAmount) {
              if (this.esicSlab.fromAmount <= (sum / 12) && (sum / 12) <= this.esicSlab.toAmount) {
                deductionAmount = Math.ceil((sum * this.esicSlab.employeePercentage) / 100);
              }
            }
          }
        }
        if (employeeDeductionEelement.employeeDeductionName == 'LWF Employee Deduction') {
          if (this.salaryForm.controls.isLWFDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowLWF) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            this.lwfSlabs.forEach(element => {
              if (element.fromAmount <= (sum / 12) && (sum / 12) <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedlwfSlab = element;
              }
            });
          }
        }

        if (employeeDeductionEelement.employeeDeductionName == 'PT Deduction') {
          if ( this.salaryForm.controls.isProfessionalTaxDeductible.value) {
            let grossSum = 0;
            let totalGrossSum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowProfessionalTax) {
                grossSum = grossSum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            if (this.ptStatus == 'MONTHLY') {
              this.ptSlabs.forEach(element => {
                if (element.fromAmount <= (grossSum / 12) && (grossSum / 12) <= element.toAmount) {
                  deductionAmount = element.employeeAmount;
                  this.selectedptSlab = element;
                }
              });
            } else if (this.ptStatus == 'HALF_YEARLY') {
              this.ptSlabs.forEach(element => {
                if (element.fromAmount <= (grossSum / 2) && (grossSum / 2) <= element.toAmount) {
                  deductionAmount = element.employeeAmount;
                  this.selectedptSlab = element;
                }
              });
            } else if (this.ptStatus == 'YEARLY') {
              this.ptSlabs.forEach(element => {
                if (element.fromAmount <= grossSum && grossSum <= element.toAmount) {
                  deductionAmount = element.employeeAmount;
                  this.selectedptSlab = element;
                }
              });
            }
          }
        }

        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          deductionAmount = Math.round(deductionAmount);
        }

        const controlFormGroup = <FormGroup>control3.at(index);
        controlFormGroup.controls.employeeDeductionValue.setValue(deductionAmount);
      });

      console.log('ctcEmployerContribution start');
      let control2 = <FormArray>this.salaryForm.controls['employerContribution'];

      this.employerContributions.forEach(employeeContributionElement => {
        let index = this.employerContributions.indexOf(employeeContributionElement);


        let contributionAmount = 0;
        if (employeeContributionElement.employerContributionName == 'PF Employer Contribution') {
          if ( this.salaryForm.controls.isPFDeductible.value) {
            if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
              contributionAmount = ((this.salaryForm.controls.providentFundWageAmount.value * 12) / 100);
              if (this.salaryForm.controls.isEmployersPFCaped.value) {
                contributionAmount = ((+this.salaryForm.controls.providentFundWageAmount.value) / 12 >= 15000) ? ((15000 * 12) / 100) * 12 : contributionAmount;
              }
            } else if (this.salaryForm.controls.pfTemplateId.value) {
              let sum = 0;
              this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
                control0.controls.forEach(element1 => {
                  if (element1.value.fixedAllowance.allowanceId === id) {
                    sum = sum + element1.value.fixedAllowance.allowanceValue;
                  }
                });
              });
              contributionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployersPFCaped.value) {
                contributionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : contributionAmount;
              }
            } else {
              let sum = 0;
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowPF) {
                  sum = sum + element1.value.fixedAllowance.allowanceValue;
                }
              });
              contributionAmount = (sum * 12) / 100;
              if (this.salaryForm.controls.isEmployersPFCaped.value) {
                contributionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : contributionAmount;
              }
            }
          }
        }
        if (employeeContributionElement.employerContributionName == 'ESIC Employer Contribution') {
          if ( this.salaryForm.controls.isESICDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowESIC) {
                sum = sum + element1.value.fixedAllowance.allowanceValue;
              }
            });
            if ((sum / 12) <= this.esicCellingAmount.maxAmount) {
              if (this.esicSlab.fromAmount <= (sum / 12) && (sum / 12) <= this.esicSlab.toAmount) {
                contributionAmount = Math.ceil((sum * this.esicSlab.employerPercentage) / 100);
              }
            }
          }
        }

        if (employeeContributionElement.employerContributionName == 'LWF Employer Contribution') {
          if ( this.salaryForm.controls.isLWFDeductible.value) {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowLWF) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            this.lwfSlabs.forEach(element => {
              if (element.fromAmount <= (sum / 12) && (sum / 12) <= element.toAmount) {
                contributionAmount = element.employerAmount;
              }
            });
          }
        }

        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          contributionAmount = Math.round(contributionAmount);
        }
        const controlFormGroup = <FormGroup>control2.at(index);
        controlFormGroup.controls.employerContributionValue.setValue(contributionAmount);
      });


      this.totalEmployerStatutoryContributionY = 0;
      this.totalEmployerStatutoryContributionM = 0;
      control2 = <FormArray>this.salaryForm.controls['employerContribution'];
      length = control2.length;
      control2.controls.forEach(element => {
        // tslint:disable-next-line:max-line-length
        if (element.value.employerContributionName == 'Employer LWF Contribution') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue * 12;
          } else if (this.lwfStatus == 'HALF_YEARLY') {
            this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue * 2;
          } else if (this.lwfStatus == 'YEARLY') {
            this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue;
          }
        } else {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue;
        }

        if (element.value.employerContributionName == 'Employer LWF Contribution') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue) : +element.value.employerContributionValue);
          }
        } else if ((element.value.employerContributionName == 'Employer ESIC Contribution')) {
          this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + Math.ceil(+element.value.employerContributionValue / 12);
        } else {
          this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue / 12) : +element.value.employerContributionValue / 12);
        }
      });
      // this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionY;
      // calculate calculateAnuallyEmployerContributionSum end

      // calculate calculateAnuallyDeductionSum start
      this.totalYearlyDeductions = 0;
      this.totalMonthlyDeductions = 0;
      let control4 = <FormArray>this.salaryForm.controls['ctcDeductions'];
      length = control4.length;
      control4.controls.forEach(element => {
        this.totalYearlyDeductions = this.totalYearlyDeductions + +element.value.fixedDeduction.deductionValue;
      });
      this.totalMonthlyDeductions = this.totalYearlyDeductions / 12;
      // calculate calculateAnuallyDeductionSum end

      // calculate calculateAnuallyEmployeeDeductionSum start
      this.totalEmployeeStatutoryDeductionY = 0;
      this.totalEmployeeStatutoryDeductionM = 0;
      control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      length = control3.length;
      control3.controls.forEach(element => {
        // tslint:disable-next-line:max-line-length
        if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 12;
          } else if (this.lwfStatus == 'HALF_YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 2;
          } else if (this.lwfStatus == 'YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue;
          }
        } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
          if (this.ptStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 12;
          } else if (this.ptStatus == 'HALF_YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 2;
          } else if (this.ptStatus == 'YEARLY') {
            this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue;
          }
        } else {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue;
        }

        if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
          if (this.lwfStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
          }
        } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
          if (this.ptStatus == 'MONTHLY') {
            this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
          }
        } else if (element.value.employeeDeductionName == 'Employee ESIC Deduction') {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + Math.ceil(+element.value.employeeDeductionValue / 12);
        } else {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue / 12) : +element.value.employeeDeductionValue / 12);
        }

      });



      ///////////////////////////
    }


    this.totalNetSalaryM = (this.totalMonthlyAllowances) - (this.totalMonthlyDeductions + this.totalEmployeeStatutoryDeductionM);
    this.totalNetSalaryY = (this.totalYearlyAllowances) - (this.totalYearlyDeductions + this.totalEmployeeStatutoryDeductionY);


    this.totalNetSalaryIM = (this.totalMonthlyAllowances + this.totalEmployerStatutoryContributionM);
    this.totalNetSalaryIY = (this.totalYearlyAllowances + this.totalEmployerStatutoryContributionY);

    this.totalGrossSalaryY = (this.totalYearlyAllowances) + this.totalVariableAllowanceY + this.totalEmployerStatutoryContributionY + this.totalYearlyBenefits;


    if (this.salaryForm.controls.ctcFrequency.value === 'Annualy') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalNetSalaryY)
      this.salaryForm.controls.ctcExcludingVariables.setValue(this.totalNetSalaryIY)
      this.salaryForm.controls.ctcIncludingVariables.setValue(this.totalGrossSalaryY)

    } else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalNetSalaryM)
      this.salaryForm.controls.ctcExcludingVariables.setValue(this.totalNetSalaryIM)
      this.salaryForm.controls.ctcIncludingVariables.setValue(this.totalGrossSalaryY)
    }

    if (this.salaryForm.controls.ctcTemplateId.value == -1) {
      var amount = 0;
      if (this.salaryForm.controls.amountType.value == 'AS_CTC') {


        if (this.salaryForm.controls.ctcFrequency.value === 'Annualy') {
          amount = this.totalYearlyAllowances + this.totalYearlyBenefits + this.totalEmployerStatutoryContributionY;
        } else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
          amount = this.totalMonthlyAllowances + this.totalMonthlyBenefits + this.totalEmployerStatutoryContributionM;
        }



      } else if (this.salaryForm.controls.amountType.value == 'GROSS_SALARY') {

        if (this.salaryForm.controls.ctcFrequency.value === 'Annualy') {
          amount = this.totalYearlyAllowances + this.totalYearlyBenefits;
        } else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
          amount = this.totalMonthlyAllowances + this.totalMonthlyBenefits;
        }


      }

      this.salaryForm.controls.amount.setValue(amount);
    }
  }
  calculateCtcAllowanceAnually() {
    let alPercentSum = 0;
    let allAmountSum = 0;

    console.log('ctc allowance anually start');
    //ctc Allowance work start
    let minimumAmountForCtc = 0;
    let ctcAllowanceIndex = 0;
    const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    // control0.controls = [];
    let remainingAmount = this.salaryForm.controls.amount.value;
    this.ctcAllowancess.forEach(element => {
      let index = this.ctcAllowancess.indexOf(element);
      // control0.push(
      //   this.fb.group({
      //     'ctcAllowanceId': [element.ctcFixedAllowanceId],
      //     'fixedAllowance': this.fb.group({
      //       'allowanceId': [element.allowanceId],
      //       'allowanceName': [element.allowanceName],
      //       'allowanceValue': [element.value],
      //       'isDefaultAllowance': [element.isDefaultAllowance],
      //       'allowPF': [element.allowPF],
      //       'allowESIC': [element.allowESIC],
      //       'allowLWF': [element.allowLWF],
      //       'allowProfessionalTax': [element.allowProfessionalTax],
      //       'allowIncomeTax': [element.allowIncomeTax],
      //       'allowExempt': [element.allowExempt],
      //       'exemptLimit': [element.exemptLimit],
      //       'showInCTC': [element.showInCTC],
      //       'paymentFrequency': [element.paymentFrequency],
      //     }),
      //     'criteria': [element.criteria],
      //     'value': [element.value],
      //     'dependentAllowanceIds': [element.dependentAllowanceIds],
      //     'minimumAmount': [element.minimumAmount]
      //   })
      // );

      if (element.valueType === 'AMOUNT') {
        // if criteria type amount then we only set the values
        const controlFormGroup = <FormGroup>control0.at(index);
        controlFormGroup.controls.value.setValue(element.value);
        const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
        let allowanceAmount = (remainingAmount >= (element.value * 12)) ? (element.value * 12) : remainingAmount;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
        remainingAmount = remainingAmount - allowanceAmount;
        allAmountSum = allAmountSum + allowanceAmount;

      } else if (element.valueType === 'PERCENTAGE') {
        // if criteria type PERCENTAGE then we only set the values

        let allowanceValueLocal = 0;
        let requiredCtcAllowance = [];
        let sum = 0;
        let doSum = false;
        element.dependentAllowanceIds.forEach(dependants => {
          if (dependants.value === -1) {
            sum = sum + this.salaryForm.controls.amount.value

          } else {
            // it not depend on ctc
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowanceId === dependants.value) {

                sum = sum + element1.value.fixedAllowance.allowanceValue;
              }
            });
            doSum = true;
          }
          allowanceValueLocal = (sum * element.value) / 100
          let allowanceAmount = (remainingAmount >= allowanceValueLocal) ? allowanceValueLocal : remainingAmount;
          if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
            allowanceAmount = Math.round(allowanceAmount);
          }
          alPercentSum = alPercentSum + allowanceAmount;
          const controlFormGroup = <FormGroup>control0.at(index);
          const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
          controlFormGroup.controls.value.setValue(element.value);
          fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
          remainingAmount = remainingAmount - allowanceAmount;
          // }
        });
      }
    });

    const control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    // control1.controls = [];
    this.ctcOtherBenefits.forEach(element => {
      let index = this.ctcOtherBenefits.indexOf(element);
      // control1.push(
      //   this.fb.group({
      //     'ctcAllowanceId': [element.ctcOtherBenefitId],
      //     'fixedAllowance': this.fb.group({
      //       'allowanceId': [element.allowanceId],
      //       'allowanceName': [element.allowanceName],
      //       'allowanceValue': [element.value],
      //     }),
      //     'criteria': [element.criteria],
      //     'value': [element.value],
      //     'dependentAllowanceIds': [element.dependentAllowanceIds],
      //     'minimumAmount': [element.minimumAmount]
      //   })
      // );
      let amountSum = 0;
      if (element.valueType === 'AMOUNT') {
        // if criteria type amount then we only set the values
        const controlFormGroup = <FormGroup>control1.at(index);
        controlFormGroup.controls.value.setValue(element.value);
        const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
        let allowanceAmount = (remainingAmount >= (element.value * 12)) ? (element.value * 12) : remainingAmount;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
        remainingAmount = remainingAmount - allowanceAmount;
        allAmountSum = allAmountSum + allowanceAmount;

      } else if (element.valueType === 'PERCENTAGE') {
        // if criteria type PERCENTAGE then we only set the values

        let allowanceValueLocal = 0;
        let requiredCtcAllowance = [];
        let sum = 0;
        let doSum = false;
        element.dependentAllowanceIds.forEach(dependants => {
          if (dependants.value === -1) {
            // it depend on ctc so calculate this percentage on ctc
            sum = sum + this.salaryForm.controls.amount.value

          } else {
            // it not depend on ctc
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowanceId === dependants.value) {

                sum = sum + element1.value.fixedAllowance.allowanceValue;
              }
            });
          }

          allowanceValueLocal = (sum * element.value) / 100
          let allowanceAmount = (remainingAmount >= allowanceValueLocal) ? allowanceValueLocal : remainingAmount;
          if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
            allowanceAmount = Math.round(allowanceAmount);
          }
          alPercentSum = alPercentSum + allowanceAmount;
          const controlFormGroup = <FormGroup>control1.at(index);
          controlFormGroup.controls.value.setValue(element.value);
          const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
          fixedAllowanceFormGroup.controls.allowanceValue.setValue(allowanceAmount);
          remainingAmount = remainingAmount - allowanceAmount;
          // }
        });
      }

      // totalBenefitAmount =  (alPercentSum + allAmountSum);

    });

    if (this.salaryForm.controls.amountType.value == 'GROSS_SALARY') {
      this.ctcAllowancess.forEach(element => {
        if (element.valueType === 'BALANCE') {
          let index = this.ctcAllowancess.indexOf(element);
          const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];

          let allowanceAmount = this.salaryForm.controls.amount.value - (alPercentSum + allAmountSum);
          if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
            allowanceAmount = Math.round(allowanceAmount);
          }
          const controlFormGroup = <FormGroup>control0.at(index);
          controlFormGroup.controls.value.setValue(element.value);
          const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
          fixedAllowanceFormGroup.controls.allowanceValue
            .setValue(allowanceAmount);
          if (fixedAllowanceFormGroup.controls.allowanceValue.value < 0) {
            console.log(fixedAllowanceFormGroup.controls.allowanceValue.value);
            this.setFormToZero();
          }
        }
      });
    }



    // ctc Allowance work end

    // ctcDeductions work start
    console.log('ctcDeduction start');
    const control4 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    // control4.controls = [];
    this.ctcDeductionss.forEach(ctcDeductionElement => {
      let index = this.ctcDeductionss.indexOf(ctcDeductionElement);
      // control4.push(
      //   this.fb.group({
      //     'ctcDeductionId': [ctcDeductionElement.ctcFixedDeductionId],
      //     'fixedDeduction': this.fb.group({
      //       'deductionId': [ctcDeductionElement.deductionId],
      //       'deductionName': [ctcDeductionElement.deductionName],
      //       'deductionValue': [],
      //     }),
      //     'criteria': [ctcDeductionElement.criteria],
      //     'value': [ctcDeductionElement.value],
      //     'dependentDeductionIds': [ctcDeductionElement.dependentDeductionIds],
      //     'minimumAmount': [ctcDeductionElement.minimumAmount],
      //   })
      // );

      if (ctcDeductionElement.valueType === 'AMOUNT') {
        // if criteria type amount then we only set the values
        const controlFormGroup = <FormGroup>control4.at(index);
        controlFormGroup.controls.value.setValue(ctcDeductionElement.value);
        const fixedDeductionFormGroup = <FormGroup>controlFormGroup.controls.fixedDeduction;
        // set the fixed amount in formcontrol
        let allowanceAmount = ctcDeductionElement.value * 12;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        fixedDeductionFormGroup.controls.deductionValue.setValue(allowanceAmount);
      } else if (ctcDeductionElement.valueType === 'PERCENTAGE') {
        // if criteria type PERCENTAGE then we only set the values

        let allowanceValueLocal = 0;
        let sum = 0;
        ctcDeductionElement.dependentAllowanceIds.forEach(dependants => {
          if (dependants.value == -1) {
            sum = sum + this.salaryForm.controls.amount.value
          } else {
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowanceId === dependants.value) {
                sum = sum + element1.value.fixedAllowance.allowanceValue;
              }
            });
          }
        });

        allowanceValueLocal = (sum * ctcDeductionElement.value) / 100
        let allowanceAmount = allowanceValueLocal;
        if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
          allowanceAmount = Math.round(allowanceAmount);
        }
        const controlFormGroup = <FormGroup>control4.at(index);
        controlFormGroup.controls.value.setValue(ctcDeductionElement.value);
        const fixedDeductionFormGroup = <FormGroup>controlFormGroup.controls.fixedDeduction;
        fixedDeductionFormGroup.controls.deductionValue.setValue(allowanceAmount);
      }

    });


    // this.variableDeductions.forEach(variableDeductionElement => {
    //   const control = <FormArray>this.salaryForm.controls['variableDeduction'];
    //   control.push(
    //     this.fb.group({
    //       'ctcVariableDeductionId': [variableDeductionElement.ctcVariableDeductionId],
    //       'variableDeduction': this.fb.group({
    //         'deductionId': [variableDeductionElement.deductionId],
    //         'deductionName': [variableDeductionElement.deductionName],
    //         'deductionValue': [variableDeductionElement.value],
    //       }),
    //       'criteria': [variableDeductionElement.criteria],
    //       'value': [variableDeductionElement.value],
    //       'dependentDeductionIds': [variableDeductionElement.dependentDeductionIds],
    //       'minimumAmount': [variableDeductionElement.minimumAmount],
    //     })
    //   );
    // });

    // this.variableAllowances.forEach(variableAllowanceElement => {
    //   const control = <FormArray>this.salaryForm.controls['variableAllowance'];
    //   control.push(
    //     this.fb.group({
    //       'ctcVariableAllowanceId': [variableAllowanceElement.ctcVariableAllowanceId],
    //       'variableAllowance': this.fb.group({
    //         'allowanceId': [variableAllowanceElement.allowanceId],
    //         'allowanceName': [variableAllowanceElement.allowanceName],
    //         'allowanceValue': [variableAllowanceElement.value],
    //       }),
    //       'criteria': [variableAllowanceElement.criteria],
    //       'value': [variableAllowanceElement.value],
    //       'dependentAllowanceIds': [variableAllowanceElement.dependentAllowanceIds],
    //       'minimumAmount': [variableAllowanceElement.minimumAmount],
    //     })
    //   );
    // });
    // // ctcDeductions work end

    // employee deduction start
    console.log('employeeDeductions start');
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    // control3.controls = [];
    this.employeeDeductions.forEach(employeeDeductionEelement => {
      let index = this.employeeDeductions.indexOf(employeeDeductionEelement);
      // control3.push(
      //   this.fb.group({
      //     // 'criteria': [employeeDeductionEelement.employeeDeduction.criteria],
      //     // 'default': [employeeDeductionEelement.employeeDeduction.default],
      //     // 'dependentAllowanceList': this.fb.array([]),
      //     // 'employeeDeductionId': [employeeDeductionEelement.employeeDeductionId],
      //     'employeeDeductionName': [employeeDeductionEelement.employeeDeductionsName],
      //     'employeeDeductionValue': [0],
      //     'isDeductable': [employeeDeductionEelement.fieldValue],
      //     'value': [employeeDeductionEelement.value],
      //   })
      // );

      let deductionAmount = 0;
      if (employeeDeductionEelement.employeeDeductionName == 'PF Employee Deduction') {
        if (this.salaryForm.controls.isPFDeductible.value) {
          if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
            deductionAmount = ((this.salaryForm.controls.providentFundWageAmount.value * 12) / 100);
            if (this.salaryForm.controls.isEmployeePFCaped.value) {
              deductionAmount = ((+this.salaryForm.controls.providentFundWageAmount.value) / 12 >= 15000) ? ((15000 * 12) / 100) * 12 : deductionAmount;
            }
          } else if (this.salaryForm.controls.pfTemplateId.value) {
            let sum = 0;
            this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowanceId === id) {
                  sum = sum + +element1.value.fixedAllowance.allowanceValue;
                }
              });
            });
            deductionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployeePFCaped.value) {
              deductionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : deductionAmount;
            }
          } else {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowPF) {
                sum = sum + +element1.value.fixedAllowance.allowanceValue;
              }
            });
            deductionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployeePFCaped.value) {
              deductionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : deductionAmount;
            }
          }
        }
      }
      if (employeeDeductionEelement.employeeDeductionName == 'ESIC Employee Deduction') {
        if (this.salaryForm.controls.isESICDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowESIC) {
              sum = sum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          if ((sum / 12) <= this.esicCellingAmount.maxAmount) {
            if (this.esicSlab.fromAmount <= (sum / 12) && (sum / 12) <= this.esicSlab.toAmount) {
              deductionAmount = Math.ceil((sum * this.esicSlab.employeePercentage) / 100);
            }
          }
        }
      }
      if (employeeDeductionEelement.employeeDeductionName == 'LWF Employee Deduction') {
        if ( this.salaryForm.controls.isLWFDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowLWF) {
              sum = sum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          this.lwfSlabs.forEach(element => {
            if (element.fromAmount <= (sum / 12) && (sum / 12) <= element.toAmount) {
              deductionAmount = element.employeeAmount;
              this.selectedlwfSlab = element;
            }
          });
        }
      }

      if (employeeDeductionEelement.employeeDeductionName == 'PT Deduction') {
        if ( this.salaryForm.controls.isProfessionalTaxDeductible.value) {
          let grossSum = 0;
          let totalGrossSum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowProfessionalTax) {
              grossSum = grossSum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          // let month = this.salaryForm.controls.payrollEffectiveDate.value.toString().split('-');
          // let forcustMounthCount = 0;
          if (this.ptStatus == 'MONTHLY') {
            this.ptSlabs.forEach(element => {
              if (element.fromAmount <= (grossSum / 12) && (grossSum / 12) <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedptSlab = element;
              }
            });
          } else if (this.ptStatus == 'HALF_YEARLY') {
            this.ptSlabs.forEach(element => {
              if (element.fromAmount <= (grossSum / 2) && (grossSum / 2) <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedptSlab = element;
              }
            });
          } else if (this.ptStatus == 'YEARLY') {
            this.ptSlabs.forEach(element => {
              if (element.fromAmount <= grossSum && grossSum <= element.toAmount) {
                deductionAmount = element.employeeAmount;
                this.selectedptSlab = element;
              }
            });
          }
        }
      }

      if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
        deductionAmount = Math.round(deductionAmount);
      }
      const controlFormGroup = <FormGroup>control3.at(index);
      controlFormGroup.controls.employeeDeductionValue.setValue(deductionAmount);
    });

    // employee deduction end


    // employeer contribution start
    console.log('ctcEmployerContribution start');
    const control2 = <FormArray>this.salaryForm.controls['employerContribution'];
    // control2.controls = [];
    this.employerContributions.forEach(employeeContributionElement => {
      let index = this.employerContributions.indexOf(employeeContributionElement);
      // control2.push(
      //   this.fb.group({
      //     // 'criteria': [employeeContributionElement.criteria],
      //     // 'employerContributionId': [employeeContributionElement.employerContributionId],
      //     'employerContributionName': [employeeContributionElement.employerContributionsName],
      //     'dependentAllowanceList': [employeeContributionElement.allowanceIds],
      //     'employerContributionValue': [0],
      //     // 'default': [employeeContributionElement.default],
      //     'isDeductable': [employeeContributionElement.fieldValue],
      //     'value': [employeeContributionElement.value],
      //   })
      // );

      let contributionAmount = 0;
      if (employeeContributionElement.employerContributionName == 'PF Employer Contribution') {
        if ( this.salaryForm.controls.isPFDeductible.value) {
          if (this.salaryForm.controls.providentFundWageAmount.value != 0 && this.salaryForm.controls.providentFundWageAmount.value != null) {
            contributionAmount = ((this.salaryForm.controls.providentFundWageAmount.value * 12) / 100);
            if (this.salaryForm.controls.isEmployersPFCaped.value) {
              contributionAmount = ((+this.salaryForm.controls.providentFundWageAmount.value) / 12 >= 15000) ? ((15000 * 12) / 100) * 12 : contributionAmount;
            }
          } else if (this.salaryForm.controls.pfTemplateId.value) {
            let sum = 0;
            this.salaryForm.controls.pfTemplateId.value.allowancesList.forEach(id => {
              control0.controls.forEach(element1 => {
                if (element1.value.fixedAllowance.allowanceId === id) {
                  sum = sum + element1.value.fixedAllowance.allowanceValue;
                }
              });
            });
            contributionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployersPFCaped.value) {
              contributionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : contributionAmount;
            }
          } else {
            let sum = 0;
            control0.controls.forEach(element1 => {
              if (element1.value.fixedAllowance.allowPF) {
                sum = sum + element1.value.fixedAllowance.allowanceValue;
              }
            });
            contributionAmount = (sum * 12) / 100;
            if (this.salaryForm.controls.isEmployersPFCaped.value) {
              contributionAmount = ((sum / 12) >= 15000) ? ((15000 * 12) / 100) * 12 : contributionAmount;
            }
          }
        }
      }
      if (employeeContributionElement.employerContributionName == 'ESIC Employer Contribution') {
        if ( this.salaryForm.controls.isESICDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowESIC) {
              sum = sum + element1.value.fixedAllowance.allowanceValue;
            }
          });
          if ((sum / 12) <= this.esicCellingAmount.maxAmount) {
            if (this.esicSlab.fromAmount <= (sum / 12) && (sum / 12) <= this.esicSlab.toAmount) {
              contributionAmount = Math.ceil((sum * this.esicSlab.employerPercentage) / 100);
            }
          }
        }
      }

      if (employeeContributionElement.employerContributionName == 'LWF Employer Contribution') {
        if ( this.salaryForm.controls.isLWFDeductible.value) {
          let sum = 0;
          control0.controls.forEach(element1 => {
            if (element1.value.fixedAllowance.allowLWF) {
              sum = sum + +element1.value.fixedAllowance.allowanceValue;
            }
          });
          this.lwfSlabs.forEach(element => {
            if (element.fromAmount <= (sum / 12) && (sum / 12) <= element.toAmount) {
              contributionAmount = element.employerAmount;
            }
          });
        }
      }

      if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
        contributionAmount = Math.round(contributionAmount);
      }
      const controlFormGroup = <FormGroup>control2.at(index);
      controlFormGroup.controls.employerContributionValue.setValue(contributionAmount);
    });



    if (this.salaryForm.controls.amountType.value == 'AS_CTC') {
      this.ctcAllowancess.forEach(element => {
        if (element.valueType === 'BALANCE') {
          let index = this.ctcAllowancess.indexOf(element);
          let totalContribution = 0;
          let control2 = <FormArray>this.salaryForm.controls['employerContribution'];
          control2.controls.forEach(element => {
            // tslint:disable-next-line:max-line-length
            if (element.value.employerContributionName == 'Employer LWF Contribution') {
              if (this.lwfStatus == 'MONTHLY') {
                totalContribution = totalContribution + +element.value.employerContributionValue * 12;
              }
              //  else if (this.lwfStatus == 'HALF_YEARLY') {
              //   totalContribution = totalContribution + +element.value.employerContributionValue * 2;
              // } else if (this.lwfStatus == 'YEARLY') {
              //   totalContribution = totalContribution + +element.value.employerContributionValue;
              // }
            } else {
              totalContribution = totalContribution + +element.value.employerContributionValue;
            }
          });
          let deductAmount = (alPercentSum + allAmountSum + totalContribution)
          let balanceAmount = this.salaryForm.controls.amount.value - deductAmount;

          if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
            balanceAmount = Math.round(balanceAmount);
          }
          const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
          const controlFormGroup = <FormGroup>control0.at(index);
          controlFormGroup.controls.value.setValue(element.value);
          const fixedAllowanceFormGroup = <FormGroup>controlFormGroup.controls.fixedAllowance;
          fixedAllowanceFormGroup.controls.allowanceValue.setValue(balanceAmount);
          if (fixedAllowanceFormGroup.controls.allowanceValue.value < 0) {
            console.log(fixedAllowanceFormGroup.controls.allowanceValue.value);
            this.setFormToZero();
          }
        }
      });
    }


    // employeer contribution end

    // this.showFixedDeductions = true;
    // this.formRequestRegister = true;
    // this.showFiexedAllowance = true;
  }
  showHideTaxStatutorySettings() {
    if (this.showTaxStatutorySettings) {
      this.showTaxStatutorySettings = false;
    }
    // tslint:disable-next-line:one-line
    else {
      this.showTaxStatutorySettings = true;
    }
  }
  showHideFixedAllowance() {
    if (this.showFiexedAllowance) {
      this.showFiexedAllowance = false;
    } else {
      this.showFiexedAllowance = true;
    }
  }
  showHideOtherBenifits() {
    if (this.showOtherBenifits) {
      this.showOtherBenifits = false;
    } else {
      this.showOtherBenifits = true;
    }
  }
  showHideStatutoryDeductions() {
    if (this.showStatutoryDeductions) {
      this.showStatutoryDeductions = false;
    }
    // tslint:disable-next-line:one-line
    else {
      this.showStatutoryDeductions = true;
    }
  }
  showHideStatutoryContributions() {
    if (this.showStatutoryContributions) {
      this.showStatutoryContributions = false;
    }
    // tslint:disable-next-line:one-line
    else {
      this.showStatutoryContributions = true;
    }
  }
  showHideFixedDeductions() {
    if (this.showFixedDeductions) {
      this.showFixedDeductions = false;
    }
    // tslint:disable-next-line:one-line
    else {
      this.showFixedDeductions = true;
    }
  }
  showHideVariableAllowance() {
    if (this.showVariableAllowance) {
      this.showVariableAllowance = false;
    } else {
      this.showVariableAllowance = true;
    }
  }
  showHideVariableDeduction() {
    if (this.showVariableDeduction) {
      this.showVariableDeduction = false;
    } else {
      this.showVariableDeduction = true;
    }
  }
  calculateNetSalaryMonthly() {
    //calculate allowanceSum start
    this.totalMonthlyAllowances = 0;
    this.totalYearlyAllowances = 0;
    console.log('this.totalMonthlyAllowances--->' + this.totalMonthlyAllowances);
    let control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    let length = control0.length;
    control0.controls.forEach(element => {
      this.totalMonthlyAllowances = this.totalMonthlyAllowances + +element.value.fixedAllowance.allowanceValue;
    });
    if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
      this.totalYearlyAllowances = Math.round(this.totalMonthlyAllowances * 12);
    } else {
      this.totalYearlyAllowances = this.totalMonthlyAllowances * 12;
    }

    //calculate allowanceSum end

    //calculate benefitsSum start
    this.totalMonthlyBenefits = 0;
    this.totalYearlyBenefits = 0;
    console.log('this.totalMonthlyAllowances--->' + this.totalMonthlyAllowances);
    let control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    length = control1.length;
    control1.controls.forEach(element => {
      this.totalMonthlyBenefits = this.totalMonthlyBenefits + +element.value.fixedAllowance.allowanceValue;
    });
    if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
      this.totalYearlyBenefits = Math.round(this.totalMonthlyBenefits * 12);
    } else {
      this.totalYearlyBenefits = this.totalMonthlyBenefits * 12;
    }

    //calculate benefitsSum end

    // //calculate calculateMonthlyDeductionSum start
    // this.totalYearlyDeductions = 0;
    // this.totalMonthlyDeductions = 0;

    // control3 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    // length = control3.length;
    // control3.controls.forEach(element => {
    //   this.totalMonthlyDeductions = this.totalMonthlyDeductions + +element.value.deductionId.deductionValue;
    // });
    // this.totalYearlyDeductions = this.totalMonthlyDeductions * 12;
    // // calculate calculateMonthlyDeductionSum end


    // calculate calculateMonthlyDeductionSum start
    this.totalYearlyDeductions = 0;
    this.totalMonthlyDeductions = 0;

    let control4 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    length = control4.length;
    control4.controls.forEach(element => {
      this.totalMonthlyDeductions = this.totalMonthlyDeductions + +element.value.fixedDeduction.deductionValue;
    });
    if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
      this.totalYearlyDeductions = Math.round(this.totalMonthlyDeductions * 12);
    } else {
      this.totalYearlyDeductions = this.totalMonthlyDeductions * 12;
    }
    // calculate calculateMonthlyDeductionSum end

    // calculate calculateMonthlyEmployerContributionSum start
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployerStatutoryContributionM = 0;
    let control2 = <FormArray>this.salaryForm.controls['employerContribution'];
    length = control2.length;
    control2.controls.forEach(element => {
      if (element.value.employerContributionName == 'Employer LWF Contribution') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + +element.value.employerContributionValue;
        }
      } else {
        this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + +element.value.employerContributionValue;
      }

      if (element.value.employerContributionName == 'Employer LWF Contribution') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue * 12) : +element.value.employerContributionValue * 12);
        } else if (this.lwfStatus == 'HALF_YEARLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue * 2) : +element.value.employerContributionValue * 2);
        } else if (this.lwfStatus == 'YEARLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue) : +element.value.employerContributionValue);
        }
      } else if (element.value.employerContributionName == 'Employer ESIC Contribution') {
        this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + Math.ceil(+element.value.employerContributionValue * 12);
      } else {
        this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue * 12) : +element.value.employerContributionValue * 12);
      }
    });


    // calculate calculateMonthlyEmployerContributionSum end

    // calculate calculateMonthlyEmployeeDeductionSum start
    this.totalEmployeeStatutoryDeductionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    let control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    length = control3.length;
    control3.controls.forEach(element => {
      if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
        }
      } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
        if (this.ptStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
        }
      } else {
        this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
      }

      if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 12) : +element.value.employeeDeductionValue * 12);
        } else if (this.lwfStatus == 'HALF_YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 2) : +element.value.employeeDeductionValue * 2);
        } else if (this.lwfStatus == 'YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
        }
      } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
        if (this.ptStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 12) : +element.value.employeeDeductionValue * 12);
        } else if (this.ptStatus == 'HALF_YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 2) : +element.value.employeeDeductionValue * 2);
        } else if (this.ptStatus == 'YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
        }
      } else if (element.value.employeeDeductionName == 'Employee ESIC Deduction') {
        this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + Math.ceil(+element.value.employeeDeductionValue * 12);
      } else {
        this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue * 12) : +element.value.employeeDeductionValue * 12);
      }
    });


    // calculate calculateMonthlyEmployeeDeductionSum end

    // calculate calculateMonthlyVariableDeductionSum start
    // this.totalEmployeeVariableDeductionY = 0;
    // this.totalEmployeeVariableDeductionM = 0;
    // let control5 = <FormArray>this.salaryForm.controls['variableDeduction'];
    // length = control5.length;
    // control5.controls.forEach(element => {
    //   this.totalEmployeeVariableDeductionM = this.totalEmployeeVariableDeductionM + +element.value.variableDeduction.deductionValue;
    // });
    // this.totalEmployeeVariableDeductionY = this.totalEmployeeVariableDeductionM * 12;
    // // calculate calculateMonthlyVariableDeductionSum end

    // // calculate calculateMonthlyVariableAllowanceSum start
    // this.totalEmployeeVariableAllowanceY = 0;
    // this.totalEmployeeVariableAllowanceM = 0;
    // let control6 = <FormArray>this.salaryForm.controls['variableAllowance'];
    // length = control6.length;
    // control6.controls.forEach(element => {
    //   this.totalEmployeeVariableAllowanceM = this.totalEmployeeVariableAllowanceM + +element.value.variableAllowance.allowanceValue;
    // });
    // this.totalEmployeeVariableAllowanceY = this.totalEmployeeVariableAllowanceM * 12;
    // calculate calculateMonthlyVariableAllowanceSum end







    this.totalNetSalaryM = (this.totalMonthlyAllowances) - (this.totalMonthlyDeductions + this.totalEmployeeStatutoryDeductionM);
    this.totalNetSalaryY = (this.totalYearlyAllowances) - (this.totalYearlyDeductions + this.totalEmployeeStatutoryDeductionY);


    this.totalNetSalaryIM = (this.totalMonthlyAllowances + this.totalEmployerStatutoryContributionM);
    this.totalNetSalaryIY = (this.totalYearlyAllowances + this.totalEmployerStatutoryContributionY);

    this.totalGrossSalaryY = (this.totalYearlyAllowances) + this.totalVariableAllowanceY + this.totalEmployerStatutoryContributionY + this.totalYearlyBenefits;


    if (this.salaryForm.controls.ctcFrequency.value === 'Annualy') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalNetSalaryY)
      this.salaryForm.controls.ctcExcludingVariables.setValue(this.totalNetSalaryIY)
      this.salaryForm.controls.ctcIncludingVariables.setValue(this.totalGrossSalaryY)

    } else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalNetSalaryM)
      this.salaryForm.controls.ctcExcludingVariables.setValue(this.totalNetSalaryIM)
      this.salaryForm.controls.ctcIncludingVariables.setValue(this.totalGrossSalaryY)
    }

    // tslint:disable-next-line:max-line-length
    // this.totalGrossSalaryM = (this.totalMonthlyAllowances + this.totalEmployerStatutoryContributionM) - (this.totalMonthlyDeductions + this.totalEmployeeStatutoryDeductionM);
    // // tslint:disable-next-line:max-line-length
    // this.totalGrossSalaryY = (this.totalYearlyAllowances + this.totalEmployerStatutoryContributionY) - (this.totalYearlyDeductions + this.totalEmployeeStatutoryDeductionY);

    // this.totalGrossSalaryM = this.totalGrossSalaryM;
    // // tslint:disable-next-line:max-line-length
    // this.totalGrossSalaryY = this.totalGrossSalaryY;


    // this.totalGrossSalaryM = +this.totalGrossSalaryY / 12;
    // this.salaryForm.controls.totalCtc.setValue(this.totalGrossSalaryY);
    // this.totalGrossSalaryM = (this.totalMonthlyAllowances) + this.totalEmployeeVariableAllowanceM + this.totalEmployerStatutoryContributionM
    // this.totalGrossSalaryY = this.totalGrossSalaryM * 12;
    // this.salaryForm.controls.totalCtc.setValue(this.totalGrossSalaryM);


  }
  calculateNetSalaryAnually() {
    // calculate allowanceSum start
    this.totalYearlyAllowances = 0;
    this.totalMonthlyAllowances = 0;
    console.log('this.totalYearlyAllowances--->' + this.totalYearlyAllowances);
    let control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    let length = control0.length;
    control0.controls.forEach(element => {
      this.totalYearlyAllowances = this.totalYearlyAllowances + +element.value.fixedAllowance.allowanceValue;
    });
    if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
      this.totalMonthlyAllowances = Math.round(this.totalYearlyAllowances / 12);
    } else {
      this.totalMonthlyAllowances = this.totalYearlyAllowances / 12;
    }


    // calculate allowanceSum end

    // calculate benfitsSum start
    this.totalYearlyBenefits = 0;
    this.totalMonthlyBenefits = 0;
    console.log('this.totalYearlyAllowances--->' + this.totalYearlyBenefits);
    let control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    length = control1.length;
    control1.controls.forEach(element => {
      this.totalYearlyBenefits = this.totalYearlyBenefits + +element.value.fixedAllowance.allowanceValue;
    });
    if (this.salaryForm.controls.isRoundOffApplicable.value == true) {
      this.totalMonthlyBenefits = Math.round(this.totalYearlyBenefits / 12);
    } else {
      this.totalMonthlyBenefits = this.totalYearlyBenefits / 12;
    }


    // calculate benfitsSum end

    // calculate calculateAnuallyEmployerContributionSum start
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployerStatutoryContributionM = 0;
    let control2 = <FormArray>this.salaryForm.controls['employerContribution'];
    length = control2.length;
    control2.controls.forEach(element => {
      // tslint:disable-next-line:max-line-length
      if (element.value.employerContributionName == 'Employer LWF Contribution') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue * 12;
        } else if (this.lwfStatus == 'HALF_YEARLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue * 2;
        } else if (this.lwfStatus == 'YEARLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue;
        }
      } else {
        this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue;
      }

      if (element.value.employerContributionName == 'Employer LWF Contribution') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue) : +element.value.employerContributionValue);
        }
      } else if (element.value.employerContributionName == 'Employer ESIC Contribution') {
        this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + Math.ceil(+element.value.employerContributionValue / 12);
      }
      else {
        this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employerContributionValue / 12) : +element.value.employerContributionValue / 12);
      }
    });
    // this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionY;
    // calculate calculateAnuallyEmployerContributionSum end

    // calculate calculateAnuallyDeductionSum start
    this.totalYearlyDeductions = 0;
    this.totalMonthlyDeductions = 0;
    let control4 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    length = control4.length;
    control4.controls.forEach(element => {
      this.totalYearlyDeductions = this.totalYearlyDeductions + +element.value.fixedDeduction.deductionValue;
    });
    this.totalMonthlyDeductions = this.totalYearlyDeductions / 12;
    // calculate calculateAnuallyDeductionSum end

    // calculate calculateAnuallyEmployeeDeductionSum start
    this.totalEmployeeStatutoryDeductionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    let control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    length = control3.length;
    control3.controls.forEach(element => {
      // tslint:disable-next-line:max-line-length
      if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 12;
        } else if (this.lwfStatus == 'HALF_YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 2;
        } else if (this.lwfStatus == 'YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue;
        }
      } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
        if (this.ptStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 12;
        } else if (this.ptStatus == 'HALF_YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 2;
        } else if (this.ptStatus == 'YEARLY') {
          this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue;
        }
      } else {
        this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue;
      }

      if (element.value.employeeDeductionName == 'Employee LWF Deduction') {
        if (this.lwfStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
        }
      } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
        if (this.ptStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue) : +element.value.employeeDeductionValue);
        }
      } else if (element.value.employeeDeductionName == 'Employee ESIC Deduction') {
        this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + Math.ceil(+element.value.employeeDeductionValue / 12);
      } else {
        this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + (this.salaryForm.controls.isRoundOffApplicable.value == true ? Math.round(+element.value.employeeDeductionValue / 12) : +element.value.employeeDeductionValue / 12);
      }

    });
    // this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionY / 12;
    // calculate calculateAnuallyEmployeeDeductionSum end

    // this.totalEmployeeVariableAllowanceY = 0;
    // this.totalEmployeeVariableAllowanceM = 0;
    // let control5 = <FormArray>this.salaryForm.controls['variableAllowance'];
    // length = control5.length;
    // control5.controls.forEach(element => {
    //   // tslint:disable-next-line:max-line-length
    //   this.totalEmployeeVariableAllowanceY = this.totalEmployeeVariableAllowanceY + +element.value.variableAllowance.allowanceValue;
    // });
    // this.totalEmployeeVariableAllowanceM = this.totalEmployeeVariableAllowanceY / 12;

    // this.totalEmployeeVariableDeductionM = 0;
    // this.totalEmployeeVariableDeductionY = 0;
    // let control6 = <FormArray>this.salaryForm.controls['variableDeduction'];
    // length = control6.length;
    // control6.controls.forEach(element => {
    //   // tslint:disable-next-line:max-line-length
    //   this.totalEmployeeVariableDeductionY = this.totalEmployeeVariableDeductionY + +element.value.variableDeduction.deductionValue;
    // });
    // this.totalEmployeeVariableDeductionM = this.totalEmployeeVariableDeductionY / 12;




    this.totalNetSalaryM = (this.totalMonthlyAllowances) - (this.totalMonthlyDeductions + this.totalEmployeeStatutoryDeductionM);
    this.totalNetSalaryY = (this.totalYearlyAllowances) - (this.totalYearlyDeductions + this.totalEmployeeStatutoryDeductionY);


    this.totalNetSalaryIM = (this.totalMonthlyAllowances + this.totalEmployerStatutoryContributionM);
    this.totalNetSalaryIY = (this.totalYearlyAllowances + this.totalEmployerStatutoryContributionY);

    this.totalGrossSalaryY = (this.totalYearlyAllowances) + this.totalVariableAllowanceY + this.totalEmployerStatutoryContributionY + this.totalYearlyBenefits;



    if (this.salaryForm.controls.ctcFrequency.value === 'Annualy') {
      this.salaryForm.controls.totalTakeHome.setValue(this.totalNetSalaryY)
      this.salaryForm.controls.ctcExcludingVariables.setValue(this.totalNetSalaryIY)
      this.salaryForm.controls.ctcIncludingVariables.setValue(this.totalGrossSalaryY)
    } else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.salaryForm.controls.totalTakeHome.setValue(this.totalNetSalaryM)
      this.salaryForm.controls.ctcExcludingVariables.setValue(this.totalNetSalaryIM)
      this.salaryForm.controls.ctcIncludingVariables.setValue(this.totalGrossSalaryY)
    }

  }

  setFormToZero() {

    const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
    for (let i = controlCtcAllowance.length - 1; i >= 0; i--) {
      controlCtcAllowance.controls[i]['controls'].fixedAllowance.controls.allowanceValue.setValue(0);
    }

    const controlOtherBenefits = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    for (let i = controlOtherBenefits.length - 1; i >= 0; i--) {
      controlOtherBenefits.controls[i]['controls'].fixedAllowance.controls.allowanceValue.setValue(0);
    }

    const ctcDeductions = <FormArray>this.salaryForm.controls['ctcDeductions'];
    for (let i = ctcDeductions.length - 1; i >= 0; i--) {
      ctcDeductions.controls[i]['controls'].fixedDeduction.controls.deductionValue.setValue(0);
    }

    const employeeDeduction = <FormArray>this.salaryForm.controls['employeeDeduction'];
    for (let i = employeeDeduction.length - 1; i >= 0; i--) {
      employeeDeduction.controls[i]['controls'].employeeDeductionValue.setValue(0);
    }


    const employerContribution = <FormArray>this.salaryForm.controls['employerContribution'];
    for (let i = employerContribution.length - 1; i >= 0; i--) {
      employerContribution.controls[i]['controls'].employerContributionValue.setValue(0);
    }

    const variableAllowance = <FormArray>this.salaryForm.controls['variableAllowance'];
    for (let i = variableAllowance.length - 1; i >= 0; i--) {
      variableAllowance.controls[i]['controls'].amount.setValue(0);
      variableAllowance.controls[i]['controls'].variableAllowance.setValue(null);
    }

    const variableDeduction = <FormArray>this.salaryForm.controls['variableDeduction'];
    for (let i = variableDeduction.length - 1; i >= 0; i--) {
      variableDeduction.controls[i]['controls'].amount.setValue(0);
      variableDeduction.controls[i]['controls'].variableDeduction.setValue(null);
    }
    this.totalGrossSalary = 0;
    this.totalNetSalaryY = 0;
    this.totalNetSalaryM = 0;
    this.selectTimePeriod = '0';

    this.totalYearlyAllowances = 0;
    this.totalMonthlyAllowances = 0;

    this.totalVariableDeductionY = 0;
    this.totalVariableAllowanceY = 0;
    this.totalMonthlyDeductions = 0;
    this.totalYearlyDeductions = 0;
    this.totalEmployerStatutoryContributionM = 0;
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    this.totalEmployeeStatutoryDeductionY = 0;

    this.totalEmployeeVariableAllowanceM = 0;
    this.totalEmployeeVariableAllowanceY = 0;
    this.totalEmployeeVariableDeductionM = 0;
    this.totalEmployeeVariableDeductionY = 0;
    this.warningNotification("Allowances can not have negative values.Please enter CTC accordingly.");
  }



  resetForm() {
    const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
    controlCtcAllowance.controls = [];
    controlCtcAllowance.setValue([]);

    const controlOtherBenefits = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    while (controlOtherBenefits.length !== 0) {
      controlOtherBenefits.removeAt(0);
    }
    const ctcDeductions = <FormArray>this.salaryForm.controls['ctcDeductions'];
    while (ctcDeductions.length !== 0) {
      ctcDeductions.removeAt(0);
    }
    const employeeDeduction = <FormArray>this.salaryForm.controls['employeeDeduction'];
    while (employeeDeduction.length !== 0) {
      employeeDeduction.removeAt(0);
    }
    const employerContribution = <FormArray>this.salaryForm.controls['employerContribution'];
    while (employerContribution.length !== 0) {
      employerContribution.removeAt(0);
    }

    const variableAllowance = <FormArray>this.salaryForm.controls['variableAllowance'];
    while (variableAllowance.length !== 0) {
      variableAllowance.removeAt(0);
    }

    const variableDeduction = <FormArray>this.salaryForm.controls['variableDeduction'];
    while (variableDeduction.length !== 0) {
      variableDeduction.removeAt(0);
    }
    this.getVariables(this.salaryForm.controls.payrollEffectiveDate.value);
    this.totalGrossSalary = 0;
    this.totalNetSalaryY = 0;
    this.totalNetSalaryM = 0;
    this.selectTimePeriod = '0';
    this.showStatutoryContributions = false;
    this.showFiexedAllowance = false;
    this.showStatutoryDeductions = false;
    this.showFixedDeductions = false;
    this.showTaxStatutorySettings = false;
    this.showVariableAllowance = false;
    this.showVariableDeduction = false;

    this.totalYearlyAllowances = 0;
    this.totalMonthlyAllowances = 0;

    this.totalMonthlyDeductions = 0;
    this.totalYearlyDeductions = 0;
    this.totalEmployerStatutoryContributionM = 0;
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    this.totalEmployeeStatutoryDeductionY = 0;

    this.totalEmployeeVariableAllowanceM = 0;
    this.totalEmployeeVariableAllowanceY = 0;
    this.totalEmployeeVariableDeductionM = 0;
    this.totalEmployeeVariableDeductionY = 0;
  }
  getData() {
    // this.getAllFixedAllowance();
    // this.getAllFixedDeduction();
    this.getAllEmployerContribution();
    this.getAllEmployeeDeduction();
    // this.getAllOtherBenefits();

  };
  getVariables(salaryEffectiveDate: any) {
    if (salaryEffectiveDate == null) return;
    this.variableAllowances = [];
    this.variableDeductions = [];
    const variableAllowanceControl = <FormArray>this.salaryForm.controls['variableAllowance'];
    for (let i = variableAllowanceControl.length - 1; i >= 0; i--) {
      variableAllowanceControl.removeAt(i)
    }
    const variableDeductionControl = <FormArray>this.salaryForm.controls['variableDeduction'];
    for (let i = variableDeductionControl.length - 1; i >= 0; i--) {
      variableDeductionControl.removeAt(i)
    }
    this.serviceApi.get('/v1/employee/salary/variables/' + this.empCode + '/' + salaryEffectiveDate).subscribe(res => {
      this.variableAllowances = res.variableAllowanceList;
      this.variableDeductions = res.variableDeductionList;
    }, (err) => {

    }, () => {
      this.insertNewvariableAllowance();
      this.insertNewvariableDeduction();
    })

  }

  insertNewvariableAllowance() {
    let control = <FormArray>this.salaryForm.controls.variableAllowance;
    control.push(this.fb.group({
      variableAllowance: [null],
      amount: [0]
    }));
  }

  deleteVariableAllowance(index: any) {
    const line = this.salaryForm.get('variableAllowance') as FormArray;
    line.removeAt(index);
    this.totalVariableAllowanceY = 0;
    this.salaryForm.controls.variableAllowance['controls'].forEach(element => {
      this.totalVariableAllowanceY += +element.controls.amount.value;
    });
  }

  insertNewvariableDeduction() {
    let control = <FormArray>this.salaryForm.controls.variableDeduction;
    control.push(this.fb.group({
      variableDeduction: [null],
      amount: [0]
    }));
  }

  deleteVariableDeduction(index: any) {
    const line = this.salaryForm.get('variableDeduction') as FormArray;
    line.removeAt(index);
    this.totalVariableDeductionY = 0;
    this.salaryForm.controls.variableDeduction['controls'].forEach(element => {
      this.totalVariableDeductionY += +element.controls.amount.value;
    });
  }

  onVariableAllowanceChange(index: any) {
    var control = this.salaryForm.controls.variableAllowance['controls'][index].controls;
    var selectedVA = this.variableAllowances.find(va => va.id == control.variableAllowance.value);
    console.log(control);
    console.log(selectedVA);
    if (selectedVA == undefined) return;
    control.amount.enable();
    this.totalVariableAllowanceY = 0;
    if (selectedVA.amountType === "PERCENTAGE_BASIC_DA_OR_BASIC") {
      let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
      var basicDA = 0;
      control3.controls.forEach(element => {
        if (element.value.fixedAllowance.allowanceName === "Basic" || element.value.fixedAllowance.allowanceName === "DA") {
          basicDA += +element.value.fixedAllowance.allowanceValue;
        }
      });
      control.amount.setValue((basicDA * +selectedVA.amount) / 100);
      // control.amount.disable();
    } else if (selectedVA.amountType === "MANUAL_AT_THE_TIME_OF_RUNNING_PAYROLL") {
      control.amount.setValue(0);
      // control.amount.disable();
    } else if (selectedVA.amountType === "FIXED_AMOUNT") {
      control.amount.setValue(+selectedVA.amount);
      // control.amount.disable();
    } else if (selectedVA.amountType === "PERCENTAGE_OF_GROSS_SALARY") {
      let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
      var gross = 0;
      control3.controls.forEach(element => {
        gross += +element.value.fixedAllowance.allowanceValue;
      });
      control3 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
      control3.controls.forEach(element => {
        gross += +element.value.fixedAllowance.allowanceValue;
      });

      control.amount.setValue((gross * +selectedVA.amount) / 100);
      // control.amount.disable();
    }

    if (selectedVA.paymentFrequency == "MONTHLY") {
      control.amount.setValue(12 * control.amount.value);
    }
    if (selectedVA.paymentFrequency == "QUARTERLY") {
      control.amount.setValue(4 * control.amount.value);
    }
    if (selectedVA.paymentFrequency == "HALF_YEARLY") {
      control.amount.setValue(2 * control.amount.value);
    }
    if (selectedVA.paymentFrequency == "YEARLY") {
      control.amount.setValue(1 * control.amount.value);
    }

    this.salaryForm.controls.variableAllowance['controls'].forEach(element => {
      this.totalVariableAllowanceY += +element.controls.amount.value;
    });

    if (this.salaryForm.controls.ctcFrequency.value == 'Monthly') {
      this.calculateNetSalaryMonthly();
    } else if (this.salaryForm.controls.ctcFrequency.value == 'Annualy') {
      this.calculateNetSalaryAnually();
    }
  }

  onVariableDeductionsChange(index: any) {
    var control = this.salaryForm.controls.variableDeduction['controls'][index].controls;
    var selectedVD = this.variableDeductions.find(va => va.id == control.variableDeduction.value);
    console.log(control);
    console.log(selectedVD);
    if (selectedVD == undefined) return;
    control.amount.enable();
    this.totalVariableDeductionY = 0;
    if (selectedVD.amountType === "PERCENTAGE_BASIC_DA_OR_BASIC") {
      let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
      var basicDA = 0;
      control3.controls.forEach(element => {
        if (element.value.fixedAllowance.allowanceName === "Basic" || element.value.fixedAllowance.allowanceName === "DA") {
          basicDA += +element.value.fixedAllowance.allowanceValue;
        }
      });
      control.amount.setValue((basicDA * +selectedVD.amount) / 100);
      // control.amount.disable();
    } else if (selectedVD.amountType === "MANUAL_AT_THE_TIME_OF_RUNNING_PAYROLL") {
      control.amount.setValue(0);
      // control.amount.disable();
    } else if (selectedVD.amountType === "FIXED_AMOUNT") {
      control.amount.setValue(+selectedVD.amount);
      // control.amount.disable();
    } else if (selectedVD.amountType === "PERCENTAGE_OF_GROSS_SALARY") {
      let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
      var gross = 0;
      control3.controls.forEach(element => {
        gross += +element.value.fixedAllowance.allowanceValue;
      });
      control3 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
      control3.controls.forEach(element => {
        gross += +element.value.fixedAllowance.allowanceValue;
      });

      control.amount.setValue((gross * +selectedVD.amount) / 100);
      // control.amount.disable();
    }

    if (selectedVD.frequency == "MONTHLY") {
      control.amount.setValue(12 * control.amount.value);
    }
    if (selectedVD.frequency == "QUARTERLY") {
      control.amount.setValue(4 * control.amount.value);
    }
    if (selectedVD.frequency == "HALF_YEARLY") {
      control.amount.setValue(2 * control.amount.value);
    }
    if (selectedVD.frequency == "YEARLY") {
      control.amount.setValue(1 * control.amount.value);
    }

    this.salaryForm.controls.variableDeduction['controls'].forEach(element => {
      this.totalVariableDeductionY += +element.controls.amount.value;
    });


  }

  getRequreForSalaryData() {
    this.lwfSlabs = [];
    this.ptSlabs = [];
    let ptStateId = this.salaryForm.controls.ptStateId.value != null ? this.salaryForm.controls.ptStateId.value : 0;
    let lwfStateId = this.salaryForm.controls.lwfStateId.value != null ? this.salaryForm.controls.lwfStateId.value : 0;

    this.serviceApi.get('/v1/employee/salary/data/' + this.empCode + '/' + ptStateId + '/' + lwfStateId).subscribe(
      res => {
        if (res != null) {
          this.esicCellingAmount = res.esicCellingAmount;
          this.esicSlab = res.esicSlab;
          this.lwfSlabs = res.lwfSlabs;
          this.ptSlabs = res.ptSlabs;
          this.lwfStatus = res.lwfStatus;
          this.ptStatus = res.ptStatus;
        }
      }, err => { },
      () => {
        this.calculateGorssSalary();
      });
  }
  // Getting Methods of All Fields Shoing in the Screen For Checked
  // getAllFixedAllowance() {
  //   this.fixedSalaryAllowance = [];
  //   this.serviceApi.get('/v1/payroll-settings/fixed-allowances').subscribe(
  //     res => {
  //       if (res != null) {
  //         res.forEach(element => {
  //           this.fixedSalaryAllowance.push({
  //             'allowanceId': element.fixedAllowanceId,
  //             'allowanceName': element.allowanceName,
  //             'fieldValue': false,
  //             'isDefaultAllowance': element.isDefault,
  //             'allowPF': element.pfEnable,
  //             'allowESIC': element.esicEnable,
  //             'allowLWF': element.lwfEnable,
  //             'allowProfessionalTax': element.ptEnable,
  //             'allowIncomeTax': element.tdsEnable,
  //             'type': 'FA'
  //           });
  //         });
  //       }
  //     });
  // }

  // getAllFixedDeduction() {
  //   this.fixedSalaryDeductions = [];
  //   this.serviceApi.get('/v1/payroll-settings/get-all/deductions').subscribe(
  //     res => {
  //       if (res != null) {
  //         res.forEach(element => {
  //           this.fixedSalaryDeductions.push({
  //             'deductionid': element.deductionid,
  //             'deductionName': element.labelName,
  //             'fieldValue': false,
  //             'type': 'FD'
  //           });
  //         });
  //       } else {
  //       }
  //     });
  // }

  getAllEmployerContribution() {
    this.employerContributions = [];

    this.employerContributions.push({
      'employerContributionName': 'PF Employer Contribution',
      'fieldValue': false,
    },
      {
        'employerContributionName': 'ESIC Employer Contribution',
        'fieldValue': false,

      },
      {
        'employerContributionName': 'LWF Employer Contribution',
        'fieldValue': false,

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
    },
      {
        'employeeDeductionName': 'ESIC Employee Deduction',
        'fieldValue': false,
      },
      {
        'employeeDeductionName': 'LWF Employee Deduction',
        'fieldValue': false,
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
  // getAllOtherBenefits() {
  //   this.otherBenefits = [];
  //   this.serviceApi.get('/v1/payroll-settings/get-all/benfits').subscribe(
  //     res => {
  //       if (res != null) {
  //         res.forEach(element => {
  //           this.otherBenefits.push({
  //             'allowanceId': element.benefitId,
  //             'allowanceName': element.labelName,
  //             'fieldValue': false,
  //             'type': 'OB'
  //           });
  //         });
  //       } else {
  //       }
  //     });
  // }




  save() {

    let employeeCtcAllowances = [];
    let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    let length = control3.length;
    control3.controls.forEach(element => {
      if (this.salaryForm.controls.ctcTemplateId.value != -1) {
        employeeCtcAllowances.push({
          "fixedAllowanceId": null,
          "id": element.value.ctcAllowanceId,
          "value": +element.value.fixedAllowance.allowanceValue
        });
      } else {
        employeeCtcAllowances.push({
          "fixedAllowanceId": element.value.fixedAllowance.allowanceId,
          "id": null,
          "value": +element.value.fixedAllowance.allowanceValue
        });
      }
    });

    let employeeCtcOtherBenefits = [];
    control3 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
    length = control3.length;
    control3.controls.forEach(element => {
      if (this.salaryForm.controls.ctcTemplateId.value != -1) {
        employeeCtcOtherBenefits.push({
          "benefitId": null,
          "id": element.value.ctcAllowanceId,
          "value": +element.value.fixedAllowance.allowanceValue
        });
      } else {
        employeeCtcOtherBenefits.push({
          "benefitId": element.value.fixedAllowance.allowanceId,
          "id": null,
          "value": +element.value.fixedAllowance.allowanceValue
        });
      }
    });

    let employeeCtcDeductions = [];
    control3 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    length = control3.length;
    control3.controls.forEach(element => {
      if (this.salaryForm.controls.ctcTemplateId.value != -1) {
        employeeCtcDeductions.push({
          "ctcFixedDeductionId": element.value.ctcDeductionId,
          "fixedDeductionid": null,
          "value": +element.value.fixedDeduction.deductionValue
        });
      } else {
        employeeCtcDeductions.push({
          "ctcFixedDeductionId": null,
          "fixedDeductionid": element.value.fixedDeduction.deductionId,
          "value": +element.value.fixedDeduction.deductionValue
        });
      }
    });

    let ctcVariableAllowances = [];
    control3 = <FormArray>this.salaryForm.controls['variableAllowance'];
    length = control3.length;
    control3.controls.forEach(element => {
      ctcVariableAllowances.push({
        "empVariableAllowanceId": 0,
        "value": +element.value.amount,
        "variableAllowanceid": element.value.variableAllowance
      });
    });
    let ctcVariableDeductions = [];
    control3 = <FormArray>this.salaryForm.controls['variableDeduction'];
    length = control3.length;
    control3.controls.forEach(element => {
      ctcVariableDeductions.push({
        "empCtcVariableDeductionId": 0,
        "value": +element.value.amount,
        "variableDeductionId": element.value.variableDeduction
      });
    });

    let employeeStatutoryDeductions = [];
    control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    length = control3.length;
    control3.controls.forEach(element => {
      if (element.value.employeeDeductionName == "Employee PF Deduction" ) {
        employeeStatutoryDeductions.push({
          "esicDeduction": false,
          "lwfDeduction": false,
          "pfDeduction": true,
          "ptDeduction": false,
          "value": element.value.employeeDeductionValue
        });
      } if (element.value.employeeDeductionName == "Employee ESIC Deduction" ) {
        employeeStatutoryDeductions.push({
          "esicDeduction": true,
          "lwfDeduction": false,
          "pfDeduction": false,
          "ptDeduction": false,
          "value": element.value.employeeDeductionValue
        });
      }
      if (element.value.employeeDeductionName == "Employee LWF Deduction" ) {
        employeeStatutoryDeductions.push({
          "esicDeduction": false,
          "lwfDeduction": true,
          "pfDeduction": false,
          "ptDeduction": false,
          "value": element.value.employeeDeductionValue
        });
      }
      if (element.value.employeeDeductionName == "Employee PT Deduction" ) {
        employeeStatutoryDeductions.push({
          "esicDeduction": false,
          "lwfDeduction": false,
          "pfDeduction": false,
          "ptDeduction": true,
          "value": element.value.employeeDeductionValue
        });
      }
    });

    let ctcEmployerContributions = [];

    control3 = <FormArray>this.salaryForm.controls['employerContribution'];
    length = control3.length;
    control3.controls.forEach(element => {
      if (element.value.employerContributionName == "Employer PF Contribution" ) {
        ctcEmployerContributions.push({
          "esicDeduction": false,
          "gratuity": false,
          "lwfDeduction": false,
          "pfDeduction": true,
          "value": element.value.employerContributionValue
        });
      }
      if (element.value.employerContributionName == "Employer ESIC Contribution" ) {
        ctcEmployerContributions.push({
          "esicDeduction": true,
          "gratuity": false,
          "lwfDeduction": false,
          "pfDeduction": false,
          "value": element.value.employerContributionValue
        });
      }
      if (element.value.employerContributionName == "Employer LWF Contribution" ) {
        ctcEmployerContributions.push({
          "esicDeduction": false,
          "gratuity": false,
          "lwfDeduction": true,
          "pfDeduction": false,
          "value": element.value.employerContributionValue
        });
      }
      if (element.value.employerContributionName == "Employer Gratuity Contribution" ) {
        ctcEmployerContributions.push({
          "esicDeduction": false,
          "gratuity": true,
          "lwfDeduction": false,
          "pfDeduction": false,
          "value": element.value.employerContributionValue
        });
      }
    });

    console.log('at saving time current Emp Code -->' + this.empCode);
    const data = {
      "amount": this.salaryForm.controls.amount.value,
      "amountType": this.salaryForm.controls.amountType.value,
      "ctcExcludingVariables": this.salaryForm.controls.ctcExcludingVariables.value,
      "ctcFrequency": this.salaryForm.controls.ctcFrequency.value,
      "ctcIncludingVariables": this.salaryForm.controls.ctcIncludingVariables.value,
      "ctcTemplateId": (this.salaryForm.controls.ctcTemplateId.value == -1) ? null : this.salaryForm.controls.ctcTemplateId.value,
      "empCode": this.salaryForm.controls.empCode.value,
      "empCtcOtherBenefits": employeeCtcOtherBenefits,
      // "empEsicSlabs": [this.esicSlab],
      "employeeCtcAllowances": employeeCtcAllowances,
      "employeeCtcDeductions": employeeCtcDeductions,
      "employeeCtcVariableAllowances": ctcVariableAllowances,
      "employeeCtcVariableDeductions": ctcVariableDeductions,
      "employeeStatutoryDeductions": employeeStatutoryDeductions,
      "employerStatutoryContributions": ctcEmployerContributions,
      "isCurrentFlag": this.salaryForm.controls.isCurrentFlag.value,
      "isESICDeductible": this.salaryForm.controls.isESICDeductible.value,
      "isEmployeePFCaped": this.salaryForm.controls.isEmployeePFCaped.value,
      "isEmployersPFCaped": this.salaryForm.controls.isEmployersPFCaped.value,
      "isGratuityApplicable": this.salaryForm.controls.isGratuityApplicable.value,
      "isIncomeTaxDeductible": this.salaryForm.controls.isIncomeTaxDeductible.value,
      "isLWFDeductible": this.salaryForm.controls.isLWFDeductible.value,
      "isPFDeductible": this.salaryForm.controls.isPFDeductible.value,
      "isProfessionalTaxDeductible": this.salaryForm.controls.isProfessionalTaxDeductible.value,
      "isProvidentPensionDeductible": this.salaryForm.controls.isProvidentPensionDeductible.value,
      "ptStateId": this.salaryForm.controls.ptStateId.value,
      "lwfStateId": this.salaryForm.controls.lwfStateId.value,
      "isRoundOffApplicable": this.salaryForm.controls.isRoundOffApplicable.value,
      // "labourFundSlabs": [this.selectedlwfSlab],
      "payrollEffectiveDate": this.salaryForm.controls.payrollEffectiveDate.value,
      "pfTemplateId": (this.salaryForm.controls.pfTemplateId.value != null) ? this.salaryForm.controls.pfTemplateId.value.tempId : null,
      // "professionalTaxSlabs": [this.selectedptSlab],
      "pfWageAmount": (this.salaryForm.controls.providentFundWageAmount.value != "") ? this.salaryForm.controls.providentFundWageAmount.value : 0,
      "salaryEffectiveDate": this.salaryForm.controls.salaryEffectiveDate.value,
      "totalTakeHome": this.salaryForm.controls.totalTakeHome.value
    };



    console.log('-------------------- JSON Body Start-----------------------');
    console.log(JSON.stringify(data));
    console.log('-------------------- JSON Body End-----------------------');
    if (this.salaryForm.valid) {
      this.serviceApi.post('/v1/employee/salary/', data).subscribe(
        res => {
          console.log('Api Called Successfully');
          console.log('response-->' + res);
          this.successNotification(res.message);
          this.closeForm();
        },
        err => {
          console.error('error ->' + err);
          // this.warningNotification(err.message);
        },
        () => {
          console.log('end sucessfully');
          // this.loadTemplate();

        }
      );
      console.log('salaryInformation:-' + JSON.stringify(this.salaryForm.value));
      this.currentTabEvent.emit('4');
    } else {
      Object.keys(this.salaryForm.controls).forEach(field => { // {1}
        const control = this.salaryForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  // -------------- Total Fixed Allowances End------------------------------
  closeForm() {
    this.router.navigate(['/employees/edit-employee/' + this.empCode]);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////----------------------------------------------------------------nayab----------------------------------------------------------------------------------////




}
