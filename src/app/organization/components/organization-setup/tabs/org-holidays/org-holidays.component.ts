import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import { Http, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { delay } from 'rxjs/operators';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { environment } from '../../../../../../environments/environment';
// import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-org-holidays',
  templateUrl: './org-holidays.component.html',
  styleUrls: ['./org-holidays.component.scss']
})
export class OrgHolidaysComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  baseUrl = environment.baseUrl;
  holidayName: string;
  holidayDate: string;
  typeOfHoliday: string;
  appliesTo: string;
  holidayNameForDelete: any;
  dateForDelete: any;
  holiDayList = [];
  holidayId = [];
  calerdarYearString: any;
  selectedCalendarYear: any;
  calendaerYears = [];
  public data: any;
  year = new Date().getFullYear();
  notificationMsg: any;
  action: any;
  allSelections = [];
  // displayedColumns = ['holidayName', 'date', 'typeOfHoliday', 'reoccureEveryYear',
  //   'appliesTo', 'action'];
  columns = [
    { field: 'holidayName', header: 'Holiday Name' },
    { field: 'holidayDate', header: 'Date' },
    { field: 'typeOfHoliday', header: 'Type Of Holiday' },
    { field: 'reoccurEveryYear', header: 'Reoccur Every Year' },
    { field: 'appliesTo', header: 'Apply To' },
    { field: 'action', header: 'Actions' },
  ]
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentYear: any;



  constructor(public dialog: MatDialog, private http: Http,
    private serviceApi: ApiCommonService, private validationMessagesService: ValidationMessagesService
  ) {
    this.getAllHoliday();
    this.calerdarYearString = 'Calendar Year ' + this.year;
    this.selectedCalendarYear = this.calerdarYearString;
    const rolesArr = KeycloakService.getUserRole();
  }


  getAllHoliday() {
    this.calendaerYears = [];
    var dateObj = new Date();
    var year = dateObj.getUTCFullYear();
    console.log(year);
    this.serviceApi.get('/v1/organization/holiday/').
      subscribe(
        res => {
          res.forEach(element => {
            this.calendaerYears.push(element);
          });
        }, err => {
          this.calendaerYears = [];
        });
    // this.dataSource = new MatTableDataSource(this.holiDayList);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.holiDayList = [];
    this.serviceApi.get('/v1/organization/holiday/' + +this.year).
      subscribe(
        res => {
          console.log('<------------------ Role Informations ---------------------->');
          res.forEach(element => {
            console.log('element.holidayDate :::' + element.holidayDate);
            this.holiDayList.push({
              holidayId: element.holidayId,
              holidayName: element.holidayName,
              holidayDate: element.holidayDate,
              reoccurEveryYear: element.reoccurEveryYear,
              typeOfHoliday: element.typeOfHoliday,
              appliesTo: element.appliesTo,
              appliedEmployees: element.appliedEmployees,
              departmentId: element.departmentIds,
              locationId: element.locationIds,
              designationId: element.designationIds,
              bandId: element.bandIds
            });
            console.log('reoccurEveryYear  :::' + element.reoccurEveryYear);
          });
        }, error => {
          if (error.status === 404 || error.statusText === 'OK') {
            this.holiDayList = [];
          }
        }, () => {
          this.dt.reset();
        });
  }
  getAllHolidayOfSelectedYear(calenderyear) {
    console.log(calenderyear);
    var calenderYearInString
    var splitted;
    var year;
    if (calenderyear != undefined) {
      calenderYearInString = calenderyear.value;
      splitted = calenderYearInString.split(' ');
      year = splitted[2];
      this.currentYear = calenderyear;
    }
    else {
      var dateObj = new Date();
      year = dateObj.getUTCFullYear();
    }

    this.serviceApi.get('/v1/organization/holiday/' + +year).
      subscribe(
        res => {
          console.log('get Record from calendar==' + year);
          res.forEach(element => {
            this.holiDayList.push({
              // holidayId: element.holidayId,
              // holidayName: element.holidayName,
              // holidayDate: element.holidayDate,
              // reoccurEveryYear: element.reoccurEveryYear,
              // typeOfHoliday: element.typeOfHoliday,
              // appliesTo: element.appliedOnEmployee

              holidayId: element.holidayId,
              holidayName: element.holidayName,
              holidayDate: element.holidayDate,
              reoccurEveryYear: element.reoccurEveryYear,
              typeOfHoliday: element.typeOfHoliday,
              appliesTo: element.appliesTo,
              appliedEmployees: element.appliedEmployees,
              departmentId: element.departmentIds,
              locationId: element.locationIds,
              designationId: element.designationIds,
              bandId: element.bandIds
            });
            console.log('reoccurEveryYear ::: ' + element.reoccurEveryYear);
          });
          this.dataSource = new MatTableDataSource(this.holiDayList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, err => {
          console.log('there is something error');
          this.holiDayList = [];
          this.dataSource = new MatTableDataSource(this.holiDayList);
        });
    this.holiDayList = [];
  }
  ngOnInit() {
    this.getCriteria();
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
  ngAfterViewInit() {

  }

  getCriteria() {
    this.allSelections = [];
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

  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  openAddHolidayDialog(): void {
    const dialogRef = this.dialog.open(HolidayDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        holidayName: this.holidayName,
        holidayId: this.holidayId,
        holidayDate: this.holidayDate,
        typeOfHoliday: this.typeOfHoliday,
        appliesTo: this.appliesTo,
        selectedCalendarYear: this.selectedCalendarYear,
        filterSelection: this.allSelections,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.holidayDate = result;
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.getAllHolidayOfSelectedYear(this.currentYear);
          } else if (result.status === 'Error') {
            this.notificationMsg = result.message;
            // this.warningNotification(this.notificationMsg);
          }
        }
      }

    });
  }

  modifyHolidayDialog(data: any) {
    console.log('Data to be Edit ::: ' + data);
      const dialogRef = this.dialog.open(HolidayEditDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          appliedEmployees: data.appliedEmployees,
          holidayName: data.holidayName,
          holidayId: data.holidayId,
          holidayDate: data.holidayDate,
          typeOfHoliday: data.typeOfHoliday,
          reoccurEveryYear: data.reoccurEveryYear,
          appliesTo: data.appliesTo,
          locationId: data.locationId,
          departmentId: data.departmentId,
          designationId: data.designationId,
          bandId: data.bandId,
          filterSelection: this.allSelections,
          selectedCalendarYear: this.selectedCalendarYear
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
              this.getAllHolidayOfSelectedYear(this.currentYear);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        console.log('The dialog was closed');
        this.holidayDate = result;
      });
  }

  /***this code is use to open popup when click on delete icon from table in calendar page**** */
  deleteHoliday(data: any) {
      console.log(JSON.stringify(data));
      this.holidayNameForDelete = data.holidayName;
      this.dateForDelete = data.date;
      console.log('delete the following location-->' + JSON.stringify(data));
      const dialogRef = this.dialog.open(DeleteHoliDayDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          holidayId: data.holidayId,
          holidayName: data.holidayName,
          date: data.date,
          typeOfHoliday: data.typeOfHoliday,
          reoccurEveryYear: data.reoccurEveryYear,
          appliesTo: data.appliesTo
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
              this.getAllHolidayOfSelectedYear(this.currentYear);
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        console.log('The dialog was closed');
      });
  }
}


@Component({
  selector: 'app-holiday-edit-dialog',
  templateUrl: 'holiday-edit-dialog-component.html',
  styleUrls: ['./holiday-edit-dialog-component.scss']
})
export class HolidayEditDialogComponent implements OnInit {
  checkEmpSelectionVal: boolean;
  baseUrl = environment.baseUrl;
  myControl = new FormControl();

  optionsDataCopy = [];
  optionsData = [];

  appliedOnEmployee = new FormControl();

  mySelectedEmpList = [];
  seletedEmployeesCode = [];

  empCode = [];
  emptyArr = [];
  selectedEmp = [];
  error = 'Error Message';
  action: any;
  hideShowDivForSpecificEemployee: any;
  holidaydialog: FormGroup;

  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDateButton;
  filterSelection = [];
  allSelections = [];
  showErrorMessage: boolean = true;

  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    private http: Http,
    public dialogRef: MatDialogRef<HolidayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private validationMessagesService: ValidationMessagesService) {


    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateButton = message);
    // this.serviceApi.get('/v1/employee/').subscribe(
    //   res => {
    //     res.forEach(element => {
    //       this.options.push({
    //         value: element.empFirstName + ' ' + element.empFirstName + ' '
    //           + element.empCode, viewValue: element.empFirstName + ' ' + element.empFirstName + '-'
    //             + element.empCode
    //       });
    //     });
    //   });
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
    data.appliedEmployees != null ? data.appliedEmployees.forEach(element => {
      this.allSelections.push({
        value: element.empCode,
        viewValue: element.name,
        type: 'Employees'
      });
    }) : '';
    console.log('holidayId-->' + data.holidayId);
    console.log('selectedCalendarYear-->' + data.selectedCalendarYear);
    const splitted = data.selectedCalendarYear.split(' ');
    const year = splitted[2];
    this.holidaydialog = this._fb.group({
      holidayName: [data.holidayName, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      holidayDate: [data.holidayDate, [Validators.required]],
      typeOfHoliday: [data.typeOfHoliday, [Validators.required]],
      reoccurEveryYear: [data.reoccurEveryYear, [Validators.required]],
      appliesTo: [data.appliesTo, [Validators.required]],
      // appliedOnEmployee: [data.appliedOnEmployees],
      calendarYear: [year],
      holidayId: [data.holidayId],
      allSelections: [this.allSelections]
    });

    console.log(data.appliedOnEmployee);

    // if (data.appliedOnEmployee.length > 0) {
    //   data.appliedOnEmployee.forEach(element => {
    //     this.mySelectedEmpList.push(element.empCode);
    //     this.seletedEmployeesCode.push({
    //       empCode: element.empCode
    //     });
    //   });
    // }
    // this.holidaydialog.controls.appliedOnEmployee.setValue(this.seletedEmployeesCode);
    // this.holidaydialog.controls.appliedOnEmployee.setValue(this.appliedOnEmployee);
    // this.holidaydialog.controls.reoccurEveryYear.setValue(this.data.reoccurEveryYear);
  }


  ngOnInit() {
    this.getEmployee();

    // if (this.holidaydialog.controls.appliesTo.value === 'SPECIFIC') {

    //   this.appliedOnEmployee.setValidators([Validators.required]);

    // }
    // this.holidaydialog.controls.appliedOnEmployee.setValue(this.data.appliedOnEmployee.map(res => res.empCode));
    console.log(this.optionsData);
    console.log(this.holidaydialog.controls.reoccurEveryYear.value + '<-----');


    // this.mySelectedEmpList.push(element.empCode);
    // this.seletedEmployeesCode.push(element.empCode);

    if (this.holidaydialog.controls.reoccurEveryYear.value === true) {
      this.holidaydialog.controls.reoccurEveryYear.setValue('true');
    } else if (this.holidaydialog.controls.reoccurEveryYear.value === false) {
      this.holidaydialog.controls.reoccurEveryYear.setValue('false');
    }
  }

  getEmployee() {
    this.optionsData = [];
    this.optionsDataCopy = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
           
            this.filterSelection = [...this.filterSelection, {
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName,
              type: 'Employees'
            }];
          
          });
        }, err => {

        }, () => {
          console.log('Enter into Else Bloack');
        });
  }

  // searchEmployeeName(data: any) {
  //   console.log('my method called' + data);
  //   this.optionsData = this.optionsDataCopy.filter(option =>
  //     option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  // }



  // onClickResetSearch_Array() {
  //   this.myControl.setValue('');
  //   this.optionsData = this.optionsDataCopy;
  // }



  onNoClick(): void {
    this.dialogRef.close();
  }

  // selectEmp(data: any, event: any) {

  //   if (!this.seletedEmployeesCode.some(e => e.empCode === data)) {
  //     this.seletedEmployeesCode.push({
  //       empCode: data
  //     });
  //   } else {
  //     this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
  //       return el.empCode !== data;
  //     });

  //   }
  //   for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
  //     this.mySelectedEmpList[i] = this.seletedEmployeesCode[i].empCode;
  //   }
  //   console.log(this.mySelectedEmpList);
  //   if (this.seletedEmployeesCode.length === 0) {
  //     // this.selectedEmployee.setValidators([Validators.required]);
  //     this.holidaydialog.controls.appliedOnEmployee.setValue(null);

  //   } else {
  //     this.holidaydialog.controls.appliedOnEmployee.setValue(this.seletedEmployeesCode);
  //   }
  // }
  /*****below method call click on specific radio button***** */
  // fospecificeEmployee() {
  //   this.empCode = [];
  //   this.hideShowDivForSpecificEemployee = true;
  // }

  /*****above code clossed here***** */
  clickradioforallemployee() {

    if (this.holidaydialog.controls.appliesTo.value === 'ALL') {
      this.holidaydialog.controls.appliedOnEmployee.setValue([]);
    } else {

    }
    this.empCode = [];
    this.hideShowDivForSpecificEemployee = false;
  }


  chagneEmployeeType() {
    const employeeType = this.holidaydialog.controls.appliesTo.value;
    console.log('Change the Employee Type ::: ' + employeeType);
    if (employeeType === 'SPECIFIC') {
      // this.appliedOnEmployee.setValue(null);
      // this.appliedOnEmployee.setValidators([Validators.required]);
      // this.holidaydialog.controls.appliedOnEmployee.setValue(null);
      // this.holidaydialog.controls.appliedOnEmployee.setValidators([Validators.required]);
      this.holidaydialog.controls.allSelections.setValidators([Validators.required]);
    } else {
      // this.seletedEmployeesCode = [];
      // this.mySelectedEmpList = [];
      // this.appliedOnEmployee.clearValidators();
      // this.holidaydialog.controls.appliedOnEmployee.clearValidators();
      this.holidaydialog.controls.allSelections.clearValidators();
      // this.holidaydialog.controls.appliedOnEmployee.setValue(null);
      this.holidaydialog.controls.allSelections.setValue([]);
      // this.holidaydialog.controls.appliedOnEmployee.updateValueAndValidity();
  
      this.appliedOnEmployee.updateValueAndValidity();
    }
    this.holidaydialog.controls.allSelections.updateValueAndValidity();
  }

  editHoliday() {
    this.checkEmpSelectionVal = true;
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    let appliedEmployees = [];
    if (this.holidaydialog.valid) {
      this.isValidFormSubmitted = true;
      // if (this.holidaydialog.controls.appliedOnEmployee.value == null) {
      //   this.holidaydialog.controls.appliedOnEmployee.setValue(this.emptyArr);
      // }
      if (this.holidaydialog.controls.reoccurEveryYear.value === 'true') {
        this.holidaydialog.controls.reoccurEveryYear.setValue(true);
      } else if (this.holidaydialog.controls.reoccurEveryYear.value === 'false') {
        this.holidaydialog.controls.reoccurEveryYear.setValue(false);
      }
      let selections = this.holidaydialog.controls.allSelections.value;
      if (this.holidaydialog.controls.appliesTo.value === 'SPECIFIC' && selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else if (element.type === 'Employees') {
            appliedEmployees.push(element.value)
          } else {
            locationIds.push(element.value);
          }
        });
      }
      // if (this.holidaydialog.controls.appliesTo.value === 'ALL') {
      //   this.emptyArr = [];
      //   this.holidaydialog.controls.appliedOnEmployee.setValue(this.emptyArr);
      // }
      // this.selectEmp();

      const saveHoliday = {
        "holidayName": this.holidaydialog.controls.holidayName.value,
        "holidayDate": this.holidaydialog.controls.holidayDate.value,
        "typeOfHoliday": this.holidaydialog.controls.typeOfHoliday.value,
        "reoccurEveryYear": this.holidaydialog.controls.reoccurEveryYear.value,
        "appliesTo": this.holidaydialog.controls.appliesTo.value,
        "appliedEmployee": appliedEmployees,
        "calendarYear": this.holidaydialog.controls.calendarYear.value,
        "departmentId": deptIds,
        "bandId": bandIds,
        "designationId": designationIds,
        "locationId": locationIds,
      };
      console.log('BODY IS::::::: ');
      console.log(JSON.stringify(saveHoliday));
      return this.serviceApi.put('/v1/organization/holiday/' + +this.data.holidayId, saveHoliday)

        .subscribe(
          res => {
            console.log('profile data saved successfully');
            this.action = 'Response';
            this.error = res.message;
            this.close();
          }, err => {
            console.log('there is something error');
            this.action = 'Error';
            this.error = err.message;
            this.close();
          }, () => {

          });
    } else {
      if (this.holidaydialog.controls.appliesTo.value === 'SPECIFIC') {
        if(this.holidaydialog.controls.allSelections.value == null || this.holidaydialog.controls.allSelections.value.length == 0){
          this.showErrorMessage = false;
        }
      }
      Object.keys(this.holidaydialog.controls).forEach(field => { // {1}
        const control = this.holidaydialog.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}

@Component({
  selector: 'app-holiday-dialog',
  templateUrl: 'holiday-dialog-component.html',
  styleUrls: ['./holiday-dialog-component.scss']
})
export class HolidayDialogComponent implements OnInit {
  checkEmpSelectionVal: boolean;
  baseUrl = environment.baseUrl;
  myControl = new FormControl();
  empCode = [];
  appliedOnEmployee = new FormControl();


  optionsDataCopy = [];
  optionsData = [];

  mySelectedEmpList = [];
  seletedEmployeesCode = [];
  filterSelection = [];

  // optionsData = this.options;
  isValidFormSubmitted = true;
  requiredTextField;
  requiredRadioButton;
  requiredDateButton;
  hideShowDivForSpecificEemployee: any;
  holidaydialog: FormGroup;
  error = 'Error Message';
  action: any;
  showErrorMessage: boolean = true;
  ngOnInit() { }

  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    private http: Http,
    public dialogRef: MatDialogRef<HolidayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredRadioButton.subscribe(message => this.requiredRadioButton = message);
    this.validationMessagesService.currentRequiredDateButton.subscribe(message => this.requiredDateButton = message);
   

    console.log('selectedCalendarYear-->' + data.selectedCalendarYear);
    const splitted = data.selectedCalendarYear.split(' ');
    const year = splitted[2];
    this.filterSelection = data.filterSelection;
    this.holidaydialog = this._fb.group({
      holidayName: [data.holidayName, [
        Validators.required,
        this.validationMessagesService.alphaNumericValidation
      ]],
      holidayDate: [data.holidayDate, [Validators.required]],
      typeOfHoliday: [data.typeOfHoliday, [Validators.required]],
      reoccurEveryYear: [data.reoccurEveryYear, [Validators.required]],
      appliesTo: [data.appliesTo, [Validators.required]],
      // appliedOnEmployee: [],
      calendarYear: [year, [Validators.required]],
      holidayID: [],
      allSelections: []
    });
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {    
          this.filterSelection = [...this.filterSelection, {
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName,
            type: 'Employees'
          }];
        });
      });
    console.log('myControl');
  }


  /*****below method call when select multple employee from holiday modal***** */
  // searchEmployeeName(data: any) {
  //   console.log('my method called' + data);
  //   this.optionsData = this.optionsDataCopy.filter(option =>
  //     option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  // }
  /*****above code clossed here***** */

  onNoClick(): void {
    this.dialogRef.close();
  }
  // selectEmp(data: any, event: any) {
  //   this.empCode = [];
  //   if (!this.seletedEmployeesCode.some(e => e.empCode === data)) {
  //     this.seletedEmployeesCode.push({
  //       empCode: data
  //     });
  //   } else {
  //     this.seletedEmployeesCode = this.seletedEmployeesCode.filter(function (el) {
  //       return el.empCode !== data;
  //     });

  //   }
  //   for (let i = 0; i < this.seletedEmployeesCode.length; i++) {
  //     this.mySelectedEmpList[i] = this.seletedEmployeesCode[i].empCode;
  //   }
  //   console.log(this.mySelectedEmpList);
  //   // if (this.seletedEmployeesCode.length === 0) {
  //   //   // this.selectedEmployee.setValidators([Validators.required]);
  //   //   this.holidaydialog.controls.appliedOnEmployee.setValue(null);
  //   // } else {
  //   //   this.holidaydialog.controls.appliedOnEmployee.setValue(this.seletedEmployeesCode);
  //   // }

  // }
  /*****below method call click on specific radio button***** */
  fospecificeEmployee() {

    this.hideShowDivForSpecificEemployee = true;

  }
  /*****above code clossed here***** */

  clickradioforallemployee() {

    this.hideShowDivForSpecificEemployee = false;
  }



  chagneEmployeeType() {
    const employeeType = this.holidaydialog.controls.appliesTo.value;
    console.log('Change the Employee Type ::: ' + employeeType);
    if (employeeType === 'SPECIFIC') {
      this.holidaydialog.controls.allSelections.reset();
      // this.appliedOnEmployee.setValue(null);
      // this.appliedOnEmployee.setValidators([Validators.required]);
      // this.holidaydialog.controls.appliedOnEmployee.setValue(null);
      // this.holidaydialog.controls.allSelections.setValue([]);
      // this.holidaydialog.controls.appliedOnEmployee.setValidators([Validators.required]);
      this.holidaydialog.controls.allSelections.setValidators([Validators.required]);
    } else {
      // this.seletedEmployeesCode = [];
      // this.mySelectedEmpList = [];
      // this.appliedOnEmployee.clearValidators();
      // this.holidaydialog.controls.appliedOnEmployee.clearValidators();
      this.holidaydialog.controls.allSelections.clearValidators();
      // this.holidaydialog.controls.appliedOnEmployee.setValue(null);
      this.holidaydialog.controls.allSelections.setValue([]);
      
      // this.holidaydialog.controls.appliedOnEmployee.updateValueAndValidity();

      // this.appliedOnEmployee.updateValueAndValidity();
    }
    this.holidaydialog.controls.allSelections.updateValueAndValidity();
  }


  // onClickResetSearch_Array() {
  //   this.myControl.setValue('');
  //   this.optionsData = this.optionsDataCopy;
  // }

  saveHoliday() {
    this.checkEmpSelectionVal = true;
    let deptIds = [];
    let bandIds = [];
    let designationIds = [];
    let locationIds = [];
    let appliedEmployees = [];
    if (this.holidaydialog.valid) {
      this.isValidFormSubmitted = true;
      const date = this.holidaydialog.controls.holidayDate.value;
      let selections = this.holidaydialog.controls.allSelections.value;

      if (this.holidaydialog.controls.appliesTo.value === 'SPECIFIC' && selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'Designations') {
            designationIds.push(element.value)
          } else if (element.type === 'Employees') {
            appliedEmployees.push(element.value)
          } else {
            locationIds.push(element.value);
          }
        });
      }
      console.log('before converted date -->' + date);
      console.log('After converted date -->' + new Date(date).toLocaleDateString());
      const saveHoliday = {
        "holidayName": this.holidaydialog.controls.holidayName.value,
        "holidayDate": date,
        "typeOfHoliday": this.holidaydialog.controls.typeOfHoliday.value,
        "reoccurEveryYear": this.holidaydialog.controls.reoccurEveryYear.value,
        "appliesTo": this.holidaydialog.controls.appliesTo.value,
        "appliedEmployee": appliedEmployees,
        "calendarYear": this.holidaydialog.controls.calendarYear.value,
        "departmentId": deptIds,
        "bandId": bandIds,
        "designationId": designationIds,
        "locationId": locationIds,
      };
      console.log('Boyd is------' + JSON.stringify(saveHoliday));
      return this.serviceApi.post('/v1/organization/holiday/', saveHoliday)

        .subscribe(
          res => {
            console.log('profile data saved successfully');
            this.action = 'Response';
            this.error = res.message;
            this.close();
          }, err => {
            this.action = 'Error';
            this.error = err.error.message;
            this.close();
          });
    }
    // else if (this.holidaydialog.controls.appliesTo.value === 'SPECIFIC' && (!this.holidaydialog.controls.allSelections.value || !this.holidaydialog.controls.appliedOnEmployee.value)) {
    //   this.showErrorMessage = false;
    //   this.holidaydialog.controls.appliedOnEmployee.clearValidators();
    //   this.holidaydialog.controls.allSelections.clearValidators();
    //   this.holidaydialog.controls.allSelections.updateValueAndValidity();
    //   this.holidaydialog.controls.appliedOnEmployee.updateValueAndValidity();
    // }
    else {
      Object.keys(this.holidaydialog.controls).forEach(field => { // {1}
        const control = this.holidaydialog.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      if(this.holidaydialog.controls.appliesTo.value === 'SPECIFIC'){
        if(this.holidaydialog.controls.allSelections.value ==null || this.holidaydialog.controls.allSelections.value.length == 0){
          this.showErrorMessage = false;
        }
      }
      
    }
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}

export interface Employees {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-delete-holiday-dialog',
  templateUrl: 'delete-holiday-dialog-component.html',
  styleUrls: ['./delete-holiday-dialog-component.scss']
})
export class DeleteHoliDayDialogComponent {
  baseUrl = environment.baseUrl;
  error = 'Error Message';
  action: any;
  constructor(
    private _fb: FormBuilder, private http1: Http, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<HolidayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data-->' + data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteHoliday() {
    this.serviceApi.delete('/v1/organization/holiday/' + +this.data.holidayId).
      subscribe(
        res => {
          console.log('Deleted Suucessfully');
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }, () => {
        });
    console.log('locationRecordId -->' + this.data.holidayName);
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}

export interface UserData {
  holidayId: string;
  holidayName: string;
  holidayDate: string;
  reoccurEveryYear: string;
  typeOfHoliday: string;
  appliesTo: string;
  selectedEmployee;
}


