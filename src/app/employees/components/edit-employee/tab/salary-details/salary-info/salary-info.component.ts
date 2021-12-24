import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
// import { Element } from '@angular/compiler';
import { KeycloakService } from '../../../../../../keycloak/keycloak.service';
import { ApiCommonService } from '../../../../../../services/api-common.service';
import { Router } from '@angular/router';
import { Data } from '../../../../../services/data.service';
import { element } from '@angular/core/src/render3/instructions';
import { Inject } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-salary-info',
  templateUrl: './salary-info.component.html',
  styleUrls: ['./salary-info.component.scss']
})
export class SalaryInfoComponent implements OnInit {
  empCode: string;
  salaryList = [];
  ELEMENT_DATA = [];
  displayedColumns = ['ctcFrequency', 'payrollEffectiveDate', 'salaryEffectiveToDate', 'amounts', 'totalTakeHomes', 'actions'];
  // displayedColumns = ['ctcFrequency', 'payrollEffectiveDate', 'totalCtc', 'totalTakeHome', 'actions'];

  ctcFrequency = [
    { value: 'Monthly', viewValue: 'Monthly' },
    { value: 'Annualy', viewValue: 'Annually' }
  ]

  dataSource = new MatTableDataSource<Element>();
  res;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private route: ActivatedRoute, private http: Http, private router: Router, private data: Data) {

    this.route.params.subscribe(res =>
      this.empCode = res.id);
    console.log('empCode -->' + this.empCode);
    this.loadData();
    const rolesArr = KeycloakService.getUserRole();
    this.route.params.subscribe(res => {
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
  loadData() {
    this.ELEMENT_DATA = [];
    this.serviceApi.get('/v1/employee/salary/all/' + this.empCode).subscribe(
      res => {
        this.res = res;
      },
      err => {
        console.log('error block start');
      },
      () => {
        console.log('on complete status');
        this.res.forEach(item => {
          this.ELEMENT_DATA.push({
            payrollEffectiveDate: item.payrollEffectiveDate,
            salaryEffectiveToDate: item.salaryEffectiveToDate != null ? item.salaryEffectiveToDate : "",
            ctcFrequency: this.ctcFrequency.find(o => o.value == item.ctcFrequency).viewValue,
            totalTakeHomes: item.totalTakeHomes,
            amounts: item.amounts,
            empCode: item.empCode,
            empSalaryId: item.empSalaryId
          }
          );
        });
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      }
    );
  }
  navigateAddCtcComponent() {
    this.data.storage = {
      "empCode": this.empCode
    }
    this.router.navigate(['/employees/edit-employee/' + this.empCode + '/add-ctc']);
  }
  getAuthenticationForEdit(ctcDetails: any) {
      this.data.storage = {
        "empCode": this.empCode
      }
      this.router.navigate(['/employees/edit-employee/' + this.empCode + '/edit-ctc/' + ctcDetails.empSalaryId]);
  }
  deleteRecord(empSalaryId: any) {
    const dialogRef = this.dialog.open(DeleteSalaryInfoComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { empSalaryId: empSalaryId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.loadData();
        }
      }
    });
  }

  ngOnInit() {
  }

}
export interface Element {
  sNo: number;
  payrollEffectiveDate: any;
  salaryEffectiveToDate: string;
  ctcFrequency: string;
  ctcTemplateName: string;
  totalTakeHome: string;
  totalCtc: string;
  empCode: string;
}
// const 
// ];

@Component({
  templateUrl: 'delete-salary-info.component.html',
})
export class DeleteSalaryInfoComponent implements OnInit {
  message: any;
  status: any;
  error = 'Error Message';
  action: any;
  constructor(public dialogRef: MatDialogRef<DeleteSalaryInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
    console.log(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() { }
  onDelete() {
    return this.serviceApi.delete('/v1/employee/salary/' + this.data.empSalaryId)
      .subscribe(
      res => {
        this.message = res.message;
        this.close();
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.action = 'Error';
        this.error = err.message;
        this.close();
      });
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
}
