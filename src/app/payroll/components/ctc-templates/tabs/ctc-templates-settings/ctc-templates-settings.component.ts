import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { from } from 'rxjs/observable/from';
import { concat } from 'rxjs/observable/concat';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';

import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DataTable } from 'primeng/primeng';

declare var $: any;
@Component({
  selector: 'app-ctc-templates-settings',
  templateUrl: './ctc-templates-settings.component.html',
  styleUrls: ['./ctc-templates-settings.component.scss']
})
export class CtcTemplatesSettingsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  displayedColumns = ['templateName', 'totalNumberOfEmployees', 'totalCTCAllowance', 'variableAllowances',
    'employerContributions', 'totalFixedDeduction', 'variableDeductions', 'employeeDeductions', 'actions'];

  columns = [
    { field: 'ctcTemplateName', header: 'Template Name' },
    { field: 'totalNumberOfEmployees', header: 'Employees Covered' },
    { field: 'totalCTCAllowance', header: 'Fixed Allowances' },
    // { field: 'variableAllowances', header: 'Variable Allowances' },
    // { field: 'employerContributions', header: 'Employer Contributions' },
    { field: 'totalFixedDeduction', header: 'Fixed Deductions' },
    // { field: 'variableDeductions', header: 'Variable Deductions' },
    // { field: 'employeeDeductions', header: 'Employee Deductions' },
    { field: 'otherBenefitsCount', header: 'Other Allowances' },
    { field: 'actions', header: 'Actions' }
  ]
  dataSource = new MatTableDataSource<Element>();

  tableDataList = [];

  constructor(public dialog: MatDialog, private http: Http, private serviceApi: ApiCommonService,
    private route: ActivatedRoute,) {
    this.getAllTableDataCTCTemplateList();
    const rolesArr = KeycloakService.getUserRole();
    this.route.params.subscribe(res => {
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

  openDeleteDialog(data: any) {
      const dialogRef = this.dialog.open(DeleteCtcTemplateComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { ctcTemplateId: data.ctcTemplateId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result.status === 'Response') {
            console.log('Result value ..... ' + JSON.stringify(result));
            if (result.message) {
              this.successNotification(result.message);
              this.getAllTableDataCTCTemplateList();
            }
          }
        }
      });
  }


  getAllTableDataCTCTemplateList() {
    this.tableDataList = [];
    console.log('Enter to get All Data of CTC Template List');
    this.serviceApi.get('/v1/ctc-template/get-all').subscribe(
      res => {
        console.log('Enter into Sucess Retriving Data Function');
        if (res != null) {
          console.log('Response is : ' + res);
          res.forEach(element => {
            console.log(' >>><<<< ' + element.ctcAllowances);
            this.tableDataList.push(
              {
                ctcTemplateId: [element.ctcTemplateId],
                ctcTemplateName: [element.ctcTemplateName],
                gratuityPercent: [element.gratuityPercent],
                ctcFixedAllowanceList: [element.ctcFixedAllowanceList],
                ctcFixedDeductions: [element.ctcFixedDeductions],
                ctcGratuityComponents: [element.ctcGratuityComponents],
                pfDeductible: [element.pfDeductible],
                esicDeductible: [element.esicDeductible],
                lwfdeductible: [element.lwfdeductible],
                ptdeductible: [element.ptdeductible],
                incomeTaxDeductible: [element.incomeTaxDeductible],
                gratuityDeductible: [element.gratuityDeductible],
                totalNumberOfEmployees: [+element.empCovered],
                totalCTCAllowance: [+element.fixedAllowanceCount],
                employerContributions: [],
                totalFixedDeduction: [+element.fixedDeductionCount],
                employeeDeductions: [],
                otherBenefitsCount: [+element.otherBenefitsCount]
              });
          });
          this.dataSource = new MatTableDataSource<Element>(this.tableDataList);
        } else {
          console.log('No Responds');
        }
      }, err => {
        console.log(err);
      },
      () => {
        this.dt.reset();
      });
  }
}

// ---------------- Template delete model start ------------------------
@Component({
  templateUrl: 'delete-ctc-template.component.html',
  styleUrls: ['delete-dialog-model.scss']
})
export class DeleteCtcTemplateComponent implements OnInit {
  message: any;
  status: any;
  error = 'Error Message';
  actions: any;
  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteCtcTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: Http, private serviceApi: ApiCommonService) {
    console.log('data-->' + data);
  }

  ngOnInit() {
  }

  onDelete() {
    console.log(' >>>>> Request For Delete Record data ---->' + this.data.ctcTemplateId);
    return this.serviceApi.delete('/v1/ctc-template/delete/' + +this.data.ctcTemplateId).subscribe(
      res => {
        console.log('Description Delete Successfully...' + JSON.stringify(res));
        this.actions = 'Response';
        this.message = res.message;
        this.close();
      }, err => {
        console.log('there is something error.....  ' + err.message);
        this.actions = 'Error';
        this.close();
      }, () => {
      }
    );
  }

  close(): void {
    this.data.message = this.message;
    this.data.status = this.actions;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}

export interface Element {
  Name: string;
  EmpCovered: number;
  FixedAllowance: number;
  FlexiAllowance: number;
  FlexiDeductions: number;
  Actions: any;
}

export interface Element1 {
  ctcTemplateId: number;
  templateName: string;
  totalNumberOfEmployees: any;
  isPFDeductible: boolean;
  isProvidentPensionDeductible: boolean;
  isEmployeePFCaped: boolean;
  isEmployersPFCaped: boolean;
  providentFundWageAmount: number;
  isESICDeductible: boolean;
  isProfessionalTaxDeductible: boolean;
  isLWFDeductible: boolean;
  isGratuityApplicable: boolean;
  isIncomeTaxDeductible: boolean;
  isNPSDeductible: boolean;
  annualGrossSalary: number;
  ctcAllowances: any;
  totalCTCAllowance: number;
  ctcDeductions: any;
  totalFixedDeduction: number;
  employeeDeductions: any;
  employerContributions: any;
  variableAllowances: any;
  variableDeductions: any;

}

const ELEMENT_DATA: Element[] = [];
