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
import { ActivatedRoute } from '@angular/router';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-view-pay-slip',
  templateUrl: './view-pay-slip.component.html',
  styleUrls: ['./view-pay-slip.component.scss']
})
export class ViewPaySlipComponent implements OnInit, AfterViewInit {
  showHideFilter = false;
  ELEMENT_DATA = [];
  public variableAllowanceForm: FormGroup;
  // 'payslip', 'taxPayslip', 'fnfPayslip'
  displayedColumns = ['empName', 'detailedPayslip'];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);


  /* location  start*/
  myControl = new FormControl();
  selectedWorkLocation = new FormControl();
  options = [];
  optionsData = this.options;
  /* location  end*/

  @ViewChild("dt1") dt: DataTable;

  /* year  start*/
  myControlYear = new FormControl();
  selectedYear = new FormControl();
  years = [
    { value: 'January', viewValue: 'January' },
    { value: 'February', viewValue: 'February' },
    { value: 'March', viewValue: 'March' },
    { value: 'April', viewValue: 'April' },
    { value: 'May', viewValue: ' May' },
    { value: 'June', viewValue: ' June' },
    { value: 'July', viewValue: ' July' },
    { value: 'August', viewValue: ' August' },
    { value: 'September', viewValue: ' September' },
    { value: 'October', viewValue: ' October' },
    { value: 'November', viewValue: ' November' },
    { value: 'December', viewValue: 'December' },
  ];
  yearsData = this.years;
  /* year  end*/



  /* employee status  start*/
  myControlEmployeeStatus = new FormControl();
  selectedEmployeeStatus = new FormControl();
  status = [
    { value: 'Incomplete', viewValue: 'Incomplete' },
    { value: 'Active', viewValue: 'Active' },
    { value: 'OnHold', viewValue: 'OnHold' },
    { value: 'Terminated', viewValue: 'Terminated' }
  ];
  statusData = this.status;
  /* employee status   end*/


  /* Cost Cetnter start*/
  myControlCostCenter = new FormControl();
  selectedCostCenter = new FormControl();
  costCenters = [
    { value: 'Finance', viewValue: 'Finance' },
    { value: 'Accounts', viewValue: 'Accounts' },
    { value: 'Marketing', viewValue: 'Marketing' },
    { value: 'Sales', viewValue: 'Sales' },
    { value: 'HR', viewValue: 'HR' }
  ];
  costCenterData = this.costCenters;
  /* Cost Cetnter status   end*/
  columns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'actions', header: 'Detailed Payslip' }
  ]
  employeePayslipRecordList = [];
  year: number;
  month: string;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http,
    private route: ActivatedRoute, private serviceApi: ApiCommonService, private router: Router) {
    this.route.params.subscribe(res => {
      this.month = res.month;
      this.year = res.year;
      console.log('year -->' + this.year);
      console.log('month -->' + this.month);
    });

    this.getAllEmpPayslipDetailsByMonthYear();
  }

  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  getAllEmpPayslipDetailsByMonthYear() {
    console.log('Enter to Fetch the Data For the Specific Month');
    this.employeePayslipRecordList = [];
    const viewStatus = 'VIEW';
    this.serviceApi.get('/v1/payroll/payslips/getAllPayslipsForMonth/' + this.month + '-' + +this.year)
      .subscribe(
        res => {
          if (res != null) {
            res.forEach(element => {
              this.employeePayslipRecordList.push({
                payslipPublishStatus: element.payslipPublished,
                empCode: element.empCode,
                empName: element.empName,
                payslipDoc: element.payslipDoc
              });
            });
            this.dataSource = new MatTableDataSource<Element>(this.employeePayslipRecordList);
          }
        }, err => {

        }, () => {
          this.dt.reset();
        });
  }

  viewDetailsPayslip(data: any) {
    const empCode = data.empCode;
    const payslipRecordId = data.runPayrollEmployeeStatusId;
    // this.router.navigate(['/payroll/view-Payslip/employee/' + empCode ]);
    this.router.navigate(['/payroll/detailed-Payslip/employee/' + this.month + '/' + this.year
      + '/' + empCode]);
  }



  downloadDetailsPayslip(element:any) {
    // this.serviceApi.get('/v1/payroll/payslip/'+ element.empCode + '/' + element.runPayrollEmployeeStatusId, null).subscribe(
    //   res => {
    //     // let b: any = new Blob([res], { type: 'application/pdf' });
    //     console.log('res ==>');
    //     console.log(res);
        if (element.payslipDoc !== null) {
          window.open(element.payslipDoc);
        }else
          console.error("Payslip not generated yet.");
        // console.log('start download:', res);
    //     var url = window.URL.createObjectURL(b);
    //     const a = document.createElement('a');
    //     document.body.appendChild(a);
    //     a.setAttribute('style', 'display: none');
    //     a.href = url;
    //     a.download = "Salary_Slip_" + element.empCode;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove(); // remove the element

    //   },
    //   err => {
    //     console.log('download error:', JSON.stringify(err));
    //   },
    //   () => {
    //     console.log('Generate PDF Execute Successfully');
    //   }
    // );
  }
  /*****below method call when select multple location***** */
  searchLocation(data: any) {
    console.log('my method called location called -->' + data.key);
    this.optionsData = this.options.filter(option =>
      option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);

  }



  /*****below method call when select cost center ***** */
  searchCostCenter(data: any) {
    console.log('my method called' + data);
    this.costCenterData = this.costCenters.filter(option =>
      option.value.toLowerCase().indexOf(this.myControlCostCenter.value.toLowerCase()) === 0);
  }

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
  incomeTaxOverwrite: number;
  professionalTaxOverwrite: number;
  arrears: number;
  totalGrossSalary: number;
  totalNetPaymentAmount: number;
}
