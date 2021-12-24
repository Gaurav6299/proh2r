import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { ApiCommonService } from '../../../services/api-common.service';
import { ValidationMessagesService } from '../../../validation-messages.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { DISABLED } from '@angular/forms/src/model';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-employee-fields',
  templateUrl: './employee-fields.component.html',
  styleUrls: ['./employee-fields.component.scss']
})
export class EmployeeFieldsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  panelFirstWidth: any;
  panelFirstHeight: any;
  baseUrl = environment.baseUrl;
  fieldsInfoList = [];
  fieldsList = [];
  isSectionEdit: any;
  modalSectionName: any;
  hideDelete: any;
  addEditModalHeader = '';
  addEditHeader: any;
  employeeField: FormGroup;
  sectionId: any;
  sectionLocation: any;
  accessibility: any;
  updateField = false;
  addField1 = false;
  isLeftVisible: any;
  notificationMsg: any;
  action: any;
  // displayedColumns = ['fieldName', 'fieldMandantory', 'accessibility', 'fieldSensitive', 'fieldDefault'];
  columns = [
    { field: 'fieldName', header: 'Field Name' },
    { field: 'fieldMandantory', header: 'Mandatory' },
    { field: 'accessibility', header: 'Access' },
    { field: 'fieldSensitive', header: 'Sensitive Data' },
    { field: 'fieldDefault', header: 'Action' },
  ]
  cars = [];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  sectionName: any;
  selectedfieldType = new FormControl();
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;
  isfields = false;
  @ViewChild('employeeform') form;
  constructor(private http: Http, private serviceApi: ApiCommonService,
    private _fb: FormBuilder, public dialog: MatDialog, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);

    this.employeeField = this._fb.group({
      fieldDescription: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      fieldName: [],
      placeholder: ['', [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      fieldType: ['', [Validators.required]],
      options: [''],
      fieldLocation: [''],
      accessLevel: ['', [Validators.required]],
      sensitive: [],
      mandatory: [],
      includeInPayslips: [],
      includeInOnboarding: [],
      default: [false],
      fieldId: []
    });
    this.getSectionInfo();
    console.log('Has role inside employee field-----' + KeycloakService.getUserRole());
    const rolesArr = KeycloakService.getUserRole();

    this.cars = [
      { name: 'Single-Line-Text', value: 'SingleLineText' },
      { name: 'Multiple-Line-Text', value: 'MultiLineText' },
      { name: 'Number', value: 'Number' },
      { name: 'Dropdown', value: 'Dropdown' },
      { name: 'Date', value: 'Date' }
    ]
  }


  ngOnInit() {
    this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
    console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
    this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
    console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
    $('.divtoggleDiv')[1].style.display = 'none';
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

  getSectionInfo() {
    this.fieldsInfoList = [];
    this.fieldsList = [];
    this.serviceApi.get2('/v1/organization/employeefields/section').subscribe(
      res => {
        console.log('-------------  Section fields Informations --------------- ');
        res.forEach(element => {
          console.log('Section Name : ' + element.sectionName);
          this.fieldsInfoList.push({
            sectionId: element.sectionId,
            sectionName: element.sectionName,
            sectionLocation: element.employeeProfileLocation,
            placeholder: element.fieldPlaceholder,
            accessibility: element.accessLevel,
            fieldList: element.fields,
            isdefault: element.default
          });
        });
      }, error => {
        console.log('there is something json');
      }, () => {
        console.log('fieldsInfoList --->' + this.fieldsInfoList);
        if (this.selectedSection === "") {
          this.fieldsInfoList[0].fieldList.forEach(element => {
            const isDefault = this.fieldsInfoList[0].isdefault;
            if (isDefault === true) {
              this.isSectionEdit = false;
            } else {
              this.isSectionEdit = true;
            }
            console.log('this.fieldsInfoList[0].sectionName -->' + this.fieldsInfoList[0].sectionName);
            this.sectionName = this.fieldsInfoList[0].sectionName;
            this.fieldsList.push({
              fieldId: element.fieldId,
              fieldName: element.fieldDescription,
              fieldMandantory: element.mandatory,
              accessibility: element.accessLevel,
              fieldSensitive: element.sensitive,
              includeInPayslips: element.includeInPayslips,
              placeholder: element.fieldPlaceholder,
              sectionName: this.sectionName,
              sectionId: this.fieldsInfoList[0].sectionId,
              employeeProfileLocation: element.employeeProfileLocation,
              includeInOnboarding: element.includeInOnboarding,
              fieldDefault: element.default,
              fieldType: element.fieldType,
              options: element.options
            });
          });
          this.dataSource = new MatTableDataSource<Element>(this.fieldsList);
        } else {
          this.getFields(this.selectedSection)
        }
        this.dt.reset();
      });
  }

  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    // $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  selectedSection = ""
  getFields(sectionName: any) {
    this.selectedSection = sectionName;
    this.fieldsList = [];
    let sectionId;
    this.sectionName = sectionName;
    this.fieldsInfoList.forEach(element => {
      if (element.sectionName === sectionName) {
        sectionId = element.sectionId;
        const defaulSectionStatus = element.isdefault;
        if (defaulSectionStatus === true) {
          this.isSectionEdit = false;
        } else {
          this.isSectionEdit = true;
        }
        element.fieldList.forEach(element1 => {
          if (element.sectionName === sectionName) {
            this.fieldsList.push({
              fieldId: element1.fieldId,
              fieldName: element1.fieldDescription,
              fieldMandantory: element1.mandatory,
              sectionName: sectionName,
              accessibility: element1.accessLevel,
              fieldSensitive: element1.sensitive,
              placeholder: element1.fieldPlaceholder,
              fieldDefault: element1.default,
              fieldType: element1.fieldType,
              options: element1.options,
              sectionId: sectionId,
              includeInPayslips: element1.includeInPayslips,
              includeInOnboarding: element1.includeInOnboarding,
            });
          }
        });
      }
    });
    this.dataSource = new MatTableDataSource<Element>(this.fieldsList);
    this.isLeftVisible = false;
    this.setPanel();
    document.getElementById("scrollingContent").scrollIntoView({
      behavior: "smooth"
    });
  }

  // --------------- call edit section method start----------------------
  editSection(section: any) {
    let sectionAccessibility;
    let sectionlocation;
    let editSectionId;
    this.notificationMsg = '';
    this.action = '';
    this.addEditModalHeader = 'Edit Section';
    this.hideDelete = 'true';
    console.log('Section -->' + section);
    console.log('Hide Delete -->' + this.hideDelete);

    this.fieldsInfoList.forEach(element => {
      if (element.sectionName === this.sectionName) {
        sectionAccessibility = element.accessibility;
        console.log('SectionAccessibility :::: ' + sectionAccessibility);
        sectionlocation = element.sectionLocation;
        console.log('Sectionlocation :::: ' + sectionlocation);
        editSectionId = element.sectionId;
        console.log('EditSectionId :::: ' + editSectionId);
        if (element.fieldList != null) {
          this.isfields = true;
          console.log('fields =' + this.isfields);
        }
      }
    });

    this.modalSectionName = section;
    const dialogRef = this.dialog.open(EditSectionDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        header: this.addEditModalHeader,
        delete: this.hideDelete,
        sectionName: this.modalSectionName,
        location: sectionlocation,
        accessibility: sectionAccessibility,
        sectionid: editSectionId,
        isfields: this.isfields
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.selectedSection = ""
            this.getSectionInfo();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }
    });
  }
  // --------------- call edit section method end ----------------------

  // --------------- call add section method start ----------------------
  addSection() {
    console.log('Inside new Section');
    this.notificationMsg = '';
    this.action = '';
    this.addEditModalHeader = 'Add New Section';
    this.hideDelete = 'false';
    const dialogRef = this.dialog.open(EditSectionDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        header: this.addEditModalHeader,
        delete: this.hideDelete,
        message: this.notificationMsg,
        status: this.action
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getSectionInfo();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }

    });

  }
  // --------------- call add section method end----------------------


  deleteSection(section: any) {
    this.notificationMsg = '';
    this.action = '';
    let editSectionId;
    this.fieldsInfoList.forEach(element => {
      if (element.sectionName === this.sectionName) {
        editSectionId = element.sectionId;
      }
    });
    const dialogRef = this.dialog.open(DeleteEmployeeSectionDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        sectionId: editSectionId,
        message: this.notificationMsg,
        status: this.action
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.selectedSection = ""
            this.getSectionInfo();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }
    });


  }

  // --------------- Delete field start ----------------------
  deleteField(element: any) {
      this.notificationMsg = '';
      this.action = '';
      const dialogRef = this.dialog.open(DeleteFieldDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          fieldId: element.fieldId,
          message: this.notificationMsg,
          status: this.action
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);
              this.fieldsList = [];
              this.getSectionInfo();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }

      });
  }

  selectFieldType() {
    if (this.employeeField.controls.fieldType.value === 'Dropdown') {
      this.employeeField.controls.options.setValidators([Validators.required]);
      this.employeeField.controls.options.updateValueAndValidity();
    } else {
      this.employeeField.controls.options.setValue(null);
      this.employeeField.controls.options.clearValidators();
      this.employeeField.controls.options.updateValueAndValidity();
      // const optionValue = <string>this.employeeField.controls.options.value;
      // if (optionValue.includes(',')) {
      //   const result = optionValue.split(',');
      //   this.employeeField.controls.options.setValue();
      // }
    }
  }

  convertIntoStringArray() {
    const optionValue = <string>this.employeeField.controls.options.value;
    if (optionValue.includes(',')) {
      const result = optionValue.split(',');
      this.employeeField.controls.options.setValue(result);
    } else {
      if (optionValue != "") {
        this.employeeField.controls.options.setValue([optionValue])
      }

    }
  }
  addNewField(data: any) {
    let sectionId;
    this.fieldsInfoList.forEach(element => {
      if (element.sectionName === this.sectionName) {
        sectionId = element.sectionId;
      }
    });
    this.employeeField.reset();
    this.employeeField.markAsUntouched();
    this.form.resetForm();
    // Object.keys(this.employeeField.controls).forEach(field => { // {1}
    //   const control = this.employeeField.get(field);            // {2}
    //   control.markAsUntouched({ onlySelf: true });       // {3}
    // });
    this.employeeField.controls.fieldLocation.setValue(sectionId);
    // tslint:disable-next-line:no-unused-expression
    this.employeeField.controls.fieldLocation.disable();
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addEditHeader = 'Add New Employee Field';
    this.addField1 = true;
    this.updateField = false;
  }




  editField(element) {
      this.isLeftVisible = !this.isLeftVisible;
      console.log(element);
      console.log(JSON.stringify(element));
      if (element.options != null) {
        this.employeeField.controls.options.setValue(element.options);
      } else {
        this.employeeField.controls.options.setValue(null);
      }
      this.employeeField.controls.fieldId.setValue(element.fieldId);
      this.employeeField.controls.accessLevel.setValue(element.accessibility, [Validators.required]);
      this.employeeField.controls.fieldType.setValue(element.fieldType);
      this.employeeField.controls.includeInPayslips.setValue(element.includeInPayslips);
      this.employeeField.controls.fieldLocation.setValue(element.sectionId);
      this.employeeField.controls.mandatory.setValue('' + element.fieldMandantory);
      this.employeeField.controls.sensitive.setValue('' + element.fieldSensitive);
      this.employeeField.controls.placeholder.setValue(element.placeholder);
      this.employeeField.controls.fieldDescription.setValue(element.fieldName);
      this.employeeField.controls.includeInPayslips.setValue('' + element.includeInPayslips);
      this.employeeField.controls.includeInOnboarding.setValue('' + element.includeInOnboarding);
      $('.divtoggleDiv')[1].style.display = 'block';
      this.addEditHeader = 'Edit Employee Field';
      this.addField1 = false;
      this.updateField = true;
  }



  updateFieldRecords() {
    if (this.employeeField.valid) {
      this.isValidFormSubmitted = true;
      const saveCustomField = this.employeeField.value;
      const fieldId = this.employeeField.controls.fieldId.value;
      const body = {
        accessLevel: this.employeeField.controls.accessLevel.value,
        default: false,
        fieldName: this.employeeField.controls.fieldName.value,
        fieldDescription: this.employeeField.controls.fieldDescription.value,
        fieldPlaceholder: this.employeeField.controls.placeholder.value,
        fieldType: this.employeeField.controls.fieldType.value,
        options: this.employeeField.controls.options.value,
        includeInOnboarding: this.employeeField.controls.includeInOnboarding.value,
        includeInPayslips: this.employeeField.controls.includeInPayslips.value,
        mandatory: this.employeeField.controls.mandatory.value,
        section: {
          sectionId: this.employeeField.controls.fieldLocation.value,
        },
        sensitive: this.employeeField.controls.sensitive.value
      };
      console.log(JSON.stringify(body));
      this.serviceApi.put('/v1/organization/employeefields/field/' + +fieldId, body)

        .subscribe(
          res => {
            this.successNotification(res.message);
            console.log('profile data saved successfully');
          }, err => {
            // this.warningNotification(err.message);
            console.log('there is something error');
          }, () => {
            this.fieldsList = [];
            this.getSectionInfo();
            this.isLeftVisible = !this.isLeftVisible;
            this.setPanel();
          });
    } else {
      Object.keys(this.employeeField.controls).forEach(field => { // {1}
        const control = this.employeeField.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  saveFieldRecords() {
    if (this.employeeField.valid) {
      this.isValidFormSubmitted = true;
      const saveCustomField = this.employeeField.value;
      console.log('save field records ::: ' + saveCustomField);
      const body = {
        accessLevel: this.employeeField.controls.accessLevel.value,
        default: false,
        fieldName: this.employeeField.controls.fieldName.value,
        fieldDescription: this.employeeField.controls.fieldDescription.value,
        fieldPlaceholder: this.employeeField.controls.placeholder.value,
        fieldType: this.employeeField.controls.fieldType.value,
        options: this.employeeField.controls.options.value,
        includeInOnboarding: this.employeeField.controls.includeInOnboarding.value,
        includeInPayslips: this.employeeField.controls.includeInPayslips.value,
        mandatory: this.employeeField.controls.mandatory.value,
        section: {
          sectionId: this.employeeField.controls.fieldLocation.value,
        },
        sensitive: this.employeeField.controls.sensitive.value
      };
      console.log(JSON.stringify(body));

      return this.serviceApi.post('/v1/organization/employeefields/field', body)
        .subscribe(
          res => {
            this.successNotification(res.message);
            console.log('profile data saved successfully');
          }, err => {
            this.warningNotification(err.message);
            console.log('there is something error');
          }, () => {
            this.fieldsList = [];
            this.getSectionInfo();
            this.isLeftVisible = !this.isLeftVisible;
            this.setPanel();
          });
    } else {
      Object.keys(this.employeeField.controls).forEach(field => { // {1}
        const control = this.employeeField.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }


  cancel() {
    Object.keys(this.employeeField.controls).forEach(field => { // {1}
      const control = this.employeeField.get(field);            // {2}
      control.markAsTouched({ onlySelf: false });       // {3}
    });
    this.employeeField.reset();
    this.form.resetForm();
    this.isLeftVisible = !this.isLeftVisible;
    this.setPanel();
    document.getElementById("scrollingContent").scrollIntoView({
      behavior: "smooth"
    });
  }
}

// ---------------- Table initilization----------------------
export interface Element {
  fieldName: string;
  fieldMandantory: string;
  accessibility: string;
  sectionId: string;
  placeholder: string;
  fieldSensitive: string;
  fieldDefault: string;
}

const ELEMENT_DATA: Element[] = [];




// ------------------  Edit section Modal selector component syart ---------------------
@Component({
  selector: 'app-edit-section-dialog',
  templateUrl: 'edit-section-dialog-component.html',
  styleUrls: ['./edit-section-dialog-component.scss']
})
export class EditSectionDialogComponent implements OnInit {

  baseUrl = environment.baseUrl;
  header: any;
  delete: any;
  name: any;
  location: any;
  accessibility: any;
  isfields: any;
  sectionData = [];
  add_EditSection: FormGroup;
  accessLevel = [];
  isValidFormSubmitted = true;
  requiredTextField;
  requiredDropdownField;
  error = 'Error Message';
  action: any;
  constructor(
    private _fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<EditSectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownField = message);
    console.log('data-->' + data);
    this.header = data.header;
    this.delete = data.delete;
    this.name = data.sectionName;
    this.location = 'Other Information';
    this.accessibility = data.accessibility;
    this.isfields = data.isfields;
    this.add_EditSection = this._fb.group({
      sectionName: [data.sectionName, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      employeeProfileLocation: [data.location, [Validators.required]],
      accessLevel: [data.accessibility, [Validators.required]],
      sectionid: [data.sectionid]
    });
  }

  ngOnInit() {

  }

  deleteSectionDetails() {
    const val = this.add_EditSection.controls.sectionid.value;
    this.serviceApi.delete('/v1/organization/employeefields/section/' + +val).
      subscribe(
        res => {
          console.log('Delete Successfully-------------' + JSON.stringify(res));
          if (this.isfields === true) {
            this.error = 'Section contains some fields';
            this.close();
          }
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
          console.log('Delete Delete-------------' + JSON.stringify(err));
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = 'Section contains some fields.';
          this.close();
        });
  }

  editSectionDetails() {
    if (this.add_EditSection.valid) {
      this.isValidFormSubmitted = true;
      const body = {
        'sectionName': this.add_EditSection.controls.sectionName.value,
        'accessLevel': this.add_EditSection.controls.accessLevel.value,
        'employeeProfileLocation': this.add_EditSection.controls.employeeProfileLocation.value,
      };
      const val = this.add_EditSection.controls.sectionid.value;
      console.log('Edit section id :::: ' + val);
      return this.serviceApi.put('/v1/organization/employeefields/section/' + +val, body)

        .subscribe(
          res => {
            console.log('Edit Successfully-------------' + JSON.stringify(res));
            console.log('res message-----' + res.message);
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
      Object.keys(this.add_EditSection.controls).forEach(field => { // {1}
        const control = this.add_EditSection.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  saveSectionDetails() {
    if (this.add_EditSection.valid) {
      this.isValidFormSubmitted = true;
      const body = {
        'sectionName': this.add_EditSection.controls.sectionName.value,
        'accessLevel': this.add_EditSection.controls.accessLevel.value,
        'employeeProfileLocation': this.add_EditSection.controls.employeeProfileLocation.value,
      };
      const saveSectionDetail = this.add_EditSection.value;
      return this.serviceApi.post('/v1/organization/employeefields/section', body)

        .subscribe(
          res => {
            console.log('Add Successfully-------------' + JSON.stringify(res));
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
      Object.keys(this.add_EditSection.controls).forEach(field => { // {1}
        const control = this.add_EditSection.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

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


// -------------delete fields modal start -------------------------
@Component({
  selector: 'app-delete-field-dialog',
  templateUrl: 'delete-field-dialog-component.html',
  styleUrls: ['./delete-field-dialog-component.scss']
})
export class DeleteFieldDialogComponent {
  //  location = ['Personal Details', 'Employment Details', 'Other Information'];

  error = 'Error Message';
  action: any;
  fieldId: any;
  baseUrl = environment.baseUrl;
  constructor(
    private _fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<DeleteFieldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data.fieldId);
    this.fieldId = data.fieldId;
  }
  deleteFieldDetails() {
    this.serviceApi.delete('/v1/organization/employeefields/field/' + +this.fieldId).
      subscribe(
        res => {
          console.log('Add Successfully-------------' + JSON.stringify(res));
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
    console.log('message---------' + this.error);
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}


@Component({
  templateUrl: 'delete-section-dialog-component.html',
  styleUrls: ['./delete-field-dialog-component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DeleteEmployeeSectionDialogComponent implements OnInit {
  baseUrl = environment.baseUrl;
  public bankInformationForm: FormGroup;
  error = 'Error Message';
  action: any;

  sectionId: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployeeSectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.sectionId = this.data.sectionId;
  }

  onDelete() {
    return this.serviceApi.delete('/v1/organization/employeefields/section/' + +this.sectionId)
      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.error.message;
          this.close();
        });
  }


  ngOnInit() {

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


