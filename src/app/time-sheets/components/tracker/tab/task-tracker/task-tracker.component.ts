import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, SelectItem } from 'primeng/primeng';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-task-tracker',
  templateUrl: './task-tracker.component.html',
  styleUrls: ['./task-tracker.component.scss']
})
export class TaskTrackerComponent implements OnInit {
  isLeftVisible;
  panelFirstWidth: any;
  taskList = [];
  employeeList = [];
  @ViewChild("dt1") dt: DataTable;
  taskForm: FormGroup;
  @ViewChild('myTaskForm') form;
  check1: boolean;
  filterByTitle: SelectItem[] = [];
  filterByStatus: SelectItem[] = [];
  filterByPriority: SelectItem[] = [];
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
  columns = [
    { field: 'taskName', header: 'Title' },
    { field: 'startDate', header: 'Start Date' },
    { field: 'endDate', header: 'End Date' },
    { field: 'taskPriority', header: 'Priority' },
    { field: 'taskStatus', header: 'Status' },
    { field: 'actions', header: 'Actions' },
  ]
  constructor(public dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder, private serviceApi: ApiCommonService,) {
    this.taskForm = this.fb.group({
      taskId: [''],
      taskName: ['', Validators.required],
      projectId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      taskPriority: ['', Validators.required],
      empCodes: ['', Validators.required],
      description: ['', Validators.required],
      taskStatus: ['', Validators.required]
    });
    this.route.params.subscribe(res => {
      this.taskForm.controls.projectId.setValue(res.projectId)
    });
    this.getAllTask();
    this.getAllAssignedEmployees();
    console.log(this.taskForm.controls.projectId.value);
  }
  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  addNewTask() {
    var selectedProject = this.taskForm.controls.projectId.value;
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.check1 = false;
    this.taskForm.reset();
    this.form.resetForm();
    // this.taskForm.controls.taskStatus.setValue("IN_PLANNING");
    this.taskForm.controls.projectId.setValue(selectedProject);
  }
  createNewTask() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.addNewTask();
  }
  backToTaskListing() {
    this.isLeftVisible = false;
    this.setPanel();
  }
  ngOnInit() {

  }

  openDeleteTaskDialog(task: any) {
    console.log(task.taskId);
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { taskId: task.taskId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.message !== null) {
          this.successNotification(result.message);
          this.getAllTask();
        }
      }
    });

  }

  saveTask() {
    this.check1 = true;
    console.log(this.taskForm.value);
    if (this.taskForm.valid) {
      const body = {
        "description": this.taskForm.controls.description.value,
        "empCodes": this.taskForm.controls.empCodes.value,
        "endDate": this.taskForm.controls.endDate.value,
        "projectId": this.taskForm.controls.projectId.value,
        "startDate": this.taskForm.controls.startDate.value,
        "taskName": this.taskForm.controls.taskName.value,
        "taskPriority": this.taskForm.controls.taskPriority.value,
        "taskStatus": this.taskForm.controls.taskStatus.value,
      }
      console.log(body);
      this.serviceApi.post("/v1/timesheets/task/", body).subscribe(res => {
        this.successNotification(res.message);
        this.isLeftVisible = !this.isLeftVisible;
        this.getAllTask();
        this.setPanel();
      }, (err) => {

      }, () => {

      })

    } else {
      Object.keys(this.taskForm.controls).forEach(field => { // {1}
        const control = this.taskForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });

    }
  }
  editTask(task: any) {
    console.log(task);
    this.addNewTask();
    var empCode = [];
    task.empList.forEach(element => {
      empCode.push(element.split("-")[1].trim());
    });
    console.log(empCode);
    var dateArray = task.startDate.split('-');
    var convertedDate = new Date(dateArray[1] + '-' + dateArray[0] + ' ' + dateArray[2]);
    const startDate = new DatePipe('en_IN').transform(new Date(convertedDate), 'yyyy-MM-dd')
    var dateArray = task.endDate.split('-');
    var convertedDate = new Date(dateArray[1] + '-' + dateArray[0] + ' ' + dateArray[2]);
    const endDate = new DatePipe('en_IN').transform(new Date(convertedDate), 'yyyy-MM-dd')
    this.taskForm.controls.description.setValue(task.description);
    this.taskForm.controls.empCodes.setValue(empCode);
    this.taskForm.controls.endDate.setValue(endDate);
    this.taskForm.controls.taskId.setValue(task.taskId);
    this.taskForm.controls.startDate.setValue(startDate);
    this.taskForm.controls.taskName.setValue(task.taskName);
    this.taskForm.controls.taskPriority.setValue(task.taskPriority);
    this.taskForm.controls.taskStatus.setValue(task.taskStatus);


  }
  getAllTask() {
    this.taskList = [];
    this.serviceApi.get('/v1/timesheets/task/' + this.taskForm.controls.projectId.value).subscribe(res => {
      res.forEach(element => {
        if (!this.filterByTitle.some(taskName => taskName.label === element.taskName)) {
          this.filterByTitle.push({
            label: element.taskName, value: element.taskName
          });
        }
        if (!this.filterByStatus.some(taskStatus => taskStatus.label === element.taskStatus)) {
          this.filterByStatus.push({
            label: element.taskStatus, value: element.taskStatus
          });
        }
        if (!this.filterByPriority.some(taskPriority => taskPriority.label === element.taskPriority)) {
          this.filterByPriority.push({
            label: element.taskPriority, value: element.taskPriority
          });
        }
      });
      this.taskList = res;
    })
  }
  updateTask() {
    console.log(this.taskForm.value);
    this.check1 = true;
    if (this.taskForm.valid) {
      const body = {
        "description": this.taskForm.controls.description.value,
        "empCodes": this.taskForm.controls.empCodes.value,
        "endDate": this.taskForm.controls.endDate.value,
        "projectId": this.taskForm.controls.projectId.value,
        "startDate": this.taskForm.controls.startDate.value,
        "taskName": this.taskForm.controls.taskName.value,
        "taskPriority": this.taskForm.controls.taskPriority.value,
        "taskStatus": this.taskForm.controls.taskStatus.value,
      }
      console.log(body);
      this.serviceApi.put("/v1/timesheets/task/" + this.taskForm.controls.taskId.value, body).subscribe(res => {
        this.successNotification(res.message);
        this.isLeftVisible = !this.isLeftVisible;
        this.getAllTask();
        this.setPanel();
      }, (err) => {

      }, () => {

      })

    } else {
      Object.keys(this.taskForm.controls).forEach(field => { // {1}
        const control = this.taskForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });

    }
  }

  getAllAssignedEmployees() {
    this.employeeList = [];
    this.serviceApi.get('/v1/timesheets/project/project-assignments/' + this.taskForm.controls.projectId.value).subscribe(res => {
      res.forEach(element => {
        this.employeeList = [...this.employeeList, {
          value: element.empCode,
          viewValue: element.employeeName + "-" + element.empCode,
          type: 'All Employee'
        }];
      });

    });

  }

}

@Component({
  templateUrl: 'delete-task.component.html',
})
export class DeleteTaskComponent implements OnInit {
  message: any;
  constructor(public dialogRef: MatDialogRef<DeleteTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceApi: ApiCommonService) {
    console.log('category Id for deletion----' + data.taskId);
  }
  deleteTask() {
    this.serviceApi.delete('/v1/timesheets/task/' + this.data.taskId).subscribe(
      res => {
        if (res != null) {
          this.message = res.message;
          this.close();
        } else {
        }
      }, err => {
        console.log('Something gone Wrong');
        console.log('err -->' + err);
        // this.warningNotification(err.message);
      }, () => {
        // this.getAllCategories();
      });

  }
  ngOnInit() {
  }
  close(): void {
    this.data.message = this.message;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
