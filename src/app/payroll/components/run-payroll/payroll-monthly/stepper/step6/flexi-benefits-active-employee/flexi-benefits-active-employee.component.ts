import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
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
import { RunPayroll } from '../../../../../../service/run-payroll.service';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { UploadFileService } from '../../../../../../../services/UploadFileService.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../../../../../environments/environment';
import { element } from '@angular/core/src/render3/instructions';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-flexi-benefits-active-employee',
  templateUrl: './flexi-benefits-active-employee.component.html',
  styleUrls: ['./flexi-benefits-active-employee.component.scss']
})
export class FlexiBenefitsActiveEmployeeComponent implements OnInit {

  // @Input() public uploadVariablePaysEmployeeList;

  @Input() runPayrollId: any;
  @Output() messageEvent = new EventEmitter();

  @ViewChild("dt1") dt: DataTable;
  // dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  // displayedColumns = ['employeeCode', 'employeeName', 'eligibiltyCurrentCycle',
  // 'paidViaOffcycle', 'additionalAmount', 'taxablePaidAmt', 'recordId'];
  // selection = new SelectionModel<Element>(true, []);
  // showHideFilter: any;
  // actionSelected = new FormControl();
  // /* location  start*/
  // myControl = new FormControl();
  // selectedWorkLocation = new FormControl();
  // options = [
  //   { value: 'noida', viewValue: 'Noida' },
  //   { value: 'delhi', viewValue: 'Delhi' },
  //   { value: 'agara', viewValue: 'Agara' },
  //   { value: 'mumbai', viewValue: 'Mumbai' }
  // ];
  // optionsData = this.options;
  // /* location  end*/



  // /* year  start*/
  // myControlYear = new FormControl();
  // selectedYear = new FormControl();
  // years = [
  //   { value: 'January', viewValue: 'January' },
  //   { value: 'February', viewValue: 'February' },
  //   { value: 'March', viewValue: 'March' },
  //   { value: 'April', viewValue: 'April' },
  //   { value: 'May', viewValue: ' May' },
  //   { value: 'June', viewValue: ' June' },
  //   { value: 'July', viewValue: ' July' },
  //   { value: 'August', viewValue: ' August' },
  //   { value: 'September', viewValue: ' September' },
  //   { value: 'October', viewValue: ' October' },
  //   { value: 'November', viewValue: ' November' },
  //   { value: 'December', viewValue: 'December' },
  // ];
  // yearsData = this.years;
  // /* year  end*/



  // /* employee status  start*/
  // myControlEmployeeStatus = new FormControl();
  // selectedEmployeeStatus = new FormControl();
  // status = [
  //   { value: 'Incomplete', viewValue: 'Incomplete' },
  //   { value: 'Active', viewValue: 'Active' },
  //   { value: 'OnHold', viewValue: 'OnHold' },
  //   { value: 'Terminated', viewValue: 'Terminated' }
  // ];
  // statusData = this.status;
  // /* employee status   end*/


  // /* Cost Cetnter start*/
  // myControlCostCenter = new FormControl();
  // selectedCostCenter = new FormControl();

  // costCenters = [
  //   { value: 'Finance', viewValue: 'Finance' },
  //   { value: 'Accounts', viewValue: 'Accounts' },
  //   { value: 'Marketing', viewValue: 'Marketing' },
  //   { value: 'Sales', viewValue: 'Sales' },
  //   { value: 'HR', viewValue: 'HR' }
  // ];
  // costCenterData = this.costCenters;
  // /* Cost Cetnter status   end*/

  columns = [
    { field: 'empCode', header: 'Employee Code' },
    { field: 'empName', header: 'Employee Name' },
    { field: 'totalAmount', header: 'Total Flexi Benifit' },
    // { field: 'totalVariableDedAmnt', header: 'Total Variable Deductions' },
    { field: 'actions', header: 'Actions' },
  ];
  selectedRows: any = [];
  flexiBenifitList = [];
  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private http: Http, private runPayroll: RunPayroll, private serviceApi: ApiCommonService, private router: Router) {
  }

  ngOnInit() {
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

  getAllFlexiBenifits() {
    this.flexiBenifitList = [];
    this.serviceApi.get("/v1/payroll/runPayroll/get-all/flexi-benefits/" + this.runPayrollId).subscribe(res => {
      this.flexiBenifitList = res;
      this.dt.reset();
    }, (err) => {

    }, () => {

    })

  }


  // /*****below method call when select multple location***** */
  // searchLocation(data: any) {
  //   console.log('my method called' + data);
  //   this.optionsData = this.options.filter(option =>
  //     option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  // }

  // selectLocation() {
  //   console.log('selected Employee called');
  //   this.variableAllowanceForm.controls.workLocations.setValue(this.selectedWorkLocation.value);
  // }
  // /*****multiple location clossed here***** */


  // /*****below method call when select multple years***** */
  // searchYear(data: any) {
  //   console.log('my method called' + data);
  //   this.yearsData = this.years.filter(option =>
  //     option.value.toLowerCase().indexOf(this.myControlYear.value.toLowerCase()) === 0);
  // }

  // selectYear() {
  //   console.log('selected Employee called');

  //   this.variableAllowanceForm.controls.workLocations.setValue(this.selectedYear.value);
  // }
  // /*****multiple years clossed here***** */



  // /*****below method call when select employee status ***** */
  // searchEmployeeStatus(data: any) {
  //   console.log('searchEmployeeStatus called' + data);
  //   this.statusData = this.status.filter(option =>
  //     option.value.toLowerCase().indexOf(this.myControlEmployeeStatus.value.toLowerCase()) === 0);
  // }

  // selectEmployeeStatus() {
  //   console.log('selected Employee called');
  //   this.variableAllowanceForm.controls.employeeStatus.setValue(this.selectedEmployeeStatus.value);
  // }
  // /****employee status  clossed here***** */



  // /*****below method call when select cost center ***** */
  // searchCostCenter(data: any) {
  //   console.log('my method called' + data);
  //   this.costCenterData = this.costCenters.filter(option =>
  //     option.value.toLowerCase().indexOf(this.myControlCostCenter.value.toLowerCase()) === 0);
  // }

  // selectCostCenter() {
  //   console.log('selected Employee called');

  //   this.variableAllowanceForm.controls.costCenter.setValue(this.selectedCostCenter.value);
  // }
  // /****employee status  clossed here***** */

  // applyFilter(filterValue: string) {
  //   console.log('hello' + filterValue);
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }
  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }

  cancel() {
    this.runPayroll.changeData(1);
    this.router.navigate(['/payroll/run-payroll']);
  }
  onBack() {
    let currentStep;
    this.runPayroll.currentStep.subscribe(step => currentStep = step);
    this.runPayroll.changeData(--currentStep);
    this.messageEvent.emit('previous-' + currentStep);
  }


  onProceed() {
    this.serviceApi.put("/v1/payroll/runPayroll/save/flexi-benefit/" + this.runPayrollId, this.flexiBenifitList).subscribe(
      res => {
        let currentStep;
        this.runPayroll.currentStep.subscribe(step => currentStep = step);
        this.runPayroll.changeData(++currentStep);
        this.messageEvent.emit('continue-' + currentStep);
      }, (err) => {

      }, () => {

      })
  }

  onNoClick(): void {
  }

  // onClickReimbursableAmountDialog(data: any) {
  //   console.log('Employee On Delete-->' + data);
  //   const dialogRef = this.dialog.open(RunPayrollReimbursableRecordActiveEmpComponent, {
  //     width: '700px',
  //     // data: { actionId: data.actionId }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }


  updateBenifits(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(FlexiBenifitsRunPayrollActiveEmpComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { event: event, runPayrollId: this.runPayrollId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.flexiBenifitList.forEach(element => {
              if (element.empCode == result.empCode) {
                element.benefitsList = result.message.benifits;
              }
            });
            this.flexiBenifitList.forEach(element => {
              if (element.empCode == result.empCode) {
                var totalAmount = 0;
                element.benefitsList.forEach(element => {
                  totalAmount += element.value;
                });
                element.totalAmount = totalAmount;
              }
            });

          }
          // this.successNotification(result.message);
          else if (result.status === 'Error') {
          }
        }
      }
    });
  }

  uploadBenifits() {
    const dialogRef = this.dialog.open(UploadDataRunPayrollFlexiBenifitsActiveEmpComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { runPayrollId: this.runPayrollId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.getAllFlexiBenifits();
          }
          // this.successNotification(result.message);
          else if (result.status === 'Error') {
          }
        }
      }
    });
  }

}


@Component({
  templateUrl: 'upload-data-flexi-benifits-component.html',
  styleUrls: ['dialog-model.scss']
})
export class UploadDataRunPayrollFlexiBenifitsActiveEmpComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFilesName: string;
  message: any;
  notificationMsg: any;
  action: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadDataRunPayrollFlexiBenifitsActiveEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private uploadService: UploadFileService) {
    console.log('data-->' + data);
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

  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  downloadFormat() {
    this.serviceApi.get("/v1/payroll/runPayroll/flexi-sheet/" + this.data.runPayrollId).subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.url);
    })

  }

  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/payroll/runPayroll/upload/flexi-sheet/' + this.data.runPayrollId;

    this.uploadService.pushFileToStorage(this.currentFileUpload, url).subscribe(event => {
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        if (event != null) {
          this.message = "Flexi Benefits Uploaded Successfully";
          this.action = 'Response';
          this.close();
        }
      }
    },
      err => {
        console.log('error :::' + err);
      }, () => {

      }
    );
  }

  uploadFormat() {
    $('#uploadFile').click();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
    // console.log(this.selectedFiles.item(0).name);
  }
}


@Component({
  templateUrl: 'addEdit-runPayroll-flexi-benifits-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class FlexiBenifitsRunPayrollActiveEmpComponent implements OnInit {
  flexiBenifitsForm: FormGroup;
  dynamicFileds = [];
  i = 0;
  action: any;
  error: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<FlexiBenifitsRunPayrollActiveEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
    this.flexiBenifitsForm = this.fb.group({
      runPayrollId: [this.data.runPayrollId],
      benifits: this.fb.array([])
    });
    let benefitsListLength = this.data.event.benefitsList.length - 1;
    while (benefitsListLength >= 0) {
      this.getVariableAllowanceFormArray();
      benefitsListLength--;
    }
    this.flexiBenifitsForm.controls.benifits.patchValue(this.data.event.benefitsList);

  }

  getVariableAllowanceFormArray() {
    let control = <FormArray>this.flexiBenifitsForm.controls.benifits;
    control.push(this.fb.group({
      runPayrollFlexiId: [''],
      flexiBenefitId: [''],
      labelName: [''],
      value: ['', Validators.required]
    }));
  }

  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate() {
    if (!this.flexiBenifitsForm.valid) {
      return;
    }
    this.action = 'Response';
    this.error = this.flexiBenifitsForm.value;
    this.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.data.empCode = this.data.event.empCode;
    this.dialogRef.close(this.data);

  }
}


// ---------------- Start Of Process Offcycle Payements Upload Dailog Model
@Component({
  templateUrl: 'reimbursable-records-dialog.html',
  styleUrls: ['dialog-model.scss']
})
export class RunPayrollReimbursableRecordActiveEmpComponent implements OnInit {

  displayedColumns = ['category', 'eligibleAmount', 'reimbursableAmount'];
  dataSource = new MatTableDataSource(ELEMENT_DATA_DIALOG);

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<RunPayrollReimbursableRecordActiveEmpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


export interface ReimbursableAmountDialogElement {
  reimbursementRecordId: number;
  category: string;
  eligibleAmount: number;
  reimbursableAmount: number;
}
const ELEMENT_DATA_DIALOG: ReimbursableAmountDialogElement[] = [
  // {reimbursementRecordId: 1, category: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'}
];


export interface Element {
  recordId: string;
  employeeCode: string;
  employeeName: string;
  eligibiltyCurrentCycle: string;
  paidViaOffcycle: string;
  additionalAmount: string;
  taxablePaidAmt: string;
  joiningDate: string;
  totalVariableAllowance: string;
  totalVariableDeduction: string;
  reimburableAmount: string;
}

