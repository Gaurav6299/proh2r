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
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-un-publish-pay-slip',
  templateUrl: './un-publish-pay-slip.component.html',
  styleUrls: ['./un-publish-pay-slip.component.scss']
})
export class UnPublishPaySlipComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  displayedColumns = ['select', 'empCode', 'empName'];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  selectedRows = [];
  year: number;
  month: string;
  employeePayslipRecordList = [];
  notificationMsg: any;
  action: any;
  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' }
  ]
  constructor(private fb: FormBuilder, private http: Http, private route: ActivatedRoute,
    private serviceApi: ApiCommonService, public dialog: MatDialog) {
    this.route.params.subscribe(res => {
      this.month = res.month;
      this.year = res.year;
      console.log('year -->' + this.year);
      console.log('month -->' + this.month);
    });
    this.getAllEmpPayslipDetailsByMonthYear();
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
  }
  ngAfterViewInit() {

  }

  getAllEmpPayslipDetailsByMonthYear() {
    console.log('Enter to Fetch the Data For the Specific Month');
    this.employeePayslipRecordList = [];
    const publishStatus = 'Un_PUBLISH';
    this.serviceApi.get('/v1/payroll/payslips/getAllPayslipsForMonth/' + this.month + '-' + +this.year)
      .subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            if (element.payslipPublished) {
              this.employeePayslipRecordList.push({
                payslipPublishStatus: element.payslipPublished,
                empCode: element.empCode,
                empName: element.empName,
                payslipDoc: element.payslipDoc
              });
            }
          });
          this.dataSource = new MatTableDataSource<Element>(this.employeePayslipRecordList);
        }
      }, err => {

      }, () => {
        this.dt.reset();
      });
  }

  unPublishedPayslipFunction() {
    console.log(JSON.stringify(this.selectedRows));
    if (this.selectedRows.length == 0) {
      this.warningNotification('Select an employee first');
    } else {
      let empList = [];
      this.selectedRows.forEach(element => {
        empList.push(element.empCode);
      });
      const dialogRef = this.dialog.open(EmployeeUnPublishDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          empList: empList,
          monthYear: this.month + '-' + +this.year
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
          // tslint:disable-next-line:one-line
          this.getAllEmpPayslipDetailsByMonthYear();
        }
      });
    }
  }

  // unPublishedPayslipFunction() {
  //   console.log('Enter for Publish the Selected Date ');
  //   const body = this.selection.selected;
  //   const status = 'UN_PUBLISH';
  //   this.serviceApi.post('/v1/payroll/payslip/publish/' + status + '/', body)
  //     .subscribe(
  //     res => {
  //       if (res != null) {
  //         this.notificationMsg = res.message;
  //         this.successNotification(this.notificationMsg);
  //       }
  //     }, err => {
  //       this.notificationMsg = err.message;
  //       this.warningNotification(this.notificationMsg);
  //     });
  // }
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

@Component({
  templateUrl: 'employee-payslip-unpublish-dialog-component.html',
  styleUrls: ['./dialog.scss']
})
export class EmployeeUnPublishDialogComponent {

  dataValue: any;
  error = 'Error Message';
  action: any;
  empList: any;
  monthYear: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeUnPublishDialogComponent>,
    private apiCommonService: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
    this.empList = data.empList;
    this.monthYear = data.monthYear;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmUnPublishPayslip() {
    console.log('Enter for Publish the Selected Date ');
    const body = {
      "empCode": this.empList,
      "monthYear": this.monthYear,
      "status": "Unpublished"
    };
    const status = 'PUBLISH';
    this.apiCommonService.put('/v1/payroll/payslips/action/', body)
      .subscribe(
      res => {
        if (res != null) {
          console.log('Enter Successfully Makes Un Hold');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      });
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
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
