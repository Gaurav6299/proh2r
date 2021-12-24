import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { DataTable, SelectItem } from 'primeng/primeng';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
declare var $: any;
@Component({
  selector: 'app-expense-categories',
  templateUrl: './expense-categories.component.html',
  styleUrls: ['./expense-categories.component.scss']
})
export class ExpenseCategoriesComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  expenseCategory = [];
  divShow: boolean;
  divShowDropdown: boolean;
  divShowClientDropdown: boolean;
  openTextField = [];
  openTextFieldClient = false;
  openAddCustomFields = false;
  updateButton: any = false;
  saveButton: any;
  backButton: any;
  errorMessage: any;
  columns = [
    { field: 'expenseName', header: 'Expense Name' },
    { field: 'actions', header: 'Actions' },
  ]
  isLeftVisible: any;
  fieldTypes = [
    { value: 'DROPDOWN', viewValue: 'Dropdown' },
    { value: 'TEXTFIELD', viewValue: 'TextField' },
    { value: 'NUMBER', viewValue: 'Number' },
    { value: 'DATERANGE', viewValue: 'DataRange' }
  ];

  @ViewChild('expenseCategoriesForm') form;
  public addExpenseCategory: FormGroup;
  expenseCustomField: FormArray;
  expenseCustomDropdown: FormArray;
  isLabel: boolean;
  panelFirstWidth: any;
  panelFirstHeight: any;
  checkVal = true;
  requiredTextField: string;
  requiredDateButton: string;
  requiredRadioButton: string;
  requiredDropdownButton: string;
  // validationMessagesService: any;
  // tslint:disable-next-line:max-line-length
  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.divShow = false;
    this.divShowDropdown = false;
    this.divShowClientDropdown = false;
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);

    this.getAllExpenceCategory();
    const rolesArr = KeycloakService.getUserRole();
  }

  ngOnInit() {
    // this.getAllExpenceCategory();
    this.addExpenseCategory = this.fb.group({
      labelExpense: [null, Validators.required],
      expenseType:[,Validators.required],
      categoryId: [],
      isDefault:[],
      // fieldName: [],
      // fieldType: [],
      // clientName: [],
      // clientFieldType: [],
      // dynamicTextField: [],
      // customClientName: [],
      // customClientFieldType: [],
      // expenseDynamicDropdown: [],
      expenseCustomField: this.fb.array([]),
      // expenseCustomClientDropdown: this.fb.array([this.initItemDropdownClientRows()])
      fieldMandatory: ['', Validators.required]
    });
  }
  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    },
      {
        type: 'success',
        position: 'fixed',
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
  updateCategories(element: any) {
    console.log(element);
    let expenseCategoryFields = [];
   
    element.expenseCategoryFields!= null?element.expenseCategoryFields.forEach(element1 => {
      let expenseDynamicDropdown = [];
      element1.dropDownList !=null? element1.dropDownList.forEach(element2 => {
        expenseDynamicDropdown.push({
          expenseDynamicDropdownHidden: element2,
        })
      }):'';
      expenseCategoryFields.push({
        expenseDynamicFieldName: element1.fieldName,
        expenseDynamicFieldType: element1.fieldType,
        expenseCustomDropdown: expenseDynamicDropdown
        // expenseCustomDropdown: this.fb.array(this.initItemDropdownRowsData(expenseDynamicDropdown))
      });
    }):'';
    this.addExpenseCategory.controls.expenseType.setValue(element.expenseType);
    this.addExpenseCategory.controls.labelExpense.setValue(element.expenseName);
    this.addExpenseCategory.controls.categoryId.setValue(element.categoryId);
    
    // con control = this.addExpenseCategory.get('expenseCustomField') as FormArray;
    // this.addExpenseCategory.controls.expenseCustomField = 
    
    // control[this.initItemRowsData(expenseCategoryFields)] ;
    this.addExpenseCategory.controls.fieldMandatory.setValue(''+element.fieldMandatory);
    this.addExpenseCategory.controls.isDefault.setValue(''+element.isDefault);
    // this.addExpenseCategory.controls['expenseCustomField'].patchValue(this.initItemRowsData(element.expenseCustomField))
  


    const control = <FormArray>this.addExpenseCategory.get("expenseCustomField");
    control.controls = [];
    for (let i of expenseCategoryFields) {
      
      // control.controls[i]['controls'].expenseDynamicFieldName.setValue(expenseCategoryFields[i].expenseDynamicFieldName);
      // control.controls[i]['controls'].expenseDynamicFieldType.setValue(expenseCategoryFields[i].);
    
    // control.controls[i]['controls'].expenseCustomDropdown.value = this.fb.array(this.initItemDropdownRowsData(expenseCategoryFields[i].expenseCustomDropdown));
    // let expenseCustomDropdownContol = control.controls[i]['controls'].expenseCustomDropdown  as FormArray;
    // for (let j = expenseCategoryFields[i].expenseCustomDropdown.length - 1; j >= 0; j--) {
    //   expenseCustomDropdownContol.controls = ;
    // }
    let expenseCustomDropdownControl = this.fb.array([]);
    expenseCustomDropdownControl.controls = [];
    for (let x of i.expenseCustomDropdown) {
      expenseCustomDropdownControl.push(this.fb.group({
        expenseDynamicDropdownHidden: x.expenseDynamicDropdownHidden
      }));
    }
    control.push(this.fb.group({
      expenseDynamicFieldName : i.expenseDynamicFieldName,
      expenseDynamicFieldType : i.expenseDynamicFieldType,
      expenseCustomDropdown : expenseCustomDropdownControl
    }))
    for(let j =0; j <= expenseCategoryFields.length - 1; j++){
      if(expenseCategoryFields[j].expenseCustomDropdown){ this.openTextField[j] = true;}
    }
  }
  console.log(this.addExpenseCategory);
  }


  initItemRowsData(fieldData:any,) {
    let fieldArray =[];
    fieldData.forEach(element1 => {
      fieldArray.push(
        this.fb.group({
          expenseDynamicFieldName: [element1.expenseDynamicFieldName, Validators.required],
          expenseDynamicFieldType: [element1.expenseDynamicFieldType, Validators.required],
          expenseCustomDropdown: this.fb.array(this.initItemDropdownRowsData(element1.expenseCustomDropdown))
        })
      );
    });
    return fieldArray;
  }
  initItemDropdownRowsData(data:any) {
    let array=[];
    data.forEach(element => {
     array.push(this.fb.group({
        expenseDynamicDropdownHidden: [element.expenseDynamicDropdownHidden,Validators.required]
      }));
    }); 
    return array;
  }

  updateExpenseCategories(addExpenseCategory: any) {
    console.log(addExpenseCategory);
    if (this.addExpenseCategory.valid) {
      const expenseCategoryFields = [];
      this.addExpenseCategory.controls.expenseCustomField.value.forEach(element => {
        let dropdown = [];
        element.expenseCustomDropdown.forEach(element1 => {
          dropdown.push(element1.expenseDynamicDropdownHidden);
        });
        expenseCategoryFields.push({
          "fieldName": element.expenseDynamicFieldName,
          "fieldType": element.expenseDynamicFieldType,
          "dropDownList": dropdown,
        });
      });
      const body = {
        "categoryId": this.addExpenseCategory.controls.categoryId.value,
        "expenseType": this.addExpenseCategory.controls.expenseType.value,
        "expenseName": this.addExpenseCategory.controls.labelExpense.value,
        "defualt": this.addExpenseCategory.controls.isDefault.value,
        "expenseCategoryFields": expenseCategoryFields,
        "fieldMandatory": this.addExpenseCategory.controls.fieldMandatory.value
      }
      this.serviceApi.put('/v1/expense/' + this.addExpenseCategory.controls.categoryId.value, body).
        subscribe(
          res => {
            console.log(res);
            this.successNotification(res.message);
            this.isLeftVisible = !this.isLeftVisible;
            this.getAllExpenceCategory();
          },
          err => {
          }, () => {
            this.dt.reset();
          });
    }
    else {
      console.log("----------");
      Object.keys(this.addExpenseCategory.controls).forEach(field => { // {1}
        const control = this.addExpenseCategory.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  getAllExpenceCategory() {
    this.expenseCategory = [];
    this.serviceApi.get('/v1/expense/').
      subscribe(
        res => {
          res.forEach(element => {
            this.expenseCategory.push(
              {
                categoryId: element.categoryId,
                expenseType: element.expenseType,
                expenseName: element.expenseName,
                isDefault: element.defualt,
                expenseCategoryFields: element.expenseCategoryFields,
                fieldMandatory: element.fieldMandatory,
                actions: ''
              });
          });
        },
        err => {
          if (err.status === 404 || err.statusText === 'OK') {
            this.expenseCategory = [];
          }
          console.log('No Company Policy Exist');
        },
        () => {
          this.dt.reset();
        }
      );
  }
  saveExpenseCategories() {
    this.checkVal = false;
    if (this.addExpenseCategory.valid) {
      const expenseName = this.addExpenseCategory.controls.labelExpense.value;
      const expenseType = this.addExpenseCategory.controls.expenseType.value;
      const expenseCategoryFields = [];
      this.addExpenseCategory.controls.expenseCustomField.value.forEach(element => {
        let dropdown = [];
        element.expenseCustomDropdown.forEach(element1 => {
          dropdown.push(element1.expenseDynamicDropdownHidden);
        });
        expenseCategoryFields.push({
          "fieldName": element.expenseDynamicFieldName,
          "fieldType": element.expenseDynamicFieldType,
          "dropDownList": dropdown,
        });
      });
      const body = {
        "expenseName": expenseName,
        "expenseType": expenseType,
        "defualt": false,
        "expenseCategoryFields": expenseCategoryFields,
        "fieldMandatory": this.addExpenseCategory.controls.fieldMandatory.value
      };
      this.serviceApi.post('/v1/expense/', body)
        .subscribe(
          res => {
            console.log('Generated Letter Successfully...' + JSON.stringify(res));
            this.successNotification('Category created Sucessfully');
          },
          error => {
            console.log('Something gone wrong -->' + error);
            this.warningNotification('Category updation Failed');
          },
          () => {
            this.isLeftVisible = !this.isLeftVisible;
            this.checkVal = true;
            this.checkVal = true;
            this.getAllExpenceCategory();
            this.setPanel();
            console.log('Enter into Else Bloack');
          },
        );
    } else {
      // alert("else block" + this.isLeftVisible);
      Object.keys(this.addExpenseCategory.controls).forEach(field => { // {1}
        const control = this.addExpenseCategory.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.isLeftVisible = true;
    }
  }
  deleteFixedAllowanceData(data: any) {
      const dialogRef = this.dialog.open(DeleteExpenseDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { categoryId: data.categoryId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
            }
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
            }
          }
          this.getAllExpenceCategory();
        }
        console.log('The dialog was closed');
      });
  }


  editAllowance(element: any) {
    console.log('Enter in Edit Section ' + element.allowanceType + element.pf);
    this.addExpenseCategory.controls.labelExpense.setValue(element.expense);
    this.updateButton = true;
    this.saveButton = false;
  }
  updateCategory() {
    $('.divtoggleDiv')[1].style.display = 'block';
    console.log('addFixedAllowance is called');
    this.addExpenseCategory.reset();
    this.form.resetForm();
    // let fieldControl = this.addExpenseCategory.get("expenseCustomField") as FormArray;
    // fieldControl.controls = [];
    // fieldControl.setValue([]);
    this.updateButton = true;
    this.backButton = true;
    this.saveButton = false;
  }
  addCategory() {
    this.form.resetForm();
    $('.divtoggleDiv')[1].style.display = 'block';
    console.log('addFixedAllowance is called');
    this.addExpenseCategory.reset();
    let fieldControl = this.addExpenseCategory.get("expenseCustomField") as FormArray;
    fieldControl.controls = [];
    fieldControl.setValue([]);
    // let  <FormArray>control.controls[i]['controls'].expenseCustomDropdown;
    // this.expenseCustomField.reset();
    // this.expenseCustomDropdown.reset();
    this.updateButton = false;
    this.backButton = true;
    this.saveButton = true;
  }
  cancelAddAllowanceForm() {
    this.backButton = false;
    this.addExpenseCategory.reset();
    // this.expenseCustomField.reset();
    // this.expenseCustomDropdown.reset();
    this.checkVal = true;
    this.form.resetForm();
    // let fieldControl = this.addExpenseCategory.get("expenseCustomField") as FormArray;
    // fieldControl.controls = [];
    // fieldControl.setValue([]);
    this.setPanel();
  }
  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';

      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }
  onClickSelectMerchantValue(value: any, i: number) {
    console.log('..... ' + value);
    if (value === 'DROPDOWN') {
      this.openTextField[i] = true;
      const control = (<FormArray>(<FormGroup>(<FormArray>this.addExpenseCategory.controls['expenseCustomField'])
        .controls[i]).controls['expenseCustomDropdown']);
      control.setValue([]);
      control.push(this.initItemDropdownRows());
      console.log(control);
    } else {
      const control = (<FormArray>(<FormGroup>(<FormArray>this.addExpenseCategory.controls['expenseCustomField'])
      .controls[i]).controls['expenseCustomDropdown']);
    // control.setValue([]);
    control.controls =[];
      this.openTextField[i] = false;
    }
    // console.log(this.addExpenseCategory.controls.expenseCustomField);
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
  initItemRows() {
    return this.fb.group({
      expenseDynamicFieldName: [, Validators.required],
      expenseDynamicFieldType: [, Validators.required],
      expenseCustomDropdown: this.fb.array([]),
    });
  }
  initItemDropdownRows() {
    return this.fb.group({
      expenseDynamicDropdownHidden: [],
    });
  }

  addNewRow() {
    console.log('...........');
    // this.divShow = true;
    const control = <FormArray>this.addExpenseCategory.controls['expenseCustomField'];
    control.clearValidators();
    control.push(this.initItemRows());
    control.updateValueAndValidity();
  }
  deleteRow(index: number) {
    const control = <FormArray>this.addExpenseCategory.controls['expenseCustomField'];
    control.removeAt(index);
  }
  addNewDropdownRow(customeFieldIndex: any) {
    // this.divShowDropdown = true;
    const control = (<FormArray>(<FormGroup>(<FormArray>this.addExpenseCategory.controls['expenseCustomField'])
      .controls[customeFieldIndex]).controls['expenseCustomDropdown']);
    control.push(this.initItemDropdownRows());
  }
  deleteDropdownRow(customeFieldIndex: any, index: number) {
    const control = (<FormArray>(<FormGroup>(<FormArray>this.addExpenseCategory.controls['expenseCustomField'])
      .controls[customeFieldIndex]).controls['expenseCustomDropdown']);
    control.removeAt(index);
  }
}
export interface Element {
  expenseName: string;
  actions: any;
  categoryId: any;
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-expense-dialog',
  templateUrl: 'delete-expense-category.html',
  styleUrls: ['delete-expense.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DeleteExpenseDialog {
  error = 'Error Message';
  action: any;
  categoryId: any;
  message: any;
  status: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteExpenseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.categoryId = this.data.categoryId;

  }
  authSignatoryId;
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    return this.serviceApi.delete('/v1/expense/' + this.categoryId)
      .subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        },
      );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}
