
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadFileService } from '../../../../../services/UploadFileService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-previous-employment-information',
  templateUrl: './previous-employment-information.component.html',
  styleUrls: ['./previous-employment-information.component.scss']
})
export class PreviousEmploymentInformationComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns: any[] = [
    { field: 'componentName', header: 'Component Name' },
    { field: 'sectionName', header: 'Section' },
    { field: 'maximumAmount', header: 'Maximum Amount' },
    { field: 'appliedAmount', header: 'Applied Amount' },
    { field: 'approvedAmount', header: 'Approved Amount' },
    { field: 'approvalStatus', header: 'Approval Status' },
    { field: 'empRemarks', header: 'Remarks' },
    { field: 'attachmentName', header: 'Attachment' },
    { field: 'actions', header: 'Actions' }
  ];
  incomeLossHousePropertyList = [];
  previousEmploymentInformation = [];
  previousEmploymentInformationCopy = [];
  employeeTaxDeclarationId: any;
  empCode: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(res =>
      this.empCode = res.empCode);
    this.route.params.subscribe(res => {
      this.employeeTaxDeclarationId = res.id;
      this.getPreviousEmploymentInformation();
    }, (err) => {

    }, () => {

    });
  }
  ngOnInit() {

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

  getPreviousEmploymentInformation() {
    this.previousEmploymentInformation = [];
    this.previousEmploymentInformationCopy = [];
    this.serviceApi.get("/v1/employee/taxDeclaration/getData/" + this.employeeTaxDeclarationId + "/6").subscribe(res => {
      res.categoryComponentList.forEach(element => {
        this.previousEmploymentInformation.push({
          "empTaxDeclareCompDetailId": element.empTaxDeclareCompDetailId,
          "componentName": element.componentName,
          "maximumAmount": element.maximumAmount,
          "appliedAmount": element.appliedAmount,
          "approvedAmount": element.approvedAmount,
          "approvalStatus": element.approvalStatus,
          "attachmentName": element.attachmentName,
          "attachmentLink": element.attachmentLink,
          "attachmentRequired": element.attachmentRequired,
          "empRemarks": element.empRemarks,
          "employeeTaxDeclarationLogs": element.employeeTaxDeclarationLogs,
          "workFlowRequired": element.workFlowRequired,
          "url": environment.storageServiceBaseUrl + element.attachmentLink,
          "readwrite": false,
          "sectionName": element.sectionName
        })
      });
      this.previousEmploymentInformation.forEach(val => this.previousEmploymentInformationCopy.push(Object.assign({}, val)));
    }, (err) => {

    }, () => {
      this.dt.reset();

    });
  }


  viewTrasactionHistoryDialog(event: any) {
    let dialogRef = this.dialog.open(ViewPreviousEmploymentInfoTransactionHistoryDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            this.successNotification(result.message);
          }
        }
      }
    });
  }
  uploadAttachmentDialog(event: any) {
    let dialogRef = this.dialog.open(UploadPreviousEmploymentInfoFileAttachmentDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
            this.previousEmploymentInformation.forEach((element, index) => {
              if (element.empTaxDeclareCompDetailId == event.empTaxDeclareCompDetailId) {
                this.previousEmploymentInformation[index].attachmentLink = result.docId;
                this.previousEmploymentInformation[index].attachmentName = result.fileName;
              }
            });
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });
  }


  saveComponents(rowData: any) {
    var employeeTaxDeclarationsDetails = [];

    if (rowData.appliedAmount == null) {
      this.warningNotification("Applied amount cannot be empty.");
      return;
    }
    if (rowData.attachmentRequired && rowData.attachmentName == "") {
      this.warningNotification("Attachment is mandatory for this component.");
      return;
    }

    employeeTaxDeclarationsDetails.push({
      "taxDeclarationsDetailId": rowData.empTaxDeclareCompDetailId,
      "appliedAmount": +rowData.appliedAmount,
      "docId": rowData.attachmentLink,
      "fileName": rowData.attachmentName,
      "empRemarks": rowData.empRemarks
    })
    const body = {
      "employeeTaxDeclarationId": this.employeeTaxDeclarationId,
      "employeeTaxDeclarationsDetails": employeeTaxDeclarationsDetails
    }
    this.serviceApi.put("/v1/employee/taxDeclaration/update", body).subscribe(res => {
      rowData.readwrite = !rowData.readwrite;
      this.successNotification("Previous Employment Information updated successfully.");
      // this.getPreviousEmploymentInformation();
      this.previousEmploymentInformation.forEach(element => {
        if (element.empTaxDeclareCompDetailId == rowData.empTaxDeclareCompDetailId) {
          element.empTaxDeclareCompDetailId = res[0].empTaxDeclareCompDetailId;
          element.componentName = res[0].componentName;
          element.maximumAmount = res[0].maximumAmount;
          element.appliedAmount = res[0].appliedAmount;
          element.approvedAmount = res[0].approvedAmount;
          element.approvalStatus = res[0].approvalStatus;
          element.attachmentName = res[0].attachmentName;
          element.attachmentLink = res[0].attachmentLink;
          element.attachmentRequired = res[0].attachmentRequired;
          element.empRemarks = res[0].empRemarks;
          element.employeeTaxDeclarationLogs = res[0].employeeTaxDeclarationLogs;
          element.workFlowRequired = res[0].workFlowRequired;
          element.sectionName = res[0].sectionName;
        }
      });
    }, () => {

    }, () => {

    });
  }

  resetRow(event: any) {
    var temp = this.previousEmploymentInformationCopy.filter(element2 => event.empTaxDeclareCompDetailId == element2.empTaxDeclareCompDetailId)[0];
    this.previousEmploymentInformation.forEach(element1 => {
      if (temp.empTaxDeclareCompDetailId == element1.empTaxDeclareCompDetailId) {
        element1.appliedAmount = temp.appliedAmount;
        element1.attachmentName = temp.attachmentName;
        element1.attachmentLink = temp.attachmentLink;
        element1.empRemarks = temp.empRemarks;
      }
    })
  }

  backToNavigate() {
    this.router.navigate(['/employees/edit-employee/' + this.empCode]);
  }
}

@Component({
  templateUrl: 'view-transaction-history-dialog.html',
  styleUrls: ['view-transaction-history-dialog-model.scss']
})
export class ViewPreviousEmploymentInfoTransactionHistoryDialogComponent implements OnInit {

  action: any;
  error: any;
  columns: any[] = [
    { field: 'transactionDate', header: 'Date' },
    { field: 'remarks', header: 'Remarks' },
    { field: 'statement', header: 'Transaction Details' },
    { field: 'generatedBy', header: 'User' }
  ];
  constructor(public dialogRef: MatDialogRef<ViewPreviousEmploymentInfoTransactionHistoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log(this.data);
  }

  ngOnInit() {

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'upload-file-attachment.dialog.html',
})
export class UploadPreviousEmploymentInfoFileAttachmentDialogComponent implements OnInit {
  action: any;
  error: any;
  selectedFiles: FileList;
  selectedFilesName: string;
  currentFileUpload: File;
  message: any;
  docId: any;
  fileName: any;
  empCode: any;
  constructor(private uploadService: UploadFileService, public dialogRef: MatDialogRef<UploadPreviousEmploymentInfoFileAttachmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(res =>
      this.empCode = res.empCode);
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

  }
  close(): void {
    this.data.message = this.message;
    this.data.status = this.action;
    this.data.docId = this.docId;
    this.data.fileName = this.fileName;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  uploadFormat() {
    $('#uploadFile').click();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFilesName = this.selectedFiles.item(0).name;
  }

  upload() {
    if (this.selectedFiles == undefined) {
      this.warningNotification("Please select an attachment first.");
      return;
    }
    this.currentFileUpload = this.selectedFiles.item(0);
    const file = <File>this.currentFileUpload;
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = '/v1/employee/taxDeclaration/upload/attachment?empCode=' + this.empCode;

    this.uploadService.pushFileToStorage2(this.currentFileUpload, url).subscribe(event => {
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        if (event != null) {
          this.message = "Attachment uploaded successfully.";
          this.action = 'Response';
          this.docId = JSON.parse(event.body + "").docId
          this.fileName = JSON.parse(event.body + "").fileName
          this.close();
        }
      }

    },
      err => {
      }
    );
  }
}
