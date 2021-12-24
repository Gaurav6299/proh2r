import { Component, OnInit, Pipe, Input, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { NgIf } from '@angular/common/src/directives/ng_if';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { UploadFileService } from '../../../../../services/UploadFileService.service';
import { HttpClient, HttpResponse, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { VALID } from '@angular/forms/src/model';
import { MatChipInputEvent } from '@angular/material';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { FileValidator } from './file-input.validator';
import { delay } from 'rxjs/operators';
import { DataTable } from 'primeng/primeng';

declare var $: any;

@Component({
  selector: 'app-company-policy-documents',
  templateUrl: './company-policy-documents.component.html',
  styleUrls: ['./company-policy-documents.component.scss']
})
export class CompanyPolicyDocumentsComponent implements OnInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  selectedFiles: FileList;
  currentFileUpload: File;
  @ViewChild("dt1") dt: DataTable;
  tableDataArray = [];
  public AddPolicyDocument: FormGroup;

  addButtonShowHide: boolean;
  updateButtonShowHide: boolean;
  formHeaderName: any;
  specificEmployeeHider: boolean;
  options = [];

  selectedEmployee = new FormControl();
  myControl = new FormControl();
  employeeList = [];
  downloadDocumentLinkUrl: any;

  mySelectedEmpList = [];
  seletedEmployeesCode = [];

  status: any;
  errorMessage: any;
  action: any;
  notificationMsg: any;
  error = 'Error Message';
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdown;
  editFormBody: any;
  empCode: string;

  allSelections = [];

  employeeStatus: EmployeeStatus[] = [];

  selectUploadFileStatus: boolean;

  mouseEvent: any;
  isLeftVisible = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService,
    private uploadFileService: UploadFileService, private validationMessagesService: ValidationMessagesService) {
    console.log('CompanyPolicyDocumentsComponent constructor called');
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdown = message);
    this.getAllTableData();
    const rolesArr = KeycloakService.getUserRole();
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
    this.getCriteria();
  }


  setPanel() {

    // this.AddPolicyDocument.reset();
    // this.mySelectedEmpList = [];
    // this.seletedEmployeesCode = [];
  }



  downloadFunction(element: any) {
    window.open(element.documentUrl);
  }

  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations()
  }

  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").pipe(delay(500)).subscribe(
      res => {
        res.forEach(element => {
          // var elemets = { id: element.deptId, type: 'Departments' };
          // console.log(elemets);
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
              viewValue: element.locationCode + ' - ' + element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }

  getAllTableData() {
    this.tableDataArray = [];
    this.serviceApi.get2('/v1/document/policy/').subscribe(
      res => {
        console.log('response:::');
        console.log(JSON.stringify(res));
        if (res != null) {
          res.forEach(element => {
            this.tableDataArray.push({
              compPolicyDocId: element.compPolicyDocId,
              documentName: element.documentName,
              documentDescription: element.documentDescription,
              createdDate: element.createdDate,
              modifiedDate: element.modifiedDate,
              accessLevel: element.accessLevel,
              employeeType: element.employeeType,
              documentId: element.documentId,
              documentUrl: element.documentUrl,
              selectedEmployees: element.selectedEmployees,
              departmentId: element.departmentIds,
              locationId: element.locationIds,
              designationId: element.designationIds,
              bandId: element.bandIds
            });
          });
          // this.CompanyPolicydataSource = new MatTableDataSource(tableDataArray);
          // this.CompanyPolicydataSource.paginator = this.paginator;
          // this.CompanyPolicydataSource.sort = this.sort;
        }
      }, err => {
        if (err.status === 404 || err.statusText === 'OK') {
          // const tableDataArray1 = [];
          // this.CompanyPolicydataSource = new MatTableDataSource(tableDataArray1);
        }
        console.log('No Company Policy Exist');
      }, () => {
        this.dt.reset();
      });
  }



  openAddCompanyPolicyDialog() {
    this.notificationMsg = '';
    this.action = 'Add';
    const dialogRef = this.dialog.open(OrgAddCompanyPolicyDocumentInfoComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        compPolicyDocId: [],
        documentName: [],
        documentDescription: [],
        createdDate: [],
        modifiedDate: [],
        accessLevel: [],
        employeeType: [],
        documentId: [],
        documentUrl: [],
        selectedEmployee: [],
        filterSelection: this.allSelections,
        message: this.notificationMsg,
        status: this.action
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);

      console.log('Result value ..... ' + JSON.stringify(result));
      if (result !== undefined) {
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

            this.getAllTableData();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }

    });

  }


  openEditCompanyPolicyDialog(element: any) {
    this.downloadDocumentLinkUrl = element.documentUrl;
      console.log(' The Data In Edit Section ::: ' + element);
      this.notificationMsg = '';
      this.action = 'Edit';
      const dialogRef = this.dialog.open(OrgEditCompanyPolicyDocumentInfoComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          compPolicyDocId: element.compPolicyDocId,
          documentName: element.documentName,
          documentDescription: element.documentDescription,
          createdDate: element.createdDate,
          modifiedDate: element.modifiedDate,
          accessLevel: element.accessLevel,
          employeeType: element.employeeType,
          documentId: element.documentId,
          documentUrl: element.documentUrl,
          selectedEmployee: element.selectedEmployees,
          locationId: element.locationId,
          departmentId: element.departmentId,
          designationId: element.designationId,
          bandId: element.bandId,
          filterSelection: this.allSelections,
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

              this.getAllTableData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
      });
  }


  openDeleteDialog(data: any) {
      const dialogRef = this.dialog.open(DeleteCompanyDocDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { compPolicyDocId: data.compPolicyDocId, message: this.errorMessage, status: this.action }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
              this.getAllTableData();
            } else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }
        }
        console.log('The dialog was closed');
      });
  }

  // tslint:disable-next-line:member-ordering
  // CompanyPolicyColumns = ['documentName', 'employeeType', 'accessLevel',
  //   'modifiedDate', 'compPolicyDocId'];
  columns = [
    { field: 'documentName', header: 'Name' },
    { field: 'employeeType', header: 'Applies To' },
    { field: 'accessLevel', header: 'Employee Permissions' },
    { field: 'modifiedDate', header: 'Last Updated On' },
    { field: 'compPolicyDocId', header: 'Actions' },
  ]
  // tslint:disable-next-line:member-ordering
  CompanyPolicydataSource = new MatTableDataSource<CompanyPolicy>(CompanyPolicy_DATA);

  addNewDocument() {
  }
}
export interface CompanyPolicy {
  compPolicyDocId: any;
  documentName: any;
  documentDescription: any;
  createdDate: any;
  modifiedDate: any;
  accessLevel: any;
  employeeType: any;
  documentId: any;
  documentUrl: any;
  selectedEmployee: any;
}

const CompanyPolicy_DATA: CompanyPolicy[] = [];





@Component({
  templateUrl: 'add-policy-documents-component.html',
  styleUrls: ['document-dialog.scss']
})
export class OrgAddCompanyPolicyDocumentInfoComponent implements OnInit {
  baseUrl = environment.baseUrl;
  saveButton: boolean;
  updateBtton: boolean;
  headerName: any;
  employeeList = [];
  employeeListCopy = [];
  myControl = new FormControl();
  selectedFiles: FileList;
  currentFileUpload: File;
  selectUploadFileStatus: any = true;
  showFileUploadError: boolean = false;
  selectedEmployee = new FormControl();
  mySelectedEmpList = [];
  seletedEmployeesCode = [];
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  filterSelection = [];
  public AddPolicyDocument: FormGroup;
  error = 'Error Message';
  action: any;
  formData: any;
  deptIds: string | Blob;
  showErrorMessage: boolean = true;
  errShow: boolean = true;
  constructor(private _cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<OrgAddCompanyPolicyDocumentInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder,
    private uploadFileService: UploadFileService, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {

    this.filterSelection = data.filterSelection;
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.getAllEmployeeList();
    this.formData = data;
    console.log('Enter in the Constructor For Object initialization ::: ' + this.formData);
  }

  ngOnInit() {
    this.AddPolicyDocument = this._fb.group({
      compPolicyDocId: [],
      documentName: [null, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      file: ["", [FileValidator.validate]],
      documentDescription: [null, [
        this.validationMessagesService.alphaNumericValidation
      ]],
      accessLevel: [null, [Validators.required]],
      // ackType: [null, [Validators.required]],
      employeeType: [null, [Validators.required]],
      // seletedEmployee: [],
      allSelections: []
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

  onFileChange(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.AddPolicyDocument.patchValue({
          file: reader.result
        });

        // need to run CD since file load runs outside of zone
        this._cdr.markForCheck();
      };
    }
  }

  getAllEmployeeList() {
    this.employeeList = [];
    this.employeeListCopy = [];
    return this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element1 => {
          this.employeeList.push({
            value: element1.empCode,
            viewValue: element1.empFirstName + ' ' + element1.empLastName + '-' + element1.empCode
          });
          this.filterSelection = [...this.filterSelection, {
            value: element1.empCode,
            viewValue: element1.empFirstName + ' ' + element1.empLastName + '-' + element1.empCode,
            type: 'Employees'
          }];
          this.employeeListCopy.push({
            value: element1.empCode,
            viewValue: element1.empFirstName + ' ' + element1.empLastName + '-' + element1.empCode
          });

        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }


  selectSpecificEmp() {
    const employeeType = this.AddPolicyDocument.controls.employeeType.value;
    if (employeeType === 'SPECIFIC') {
      this.AddPolicyDocument.controls.allSelections.reset();
      // this.seletedEmployeesCode = [];
      // this.selectedEmployee.setValidators([Validators.required]);
      // this.AddPolicyDocument.controls.seletedEmployee.setValidators([Validators.required]);
      this.AddPolicyDocument.controls.allSelections.setValidators([Validators.required]);
      // this.AddPolicyDocument.controls.selectedEmployee.setValidators([Validators.required]);
    } else {
      // this.mySelectedEmpList = [];
      // this.selectedEmployee.clearValidators();
      // this.AddPolicyDocument.controls.seletedEmployee.clearValidators();
      this.AddPolicyDocument.controls.allSelections.clearValidators();
      // this.AddPolicyDocument.controls.selectedEmployee.clearValidators();
      // this.AddPolicyDocument.controls.selectedEmployee.updateValueAndValidity();
      // this.AddPolicyDocument.controls.seletedEmployee.setValue(null);
    }

    this.AddPolicyDocument.controls.allSelections.updateValueAndValidity();
    // this.AddPolicyDocument.controls.seletedEmployee.updateValueAndValidity();
    // this.selectedEmployee.updateValueAndValidity();
  }

  searchEmployeeName(data: any) {
    console.log('my method called' + data);
    this.employeeList = this.employeeListCopy.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }

  selectEmpCode(data: any, event: any) {
    if (!this.seletedEmployeesCode.some(e => e === data)) {
      this.seletedEmployeesCode.push(data);
    } else {
      console.log(' Enter else block');
      this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
        console.log(' El ---- ' + el);
        return el !== data;
      });
    }
    for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
      this.mySelectedEmpList[i] = this.seletedEmployeesCode[i];
    }
    const data1 = this.seletedEmployeesCode.join(',');
    this.AddPolicyDocument.controls.seletedEmployee.setValue(data1);
  }

  // selectFile(event) {
  //   this.selectedFiles = event.target.files;
  //   console.log(this.selectedFiles);
  //   console.log(this.selectedFiles);
  //   if (this.selectedFiles.length === 1) {
  //     this.showFileUploadError = false;
  //   }else{
  //     this.showFileUploadError = true;
  //   }
  // }


  onClickResetSearch_Array() {
    this.myControl.setValue('');
    this.employeeList = this.employeeListCopy;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.currentFileUpload = file;
    }
  }

  saveCompanyPolicyDocument() {
    console.log('saveCompanyPolicyDocument called');
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    let selectedEmployees = [];
    if (this.AddPolicyDocument.controls.employeeType.value === 'ALL') {
      if (this.AddPolicyDocument.valid) {
        this.isValidFormSubmitted = true;
        // this.currentFileUpload = this.AddPolicyDocument.controls.file.value;
        let formData = new FormData();
        const file = <File>this.currentFileUpload;
        console.log('form value ' + JSON.stringify(this.AddPolicyDocument.value));
        formData.append("documentName", this.AddPolicyDocument.controls.documentName.value);
        formData.append("documentDescription", this.AddPolicyDocument.controls.documentDescription.value);
        formData.append("accessLevel", this.AddPolicyDocument.controls.accessLevel.value);
        formData.append("mandatory", 'false');
        formData.append("seletedEmployee", '0');
        formData.append("employeeType", this.AddPolicyDocument.controls.employeeType.value);
        // formData.append("departmentid", null);
        // formData.append("bandId", null);
        // formData.append("designationId", null);
        // formData.append("locationId", null);
        if (file !== undefined) { formData.append("file", file, file.name); }
        console.log(formData);
        let selectedEmployee = '';
        this.serviceApi.postWithFormData('/v1/document/policy/', formData).subscribe(
          res => {
            console.log(event);
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            // this.close();
          },
          () => {
            console.log('Enter in the Fincal Block');
            formData = null;
          });
      } else {
        Object.keys(this.AddPolicyDocument.controls).forEach(field => { // {1}
          const control = this.AddPolicyDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });
        });
      }
    } else if (this.AddPolicyDocument.controls.employeeType.value === 'SPECIFIC') {
      // if (this.seletedEmployeesCode.length < 1) {
      //   this.selectedEmployee.setValue(null);
      // }

      if (this.AddPolicyDocument.controls.allSelections.valid) {
        this.AddPolicyDocument.controls.allSelections.clearValidators();
      }
      this.AddPolicyDocument.controls.allSelections.updateValueAndValidity();

      if (this.AddPolicyDocument.valid) {
        this.isValidFormSubmitted = true;
        // this.currentFileUpload = this.AddPolicyDocument.controls.file.value;

        console.log(this.AddPolicyDocument.controls.allSelections);
        let selections = this.AddPolicyDocument.controls.allSelections.value;
        if (selections != null && selections.length > 0) {
          selections.forEach(element => {
            if (element.type === 'Departments') {
              deptIds.push(element.value);
            } else if (element.type === 'Bands') {
              bandIds.push(element.value);
            } else if (element.type === 'Designations') {
              designationIds.push(element.value)
            } else if (element.type === 'Employees') {
              selectedEmployees.push(element.value)
            } else {
              locationIds.push(element.value);
            }
          });
        }
        let fc1 = new FormControl();
        let fc2 = new FormControl();
        let fc3 = new FormControl();
        let fc4 = new FormControl();
        let fc5 = new FormControl();
        fc1.setValue(deptIds);
        fc2.setValue(bandIds);
        fc3.setValue(designationIds);
        fc4.setValue(locationIds);
        fc5.setValue(selectedEmployees);
        let formData = new FormData();
        const file = <File>this.currentFileUpload;
        console.log('form value ' + JSON.stringify(this.AddPolicyDocument.value));
        formData.append("documentName", this.AddPolicyDocument.controls.documentName.value);
        formData.append("documentDescription", this.AddPolicyDocument.controls.documentDescription.value);
        formData.append("accessLevel", this.AddPolicyDocument.controls.accessLevel.value);
        formData.append("mandatory", 'false');
        formData.append("employeeType", this.AddPolicyDocument.controls.employeeType.value);
        deptIds.length > 0 ? formData.append("departmentId", fc1.value) : '';
        bandIds.length > 0 ? formData.append("bandId", fc2.value) : '';
        designationIds.length > 0 ? formData.append("designationId", fc3.value) : '';
        locationIds.length > 0 ? formData.append("locationId", fc4.value) : '';
        selectedEmployees.length > 0 ? formData.append("selectedEmployee", fc5.value) : '';

        if (file !== undefined) { formData.append("file", file, file.name); }
        console.log(formData);
        let selectedEmployee = '';


        this.serviceApi.postWithFormData('/v1/document/policy/', formData).subscribe(
          res => {
            console.log(event);
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            // this.close();
          },
          () => {
            console.log('Enter in the Fincal Block');
            formData = null;
          });
      } else {
        Object.keys(this.AddPolicyDocument.controls).forEach(field => { // {1}
          const control = this.AddPolicyDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });                    // {3}
        });
        if (this.AddPolicyDocument.controls.allSelections.value !== null) {
          this.errShow = true;
        } else {
          this.errShow = false;
        }
      }

    } else {
      Object.keys(this.AddPolicyDocument.controls).forEach(field => { // {1}
        const control = this.AddPolicyDocument.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });                    // {3}
      });

    }


  }

  close(): void {
    this.AddPolicyDocument.reset();
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.AddPolicyDocument.reset();
    this.dialogRef.close(this.data);
  }
}



@Component({
  templateUrl: 'edit-policy-documents-component.html',
  styleUrls: ['document-dialog.scss']
})

export class OrgEditCompanyPolicyDocumentInfoComponent implements OnInit {
  baseUrl = environment.baseUrl;
  saveButton: boolean;
  updateBtton: boolean;
  headerName: any;

  employeeList = [];
  employeeListCopy = [];
  myControl = new FormControl();

  selectedFiles: FileList;
  currentFileUpload: File;

  selectUploadFileStatus: boolean;

  selectedEmployee = new FormControl();

  mySelectedEmpList = [];
  seletedEmployeesCode = [];

  isValidFormSubmitted = true;
  downloadDocumentLinkUrl: any;

  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;

  filterSelection = [];
  allSelections = [];


  public AddPolicyDocument: FormGroup;
  error = 'Error Message';
  action: any;

  formData: any;
  showErrorMessage: boolean = true;
  constructor(private _cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<OrgEditCompanyPolicyDocumentInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder,
    private uploadFileService: UploadFileService, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.getAllEmployeeList();
    this.formData = data;
    this.filterSelection = data.filterSelection;
    data.departmentId != null ? data.departmentId.forEach(element => {
      this.allSelections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Departments'
      });
    }) : '';
    data.bandId != null ? data.bandId.forEach(element => {
      this.allSelections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Bands'
      });
    }) : '';
    data.locationId != null ? data.locationId.forEach(element => {
      this.allSelections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Locations'
      });
    }) : '';
    data.designationId != null ? data.designationId.forEach(element => {
      this.allSelections.push({
        value: element.id,
        viewValue: element.name,
        type: 'Designations'
      });
    }) : '';
    data.selectedEmployee != null ? data.selectedEmployee.forEach(element => {
      this.allSelections.push({
        value: element.empCode,
        viewValue: element.name,
        type: 'Employees'
      });
    }) : '';
    console.log(this.filterSelection);
    console.log('Enter in the Constructor For Object initialization ::: ' + this.formData);
    console.log('Enter in the Constructor For Object initialization ::: ' + this.formData.compPolicyDocId);
    console.log('Enter in the Constructor For Object initialization ::: ' + this.formData.status);
  }
  onFileChange(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.AddPolicyDocument.patchValue({
          file: reader.result
        });

        // need to run CD since file load runs outside of zone
        this._cdr.markForCheck();
      };
    }
  }

  ngOnInit() {

    this.AddPolicyDocument = this._fb.group({
      compPolicyDocId: [this.formData.compPolicyDocId],
      documentName: [this.formData.documentName, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      documentDescription: [this.formData.documentDescription, [
        this.validationMessagesService.alphaNumericValidation
      ]],
      file: [this.formData.documentId],
      accessLevel: [this.formData.accessLevel, [Validators.required]],
      // ackType: [this.formData.ackType, [Validators.required]],
      employeeType: [this.formData.employeeType, [Validators.required]],
      // seletedEmployee: [this.formData.selectedEmployee],
      allSelections: [this.allSelections]
    });

    if (this.AddPolicyDocument.controls.employeeType.value == 'SPECIFIC') {
      // this.selectedEmployee.setValidators([Validators.required]);
      // this.AddPolicyDocument.controls.seletedEmployee.setValidators([Validators.required]);
      this.AddPolicyDocument.controls.allSelections.setValidators([Validators.required]);
    }


    // this.formData.selectedEmployee.forEach(element => {
    //   this.mySelectedEmpList.push(element.empCode);
    //   this.seletedEmployeesCode.push(element.empCode);
    // });

    // if (this.formData.employeeType === 'ALL') {
    //   this.selectedEmployee.clearValidators();
    //   this.selectedEmployee.updateValueAndValidity();
    //   this.AddPolicyDocument.controls.seletedEmployee.setValue(null);
    // } else if (this.formData.employeeType === 'SPECIFIC') {
    //   this.selectedEmployee.setValidators([Validators.required]);
    //   const da = this.mySelectedEmpList.join(',');
    //   this.AddPolicyDocument.controls.seletedEmployee.setValue(da);
    //   this.showErrorMessage = true;
    // }
    this.downloadDocumentLinkUrl = this.formData.documentUrl;



    // console.log(this.formData.selectedEmployee.value);

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


  downloadCompanyPolicyDoc() {
    window.open(this.downloadDocumentLinkUrl);
  }


  getAllEmployeeList() {
    this.employeeList = [];
    this.employeeListCopy = [];
    return this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element1 => {
          this.employeeList.push({
            value: element1.empCode,
            viewValue: element1.empFirstName + ' ' + element1.empLastName + '-' + element1.empCode
          });
          this.filterSelection = [...this.filterSelection, {
            value: element1.empCode,
            viewValue: element1.empFirstName + ' ' + element1.empLastName + '-' + element1.empCode,
            type: 'Employees'
          }];

          this.employeeListCopy.push({
            value: element1.empCode,
            viewValue: element1.empFirstName + ' ' + element1.empLastName + '-' + element1.empCode
          });

        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }



  selectSpecificEmp() {
    const employeeType = this.AddPolicyDocument.controls.employeeType.value;

    if (this.AddPolicyDocument.controls.employeeType.value === 'SPECIFIC') {
      this.seletedEmployeesCode = [];
      // this.selectedEmployee.setValidators([Validators.required]);
      // this.AddPolicyDocument.controls.seletedEmployee.setValidators([Validators.required]);
      this.AddPolicyDocument.controls.allSelections.setValidators([Validators.required]);

      // this.AddPolicyDocument.controls.selectedEmployee.setValidators([Validators.required]);
    } else {
      this.mySelectedEmpList = [];
      // this.selectedEmployee.clearValidators();
      // this.AddPolicyDocument.controls.seletedEmployee.clearValidators();
      this.AddPolicyDocument.controls.allSelections.clearValidators();


      // this.AddPolicyDocument.controls.selectedEmployee.clearValidators();
      // this.AddPolicyDocument.controls.selectedEmployee.updateValueAndValidity();
      // this.AddPolicyDocument.controls.seletedEmployee.setValue(null);
      this.AddPolicyDocument.controls.allSelections.setValue([]);
    }
    this.AddPolicyDocument.controls.allSelections.updateValueAndValidity();
    // this.AddPolicyDocument.controls.seletedEmployee.updateValueAndValidity();
    // this.selectedEmployee.updateValueAndValidity();
  }

  onClickResetSearch_Array() {
    this.myControl.setValue('');
    this.employeeList = this.employeeListCopy;
  }

  searchEmployeeName(data: any) {
    console.log('my method called' + data);
    this.employeeList = this.employeeListCopy.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }

  selectEmpCode(data: any, event: any) {
    if (!this.seletedEmployeesCode.some(e => e === data)) {
      this.seletedEmployeesCode.push(data);
    } else {
      console.log(' Enter else block');
      this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
        console.log(' El ---- ' + el);
        return el !== data;
      });
    }
    for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
      this.mySelectedEmpList[i] = this.seletedEmployeesCode[i];
    }
    const data1 = this.seletedEmployeesCode.join(',');
    this.AddPolicyDocument.controls.seletedEmployee.setValue(data1);
  }

  // selectFile(event) {
  //   this.selectedFiles = event.target.files;
  //   console.log(this.selectedFiles);
  //   console.log(this.selectedFiles);
  //   if (this.selectedFiles.length === 1) {
  //     this.selectUploadFileStatus = false;
  //   } else if (this.selectedFiles.length === 0) {
  //     this.selectUploadFileStatus = true;
  //   } else {

  //   }
  // }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.currentFileUpload = file;
    }
  }

  UpdateCompanyPolicyDocument() {
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    let selectedEmployees = [];
    if (this.AddPolicyDocument.controls.employeeType.value === 'ALL') {
      if (this.AddPolicyDocument.valid) {
        this.isValidFormSubmitted = true;
        // this.currentFileUpload = this.AddPolicyDocument.controls.file.value.item(0);
        let formData = new FormData();
        const file = <File>this.currentFileUpload;
        console.log('form value ' + JSON.stringify(this.AddPolicyDocument.value));
        formData.append("compPolicyDocId", this.AddPolicyDocument.controls.compPolicyDocId.value);
        formData.append("documentName", this.AddPolicyDocument.controls.documentName.value);
        formData.append("documentDescription", this.AddPolicyDocument.controls.documentDescription.value);
        formData.append("accessLevel", this.AddPolicyDocument.controls.accessLevel.value);
        formData.append("mandatory", 'false');
        formData.append("seletedEmployee", '0');
        formData.append("employeeType", this.AddPolicyDocument.controls.employeeType.value);
        formData.append("documentId", this.AddPolicyDocument.controls.file.value);
        // formData.append("departmentid", JSON.stringify(deptIds));
        // formData.append("bandId", JSON.stringify(bandIds));
        // formData.append("designationId", JSON.stringify(designationIds));
        // formData.append("locationId", JSON.stringify(locationIds));
        if (file !== undefined) {
          formData.append("file", file, file.name);
        }
        this.serviceApi.putWithFormData('/v1/document/policy/' + this.AddPolicyDocument.controls.compPolicyDocId.value, formData).subscribe(
          res => {
            console.log(event);
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            // this.close();
          },
          () => {
            console.log('Enter in the Fincal Block');
          });

      }
      else {
        Object.keys(this.AddPolicyDocument.controls).forEach(field => { // {1}
          const control = this.AddPolicyDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });
        });
      }
    }
    if (this.AddPolicyDocument.controls.employeeType.value === 'SPECIFIC') {
      if (this.seletedEmployeesCode.length === 0) {
        this.selectedEmployee.setValue(null);
        // tslint:disable-next-line:no-unused-expression
        this.selectedEmployee.invalid;
      }
      if (this.AddPolicyDocument.controls.allSelections.valid) {
        //   this.AddPolicyDocument.controls.seletedEmployee.clearValidators();
        // } 
        // if (this.AddPolicyDocument.controls.seletedEmployee.valid) {
        this.AddPolicyDocument.controls.allSelections.clearValidators();
      }
      this.AddPolicyDocument.controls.allSelections.updateValueAndValidity();
      // this.AddPolicyDocument.controls.seletedEmployee.updateValueAndValidity();
      if (this.AddPolicyDocument.valid) {
        this.isValidFormSubmitted = true;
        console.log(this.AddPolicyDocument.controls.allSelections);
        let selections = this.AddPolicyDocument.controls.allSelections.value;
        if (selections != null && selections.length > 0) {
          selections.forEach(element => {
            if (element.type === 'Departments') {
              deptIds.push(element.value);
            } else if (element.type === 'Bands') {
              bandIds.push(element.value);
            } else if (element.type === 'Designations') {
              designationIds.push(element.value)
            } else if (element.type === 'Designations') {
              designationIds.push(element.value)
            } else if (element.type === 'Employees') {
              selectedEmployees.push(element.value)
            } else {
              locationIds.push(element.value);
            }
          });
        }
        let fc1 = new FormControl()
        let fc2 = new FormControl()
        let fc3 = new FormControl()
        let fc4 = new FormControl()
        let fc5 = new FormControl()
        fc1.setValue(deptIds);
        fc2.setValue(bandIds);
        fc3.setValue(designationIds)
        fc4.setValue(locationIds);
        fc5.setValue(selectedEmployees);
        let formData = new FormData();
        // this.currentFileUpload = this.AddPolicyDocument.controls.file.value.item(0);
        const file = <File>this.currentFileUpload;
        console.log('form value ' + JSON.stringify(this.AddPolicyDocument.value));
        formData.append("compPolicyDocId", this.AddPolicyDocument.controls.compPolicyDocId.value);
        formData.append("documentName", this.AddPolicyDocument.controls.documentName.value);
        formData.append("documentDescription", this.AddPolicyDocument.controls.documentDescription.value);
        formData.append("accessLevel", this.AddPolicyDocument.controls.accessLevel.value);
        formData.append("mandatory", 'false');
        // formData.append("selectedEmployee", this.AddPolicyDocument.controls.seletedEmployee.value);
        formData.append("employeeType", this.AddPolicyDocument.controls.employeeType.value);
        deptIds.length > 0 ? formData.append("departmentId", fc1.value) : '';
        bandIds.length > 0 ? formData.append("bandId", fc2.value) : '';
        designationIds.length > 0 ? formData.append("designationId", fc3.value) : '';
        locationIds.length > 0 ? formData.append("locationId", fc4.value) : '';
        selectedEmployees.length > 0 ? formData.append("selectedEmployee", fc5.value) : '';
        if (file !== undefined) { formData.append("file", file, file.name); }
        console.log(formData);
        let selectedEmployee = '';

        this.serviceApi.putWithFormData('/v1/document/policy/' + this.AddPolicyDocument.controls.compPolicyDocId.value, formData).subscribe(
          res => {
            console.log(event);
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            // this.close();
          }, () => {
            console.log('Enter in the Fincal Block');
          });
      }
      else {
        Object.keys(this.AddPolicyDocument.controls).forEach(field => { // {1}
          const control = this.AddPolicyDocument.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
        if (!this.AddPolicyDocument.controls.allSelections.valid || !this.AddPolicyDocument.controls.seletedEmployee.valid) {
          this.showErrorMessage = false;
          // this.warningNotification("Please select either specfic employee or Locations, Departments, Bands, Designations.");
        }
      }
    }
    else {
      Object.keys(this.AddPolicyDocument.controls).forEach(field => { // {1}
        const control = this.AddPolicyDocument.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });
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



@Component({
  templateUrl: 'delete-com-policy-dialog.html',
  styleUrls: ['document-dialog.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class DeleteCompanyDocDialog {
  message: any;
  status: any;
  error: any;
  action: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteCompanyDocDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.message = this.data.message;
    this.status = this.data.status;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    const val = this.data.compPolicyDocId;

    return this.serviceApi.delete('/v1/document/policy/' + + val)

      .subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
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


interface EmployeeStatus {
  name: string;
  status: boolean;
}

