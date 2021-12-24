import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';
import { KeycloakService } from '../../../../keycloak/keycloak.service';
import { ApiCommonService } from '../../../../services/api-common.service';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-setup-issues',
  templateUrl: './setup-issues.component.html',
  styleUrls: ['./setup-issues.component.scss']
})
export class SetupIssuesComponent implements OnInit {

  setupIssuesTableList = [];
  empCode: any;

  // displayedColumns = ['heading', 'redirectURL'];
  @ViewChild("dt1") dt: DataTable;
  notificationMsg: String;
  columns = [
    { field: 'heading', header: 'Request Type' },
    { field: 'action', header: 'Action' }
  ]

  dataSource: MatTableDataSource<SetupissueRequest>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.empCode = this.empCode = KeycloakService.getUsername();
    this.getAllSetupIssuesTableData();
  }

  ngOnInit() { }

  getAllSetupIssuesTableData() {
    console.log('Enter to get data in from Database' + this.empCode);
    this.setupIssuesTableList = [];
    this.serviceApi.get('/v1/alerts/setupissues').
      subscribe(
        res => {
          res.forEach(element => {
            this.setupIssuesTableList.push({
              heading: element.heading,
              subHeading: element.subHeading,
              redirectURL: element.redirectURL
            });
          });
          this.dataSource = new MatTableDataSource<SetupissueRequest>(this.setupIssuesTableList);
        }, () => {
          this.dt.reset();
          console.log('Enter into Else Block');
        });
  }
}

export interface SetupissueRequest {
  heading: string;
  subHeading: string;
  redirectURL: string;
}
