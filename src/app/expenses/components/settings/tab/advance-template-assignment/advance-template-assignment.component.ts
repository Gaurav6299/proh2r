import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTable, SelectItem } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { environment } from '../../../../../../environments/environment';

declare var $: any
@Component({
  selector: 'app-advance-template-assignment',
  templateUrl: './advance-template-assignment.component.html',
  styleUrls: ['./advance-template-assignment.component.scss']
})
export class AdvanceTemplateAssignmentComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  workLocations: SelectItem[] = [];
  bands: SelectItem[] = [];
  departments: SelectItem[] = [];
  designations: SelectItem[] = [];
  advanceTemplateAssignment: FormGroup;
  showHideFilter = false;
  checkedRowData = [];
  addArray = [];
  errorMessage: any;
  assignmentList = [];
  selection = new SelectionModel<Element>(true, []);
  // displayedColumns = ['select', 'EmployeeName', 'CurrentExpenseTemplate', 'primaryApprover', 'secondaryApprover', 'actions'];
  columns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'workLocation', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'templateName', header: 'Current Advance Template' },
    { field: 'primaryApproverName', header: 'Primary Supervisors' },
    { field: 'secondaryApproverName', header: 'Secondary Supervisors' },
    { field: 'actions', header: 'Actions' }
  ]
  selectedRows = [];
  tempTypeSelected: any;
  empSelected: any = false;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.getTemplateAssignmentList();
  }
  ngOnInit() {
    this.getTemplateAssignmentList();
    this.advanceTemplateAssignment = this.fb.group({
      select: [],
      SearchFilter: []
    });
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
  clearFilter() {
    this.advanceTemplateAssignment.controls.SearchFilter.reset();
  }
  ngAfterViewInit() {
  }

  getTemplateAssignmentList() {
    this.assignmentList = [];
    this.serviceApi.get('/v1/advance/template/assignment/getAll').
      subscribe(
        res => {
          res.forEach(element => {
            let found1 = this.workLocations.filter(obj => obj.value === element.location)
            if (!found1.length) {
              this.workLocations.push({ label: element.location, value: element.location })
            }

            let found2 = this.bands.filter(obj => obj.value === element.band)
            if (!found2.length) {
              this.bands.push({ label: element.band, value: element.band })
            }

            let found3 = this.departments.filter(obj => obj.value === element.department)
            if (!found3.length) {
              this.departments.push({ label: element.department, value: element.department })
            }

            let found4 = this.designations.filter(obj => obj.value === element.designation)
            if (!found4.length) {
              this.designations.push({ label: element.designation, value: element.designation })
            }

            this.assignmentList.push(
              {
                'templateId': element.advanceTemplateId,
                'advanceTemplateAssignmentId': element.advanceTemplateAssignmentId,
                'employeeName': element.empName,
                'templateName': element.advanceTemplateName,
                'effectiveDate': element.effectiveDate,
                'primaryApprover': element.primarySupervisorId,
                'primaryApproverName': element.primarySupervisorName,
                'empCode': element.empCode,
                'employeeCode': element.employeeCode,
                'secondaryApprover': element.secondarySupervisorId,
                'secondaryApproverName': element.secondarySupervisorName,
                'workLocation': element.location,
                'band': element.band,
                'department': element.department,
                'designation': element.designation,
              });
          });
        },
        err => {
          if (err.status === 404 || err.statusText === 'OK') {
          }
        }, () => {
          this.dt.reset();
        });
  }
  getRowMultipleData(element: any, event: any) {
    for (let i = 0; i < element.length; i++) {
      const empCode = element[i].empCode;
      if (event.checked) {
        this.checkedRowData.push(
          empCode
        );
        this.empSelected = true;
      } else {
        this.empSelected = false;
        this.checkedRowData.splice(i, this.checkedRowData.length);
      }
    }
  }

  getRowData(element: any, event: any) {
    const empCode = element.empCode;
    if (event.checked) {
      this.checkedRowData.push(
        empCode
      )
      this.empSelected = true;
      this.tempTypeSelected = element.templateType
    }
    else {
      if (this.checkedRowData === null) {
        this.empSelected = false;
      }
      this.tempTypeSelected = null;
      for (var i = 0; i < this.checkedRowData.length; i++) {
        if (this.checkedRowData[i] === empCode[1]) {
          this.checkedRowData.splice(i, 1);
        } else {
        }
      }
    }
  }

  openDialogToaddAssigmentTemplate(element: any): void {
    console.log(element.empCode)
    const dialogRef = this.dialog.open(AddAdvanceAssigmentTemplate, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        element: element,
        empCode: element.empCode,
        advanceTemplateAssignmentId: element.advanceTemplateAssignmentId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);
            this.getTemplateAssignmentList();
          }
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
          }
        }
      }
      this.empSelected = false;
    });
  }

  openDialogEditAssigmentTemplate(element: any): void {
    const dialogRef = this.dialog.open(EditAdvanceAssigmentTemplate, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        empCode: element.empCode,
        templateAssignmentId: element.advanceTemplateAssignmentId,
        templateId: element.templateId,
        primaryApprover: element.primaryApprover,
        primaryApproverName: element.primaryApproverName,
        secondaryApprover: element.secondaryApprover,
        secondaryApproverName: element.secondaryApproverName,
        effectiveDate: element.effectiveDate,
        templateName: element.templateName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);
            this.getTemplateAssignmentList();
          }
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
          }
        }
      }
      this.empSelected = false;
      this.checkedRowData = [];
    });
  }

  deleteAdvanceAssignment(data: any) {
    let dialogRef = this.dialog.open(DeleteAdvanceAssignmentModel, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { advanceTemplateAssignmentId: data.advanceTemplateAssignmentId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);
            this.getTemplateAssignmentList();
          }
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
          }
        }
      }
      this.empSelected = false;
      this.checkedRowData = [];
    });
  }

  openDialogToBulkAdvanceTemplateAssigment(data: any): void {
    console.log(this.selectedRows);
    console.log('selected value==' + this.advanceTemplateAssignment.controls.select.value);
    if (data === 'AssignTemplates') {
      if (this.selectedRows.length == 0) {
        this.selectedRows = [];
        this.warningNotification('Select an employee first');
      } else {
        this.selectedRows.forEach(
          row => {
            var empCode = row.employeeName.split('-');
            this.checkedRowData.push(
              empCode[1]
            );
          });
        const dialogRef = this.dialog.open(BulkAssignAdvanceTemplate, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: this.checkedRowData,
            selected: this.empSelected
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
            if (result.message) {
              if (result.status === 'Response') {
                this.errorMessage = result.message;
                this.successNotification(this.errorMessage);
                this.getTemplateAssignmentList();
              }
              else if (result.status === 'Error') {
                this.errorMessage = result.message;
              }
            }
            this.selectedRows = [];
          }
          this.selection.clear();
          this.empSelected = false;
          this.checkedRowData = [];
          this.advanceTemplateAssignment.controls.select.setValue(null);
        });
      }

    }
    if (data === "AssignSupervisors") {
      if (this.selectedRows.length == 0) {
        this.selectedRows = [];
        this.warningNotification('Select an employee first');
      } else if (this.empSelected === true && this.tempTypeSelected === 'TEMPLATEWISE') {
      } else {
        this.selectedRows.forEach(
          row => {
            var empCode = row.employeeName.split('-');
            this.checkedRowData.push(
              empCode[1]
            );
          });
        const dialogRef = this.dialog.open(AssignSupervisorAdvanceTemplate, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: this.checkedRowData,
            selected: this.empSelected,
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
                this.getTemplateAssignmentList();
              }
              else if (result.status === 'Error') {
                this.errorMessage = result.message;
              }
            }
            this.selectedRows = [];
          }
          this.selection.clear();
          this.empSelected = false;
          this.checkedRowData = [];
          this.advanceTemplateAssignment.controls.select.setValue(null);
        });
      }
    }
  }

  openDialogToBulkUploadTemplateAssigment() {
    const dialogRef = this.dialog.open(BulkUploadAdvanceTemplateAssignment, {
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
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);

            this.getTemplateAssignmentList();
          }
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
          }
        }
      }
    });
  }
}


/**
  * -------------------ADD ASSIGNMENT ---------------
  */
@Component({
  templateUrl: 'add-advance-template-assignment-dialog.html',
  styleUrls: ['./delete-advance-template-assigment-dialog.scss']
})
export class AddAdvanceAssigmentTemplate implements OnInit {

  addArray = []
  advanceTemplate = [];
  employee = [];
  primaryApprover: any;
  secondaryApprover: any;
  status: any;
  myControl = new FormControl();
  myControl1 = new FormControl();
  selectedEmployee = new FormControl();
  openPrimaryDiv: boolean = false;
  openSecondaryDiv: boolean = false;
  openApproverList: boolean;
  bankList = [];
  hideShowfrequencyRestriction: any;
  public addAdvanceAssignment: FormGroup;
  hideShowDivForSpecificEemployee: any;
  message: any;
  error: any;
  action: any;
  optionsData: any = [];
  secondaryOptionsData: any = [];
  empCode: any;
  advanceTemplateAssignmentId: any;

  constructor(public dialogRef: MatDialogRef<AddAdvanceAssigmentTemplate>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.addAdvanceAssignment = this._fb.group({
      advanceTemplateId: [null, Validators.required],
      effectiveDate: [null, Validators.required],
      primaryApprover: [null],
      primaryApproverName: [null],
      secondaryApprover: [null],
      secondaryApproverName: [null],
      advanceApprovalType: [null],
    });
    this.empCode = data.empCode;
    this.advanceTemplateAssignmentId = data.advanceTemplateAssignmentId;
    this.openApproverList = false;
    this.getAllAdvanceTemplate();
    this.getEmployee();
  }

  getAllAdvanceTemplate() {
    this.advanceTemplate = [];
    this.serviceApi.get('/v1/advance/template/getAll').
      subscribe(
        res => {
          res.forEach(element => {
            this.advanceTemplate.push(
              {
                "advanceTemplateId": element.advanceTemplateId,
                "templateName": element.templateName,
                "advanceApprovalLevel": element.advanceApprovalLevel,
                "advanceApprovalType": element.advanceApprovalType,
                "primaryApprover": element.primaryApprover,
                "secondaryApprover": element.secondaryApprover,
              });
          });
        },
        () => {
        });
  }

  getEmployee() {
    this.employee = [];
    this.optionsData = [];
    this.secondaryOptionsData = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employee.push(
              {
                value: element.empCode,
                viewValue: element.empFirstName + " " + element.empLastName,
              });
          });
        },
        () => {
        });
    this.optionsData = this.employee;
    this.secondaryOptionsData = this.employee;
  }

  selectTemplate() {
    this.openApproverList = true;
    this.advanceTemplate.forEach(advance => {
      if (advance.advanceTemplateId == this.addAdvanceAssignment.controls.advanceTemplateId.value) {
        if (advance.advanceApprovalType == 'TemplateWise') {
          this.primaryApprover = advance.primaryApprover;
          this.secondaryApprover = advance.secondaryApprover;
          this.employee.forEach(emp => {
            if (advance.primaryApprover == emp.value) {
              this.addAdvanceAssignment.controls.primaryApprover.setValue(emp.value);
              this.addAdvanceAssignment.controls.primaryApproverName.setValue(emp.viewValue);
            }
            if (advance.secondaryApprover == emp.value) {
              this.addAdvanceAssignment.controls.secondaryApprover.setValue(emp.value);
              this.addAdvanceAssignment.controls.secondaryApproverName.setValue(emp.viewValue);
            }
          });

        }
        if (advance.advanceApprovalType == 'EmployeeWise') {
          this.addAdvanceAssignment.controls.advanceApprovalType.setValue(advance.advanceApprovalType);
          this.addAdvanceAssignment.controls.primaryApprover.setValue(null);

          this.addAdvanceAssignment.controls.secondaryApprover.setValue(null);

        }
        if (advance.advanceApprovalLevel === 'First_Level') {
          this.openPrimaryDiv = true;
          this.openSecondaryDiv = false;
          this.addAdvanceAssignment.controls.advanceApprovalType.setValue(advance.advanceApprovalType);
          this.addAdvanceAssignment.controls.primaryApprover.setValidators([Validators.required]);
          this.addAdvanceAssignment.controls.secondaryApprover.clearValidators();
        }
        else if (advance.advanceApprovalLevel === 'Second_level') {
          this.openPrimaryDiv = true;
          this.openSecondaryDiv = true;
          this.addAdvanceAssignment.controls.advanceApprovalType.setValue(advance.advanceApprovalType);
          this.addAdvanceAssignment.controls.primaryApprover.setValidators([Validators.required]);
          this.addAdvanceAssignment.controls.secondaryApprover.setValidators([Validators.required]);
        }
      }
    });

    this.addAdvanceAssignment.controls.primaryApprover.updateValueAndValidity();
    this.addAdvanceAssignment.controls.secondaryApprover.updateValueAndValidity();
  }

  assignTemplate() {
    if (this.addAdvanceAssignment.valid) {
      const body = {
        "advanceTemplateAssignmentId": this.advanceTemplateAssignmentId,
        "employeeCode": [this.empCode],
        "primarySupervisorId": this.addAdvanceAssignment.controls.primaryApprover.value,
        "secondarySupervisorId": this.addAdvanceAssignment.controls.secondaryApprover.value,
        "advanceTemplateId": this.addAdvanceAssignment.controls.advanceTemplateId.value,
        "effectiveDate": this.addAdvanceAssignment.controls.effectiveDate.value
      };
      console.log(body);
      this.serviceApi.post('/v1/advance/template/assignment/create', body)
        .subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.addAdvanceAssignment.controls).forEach(field => { // {1}
        const control = this.addAdvanceAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  searchEmployeeName(data: any) {
    this.optionsData = this.employee.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }
  resetSearch() {
    this.myControl.setValue('');
    this.optionsData = [];
    this.optionsData = this.employee;
  }
  secondarySearchEmpName(data: any) {
    this.secondaryOptionsData = this.employee.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl1.value.toLowerCase()) !== -1);
  }
  secondaryResetSearch() {
    this.myControl1.setValue('');
    this.secondaryOptionsData = [];
    this.secondaryOptionsData = this.employee;
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  clickRedioButtonForSpecificeEMp() {
    this.hideShowDivForSpecificEemployee = true;
  }

  clickRadioButtonForAllEmployee() {
    this.hideShowDivForSpecificEemployee = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

}

/**
 * -------------------EDIT ASSIGNMENT ---------------
 */

@Component({
  templateUrl: 'edit-advance-template-assignment-dialog.html',
  styleUrls: ['./delete-advance-template-assigment-dialog.scss']
})

export class EditAdvanceAssigmentTemplate implements OnInit {
  templateName: any;
  employee = [];
  advanceTemplate = [];
  message: any;
  status: any;
  error: any;
  action: any;
  myControl = new FormControl();
  public addAdvanceAssignment: FormGroup;
  empCode: any;
  templateAssignmentId: any;
  templateId: any;

  constructor(
    public dialogRef: MatDialogRef<EditAdvanceAssigmentTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.empCode = data.empCode;
    this.templateAssignmentId = data.templateAssignmentId;
    this.templateId = data.templateId
    this.addAdvanceAssignment = this._fb.group({
      primaryApprover: [data.primaryApprover],
      primaryApproverName: [],
      secondaryApprover: [data.secondaryApprover],
      secondaryApproverName: [],
      effectiveDate: [data.effectiveDate],
      advanceApprovalLevel: [],
      advanceApprovalType: []
    })
    this.templateName = data.templateName
    this.getEmployee();
    this.getTemplateDetails()
  }

  getEmployee() {
    this.employee = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employee.push(
              {
                value: element.empCode,
                viewValue: element.empFirstName + " " + element.empLastName,
              });
          });

        },
        () => {
        });
  }
  getTemplateDetails() {
    this.serviceApi.get('/v1/advance/template/assignment/get/assigned/template?empCode=' + this.empCode).subscribe(res => {
      this.addAdvanceAssignment.controls.advanceApprovalType.setValue(res.advanceApprovalType);
      this.addAdvanceAssignment.controls.advanceApprovalLevel.setValue(res.advanceApprovalLevel);
      this.addAdvanceAssignment.controls.primaryApproverName.setValue(res.primaryApproverName);
      this.addAdvanceAssignment.controls.secondaryApproverName.setValue(res.secondaryApproverName);
    })
  }
  updateAssignment() {
    const body = {
      "advanceTemplateAssignmentId": this.templateAssignmentId,
      "advanceTemplateId": this.templateId,
      "employeeCode": [this.empCode],
      "primarySupervisorId": this.addAdvanceAssignment.controls.primaryApprover.value,
      "secondarySupervisorId": this.addAdvanceAssignment.controls.secondaryApprover.value,
      "effectiveDate": this.addAdvanceAssignment.controls.effectiveDate.value
    };
    this.serviceApi.put('/v1/advance/template/assignment/update', body)
      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
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
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() { }

}

/**
 * ---------- DELETE EXPENSE -----------------
 */
@Component({
  selector: 'app-delete-advance-Assingment',
  templateUrl: 'delete-advance-template-assigment-dialog.html',
  styleUrls: ['./delete-advance-template-assigment-dialog.scss']
})
export class DeleteAdvanceAssignmentModel {
  advanceTemplateAssignmentId: any;
  message: any;
  status: any;
  error: any;
  action: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteAdvanceAssignmentModel>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.advanceTemplateAssignmentId = this.data.advanceTemplateAssignmentId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  assignTemplate() { }
  onDelete() {
    return this.serviceApi.delete('/v1/advance/template/assignment/delete/' + this.advanceTemplateAssignmentId)
      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        }, err => {
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

/**
 * --------------- BULK ASSIGN -------------------
 */
@Component({
  templateUrl: 'bulk-assign-advance-templates.html',
  styleUrls: ['./delete-advance-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class BulkAssignAdvanceTemplate implements OnInit {
  hideShowSaveButton = true;
  hideShowUpdateButton = false;
  myControl = new FormControl();
  selectedEmployee = new FormControl();
  checkedRowData = [];
  message: any;
  status: any;
  error: any;
  action: any;
  public addAdvanceAssignment: FormGroup;
  hideShowDivForSpecificEemployee: any
  templateType: any;
  empSelected: any;
  advanceTemplate: any[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<BulkAssignAdvanceTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.checkedRowData = this.data.checkedRowData;
    this.addAdvanceAssignment = this._fb.group({
      advanceTemplateId: [null, Validators.required],
      effectiveDate: [null, Validators.required],
      primaryApprover: [null],
      secondaryApprover: [null],
      advanceApprovalType: [null],
      employeeCode: [null]
    });
    this.getAllAdvanceTemplate();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() { }
  getAllAdvanceTemplate() {
    this.advanceTemplate = [];
    this.serviceApi.get('/v1/advance/template/getAll').
      subscribe(
        res => {
          res.forEach(element => {
            this.advanceTemplate.push(
              {
                "advanceTemplateId": element.advanceTemplateId,
                "templateName": element.templateName,
                "advanceApprovalLevel": element.advanceApprovalLevel,
                "advanceApprovalType": element.advanceApprovalType,
                "primaryApprover": element.primaryApprover,
                "secondaryApprover": element.secondaryApprover,
              });
          });
        },
        () => {
        });
  }
  selectTemplate() {
    console.log(this.checkedRowData)
    this.addAdvanceAssignment.controls.employeeCode.setValue(this.checkedRowData);
    this.advanceTemplate.forEach(advance => {
      if (advance.advanceTemplateId == this.addAdvanceAssignment.controls.advanceTemplateId.value) {
        this.addAdvanceAssignment.controls.advanceApprovalType.setValue(advance.advanceApprovalType);
        this.addAdvanceAssignment.controls.secondaryApprover.setValue(advance.expenseSecondaryApprover);
        this.addAdvanceAssignment.controls.primaryApprover.setValue(advance.expensePrimaryApprover);
      }
    });
  }

  bulkAssign() {
    if (this.addAdvanceAssignment.controls.advanceTemplateId.valid) {
      const body = {
        "employeeCode": this.addAdvanceAssignment.controls.employeeCode.value,
        "advanceTemplateId": this.addAdvanceAssignment.controls.advanceTemplateId.value,
        "advanceTemplateAssignmentId": null
      };
      this.serviceApi.post('/v1/advance/template/assignment/create', body)
        .subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            this.action = 'Error';
            this.error = err.message;
            this.close();

          });
    }
    else {
      this.addAdvanceAssignment.controls.advanceTemplateId.markAsTouched({ onlySelf: true });       // {3}
    }

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}


import { Observable } from 'rxjs/Observable';
@Component({
  templateUrl: 'assign-supervisor-advance-template-dialog.html',
  styleUrls: ['./delete-advance-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AssignSupervisorAdvanceTemplate implements OnInit {

  bankList = [];
  message: any;
  status: any;
  error: any;
  action: any;
  hideShowfrequencyRestriction: any;
  public addAdvanceAssignment: FormGroup;
  hideShowDivForSpecificEemployee: any;
  checkedRowData = [];
  employee = [];
  templateType: any;
  myControl = new FormControl();
  myControl1 = new FormControl();
  optionsData = [];
  secondaryOptionsData = [];
  empSelected: any;
  // tslint:disable-next-line:max-line-length
  constructor(public dialogRef: MatDialogRef<AssignSupervisorAdvanceTemplate>, @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.addAdvanceAssignment = this._fb.group({
      primaryApprover: [null, Validators.required],
      secondaryApprover: [],
      employeeCode: [this.data.checkedRowData],
      advanceTemplateId: [this.data.advanceTemplateId]
    });
    this.getEmployee();
  }

  getEmployee() {
    this.employee = [];
    this.optionsData = [];
    this.secondaryOptionsData = [];
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employee.push(
              {
                value: element.empCode,
                viewValue: element.empFirstName + " " + element.empLastName,
              });
          });
        },
        () => {
          console.log('Enter into Else Bloack');
        });
    this.optionsData = this.employee;
    this.secondaryOptionsData = this.employee;
  }
  searchEmployeeName(data: any) {
    this.optionsData = this.employee.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl.value.toLowerCase()) !== -1);
  }
  resetSearch() {
    this.myControl.setValue('');
    this.optionsData = [];
    this.optionsData = this.employee;
  }
  secondarySearchEmpName(data: any) {
    this.secondaryOptionsData = this.employee.filter(option =>
      option.viewValue.toLowerCase().indexOf(this.myControl1.value.toLowerCase()) !== -1);
  }
  secondaryResetSearch() {
    this.myControl1.setValue('');
    this.secondaryOptionsData = [];
    this.secondaryOptionsData = this.employee;
  }

  filteredOptions: Observable<string[]>;
  updateSupervisor() {
    if (this.addAdvanceAssignment.valid) {
      const body = {
        "primarySupervisorId": this.addAdvanceAssignment.controls.primaryApprover.value,
        "secondarySupervisorId": this.addAdvanceAssignment.controls.secondaryApprover.value,
        "employeeCode": this.addAdvanceAssignment.controls.employeeCode.value,
        "advanceTemplateId": this.addAdvanceAssignment.controls.advanceTemplateId.value,
        "advanceTemplateAssignmentId": null
      };
      this.serviceApi.post('/v1/advance/template/assignment/create', body)
        .subscribe(
          res => {
            this.action = 'Response';
            this.error = res.message;
            this.close();
          },
          err => {
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    }
    else {
      Object.keys(this.addAdvanceAssignment.controls).forEach(field => { // {1}
        const control = this.addAdvanceAssignment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }

  ngOnInit() {
    this.checkedRowData = this.data.checkedRowData;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
}

/**
 * ----------------BULK DOWNLOAD UPLOAD -----------------
 */
@Component({
  templateUrl: 'bulk-upload-template-assignment-dialog.html',
})

export class BulkUploadAdvanceTemplateAssignment implements OnInit {
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
  constructor(public dialogRef: MatDialogRef<BulkUploadAdvanceTemplateAssignment>, private fb: FormBuilder, private serviceApi: ApiCommonService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadFormat() {
    this.serviceApi.get('/v1/advance/template/assignment/download/bulk-format').subscribe(res => {
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
    if (this.selectedFiles != undefined) {
      this.currentFileUpload = this.selectedFiles[0];
      const file = <File>this.currentFileUpload;
      let formdata: FormData = new FormData();
      formdata.append('file', file);
      const url = '/v1/advance/template/assignment/upload';

      this.serviceApi.putWithFormData(url, formdata).subscribe(res => {
        this.action = 'Response';
        this.message = 'Template Assignment uploaded successfuly';
        this.close();
        const dialogRef = this.dialog.open(AdvanceBulkUploadResponseComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: { res: res, title: 'Advance Template Assignment' }
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
export class AdvanceBulkUploadResponseComponent implements OnInit {

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
    public dialogRef: MatDialogRef<AdvanceBulkUploadResponseComponent>,
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
