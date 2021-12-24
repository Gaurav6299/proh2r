import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Chart from 'chart.js';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiCommonService } from '../../../../app/services/api-common.service';
import { UploadFileService } from '../../../services/UploadFileService.service';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { KeycloakService } from '../../../keycloak/keycloak.service';
import { RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';
import { Headers } from '@angular/http';
import { MatTabChangeEvent } from '@angular/material';
import { DocumentDetailsComponent } from './tab/document-details/document-details.component';
//import * as $ from 'jquery';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { StatutoryDetailsComponent } from './tab/statutory-details/statutory-details.component';
import { AddCtcComponent } from '../edit-employee/tab/salary-details/add-ctc/add-ctc.component';
import { Router } from '@angular/router';
import { LoansComponent } from '../edit-employee/tab/loans/loans.component';
import { SalaryInfoComponent } from '../edit-employee/tab/salary-details/salary-info/salary-info.component';
import { AssetDetailsComponent } from '../edit-employee/tab/asset-details/asset-details.component';
import { TaxComponent } from './tab/tax/tax.component';

'../edit-employee/tab/salary-details/salary-info/salary-info.component';
declare var $: any;

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  profilePercent: string = '';
  empCode: any;
  fullName: any;
  profileImgPath: any;
  initials: any;
  designation: any;
  joiningDate: any;
  workingLocation: any;
  profilepercentage: any;
  // file upload work start
  selectedFiles: FileList;
  currentFileUpload: File;
  @ViewChild(DocumentDetailsComponent) documentDetailsComponentChild: DocumentDetailsComponent;
  @ViewChild(StatutoryDetailsComponent) statutoryDetailsComponentChild: StatutoryDetailsComponent;
  @ViewChild(LoansComponent) loansComponentChild: LoansComponent;
  @ViewChild(AssetDetailsComponent) assetDetailsComponentChild: AssetDetailsComponent;
  @ViewChild(TaxComponent) taxComponentChild: TaxComponent;

  message: string;
  receiveMessage($event) {
    this.message = $event;
    if (this.message === "Details Updated")
      this.getEmployeesData();
  }
  // file upload work end

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private http: Http, private serviceApi: ApiCommonService, private uploadService: UploadFileService, public dialog: MatDialog) {
    this.route.params.subscribe(res =>
      this.empCode = res.id);
    this.getEmployeesData();
    var rolesArr = KeycloakService.getUserRole();
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
  warningNotification(warningMessage: any) {
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
  onLinkClick(event: MatTabChangeEvent) {
    console.log(event);
    // console.log('index => ', event.index);
    // console.log('tab => ', event.tab);
    // this.currentTab = event.index;
    if (event.index === 0) {
      // this.personalDetailsComponentChild.getEmployeesData();
    } else if (event.index === 1) {
      // this.employmentDetailsComponentChild.getEmployeesData();
    }
    else if (event.index === 2) {
      this.router.navigate(['/employees/edit-employee/' + this.empCode]);
      // this.salaryInfoComponentChild.loadData();
    }
    else if (event.index === 3) {
      this.statutoryDetailsComponentChild.getStatutoryInfo();
      this.statutoryDetailsComponentChild.readwrite = false;
      this.statutoryDetailsComponentChild.readonly = true;
    }
    else if (event.index === 4) {
      this.loansComponentChild.getAllLoanApplications();
    }
    else if (event.index === 5) {
      this.taxComponentChild.getTaxDeclaration()
    }
    else if (event.index === 6) {
      this.documentDetailsComponentChild.getAllCategoryInformation();
      this.documentDetailsComponentChild.getDocuments();
    }
    else if (event.index === 7) {
      this.assetDetailsComponentChild.getAllAssetAllocations();
      this.assetDetailsComponentChild.getAllCategories();
    }
  }

  getEmployeesData() {
    this.fullName = '';
    this.profileImgPath = '';
    this.initials = '';
    this.designation = '';
    this.joiningDate = '';
    this.workingLocation = '';
    this.profilePercent = '';

    this.serviceApi.get('/v1/employee/profile/' + this.empCode + '/head').
      subscribe(
        res => {
          console.log(res);
          console.log('<------------------ Employee Informations ---------------------->');
          console.log(res);
          // res.forEach(element => {
          if (res.empCode === this.empCode) {
            this.fullName = res.empName;
            this.profileImgPath = res.docId;
            //  != null ? environment.storageServiceBaseUrl + res.docId : null;

            this.designation = res.positionedAs;
            this.joiningDate = res.joinedOn;
            this.workingLocation = res.worksAt;
            this.profilePercent = res.profileCompletedRatio;

          }
          // });

        },
        error => {

        },
        () => {
          const name = <string>this.fullName;
          const names = name.split(' ');
          this.initials = names[0].charAt(0) + names[1].charAt(0);
          this.generateProfilePercentage();
        }
      );

  }
  ngOnInit() { }

  generateProfilePercentage() {
    var self = this;
    console.log('ngOninit-->' + +self.profilePercent);
    var dat = +self.profilePercent;
    var percent = +self.profilePercent;
    var canvasChart = <HTMLCanvasElement>document.getElementById('profileChart');
    var ctxChart = canvasChart.getContext('2d');
    var profileChart = new Chart(ctxChart, {
      type: 'doughnut',

      data: {
        labels: ['Complete', 'Incomplete'],
        datasets: [{
          data: [percent, 100 - percent],
          borderColor: [
            'rgba(255,255,255,0.7)',
            'rgba(255,255,255,0.7 )',
          ],
          borderWidth: 2,
          fill: true,
          backgroundColor: [
            'rgba(76,175,80,1)',
            'rgba(254,162,31,1)',
          ]
        }]
      },
      options: {
        legend: {
          display: false
        },
        cutoutPercentage: 60,
        responsive: true,
      },
      plugins: [{
        beforeDraw: function (chart, options) {
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
          ctx.restore();
          var fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + 'em Lato';
          ctx.textBaseline = 'middle';
          var text = +self.profilePercent + ' %',
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }]
    });
  }
  uploadFile() {
    $('#uploadFile').click();
  }
  event: any
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.event = event;
    const dialogRef = this.dialog.open(ImageCropperComponent, {
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
    const url = '/v1/employee/profile/' + this.empCode + '/uploadFile';
    this.uploadService.pushFileToStorage(this.currentFileUpload, url, "profile").subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.successNotification(event.body['message']);
        // this.successNotification("Profile Picture changed successfully");
      }
    },
      err => {
        console.log('error :::' + err);
        // this.warningNotification(JSON.parse(err.error.toString()).message);
      },
      () => {
        this.getEmployeesData();
      }
    );
    this.selectedFiles = undefined;
  }
}


@Component({
  selector: 'image-cropper-component',
  templateUrl: 'image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit
// tslint:disable-next-line:one-line
{
  imageChangedEvent: any = '';
  error = 'Error Message';
  action: any;
  showCropper = false;
  croppedImage: any = '';
  ngOnInit() { }
  constructor(public dialogRef: MatDialogRef<ImageCropperComponent>,
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
