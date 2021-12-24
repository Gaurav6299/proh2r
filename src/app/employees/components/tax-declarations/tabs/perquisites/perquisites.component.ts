import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-perquisites',
  templateUrl: './perquisites.component.html',
  styleUrls: ['./perquisites.component.scss']
})

export class PerquisitesComponent implements OnInit {
  @ViewChild('dt1') dt: DataTable;
  columns: any[] = [
    { field: 'componentName', header: 'Component Name' },
    { field: 'sectionName', header: 'Section' },
    { field: 'maximumAmount', header: 'Maximum Amount' },
    { field: 'appliedAmount', header: 'Applied Amount' },
    { field: 'actions', header: 'Actions' }
  ];
  perquisitesInfoList = [];
  perquisitesInfoListCopy = [];
  employeeTaxDeclarationId: any;
  empCode: any;
  constructor(private serviceApi: ApiCommonService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog) {
    this.route.queryParams.subscribe(res =>
      this.empCode = res.empCode);
    this.route.params.subscribe(res => {
      this.employeeTaxDeclarationId = res.id;
      console.log(this.employeeTaxDeclarationId);
      this.getPerquisitesDetails();
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


  getPerquisitesDetails() {
    this.perquisitesInfoList = [];
    this.perquisitesInfoListCopy = [];
    this.serviceApi.get("/v1/employee/taxDeclaration/getData/" + this.employeeTaxDeclarationId + "/5").subscribe(res => {
      res.categoryComponentList.forEach(element => {
        this.perquisitesInfoList.push({
          "empTaxDeclareCompDetailId": element.empTaxDeclareCompDetailId,
          "componentName": element.componentName,
          "maximumAmount": element.maximumAmount,
          "appliedAmount": element.appliedAmount,
          "approvedAmount": element.approvedAmount,
          "approvalStatus": element.approvalStatus,
          "attachmentName": element.attachmentName,
          "attachmentLink": element.attachmentLink,
          "attachmentRequired": element.attachmentRequired,
          "employeeTaxDeclarationLogs": element.employeeTaxDeclarationLogs,
          "workFlowRequired": element.workFlowRequired,
          "empRemarks": element.empRemarks,
          "readwrite": false,
          "sectionName": element.sectionName
        })
      });
      this.perquisitesInfoList.forEach(val => this.perquisitesInfoListCopy.push(Object.assign({}, val)));
    }, (err) => {

    }, () => {
      this.dt.reset();
    });
  }

  viewTrasactionHistoryDialog(event: any) {
    let dialogRef = this.dialog.open(ViewPerquisitesTransactionHistoryDialogComponent, {
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
  saveComponents(rowData: any) {
    var perquisitesVOList = [];
    if (rowData.appliedAmount == null) {
      this.warningNotification("Applied amount cannot be empty.");
      return;
    }

    perquisitesVOList.push({
      "taxDeclarationsDetailId": rowData.empTaxDeclareCompDetailId,
      "appliedAmount": +rowData.appliedAmount,
    })

    const body = {
      "employeeTaxDeclarationId": this.employeeTaxDeclarationId,
      "perquisitesVOList": perquisitesVOList
    }
    this.serviceApi.put("/v1/employee/taxDeclaration/update/perquisites", body).subscribe(res => {
      rowData.readwrite = !rowData.readwrite;
      // this.getPerquisitesDetails();
      this.successNotification("Perquisites updated successfully.");
      this.perquisitesInfoList.forEach(element => {
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
      })
    }, () => {

    }, () => {

    });
  }

  resetRow(event: any) {
    var temp = this.perquisitesInfoListCopy.filter(element2 => event.empTaxDeclareCompDetailId == element2.empTaxDeclareCompDetailId)[0];
    this.perquisitesInfoList.forEach(element1 => {
      if (temp.empTaxDeclareCompDetailId == element1.empTaxDeclareCompDetailId) {
        element1.appliedAmount = temp.appliedAmount,
          element1.empRemarks = temp.empRemarks
      }
    })
  }


  ngOnInit() {

  }

  backToNavigate() {
    this.router.navigate(['/employees/edit-employee/' + this.empCode]);
  }
}

@Component({
  templateUrl: 'view-transaction-history-dialog.html',
  styleUrls: ['view-transaction-history-dialog-model.scss']
})

export class ViewPerquisitesTransactionHistoryDialogComponent implements OnInit {
  action: any;
  error: any;
  columns: any[] = [
    { field: 'transactionDate', header: 'Date' },
    { field: 'statement', header: 'Transaction Details' },
    { field: 'generatedBy', header: 'User' }
  ];
  constructor(public dialogRef: MatDialogRef<ViewPerquisitesTransactionHistoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) {
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

