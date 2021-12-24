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
import { OffcycleDataServiceService, Element } from '../../../../../../service/offcycle-data-service.service';
import { ApiCommonService } from '../../../../../../../services/api-common.service';

@Component({
  selector: 'app-offcycle-pay-upload-variable-pays',
  templateUrl: './offcycle-pay-upload-variable-pays.component.html',
  styleUrls: ['./offcycle-pay-upload-variable-pays.component.scss']
})
export class OffcyclePayUploadVariablePaysComponent implements OnInit, AfterViewInit {

  @Input() public uploadVariablePaysEmployeeList;

  public variableAllowanceForm: FormGroup;
  displayedColumns = ['select', 'empCode', 'empName', 'totalVariableAllowance', 'totalVariableDedcuntion',
    'empPayrollOffcycleRecord'];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  showHideFilter: any;
  currentData: Element[];
  actionSelected = new FormControl();
  /* location  start*/
  myControl = new FormControl();
  selectedWorkLocation = new FormControl();

  pendingEmployeeList = [];
  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService,
    private http: Http, private offcycleData: OffcycleDataServiceService) {

    // this.offcycleData.currentData.subscribe(message =>
    //   this.currentData = message);
    // this.dataSource = new MatTableDataSource<Element>(this.currentData);

    console.log('this.currentData -->' + JSON.stringify(this.currentData));
    // dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    this.getPendingEmployees();
  }

  ngOnInit() {
  }

  getPendingEmployees() {
    console.log('Enter in the Get Function of Pending Employees');
    this.serviceApi.get('/v1/payroll/processoffcyclepayments/employees/' + 'pending').subscribe(
      res => {
        if (res != null) {
          res.forEach(element1 => {
            this.pendingEmployeeList.push({
              empPayrollOffcycleRecord: element1.empPayrollOffcycleRecord,
              empCode: element1.empCode,
              empName: element1.empName,
              empJoiningDate: element1.empJoiningDate,
              empProcessOffcycleStatus: element1.empProcessOffcycleStatus,
              empOffcycleVarAllowances: element1.empOffcycleVarAllowances,
              empOffcyleVarDeductions: element1.empOffcyleVarDeductions,
              totalRReimbursableAmount: element1.totalRReimbursableAmount,
              totalVariableAllowance:  element1.totalVariableAllowance,
              totalVariableDedcuntion:  element1.totalVariableDedcuntion,
            });
          });
          this.dataSource = new MatTableDataSource(this.pendingEmployeeList);
        }
      }, err => {

      }, () => {

      }
    );

  }

  ngAfterViewInit() {
    console.log('Data From NgAfterView uploadVariablePaysEmployeeList -->' +
      this.uploadVariablePaysEmployeeList.value);
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

  onNoClick(): void {
  }

  onProceed() {
    console.log('Value from First Form >>> ' + this.uploadVariablePaysEmployeeList.value);
    console.log('employeeList -->' + JSON.stringify(this.uploadVariablePaysEmployeeList.value));
  }

  onClickEditVariablePaysDialog(element: any) {
    console.log('Employee On Delete-->' + element);
    const dialogRef = this.dialog.open(VariablePaysOffcyclePayementsComponent, {
      width: '650px',
      height: '500px',
      data: { data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  clickOnSelectActionFun() {
    console.log('Employee On Upoad-->' + this.actionSelected.value);
    if (this.actionSelected.value === 'addVariablePayments') {
      console.log('Enter in the AddVariable Payement Function In Action Chooser');
      const dialogRef = this.dialog.open(VariablePaysOffcyclePayementsComponent, {
        width: '700px',
        height: '500px',
        // data: { actionId: data.actionId }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else if (this.actionSelected.value === 'uploadVariablePayments') {

      console.log('Enter in the Upload Variables Pays Function');
      const dialogRef = this.dialog.open(UploadDataOffcycleVariablePayComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        // data: { actionId: data.actionId }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });

    } else if (this.actionSelected.value === 'clearVariablePayments') {
      console.log('Enter in the Clear Function');
      console.log('Enter in the AddVariable Payement Function In Action Chooser');
      const dialogRef = this.dialog.open(ClearVariablePaysOffcyclePayementsComponent, {
        width: '700px',
        height: '500px',
        // data: { actionId: data.actionId }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else {
      console.log('Something gone Wrong For Action Function');
    }

  }

}

// ---------------- Process Offcycycle Variable Payements Add And Edit Section which get Dynamic Value ------------------------
@Component({
  templateUrl: 'addEdit-offcycle-variable-pays-dialog.html',
  styleUrls: ['process-Offcycle-dialog-model.scss']
})
export class VariablePaysOffcyclePayementsComponent implements OnInit {

  offcycleVariablePaysForm: FormGroup;
  dynamicFileds = [];

  variableAllwanceFieldList = [];
  variableDeductionFieldList = [];
  i = 0;
  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VariablePaysOffcyclePayementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any, private serviceApi: ApiCommonService) {

    console.log(JSON.stringify(data1));

    this.offcycleVariablePaysForm = this.fb.group({
      empPayrollOffcycleRecord: [data1.data.empPayrollOffcycleRecord],
      empCode: [data1.data.empCode],
      empName: [data1.data.empName],
      empJoiningDate: [data1.data.empJoiningDate],
      fieldMaster: this.fb.array([
      ]),
      fieldMaster1: this.fb.array([
      ])
    });
    this.getVariableAllowances();
    this.getVariableDeductions();


 
  }

  ngOnInit() {

  }

  getVariableAllowances() {
    console.log('Enter to get Variable Allowance Fields');
    this.serviceApi.get('/v1/payroll/settings/allowances/variable').subscribe(
      res => {
        console.log(JSON.stringify(res));
        res.forEach(element => {
          this.variableAllwanceFieldList.push({
            allowanceId: element.allowanceId,
            allowanceName: element.allowanceName,
            variableAllowanceAmount: element.variableAllowanceAmount
          });
        });
      }, err => {
        console.log('Enter in the Error Block');
      },
      () => {
        const control = <FormArray>this.offcycleVariablePaysForm.controls['fieldMaster'];
        this.variableAllwanceFieldList.forEach(element => {
          control.push(
            this.fb.group({
              fieldId: [element.allowanceId],
              fieldName: [element.allowanceName],
              fieldPlaceholderValue: ['Please Enter Value'],
              variableAllowanceAmount: [element.variableAllowanceAmount]
            })
          );
        });
      }
    );
  }

  getVariableDeductions() {
    console.log('Enter to get Variable Allowance Fields');
    this.serviceApi.get('/v1/payroll/settings/deductions/variable').subscribe(
      res => {
        console.log(JSON.stringify(res));
        res.forEach(element => {
          this.variableDeductionFieldList.push({
            deductionId: element.deductionId,
            deductionName: element.deductionName,
            variableDeductionAmount: element.variableDeductionAmount
          });
        });
      }, err => {
        console.log('Enter in the Error Block');
      }, () => {
        const control = <FormArray>this.offcycleVariablePaysForm.controls['fieldMaster1'];
        this.variableDeductionFieldList.forEach(element => {
          control.push(
            this.fb.group({
              fieldId: [element.deductionId],
              fieldName: [element.deductionName],
              fieldPlaceholderValue: ['Please Enter Value'],
              variableDeductionAmount: [element.variableDeductionAmount]
            })
          );
        });
      });
  }

  get fieldMaster(): FormArray {
    return this.offcycleVariablePaysForm.get('fieldMaster') as FormArray;
  }

  get fieldMaster1(): FormArray {
    return this.offcycleVariablePaysForm.get('fieldMaster1') as FormArray;
  }

  



  onNoClick(): void {
    this.dialogRef.close();
  }



}
// ---------------- End of Process Offcycycle Variable Payements Add And Edit Section which get Dynamic Value ------------------------


// ---------------- Clear Process Offcycycle Variable Payements Add And Edit Section which get Dynamic Value ------------------------
@Component({
  templateUrl: 'clear-offcycle-variable-pays-dialog.html',
  styleUrls: ['process-Offcycle-dialog-model.scss']
})
export class ClearVariablePaysOffcyclePayementsComponent implements OnInit {

  offcycleVariablePaysForm: FormGroup;
  dynamicFileds = [];
  i = 0;
  constructor(private http: Http,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClearVariablePaysOffcyclePayementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any) {
    console.log('data-->' + data1);
    this.offcycleVariablePaysForm = this.fb.group({
      fieldMaster: this.fb.array([
      ])
    });

    const headers = new Headers({
      // 'Authorization': 'Bearer ' + bearerData,
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({ headers: headers });
    // const body = new URLSearchParams();
    //    this.http.get(this.baseUrl + '/v1/organization/employeefields/section', options).subscribe(
    this.http.get('assets/data/processPayroll/customFields.json', options).map(res => res.json()).subscribe(
      // tslint:disable-next-line:max-line-length
      // this.http.get(this.baseUrl + '/v1/organization/allFieldBySectionName/Basic Information', options).subscribe(
      res => {
        console.log('res -->' + res);
        res.forEach(element1 => {
          console.log('element -->' + element1);
          this.dynamicFileds.push(element1);
        });
        this.dynamicFileds.forEach(data => {
          console.log('sectionName -->' + data.sectionName);
          if (data.employeeProfileLocation === 'Variable Pays') {
            const control = <FormArray>this.offcycleVariablePaysForm.controls['fieldMaster'];
            control.push(
              this.fb.group({
                sectionId: [data.sectionId],
                sectionName: [data.sectionName],
                sectionLocation: [data.employeeProfileLocation],
                accessLevel: [data.accessLevel],
                editable: [false],
                fields: this.fb.array([
                ]),
              })
            );
            data.fields.forEach(fieldsData => {
              this.initFieldMaster(this.i, fieldsData);
            });
            this.i++;
          }
        });
      },
      error => {
        console.log('err -->' + error);
      }
    );
  }

  get fieldMaster(): FormArray {
    return this.offcycleVariablePaysForm.get('fieldMaster') as FormArray;
  }

  initFieldMaster(i: any, fieldsData: any) {
    console.log('i-->' + i);
    console.log('fieldName -->' + fieldsData.fieldName);
    const control = (<FormArray>this.offcycleVariablePaysForm.controls['fieldMaster']).at(i).get('fields') as FormArray;
    control.push(
      this.fb.group({
        fieldId: [fieldsData.fieldId],
        fieldName: [fieldsData.fieldName],
        fieldPlaceholderValue: ['Enter Text'],
        fieldValue: [fieldsData.fieldValue],
        fieldDescription: [fieldsData.fieldDescription],
        fieldType: [fieldsData.fieldType],
        accessLevel: [fieldsData.accessLevel],
        includeInOnboarding: [fieldsData.includeInOnboarding],
        default: [fieldsData.default],
        sensitive: [fieldsData.sensitive],
        options: [fieldsData.options],
        mandatory: [fieldsData.mandatory],
      })
    );

  }


  ngOnInit() {

  }




  onNoClick(): void {
    this.dialogRef.close();
  }



}
// ---------------- End of Clear Process Offcycycle Variable Payements Add And Edit Section which get Dynamic Value ------------------------



// ---------------- Start Of Process Offcycle Payements Upload Dailog Model
@Component({
  templateUrl: 'upload-data-variable-pay-component.html',
  styleUrls: ['dialog-model.scss']
})
export class UploadDataOffcycleVariablePayComponent implements OnInit {

  fileToUpload: File = null;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadDataOffcycleVariablePayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
// ---------------- End Of Process Offcycle Payements Upload Dialog Model


// const ELEMENT_DATA: Element[] = [
//   {
//     recordId: '0',
//     employeeCode: '1138',
//     employeeName: 'Anand Kumar',
//     joiningDate: '22-09-2017',
//     totalVariableAllowance: '0',
//     totalVariableDeduction: '0'

//   },
//   {
//     recordId: '1',
//     employeeCode: '1122',
//     employeeName: 'Dheeraj Chaudhary',
//     joiningDate: '22-02-2016',
//     totalVariableAllowance: '0',
//     totalVariableDeduction: '0'
//   },
//   {
//     recordId: '2',
//     employeeCode: '1115',
//     employeeName: 'Zeeshan Siddiqui',
//     joiningDate: '25-01-2014',
//     totalVariableAllowance: '0',
//     totalVariableDeduction: '0'
//   }
// ];
