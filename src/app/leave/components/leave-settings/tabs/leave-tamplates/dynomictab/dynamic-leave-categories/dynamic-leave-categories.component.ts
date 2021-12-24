import { Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit, } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { LeaveTamplatesComponent } from '../../leave-tamplates.component';
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { StepperService } from '../../../../../../service/stepper.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { delay } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-dynamic-leave-categories',
  templateUrl: './dynamic-leave-categories.component.html',
  styleUrls: ['./dynamic-leave-categories.component.scss']
})
export class DynamicLeaveCategoriesComponent implements OnInit, AfterViewInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  LeaveTemplateSetting = [];
  error: any;
  action: any;
  supervisors = new FormControl();
  @ViewChild(LeaveTamplatesComponent) childCheckList: LeaveTamplatesComponent;

  getLeaveCategory = [];
  public HideShowQuestion: FormGroup;
  listofSupervisor = [];
  listofSupervisorCopy = [];
  seletedEmployeesCode = [];
  myControl = new FormControl();
  // appliedOnEmployee = new FormControl();
  // selectedEmployeeList = new FormControl();
  // selectedEmployee = [this.listofSupervisor[1]];
  constEmployee = [];
  constEmployee1 = [];
  mySelectedEmpList = [];
  allSelections = [];
  @Input() public checkedListArray;
  @Input() public templateResponseObj;
  @Input() public currentActiveLeaveCategory;
  @Input() checkedListLength;
  @Input() firstTemplateCompleteData;
  eligibleEmployeeDropdown: any;
  currentStep = 0;
  nextstep: any
  @Input() backStep: any;
  @Output() messageEvent = new EventEmitter<string>();
  leaveCategories = [];
  constructor(private fb: FormBuilder, private serviceApi: ApiCommonService, private http: Http, private stepperService: StepperService) {
    this.getListOfSupervisor();
    //  this.getLeaveCategoriesData();
    // this.getAllLeaveCalegories();


    this.stepperService.currentStep.subscribe(step => this.currentStep = step);
    this.HideShowQuestion = this.fb.group({
      categoryId: [],
      leaveAccrualPeriod: [],
      carryOverLimitsPolicy: [],
      negativeLeaveBalance: [],
      daysNeedToBeEligible: [],
      leaveName: [],
      selectedEmployee: [],
      typeOfLeave: [],
      isLimitApplyLeave: [],
      maxNoOfTimes: [],
      inTimePeriod: [],
      consecutiveLeave: [],
      employeeType: [],
      eligibleEmployee: [],
      leaveAccrualRateList: [],
      leaveAccrualRateListValue: [],
      isChangeLeaveAccrualRate: [false],
      isCreditNonEligibleDays: [],
      isDealNewlyEmployeeImmediately: [],
      isDealNewlyEmployeeAfterConfirm: [],
      encashmentBeforeRollover: [],
      maxRolloverDaysForEncashment: [],
      maxEncashableDaysForFNF: [],
      negativeBalanceCap: [],
      maxRolloverLeave: [],
      minRolloverLeave: [],
      rolloverLeaveLaps: [],
      needToExtendDays: [],
      extendedDays: [],
      extendedLeaveCategory: [],
      needTimeSlab: [],
      timeSlabDays: [],
      accuralRateArray: this.fb.array([this.initItemRows()]),
      allSelections: [],
    });

  }
  ngAfterViewInit() {
    console.log(this.templateResponseObj);
    console.log(this.checkedListArray);
    this.getCriteria();
    this.getAllLeaveCalegories();
  }
  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations();
    this.getAllEmployees();

    this.allSelections.push({
      value: 'Male',
      viewValue: 'Male',
      type: 'Gender'
    },
      {
        value: 'Female',
        viewValue: 'Female',
        type: 'Gender'
      },
      {
        value: 'Single',
        viewValue: 'Single',
        type: 'Marital Status'
      },
      {
        value: 'Married',
        viewValue: 'Married',
        type: 'Marital Status'
      });

  }

  // getLeaveCategoriesData() {
  //   console.log("checkedListArrayleaveTemplateId==" + this.templateResponseObj);
  //   this.serviceApi.get('/v1/leave/settings/leaveTemplateCategories/' + this.templateResponseObj.leaveTemplateId + '/' + this.checkedListArray.categoryId).subscribe
  //     (
  //     res => res.forEach(element => {
  //       console.log("***************");
  //       console.log(element);
  //       this.getLeaveCategory.push({
  //         leaveTemplateCategoryId: element.leaveTemplateCategoryId,
  //         leaveName: element.leaveName
  //       })
  //       console.log(this.getLeaveCategory);
  //     }),
  //     err => {

  //       console.log('there is something error');
  //     }
  //     )
  // }

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
            this.allSelections = [...this.allSelections, {
              value: element.locationId,
              viewValue: element.locationCode + ' - ' + element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getAllEmployees() {
    this.serviceApi.get("/v1/employee/filterEmployees").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.allSelections = [...this.allSelections, {
              value: element.empCode,
              viewValue: element.empFirstName + " " + element.empLastName,
              type: 'Employees'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getAllLeaveCalegories() {
    this.leaveCategories = [];
    this.serviceApi.get2('/v1/leave/settings/leaveCategories').
      subscribe(
        res => {
          res.forEach(element => {
            if (element.leaveName !== this.checkedListArray.leaveName) {
              this.leaveCategories = [...this.leaveCategories, {
                categoryId: element.categoryId,
                leaveName: element.leaveName,
                typeOfLeave: element.typeOfLeave,
              }];
            }

          });

        }, (err) => {

        },
        () => {
          console.log('Enter into Else Bloack');
          console.log(this.leaveCategories);
        }
      );
  }
  onClickEvent() {
    console.log('::: Enter in the Reset function for Filter :::');
    this.listofSupervisor = this.listofSupervisorCopy;
    this.myControl.reset();
    console.log('::: Exit After call All get Employee :::');
  }
  // selectEmpCode(data: any, event: any) {
  //   if (!this.seletedEmployeesCode.some(e => e === data)) {
  //     this.seletedEmployeesCode.push(data);
  //   } else {
  //     console.log(' Enter else block');
  //     this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
  //       console.log(' El ---- ' + el);
  //       return el !== data;
  //     });
  //   }
  //   for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
  //     this.mySelectedEmpList[i] = this.seletedEmployeesCode[i];
  //   }
  //   this.HideShowQuestion.controls.selectedEmployee.setValue(this.seletedEmployeesCode);
  // }
  getListOfSupervisor() {
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {

            console.log("element.empFirstName" + element.empFirstName)
            this.listofSupervisor.push({ value: element.empCode, viewValue: element.empFirstName + " " + element.empLastName + "-" + element.empCode });
          });
        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );
    this.listofSupervisorCopy = this.listofSupervisor;
  }

  nextStep() {
    this.nextstep = 1;
    console.log(this.nextstep);
  }

  initItemRows() {
    return this.fb.group({
      daysCompleted: [],
      accuralRate: [],

    });
  }
  addNewRow() {
    const control = <FormArray>this.HideShowQuestion.controls['accuralRateArray'];
    control.push(this.initItemRows());
  }
  deleteRow(index: number) {
    const control = <FormArray>this.HideShowQuestion.controls['accuralRateArray'];
    control.removeAt(index);
  }
  setValidation() {
    Object.keys(this.HideShowQuestion.controls).forEach(field => { // {1}
      const control = this.HideShowQuestion.get(field);            // {2}
      control.markAsUntouched({ onlySelf: true });       // {3}
    });

    console.log("checkedListArray:::   " + this.checkedListArray);
    if (this.checkedListArray.typeOfLeave == 'General_Leave') {
      if (this.checkedListArray.encashmentOnRollover == true || this.checkedListArray.encashmentRecoveryOnFNF == true) {
        this.HideShowQuestion.controls.encashmentBeforeRollover.setValidators(Validators.required);
        this.HideShowQuestion.controls.encashmentBeforeRollover.updateValueAndValidity();
        if (this.checkedListArray.encashmentOnRollover == true) {
          this.HideShowQuestion.controls.maxRolloverDaysForEncashment.setValidators(Validators.required);
          this.HideShowQuestion.controls.maxRolloverDaysForEncashment.updateValueAndValidity();
        } else if (this.checkedListArray.encashmentRecoveryOnFNF == true) {
          this.HideShowQuestion.controls.maxEncashableDaysForFNF.setValidators(Validators.required);
          this.HideShowQuestion.controls.maxEncashableDaysForFNF.updateValueAndValidity();
        }
      }
      if (this.checkedListArray.carryOverLimitsPolicy === 'Carryover_Cap') {
        this.HideShowQuestion.controls.maxRolloverLeave.reset();
        this.HideShowQuestion.controls.maxRolloverLeave.setValidators(Validators.required);
        this.HideShowQuestion.controls.maxRolloverLeave.updateValueAndValidity();

        this.HideShowQuestion.controls.minRolloverLeave.reset();
        this.HideShowQuestion.controls.minRolloverLeave.setValidators(Validators.required);
        this.HideShowQuestion.controls.minRolloverLeave.updateValueAndValidity();

        this.HideShowQuestion.controls.rolloverLeaveLaps.reset();
        this.HideShowQuestion.controls.rolloverLeaveLaps.setValidators(Validators.required);
        this.HideShowQuestion.controls.rolloverLeaveLaps.updateValueAndValidity();

      }

      this.HideShowQuestion.controls.leaveAccrualRateListValue.setValidators(Validators.required);
      this.HideShowQuestion.controls.leaveAccrualRateListValue.updateValueAndValidity();

      this.HideShowQuestion.controls.isChangeLeaveAccrualRate.setValidators(Validators.required);
      this.HideShowQuestion.controls.isChangeLeaveAccrualRate.updateValueAndValidity();

      this.HideShowQuestion.controls.isLimitApplyLeave.setValidators(Validators.required);
      this.HideShowQuestion.controls.isLimitApplyLeave.updateValueAndValidity();



    }
    else if (this.checkedListArray.typeOfLeave == 'Annual_Non_Accrual_Leave') {
      this.HideShowQuestion.controls.consecutiveLeave.setValidators(Validators.required);
      this.HideShowQuestion.controls.consecutiveLeave.updateValueAndValidity();

      this.HideShowQuestion.controls.needToExtendDays.setValidators(Validators.required);
      this.HideShowQuestion.controls.needToExtendDays.updateValueAndValidity();

      this.HideShowQuestion.controls.needTimeSlab.setValidators(Validators.required);
      this.HideShowQuestion.controls.needTimeSlab.updateValueAndValidity();


    }
    else if (this.checkedListArray.typeOfLeave == 'CompOff') {
      this.HideShowQuestion.controls.consecutiveLeave.setValidators(Validators.required);
      this.HideShowQuestion.controls.consecutiveLeave.updateValueAndValidity();
    }

    this.HideShowQuestion.controls.employeeType.setValidators(Validators.required);
    this.HideShowQuestion.controls.employeeType.updateValueAndValidity();

    this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValidators(Validators.required);
    this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.updateValueAndValidity();

  }

  ngOnInit() {

    this.setValidation();
    this.HideShowQuestion.controls.leaveName.setValue("" + this.checkedListArray.leaveName);
    this.HideShowQuestion.controls.typeOfLeave.setValue("" + this.checkedListArray.typeOfLeave);
    console.log("checkedListArray==" + JSON.stringify(this.checkedListArray));
    console.log("this.firstTemplateCompleteData==" + JSON.stringify(this.firstTemplateCompleteData));
    if (this.firstTemplateCompleteData !== undefined) {
      this.firstTemplateCompleteData.leaveTemplateCategories.forEach(element => {
        if (this.checkedListArray.leaveName == element.leaveName) {
          let dealNewlyEmployeeImmediately;
          if (element.dealNewlyEmployeeAfterConfirm) {
            dealNewlyEmployeeImmediately = 'confirmed';
          } else {
            dealNewlyEmployeeImmediately = element.dealNewlyEmployeeImmediately;
          }
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
          element.leaveTemplateCategoryEmployees != null ? element.leaveTemplateCategoryEmployees.map(res => {
            selections.push({
              value: res.empCode,
              viewValue: res.name,
              type: 'Employees'
            });
          }) : "";
          element.gender != null ? selections.push({
            value: element.gender,
            viewValue: element.gender,
            type: 'Gender'
          }) : "";
          element.maritalStatus != null ? selections.push(
            {
              value: element.maritalStatus,
              viewValue: element.maritalStatus,
              type: 'Marital Status'
            }) : "";
          console.log(selections);
          this.HideShowQuestion = this.fb.group({
            categoryId: [element.leaveTemplateCategoryId],
            leaveAccrualPeriod: [element.leaveAccrualPeriod],
            selectedEmployee: [element.leaveTemplateCategoryEmployees],
            carryOverLimitsPolicy: [element.carryOverLimitsPolicy],
            negativeLeaveBalance: [element.negativeLeaveBalance],
            daysNeedToBeEligible: [element.tenurePeriod],
            leaveName: [element.leaveName],
            typeOfLeave: [this.checkedListArray.typeOfLeave],
            isLimitApplyLeave: ['' + element.limitApplyLeave],
            maxNoOfTimes: [element.maxNoOfTimes],
            inTimePeriod: [element.inTimePeriod],
            consecutiveLeave: [element.consecutiveLeave],
            employeeType: [element.employeeType],
            leaveAccrualRateList: [element.leaveAccrualRateList],
            leaveAccrualRateListValue: [element.accrualRate],
            isChangeLeaveAccrualRate: ['' + element.changeLeaveAccrualRate],
            isCreditNonEligibleDays: ['' + element.creditNonEligibleDays],
            isDealNewlyEmployeeImmediately: ['' + dealNewlyEmployeeImmediately],
            isDealNewlyEmployeeAfterConfirm: ['' + element.dealNewlyEmployeeAfterConfirm],
            encashmentBeforeRollover: ['' + element.encashmentBeforeRollover],
            maxRolloverDaysForEncashment: [element.maxRolloverDaysForEncashment],
            maxEncashableDaysForFNF: [element.maxEncashableDaysForFNF],
            negativeBalanceCap: [element.negativeBalanceLeave],
            maxRolloverLeave: [element.maxRolloverLeave],
            minRolloverLeave: [element.minRolloverLeave],
            rolloverLeaveLaps: [element.rolloverLeaveLaps],
            needToExtendDays: ['' + element.needToExtendDays],
            extendedDays: [element.extendedDays],
            extendedLeaveCategory: [+element.extendedLeaveCategory],
            needTimeSlab: ['' + element.needTimeSlab],
            timeSlabDays: [element.timeSlabDays],
            allSelections: [selections],
            accuralRateArray: this.fb.array([this.initItemRows()])
          });
          // this.HideShowQuestion.controls.allSelections.setValue(selections);
          //  this.selectedEmployee.push({empcode:element.leaveTemplateCategoryEmployees})  
          // this.selectedEmployeeList.setValue(element.leaveTemplateCategoryEmployees.map(res => res.empCode));
          // element.leaveTemplateCategoryEmployees.forEach(element => {
          //   this.mySelectedEmpList.push(element.empCode);
          //   this.seletedEmployeesCode.push(element.empCode);
          // });

        }
      });

    }
    this.getAllLeaveCalegories();
    if (this.HideShowQuestion.controls.employeeType.value == 'SPECIFIC') {
      // this.selectedEmployeeList.setValidators([Validators.required]);
      this.HideShowQuestion.controls.allSelections.setValidators([Validators.required]);
    }

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
  selectedRadioButton(event: any, data: any) {
    console.log(event);
    this.HideShowQuestion.controls.daysNeedToBeEligible.clearValidators();
    this.HideShowQuestion.controls.daysNeedToBeEligible.setValue(null);
    this.HideShowQuestion.controls.isCreditNonEligibleDays.clearValidators();
    if (data === 'confirmed') {
      this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValue(false);
      this.HideShowQuestion.controls.isDealNewlyEmployeeAfterConfirm.setValue(true);
      this.HideShowQuestion.controls.isCreditNonEligibleDays.reset();
      this.HideShowQuestion.controls.isCreditNonEligibleDays.setValidators(Validators.required);
    } else if (data === 'true') {
      this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValue(true);
      this.HideShowQuestion.controls.isDealNewlyEmployeeAfterConfirm.setValue(false);
    }
    else {
      this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValue(false);
      this.HideShowQuestion.controls.isDealNewlyEmployeeAfterConfirm.setValue('false');
      this.HideShowQuestion.controls.daysNeedToBeEligible.reset();
      this.HideShowQuestion.controls.daysNeedToBeEligible.setValidators(Validators.required);
      this.HideShowQuestion.controls.isCreditNonEligibleDays.reset();
      this.HideShowQuestion.controls.isCreditNonEligibleDays.setValidators(Validators.required);
    }
    this.HideShowQuestion.controls.daysNeedToBeEligible.updateValueAndValidity();
    this.HideShowQuestion.controls.isCreditNonEligibleDays.updateValueAndValidity();

  }
  onChangeEmployee() {

    this.myControl.reset();
    this.listofSupervisor = this.listofSupervisorCopy;
  }
  applyValidation() {
    this.HideShowQuestion.controls.allSelections.clearValidators()
    if (this.HideShowQuestion.controls.employeeType.value == 'SPECIFIC') {
      this.HideShowQuestion.controls.allSelections.setValidators([Validators.required]);
    }
    this.HideShowQuestion.controls.allSelections.updateValueAndValidity();
  }
  searchEmployeeName(data: any) {

    if (this.myControl.value != null) {
      this.listofSupervisor = this.listofSupervisorCopy.filter(option =>
        option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
      console.log('Enter in the backSpace' + this.myControl);

    }
  }
  validation() {
    this.HideShowQuestion.controls.extendedDays.clearValidators();
    this.HideShowQuestion.controls.extendedLeaveCategory.clearValidators();
    this.HideShowQuestion.controls.extendedDays.reset();
    this.HideShowQuestion.controls.extendedLeaveCategory.reset();
    if (this.HideShowQuestion.controls.needToExtendDays.value === 'true') {
      this.HideShowQuestion.controls.extendedDays.setValidators([Validators.required]);
      this.HideShowQuestion.controls.extendedLeaveCategory.setValidators([Validators.required]);
    } else {
      this.HideShowQuestion.controls.extendedDays.setValue(null);
      this.HideShowQuestion.controls.extendedLeaveCategory.setValue(null);
    }
    this.HideShowQuestion.controls.extendedDays.updateValueAndValidity();
    this.HideShowQuestion.controls.extendedLeaveCategory.updateValueAndValidity();
  }
  validation1() {
    this.HideShowQuestion.controls.timeSlabDays.clearValidators();

    this.HideShowQuestion.controls.timeSlabDays.reset();

    if (this.HideShowQuestion.controls.needTimeSlab.value === 'true') {
      this.HideShowQuestion.controls.timeSlabDays.setValidators([Validators.required]);
    }
    this.HideShowQuestion.controls.timeSlabDays.updateValueAndValidity();

  }

  saveRecord() {
    console.log('saveRecord called');
    let currentStep = 0;
    this.stepperService.currentStep.subscribe(step => currentStep = step);


    let body;
    let isCreditNonEligibleDaysBoolean;

    let isDealNewlyEmployeeImmediatelyBoolean;
    let isLimitApplyLeaveBoolean;

    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    let gender = '';
    let maritalStatus = '';
    let appliedEmployees = [];
    let leaveAccrualRateListArray = [];

    if (this.HideShowQuestion.valid) {
      this.checkedListArray.isCompleted = true;

      currentStep++;
      this.stepperService.changeStep(currentStep);

      let currentStep2 = 0;
      this.stepperService.currentStep.subscribe(step => currentStep2 = step);
      if (this.checkedListArray.typeOfLeave === 'General_Leave') {

        if (this.HideShowQuestion.controls.isCreditNonEligibleDays.value === 'true') {
          isCreditNonEligibleDaysBoolean = true;
        } else {
          isCreditNonEligibleDaysBoolean = false;
        }

        if (this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.value === 'confirmed') {
          this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValue(false);
        }

        if (this.HideShowQuestion.controls.isLimitApplyLeave.value === 'true') {
          isLimitApplyLeaveBoolean = true;
        } else {
          isLimitApplyLeaveBoolean = false;
        }
        if (this.HideShowQuestion.controls.isChangeLeaveAccrualRate.value === 'true') {
          this.HideShowQuestion.controls.accuralRateArray.value.forEach(element => {
            leaveAccrualRateListArray.push(
              {
                "leaveAccrualDays": element.daysCompleted,
                "leaveAccrualRates": element.accuralRate
              }
            )
          });
        }

      }
      else if (this.checkedListArray.typeOfLeave === 'Annual_Non_Accrual_Leave') {
        if (this.HideShowQuestion.controls.isCreditNonEligibleDays.value === 'true') {
          isCreditNonEligibleDaysBoolean = true;
        } else {
          isCreditNonEligibleDaysBoolean = false;
        }

        if (this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.value === 'confirmed') {
          this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValue(false);
        }

        if (this.HideShowQuestion.controls.isLimitApplyLeave.value === 'true') {
          isLimitApplyLeaveBoolean = true;
        } else {
          isLimitApplyLeaveBoolean = false;
        }
        // if (this.HideShowQuestion.controls.employeeType.value === 'ALL') {
        //   this.emp = null
        // }


      } else if (this.checkedListArray.typeOfLeave === 'Comp_Off') {
        if (this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.value === 'confirmed') {
          this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValue(false);
        }
      }
      else if (this.checkedListArray.typeOfLeave === 'Maternity_Leave') {
        if (this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.value === 'confirmed') {
          this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.setValue(false);
        }
      }
      if (this.HideShowQuestion.controls.employeeType.value === 'SPECIFIC') {
        let selections = this.HideShowQuestion.controls.allSelections.value;
        selections.forEach(element => {
          if (element.type === 'Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else if (element.type === 'Employees') {
            appliedEmployees.push(element.value)
          } else if (element.type === 'Gender') {
            gender = element.value;
          } else if (element.type === 'Marital Status') {
            maritalStatus = element.value;
          } else {
            locationIds.push(element.value);
          }
        });
      }
      if (!this.HideShowQuestion.controls.employeeType.value) {
        this.HideShowQuestion.controls.employeeType.setValue('ALL')
      }
      body = {
        "consecutiveLeave": this.HideShowQuestion.controls.consecutiveLeave.value,
        // "eligibleEmployee": this.HideShowQuestion.controls.employeeType.value,
        "inTimePeriod": this.HideShowQuestion.controls.inTimePeriod.value,
        "creditNonEligibleDays": isCreditNonEligibleDaysBoolean,
        "dealNewlyEmployeeImmediately": this.HideShowQuestion.controls.isDealNewlyEmployeeImmediately.value,
        "dealNewlyEmployeeAfterConfirm": this.HideShowQuestion.controls.isDealNewlyEmployeeAfterConfirm.value,
        "limitApplyLeave": isLimitApplyLeaveBoolean,
        "accrualRate": +this.HideShowQuestion.controls.leaveAccrualRateListValue.value,
        "isChangeLeaveAccrualRate": this.HideShowQuestion.controls.isChangeLeaveAccrualRate.value,
        "leaveAccrualRateList": leaveAccrualRateListArray,
        "leaveName": this.templateResponseObj.activeLeaveCategories[this.checkedListArray.index],
        "leaveTemplateId": this.templateResponseObj.leaveTemplateId,
        "leaveCategoryId": this.checkedListArray.categoryId,
        "maxNoOfTimes": this.HideShowQuestion.controls.maxNoOfTimes.value,
        "encashmentBeforeRollover": this.HideShowQuestion.controls.encashmentBeforeRollover.value,
        "maxRolloverDaysForEncashment": this.HideShowQuestion.controls.maxRolloverDaysForEncashment.value,
        "maxEncashableDaysForFNF": this.HideShowQuestion.controls.maxEncashableDaysForFNF.value,
        "negativeBalanceLeave": this.HideShowQuestion.controls.negativeBalanceCap.value,
        "tenurePeriod": this.HideShowQuestion.controls.daysNeedToBeEligible.value,
        "maxRolloverLeave": this.HideShowQuestion.controls.maxRolloverLeave.value,
        "minRolloverLeave": this.HideShowQuestion.controls.minRolloverLeave.value,
        "rolloverLeaveLaps": this.HideShowQuestion.controls.rolloverLeaveLaps.value,
        "employeeType": this.HideShowQuestion.controls.employeeType.value,
        "needToExtendDays": this.HideShowQuestion.controls.needToExtendDays.value,
        "extendedDays": this.HideShowQuestion.controls.extendedDays.value,
        "extendedLeaveCategory": this.HideShowQuestion.controls.extendedLeaveCategory.value,
        "needTimeSlab": this.HideShowQuestion.controls.needTimeSlab.value,
        "timeSlabDays": this.HideShowQuestion.controls.timeSlabDays.value,
        "empList": appliedEmployees,
        "departmentId": deptIds,
        "designationId": designationIds,
        "bandId": bandIds,
        "locationId": locationIds,
        "maritalStatus": maritalStatus,
        "gender": gender
      }
      console.log('BODY Data------------ ' + JSON.stringify(body));
      if (this.HideShowQuestion.controls.categoryId.value !== null) {
        console.log('Inside if')
        this.serviceApi.put('/v1/leave/settings/leaveTemplateCategory/' + this.HideShowQuestion.controls.categoryId.value, body)

          .subscribe(
            res => {
              console.log('Leave Template Updated successfully');
              this.successNotification('Template Category Successfully Updated');
              this.nextstep = 2;
              console.log(res);
              if (currentStep == this.checkedListLength) {
                this.stepperService.changeStep(0);
                this.onCancelClick();
              } else {
                this.messageEvent.emit('continue');
              }
            },
            err => {
              console.log('..........' + JSON.stringify(err))
              // this.warningNotification(err.message);
              console.log('Sorry!! There is some error');
              console.log(err);

              // this.childCheckList.checkedList = [];
            },
            () => {
            }
          )

      }
      else {
        this.serviceApi.post('/v1/leave/settings/leaveTemplateCategory', body)

          .subscribe(
            res => {
              console.log('Leave Template Categories Save');
              this.successNotification('Template Category Successfully Saved');
              this.nextstep = 2;
              console.log(res);
              if (currentStep == this.checkedListLength) {
                this.stepperService.changeStep(0);
                this.onCancelClick();
              } else {
                this.messageEvent.emit('continue');
              }
            },
            err => {
              console.log('..........' + JSON.stringify(err))
              // this.warningNotification('Sorry!! There is some error');
              console.log('there is something error');
              console.log(err);

              // this.childCheckList.checkedList = [];
            },
            () => {
            }
          )
      }
    }
    else {
      Object.keys(this.HideShowQuestion.controls).forEach(field => { // {1}
        const control = this.HideShowQuestion.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      // this.stepperService.changeStep(currentStep);
      // // this.stepperService.currentStep.subscribe(step => currentStep = step);
      // currentStep--;
      // this.stepperService.changeStep(currentStep);
    }
    // if (currentStep == this.checkedListLength) {
    //   this.stepperService.changeStep(0);
    //   $('.divtoggleDiv')[1].style.display = 'none';
    //   $('.divtoggleDiv').width(this.panelFirstWidth);
    //   this.onCancelClick();
    // }
  }
  onCancelClick() {
    console.log('onCancelClick Method called');
    this.messageEvent.emit('Cancel');
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }

  setBackStep() {
    let currentStep = 0;
    this.stepperService.currentStep.subscribe(step => currentStep = step);
    currentStep--;
    this.stepperService.changeStep(currentStep);
  }


}
