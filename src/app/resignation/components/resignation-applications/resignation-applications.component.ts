import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSort } from '@angular/material';
import { ApiCommonService } from '../../../services/api-common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator'
import { DataTable } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-resignation-applications',
  templateUrl: './resignation-applications.component.html',
  styleUrls: ['./resignation-applications.component.scss']
})
export class ResignationApplicationsComponent implements OnInit {
  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible = false;
  resignationDetails: any = [];
  displayedColumns = [
    { field: 'empName', header: 'Employee Name' },
    { field: 'location', header: 'Location' },
    { field: 'band', header: 'Band' },
    { field: 'department', header: 'Department' },
    { field: 'designation', header: 'Designation' },
    { field: 'raisedOn', header: 'Raised On' },
    { field: 'l1Supervisor', header: 'L1 Manager' },
    { field: 'l2Supervisor', header: 'L2 Manager' },
    { field: 'hrmanagerSupervisor', header: 'HR Manager' },
    { field: 'resignationStatus', header: 'Status' },
    { field: 'action', header: 'Action' }
  ];
  allLocation = [];
  allDepartment = [];
  allDesignation = [];
  allBand = [];
  @ViewChild("dt1") dt: DataTable;
  // dataSource = new MatTableDataSource<Element>();
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  applicationList: any = [];
  empId: any;
  message: any;
  pendingCount: number = 0
  approvedCount: number = 0
  resignationStatus: "Revoked"
  resignationApplicationArrayComplete = []
  selectedSeparationRequest = null;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.getListOfApplications();
  }

  ngOnInit() {


  }

  back() {
    this.isLeftVisible = !this.isLeftVisible;
    this.setPanel();
  }

  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }

  // applyFilter(filterValue: string) {
  //   console.log('hello' + filterValue);
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }


  getListOfApplications() {
    this.applicationList = [];
    this.allBand = [];
    this.allDepartment = [];
    this.allDesignation = [];
    this.allLocation = [];
    this.resignationApplicationArrayComplete = []
    this.serviceApi.get('/v1/resignation/application/getAll').
      subscribe(
        res => {
          console.log("All Application Records-----" + JSON.stringify(res));
          res.forEach(element => {
            if (!this.allBand.some(band => band.label === element.seperationDetails.band)) {
              this.allBand.push({
                label: element.seperationDetails.band, value: element.seperationDetails.band
              });
            }
            if (!this.allDepartment.some(department => department.label === element.seperationDetails.department)) {
              this.allDepartment.push({
                label: element.seperationDetails.department, value: element.seperationDetails.department
              });
            }
            if (!this.allDesignation.some(designation => designation.label === element.seperationDetails.designation)) {
              this.allDesignation.push({
                label: element.seperationDetails.designation, value: element.seperationDetails.designation
              });
            }
            if (!this.allLocation.some(location => location.label === element.seperationDetails.location)) {
              this.allLocation.push({
                label: element.seperationDetails.location, value: element.seperationDetails.location
              });
            }
            console.log(element)
            console.log('element.....' + element);
            if (element.seperationDetails.resignationStatus === "Pending") {
              this.pendingCount++;
            } else if (element.seperationDetails.resignationStatus === "Approved") {
              this.approvedCount++;
            } else {
              this.resignationStatus;
            }
            this.resignationApplicationArrayComplete.push(element);
            this.applicationList.push({
              separationReqId: element.seperationDetails.separationReqId,
              separationTypeId: element.seperationDetails.separationTypeId,
              empCode: element.seperationDetails.empCode,
              empName: element.seperationDetails.empName,
              l1Supervisor: element.seperationDetails.l1Supervisor,
              l2Supervisor: element.seperationDetails.l2Supervisor,
              hrmanagerSupervisor: element.seperationDetails.hrmanagerSupervisor,
              raisedOn: element.seperationDetails.raisedOn,
              designation: element.seperationDetails.designation,
              comments: element.seperationDetails.comments,
              resignationStatus: element.seperationDetails.resignationStatus,
              location: element.seperationDetails.location,
              band: element.seperationDetails.band,
              department: element.seperationDetails.department,
              // designation: element.designation
            });
          });
        }, err => {

        }, () => {
          this.dt.reset();
          // console.log("Application List Data-----" + JSON.stringify(this.applicationList));
          // this.dataSource = new MatTableDataSource(this.applicationList);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        }
      );
  }

  viewResignationApplication(element: any) {
    this.selectedSeparationRequest = this.resignationApplicationArrayComplete.filter(item =>
      item.seperationDetails.separationReqId === element.separationReqId
    );
    this.isLeftVisible = !this.isLeftVisible;
    $('.divtoggleDiv')[1].style.display = 'block';
  }
  getClasses(status: any, type) {
    let classes
    if (type === 'icons') {
      classes = {
        'fa': true,
        'fa-exclamation': status === "Pending" || status === "Initiated",
        'fa-check': status === "Approved" || status === "Completed",
        // 'warning':status==="Pending",
        // 'timeline-ok': status==="Approved"
      };
    } else {
      classes = {
        'warning': status === "Pending" || status === "Initiated",
        'timeline-ok': status === "Approved" || status === "Completed",
        "timeline-badge": true
      };
    }

    return classes;
  }
  successNotification(successMessage: any) {
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


  openApproveRequestDialog(data: any) {
    const dialogRef = this.dialog.open(ApproveRequestComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { requestInfo: data, message: this.message }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          this.successNotification(result.message);
          this.getListOfApplications();
        }
      }

    });
  }
  onNoClick() {
    this.isLeftVisible = !this.isLeftVisible;
    this.setPanel();

  }
  openAddRequestDialog() {
    const dialogRef = this.dialog.open(AddSeparationRequestComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { message: this.message }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          this.successNotification(result.message);
          this.getListOfApplications();
        }
      }

    });
  }


}
export interface Element {
}



// --------------------------- Approve Separation request model start -------------------------
@Component({
  templateUrl: 'approve-request.component.html',
  styleUrls: ['./dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ApproveRequestComponent implements OnInit {

  message: any;
  requestInfo: any;
  constructor(public dialogRef: MatDialogRef<ApproveRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService,) {
    this.requestInfo = data.requestInfo;
  }
  //for approve separation request --------------------------------------
  approveRequest() {
    console.log('Inside  approveRequest data ---  Employee Code : ' + this.requestInfo.empCode + '------- Separation Id : ' + this.requestInfo.separationTypeId + '-------- Comment : ' + this.requestInfo.comments)
    const body = {
      "empCode": this.requestInfo.empCode,
      "comments": this.requestInfo.comments,
      "resignationId": this.requestInfo.separationReqId
    };
    this.serviceApi.post('/v1/resignation/application/admin/approval/' + this.requestInfo.separationTypeId, body).subscribe(
      res => {
        console.log('Initiate Successfully...' + JSON.stringify(res));
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {
      });
  }
  ngOnInit() { }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// --------------------------- Approve Separation request model end -------------------------
// ---------------- Add separation request model start ------------------------
@Component({
  templateUrl: 'separation-request.component.html',
})
export class AddSeparationRequestComponent implements OnInit {
  public addRequestForm: FormGroup;
  employeeList: any = [];
  separationTypeList: any = [];
  message: any;
  constructor(public dialogRef: MatDialogRef<AddSeparationRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private _fb: FormBuilder) {
    this.addRequestForm = this._fb.group({
      employeeName: [null, [
        Validators.required,
      ]],
      separationType: ['', [
        Validators.required,
      ]],
      comment: ['', [Validators.required,
      ]],
    });
  }
  ngOnInit() {
    this.getAllEmployeeList();
    this.getAllSeparationType();
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  // This is for get all employee List-----------------------------------------------
  getAllEmployeeList() {
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.employeeList.push({
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode
            });
          });
        } else {
          console.log('Record not exists');
        }
      });
  }

  // This is for get all separation type list-------------------------------------------------
  getAllSeparationType() {
    this.serviceApi.get('/v1/seperationTypes/').subscribe(
      res => {
        if (res != null) {
          console.log('All Resignation type List ' + JSON.stringify(res));
          res.forEach(element => {
            this.separationTypeList.push({
              value: element.sepTypeId,
              viewValue: element.seperationType
            });
          });
        } else {
          console.log('Record not exists');
        }
      });
  }

  // For initiate separation request------------------------------------------------
  initiateRequest() {
    console.log('Inside initiate request')
    if (this.addRequestForm.valid) {
      const body = {
        "empCode": this.addRequestForm.controls.employeeName.value,
        "comments": this.addRequestForm.controls.comment.value,
      };
      console.log('Separation Type Id------' + this.addRequestForm.controls.separationType.value);
      console.log('Employee Code------' + this.addRequestForm.controls.employeeName.value);
      console.log('Comment------' + this.addRequestForm.controls.comment.value);
      // console.log('Initiate Request Data :::: ' + JSON.stringify(body));
      this.serviceApi.post('/v1/resignation/application/admin/approval/' + this.addRequestForm.controls.separationType.value, body).subscribe(
        res => {
          console.log('Initiate Successfully...' + JSON.stringify(res));
          if (res != null) {
            this.message = res.message;
            this.close();
          } else {
          }
        }, err => {
          console.log('Something gone Wrong');
          console.log('err -->' + err);
          // this.warningNotification(err.message);
        }, () => {

        });
    } else {
      Object.keys(this.addRequestForm.controls).forEach(field => {
        const control = this.addRequestForm.get(field);
        control.markAsTouched({ onlySelf: true })
      })
    }
  }
}
// ---------------- Add separation request model end ------------------------