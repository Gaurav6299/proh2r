import { Component, OnInit, Input, ViewChild, Inject, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Headers } from '@angular/http'; `1`
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { NgIf } from '@angular/common/src/directives/ng_if';
import { environment } from '../../../../../../environments/environment';
import { AfterViewInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { ValidationMessagesService } from '../../../../../validation-messages.service';
// import { TemplateeditorComponent } from '../../../../../ckeditor/components/templateeditor/templateeditor.component';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';

declare var $: any;

import { ApiCommonService } from '../../../../../../app/services/api-common.service';
import { DataTable } from 'primeng/primeng';
import { TemplateeditorComponent } from '../../../../../ckeditor/components/templateeditor/templateeditor.component';
var footerIdJS;

declare var $: any;
declare const window: any;
declare var CKEDITOR: any;



@Component({
  selector: 'app-letter-templates',
  templateUrl: './letter-templates.component.html',
  styleUrls: ['./letter-templates.component.scss'],
  entryComponents: [TemplateeditorComponent]

})
export class LetterTemplatesComponent implements OnInit {
  @Output() outputToParent = new EventEmitter<any>();
  @ViewChild("dt1") dt1: DataTable;
  @ViewChild("dt2") dt2: DataTable;
  @ViewChild("dt3") dt3: DataTable;
  @ViewChild("dt4") dt4: DataTable;
  readwrite: boolean;
  readonly: boolean;
  editbuttondivCustomDoc: boolean;
  saveandcanclebuttondivCustomDoc: boolean;
  DocumentCode: any;
  isLeftVisible: false;
  rightPanel: boolean;
  letterTemplate: any;
  headerTemplate: any;
  footerTemplate: any;
  signatory: any;
  footertemplatedata: string = '';
  status: any;
  errorMessage: any;
  action: any
  sectionName = [];
  fieldResponse = [];
  ckEditorContent = "sasas";
  label: any;
  selectedFooterId: any;
  selectedHeaderId: any;
  Letter = [];
  header = [];
  ckeConfig: any;
  footer = [];
  constructor(private router: Router, public dialog: MatDialog, private _fb: FormBuilder, private apiCommonService: ApiCommonService) {

    this.readwrite = false;
    this.readonly = true;
    this.editbuttondivCustomDoc = true;
    this.saveandcanclebuttondivCustomDoc = false;
    this.rightPanel = false;
    this.getLetter();
    this.getHeader();
    this.getFooter();
    this.getSignatory();
    var rolesArr = KeycloakService.getUserRole();
    this.getFields();
  }

  getFields() {
    this.sectionName = [];
    this.fieldResponse = [];

    console.log("field are");
    this.apiCommonService.get("/v1/organization/employeefields/section").
      subscribe(
        res => {
          this.fieldResponse = res;
          for (var i = 0; i < res.length; i++) {
            this.sectionName.push({
              "viewValue": res[i].sectionName,
              "value": res[i].sectionId

            }

            )

          }

        }
      );
  }
  editTemplate(templateId: any, selectedTemplateName: any) {

    if (selectedTemplateName === 'HEADER TEMPLATE') {
      this.apiCommonService.get("/v1/documents/lettertemplates/headerTemplates/" + templateId).
        subscribe(
          res => {
            this.ckEditorContent = "";
            this.label = "";
            this.ckEditorContent = res.templateHeaderBody;
            this.label = res.templateHeaderName;
          }, (err) => {

          }, () => {

            var obj = {
              "templateName": "HEADER TEMPLATE",
              "dialogStatus": "true",
              "sectionName": this.sectionName,
              "ckEditorContent": this.ckEditorContent,
              "label": this.label,
              "selectedTemplateId": templateId
            }
            this.outputToParent.emit(obj);
            window.localStorage.setItem('token', KeycloakService.getMyToken());


            // let dialogRef = this.dialog.open(AddLetterTemplateDialog, {
            //   data: { sectionName: this.sectionName, fieldResponse: this.fieldResponse, label: this.label, templateName: selectedTemplateName, selectedTemplateId: templateId, ckEditorContent: this.ckEditorContent },
            //   panelClass: 'custom-dialog-container',
            // });
            // dialogRef.afterClosed().subscribe(result => {
            //   if (result !== undefined) {
            //     console.log('Result value ..... ' + JSON.stringify(result));
            //     if (result.message) {
            //       console.log('Result value ..... ' + result.message);
            //       if (result.status === 'Response') {
            //         this.errorMessage = result.message;
            //         this.successNotification(this.errorMessage);

            //         this.getSignatory();
            //         this.getFooter();
            //         this.getHeader();
            //         this.getLetter();
            //       }
            //       else if (result.status === 'Error') {
            //         this.errorMessage = result.message;
            //       }
            //     }

            //   }

            // });
            // dialogRef.afterOpen().subscribe(abc => {
            //   $('iframe').contents().find("body").append(this.ckEditorContent);
            // });
          });

    }
    else if (selectedTemplateName === 'FOOTER TEMPLATE') {
      this.apiCommonService.get("/v1/documents/lettertemplates/footerTemplates/" + templateId).
        subscribe(
          res => {
            this.ckEditorContent = "";
            this.label = "";
            this.ckEditorContent = res.templateFooterBody;
            this.label = res.templateFooterName;
          },
          (err) => {

          }, () => {
            var obj = {
              "templateName": "FOOTER TEMPLATE",
              "dialogStatus": "true",
              "sectionName": this.sectionName,
              "ckEditorContent": this.ckEditorContent,
              "label": this.label,
              "selectedTemplateId": templateId
            }
            this.outputToParent.emit(obj);
            window.localStorage.setItem('token', KeycloakService.getMyToken());


            // let dialogRef = this.dialog.open(AddLetterTemplateDialog, {
            //   data: { sectionName: this.sectionName, fieldResponse: this.fieldResponse, label: this.label, templateName: selectedTemplateName, selectedTemplateId: templateId, ckEditorContent: this.ckEditorContent },
            //   panelClass: 'custom-dialog-container',
            // });
            // dialogRef.afterClosed().subscribe(result => {
            //   if (result !== undefined) {
            //     console.log('Result value ..... ' + JSON.stringify(result));
            //     if (result.message) {
            //       console.log('Result value ..... ' + result.message);
            //       if (result.status === 'Response') {
            //         this.errorMessage = result.message;
            //         this.successNotification(this.errorMessage);

            //         this.getSignatory();
            //         this.getFooter();
            //         this.getHeader();
            //         this.getLetter();
            //       }
            //       else if (result.status === 'Error') {
            //         this.errorMessage = result.message;
            //       }
            //     }

            //   }

            // });
            // dialogRef.afterOpen().subscribe(abc => {
            //   $('iframe').contents().find("body").append(this.ckEditorContent);
            // });
          });
    }
    else if (selectedTemplateName === 'LETTER TEMPLATE') {
      this.apiCommonService.get("/v1/documents/lettertemplates/letterTemplate/" + templateId).
        subscribe(
          res => {
            this.ckEditorContent = "";
            this.label = "";
            this.selectedFooterId = undefined;
            this.selectedHeaderId = undefined;
            this.ckEditorContent = res.templateBody;
            this.label = res.templateLabel;
            this.selectedFooterId = res.letterFooterTemplate.footerId
            this.selectedHeaderId = res.letterHeaderTemplate.headerId
            console.log(this.ckEditorContent)
          }, (err) => {

          }, () => {
            var obj = {
              "templateName": "LETTER TEMPLATE",
              "dialogStatus": "true",
              "sectionName": this.sectionName,
              "ckEditorContent": this.ckEditorContent,
              "label": this.label,
              "selectedFooterId": this.selectedFooterId,
              "selectedHeaderId": this.selectedHeaderId,
              "selectedTemplateId": templateId
            }
            this.outputToParent.emit(obj);
            window.localStorage.setItem('token', KeycloakService.getMyToken());



            // let dialogRef = this.dialog.open(AddLetterTemplateDialog, {
            //   data: { sectionName: this.sectionName, fieldResponse: this.fieldResponse, label: this.label, selectedFooterId: this.selectedFooterId, selectedHeaderId: this.selectedHeaderId, templateName: selectedTemplateName, selectedTemplateId: templateId, ckEditorContent: this.ckEditorContent },
            //   panelClass: 'custom-dialog-container',
            // });
            // dialogRef.afterClosed().subscribe(result => {
            //   if (result !== undefined) {
            //     console.log('Result value ..... ' + JSON.stringify(result));
            //     if (result.message) {
            //       console.log('Result value ..... ' + result.message);
            //       if (result.status === 'Response') {
            //         this.errorMessage = result.message;
            //         this.successNotification(this.errorMessage);

            //         this.getSignatory();
            //         this.getFooter();
            //         this.getHeader();
            //         this.getLetter();
            //       }
            //       else if (result.status === 'Error') {
            //         this.errorMessage = result.message;
            //       }
            //     }

            //   }

            // });
            // dialogRef.afterOpen().subscribe(abc => {
            //   console.log("EXECUTED")
            //   // $('iframe').contents().find("body").append("");
            //   $('iframe').contents().find("body").append(this.ckEditorContent);
            // });
          });

    }

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
  noAccess() {
    this.warningNotification('You do not have access to modify letter template');
  }
  getLetter() {
    this.Letter = [];
    this.apiCommonService.get2('/v1/documents/lettertemplates/letterTemplate').
      subscribe(
        res => {
          res.forEach(element => {
            this.Letter.push(
              {
                letterTemplateId: element.letterTemplateId,
                letterHeaderTemplate: element.letterHeaderTemplate,
                letterFooterTemplate: element.letterFooterTemplate,
                templateLabel: element.templateLabel,
                createdOn: element.createdDate,
                lastUpdatedOn: element.modifiedDate,
                actions: ''
              });
          });
          // this.LetterTemplatesdataSource = new MatTableDataSource(Letter);
        }, err => {

        }, () => {
          this.dt1.reset();
          // this.LetterTemplatesdataSource = new MatTableDataSource(Letter);
          console.log('Enter into Else Bloack');
        });


  }
  getHeader() {
    this.header = [];
    this.apiCommonService.get2('/v1/documents/lettertemplates/headerTemplates').
      subscribe(
        res => {
          res.forEach(element => {
            this.header.push(
              {
                headerId: element.headerId,
                templateLabel: element.templateHeaderName,
                createdOn: element.createdDate,
                lastUpdatedOn: element.modifiedDate,
                templateHeaderBody: element.templateHeaderBody
              });
          });
        }, (err) => {

        },
        () => {
          this.dt2.reset();
          // this.HeaderTemplatesdataSource = new MatTableDataSource(header);
          console.log('Enter into Else Bloack');
        }
      );


  }
  getFooter() {
    this.footer = [];
    this.apiCommonService.get2('/v1/documents/lettertemplates/footerTemplates').
      subscribe(
        res => {
          res.forEach(element => {
            this.footer.push(
              {
                footerId: element.footerId,
                templateLabel: element.templateFooterName,
                createdOn: element.createdDate,
                lastUpdatedOn: element.modifiedDate,
                actions: '',
                body: element.templateFooterBody
              });
          });
        }, (err) => {

        },
        () => {
          this.dt3.reset();
          // this.FooterTemplatesdataSource = new MatTableDataSource(footer);
          console.log('Enter into Else Bloack');
        }
      );
  }

  getSignatory() {
    this.signatory = [];
    this.apiCommonService.get2('/v1/documents/lettertemplates/authorizedSignatory').
      subscribe(
        res => {
          res.forEach(element => {
            this.signatory.push(
              {
                authSignatoryId: element.authSignatoryId,
                employeeName: element.employeeName,
                empCode: element.empCode,
                empDesignation: element.empDesignation,

              });
          });

        }, (err) => {

        },
        () => {
          this.dt4.reset();
          // this.AuthorizedSignatorydataSource = new MatTableDataSource(signatory);
          console.log('Enter into Else Bloack');
        }
      );



  }

  activeRightPanel() {
    this.rightPanel = true;
  }
  ngOnInit() {

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
  }

  editMode() {
    this.readwrite = true;
    this.readonly = false;
  }

  readMode() {
    this.readonly = true;
    this.readwrite = false;
  }


  addSignatoryDialog(): void {
    const dialogRef = this.dialog.open(AddSignatoryTemplateDialog, {
      data: { message: this.errorMessage, status: this.action },
      // width: '500px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          if (result.status === 'Response') {
            this.errorMessage = result.message;
            this.successNotification(this.errorMessage);
            this.getSignatory();
          }
          // tslint:disable-next-line:one-line
          else if (result.status === 'Error') {
            console.log(result);
            this.errorMessage = result.message;
            // this.warningNotification(this.errorMessage);
          }
        }
      }

    }, (err) => {

    }, () => {

    });

  }
  openHeaderDeleteDialog(data: any) {
      console.log('headerId=....' + data.headerId);
      const dialogRef = this.dialog.open(DeleteHeaderDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { headerId: data.headerId, message: this.errorMessage, status: this.action }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
              this.getHeader();
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

  openFooterDeleteDialog(data: any) {
      let dialogRef = this.dialog.open(DeleteFooterDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { footerId: data.footerId, message: this.errorMessage, status: this.action }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);

              this.getFooter();
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
  openSignatoryDeleteDialog(data: any) {
      const dialogRef = this.dialog.open(DeleteSignatoryDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { authSignatoryId: data.authSignatoryId, message: this.errorMessage, status: this.action }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);

              this.getSignatory();
            }
            // tslint:disable-next-line:one-line
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
              // this.warningNotification(this.errorMessage);
            }
          }
        }



      }, (err) => {

      }, () => {

      });
  }

  openDeleteLetterDialog(data: any) {
      const dialogRef = this.dialog.open(DeleteLetterDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { letterTemplateId: data.letterTemplateId, message: this.errorMessage, status: this.action }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);

              this.getLetter();
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

  // LetterTemplatesColumns = ['templateLabel', 'createdOn', 'lastUpdatedOn', 'actions'];
  // LetterTemplatesdataSource: MatTableDataSource<LetterTemplates>;

  columns = [
    { field: 'templateLabel', header: 'Template Label' },
    { field: 'createdOn', header: 'Created On' },
    { field: 'lastUpdatedOn', header: 'Last Updated On' },
    { field: 'actions', header: 'Actions' },
  ]
  // HeaderTemplatesColumns = ['templateLabel', 'createdOn', 'lastUpdatedOn', 'actions'];
  // HeaderTemplatesdataSource: MatTableDataSource<HeaderTemplates>;

  // FooterTemplatesColumns = ['templateLabel', 'createdOn', 'lastUpdatedOn', 'actions'];
  // FooterTemplatesdataSource: MatTableDataSource<FooterTemplates>;


  // AuthorizedSignatoryColumns = ['employeeName', 'empDesignation', 'actions'];
  // AuthorizedSignatorydataSource: MatTableDataSource<AuthorizedSignatory>;
  columns1 = [
    { field: 'employeeName', header: 'Name' },
    { field: 'empDesignation', header: 'Designation' },
    { field: 'actions', header: 'Actions' },
  ]


  openLetterTemplate() {
    var obj = {
      "templateName": "LETTER TEMPLATE",
      "dialogStatus": "true",
      "sectionName": this.sectionName
    }
    this.outputToParent.emit(obj);
    window.localStorage.setItem('token', KeycloakService.getMyToken());
    // this.getLetter();

    // const dialogRef = this.dialog.open(AddLetterTemplateDialog, {
    //   data: { sectionName: this.sectionName, fieldResponse: this.fieldResponse, templateName: "LETTER TEMPLATE" },
    //   panelClass: 'custom-dialog-container',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('returning............');
    //   console.log(result);
    //   if (result !== undefined) {
    //     console.log('Result value ..... ' + JSON.stringify(result));
    //     if (result.message) {
    //       console.log('Result value ..... ' + result.message);
    //       if (result.status === 'Response') {
    //         this.errorMessage = result.message;
    //         this.successNotification(this.errorMessage);
    //         this.getLetter();
    //       }
    //       else if (result.status === 'Error') {
    //         this.errorMessage = result.message;
    //       }

    //     }
    //   }
    // });
  }


  openHeaderTemplate() {

    var obj = {
      "templateName": "HEADER TEMPLATE",
      "dialogStatus": "true",
      "sectionName": this.sectionName
    }
    this.outputToParent.emit(obj);
    window.localStorage.setItem('token', KeycloakService.getMyToken());
    // this.getHeader();
    // const dialogRef = this.dialog.open(AddLetterTemplateDialog, {
    //   data: { sectionName: this.sectionName, fieldResponse: this.fieldResponse, templateName: "HEADER TEMPLATE" },
    //   panelClass: 'custom-dialog-container',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     console.log('Result value ..... ' + JSON.stringify(result));
    //     if (result.message) {
    //       console.log('Result value ..... ' + result.message);
    //       if (result.status === 'Response') {
    //         this.errorMessage = result.message;
    //         this.successNotification(this.errorMessage);

    //         this.getHeader();
    //       }
    //       else if (result.status === 'Error') {
    //         this.errorMessage = result.message;
    //       }
    //     }


    //   }


    // });

  }

  openFooterTemplate() {
    var obj = {
      "templateName": "FOOTER TEMPLATE",
      "dialogStatus": "true",
      "sectionName": this.sectionName
    }
    this.outputToParent.emit(obj);
    window.localStorage.setItem('token', KeycloakService.getMyToken());
    // this.getFooter();
    // const dialogRef = this.dialog.open(AddLetterTemplateDialog, {
    //   data: { sectionName: this.sectionName, fieldResponse: this.fieldResponse, templateName: "FOOTER TEMPLATE" },
    //   panelClass: 'custom-dialog-container',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     console.log('Result value ..... ' + JSON.stringify(result));
    //     if (result.message) {
    //       console.log('Result value ..... ' + result.message);
    //       if (result.status === 'Response') {
    //         this.errorMessage = result.message;
    //         this.successNotification(this.errorMessage);

    //         this.getFooter();
    //       }
    //       else if (result.status === 'Error') {
    //         this.errorMessage = result.message;
    //       }
    //     }

    //   }

    // });

  }

}

export interface LetterTemplates {
  letterTemplateId: number;
  letterHeaderTemplate: any;
  templateLabel: any;
  createdOn: any;
  lastUpdatedOn: any;
  actions: any;
}

export interface HeaderTemplates {
  templateLabel: any;
  createdOn: any;
  lastUpdatedOn: any;
  actions: any;
}

export interface FooterTemplates {
  templateLabel: any;
  createdOn: any;
  lastUpdatedOn: any;
  actions: any;
}
export interface AuthorizedSignatory {
  employeeName: any;
  empDesignation: any;
  actions: any;
}

let Letter = [];
let header = [];
let footer = [];
let signatory = [];



// @Component({
//   selector: 'app-letter-template-dialog',
//   templateUrl: 'letter-template-dialog.html',
//   styleUrls: ['./templates-dialog.scss']

// })
// export class AddLetterTemplateDialog implements OnInit {

//   error = 'Error Message';
//   action: any;
//   message: any;
//   status: any;
//   fieldResponse = [];
//   sectionName = [];
//   fields = [];
//   templateName: any;
//   headerArr = [];
//   footerArr = [];
//   tempalteFormGroup: FormGroup;
//   ckeConfig: any;
//   requiredTextField;
//   requiredDropdownButton;

//   template: any;
//   ckEditorContent = "";
//   constructor(
//     public dialogRef: MatDialogRef<AddLetterTemplateDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private apiCommonService: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
//     this.sectionName = this.data.sectionName;
//     this.fieldResponse = this.data.fieldResponse;
//     this.templateName = this.data.templateName;
//     this.ckEditorContent = this.data.ckEditorContent
//     console.log(data);
//     this.tempalteFormGroup = this._fb.group({
//       selectedSectionField: [],
//       selectedHeaderId: ['', Validators.required],
//       selectedFooterId: ['', Validators.required],
//       selectedPlaceholder: [],
//       newTemplateName: ['', Validators.required]
//     });
//     if (this.data.label != undefined) {
//       this.tempalteFormGroup.controls.newTemplateName.setValue(this.data.label);
//     }
//     if (this.data.templateName = "LETTER TEMPLATE") {
//       this.tempalteFormGroup.controls.selectedHeaderId.setValue(this.data.selectedHeaderId);
//       this.tempalteFormGroup.controls.selectedFooterId.setValue(this.data.selectedFooterId);
//     }
//     this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
//     this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);

//     this.getHeaderAndFooter();

//   }
//   successNotification(successMessage: any) {
//     $.notifyClose();
//     $.notify({
//       icon: 'check_circle',
//       message: successMessage,
//     },
//       {
//         type: 'success',
//         timer: 4000,
//         placement: {
//           from: 'top',
//           align: 'center'
//         }
//       });
//   }
//   warningNotification(warningMessage: any) {
//     $.notifyClose();
//     $.notify({
//       icon: 'error',
//       message: warningMessage,
//     },
//       {
//         type: 'warning',
//         timer: 4000,
//         placement: {
//           from: 'top',
//           align: 'center'
//         }
//       });
//   }
//   ngOnInit() {
//     this.ckeConfig = {
//       allowedContent: false,
//       extraPlugins: 'divarea',
//       forcePasteAsPlainText: true
//     };
//   }
//   getHeaderAndFooter() {
//     this.headerArr = [];
//     this.footerArr = [];
//     this.apiCommonService.get("/v1/documents/lettertemplates/footerTemplates").
//       subscribe(
//       res => {
//         res.forEach(element => {
//           this.footerArr.push({
//             "footerId": element.footerId,
//             "templateFooterName": element.templateFooterName
//           })
//         });
//       })

//     this.apiCommonService.get("/v1/documents/lettertemplates/headerTemplates").
//       subscribe(
//       res => {
//         res.forEach(element => {
//           this.headerArr.push({
//             "headerId": element.headerId,
//             "templateHeaderName": element.templateHeaderName
//           })
//         });
//       })

//   }

//   selectedSection() {
//     console.log(this.fieldResponse);
//     console.log(this.tempalteFormGroup.controls.selectedSectionField.value);
//     this.fields = [];
//     var temp = [];
//     this.fieldResponse.filter(section => {
//       if (section.sectionId === this.tempalteFormGroup.controls.selectedSectionField.value) {

//         temp = section.fields;
//         for (var i = 0; i < temp.length; i++) {
//           this.fields.push({
//             "value": temp[i].fieldPlaceholder,
//             "fieldName": temp[i].fieldName
//           })

//         }

//       }
//     });

//   }

//   choosePlaceholder() {
//     var placeHolder = "${" + this.tempalteFormGroup.controls.selectedPlaceholder.value + "}";

//     $('iframe').contents().find("body").append(placeHolder);

//   }

//   saveTemplate(templateName: any) {

//     if (templateName === 'LETTER TEMPLATE') {
//       if (this.tempalteFormGroup.controls.selectedHeaderId.valid && this.tempalteFormGroup.controls.selectedFooterId.valid && this.tempalteFormGroup.controls.newTemplateName.valid) {

//         if (this.data.selectedTemplateId === undefined) {
//           const body = {

//             "letterFooterTemplate": {
//               "footerId": this.tempalteFormGroup.controls.selectedFooterId.value,
//             },
//             "letterHeaderTemplate": {
//               "headerId": this.tempalteFormGroup.controls.selectedHeaderId.value,
//             },
//             "letterTemplateId": 0,
//             "templateBody": $('iframe').contents().find("body").html(),
//             "templateLabel": this.tempalteFormGroup.controls.newTemplateName.value
//           }
//           this.apiCommonService.post("/v1/documents/lettertemplates/letterTemplate", body).
//             subscribe(
//             res => {
//               this.action = 'Response';
//               this.error = res.message;
//               console.log(res);
//               this.close();
//               this.successNotification("Letter Tempalte Created Successfully");

//             });
//         }
//         else {
//           const body = {

//             "letterFooterTemplate": {
//               "footerId": this.tempalteFormGroup.controls.selectedFooterId.value,
//             },
//             "letterHeaderTemplate": {
//               "headerId": this.tempalteFormGroup.controls.selectedHeaderId.value,
//             },
//             "templateBody": $('iframe').contents().find("body").html(),
//             "templateLabel": this.tempalteFormGroup.controls.newTemplateName.value
//           }
//           this.apiCommonService.put("/v1/documents/lettertemplates/letterTemplate/" + this.data.selectedTemplateId, body).
//             subscribe(
//             res => {
//               console.log(res);
//               this.action = 'Response';
//               this.error = res.message;
//               this.close();
//               this.successNotification("Letter Tempalte Updated Successfully");

//             });

//         }
//       }
//       else {
//         Object.keys(this.tempalteFormGroup.controls).forEach(field => {
//           const control = this.tempalteFormGroup.get(field);            
//           control.markAsTouched({ onlySelf: true });     
//         });
//       }
//     }

//     if (templateName === 'HEADER TEMPLATE') {
//       if (this.tempalteFormGroup.controls.newTemplateName.valid) {
//         if (this.data.selectedTemplateId === undefined) {
//           const body = {
//             "headerId": 0,
//             "templateHeaderBody": $('iframe').contents().find("body").html(),
//             "templateHeaderName": this.tempalteFormGroup.controls.newTemplateName.value
//           }
//           this.apiCommonService.post("/v1/documents/lettertemplates/headerTemplates", body).
//             subscribe(
//             res => {
//               console.log(res);
//               this.action = 'Response';
//               this.error = res.message;
//               this.close();
//               this.successNotification("Header Tempalte Created Successfully");

//             });
//         }
//         else {
//           const body = {
//             "templateHeaderBody": $('iframe').contents().find("body").html(),
//             "templateHeaderName": this.tempalteFormGroup.controls.newTemplateName.value
//           }
//           this.apiCommonService.put("/v1/documents/lettertemplates/headerTemplates/" + this.data.selectedTemplateId, body).
//             subscribe(
//             res => {
//               console.log(res);
//               this.action = 'Response';
//               this.error = res.message;
//               this.close();
//               this.successNotification("Header Tempalte Updated Successfully");

//             });

//         }
//       } else {
//         Object.keys(this.tempalteFormGroup.controls).forEach(field => { 
//           const control = this.tempalteFormGroup.get(field);           
//           control.markAsTouched({ onlySelf: true });      
//         });
//       }
//     }

//     if (templateName === 'FOOTER TEMPLATE') {
//       if (this.tempalteFormGroup.controls.newTemplateName.valid) {
//         if (this.data.selectedTemplateId === undefined) {
//           const body = {
//             "footerId": 0,
//             "templateFooterBody": $('iframe').contents().find("body").html(),
//             "templateFooterName": this.tempalteFormGroup.controls.newTemplateName.value
//           }
//           this.apiCommonService.post("/v1/documents/lettertemplates/footerTemplate", body).
//             subscribe(
//             res => {
//               console.log(res);
//               this.action = 'Response';
//               this.error = res.message;
//               this.close();
//               this.successNotification("Footer Tempalte Created Successfully");

//             });
//         }
//         else {
//           const body = {
//             "templateFooterBody": $('iframe').contents().find("body").html(),
//             "templateFooterName": this.tempalteFormGroup.controls.newTemplateName.value
//           }
//           this.apiCommonService.put("/v1/documents/lettertemplates/footerTemplates/" + this.data.selectedTemplateId, body).
//             subscribe(
//             res => {
//               console.log(res);
//               this.action = 'Response';
//               this.error = res.message;
//               this.close();
//               this.successNotification("Footer Tempalte Updated Successfully");

//             });

//         }
//       } else {
//         Object.keys(this.tempalteFormGroup.controls).forEach(field => {
//           const control = this.tempalteFormGroup.get(field);           
//           control.markAsTouched({ onlySelf: true });       
//         });
//       }

//     }
//   }
//   close(): void {
//     this.data.message = this.error;
//     this.data.status = this.action;
//     this.dialogRef.close(this.data);
//   }
//   onNoClick(): void {

//     this.dialogRef.close();
//   }


// }

@Component({
  selector: 'app-signatory-template-dialog',
  templateUrl: 'authorized-Signatory-dialog.html',
  styleUrls: ['./templates-dialog.scss']

})
export class AddSignatoryTemplateDialog implements OnInit {


  requiredDropdownButton
  error = 'Error Message';
  action: any;
  message: any;
  status: any;

  addSignatory: FormGroup;
  employee = [];
  designation: boolean;
  empCode: any;
  selectedEmpDes: any;
  selectedEmpName: any;
  public ckeditorContent: any;
  ngOnInit() {
    this.addSignatory = this._fb.group({
      empdesignation: [''],
      empName: ['', [Validators.required]]



    });
  }




  constructor(
    public dialogRef: MatDialogRef<AddSignatoryTemplateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private http: Http, private _fb: FormBuilder,
    private apiCommonService: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
    this.designation = false;
    this.getEmployee();
    this.message = this.data.message;
    this.status = this.data.status;

  }
  getEmployee() {
    this.employee = [];
    // this.ApiCommonService.get('/v1/employee/').
    this.apiCommonService.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            this.employee.push(
              {
                empCode: element.empCode,
                empName: element.empFirstName + " " + element.empLastName,
                empJobInfoDesignation: element.empJobInfoDesignation

              });
          });

        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );


  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

  saveSignatory() {
    if (this.addSignatory.valid) {
      const bearerData = '';
      const body = {
        'authSignatoryId': 0,
        'employeeName': this.selectedEmpName,
        'empCode': this.empCode,
        'empDesignation': this.selectedEmpDes

      };

      //this.ApiCommonService.post('/v1/documents/lettertemplates/authorizedSignatory/', body).subscribe(
      this.apiCommonService.post('/v1/documents/lettertemplates/authorizedSignatory', body)
        .
        subscribe(
          res => {
            console.log('resposne --> ' + res);
            this.action = 'Response';
            this.error = res.message;
            this.close()
          },
          err => {
            console.log('there is something error.....  ' + err.message);
            this.action = 'Error';
            this.error = err.error.message;
            this.close();
          }
        );
      //  new LetterTemplatesComponent(this.dialog,this._fb,this.apiCommonService).getSignatory();
    } else {
      Object.keys(this.addSignatory.controls).forEach(field => { // {1}
        const control = this.addSignatory.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }


  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  showDesignation(empCode: any) {
    this.designation = true;
    this.empCode = empCode;
    for (var i = 0; i < this.employee.length; i++) {
      if (this.employee[i].empCode === this.empCode) {
        this.selectedEmpDes = this.employee[i].empJobInfoDesignation;
        this.selectedEmpName = this.employee[i].empName;
      }


    }
    this.addSignatory.controls.empdesignation.setValue(this.selectedEmpDes);

    this.addSignatory.controls.empdesignation.disable();



  }
}
@Component({
  selector: 'delete-header-dialog',
  templateUrl: 'delete-header-template-dialog.html',
  styleUrls: ['delete-template.scss'],
})
export class DeleteHeaderDialog {
  error = 'Error Message';
  action: any;
  message: any;
  status: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteHeaderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private apiCommonService: ApiCommonService) {
    this.message = this.data.message;
    this.status = this.data.status;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {

    const val = this.data.headerId;

    console.log('onDelete headerId=' + val);
    this.apiCommonService.delete('/v1/documents/lettertemplates/headerTemplates/' + val)

      .subscribe(
        res => {
          console.log('Header data deleted successfully');
          this.action = 'Response';
          this.error = res.message;
          this.close()

        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }
      );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

}
@Component({
  selector: 'delete-footer-dialog',
  templateUrl: 'delete-footer-template-dialog.html',
  styleUrls: ['delete-template.scss'],
})
export class DeleteFooterDialog {
  error = 'Error Message';
  action: any;
  message: any;
  status: any;
  public bankInformationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DeleteFooterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private apiCommonService: ApiCommonService) {
    this.message = this.data.message;
    this.status = this.data.status;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    const val = this.data.footerId;
    this.apiCommonService.delete('/v1/documents/lettertemplates/footerTemplates/' + this.data.footerId)

      .subscribe(
        res => {
          console.log('Footer data deleted successfully');
          this.action = 'Response';
          this.error = res.message;
          this.close()

        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }
      );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }



}
@Component({
  selector: 'delete-letter-dialog',
  templateUrl: 'delete-letter-template-dialog.html',
  styleUrls: ['delete-template.scss'],
})
export class DeleteLetterDialog {
  error = 'Error Message';
  action: any;
  message: any;
  status: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteLetterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private apiCommonService: ApiCommonService) {
    this.message = this.data.message;
    this.status = this.data.status;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {
    const val = this.data.letterTemplateId;
    this.apiCommonService.delete('/v1/documents/lettertemplates/letterTemplate/' + val)

      .subscribe(
        res => {
          console.log('Letter Deleted Successfully...' + JSON.stringify(res));
          this.action = 'Response';
          this.error = res.message;
          this.close();

        },
        err => {
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }
      );

  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }

}
@Component({
  selector: 'delete-signatory-dialog',
  templateUrl: 'delete-signatory-dialog.html',
  styleUrls: ['delete-template.scss'],
})
export class DeleteSignatoryDialog {

  error = 'Error Message';
  action: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteSignatoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private _fb: FormBuilder, private apiCommonService: ApiCommonService) {
    // this.message = this.data.message;
    // this.status = this.data.status;
  }
  authSignatoryId
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete() {

    const val = this.data.authSignatoryId;
    this.apiCommonService.delete('/v1/documents/lettertemplates/authorizedSignatory/' + val)
      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close()
          console.log('Signatory data deleted successfully');

        },
        err => {
          this.action = 'Error';
          this.error = err.message;
          console.log('there is something error.....  ' + err.message);
          this.action = 'Error';
          this.error = err.message;
          this.close();
        }
      );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
    console.log(this.data);
  }


}










