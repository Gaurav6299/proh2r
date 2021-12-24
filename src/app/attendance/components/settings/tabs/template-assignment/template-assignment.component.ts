import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { DatePipe } from '@angular/common';
import { DataTable, SelectItem } from 'primeng/primeng';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-template-assignment',
  templateUrl: './template-assignment.component.html',
  styleUrls: ['./template-assignment.component.scss']
})
export class TemplateAssignmentComponent implements OnInit, AfterViewInit {
  showHideFilter = false;
  columns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'currentAttendenceTemp', header: 'Current Attendence Template' },
    { field: 'attendenceSupervisors', header: 'Supervisors' },
    { field: 'effectiveFrom', header: 'Effective From' },
    { field: 'action', header: 'Action' }
  ]
  selectedRows = [];
  @ViewChild("dt1") dt: DataTable;
  selection = new SelectionModel<Element>(true, []);
  assignedAttendenceData = [];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  checkedRowData = [];
  allBand = [];
  empSelected: any = false;
  notificationMsg: any;
  action: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public employeeAttendenceAssignment: FormGroup;
  public assignAttendenceTemplateDialog = false;
  attendenceTemplate: any;
  tempTypeSelected: any;
  pipe: DatePipe;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService) {
    this.attendenceAssignTemplate();
    var rolesArr = KeycloakService.getUserRole();
    console.log('Has Role ------' + JSON.stringify(KeycloakService.getUserRole()));
  }
  todayDate: number = Date.now();

  successNotification(successMessage: any) {
    $.notifyClose();
    $.notify({
      icon: 'check_circle',
      message: successMessage,
    }, {
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
    }, {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

  ngOnInit() {
    this.employeeAttendenceAssignment = this.fb.group({
      assignAttendenceTemplate: [],
      searchValue: []
    });

    this.pipe = new DatePipe('en');
    this.selectedRows = [];
  }
  ngAfterViewInit() {

  }

  clearSearch() {
    // this.searchfilter = null;
  }


  // masterToggle(element: any, event: any) {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource1.data.forEach(row => this.selection.select(row));
  //   console.log('dataSource1');
  //   this.getRowMultipleData(this.dataSource1.data, event.checked);
  // }

  // getRowMultipleData(element: any, event: any) {
  //   if (event) {
  //     element.forEach(element1 => {
  //       const empCode = element1.empName.split('-');
  //       console.log(empCode[1]);
  //       this.checkedRowData.push(
  //         empCode[1]
  //       );
  //     });
  //   } else {
  //     console.log('Not Any Data Seleted');
  //     this.checkedRowData = [];
  //   }

  // }



  // getRowMultipleData(element: any) {
  //   this.checkedRowData = [];
  //   element.forEach(element1 => {
  //     const empCode = element1.empName.split('-');
  //     console.log(empCode[1]);
  //     this.checkedRowData.push(
  //       empCode[1]
  //     );
  //   });
  // }

  getRowData(element: any, event: any) {
    console.log(element);
    console.log('element........Employee Code :::' + element.empName);
    const empCode = element.empName.split('-');

    if (event.checked) {
      this.checkedRowData.push(
        empCode[1]
      );
      this.empSelected = true;
      this.tempTypeSelected = element.attendenceSupervisors;
      console.log('type ' + this.tempTypeSelected);
      console.log(JSON.stringify(this.checkedRowData));
    } else {
      if (this.checkedRowData.length < 1) {
        this.empSelected = false;
      }
      this.tempTypeSelected = null;
      console.log('type ' + this.tempTypeSelected);
      console.log('ENter in the Else Block');
      for (let i = 0; i < this.checkedRowData.length; i++) {
        if (this.checkedRowData[i] === empCode[1]) {
          this.checkedRowData.splice(i, 1);
          console.log('Match Found');
          console.log(this.checkedRowData);
        } else {
          console.log('Not Matched');
        }
      }
    }
  }



  clearFilter() {
    console.log('here');
    this.employeeAttendenceAssignment.controls.searchValue.reset();
  }
  selectedValue(value: any) {
    // this.getRowMultipleData(this.dataSource1.data);
    this.action = '';
    this.notificationMsg = '';
    if (value === 'assignAttendenceTemplate') {
      if (this.selectedRows.length == 0) {
        this.warningNotification('Select an employee first');
        this.selectedRows = [];
        this.attendenceAssignTemplate();
      } else {
        this.selectedRows.forEach(
          row => {
            var empCode = row.empName.split('-');
            this.checkedRowData.push(
              empCode[1]
            );
          });
        const dialogRef = this.dialog.open(AddAttendenceTemplateComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            message: this.notificationMsg,
            status: this.action,
            title: "Bulk Attendance Template Assignment",
            checkedRowData: this.checkedRowData,
            selected: this.empSelected
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            if (result.message) {
              if (result.status === 'Response') {
                this.notificationMsg = result.message;
                this.successNotification(this.notificationMsg);

                this.attendenceAssignTemplate();
              } else if (result.status === 'Error') {
                this.notificationMsg = result.message;
                // this.warningNotification(this.notificationMsg);
              }
            }
            this.selectedRows = [];
          }
          this.selection.clear();
          this.empSelected = false;
          this.checkedRowData = [];
          this.employeeAttendenceAssignment.controls.assignAttendenceTemplate.setValue(null);
        });
      }

    } else if (value === 'supervisorsAssignmnet') {
      console.log('true');
      console.log('Assign Supervisor For Employee/Employees');

      this.openAssignSupervisors();

    } else if (value === 'uploadAttendenceTemplate') {
      console.log('value....' + value);
      this.openUploadAttendneceTemplate();
    } else if (value === 'uploadAttendenceSupervisors') {
      console.log('value......' + value);
      this.openUploadAttendneceSupervisors();
    }
  }

  addAttendenceTemplate(element: any) {
      this.action = '';
      this.notificationMsg = '';
      console.log('Inside add template dialog');
      const empCode = element.empName.split('-');
      console.log('>>>> 1' + empCode[1]);
      const dialogRef = this.dialog.open(AddAttendenceTemplateComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          title: "Attendance Template Assignment",
          message: this.notificationMsg,
          status: this.action,
          checkedRowData: [empCode[1]],
          selected: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.attendenceAssignTemplate();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        this.empSelected = false;
        this.selection.clear();
        this.checkedRowData = [];
      });
  }

  editAttendnceTemplate(data: any) {
    console.log(data);
      this.action = '';
      this.notificationMsg = '';
      const empCode = data.empName.split('-');
      console.log('Inside Edit dialog... >>>>> ' + empCode[1]);
      const supervisor = data.attendenceSupervisors != null ? data.attendenceSupervisors.split('-')[1] : data.attendenceSupervisors;
      const dialogRef = this.dialog.open(EditAttendenceTemplateComponent, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          checkedRowData: [empCode[1]],
          currentAttendenceTemp: data.currentAttendenceTemp,
          attendenceSupervisors: [supervisor],
          effectiveFrom: data.effectiveFrom,
          attdTemplateId: data.actions,
          geoLocationId: data.geoLocationId,
          attendanceTemplateId: data.attendanceTemplateId,
          showLocationFilter: data.showLocationFilter,
          attendanceTemplateType: data.attendanceTemplateType,
          locationRestrictionType: data.locationRestrictionType
        }

      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.attendenceAssignTemplate();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        this.selection.clear();
        this.checkedRowData = [];
      });
  }

  // openAssignAttendenceTemplate() {
  //   console.log('Inside ExpenseDialog Method');
  //   const dialogRef = this.dialog.open(AssignAttendenceTemplate, {
  //     width: '500px',
  //     data: { attendenceTemplate: this.attendenceTemplate }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  openAssignSupervisors() {
    this.action = '';
    this.notificationMsg = '';
    console.log('Inside ExpenseDialog Method');
    if (this.empSelected === false) {
      this.warningNotification('Select an employee first');
      this.checkedRowData = [];
      this.attendenceAssignTemplate();
    } else if (this.empSelected === true && this.tempTypeSelected != null) {
      this.warningNotification('Supervisor is already assigned templatewise. Delete template allocation to assign Supervisor');
      this.checkedRowData = [];
      this.attendenceAssignTemplate();
    }
    else {
      const dialogRef = this.dialog.open(AssignSupervisorsComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          checkedRowData: this.checkedRowData,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.attendenceAssignTemplate();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        this.selection.clear();
        this.empSelected = false;
        this.tempTypeSelected = null;
        this.checkedRowData = [];
        this.employeeAttendenceAssignment.controls.assignAttendenceTemplate.setValue(null);
      });
    }

  }
  openDeleteTemplate(data: any) {
      this.action = '';
      this.notificationMsg = '';
      console.log('Inside Delete Method');
      const dialogRef = this.dialog.open(DeleteTemplateComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          attdTemplateId: data.actions
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.attendenceAssignTemplate();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        this.selection.clear();
        this.checkedRowData = [];
        this.employeeAttendenceAssignment.controls.assignAttendenceTemplate.setValue(null);
      });
  }
  openUploadAttendneceTemplate() {
    console.log('Inside Upload Method');
    const dialogRef = this.dialog.open(UploadAttendenceTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.selection.clear();
      this.checkedRowData = [];
      this.employeeAttendenceAssignment.controls.assignAttendenceTemplate.setValue(null);
    });
  }
  openUploadAttendneceSupervisors() {
    console.log('Inside Upload Method');
    const dialogRef = this.dialog.open(UploadAttendenceSupervisorsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.selection.clear();
      this.checkedRowData = [];
      this.employeeAttendenceAssignment.controls.assignAttendenceTemplate.setValue(null);
    });
  }
  openAttendanceHistory(data: any) {
    console.log('Inside Upload Method');
    const dialogRef = this.dialog.open(OpenAttendanceHistory, {
      width: '500px',
      data: {
        currentAttendenceTemp: data.currentAttendenceTemp, attendenceSupervisors: data.attendenceSupervisors,
        effectiveFrom: data.effectiveFrom
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.selection.clear();
      this.checkedRowData = [];
      this.employeeAttendenceAssignment.controls.assignAttendenceTemplate.setValue(null);
    });
  }
  openDialogToBulkUploadTemplateAssigment() {
    const dialogRef = this.dialog.open(BulkUploadTemplateAssignment, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { event: event }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.notificationMsg = result.message;
            this.successNotification(this.notificationMsg);
            this.attendenceAssignTemplate();
          }
          else if (result.status === 'Error') {
            this.notificationMsg = result.message;
          }
        }
      }
    });
  } 

  attendenceAssignTemplate() {
    this.selectedRows = [];
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    this.empSelected = false;
    console.log('Enter to Get Attendance Template Assignment');
    this.assignedAttendenceData = [];
    this.serviceApi.get2('/v1/attendance/settings/templateAssignments/').subscribe(
      res => {
        if (res != null) {

          res.forEach(element => {
            if (!this.allBand.some(band => band.label === element.band)) {
              this.allBand.push({
                label: element.band, value: element.band
              });
            }
            if (!this.allDepartment.some(department => department.label === element.department)) {
              this.allDepartment.push({
                label: element.department, value: element.department
              });
            }
            if (!this.allDesignation.some(designation => designation.label === element.designation)) {
              this.allDesignation.push({
                label: element.designation, value: element.designation
              });
            }
            if (!this.allLocation.some(location => location.label === element.location)) {
              this.allLocation.push({
                label: element.location, value: element.location
              });
            }
            this.assignedAttendenceData.push({
              empId: element.empId,
              empName: element.employeeName,
              currentAttendenceTemp: element.currentAttendanceTemplate,
              biometricCode: element.bioMetricCode,
              biometricDeviceId: element.bioMetricDeviceId,
              attendenceSupervisors: element.supervisor,
              effectiveFrom: element.effectiveFrom,
              actions: element.attdTemplateId,
              geoLocationId: element.geoLocationId,
              attendanceTemplateId: element.attendanceTemplateId,
              location: element.location,
              band: element.band,
              department: element.department,
              designation: element.designation,
              showLocationFilter: element.showLocationFilter,
              attendanceTemplateType: element.attendanceTemplateType,
              locationRestrictionType: element.locationRestrictionType
            });
          });
          this.selection.clear();
        } else {
          console.log('Data does not Exists');
        }
      }, (err) => {

      }, () => {
        console.log(this.allBand);
        this.dt.reset();
      });
  }

}

@Component({
  templateUrl: './AssignAttendenceTemplate.component.html',
  styleUrls: ['./AssignAttendenceTemplate.component.scss']
})

export class AssignAttendenceTemplate implements OnInit {
  public attendenceTemplateAssignment: FormGroup;
  attendenceTemplateList = [
    { value: 'leaveorderfordeduction', viewValue: 'Leave Order For Deduction' },
    { value: 'attendenceSheet', viewValue: 'AttendenceSheet' },
    { value: 'general', viewValue: 'General' },
    { value: 'test', viewValue: 'Test' }
  ];
  constructor(public dialogRef: MatDialogRef<AssignAttendenceTemplate>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    this.attendenceTemplateAssignment = this._fb.group(
      {
        attendenceTemplate: [data.attendenceTemplate],
      }
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  saveAssignAttendenceTemplate() {
    console.log('Attendence assign value:' + JSON.stringify(this.attendenceTemplateAssignment.value));
  }
}
@Component({
  templateUrl: './AssignSupervisors.component.html',
  styleUrls: ['./AssignSupervisors.component.scss']
})
export class AssignSupervisorsComponent implements OnInit {

  public supervisorsAssignment: FormGroup;
  action: any;
  error: any;
  checkedRowData = [];
  attendenceTemplateSupervisorList = [];
  empSelected: any;
  templatesupervisor: any;
  constructor(public dialogRef: MatDialogRef<AssignAttendenceTemplate>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {

    this.supervisorsAssignment = this._fb.group({
      supervisor: [data.assignSupervisors],
      empCodeList: [data.checkedRowData],
    });
    this.getAllEmployeeList();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  selectSupervisor() {
  }

  getAllEmployeeList() {
    console.log('Enter to get the Employee List for Approver');
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.attendenceTemplateSupervisorList.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName
            });
          });
        } else {
          console.log('Record not exists');
        }
      });
  }
  saveSupervisorsAssignmnet() {
    console.log('Supervisor Assignment:..' + JSON.stringify(this.supervisorsAssignment.value));
    this.serviceApi.post('/v1/attendance/settings/templateAssignments/', this.supervisorsAssignment.value).subscribe(
      res => {
        if (res != null) {
          this.action = 'Response';
          this.error = res.message;
          this.close();
          console.log('Successfully Supervisor Uploaded');
        } else {
          console.log('Supervisor not Assign properly');
        }
      }, err => {

        this.action = 'Error';
        this.error = err.message;
        this.close();
      }
    );
  }
  warningNotification(warningMessage: any) {
    $.notify({
      icon: 'error',
      message: warningMessage,
    }, {
        type: 'warning',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}


@Component({
  templateUrl: './DeleteTemplate.component.html',
  styleUrls: ['./DeleteTemplate.component.scss']
})
export class DeleteTemplateComponent implements OnInit {

  action: any;
  error: any;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }
  ngOnInit() {
  }
  confirmDelete() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.attdTemplateId);
    const val = this.data.attdTemplateId;
    this.serviceApi.delete('/v1/attendance/settings/templateAssignments/' + +val).subscribe(
      res => {
        if (res != null) {
          this.action = 'Response';
          this.error = res.message;

          console.log('Attendace Assignent Record Successfully Deleted');
        } else {
          console.log('Attendace Assignent Record doesnot Exist');
        }
        this.close();
      }, err => {
        console.log('Something gone Wrong to delete the Shift Record from Database');
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
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './UploadAttendenceTemplate.component.html',
  styleUrls: ['./UploadAttendenceTemplate.component.scss']
})
export class UploadAttendenceTemplateComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './UploadAttendenceSupervisors.component.html',
  styleUrls: ['./UploadAttendenceSupervisors.component.scss']
})
export class UploadAttendenceSupervisorsComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<UploadAttendenceSupervisorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  templateUrl: './AddAttendenceTemplate.component.html',
  styleUrls: ['./AddAttendenceTemplate.component.scss']
})
export class AddAttendenceTemplateComponent implements OnInit {
  addTemplateAssignment: FormGroup;
  showHideApproverField: boolean;
  showGeoLocation: boolean = false;
  addTemplateList = [];
  addApproverList = [];
  action: any;
  error: any;
  myControl = new FormControl();
  todayDate: number = Date.now();
  checkedRowData = [];
  bioDeviceId: any;
  empSelected: any;
  check: boolean;
  optionsData: any = [];
  title; any;
  geoLocations = [];
  constructor(public dialogRef: MatDialogRef<UploadAttendenceSupervisorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.title = this.data.title;
    this.getAllAttendanceTemplate();
    this.getAllEmployeeList();
    this.optionsData = this.addApproverList;
    this.checkedRowData = data.checkedRowData;
    this.addTemplateAssignment = this._fb.group({
      employeeCode: [this.checkedRowData],
      bioMetricCode: [data.biometricCode],
      bioMetricDeviceId: [data.biometricDeviceId],
      attendenceTemplate: [data.attendenceTemplate],
      attendenceApprover: [data.attendenceApprover],
      restrictedGeoLocation: [],
      effectiveDate: [data.effectiveDate],
    });
  }
  ngOnInit() {

  }

  getAllAttendanceTemplate() {
    this.addTemplateList = [];
    this.serviceApi.get('/v1/attendance/settings/templates/').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.addTemplateList.push({
              value: element.attdTemplateId,
              viewValue: element.templateName,
              ruleType: element.attendanceApprovalType,
              restrictedGeoLocationType: element.attendanceRegularizationTemplateVO == null ? '' : element.attendanceRegularizationTemplateVO.restrictCheckInCheckOutLocation
            });
          });
        } else {
          console.log('Data Does not Exists');
        }
      });
  }
  resetSearch() {
    this.myControl.setValue('');
    this.optionsData = this.addApproverList;
  }
  searchEmployeeName(data: any) {
    this.optionsData = this.addApproverList.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }
  setValue() {
    this.myControl.setValue(null);
    this.optionsData = this.addApproverList;
  }
  getAllEmployeeList() {
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.addApproverList.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName
            });
          });
        } else {
          console.log('Data Does not Exists');
        }
      });
  }

  checkRule(data: any) {
    if (data.ruleType === 'EMPLOYEEWISE') {
      this.showHideApproverField = true;
      this.addTemplateAssignment.controls.attendenceApprover.setValidators(Validators.required);
    } else if (data.ruleType === 'TEMPLATEWISE') {
      this.showHideApproverField = false;
      this.addTemplateAssignment.controls.attendenceApprover.setValue(null);
      this.addTemplateAssignment.controls.attendenceApprover.clearValidators();
    } else {
      this.showHideApproverField = false;
      this.addTemplateAssignment.controls.attendenceApprover.setValue(null);
      this.addTemplateAssignment.controls.attendenceApprover.clearValidators();
    }
  }

  saveAttdTemplateAssingleUser() {

    this.check = true;
    if (this.addTemplateAssignment.valid && this.addTemplateAssignment.controls.effectiveDate.value && this.addTemplateAssignment.controls.attendenceTemplate.value) {
      console.log(JSON.stringify(this.addTemplateAssignment.value));
      this.check = false;
      const body = {
        'bioMetricCode': this.addTemplateAssignment.controls.bioMetricCode.value,
        'bioMetricDeviceId': null,
        'currentAttendanceTemplate': this.addTemplateAssignment.controls.attendenceTemplate.value,
        'effectiveFrom': this.addTemplateAssignment.controls.effectiveDate.value,
        'empCodeList': this.addTemplateAssignment.controls.employeeCode.value,
        'employeeName': '',
        'supervisor': this.addTemplateAssignment.controls.attendenceApprover.value,
        "geoLocationId": this.addTemplateAssignment.controls.restrictedGeoLocation.value
      };

      console.log('>>>>> Save Form >>>>> ' + JSON.stringify(body));
      this.serviceApi.post('/v1/attendance/settings/templateAssignments/', body).subscribe(
        res => {
          if (res != null) {
            this.action = 'Response';
            this.error = res.message;
            this.close();
            console.log('Record Successfully saved');
          } else {
            console.log('Record Not Saved');
          }
        }, err => {
          this.action = 'Error';
          this.error = err.message;
          this.close();
          console.log('Record Successfully saved');
        });
    } else {
      Object.keys(this.addTemplateAssignment.controls).forEach(field => { // {1}
        const control = this.addTemplateAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }
  applyValidation() {
    this.geoLocations = [];
    this.showGeoLocation = false;

    this.addTemplateAssignment.controls.restrictedGeoLocation.clearValidators();
    this.addTemplateAssignment.controls.restrictedGeoLocation.reset();
    this.addTemplateAssignment.controls.attendenceApprover.clearValidators();
    console.log(this.addTemplateList)
    this.addTemplateList.filter(template => {
      console.log(template)
      if (template.ruleType === 'EMPLOYEEWISE' && template.viewValue === this.addTemplateAssignment.controls.attendenceTemplate.value) {
        this.addTemplateAssignment.controls.attendenceApprover.setValidators([Validators.required]);

        console.log(template);
      }
      if (template.restrictedGeoLocationType === true && template.viewValue === this.addTemplateAssignment.controls.attendenceTemplate.value) {
        this.showGeoLocation = true;
        this.addTemplateAssignment.controls.restrictedGeoLocation.setValidators(Validators.required);
        this.serviceApi.get('/v1/attendance/settings/templates/location/' + template.value).subscribe(res => {
          console.log(res);
          this.geoLocations = res;
        }, (err) => {

        }, () => {

        });
      }
    });
    this.addTemplateAssignment.controls.attendenceApprover.updateValueAndValidity();
    this.addTemplateAssignment.controls.restrictedGeoLocation.updateValueAndValidity();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}



@Component({
  templateUrl: './EditAttendenceTemplate.component.html',
  styleUrls: ['./EditAttendenceTemplate.component.scss']
})
export class EditAttendenceTemplateComponent implements OnInit {
  editTemplateAssignment: FormGroup;
  approverEmployeeList = [];
  geoLocations = [];
  action: any;
  error: any;
  checkedRowData = [];
  bioDeviceId: any;
  attendanceTemplateType = false;
  locationRestrictionType = false;
  constructor(public dialogRef: MatDialogRef<EditAttendenceTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.checkedRowData = data.checkedRowData;
    // this.editTemplateAssignment.controls.editAttendneceApprover.setValue(this.checkedRowData);
    if (data.attendanceTemplateType === "TEMPLATEWISE") {
      this.attendanceTemplateType = true;
    }
    if (data.locationRestrictionType === "TEMPLATEWISE") {
      this.locationRestrictionType = true;
    }
    console.log(this.data);
    this.editTemplateAssignment = this._fb.group({
      attdTemplateId: [data.attdTemplateId],
      employeeCode: [this.checkedRowData],
      bioMetricCode: [data.biometricCode],
      bioMetricDeviceId: [data.biometricDeviceId],
      editAttendneceApprover: [data.attendenceSupervisors[0]],
      restrictedGeoLocation: []
    });
    this.getAllEmployeeList();
    if (this.data.showLocationFilter) {
      this.getAllLocations(this.data.attendanceTemplateId);
      if (this.data.geoLocationId != null) {
        this.data.geoLocationId = this.data.geoLocationId.map(Number);
        console.log(this.data.geoLocationId);
        this.editTemplateAssignment.controls.restrictedGeoLocation.setValue(this.data.geoLocationId);
      }
    }


  }
  ngOnInit() {
  }

  getAllLocations(attendanceTemplateId: any) {
    this.geoLocations = [];
    this.serviceApi.get('/v1/attendance/settings/templates/location/' + attendanceTemplateId).subscribe(res => {
      console.log(res);
      this.geoLocations = res;
    }, (err) => {

    }, () => {

    });
  }

  getAllEmployeeList() {
    this.approverEmployeeList = [];
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.approverEmployeeList.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode
            });
          });
        }
      }, err => {

      });
  }

  saveUpdatedAssignment(element: any) {
    const body = {
      'attdTemplateId': this.editTemplateAssignment.controls.attdTemplateId.value,
      'bioMetricCode': this.editTemplateAssignment.controls.bioMetricCode.value,
      'bioMetricDeviceId': null,
      'currentAttendanceTemplate': this.data.currentAttendenceTemp,
      'effectiveFrom': this.data.effectiveFrom,
      'empCodeList': this.editTemplateAssignment.controls.employeeCode.value,
      'employeeName': '',
      'supervisor': this.editTemplateAssignment.controls.editAttendneceApprover.value,
      "geoLocationId": this.editTemplateAssignment.controls.restrictedGeoLocation.value,
    };

    console.log(JSON.stringify(body));
    const val = this.editTemplateAssignment.controls.attdTemplateId.value;

    this.serviceApi.put('/v1/attendance/settings/templateAssignments/' + +val, body).subscribe(
      res => {
        if (res != null) {
          this.action = 'Response';
          this.error = res.message;
          this.close();
          console.log('Record Successfully saved');
        } else {
          console.log('Record Not Saved');
        }
      }, err => {
        this.action = 'Error';
        this.error = err.message;
        this.close();
        console.log('Record Successfully saved');
      });

  }


  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  templateUrl: './OpenAttendanceHistory.component.html',
  styleUrls: ['./OpenAttendanceHistory.component.scss']
})
export class OpenAttendanceHistory implements OnInit {
  displayedColumns = ['currentAttendenceTemp', 'attendenceSupervisors', 'effectiveFrom', 'effectiveTo'];
  dataSource2: MatTableDataSource<Element>;
  constructor(public dialogRef: MatDialogRef<OpenAttendanceHistory>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder) {
    console.log('currentAttendenceTemp-->' + data.currentAttendenceTemp);
    ELEMENT_DATA.push(
      {
        empName: data.empName,
        currentAttendenceTemp: data.currentAttendenceTemp,
        biometricCode: data.biometricCode,
        biometricDeviceId: data.biometricDeviceId,
        attendenceSupervisors: data.attendenceSupervisors,
        effectiveFrom: data.effectiveFrom,
        actions: data.actions
      }
    );
  }
  ngOnInit() {
    this.dataSource2 = new MatTableDataSource<Element>(ELEMENT_DATA);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}



export interface Element {
  empName: string;
  currentAttendenceTemp: string;
  biometricCode: string;
  biometricDeviceId: string;
  attendenceSupervisors: string;
  effectiveFrom: string;
  actions: string;
}

const ELEMENT_DATA: Element[] = [];


@Component({
  templateUrl: 'bulk-upload-template-assignmnet-dialog.html',
})

export class BulkUploadTemplateAssignment implements OnInit {
  noFileSelected: boolean = false;
  ngOnInit(): void {

  }
  action: any;
  error: any;
  errorMessage: any;
  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFilesName: string;
  notificationMsg: any;
  message: any;
  constructor(public dialogRef: MatDialogRef<BulkUploadTemplateAssignment>, private fb: FormBuilder, private serviceApi: ApiCommonService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadFormat() {
    this.serviceApi.get('/v1/attendance/settings/templateAssignments/bulk/download/format').subscribe(res => {
      window.open(environment.storageServiceBaseUrl + res.url);
    })    
  }
  uploadFormat() {
    $('#uploadFile').click();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
    this.noFileSelected = false
  }

  upload() {
   if (this.selectedFiles!=undefined) {
    this.currentFileUpload = this.selectedFiles[0];
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/attendance/settings/templateAssignments/bulk/upload';

    this.serviceApi.postWithFormData(url, formdata).subscribe(res => {
      this.action = 'Response';
      this.message = 'Template Assignment uploaded successfuly';
      this.close();
      const dialogRef = this.dialog.open(AttendanceBulkUploadResponseComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { res: res, title: 'Attendance Template Assignment' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
            }
            else if (result.status === 'Error') {
            }
          }
        }
      });
    },
    err => {
      this.action = 'Error';
      this.message = 'Something went wrong';
    });
   }
   else {
     this.noFileSelected = true
   }
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}


@Component({
  templateUrl: 'bulk-upload-response.html',
  styleUrls: []
})
export class AttendanceBulkUploadResponseComponent implements OnInit {

  action: any;
  error = 'Error message';
  res: any;
  title: any;
  dataSource: MatTableDataSource<Element>;
  displayedColumns = ['empCode', 'statusMsg', 'inviteStatus'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _fb: FormBuilder, private serviceApi: ApiCommonService,
    public dialogRef: MatDialogRef<AttendanceBulkUploadResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(JSON.stringify(this.data));
    this.res = [];
    this.res = this.data.res;
    this.title = this.data.title;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Element>(this.res);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    
  }

  close(): void {
    console.log('this.data');
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }


}















































































































































































































































































































































































































































































































































































































































































































































