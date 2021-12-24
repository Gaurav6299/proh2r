import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-group-report-list',
  templateUrl: './group-report-list.component.html',
  styleUrls: ['./group-report-list.component.scss']
})
export class GroupReportListComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  isChecked: boolean = false;
  isLeftVisible
  notificationMsg: String;
  groupReportList = [];
  // displayedColumns = ['groupId', 'groupName', 'actions'];
  columns = [
    { field: 'groupId', header: 'Group Id' },
    { field: 'groupName', header: 'Group Name' },
    { field: 'actions', header: 'Actions' }
  ]
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  allSelections: any[];
  reports: any[];
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) { }
  ngOnInit() {
    this.getAllReports();
    this.getReports();
    this.getAllSelections();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  assignReports(group: any) {
    console.log(group);
    const dialogRef = this.dialog.open(AssignGroupComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', reports: this.reports, selectedGroup: group, proh2rReports: group.proh2rReports, title: "Assign Reports" }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== undefined) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllReports();
        }
      }
    });

  }
  toggleCustomReportAccess(group) {

    const body = {}
    this.serviceApi.put('/v1/' + group.groupId + '/' + !group.customReportAccess, body).subscribe(res => {
      console.log(res);
      this.successNotification(res.message)
    },
      (err) => {
        console.log(err);
      },
      () => {
        this.getAllReports();
      })
  }
  getAllSelections() {
    this.allSelections = [];
    this.serviceApi.get('/v1/userAssignment/selectionList').subscribe(
      res => {
        res.forEach(element => {
          this.allSelections.push(element);
        });
      }, (err) => {

      }, () => {
        this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
          res => {
            res.forEach(element => {
              console.log(element);
              this.allSelections.push({
                value: element.empCode,
                viewValue: element.empFirstName + ' ' + element.empLastName,
                type: "All Employees"
              });
            });
          }, (err) => {

          }, () => {

          });
      });
  }


  assignUsers(group: any) {
    console.log(group);
    var action;
    if (group.userAssignments.length == 0) {
      action = 'add';
    } else {
      action = 'update';
    }
    const dialogRef = this.dialog.open(AssignUserComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: action, allSelections: this.allSelections, group: group, userAssignments: group.userAssignments }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed....................' + result.message);
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message !== undefined) {
          this.notificationMsg = result.message;
          this.successNotification(this.notificationMsg);
          this.getAllReports();
        }
      }
    });
  }



  getReports() {
    this.reports = [];
    this.serviceApi.get('/v1/reports/get/reports/selection/list').subscribe(
      res => {
        this.reports = res;
      }, (err) => {

      }, () => {

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


  getAllReports(): any {
    this.groupReportList = [];
    this.serviceApi.get('/v1/groups/getAll').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log(element);
            this.groupReportList.push({
              "groupId": element.groupId,
              "groupName": element.groupName,
              "proh2rReports": element.proh2rReports,
              "userAssignments": element.userAssignments,
              "customReportAccess": element.customReportAccess
            });
          });
        } else {

        }
      },
      err => {

      },
      () => {
        this.dt.reset();
        console.log(this.groupReportList);
      });
  }

  openAddReportsDialog() {
    const dialogRef = this.dialog.open(AddReportsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', groupInfo: undefined, title: "Add Group" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllReports();
        }
      }
    });
  }
  openUpdateReportsDialog(data: any) {
    console.log('Label Info-----' + data.groupId);
    const dialogRef = this.dialog.open(AddReportsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', groupInfo: data, title: "Update Group" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllReports();
        }
      }
    });
  }

  openDeleteReportsDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteGroupReportListComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { groupInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getAllReports();
        }
      }
    });
  }

}

@Component({
  templateUrl: 'add-report.component.html',
})
export class AddReportsComponent implements OnInit {
  action: string;
  message: any;
  error: any;
  title: any;
  reportForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddReportsComponent>, private serviceApi: ApiCommonService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = this.data.title;
    this.action = data.action;
    this.reportForm = this.fb.group({
      groupId: ['0'],
      groupName: ['', Validators.required]
    });
    if (this.data.action === 'update') {
      this.reportForm.controls.groupId.setValue(this.data.groupInfo.groupId);
      this.reportForm.controls.groupName.setValue(this.data.groupInfo.groupName);
    }
  }

  createGroupReport() {
    const body = {
      "groupName": this.reportForm.controls.groupName.value
    }
    if (this.reportForm.valid) {
      return this.serviceApi.post('/v1/groups/save', body).
        subscribe(
          res => {
            console.log('Report Delete Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          }, err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });
    } else {
      Object.keys(this.reportForm.controls).forEach(field => {
        const control = this.reportForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  updateGroupReport() {
    const body = {
      "groupName": this.reportForm.controls.groupName.value
    }
    if (this.reportForm.valid) {
      this.serviceApi.put("/v1/groups/update/" + this.reportForm.controls.groupId.value, body).
        subscribe(
          res => {
            console.log('Report Delete Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          }, err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.message;
            this.close();
          });

    } else {
      Object.keys(this.reportForm.controls).forEach(field => {
        const control = this.reportForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
  ngOnInit() {

  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'delete.group-report-list.component.html',
})
export class DeleteGroupReportListComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  constructor(public dialogRef: MatDialogRef<DeleteGroupReportListComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    const val = this.data.groupInfo.groupId;
    this.serviceApi.delete('/v1/groups/delete/' + val)
      .subscribe(
        res => {
          console.log('Report Delete Successfully...' + JSON.stringify(res));
          this.message = res.message;
          this.close();
        }, err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        });
  }
  ngOnInit() { }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
}


@Component({
  templateUrl: 'assign-group.component.html',
})
export class AssignGroupComponent implements OnInit {
  assignGroupForm: FormGroup;
  action: String;
  message: any;
  title: any;
  group = [];
  reports = [];
  reportsCopy = [];
  selectedReportsList = new FormControl();
  seletedReportCode = [];
  error: any;
  selectedReports = [];
  selectedGroup = [];
  constructor(public dialogRef: MatDialogRef<AssignGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.action = data.action;
    this.reports = data.reports;
    this.group = data.group;
    this.selectedGroup.push(data.selectedGroup);
    console.log(data);
    this.title = this.data.title;
    this.reportsCopy = this.reports;
    if (data.proh2rReports === null) {
      this.action = "add";
      this.assignGroupForm = this._fb.group({
        group: ['', Validators.required]
      });
    } else if (data.proh2rReports != null) {
      this.action == "update";
      this.assignGroupForm = this._fb.group({
        group: [data.selectedGroupId, Validators.required]
      });
      data.proh2rReports.forEach(reports => {
        console.log(reports.value);
        this.selectedReports.push(reports.value);
      });
      this.selectedReportsList.setValue(this.selectedReports);
    }
    this.assignGroupForm.controls.group.setValue(data.selectedGroup.groupId);

  }


  ngOnInit() {
    this.selectedReportsList.setValidators([Validators.required]);
  }

  onClickEvent() {
    console.log('::: Enter in the Reset function for Filter :::');
    this.reports = this.reportsCopy;
    console.log('::: Exit After call All get Employee :::');
  }


  assigUser() {
    if (this.assignGroupForm.valid) {
      const body = {
        "groupId": this.assignGroupForm.controls.group.value,
        "reportId": this.selectedReportsList.value
      }
      console.log(JSON.stringify(body));
      this.serviceApi.post('/v1/group/report/assignment', body).subscribe(res => {
        console.log('Report Delete Successfully...' + JSON.stringify(res));
        this.message = res.message;
        this.close();
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      })
    }
    else {
      Object.keys(this.assignGroupForm.controls).forEach(field => {
        const control = this.assignGroupForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })

    }
  }

  updateAssignment() {
    if (this.assignGroupForm.valid) {
      const body = {
        "groupId": this.assignGroupForm.controls.group.value,
        "reportId": this.selectedReportsList.value
      }
      console.log(JSON.stringify(body));
      this.serviceApi.put('/v1/group/report/update/assignment', body).subscribe(res => {
        this.message = res.message;
        this.close();
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      })
    }
    else {
      Object.keys(this.assignGroupForm.controls).forEach(field => {
        const control = this.assignGroupForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })

    }

  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}



@Component({
  templateUrl: 'assign-user.component.html',
})
export class AssignUserComponent implements OnInit {
  public assignUserForm: FormGroup;
  action: String;
  message: any;
  group = [];
  allSelections = [];
  mySelectedUserList = [];
  selectedUserList = new FormControl();
  deptIds = [];
  bandIds = [];
  empCodes = [];
  error: any;
  userAssignments = [];
  constructor(public dialogRef: MatDialogRef<AssignUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.action = data.action;
    this.userAssignments = data.userAssignments;
    this.group.push(data.group);
    this.allSelections = data.allSelections;
    console.log(data);
    if (data.action === 'add') {
      this.assignUserForm = this._fb.group({
        group: ['', Validators.required]
      });
      this.selectedUserList.setValue(this.mySelectedUserList);
    }
    if (data.action === 'update') {
      this.assignUserForm = this._fb.group({
        group: ['', Validators.required]
      });
      data.userAssignments.forEach(reports => {
        console.log(reports);
        this.mySelectedUserList.push(reports);
      });
      this.selectedUserList.setValue(this.mySelectedUserList);
    }
    this.assignUserForm.controls.group.setValue(data.group.groupId);
  }
  ngOnInit() {
    this.selectedUserList.setValidators([Validators.required]);
  }

  assigUser() {
    this.bandIds = [];
    this.deptIds = [];
    this.empCodes = [];
    console.log(this.assignUserForm.value);
    console.log(this.selectedUserList.value);
    if (this.assignUserForm.valid) {
      this.selectedUserList.value.forEach(element => {
        if (element.type === 'All Departments') {
          this.deptIds.push(element.value);
        } else if (element.type === 'All Bands') {
          this.bandIds.push(element.value);
        } else {
          this.empCodes.push(element.value);
        }
      });
      const body = {
        "deptIds": this.deptIds,
        "bandIds": this.bandIds,
        "employeeCodes": this.empCodes
      }
      console.log(JSON.stringify(body));
      this.serviceApi.post('/v1/userAssignment/' + this.assignUserForm.controls.group.value, body).subscribe(res => {
        this.message = res.message;
        this.close();
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      }, () => {

      })
    }
    else {
      Object.keys(this.assignUserForm.controls).forEach(field => {
        const control = this.assignUserForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })

    }
  }

  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}