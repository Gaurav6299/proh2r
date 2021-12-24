import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { NgIf } from '@angular/common/src/directives/ng_if';
import { environment } from '../../../../../../environments/environment';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-employee-document-categories',
  templateUrl: './employee-document-categories.component.html',
  styleUrls: ['./employee-document-categories.component.scss']
})
export class EmployeeDocumentCategoriesComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  @ViewChild('documentForm') form;
  isLeftVisible = false;
  panelFirstWidth: any;
  panelFirstHeight: any;
  specificEmployeeHider: boolean;
  addMode: boolean;
  formHeaderName: any;
  addButtonShowHide: boolean;
  editButtonShowHide: boolean;
  selectedDocument: any;

  selectEmpCode = [];

  mySelectedEmpList = [];
  seletedEmployeesCode = [];

  selectedEmployee = new FormControl();

  myControl = new FormControl();
  employee = [];
  public addNewDocument: FormGroup;
  public editNewDocument: FormGroup;
  status: any;
  errorMessage: any;

  options = [];
  action: any;
  error = 'Error Message';
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdown;


  EmployeeDocument_DATA = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  catListData: any[];

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.getAllCategoryInformation();
    console.log('EmployeeDocumentCategoriesComponent constructor called');
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdown = message);

    this.specificEmployeeHider = false;
    this.getEmployee();
    this.addMode = false;
    const rolesArr = KeycloakService.getUserRole();
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        this.options = [];
        res.forEach(element => {
          console.log('>>>>>>>>>>>>>>' + element.bankName);
          this.options.push({
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName + ' ' + element.empCode,
          });
        });
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
  setDocumentCategory() {

  }

  getAllCategoryInformation() {
    this.catListData = [];
    this.serviceApi.get('/v1/emp/getAll').
      subscribe(
        res => {
          res.forEach(element => {
            this.catListData.push({
              categoryName: element.categoryName,
              categoryId: element.categoryId
            });
          });

        }, (err) => {

        }, () => {

        });
  }


  getEmployee() {
    this.employee = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employee.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + ' ' + element.empCode,
            });
          });
        }, () => {
          console.log('Enter into Else Bloack');
        });
  }

  searchEmployees(data: any) {
    console.log('my method called' + data);
    this.employee = this.options.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }

  ngOnInit() {
    this.getDocument();
    this.addNewDocument = this.fb.group({
      empDocRecordId: [],
      documentCategory: [Validators.required],
      documentName: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      documentDescription: ['', [
        this.validationMessagesService.alphaNumericValidation
      ]],
      accessLevel: [null, [Validators.required]],
      employeeType: [null, [Validators.required]],
      selectedEmployee: new FormControl({
        empCode: [],
      })
    });
  }

  ngAfterViewInit(): void {
    // console.log('EmployeeDocumentCategoriesComponent ngAfterViewInit called');
    // this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
    // console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
    // this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
    // console.log('panelDive[0] height 1 -->' + $('.divtoggleDiv')[0].offsetHeight);
    // $('.divtoggleDiv')[1].style.display = 'none';
  }
  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
    this.mySelectedEmpList = [];
    this.seletedEmployeesCode = [];

    // this.isLeftVisible = !this.isLeftVisible;
    // this.addNewDocument.reset();
  }

  backButtonFormReset() {
    this.isLeftVisible = false;
    this.myControl.reset();
    this.mySelectedEmpList = [];
    this.setPanel();
  }
  hideEmployee() {
    this.specificEmployeeHider = true;
  }
  selectEmployeeType() {
    this.selectEmpCode = [];
    this.specificEmployeeHider = false;

    const employeeType = this.addNewDocument.controls.employeeType.value;
    if (employeeType === 'SPECIFIC') {
      this.specificEmployeeHider = true;
      this.seletedEmployeesCode = [];
      this.selectedEmployee.setValidators([Validators.required]);
      this.addNewDocument.controls.selectedEmployee.setValue(null);
      // this.AddPolicyDocument.controls.selectedEmployee.setValidators([Validators.required]);
    } else {
      this.specificEmployeeHider = false;
      this.mySelectedEmpList = [];
      this.selectedEmployee.clearValidators();
      this.selectedEmployee.updateValueAndValidity();
      // this.AddPolicyDocument.controls.selectedEmployee.clearValidators();
      // this.AddPolicyDocument.controls.selectedEmployee.updateValueAndValidity();
      // this.addNewDocument.controls.selectedEmployee.setValue(null);
      this.addNewDocument.controls.selectedEmployee.setValue(null);
    }
  }

  addDocument() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addNewDocument.reset();
    this.formHeaderName = 'Add New';
    this.addButtonShowHide = true;
    this.editButtonShowHide = false;
    this.addNewDocument.reset();
    this.form.resetForm();
    this.isLeftVisible = true;
  }

  editDocument(data: any) {
    console.log(data);
      this.setPanel();
      this.isLeftVisible = true;
      this.addMode = false;
      $('.divtoggleDiv')[1].style.display = 'block';
      console.log(data);
      this.formHeaderName = ' Edit ';
      this.addButtonShowHide = false;
      this.editButtonShowHide = true;

      if (data.employeeType === 'ALL') {
        this.selectedEmployee.clearValidators();
        this.selectedEmployee.updateValueAndValidity();
      } else {
        this.selectedEmployee.setValidators([Validators.required]);
      }
      this.addNewDocument = this.fb.group({
        empDocRecordId: [data.empDocRecordId],
        documentCategory: [data.categoryId],
        documentName: [data.documentName, [
          Validators.required,
          this.validationMessagesService.alphaNumericValidation
        ]],
        documentDescription: [data.documentDescription, [
          this.validationMessagesService.alphaNumericValidation
        ]],
        accessLevel: [data.accessLevel, [Validators.required]],
        employeeType: [data.employeeType, [Validators.required]],
        selectedEmployee: data.selectEmpCode
      });

      let dObj = [];
      data.docCategoryAppliedOnEmps.forEach(element => {
        this.mySelectedEmpList.push(element.empCode);
        dObj.push({
          empCode: element.empCode
        });
        this.seletedEmployeesCode.push({
          empCode: element.empCode
        });
      });
      this.addNewDocument.controls.selectedEmployee.setValue(dObj);
  }

  getDocument() {
    this.EmployeeDocument_DATA = [];

    this.serviceApi.get('/v1/document/category').
      subscribe(
        res => {
          res.forEach(element => {
            this.EmployeeDocument_DATA.push({
              empDocRecordId: element.empDocRecordId,
              documentName: element.documentName,
              documentDescription: element.documentDescription,
              accessLevel: element.accessLevel,
              employeeType: element.employeeType,
              docCategoryAppliedOnEmps: element.docCategoryAppliedOnEmps,
              categoryName: element.categoryName,
              categoryId: element.categoryId
            });
          });
          // this.EmployeeDocumentdataSource = new MatTableDataSource(this.EmployeeDocument_DATA);
          // this.EmployeeDocumentdataSource.paginator = this.paginator;
          // this.EmployeeDocumentdataSource.sort = this.sort;
        }, err => {
          // if (err.status === 404 || err.statusText === 'OK') {
          //   EmployeeDocument_DATA = [];
          //   this.EmployeeDocumentdataSource = new MatTableDataSource(EmployeeDocument_DATA);
          // }
        }, () => {
          this.dt.reset();
        });

  }

  selectEmployeeCode(data: any, event: any) {
    console.log('>>>>>> ' + data);

    if (!this.seletedEmployeesCode.some(e => e.empCode === data)) {
      this.seletedEmployeesCode.push({
        empCode: data
      });
    } else {
      this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
        return el.empCode !== data;
      });

    }
    for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
      this.mySelectedEmpList[i] = this.seletedEmployeesCode[i].empCode;
    }
    console.log(this.mySelectedEmpList);
    if (this.seletedEmployeesCode.length === 0) {
      this.selectedEmployee.setValidators([Validators.required]);
      this.addNewDocument.controls.selectedEmployee.setValue(null);
    } else {
      this.addNewDocument.controls.selectedEmployee.setValue(this.seletedEmployeesCode);
    }

    // if (!this.seletedEmployeesCode.some(e => e === data)) {
    //   this.seletedEmployeesCode.push(data);
    // } else {
    //   console.log(' Enter else block');
    //   this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
    //     console.log(' El ---- ' + el);
    //     return el !== data;
    //   });
    // }
    // for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
    //   this.mySelectedEmpList[i] = this.seletedEmployeesCode[i];
    // }
    // this.selectEmpCode = [];
    // this.selectEmpCode = selectedEmployee.value;
    // console.log(selectedEmployee.value);
  }

  saveEmployeeDocument() {
    if (this.addNewDocument.controls.employeeType.value === 'ALL') {
      if (this.addNewDocument.valid) {
        this.isValidFormSubmitted = true;
        const docCategoryAppliedOnEmps = [];
        const employeeType = this.addNewDocument.controls.employeeType.value;
        if (employeeType === 'ALL') {
        } else if (employeeType === 'SPECIFIC') {
          this.selectedEmployee.value.forEach(selectedEmp => {
            docCategoryAppliedOnEmps.push(
              {
                'empCode': selectedEmp
              });
          });
        }
        const body = {
          'accessLevel': this.addNewDocument.controls.accessLevel.value,
          'documentDescription': this.addNewDocument.controls.documentDescription.value,
          'documentName': this.addNewDocument.controls.documentName.value,
          'employeeType': this.addNewDocument.controls.employeeType.value,
          'docCategoryAppliedOnEmps': docCategoryAppliedOnEmps,
        };
        console.log('BODY To save is:::::::::::' + JSON.stringify(body));
        this.serviceApi.post('/v1/document/category/' + this.addNewDocument.controls.documentCategory.value, body).subscribe(
          res => {
            this.successNotification('Document category created successfully');
            // this.isLeftVisible = !this.isLeftVisible;
          }, err => {
            this.warningNotification('Failed to create Document Category');
            console.log('there is something error.....  ' + err.message);
          }, () => {
            this.setPanel();
            this.getDocument();
            this.selectedEmployee.reset();
            this.isLeftVisible = false;
          });
      } else {
        Object.keys(this.addNewDocument.controls).forEach(field => { // {1}
          const control = this.addNewDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    } else if (this.addNewDocument.controls.employeeType.value === 'SPECIFIC') {
      if (this.addNewDocument.valid && this.selectedEmployee.valid) {
        this.isValidFormSubmitted = true;
        const docCategoryAppliedOnEmps = [];
        const employeeType = this.addNewDocument.controls.employeeType.value;
        if (employeeType === 'ALL') {
        } else if (employeeType === 'SPECIFIC') {
          this.selectedEmployee.value.forEach(selectedEmp => {
            docCategoryAppliedOnEmps.push(
              {
                'empCode': selectedEmp
              });
          });
        }
        const body = {
          'accessLevel': this.addNewDocument.controls.accessLevel.value,
          'documentDescription': this.addNewDocument.controls.documentDescription.value,
          'documentName': this.addNewDocument.controls.documentName.value,
          'employeeType': this.addNewDocument.controls.employeeType.value,
          'docCategoryAppliedOnEmps': docCategoryAppliedOnEmps,
        };
        console.log('BODY To save is:::::::::::' + JSON.stringify(body));
        this.serviceApi.post('/v1/document/category/' + this.addNewDocument.controls.documentCategory.value, body).subscribe(
          res => {
            this.successNotification('Document category created successfully');
            // this.isLeftVisible = !this.isLeftVisible;
          }, err => {
            this.warningNotification('Failed to create Document Category');
            console.log('there is something error.....  ' + err.message);
          }, () => {
            this.setPanel();
            this.getDocument();
            this.isLeftVisible = false;
            this.selectedEmployee.reset();
          });
      } else {
        Object.keys(this.addNewDocument.controls).forEach(field => { // {1}
          const control = this.addNewDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    } else {
      if (this.addNewDocument.valid) {
        this.isValidFormSubmitted = true;
        const docCategoryAppliedOnEmps = [];
        const employeeType = this.addNewDocument.controls.employeeType.value;
        if (employeeType === 'ALL') {
        } else if (employeeType === 'SPECIFIC') {
          this.selectedEmployee.value.forEach(selectedEmp => {
            docCategoryAppliedOnEmps.push(
              {
                'empCode': selectedEmp
              });
          });
        }
        const body = {
          'accessLevel': this.addNewDocument.controls.accessLevel.value,
          'documentDescription': this.addNewDocument.controls.documentDescription.value,
          'documentName': this.addNewDocument.controls.documentName.value,
          'employeeType': this.addNewDocument.controls.employeeType.value,
          'docCategoryAppliedOnEmps': docCategoryAppliedOnEmps,
        };
        console.log('BODY To save is:::::::::::' + JSON.stringify(body));
        this.serviceApi.post('/v1/document/category', body).subscribe(
          res => {
            this.successNotification('Document category created successfully');
            this.getDocument();
            // this.isLeftVisible = !this.isLeftVisible;
            this.setPanel();
          }, err => {
            this.warningNotification('Failed to create Document Category');
            console.log('there is something error.....  ' + err.message);
          });
      } else {
        Object.keys(this.addNewDocument.controls).forEach(field => { // {1}
          const control = this.addNewDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    }
  }

  updateEmployeeDocument() {
    if (this.addNewDocument.controls.employeeType.value === 'ALL') {
      if (this.addNewDocument.valid) {
        this.isValidFormSubmitted = true;
        const docCategoryAppliedOnEmps = [];
        const employeeType = this.addNewDocument.controls.employeeType.value;
        if (employeeType === 'ALL') {
        } else if (employeeType === 'SPECIFIC') {
          this.selectedEmployee.value.forEach(selectedEmp => {
            docCategoryAppliedOnEmps.push({
              'empCode': selectedEmp
            });
          });
        } else {
        }
        const val = this.addNewDocument.controls.empDocRecordId.value;
        console.log('Id Which is goning to Update ::: ' + val);
        const body = {
          'accessLevel': this.addNewDocument.controls.accessLevel.value,
          'docCategoryAppliedOnEmps': docCategoryAppliedOnEmps,
          'documentDescription': this.addNewDocument.controls.documentDescription.value,
          'documentName': this.addNewDocument.controls.documentName.value,
          'empDocRecordId': this.addNewDocument.controls.empDocRecordId.value,
          'employeeType': this.addNewDocument.controls.employeeType.value,
        };
        console.log('body is:-');
        console.log(JSON.stringify(body));

        this.serviceApi.put('/v1/document/' + body.empDocRecordId + '/' + this.addNewDocument.controls.documentCategory.value, body).subscribe(
          res => {
            this.successNotification('Document category Updated successfully');
          }, error => {
            this.warningNotification('Failed to update Document category');
            console.log('Something gone wrong -->' + error);
          }, () => {
            this.getDocument();
            this.setPanel();
            this.isLeftVisible = false;
            this.selectedEmployee.reset();
          });
      } else {
        Object.keys(this.addNewDocument.controls).forEach(field => { // {1}
          const control = this.addNewDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    } else if (this.addNewDocument.controls.employeeType.value === 'SPECIFIC') {
      if (this.addNewDocument.valid && this.selectedEmployee.valid) {
        this.isValidFormSubmitted = true;
        const docCategoryAppliedOnEmps = [];
        const employeeType = this.addNewDocument.controls.employeeType.value;
        // if (employeeType === 'ALL') {
        // } else if (employeeType === 'SPECIFIC') {
        //   this.selectedEmployee.value.forEach(selectedEmp => {
        //     docCategoryAppliedOnEmps.push({
        //       'empCode': selectedEmp
        //     });
        //   });
        // } else {
        // }
        const val = this.addNewDocument.controls.empDocRecordId.value;
        console.log('Id Which is goning to Update ::: ' + val);
        const body = {
          'accessLevel': this.addNewDocument.controls.accessLevel.value,
          'docCategoryAppliedOnEmps': this.addNewDocument.controls.selectedEmployee.value,
          'documentDescription': this.addNewDocument.controls.documentDescription.value,
          'documentName': this.addNewDocument.controls.documentName.value,
          'empDocRecordId': this.addNewDocument.controls.empDocRecordId.value,
          'employeeType': this.addNewDocument.controls.employeeType.value,
        };
        console.log('body is:-');
        console.log(JSON.stringify(body));

        this.serviceApi.put('/v1/document/' + body.empDocRecordId + "/" + this.addNewDocument.controls.documentCategory.value, body).subscribe(
          res => {
            this.successNotification('Document category Updated successfully');
          }, error => {
            this.warningNotification('Failed to update Document category');
            console.log('Something gone wrong -->' + error);
          }, () => {
            this.getDocument();
            this.setPanel();
            this.isLeftVisible = false;
            this.selectedEmployee.reset();
          });
      } else {
        Object.keys(this.addNewDocument.controls).forEach(field => { // {1}
          const control = this.addNewDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    } else {

    }
    // if (this.addNewDocument.valid) {
    //   this.isValidFormSubmitted = true;
    //   const docCategoryAppliedOnEmps = [];
    //   const employeeType = this.addNewDocument.controls.employeeType.value;
    //   if (employeeType === 'ALL') {
    //   } else if (employeeType === 'SPECIFIC') {
    //     this.selectedEmployee.value.forEach(selectedEmp => {
    //       docCategoryAppliedOnEmps.push({
    //         'empCode': selectedEmp
    //       });
    //     });
    //   } else {
    //   }
    //   const val = this.addNewDocument.controls.empDocRecordId.value;
    //   console.log('Id Which is goning to Update ::: ' + val);
    //   const body = {
    //     'accessLevel': this.addNewDocument.controls.accessLevel.value,
    //     'docCategoryAppliedOnEmps': docCategoryAppliedOnEmps,
    //     'documentDescription': this.addNewDocument.controls.documentDescription.value,
    //     'documentName': this.addNewDocument.controls.documentName.value,
    //     'empDocRecordId': this.addNewDocument.controls.empDocRecordId.value,
    //     'employeeType': this.addNewDocument.controls.employeeType.value,
    //   };
    //   console.log('body is:-');
    //   console.log(JSON.stringify(body));

    //   this.serviceApi.put('/v1/document/' + body.empDocRecordId, body).subscribe(
    //     res => {
    //       this.successNotification('Document category Updated successfully');
    //       this.getDocument();
    //       this.isLeftVisible = !this.isLeftVisible;
    //       this.setPanel();
    //     }, error => {
    //       this.warningNotification('Failed to update Document category');
    //       console.log('Something gone wrong -->' + error);
    //     }, () => {
    //     });
    // } else {
    //   Object.keys(this.addNewDocument.controls).forEach(field => { // {1}
    //     const control = this.addNewDocument.get(field);            // {2}
    //     control.markAsTouched({ onlySelf: true });       // {3}
    //   });
    // }
  }

  // tslint:disable-next-line:member-ordering
  // EmployeeDocumentColumns = ['documentName', 'documentCategory', 'employeeType', 'accessLevel', 'actions'];
  columns = [
    { field: 'documentName', header: 'Name' },
    { field: 'categoryName', header: 'Document Category' },
    { field: 'employeeType', header: 'Applies To' },
    { field: 'accessLevel', header: 'Employee Permissions' },
    { field: 'actions', header: 'Actions' },
  ]
  // tslint:disable-next-line:member-ordering
  EmployeeDocumentdataSource: MatTableDataSource<EmployeeDocument>;

  openDeleteDialog(data: any) {
      const dialogRef = this.dialog.open(DeleteEmpDocDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          empDocRecordId: data.empDocRecordId,
          message: this.errorMessage,
          status: this.action
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
            } else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }
          console.log('Enter in the Final Bloak for getting all values');
          this.getDocument();
        }
      });
  }
}
export interface EmployeeDocument {
  name: any;
  appliesTo: any;
  employeePermissions: any;
  actions: any;

}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-document-dialog',
  templateUrl: 'delete-document-dialog.html',
  styleUrls: ['delete-document.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DeleteEmpDocDialog {

  message: any;
  status: any;
  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteEmpDocDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.message = this.data.message;
    this.status = this.data.status;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    const val = this.data.empDocRecordId;
    return this.serviceApi.delete('/v1/document/' + val)

      .subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
          console.log('DeleteEmpDocDialog deleted successfully');
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


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-category-dialog',
  templateUrl: 'delete-category-dialog.html',
  styleUrls: ['delete-category.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DeleteCategoryDialog {

  message: any;
  status: any;
  error = 'Error Message';
  action: any;
  categoryId: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteEmpDocDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.message = this.data.message;
    this.status = this.data.status;
    this.categoryId = this.data.categoryId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    return this.serviceApi.delete('/v1/emp/doc/' + this.categoryId)

      .subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
          console.log('DeleteEmpDocDialog deleted successfully');
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

export interface CategoryDetailsData {
  bankName: string;
  accountNumber: string;
  bankCorporateId: string;
  companyId: string;
  ifscCode: string;
  accountID: number;
}
@Component({
  selector: 'category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  catListData = [];
  public data: any;
  myData: Array<any>;
  baseUrl = environment.baseUrl;
  notificationMsg: any;
  action: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  // displayedColumns = ['categoryName', 'categoryId'];
  columns = [
    { field: 'categoryName', header: 'Name' },
    { field: 'categoryId', header: 'Actions' },
  ]
  dataSource: MatTableDataSource<CategoryDetailsData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchValue = new FormControl();
  constructor(public dialog: MatDialog, private http: Http, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.getAllCategoryInformation();
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    const rolesArr = KeycloakService.getUserRole();
  }
  ngAfterViewInit() {

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
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  resetSearchField() {
    this.searchValue.reset();
  }

  ngOnInit() {

  }

  openAddCategoryDialog(): void {
    this.notificationMsg = '';
    this.action = '';
    const dialogRef = this.dialog.open(OrgAddCategory, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        message: this.notificationMsg,
        status: this.action
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
          this.getAllCategoryInformation();
        }

      }

    });
  }

  openEditableDialog(data: any) {
      this.notificationMsg = '';
      this.action = '';
      const dialogRef = this.dialog.open(OrgAddCategory, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          categoryName: data.categoryName,
          categoryId: data.categoryId,
          status: this.action,
          message: this.notificationMsg
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed....................' + result.message);
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
            this.getAllCategoryInformation();
          }

        }
      });
  }

  openDeleteDialog(value: any) {
      console.log(value);
      this.notificationMsg = '';
      this.action = '';
      console.log('Request for delete the Reocord Id ---------' + value.categoryId);
      const dialogRef = this.dialog.open(DeleteCategoryDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          categoryName: value.categoryName,
          categoryId: value.categoryId
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed....................' + result.message);
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
            this.getAllCategoryInformation();
          }
        }
      });
  }


  getAllCategoryInformation() {
    this.catListData = [];
    this.serviceApi.get('/v1/emp/getAll').
      subscribe(
        res => {
          res.forEach(element => {
            this.catListData.push({
              categoryName: element.categoryName,
              categoryId: element.categoryId
            });
          });

        }, (err) => {

        }, () => {
          this.dt.reset();
          // this.dataSource = new MatTableDataSource(this.catListData);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        });
  }
}

@Component({
  templateUrl: 'add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class OrgAddCategory implements OnInit {
  baseUrl = environment.baseUrl;
  saveButton: boolean;
  updateBtton: boolean;
  headerName: any;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  error = 'Error Message';
  action: any;
  public categoryInformationForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<OrgAddCategory>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    if (this.data.categoryId != null) {
      this.headerName = 'Edit';
      this.updateBtton = true;
      this.saveButton = false;
      this.categoryInformationForm = this._fb.group({
        categoryName: [this.data.categoryName, [Validators.required]],
        categoryId: [this.data.categoryId]
      });
    } else {
      this.headerName = 'Add New';
      this.updateBtton = false;
      this.saveButton = true;
      this.categoryInformationForm = this._fb.group({
        categoryName: ['', [Validators.required]],
        categoryId: [0]
      });
    }

  }
  ngOnInit() {

  }
  saveCategoryInformation(value: any) {
    const body = {
      'categoryName': this.categoryInformationForm.controls.categoryName.value,
    };

    if (this.categoryInformationForm.valid) {
      this.isValidFormSubmitted = true;
      // const body = this.bankInformationForm.value;
      console.log('Data Send For Save Signatory Information :::: ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/emp/doc/category', body)

        .subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          }, err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {
      Object.keys(this.categoryInformationForm.controls).forEach(field => { // {1}
        const control = this.categoryInformationForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  updateCategoryInformation(value: any) {
    console.log('>>>>>>>>>>>>>>>>Enter for Update <<<<<<<<<<<<<<<<<<<<<<<');
    const body = {
      'categoryName': this.categoryInformationForm.controls.categoryName.value,
      'categoryId': this.categoryInformationForm.controls.categoryId.value
    };

    if (this.categoryInformationForm.valid) {
      this.isValidFormSubmitted = true;
      // const body = this.bankInformationForm.value;
      const val = this.categoryInformationForm.controls.categoryId.value;
      console.log('Data Send For Update Bank Information Of ID :::::: ' + val + ' Body :::: ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/emp/doc/' + val, body)
        .subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          }, err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {
      Object.keys(this.categoryInformationForm.controls).forEach(field => { // {1}
        const control = this.categoryInformationForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}