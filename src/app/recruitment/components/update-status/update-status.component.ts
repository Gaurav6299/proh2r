import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../services/api-common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements AfterViewInit {
  dataSource: MatTableDataSource<UpdateStatus>;
  canList: any = [];
  displayedColumns: string[] = ['Name', 'Email', 'Phone', 'Experience', 'Skills', 'Action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private serviceApi: ApiCommonService, public dialog: MatDialog) {
    this.getCanStatusList();
  }

  getCanStatusList() {
    this.canList = [];
    this.serviceApi.get('/v1/recruitment/candidates/SELECTED').
      subscribe(
        res => {
          res.forEach(element => {
            this.canList.push({
              id: element.id,
              name: element.cndFirstName + " " + element.cndLastName,
              email: element.cndEmail,
              phone: element.cndMobileNo,
              experience: element.canExperienceInYear,
              skills: element.canSkillSets,
            });
          });
          this.dataSource = new MatTableDataSource(this.canList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, () => {
          console.log('Enter into Else Bloack');
        }
      );
  }

  statusDialog(data: any) {
    const dialogRef = this.dialog.open(UpdateStatusDialog, {
      width: '450px',
      data: {
        data1: data,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  ngOnInit() {
  }

}
// tslint:disable-next-line:no-empty-interface
export interface UpdateStatus {

}


@Component({
  templateUrl: 'update-status-dialog-component.html',
  styleUrls: ['./update-status-dialog-component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class UpdateStatusDialog implements OnInit {
  updateStatusForm: FormGroup;
  formObj: any;
  canName: any;
  canEmail: any;
  canPhone: any;
  canExp: any;
  canSkills: any;
  action: string;
  error: any;
  canId: any;
  designationsList: any = [];
  canStatusList: any = ['SELECTED', 'REJECTED', 'ONHOLD']
  interviewerAction: any;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateStatusDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.formObj = this.data.data1;
    this.canId = this.formObj.id,
      this.getDesignationList();
  }
  ngOnInit() {
    this.updateStatusForm = this._fb.group({
      name: this.formObj.name,
      email: this.formObj.email,
      phone: this.formObj.phone,
      experience: this.formObj.experience,
      skills: this.formObj.skills,
      joiningDate: "",
      canStatus: [],
      designation: ""
    });
  }
  getDesignationList() {
    this.serviceApi.get('/v1/recruitment/candidates/designation').
      subscribe(
        res => {
          res.forEach(element => {
            this.designationsList.push({
              designation: element.designationName
            });
          });
        })
  }


  actionRequest() {
    this.interviewerAction = this.updateStatusForm.controls.canStatus.value;
    var body = {
      "joiningDate": this.updateStatusForm.controls.joiningDate.value,
      "designation": this.updateStatusForm.controls.designation.value
    }
    return this.serviceApi.put('/v1/recruitment/candidates/' + this.canId + '/' + this.interviewerAction, body).map
      (res => res.json())
      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.successNotification(this.error);
          this.close();
        },
        err => {
          this.action = 'Error';
          this.error = err.message;
          // this.warningNotification(this.error);
          console.log('error');
          this.close();
        }
      );
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

  close(): void {
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}