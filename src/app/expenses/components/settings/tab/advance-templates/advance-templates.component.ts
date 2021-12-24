import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatStepper, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { delay } from 'rxjs/operators';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';

declare var $: any;

@Component({
  selector: 'app-advance-templates',
  templateUrl: './advance-templates.component.html',
  styleUrls: ['./advance-templates.component.scss']
})
export class AdvanceTemplatesComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  @ViewChild('advanceTemplateform') form;
  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  public addAdvanceTemplate: FormGroup;
  columns = [
    { field: 'templateName', header: 'Advance Template Name' },
    { field: 'employeeCoveredCount', header: 'Number Of Employees Covered' },
    { field: 'categoriesCount', header: 'Number Of Advance Categories' },
    { field: 'actions', header: 'Actions' },
  ]
  allSelections = [];
  mySelectedList = [];
  @ViewChild('stepper') stepper: MatStepper;
  advanceCategorySettings: any[] = [];
  supervisorList: any = [];
  optionsData: any;
  secondaryOptionsData: any;
  requiredTextField: string;
  requiredDropdownButton: string;
  requiredRadioButton: string;
  getAdvanceTemplateArray: any[] = [];
  checkedList: any[];
  myControl: any = new FormControl();
  myControl1: any = new FormControl();
  check: boolean;
  tempCheckedList: any[];
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  errorMessage: any;

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

  /**
   * CONSTRUCTOR
   */
  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService,
    private validationMessagesService: ValidationMessagesService) {
    this.advanceCategorySettings = [];
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

  /**
   * ON-INIT METHOD
   */
  ngOnInit() {
    this.addAdvanceTemplate = this.fb.group({
      advanceTemplateId: [],
      advanceTemplateName: [null, Validators.required],
      advanceApprovalLevel: [null, Validators.required],
      advanceApprovalType: [null, Validators.required],
      primaryApprover: [],
      secondaryApprover: [],
      advanceTemplateCategoriesList: [],
      activeAdvanceCategories: [],
      allSelections: [null]
    });
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations();
  }

  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations();
    this.getCategoryData();
  }

  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }

  getAdvanceTemplateData() {
    this.getAdvanceTemplateArray = [];
    this.checkedList = [];
    this.serviceApi.get("/v1/advance/template/getAll")
      .subscribe(res => {
        res.forEach(element => {
          this.getAdvanceTemplateArray.push({
            "advanceTemplateId": element.advanceTemplateId,
            "templateName": element.templateName,
            "advanceApprovalLevel": element.advanceApprovalLevel,
            "advanceApprovalType": element.advanceApprovalType,
            "primaryApprover": element.primaryApprover,
            "secondaryApprover": element.secondaryApprover,
            "departmentId": element.departmentIds,
            "locationId": element.locationIds,
            "designationId": element.designationIds,
            "bandId": element.bandIds,
            "advanceTemplateCategoriesList": [...element.advanceTemplateCategoriesList],
            "employeeCoveredCount": element.employeeCoveredCount,
            "categoriesCount": element.categoriesCount
          });
        });
      },
        (err) => {
        },
        () => {
          this.getCriteria();
          this.dt.reset();
        });
  }

  getCategoryData() {
    this.advanceCategorySettings = [];
    let response;
    this.serviceApi.get('/v1/advance/category/getAll')
      .subscribe(
        res => {
          response = res;
          response != null ? response.forEach(element => {
            this.advanceCategorySettings.push(
              {
                advanceCategoryId: element.advanceCategoriesId,
                advanceCategoryName: element.advanceCategoryName,
                checked: false
              });

          }) : this.advanceCategorySettings = [];
        },
        err => {
        },
        () => {
        });
  }

  addNewTemplate() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.resetFormValue();  
    this.advanceCategorySettings.forEach(ele => {
      ele.checked = false
    })
    this.isAddMode = true;
    this.isEditMode = false;
  }
  cancelPanel() {
    this.isLeftVisible = false;
    this.setPanel();
    this.addAdvanceTemplate.reset();
    this.getAdvanceTemplateData();
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
              viewValue: element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }

  advanceCategoryChange(categoryObject: any) {
    this.advanceCategorySettings.find(ele => ele.advanceCategoryId == categoryObject.advanceCategoryId).checked = !categoryObject.checked
  }

  resetFormValue() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addAdvanceTemplate.reset();
    this.form.resetForm();
    this.advanceCategorySettings = [];
    this.check = false;
    this.getCategoryData();
  }

  selectedLevelApproval() {
    this.addAdvanceTemplate.controls.primaryApprover.clearValidators();
    this.addAdvanceTemplate.controls.secondaryApprover.clearValidators();
    this.addAdvanceTemplate.controls.primaryApprover.setValue(null);
    this.addAdvanceTemplate.controls.secondaryApprover.setValue(null);
    if (this.addAdvanceTemplate.controls.advanceApprovalLevel.value === 'First_Level' &&
      this.addAdvanceTemplate.controls.advanceApprovalType.value === 'TemplateWise') {
      this.addAdvanceTemplate.controls.primaryApprover.setValue(null);
      this.addAdvanceTemplate.controls.secondaryApprover.setValue(null);
      this.addAdvanceTemplate.controls.primaryApprover.setValidators([Validators.required]);
      // this.addAdvanceTemplate.controls.primaryApprover.setValue(Validators.required);

    } else if (this.addAdvanceTemplate.controls.advanceApprovalLevel.value === 'Second_level' &&
      this.addAdvanceTemplate.controls.advanceApprovalType.value === 'TemplateWise') {
      this.addAdvanceTemplate.controls.primaryApprover.setValue(null);
      this.addAdvanceTemplate.controls.secondaryApprover.setValue(null);
      this.addAdvanceTemplate.controls.primaryApprover.setValidators([Validators.required]);
      this.addAdvanceTemplate.controls.secondaryApprover.setValidators([Validators.required]);
    }
    this.addAdvanceTemplate.controls.primaryApprover.updateValueAndValidity();
    this.addAdvanceTemplate.controls.secondaryApprover.updateValueAndValidity();
  }

  addNewAdvanceTemplate() {
    if (this.addAdvanceTemplate.valid) {
      this.isLeftVisible = false;
      this.setPanel();
      let advanceTemplateCategoriesList = [];
      let bandId = [];
      let departmentId = [];
      let designationId = [];
      let locationId = [];

      this.advanceCategorySettings.forEach(ele => {
        if (ele.checked == true) advanceTemplateCategoriesList.push({
          "advanceCategoryId": ele.advanceCategoryId,
          "advanceTemplateCategoryId": null,
          "categoryName": null
        })
      })
      if (this.addAdvanceTemplate.controls.allSelections.value != null) {
        this.addAdvanceTemplate.controls.allSelections.value.forEach(ele => {
          if (ele.type == 'Bands') bandId.push(ele.value);
          else if (ele.type == 'Departments') departmentId.push(ele.value);
          else if (ele.type == 'Designations') designationId.push(ele.value);
          else if (ele.type == 'Locations') locationId.push(ele.value);
        });
      }

      let body = {
        "advanceApprovalLevel": this.addAdvanceTemplate.controls.advanceApprovalLevel.value,
        "advanceApprovalType": this.addAdvanceTemplate.controls.advanceApprovalType.value,
        "advanceTemplateCategoriesList": advanceTemplateCategoriesList,
        "advanceTemplateId": null,
        "bandId": bandId,
        "departmentId": departmentId,
        "designationId": designationId,
        "locationId": locationId,
        "primaryApprover": this.addAdvanceTemplate.controls.primaryApprover.value,
        "secondaryApprover": this.addAdvanceTemplate.controls.secondaryApprover.value,
        "templateName": this.addAdvanceTemplate.controls.advanceTemplateName.value
      }

      this.serviceApi.post('/v1/advance/template/create', body).subscribe(
        res => {
          this.successNotification(res.message);
        },
        err => { },
        () => this.getAdvanceTemplateData()
      )
    }
    else {
      Object.keys(this.addAdvanceTemplate.controls).forEach(field => { // {1}
        const control = this.addAdvanceTemplate.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  editAdvanceTemplate(element: any) {
    this.isLeftVisible = true;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addAdvanceTemplate.reset();
    this.isAddMode = false;
    this.isEditMode = true;
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

    element.advanceTemplateCategoriesList.forEach(ele => {
      this.advanceCategorySettings.find(element => element.advanceCategoryId == ele.advanceCategoryId).checked = true
    })
    this.addAdvanceTemplate.controls.allSelections.patchValue(selections);
    this.addAdvanceTemplate.controls.advanceTemplateName.setValue(element.templateName);
    this.addAdvanceTemplate.controls.advanceTemplateId.setValue(element.advanceTemplateId);
    this.addAdvanceTemplate.controls.primaryApprover.setValue(element.primaryApprover);
    this.addAdvanceTemplate.controls.secondaryApprover.setValue(element.secondaryApprover);
    this.addAdvanceTemplate.controls.advanceApprovalLevel.setValue(element.advanceApprovalLevel);
    this.addAdvanceTemplate.controls.advanceApprovalType.setValue(element.advanceApprovalType);
  }

  updateAdvanceTemplate() {
    if (this.addAdvanceTemplate.valid) {
    this.isLeftVisible = false;
    this.setPanel();
    let advanceTemplateCategoriesList = [];
    let bandId = [];
    let departmentId = [];
    let designationId = [];
    let locationId = [];

    this.advanceCategorySettings.forEach(ele => {
      if (ele.checked == true) advanceTemplateCategoriesList.push({
        "advanceCategoryId": ele.advanceCategoryId,
        "advanceTemplateCategoryId": null,
        "categoryName": null
      })
    })

    this.addAdvanceTemplate.controls.allSelections.value.forEach(ele => {
      if (ele.type == 'Bands') bandId.push(ele.value);
      else if (ele.type == 'Departments') departmentId.push(ele.value);
      else if (ele.type == 'Designations') designationId.push(ele.value);
      else if (ele.type == 'Locations') locationId.push(ele.value);
    });

    let body = {
      "advanceApprovalLevel": this.addAdvanceTemplate.controls.advanceApprovalLevel.value,
      "advanceApprovalType": this.addAdvanceTemplate.controls.advanceApprovalType.value,
      "advanceTemplateCategoriesList": advanceTemplateCategoriesList,
      "advanceTemplateId": this.addAdvanceTemplate.controls.advanceTemplateId.value,
      "bandId": bandId,
      "departmentId": departmentId,
      "designationId": designationId,
      "locationId": locationId,
      "primaryApprover": this.addAdvanceTemplate.controls.primaryApprover.value,
      "secondaryApprover": this.addAdvanceTemplate.controls.secondaryApprover.value,
      "templateName": this.addAdvanceTemplate.controls.advanceTemplateName.value
    }

    console.log(body)
    this.serviceApi.put('/v1/advance/template/update', body).subscribe(
      res => {
        this.successNotification(res.message);
      },
      err => { },
      () => this.getAdvanceTemplateData()
    )
  }
  else {
    Object.keys(this.addAdvanceTemplate.controls).forEach(field => { // {1}
      const control = this.addAdvanceTemplate.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }
  }

  deleteAdvanceTemplate(car: any) {
    console.log('Inside delete method');
    let dialogRef = this.dialog.open(DeleteAdvanceTemplateDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        templateId: car.advanceTemplateId,
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

            this.getAdvanceTemplateData();
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
}


@Component({
  selector: 'delete-advance-template-dialog',
  templateUrl: 'delete-advance-template-dialog.component.html',
  styleUrls: ['./delete-dialog-component.scss']
})
export class DeleteAdvanceTemplateDialog implements OnInit {
  error: any;
  action: any;
  canDelete: any;
  id: any;
  constructor(private serviceApi: ApiCommonService, public dialogRef: MatDialogRef<DeleteAdvanceTemplateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = this.data.templateId;
  }
  deleteAdvanceTemplate() {
    this.serviceApi.delete('/v1/advance/template/' + this.id)
      .subscribe(
        res => {
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