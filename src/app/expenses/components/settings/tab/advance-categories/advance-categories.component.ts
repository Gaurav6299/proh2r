import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTable } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../services/api-common.service';
declare var $: any

@Component({
  selector: 'app-advance-categories',
  templateUrl: './advance-categories.component.html',
  styleUrls: ['./advance-categories.component.scss']
})
export class AdvanceCategoriesComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  advanceCategory = [];
  updateButton: any = false;
  saveButton: any;
  backButton: any;
  errorMessage: any;
  columns = [
    { field: 'categoryName', header: 'Category Name' },
    { field: 'actions', header: 'Actions' },
  ]
  isLeftVisible: any;

  @ViewChild('advanceCategoriesForm') form;
  public addAdvanceCategory: FormGroup;
  isLabel: boolean;
  panelFirstWidth: any;
  panelFirstHeight: any;
  categoryId: any;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.getAdvanceCategoriesList();
  }

  ngOnInit() {
    this.addAdvanceCategory = this.fb.group({
      categoryName: [null, Validators.required],
      categoryId: [null],
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
        position: 'fixed',
        timer: 4000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
  }

  updateAdvanceCategory(addAdvanceCategory: any) {
    if (this.addAdvanceCategory.valid) {
      const body = {
        "advanceCategoriesId": this.categoryId,
        "advanceCategoryName": this.addAdvanceCategory.controls.categoryName.value
      }
      this.serviceApi.put('/v1/advance/category/update', body).
        subscribe(
          res => {
            console.log(res);
            this.successNotification(res.message);
            this.isLeftVisible = !this.isLeftVisible;
            this.getAdvanceCategoriesList();
          },
          err => {
          }, () => {
            this.dt.reset();
          });
    }
    else {
      console.log("----------");
      Object.keys(this.addAdvanceCategory.controls).forEach(field => { // {1}
        const control = this.addAdvanceCategory.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
  }

  getAdvanceCategoriesList() {
    this.advanceCategory = [];
    this.serviceApi.get('/v1/advance/category/getAll').
      subscribe(
        res => {
          res.forEach(element => {
            this.advanceCategory.push(
              {
                categoryId: element.advanceCategoriesId,
                categoryName: element.advanceCategoryName,
                actions: ''
              });
          });
        },
        err => {
        },
        () => {
          this.dt.reset();
        }
      );
  }

  saveAdvanceCategory() {
    if (this.addAdvanceCategory.valid) {
      const body = {
        "advanceCategoriesId": null,
        "advanceCategoryName": this.addAdvanceCategory.controls.categoryName.value
      }
      this.serviceApi.post('/v1/advance/category/create', body)
        .subscribe(
          res => {
            this.successNotification(res.message);
          },
          error => {
          },
          () => {
            this.isLeftVisible = !this.isLeftVisible;
            this.getAdvanceCategoriesList();
            this.setPanel();
          },
        );
    } else {
      Object.keys(this.addAdvanceCategory.controls).forEach(field => { // {1}
        const control = this.addAdvanceCategory.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.isLeftVisible = true;
    }
  }
  deleteAdvanceCategory(data: any) {
      const dialogRef = this.dialog.open(DeleteAdvanceCategoryDialog, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { categoryId: data.categoryId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.message) {
            if (result.status === 'Response') {
              this.errorMessage = result.message;
              this.successNotification(this.errorMessage);
            }
            else if (result.status === 'Error') {
              this.errorMessage = result.message;
            }
          }
          this.getAdvanceCategoriesList();
        }
      });
  }


  updateCategory(id: any) {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.categoryId = id;
    this.form.resetForm();
    this.addAdvanceCategory.controls.categoryName.setValue(this.advanceCategory.find(ele => ele.categoryId==id).categoryName)
    this.updateButton = true;
    this.backButton = true;
    this.saveButton = false;
  }
  addCategory() {
    this.form.resetForm();
    $('.divtoggleDiv')[1].style.display = 'block';
    this.addAdvanceCategory.reset();
    this.updateButton = false;
    this.backButton = true;
    this.saveButton = true;
  }
  cancelAddCategory() {
    this.backButton = false;
    this.addAdvanceCategory.reset();
    this.form.resetForm();
    this.setPanel();
  }
  setPanel() {
    if ($('.divtoggleDiv').length > 0) {
      $('.divtoggleDiv')[1].style.display = 'none';
      $('.divtoggleDiv').width(this.panelFirstWidth);
    }
  }

  ngAfterViewInit(): void {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
}
export interface Element {
  expenseName: string;
  actions: any;
  categoryId: any;
}

@Component({
  selector: 'delete-advance-category-dialog',
  templateUrl: 'delete-advance-category.html',
  styleUrls: ['delete-advance-category.scss'],
})
export class DeleteAdvanceCategoryDialog {
  error = 'Error Message';
  action: any;
  categoryId: any;
  message: any;
  status: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteAdvanceCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    this.categoryId = this.data.categoryId;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete() {
    return this.serviceApi.delete('/v1/advance/category/delete/' + this.categoryId)
      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
          this.close();
        },
      );
  }
  close(): void {
    this.data.message = this.error;
    this.data.status = this.action;
    this.dialogRef.close(this.data);
  }


}