import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DataTable, SelectItem } from 'primeng/primeng';
declare var $: any;
@Component({
  selector: 'app-interviewquestions',
  templateUrl: './interviewquestions.component.html',
  styleUrls: ['./interviewquestions.component.scss']
})
export class InterviewquestionsComponent implements OnInit {
  @ViewChild("dt1") dt: DataTable;
  seperationTypes: SelectItem[] = [];
  // displayedColumns = ['question', 'seperationType', 'actions'];
  columns = [
    { field: 'question', header: 'Question' },
    { field: 'seperationType', header: 'Separation Type' },
    { field: 'actions', header: 'Actions' }
  ]
  // dataSource: MatTableDataSource<Element>;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  notificationMsg: String;
  exitinterviewQuestionTypeList = []
  selectedInterviewQuestionList = []
  status: any;
  separationTypeList = [];
  filterValue
  compareFn = (a: any, b: any) => a && b && a.sepTypeId == b.sepTypeId;
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService) {
    this.getSeparationTypes();
  }
  ngOnInit() {
    this.getExitInterviewQuestionType();
  }

  getSeparationTypes() {
    this.separationTypeList = [];
    this.serviceApi.get('/v1/seperationTypes/').
      subscribe(
        res => {
          console.log('separation List----' + JSON.stringify(res));
          // this.separationTypeList.push({
          //   sepTypeId: '-1',
          //   seperationType: "All",
          //   description: "N/A",
          //   visibilityStatus: "N/A"
          // });
          res.forEach(element => {
            let found1 = this.seperationTypes.filter(obj => obj.value === element.seperationType)
            if (!found1.length) {
              this.seperationTypes.push({ label: element.seperationType, value: element.seperationType })
            }
            this.separationTypeList.push({
              sepTypeId: element.sepTypeId,
              seperationType: element.seperationType,
              description: element.description,
              visibilityStatus: element.visibilityStatus
            });
          });
          this.filterValue = "-1"
        });
  }
  filterInterviewQuestions(event) {
    console.log(event.value);
    if (event.value === "-1") {
      // this.dataSource = new MatTableDataSource<Element>(this.exitinterviewQuestionTypeList);
      this.selectedInterviewQuestionList = this.exitinterviewQuestionTypeList;
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    } else {
      this.selectedInterviewQuestionList = this.exitinterviewQuestionTypeList;
      console.log(this.selectedInterviewQuestionList);
      this.selectedInterviewQuestionList = this.selectedInterviewQuestionList.filter(doc => +doc.sepTypeId === +event.value);
      console.log(this.selectedInterviewQuestionList);
      // this.dataSource = new MatTableDataSource<Element>(this.selectedInterviewQuestionList);
      this.selectedInterviewQuestionList = this.exitinterviewQuestionTypeList;
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
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
  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  //   this.dataSource.filter = filterValue;
  // }


  getExitInterviewQuestionType() {
    this.exitinterviewQuestionTypeList = [];
    this.serviceApi.get('/v1/interview/questions/getAll').subscribe(
      res => {
        console.log('Get Separation----' + JSON.stringify(res));
        res.forEach(element => {
          this.exitinterviewQuestionTypeList.push({
            'questionId': element.questionId,
            'question': element.question,
            'seperationType': element.seperationType,
            'status': this.status,
            'description': element.description,
            'sepTypeId': element.sepTypeId,
            'visibilityStatus': element.visibilityStatus,
          });
        });
      },
      error => {
        console.log('there is something json');
      },
      () => {
        this.dt.reset();
        this.filterValue = "-1"
      }
    );
  }

  openAddExitInterviewtemplateDialog() {
    const dialogRef = this.dialog.open(AddUpdateInterviewQuestionsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'add', message: this.notificationMsg, title: "Add Interview Question" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getExitInterviewQuestionType();
        }
      }
    });
  }

  openUpdateExitInterviewtemplateDialog(data: any) {
    console.log('Label Info-----' + data.sepTypeId);
    const dialogRef = this.dialog.open(AddUpdateInterviewQuestionsComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { action: 'update', message: this.notificationMsg, labelInfo: data, title: "Update Interview Question" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getExitInterviewQuestionType();
        }
      }
    });
  }

  openDeleteExitInterviewtemplateDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteInterviewTemplateComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { labelInfo: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Result value ..... ' + JSON.stringify(result));
        if (result.message) {
          console.log('Result value ..... ' + result.message);
          this.successNotification(result.message);
          this.getExitInterviewQuestionType();
        }
      }
    });
  }
}

export interface Element {
  question: string;
  seperationType: string;
  actions: any;
}
const ELEMENT_DATA: Element[] = [];

@Component({
  templateUrl: 'add-update-interview-questions.component.html',
})
export class AddUpdateInterviewQuestionsComponent implements OnInit {
  action: string;
  message: any;
  error: any;
  title: any;
  separationTypeList = [];
  public exitInterviwQusForm: FormGroup;
  isValidFormSubmitted = true;
  compareFn = (a: any, b: any) => a.sepTypeId == b.sepTypeId;
  constructor(public dialogRef: MatDialogRef<AddUpdateInterviewQuestionsComponent>, private _fb: FormBuilder, private serviceApi: ApiCommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    this.title = this.data.title;
    this.serviceApi.get('/v1/seperationTypes/').
      subscribe(
        res => {
          console.log('separation List----' + JSON.stringify(res));
          res.forEach(element => {
            this.separationTypeList.push({
              sepTypeId: element.sepTypeId,
              seperationType: element.seperationType,
              description: element.description,
              visibilityStatus: element.visibilityStatus
            });
          });
        });
  }
  ngOnInit() {
    if (this.action === 'add') {
      this.exitInterviwQusForm = this._fb.group(
        {
          question: ['', Validators.required],
          questionId: ['0'],
          seperationTypes: ['', Validators.required]
        }
      );
    } else if (this.action === 'update') {
      this.exitInterviwQusForm = this._fb.group(
        {
          question: [this.data.labelInfo.question],
          questionId: [this.data.labelInfo.questionId],
          seperationTypes: [{
            description: this.data.labelInfo.questionId,
            sepTypeId: this.data.labelInfo.sepTypeId,
            seperationType: this.data.labelInfo.seperationType,
            visibilityStatus: this.data.labelInfo.visibilityStatus
          }]
        }
      );
    }
  }
  onAddInterviewQus() {
    if (this.exitInterviwQusForm.valid) {
      console.log('form value ' + JSON.stringify(this.exitInterviwQusForm.value));
      var body = this.exitInterviwQusForm.value;
      const val = this.exitInterviwQusForm.controls.seperationTypes.value.sepTypeId;
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/interview/questions/' + val, body).
        subscribe(
          res => {
            console.log('Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    }
    else {
      Object.keys(this.exitInterviwQusForm.controls).forEach(field => {
        const control = this.exitInterviwQusForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onUpdateInterviewQus() {
    console.log('form value ' + JSON.stringify(this.exitInterviwQusForm.value));
    var body = this.exitInterviwQusForm.value;
    if (this.exitInterviwQusForm.valid) {
      this.isValidFormSubmitted = true;
      const val = this.exitInterviwQusForm.controls.seperationTypes.value.sepTypeId;
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/interview/questions/exitques/' + this.exitInterviwQusForm.controls.questionId.value + '/' + val, body).
        subscribe(
          res => {
            console.log('Update Interview Questions Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.exitInterviwQusForm.controls).forEach(field => {
        const control = this.exitInterviwQusForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}

@Component({
  templateUrl: 'delete-interview-questions.component.html',
})
export class DeleteInterviewTemplateComponent implements OnInit {
  message: any;
  error = 'Error Message';
  action: any;
  constructor(public dialogRef: MatDialogRef<DeleteInterviewTemplateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() { }
  onDelete() {
    const val = this.data.labelInfo.questionId;
    return this.serviceApi.delete('/v1/interview/questions/' + val)
      .subscribe(
        res => {
          console.log('Exit Interview Question Delete Successfully...' + JSON.stringify(res));
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

