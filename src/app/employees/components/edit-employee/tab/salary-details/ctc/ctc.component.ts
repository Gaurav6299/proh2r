import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ApiCommonService } from '../../../../../../services/api-common.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Data } from '../../../../../services/data.service';
import { element } from 'protractor';
declare var $: any;

@Component({
  selector: 'edit-ctc',
  templateUrl: './ctc.component.html',
  styleUrls: ['./ctc.component.scss']
})
export class CtcComponent implements OnInit {

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
  totalMonthlyBenefits: number;
  totalYearlyBenefits: number;
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
  totalVariableDeductionY: number;
  salaryId: any;
  salaryFrequency: string;
  salaryAmountType: string;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private serviceApi: ApiCommonService, private router: Router, private data: Data) {
    console.log('routes-->' + this.route);
    this.route.params.subscribe(res => {
      // this.empCode = res.id;
      this.salaryId = res.salaryId;
    });

    this.totalGrossSalaryM = 0;
    this.totalGrossSalaryY = 0;
    this.totalNetSalaryIM = 0;
    this.totalNetSalaryIY = 0;
    this.empCode = this.data.storage.empCode
    // this.salaryId = this.data.storage.empSalaryId;
    console.log('current Emp Code -->' + this.empCode);
    this.serviceApi.get('/v1/ctc-template/get-all').subscribe(
      res => {
        this.templates = res;
        // this.templates.push({
        //   ctcTemplateId: -1,
        //   ctcTemplateName: "Enter Manually"
        // });
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
      salaryEffectiveDate: [],
      payrollEffectiveDate: [],
      ctcFrequency: [],
      ctcTemplateId: [],
      amount: [],
      amountType: [],
      isCurrentFlag: [],


      isPFDeductible: [],
      isProvidentPensionDeductible: [],
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
      isRoundOffApplicable:[],

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

    this.serviceApi.get('/v1/employee/salary/' + this.salaryId).subscribe(
      res => {
        if (res != undefined) {
          this.salaryForm.controls.salaryEffectiveDate.setValue(res.salaryEffectiveDate);
          this.salaryForm.controls.payrollEffectiveDate.setValue(res.payrollEffectiveDate);

          this.salaryFrequency = this.ctcFrequency.find(o => o.value == res.ctcFrequency).viewValue
          this.salaryForm.controls.ctcFrequency.setValue(res.ctcFrequency);

          var ctcTemplate = this.templates.find(o => o.ctcTemplateId == res.ctcTemplateId);
          this.salaryForm.controls.ctcTemplateId.setValue(ctcTemplate != null && ctcTemplate != undefined ? ctcTemplate.ctcTemplateName : 'Entered Manually');

          this.salaryForm.controls.amount.setValue(res.amounts);
          this.salaryAmountType = this.amountTypes.find(o => o.value == res.amountType).viewValue;
          this.salaryForm.controls.amountType.setValue(res.amountType);

          // this.salaryForm.controls.isCurrentFlag.setValue(res.isCurrentFlag == null ? false : res.isCurrentFlag);


          this.salaryForm.controls.isProvidentPensionDeductible.setValue(res.isProvidentPensionDeductible != undefined && res.isProvidentPensionDeductible != null ? this.ngBooleanData.find(o => o.value == res.isProvidentPensionDeductible).viewValue : 'No');
          this.salaryForm.controls.isPFDeductible.setValue(res.isPFDeductible != undefined && res.isPFDeductible != null ? this.ngBooleanData.find(o => o.value == res.isPFDeductible).viewValue : 'No');
          this.salaryForm.controls.isEmployeePFCaped.setValue(res.isEmployeePFCaped != undefined && res.isEmployeePFCaped != null ? this.ngBooleanData.find(o => o.value == res.isEmployeePFCaped).viewValue : 'No');
          this.salaryForm.controls.isEmployersPFCaped.setValue(res.isEmployersPFCaped != undefined && res.isEmployersPFCaped != null ? this.ngBooleanData.find(o => o.value == res.isEmployersPFCaped).viewValue : 'No');
          this.salaryForm.controls.providentFundWageAmount.setValue(res.pfWageAmount != undefined && res.pfWageAmount != null ? res.pfWageAmount : 0);
          this.salaryForm.controls.isESICDeductible.setValue(res.isESICDeductible != undefined && res.isESICDeductible != null ? this.ngBooleanData.find(o => o.value == res.isESICDeductible).viewValue : 'No');
          this.salaryForm.controls.isProfessionalTaxDeductible.setValue(res.isProfessionalTaxDeductible != undefined && res.isProfessionalTaxDeductible != null ? this.ngBooleanData.find(o => o.value == res.isProfessionalTaxDeductible).viewValue : 'No');
          this.salaryForm.controls.isLWFDeductible.setValue(res.isLWFDeductible != undefined && res.isLWFDeductible != null ? this.ngBooleanData.find(o => o.value == res.isLWFDeductible).viewValue : 'No');
          this.salaryForm.controls.isGratuityApplicable.setValue(res.isGratuityApplicable != undefined && res.isGratuityApplicable != null ? this.ngBooleanData.find(o => o.value == res.isGratuityApplicable).viewValue : 'No');
          this.salaryForm.controls.isIncomeTaxDeductible.setValue(res.isIncomeTaxDeductible != undefined && res.isIncomeTaxDeductible != null ? this.ngBooleanData.find(o => o.value == res.isIncomeTaxDeductible).viewValue : 'No');
          this.salaryForm.controls.isRoundOffApplicable.setValue(res.isRoundOffApplicable != undefined && res.isRoundOffApplicable != null ? this.ngBooleanData.find(o => o.value == res.isRoundOffApplicable).viewValue : 'No');
          
          var lwfStatesName = this.lwfStatesList.find(o => o.value == res.lwfStateId);
          this.salaryForm.controls.lwfStateId.setValue(lwfStatesName != undefined && lwfStatesName != null ? lwfStatesName.viewValue : 'None');

          var ptStatesName = this.ptStatesList.find(o => o.value == res.ptStateId);
          this.salaryForm.controls.ptStateId.setValue(ptStatesName != undefined && ptStatesName != null ? ptStatesName.viewValue : 'None');

          var pfTemplate = this.pfTemplates.find(o => o.tempId == res.tempId);
          this.salaryForm.controls.pfTemplateId.setValue(pfTemplate != null && pfTemplate != undefined ? pfTemplate.templateName : 'None');



          const control0 = <FormArray>this.salaryForm.controls['ctcAllowances'];
          control0.controls = [];
          res.employeeCtcAllowances.forEach(element => {
            control0.push(
              this.fb.group({
                'ctcAllowanceId': [element.ctcFixedAllowanceId],
                'fixedAllowance': this.fb.group({
                  'allowanceId': [element.id],
                  'allowanceName': [element.allowanceName],
                  'allowanceValue': [element.val],
                }),
              })
            );
          });
          const control1 = <FormArray>this.salaryForm.controls['empCtcOtherBenefits'];
          control1.controls = [];
          res.empCtcOtherBenefits.forEach(element => {
            control1.push(
              this.fb.group({
                'ctcAllowanceId': [element.id],
                'fixedAllowance': this.fb.group({
                  'allowanceId': [element.allowanceId],
                  'allowanceName': [element.benefitName],
                  'allowanceValue': [element.val],
                }),
              })
            );
          });
          const control4 = <FormArray>this.salaryForm.controls['ctcDeductions'];
          control4.controls = [];
          res.employeeCtcDeductions.forEach(element => {
            control4.push(
              this.fb.group({
                'ctcDeductionId': [element.ctcFixedDeductionId],
                'fixedDeduction': this.fb.group({
                  'deductionId': [element.deductionid],
                  'deductionName': [element.labelName],
                  'deductionValue': [element.val],
                }),
              })
            );
          });

          const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
          control3.controls = [];
          res.employeeStatutoryDeductions.forEach(employeeDeductionEelement => {
            if (employeeDeductionEelement.pfDeduction) {
              control3.push(
                this.fb.group({
                  'employeeDeductionName': ['Employee PF Deduction'],
                  'employeeDeductionValue': [employeeDeductionEelement.val],
                  'isDeductable': [employeeDeductionEelement.fieldValue],

                })
              );
            } else if (employeeDeductionEelement.esicDeduction) {
              control3.push(
                this.fb.group({
                  'employeeDeductionName': ['Employee ESIC Deduction'],
                  'employeeDeductionValue': [employeeDeductionEelement.val],
                  'isDeductable': [employeeDeductionEelement.fieldValue],

                })
              );
            } else if (employeeDeductionEelement.lwfDeduction) {
              control3.push(
                this.fb.group({
                  'employeeDeductionName': ['Employee LWF Deduction'],
                  'employeeDeductionValue': [employeeDeductionEelement.val],
                  'isDeductable': [employeeDeductionEelement.fieldValue],

                })
              );
            } else if (employeeDeductionEelement.ptDeduction) {
              control3.push(
                this.fb.group({
                  'employeeDeductionName': ['Employee PT Deduction'],
                  'employeeDeductionValue': [employeeDeductionEelement.val],
                  'isDeductable': [employeeDeductionEelement.fieldValue],

                })
              );
            }
            // else{
            //   control3.push(
            //     this.fb.group({
            //       'employeeDeductionName': ['Employee Income Tax Deduction'],
            //       'employeeDeductionValue': [employeeDeductionEelement.val],
            //       'isDeductable': [employeeDeductionEelement.fieldValue],

            //     })
            //   );
            // }

          });

          const control2 = <FormArray>this.salaryForm.controls['employerContribution'];
          control2.controls = [];
          res.employerStatutoryContributions.forEach(employeeContributionElement => {
            if (employeeContributionElement.pfDeduction) {
              control2.push(
                this.fb.group({
                  // 'criteria': [employeeContributionElement.criteria],
                  // 'employerContributionId': [employeeContributionElement.employerContributionId],
                  'employerContributionName': ['Employer PF Contribution'],
                  'dependentAllowanceList': [employeeContributionElement.allowanceIds],
                  'employerContributionValue': [employeeContributionElement.val],
                  // 'default': [employeeContributionElement.default],
                  'isDeductable': [employeeContributionElement.fieldValue],

                })
              );
            } else if (employeeContributionElement.esicDeduction) {
              control2.push(
                this.fb.group({
                  // 'criteria': [employeeContributionElement.criteria],
                  // 'employerContributionId': [employeeContributionElement.employerContributionId],
                  'employerContributionName': ['Employer ESIC Contribution'],
                  'dependentAllowanceList': [employeeContributionElement.allowanceIds],
                  'employerContributionValue': [employeeContributionElement.val],
                  // 'default': [employeeContributionElement.default],
                  'isDeductable': [employeeContributionElement.fieldValue],

                })
              );
            } else if (employeeContributionElement.lwfDeduction) {
              control2.push(
                this.fb.group({
                  // 'criteria': [employeeContributionElement.criteria],
                  // 'employerContributionId': [employeeContributionElement.employerContributionId],
                  'employerContributionName': ['Employer LWF Contribution'],
                  'dependentAllowanceList': [employeeContributionElement.allowanceIds],
                  'employerContributionValue': [employeeContributionElement.val],
                  // 'default': [employeeContributionElement.default],
                  'isDeductable': [employeeContributionElement.fieldValue],

                })
              );
            } else if (employeeContributionElement.gratuity) {
              control2.push(
                this.fb.group({
                  // 'criteria': [employeeContributionElement.criteria],
                  // 'employerContributionId': [employeeContributionElement.employerContributionId],
                  'employerContributionName': ['Employer Gratuity Contribution'],
                  'dependentAllowanceList': [employeeContributionElement.allowanceIds],
                  'employerContributionValue': [employeeContributionElement.val],
                  // 'default': [employeeContributionElement.default],
                  'isDeductable': [employeeContributionElement.fieldValue],

                })
              );
            }

          });


          let control = <FormArray>this.salaryForm.controls.variableAllowance;
          res.employeeCtcVariableAllowances.forEach(element => {
            control.push(this.fb.group({
              variableAllowance: [element.variableAllowanceid],
              amount: [element.val],
              variableAllowanceName: [element.variableAllowanceName]
            }));
          });

          control = <FormArray>this.salaryForm.controls.variableDeduction;
          res.employeeCtcVariableDeductions.forEach(element => {
            control.push(this.fb.group({
              variableDeduction: [element.variableDeduction],
              amount: [element.val],
              variableDeductionName: [element.variableDeductionName]
            }));
          });
          this.lwfStatus = res.lwfFrequency;
          this.ptStatus = res.ptfrequnecy;

          this.totalVariableAllowanceY = 0;
          this.salaryForm.controls.variableAllowance['controls'].forEach(element => {
            this.totalVariableAllowanceY += +element.controls.amount.value;
          });

          this.totalVariableDeductionY = 0;
          this.salaryForm.controls.variableDeduction['controls'].forEach(element => {
            this.totalVariableDeductionY += +element.controls.amount.value;
          });

          if (this.salaryForm.controls.ctcFrequency.value == 'Monthly') {
            this.calculateNetSalaryMonthly();
          } else if (this.salaryForm.controls.ctcFrequency.value == 'Annualy') {
            this.calculateNetSalaryAnually();
          }

        }
      }, err => {
        console.log('error block start');
      }, () => {

      });



    // this.getData();

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
    this.totalYearlyAllowances = this.totalMonthlyAllowances * 12;
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
    this.totalYearlyBenefits = this.totalMonthlyBenefits * 12;
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
    this.totalYearlyDeductions = this.totalMonthlyDeductions * 12;
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
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue * 12;
        } else if (this.lwfStatus == 'HALF_YEARLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue * 2;
        } else if (this.lwfStatus == 'YEARLY') {
          this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue;
        }
      } else {
        this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContributionValue * 12;
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
        this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeductionValue * 12;
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
    // // calculate calculateMonthlyVariableAllowanceSum end







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
    this.totalMonthlyAllowances = this.totalYearlyAllowances / 12;

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
    this.totalMonthlyBenefits = this.totalYearlyBenefits / 12;

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
          this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + +element.value.employerContributionValue;
        }
      } else {
        this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + +element.value.employerContributionValue / 12;
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
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
        }
      } else if (element.value.employeeDeductionName == 'Employee PT Deduction') {
        if (this.ptStatus == 'MONTHLY') {
          this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue;
        }
      } else {
        this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeductionValue / 12;
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

  // -------------- Total Fixed Allowances End------------------------------
  closeForm() {
    this.router.navigate(['/employees/edit-employee/' + this.empCode]);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////----------------------------------------------------------------nayab----------------------------------------------------------------------------------////




}
