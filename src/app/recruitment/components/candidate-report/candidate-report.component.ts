import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';
import { ApiCommonService } from '../../../services/api-common.service';
import { MatTabChangeEvent } from '@angular/material';
import { FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
declare var $: any;
@Component({
  selector: 'app-candidate-report',
  templateUrl: './candidate-report.component.html',
  styleUrls: ['./candidate-report.component.scss']
})
export class CandidateReportComponent implements OnInit {  
  displayedColumns = ['Name', 'Email', 'Phone', 'Registration Date','Resume','Status', 'viewDetails'];
  dataSource: MatTableDataSource<Candidate>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() currentTabEvent = new EventEmitter<string>();
  panelFirstWidth: number;
  panelFirstHeight: number;
  notificationMsg: any;
  isLeftVisible = false;
  action: any;
  SelectedStatus: any = "";
  basicInformationList = [];
  i = 0;
  empCode: any;
  candidateId: any = '';
  iD: any;
  sampleData: any;
  currentTab = 0;

  
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.getCandidates();
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  setStatus() {
    this.getCandidates();
  }
  getInfo(data: any) {
    this.candidateId = data;
    this.iD = data;
    this.sampleData = this.candidateId;
    this.isLeftVisible = ! this.isLeftVisible;
  }
  onLinkClick(event: MatTabChangeEvent) {
    this.currentTab = event.index;
  }
  tabReset(){
    this.currentTab =0;
  }
  getCandidates() {
    Candidates = [];
    this.serviceApi.get('/v1/recruitment/candidates/' + this.SelectedStatus).
      subscribe(
        res => {
          // console.log('Inside getCandidate get response ... ' + JSON.stringify(res));
          res.forEach(element => {
           
            Candidates.push(
              {
                canID: element.id,
                canName: element.cndFirstName,
                canEmail: element.cndEmail,
                canPhone: element.cndMobileNo,
                canExp: element.canExperienceInYear,
                canSkills: element.canSkillSets,
                canLocation: element.cndCity,
                canRegDate: element.canRegistrationDate,
                canResume: element.canResumeId,
                canStatus: element.canStatus

              });
          });
          this.dataSource = new MatTableDataSource(Candidates);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
        },
        () => {
          console.log('Enter into Else Bloack');
        }
      );

  }
  downloadResume(data:any) {
    window.location.href=data;
}
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  CandidateDialog(data: any) {
    console.log(data.canID)
    this.notificationMsg = '';
    this.action = '';
    const dialogRef = this.dialog.open(CandidateDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { canID: data.canID, message: this.notificationMsg, status: this.action }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCandidates();
    });
  }
  ngOnInit(): void {
  }
  onTabChange() {
    if($('.divtoggleDiv').length > 0){
    this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
    this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
    $('.divtoggleDiv')[1].style.display = '';
    }
    
  }

}
export interface Candidate { }
let Candidates: Candidate[] = [];


@Component({
  templateUrl: './CandidateDialog.component.html',
  styleUrls: ['./CandidateDialog.component.scss']
})
export class CandidateDialog implements OnInit {
  notificationMsg: string;
  CandidateOptions: FormGroup;
  action: string;
  error: any;
  SelectedOption: string;
  Selected = 'Pending';
  id: Number;
  ID: any;
  employeeList: any=[];

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<CandidateDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private serviceApi: ApiCommonService) {
    this.id = data.canID,
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {
            // tslint:disable-next-line:max-line-length
            this.employeeList.push({ fullName: element.empFirstName + ' ' + element.empLastName + ' - ' + element.empCode, value: element.empCode });
          });
        }),
    this.CandidateOptions = this._fb.group(
      {
        SelectedOption: "",
        selectEmployee:"",
      }
    )
  }
  // ScheduleCand(data:any){
  //   this.notificationMsg = '';
  //   this.action = '';
  //   this.ID=data;
  //   const dialogRef = this.dialog.open(ScheduleCandidateDialog, {
  //     width: '500px',
  //     data: {canId:this.ID, message: this.notificationMsg, status: this.action }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
  actionRequest(data: any) {
    console.log(data.controls.SelectedOption.value);
    console.log(this.id);
    return this.serviceApi.put('/v1/recruitment/candidates/' + this.id + "/" + data.controls.SelectedOption.value, null).map
      (res => res.json())
      .subscribe(
        res => {
          this.action = 'Response';
          this.error = res.message;
          this.id=res.id;
          this.successNotification(this.error);
          this.close();
          // this.ScheduleCand(this.id);
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
  ngOnInit() { }

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
