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
import { validateConfig } from '@angular/router/src/config';
import { ApiCommonService } from '../../../services/api-common.service';
import { Router } from '@angular/router';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-payslips',
  templateUrl: './payslips.component.html',
  styleUrls: ['./payslips.component.scss']
})
export class PayslipsComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  // , 'bulkAction'
  displayedColumns = ['payrollRunPeriod', 'totalPublishEmpCount', 'totalUnPublishEmpCount', 'action'];

  dataSource = new MatTableDataSource<Element>();

  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  showHideAllowanceExemptionField: any;
  showhideExemptionLimit: any;

  monthlyPayslipHistoryList = [];
  monthList = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  year: number;
  month: string;
  columns = [
    { field: 'payrollRunPeriod', header: 'Month-Year' },
    { field: 'totalPublishEmpCount', header: 'Total Payslips Published' },
    { field: 'totalUnPublishEmpCount', header: 'Total Payslips Un-Published' },
    { field: 'payslipGenerationStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' }
  ]
  public allowanceInformationForm: FormGroup;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService,
    private http: Http, private router: Router) {
    this.getAllMonthPayslipHistory();
    var rolesArr = KeycloakService.getUserRole();
    console.log('Has role---------------' + JSON.stringify(rolesArr));
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

  getAllMonthPayslipHistory() {
    console.log('Enter to take the List Of All Month Payslips Record');
    this.monthlyPayslipHistoryList = [];
    this.serviceApi.get('/v1/payroll/payslips/getAllPayslips/').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // const date: string = element.payrollRunPeriod;
            const monthYear = element.monthYear.split('-');
            this.year = monthYear[1];
            this.month = monthYear[0];
            this.monthlyPayslipHistoryList.push({
              payrollRunPeriod: element.monthYear,
              totalPublishEmpCount: element.publishedCount,
              totalUnPublishEmpCount: element.unpublishedCount,
              payslipGenerationStatus: element.payslipGenerationStatus,
              month: this.month,
              year: this.year,
            });
          });
          this.dataSource = new MatTableDataSource<Element>(this.monthlyPayslipHistoryList);
        }
      }, err => {

      }, () => {
        this.dt.reset();
      });
  }
  setPanel() {
  }


  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  viewPayslipsDetail(data: any) {
    console.log('data -->');
    console.log(data);
    this.router.navigate(['/payroll/view-Payslip/' + data.month + '/' + data.year]);
  }

  publishPayslipsDetail(data: any) {
      this.router.navigate(['/payroll/publish-Payslip/' + data.month + '/' + data.year]);
  }

  unPublishPayslipsDetail(data: any) {
      this.router.navigate(['/payroll/unpublish-Payslips/' + data.month + '/' + data.year]);
  }




  generatePayroll(data: any) {
      console.log('Employee On Delete-->' + data);
      const dialogRef = this.dialog.open(GeneratePayslipComponent, {
        width: '600px',
        // data: { payslipActionId: data.payslipActionId }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }
}



// ---------------- Generate Payroll By Clicking Generate Payroll model start ------------------------
@Component({
  templateUrl: 'generate-payslip-dialog-component.html',
  styleUrls: ['payslip-dialog-model.scss']
})
export class GeneratePayslipComponent implements OnInit {

  hideShowDivForSpecificEemployee: any;
  showHideEmployeesTypeSelectField: any;
  myControl = new FormControl();

  groupByList = [
    { value: 'Payslips', viewValue: 'Payslips' },
    { value: 'Detailed Payslips', viewValue: 'Detailed Payslips' },
    { value: 'Tax Payslips', viewValue: 'Tax Payslips' }
  ];

  selectEmployeeForPayroll = new FormControl();

  options = [
    { value: 'Anand Kumar', viewValue: 'Anand Kumar' },
    { value: 'Dheeraj Kumar', viewValue: 'Dheeraj Kumar' },
    { value: 'Bhaskar Kumar', viewValue: 'Bhaskar Kumar' },
    { value: 'Omender Singh', viewValue: 'Omender Singh' }
  ];
  date: any;
  optionsData = this.options;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<GeneratePayslipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);

    this.date = new Date();
  }

  ngOnInit() {
  }

  onDelete(value: any) {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.payslipActionId);
    const val = this.data.payslipActionId;
    console.log('>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<< ' + val);
  }


  clickradioforallemployee() {
    this.hideShowDivForSpecificEemployee = false;
  }

  searchGratuityComponents(data: any) {
    console.log('my method called' + data);
    this.optionsData = this.options.filter(option =>
      option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  }

  /*****below method call click on specific radio button***** */


  fospecificeEmployee() {
    this.hideShowDivForSpecificEemployee = true;
  }
  /*****above code clossed here***** */
  onNoClick(): void {
    this.dialogRef.close();
  }

  changeGroupType(data: any) {
    console.log('Enter for Generate Run Payroll ' + data.value);
    if (data.value === 'Employees') {
      this.showHideEmployeesTypeSelectField = true;
    } else {
      this.showHideEmployeesTypeSelectField = false;
      this.hideShowDivForSpecificEemployee = false;
    }
  }
}

export interface Element {
  payrollRunPeriod: string;
  totalPublishEmpCount: string;
  totalUnPublishEmpCount: string;
  approvalStatus: string;
  action: string;
  bulkAction: number;
}
// const ELEMENT_DATA: Element[] = [
//   {
//     timePeriod: 'January-2018',
//     noOfPayslipPublished: 0,
//     noOfPayslipUnpublished: 18,
//     payslipActionId: 1
//   },
//   {
//     timePeriod: 'December-2017',
//     noOfPayslipPublished: 16,
//     noOfPayslipUnpublished: 10,
//     payslipActionId: 2
//   }
// ];

