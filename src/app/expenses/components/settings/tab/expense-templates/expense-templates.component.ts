import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, forwardRef } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
declare var $: any;
import { ValidationMessagesService } from '../../..../../../../../validation-messages.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { DynamicExpenseCategoryComponent } from './template/dynamic-expense-category/dynamic-expense-category.component';
import { StepperService } from './service/stepper.service';
import { element } from '@angular/core/src/render3/instructions';
import { delay } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';
import { DataTable, SelectItem } from 'primeng/primeng';
@Component({
  selector: 'app-expense-templates',
  templateUrl: './expense-templates.component.html',
  styleUrls: ['./expense-templates.component.scss']
})
export class ExpenseTemplatesComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  panelFirstWidth: any;
  panelFirstHeight: any;
  public addExpenseTemplate: FormGroup;
  columns = [
    { field: 'templateName', header: 'Expense Template Name' },
    { field: 'noOfEmployee', header: 'Number Of Employees Covered' },
    { field: 'noOfExpenseCategories', header: 'Number Of Expense Categories' },
    { field: 'actions', header: 'Actions' },
  ]
  isLeftVisible: any;
  updateButton: any;
  saveButton: any;
  openDiv = true;
  firstTemplateCompleteData;
  nextStep = 1;
  templateResponse: any;
  backButton: any;
  expenseCategorySettings = [];
  expenseLabel: any;
  checkedList = [];
  tempCheckList = [];
  supervisorList = [];
  getExpenseTemplateArray = [];
  tempCheckedList = [];
  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropdownButton;
  requiredRadioButton;
  myControl = new FormControl();
  myControl1 = new FormControl();
  optionsData = [];
  secondaryOptionsData = [];
  editTemplateName: any;
  errorMessage: any;
  permission: any;
  check = false;

  allSelections = [];
  mySelectedList = [];
  @ViewChild('expenseTemplateform') form;
  @ViewChild('stepper') stepper: MatStepper;

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

  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService, private stepperService: StepperService) {
    this.expenseCategorySettings = [];
    this.getCategoryData();
    var rolesArr = KeycloakService.getUserRole();


    this.serviceApi.get('/v1/employee/filterEmployees')
      .subscribe(
        res => {
          res.forEach(element => {
            this.supervisorList.push({
              value: element.empCode,
              viewValue: element.empFirstName + '' + element.empLastName + '-' + element.empCode
            });
          });
        }
      );
    this.optionsData = this.supervisorList;
    this.secondaryOptionsData = this.supervisorList;
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);


  }
  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations()
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
      // $('.divtoggleDiv').height(this.panelFirstHeight);
    }
  }

  getExpenseTemplateData() {
    this.getExpenseTemplateArray = [];
    this.checkedList = [];
    this.serviceApi.get("/v1/expense/settings/expenseTemplate")
      .subscribe(res => {
        res.forEach(element => {
          this.getExpenseTemplateArray.push({
            expenseTemplateId: element.expenseTemplateId,
            templateName: element.expenseTemplateName,
            noOfEmployee: element.coveredEmployee,
            activeExpenseCategories: element.activeExpenseCategories,
            expenseApprovalLevel: element.expenseApprovalLevel,
            expenseApprovalType: element.expenseApprovalType,
            expensePrimaryApprover: element.expensePrimaryApprover,
            expenseSecondaryApprover: element.expenseSecondaryApprover,
            expenseTemplateCategories: element.expenseTemplateCategories,
            restrictSameAmountOnSameIncurredDate: element.restrictSameAmountOnSameIncurredDate,
            departmentId: element.departmentId,
            locationId: element.locationId,
            designationId: element.designationId,
            bandId: element.bandId,
            noOfExpenseCategories: element.categoriesCovered,
            isDefault: element.default,
            isJpgDownloadable: element.isJpgDownloadable,
            isPdfDownloadable: element.isPdfDownloadable,
            isPngDownloadable: element.isPngDownloadable,
            shouldAdvanceAmountFlowToExpense: element.shouldAdvanceAmountFlowToExpense
          });
        });
        // this.dataSource = new MatTableDataSource(this.getExpenseTemplateArray);
      },
        (err) => {
        },
        () => {
          this.getCriteria();
          this.dt.reset();
        });
  }

  getCategoryData() {
    console.log('getCategoryData called');

    this.expenseCategorySettings = [];
    let response;
    this.serviceApi.get('/v1/expense/')
      .subscribe(
        res => {
          response = res;
          response != null ? response.forEach(element => {
            this.expenseCategorySettings.push(
              {
                expenseName: element.expenseName,
                expenseType: element.expenseType,
                default: element.defualt,
              });

          }) : this.expenseCategorySettings = [];

          console.log('Enter into Else Bloack');
          this.getExpenseTemplateData();
        },
        err => {
          console.log('error occured');
        },
        () => {
          // response != null ? response.forEach(element => {
          //   this.expenseCategorySettings.push(
          //     {
          //       expenseName: element.expenseName
          //     });

          // }) : this.expenseCategorySettings = [];

          // console.log('Enter into Else Bloack');
          // this.getExpenseTemplateData();

        });
  }

  searchEmployeeName(data: any) {
    this.optionsData = this.supervisorList.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }
  resetSearch() {
    this.myControl.setValue('');
    this.optionsData = [];
    this.optionsData = this.supervisorList;
  }
  secondarySearchEmpName(data: any) {
    this.secondaryOptionsData = this.supervisorList.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl1.value.toLowerCase()) !== -1);
  }
  secondaryResetSearch() {
    this.myControl1.setValue('');
    this.secondaryOptionsData = [];
    this.secondaryOptionsData = this.supervisorList;
  }
  ngOnInit() {
    this.getCriteria();
    this.addExpenseTemplate = this.fb.group({
      expenseTemplateId: [],
      expenseTemplateName: [null, Validators.required],
      activeExpenseCategories: [],
      expenseApprovalLevel: [null, Validators.required],
      expenseApprovalType: [null, Validators.required],
      restrictSameAmountOnSameIncurredDate: [false],
      expensePrimaryApprover: [],
      expenseSecondaryApprover: [],
      allSelections: [],
      dynamicCheckBoxExpenseCategories: this.fb.array([this.initItemRows()]),
      isJpgDownloadable: [false],
      isPdfDownloadable: [false],
      isPngDownloadable: [false],
      shouldAdvanceAmountFlowToExpense: [null]
    });
  }

  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").pipe(delay(500)).subscribe(
      res => {
        res.forEach(element => {
          this.allSelections = [...this.allSelections, {
            value: element.deptId,
            viewValue: element.deptName,
            type: 'Departments'
          }];
        });

      }, (err) => {

      }, () => {

      });
  }
  getAllBands() {
    this.serviceApi.get("/v1/organization/getAll/bands").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.bandId, type: 'Bands' };
            this.allSelections = [...this.allSelections, {
              value: element.bandId,
              viewValue: element.bandName,
              type: 'Bands'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getAllDesignations() {
    this.serviceApi.get("/v1/organization/getAll/designations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.id, type: 'Designations' };
            this.allSelections = [...this.allSelections, {
              value: element.id,
              viewValue: element.designationName,
              type: 'Designations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });

  }
  getAllOrgLocations() {
    this.serviceApi.get("/v1/organization/orgLocations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            // var elemets = { id: element.locationId, type: 'Locations' };
            this.allSelections = [...this.allSelections, {
              value: element.locationId,
              viewValue: element.locationCode.toUpperCase() + ' - ' + element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  // method to put checkbox expense name in array in case of add template

  checkedStatus(event: any, data: any) {
    console.log('event' + event)
    console.log('dataname' + data)
    let tempCheckValue = data.expenseName;
    console.log(tempCheckValue);

    if (event.checked) {
      this.checkedList.push(
        {
          expenseName: data.expenseName,
          expenseType: data.expenseType,
          isDefault: data.default,

        })
      console.log('checked event' + this.checkedList);
    }
    // else will run when uncheck event occur
    else {
      console.log(tempCheckValue);
      this.tempCheckedList = this.checkedList;
      console.log('Temp checked event' + this.tempCheckedList);
      this.checkedList = [];
      let index = 0;
      for (var i = 0; i < this.tempCheckedList.length; i++) {
        if (this.tempCheckedList[i].expenseName === tempCheckValue) {
          console.log(this.tempCheckedList[i].leaveName + '' + tempCheckValue)
        }
        else {
          console.log("in else condition==" + this.tempCheckedList[i].expenseName + 'tempcheckvalue==' + tempCheckValue);

          this.checkedList.push({
            expenseName: this.tempCheckedList[i].expenseName,
            expenseType: this.tempCheckedList[i].expenseType,
            isDefault: this.tempCheckedList[i].default,

          });
          index++;
          console.log(index);
        }
      }
      this.tempCheckedList = [];
      console.log('Object after remove' + this.checkedList);
    }
  }
  saveExpenseFirstPage(element: any) {
    this.check = true;
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    if (this.addExpenseTemplate.valid && this.addExpenseTemplate.controls.activeExpenseCategories.value) {
      this.isValidFormSubmitted = true;
      this.check = false;
      console.log(this.addExpenseTemplate.controls.expenseTemplateId.value);
      let checkList = [];
      console.log('saveMethodCalled');
      console.log(element);
      console.log(this.checkedList);
      this.checkedList.forEach(element1 => {
        checkList.push(element1.expenseName);
      });
      console.log('record after push' + checkList);
      console.log(this.addExpenseTemplate);
      console.log(this.addExpenseTemplate.controls.allSelections);
      let selections = this.addExpenseTemplate.controls.allSelections.value;
      if (selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else {
            locationIds.push(element.value);
          }
        });
      }
      console.log(deptIds);
      console.log(bandIds);
      console.log(designationIds);
      console.log(locationIds);
      let restrictSameAmountOnSameIncurredDate = false;
      if (this.addExpenseTemplate.controls.restrictSameAmountOnSameIncurredDate.value !== null) {
        restrictSameAmountOnSameIncurredDate = this.addExpenseTemplate.controls.restrictSameAmountOnSameIncurredDate.value;
      }

      const body = {
        'bandId': bandIds,
        'departmentId': deptIds,
        'designationId': designationIds,
        'locationId': locationIds,
        'activeExpenseCategories': checkList,
        'expenseApprovalLevel': this.addExpenseTemplate.controls.expenseApprovalLevel.value,
        'expenseApprovalType': this.addExpenseTemplate.controls.expenseApprovalType.value,
        'expensePrimaryApprover': this.addExpenseTemplate.controls.expensePrimaryApprover.value,
        'expenseSecondaryApprover': this.addExpenseTemplate.controls.expenseSecondaryApprover.value,
        'expenseTemplateCategories': [],
        'expenseTemplateName': this.addExpenseTemplate.controls.expenseTemplateName.value,
        "isJpgDownloadable": this.addExpenseTemplate.controls.isJpgDownloadable.value,
        "isPdfDownloadable": this.addExpenseTemplate.controls.isPdfDownloadable.value,
        "isPngDownloadable": this.addExpenseTemplate.controls.isPngDownloadable.value,
        'restrictSameAmountOnSameIncurredDate': restrictSameAmountOnSameIncurredDate,
        "shouldAdvanceAmountFlowToExpense": this.addExpenseTemplate.controls.shouldAdvanceAmountFlowToExpense.value
      };
      checkList = [];
      let response;
      console.log('body structure' + JSON.stringify(body));
      // this if will run in case of edit
      if (this.addExpenseTemplate.controls.expenseTemplateId.value !== null) {
        return this.serviceApi.put('/v1/expense/settings/expenseTemplate/' + this.addExpenseTemplate.controls.expenseTemplateId.value, body)
          .subscribe(
            res => {
              //   console.log('data updated succesfully');
              this.successNotification('Template Updated Successfully');
              // console.log('get response' + JSON.stringify(res));

              // console.log('get templateResponse' + JSON.stringify(this.templateResponse));
            },
            err => {
              //   console.log('there is something wrong');
              // this.warningNotification(err.message);
              console.log(err);
            },
            () => {
              this.templateResponse = response;
              console.log('completed');
              this.nextStep = 2;
              $('.divtoggleDiv')[1].style.display = 'block';
            }
          );
      } else {
        return this.serviceApi.post('/v1/expense/settings/expenseTemplate', body)
          .subscribe(res => {
            this.successNotification('Template Saved Successfully');
            console.log('get response' + JSON.stringify(res));
            response = res;
          },
            err => {
              console.log(err);
              // this.warningNotification(err.message);
              console.log('there is something wrong');
            },
            () => {
              this.templateResponse = response;
              console.log(this.templateResponse);
              this.nextStep = 2;
              $('.divtoggleDiv')[1].style.display = 'block';
            });
      }
    } else {
      Object.keys(this.addExpenseTemplate.controls).forEach(field => { // {1}
        const control = this.addExpenseTemplate.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  // in case of edit template

  editExpenseTemplate(element: any, event: any) {
    this.isLeftVisible = !this.isLeftVisible;
    this.editTemplateName = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    console.log('element');
    console.log(JSON.stringify(element));
    this.firstTemplateCompleteData = [];
    this.firstTemplateCompleteData = element;
    // this varibale hold all the db data to send for next dynamic tab 
    console.log('firstTemplateCompleteData');
    console.log(JSON.stringify(this.firstTemplateCompleteData));

    console.log(' element.activeExpenseCategories -->');
    console.log(element.activeExpenseCategories);
    this.openDiv = false;
    let selections = [];
    element.departmentId != null ? element.departmentId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Departments'
      });
    }) : '';
    element.bandId != null ? element.bandId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Bands'
      });
    }) : '';
    element.locationId != null ? element.locationId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Locations'
      });
    }) : '';
    element.designationId != null ? element.designationId.forEach(element => {
      selections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Designations'
      });
    }) : '';
    console.log(selections);

    this.addExpenseTemplate.reset();
    // this method is taking arguments element.activeExpenseCategories consits all the active checked categories
    // and it will set the value of formControl of dynamic  tab
    this.getDynamicExpenseCategories(element, event, element.activeExpenseCategories);
    this.addExpenseTemplate.controls.expenseTemplateId.setValue(element.expenseTemplateId);
    this.addExpenseTemplate.controls.expenseTemplateName.setValue(element.templateName);
    this.addExpenseTemplate.controls.expensePrimaryApprover.setValue(element.expensePrimaryApprover);
    this.addExpenseTemplate.controls.activeExpenseCategories.setValue(element.activeExpenseCategories);
    this.addExpenseTemplate.controls.expenseApprovalType.setValue(element.expenseApprovalType);
    this.addExpenseTemplate.controls.expenseApprovalLevel.setValue(element.expenseApprovalLevel);
    this.addExpenseTemplate.controls.expenseSecondaryApprover.setValue(element.expenseSecondaryApprover);
    this.addExpenseTemplate.controls.restrictSameAmountOnSameIncurredDate.setValue(element.restrictSameAmountOnSameIncurredDate);
    this.addExpenseTemplate.controls.isJpgDownloadable.setValue(element.isJpgDownloadable);
    this.addExpenseTemplate.controls.isPdfDownloadable.setValue(element.isPdfDownloadable);
    this.addExpenseTemplate.controls.isPngDownloadable.setValue(element.isPngDownloadable);
    this.addExpenseTemplate.controls.shouldAdvanceAmountFlowToExpense.setValue(element.shouldAdvanceAmountFlowToExpense);
    this.addExpenseTemplate.controls.allSelections.patchValue(selections);
  }
  // selectValues(a: any, b: any){
  //   return a.value.id === b.value.id
  // }



  selectedLevelApproval() {
    this.addExpenseTemplate.controls.expensePrimaryApprover.clearValidators();
    this.addExpenseTemplate.controls.expenseSecondaryApprover.clearValidators();
    this.addExpenseTemplate.controls.expensePrimaryApprover.setValue(null);
    this.addExpenseTemplate.controls.expenseSecondaryApprover.setValue(null);
    if (this.addExpenseTemplate.controls.expenseApprovalLevel.value === 'FIRST_LEVEL' &&
      this.addExpenseTemplate.controls.expenseApprovalType.value === 'TEMPLATEWISE') {
      this.addExpenseTemplate.controls.expensePrimaryApprover.setValue(null);
      this.addExpenseTemplate.controls.expenseSecondaryApprover.setValue(null);
      this.addExpenseTemplate.controls.expensePrimaryApprover.setValidators([Validators.required]);
      // this.addExpenseTemplate.controls.expensePrimaryApprover.setValue(Validators.required);

    } else if (this.addExpenseTemplate.controls.expenseApprovalLevel.value === 'SECOND_LEVEL' &&
      this.addExpenseTemplate.controls.expenseApprovalType.value === 'TEMPLATEWISE') {
      this.addExpenseTemplate.controls.expensePrimaryApprover.setValue(null);
      this.addExpenseTemplate.controls.expenseSecondaryApprover.setValue(null);
      this.addExpenseTemplate.controls.expensePrimaryApprover.setValidators([Validators.required]);
      this.addExpenseTemplate.controls.expenseSecondaryApprover.setValidators([Validators.required]);
    }
    this.addExpenseTemplate.controls.expensePrimaryApprover.updateValueAndValidity();
    this.addExpenseTemplate.controls.expenseSecondaryApprover.updateValueAndValidity();
  }
  initItemRows() {
    return this.fb.group({
      expenseCategoriesElement: [],
      activeExpenseCategories: [],
      expenseCategoryValue: [],

    });
  }
  getDynamicExpenseCategories(element: any, event: any, elementExpenseCategories: any) {
    // this will make the dynamic form controls of check box and remove all the exixting checkboxes.
    const controlDynamicCheckBoxExpenseCategories = <FormArray>this.addExpenseTemplate.controls['dynamicCheckBoxExpenseCategories'];
    while (controlDynamicCheckBoxExpenseCategories.length !== 0) {
      controlDynamicCheckBoxExpenseCategories.removeAt(0);
    }
    console.log('getDynamicLeaveCategories called');
    // we are itertaing array which consits all the previous exixting expense categories which we got from
    // expense categories.
    this.expenseCategorySettings.forEach(element1 => {
      const control = <FormArray>this.addExpenseTemplate.controls['dynamicCheckBoxExpenseCategories'];
      control.push(this.fb.group(
        {
          expenseCategoriesElement: [element1],
          activeExpenseCategories: [element1.expenseName],
          expenseCategoryValue: [false]
        }
      ));
    });

    this.checkedList = []; // its an array which we have intialized earlier
    console.log('dynamicCheckBoxLeaveCategories work --->');
    const control = <FormArray>this.addExpenseTemplate.controls['dynamicCheckBoxExpenseCategories'];
    let index = 0;
    const length = control.length;
    control.controls.forEach(element => {
      elementExpenseCategories.forEach(elementExpenseCategories => {
        if (element.value.activeExpenseCategories === elementExpenseCategories) { // we compare dynamic checkbox formControlName
          // activeExpenseCategories and if both values are equal(that we have 
          // checked in case of adding template and the one which we have created dynamically)
          // then set the value of that fomControl true and call the checkedStatus1.
          const data = <FormGroup>control.at(index);
          data.controls.expenseCategoryValue.patchValue(true);
          this.checkedStatus1(true, element.value.expenseCategoriesElement);
        } else {
        }

      });
      index++;
    });
  }
  // this method is called during edit template and it will push the true expense name in checkedList array.
  checkedStatus1(isChecked: any, element: any) {
    console.log('-----------------');
    console.log(element);
    console.log(element.expenseName);
    let tempcheckvalue = element.expenseName;
    if (isChecked) {
      // this.tempCheckList=[];
      this.checkedList.push({
        index: this.checkedList.length,
        expenseName: element.expenseName,
        expenseType: element.expenseType,
        isDefault: element.default,

      });

      console.log('checked event' + this.checkedList);
      console.log(this.checkedList)
    } else {

      this.tempCheckList = this.checkedList;
      console.log('tempchecklist object size==' + this.tempCheckList)
      this.checkedList = [];
      let index = 0;
      for (var i = 0; i < this.tempCheckList.length; i++) {
        if (this.tempCheckList[i].expenseName === tempcheckvalue) {
          console.log(this.tempCheckList[i].expenseName + '' + tempcheckvalue)
        }
        else {
          console.log('in else condition==' + this.tempCheckList[i] + 'tempcheckvalue==' + tempcheckvalue);
          this.checkedList.push({
            index: index,
            expenseName: this.tempCheckedList[i].expenseName,
            expenseType: this.tempCheckedList[i].expenseType,
            isDefault: this.tempCheckedList[i].default,

          });
          // console.log('checked List object after remove' + this.checkedList);
          index++;
          console.log('index::::' + index);
        }
      }
      this.tempCheckList = [];
      console.log('object after remove==');
      console.log(this.checkedList);

    }
  }

  deleteExpenseTemplate(element: any) {
    console.log('Inside delete method');
    let dialogRef = this.dialog.open(DeleteExpenseTemplateDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        templateId: element.expenseTemplateId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);

            this.getExpenseTemplateData();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
            // this.warningNotification(this.errorMessage);
          }
        }
      }
      console.log('The dialog was closed');
    });
  }

  receiveMessage($event, stepper: MatStepper) {
    // console.log('receiveMessage called -->');
    // if ($event === 'continue') {
    //   // this.getExpenseTemplateData();
    //   stepper.next();
    // } else {
    //   this.nextStep = $event;
    //   if (this.isLeftVisible) {
    //     this.isLeftVisible = !this.isLeftVisible;
    //   }
    //   this.getExpenseTemplateData();
    // }
    console.log('receiveMessage called -->');
    console.log($event);
    // alert($event);

    if ($event !== 'continue') {
      if ($event === 'Cancel') {
        console.log('This event')
        this.nextStep = 1;
        // this.isLeftVisible = true;
        if (this.isLeftVisible) {
          // alert();
          this.getExpenseTemplateData();
          this.isLeftVisible = !this.isLeftVisible;

        }
      } else {
        console.log($event);
        this.nextStep = $event;
        if (this.isLeftVisible) {
          // alert();
          this.getExpenseTemplateData();
          this.isLeftVisible = !this.isLeftVisible;

        }
      }

    } else if ($event === 'backEvent') {
      // alert('Back' + $event);
      this.nextStep = 2;

      // this.firstTemplateCompleteData = "data";

    } else {
      // this.nextStep = 2;
      // this.getExpenseTemplateData();
      this.stepper.next();
    }
  }

  resetFormValue() {
    console.log(this.allSelections)
    $('.divtoggleDiv')[1].style.display = 'block';
    console.log('addFixedAllowance is called');
    this.addExpenseTemplate.reset();
    this.editTemplateName = false;
    this.expenseCategorySettings = [];
    this.firstTemplateCompleteData = undefined;
    this.openDiv = true;
    this.check = false;
    this.form.resetForm();
    this.getCategoryData();

  }
  cancelAddAllowanceForm() {
    this.getExpenseTemplateData();
    this.nextStep = 1;
    const currentStep = 0;
    this.stepperService.changeStep(currentStep);
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';

      $('.divtoggleDiv').width(this.panelFirstWidth);
      // $('.divtoggleDiv').height(this.panelFirstHeight);
    }
  }
}
export interface Element {
  templateName: string;
  actions: string;
  noOfEmployee: any;
  noOfExpenseCategories: any;
}



@Component({
  selector: 'delete-expense-template-dialog',
  templateUrl: 'delete-expense-template-dialog.component.html',
  styleUrls: ['./delete-dialog-component.scss']
})
export class DeleteExpenseTemplateDialog implements OnInit {
  error: any;
  action: any;
  canDelete: any;
  id: any;
  constructor(private serviceApi: ApiCommonService, public dialogRef: MatDialogRef<DeleteExpenseTemplateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.canDelete = this.data.permission;
    this.id = this.data.templateId;
    console.log(this.canDelete);
  }
  deleteExpenseTemplate() {
    return this.serviceApi.delete('/v1/expense/settings/expenseTemplate/' + this.id)
      .subscribe(
        res => {

          // this.successNotification('Template Deleted Successfully');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('delete error');
          this.action = 'Error';
          this.error = err.message;
          this.close();
        },
        () => {
          this.close();
        }
      );
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
  ngOnInit() { }
  close(): void {
    console.log('message---------' + this.error);
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}