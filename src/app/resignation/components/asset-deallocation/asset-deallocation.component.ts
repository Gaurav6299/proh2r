import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSort } from '@angular/material';
import { ApiCommonService } from '../../../services/api-common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator'
import { DataTable } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-asset-deallocation',
  templateUrl: './asset-deallocation.component.html',
  styleUrls: ['./asset-deallocation.component.scss']
})
export class AssetDeallocationComponent implements OnInit {

  panelFirstWidth: any;
  panelFirstHeight: any;
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
  resignationApplicationArrayComplete = []
  selectedSeparationRequest = null;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {
    
  }

  ngOnInit() {

    this.getListOfApplications();
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
            if (element.seperationDetails.assetDeallocation === "Initiated") {
              console.log(element)
              console.log('element.....' + element);
              if (element.seperationDetails.resignationStatus === "Pending") {
                this.pendingCount++;
              } else {
                this.approvedCount++;
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
              });
            }
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
  openApproveRequestDialog(data: any) {
    const dialogRef = this.dialog.open(ApproveDeallocationRequestComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { separationReqId: data.separationReqId, message: this.message }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'Response') {
          this.successNotification(result.message);
          this.getListOfApplications();
          // }else{
          //   // this.warningNotification(result.message);
          // }
        }
      }

    });
  }



}
export interface Element {
}



// --------------------------- Approve Separation request model start -------------------------
@Component({
  templateUrl: 'approve-asset-deallocation.dialog.component.html',
  styleUrls: ['./approve-asset-deallocation.dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ApproveDeallocationRequestComponent implements OnInit {
  action: any;
  error: any;
  message: any;
  separationReqId
  requestInfo: any;
  constructor(public dialogRef: MatDialogRef<ApproveDeallocationRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService, ) {
    this.requestInfo = data.requestInfo;
    this.separationReqId = data.separationReqId;
  }
  //for approve separation request --------------------------------------
  approveRequest() {
    this.serviceApi.post("/v1/resignation/application/mark/assetdealloated/" + this.separationReqId, {}).
      subscribe(
        res => {
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
  ngOnInit() { }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
// --------------------------- Approve Separation request model end -------------------------
