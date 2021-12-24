import { Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ExpenseTemplatesComponent } from '../../expense-templates.component';
import { ApiCommonService } from '../../../../../../../services/api-common.service';
import { StepperService } from '../../service/stepper.service'
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
declare var $: any;

@Component({
  selector: 'app-dynamic-expense-category',
  templateUrl: './dynamic-expense-category.component.html',
  styleUrls: ['./dynamic-expense-category.component.scss']
})
export class DynamicExpenseCategoryComponent implements OnInit {

  @ViewChild(ExpenseTemplatesComponent) categoryChild: ExpenseTemplatesComponent;
  // this.categoryChild.expenseCategorySettings=[];
  public HideShowQuestion: FormGroup;
  panelFirstWidth: any;
  panelFirstHeight: any;
  openNewField = false;
  toggleStatus = false;
  openDiv: any;
  openDivWithoutReceipt: any;
  openDivMaxTimes: any;
  expenseCategoryName = [];
  openDivExpire: any;
  nextstep: any;
  check = false;
  @Input() public checkedListArray;
  @Input() public firstTemplateCompleteData;
  @Input() backStep: any;
  @Output() messageEvent = new EventEmitter<string>();
  @Input() public templateResponse;
  @Input() public checkedListLength;
  currentStep = 0;
  fieldTypes = [
    { value: 'Km', viewValue: 'KM' },
    { value: 'Miles', viewValue: 'Miles' },
  ];
  cityTypes = [
    { value: 'A+', viewValue: 'A+ city' },
    { value: 'A', viewValue: 'A city' },
    { value: 'B', viewValue: 'B city' }
  ]
  perValue: any = [] ;
  perCond: boolean = true;
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

  constructor(private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,

    private stepperService: StepperService) {
    this.stepperService.currentStep.subscribe(step => this.currentStep = step);
    this.HideShowQuestion = this.fb.group({
      expenseTemplateCategoryId: [],
      expenseName: [],
      expenseTemplateCategoryFields: this.fb.array([this.initItemRows()]),
      limitIndividualExpense: [''],
      maxLimitIndividualExpense: [],
      expenseWithoutReceipt: [''],
      maxAmountWithoutReceipt: [],
      maximumAmountPermit: [],
      timePeriod: [],
      allowMaximumTimes: [''],
      allowMaximumTimesStatus: [],
      applyBeforeexpireDays: [],
      allowExpireDays: [''],
      maxTimeApply: []
    });

   
  }

  ngOnInit(){
   
  }

  ngAfterViewInit() {
    let expenseTemplateCategoryFields = []
    this.perCond = true;
    if (this.firstTemplateCompleteData !== undefined) {
      this.firstTemplateCompleteData.expenseTemplateCategories.forEach(element => {
        if (this.checkedListArray.expenseName === element.expenseName) {
          console.log('Insde if');
            element.expenseTemplateCategoryFields.forEach(element => {
              expenseTemplateCategoryFields.push({
                templateFieldName: element.fieldName,
                templateFieldValue: element.fieldValue,
                templateFieldType: element.templateFieldType
              })
              this.perCond = false;
            if(element.templateFieldType == 'Km'){
              this.perValue[element.index] = 'per Km'
            }else{
              this.perValue[element.index] = 'per Miles'
            }
            });
          this.HideShowQuestion = this.fb.group({
            expenseTemplateCategoryId: [element.expenseTemplateCategoryId],
            expenseName: [element.expenseName],
            limitIndividualExpense: [element.limitIndividualExpense],
            maxLimitIndividualExpense: [element.maxLimitIndividualExpense],
            expenseWithoutReceipt: [element.expenseWithoutReceipt],
            maxAmountWithoutReceipt: [element.maxAmountWithoutReceipt],
            maximumAmountPermit: [],
            timePeriod: [element.timePeriod],
            allowMaximumTimes: [element.allowMaximumTimes],
            applyBeforeexpireDays: [element.applyBeforeexpireDays],
            allowExpireDays: [element.allowExpireDays],
            maxTimeApply: [element.maxTimeApply],
            expenseTemplateCategoryFields: this.fb.array(this.initItemRowsData(expenseTemplateCategoryFields)),
          });
          // this.HideShowQuestion.controls.expenseTemplateCategoryFields.patchValue(expenseTemplateCategoryFields);
        }
      })
    }
    console.log(this.HideShowQuestion.controls.expenseTemplateCategoryFields);
  }

  initItemRowsData( data:any) {
    let array=[]
    data.forEach(element => {
      array.push(this.fb.group({
        templateFieldName: [element.templateFieldName],
        templateFieldValue: [element.templateFieldValue],
        templateFieldType: [element.templateFieldType]
      }));
    });
    return array;
  }
  initItemRows() {
    return this.fb.group({
      templateFieldName: [''],
      templateFieldValue: [],
      templateFieldType: ['']
    });
  }
  // ngAfterViewInit() {
  //   console.log(this.firstTemplateCompleteData);
  //   console.log(this.checkedListArray);
  //   console.log(this.templateResponse);
  //   console.log(this.checkedListLength);
  //   console.log(this.HideShowQuestion.controls.expenseTemplateCategoryFields);
  // }
  nextStep() {
    this.nextstep = 1;
    console.log(this.nextstep);
  }

  addNewRow() {
    console.log('...........');
    // this.divShow = true;
    const control = <FormArray>this.HideShowQuestion.controls['expenseTemplateCategoryFields'];
    control.clearValidators();
    control.push(this.initItemRows());
    control.updateValueAndValidity();
  }
  deleteRow(index: number) {
    const control = <FormArray>this.HideShowQuestion.controls['expenseTemplateCategoryFields'];
    control.removeAt(index);
  }
  onClickSelectMerchantValue(type:any,index:any ){
    this.perCond = false;
    if(type == 'Km'){
      this.perValue[index] = 'per Km'
    }else{
      this.perValue[index] = 'per Miles'
    }
    
  }

  selectedMaxLimit() {
    console.log(this.HideShowQuestion.controls.limitIndividualExpense.value);
    this.HideShowQuestion.controls.maxLimitIndividualExpense.clearValidators();
    if (this.HideShowQuestion.controls.limitIndividualExpense.value == true) {
      console.log('Inside if');
      this.HideShowQuestion.controls.maxLimitIndividualExpense.setValidators([Validators.required]);
      this.HideShowQuestion.controls.maxLimitIndividualExpense.setValue(null);
      this.openDiv = 'On';
    } else {
      console.log('Inside else');
      this.openDiv = 'Off';
      // this.HideShowQuestion.controls.maxLimitIndividualExpense.clearValidators();
      this.HideShowQuestion.controls.maxLimitIndividualExpense.setValue(null);
    }
    this.HideShowQuestion.controls.maxLimitIndividualExpense.updateValueAndValidity();
  }
  selectedMaxAmountPermit() {
    console.log(this.HideShowQuestion.controls.expenseWithoutReceipt.value);
    this.HideShowQuestion.controls.maxAmountWithoutReceipt.clearValidators();
    if (this.HideShowQuestion.controls.expenseWithoutReceipt.value == true) {
      console.log('Inside if');
      this.openDivWithoutReceipt = 'On';
      this.HideShowQuestion.controls.maxAmountWithoutReceipt.setValidators([Validators.required]);
      this.HideShowQuestion.controls.maxAmountWithoutReceipt.setValue(null);
    } else {
      console.log('Inside if');
      // this.HideShowQuestion.controls.maxAmountWithoutReceipt.setValidators([]);
      this.HideShowQuestion.controls.maxAmountWithoutReceipt.setValue(null);
      this.openDivWithoutReceipt = 'Off';
    }
    this.HideShowQuestion.controls.maxAmountWithoutReceipt.updateValueAndValidity();
  }
  selectedMaxTime() {
    console.log(this.HideShowQuestion.controls.allowMaximumTimes.value);
    this.HideShowQuestion.controls.timePeriod.clearValidators();
    this.HideShowQuestion.controls.maxTimeApply.clearValidators();
    if (this.HideShowQuestion.controls.allowMaximumTimes.value == true) {
      console.log('Inside if');
      this.openDivMaxTimes = true;
      this.HideShowQuestion.controls.timePeriod.setValidators([Validators.required]);
      this.HideShowQuestion.controls.maxTimeApply.setValidators([Validators.required]);
      this.HideShowQuestion.controls.timePeriod.setValue(null);
      this.HideShowQuestion.controls.maxTimeApply.setValue(null);
    } else {
      console.log('Inside if');
      this.openDivMaxTimes = false;
      // this.HideShowQuestion.controls.timePeriod.setValidators([]);
      this.HideShowQuestion.controls.timePeriod.setValue(null);
      // this.HideShowQuestion.controls.maxTimeApply.setValidators([]);
      this.HideShowQuestion.controls.maxTimeApply.setValue(null);
    }
    this.HideShowQuestion.controls.timePeriod.updateValueAndValidity();
    this.HideShowQuestion.controls.maxTimeApply.updateValueAndValidity();
  }
  selectedExpireDays() {
    console.log(this.HideShowQuestion.controls.allowExpireDays.value);
    this.HideShowQuestion.controls.applyBeforeexpireDays.clearValidators();
    if (this.HideShowQuestion.controls.allowExpireDays.value == true) {
      console.log('Inside if');
      this.openDivExpire = true;
      this.HideShowQuestion.controls.applyBeforeexpireDays.setValidators([Validators.required]);
      this.HideShowQuestion.controls.applyBeforeexpireDays.setValue(null);
    } else {
      console.log('Inside if');
      this.openDivExpire = false;
      // this.HideShowQuestion.controls.applyBeforeexpireDays.setValidators([]);
      this.HideShowQuestion.controls.applyBeforeexpireDays.setValue(null);
    }
    this.HideShowQuestion.controls.applyBeforeexpireDays.updateValueAndValidity();
  }

  saveDynamicTabRecord() {
    this.check = true;
    if (this.HideShowQuestion.valid) {
      console.log('firstTemplateComlete Datat');
      console.log(this.firstTemplateCompleteData);
      // $('.divtoggleDiv')[1].style.display = 'block';
      console.log('this.templateResponse.activeExpenseCategories[this.checkedListArray.index]--->');
      console.log(this.checkedListArray.index);
      // console.log(this.templateResponse.activeExpenseCategories);
      // console.log(this.templateResponse.activeExpenseCategories[this.checkedListArray.expenseName]);
      let currentStep = 0;
      this.stepperService.currentStep.subscribe(step => currentStep = step);
      currentStep++;
      this.stepperService.changeStep(currentStep);
      let currentStep1 = 0;
      this.stepperService.currentStep.subscribe(step => currentStep1 = step);

      const result = this.firstTemplateCompleteData != null ? this.firstTemplateCompleteData.expenseTemplateId : this.templateResponse.expenseTemplateId;
      console.log('Inside save method');
      let expenseTemplateCategoryFields = [];
      if(this.checkedListArray.expenseType == 'Distance' || this.checkedListArray.expenseType == 'Per_Day'|| this.checkedListArray.expenseType == 'Time'){
        this.HideShowQuestion.controls.expenseTemplateCategoryFields.value.forEach(element => {
          expenseTemplateCategoryFields.push({
            "fieldName": element.templateFieldName,
            "fieldValue": element.templateFieldValue,
            "templateFieldType": element.templateFieldType
          })
        });
      }
      var body = {
        'allowExpireDays': this.HideShowQuestion.controls.allowExpireDays.value,
        'allowMaximumTimes': this.HideShowQuestion.controls.allowMaximumTimes.value,
        'applyBeforeexpireDays': this.HideShowQuestion.controls.applyBeforeexpireDays.value,
        'expenseName': this.checkedListArray.expenseName,
        'templateId': result,
        'maxTimeApply': this.HideShowQuestion.controls.maxTimeApply.value,
        'expenseWithoutReceipt': this.HideShowQuestion.controls.expenseWithoutReceipt.value,
        'limitIndividualExpense': this.HideShowQuestion.controls.limitIndividualExpense.value,
        'maxAmountWithoutReceipt': this.HideShowQuestion.controls.maxAmountWithoutReceipt.value,
        'maxLimitIndividualExpense': this.HideShowQuestion.controls.maxLimitIndividualExpense.value,
        'timePeriod': this.HideShowQuestion.controls.timePeriod.value,
        "expenseTemplateCategoryFields": expenseTemplateCategoryFields,

      };
      console.log('body of dynamic tab' + JSON.stringify(body));
      if (this.HideShowQuestion.controls.expenseTemplateCategoryId.value !== null) {
        return this.serviceApi.put('/v1/expense/settings/expenseTemplateCategory/' + this.HideShowQuestion.controls.expenseTemplateCategoryId.value, body)
          .
          subscribe(
            res => {
              console.log('data updated succesfully');
              this.successNotification('Template Category Updated Successfully');
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
              console.log('there is something wrong');
              // this.warningNotification(err.message);
            },
            () => {
              
            }
          );
      } else {
        return this.serviceApi.post('/v1/expense/settings/expenseTemplateCategory', body)
          .subscribe(res => {
            console.log('res saved successfully');
            this.successNotification('Template Category Saved Successfully');
            // this.templateResponse = res;
            console.log('templateResponse.......' + this.templateResponse);
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
              // console.log(err);
              // console.log('there is something wrong');
              // this.warningNotification(err.message);
            },
            () => {
             
            }
          );
      }
    }
    else {
      Object.keys(this.HideShowQuestion.controls).forEach(field => { // {1}
        const control = this.HideShowQuestion.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
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
