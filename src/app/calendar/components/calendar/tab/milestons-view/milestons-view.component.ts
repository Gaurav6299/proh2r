import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { validateConfig } from '@angular/router/src/config';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { concat } from 'rxjs/operator/concat';
import { element } from 'protractor';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { CalendarComponent } from '../../calendar.component';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';

declare var $: any;


@Component({
  selector: 'app-milestons-view',
  templateUrl: './milestons-view.component.html',
  styleUrls: ['./milestons-view.component.scss']
})
export class MilestonsViewComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  // tslint:disable-next-line:max-line-length
  // displayedColumns = ['eventName', 'appliedType', 'eventId'];
  columns = [
    { field: 'eventName', header: 'Name Of Milestone' },
    { field: 'appliedType', header: 'Who Can View It' },
    { field: 'actions', header: 'Actions' }
  ]
  dataSource = new MatTableDataSource<Element>();
  @ViewChild('milestoneForm') form;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  status: any;
  errorMessage: any;
  isLeftVisible: any;
  updateButton: any;
  saveButton: any;
  backButton: any;
  panelFirstWidth: any;
  panelFirstHeight: any;
  mileStonesTableData = [];
  employeeList = [];
  employeeListCopy = [];
  hideShowEmployeeSelector: boolean;
  eventTypeHideShow: any;
  notificationMsg: any;
  action: any;
  editTrue: any;
  myControl = new FormControl();
  employeeIds = new FormControl();
  optionsData = [];
  empCodeList = [];
  mySelectedEmpList = [];
  seletedEmployeesCode = [];
  requiredTextField: any;
  requiredRadioButton: any;
  requiredDropdownButton: any;
  requiredDateField: any;
  public calendarSettingForm: FormGroup;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateField = message);
    this.getAllMileStonesRecord();
    this.getAllEmployeeList();
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

  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }

  ngOnInit() {
    this.calendarSettingForm = this.fb.group({
      eventId: [],
      eventType: [null, [Validators.required]],
      eventName: [null, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      occurrenceDate: [null, [
        Validators.required
      ]],
      occurrenceRepeat: [null, [
        Validators.required
      ]],
      appliedType: [null, [
        Validators.required
      ]],
      appliedToEmployee: [],
      default: [],
      colorCode: [null],
    });
  }





  clearAllFormData() {
    // tslint:disable-next-line:no-unused-expression
    this.calendarSettingForm = this.fb.group({
      eventId: [],
      eventType: [null, [Validators.required]],
      eventName: [null, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      occurrenceDate: [null, [
        Validators.required
      ]],
      occurrenceRepeat: [null, [
        Validators.required
      ]],
      appliedType: [null, [
        Validators.required
      ]],
      appliedToEmployee: [],
      default: [],
      colorCode: ['#4f4f4f'],
    });

    this.myControl.reset();
    this.mySelectedEmpList = [];

    Object.keys(this.calendarSettingForm.controls).forEach(field => { // {1}
      const control = this.calendarSettingForm.get(field);            // {2}
      control.markAsUntouched({ onlySelf: true });       // {3}
    });
  }

  addNewMileStone() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.calendarSettingForm.reset();
    this.clearAllFormData();
    this.employeeIds.reset();
    this.editTrue = false;
    this.updateButton = false;
    this.saveButton = true;
    this.backButton = true;
    this.form.resetForm();
    if (this.calendarSettingForm.controls.colorCode.value == null) {
      this.calendarSettingForm.controls.colorCode.setValue('');
    }
  }

  editMileStoneReocrd(data: any) {
    this.mySelectedEmpList = [];
    this.seletedEmployeesCode = [];
      $('.divtoggleDiv')[1].style.display = 'block';
      this.isLeftVisible = !this.isLeftVisible;
      this.updateButton = true;
      this.saveButton = false;
      this.backButton = true;
      this.editTrue = true;
      if (data.appliedType === 'ALL') {
        this.hideShowEmployeeSelector = false;
        this.employeeIds.clearValidators();
        this.employeeIds.updateValueAndValidity();
      } else if (data.appliedType === 'SPECIFIC') {
        this.employeeIds.setValidators([Validators.required]);
        this.hideShowEmployeeSelector = true;
      }
      this.calendarSettingForm = this.fb.group({
        eventId: [data.eventId],
        eventType: [data.eventType],
        eventName: [data.eventName],
        // emailNotification: ['' + data.emailNotification],
        occurrenceDate: [data.occurrenceDate],
        occurrenceRepeat: ['' + data.occurrenceRepeat],
        appliedType: [data.appliedType],
        appliedToEmployee: [data.appliedToEmployee],
        default: [data.default],
        colorCode: [data.colorCode!=null?data.colorCode:'#4f4f4f']
      });

      data.appliedToEmployee.forEach(elementObj => {
        this.mySelectedEmpList.push(elementObj.empCode);
        this.seletedEmployeesCode.push({
          empCode: elementObj.empCode
        });
      });

  }

  cancelMileStoneForm() {
    this.calendarSettingForm.reset();
    this.employeeIds.reset();
    this.mySelectedEmpList = [];
    this.isLeftVisible = false;
    this.setPanel();
  }


  resetSearchControl() {

  }
  selectEmployeeType() {
    this.mySelectedEmpList = [];
    if (this.calendarSettingForm.controls.appliedType.value === 'ALL') {
      this.employeeIds.clearValidators();
      this.employeeIds.updateValueAndValidity();
      this.calendarSettingForm.controls.appliedToEmployee.setValue([]);
      this.hideShowEmployeeSelector = false;
    } else if (this.calendarSettingForm.controls.appliedType.value === 'SPECIFIC') {
      this.employeeIds.markAsUntouched({ onlySelf: true });
      this.employeeIds.setValidators([Validators.required]);
      this.hideShowEmployeeSelector = true;
    }
  }

  setSeletedEmployees(data: any) {
    this.empCodeList = [];
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

    if (this.seletedEmployeesCode.length === 0) {
      this.employeeIds.setValidators([Validators.required]);
      this.calendarSettingForm.controls.appliedToEmployee.setValue([]);
    } else {
      this.calendarSettingForm.controls.appliedToEmployee.setValue(this.seletedEmployeesCode);
    }

    // console.log(this.mySelectedEmpList);
    // if (this.seletedEmployeesCode.length === 0) {
    //   this.selectedEmployee.setValidators([Validators.required]);
    //   this.addNewDocument.controls.selectedEmployee.setValue(null);
    // } else {
    //   this.addNewDocument.controls.selectedEmployee.setValue(this.seletedEmployeesCode);
    // }
    // this.employeeIds.value.forEach(element => {
    //   this.empCodeList.push({
    //     empCode: element
    //   });
    //   this.calendarSettingForm.controls.appliedToEmployee.setValue(this.empCodeList);
    // });
  }

  clearSearchControlAndEmployeeList() {
    this.myControl.setValue('');
    this.employeeList = this.employeeListCopy;
  }

  searchEmployees(data: any) {
    console.log('my method called' + data);
    this.employeeList = this.employeeListCopy.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }



  getAllMileStonesRecord() {
    this.mileStonesTableData = [];
    this.serviceApi.get('/v1/calendar/milestone/').subscribe(
      res => {
        if (res != null) {
          console.log('responsee' + JSON.stringify(res));
          res.forEach(element => {
            this.mileStonesTableData.push({
              eventId: element.eventId,
              eventType: element.eventType,
              eventName: element.eventName,
              occurrenceDate: element.occurrenceDate,
              occurrenceRepeat: element.occurrenceRepeat,
              appliedType: element.appliedType,
              appliedToEmployee: element.appliedToEmployee,
              default: element.default,
              colorCode: element.colorCode
            });
          });
        } else {
          console.log('There is no Data Available');
        }
      }, err => {
        console.log('Enter in the Error Block');
        if (err.status === 404 || err.statusText === 'OK') {
          this.mileStonesTableData = [];
        }
      },
      () => {
        this.dt.reset();
      });
  }


  getAllEmployeeList() {
    this.employeeList = [];
    this.employeeListCopy = [];
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {

            this.employeeList.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + ' ' + element.empCode
            });

            this.employeeListCopy.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + ' ' + element.empCode
            });

          });
        } else {
          console.log('No Employee Exist Currently');
        }
      });
  }

  saveMileStoneForm(data: any) {
    console.log('Enter in the Save Function');
    if (this.calendarSettingForm.controls.appliedType.value === 'ALL') {
      console.log('Enter in the Save form for All Employees');
      if (this.calendarSettingForm.valid) {
        const body = this.calendarSettingForm.value;
        this.serviceApi.post('/v1/calendar/milestone/', body).subscribe(
          res => {
            if (res != null) {
              console.log('Data Successfully saved');
              this.successNotification(res.message);
            }
          }, err => {
            // this.warningNotification(err.message);
          }, () => {
            this.getAllMileStonesRecord();
            this.isLeftVisible = false;
            this.setPanel();
          });
      } else {
        Object.keys(this.calendarSettingForm.controls).forEach(field => { // {1}
          const control = this.calendarSettingForm.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }

    } else if (this.calendarSettingForm.controls.appliedType.value === 'SPECIFIC') {
      console.log('Enter in the Save form for Specific Employees');
      if (this.calendarSettingForm.valid && this.employeeIds.valid) {
        const body = this.calendarSettingForm.value;
        this.serviceApi.post('/v1/calendar/milestone/', body).subscribe(
          res => {
            if (res != null) {
              console.log('Data Successfully saved');
              this.successNotification(res.message);
            }
          }, err => {
            // this.warningNotification(err.message);
          }, () => {
            this.getAllMileStonesRecord();
            this.isLeftVisible = false;
            this.setPanel();
          });
      } else {
        Object.keys(this.calendarSettingForm.controls).forEach(field => { // {1}
          const control = this.calendarSettingForm.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
      if (!this.employeeIds.valid) {
        this.employeeIds.markAsTouched({ onlySelf: true });
      }

    } else {
      console.log('No Form Data Available');
      Object.keys(this.calendarSettingForm.controls).forEach(field => { // {1}
        const control = this.calendarSettingForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });

      if (!this.employeeIds.valid) {
        this.employeeIds.markAsTouched({ onlySelf: true });
      }
    }
    // if (this.calendarSettingForm.valid && this.employeeIds.valid) {
    //   const body = this.calendarSettingForm.value;
    //   this.serviceApi.post('/v1/calendar/milestone/', body).subscribe(
    //     res => {
    //       if (res != null) {
    //         console.log('Data Successfully saved');
    //         this.successNotification(res.message);
    //       }
    //     }, err => {
    //       this.warningNotification(err.message);
    //     }, () => {
    //       this.getAllMileStonesRecord();
    //       this.isLeftVisible = false;
    //       this.setPanel();
    //     });
    // } else {
    //   Object.keys(this.calendarSettingForm.controls).forEach(field => { // {1}
    //     const control = this.calendarSettingForm.get(field);            // {2}
    //     control.markAsTouched({ onlySelf: true });       // {3}
    //   });
    // }

    // if (!this.employeeIds.valid) {
    //   this.employeeIds.markAsTouched({ onlySelf: true });
    // }
    // console.log(JSON.stringify(body));
  }

  updateMileStoneForm(data: any) {
    console.log('Enter in the update function to Update Existing Form');
    const body = this.calendarSettingForm.value;
    const val = this.calendarSettingForm.controls.eventId.value;

    if (this.calendarSettingForm.controls.appliedType.value === 'ALL') {
      console.log('Enter in the Update form for ALL Employees');
      if (this.calendarSettingForm.valid) {
        this.serviceApi.put('/v1/calendar/milestone/' + +val, body).subscribe(
          res => {
            if (res != null) {
              console.log('Data Successfully saved');
              this.successNotification(res.message);
            }
          }, err => {
            // this.warningNotification(err.message);
          }, () => {
            this.getAllMileStonesRecord();
            this.isLeftVisible = false;
            this.setPanel();
          });
      } else {
        Object.keys(this.calendarSettingForm.controls).forEach(field => { // {1}
          const control = this.calendarSettingForm.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    } else if (this.calendarSettingForm.controls.appliedType.value === 'SPECIFIC' && this.employeeIds.valid) {
      console.log('Enter in the Update form for Specific Employees');
      if (this.calendarSettingForm.valid && this.employeeIds.valid) {
        this.serviceApi.put('/v1/calendar/milestone/' + +val, body).subscribe(
          res => {
            if (res != null) {
              console.log('Data Successfully saved');
              this.successNotification(res.message);
            }
          }, err => {
            // this.warningNotification(err.message);
          }, () => {
            this.getAllMileStonesRecord();
            this.isLeftVisible = false;
            this.setPanel();
          });
      } else {
        Object.keys(this.calendarSettingForm.controls).forEach(field => { // {1}
          const control = this.calendarSettingForm.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
      if (!this.employeeIds.valid) {
        this.employeeIds.markAsTouched({ onlySelf: true });
      }
    } else {

    }
    // this.serviceApi.put('/v1/calendar/milestone/' + +val, body).subscribe(
    //   res => {
    //     if (res != null) {
    //       console.log('Data Successfully Updated');
    //       this.successNotification(res.message)
    //       this.getAllMileStonesRecord();
    //     } else {
    //       err => {
    //         this.warningNotification(err.message)
    //       }
    //     }
    //   });
  }

  // deleteMileStoneReocrd(data: any) {
  //     this.serviceApi.delete('/v1/calendar/milestone/' + +data.eventId).subscribe(
  //       res => {
  //         if (res != null) {
  //           console.log('Record Successfully Deleted');
  //           this.successNotification(res.message)
  //           this.getAllMileStonesRecord();
  //         } else {
  //           err => {
  //             this.warningNotification(err.message)
  //           }
  //         }
  //       });
  // }

  openDeleteDialog(data: any) {
      const dialogRef = this.dialog.open(DeleteMilestoneDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          eventId: data.eventId,
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
        }
        this.getAllMileStonesRecord();
      });

  }

}



@Component({
  templateUrl: 'milestons-delete-dialog.html',
  styleUrls: ['dialog.scss'],
})
export class DeleteMilestoneDialogComponent {

  eventRecordId: any;
  message: any;
  status: any;
  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteMilestoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder,
    private serviceApi: ApiCommonService) {

    this.eventRecordId = this.data.eventId;
    this.message = this.data.message;
    this.status = this.data.status;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    return this.serviceApi.delete('/v1/calendar/milestone/' + +this.eventRecordId)
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




export interface Element {
  eventId: number;
  eventType: string;
  eventName: string;
  occurrenceDate: string;
  occurrenceRepeat: boolean;
  appliedType: string;
  appliedToEmployee: any;
  default: boolean;
  colorCode: string;
}


