import { Component, OnInit, Inject } from '@angular/core';
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
declare var $: any;

@Component({
  selector: 'app-recruitment-fields',
  templateUrl: './recruitment-fields.component.html',
  styleUrls: ['./recruitment-fields.component.scss']
})
export class RecruitmentFieldsComponent implements OnInit {
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
  employeeRecuitmentField: FormGroup;
  sectionId: any;
  sectionLocation: any;
  accessibility: any;
  updateField = false;
  addField1 = false;
  isLeftVisible: any;
  notificationMsg: any;
  action: any;
  selectedSectionData = new FormControl();
  optionasArray = [];

  displayedColumns = ['recFieldDescription', 'mandatory', 'recFieldType', 'sensitive', 'default'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  sectionName: any;

  pushData: any;

  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDropdownButton;

  successNotification(successMessage: any) {
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

  constructor(private http: Http, private serviceApi: ApiCommonService,
    private _fb: FormBuilder, public dialog: MatDialog, private validationMessagesService: ValidationMessagesService) {

    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.employeeRecuitmentField = this._fb.group({
      recFieldDescription: [null, [Validators.required]],
      recFieldName: [],
      recFieldPlaceholder: [null, [Validators.required]],
      recFieldType: [null, [Validators.required]],
      recOptions: [],
      recSection: [null, [Validators.required]],
      sensitive: [],
      mandatory: [],
      default: [false],
      recFieldId: []
    });

    this.getSectionInfo();
    console.log('Has role inside employee field-----' + KeycloakService.getUserRole());
    const rolesArr = KeycloakService.getUserRole();
  }


  ngOnInit() {
    this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
    console.log('panelDive[0] width -->' + $('.divtoggleDiv')[0].offsetWidth);
    this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
    console.log('panelDive[0] height -->' + $('.divtoggleDiv')[0].offsetHeight);
    $('.divtoggleDiv')[1].style.display = 'none';
  }


  getSectionInfo() {
    this.fieldsInfoList = [];
    this.fieldsList = [];
    this.serviceApi.get('/v1/recruitment/fields/section').subscribe(
      res => {
        console.log('-------------  Section fields Informations --------------- ');
        res.forEach(element => {
          console.log('Section Name : ' + element.sectionName);
          this.fieldsInfoList.push({
            recSectionId: element.recSectionId,
            recSectionName: element.recSectionName,
            recSectionLocation: element.recSectionLocation,
            recFields: element.recFields,
            default: element.default
          });
        });
      }, error => {
        console.log('there is something json');
      }, () => {
        console.log('fieldsInfoList --->' + this.fieldsInfoList);
        this.fieldsInfoList[0].recFields.forEach(element => {
          const isDefault = this.fieldsInfoList[0].default;

          if (isDefault === true) {
            this.isSectionEdit = false;
          } else {
            this.isSectionEdit = true;
          }
          this.sectionName = this.fieldsInfoList[0].recSectionName;
          this.sectionId = this.fieldsInfoList[0].recSectionId;
          this.fieldsList.push({
            recFieldId: element.recFieldId,
            recFieldName: element.recFieldName,
            recFieldDescription: element.recFieldDescription,
            recFieldType: element.recFieldType,
            recFieldPlaceholder: element.recFieldPlaceholder,
            recOptions: element.recOptions,
            recSection: this.sectionName,
            recSectionId: this.sectionId,
            default: element.default,
            sensitive: element.sensitive,
            mandatory: element.mandatory,
          });
        });
        this.dataSource = new MatTableDataSource<Element>(this.fieldsList);
      });
  }

  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }

  getFields(sectionName: any) {
    this.fieldsList = [];
    let sectionId;
    this.sectionName = sectionName;
    this.fieldsInfoList.forEach(element => {
      if (element.recSectionName === sectionName) {
        sectionId = element.sectionId;
        const defaulSectionStatus = element.default;
        if (defaulSectionStatus === true) {
          this.isSectionEdit = false;
        } else {
          this.isSectionEdit = true;
        }

        element.recFields.forEach(element1 => {
          if (element.recSectionName === sectionName) {
            this.fieldsList.push({
              recFieldId: element1.recFieldId,
              recFieldName: element1.recFieldName,
              recFieldDescription: element1.recFieldDescription,
              recFieldType: element1.recFieldType,
              recFieldPlaceholder: element1.recFieldPlaceholder,
              recOptions: element1.recOptions,
              recSection: sectionName,
              default: element1.default,
              sensitive: element1.sensitive,
              mandatory: element1.mandatory,
            });
          }
        });
      }
    });
    this.dataSource = new MatTableDataSource<Element>(this.fieldsList);
    this.isLeftVisible = false;
    this.setPanel();
  }


  selectSection(data: any) {
    console.log('Enter in the Select Section :: ' + data + '----' + JSON.stringify(data));
    this.selectedSectionData.setValue(data.recSectionId);
    this.employeeRecuitmentField.controls.recSection.setValue({
      'recSectionId': data.recSectionId
    });
  }

  convertIntoStringArray() {
    const optionValue = <string>this.employeeField.controls.recOptions.value;
    if (optionValue.includes(',')) {
      const result = optionValue.split(',');
      this.optionasArray.push(result);
      this.employeeField.controls.recOptions.setValue(this.optionasArray);
    }
  }
  addNewField() {
    this.employeeRecuitmentField.reset();
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addEditHeader = 'Add New Employee Recruitment Field';
    this.addField1 = true;
    this.updateField = false;
  }




  editField(element) {
    console.log(JSON.stringify(element));
    this.selectedSectionData.setValue(element.recSectionId);
    this.employeeRecuitmentField.controls.recSection.setValue({
      'recSectionId': element.recSectionId
    });

    this.isLeftVisible = !this.isLeftVisible;
    this.employeeRecuitmentField.controls.recFieldId.setValue(element.recFieldId);
    this.employeeRecuitmentField.controls.recFieldType.setValue(element.recFieldType);
    this.employeeRecuitmentField.controls.mandatory.setValue('' + element.mandatory);
    this.employeeRecuitmentField.controls.sensitive.setValue('' + element.sensitive);
    this.employeeRecuitmentField.controls.recFieldPlaceholder.setValue(element.recFieldPlaceholder);
    this.employeeRecuitmentField.controls.recFieldDescription.setValue(element.recFieldDescription);
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addEditHeader = 'Edit Employee Recruitment Field';
    this.addField1 = false;
    this.updateField = true;
    // } else {
    //   this.warningNotification('You do not have access to modify employee field');
    // }
  }



  updateFieldRecords() {
    if (this.employeeRecuitmentField.valid) {
      this.isValidFormSubmitted = true;
      const saveCustomField = this.employeeRecuitmentField.value;
      const fieldId = this.employeeRecuitmentField.controls.recFieldId.value;
      const body = this.employeeRecuitmentField.value;
      console.log(JSON.stringify(body));
      this.serviceApi.put('/v1/recruitment/fields/' + +fieldId, body)
       
        .subscribe(
        res => {
          this.successNotification(res.message);
          console.log('profile data saved successfully');
        },
        err => {
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
    if (this.employeeRecuitmentField.valid) {
      this.isValidFormSubmitted = true;
      const body = this.employeeRecuitmentField.value;
      console.log(JSON.stringify(body));
      return this.serviceApi.post('/v1/recruitment/fields/', body)
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
      Object.keys(this.employeeRecuitmentField.controls).forEach(field => { // {1}
        const control = this.employeeRecuitmentField.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }


  cancel() {
    Object.keys(this.employeeRecuitmentField.controls).forEach(field => { // {1}
      const control = this.employeeRecuitmentField.get(field);            // {2}
      control.markAsTouched({ onlySelf: false });       // {3}
    });
    this.employeeRecuitmentField.reset();
    this.isLeftVisible = !this.isLeftVisible;
    this.setPanel();
  }


  // --------------- call edit section method start----------------------
  editSection(section: any) {
    let sectionlocation;
    let editSectionId;
    this.notificationMsg = '';
    this.action = '';
    this.addEditModalHeader = 'Edit Section';
    this.hideDelete = 'true';
    console.log('Section -->' + section);
    console.log('Hide Delete -->' + this.hideDelete);

    this.fieldsInfoList.forEach(element => {
      if (element.recSectionName === section) {
        sectionlocation = element.recSectionLocation;
        console.log('Sectionlocation :::: ' + sectionlocation);
        editSectionId = element.recSectionId;
        console.log('EditSectionId :::: ' + editSectionId);
      }
    });

    // this.fieldsInfoList.forEach(element => {
    //   if (element.sectionName === this.sectionName) {
    //     sectionAccessibility = element.accessibility;
    //     console.log('SectionAccessibility :::: ' + sectionAccessibility);
    //     sectionlocation = element.sectionLocation;
    //     console.log('Sectionlocation :::: ' + sectionlocation);
    //     editSectionId = element.sectionId;
    //     console.log('EditSectionId :::: ' + editSectionId);
    //   }
    // });

    this.modalSectionName = section;

    const dialogRef = this.dialog.open(EditRecruitmentSectionDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        header: this.addEditModalHeader,
        delete: this.hideDelete,
        sectionName: this.modalSectionName,
        location: sectionlocation,
        sectionid: editSectionId
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
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
        this.getSectionInfo();
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
    const dialogRef = this.dialog.open(EditRecruitmentSectionDialogComponent, {
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
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
        this.getSectionInfo();
      }

    });

  }
  // --------------- call add section method end----------------------

  // --------------- Delete field start ----------------------
  deleteField(element: any) {
      this.notificationMsg = '';
      this.action = '';
      const dialogRef = this.dialog.open(DeleteRecruitmentFieldDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          fieldId: element.recFieldId,
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
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
          // tslint:disable-next-line:one-line
          this.fieldsList = [];
          this.getSectionInfo();
        }

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
  styleUrls: ['./dialog-component.scss']
})
export class EditRecruitmentSectionDialogComponent implements OnInit {

  baseUrl = environment.baseUrl;
  header: any;
  delete: any;
  name: any;
  location: any;
  accessibility: any;

  sectionData = [];
  add_EditSection: FormGroup;
  accessLevel = [];
  isValidFormSubmitted = true;
  requiredTextField;
  error = 'Error Message';
  action: any;
  constructor(
    private _fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<EditRecruitmentSectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    console.log('data-->' + data);

    this.header = data.header;
    this.delete = data.delete;
    this.name = data.sectionName;
    this.location = 'Other Information';
    this.accessibility = data.accessibility;

    this.add_EditSection = this._fb.group({
      recSectionName: [data.sectionName, [Validators.required]],
      recSectionLocation: [data.location],
      recSectionId: [data.sectionid]
    });
  }


  ngOnInit() {

  }

  deleteSectionDetails() {
    const val = this.add_EditSection.controls.recSectionId.value;
    this.serviceApi.delete('/v1/recruitment/fields/section/' + +val).
      subscribe(
      res => {
        console.log('Delete Successfully-------------' + JSON.stringify(res));
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
        console.log('Delete Delete-------------' + JSON.stringify(err));
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      });
  }

  editSectionDetails() {
    if (this.add_EditSection.valid) {
      this.isValidFormSubmitted = true;
      // const body = {
      //   'sectionName': this.add_EditSection.controls.sectionName.value,
      //   'accessLevel': this.add_EditSection.controls.accessLevel.value,
      //   'employeeProfileLocation': this.add_EditSection.controls.employeeProfileLocation.value,
      // };
      const val = this.add_EditSection.controls.recSectionId.value;
      const body = this.add_EditSection.value;
      console.log(JSON.stringify(body));
      console.log('Edit section id :::: ' + val);
      return this.serviceApi.put('/v1/recruitment/fields/section/' + +val, body)
       
        .subscribe(
        res => {
          console.log('Edit Successfully-------------' + JSON.stringify(res));
          console.log('res message-----' + res.message);
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
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
      const body = this.add_EditSection.value;

      console.log('Here going to Save Section ::::: ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/recruitment/fields/section', body)
       
        .subscribe(
        res => {
          console.log('Add Successfully-------------' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
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
  styleUrls: ['./dialog-component.scss']
})
export class DeleteRecruitmentFieldDialogComponent {
  error = 'Error Message';
  action: any;
  fieldId: any;
  baseUrl = environment.baseUrl;
  constructor(
    private _fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<DeleteRecruitmentFieldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data.fieldId);
    this.fieldId = data.fieldId;
  }

  deleteFieldDetails() {
    this.serviceApi.delete('/v1/recruitment/fields/' + +this.fieldId).
      subscribe(
      res => {
        console.log('Add Successfully-------------' + JSON.stringify(res));
        this.action = 'Response';
        this.error = res.message;
        this.close();
      },
      err => {
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

