import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { SelectionModel } from '@angular/cdk/collections';
declare var $: any;
@Component({
  selector: 'app-lock-unlock-employee',
  templateUrl: './lock-unlock-employee.component.html',
  styleUrls: ['./lock-unlock-employee.component.scss']
})
export class LockUnlockEmployeeComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  columns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Work Location' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'status', header: 'Status' }
  ];
  filterDataList = [];
  public lockUnlockFilterForm: FormGroup;
  empList = [];
  locationsList = [];
  departmentsList = [];
  designationList = [];
  taxYear = [];
  selectedRows = [];
  actions: any;
  message: any;
  errorMessage: any;
  selection = new SelectionModel<Element>(true, []);
  constructor(private fb: FormBuilder, public dialog: MatDialog, private serviceApi: ApiCommonService,) {
    this.getAllFilterData();
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
  lockUnlockEmployeesDialog() {
    let selectedTaxYearId
    selectedTaxYearId = this.lockUnlockFilterForm.controls.taxYearId.value;
    var selectedEmployee = [];
    this.selectedRows.forEach(rows => {
      selectedEmployee.push(rows.empCode)
    });
    console.log(selectedEmployee);
    if (selectedEmployee.length > 0) {
      console.log(this.selectedRows);
      let dialogRef = this.dialog.open(LockUnlockEmployeesDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: { selectedEmployee, selectedTaxYearId, actions: 'lock', title: "Do you really want to Lock Employees" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.status = "Response") {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
              this.applyFilter();
            }
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
            }
          }
        }
        this.selection.clear()
        this.selectedRows = [];
      });
    } else {
      this.selectedRows = [];
      selectedEmployee = [];
      this.selection.clear();
      this.warningNotification('Select employees first');
    }
  }
  unLockUnlockEmployeesDialog() {
    let selectedTaxYearId
    selectedTaxYearId = this.lockUnlockFilterForm.controls.taxYearId.value;
    var selectedEmployee = [];
    this.selectedRows.forEach(rows => {
      selectedEmployee.push(rows.empCode)
    });
    console.log(selectedEmployee);
    if (selectedEmployee.length > 0) {
      console.log(this.selectedRows);
      let dialogRef = this.dialog.open(LockUnlockEmployeesDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: { selectedEmployee, selectedTaxYearId, actions: 'unlock', title: "Do you really want to UnLock Employees" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.status = "Response") {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
              this.applyFilter();
            }
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
            }
          }
        }
        this.selection.clear()
        this.selectedRows = [];
      });
    } else {
      this.selectedRows = [];
      selectedEmployee = [];
      this.selection.clear();
      this.warningNotification('Select employees first');
    }
  }
  ngOnInit() {
    this.lockUnlockFilterForm = this.fb.group({
      allFilter: [],
      employeeFilter: [],
      empCodes: [],
      locationsFilter: [],
      locations: [],
      departmentFilter: [],
      department: [],
      designationFilter: [],
      designation: [],
      taxYearFilter: [null, Validators.required],
      taxYearId: [null, Validators.required]
    });
  }
  getTaxYears() {
    this.taxYear = [];
    this.serviceApi.get('/v1/taxDeclaration/taxYear/all').subscribe(res => {
      if (res != null) {
        res.forEach(element => {
          this.taxYear = [...this.taxYear, element];
        });
      }
    },
      err => { },
      () => { });
  }
  getAllFilterData() {
    this.empList = [];
    this.locationsList = [];
    this.departmentsList = [];
    this.serviceApi.get('/v1/tax/filter/list').subscribe(res => {
      this.empList = res.empList;
      this.designationList = res.designations;
      this.locationsList = res.locations;
      this.departmentsList = res.departments;
      console.log(res);
    },
      (err) => {
      }, () => {
        this.getTaxYears();
      });
  }
  CancelFilter() {
    this.lockUnlockFilterForm.reset();
    this.lockUnlockFilterForm.enable();
  }
  applyFilter() {
    if (this.lockUnlockFilterForm.valid) {
      const body = {
        "departments": this.lockUnlockFilterForm.controls.department.value,
        "designations": this.lockUnlockFilterForm.controls.designation.value,
        "empCodes": this.lockUnlockFilterForm.controls.empCodes.value,
        "locations": this.lockUnlockFilterForm.controls.locations.value,
        "taxYearId": this.lockUnlockFilterForm.controls.taxYearId.value,
      };
      this.filterDataList = [];
      return this.serviceApi.post('/v1/tax/filter/employees', body).
        subscribe(
          res => {
            this.actions = 'Response';
            this.message = res.message;
            this.filterDataList = res;
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.actions = 'Error';
          }, () => {
            this.dt.reset();
          });
    } else {
      Object.keys(this.lockUnlockFilterForm.controls).forEach(field => {
        const control = this.lockUnlockFilterForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  selectAllFilter(event: MatCheckboxChange): void {
    console.log(event.checked);
    // Disable
    if (this.lockUnlockFilterForm.controls.allFilter.value == true) {
      this.lockUnlockFilterForm.controls.employeeFilter.disable();
      this.lockUnlockFilterForm.controls.empCodes.disable();
      this.lockUnlockFilterForm.controls.locationsFilter.disable();
      this.lockUnlockFilterForm.controls.locations.disable();
      this.lockUnlockFilterForm.controls.departmentFilter.disable();
      this.lockUnlockFilterForm.controls.department.disable();
      this.lockUnlockFilterForm.controls.designationFilter.disable();
      this.lockUnlockFilterForm.controls.designation.disable();
      // Enable
      this.lockUnlockFilterForm.controls.employeeFilter.setValue(true);
      this.lockUnlockFilterForm.controls.empCodes.setValue(null);
      this.lockUnlockFilterForm.controls.locationsFilter.setValue(true);
      this.lockUnlockFilterForm.controls.locations.setValue(null);
      this.lockUnlockFilterForm.controls.departmentFilter.setValue(true);
      this.lockUnlockFilterForm.controls.department.setValue(null);
      this.lockUnlockFilterForm.controls.designationFilter.setValue(true);
      this.lockUnlockFilterForm.controls.designation.setValue(null);
      this.lockUnlockFilterForm.controls.taxYearFilter.setValue(true)
      this.lockUnlockFilterForm.controls.taxYearId.setValue(null)
    }
    else {
      this.lockUnlockFilterForm.controls.employeeFilter.enable()
      this.lockUnlockFilterForm.controls.empCodes.enable()
      this.lockUnlockFilterForm.controls.locationsFilter.enable()
      this.lockUnlockFilterForm.controls.locations.enable()
      this.lockUnlockFilterForm.controls.departmentFilter.enable()
      this.lockUnlockFilterForm.controls.department.enable()
      this.lockUnlockFilterForm.controls.designationFilter.enable()
      this.lockUnlockFilterForm.controls.designation.enable()
      // Enable
      this.lockUnlockFilterForm.controls.employeeFilter.setValue(null);
      this.lockUnlockFilterForm.controls.empCodes.setValue(null);
      this.lockUnlockFilterForm.controls.locationsFilter.setValue(null);
      this.lockUnlockFilterForm.controls.locations.setValue(null);
      this.lockUnlockFilterForm.controls.departmentFilter.setValue(null);
      this.lockUnlockFilterForm.controls.department.setValue(null);
      this.lockUnlockFilterForm.controls.designationFilter.setValue(null);
      this.lockUnlockFilterForm.controls.designation.setValue(null);
      this.lockUnlockFilterForm.controls.taxYearFilter.setValue(null)
      this.lockUnlockFilterForm.controls.taxYearId.setValue(null)
    }
  }
  applyValidation(event: MatCheckboxChange): void {
    if (this.lockUnlockFilterForm.controls.employeeFilter.value === false) {
      this.lockUnlockFilterForm.controls.empCodes.reset();
    }
    if (this.lockUnlockFilterForm.controls.locationsFilter.value === false) {
      this.lockUnlockFilterForm.controls.locations.reset();
    }
    if (this.lockUnlockFilterForm.controls.departmentFilter.value === false) {
      this.lockUnlockFilterForm.controls.department.reset();
    }
    if (this.lockUnlockFilterForm.controls.designationFilter.value === false) {
      this.lockUnlockFilterForm.controls.designation.reset();
    }
    if (this.lockUnlockFilterForm.controls.taxYearFilter.value === false) {
      this.lockUnlockFilterForm.controls.taxYearId.reset();
    }
  }
}


@Component({
  templateUrl: 'lock-unlock-employees-dialog.html',
})
export class LockUnlockEmployeesDialogComponent {
  action: any;
  message: any;
  title: any;
  selectedEmp = [];
  selectedTaxYearId: any;
  constructor(public dialogRef: MatDialogRef<LockUnlockEmployeesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data);
    this.title = this.data.title;
    this.selectedEmp = data.selectedEmployee;
    this.selectedTaxYearId = data.selectedTaxYearId;
  }
  ngOnInit() { }
  applyForLock() {
    const body = {
      'empCodes': this.selectedEmp,
      'lockStatus': 'LOCKED',
      'taxYearId': this.selectedTaxYearId,
    }
    this.serviceApi.put('/v1/tax/filter/lock-unlock', body).subscribe(
      res => {
        console.log('Change Status ...' + JSON.stringify(res));
        if (res != null) {
          this.action = 'Response'
          this.message = res.message;
          this.close();
        } else { }
      }, err => {
        console.log('err -->' + err);
      }, () => {
      });
  }
  applyForUnlock() {
    const body = {
      'empCodes': this.selectedEmp,
      'lockStatus': 'UNLOCKED',
      'taxYearId': this.selectedTaxYearId,
    }
    this.serviceApi.put('/v1/tax/filter/lock-unlock', body).subscribe(
      res => {
        console.log('Change Status ...' + JSON.stringify(res));
        if (res != null) {
          this.action = 'Response'
          this.message = res.message;
          this.close();
        } else { }
      }, err => {
        console.log('err -->' + err);
      }, () => {
      });
  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}