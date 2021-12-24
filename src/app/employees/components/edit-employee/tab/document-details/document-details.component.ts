import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import 'rxjs/add/operator/map';
import { NgIf } from '@angular/common/src/directives/ng_if';
import { environment } from '../../../../../../environments/environment';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { UploadFileService } from '../../../../../../app/services/UploadFileService.service';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
declare var $: any;

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit {
  empDocId: any;
  empCode: any;
  docURL: any;
  errorMessage: any;
  action: any;
  documentDetailsDisplayedColumns = ['document', 'updatedAt', 'actions'];
  document: MatTableDataSource<DocumentDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  documentsList: any;
  catListData: any[];
  selectedDocumentList: any[];
  // tslint:disable-next-line:max-line-length
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog, private route: ActivatedRoute, private uploadFileService: UploadFileService, private http: Http) {
    this.route.params.subscribe(res => {
      this.empCode = res.id;
    });
    //  console.log('Inside document constructor------');
    this.getDocuments();
    var rolesArr = KeycloakService.getUserRole();
    this.getAllCategoryInformation();
  }
  ngOnInit() {
  }

  getAllCategoryInformation() {
    this.catListData = [];
    this.serviceApi.get('/v1/emp/getAll').
      subscribe(
        res => {
          res.forEach(element => {
            this.catListData.push({
              categoryName: element.categoryName,
              categoryId: element.categoryId
            });
          });

        }, (err) => {

        }, () => {

        });
  }

  setDocumentCategory(category: any) {
    console.log(category.value);
    this.selectedDocumentList = this.documentsList;
    console.log(this.selectedDocumentList);
    this.selectedDocumentList = this.selectedDocumentList.filter(doc => +doc.categoryId === +category.value);
    console.log(this.selectedDocumentList);
    this.document = new MatTableDataSource<DocumentDetails>(this.selectedDocumentList);
    this.selectedDocumentList = this.documentsList;
    this.document.paginator = this.paginator;
    this.document.sort = this.sort;

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
  getDocuments() {
    console.log('Inside All Documents List......');
    this.documentsList = [];
    this.serviceApi.get('/v1/document/admin/' + this.empCode + '/user').subscribe(
      res => {
        console.log('response:::' + JSON.stringify(res));
        console.log(res);
        if (res != null) {
          res.forEach(element => {
            this.documentsList.push({
              documentName: element.documentName,
              empDocRecordId: element.empDocRecordId,
              docCategoryAppliedOnEmps: element.docCategoryAppliedOnEmps,
              employeeType: element.employeeType,
              documentDescription: element.documentDescription,
              accessLevel: element.accessLevel,
              documentUrl: '',
              categoryId: element.categoryId

            });
          });
          this.document = new MatTableDataSource<DocumentDetails>(this.documentsList);
          this.document.paginator = this.paginator;
          this.document.sort = this.sort;
        } else {
          console.log('Data Doesnot Exist');
        }

      }, (err) => {

      }, () => {
        this.selectedDocumentList = this.documentsList;

      });
    this.serviceApi.get('/v1/documents/generatedLetters/admin/' + this.empCode + '/user').subscribe(
      res => {
        console.log('response generatedLetters:::' + JSON.stringify(res));
        //  console.log(res);
        if (res != null) {
          res.forEach(element => {
            this.documentsList.push({
              documentName: element.documentName,
              empDocRecordId: element.documentId,
              docCategoryAppliedOnEmps: [],
              documentDescription: element.letterTemplateName,
              employeeType: '',
              accessLevel: 'Template',
              documentUrl: element.documentUrl,
            });
          });
          this.document = new MatTableDataSource<DocumentDetails>(this.documentsList);
          this.document.paginator = this.paginator;
          this.document.sort = this.sort;
        } else {
          console.log('Data Doesnot Exist');
        }

      });
  }
  downloadDocument(docCategoryAppliedOnEmps: any) {

    if (docCategoryAppliedOnEmps !== null) {
      if (docCategoryAppliedOnEmps.doucumentUrlId !== null)
        window.open(docCategoryAppliedOnEmps.doucumentUrlId);
      else
        this.warningNotification("Document not uploaded regarding this category");
    }
    else {
      this.warningNotification("Document not uploaded regarding this category");
    }


  }
  downloadLetterTemplate(empDocRecordId: any) {
    console.log('Letter Template  ID...' + empDocRecordId)
    this.documentsList.forEach(element1 => {
      if (empDocRecordId === element1.empDocRecordId) {
        this.docURL = element1.documentUrl;
      }
    });
    console.log('Document URl ----' + this.docURL);
    window.open(this.docURL);


  }

  uploadDocument(empDocRecordId: any, docCategoryAppliedOnEmps: any) {
      this.errorMessage = '';
      this.action = '';
      const dialogRef = this.dialog.open(UploadDocumentComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {
          empCode: this.empCode,
          empDocRecordId: empDocRecordId,
          docCategoryAppliedOnEmps: docCategoryAppliedOnEmps,
          message: this.errorMessage,
          status: this.action
        }
      });
      // dialogRef.close();
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
              this.getDocuments();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }
        }
      });
  }
  // uploadDocFile(empDocRecordId: any) {
  //   console.log('upload Document clicked--------' + JSON.stringify(empDocRecordId));
  //   this.empDocId = '';
  //   empDocRecordId.forEach(element1 => {
  //         if (this.empCode === element1.empCode) {
  //          this.empDocId = element1.applyOnEmpRecordId;
  //         }
  //       });
  //   $('#uploadDoc').click();
  // }

  // selectDoc(event) {
  //   this.selectedFiles = event.target.files;
  //   console.log('Selected Document clicked--------' + this.selectedFiles);
  //   this.uploadDoc();
  // }

  // uploadDoc() {
  //   console.log('upload document method called-----------------------------------');
  //   this.currentFileUpload = this.selectedFiles.item(0);
  //   const file = <File>this.currentFileUpload;
  //   let formdata: FormData = new FormData();
  //   formdata.append('file', file);
  //   // const url = '/v1/employee/profile/' + this.empCode + '/uploadFile';
  //   const url = '/v1/document/upload?empCode=' + this.empCode + '&applyOnEmpRecordId=' + this.empDocId;
  //   this.uploadFileService.pushFileToStorage(this.currentFileUpload, url).subscribe(event => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //     } else if (event instanceof HttpResponse) {
  //       console.log('File is completely uploaded!');
  //       this.successNotification('Document Uploaded Successfully');
  //     }
  //   },
  //     err => {
  //       console.log('error :::' + JSON.stringify(err));
  //     },
  //     () => {
  //      // this.getEmployeesData();
  //     }
  //   );
  //   this.selectedFiles = undefined;
  // }
}
export interface DocumentDetails {
  document: string;
  documentDescription: string;
  updatedAt: string;
}
@Component({
  templateUrl: './uploadDocument.component.html',
  styleUrls: ['./dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class UploadDocumentComponent implements OnInit {
  action: any;
  error: any;
  empDocId: any;
  selectedFiles: any;
  currentFileUpload: any;
  empCode: any;
  docURL: any;
  empDocRecordId: any;
  myFile: any;
  docId: any;
  constructor(public dialogRef: MatDialogRef<UploadDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    // tslint:disable-next-line:max-line-length
    private serviceApi: ApiCommonService, public dialog: MatDialog, private route: ActivatedRoute, private uploadFileService: UploadFileService) {
    this.empCode = data.empCode;
    if (data.docCategoryAppliedOnEmps !== null) {
      this.docId = data.docCategoryAppliedOnEmps.applyOnEmpRecordId
    }
    else {
      this.docId = 0;
    }
  }


  selectDoc(event) {
    this.myFile = '';
    this.selectedFiles = event.target.files;
    console.log('Selected Document clicked--------' + this.selectedFiles);

  }
  uploadDoc() {
    console.log('upload document method called-----------------------------------' + this.selectedFiles);
    if (this.selectedFiles !== undefined) {
      this.currentFileUpload = this.selectedFiles.item(0);
      const file = <File>this.currentFileUpload;
      let formdata: FormData = new FormData();
      formdata.append('file', file);
      // const url = '/v1/employee/profile/' + this.empCode + '/uploadFile';
      const url = '/v1/document/upload?empCode=' + this.empCode + '&empDocRecordId=' + this.data.empDocRecordId + '&applyOnEmpRecordId=' + this.docId;
      this.uploadFileService.pushFileToStorage(this.currentFileUpload, url).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
        } else if (event instanceof HttpResponse) {
          // console.log(event);
          //    console.log('Successfully...' + JSON.stringify(event));
          this.action = 'Response';

          //  console.log(JSON.parse(event.body.toString()));
          this.error = event.body['message'];
          this.close();
          console.log('File is completely uploaded!');
        }
      },
        err => {
          console.log(err);

          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = JSON.parse(err.error.toString()).message;

          this.close();
        },
        () => {
          // this.getEmployeesData();
        }
      );
      this.selectedFiles = undefined;
    }
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