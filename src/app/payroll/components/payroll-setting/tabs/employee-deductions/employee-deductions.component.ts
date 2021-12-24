import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataSource } from '@angular/cdk/collections';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { FixedAllowancesComponent } from '../fixed-allowances/fixed-allowances.component';
import { read } from 'fs';

declare var $: any;

@Component({
  selector: 'app-employee-deductions',
  templateUrl: './employee-deductions.component.html',
  styleUrls: ['./employee-deductions.component.scss']
})
export class EmployeeDeductionsComponent implements OnInit, AfterViewInit {
  public employeeDeductionForm: FormGroup;
  isLeftVisible = false;
  Specific = false;
  Some = false;
  button = false;
  panelFirstWidth: any;
  panelFirstHeight: any;
  creteriaType: any;
  employeeDeductionTableList = [];

  myControl = new FormControl();
  selectedEmployee = new FormControl();

  EnterDeductions = [
    { value: 'AMOUNT', viewValue: 'Fixed Amount' },
    { value: 'PERCENTAGE', viewValue: 'Percentage' },
    { value: 'MANUALLY', viewValue: 'Manual' }
  ];


  fixedAllowanceList = [{
    value: -1,
    viewValue: 'CTC'
  }];
  selectedDependentVal = new FormControl();
  seletedDependentAllowance = [];
  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropdownField;
  notificationMsg: any;
  action: any;

  seletedFilterData = [];
  formHeader: any;

  displayedColumns = ['employeeDeductionName', 'action'];
  dataSource = new MatTableDataSource<DeductionsData>();

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


  constructor(public dialog: MatDialog, private _fb: FormBuilder, private http: Http,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.getAllEmployeeDeductionTableList();
    this.getAllDetailsForPayrollRunOn();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownField = message);
    const rolesArr = KeycloakService.getUserRole();
    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));
  }

  ngOnInit() {
    this.employeeDeductionForm = this._fb.group({
      employeeDeductionId: [],
      employeeDeductionName: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      criteria: ['', [Validators.required]],
      value: [''],
      dependentAllowanceList: []
    });
  }


  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }
  clickForSpecific() {
    this.Specific = true;
    this.Some = false;

  }

  selectDeductionType() {
    this.employeeDeductionForm.controls.value.setValue(null);
    this.employeeDeductionForm.controls.value.clearValidators();
    this.employeeDeductionForm.controls.value.updateValueAndValidity();
    if (this.employeeDeductionForm.controls.criteria.value === 'AMOUNT') {
      this.creteriaType = 'Amount';
      this.employeeDeductionForm.controls.dependentAllowanceList.clearValidators();
      this.employeeDeductionForm.controls.dependentAllowanceList.updateValueAndValidity();
      this.employeeDeductionForm.controls.value.setValidators([Validators.required]);
      // this.selectedDependentVal.clearValidators();
      // this.selectedDependentVal.updateValueAndValidity();
    }
    if (this.employeeDeductionForm.controls.criteria.value === 'MANUALLY') {
      this.creteriaType = 'MANUALLY';
      // this.employeeDeductionForm.controls.dependentAllowanceList.clearValidators();
      // this.employeeDeductionForm.controls.dependentAllowanceList.updateValueAndValidity();
      this.selectedDependentVal.clearValidators();
      this.selectedDependentVal.updateValueAndValidity();
    }
    if (this.employeeDeductionForm.controls.criteria.value === 'PERCENTAGE') {
      this.creteriaType = 'Percentage';
      this.employeeDeductionForm.controls.dependentAllowanceList.setValidators([Validators.required]);
      this.employeeDeductionForm.controls.value.setValidators([Validators.required]);
      this.selectedDependentVal.setValidators([Validators.required]);
    }
    this.employeeDeductionForm.controls.value.updateValueAndValidity();
  }

  selectDependentComponenet() {
    console.log(this.selectedDependentVal.value);
    const checkedList: number[] = this.selectedDependentVal.value;
    this.seletedDependentAllowance = this.fixedAllowanceList.map(function (value, index, array) {
      if (checkedList.includes(value.value)) {
        return value;
      }
    });
    // this.seletedDependentAllowance = this.fixedAllowanceList.map(function (value, index, array) {
    //   if (checkedList.includes(value.viewValue)) {
    //     return value.value;
    //   }
    // });
    this.seletedDependentAllowance = this.seletedDependentAllowance.filter(function (value, index, array) {
      if (value != null) {
        return true;
      } else {
        return false;
      }
    });
    this.seletedFilterData = [];
    const selectedDependentValue = [];
    for (let i = 0; i < this.seletedDependentAllowance.length; i++) {
      this.seletedFilterData.push({
        'dependentAllowanceValue': this.seletedDependentAllowance[i].value,
      });
      selectedDependentValue.push(this.seletedDependentAllowance[i].value);
    }
    this.selectedDependentVal.setValue(selectedDependentValue);
    this.employeeDeductionForm.controls.dependentAllowanceList.setValue(this.seletedFilterData);


  }

  clickForAll() {
    this.Some = false;
    this.Specific = false;
  }


  addDeductions() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.employeeDeductionForm.reset();
    this.selectedDependentVal.reset();
    this.formHeader = 'Add New Employee Deductions';
  }


  editEmployeeDeduction(element: any) {
    console.log('Enter in the Edit Section for the Employee Deduction Form');
    this.formHeader = 'Edit Employee Deductions';
    this.isLeftVisible = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.selectedDependentVal.reset();
    console.log(JSON.stringify(element));

    this.employeeDeductionForm.controls.employeeDeductionId.setValue(element.employeeDeductionId);
    this.employeeDeductionForm.controls.employeeDeductionName.setValue(element.employeeDeductionName, Validators.required);
    this.employeeDeductionForm.controls.criteria.setValue(element.criteria);
    this.employeeDeductionForm.controls.value.setValue(element.value);
    console.log(element.dependentAllowanceList);

    this.seletedFilterData = [];
    const dependentValueList = [];
    for (let i = 0; i < element.dependentAllowanceList.length; i++) {
      this.seletedFilterData.push({
        'dependentAllowanceValue': element.dependentAllowanceList[i].dependentAllowanceValue,
      });
      dependentValueList.push(element.dependentAllowanceList[i].dependentAllowanceValue);
    }
    this.selectedDependentVal.setValue(dependentValueList);
    this.employeeDeductionForm.controls.dependentAllowanceList.setValue(this.seletedFilterData);

    // this.fixedAllowanceList.map(function (value, index, array) {
    //   element.dependentAllowanceList.forEach(element1 => {
    //     if (element1.dependentAllowanceValue === value.value) {
    //       return value;
    //     }
    //   });
    // });


    // this.selectedDependentVal.setValue(this.seletedFilterData);
    // this.employeeDeductionForm.controls.dependentAllowanceList.setValue(this.seletedFilterData);
    // this.employeeDeductionForm.controls.dependentAllowanceList.setValue
    //   (
    //   this.fixedAllowanceList.map(res => {
    //     for (let i = 0; i < element.dependentAllowanceList.length; i++) {
    //       if (element.dependentAllowanceList[i].dependentAllowanceValue === res.value && res.value != null) {
    //         return res.value;
    //       }
    //     }
    //   }
    //   ));
  }

  getAllEmployeeDeductionTableList() {
    this.employeeDeductionTableList = [];
    console.log('Enter in the Function To get all Employee Deductions From Database');
    this.serviceApi.get('/v1/payroll/ctc/template/employeeDeductions').subscribe(
      res => {
        console.log('Enter to Retriving Data From Database of Employee Deduction and the Response is ' + res);
        if (res !== null) {
          console.log('There is Data In Database');
          res.forEach(element => {
            this.employeeDeductionTableList.push({
              employeeDeductionId: element.employeeDeductionId,
              employeeDeductionName: element.employeeDeductionName,
              criteria: element.criteria,
              value: element.value,
              dependentAllowanceList: element.dependentAllowanceList,
              default: element.default,
            });
          });
          this.dataSource = new MatTableDataSource<DeductionsData>(this.employeeDeductionTableList);
        } else {
          this.dataSource = new MatTableDataSource<DeductionsData>(this.employeeDeductionTableList);
        }
      }, err => {
        console.log('Somrthing gone Wrong Of Retriving Employee Deduction');
      }
    );
  }

  getAllDetailsForPayrollRunOn() {
    console.log('Enter in the Function for Getting All Details On which Payroll Get Calculated');
    return this.serviceApi.get('/v1/payroll/settings/allowances/fixed').subscribe(
      res => {
        res.forEach(element => {
          console.log('Retriving the Element On which payroll get Calculated : ' + element.allowanceName);
          this.fixedAllowanceList.push({
            value: element.allowanceId,
            viewValue: element.allowanceName
          });
        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }

  saveEmployeeDeduciton(data: any) {
    console.log('Enter to Save the Employee Deduction ' + this.employeeDeductionForm.value);
    const formBody = this.employeeDeductionForm.value;
    console.log(JSON.stringify(formBody));
    if (this.employeeDeductionForm.valid) {
      this.isValidFormSubmitted = true;
      if (this.selectedDependentVal.valid) {
        console.log('form submitted');
        this.serviceApi.post('/v1/payroll/settings/employeeDeduction', formBody).subscribe(
          res => {
            console.log('Employee Deduction Successfully Saved...');
            this.getAllEmployeeDeductionTableList();
            if (res != null) {
              console.log('The Responsed Value Of Employee Deduction is : ' + JSON.stringify(res));
              this.successNotification(res.message);
            } else {
              console.log('There is No Any Return Statement');
            }
            // this.isLeftVisible = true;
          }, err => {
            console.log('Something gone Wrong on Saving Data of Employee Deduction');
            console.log('err -->' + err);
            // this.warningNotification(err.message);
          }, () => {
            this.isLeftVisible = false;
            $('.divtoggleDiv')[1].style.display = 'block';
            this.setPanel();
          }
        );
      }

    } else {
      Object.keys(this.employeeDeductionForm.controls).forEach(field => { // {1}
        const control = this.employeeDeductionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  saveUpdateEmployeeDeduction(data: any) {
    console.log('Enter in Update the Employee Deduction');
    if (this.employeeDeductionForm.valid) {
      this.isValidFormSubmitted = true;
      if (this.selectedDependentVal.valid) {
        console.log('form submitted');
      } else {
        // validate all form fields
      }
      const formBody = this.employeeDeductionForm.value;
      console.log('--------------------------------------------------------------------------');
      console.log(JSON.stringify(formBody));
      console.log('--------------------------------------------------------------------------');
      this.serviceApi.put('/v1/payroll/settings/employeeDeduction/'
        + +this.employeeDeductionForm.controls.employeeDeductionId.value, formBody)
        .subscribe(
          res => {
            console.log('Employee Deduction successfully Saved ... ');
            this.getAllEmployeeDeductionTableList();
            if (res != null) {
              console.log('Response Data After Update the Employee Deduction : ' + JSON.stringify(res));
              this.successNotification(res.message);
            } else {
              console.log('There is no Response After Updated');
            }
          }, err => {
            console.log('err -->' + err);
            // this.warningNotification(err.message);
          }, () => {
            this.isLeftVisible = false;
            $('.divtoggleDiv')[1].style.display = 'block';
            this.setPanel();
          });
    } else {
      Object.keys(this.employeeDeductionForm.controls).forEach(field => { // {1}
        const control = this.employeeDeductionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      // this.warningNotification('Please, Fill the Required Fields');
    }

  }

  deleteEmployeeDeducitonData(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(EmployeeDeductionDeleteDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { employeeDeductionId: data.employeeDeductionId }
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
        this.getAllEmployeeDeductionTableList();
      }
    });
  }
}

@Component({
  templateUrl: 'employee-deduction-delete-dialog.html',
  styleUrls: ['dialog.scss']
})
export class EmployeeDeductionDeleteDialogComponent implements OnInit {

  error = 'Error Message';
  action: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeDeductionDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onDelete() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.employeeDeductionId);
    const val = this.data.employeeDeductionId;
    this.serviceApi.delete('/v1/payroll/settings/employeeDeduction/' + +val).subscribe(
      res => {
        console.log('Employee Deduction Successfully Deleted');
        if (res != null) {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }
      }, err => {
        console.log('Something gone Wrong to delete the Employee Deduciton from Database');
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}


export interface DeductionsData {
  employeeDeductionId: number;
  employeeDeductionName: string;
  criteria: string;
  value: number;
  dependentAllowanceList: any;
  default: boolean;
}
const ELEMENT_DATA: DeductionsData[] = [];
