import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
declare var $: any;
@Component({
  selector: 'app-template-assignments',
  templateUrl: './template-assignments.component.html',
  styleUrls: ['./template-assignments.component.scss']
})
export class TemplateAssignmentsComponent implements OnInit, AfterViewInit {
  @ViewChild("dt1") dt: DataTable;
  workLocations: SelectItem[] = [];
  bands: SelectItem[] = [];
  departments: SelectItem[] = [];
  designations: SelectItem[] = [];
  expeenceTemplateAssignment: FormGroup;
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
    { field: 'templateName', header: 'Current Expense Template' },
    { field: 'primaryApprover', header: 'Primary Supervisors' },
    { field: 'secondaryApprover', header: 'Secondary Supervisors' },
    { field: 'actions', header: 'Actions' }
  ]
  selectedRows = [];
  tempTypeSelected: any;
  empSelected: any = false;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.getTemplateAssignmentList();
    var rolesArr = KeycloakService.getUserRole();
  }
  ngOnInit() {
    this.getTemplateAssignmentList();
    this.expeenceTemplateAssignment = this.fb.group({
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
    this.expeenceTemplateAssignment.controls.SearchFilter.reset();
  }
  ngAfterViewInit() {
  }

  getTemplateAssignmentList() {
    this.assignmentList = [];
    this.serviceApi.get2('/v1/expense/settings/expenseassignments/').
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
                'templateId': element.templateId,
                'empCodeList': element.empCodeList,
                'employeeName': element.employeeName,
                'templateName': element.templateName,
                'effectiveFrom': element.effectiveFrom,
                'primaryApprover': element.primaryApprover,
                'signatoryEmpCode': element.signatoryEmpCode,
                'secondaryApprover': element.secondaryApprover,
                'templateType': element.templateType,
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
          console.log('No Company Policy Exist');
        }, () => {
          this.dt.reset();
        });
  }
  getRowMultipleData(element: any, event: any) {
    for (let i = 0; i < element.length; i++) {
      console.log('type....' + event);
      const empCode = element[i].employeeName.split('-');
      console.log('empCode...... ' + empCode[1]);

      if (event.checked) {
        this.checkedRowData.push(
          empCode[1]
        );
        this.empSelected = true;
        console.log('..........' + JSON.stringify(this.checkedRowData));
        console.log('........length' + this.checkedRowData.length);
      } else {
        console.log('else block');
        this.empSelected = false;
        this.checkedRowData.splice(i, this.checkedRowData.length);
        console.log('Match Found');
      }
    }
  }

  getRowData(element: any, event: any) {
    console.log('checkBox ' + this.checkedRowData)
    console.log('type........' + element.templateType);
    console.log('element........' + element.templateName);
    const empCode = element.employeeName.split("-");
    console.log('element........' + empCode[1]);
    if (event.checked) {
      this.checkedRowData.push(
        empCode[1]
      )
      this.empSelected = true;
      this.tempTypeSelected = element.templateType
      console.log(JSON.stringify(this.checkedRowData));
    }
    else {
      if (this.checkedRowData === null) {
        this.empSelected = false;
      }
      this.tempTypeSelected = null;
      console.log('ENter in the Else Block');
      // this.tempCheckedRowData = this.checkedRowData;
      for (var i = 0; i < this.checkedRowData.length; i++) {
        if (this.checkedRowData[i] === empCode[1]) {
          this.checkedRowData.splice(i, 1);
          console.log('Match Found');
        } else {
          console.log('Not Matched');
        }
      }
    }
  }

  openDialogToViewHistoryOfAssignTemplate() {
    const dialogRef = this.dialog.open(HistoryOfEmployeeExpenseAssignmentsDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {}
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }


  //------------this code open popup on click add reason button to add new reason--------//
  openDialogToaddAssigmentTemplate(element: any): void {
    const dialogRef = this.dialog.open(AddExpenceAssigmentTemplate, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: {
        templateType: element.templateType, employeeName: element.employeeName, templateName: element.templateName, primaryApprover: element.primaryApprover, secondaryApprover: element.secondaryApprover, selected: this.empSelected,
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
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            this.errorMessage = result.message;
            // this.warningNotification(this.errorMessage);
          }
        }
      }
      this.empSelected = false;
      console.log('The dialog was closed');
    });
  }

  // ------------above code is clossed here--------//
  // ------------this code open popup on click add reason button to add new reason--------//
  openDialogToBulkExpenceTemplateAssigment(data: any): void {
    console.log(this.selectedRows);
    console.log('selected value==' + this.expeenceTemplateAssignment.controls.select.value);
    if (data === 'Assigntemplates') {
      if (this.selectedRows.length == 0) {
        this.warningNotification('Select an employee first');
        this.selectedRows = [];
        this.getTemplateAssignmentList();
      } else {
        this.selectedRows.forEach(
          row => {
            var empCode = row.employeeName.split('-');
            this.checkedRowData.push(
              empCode[1]
            );
          });
        const dialogRef = this.dialog.open(BulkAssignExpenceTemplate, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: this.checkedRowData,
            selected: this.empSelected
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
              // tslint:disable-next-line:one-line
              else if (result.status === 'Error') {
                this.errorMessage = result.message;
              }
            }
            this.selectedRows = [];
          }
          this.selection.clear();
          this.empSelected = false;
          this.checkedRowData = [];
          this.expeenceTemplateAssignment.controls.select.setValue(null);
        });
      }

    }
    if (data === "Assignsupervisors") {
      if (this.selectedRows.length == 0) {
        this.warningNotification('Select an employee first');
        this.selectedRows = [];
        this.getTemplateAssignmentList();
      } else if (this.empSelected === true && this.tempTypeSelected === 'TEMPLATEWISE') {
        this.warningNotification('Supervisor already assigned templatewise');
      } else {
        this.selectedRows.forEach(
          row => {
            var empCode = row.employeeName.split('-');
            this.checkedRowData.push(
              empCode[1]
            );
          });
        const dialogRef = this.dialog.open(AssignSupervisorDialog, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: this.checkedRowData,
            selected: this.empSelected
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
              // tslint:disable-next-line:one-line
              else if (result.status === 'Error') {
                this.errorMessage = result.message;
                // this.warningNotification(this.errorMessage);
              }
            }
            this.selectedRows = [];
          }
          this.selection.clear();
          this.empSelected = false;
          this.checkedRowData = [];
          this.expeenceTemplateAssignment.controls.select.setValue(null);
        });
      }
    }

    if (this.expeenceTemplateAssignment.controls.select.value === "Uploadtemplateassignments") {
      const dialogRef = this.dialog.open(UploadTemplateAssignmentDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {}
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
        console.log('The dialog was closed');
        this.selection.clear();
        this.empSelected = false;
        this.checkedRowData = [];
        this.expeenceTemplateAssignment.controls.select.setValue(null);
      });
    }
    if (this.expeenceTemplateAssignment.controls.select.value === "Uploadsupervisors") {
      const dialogRef = this.dialog.open(UploadSupervisorDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {}
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
        this.selection.clear();
        this.empSelected = false;
        this.checkedRowData = [];
        this.expeenceTemplateAssignment.controls.select.setValue(null);
      });
    }
  }

  //------------this code open popup on click add reason button to add new reason--------//
  openDialogEditAssigmentTemplate(element: any): void {
    const dialogRef = this.dialog.open(EditExpenceAssigmentTemplate, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { templateId: element.templateId, element: element, primaryApprover: element.primaryApprover, secondaryApprover: element.secondaryApprover }



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
            // this.warningNotification(this.errorMessage);
          }
        }
      }
      this.empSelected = false;
      // this.selection.clear();
      this.checkedRowData = [];
    });
  }

  //------------this code open popup on click bulk assign template option in actions--------//
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
  //------------above code is clossed here--------//

  deleteExpenceAssingment(data: any) {
    let dialogRef = this.dialog.open(DeleteExpenceAssingmentModel, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { templateId: data.templateId }
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
            // this.warningNotification(this.errorMessage);
          }
        }
      }
      this.empSelected = false;
      // this.selection.clear();
      this.checkedRowData = [];
    });
  }
}


export interface Element {
  EmployeeName: string;
  CurrentExpenseTemplate: string;
  Supervisors: string;
  actions: String;
  select: String
}


// -----------------Fixed Allowance Data table interface end------------

// ---------------- Employee delete model start ------------------------
@Component({
  selector: 'app-eleteExpence-Assingment',
  templateUrl: 'delete-expence-template-assigment-dialog.html',
  styleUrls: ['./delete-expence-template-assigment-dialog.scss']
})
export class DeleteExpenceAssingmentModel {
  templateId: any;
  message: any;
  status: any;
  error: any;
  action: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteExpenceAssingmentModel>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.templateId = this.data.templateId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  assignTemplate() { }
  onDelete() {
    return this.serviceApi.delete('/v1/expense/settings/expenseassignments/' + this.templateId)

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


@Component({
  templateUrl: 'add-expence-templatw-assignment-dialog.html',
  styleUrls: ['./delete-expence-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AddExpenceAssigmentTemplate implements OnInit {

  addArray = []
  hideShowSaveButton = true;
  expenceTemplate = [];
  employee = [];
  primaryApprover: any;
  secondaryApprover: any;
  hideShowUpdateButton = false;
  status: any;
  myControl = new FormControl();
  myControl1 = new FormControl();
  selectedEmployee = new FormControl();
  // options = [
  //   { value: 'zeeshan-1115', viewValue: 'zeeshan-1115' },
  //   { value: 'Anuj-1116', viewValue: 'Anuj-1116' },
  //   { value: 'Ajay-1117', viewValue: 'Ajay-1117' },
  //   { value: 'Dheeraj-1118', viewValue: 'Dheeraj-1118' }
  // ];
  // optionsData = this.options;
  openPrimaryDiv: boolean;
  openSecondaryDiv: boolean;
  openApproverList: boolean;
  bankList = [];
  templateType: any;
  hideShowfrequencyRestriction: any;
  public addExpenceAssingment: FormGroup;
  hideShowDivForSpecificEemployee: any;
  message: any;
  error: any;
  action: any;
  optionsData: any = [];
  secondaryOptionsData: any = [];
  constructor(
    public dialogRef: MatDialogRef<AddExpenceAssigmentTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.addExpenceAssingment = this._fb.group({
      templateName: [null, Validators.required],
      effectiveFromDate: [null, Validators.required],
      primaryApprover: [data.primaryApprover],
      secondaryApprover: [data.secondaryApprover],
      employeeName: [data.employeeName],
      templateType: [data.templateType],
    });
    if ("" + data.reasonId === "undefined") {
      this.hideShowSaveButton = true;
      this.hideShowUpdateButton = false;
    } else {
      this.hideShowSaveButton = false;
      this.hideShowUpdateButton = true;
    }
    this.openApproverList = false;
    this.getAllExpenceTemplate();
    this.getEmployee();
    this.selectTemplate();
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
    console.log(this.optionsData);
  }
  selectTemplate() {
    this.openApproverList = true;
    this.expenceTemplate.forEach(expence => {
      if (expence.expenseTemplateName == this.addExpenceAssingment.controls.templateName.value) {
        console.log(expence);
        if (expence.expenseApprovalType == 'TEMPLATEWISE') {
          this.primaryApprover = expence.expensePrimaryApprover;
          this.secondaryApprover = expence.expenseSecondaryApprover;
          this.employee.forEach(emp => {
            if (expence.expensePrimaryApprover == emp.value) {
              this.addExpenceAssingment.controls.primaryApprover.setValue(emp.viewValue);
            }
            if (expence.expenseSecondaryApprover == emp.value) {
              this.addExpenceAssingment.controls.secondaryApprover.setValue(emp.viewValue);
            }
          });

        }
        if (expence.expenseApprovalType == 'EMPLOYEEWISE') {
          this.addExpenceAssingment.controls.templateType.setValue(expence.expenseApprovalType);
          this.addExpenceAssingment.controls.primaryApprover.setValue(null);

          this.addExpenceAssingment.controls.secondaryApprover.setValue(null);

        }
        if (expence.expenseApprovalLevel === 'FIRST_LEVEL') {
          this.openPrimaryDiv = false;
          this.openSecondaryDiv = false;
          this.openPrimaryDiv = true;
          this.openSecondaryDiv = false;
          this.addExpenceAssingment.controls.templateType.setValue(expence.expenseApprovalType);
          this.addExpenceAssingment.controls.primaryApprover.setValidators([Validators.required]);
          this.addExpenceAssingment.controls.secondaryApprover.clearValidators();
        }
        else if (expence.expenseApprovalLevel === 'SECOND_LEVEL') {
          this.openPrimaryDiv = false;
          this.openSecondaryDiv = false;
          this.openPrimaryDiv = true;
          this.openSecondaryDiv = true;
          this.addExpenceAssingment.controls.templateType.setValue(expence.expenseApprovalType);
          this.addExpenceAssingment.controls.primaryApprover.setValidators([Validators.required]);

          this.addExpenceAssingment.controls.secondaryApprover.setValidators([Validators.required]);
        }
      }
    });

    this.addExpenceAssingment.controls.primaryApprover.updateValueAndValidity();

    this.addExpenceAssingment.controls.secondaryApprover.updateValueAndValidity();
  }
  assignTemplate() {
    if (this.addExpenceAssingment.valid) {
      var empCode = this.addExpenceAssingment.controls.employeeName.value;
      var arr = [];
      arr = empCode.split('-');
      const body = {
        "empCodeList": [
          arr[1]
        ],
        "employeeName": this.addExpenceAssingment.controls.employeeName.value,
        "primaryApprover": "" + this.addExpenceAssingment.controls.primaryApprover.value,
        "secondaryApprover": "" + this.addExpenceAssingment.controls.secondaryApprover.value,
        "templateName": this.addExpenceAssingment.controls.templateName.value,
        "templateType": this.addExpenceAssingment.controls.templateType.value,
        "effectiveFrom": this.addExpenceAssingment.controls.effectiveFromDate.value
      };
      this.serviceApi.post('/v1/expense/settings/expenseassignments/', body)
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
      Object.keys(this.addExpenceAssingment.controls).forEach(field => { // {1}
        const control = this.addExpenceAssingment.get(field);            // {2}
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
  getAllExpenceTemplate() {
    this.expenceTemplate = [];
    this.serviceApi.get('/v1/expense/settings/expenseTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            this.expenceTemplate.push(
              {
                "expenseTemplateId": element.expenseTemplateId,
                "expenseTemplateName": element.expenseTemplateName,
                "expenseApprovalLevel": element.expenseApprovalLevel,
                "expenseApprovalType": element.expenseApprovalType,
                "expensePrimaryApprover": element.expensePrimaryApprover,
                "expenseSecondaryApprover": element.expenseSecondaryApprover,
                "coveredEmployee": element.coveredEmployee
              });
          });
        },
        () => {
          console.log('No Company Policy Exist');
        });
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
  getStatus() { }

  // searchEmployeeName(data: any) {
  //   console.log('my method called' + data);
  //   this.optionsData = this.options.filter(option =>
  //     option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  // }
  ngOnInit() {

  }

  saveBankInformation() {
    console.log("valueee====" + this.addExpenceAssingment.value);
    // console.log('Data Send For Save Bank Information :::: ' + value);
    // return this.http.post('http://192.168.1.209:8980/admin/organization/orgBankInfo',' saveBankData')
    //  
    //   .subscribe(
    //   res => {
    //     console.log('Bank data saved successfully');
    //     location.reload();
    //   },
    //   err => {
    //     console.log('there is something error');
    //   }
    //   );
  }

  updateGenralSetting() {
    console.log("code here to update general setting")
  }
}

@Component({
  templateUrl: 'edit-expence-template-assignment-dialog.html',
  styleUrls: ['./delete-expence-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditExpenceAssigmentTemplate implements OnInit {
  hideShowSaveButton = true;
  hideShowUpdateButton = false;
  templateName: any;
  employee = [];
  expenceTemplate = [];
  primApprover: any;
  secApprover: any;
  message: any;
  status: any;
  error: any;
  action: any;
  myControl = new FormControl();
  selectedEmployee = new FormControl();
  bankList = [];
  hideShowfrequencyRestriction: any
  public addExpenceAssingment: FormGroup;
  hideShowDivForSpecificEemployee: any;
  options = [
    { value: 'zeeshan-1115', viewValue: 'zeeshan-1115' },
    { value: 'Anuj-1116', viewValue: 'Anuj-1116' },
    { value: 'Ajay-1117', viewValue: 'Ajay-1117' },
    { value: 'Dheeraj-1118', viewValue: 'Dheeraj-1118' }
  ];
  optionsData = this.options;
  constructor(
    public dialogRef: MatDialogRef<EditExpenceAssigmentTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.getEmployee();
    this.templateName = this.data.element.templateName;
    this.data.element.templateType;
    var arr = [];
    this.primApprover = null;
    this.secApprover = null;
    if (this.data.primaryApprover != null) {
      arr = this.data.primaryApprover.split('-');
      this.primApprover = arr[1];
    }
    if (this.data.secondaryApprover != null) {
      arr = this.data.secondaryApprover.split('-');
      this.secApprover = arr[1];
    }
    this.addExpenceAssingment = this._fb.group({
      selectedTemaplate: [this.data.element.templateName],
      templateType: [this.data.element.templateType],
      primaryApprover: [this.primApprover],
      secondaryApprover: [this.secApprover],
      effectiveFrom: [this.data.element.effectiveFrom],
      templateId: [this.data.templateId]

    });
    if ("" + data.reasonId === "undefined") {
      this.hideShowSaveButton = true;
      this.hideShowUpdateButton = false;

    }
    else {
      this.hideShowSaveButton = false;
      this.hideShowUpdateButton = true;
    }
  }
  updateAssignment() {
    const body = {
      "primaryApprover": this.addExpenceAssingment.controls.primaryApprover.value,
      "secondaryApprover": this.addExpenceAssingment.controls.secondaryApprover.value,
      "effectiveFrom": this.addExpenceAssingment.controls.effectiveFrom.value
    };
    this.serviceApi.put('/v1/expense/settings/expenseassignments/' + this.addExpenceAssingment.controls.templateId.value, body)
      .subscribe(
        res => {
          console.log('Applied Leave Successfully...' + JSON.stringify(res));
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
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
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
          console.log('Enter into Else Bloack');
        });
  }
  getAllExpenceTemplate() {
    this.expenceTemplate = [];
    this.serviceApi.get('/v1/expense/settings/expenseTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            this.expenceTemplate.push(
              {
                "expenseTemplateId": element.expenseTemplateId,
                "expenseTemplateName": element.expenseTemplateName,
                "expenseApprovalLevel": element.expenseApprovalLevel,
                "expenseApprovalType": element.expenseApprovalType,
                "expensePrimaryApprover": element.expensePrimaryApprover,
                "expenseSecondaryApprover": element.expenseSecondaryApprover,
                "coveredEmployee": element.coveredEmployee
              });
          });
        },
        () => {
          console.log('No Company Policy Exist');
        });
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
  getStatus() { }

  searchEmployeeName(data: any) {
    console.log('my method called' + data);
    this.optionsData = this.options.filter(option =>
      option.value.toLowerCase().indexOf(this.myControl.value.toLowerCase()) === 0);
  }

  ngOnInit() { }

  saveBankInformation() {
    console.log("valueee====" + this.addExpenceAssingment.value);
  }
}


@Component({
  templateUrl: 'Bulk-Assign-Expense-Templates.html',
  styleUrls: ['./delete-expence-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class BulkAssignExpenceTemplate implements OnInit {
  hideShowSaveButton = true;
  hideShowUpdateButton = false;
  myControl = new FormControl();
  selectedEmployee = new FormControl();
  expenceTemplate = [];
  checkedRowData = [];
  message: any;
  status: any;
  error: any;
  action: any;
  public addExpenceAssingment: FormGroup;
  hideShowDivForSpecificEemployee: any
  templateType: any;
  empSelected: any;
  constructor(
    public dialogRef: MatDialogRef<BulkAssignExpenceTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.checkedRowData = this.data.checkedRowData;
    console.log('Checking this value' + this.empSelected);
    this.addExpenceAssingment = this._fb.group({
      selectedEmployee: [],
      templateName: [null, Validators.required],
      templateType: [],
      primaryApprover: [],
      secondaryApprover: []
    });
    this.getAllExpenceTemplate();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() { }

  selectTemplate() {
    this.addExpenceAssingment.controls.selectedEmployee.setValue(this.checkedRowData);
    this.expenceTemplate.forEach(expence => {
      if (expence.expenseTemplateName == this.addExpenceAssingment.controls.templateName.value) {

        console.log(expence);
        this.addExpenceAssingment.controls.templateType.setValue(expence.expenseApprovalType);
        this.addExpenceAssingment.controls.secondaryApprover.setValue(expence.expenseSecondaryApprover);
        this.addExpenceAssingment.controls.primaryApprover.setValue(expence.expensePrimaryApprover);
      }
    });
  }

  bulkAssign() {
    if (this.addExpenceAssingment.valid) {
      const body = {
        "empCodeList": this.addExpenceAssingment.controls.selectedEmployee.value,
        "primaryApprover": "" + this.addExpenceAssingment.controls.primaryApprover.value,
        "secondaryApprover": "" + this.addExpenceAssingment.controls.secondaryApprover.value,
        "templateName": this.addExpenceAssingment.controls.templateName.value,
        "templateType": this.addExpenceAssingment.controls.templateType.value
      };
      console.log('body=======' + this.addExpenceAssingment.controls.primaryApprover.value);
      console.log(JSON.stringify(body));
      this.serviceApi.post('/v1/expense/settings/expenseassignments/', body)
        .subscribe(
          res => {
            console.log('Bulk Assigned Template Successfully...' + JSON.stringify(res));
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
    else {
      Object.keys(this.addExpenceAssingment.controls).forEach(field => { // {1}
        const control = this.addExpenceAssingment.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


  getAllExpenceTemplate() {

    this.expenceTemplate = [];
    this.serviceApi.get('/v1/expense/settings/expenseTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            this.expenceTemplate.push(
              {
                "expenseTemplateId": element.expenseTemplateId,
                "expenseTemplateName": element.expenseTemplateName,
                "expenseApprovalLevel": element.expenseApprovalLevel,
                "expenseApprovalType": element.expenseApprovalType,
                "expensePrimaryApprover": element.expensePrimaryApprover,
                "expenseSecondaryApprover": element.expenseSecondaryApprover,
                "coveredEmployee": element.coveredEmployee
              });
          });
        },
        () => {
          console.log('No Company Policy Exist');
        });


  }



}


import { Observable } from 'rxjs/Observable';
@Component({
  templateUrl: 'assign-supervisor-dialog.html',
  styleUrls: ['./delete-expence-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AssignSupervisorDialog implements OnInit {

  bankList = [];
  message: any;
  status: any;
  error: any;
  action: any;
  hideShowfrequencyRestriction: any;
  public addExpenceAssingment: FormGroup;
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
  constructor(public dialogRef: MatDialogRef<AssignSupervisorDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.addExpenceAssingment = this._fb.group({
      primaryApprover: [null, Validators.required],
      secondaryApprover: [],
      empCodeList: [this.data.checkedRowData]
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
    if (this.addExpenceAssingment.valid) {
      const body = {
        "primaryApprover": "" + this.addExpenceAssingment.controls.primaryApprover.value,
        "secondaryApprover": "" + this.addExpenceAssingment.controls.secondaryApprover.value,
        "empCodeList": this.checkedRowData
      };
      this.serviceApi.post('/v1/expense/settings/expenseassignments/', body)
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
      Object.keys(this.addExpenceAssingment.controls).forEach(field => { // {1}
        const control = this.addExpenceAssingment.get(field);            // {2}
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



@Component({
  templateUrl: 'upload-tempate-assigment-dialog.html',
  styleUrls: ['./delete-expence-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class UploadTemplateAssignmentDialog implements OnInit {
  hideShowSaveButton = true;
  hideShowUpdateButton = false;
  myControl = new FormControl();
  selectedEmployee = new FormControl();
  options = [
    { value: 'zeeshan-1115', viewValue: 'zeeshan-1115' },
    { value: 'Anuj-1116', viewValue: 'Anuj-1116' },
    { value: 'Ajay-1117', viewValue: 'Ajay-1117' },
    { value: 'Dheeraj-1118', viewValue: 'Dheeraj-1118' }
  ];

  optionsData = this.options;
  bankList = [];
  hideShowfrequencyRestriction: any
  public AddExpenceAssingment: FormGroup;
  hideShowDivForSpecificEemployee: any
  constructor(
    public dialogRef: MatDialogRef<UploadTemplateAssignmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder) {
    this.AddExpenceAssingment = this._fb.group({
      myControl: [],
      selectedEmployee: [],
    });
  }

  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}



@Component({
  templateUrl: 'upload-supervisor-diolog.html',
  styleUrls: ['./delete-expence-template-assigment-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class UploadSupervisorDialog implements OnInit {
  hideShowSaveButton = true;
  hideShowUpdateButton = false;
  myControl = new FormControl();
  selectedEmployee = new FormControl();
  options = [
    { value: 'zeeshan-1115', viewValue: 'zeeshan-1115' },
    { value: 'Anuj-1116', viewValue: 'Anuj-1116' },
    { value: 'Ajay-1117', viewValue: 'Ajay-1117' },
    { value: 'Dheeraj-1118', viewValue: 'Dheeraj-1118' }
  ];

  optionsData = this.options;
  bankList = [];
  hideShowfrequencyRestriction: any
  public AddExpenceAssingment: FormGroup;
  hideShowDivForSpecificEemployee: any
  constructor(
    public dialogRef: MatDialogRef<UploadSupervisorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder) {


    this.AddExpenceAssingment = this._fb.group({

      myControl: [],

      selectedEmployee: [],


    });



  }






  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {

  }






}



import { Http } from '@angular/http';
import { DataTable, SelectItem } from 'primeng/primeng';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-history-of-employee-expense-assignments-dialog',
  templateUrl: './history-of-employee-expense-assignments-dialog.html',
  styleUrls: ['./history-of-employee-expense-assignments-dialog.scss']
})
export class HistoryOfEmployeeExpenseAssignmentsDialog {



  rocordid: any;

  ExpencePolicyName: any
  EffectiveFrom: any
  EffectiveTo: any

  displayedColumns = ['ExpencePolicyName', 'EffectiveFrom', 'EffectiveTo'];
  dataSource: MatTableDataSource<HistoryOfEmployeeExpenseAssignmentsDialogData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    public dialogRef: MatDialogRef<HistoryOfEmployeeExpenseAssignmentsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private http: Http) {


    this.getAllAttendeceSettingData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getAllAttendeceSettingData() {
    attendanceSetting = [];
    this.http.get('assets/data/expenses/historyofEmployeeExpenceAssigment.json').map(res => res.json()).
      subscribe(
        res => {
          res.forEach(element => {
            attendanceSetting.push(
              {
                rocordid: element.rocordid,
                ExpencePolicyName: element.ExpencePolicyName,
                EffectiveFrom: element.EffectiveFrom,
                EffectiveTo: element.EffectiveTo,
              });
          });
          this.dataSource = new MatTableDataSource(attendanceSetting);
        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );
  }
}

export interface HistoryOfEmployeeExpenseAssignmentsDialogData {
  rocordid: Number,
  ExpencePolicyName: String,
  EffectiveFrom: String,
  EffectiveTo: String,
}
let attendanceSetting: HistoryOfEmployeeExpenseAssignmentsDialogData[] = [];

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
    this.serviceApi.get('/v1/expense/settings/expenseassignments/bulk/download/format').subscribe(res => {
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
    const url = '/v1/expense/settings/expenseassignments/bulk/upload';

    this.serviceApi.postWithFormData(url, formdata).subscribe(res => {
      this.action = 'Response';
      this.message = 'Template Assignment uploaded successfuly';
      this.close();
      const dialogRef = this.dialog.open(ExpenseBulkUploadResponseComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { res: res, title: 'Expense Template Assignment' }
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
export class ExpenseBulkUploadResponseComponent implements OnInit {

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
    public dialogRef: MatDialogRef<ExpenseBulkUploadResponseComponent>,
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


