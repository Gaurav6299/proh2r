import { Component, OnInit, Inject, ViewChild, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadFileService } from '../../../services/UploadFileService.service';
import { FormControl } from '@angular/forms';
import { ApiCommonService } from '../../../services/api-common.service';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { OrgProfileComponent } from '../organization-setup/tabs/org-profile/org-profile.component';
import { OrganizationService } from '../organization-setup/tabs/org-profile/organization.service';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-organization-header',
  templateUrl: './organization-header.component.html',
  styleUrls: ['./organization-header.component.scss']
})
export class OrganizationHeaderComponent implements OnInit {
  parentOrgProfileId: any;

  selectedFiles: FileList;
  currentFileUpload: File;
  companyName: string = ''
  companyImage = new FormControl();
  authorizedSignatory = new FormControl();
  totalEmployee = new FormControl();
  totalAdmin = new FormControl();
  companyLocation = new FormControl();
  tolatPayroll = new FormControl();
  creationDate = new FormControl();
  headerSubscription: Subscription
  constructor(private orgService: OrganizationService, private uploadService: UploadFileService, private apiCommonService: ApiCommonService, public dialog: MatDialog) {
    this.loadData();
    var rolesArr = KeycloakService.getUserRole();
  }

  ngOnInit() {
    this.headerSubscription = this.orgService.getCompanyName().subscribe(res => {
      this.companyName = res;
    })
    this.headerSubscription = this.orgService.getParentOrgProfileId().subscribe(res => {
      this.parentOrgProfileId = res;
    })
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
  loadData() {
    this.apiCommonService.get('/v1/organization/organizationHeaderInfo').subscribe(
      res => {
        // this.companyName = new FormControl(res.companyName);
        this.companyImage = new FormControl(res.companyImage);
        this.authorizedSignatory = new FormControl(res.authorizedSignatory);
        this.totalAdmin = new FormControl(res.totalAdmin);
        this.totalEmployee = new FormControl(res.totalEmployee);
        this.companyLocation = new FormControl(res.companyLocation);
        this.tolatPayroll = new FormControl(res.tolatPayroll);
        this.creationDate =  new FormControl(res.orgDate);

      },
      err => {

      },
      () => {
      }

    );
  }

  uploadFile() {
    $('#uploadFile').click();
  }
  event: any
  selectedFileName
  selectFile(event) {
    this.selectedFiles = null;
    this.selectedFiles = event.target.files;
    this.selectedFileName = event.target.files[0].name;
    // this.upload();
    this.event = event;
    const dialogRef = this.dialog.open(OrganizationImageCropperComponent, {
      // width: '800px',
      panelClass: 'custom-dialog-container',
      data: { event: event }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.croppedFile) {
          this.currentFileUpload = result.croppedFile;
          this.upload();
        }
      }

    });
  }
  upload() {
    console.log('upload method called-->');
    const url = '/v1/organization/profileImage/' + this.parentOrgProfileId;
    this.uploadService.pushFileToStorage(this.currentFileUpload, url, "org", this.selectedFileName).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.successNotification(event.body['message']);
        //  this.successNotification("Profile Picture changed successfully");
      }
    },
      err => {
        console.log('error :::' + err);
        // this.warningNotification(JSON.parse(err.error.toString()).message);
      },
      () => {
        this.loadData();
        this.orgService.uploadedFileStatus();
      }
    );
    this.selectedFiles = undefined;
  }

  deleteFile() {
    console.log('delete method called-->');
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/organization/delete/profileImage';
    this.uploadService.deleteFileToStorage(this.currentFileUpload, url).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log('File is Deleted!');
        this.successNotification(JSON.parse(event.body.toString()).message);
      }
    },
      err => {
        console.log('error :::' + err);
        // this.warningNotification(JSON.parse(err.error.toString()).message);
      },
      () => {
        this.loadData();
        this.orgService.uploadedFileStatus();
      }
    );
  }

}


@Component({
  selector: 'organization-image-cropper-component',
  templateUrl: 'organization-image-cropper.component.html',
  styleUrls: ['./organization-image-cropper.component.scss']
})
export class OrganizationImageCropperComponent implements OnInit
// tslint:disable-next-line:one-line
{
  imageChangedEvent: any = '';
  error = 'Error Message';
  action: any;
  showCropper = false;
  croppedImage: any = '';
  ngOnInit() { }
  constructor(public dialogRef: MatDialogRef<OrganizationImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.imageChangedEvent = data.event;
  }
  close(): void {
    // this.data.message = this.error;
    // this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.data.base64 = event.base64
    this.data.croppedFile = event.file
    console.log(event);
  }
  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded')
  }
  cropperReady() {
    console.log('Cropper ready')
  }
  loadImageFailed() {
    console.log('Load failed');
  }
}
