import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { HttpEventType, HttpParams, HttpResponse } from '@angular/common/http';
import { UploadFileService } from '../../../../../services/UploadFileService.service';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-chapter-vi-deductions',
  templateUrl: './chapter-vi-deductions.component.html',
  styleUrls: ['./chapter-vi-deductions.component.scss']
})
export class ChapterViDeductionsComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  employeeDeductinonsList = [];
  employeeDeductinonsListCopy = [];
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
  employeeTaxDeclarationId
  empCode: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(res =>
      this.empCode = res.empCode);
    this.route.params.subscribe(res => {
      this.employeeTaxDeclarationId = res.id;
      console.log(this.employeeTaxDeclarationId);
      this.getChapterVIDeductinos();
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
  viewTrasactionHistoryDialog(rowData: any) {
    let dialogRef = this.dialog.open(ViewChapterVIDeductionTransactionHistoryDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: rowData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.status === 'Response') {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
          }
        }
      }
    });
  }
  uploadAttachmentDialog(rowData: any) {
    let dialogRef = this.dialog.open(ChapterViDeductionUploadFileAttachmentDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: rowData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            this.successNotification(result.message);
            this.employeeDeductinonsList.forEach((element, index) => {
              if (element.empTaxDeclareCompDetailId == rowData.empTaxDeclareCompDetailId) {
                this.employeeDeductinonsList[index].attachmentLink = result.docId;
                this.employeeDeductinonsList[index].attachmentName = result.fileName;
              }
            });
          }
          else if (result.status === 'Error') {
          }
        }
      }
    });
  }
  ngOnInit() { }
  getChapterVIDeductinos() {
    this.employeeDeductinonsList = [];
    this.employeeDeductinonsListCopy = [];
    this.serviceApi.get("/v1/employee/taxDeclaration/getData/" + this.employeeTaxDeclarationId + "/4").subscribe(res => {
      res.categoryComponentList.forEach(element => {
        this.employeeDeductinonsList.push({
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
      this.employeeDeductinonsList.forEach(val => this.employeeDeductinonsListCopy.push(Object.assign({}, val)));
    }, (err) => {

    }, () => {
      this.dt.reset();

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
      this.successNotification("Deduction under Chapter VI A updated successfully.");
      // this.getChapterVIDeductinos();
      this.employeeDeductinonsList.forEach(element => {
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
    var temp = this.employeeDeductinonsListCopy.filter(element2 => event.empTaxDeclareCompDetailId == element2.empTaxDeclareCompDetailId)[0];
    this.employeeDeductinonsList.forEach(element1 => {
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
export class ViewChapterVIDeductionTransactionHistoryDialogComponent implements OnInit {
  action: any;
  error: any;
  columns: any[] = [
    { field: 'transactionDate', header: 'Date' },
    { field: 'remarks', header: 'Remarks' },
    { field: 'statement', header: 'Transaction Details' },
    { field: 'generatedBy', header: 'User' }
  ];
  constructor(public dialogRef: MatDialogRef<ViewChapterVIDeductionTransactionHistoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
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
@Component({
  templateUrl: 'upload-file-attachment.dialog.html',
})
export class ChapterViDeductionUploadFileAttachmentDialogComponent implements OnInit {
  action: any;
  error: any;
  selectedFiles: FileList;
  selectedFilesName: string;
  currentFileUpload: File;
  message: any;
  docId: any;
  fileName: any;
  empCode: any;
  constructor(private uploadService: UploadFileService, public dialogRef: MatDialogRef<ChapterViDeductionUploadFileAttachmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService, private route: ActivatedRoute) {
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
  ngOnInit() { }
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
