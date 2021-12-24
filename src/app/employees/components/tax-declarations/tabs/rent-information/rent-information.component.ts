import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { UploadFileService } from '../../../../../services/UploadFileService.service';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { environment } from '../../../../../../environments/environment';
import { ValidationMessagesService} from '../../../../../validation-messages.service';
declare var $: any;

@Component({
  selector: 'app-rent-information',
  templateUrl: './rent-information.component.html',
  styleUrls: ['./rent-information.component.scss']
})
export class RentInformationComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns: any[] = [
    { field: 'monthName', header: 'Month Name' },
    { field: 'rentDeclared', header: 'Rent Declared (In Rs.)' },
    { field: 'verifiedAmount', header: 'Verified Amount (In Rs.)' },
    { field: 'cityType', header: 'City Type	' },
    { field: 'landlordName', header: 'Landlord Name' },
    { field: 'landlordPanNumber', header: 'Landlord PAN' },
    { field: 'landlordAddress', header: 'Landlord Address' },
    { field: 'approvalStatus', header: 'Approval Status' },
    { field: 'empRemarks', header: 'Remarks' },
    { field: 'attachmentLink', header: 'Attachment' },
    { field: 'actions', header: 'Actions' }
  ];
  rentDetailList = [];
  employeeTaxDeclarationId: any;
  rentInfoList = [];
  rentInfoListCopy = [];
  applyToAllForm: FormGroup;
  cityType = [
    { value: "METRO", viewValue: "Metro" },
    { value: "NON_METRO", viewValue: "Non Metro" }
  ]
  empCode: any;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private router: Router, private route: ActivatedRoute, private _fb: FormBuilder, private validatormessage: ValidationMessagesService) {
    this.route.queryParams.subscribe(res =>
      this.empCode = res.empCode);
    this.route.params.subscribe(res => {
      this.employeeTaxDeclarationId = res.id;
      this.getRentInfo();
    }, (err) => {
    }, () => {
    });
    this.applyToAllForm = this._fb.group({
      annualRent: [''],
      landlordpan: ['',this.validatormessage.panCardValidation],
      landlordname: [''],
      landlordaddress: [''],
      cityType: [''],
      remark: ['']
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

  applyToAll() {

    if (this.applyToAllForm.controls.landlordaddress.value != '') {
      this.rentInfoList.forEach(rentInfo => {
        if (rentInfo.approvalStatus != 'Pending' && rentInfo.approvalStatus != 'Approved') {
          rentInfo.landlordAddress = this.applyToAllForm.controls.landlordaddress.value;
          rentInfo.readwrite = true;
        }
      })
    }

    if (this.applyToAllForm.controls.landlordpan.value != '') {
      this.rentInfoList.forEach(rentInfo => {
        if (rentInfo.approvalStatus != 'Pending' && rentInfo.approvalStatus != 'Approved') {
          rentInfo.landlordPanNumber = this.applyToAllForm.controls.landlordpan.value;
          rentInfo.readwrite = true;
        }
      })
    }

    if (this.applyToAllForm.controls.landlordname.value != '') {
      this.rentInfoList.forEach(rentInfo => {
        if (rentInfo.approvalStatus != 'Pending' && rentInfo.approvalStatus != 'Approved') {
          rentInfo.landlordName = this.applyToAllForm.controls.landlordname.value;
          rentInfo.readwrite = true;
        }
      })
    }

    if (this.applyToAllForm.controls.cityType.value != '') {
      this.rentInfoList.forEach(rentInfo => {
        if (rentInfo.approvalStatus != 'Pending' && rentInfo.approvalStatus != 'Approved') {
          rentInfo.cityType = this.applyToAllForm.controls.cityType.value;
          rentInfo.readwrite = true;
        }
      })
    }

    if (this.applyToAllForm.controls.remark.value != '') {
      this.rentInfoList.forEach(rentInfo => {
        if (rentInfo.approvalStatus != 'Pending' && rentInfo.approvalStatus != 'Approved') {
          rentInfo.empRemarks = this.applyToAllForm.controls.remark.value;
          rentInfo.readwrite = true;
        }
      })
    }

    var length = this.rentInfoList.filter(rentInfo => rentInfo.approvalStatus != 'Pending' && rentInfo.approvalStatus != 'Approved').length;

    if (this.applyToAllForm.controls.annualRent.value != '' && length > 0) {
      this.rentInfoList.forEach(rentInfo => {
        if (rentInfo.approvalStatus != 'Pending' && rentInfo.approvalStatus != 'Approved') {
          rentInfo.rentDeclared = Math.floor(this.applyToAllForm.controls.annualRent.value / length);
        }
      })
    }
  }

  resetRow(event: any) {
    console.log(this.rentInfoList);
    var temp = this.rentInfoListCopy.filter(element2 => event.empRentInfoId == element2.empRentInfoId)[0];
    this.rentInfoList.forEach(element1 => {
      if (temp.empRentInfoId == element1.empRentInfoId) {
        element1.rentDeclared = temp.rentDeclared;
        element1.cityType = temp.cityType;
        element1.landlordName = temp.landlordName;
        element1.landlordPanNumber = temp.landlordPanNumber;
        element1.landlordAddress = temp.landlordAddress;
        element1.empRemarks = temp.empRemarks;
        element1.attachmentLink = temp.attachmentLink;
        element1.attachmentUrl = temp.attachmentUrl;
        element1.fileName = temp.fileName;

      }
    })
    console.log(this.rentInfoList);
  }

  getRentInfo() {
    this.rentInfoList = [];
    this.rentInfoListCopy = [];
    this.serviceApi.get("/v1/employee/taxDeclaration/rent/" + this.employeeTaxDeclarationId).subscribe(res => {
      res.forEach(element => {
        this.rentInfoList.push({
          "empRentInfoId": element.empRentInfoId,
          "monthName": element.monthName,
          "rentDeclared": element.rentDeclared,
          "verifiedAmount": element.verifiedAmount,
          "cityType": element.cityType,
          "landlordName": element.landlordName,
          "landlordPanNumber": element.landlordPanNumber,
          "landlordAddress": element.landlordAddress,
          "approvalStatus": element.approvalStatus,
          "attachmentLink": element.attachmentLink,
          "attachmentUrl": element.attachmentUrl,
          "fileName": element.fileName,
          "statement": element.statement,
          "empRemarks": element.empRemarks,
          "employeeRentDeclarationLogs": element.employeeRentDeclarationLogs,
          "url": environment.storageServiceBaseUrl + element.attachmentLink,
          "readwrite": false
        });
      });
      this.rentInfoList.forEach(val => this.rentInfoListCopy.push(Object.assign({}, val)));
    }, (err) => {

    }, () => {
      this.dt.reset();

    });
  }
  viewTrasactionHistoryDialog(rowData) {
    let dialogRef = this.dialog.open(ViewRentDetailsTransactionHistoryDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: rowData
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
  ngOnInit() {
  }

  backToNavigate() {
    this.router.navigate(['/employees/edit-employee/' + this.empCode]);
  }

  saveRentInfo(event: any) {
    console.log(event);
    if (event.rentDeclared == null) {
      this.warningNotification("Rent Declared cannot be empty.");
      return;
    }
    if (event.landlordName == "") {
      this.warningNotification("Landlord Name cannot be empty.");
      return;
    }
    const pattern = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
    const regexp = new RegExp(pattern);

    if (event.landlordPanNumber == "" || !regexp.test(event.landlordPanNumber)) { 
       this.warningNotification("Landlord PAN Number is not valid.");
       return;
     }
    if (event.landlordAddress == "") {
      this.warningNotification("Landlord Address cannot be empty.");
      return;
    }
    if (event.fileName == null) {
      this.warningNotification("Attachment is mandatory.");
      return;
    }

    let employeeRentDetailsVOList = [];
    employeeRentDetailsVOList.push({
      "attachmentLink": event.attachmentLink,
      "cityType": event.cityType,
      "empRemarks": event.empRemarks,
      "empRentInfoId": event.empRentInfoId,
      "fileName": event.fileName,
      "landlordAddress": event.landlordAddress,
      "landlordName": event.landlordName,
      "landlordPanNumber": event.landlordPanNumber,
      "rentDeclared": event.rentDeclared
    })
    const body = {
      "employeeRentDetailsVOList": employeeRentDetailsVOList,
      "employeeTaxDeclarationId": this.employeeTaxDeclarationId
    }
    this.serviceApi.put("/v1/employee/taxDeclaration/update/rent/application/", body).subscribe(res => {
      event.readwrite = !event.readwrite;
      this.successNotification("Rent Information updated successfully.");
      // this.getRentInfo();
      this.rentInfoList.forEach(element => {
        if (element.empRentInfoId == event.empRentInfoId) {
          element.empRentInfoId = res[0].empRentInfoId;
          element.monthName = res[0].monthName;
          element.rentDeclared = res[0].rentDeclared;
          element.verifiedAmount = res[0].verifiedAmount;
          element.cityType = res[0].cityType;
          element.landlordName = res[0].landlordName;
          element.landlordPanNumber = res[0].landlordPanNumber;
          element.landlordAddress = res[0].landlordAddress;
          element.approvalStatus = res[0].approvalStatus;
          element.attachmentLink = res[0].attachmentLink;
          element.attachmentUrl = res[0].attachmentUrl;
          element.fileName = res[0].fileName;
          element.statement = res[0].statement;
          element.empRemarks = res[0].empRemarks;
          element.lockStatu = res[0].lockStatu;
          element.employeeRentDeclarationLogs = res[0].employeeRentDeclarationLogs;
        }
      });
      this.applyToAllForm.reset();
    }, (err) => {

    }, () => {

    });
  }

  uploadAttachmentDialog(event: any) {
    let dialogRef = this.dialog.open(UploadRentAttachmentDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message) {
          if (result.status === 'Response') {
            if (result.status === 'Response') {
              // this.getTaxDeclarationFor80C();
              this.successNotification(result.message);
              this.rentInfoList.forEach((element, index) => {
                if (element.empRentInfoId == event.empRentInfoId) {
                  this.rentInfoList[index].attachmentLink = result.docId;
                  this.rentInfoList[index].fileName = result.fileName;
                }
              });
            }
          }

          // this.successNotification(result.message);
          else if (result.status === 'Error') {
          }
        }
      }
    }, (err) => {

    }, () => {
      this.dt.reset();
    });
  }

}
@Component({
  templateUrl: 'view-transaction-history-dialog.html',
  styleUrls: ['view-transaction-history-dialog-model.scss']
})
export class ViewRentDetailsTransactionHistoryDialogComponent implements OnInit {
  action: any;
  error: any;
  columns: any[] = [
    { field: 'date', header: 'Date' },
    { field: 'remarks', header: 'Remarks' },
    { field: 'statement', header: 'Transaction Details' },
    { field: 'generatedBy', header: 'User' }
  ];
  constructor(public dialogRef: MatDialogRef<ViewRentDetailsTransactionHistoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
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
export class UploadRentAttachmentDialogComponent implements OnInit {
  action: any;
  error: any;
  selectedFiles: FileList;
  selectedFilesName: string;
  currentFileUpload: File;
  message: any;
  docId: any;
  fileName: any;
  empCode: any;
  constructor(private uploadService: UploadFileService, public dialogRef: MatDialogRef<UploadRentAttachmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
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