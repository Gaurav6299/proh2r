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
import { SelectionModel } from '@angular/cdk/collections';
import { element } from 'protractor';

import { ActivatedRoute } from '@angular/router';
import { ApiCommonService } from '../../../../../../services/api-common.service';
import { environment } from '../../../../../../../environments/environment';

declare var $: any;
@Component({
  selector: 'app-detailed-payslip',
  templateUrl: './detailed-payslip.component.html',
  styleUrls: ['./detailed-payslip.component.scss']
})
export class DetailedPayslipComponent implements OnInit {

  companyName: string;
  contactNumber: string;
  headOfficeAddress: string;
  companyImage: string;


  runPayrollEmployeeStatusId: number;
  empCode: string;
  empName: string;
  empJoiningDate: string;
  emailId: string;
  designation: string;
  panNo: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  totalWorkDaysInMonth: number;
  totalWorkingDays: number;
  totalLopDays: number;
  totalPayableDays: number;
  publishUnpublishStatus: string;
  runPayrollFixedAllowances = [];
  totalFixedAllowanceAmount: number;
  monthlyRateTotal: number = 0;
  runPayrollFixedDeductions = [];
  totalFixedDeductionAmount: number;
  runPayrollVariableAllowances = [];
  totalVariableAllowanceAmount: number;
  runPayrollVariableDeductions = [];
  totalVariableDeductionAmount: 0;
  runPayrollEmployeeDeductions = [];
  totalEmployeeDeductionAmount: number;
  incomeTaxOverwrite: number;
  professionalTaxOverwrite: number;
  arrears: number;
  totalGrossSalary: number;
  totalNetPaymentAmount: number;
  uanNumber: string;
  pfNumber: string;
  esicNumber: string;
  city: string;
  state: string;
  payslipDoc: string;
  recordId: number;
  employeeCode: string;
  year: number;
  month: string;
  plCount: string;
  clCount: string;
  weekoff: string;
  holiday: string;
  payslipData: any;
  grossDeductions: number;
  grossEarnings: number;
  constructor(private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    private route: ActivatedRoute) {

    this.route.params.subscribe(res => {
      this.employeeCode = res.id;
      this.recordId = res.recordId;

      this.month = res.month;
      this.year = res.year;
      console.log('year -->' + this.year);
      console.log('month -->' + this.month);
    });

    this.getEmployeePayslipDetails();
  }

  ngOnInit() {
  }



  // generatePDF() {
  //   this.serviceApi.post1('/v1/payroll/payslip/generatePdf/' + this.recordId, null).subscribe(
  //     res => {
  //       let b: any = new Blob([res], { type: 'application/pdf' });
  //       console.log('res ==>');
  //       console.log(res);
  //       console.log('start download:', res);
  //       var url = window.URL.createObjectURL(b);
  //       const a = document.createElement('a');
  //       document.body.appendChild(a);
  //       a.setAttribute('style', 'display: none');
  //       a.href = url;
  //       a.download = "Salary_Slip_" + this.empCode;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       a.remove(); // remove the element

  //     },
  //     err => {
  //       console.log('download error:', JSON.stringify(err));
  //     },
  //     () => {
  //       console.log('Generate PDF Execute Successfully');
  //     }
  //   );

  // }

  downloadPayslip(payslipDoc: any) {
    if (payslipDoc !== null) {
      window.location.href = payslipDoc;
    }
    else
      console.error("Document not uploaded regarding this category");
  }


  getEmployeePayslipDetails() {
    console.log('Enter to Get Details For the Payslip');
    this.serviceApi.get('/v1/payroll/payslips/getEmployeePayslip/' + this.month + '-' + this.year + '/' + this.employeeCode)
      .subscribe(
      res => {
        this.payslipData = res;
        this.grossDeductions = 0.00;
        this.grossEarnings = 0.00;
        res.runPayrollFixedAllowances.forEach(element => {
          this.grossEarnings += element.totalAmount
        });
        res.runPayrollOtherBenefits.forEach(element => {
          this.grossEarnings += element.fieldValue
        });
        res.runPayrollVariableAllowances.forEach(element => {
          this.grossEarnings += element.fieldValue
        });
        res.runPayrollFlexiBenefits.forEach(element => {
          this.grossEarnings += element.fieldValue
        });


        res.runPayrollFixedDeductions.forEach(element => {
          this.grossDeductions += element.fieldValue
        });
        res.runPayrollEmployeeDeductions.forEach(element => {
          this.grossDeductions += element.totalAmount
        });
        res.runPayrollVariableDeductions.forEach(element => {
          this.grossDeductions += element.fieldValue
        });
        this.grossDeductions += res.totalTDS; 
      },
      err => {
      },
      () => { });

  }


}

export interface Element {
  runPayrollEmployeeStatusId: number;
  empCode: string;
  empName: string;
  emailId: string;
  designation: string;
  panNo: string;
  ifscCode: string;
  bankName: string;
  accountNumber: string;
  empJoiningDate: any;
  payrollDate: any;
  payrollStatus: string;
  uanNumber: string;
  pfNumber: string;
  esicNumber: string;
  city: string;
  state: string;
  payslipDoc: string;
  totalWorkDaysInMonth: number;
  totalWorkingDays: number;
  totalLopDays: number;
  totalPayableDays: number;
  runPayrollFixedAllowances: any;
  totalFixedAllowanceAmount: number;
  runPayrollFixedDeductions: any;
  totalFixedDeductionAmount: number;
  runPayrollVariableAllowances: any;
  totalVariableAllowanceAmount: number;
  runPayrollVariableDeductions: any;
  totalVariableDeductionAmount: number;
  runPayrollEmployeeDeductions: any;
  totalEmployeeDeductionAmount: number;
  incomeTaxOverwrite: number;
  professionalTaxOverwrite: number;
  arrears: number;
  totalGrossSalary: number;
  totalNetPaymentAmount: number;
  plCount: string;
  clCount: string;
  weekoff: string;
  holiday: string;
}

