import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCommonService } from '../../../services/api-common.service';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { DataTable, SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { ActivityFeedTrackerComponent } from '../tracker/tab/activity-feed-tracker/activity-feed-tracker.component';
declare var $: any;
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  @ViewChild(ActivityFeedTrackerComponent) activitiFeedTrackerChild: ActivityFeedTrackerComponent;
  isLeftVisible: any;
  panelFirstWidth: any;
  panelFirstHeight: any;
  projectList = [];
  allSelections = [];
  supervisorList = [];
  subDepartment = [];
  orgProfile = [];
  projectForm: FormGroup;
  check1: boolean;
  filterByTitle: SelectItem[] = [];
  filterByStatus: SelectItem[] = [];
  filterByOrg: SelectItem[] = [];
  filterByProjectLead: SelectItem[] = [];
  @ViewChild('myProjectForm') form;
  @ViewChild("dt1") dt: DataTable;
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

  onTabChange() {
    if ($('.divtoggleDiv').length > 0) {
      this.panelFirstWidth = $('.divtoggleDiv')[0].offsetWidth;
      this.panelFirstHeight = $('.paneDiv')[0].offsetHeight;
      $('.divtoggleDiv')[1].style.display = 'none';
    }
  }
  selectedTabChange(event) {
    console.log(event);
    if (event.index === 0) {
      this.activitiFeedTrackerChild.isLeftVisible = false;
      this.activitiFeedTrackerChild.getAllActivityTracker();
    }
    else if (event.index === 1) {
      this.getAllProjects();
    }
  }
  constructor(private serviceApi: ApiCommonService, private fb: FormBuilder, private router: Router) {
    this.check1 = false;
    this.projectForm = this.fb.group({
      projectId: [''],
      projectName: ['', Validators.required],
      projectCode: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      projectLead: ['', Validators.required],
      allSelections: [],
      description: ['', Validators.required],
      orgProfile: ['', Validators.required],
      projectStatus: ['', Validators.required]
    });
    this.getListOfSupervisor();
    this.getAllDepartments();
    this.getAllSubDepartments();
    this.getOrganizationProfile();
    this.getAllDesignations();
    this.getAllOrgLocations();
    this.getAllBands();
    this.getAllEmployees();
  }
  columns = [
    { field: 'projectName', header: 'Title' },
    { field: 'lastProjectModifiedDate', header: 'Last Updated' },
    { field: 'projectStatus', header: 'Status' },
    { field: 'selectedOrganizations', header: 'Organizations' },
    { field: 'projectLeadName', header: 'Project Lead' },
    { field: 'startDate', header: 'Start Date' },
    { field: 'endDate', header: 'End Date' },
    { field: 'taskCount', header: 'Task' },
    { field: 'actions', header: 'Actions' },
  ]
  setPanel() {
    $('.divtoggleDiv')[1].style.display = 'none';
    $('.divtoggleDiv').width(this.panelFirstWidth);
  }
  addNewProject() {
    $('.divtoggleDiv')[1].style.display = 'block';
    this.isLeftVisible = true;
    this.check1 = false;
    this.projectForm.reset();
    this.form.resetForm();
    this.projectForm.controls.projectStatus.setValue("IN_PLANNING");
  }
  backToProjects() {
    this.isLeftVisible = false;
    this.setPanel();
  }
  ngOnInit() {
    this.setPanel();
    this.getAllProjects();
  }

  // deleteProject(row: any) {
  //   console.log(row);

  // }
  getAllEmployees() {
    this.serviceApi.get('/v1/employee/filterEmployees').subscribe(
      res => {
        res.forEach(element => {
          this.allSelections = [...this.allSelections, {
            value: element.empCode,
            viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode,
            type: "All Employees"
          }];
        });
      }, (err) => {

      }, () => {

      });
  }




  getAllSubDepartments() {
    this.serviceApi.get("/v1/organization/sub-department").subscribe(res => {
      res.forEach(element => {

        this.allSelections = [...this.allSelections, {
          value: element.subDeptId,
          viewValue: element.subDeptName,
          type: 'All Sub Departments'
        }];
      });
    }, (err) => {

    }, () => {

    });
  }

  getOrganizationProfile() {
    this.orgProfile = [];
    this.serviceApi.get("/v1/organization/orgProfileInfo").subscribe(res => {
      res.forEach(element => {
        this.orgProfile.push({
          "value": element.orgProfileId,
          "viewValue": element.organizationBasicInfo.companyName
        });
        this.allSelections = [...this.allSelections, {
          value: element.orgProfileId,
          viewValue: element.organizationBasicInfo.companyName,
          type: 'All Organization Profile'
        }];
      });
    }, (err) => {

    }, () => {

    });
  }

  getAllProjects() {
    this.projectList = [];
    this.serviceApi.get("/v1/timesheets/project/").subscribe(res => {
      res.forEach((element, i) => {
        if (!this.filterByTitle.some(projectName => projectName.label === element.projectName)) {
          this.filterByTitle.push({
            label: element.projectName, value: element.projectName
          });
        }
        if (!this.filterByStatus.some(projectStatus => projectStatus.label === element.projectStatus)) {
          this.filterByStatus.push({
            label: element.projectStatus, value: element.projectStatus
          });
        }
        if (!this.filterByOrg.some(selectedOrganizations => selectedOrganizations.label === element.selectedOrganizations)) {
          this.filterByOrg.push({
            label: element.selectedOrganizations, value: element.selectedOrganizations
          });
        }
        if (!this.filterByProjectLead.some(projectLeadName => projectLeadName.label === element.projectLeadName)) {
          this.filterByProjectLead.push({
            label: element.projectLeadName, value: element.projectLeadName + "-" + element.projectLead,
          });
        }
        this.projectList.push({
          "projectId": element.projectId,
          "projectName": element.projectName,
          "projectCode": element.projectCode,
          "lastModifiedDate": element.lastModifiedDate,
          "projectStatus": element.projectStatus,
          "projectLeadName": element.projectLeadName + "-" + element.projectLead,
          "startDate": element.startDate,
          "endDate": element.endDate,
          "selectedOrganizations": element.selectedOrganizations,
          "description": element.description,
          "bandIds": element.bandIds,
          "departmentIds": element.departmentIds,
          "designationIds": element.designationIds,
          "locationIds": element.locationIds,
          "orgProfileIds": element.orgProfileIds,
          "subDepartmentIds": element.subDepartmentIds,
          "lastProjectModifiedDate": element.lastProjectModifiedDate,
          "taskCount": element.taskCount,
          "empCodes": element.empCodes,
          "orgProfiles": element.orgProfiles
        })
        // if (element.orgProfiles != null) {
        //   element.orgProfiles.forEach(profile => {
        //     this.projectList[i]['organizations'] = profile.name + "," + this.projectList[i]['organizations'];
        //   })
        // }
      });
    }, (err) => {

    }, () => {
      this.dt.reset();
      console.log(this.projectList);
    });
  }

  updateProject() {
    this.check1 = true;
    if (this.projectForm.valid) {

      let deptIds = [];
      let bandIds = [];
      let designationIds = [];
      let locationIds = [];
      let subDepartment = [];
      let orgProfile = [];
      let empCode = [];
      let selections = this.projectForm.controls.allSelections.value;
      if (selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'All Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'All Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'All Designations') {
            designationIds.push(element.value)
          }
          else if (element.type === 'All Sub Departments') {
            subDepartment.push(element.value)
          }
          else if (element.type === 'All Organization Profile') {
            orgProfile.push(element.value)
          }
          else if (element.type === 'All Employees') {
            empCode.push(element.value)
          }
          else {
            locationIds.push(element.value);
          }
        });
      }
      const body = {
        "bandId": bandIds,
        "departmentId": deptIds,
        "description": this.projectForm.controls.description.value,
        "designationId": designationIds,
        "endDate": this.projectForm.controls.endDate.value,
        "locationId": locationIds,
        "orgProfileId": orgProfile,
        "projectCode": this.projectForm.controls.projectCode.value,
        "projectLead": this.projectForm.controls.projectLead.value,
        "projectName": this.projectForm.controls.projectName.value,
        "startDate": this.projectForm.controls.startDate.value,
        "subDepartmentId": subDepartment,
        "empCodes": empCode,
        "organizations": this.projectForm.controls.orgProfile.value,
        "projectStatus": this.projectForm.controls.projectStatus.value
      }
      console.log(body);
      this.serviceApi.put("/v1/timesheets/project/" + this.projectForm.controls.projectId.value, body).subscribe(res => {
        this.successNotification(res.message);
        this.isLeftVisible = !this.isLeftVisible;
        this.getAllProjects();
        this.setPanel();
      }, (err) => {

      }, () => {

      })

    } else {
      Object.keys(this.projectForm.controls).forEach(field => { // {1}
        const control = this.projectForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });

    }
  }
  editProject(element: any) {
    console.log(element);
    this.addNewProject();

    var temp = [];
    var orgProfile = [];
    if (element.orgProfiles != null) {
      element.orgProfiles.forEach(profile => {
        orgProfile.push(profile.id)
      })
    }



    element.bandIds.forEach(element => {
      temp.push({
        "value": element.id,
        "viewValue": element.name,
        "type": "All Bands"
      });
    });

    element.departmentIds.forEach(element => {
      temp.push({
        "value": element.id,
        "viewValue": element.name,
        "type": "All Departments"
      });
    });

    element.designationIds.forEach(element => {
      temp.push({
        "value": element.id,
        "viewValue": element.name,
        "type": "All Designations"
      });
    });

    element.locationIds.forEach(element => {
      var locationArr = this.allSelections.filter(location => location.type == 'All Locations');
      var loationObj = locationArr.filter(locationObj => locationObj.value == element.id)[0];
      temp.push({
        "value": element.id,
        "viewValue": loationObj.viewValue,
        "type": "All Locations"
      });
    });

    element.orgProfileIds.forEach(element => {
      temp.push({
        "value": element.id,
        "viewValue": element.name,
        "type": "All Organization Profile"
      });
    });

    element.subDepartmentIds.forEach(element => {
      temp.push({
        "value": element.id,
        "viewValue": element.name,
        "type": "All Sub Departments"
      });
    });
    var organizationProfileId = [];
    if (element.orgProfiles != null) {
      element.orgProfiles.forEach(element => {
        organizationProfileId.push({
          "value": element.id,
          "viewValue": element.name
        });
      });
    }


    element.empCodes.forEach(element => {
      var employeesArr = this.allSelections.filter(employees => employees.type == 'All Employees');
      var employeenObj = employeesArr.filter(employeeObj => employeeObj.value == element)[0];
      if (employeenObj != undefined) {
        temp.push({
          "value": element,
          "viewValue": employeenObj.viewValue,
          "type": "All Employees"
        })
      }
    });




    console.log(temp);

    this.projectForm.controls.projectId.setValue(element.projectId);
    this.projectForm.controls.endDate.setValue(element.endDate);
    this.projectForm.controls.projectCode.setValue(element.projectCode);
    this.projectForm.controls.projectLead.setValue(element.projectLeadName.split("-")[1]);
    this.projectForm.controls.projectName.setValue(element.projectName);
    this.projectForm.controls.allSelections.setValue(temp);
    this.projectForm.controls.startDate.setValue(element.startDate);
    this.projectForm.controls.description.setValue(element.description);
    this.projectForm.controls.orgProfile.setValue(orgProfile);
    this.projectForm.controls.projectStatus.setValue(element.projectStatus);
    console.log(this.projectForm.controls.projectId.value);

  }


  saveProject() {
    this.check1 = true;
    console.log(this.projectForm.value);
    if (this.projectForm.valid) {

      let deptIds = [];
      let bandIds = [];
      let designationIds = [];
      let locationIds = [];
      let subDepartment = [];
      let orgProfile = [];
      let empCode = [];
      let selections = this.projectForm.controls.allSelections.value;
      if (selections != null && selections.length > 0) {
        selections.forEach(element => {
          if (element.type === 'All Departments') {
            deptIds.push(element.value);
          } else if (element.type === 'All Bands') {
            bandIds.push(element.value);
          } else if (element.type === 'All Designations') {
            designationIds.push(element.value)
          }
          else if (element.type === 'All Sub Departments') {
            subDepartment.push(element.value)
          }
          else if (element.type === 'All Organization Profile') {
            orgProfile.push(element.value)
          }
          else if (element.type === 'All Employees') {
            empCode.push(element.value)
          }
          else {
            locationIds.push(element.value);
          }
        });
      }
      const body = {
        "bandId": bandIds,
        "departmentId": deptIds,
        "description": this.projectForm.controls.description.value,
        "designationId": designationIds,
        "endDate": this.projectForm.controls.endDate.value,
        "locationId": locationIds,
        "orgProfileId": orgProfile,
        "projectCode": this.projectForm.controls.projectCode.value,
        "projectLead": this.projectForm.controls.projectLead.value,
        "projectName": this.projectForm.controls.projectName.value,
        "startDate": this.projectForm.controls.startDate.value,
        "subDepartmentId": subDepartment,
        "empCodes": empCode,
        "organizations": this.projectForm.controls.orgProfile.value,
        "projectStatus": this.projectForm.controls.projectStatus.value
      }
      console.log(body);
      this.serviceApi.post("/v1/timesheets/project/", body).subscribe(res => {
        this.successNotification(res.message);
        this.isLeftVisible = !this.isLeftVisible;
        this.getAllProjects();
        this.setPanel();
      }, (err) => {

      }, () => {

      })

    } else {
      Object.keys(this.projectForm.controls).forEach(field => { // {1}
        const control = this.projectForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });

    }
  }

  getAllDepartments() {
    this.allSelections = [];
    this.serviceApi.get("/v1/organization/departments/getAll").subscribe(
      res => {
        res.forEach(element => {

          this.allSelections = [...this.allSelections, {
            value: element.deptId,
            viewValue: element.deptName,
            type: 'All Departments'
          }];
        });

      }, (err) => {

      }, () => {

      });
  }
  getAllBands() {
    this.serviceApi.get("/v1/organization/getAll/bands").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {

            this.allSelections = [...this.allSelections, {
              value: element.bandId,
              viewValue: element.bandName,
              type: 'All Bands'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }
  getAllDesignations() {
    this.serviceApi.get("/v1/organization/getAll/designations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {

            this.allSelections = [...this.allSelections, {
              value: element.id,
              viewValue: element.designationName,
              type: 'All Designations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });

  }
  getAllOrgLocations() {
    this.serviceApi.get("/v1/organization/orgLocations").subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {

            this.allSelections = [...this.allSelections, {
              value: element.locationId,
              viewValue: element.locationCode.toUpperCase() + ' - ' + element.cityName,
              type: 'All Locations'
            }];
          });
        }
      }, (err) => {

      }, () => {

      });
  }

  getListOfSupervisor() {
    this.serviceApi.get('/v1/employee/filterEmployees').
      subscribe(
        res => {
          res.forEach(element => {

            console.log('element.empFirstName' + element.empFirstName);
            this.supervisorList = [...this.supervisorList, {
              value: element.empCode,
              viewValue: element.empFirstName + ' ' + element.empLastName + '-' + element.empCode
            }];
          });

        }, (err) => {

        },
        () => {
          console.log(this.supervisorList);
        }
      );
  }

}
