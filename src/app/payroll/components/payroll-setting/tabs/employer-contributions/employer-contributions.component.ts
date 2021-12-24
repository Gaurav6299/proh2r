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
declare var $: any;

@Component({
  selector: 'app-employer-contributions',
  templateUrl: './employer-contributions.component.html',
  styleUrls: ['./employer-contributions.component.scss']
})
export class EmployerContributionsComponent implements OnInit, AfterViewInit {
  public employerContributionForm: FormGroup;
  isLeftVisible = false;
  Specific = false;
  Some = false;
  button = false;
  panelFirstWidth: any;
  panelFirstHeight: any;

  employerContributionTableList = [];
  seletedDependentAllowance = [];
  seletedFilterDependentAllowance = [];

  myControl = new FormControl();
  selectedEmployee = new FormControl();
  notificationMsg: any;
  action: any;

  formHeader: any;
  requiredTextField;
  requiredDropdownField;
  isValidFormSubmitted = true;
  EnterDeductions = [
    { value: 'AMOUNT', viewValue: 'Fixed Amount' },
    { value: 'PERCENTAGE', viewValue: 'Percentage' },
    { value: 'MANUALLY', viewValue: 'Manual' }
  ];
  creteriaType: any;

  updateButton = false;
  seletedFilterData = [];
  toppings = new FormControl();
  selectedDependentVal = new FormControl();
  fixedAllowanceList = [{
    value: -1,
    viewValue: 'CTC'
  }];

  displayedColumns = ['employerContributionName', 'action'];
  dataSource = new MatTableDataSource<DeductionsData>();

  constructor(public dialog: MatDialog, private _fb: FormBuilder, private http: Http,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.getAllEmployerContributionTableList();
    this.getAllDetailsForPayrollRunOn();
    const rolesArr = KeycloakService.getUserRole();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownField = message);
    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));
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
    this.employerContributionForm = this._fb.group({
      employerContributionId: [],
      employerContributionName: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      criteria: ['', Validators.required],
      value: ['', [
        Validators.required,
        this.validationMessagesService.numericValidation
      ]],
      dependentAllowanceList: [],
      default: []
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
    this.employerContributionForm.controls.value.setValue(null);
    this.employerContributionForm.controls.value.clearValidators();
    this.employerContributionForm.controls.value.updateValueAndValidity();

    if (this.employerContributionForm.controls.criteria.value === 'AMOUNT') {
      this.creteriaType = 'Amount';
      this.employerContributionForm.controls.value.setValidators([Validators.required]);
    }
    if (this.employerContributionForm.controls.criteria.value === 'MANUALLY') {
      this.creteriaType = 'MANUALLY';
    }

    if (this.employerContributionForm.controls.criteria.value === 'PERCENTAGE') {
      this.creteriaType = 'Percentage';
      this.employerContributionForm.controls.dependentAllowanceList.setValidators([Validators.required]);
      this.employerContributionForm.controls.value.setValidators([Validators.required]);
      this.selectedDependentVal.setValidators([Validators.required]);
    }
    this.employerContributionForm.controls.value.updateValueAndValidity();
  }


  clickForAll() {
    this.Some = false;
    this.Specific = false;
  }



  addDeductions() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.updateButton = false;
    this.employerContributionForm.reset();
    this.selectedDependentVal.reset();
    this.formHeader = 'Add New Employer Contributions';
  }


  editEmployerContribution(element: any) {
    console.log('Enter in tge Edit Section of Empployee Contribution');
    this.formHeader = 'Edit Employer Contributions';
    this.updateButton = true;
    this.isLeftVisible = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    console.log(JSON.stringify(element));
    this.selectedDependentVal.reset();
    this.employerContributionForm.controls.employerContributionId.setValue(element.employerContributionId);
    this.employerContributionForm.controls.employerContributionName.setValue(element.employerContributionName, Validators.required);
    this.employerContributionForm.controls.criteria.setValue(element.criteria);
    this.employerContributionForm.controls.value.setValue(element.value);
    // this.employerContributionForm.controls.dependentAllowanceList.setValue(element.dependentAllowanceList);
    this.employerContributionForm.controls.default.setValue(element.default);


    this.seletedFilterData = [];
    const dependentValueList = [];
    for (let i = 0; i < element.dependentAllowanceList.length; i++) {
      this.seletedFilterData.push({
        'dependentEmployerAllowanceValue': element.dependentAllowanceList[i].dependentEmployerAllowanceValue,
      });
      dependentValueList.push(element.dependentAllowanceList[i].dependentEmployerAllowanceValue);
    }

    this.selectedDependentVal.setValue(dependentValueList);
    this.employerContributionForm.controls.dependentAllowanceList.setValue(this.seletedFilterData);

    // this.seletedFilterData = [];
    // let dependentValueList = [];
    // for (let i = 0; i > element.dependentAllowanceList.length; i++) {
    //   this.seletedFilterData.push({
    //     'dependentEmployerAllowanceValue': element.dependentAllowanceList[i].dependentEmployerAllowanceValue,
    //   });
    //   dependentValueList.push(element.dependentAllowanceList[i].dependentEmployerAllowanceValue);
    // }

    // this.selectedDependentVal.setValue(dependentValueList);
  }

  getAllEmployerContributionTableList() {
    this.employerContributionTableList = [];
    console.log('Enter in the Function To get all variable Deductions From Database');
    this.serviceApi.get('/v1/payroll/ctc/template/employerContribution').subscribe(
      res => {
        console.log('Enter to Retriving Data From Database of Employee Contribution and the Response is ' + res);
        if (res !== null) {
          console.log('There is Data In Database');
          res.forEach(element => {
            this.employerContributionTableList.push({
              employerContributionId: element.employerContributionId,
              employerContributionName: element.employerContributionName,
              criteria: element.criteria,
              value: element.value,
              dependentAllowanceList: element.dependentAllowanceList,
              default: element.default,
            });
          });
          this.dataSource = new MatTableDataSource<DeductionsData>(this.employerContributionTableList);
        }
      }, (err) => {
       
      }, () => {
        console.log('Somrthing gone Wrong Of Retriving Variable Deduction');
        this.dataSource = new MatTableDataSource<DeductionsData>(this.employerContributionTableList);
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

  selectDependentComponenet() {
    console.log(this.selectedDependentVal.value);
    const checkedList: number[] = this.selectedDependentVal.value;
    this.seletedDependentAllowance = this.fixedAllowanceList.map(function (value, index, array) {
      if (checkedList.includes(value.value)) {
        return value;
      }
    });
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
        'dependentEmployerAllowanceValue': this.seletedDependentAllowance[i].value,
      });
      selectedDependentValue.push(this.seletedDependentAllowance[i].value);
    }
    this.selectedDependentVal.setValue(selectedDependentValue);
    this.employerContributionForm.controls.dependentAllowanceList.setValue(this.seletedFilterData);


  }

  // selectDependentComponenet() {
  //   console.log(this.selectedDependentVal.value);
  //   const checkedList: number[] = this.selectedDependentVal.value;
  //   this.seletedDependentAllowance = this.fixedAllowanceList.map(function (value, index, array) {
  //     if (checkedList.includes(value.value)) {
  //       return value.value;
  //     }
  //   });
  //   this.seletedDependentAllowance = this.seletedDependentAllowance.filter(function (value, index, array) {
  //     if (value != null) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });

  //   this.seletedFilterData = [];
  //   let selectedDependentValue = [];
  //   for (let i = 0; i < this.seletedDependentAllowance.length; i++) {
  //     this.seletedFilterData.push({
  //       'dependentAllowanceValue': this.seletedDependentAllowance[i].value,
  //     });
  //     selectedDependentValue.push(this.seletedDependentAllowance[i].value);
  //   }
  //   this.selectedDependentVal.setValue(selectedDependentValue);
  //   this.employerContributionForm.controls.dependentAllowanceList.setValue(this.seletedFilterData);

  //   // this.seletedFilterDependentAllowance = [];
  //   // let selectedDependentValue = [];
  //   // for (let i = 0; i < this.seletedDependentAllowance.length; i++) {
  //   //   this.seletedFilterDependentAllowance.push({
  //   //     'dependentEmployerAllowanceValue': this.seletedDependentAllowance[i].value,
  //   //   });
  //   //   selectedDependentValue.push(this.seletedDependentAllowance[i].dependentEmployerAllowanceValue);
  //   // }
  //   // this.selectedDependentVal.setValue(selectedDependentValue);
  //   // this.employerContributionForm.controls.dependentAllowanceList.setValue(this.seletedFilterDependentAllowance);
  // }

  saveEmployerContribution(data: any) {
    console.log('Enter to Save the Employee Contribution ' + this.employerContributionForm.value);
    if (this.employerContributionForm.valid) {
      this.isValidFormSubmitted = true;
      if (this.selectedDependentVal.valid) {
        console.log('form submitted');
      } else {
        // validate all form fields
      }
      const formBody = this.employerContributionForm.value;
      console.log(JSON.stringify(formBody));
      this.serviceApi.post('/v1/payroll/settings/employerContribution', formBody).subscribe(
        res => {
          console.log('Employee Contribution Successfully Saved...');
          this.getAllEmployerContributionTableList();
          if (res != null) {
            console.log('The Responsed Value Of Employee Contribution is : ' + JSON.stringify(res));
            this.successNotification(res.message);
          } else {
            console.log('There is No Any Return Statement');
          }
        }, err => {
          console.log('Something gone Wrong on Saving Data of Employee Contribution');
          console.log('err -->' + err);
          // this.warningNotification(err.message);
        }, () => {
          this.isLeftVisible = false;
          $('.divtoggleDiv')[1].style.display = 'block';
          this.setPanel();
        }
      );

    } else {
      Object.keys(this.employerContributionForm.controls).forEach(field => { // {1}
        const control = this.employerContributionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  saveUpdateEmployerContribution(data: any) {
    console.log('Enter in Update the Variable Deduction');
    if (this.employerContributionForm.valid) {
      this.isValidFormSubmitted = true;
      if (this.selectedDependentVal.valid) {
        console.log('form submitted');
      } else {
        // validate all form fields
      }
      const formBody = this.employerContributionForm.value;
      this.serviceApi.put('/v1/payroll/settings/employerContribution/' +
        +this.employerContributionForm.controls.employerContributionId.value, formBody)
        .subscribe(
          res => {
            console.log('Employee Contribution Deduction successfully Saved ... ');
            this.getAllEmployerContributionTableList();
            if (res != null) {
              console.log('Response Data After Update the Variable Deduction : ' + JSON.stringify(res));
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
      Object.keys(this.employerContributionForm.controls).forEach(field => { // {1}
        const control = this.employerContributionForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  deleteEmployerContributionData(data: any) {
    console.log('Employee On Delete-->' + data);
    const dialogRef = this.dialog.open(EmployerContributionDeleteDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { employerContributionId: data.employerContributionId }
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
        this.getAllEmployerContributionTableList();
      }

    });

  }
}


@Component({
  templateUrl: 'employer-contribution-delete-dialog.html',
  styleUrls: ['dialog.scss']
})
export class EmployerContributionDeleteDialogComponent implements OnInit {

  error = 'Error Message';
  action: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployerContributionDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onDelete() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.employerContributionId);
    const val = this.data.employerContributionId;
    this.serviceApi.delete('/v1/payroll/settings/employerContribution/' + +val).subscribe(
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
  employerContributionId: number;
  employerContributionName: string;
  criteria: string;
  value: number;
  dependentAllowanceList: any;
  default: boolean;
}
const ELEMENT_DATA: DeductionsData[] = [];
