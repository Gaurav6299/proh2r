import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommonService } from '../../../../services/api-common.service';
declare var $: any;
@Component({
  selector: 'app-tax-calculator',
  templateUrl: './tax-calculator.component.html',
  styleUrls: ['./tax-calculator.component.scss']
})
export class TaxCalculatorComponent implements OnInit {
  allowances: any;
  taxCalculatorForm: FormGroup;
  employeeTaxDeclarationId: any;
  empCode: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.route.queryParams.subscribe(res =>
      this.empCode = res.empCode);
    console.log(this.employeeTaxDeclarationId);
    this.route.params.subscribe(res => {
      this.employeeTaxDeclarationId = res.id;
    }, (err) => {

    }, () => {

    });
    this.getAllAllowances();

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
  taxCalculationDialog() {
    const dialogRef = this.dialog.open(TaxCalculationDialogComponent, {
      width: '900px',
      panelClass: 'custom-dialog-container',
      data: {
        age: this.allowances.age,
        add: {
          totalGross: this.taxCalculatorForm.controls.totalGross.value,
          totalVariableAllowance: this.allowances.totalVariableAllowance,
          totalPerquisites: this.allowances.totalPerquisites,
          totalIncomeFromOtherSources: this.allowances.totalIncomeFromOtherSources,
          previousTaxableIncome: this.taxCalculatorForm.controls.previousEmploymentInformation['controls'].find(element => element.controls.taxDeclarationComponentId.value == 55).controls.approvedAmount.value
        },
        subtract: {
          totalSection10Exemption: { amount: this.taxCalculatorForm.controls.totalSection10Exemption.value, limit: 0 },
          totalHRAExemption: { amount: this.allowances.totalHRAExemption, limit: 0 },
          totalPFDeductedFromSalary: { amount: this.allowances.totalPFDeductedFromSalary, limit: 0 },
          totalChapterVIDeclaration: { amount: this.allowances.totalChapterVIDeclaration, limit: this.allowances.chapterVILimit },
          totalSection80CDeclaration: { amount: (this.allowances.totalSection80CDeclaration - this.allowances.section80C.find(element=> element.taxDeclarationComponentId==15).approvedAmount + this.allowances.totalPFDeductedFromSalary), limit: this.allowances.section80CLimit },
          totalInterestOnHomeLoan: { amount: this.allowances.totalInterestOnHomeLoan, limit: this.allowances.interestOnHomeLoanLimit },
          section80CCDNPS: { amount: this.allowances.section80C.find(element=> element.taxDeclarationComponentId==15).approvedAmount, limit: this.allowances.section80C.find(element=> element.taxDeclarationComponentId==15).maximumAmount },
          previousTax: this.taxCalculatorForm.controls.previousEmploymentInformation['controls'].find(element => element.controls.taxDeclarationComponentId.value == 56).controls.approvedAmount.value,

          pF: this.taxCalculatorForm.controls.previousEmploymentInformation['controls'].find(element => element.controls.taxDeclarationComponentId.value == 57).controls.approvedAmount.value,

          pT: this.taxCalculatorForm.controls.previousEmploymentInformation['controls'].find(element => element.controls.taxDeclarationComponentId.value == 58).controls.approvedAmount.value
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
          }
        }
      }
    });

  }

  initializeForm() {
    this.taxCalculatorForm = this.fb.group({
      totalGross: ["", Validators.required],
      totalSection10Exemption: ["", Validators.required],
      houseRentDetailsVo: this.fb.array([]),
      chapterVIAVO: this.fb.array([]),
      section80C: this.fb.array([]),
      incomeFromOtherSources: this.fb.array([]),
      previousEmploymentInformation: this.fb.array([]),
      interestOnHomeLoan: this.fb.array([])
    });
  }

  ngOnInit() {
    this.initializeForm();
  }
  backToNavigate() {
    this.router.navigate(['/employees/edit-employee/' + this.empCode]);
  }
  getHouseRentFormArray() {
    let control = <FormArray>this.taxCalculatorForm.controls.houseRentDetailsVo;
    control.push(this.fb.group({
      monthName: [''],
      basicPlusDa: [''],
      actualHra: [''],
      rentPaid: [''],
      cityType: [''],
      monthlyExemption: ['']
    }));
  }

  getchapterVIAVOtFormArray() {
    let control = <FormArray>this.taxCalculatorForm.controls.chapterVIAVO;
    control.push(this.fb.group({
      empTaxDeclareCompDetailId: [''],
      componentName: [''],
      maximumAmount: [''],
      approvedAmount: 0.0,
      sectionName: [''],
      taxDeclarationComponentId: ['']
    }));
  }

  getSection80CFormArray() {
    let control = <FormArray>this.taxCalculatorForm.controls.section80C;
    control.push(this.fb.group({
      empTaxDeclareCompDetailId: [''],
      componentName: [''],
      maximumAmount: [''],
      approvedAmount: 0.0,
      sectionName: [''],
      taxDeclarationComponentId: ['']
    }));
  }

  getIncomeFromOtherSources() {
    let control = <FormArray>this.taxCalculatorForm.controls.incomeFromOtherSources;
    control.push(this.fb.group({
      empTaxDeclareCompDetailId: [''],
      componentName: [''],
      maximumAmount: [''],
      approvedAmount: 0.0,
      sectionName: [''],
      taxDeclarationComponentId: ['']
    }));
  }

  getPreviousEmploymentInformation() {
    let control = <FormArray>this.taxCalculatorForm.controls.previousEmploymentInformation;
    control.push(this.fb.group({
      empTaxDeclareCompDetailId: [''],
      componentName: [''],
      maximumAmount: [''],
      approvedAmount: 0.0,
      sectionName: [''],
      taxDeclarationComponentId: ['']
    }));
  }

  getInterestOnHomeLoan() {
    let control = <FormArray>this.taxCalculatorForm.controls.interestOnHomeLoan;
    control.push(this.fb.group({
      empTaxDeclareCompDetailId: [''],
      componentName: [''],
      maximumAmount: [''],
      approvedAmount: 0.0,
      sectionName: [''],
      taxDeclarationComponentId: ['']
    }));
  }
  resetData() {
    this.initializeForm();
    this.getAllAllowances();
  }

  calculateHRAExemption(index: any) {
    console.log(index);
    const formArray = this.taxCalculatorForm.get('houseRentDetailsVo') as FormArray;
    var line = formArray.controls[index];
    var v1 = line['controls'].actualHra.value;
    var v2 = (line['controls'].rentPaid.value - (0.1 * line['controls'].basicPlusDa.value))
    var v3 = 0.0;
    if (line['controls'].cityType.value == 'METRO') {
      v3 = 0.5 * line['controls'].basicPlusDa.value;
    } else {
      v3 = 0.4 * line['controls'].basicPlusDa.value;
    }
    var monthlyExemption = Math.min(Math.min(v1, v2), v3);
    line['controls'].monthlyExemption.setValue(monthlyExemption < 0 ? 0 : monthlyExemption);
    this.calculateTotalHRAExemption();
  }

  calculateTotalHRAExemption() {
    var sum = 0.0;
    const formArray = this.taxCalculatorForm.get('houseRentDetailsVo') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      sum += formArray.controls[i]['controls'].monthlyExemption.value
    }
    this.allowances.totalHRAExemption = sum;
  }

  calculateChapterVIExemption() {
    var sum = 0.0;
    const formArray = this.taxCalculatorForm.get('chapterVIAVO') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      sum += formArray.controls[i]['controls'].approvedAmount.value
    }
    this.allowances.totalChapterVIDeclaration = sum;
  }

  calculate80CExemption() {
    var sum = 0.0;
    const formArray = this.taxCalculatorForm.get('section80C') as FormArray;
    const component80CCD = 'U/s 80CCD(NPS)';
    for (var i = 0; i < formArray.length; i++) {
      if (formArray.controls[i]['controls'].componentName.value != component80CCD) {
        sum += formArray.controls[i]['controls'].approvedAmount.value;
      }
      else {
        this.allowances.section80C.find(element=> element.taxDeclarationComponentId==15).approvedAmount = formArray.controls[i]['controls'].approvedAmount.value;
        this.allowances.section80C.find(element=> element.taxDeclarationComponentId==15).maximumAmount = formArray.controls[i]['controls'].maximumAmount.value;
        sum += formArray.controls[i]['controls'].approvedAmount.value;
      }
    }

    this.allowances.totalSection80CDeclaration = sum;
  }

  calculateIncomeFromOtherSourcesExemption() {
    var sum = 0.0;
    const formArray = this.taxCalculatorForm.get('incomeFromOtherSources') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      sum += formArray.controls[i]['controls'].approvedAmount.value
    }
    this.allowances.totalIncomeFromOtherSources = sum;
  }

  calculatePreviousEmploymentInformationExemption() {
    var sum = 0.0;
    const formArray = this.taxCalculatorForm.get('previousEmploymentInformation') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      sum += formArray.controls[i]['controls'].approvedAmount.value
    }
    this.allowances.totalPreviousEmployment = sum;
  }

  calculateInterestOnHomeLoanExemption() {
    var sum = 0.0;
    const formArray = this.taxCalculatorForm.get('interestOnHomeLoan') as FormArray;
    for (var i = 0; i < formArray.length; i++) {
      sum += formArray.controls[i]['controls'].approvedAmount.value
    }
    this.allowances.totalInterestOnHomeLoan = sum;
  }


  getAllAllowances() {
    this.allowances = {};
    this.serviceApi.get("/v1/employee/tax-calculator/getData/" + this.employeeTaxDeclarationId).subscribe(res => {
      this.allowances = res;
    }, (err) => {

    }, () => {
      this.taxCalculatorForm.controls.totalGross.setValue(this.allowances.totalGross);
      this.taxCalculatorForm.controls.totalSection10Exemption.setValue(this.allowances.totalSection10Exemption);
      var houseRentDetailsVoLength = this.allowances.houseRentDetailsVo.length;
      while (houseRentDetailsVoLength > 0) {
        this.getHouseRentFormArray();
        houseRentDetailsVoLength--;
      }
      this.taxCalculatorForm.controls.houseRentDetailsVo.setValue(this.allowances.houseRentDetailsVo);
      var chapterVIAVOLength = this.allowances.chapterVIAVO.length;
      while (chapterVIAVOLength > 0) {
        this.getchapterVIAVOtFormArray();
        chapterVIAVOLength--;
      }
      this.taxCalculatorForm.controls.chapterVIAVO.setValue(this.allowances.chapterVIAVO);
      if (this.allowances.chapterVILimit == 0) {
        this.allowances.chapterVILimit = "No Limit";
      }
      var section80CLength = this.allowances.section80C.length;
      while (section80CLength > 0) {
        this.getSection80CFormArray();
        section80CLength--;
      }
      if (this.allowances.section80CLimit == 0) {
        this.allowances.section80CLimit = "No Limit";
      }
      this.taxCalculatorForm.controls.section80C.setValue(this.allowances.section80C);

      var incomeFromOtherSourcesLength = this.allowances.incomeFromOtherSources.length;
      while (incomeFromOtherSourcesLength > 0) {
        this.getIncomeFromOtherSources();
        incomeFromOtherSourcesLength--;
      }
      if (this.allowances.incomeFromOtherSourcesLimit == 0) {
        this.allowances.incomeFromOtherSourcesLimit = "No Limit";
      }
      this.taxCalculatorForm.controls.incomeFromOtherSources.setValue(this.allowances.incomeFromOtherSources);

      var previousEmploymentInformationLength = this.allowances.previousEmploymentInformation.length;
      while (previousEmploymentInformationLength > 0) {
        this.getPreviousEmploymentInformation();
        previousEmploymentInformationLength--;
      }
      if (this.allowances.previousEmploymentLimit == 0) {
        this.allowances.previousEmploymentLimit = "No Limit";
      }
      this.taxCalculatorForm.controls.previousEmploymentInformation.setValue(this.allowances.previousEmploymentInformation);



      var interestOnHomeLoanLength = this.allowances.interestOnHomeLoan.length;
      while (interestOnHomeLoanLength > 0) {
        this.getInterestOnHomeLoan();
        interestOnHomeLoanLength--;
      }
      if (this.allowances.interestOnHomeLoanLimit == 0) {
        this.allowances.interestOnHomeLoanLimit = "No Limit";
      }
      this.taxCalculatorForm.controls.interestOnHomeLoan.setValue(this.allowances.interestOnHomeLoan);

    });
  }
}

@Component({
  templateUrl: 'tax-calculation-dialog.html',
  styleUrls: ['./tax-calculation-dialog.scss']
})
export class TaxCalculationDialogComponent implements OnInit {
  actions: any;
  error: any;
  message
  netTaxableSalaryOld: any = 0;
  netTaxableSalarNew: any = 0;
  cessNew: any;
  totalTaxPayableOld: any;
  cessOld: any;
  surchargeOld: any;
  surchargeNew: any;
  totalTaxPayableNew: any;
  _87ARebate: any;
  totalTaxNew: any;
  totalTaxOld: any;
  constructor(public dialogRef: MatDialogRef<TaxCalculationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data);
    this.netTaxableSalarNew = this.data.add.totalGross + this.data.add.totalIncomeFromOtherSources + this.data.add.previousTaxableIncome;
    this.netTaxableSalaryOld = this.netTaxableSalarNew - 50000;
    if (this.data.subtract.totalChapterVIDeclaration.limit == 0 || this.data.subtract.totalChapterVIDeclaration.limit == 'No Limit') {
      this.netTaxableSalaryOld -= this.data.subtract.totalChapterVIDeclaration.amount;
    } else {
      if (this.data.subtract.totalChapterVIDeclaration.limit < this.data.subtract.totalChapterVIDeclaration.amount) {
        this.netTaxableSalaryOld -= this.data.subtract.totalChapterVIDeclaration.limit;
      } else {
        this.netTaxableSalaryOld -= this.data.subtract.totalChapterVIDeclaration.amount;
      }
    }

    if (this.data.subtract.totalHRAExemption.limit == 0 || this.data.subtract.totalHRAExemption.limit == 'No Limit') {
      this.netTaxableSalaryOld -= this.data.subtract.totalHRAExemption.amount;
    } else {
      if (this.data.subtract.totalHRAExemption.limit < this.data.subtract.totalHRAExemption.amount) {
        this.netTaxableSalaryOld -= this.data.subtract.totalHRAExemption.limit;
      } else {
        this.netTaxableSalaryOld -= this.data.subtract.totalHRAExemption.amount;
      }
    }

    if (this.data.subtract.totalInterestOnHomeLoan.limit == 0 || this.data.subtract.totalInterestOnHomeLoan.limit == 'No Limit') {
      this.netTaxableSalaryOld -= this.data.subtract.totalInterestOnHomeLoan.amount;
    } else {
      if (this.data.subtract.totalInterestOnHomeLoan.limit < this.data.subtract.totalInterestOnHomeLoan.amount) {
        this.netTaxableSalaryOld -= this.data.subtract.totalInterestOnHomeLoan.limit;
      } else {
        this.netTaxableSalaryOld -= this.data.subtract.totalInterestOnHomeLoan.amount;
      }
    }
    //
    // if (this.data.subtract.totalPFDeductedFromSalary.limit == 0 || this.data.subtract.totalPFDeductedFromSalary.limit == 'No Limit') {
    //   this.netTaxableSalaryOld -= this.data.subtract.totalPFDeductedFromSalary.amount;
    // } else {
    //   if (this.data.subtract.totalPFDeductedFromSalary.limit < this.data.subtract.totalPFDeductedFromSalary.amount) {
    //     this.netTaxableSalaryOld -= this.data.subtract.totalPFDeductedFromSalary.limit;
    //   } else {
    //     this.netTaxableSalaryOld -= this.data.subtract.totalPFDeductedFromSalary.amount;
    //   }
    // }


    if (this.data.subtract.totalSection10Exemption.limit == 0 || this.data.subtract.totalSection10Exemption.limit == 'No Limit') {
      this.netTaxableSalaryOld -= this.data.subtract.totalSection10Exemption.amount;
    } else {
      if (this.data.subtract.totalSection10Exemption.limit < this.data.subtract.totalSection10Exemption.amount) {
        this.netTaxableSalaryOld -= this.data.subtract.totalSection10Exemption.limit;
      } else {
        this.netTaxableSalaryOld -= this.data.subtract.totalSection10Exemption.amount;
      }
    }

    if (this.data.subtract.totalSection80CDeclaration.limit == 0 || this.data.subtract.totalSection80CDeclaration.limit == 'No Limit') {
      this.netTaxableSalaryOld -= this.data.subtract.totalSection80CDeclaration.amount;
    } else {
      if (this.data.subtract.totalSection80CDeclaration.limit < this.data.subtract.totalSection80CDeclaration.amount) {
        this.netTaxableSalaryOld -= this.data.subtract.totalSection80CDeclaration.limit;
      } else {
        this.netTaxableSalaryOld -= this.data.subtract.totalSection80CDeclaration.amount;
      }
    }

    //edited code
    if (this.data.subtract.section80CCDNPS.limit < this.data.subtract.section80CCDNPS.amount) {
      this.netTaxableSalaryOld -= this.data.subtract.section80CCDNPS.limit;
    }
    else {
      this.netTaxableSalaryOld -= this.data.subtract.section80CCDNPS.amount;
    }
    this.netTaxableSalaryOld -= this.data.subtract.previousTax;
    this.netTaxableSalaryOld -= this.data.subtract.pF;
    this.netTaxableSalaryOld -= this.data.subtract.pT;
    this.getTotalTax();
  }

  getTotalTax() {
    const body = {
      "age": this.data.age,
      "taxableIncomeNew": this.netTaxableSalarNew,
      "taxableIncomeOld": this.netTaxableSalaryOld
    }
    this.serviceApi.post("/v1/employee/tax-calculator/get-tax", body).subscribe(res => {
      this.cessNew = res.cessNew;
      this.totalTaxPayableOld = res.totalTaxPayableOld;
      this.cessOld = res.cessOld;
      this.surchargeOld = res.surchargeOld;
      this.surchargeNew = res.surchargeNew;
      this.totalTaxPayableNew = res.totalTaxPayableNew;
      this._87ARebate = res._87ARebate;
      if (this._87ARebate > 0) {
        this.totalTaxPayableOld = this._87ARebate;
      }
      this.totalTaxNew = res.cessNew + res.surchargeNew + res.totalTaxPayableNew;
      this.totalTaxOld = res.cessOld + res.surchargeOld + res.totalTaxPayableOld;
    })
  }
  ngOnInit() { }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}
