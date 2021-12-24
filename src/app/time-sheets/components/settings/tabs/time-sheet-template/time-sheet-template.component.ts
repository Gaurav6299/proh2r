import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, Inject } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { FormGroup, FormControl, NgForm, FormBuilder, Validators, FormArray } from '@angular/forms';

import { MatDialog, MatRadioChange, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { delay } from 'rxjs/operators';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { ValidationMessagesService } from '../../..../../../../../validation-messages.service';
declare var $: any;

@Component({
  selector: 'app-time-sheet-template',
  templateUrl: './time-sheet-template.component.html',
  styleUrls: ['./time-sheet-template.component.scss']
})
export class TimeSheetTemplateComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'templateName', header: 'Template Name' },
    { field: 'empCovered', header: 'No. Of Employee Covered' },
    { field: 'actions', header: 'Actions' }
  ];
  // countTotalHours = {
  //   sunday: 0,
  //   monday: 0,
  //   tuesday: 0,
  //   wednesday: 0,
  //   thursday: 0,
  //   friday: 0,
  //   saturday: 0,
  // };
  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  notificationMsg: any;
  action: any;
  check1: boolean;
  templateResponse: any;
  isValidFormSubmitted = true;
  isDisabled: any = false;
  timeSheetsTemplateSettings: FormGroup;
  getTimeSheetsTemplateList = [];
  locationsList = [];
  allSelections = [];
  initiator = [];
  supervisorList = [];
  optionsData = [];
  secondaryOptionsData = [];
  // validationMessagesService: any;
  myControl = new FormControl();
  myControl1 = new FormControl();
  requiredTextField: any;
  requiredDropdownButton: any;
  requiredRadioButton: any;
  totalhours: any;
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  requestInitiators = [{ value: 'ADMIN', viewValue: 'Admin', selected: false }, { value: 'EMPLOYEE', viewValue: 'Employee', selected: false }, { value: 'SUPERVISOR', viewValue: 'Team Supervisor', selected: false }]
  constructor(private serviceApi: ApiCommonService, private fb: FormBuilder, public dialog: MatDialog, public validationMessagesService: ValidationMessagesService) {
    this.getTimeSheetsTemplate();
  }
  ngOnInit() {
    this.timeSheetsTemplateSettings = this.fb.group({
      timeSheetsTemplateId: [],
      templateName: ['', Validators.required],
      timeCaptureType: [null, Validators.required],
      // hoursForWorkWeek: [null, Validators.required],
      timeLock: [],
      timeLockDate: [],
      timeSheetsApplicants: new FormArray([], [Validators.required]),
      approvalLevel: [null, Validators.required],
      timeSheetsApprovalType: [null, Validators.required],
      primaryApprover: [],
      secondaryApprover: [],
      allSelections: [],
      sunday: [null, Validators.required],
      monday: [null, Validators.required],
      tuesday: [null, Validators.required],
      wednesday: [null, Validators.required],
      thursday: [null, Validators.required],
      friday: [null, Validators.required],
      saturday: [null, Validators.required],
      totalhours: [null],

    });
    this.serviceApi.get('/v1/employee/filterEmployees')
      .subscribe(
        res => {
          res.forEach(element => {
            this.supervisorList.push({
              value: element.empCode,
              viewValue: element.empFirstName.trim() + ' ' + element.empLastName.trim() + '-' + element.empCode.trim()
            });
          });
        }
      );
    this.optionsData = this.supervisorList;
    this.secondaryOptionsData = this.supervisorList;
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.getCriteria();

  }

  getCriteria() {
    this.getAllDepartments();
    this.getAllBands();
    this.getAllDesignations();
    this.getAllOrgLocations()
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
              viewValue: element.locationCode.toUpperCase() + ' - ' + element.cityName,
              type: 'Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }

  setPanel() {
    console.log(this.isLeftVisible);
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  addNewTemplate() {
    this.requestInitiators = [{ value: 'ADMIN', viewValue: 'Admin', selected: false }, { value: 'EMPLOYEE', viewValue: 'Employee', selected: false }, { value: 'SUPERVISOR', viewValue: 'Team Supervisor', selected: false }]
    this.timeSheetsTemplateSettings.reset();
    this.formDirective.resetForm();
    const control = <FormArray>this.timeSheetsTemplateSettings.controls['timeSheetsApplicants'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.requestInitiators = [{ value: 'ADMIN', viewValue: 'Admin', selected: false }, { value: 'EMPLOYEE', viewValue: 'Employee', selected: false }, { value: 'SUPERVISOR', viewValue: 'Team Supervisor', selected: false }];
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
  }
  cancelPanel() {
    this.isLeftVisible = false;
    this.setPanel();
    this.timeSheetsTemplateSettings.reset();
    this.formDirective.resetForm();
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
  getTimeSheetsTemplate() {
    this.getTimeSheetsTemplateList = [];
    this.serviceApi.get('/v1/timesheets/template/').subscribe(res => {
      res.forEach(element => {
        this.getTimeSheetsTemplateList.push({
          timeSheetsTemplateId: element.timeSheetsTemplateId,
          templateName: element.templateName,
          timeCaptureType: element.timeCaptureType,
          // hoursForWorkWeek: element.hoursForWorkWeek,
          timeSheetsApprovalType: element.timeSheetsApprovalType,
          timeSheetsApplicants: element.timeSheetsApplicants,
          timeLock: element.timeLock,
          timeLockDate: element.timeLockDate,
          approvalLevel: element.approvalLevel,
          primaryApprover: element.primaryApprover,
          secondaryApprover: element.secondaryApprover,
          workWeeks: element.workWeeks,
          departmentId: element.departmentIds,
          locationId: element.locationIds,
          designationId: element.designationIds,
          bandId: element.bandIds,
          empCovered: element.empCovered
        });
      });
    },
      (err) => {

      }, () => {
        this.dt.reset();
      });
  }
  onChange(event) {

    const control = (this.timeSheetsTemplateSettings.controls['timeSheetsApplicants']) as FormArray
    if (event.checked) {
      control.push(new FormControl(event.source.value))
    } else {
      const i = control.controls.findIndex(x => x.value === event.source.value);
      control.removeAt(i);
    }
  }

  openDeleteTimeSheetsTemplateDialog(element: any) {
    const dialogRef = this.dialog.open(DeleteTimeSheetTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        templateId: element.timeSheetsTemplateId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == 'Response') {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          this.successNotification(result.message);
          this.getTimeSheetsTemplate();
        }
      }
    });
  }
  editTemplate(element: any) {
    this.check1 = false;
    if (this.timeSheetsTemplateSettings) {
      this.isLeftVisible = !this.isLeftVisible;
      $('.divtoggleDiv')[1].style.display = 'block';
      console.log(element);
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
      this.timeSheetsTemplateSettings.reset();
      this.formDirective.resetForm();
      const control1 = <FormArray>this.timeSheetsTemplateSettings.controls['timeSheetsApplicants'];
      for (let i = control1.length - 1; i >= 0; i--) {
        control1.removeAt(i)
      }
      console.log('edit timesheet Template');
      this.timeSheetsTemplateSettings.controls.timeSheetsTemplateId.setValue(element.timeSheetsTemplateId);
      this.timeSheetsTemplateSettings.controls.templateName.setValue(element.templateName);
      this.timeSheetsTemplateSettings.controls.timeCaptureType.setValue(element.timeCaptureType);
      // this.timeSheetsTemplateSettings.controls.hoursForWorkWeek.setValue(element.hoursForWorkWeek);
      this.timeSheetsTemplateSettings.controls.timeLock.setValue('' + element.timeLock);
      this.timeSheetsTemplateSettings.controls.timeLockDate.setValue(element.timeLockDate);
      this.timeSheetsTemplateSettings.controls.timeSheetsApprovalType.setValue(element.timeSheetsApprovalType);
      this.timeSheetsTemplateSettings.controls.primaryApprover.setValue(element.primaryApprover);
      this.timeSheetsTemplateSettings.controls.secondaryApprover.setValue(element.secondaryApprover);

      this.timeSheetsTemplateSettings.controls.sunday.setValue(+element.workWeeks.sun);
      this.timeSheetsTemplateSettings.controls.monday.setValue(+element.workWeeks.mon);
      this.timeSheetsTemplateSettings.controls.tuesday.setValue(+element.workWeeks.tue);
      this.timeSheetsTemplateSettings.controls.wednesday.setValue(+element.workWeeks.wed);
      this.timeSheetsTemplateSettings.controls.thursday.setValue(+element.workWeeks.thurs);
      this.timeSheetsTemplateSettings.controls.friday.setValue(+element.workWeeks.fri);
      this.timeSheetsTemplateSettings.controls.saturday.setValue(+element.workWeeks.sat);
      this.timeSheetsTemplateSettings.controls.totalhours.setValue(+element.workWeeks.totalhours);
      // this.timeSheetsTemplateSettings.controls.onDutyRequestInitiators.setValue(element.onDutyRequestInitiators);
      const control = (this.timeSheetsTemplateSettings.controls['timeSheetsApplicants']) as FormArray
      element.timeSheetsApplicants.forEach(element => {
        control.push(new FormControl(element))

        this.requestInitiators.forEach(element1 => {
          if (element1.value === element) {
            element1.selected = true;
          }
        })
      });
      this.timeSheetsTemplateSettings.controls.approvalLevel.setValue(element.approvalLevel);
      this.timeSheetsTemplateSettings.controls.allSelections.patchValue(selections);
    }
    // else {
    //   this.warningNotification('You do not have access to modify attendance tenplate');
    // }
  }
  calculateHours() {
    var hours = (+this.timeSheetsTemplateSettings.controls.sunday.value) +
      (+this.timeSheetsTemplateSettings.controls.monday.value) +
      (+this.timeSheetsTemplateSettings.controls.tuesday.value) +
      (+this.timeSheetsTemplateSettings.controls.wednesday.value) +
      (+this.timeSheetsTemplateSettings.controls.thursday.value) +
      (+this.timeSheetsTemplateSettings.controls.friday.value) +
      (+this.timeSheetsTemplateSettings.controls.saturday.value)
    this.timeSheetsTemplateSettings.controls.totalhours.setValue(+hours);
  }

  saveTimeSheetTemplate() {
    this.check1 = true;
    let departmentIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    if (this.timeSheetsTemplateSettings.valid) {
      this.isValidFormSubmitted = true;
      this.isDisabled = true;
      let selections = this.timeSheetsTemplateSettings.controls.allSelections.value;
      if (selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'Departments') {
            departmentIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else {
            locationIds.push(element.value);
          }
        });
      }

      var body = {
        'bandId': bandIds,
        'departmentId': departmentIds,
        'designationId': designationIds,
        'locationId': locationIds,
        "templateName": this.timeSheetsTemplateSettings.controls.templateName.value,
        "timeCaptureType": this.timeSheetsTemplateSettings.controls.timeCaptureType.value,
        // "hoursForWorkWeek": this.timeSheetsTemplateSettings.controls.hoursForWorkWeek.value,
        // "timeLock": this.timeSheetsTemplateSettings.controls.timeLock.value,
        // "timeLockDate": this.timeSheetsTemplateSettings.controls.timeLockDate.value,
        "timeLock": false,
        "timeLockDate": null,
        "timeSheetsApprovalType": this.timeSheetsTemplateSettings.controls.timeSheetsApprovalType.value,
        "primaryApprover": this.timeSheetsTemplateSettings.controls.primaryApprover.value,
        "secondaryApprover": this.timeSheetsTemplateSettings.controls.secondaryApprover.value,
        "timeSheetsApplicants": this.timeSheetsTemplateSettings.controls.timeSheetsApplicants.value,
        "approvalLevel": this.timeSheetsTemplateSettings.controls.approvalLevel.value,
        "workWeeks": {
          "sun": +this.timeSheetsTemplateSettings.controls.sunday.value,
          "mon": +this.timeSheetsTemplateSettings.controls.monday.value,
          "tue": +this.timeSheetsTemplateSettings.controls.tuesday.value,
          "wed": +this.timeSheetsTemplateSettings.controls.wednesday.value,
          "thurs": +this.timeSheetsTemplateSettings.controls.thursday.value,
          "fri": +this.timeSheetsTemplateSettings.controls.friday.value,
          "sat": +this.timeSheetsTemplateSettings.controls.saturday.value,
          "totalhours": +this.timeSheetsTemplateSettings.controls.totalhours.value,
        }
        // "empCovered": this.timeSheetsTemplateSettings.controls.empCovered.value,
        // "onDutyTemplateId": this.timeSheetsTemplateSettings.controls.onDutyTemplateId.value;
        //   "secondaryRejCommentsMandatory": this.timeSheetsTemplateSettings.controls.secondaryRejCommentsMandatory.value
      }
      console.log('.......' + JSON.stringify(body));
      if (this.timeSheetsTemplateSettings.controls.timeSheetsTemplateId.value === null) {
        console.log('Inside if');
        // this.check1 = false;
        return this.serviceApi.post('/v1/timesheets/template/', body)
          .subscribe(
            res => {
              this.successNotification('TimeSheet Template Save Successfully');
              console.log(res);

              // this.templateResponse = res.onDutyTemplateId
              // console.log(this.templateResponse)
            },
            err => {
              console.log('there is error in edit api');
              console.log(err)
            },
            () => {
              this.getData();
              this.isLeftVisible = false;
              this.setPanel();
            }
          )
      } else {
        console.log('Inside else');
        // this.check1 = false;
        return this.serviceApi.put('/v1/timesheets/template/' + this.timeSheetsTemplateSettings.controls.timeSheetsTemplateId.value, body)
          .subscribe(
            res => {
              this.successNotification('TimeSheet Template Update Successfully');
              console.log(res);
              // this.templateResponse = res.onDutyTemplateId
              // console.log(this.templateResponse)
            },
            err => {
              console.log('there is error in edit api');
              console.log(err)
            },
            () => {
              this.getData();
              this.isLeftVisible = false;
              this.setPanel();
            }
          )
      }
    }
    else {
      Object.keys(this.timeSheetsTemplateSettings.controls).forEach(field => {
        const control = this.timeSheetsTemplateSettings.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  getData() {
    this.getTimeSheetsTemplate();
  }
  selectedTimelock() {
    if (this.timeSheetsTemplateSettings.controls.timeLock.value == 'true') {
      this.timeSheetsTemplateSettings.controls.timeLockDate.setValidators([Validators.required])
    } else if (this.timeSheetsTemplateSettings.controls.timeLock.value == 'false') {
      this.timeSheetsTemplateSettings.controls.timeLockDate.setValue(null);
      this.timeSheetsTemplateSettings.controls.timeLockDate.clearValidators();
    }
    this.timeSheetsTemplateSettings.controls.timeLockDate.updateValueAndValidity();
  }
  selectApprovalType() {
    if (this.timeSheetsTemplateSettings.controls.timeSheetsApprovalType.value === 'TEMPLATEWISE') {
      if (this.timeSheetsTemplateSettings.controls.approvalLevel.value === 'LEVEL1') {
        this.timeSheetsTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
      } else if (this.timeSheetsTemplateSettings.controls.approvalLevel.value === 'LEVEL2') {
        this.timeSheetsTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
        this.timeSheetsTemplateSettings.controls.secondaryApprover.setValidators([Validators.required]);
      }
    } else if (this.timeSheetsTemplateSettings.controls.timeSheetsApprovalType.value === 'EMPLOYEEWISE') {
      this.timeSheetsTemplateSettings.controls.primaryApprover.clearValidators();
      this.timeSheetsTemplateSettings.controls.secondaryApprover.clearValidators();
    }
    this.timeSheetsTemplateSettings.controls.primaryApprover.updateValueAndValidity();
    this.timeSheetsTemplateSettings.controls.secondaryApprover.updateValueAndValidity();
  }
  selectedApproval() {
    console.log("selectedApproval called ::: ")
    this.timeSheetsTemplateSettings.controls.primaryApprover.setValue(null);
    this.timeSheetsTemplateSettings.controls.secondaryApprover.setValue(null);
    if (this.timeSheetsTemplateSettings.controls.approvalLevel.value === 'LEVEL1') {
      if (this.timeSheetsTemplateSettings.controls.timeSheetsApprovalType.value === 'TEMPLATEWISE') {
        this.timeSheetsTemplateSettings.controls.primaryApprover.setValue(null);
        this.timeSheetsTemplateSettings.controls.secondaryApprover.setValue(null);
        this.timeSheetsTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
        this.timeSheetsTemplateSettings.controls.secondaryApprover.clearValidators();
      }
    } else if (this.timeSheetsTemplateSettings.controls.approvalLevel.value === 'LEVEL2') {
      if (this.timeSheetsTemplateSettings.controls.timeSheetsApprovalType.value === 'TEMPLATEWISE') {
        this.timeSheetsTemplateSettings.controls.primaryApprover.setValue(null);
        this.timeSheetsTemplateSettings.controls.secondaryApprover.setValue(null);
        this.timeSheetsTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
        this.timeSheetsTemplateSettings.controls.secondaryApprover.setValidators([Validators.required]);
      }
    }
    this.timeSheetsTemplateSettings.controls.primaryApprover.updateValueAndValidity();
    this.timeSheetsTemplateSettings.controls.secondaryApprover.updateValueAndValidity();
  }
}

@Component({
  templateUrl: './delete-Time-Sheet-Template.component.html',
})
export class DeleteTimeSheetTemplateComponent implements OnInit {
  action: string;
  message: any;
  id: any;
  constructor(public dialogRef: MatDialogRef<DeleteTimeSheetTemplateComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.id = this.data.templateId;
  }

  ngOnInit() { }

  delete() {
    this.serviceApi.delete('/v1/timesheets/template/' + this.id).subscribe(
      res => {
        if (res != null) {
          console.log('OnDuty Template Successfully Deleted');
          this.action = 'Response';
          this.message = res.message;
          this.close();
        } else {
          console.log('Template Record doesnot Exist');
        }
      }, err => {
        console.log('Something gone Wrong to delete the Template Record from Database');
        console.log('there is some error.....  ' + err.message);
        this.action = 'Error';
        this.close();
      },
      () => {
      }
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
