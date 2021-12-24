import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { element } from 'protractor';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable, SelectItem } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-general-attendance-settings',
  templateUrl: './general-attendance-settings.component.html',
  styleUrls: ['./general-attendance-settings.component.scss']
})
export class GeneralAttendanceSettingsComponent implements OnInit {

  reasonId: any;
  isLeftVisible: any;
  reason: any;
  applyLimit: any;
  applyTo: any;
  employeeType: any;
  applyOnEmployee: any;
  employees: any;
  selectedEmployees: any;

  @ViewChild("dt1") dt1: DataTable;
  @ViewChild("dt2") dt2: DataTable;
  columns = [
    { field: 'reason', header: 'Reason' },
    { field: 'applyOnEmployee', header: 'Visible To' },
    { field: 'action', header: 'Action' }
  ]
  // { field: 'image', header: 'Profile Pic' },
  dataSource: MatTableDataSource<AttandenceSettingData>;
  dataSource1: MatTableDataSource<AttandenceOnDutyData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  notificationMsg: any;
  action: any;

  regularizationReasonEmpAccessForm: FormGroup;
  isDisabled: boolean;
  attendanceSetting: any[];
  onDutyResons: any[];
  constructor(public dialog: MatDialog, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.getAllAttendeceSettingData();
    var rolesArr = KeycloakService.getUserRole();
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
    console.log('On Init Function Called');
      this.regularizationReasonEmpAccessForm = this._fb.group({
        regId: [],
        modifyEmpRegReq: [],
        modifyEmpOnDutyReason: [],
        rostersEnabled: []
      });
    this.getRegularizationReasonSettingStatus();
  }

  onChangeRegularizationReasonStatus(event: any) {
    const body = this.regularizationReasonEmpAccessForm.value;
    const val = this.regularizationReasonEmpAccessForm.controls.regId.value;
    this.serviceApi.put('/v1/attendance/settings/general/' + +val, body).subscribe(
      res => {
        if (res != null) {
          console.log('Sucessfully Updated The Status Regularization Reason for Employee Form');
        } else {
          console.log('Something gone Wrong in Updataion');
        }
      });
  }

  onChangeOndutyResonsStatus(event: any) {
    const body = this.regularizationReasonEmpAccessForm.value;
    const val = this.regularizationReasonEmpAccessForm.controls.regId.value;
    this.serviceApi.put('/v1/attendance/settings/general/' + +val, body).subscribe(
      res => {
        if (res != null) {
          console.log('Sucessfully Updated The Status Regularization Reason for Employee Form');
        } else {
          console.log('Something gone Wrong in Updataion');
        }
      });
  }

  onChangeRosterStatus(event: any) {
    const body = this.regularizationReasonEmpAccessForm.value;
    const val = this.regularizationReasonEmpAccessForm.controls.regId.value;
    this.serviceApi.put('/v1/attendance/settings/general/' + +val, body).subscribe(
      res => {
        if (res != null) {
          console.log('Sucessfully Updated The Roster Status Form');
        } else {
          console.log('Something gone Wrong in Updataion');
        }
      });
  }

  getRegularizationReasonSettingStatus() {
    console.log('Enter to Get Regularization Setting');
    this.serviceApi.get2('/v1/attendance/settings/general/').subscribe(
      res => {
        if (res != null) {          
            this.regularizationReasonEmpAccessForm = this._fb.group({
              regId: [res.regId],
              modifyEmpRegReq: [res.modifyEmpRegReq],
              modifyEmpOnDutyReason: [res.modifyEmpOnDutyReason],
              rostersEnabled: [res.rostersEnabled]
            });
          
        } 
      }
    );
  }
  getAllAttendeceSettingData() {
    console.log('Enter in the method to get List for Table');
    this.attendanceSetting = [];
    this.onDutyResons = [];
    this.serviceApi.get2('/v1/attendance/settings/regularizationReason/').
      subscribe(
        res => {
          console.log(' >>>>>>>>>>>>>>>>>>>> ' + JSON.stringify(res));
          if (res != null) {
            res.forEach(element => {
              this.attendanceSetting.push({
                reasonId: element.reasonId,
                reason: element.reason,
                frequencyRestriction: element.frequencyRestriction,
                applyLimit: element.applyLimit,
                applyTo: element.applyTo,
                applyOnEmployee: element.applyOnEmployee,
                selectedEmployees: element.selectedEmployees,
                reasonType: 'reg'
              });
            });

            this.dataSource = new MatTableDataSource(this.attendanceSetting);
          } else {
            console.log('Something gone wrong');
          }
        }, err => {
          console.log('Enter in the Error Block');
          if (err.status === 404 || err.statusText === 'OK') {
            this.attendanceSetting = [];
            this.dataSource = new MatTableDataSource(this.attendanceSetting);
          }
        }, () => {
          this.dt1.reset();
        }
      );
    this.serviceApi.get2('/v1/attendance/on-duty/reasons/get-all').subscribe(
      res => {
        console.log(' >>>>>>>>>>>>>>>>>>>> ' + JSON.stringify(res));
        if (res != null) {
          res.forEach(element => {
            this.onDutyResons.push({
              reasonId: element.onDutyReasonId,
              reason: element.reason,
              applyOnEmployee: element.applyOnEmployee,
              selectedEmployees: element.selectedEmployees,
              reasonType: 'onduty'
            });
          });
          this.dataSource = new MatTableDataSource(this.onDutyResons);
        } else {
          console.log('Something gone wrong');
        }
      }, err => {
        console.log('Enter in the Error Block');
        if (err.status === 404 || err.statusText === 'OK') {
          this.onDutyResons = [];
          this.dataSource1 = new MatTableDataSource(this.onDutyResons);
        }
      }, () => {
        this.dt2.reset();
      }
    );
  }

  // getAllAttendeceSettingData() {
  //   attendanceSetting = [];
  //   this.http.get('assets/data/Attendance/setting/general-setting/regularization-reason.json').
  //     subscribe(
  //     res => {
  //       res.forEach(element => {
  //         attendanceSetting.push(
  //           {
  //             reasonId: element.reasonId,
  //             reason: element.reason,
  //             applyLimit: element.applyLimit,
  //             applyTo: element.applyTo,
  //             employeeType: element.employeeType,
  //           });

  //       });
  //       this.dataSource = new MatTableDataSource(attendanceSetting);
  //     },
  //     () => {
  //       console.log('Enter into Else Bloack');
  //     }
  //     );

  // }


  openDialogToAddReason(): void {
    this.action = '';
    this.notificationMsg = '';
    this.isDisabled = false;
    const dialogRef = this.dialog.open(addGeneralAttendaceSetting, {
      // width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        message: this.notificationMsg,
        status: this.action,
        reasonId: this.reasonId,
        reason: this.reason,
        applyLimit: this.applyLimit,
        applyTo: this.applyTo,
        applyOnEmployee: this.applyOnEmployee,
        selectedEmployees: [],
        isDisabled: this.isDisabled
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

            this.getAllAttendeceSettingData();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }

  openDialogToAddOnDutyReason(): void {
    this.action = 'add';
    this.notificationMsg = '';
    this.isDisabled = false;
    const dialogRef = this.dialog.open(AddOnDutyResons, {
      // width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        message: this.notificationMsg,
        status: this.action,
        reasonId: this.reasonId,
        reason: this.reason,
        applyOnEmployee: this.applyOnEmployee,
        selectedEmployees: [],
        isDisabled: this.isDisabled
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);

            this.getAllAttendeceSettingData();
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  }


  // ------------this code open popup on click Edit Icon  button to Edit reason--------//

  openDialogTOEditReason(data: any) {
    this.isDisabled = true;
    console.log(data.selectedEmployees);
      this.isLeftVisible = !this.isLeftVisible;
      this.action = '';
      this.notificationMsg = '';
      console.log('Json Strings : ' + JSON.stringify(data));
      const dialogRef = this.dialog.open(addGeneralAttendaceSetting, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          reasonId: data.reasonId,
          reason: data.reason,
          frequencyRestriction: data.frequencyRestriction,
          applyLimit: data.applyLimit,
          applyTo: data.applyTo,
          applyOnEmployee: data.applyOnEmployee,
          selectedEmployees: data.selectedEmployees,
          isDisabled: this.isDisabled
        }
      },
      );
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getAllAttendeceSettingData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        this.isDisabled = false;
      });
  }

  openDialogTOEditOnDutyReason(data: any) {
    this.isDisabled = true;
    console.log(data.selectedEmployees);
      // this.isLeftVisible = !this.isLeftVisible;
      this.action = 'edit';
      this.notificationMsg = '';
      console.log('Json Strings : ' + JSON.stringify(data));
      const dialogRef = this.dialog.open(AddOnDutyResons, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          reasonId: data.reasonId,
          reason: data.reason,
          applyOnEmployee: data.applyOnEmployee,
          selectedEmployees: data.selectedEmployees,
          isDisabled: this.isDisabled
        }
      },
      );
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getAllAttendeceSettingData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        this.isDisabled = false;
      });
  }

  openDeleteDialog(data: any) {
      this.action = '';
      this.notificationMsg = '';
      const dialogRef = this.dialog.open(DeleteBAttendanceGeneralSetting, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title1: 'Do you want to delete this regularization reason?',
          title2: 'Do you want to delete this on duty reason?',
          message: this.notificationMsg,
          status: this.action,
          reasonId: data.reasonId,
          type: data.reasonType
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getAllAttendeceSettingData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
      });
  }
}


export interface AttandenceSettingData {
  reasonId: number;
  reason: string;
  frequencyRestriction: boolean;
  applyLimit: number;
  applyTo: string;
  applyOnEmployee: string;
  selectedEmployees: any;
}
export interface AttandenceOnDutyData {
  reasonId: number;
  reason: string;
  applyOnEmployee: string;
  selectedEmployees: any;
}
let attendanceSetting: AttandenceSettingData[] = [];
let onDutyResons: AttandenceOnDutyData[] = [];



@Component({
  templateUrl: 'add-general-setting.html',
  styleUrls: ['./general-attendance-dialog-component.scss']
})

export class addGeneralAttendaceSetting implements OnInit {
  hideShowSaveButton = true;
  hideShowUpdateButton = false;
  myControl = new FormControl();
  selectedEmployees = new FormControl();
  employeeList = [];
  optionsData = this.employeeList;
  action: any;
  error: any;
  hideShowfrequencyRestriction: any;
  selectedEmployeesList = [];
  myList1 = [];
  myList = [];
  public addGneneralAttendanceSetting: FormGroup;
  hideShowDivForSpecificEemployee: any;
  check: boolean;
  isDisabled: any;

  constructor(private validationMessagesService: ValidationMessagesService, public dialogRef: MatDialogRef<addGeneralAttendaceSetting>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    if (data) {
      for (let i = 0; i < data.selectedEmployees.length; i++) {
        this.myList1.push(data.selectedEmployees[i].empCode);
        this.myList.push({
          empCode: data.selectedEmployees[i].empCode
        });
      }
    }
    this.getAllEmployeeList();
    this.isDisabled = data.isDisabled;
    if (data.applyOnEmployee != null) {
      this.hideShowDivForSpecificEemployee = true;
    }
    if ('' + data.reasonId === 'undefined') {
      console.log('Enter in the Add Method ');
      this.hideShowUpdateButton = false;
      this.hideShowSaveButton = true;
    } else {
      console.log('Enter in the Edit method');
      this.hideShowUpdateButton = true;
      this.hideShowSaveButton = false;
      console.log('Selected Data Length : ' + data.selectedEmployees.length);
    }

    if (data.applyOnEmployee === 'SPECIFIC') {
      this.hideShowDivForSpecificEemployee = true;
    } else if (data.applyOnEmployee === 'ALL') {
      this.hideShowDivForSpecificEemployee = false;
    }
    this.addGneneralAttendanceSetting = this._fb.group({
      reasonId: [data.reasonId ? data.reasonId : null],
      reason: [data.reason ? data.reason : null, Validators.required],
      applyLimit: [data.applyLimit ? data.applyLimit : null],
      applyTo: [data.applyTo ? data.applyTo : null],
      applyOnEmployee: [data.applyOnEmployee ? data.applyOnEmployee : null, Validators.required],
      frequencyRestriction: [data.frequencyRestriction ? data.frequencyRestriction : null],
      selectedEmployees: [data.selectedEmployees ? data.selectedEmployees : null],
    });
  }
  applyOnEmployee() {
    if (this.addGneneralAttendanceSetting.controls.applyOnEmployee.value === 'SPECIFIC') {
      this.hideShowDivForSpecificEemployee = true;
      this.selectedEmployeesList = [];
      this.myList = [];
      this.myList1 = this.addGneneralAttendanceSetting.controls.selectedEmployees.value;
      this.addGneneralAttendanceSetting.controls.selectedEmployees.setValidators([Validators.required]);
      this.addGneneralAttendanceSetting.controls.selectedEmployees.setValue(this.selectedEmployeesList);

    } else if (this.addGneneralAttendanceSetting.controls.applyOnEmployee.value === 'ALL') {
      this.hideShowDivForSpecificEemployee = false;
      this.selectedEmployeesList = [];
      this.myList1 = [];
      this.myList = [];
      this.addGneneralAttendanceSetting.controls.selectedEmployees.clearValidators();
      this.addGneneralAttendanceSetting.controls.selectedEmployees.updateValueAndValidity();
      this.addGneneralAttendanceSetting.controls.selectedEmployees.setValue([]);
    }
  }
  ngOnInit() {
    if (this.isDisabled) {
      // this.addGneneralAttendanceSetting.get('reason').reset();
      this.addGneneralAttendanceSetting.get('reason').disable();
    } else {
      this.addGneneralAttendanceSetting.get('reason').enable();
    }
  }

  /***** Start the Retriving the List of Employees which will be added for the Admin Accessibilty *****/
  getAllEmployeeList() {
    console.log('ENter to get Employee Record Get funtion');
    return this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {
          this.employeeList.push({
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName
          });
        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }

  /***** End the Code of Employee List Retriving *****/


  clickRedioButtonForSpecificeEMp() {
    this.hideShowDivForSpecificEemployee = true;
    this.selectedEmployeesList = [];
    this.addGneneralAttendanceSetting.controls.selectedEmployees.setValue(this.selectedEmployeesList);
  }

  clickRadioButtonForAllEmployee() {
    this.hideShowDivForSpecificEemployee = false;
    this.selectedEmployeesList = [];
    this.addGneneralAttendanceSetting.controls.selectedEmployees.setValue([]);

  }

  addEmp(data: any) {
    if (!this.myList.some(e => e.empCode === data)) {
      this.myList.push({
        empCode: data
      });
    } else {
      this.myList = this.myList.filter(function (el) { return el.empCode !== data; });
    }
    for (let i = 0; i < this.myList.length; i++) {
      this.myList1[i] = this.myList[i].empCode;
    }
    console.log(this.myList1);
    this.addGneneralAttendanceSetting.controls.selectedEmployees.setValue(this.myList);
  }


  onChangeFrequencyRestriction(event: any) {
    this.addGneneralAttendanceSetting.controls.applyLimit.clearValidators();
    this.addGneneralAttendanceSetting.controls.applyTo.clearValidators();
    this.addGneneralAttendanceSetting.controls.applyTo.markAsUntouched();
    this.addGneneralAttendanceSetting.controls.applyLimit.markAsUntouched();
    if (event.checked === true) {
      this.addGneneralAttendanceSetting.controls.applyLimit.setValue(null);
      this.addGneneralAttendanceSetting.controls.applyLimit.setValidators([Validators.required]);
      this.addGneneralAttendanceSetting.controls.applyTo.setValue(null);
      this.addGneneralAttendanceSetting.controls.applyTo.setValidators([Validators.required]);

      Object.keys(this.addGneneralAttendanceSetting.controls).forEach(field => { // {1}
        const control = this.addGneneralAttendanceSetting.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
    this.addGneneralAttendanceSetting.controls.applyLimit.updateValueAndValidity();

    this.addGneneralAttendanceSetting.controls.applyTo.updateValueAndValidity();
  }
  onNoClick(): void {
    this.check = false;
    this.dialogRef.close();
  }
  resetSearch() {
    this.myControl.setValue('');
    this.optionsData = [];
    this.optionsData = this.employeeList;
  }


  /*****below method call when select multple employee from holiday modal***** */
  searchEmployeeName(data: any) {
    this.optionsData = this.employeeList.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }
  /*****above code clossed here***** */

  saveGenAttdSettingRegularizationReasonForm(data: any) {
    this.check = true;
    if (this.addGneneralAttendanceSetting.controls.applyOnEmployee.value === 'SPECIFIC') {
      if (this.addGneneralAttendanceSetting.controls.selectedEmployees.value !== []) {
        console.log(this.addGneneralAttendanceSetting.valid);
        if (this.addGneneralAttendanceSetting.valid) {
          this.serviceApi.post('/v1/attendance/settings/regularizationReason/', data.value)
            .subscribe(
              res => {
                if (res != null) {
                  console.log('Shift Record Successfully Deleted');
                  this.action = 'Response';
                  this.error = res.message;
                  this.addGneneralAttendanceSetting.reset();
                  this.close();
                } else {
                  console.log('Shift Record doesnot Exist');
                }
              }, err => {
                console.log('Something gone Wrong to delete the Shift Record from Database');
                console.log('there is something error.....  ' + err.message);
                this.action = 'Error';
                this.error = err.message;
                this.addGneneralAttendanceSetting.reset();
                this.close();
              });
          this.selectedEmployeesList = [];
        }
        this.check = false;
      }
    } else if (this.addGneneralAttendanceSetting.controls.applyOnEmployee.value === 'ALL') {
      console.log(this.addGneneralAttendanceSetting.valid);
      if (this.addGneneralAttendanceSetting.valid) {
        this.serviceApi.post('/v1/attendance/settings/regularizationReason/', data.value)
          .subscribe(
            res => {
              if (res != null) {
                console.log('Shift Record Successfully Deleted');
                this.action = 'Response';
                this.error = res.message;
                this.addGneneralAttendanceSetting.reset();
                this.close();
              } else {
                console.log('Shift Record doesnot Exist');
              }
            }, err => {
              console.log('Something gone Wrong to delete the Shift Record from Database');
              console.log('there is something error.....  ' + err.message);
              this.action = 'Error';
              this.error = err.message;
              this.addGneneralAttendanceSetting.reset();
              this.close();
            });
        this.selectedEmployeesList = [];
        this.check = false;
      }
    }
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  updateGenAttdSettingRegularizationReasonForm(data: any) {
    this.check = true;

    if (this.addGneneralAttendanceSetting.controls.applyOnEmployee.value === 'SPECIFIC') {
      if (this.addGneneralAttendanceSetting.valid && this.myList1.length !== 0) {
        console.log('Enter in the Update Function ' + data.value);

        console.log('Send Value' + JSON.stringify(data.value));
        console.log('Updated Value' + JSON.stringify(this.addGneneralAttendanceSetting.value));
        const val = data.value.reasonId;
        this.serviceApi.put('/v1/attendance/settings/regularizationReason/' + +val, data.value).subscribe(
          res => {
            if (res != null) {
              console.log('Shift Record Successfully Deleted');
              this.action = 'Response';
              this.error = res.message;
              this.close();
            } else {
              console.log('Shift Record doesnot Exist');
            }
          }, err => {
            console.log('Something gone Wrong to delete the Shift Record from Database');
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          }
        );
      }
      this.check = false;
    } else if (this.addGneneralAttendanceSetting.controls.applyOnEmployee.value === 'ALL') {
      if (this.addGneneralAttendanceSetting.valid) {
        console.log('Enter in the Update Function ' + data.value);
        const val = data.value.reasonId;
        this.serviceApi.put('/v1/attendance/settings/regularizationReason/' + +val, data.value).subscribe(
          res => {
            if (res != null) {
              console.log('Shift Record Successfully Deleted');
              this.action = 'Response';
              this.error = res.message;
              this.close();
            } else {
              console.log('Shift Record doesnot Exist');
            }
          }, err => {
            console.log('Something gone Wrong to delete the Shift Record from Database');
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          }
        );
      }
      this.check = false;
    }
  }
}

@Component({
  templateUrl: 'add-On-Duty-Reasons.html',
  styleUrls: ['./general-attendance-dialog-component.scss']
})

export class AddOnDutyResons implements OnInit {
  hideShowSaveButton = true;
  hideShowUpdateButton = false;
  myControl = new FormControl();
  selectedEmployees = new FormControl();
  employeeList = [];
  optionsData = this.employeeList;
  action: any;
  error: any;
  hideShowfrequencyRestriction: any;
  selectedEmployeesList = [];
  myList1 = [];
  myList = [];
  public addAttendanceOnDutySetting: FormGroup;
  hideShowDivForSpecificEemployee: any;
  check: boolean;
  isDisabled: any;

  constructor(private validationMessagesService: ValidationMessagesService, public dialogRef: MatDialogRef<AddOnDutyResons>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    if (data) {
      for (let i = 0; i < data.selectedEmployees.length; i++) {
        this.myList1.push(data.selectedEmployees[i].empCode);
        this.myList.push({
          empCode: data.selectedEmployees[i].empCode
        });
      }
    }
    this.getAllEmployeeList();
    this.isDisabled = data.isDisabled;
    if (data.applyOnEmployee != null) {
      this.hideShowDivForSpecificEemployee = true;
    }
    if (data.status === 'add') {
      console.log('Enter in the Add Method ');
      this.hideShowUpdateButton = false;
      this.hideShowSaveButton = true;
    } else if (data.status === 'edit') {
      console.log('Enter in the Edit method');
      this.hideShowUpdateButton = true;
      this.hideShowSaveButton = false;
      console.log('Selected Data Length : ' + data.selectedEmployees.length);
    }

    if (data.applyOnEmployee === 'SPECIFIC') {
      this.hideShowDivForSpecificEemployee = true;
    } else if (data.applyOnEmployee === 'ALL') {
      this.hideShowDivForSpecificEemployee = false;
    }
    this.addAttendanceOnDutySetting = this._fb.group({
      reasonId: [data.reasonId],
      reason: [data.reason, Validators.required],
      applyOnEmployee: [data.applyOnEmployee, Validators.required],
      selectedEmployees: [data.selectedEmployees],
    });
  }
  applyOnEmployee() {
    if (this.addAttendanceOnDutySetting.controls.applyOnEmployee.value === 'SPECIFIC') {
      this.hideShowDivForSpecificEemployee = true;
      this.selectedEmployeesList = [];
      this.myList = [];
      this.myList1 = this.addAttendanceOnDutySetting.controls.selectedEmployees.value;
      this.selectedEmployees.setValidators([Validators.required]);
      this.addAttendanceOnDutySetting.controls.selectedEmployees.setValue(this.selectedEmployeesList);

    } else if (this.addAttendanceOnDutySetting.controls.applyOnEmployee.value === 'ALL') {
      this.hideShowDivForSpecificEemployee = false;
      this.selectedEmployeesList = [];
      this.myList1 = [];
      this.myList = [];
      this.selectedEmployees.clearValidators();
      this.addAttendanceOnDutySetting.controls.selectedEmployees.setValue([]);
    }
    this.selectedEmployees.updateValueAndValidity();
  }
  ngOnInit() {

  }

  /***** Start the Retriving the List of Employees which will be added for the Admin Accessibilty *****/
  getAllEmployeeList() {
    console.log('ENter to get Employee Record Get funtion');
    return this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {
          this.employeeList.push({
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName
          });
        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }

  /***** End the Code of Employee List Retriving *****/


  clickRedioButtonForSpecificeEMp() {
    this.hideShowDivForSpecificEemployee = true;
    this.selectedEmployeesList = [];
    this.addAttendanceOnDutySetting.controls.selectedEmployees.setValue(this.selectedEmployeesList);
  }

  clickRadioButtonForAllEmployee() {
    this.hideShowDivForSpecificEemployee = false;
    this.selectedEmployeesList = [];
    this.addAttendanceOnDutySetting.controls.selectedEmployees.setValue([]);

  }

  addEmp(data: any) {
    if (!this.myList.some(e => e.empCode === data)) {
      this.myList.push({
        empCode: data
      });
    } else {
      this.myList = this.myList.filter(function (el) { return el.empCode !== data; });
    }
    for (let i = 0; i < this.myList.length; i++) {
      this.myList1[i] = this.myList[i].empCode;
    }
    console.log(this.myList1);
    this.addAttendanceOnDutySetting.controls.selectedEmployees.setValue(this.myList);

  }
  onNoClick(): void {
    this.check = false;
    this.dialogRef.close();
  }
  resetSearch() {
    this.myControl.setValue('');
    this.optionsData = [];
    this.optionsData = this.employeeList;
  }


  /*****below method call when select multple employee from holiday modal***** */
  searchEmployeeName(data: any) {
    this.optionsData = this.employeeList.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }
  /*****above code clossed here***** */

  saveGenAttdOnDutyReasonForm(data: any) {
    this.check = true;
    if (this.addAttendanceOnDutySetting.valid && this.selectedEmployees.valid) {
      console.log(this.addAttendanceOnDutySetting.valid);
      if (this.addAttendanceOnDutySetting.controls.applyOnEmployee.value === 'SPECIFIC') {

        this.serviceApi.post('/v1/attendance/on-duty/reasons/', data.value)
          .subscribe(
            res => {
              if (res != null) {
                console.log('Shift Record Successfully Deleted');
                this.action = 'Response';
                this.error = res.message;
                this.addAttendanceOnDutySetting.reset();
                this.close();
              } else {
                console.log('Shift Record doesnot Exist');
              }
            }, err => {
              console.log('Something gone Wrong to delete the Shift Record from Database');
              console.log('there is something error.....  ' + err.message);
              this.action = 'Error';
              this.error = err.message;
              this.addAttendanceOnDutySetting.reset();
              this.close();
            });
        this.selectedEmployeesList = [];
        this.check = false;
      } else if (this.addAttendanceOnDutySetting.controls.applyOnEmployee.value === 'ALL') {
        this.serviceApi.post('/v1/attendance/on-duty/reasons/', data.value)
          .subscribe(
            res => {
              if (res != null) {
                console.log('Shift Record Successfully Deleted');
                this.action = 'Response';
                this.error = res.message;
                this.addAttendanceOnDutySetting.reset();
                this.close();
              } else {
                console.log('Shift Record doesnot Exist');
              }
            }, err => {
              console.log('Something gone Wrong to delete the Shift Record from Database');
              console.log('there is something error.....  ' + err.message);
              this.action = 'Error';
              this.error = err.message;
              this.addAttendanceOnDutySetting.reset();
              this.close();
            });
        this.selectedEmployeesList = [];
        this.check = false;
      }
    } else {
      Object.keys(this.addAttendanceOnDutySetting.controls).forEach(field => { // {1}
        const control = this.addAttendanceOnDutySetting.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.selectedEmployees.markAsTouched();
    }
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  updateGenAttdOnDutyReasonForm(element: any) {
    this.check = true;
    if (this.addAttendanceOnDutySetting.valid && this.selectedEmployees.valid) {
      if (this.addAttendanceOnDutySetting.controls.applyOnEmployee.value === 'SPECIFIC') {
        console.log('Enter in the Update Function ' + element.value);
        console.log('Send Value' + JSON.stringify(element.value));
        console.log('Updated Value' + JSON.stringify(this.addAttendanceOnDutySetting.value));
        const val = element.value.reasonId;
        this.serviceApi.put('/v1/attendance/on-duty/reasons/' + +val, element.value).subscribe(
          res => {
            if (res != null) {
              console.log('Onduty reasons Successfully updated');
              this.action = 'Response';
              this.error = res.message;
              this.close();
            } else {
              console.log('Onduty reasons doesnot Exist');
            }
          }, err => {
            console.log('Something gone Wrong to update the onduty reasons from Database');
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          }
        );
        this.check = false;
      }
      else if (this.addAttendanceOnDutySetting.controls.applyOnEmployee.value === 'ALL') {
        console.log('Enter in the Update Function ' + element.value);
        const val = element.value.reasonId;
        this.serviceApi.put('/v1/attendance/on-duty/reasons/' + +val, element.value).subscribe(
          res => {
            if (res != null) {
              console.log('Onduty reasons Successfully updated');
              this.action = 'Response';
              this.error = res.message;
              this.close();
            } else {
              console.log('Onduty reasons doesnot Exist');
            }
          }, err => {
            console.log('Something gone Wrong to update the onduty reasons from Database');
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          }
        );
        this.check = false;
      }
    } else {
      Object.keys(this.addAttendanceOnDutySetting.controls).forEach(field => { // {1}
        const control = this.addAttendanceOnDutySetting.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.selectedEmployees.markAsTouched();
    }
  }
}



@Component({
  templateUrl: 'delete-general-attendance-setting.html',
  styleUrls: ['./general-attendance-dialog-component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DeleteBAttendanceGeneralSetting implements OnInit {
  action: any;
  error: any;
  title1: any;
  title2: any;
  hideShowRegDeleteButton: boolean;
  hideShowOndutyDeleteButton: boolean;
  constructor(
    public dialogRef: MatDialogRef<DeleteBAttendanceGeneralSetting>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.title1 = this.data.title1;
    this.title2 = this.data.title2;
    if (data.type === 'reg') {
      console.log('Enter in the Add Method ');
      this.hideShowOndutyDeleteButton = false;
      this.hideShowRegDeleteButton = true;
    } else if (data.type === 'onduty') {
      console.log('Enter in the Edit method');
      this.hideShowOndutyDeleteButton = true;
      this.hideShowRegDeleteButton = false;
    }
  }
  ngOnInit() {
  }
  onNoClick(): void {

    this.dialogRef.close();
  }

  onDelete() {
    const val = this.data.reasonId;
    return this.serviceApi.delete('/v1/attendance/settings/regularizationReason/' + +val)
      .subscribe(
        res => {
          console.log('Successfully Record Deleted');
          if (res != null) {
            console.log('Shift Record Successfully Deleted');
            this.action = 'Response';
            this.error = res.message;
            this.close();
          } else {
            console.log('Shift Record doesnot Exist');
          }
        },
        err => {
          console.log('there is something error');
          console.log('Something gone Wrong to delete the Shift Record from Database');
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }
      );
  }
  onDutyDelete() {
    const val = this.data.reasonId;
    return this.serviceApi.delete('/v1/attendance/on-duty/reasons/' + +val)
      .subscribe(
        res => {
          console.log('Successfully Record Deleted');
          if (res != null) {
            console.log('Shift Record Successfully Deleted');
            this.action = 'Response';
            this.error = res.message;
            this.close();
          } else {
            console.log('Shift Record doesnot Exist');
          }
        },
        err => {
          console.log('there is something error');
          console.log('Something gone Wrong to delete the Shift Record from Database');
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }
      );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}
