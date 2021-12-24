import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CompanyPolicyDocumentsComponent } from './tabs/company-policy-documents/company-policy-documents.component';
import { EmployeeDocumentCategoriesComponent, CategoryDetailsComponent } from './tabs/employee-document-categories/employee-document-categories.component';
import { LetterTemplatesComponent } from './tabs/letter-templates/letter-templates.component';
import { GeneratedLettersComponent } from './tabs/generated-letters/generated-letters.component';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Inject } from '@angular/core';
import { ApiCommonService } from '../../../services/api-common.service'

import { ValidationMessagesService } from '../../../validation-messages.service';
declare var $: any;
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  @ViewChild(CompanyPolicyDocumentsComponent) companyPolicyDocChild: CompanyPolicyDocumentsComponent;
  @ViewChild(CategoryDetailsComponent) categoryDetailsComponentChild: CategoryDetailsComponent;
  @ViewChild(LetterTemplatesComponent) lettertemplateChild: LetterTemplatesComponent;
  @ViewChild(GeneratedLettersComponent) generateLetterChild: GeneratedLettersComponent;
  @ViewChild(EmployeeDocumentCategoriesComponent) employeeDocumentCategoriesComponentChild: EmployeeDocumentCategoriesComponent;
  templateName: any;
  showCkEditor = false;
  panelFirstWidth: any;
  panelFirstHeight: any;
  currentTab = 0;
  tempalteFormGroup: FormGroup;
  fields = [];
  fieldResponse = [];
  sectionName = [];
  headerArr = [];
  footerArr = [];
  requiredTextField;
  requiredDropdownButton;
  @ViewChild('formDirective') form;

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

  constructor(public dialog: MatDialog, private _fb: FormBuilder, private apiCommonService: ApiCommonService, private validationMessagesService: ValidationMessagesService) {
    this.getFields();
    this.getHeaderAndFooter();
  }

  ngOnInit() {
    this.tempalteFormGroup = this._fb.group({
      templateId: [''],
      selectedSectionField: [],
      selectedHeaderId: ['', Validators.required],
      selectedFooterId: ['', Validators.required],
      selectedPlaceholder: [],
      newTemplateName: ['', Validators.required]
    });
  }

  closeDialog() {
    this.showCkEditor = false;
  }

  onTabChange() {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }

  onLinkClick(event: MatTabChangeEvent) {
    // console.log('event => ', event);
    // console.log('index => ', event.index);
    // console.log('tab => ', event.tab);
    // this.currentTab = event.index;
    this.showCkEditor = false;
    if (event.index === 0) {
      // this.companyPolicyDocChild.isLeftVisible = false;
      this.companyPolicyDocChild.getAllTableData();
    } else if (event.index === 1) {
      // this.empDocCategoriesComponentChild.isLeftVisible = false;
      // this.empDocCategoriesComponentChild.getDocument();
      this.categoryDetailsComponentChild.getAllCategoryInformation();
    }
    else if (event.index === 2) {
      this.employeeDocumentCategoriesComponentChild.isLeftVisible = false;
      this.employeeDocumentCategoriesComponentChild.getDocument();
      this.employeeDocumentCategoriesComponentChild.getAllCategoryInformation();
    }

    else if (event.index === 3) {
      this.lettertemplateChild.getLetter();
      this.lettertemplateChild.getFooter();
      this.lettertemplateChild.getHeader();
      this.lettertemplateChild.getSignatory();
      // this.showCkEditor = true;
    } else if (event.index === 4) {
      this.generateLetterChild.getGeneratedLetter();
    } else {

    }

    // empDocCategoriesComponentChild
  }
  openCkEditorDialog(event: any) {
    this.getHeaderAndFooter();
    console.log(event);
    this.showCkEditor = event.dialogStatus;
    this.templateName = event.templateName;
    this.sectionName = event.sectionName;
    $('iframe').contents().find("body").html("");
    this.tempalteFormGroup.reset();
    this.form.resetForm();
    if (event.label != undefined) {
      this.tempalteFormGroup.controls.newTemplateName.setValue(event.label);
      $('iframe').contents().find("body").html(event.ckEditorContent);
      this.tempalteFormGroup.controls.templateId.setValue(event.selectedTemplateId);
    }
    if (event.templateName = "LETTER TEMPLATE") {
      this.tempalteFormGroup.controls.selectedHeaderId.setValue(event.selectedHeaderId);
      this.tempalteFormGroup.controls.selectedFooterId.setValue(event.selectedFooterId);
    }
    this.validationMessagesService.currentRequiredTextField.subscribe(message => this.requiredTextField = message);
    this.validationMessagesService.currentRequiredDropdownButton.subscribe(message => this.requiredDropdownButton = message);
  }

  selectedSection() {
    console.log(this.fieldResponse);
    console.log(this.tempalteFormGroup.controls.selectedSectionField.value);
    this.fields = [];
    var temp = [];
    this.fieldResponse.filter(section => {
      if (section.sectionId === this.tempalteFormGroup.controls.selectedSectionField.value) {

        temp = section.fields;
        for (var i = 0; i < temp.length; i++) {
          this.fields.push({
            "value": temp[i].fieldPlaceholder,
            "fieldName": temp[i].fieldName
          })

        }

      }
    });
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


  getHeaderAndFooter() {
    this.headerArr = [];
    this.footerArr = [];
    this.apiCommonService.get("/v1/documents/lettertemplates/footerTemplates").
      subscribe(
      res => {
        res.forEach(element => {
          this.footerArr.push({
            "footerId": element.footerId,
            "templateFooterName": element.templateFooterName
            // "templateFooterBody": "<html><body><p>bvhbjghkgjkg</p>\n</body></html>"
          })
        });
      })

    this.apiCommonService.get("/v1/documents/lettertemplates/headerTemplates").
      subscribe(
      res => {
        res.forEach(element => {
          this.headerArr.push({
            "headerId": element.headerId,
            "templateHeaderName": element.templateHeaderName
            // "templateFooterBody": "<html><body><p>bvhbjghkgjkg</p>\n</body></html>"
          })
        });
      })

  }

  choosePlaceholder() {
    var placeHolder = "${" + this.tempalteFormGroup.controls.selectedPlaceholder.value + "}";

    $('iframe').contents().find("body").append(placeHolder);

  }

  saveTemplate(templateName: any) {
    if (templateName === 'LETTER TEMPLATE') {
      if (this.tempalteFormGroup.controls.selectedHeaderId.valid && this.tempalteFormGroup.controls.selectedFooterId.valid && this.tempalteFormGroup.controls.newTemplateName.valid) {

        if (this.tempalteFormGroup.controls.templateId.value === null) {
          const body = {

            "letterFooterTemplate": {
              "footerId": this.tempalteFormGroup.controls.selectedFooterId.value,
            },
            "letterHeaderTemplate": {
              "headerId": this.tempalteFormGroup.controls.selectedHeaderId.value,
            },
            "letterTemplateId": 0,
            "templateBody": $('iframe').contents().find("body").html(),
            "templateLabel": this.tempalteFormGroup.controls.newTemplateName.value
          }
          this.apiCommonService.post("/v1/documents/lettertemplates/letterTemplate", body).
            subscribe(
            res => {
              this.closeDialog();
              this.successNotification("Letter Tempalte Created Successfully");

            }, (err) => {

            }, () => {
              this.lettertemplateChild.getSignatory();
              this.lettertemplateChild.getFooter();
              this.lettertemplateChild.getHeader();
              this.lettertemplateChild.getLetter();
            });
        }
        else {
          const body = {

            "letterFooterTemplate": {
              "footerId": this.tempalteFormGroup.controls.selectedFooterId.value,
            },
            "letterHeaderTemplate": {
              "headerId": this.tempalteFormGroup.controls.selectedHeaderId.value,
            },
            "templateBody": $('iframe').contents().find("body").html(),
            "templateLabel": this.tempalteFormGroup.controls.newTemplateName.value
          }
          this.apiCommonService.put("/v1/documents/lettertemplates/letterTemplate/" + this.tempalteFormGroup.controls.templateId.value, body).
            subscribe(
            res => {
              console.log(res);
              this.closeDialog();
              this.successNotification("Letter Tempalte Updated Successfully");

            }, (err) => {

            }, () => {
              this.lettertemplateChild.getSignatory();
              this.lettertemplateChild.getFooter();
              this.lettertemplateChild.getHeader();
              this.lettertemplateChild.getLetter();
            });

        }
      }
      else {
        Object.keys(this.tempalteFormGroup.controls).forEach(field => { // {1}
          const control = this.tempalteFormGroup.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    }

    if (templateName === 'HEADER TEMPLATE') {
      if (this.tempalteFormGroup.controls.newTemplateName.valid) {
        if (this.tempalteFormGroup.controls.templateId.value === null) {
          const body = {
            "headerId": 0,
            "templateHeaderBody": $('iframe').contents().find("body").html(),
            "templateHeaderName": this.tempalteFormGroup.controls.newTemplateName.value
          }
          this.apiCommonService.post("/v1/documents/lettertemplates/headerTemplates", body).
            subscribe(
            res => {
              console.log(res);
              this.closeDialog();
              this.successNotification("Header Tempalte Created Successfully");

            }, (err) => {

            }, () => {
              this.lettertemplateChild.getLetter();
              this.lettertemplateChild.getSignatory();
              this.lettertemplateChild.getFooter();
              this.lettertemplateChild.getHeader();
              this.lettertemplateChild.getLetter();
            });
        }
        else {
          const body = {
            "templateHeaderBody": $('iframe').contents().find("body").html(),
            "templateHeaderName": this.tempalteFormGroup.controls.newTemplateName.value
          }
          this.apiCommonService.put("/v1/documents/lettertemplates/headerTemplates/" + this.tempalteFormGroup.controls.templateId.value, body).
            subscribe(
            res => {
              console.log(res);
              this.closeDialog();
              this.successNotification("Header Tempalte Updated Successfully");

            }, (err) => {

            }, () => {
              this.lettertemplateChild.getLetter();
              this.lettertemplateChild.getSignatory();
              this.lettertemplateChild.getFooter();
              this.lettertemplateChild.getHeader();
              this.lettertemplateChild.getLetter();
            });

        }
      } else {
        Object.keys(this.tempalteFormGroup.controls).forEach(field => { // {1}
          const control = this.tempalteFormGroup.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
    }

    if (templateName === 'FOOTER TEMPLATE') {
      if (this.tempalteFormGroup.controls.newTemplateName.valid) {
        if (this.tempalteFormGroup.controls.templateId.value === null) {
          const body = {
            "footerId": 0,
            "templateFooterBody": $('iframe').contents().find("body").html(),
            "templateFooterName": this.tempalteFormGroup.controls.newTemplateName.value
          }
          this.apiCommonService.post("/v1/documents/lettertemplates/footerTemplate", body).
            subscribe(
            res => {
              console.log(res);
              this.closeDialog();
              this.successNotification("Footer Tempalte Created Successfully");

            }, (err) => {

            }, () => {
              this.lettertemplateChild.getSignatory();
              this.lettertemplateChild.getFooter();
              this.lettertemplateChild.getHeader();
              this.lettertemplateChild.getLetter();
            });
        }
        else {
          const body = {
            "templateFooterBody": $('iframe').contents().find("body").html(),
            "templateFooterName": this.tempalteFormGroup.controls.newTemplateName.value
          }
          this.apiCommonService.put("/v1/documents/lettertemplates/footerTemplates/" + this.tempalteFormGroup.controls.templateId.value, body).
            subscribe(
            res => {
              console.log(res);
              this.closeDialog();
              this.successNotification("Footer Tempalte Updated Successfully");

            }, (err) => {

            }, () => {
              this.lettertemplateChild.getSignatory();
              this.lettertemplateChild.getFooter();
              this.lettertemplateChild.getHeader();
              this.lettertemplateChild.getLetter();
            });

        }
      } else {
        Object.keys(this.tempalteFormGroup.controls).forEach(field => { // {1}
          const control = this.tempalteFormGroup.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }

    }
    // }
    // else {
    // Object.keys(this.tempalteFormGroup.controls).forEach(field => { // {1}
    //   const control = this.tempalteFormGroup.get(field);            // {2}
    //   control.markAsTouched({ onlySelf: true });       // {3}
    // });
    // }

    // this.apiCommonService.

  }


}