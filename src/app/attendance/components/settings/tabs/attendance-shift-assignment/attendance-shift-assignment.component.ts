import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTable } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';
import { Http } from '@angular/http';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { environment } from '../../../../../../environments/environment';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { Console } from '@angular/core/src/console';
import { MatTab } from '@angular/material/tabs/typings/tab';
import { DataTable } from 'primeng/primeng';
declare var $: any;


@Component({
  selector: 'app-attendance-shift-assignment',
  templateUrl: './attendance-shift-assignment.component.html',
  styleUrls: ['./attendance-shift-assignment.component.scss']
})
export class AttendanceShiftAssignmentComponent implements OnInit {
  assignShiftName: any;
  baseUrl = environment.baseUrl;
  displayedColumns = [
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'currentShift', header: 'Current Shift' },
    { field: 'effectiveFrom', header: 'Effective From' },
    { field: 'action', header: 'Action' }
  ]

  @ViewChild("dt1") dt: DataTable;
  selection = new SelectionModel<Element>(true, []);
  addShiftAssignmentData = [];
  // checkedRowData = [];
  selectedRows = [];
  // tempCheckedRowData = [];
  loginEmpCode: any;
  empAttdShiftAssignment: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  checkedRowData = [];
  allBand = [];
  notificationMsg: any;
  action: any;
  empSelected: boolean = false;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private http: Http, private serviceApi: ApiCommonService) {
    this.loginEmpCode = KeycloakService.getUsername();
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
    this.getShiftAssignmentTableData();
    this.empAttdShiftAssignment = this.fb.group({
      assignShiftTemplate: [],
      leavePolicy: [],
      supervisorsName: [],
      worklocation: [],
      selectedMonth: [],
      employeeStatus: [],
      costCenter: [],
      SearchFilter: []
    });
  }

  // getRowMultipleData(element: any, event: any) {
  //   console.log(event);
  //   if (event) {
  //     this.checkedRowData = [];
  //     this.empSelected = true;
  //     console.log('Enter in Select Multiple Records');
  //     element.forEach(element1 => {
  //       this.checkedRowData.push(
  //         element1.empCode
  //       );
  //     });
  //     console.log(JSON.stringify(this.checkedRowData));
  //   } else {
  //     console.log('Enter in un Select Multiple Records');
  //     this.checkedRowData = [];
  //     console.log(JSON.stringify(this.checkedRowData));
  //   }

  // }

  selectedActionValue(data: any) {
    var checkedRowData = [];
    this.selectedRows.forEach(
      row => {
        var empCode = row.empCode;
        checkedRowData.push(
          empCode
        );
      });
    if (data === 'shiftAssignment') {
      if (this.selectedRows.length == 0) {
        this.warningNotification('Selecte an employee first');
      } else {

        console.log('Inside Dialog leave');
        const dialogRef = this.dialog.open(AddShiftAssignmentsComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: checkedRowData,
            selected: this.empSelected,

          }
        });
        dialogRef.afterClosed().subscribe(result => {

          console.log('The dialog was closed');
          if (result !== undefined) {
            console.log('Result Found ::: ' + JSON.stringify(result));
            if (result.message) {
              if (result.status === 'Response') {
                this.notificationMsg = result.message;
                this.successNotification(this.notificationMsg);

                this.getShiftAssignmentTableData();
              } else if (result.status === 'Error') {
                this.notificationMsg = result.message;
                // this.warningNotification(this.notificationMsg);
              }
            }

            this.selectedRows = [];
          }
          this.selection.clear();
          this.empSelected = false;
          this.empAttdShiftAssignment.controls.assignShiftTemplate.setValue(null);
        });
      }


    } else if (data === 'deleteShift') {
      if (this.selectedRows.length == 0) {
        this.selectedRows = [];
        this.selection.clear();
        this.warningNotification('Select an employee first');
      } else {
        console.log('Inside Dialog Delete Bulk Shift ');
        const dialogRef = this.dialog.open(AssignShiftDeleteComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            checkedRowData: checkedRowData,
            selected: this.empSelected
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
            if (result.status === 'Response') {
              console.log('The dialog was closed');
              this.selection.clear();
              this.empSelected = false;
              this.selectedRows = [];
              this.empAttdShiftAssignment.controls.assignShiftTemplate.setValue(null);
              console.log(result);
              this.getShiftAssignmentTableData();
            }
            else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        });
      }
    } if (data === 'uploadShiftAssignment') {
      console.log('Inside Dialog leave');
      const dialogRef = this.dialog.open(ShiftAssignUploadDialogComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        // data: { checkedRowData: this.checkedRowData }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.selection.clear();
        this.selectedRows = [];
        this.empAttdShiftAssignment.controls.assignShiftTemplate.setValue(null);
        this.getShiftAssignmentTableData();
      });

    }
  }
  // getRowData(element: any, event: any) {

  //   if (event.checked) {
  //     console.log('if');
  //     this.checkedRowData.push(
  //       element.empCode
  //     );
  //     this.empSelected = true;

  //   } else {

  //     for (let i = 0; i < this.checkedRowData.length; i++) {
  //       if (this.checkedRowData[i] === element.empCode) {
  //         this.checkedRowData.splice(i, 1);
  //       } else {
  //         console.log('Not Matched');
  //       }
  //       if (this.checkedRowData.length < 1) {
  //         this.empSelected = false;
  //       }
  //     }
  //   }
  // }


  clearFilter() {
    this.empAttdShiftAssignment.controls.SearchFilter.reset();
  }

  getShiftAssignmentTableData() {
    this.selectedRows = [];
    this.selectedRows = [];
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    this.addShiftAssignmentData = [];
    this.serviceApi.get2('/v1/attendance/settings/shift/assignment/' + this.loginEmpCode + '/admin').subscribe(
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
            let a: any;
            console.log(element.attendanceShiftAssigned);
            if (element.attendanceShiftAssigned === null) {
              a = null;
            } else if (element.attendanceShiftAssigned != null) {
              a = element.attendanceShiftAssigned.shiftName;
            }
            this.addShiftAssignmentData.push({
              shiftAssignRecordId: element.shiftAssignRecordId,
              attendanceShiftAssigned: element.attendanceShiftAssigned,
              employeeName: element.employeeName,
              empCode: element.empCode,
              effectiveFrom: element.effectiveFrom,
              templateAssign: element.templateAssign,
              currentShift: a,
              shiftTemplateId: element.shiftTemplateId,
              location: element.location,
              band: element.band,
              department: element.department,
              designation: element.designation
            });
          });
        } else {
          console.log('data doesnot exists');
        }
      }, err => {
      }, () => {
        this.dt.reset();
      });
  }

  addShiftAssignment(data: any) {
      this.action = '';
      this.notificationMsg = '';
      const dialogRef = this.dialog.open(AddShiftAssignmentsComponent, {
        // width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          checkedRowData: [data.empCode],
          shiftRecordId: data.shiftRecordId,
          employeeName: data.employeeName,
          empCode: data.empCode,
          selected: true
        },

      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          console.log('Result Found ::: ' + JSON.stringify(result));
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getShiftAssignmentTableData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
        this.empSelected = false;
      });
    
  }


  editShiftAssignment(element: any) {
      // const fromDate = element.effectiveFrom + ':00.000Z';
      const fromDate = element.effectiveFrom;
      const dialogRef = this.dialog.open(AddShiftAssignmentsComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          shiftAssignRecordId: element.shiftAssignRecordId,
          message: this.notificationMsg,
          status: this.action,
          checkedRowData: [element.empCode],
          shiftRecordId: element.shiftRecordId,
          employeeName: element.employeeName,
          empCode: element.empCode,
          addShiftTemplate: element.attendanceShiftAssigned.shiftRecordId,
          shiftEffectiveFrom: fromDate,
          attendanceShiftAssigned: element.shiftTemplateId,
          templateAssign: element.templateAssign
        }
      });
      dialogRef.afterClosed().subscribe(result => {

        console.log('The dialog was closed');
        if (result !== undefined) {
          console.log('Result Found ::: ' + JSON.stringify(result));
          if (result.message) {
            if (result.status === 'Response') {
              this.notificationMsg = result.message;
              this.successNotification(this.notificationMsg);

              this.getShiftAssignmentTableData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }
          }
        }
      });
  }

  deleteAssignedShift(data: any) {
      console.log('Employee On Delete-->' + data);
      this.action = '';
      this.notificationMsg = '';
      const dialogRef = this.dialog.open(AssignShiftDeleteComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          message: this.notificationMsg,
          status: this.action,
          checkedRowData: data.empCode,
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

              this.getShiftAssignmentTableData();
            } else if (result.status === 'Error') {
              this.notificationMsg = result.message;
              // this.warningNotification(this.notificationMsg);
            }

          }
        }
      });
  
  }


  viewAssignShift(element: any) {
    const dialogRef = this.dialog.open(ShiftHistoryDialogComponent, {
      width: '500px',
      data: {
        shiftAssignRecordId: element.shiftAssignRecordId,
        employeeName: element.employeeName,
        empCode: element.empCode,
        addShiftTemplate: element.attendanceShiftAssigned.shiftName,
        shiftEffectiveFrom: element.effectiveFrom,
        attendanceShiftAssigned: element.shiftTemplateId,
        templateAssign: element.templateAssign
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getShiftAssignmentTableData();
    });

  }
  openDialogToBulkUploadTemplateAssigment() {
    const dialogRef = this.dialog.open(BulkUploadShiftAssignment, {
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
            this.successNotification(result.message);
            this.getShiftAssignmentTableData();
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });
  } 
}

@Component({
  templateUrl: './delete-shift-Assignment-Dialog.component.html',
  styleUrls: ['./dialog-model.component.scss']
})
export class AssignShiftDeleteComponent implements OnInit {
  baseUrl = environment.baseUrl;

  action: any;
  error: any;
  checkedRowDate = [];
  empSelected: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignShiftDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
    this.checkedRowDate = data.checkedRowData;
    this.empSelected = this.data.selected;
    console.log(this.checkedRowDate);
  }

  ngOnInit() {
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

  confirmDelete() {
    this.multipleDelete(this.checkedRowDate);
  }



  multipleDelete(val: any) {
    console.log('/v1/attendance/settings/shift/assignment/bulkDelete/' + val);
    this.serviceApi.delete('/v1/attendance/settings/shift/assignment/bulkDelete/' + val).subscribe(
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
  templateUrl: './add-shift-assignments-dialog.component.html',
  styleUrls: ['./dialog-model.component.scss']
})
export class AddShiftAssignmentsComponent implements OnInit {
  baseUrl = environment.baseUrl;

  checkedRowData = [];
  action: any;
  error: any;

  addShiftAssignmentForm: FormGroup;
  shiftTemplatesList = [];
  empSelected: any;
  check: boolean;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddShiftAssignmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
    this.empSelected = this.data.selected;
    this.checkedRowData = data.checkedRowData;
    console.log(data);
    console.log('building form for dialog now');
    this.addShiftAssignmentForm = this._fb.group({
      shiftAssignRecordId: [data.shiftAssignRecordId],
      employeeName: [data.employeeName],
      empCode: [this.checkedRowData],
      addShiftTemplate: [data.addShiftTemplate],
      shiftEffectiveFrom: [data.shiftEffectiveFrom],
      attendanceShiftAssigned: [data.attendanceShiftAssigned],
      templateAssign: [data.templateAssign]
    });
    console.log(this.addShiftAssignmentForm);
    this.getShiftTemplateRecord();

  }

  ngOnInit() {

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
  onNoClick(): void {
    this.dialogRef.close();
  }

  getShiftTemplateRecord() {
    this.serviceApi.get('/v1/attendance/settings/shift/').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.shiftTemplatesList.push(
              {
                value: element.shiftRecordId,
                viewValue: element.shiftName
              });
          });

        } else {
          console.log('There is no Any Record Of Shift Template');
        }
      });
  }

  saveShiftTemplateAssignment(element: any) {
    this.check = true;
    if (this.addShiftAssignmentForm.controls.addShiftTemplate.value && this.addShiftAssignmentForm.controls.shiftEffectiveFrom.value) {
      console.log('Enter to Save the Records ::: ' + this.addShiftAssignmentForm);
      console.log('>>>>>>' + JSON.stringify(this.addShiftAssignmentForm.value));
      this.check = false;
      const body = {
        'attendanceShiftAssigned': {
          'shiftRecordId': this.addShiftAssignmentForm.controls.addShiftTemplate.value
        },
        'effectiveFrom': this.addShiftAssignmentForm.controls.shiftEffectiveFrom.value,
        'empCode': 'string',
        'employeeName': 'string',
        'shiftAssignOnEmp': this.addShiftAssignmentForm.controls.empCode.value,
        'shiftAssignRecordId': 0,
        'templateAssign': true
      };

      console.log(JSON.stringify(body));

      this.serviceApi.post('/v1/attendance/settings/shift/assignment/', body).subscribe(
        res => {
          if (res != null) {
            console.log('Data Saved Successfully ....');
            console.log('Applied Leave Successfully...' + JSON.stringify(res));
            this.action = 'Response';
            this.error = res.message;
            this.close();
          } else {
            console.log('Data Not Saved...! Something gone Wrong');
          }
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
    }

  }

  close(): void {
    this.check = false;
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  UpdateShiftTemplateAssignment(element: any) {
    console.log('Enter in the Update Section');
  }

}


@Component({
  templateUrl: './shift-assigned-history-dialog.component.html',
  styleUrls: ['./dialog-model.component.scss']
})
export class ShiftHistoryDialogComponent implements OnInit {
  displayedColumns = ['shiftName', 'effectiveFrom', 'effectiveTo'];
  dataSource2: MatTableDataSource<ElementHistory>;
  constructor(public dialogRef: MatDialogRef<ShiftHistoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    this.dataSource2 = new MatTableDataSource<ElementHistory>(null);
    ELEMENT_DATA_HISTORY.push({
      shiftName: data.addShiftTemplate,
      effectiveFrom: data.shiftEffectiveFrom,
      effectiveTo: 'sdasd',
      empCode: data.empCode
    });
  }
  ngOnInit() {
    this.dataSource2 = new MatTableDataSource<ElementHistory>(ELEMENT_DATA_HISTORY);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}



@Component({
  templateUrl: './upload-bulk-Shift-assignment.component.html',
  styleUrls: ['./dialog-model.component.scss']
})
export class ShiftAssignUploadDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ShiftAssignUploadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) {
    console.log('.....' + JSON.stringify(data));
  }
  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface Element {
  shiftAssignRecordId: number;
  attendanceShiftAssigned: any;
  employeeName: string;
  empCode: string;
  effectiveFrom: string;
  currentShift: string;
  templateAssign: boolean;
}

export interface ElementHistory {
  shiftName: string;
  effectiveFrom: string;
  effectiveTo: string;
  empCode: string;
}

const ELEMENT_DATA: Element[] = [];
const ELEMENT_DATA_HISTORY: ElementHistory[] = [];

@Component({
  templateUrl: 'bulk-upload-shift-assignment-dialog.html',
})

export class BulkUploadShiftAssignment implements OnInit {
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
  constructor(public dialogRef: MatDialogRef<BulkUploadShiftAssignment>, private fb: FormBuilder, private serviceApi: ApiCommonService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadFormat() {
    this.serviceApi.get('/v1/attendance/settings/shift/download/bulk/assignment/format').subscribe(res => {
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
    const url = '/v1/attendance/settings/shift/bulk/upload/assignment';

    this.serviceApi.postWithFormData(url, formdata).subscribe(res => {
      this.action = 'Response';
      this.message = 'Shift Assignment uploaded successfuly';
      this.close();
      const dialogRef = this.dialog.open(ShiftBulkUploadResponseComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { res: res, title: 'Shift Assignment' }
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
export class ShiftBulkUploadResponseComponent implements OnInit {

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
    public dialogRef: MatDialogRef<ShiftBulkUploadResponseComponent>,
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
