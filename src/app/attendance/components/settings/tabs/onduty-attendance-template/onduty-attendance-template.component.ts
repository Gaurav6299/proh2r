import { Component, OnInit, ViewChild, Inject, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, NgForm } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatRadioButton } from '@angular/material';
import { MatRadioChange, MatStepper } from '@angular/material';
import { Theme } from 'fullcalendar';
import { ValidationMessagesService } from '../../..../../../../../validation-messages.service';
declare var $: any;
@Component({
  selector: 'app-onduty-attendance-template',
  templateUrl: './onduty-attendance-template.component.html',
  styleUrls: ['./onduty-attendance-template.component.scss']
})
export class OndutyAttendanceTemplateComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'templateName', header: 'Template Name' },
    { field: 'totalEmpCovered', header: 'No. Of Employee Covered' },
    { field: 'actions', header: 'Actions' }
  ]
  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  notificationMsg: any;
  action: any;
  check1: boolean;
  templateResponse: any;
  isValidFormSubmitted = true;
  isDisabled: any = false;
  onDutyAttendanceTemplateSettings: FormGroup;
  getOndutyAttendanceTemplateList = [];
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
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  requestInitiators = [{ value: 'ADMIN', viewValue: 'Admin', selected: false }, { value: 'EMPLOYEE', viewValue: 'Employee', selected: false }, { value: 'SUPERVISOR', viewValue: 'Team Supervisor', selected: false }]
  constructor(private serviceApi: ApiCommonService, private fb: FormBuilder, public dialog: MatDialog, public validationMessagesService: ValidationMessagesService) {
    this.getOndutyAttendanceTemplate();

  }

  ngOnInit() {
    this.onDutyAttendanceTemplateSettings = this.fb.group({
      onDutyTemplateId: [],
      templateName: ['', Validators.required],
      commentMandatory: [null, Validators.required],
      // captureLocation: [null, Validators.required],
      multipleDaysApplicable: [null, Validators.required],
      // defaultShiftTimingStatus: [null, Validators.required],
      approvalType: [null, Validators.required],
      primaryApprover: [],
      secondaryApprover: [],
      onDutyRequestInitiators: new FormArray([], [Validators.required]),
      approvalLevel: [null, Validators.required],
      allSelections: [],
      primaryAppCommentsMandatory: [null],
      primaryRejCommentsMandatory: [null],
      secondaryAppCommentsMandatory: [null],
      secondaryRejCommentsMandatory: [null]
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
            if (element.locationCode != null) {
              this.allSelections = [...this.allSelections, {
                value: element.locationId,
                viewValue: element.locationCode.toUpperCase() + ' - ' + element.cityName,
                type: 'Locations'
              }];
            }
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
    this.onDutyAttendanceTemplateSettings.reset();
    this.formDirective.resetForm();
    const control = <FormArray>this.onDutyAttendanceTemplateSettings.controls['onDutyRequestInitiators'];
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
    this.onDutyAttendanceTemplateSettings.reset();
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
  openDeleteOndutyAttendanceTemplateDialog(element: any) {
    const dialogRef = this.dialog.open(DeleteOndutyTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        templateId: element.onDutyTemplateId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == 'Response') {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          this.successNotification(result.message);
          this.getOndutyAttendanceTemplate();
        }
      }
    });
  }

  getOndutyAttendanceTemplate() {
    this.getOndutyAttendanceTemplateList = [];
    this.serviceApi.get('/v1/attendance/settings/onduty/template/get/all').subscribe(res => {
      res.forEach(element => {
        this.getOndutyAttendanceTemplateList.push({
          onDutyTemplateId: element.onDutyTemplateId,
          templateName: element.templateName,
          totalEmpCovered: element.empCovered,
          commentMandatory: element.commentMandatory,
          // captureLocation: element.captureLocation,
          multipleDaysApplicable: element.multipleDaysApplicable,
          // defaultShiftTimingStatus: element.defaultShiftTimingStatus,
          approvalType: element.approvalType,
          primaryApprover: element.primaryApprover,
          secondaryApprover: element.secondaryApprover,
          onDutyRequestInitiators: element.onDutyRequestInitiators,
          approvalLevel: element.approvalLevel,
          departmentId: element.departmentIds,
          designationId: element.designationIds,
          bandId: element.bandIds,
          locationId: element.locationIds,
          primaryAppCommentsMandatory: element.primaryAppCommentsMandatory,
          primaryRejCommentsMandatory: element.primaryRejCommentsMandatory,
          secondaryAppCommentsMandatory: element.secondaryAppCommentsMandatory,
          secondaryRejCommentsMandatory: element.secondaryRejCommentsMandatory
        })
      });
    },
      (err) => {

      }, () => {
        this.dt.reset();
      });

  }

  onChange(event) {

    const control = (this.onDutyAttendanceTemplateSettings.controls['onDutyRequestInitiators']) as FormArray
    if (event.checked) {
      control.push(new FormControl(event.source.value))
    } else {
      const i = control.controls.findIndex(x => x.value === event.source.value);
      control.removeAt(i);
    }
  }
  editTemplate(element: any) {
    this.check1 = false;
    if (this.onDutyAttendanceTemplateSettings) {
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
      this.onDutyAttendanceTemplateSettings.reset();
      this.formDirective.resetForm();
      const control1 = <FormArray>this.onDutyAttendanceTemplateSettings.controls['onDutyRequestInitiators'];
      for (let i = control1.length - 1; i >= 0; i--) {
        control1.removeAt(i)
      }
      console.log('edit Onduty attendance Template');
      this.onDutyAttendanceTemplateSettings.controls.onDutyTemplateId.setValue(element.onDutyTemplateId);
      this.onDutyAttendanceTemplateSettings.controls.templateName.setValue(element.templateName);
      this.onDutyAttendanceTemplateSettings.controls.commentMandatory.setValue('' + element.commentMandatory);
      // this.onDutyAttendanceTemplateSettings.controls.captureLocation.setValue('' + element.captureLocation);
      this.onDutyAttendanceTemplateSettings.controls.multipleDaysApplicable.setValue('' + element.multipleDaysApplicable);
      // this.onDutyAttendanceTemplateSettings.controls.defaultShiftTimingStatus.setValue('' + element.defaultShiftTimingStatus);
      this.onDutyAttendanceTemplateSettings.controls.approvalType.setValue(element.approvalType);
      this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValue(element.primaryApprover);
      this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.setValue(element.secondaryApprover);

      this.onDutyAttendanceTemplateSettings.controls.primaryAppCommentsMandatory.setValue('' + element.primaryAppCommentsMandatory);
      this.onDutyAttendanceTemplateSettings.controls.primaryRejCommentsMandatory.setValue('' + element.primaryRejCommentsMandatory);
      this.onDutyAttendanceTemplateSettings.controls.secondaryAppCommentsMandatory.setValue('' + element.secondaryAppCommentsMandatory);
      this.onDutyAttendanceTemplateSettings.controls.secondaryRejCommentsMandatory.setValue('' + element.secondaryRejCommentsMandatory);


      // this.onDutyAttendanceTemplateSettings.controls.onDutyRequestInitiators.setValue(element.onDutyRequestInitiators);
      const control = (this.onDutyAttendanceTemplateSettings.controls['onDutyRequestInitiators']) as FormArray
      element.onDutyRequestInitiators.forEach(element => {
        control.push(new FormControl(element))

        this.requestInitiators.forEach(element1 => {
          if (element1.value === element) {
            element1.selected = true;
          }


        })
      });

      this.onDutyAttendanceTemplateSettings.controls.approvalLevel.setValue(element.approvalLevel);
      this.onDutyAttendanceTemplateSettings.controls.allSelections.patchValue(selections);
    }
    // else {
    //   this.warningNotification('You do not have access to modify attendance tenplate');
    // }
  }

  saveOnDutyRecord() {
    this.check1 = true;
    let departmentIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    if (this.onDutyAttendanceTemplateSettings.valid) {
      this.isValidFormSubmitted = true;
      this.isDisabled = true;
      let selections = this.onDutyAttendanceTemplateSettings.controls.allSelections.value;
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
        "templateName": this.onDutyAttendanceTemplateSettings.controls.templateName.value,
        // "captureLocation": this.onDutyAttendanceTemplateSettings.controls.captureLocation.value,
        "multipleDaysApplicable": this.onDutyAttendanceTemplateSettings.controls.multipleDaysApplicable.value,
        // "defaultShiftTimingStatus": this.onDutyAttendanceTemplateSettings.controls.defaultShiftTimingStatus.value,
        "approvalType": this.onDutyAttendanceTemplateSettings.controls.approvalType.value,
        "commentMandatory": this.onDutyAttendanceTemplateSettings.controls.commentMandatory.value,
        "primaryApprover": this.onDutyAttendanceTemplateSettings.controls.primaryApprover.value,
        "secondaryApprover": this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.value,
        "onDutyRequestInitiators": this.onDutyAttendanceTemplateSettings.controls.onDutyRequestInitiators.value,
        "approvalLevel": this.onDutyAttendanceTemplateSettings.controls.approvalLevel.value,
        // "empCovered": this.onDutyAttendanceTemplateSettings.controls.empCovered.value,
        // "onDutyTemplateId": this.onDutyAttendanceTemplateSettings.controls.onDutyTemplateId.value


        "primaryAppCommentsMandatory": this.onDutyAttendanceTemplateSettings.controls.primaryAppCommentsMandatory.value,
        "primaryRejCommentsMandatory": this.onDutyAttendanceTemplateSettings.controls.primaryRejCommentsMandatory.value,
        "secondaryAppCommentsMandatory": this.onDutyAttendanceTemplateSettings.controls.secondaryAppCommentsMandatory.value,
        "secondaryRejCommentsMandatory": this.onDutyAttendanceTemplateSettings.controls.secondaryRejCommentsMandatory.value
      }
      console.log('.......' + JSON.stringify(body));
      if (this.onDutyAttendanceTemplateSettings.controls.onDutyTemplateId.value === null) {
        console.log('Inside if');
        // this.check1 = false;
        return this.serviceApi.post('/v1/attendance/settings/onduty/template/', body)
          .subscribe(
            res => {
              this.successNotification('Onduty Attendance Template Save Successfully');
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
        return this.serviceApi.put('/v1/attendance/settings/onduty/template/' + this.onDutyAttendanceTemplateSettings.controls.onDutyTemplateId.value, body)
          .subscribe(
            res => {
              this.successNotification('Onduty Attendance Template Update Successfully');
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
      Object.keys(this.onDutyAttendanceTemplateSettings.controls).forEach(field => {
        const control = this.onDutyAttendanceTemplateSettings.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  getData() {
    this.getOndutyAttendanceTemplate();
  }
  selectApprovalType() {
    if (this.onDutyAttendanceTemplateSettings.controls.approvalType.value === 'TEMPLATEWISE') {
      if (this.onDutyAttendanceTemplateSettings.controls.approvalLevel.value === 'FIRST_LEVEL') {
        this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
      } else if (this.onDutyAttendanceTemplateSettings.controls.approvalLevel.value === 'SECOND_LEVEL') {
        this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
        this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.setValidators([Validators.required]);
      }
    } else if (this.onDutyAttendanceTemplateSettings.controls.approvalType.value === 'EMPLOYEEWISE') {
      this.onDutyAttendanceTemplateSettings.controls.primaryApprover.clearValidators();
      this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.clearValidators();
    }
    this.onDutyAttendanceTemplateSettings.controls.primaryApprover.updateValueAndValidity();
    this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.updateValueAndValidity();
  }
  selectedApproval() {
    console.log("selectedApproval called ::: ");

    if (this.onDutyAttendanceTemplateSettings.controls.approvalLevel.value === 'FIRST_LEVEL') {
      this.onDutyAttendanceTemplateSettings.controls.primaryAppCommentsMandatory.setValue(null),
        this.onDutyAttendanceTemplateSettings.controls.primaryRejCommentsMandatory.setValue(null),
        this.onDutyAttendanceTemplateSettings.controls.primaryAppCommentsMandatory.setValidators([Validators.required]);
      this.onDutyAttendanceTemplateSettings.controls.primaryRejCommentsMandatory.setValidators([Validators.required]);
      this.onDutyAttendanceTemplateSettings.controls.secondaryAppCommentsMandatory.setValue(false)
      this.onDutyAttendanceTemplateSettings.controls.secondaryRejCommentsMandatory.setValue(false)

    } else if (this.onDutyAttendanceTemplateSettings.controls.approvalLevel.value === 'SECOND_LEVEL') {
      this.onDutyAttendanceTemplateSettings.controls.primaryAppCommentsMandatory.setValue(null)
      this.onDutyAttendanceTemplateSettings.controls.primaryRejCommentsMandatory.setValue(null)
      this.onDutyAttendanceTemplateSettings.controls.secondaryAppCommentsMandatory.setValue(null)
      this.onDutyAttendanceTemplateSettings.controls.secondaryRejCommentsMandatory.setValue(null)
      this.onDutyAttendanceTemplateSettings.controls.primaryAppCommentsMandatory.setValidators([Validators.required]);
      this.onDutyAttendanceTemplateSettings.controls.primaryRejCommentsMandatory.setValidators([Validators.required]);
      this.onDutyAttendanceTemplateSettings.controls.secondaryAppCommentsMandatory.setValidators([Validators.required]);
      this.onDutyAttendanceTemplateSettings.controls.secondaryRejCommentsMandatory.setValidators([Validators.required]);
    }


    this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValue(null);
    this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.setValue(null);
    if (this.onDutyAttendanceTemplateSettings.controls.approvalLevel.value === 'FIRST_LEVEL' &&
      this.onDutyAttendanceTemplateSettings.controls.approvalType.value === 'TEMPLATEWISE') {
      this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValue(null);
      this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.setValue(null);
      this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
      this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.clearValidators();
    } else if (this.onDutyAttendanceTemplateSettings.controls.approvalLevel.value === 'SECOND_LEVEL' &&
      this.onDutyAttendanceTemplateSettings.controls.approvalType.value === 'TEMPLATEWISE') {
      this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValue(null);
      this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.setValue(null);
      this.onDutyAttendanceTemplateSettings.controls.primaryApprover.setValidators([Validators.required]);
      this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.setValidators([Validators.required]);
    }
    this.onDutyAttendanceTemplateSettings.controls.primaryApprover.updateValueAndValidity();
    this.onDutyAttendanceTemplateSettings.controls.secondaryApprover.updateValueAndValidity();
    this.onDutyAttendanceTemplateSettings.controls.primaryAppCommentsMandatory.updateValueAndValidity();
    this.onDutyAttendanceTemplateSettings.controls.primaryRejCommentsMandatory.updateValueAndValidity();
    this.onDutyAttendanceTemplateSettings.controls.secondaryAppCommentsMandatory.updateValueAndValidity();
    this.onDutyAttendanceTemplateSettings.controls.secondaryRejCommentsMandatory.updateValueAndValidity();

  }


}

@Component({
  templateUrl: './delete-Onduty-Template.component.html',
})
export class DeleteOndutyTemplateComponent implements OnInit {
  action: string;
  message: any;
  id: any;
  constructor(public dialogRef: MatDialogRef<DeleteOndutyTemplateComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.id = this.data.templateId;
  }

  ngOnInit() { }

  delete() {
    this.serviceApi.delete('/v1/attendance/settings/onduty/template/' + this.id).subscribe(
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
