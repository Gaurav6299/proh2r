import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { ApiCommonService } from '../../../services/api-common.service';
declare var $: any;
@Component({
  selector: 'app-management-dashboard-access',
  templateUrl: './management-dashboard-access.component.html',
  styleUrls: ['./management-dashboard-access.component.scss']
})
export class ManagementDashboardAccessComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  panelFirstWidth: any;
  panelFirstHeight: any;
  isLeftVisible: any;
  employeeList = [];
  employeeListCopy = [];
  orgProfile = [];
  managementDashboardAccessListData = [];
  managementDashboardPermissionsForm: FormGroup;
  myControl = new FormControl();
  showHideSaveButton = false;
  showHideUpdateButton = false;
  columns = [
    { field: 'empName', header: 'Full Name' },
    { field: 'selectedOrganizations', header: 'Type Of Access' },
    { field: 'actions', header: 'Actions' },
  ]
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private fb: FormBuilder) {
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
  cancelPanel() {
    this.isLeftVisible = false;
    this.setPanel();
    this.managementDashboardPermissionsForm.reset();
  }
  addManageDashboardAdmin() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.showHideSaveButton = true;
    this.showHideUpdateButton = false;
    this.managementDashboardPermissionsForm.reset();
    this.managementDashboardPermissionsForm.controls.empCode.enable();
    this.getAllEmployeeList();
    this.getOrganizationProfile();
  }
  getManagementDashboardAccessList() {
    this.managementDashboardAccessListData = [];
    this.serviceApi.get('/v1/management/access/getAll').subscribe(res => {
      res.forEach(element => {
        this.managementDashboardAccessListData.push({
          empCode: element.empCode,
          empName: element.empName + '-' + element.empCode,
          organizations: element.organizations,
          selectedOrganizations: element.selectedOrganizations,
        });
      });
    },
      err => {
      },
      () => {
        this.dt.reset();
      })
  }
  getAllEmployeeList() {
    this.employeeList = [];
    this.employeeListCopy = [];
    return this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {
          this.employeeList = [...this.employeeList, {
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName
          }];
        });
      }, err => {
        console.log('There is Something Error in the Retriving Employee List');
      });
  }
  getOrganizationProfile() {
    this.orgProfile = [];
    this.serviceApi.get("/v1/organization/orgProfileInfo").subscribe(res => {
      res.forEach(element => {
        this.orgProfile = [...this.orgProfile, {
          "value": element.orgProfileId,
          "viewValue": element.organizationBasicInfo.companyName
        }];
      });
    }, (err) => {

    }, () => {

    });
  }
  ngOnInit() {
    this.managementDashboardPermissionsForm = this.fb.group({
      empCode: [null, Validators.required],
      orgProfile: [null, Validators.required],
    });
    this.getOrganizationProfile();
    this.getAllEmployeeList();
    this.getManagementDashboardAccessList();
  }
  compareFn(a: any, b: any) {
    return (a && b) && (a.value == b);
  }
  editManagementDashboardAccess(element: any) {
    this.addManageDashboardAdmin();
    var orgProfile = [];
    if (element.organizations != null) {
      element.organizations.forEach(profile => {
        orgProfile.push(profile.profileId)
      })
    }
    this.managementDashboardPermissionsForm.controls.empCode.setValue(element.empCode);
    this.managementDashboardPermissionsForm.controls.empCode.disable();
    this.managementDashboardPermissionsForm.controls.orgProfile.setValue(orgProfile);
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.showHideSaveButton = false;
    this.showHideUpdateButton = true;
    console.log(element)
  }
  saveManagementDashboardAccessForm() {
    if (this.managementDashboardPermissionsForm.valid) {
      const body = {
        "empCode": this.managementDashboardPermissionsForm.controls.empCode.value,
        "orgProfileId":
          this.managementDashboardPermissionsForm.controls.orgProfile.value,
      }
      console.log(body);
      this.serviceApi.post('/v1/management/access/save', body).subscribe(res => {
        this.successNotification(res.message);
        this.isLeftVisible = !this.isLeftVisible;
        this.getManagementDashboardAccessList();
        this.setPanel();
      }, (err) => {

      }, () => {

      })

    } else {
      Object.keys(this.managementDashboardPermissionsForm.controls).forEach(field => {
        const control = this.managementDashboardPermissionsForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });

    }
  }
  updateManagementDashboardAccessForm() {
    if (this.managementDashboardPermissionsForm.valid) {
      const body = {
        "empCode": this.managementDashboardPermissionsForm.controls.empCode.value,
        "orgProfileId":
          this.managementDashboardPermissionsForm.controls.orgProfile.value,
      }
      console.log(body);
      this.serviceApi.put('/v1/management/access/update', body).subscribe(res => {
        this.successNotification(res.message);
        this.isLeftVisible = !this.isLeftVisible;
        this.getManagementDashboardAccessList();
        this.setPanel();
      }, (err) => {
        this.warningNotification(err.message);
      }, () => {

      })

    } else {
      Object.keys(this.managementDashboardPermissionsForm.controls).forEach(field => {
        const control = this.managementDashboardPermissionsForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });

    }
  }
  openDeleteManagementDashboardAccessDialog(element: any) {
    const dialogRef = this.dialog.open(DeleteDialogManagementDashboardComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == 'Response') {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          this.successNotification(result.message);
          this.getManagementDashboardAccessList();
        }
      }
    });
  }
}

@Component({
  templateUrl: 'delete-management-dashboard-access.dialog.html',
})
export class DeleteDialogManagementDashboardComponent {
  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogManagementDashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
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
  deleteAccess() {
    const empCode = this.data.element.empCode;
    this.serviceApi.delete('/v1/management/access/delete/' + empCode).subscribe(
      res => {
        console.log('Enter in the Successfully Delete Data');
        this.action = 'Response';
        this.error = res.message;
        this.successNotification(res.message);
        this.close();
      }, err => {
        console.log('Something Wrong');
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
}