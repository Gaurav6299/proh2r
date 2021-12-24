import { Component, OnInit, Inject, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiCommonService } from '../../../../services/api-common.service';
import { KeycloakService } from '../../../../keycloak/keycloak.service';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss']
})
export class PendingRequestsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  empCode: any;
  alertTableList = [];
  columns = [
    { field: 'heading', header: 'Seperation Type' },
    { field: 'actions', header: 'Actions' }
  ]
  constructor(private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.empCode = this.empCode = KeycloakService.getUsername();
    this.getAllAlertsTableData();
  }

  ngOnInit() { }

  getAllAlertsTableData() {
    this.alertTableList = [];
    this.serviceApi.get('/v1/alerts/pendingRequest').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            this.alertTableList.push({
              heading: element.heading,
              subHeading: element.subHeading,
              redirectURL: element.redirectURL
            });
          });
        } else {
          this.alertTableList = [];
        }
      }, () => {
        console.log('Enter into Else Bloack');
        this.dt.reset();
      });
  }
}

export interface PendingRequest {
  heading: string;
  subHeading: string;
  redirectURL: string;
}
