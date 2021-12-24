
import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ApiCommonService } from '../../../../../services/api-common.service';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Http } from '@angular/http';
import { element } from 'protractor';
import { constants } from 'fs';
import { AddEmployeeService } from '../../../../services/add-employee/add-employee.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
declare var $: any;
@Component({
  selector: 'app-salary-information',
  templateUrl: './salary-information.component.html',
  styleUrls: ['./salary-information.component.scss']
})
export class SalaryInformationComponent implements OnInit {
  totalGrossSalary = 0;
  totalNetSalaryY = 0;
  totalNetSalaryM = 0;
  totalGrossSalaryY = 0;
  totalGrossSalaryM = 0;

  @Input() currentTab: string;
  @Output() currentTabEvent = new EventEmitter<string>();
  selectTimePeriod = '0';

  showFiexedAllowance = false;
  showStatutoryContributions = false;
  showStatutoryDeductions = false;
  showFixedDeductions = false;
  showTaxStatutorySettings = false;

  totalMonthlyAllowances = 0;
  totalYearlyAllowances = 0;

  totalMonthlyDeductions = 0;
  totalYearlyDeductions = 0;
  totalEmployerStatutoryContributionM = 0;
  totalEmployerStatutoryContributionY = 0;
  totalEmployeeStatutoryDeductionM = 0;
  totalEmployeeStatutoryDeductionY = 0;


  salaryForm: FormGroup;

  ctcAllowancess = [];
  ctcDeductionss = [];

  employerContributions = [];
  employeeDeductions = [];
  fixedDeductions = [];
  formRequestRegister = true;
  templates = [];
  empCode: string;
  templatesNames = [
    // { 'ctcTemplateId': '0', 'templateName': 'Enter Manually' }
  ];
  parsedDateString: string;
  constructor(private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService, private addEmployeeService: AddEmployeeService) {
    // this.addEmployeeService.currentEmpCode.subscribe(message => this.empCode = message);
    this.addEmployeeService.currentEmpCode.subscribe(message => this.empCode = message);
    console.log('current Emp Code -->' + this.empCode);
    this.serviceApi.get('/v1/payroll/ctc/template/').subscribe(
      res => {
        this.templates = res;
      },
      err => {
        console.log('error block start');
      },
      () => {
        this.templates.forEach(
          element => {
            this.templatesNames.push({ 'ctcTemplateId': element.ctcTemplateId, 'templateName': element.templateName });
          }
        );
      }
    );
    this.salaryForm = this.fb.group({
      salaryEffectiveDate: [],
      ctcFrequency: ['Monthly'],
      templateName: ['0'],
      empCode: [this.empCode],
      isCurrentFlag: [],
      annualGrossSalary: [],
      totalTakeHome: [],
      totalCtc: [],
      isPFDeductible: [],
      isProvidentPensionDeductible: [],
      isEmployeePFCaped: [],
      isEmployersPFCaped: [],
      providentFundWageAmount: [],
      isESICDeductible: [],
      isProfessionalTaxDeductible: [],
      isLWFDeductible: [],
      isGratuityApplicable: [],
      isIncomeTaxDeductible: [],
      isNPSDeductible: [],
      ctcAllowances: this.fb.array([
        this.fb.group({
          ctcAllowanceId: [],
          fixedAllowance: this.fb.group({
            allowanceId: [],
            allowanceName: [],
            allowanceValue: [],
            isDefaultAllowance: [],
            allowPF: [],
            allowESIC: [],
            allowLWF: [],
            allowProfessionalTax: [],
            allowIncomeTax: [],
            allowExempt: [],
            exemptLimit: [],
            showInCTC: [],
            paymentFrequency: [],
          }),
          criteria: [],
          value: [],
          dependentAllowanceIds: [],
          minimumAmount: [],
        })
      ]),
      employerContribution: this.fb.array([]),
      employeeDeduction: this.fb.array([]),
      ctcDeductions: this.fb.array([
        this.fb.group({
          ctcDeductionId: [],
          deductionId: this.fb.group({
            deductionId: [],
            deductionName: [],
            deductionValue: [],
          }),
          criteria: [],
          value: 0,
          dependentDeductionIds: [
            0
          ],
          minimumAmount: 0
        })
      ])

    });
    // this.salaryForm.controls.salaryEffectiveDate.setValue((new Date('Thu Mar 01 2018 00:00:00 GMT+0530 (India Standard Time)')).toISOString());

    this.loadTemplate();
    // this.calculateGorssSalary();
  }
  get ctcAllowances(): FormArray { return this.salaryForm.get('ctcAllowances') as FormArray; }
  get employerContribution(): FormArray { return this.salaryForm.get('employerContribution') as FormArray; }
  get employeeDeduction(): FormArray { return this.salaryForm.get('employeeDeduction') as FormArray; }
  get ctcDeductions(): FormArray { return this.salaryForm.get('ctcDeductions') as FormArray; }

  ngOnInit() {
  }

  loadTemplate() {
    console.log('calculateSalaryOnTemplate called successfully-->');
    console.log('templateName-->' + this.salaryForm.controls.templateName.value);
    this.showFixedDeductions = false;
    console.log('calculateSalaryOnTemplate -->' + this.salaryForm.controls.annualGrossSalary.value);
    let remainingValue = 0;
    let grossAnnualSalary = this.salaryForm.controls.annualGrossSalary.value;

    // if (this.formRequestRegister) {
    this.formRequestRegister = false;
    console.log('current Emp Code -->' + this.empCode);
    this.serviceApi.get('/v1/payroll/ctc/template/' + this.salaryForm.controls.templateName.value).subscribe(
      res => {
        this.salaryForm = this.fb.group({
          salaryEffectiveDate: [this.salaryForm.controls.salaryEffectiveDate.value],
          ctcFrequency: [this.salaryForm.controls.ctcFrequency.value],
          templateName: [this.salaryForm.controls.templateName.value],
          empCode: [this.empCode],
          isCurrentFlag: [],
          totalTakeHome: [],
          totalCtc: [],
          annualGrossSalary: [res.annualGrossSalary],
          isPFDeductible: ['' + res.isPFDeductible],
          isProvidentPensionDeductible: ['' + res.isProvidentPensionDeductible],
          isEmployeePFCaped: ['' + res.isEmployeePFCaped],
          isEmployersPFCaped: ['' + res.isEmployersPFCaped],
          providentFundWageAmount: ['' + res.providentFundWageAmount],
          isESICDeductible: ['' + res.isESICDeductible],
          isProfessionalTaxDeductible: ['' + res.isProfessionalTaxDeductible],
          isLWFDeductible: ['' + res.isLWFDeductible],
          isGratuityApplicable: ['' + res.isGratuityApplicable],
          isIncomeTaxDeductible: ['' + res.isIncomeTaxDeductible],
          isNPSDeductible: ['' + res.isNPSDeductible],
          ctcAllowances: this.fb.array([]),
          employerContribution: this.fb.array([]),
          employeeDeduction: this.fb.array([]),
          ctcDeductions: this.fb.array([])

        });

        this.ctcAllowancess = res.ctcAllowances;
        this.ctcDeductionss = res.ctcDeductions;
        this.employerContributions = res.ctcEmployerContributions;
        this.employeeDeductions = res.ctcEmployeeDeductions;

      },
      err => {
        console.error('ctcAllownance error -->' + err);
      },
      () => {
        console.log('on complete ctcGeneratic  response');
        this.calculateGorssSalary();
      }
    );
    // }
    // }

  }

  onCTCFrequencyChnage() {
    this.salaryForm.controls.annualGrossSalary.setValue(0);
  }



  calculateGorssSalary() {
    if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.ctcAllowanceMonthly();
    } else if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {
      this.ctcAllowanceAnually();
    }
  }

  ctcAllowanceMonthly() {

    this.calculateCtcAllowance();
    this.calculateEmployeeDeduction();
    this.calculateEmployerContribution();
    this.calculateNetSalaryMonthly();
  }


  ctcAllowanceAnually() {
    this.calculateCtcAllowance();
    this.calculateEmployeeDeduction();
    this.calculateEmployerContribution();
    this.calculateNetSalaryAnually();
  }

  calculateCtcAllowance() {
    let allSum = 0;
    console.log('ctc allowance anually start');
    //ctc Allowance work start
    let minimumAmountForCtc = 0;
    let ctcAllowanceIndex = 0;
    this.ctcAllowancess.forEach(element => {
      const control = <FormArray>this.salaryForm.controls['ctcAllowances'];
      control.push(
        this.fb.group({
          'ctcAllowanceId': [element.ctcAllowanceId],
          'fixedAllowance': this.fb.group({
            'allowanceId': [element.fixedAllowance.allowanceId],
            'allowanceName': [element.fixedAllowance.allowanceName],
            'allowanceValue': [element.fixedAllowance.allowanceValue],
            'isDefaultAllowance': [element.fixedAllowance.isDefaultAllowance],
            'allowPF': [element.fixedAllowance.allowPF],
            'allowESIC': [element.fixedAllowance.allowESIC],
            'allowLWF': [element.fixedAllowance.allowLWF],
            'allowProfessionalTax': [element.fixedAllowance.allowProfessionalTax],
            'allowIncomeTax': [element.fixedAllowance.allowIncomeTax],
            'allowExempt': [element.fixedAllowance.allowExempt],
            'exemptLimit': [element.fixedAllowance.exemptLimit],
            'showInCTC': [element.fixedAllowance.showInCTC],
            'paymentFrequency': [element.fixedAllowance.paymentFrequency],
          }),
          'criteria': [element.criteria],
          'value': [element.value],
          'dependentAllowanceIds': [element.dependentAllowanceIds],
          'minimumAmount': [element.minimumAmount]
        })
      );


      let allowanceValueLocal = 0;
      let sum = 0;
      let allAmountSum = 0;
      let allPercentageSum = 0;
      if (element.criteria === 'AMOUNT') {
        const control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
        control3.controls.forEach(elementAlreadyExist => {
          allAmountSum = allAmountSum + elementAlreadyExist.value.fixedAllowance.allowanceValue;
        });

        allAmountSum = +allAmountSum + +element.value;
        if (!(allAmountSum < this.salaryForm.controls.annualGrossSalary.value)) {
          element.value = 0;
        }
        allSum = allSum + element.value;
        const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
        control2.setControl(ctcAllowanceIndex,
          this.fb.group({
            'ctcAllowanceId': [element.ctcAllowanceId],
            'fixedAllowance': this.fb.group({
              'allowanceId': [element.fixedAllowance.allowanceId],
              'allowanceName': [element.fixedAllowance.allowanceName],
              'allowanceValue': [element.value],
              'isDefaultAllowance': [element.fixedAllowance.isDefaultAllowance],
              'allowPF': [element.fixedAllowance.allowPF],
              'allowESIC': [element.fixedAllowance.allowESIC],
              'allowLWF': [element.fixedAllowance.allowLWF],
              'allowProfessionalTax': [element.fixedAllowance.allowProfessionalTax],
              'allowIncomeTax': [element.fixedAllowance.allowIncomeTax],
              'allowExempt': [element.fixedAllowance.allowExempt],
              'exemptLimit': [element.fixedAllowance.exemptLimit],
              'showInCTC': [element.fixedAllowance.showInCTC],
              'paymentFrequency': [element.fixedAllowance.paymentFrequency],
            }),
            'criteria': [element.criteria],
            'value': [element.value],
            'dependentAllowanceIds': [element.dependentAllowanceIds],
            'minimumAmount': [element.minimumAmount]
          })
        );
      }
      else if (element.criteria === 'PERCENTAGE') {
        let requiredCtcAllowance = [];
        let doSum = false;
        element.dependentAllowanceIds.forEach(dependentId => {
          if (dependentId === -1) {
            if (element.criteria === 'PERCENTAGE') {
              allowanceValueLocal = +allowanceValueLocal + (this.salaryForm.controls.annualGrossSalary.value * element.value) / 100;
              allSum = allSum + allowanceValueLocal;
              const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
              control2.setControl(ctcAllowanceIndex,
                this.fb.group({
                  'ctcAllowanceId': [element.ctcAllowanceId],
                  'fixedAllowance': this.fb.group({
                    'allowanceId': [element.fixedAllowance.allowanceId],
                    'allowanceName': [element.fixedAllowance.allowanceName],
                    'allowanceValue': [allowanceValueLocal],
                    'isDefaultAllowance': [element.fixedAllowance.isDefaultAllowance],
                    'allowPF': [element.fixedAllowance.allowPF],
                    'allowESIC': [element.fixedAllowance.allowESIC],
                    'allowLWF': [element.fixedAllowance.allowLWF],
                    'allowProfessionalTax': [element.fixedAllowance.allowProfessionalTax],
                    'allowIncomeTax': [element.fixedAllowance.allowIncomeTax],
                    'allowExempt': [element.fixedAllowance.allowExempt],
                    'exemptLimit': [element.fixedAllowance.exemptLimit],
                    'showInCTC': [element.fixedAllowance.showInCTC],
                    'paymentFrequency': [element.fixedAllowance.paymentFrequency],
                  }),
                  'criteria': [element.criteria],
                  'value': [element.value],
                  'dependentAllowanceIds': [element.dependentAllowanceIds],
                  'minimumAmount': [element.minimumAmount]
                })
              );
              doSum = false;
            }

          }
          else {
            const control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
            const length = control3.length;
            control3.controls.forEach(element => {
              if (element.value.fixedAllowance.allowanceId === dependentId) {
                requiredCtcAllowance.push(element);
              }
            });
            doSum = true;


          }
        });

        if (doSum) {
          requiredCtcAllowance.forEach(
            rquireElement => {
              sum = sum + rquireElement.value.fixedAllowance.allowanceValue;
            }
          );
          allSum = allSum + (sum * element.value) / 100;
          const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
          control2.setControl(ctcAllowanceIndex,
            this.fb.group({
              'ctcAllowanceId': [element.ctcAllowanceId],
              'fixedAllowance': this.fb.group({
                'allowanceId': [element.fixedAllowance.allowanceId],
                'allowanceName': [element.fixedAllowance.allowanceName],
                'allowanceValue': [(sum * element.value) / 100],
                'isDefaultAllowance': [element.fixedAllowance.isDefaultAllowance],
                'allowPF': [element.fixedAllowance.allowPF],
                'allowESIC': [element.fixedAllowance.allowESIC],
                'allowLWF': [element.fixedAllowance.allowLWF],
                'allowProfessionalTax': [element.fixedAllowance.allowProfessionalTax],
                'allowIncomeTax': [element.fixedAllowance.allowIncomeTax],
                'allowExempt': [element.fixedAllowance.allowExempt],
                'exemptLimit': [element.fixedAllowance.exemptLimit],
                'showInCTC': [element.fixedAllowance.showInCTC],
                'paymentFrequency': [element.fixedAllowance.paymentFrequency],
              }),
              'criteria': [element.criteria],
              'value': [element.value],
              'dependentAllowanceIds': [element.dependentAllowanceIds],
              'minimumAmount': [element.minimumAmount]
            })
          );
        }

      }
      else if (element.criteria === 'BALANCE') {
        const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
        control2.setControl(ctcAllowanceIndex,
          this.fb.group({
            'ctcAllowanceId': [element.ctcAllowanceId],
            'fixedAllowance': this.fb.group({
              'allowanceId': [element.fixedAllowance.allowanceId],
              'allowanceName': [element.fixedAllowance.allowanceName],
              'allowanceValue': [this.salaryForm.controls.annualGrossSalary.value - allSum],
              'isDefaultAllowance': [element.fixedAllowance.isDefaultAllowance],
              'allowPF': [element.fixedAllowance.allowPF],
              'allowESIC': [element.fixedAllowance.allowESIC],
              'allowLWF': [element.fixedAllowance.allowLWF],
              'allowProfessionalTax': [element.fixedAllowance.allowProfessionalTax],
              'allowIncomeTax': [element.fixedAllowance.allowIncomeTax],
              'allowExempt': [element.fixedAllowance.allowExempt],
              'exemptLimit': [element.fixedAllowance.exemptLimit],
              'showInCTC': [element.fixedAllowance.showInCTC],
              'paymentFrequency': [element.fixedAllowance.paymentFrequency],
            }),
            'criteria': [element.criteria],
            'value': [element.value],
            'dependentAllowanceIds': [element.dependentAllowanceIds],
            'minimumAmount': [element.minimumAmount]
          })
        );
      }

      ctcAllowanceIndex++;
    });

    let allowanceSumLocal = 0;
    const control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    const length = control3.length;
    control3.controls.forEach(element => {
      allowanceSumLocal = allowanceSumLocal + element.value.fixedAllowance.allowanceValue;
    });

    const control4 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    const length3 = control4.length;
    let index4 = 0;
    control4.controls.forEach(element => {
      if (element.value.fixedAllowance.allowanceName === 'BALANCE') {
        const control2 = <FormArray>this.salaryForm.controls['ctcAllowances'];
        control2.setControl(ctcAllowanceIndex,
          this.fb.group({
            'ctcAllowanceId': [element.value.ctcAllowanceId],
            'fixedAllowance': this.fb.group({
              'allowanceId': [element.value.fixedAllowance.allowanceId],
              'allowanceName': [element.value.fixedAllowance.allowanceName],
              'allowanceValue': [(this.salaryForm.controls.annualGrossSalary.value - allowanceSumLocal)],
              'isDefaultAllowance': [element.value.fixedAllowance.isDefaultAllowance],
              'allowPF': [element.value.fixedAllowance.allowPF],
              'allowESIC': [element.value.fixedAllowance.allowESIC],
              'allowLWF': [element.value.fixedAllowance.allowLWF],
              'allowProfessionalTax': [element.value.fixedAllowance.allowProfessionalTax],
              'allowIncomeTax': [element.value.fixedAllowance.allowIncomeTax],
              'allowExempt': [element.value.fixedAllowance.allowExempt],
              'exemptLimit': [element.value.fixedAllowance.exemptLimit],
              'showInCTC': [element.value.fixedAllowance.showInCTC],
              'paymentFrequency': [element.value.fixedAllowance.paymentFrequency],
            }),
            'criteria': [element.value.criteria],
            'value': [element.value.value],
            'dependentAllowanceIds': [element.value.dependentAllowanceIds],
            'minimumAmount': [element.value.minimumAmount]
          })
        );

      }
      index4++;
    });
    //ctc Allowance work end

    //ctcDeductions work start
    console.log('ctcDeduction start');
    this.ctcDeductionss.forEach(ctcDeductionElement => {
      const control = <FormArray>this.salaryForm.controls['ctcDeductions'];
      control.push(
        this.fb.group({
          'ctcDeductionId': [ctcDeductionElement.ctcDeductionId],
          'deductionId': this.fb.group({
            'deductionId': [ctcDeductionElement.deduction.deductionId],
            'deductionName': [ctcDeductionElement.deduction.deductionName],
            'deductionValue': [ctcDeductionElement.value],
          }),
          'criteria': [ctcDeductionElement.criteria],
          'value': [ctcDeductionElement.value],
          'dependentDeductionIds': [ctcDeductionElement.dependentDeductionIds],
          'minimumAmount': [ctcDeductionElement.minimumAmount],
        })
      );
    });

    //ctcDeductions work end





    //employeer contribution start
    console.log('ctcEmployerContribution start');
    this.employerContributions.forEach(employeeContributionElement => {
      const control = <FormArray>this.salaryForm.controls['employerContribution'];
      control.push(
        this.fb.group({
          'ctcEmployerContributionId': [employeeContributionElement.ctcEmployerContributionId],
          'employerContribution': this.fb.group({
            'employerContributionId': [employeeContributionElement.employerContribution.employerContributionId],
            'employerContributionName': [employeeContributionElement.employerContribution.employerContributionName],
            'employerContributionValue': [],
            'value': [employeeContributionElement.employerContribution.value],
          }),
          'criteria': [employeeContributionElement.criteria],
          'value': [employeeContributionElement.value]
        })
      );
    });
    //employeer contribution end

    //employee deduction start
    console.log('employeeDeductions start');
    this.employeeDeductions.forEach(employeeDeductionEelement => {
      const control = <FormArray>this.salaryForm.controls['employeeDeduction'];
      control.push(
        this.fb.group({
          'ctcEmployeeDeductionId': [employeeDeductionEelement.ctcEmployeeDeductionId],
          'employeeDeduction': this.fb.group({
            'employeeDeductionId': [employeeDeductionEelement.employeeDeduction.employeeDeductionId],
            'employeeDeductionName': [employeeDeductionEelement.employeeDeduction.employeeDeductionName],
            'employeeDeductionValue': [],
            'value': [employeeDeductionEelement.employeeDeduction.value],
          }),
          'criteria': [employeeDeductionEelement.criteria],
          'value': [employeeDeductionEelement.value]
        })
      );
    });
    //employee deduction end

    this.showFixedDeductions = true;
    this.formRequestRegister = true;
    this.showFiexedAllowance = true;
  }

  calculateEmployeeDeduction() {
    console.log('employeeDeduction caluclations start');
    let deductedValue = 0;
    let forAllowanceValue = 0;

    if (this.salaryForm.controls.isPFDeductible.value === 'true') {
      deductedValue = 0;
      const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      const length = control3.length;
      let employeeDeductionIndex = 0;
      control3.controls.forEach(employeeDeductionElement => {
        if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'PF Employee Deduction') {
          const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
          const length = controlCtcAllowance.length;
          let ctcAllowanceIndex = 0;
          controlCtcAllowance.controls.forEach(element => {
            if (element.value.fixedAllowance.allowPF === true) {
              console.log('calculation in emoloyeeDeduction');
              const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.employeeDeduction.value) / 100;

              deductedValue = deductedValue + temp;
            }
            // this.calculateAllowanceBasedOnDeduction(deductedValue);
            ctcAllowanceIndex++;
          });

          control3.setControl(employeeDeductionIndex,
            this.fb.group({
              'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
              'employeeDeduction': this.fb.group({
                'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
                'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
                'employeeDeductionValue': [deductedValue],
                'value': [employeeDeductionElement.value.employeeDeduction.value]
              }),
              'criteria': [employeeDeductionElement.value.criteria],
              'value': [employeeDeductionElement.value.value]
            }));


        }

        employeeDeductionIndex++;
      });
    }


    if (this.salaryForm.controls.isLWFDeductible.value === 'true') {
      deductedValue = 0;
      const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      const length = control3.length;
      let employeeDeductionIndex = 0;
      control3.controls.forEach(employeeDeductionElement => {
        if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'LWF Employee Deduction') {
          const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
          const length = controlCtcAllowance.length;
          let ctcAllowanceIndex = 0;
          controlCtcAllowance.controls.forEach(element => {
            if (element.value.fixedAllowance.allowLWF === true) {
              console.log('calculation in emoloyeeDeduction');
              const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.value) / 100;
              deductedValue = deductedValue + temp;
            }
            // this.calculateAllowanceBasedOnDeduction(deductedValue);
            ctcAllowanceIndex++;
          });

          control3.setControl(employeeDeductionIndex,
            this.fb.group({
              'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
              'employeeDeduction': this.fb.group({
                'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
                'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
                'employeeDeductionValue': [deductedValue],
                'value': [employeeDeductionElement.value.employeeDeduction.value]
              }),
              'criteria': [employeeDeductionElement.value.criteria],
              'value': [employeeDeductionElement.value.value]
            }));


        }

        employeeDeductionIndex++;
      });
    }

    if (this.salaryForm.controls.isESICDeductible.value === 'true') {
      deductedValue = 0;
      const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      const length = control3.length;
      let employeeDeductionIndex = 0;
      control3.controls.forEach(employeeDeductionElement => {
        if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'ESIC Employee Deduction') {
          const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
          const length = controlCtcAllowance.length;
          let ctcAllowanceIndex = 0;
          controlCtcAllowance.controls.forEach(element => {
            if (element.value.fixedAllowance.allowESIC === true) {
              console.log('calculation in emoloyeeDeduction');
              const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.value) / 100;
              deductedValue = deductedValue + temp;
            }
            // this.calculateAllowanceBasedOnDeduction(deductedValue);
            ctcAllowanceIndex++;
          });

          control3.setControl(employeeDeductionIndex,
            this.fb.group({
              'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
              'employeeDeduction': this.fb.group({
                'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
                'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
                'employeeDeductionValue': [deductedValue],
                'value': [employeeDeductionElement.value.employeeDeduction.value]
              }),
              'criteria': [employeeDeductionElement.value.criteria],
              'value': [employeeDeductionElement.value.value]
            }));


        }

        employeeDeductionIndex++;
      });
    }
    if (this.salaryForm.controls.isProfessionalTaxDeductible.value === 'true') {
      deductedValue = 0;
      const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      const length = control3.length;
      let employeeDeductionIndex = 0;
      control3.controls.forEach(employeeDeductionElement => {
        if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'PROFESSIONALTAX') {
          const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
          const length = controlCtcAllowance.length;
          let ctcAllowanceIndex = 0;
          controlCtcAllowance.controls.forEach(element => {
            if (element.value.fixedAllowance.allowProfessionalTax === true) {
              console.log('calculation in emoloyeeDeduction');
              const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.value) / 100;
              deductedValue = deductedValue + temp;
            }
            // this.calculateAllowanceBasedOnDeduction(deductedValue);
            ctcAllowanceIndex++;
          });

          control3.setControl(employeeDeductionIndex,
            this.fb.group({
              'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
              'employeeDeduction': this.fb.group({
                'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
                'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
                'employeeDeductionValue': [deductedValue],
                'value': [employeeDeductionElement.value.employeeDeduction.value]
              }),
              'criteria': [employeeDeductionElement.value.criteria],
              'value': [employeeDeductionElement.value.value]
            }));


        }

        employeeDeductionIndex++;
      });
    }

    if (this.salaryForm.controls.isIncomeTaxDeductible.value === 'true') {
      deductedValue = 0;
      const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      const length = control3.length;
      let employeeDeductionIndex = 0;
      control3.controls.forEach(employeeDeductionElement => {
        if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'INCOMETAX') {
          const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
          const length = controlCtcAllowance.length;
          let ctcAllowanceIndex = 0;
          controlCtcAllowance.controls.forEach(element => {
            if (element.value.fixedAllowance.allowIncomeTax === true) {
              console.log('calculation in emoloyeeDeduction');
              const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.value) / 100;
              deductedValue = deductedValue + temp;
            }
            // this.calculateAllowanceBasedOnDeduction(deductedValue);
            ctcAllowanceIndex++;
          });

          control3.setControl(employeeDeductionIndex,
            this.fb.group({
              'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
              'employeeDeduction': this.fb.group({
                'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
                'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
                'employeeDeductionValue': [deductedValue],
                'value': [employeeDeductionElement.value.employeeDeduction.value]
              }),
              'criteria': [employeeDeductionElement.value.criteria],
              'value': [employeeDeductionElement.value.value]
            }));


        }

        employeeDeductionIndex++;
      });
    }
    this.isPFDeductibleChnage();
    this.isESICDeductibleChange();
    this.isLWFDeductibleChange();
  }

  setEmployeeContribution(control3: FormArray, elementEmployerContribution: AbstractControl, elementEmployeeDeduction: AbstractControl, employerContributionIndex: number) {
    control3.setControl(employerContributionIndex,
      this.fb.group({
        'ctcEmployerContributionId': [elementEmployerContribution.value.ctcEmployerContributionId],
        'employerContribution': this.fb.group({
          'employerContributionId': [elementEmployerContribution.value.employerContribution.employerContributionId],
          'employerContributionName': [elementEmployerContribution.value.employerContribution.employerContributionName],
          'employerContributionValue': [elementEmployeeDeduction.value.employeeDeduction.employeeDeductionValue],
          'value': [elementEmployeeDeduction.value.employeeDeduction.value],
        }),
        'criteria': [elementEmployerContribution.value.criteria],
        'value': [elementEmployerContribution.value.value]
      }));
  }


  calculateEmployerContribution() {
    console.log('emloyerContributionStart');
    let employerContributionIndex = 0;
    let employeeDeductionIndex = 0;
    const control3 = <FormArray>this.salaryForm.controls['employerContribution'];
    const length = control3.length;
    control3.controls.forEach(elementEmployerContribution => {
      const control = <FormArray>this.salaryForm.controls['employeeDeduction'];
      const length = control.length;
      employeeDeductionIndex = 0;
      control.controls.forEach(elementEmployeeDeduction => {
        if ((elementEmployeeDeduction.value.employeeDeduction.employeeDeductionName === 'PF Employee Deduction') && (elementEmployerContribution.value.employerContribution.employerContributionName === 'PF Employer Contribution')) {
          this.setEmployeeContribution(control3, elementEmployerContribution, elementEmployeeDeduction, employerContributionIndex);
        }
        else if ((elementEmployeeDeduction.value.employeeDeduction.employeeDeductionName === 'LWF Employee Deduction') && (elementEmployerContribution.value.employerContribution.employerContributionName === 'LWF Employer Contribution')) {
          this.setEmployeeContribution(control3, elementEmployerContribution, elementEmployeeDeduction, employerContributionIndex);
        }
        else if ((elementEmployeeDeduction.value.employeeDeduction.employeeDeductionName === 'ESIC Employee Deduction') && (elementEmployerContribution.value.employerContribution.employerContributionName === 'ESIC Employer Contribution')) {
          this.setEmployeeContribution(control3, elementEmployerContribution, elementEmployeeDeduction, employerContributionIndex);
        }

        // if (elementEmployeeDeduction.value.employeeDeduction.employeeDeductionName === elementEmployerContribution.value.employerContribution.employerContributionName) {


        // }
        employeeDeductionIndex++;
      });
      employerContributionIndex++;
    });
  }

  showHideFixedAllowance() {
    if (this.showFiexedAllowance) {
      this.showFiexedAllowance = false;
    } else {
      this.showFiexedAllowance = true;
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
  showHideStatutoryDeductions() {
    if (this.showStatutoryDeductions) {
      this.showStatutoryDeductions = false;
    }
    // tslint:disable-next-line:one-line
    else {
      this.showStatutoryDeductions = true;
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
  showHideTaxStatutorySettings() {
    if (this.showTaxStatutorySettings) {
      this.showTaxStatutorySettings = false;
    }
    // tslint:disable-next-line:one-line
    else {
      this.showTaxStatutorySettings = true;
    }
  }

  isPFDeductibleChnage() {
    console.log('onPfDeductibleChange start-->');
    let deductedValue = 0;
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    const control4 = <FormArray>this.salaryForm.controls['employerContribution'];
    const length = control3.length;
    let employeeDeductionIndex = 0;
    control3.controls.forEach(employeeDeductionElement => {
      if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'PF Employee Deduction') {
        const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const length = controlCtcAllowance.length;
        let ctcAllowanceIndex = 0;
        controlCtcAllowance.controls.forEach(element => {
          if (element.value.fixedAllowance.allowPF === true) {
            console.log('calculation in emoloyeeDeduction');
            const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.employeeDeduction.value) / 100;
            deductedValue = deductedValue + temp;
          }
          // this.calculateAllowanceBasedOnDeduction(deductedValue);
          ctcAllowanceIndex++;
        });


        if (this.salaryForm.controls.isPFDeductible.value === 'false') {
          deductedValue = 0;
        }

        control3.setControl(employeeDeductionIndex,
          this.fb.group({
            'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
            'employeeDeduction': this.fb.group({
              'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
              'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
              'employeeDeductionValue': [deductedValue],
              'value': [employeeDeductionElement.value.employeeDeduction.value],
            }),
            'criteria': [employeeDeductionElement.value.criteria],
            'value': [employeeDeductionElement.value.value]
          }));

        const data = <FormGroup>control4.at(employeeDeductionIndex);
        const contributionFormGroup = <FormGroup>data.controls.employerContribution;
        contributionFormGroup.controls.employerContributionValue.patchValue(deductedValue);
      }

      employeeDeductionIndex++;
    });
    this.calculateEmployerContribution();
    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {
      this.calculateNetSalaryAnually();
    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.calculateNetSalaryMonthly();
    }
  }

  isESICDeductibleChange() {
    console.log('isESICDeductibleChange start-->');
    let deductedValue = 0;
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    const control4 = <FormArray>this.salaryForm.controls['employerContribution'];
    const length = control3.length;
    let employeeDeductionIndex = 0;
    control3.controls.forEach(employeeDeductionElement => {
      if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'ESIC Employee Deduction') {
        const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const length = controlCtcAllowance.length;
        let ctcAllowanceIndex = 0;
        controlCtcAllowance.controls.forEach(element => {
          if (element.value.fixedAllowance.allowESIC === true) {
            console.log('calculation in emoloyeeDeduction');
            const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.employeeDeduction.value) / 100;
            deductedValue = deductedValue + temp;
          }
          // this.calculateAllowanceBasedOnDeduction(deductedValue);
          ctcAllowanceIndex++;
        });

        if (this.salaryForm.controls.isESICDeductible.value === 'false') {
          deductedValue = 0;
        }

        control3.setControl(employeeDeductionIndex,
          this.fb.group({
            'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
            'employeeDeduction': this.fb.group({
              'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
              'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
              'employeeDeductionValue': [deductedValue],
              'value': [employeeDeductionElement.value.employeeDeduction.value]
            }),
            'criteria': [employeeDeductionElement.value.criteria],
            'value': [employeeDeductionElement.value.value]
          }));

        const data = <FormGroup>control4.at(employeeDeductionIndex);
        const contributionFormGroup = <FormGroup>data.controls.employerContribution;
        contributionFormGroup.controls.employerContributionValue.patchValue(deductedValue);
      }

      employeeDeductionIndex++;
    });
    this.calculateEmployerContribution();
    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {
      this.calculateNetSalaryAnually();
    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.calculateNetSalaryMonthly();
    }
  }

  isLWFDeductibleChange() {
    console.log('isLWFDeductibleChange start-->');
    let deductedValue = 0;
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    const control4 = <FormArray>this.salaryForm.controls['employerContribution'];
    const length = control3.length;
    let employeeDeductionIndex = 0;
    control3.controls.forEach(employeeDeductionElement => {
      if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'LWF Employee Deduction') {
        const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const length = controlCtcAllowance.length;
        let ctcAllowanceIndex = 0;
        controlCtcAllowance.controls.forEach(element => {
          if (element.value.fixedAllowance.allowLWF === true) {
            console.log('calculation in emoloyeeDeduction');
            const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.employeeDeduction.value) / 100;
            deductedValue = deductedValue + temp;
          }
          // this.calculateAllowanceBasedOnDeduction(deductedValue);
          ctcAllowanceIndex++;
        });

        if (this.salaryForm.controls.isLWFDeductible.value === 'false') {
          deductedValue = 0;
        }

        control3.setControl(employeeDeductionIndex,
          this.fb.group({
            'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
            'employeeDeduction': this.fb.group({
              'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
              'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
              'employeeDeductionValue': [deductedValue],
              'value': [employeeDeductionElement.value.employeeDeduction.value]
            }),
            'criteria': [employeeDeductionElement.value.criteria],
            'value': [employeeDeductionElement.value.value]
          }));

        const data = <FormGroup>control4.at(employeeDeductionIndex);
        const contributionFormGroup = <FormGroup>data.controls.employerContribution;
        contributionFormGroup.controls.employerContributionValue.patchValue(deductedValue);
      }

      employeeDeductionIndex++;
    });
    this.calculateEmployerContribution();
    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {
      this.calculateNetSalaryAnually();
    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.calculateNetSalaryMonthly();
    }
  }

  isProfessionalTaxDeductibleChange() {
    console.log('isProfessionalTaxDeductibleChange start-->');
    let deductedValue = 0;
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    const control4 = <FormArray>this.salaryForm.controls['employerContribution'];
    const length = control3.length;
    let employeeDeductionIndex = 0;
    control3.controls.forEach(employeeDeductionElement => {
      if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'PROFESSIONALTAX') {
        const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const length = controlCtcAllowance.length;
        let ctcAllowanceIndex = 0;
        controlCtcAllowance.controls.forEach(element => {
          if (element.value.fixedAllowance.allowProfessionalTax === true) {
            console.log('calculation in emoloyeeDeduction');
            const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.value) / 100;
            deductedValue = deductedValue + temp;
          }
          // this.calculateAllowanceBasedOnDeduction(deductedValue);
          ctcAllowanceIndex++;
        });

        if (this.salaryForm.controls.isLWFDeductible.value === 'false') {

          deductedValue = 0;
        }

        control3.setControl(employeeDeductionIndex,
          this.fb.group({
            'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
            'employeeDeduction': this.fb.group({
              'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
              'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
              'employeeDeductionValue': [deductedValue],
              'value': [employeeDeductionElement.value.value]
            }),
            'criteria': [employeeDeductionElement.value.criteria],
            'value': [employeeDeductionElement.value.value]
          }));

        const data = <FormGroup>control4.at(employeeDeductionIndex);
        const contributionFormGroup = <FormGroup>data.controls.employerContribution;
        contributionFormGroup.controls.employerContributionValue.patchValue(deductedValue);
      }

      employeeDeductionIndex++;
    });
    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {
      this.calculateNetSalaryAnually();
    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.calculateNetSalaryMonthly();
    }
  }

  isIncomeTaxDeductibleChange() {
    console.log('isIncomeTaxDeductibleChange start-->');
    let deductedValue = 0;
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    const control4 = <FormArray>this.salaryForm.controls['employerContribution'];
    const length = control3.length;
    let employeeDeductionIndex = 0;
    control3.controls.forEach(employeeDeductionElement => {
      if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'INCOMETAX') {
        const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const length = controlCtcAllowance.length;
        let ctcAllowanceIndex = 0;
        controlCtcAllowance.controls.forEach(element => {
          if (element.value.fixedAllowance.allowIncomeTax === true) {
            console.log('calculation in emoloyeeDeduction');
            const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.value) / 100;
            deductedValue = deductedValue + temp;
          }
          // this.calculateAllowanceBasedOnDeduction(deductedValue);
          ctcAllowanceIndex++;
        });

        if (this.salaryForm.controls.isLWFDeductible.value === 'false') {
          deductedValue = 0;
        }

        control3.setControl(employeeDeductionIndex,
          this.fb.group({
            'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
            'employeeDeduction': this.fb.group({
              'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
              'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
              'employeeDeductionValue': [deductedValue],
              'value': [employeeDeductionElement.value.value]
            }),
            'criteria': [employeeDeductionElement.value.criteria],
            'value': [employeeDeductionElement.value.value]
          }));

        const data = <FormGroup>control4.at(employeeDeductionIndex);
        const contributionFormGroup = <FormGroup>data.controls.employerContribution;
        contributionFormGroup.controls.employerContributionValue.patchValue(deductedValue);
      }

      employeeDeductionIndex++;
    });
    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {
      this.calculateNetSalaryAnually();
    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.calculateNetSalaryMonthly();
    }
  }

  isNPSDeductibleChange() {
    console.log('isNPSDeductibleChange start-->');
    let deductedValue = 0;
    const control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    const control4 = <FormArray>this.salaryForm.controls['employerContribution'];
    const length = control3.length;
    let employeeDeductionIndex = 0;
    control3.controls.forEach(employeeDeductionElement => {
      if (employeeDeductionElement.value.employeeDeduction.employeeDeductionName === 'NPS') {
        const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
        const length = controlCtcAllowance.length;
        let ctcAllowanceIndex = 0;
        controlCtcAllowance.controls.forEach(element => {
          if (element.value.fixedAllowance.allowIncomeTax === true) {
            console.log('calculation in emoloyeeDeduction');
            const temp = (element.value.fixedAllowance.allowanceValue * employeeDeductionElement.value.value) / 100;
            deductedValue = deductedValue + temp;
          }
          ctcAllowanceIndex++;
        });

        if (this.salaryForm.controls.isLWFDeductible.value === 'false') {

          deductedValue = 0;
        }

        control3.setControl(employeeDeductionIndex,
          this.fb.group({
            'ctcEmployeeDeductionId': [employeeDeductionElement.value.ctcEmployeeDeductionId],
            'employeeDeduction': this.fb.group({
              'employeeDeductionId': [employeeDeductionElement.value.employeeDeduction.employeeDeductionId],
              'employeeDeductionName': [employeeDeductionElement.value.employeeDeduction.employeeDeductionName],
              'employeeDeductionValue': [deductedValue],
              'value': [employeeDeductionElement.value.value]
            }),
            'criteria': [employeeDeductionElement.value.criteria],
            'value': [employeeDeductionElement.value.value]
          }));

        const data = <FormGroup>control4.at(employeeDeductionIndex);
        const contributionFormGroup = <FormGroup>data.controls.employerContribution;
        contributionFormGroup.controls.employerContributionValue.patchValue(deductedValue);
      }

      employeeDeductionIndex++;
    });
    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {
      this.calculateNetSalaryAnually();
    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {
      this.calculateNetSalaryMonthly();
    }
  }









  calculateNetSalaryMonthly() {
    //calculate allowanceSum start
    this.totalMonthlyAllowances = 0;
    this.totalYearlyAllowances = 0;
    console.log('this.totalMonthlyAllowances--->' + this.totalMonthlyAllowances);
    let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    let length = control3.length;
    control3.controls.forEach(element => {
      this.totalMonthlyAllowances = this.totalMonthlyAllowances + +element.value.fixedAllowance.allowanceValue;
    });
    this.totalYearlyAllowances = this.totalMonthlyAllowances * 12;
    //calculate allowanceSum end


    //calculate calculateMonthlyDeductionSum start
    this.totalYearlyDeductions = 0;
    this.totalMonthlyDeductions = 0;

    control3 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    length = control3.length;
    control3.controls.forEach(element => {
      this.totalMonthlyDeductions = this.totalMonthlyDeductions + +element.value.deductionId.deductionValue;
    });
    this.totalYearlyDeductions = this.totalMonthlyDeductions * 12;
    //calculate calculateMonthlyDeductionSum end


    //calculate calculateMonthlyDeductionSum start
    this.totalYearlyDeductions = 0;
    this.totalMonthlyDeductions = 0;

    control3 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    length = control3.length;
    control3.controls.forEach(element => {
      this.totalMonthlyDeductions = this.totalMonthlyDeductions + +element.value.deductionId.deductionValue;
    });
    this.totalYearlyDeductions = this.totalMonthlyDeductions * 12;
    //calculate calculateMonthlyDeductionSum end


    //calculate calculateMonthlyEmployeeDeductionSum start
    this.totalEmployeeStatutoryDeductionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    length = control3.length;
    control3.controls.forEach(element => {
      this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionM + +element.value.employeeDeduction.employeeDeductionValue;
    });
    this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionM * 12
    //calculate calculateMonthlyEmployeeDeductionSum end




    //calculate calculateMonthlyEmployerContributionSum start
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployerStatutoryContributionM = 0;
    control3 = <FormArray>this.salaryForm.controls['employerContribution'];
    length = control3.length;
    control3.controls.forEach(element => {
      this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionM + +element.value.employerContribution.employerContributionValue;
    });
    this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionM * 12;
    //calculate calculateMonthlyEmployerContributionSum end


    this.totalNetSalaryM = this.totalMonthlyAllowances - (this.totalMonthlyDeductions + this.totalEmployeeStatutoryDeductionM);
    this.totalNetSalaryY = this.totalYearlyAllowances - (this.totalYearlyDeductions + this.totalEmployeeStatutoryDeductionY);


    this.totalGrossSalaryM = (this.totalMonthlyAllowances + this.totalEmployerStatutoryContributionM) - (this.totalMonthlyDeductions + this.totalEmployeeStatutoryDeductionM);
    this.totalGrossSalaryY = (this.totalYearlyAllowances + this.totalEmployerStatutoryContributionY) - (this.totalYearlyDeductions + this.totalEmployeeStatutoryDeductionY)


    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalGrossSalaryY);
      this.salaryForm.controls.totalCtc.setValue(this.totalNetSalaryY);


    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalGrossSalaryM);
      this.salaryForm.controls.totalCtc.setValue(this.totalNetSalaryM);
    }

  }



  calculateNetSalaryAnually() {
    //calculate allowanceSum start
    this.totalYearlyAllowances = 0;
    this.totalMonthlyAllowances = 0;
    console.log('this.totalYearlyAllowances--->' + this.totalYearlyAllowances);
    let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
    let length = control3.length;
    control3.controls.forEach(element => {
      this.totalYearlyAllowances = this.totalYearlyAllowances + +element.value.fixedAllowance.allowanceValue;
    });
    this.totalMonthlyAllowances = this.totalYearlyAllowances / 12;

    //calculate allowanceSum end


    //calculate calculateAnuallyDeductionSum start
    this.totalYearlyDeductions = 0;
    this.totalMonthlyDeductions = 0;
    control3 = <FormArray>this.salaryForm.controls['ctcDeductions'];
    length = control3.length;
    control3.controls.forEach(element => {
      this.totalYearlyDeductions = this.totalYearlyDeductions + +element.value.deductionId.deductionValue;
    });
    this.totalMonthlyDeductions = this.totalYearlyDeductions / 12;
    //calculate calculateAnuallyDeductionSum end

    //calculate calculateAnuallyEmployeeDeductionSum start
    this.totalEmployeeStatutoryDeductionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
    length = control3.length;
    control3.controls.forEach(element => {
      this.totalEmployeeStatutoryDeductionY = this.totalEmployeeStatutoryDeductionY + +element.value.employeeDeduction.employeeDeductionValue;
    });
    this.totalEmployeeStatutoryDeductionM = this.totalEmployeeStatutoryDeductionY / 12;
    //calculate calculateAnuallyEmployeeDeductionSum end

    this.totalNetSalaryM = this.totalMonthlyAllowances - (this.totalMonthlyDeductions + this.totalEmployeeStatutoryDeductionM);
    this.totalNetSalaryY = this.totalYearlyAllowances - (this.totalYearlyDeductions + this.totalEmployeeStatutoryDeductionY)


    //calculate calculateAnuallyEmployerContributionSum start
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployerStatutoryContributionM = 0;
    control3 = <FormArray>this.salaryForm.controls['employerContribution'];
    length = control3.length;
    control3.controls.forEach(element => {
      this.totalEmployerStatutoryContributionY = this.totalEmployerStatutoryContributionY + +element.value.employerContribution.employerContributionValue;
    });
    this.totalEmployerStatutoryContributionM = this.totalEmployerStatutoryContributionY / 12;
    //calculate calculateAnuallyEmployerContributionSum end

    this.totalGrossSalaryM = this.totalMonthlyAllowances + this.totalEmployerStatutoryContributionM;
    this.totalGrossSalaryY = this.totalYearlyAllowances + this.totalEmployerStatutoryContributionY;



    if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalGrossSalaryY);
      this.salaryForm.controls.totalCtc.setValue(this.totalNetSalaryY);


    }
    else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {

      this.salaryForm.controls.totalTakeHome.setValue(this.totalGrossSalaryM);
      this.salaryForm.controls.totalCtc.setValue(this.totalNetSalaryM);
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



  resetForm() {

    const controlCtcAllowance = <FormArray>this.salaryForm.controls['ctcAllowances'];
    while (controlCtcAllowance.length !== 0) {
      controlCtcAllowance.removeAt(0)
    }
    const ctcDeductions = <FormArray>this.salaryForm.controls['ctcDeductions'];
    while (ctcDeductions.length !== 0) {
      ctcDeductions.removeAt(0)
    }
    const employeeDeduction = <FormArray>this.salaryForm.controls['employeeDeduction'];
    while (employeeDeduction.length !== 0) {
      employeeDeduction.removeAt(0)
    }
    const employerContribution = <FormArray>this.salaryForm.controls['employerContribution'];
    while (employerContribution.length !== 0) {
      employerContribution.removeAt(0)
    }


    this.totalGrossSalary = 0;
    this.totalNetSalaryY = 0;
    this.totalNetSalaryM = 0;
    this.selectTimePeriod = '0';

    this.showStatutoryContributions = false;
    this.showFiexedAllowance = false;
    this.showStatutoryDeductions = false;
    this.showFixedDeductions = false;
    this.showTaxStatutorySettings = false;

    this.totalYearlyAllowances = 0;
    this.totalMonthlyAllowances = 0;

    this.totalMonthlyDeductions = 0;
    this.totalYearlyDeductions = 0;
    this.totalEmployerStatutoryContributionM = 0;
    this.totalEmployerStatutoryContributionY = 0;
    this.totalEmployeeStatutoryDeductionM = 0;
    this.totalEmployeeStatutoryDeductionY = 0;

  }

  // datePickerDate(type: string, event: MatDatepickerInputEvent<Date>) {

  //   console.log('datePicker value -->' + type + '---' + event.value);
  //   console.log('datePicker value -->' + type + '---' + event.value.toISOString());
  //   console.log('datePicker value -->' + type + '---' + event.value.toUTCString());
  //   // this.parsedDateString = event.value.toISOString();
  //   this.salaryForm.controls.salaryEffectiveDate.setValue(new Date('2018-03-12T18:30:00.000Z'));
  //   // console.log('datePicker value -->' + this.salaryForm.controls.salaryEffectiveDate.value);
  // }

  save() {
    if (this.salaryForm.valid) {
      if (this.salaryForm.controls.ctcFrequency.value === 'Annually') {

        this.salaryForm.controls.totalTakeHome.setValue(this.totalGrossSalaryY);
        this.salaryForm.controls.totalCtc.setValue(this.totalNetSalaryY);


      }
      else if (this.salaryForm.controls.ctcFrequency.value === 'Monthly') {

        this.salaryForm.controls.totalTakeHome.setValue(this.totalGrossSalaryM);
        this.salaryForm.controls.totalCtc.setValue(this.totalNetSalaryM);
      }

      let employeeCtcAllowances = [];
      let control3 = <FormArray>this.salaryForm.controls['ctcAllowances'];
      let length = control3.length;
      control3.controls.forEach(element => {
        employeeCtcAllowances.push(
          {
            'ctcAllowanceId': element.value.fixedAllowance.allowanceId,
            'ctcAllowanceValue': +element.value.fixedAllowance.allowanceValue
          }
        );
      });

      let employeeCtcDeductions = [];

      control3 = <FormArray>this.salaryForm.controls['ctcDeductions'];
      length = control3.length;
      control3.controls.forEach(element => {
        employeeCtcDeductions.push(
          {
            'ctcDeductionId': element.value.deductionId.deductionId,
            'ctcDeductionValue': +element.value.deductionId.deductionValue
          }
        );
      });


      let employeeStatutoryDeductions = [];

      control3 = <FormArray>this.salaryForm.controls['employeeDeduction'];
      length = control3.length;
      control3.controls.forEach(element => {
        employeeStatutoryDeductions.push(
          {
            'ctcEmployeeDeductionId': element.value.employeeDeduction.employeeDeductionId,
            'ctcEmployeeDeductionValue': +element.value.employeeDeduction.employeeDeductionValue
          }
        );
      });

      let ctcEmployerContributions = [];

      control3 = <FormArray>this.salaryForm.controls['employerContribution'];
      length = control3.length;
      control3.controls.forEach(element => {
        ctcEmployerContributions.push(
          {
            'ctcEmployerContributionId': element.value.employerContribution.employerContributionId,
            'ctcEmployerContributionValue': +element.value.employerContribution.employerContributionValue
          }
        );
      });


      console.log('at saving time current Emp Code -->' + this.empCode);

      const data = {
        'annualGrossSalary': this.salaryForm.controls.annualGrossSalary.value,
        'ctcFrequency': this.salaryForm.controls.ctcFrequency.value,
        'ctcTemplateName': this.salaryForm.controls.templateName.value,
        'empCode': this.empCode,
        'employeeCtcAllowances': employeeCtcAllowances,
        'employeeCtcDeductions': employeeCtcDeductions,
        'employeeStatutoryDeductions': employeeStatutoryDeductions,
        'employerStatutoryContributions': ctcEmployerContributions,
        'isCurrentFlag': <Boolean>this.salaryForm.controls.isCurrentFlag.value,
        'isESICDeductible': <Boolean>this.salaryForm.controls.isESICDeductible.value,
        'isEmployeePFCaped': <Boolean>this.salaryForm.controls.isEmployeePFCaped.value,
        'isEmployersPFCaped': <Boolean>this.salaryForm.controls.isEmployersPFCaped.value,
        'isGratuityApplicable': <Boolean><Boolean>this.salaryForm.controls.isGratuityApplicable.value,
        'isIncomeTaxDeductible': this.salaryForm.controls.isIncomeTaxDeductible.value,
        'isLWFDeductible': <Boolean>this.salaryForm.controls.isLWFDeductible.value,
        'isNPSDeductible': <Boolean>this.salaryForm.controls.isNPSDeductible.value,
        'isPFDeductible': <Boolean>this.salaryForm.controls.isPFDeductible.value,
        'isProfessionalTaxDeductible': <Boolean>this.salaryForm.controls.isProfessionalTaxDeductible.value,
        'isProvidentPensionDeductible': <Boolean>this.salaryForm.controls.isProvidentPensionDeductible.value,
        'providentFundWageAmount': this.salaryForm.controls.providentFundWageAmount.value,
        'salaryEffectiveDate': this.salaryForm.controls.salaryEffectiveDate.value,
        'totalCtc': this.salaryForm.controls.totalTakeHome.value,
        'totalTakeHome': this.salaryForm.controls.totalCtc.value,
      }


      this.serviceApi.post('/v1/employee/salary/', data).subscribe(
        res => {
          console.log('Api Called Successfully');
          console.log('response-->' + res);
          this.successNotification(res.message);
        },
        err => {
          console.error('error ->' + err);
          // this.warningNotification(err.message);
        },
        () => {
          console.log('end sucessfully');
        }
      );
      console.log('salaryInformation:-' + JSON.stringify(this.salaryForm.value));
      this.currentTabEvent.emit('5');
    } else {
      Object.keys(this.salaryForm.controls).forEach(field => { // {1}
        const control = this.salaryForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }


  }
  // -------------- Total Fixed Allowances End------------------------------
}
