import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCommonService } from '../../../services/api-common.service';
import { environment } from '../../../../environments/environment.prod';
import { Router } from '@angular/router';
import { Employee } from '../../employee';




@Component({
  selector: 'app-employee-detail-report',
  templateUrl: './employee-detail-report.component.html',
  styleUrls: ['./employee-detail-report.component.scss']
})
export class EmployeeDetailReportComponent implements OnInit {

  /*
   -----------Personal Details----------------
  */

  basicInfo: any;
  addressInfo: any;
  bankInfo: any;
  appointInfo: any;
  jobInfo: any;
  test: any;
  employee: any;


  basicInformation: any;
  addressInformation: any;
  bankInformation: any;
  appointmentDetails: any;
  jobInformation: any;
  testing: any;
  employeeDetails: any;


  PersonalDetails = [];
  AddressInformation = [];
  BankInformation = [];
  AppointmentDetails = [];
  JobInformation = [];
  Testing = [];
  EmployeeDetails = [];
  storeSelectedData: any = [];
  responseData: any;


  allEmpData:any;
  fieldValue:boolean=false;
  sectionName:Employee[]=[];
 
  // fieldValue: boolean;

  constructor(private _fb: FormBuilder, private serviceApi: ApiCommonService,private router:Router) { }

  ngOnInit() {
    this.getAllEmployeeData();

  }

  /*
  -----------Get All Employee Data--------------
  */
  // getAllEmployeeData() {
  //   this.basicInfo;
  //   this.addressInfo;
  //   this.bankInfo;
  //   this.appointInfo;
  //   this.jobInfo;
  //   this.test;
  //   this.employee;
  //   this.responseData;
  //   this.serviceApi.get("/v1/organization/employeefields/report/sections").subscribe(res => {
  //     console.log("Emp res::", res)
  //     this.responseData = res;
  //     res.forEach(data => {
  //       if (data.sectionName == 'Basic Information') {
  //         this.basicInfo = data.sectionName;
  //         this.basicInformation = data;
  //       }
  //       else if (data.sectionName == 'Address Information') {
  //         this.addressInfo = data.sectionName;
  //         this.addressInformation = data;

  //       }
  //       else if (data.sectionName == 'Bank Information') {
  //         this.bankInfo = data.sectionName;
  //         this.bankInformation = data;
  //       }
  //       else if (data.sectionName == 'Appointment Details') {
  //         this.appointInfo = data.sectionName;
  //         this.appointmentDetails = data;
  //       }
  //       else if (data.sectionName == 'Job Information') {
  //         this.jobInfo = data.sectionName;
  //         this.jobInformation = data;
  //       }
  //       else if (data.sectionName == 'testing1') {
  //         this.test = data.sectionName;
  //         this.testing = data;
  //       }

  //       else if (data.sectionName == 'Employment Detals') {
  //         this.employee = data.sectionName;
  //         this.employeeDetails = data;
  //       }

  //     })

  //   },
  //     err => { },
  //     () => {
  //       /*
  //          -------- Personal Details-----------
  //       */
  //       console.log("Basic info:", this.basicInformation)
  //       this.basicInformation.fields.forEach(item => {
  //         this.PersonalDetails.push({
  //           fieldValue: false, viewValue: item.fieldPlaceholder, fieldId: item.fieldId
  //         })
  //       })

  //       /*
  //         ----------Address Information------------
  //       */
  //       console.log("appoint Infor:", this.addressInformation);
  //       this.addressInformation.fields.forEach(item => {
  //         this.AddressInformation.push({
  //           fieldValue: false, viewValue: item.fieldPlaceholder, fieldId: item.fieldId
  //         })
  //       })

  //       /*
  //         ----------Bank Information-------
  //       */
  //       console.log("bank Info", this.bankInformation)
  //       this.bankInformation.fields.forEach(item => {
  //         this.BankInformation.push({
  //           fieldValue: false, viewValue: item.fieldPlaceholder, fieldId: item.fieldId
  //         })
  //       })


  //       // console.log("appoint Infor:",this.appointmentDetails);

  //       /*
  //        ----------Appointment Details------------
  //       */

  //       this.appointmentDetails.fields.forEach(item => {
  //         this.AppointmentDetails.push({
  //           fieldValue: false, viewValue: item.fieldPlaceholder, fieldId: item.fieldId
  //         })
  //       })

  //       /*
  //        ----------Job Information----------
  //       */
  //       // console.log("Job Infor:",this.jobInformation);


  //       this.jobInformation.fields.forEach(item => {
  //         this.JobInformation.push({
  //           fieldValue: false, viewValue: item.fieldPlaceholder, fieldId: item.fieldId
  //         })
  //       })

  //       /*
  //          ----------Testing Data-----------
  //       */

  //       console.log("tesing Infor:", this.testing);
  //       if (this.testing.fields.length != 0) {
  //         this.testing.fields.forEach(item => {
  //           this.Testing.push({
  //             fieldValue: false, viewValue: item.fieldPlaceholder, fieldId: item.fieldId
  //           })
  //         })
  //       }

  //       /*
  //          -----------Employment Details-------------
  //       */
  //       console.log("empdeatils Infor:", this.employeeDetails);
  //       if (this.employeeDetails.fields.length != 0) {
  //         this.employeeDetails.fields.forEach(item => {
  //           this.EmployeeDetails.push({
  //             fieldValue: false, viewValue: item.fieldPlaceholder, fieldId: item.fieldId
  //           })

  //         })
  //       }


  //     })

  // }

  getAllEmployeeData(){
    this.serviceApi.get("/v1/organization/employeefields/report/sections").subscribe((res:any)=>{
      console.log("Res is:",res)
      this.responseData=res;
      res.forEach((item:any)=>{
        this.sectionName.push({
          section:item.sectionName,fields:item.fields,fieldValue:false
        })
          
      })

      // for(var i=0;i<res.length;i++){
      //   res[i].fields.forEach((item:any)=>{
      //      this.sectionName.push(
      //        {
      //          viewValue:item.fieldPlaceholder,fieldValue:false,section:res[i].sectionName
      //        }
      //      )
      //   })
      // }
    },
    err=>{},
    ()=>{
      console.log("All Sectin:",this.responseData);
    })
  }



  /*
   -------------------Remove  the checked element---------------
  */
  deleteData(e: any) {
    let index = this.storeSelectedData.indexOf(e.fieldId)
    console.log("Index is :", index)
    this.storeSelectedData.splice(index, 1);
    console.log("data is:", this.storeSelectedData)
    e.fieldValue = false;

  }

  /*
    ---------------------Store the id of selected employees---------------------
  */
  getData(e: any) {
    if (!e.fieldValue) {
      console.log("false is")
      this.storeSelectedData.push(e.fieldId);
      console.log("data is:", this.storeSelectedData)
    } else {
      let index = this.storeSelectedData.indexOf(e.fieldId)
      console.log("Index is :", index)
      this.storeSelectedData.splice(index, 1);
      console.log("data is:", this.storeSelectedData)
    }
  }

  // getData(e:any){
  //   console.log("Id is:",this.fieldValue)
  //   // e=true;

  // }

  /*
----------------Download selected employee Data-------------
  */
  downloadData() {
    const body = {}
    let url = 'requestedFieldIds=';
    let myUrl: any;
    this.storeSelectedData.sort((a, b) => a - b);
    console.log("Sort data is", this.storeSelectedData)
    this.storeSelectedData.forEach((ele: any) => {
      if (this.storeSelectedData.indexOf(ele) == 0) {
        myUrl = url + ele;
      } else {
        myUrl = myUrl + '&' + url + ele
      }

    }
    )
    this.serviceApi.post('/v1/employee/profile/employee/info/report?' + myUrl, body).subscribe((res: any) => {
      if (res) {
        // console.log("res is :",res);
        window.open(environment.storageServiceBaseUrl + res.url);
      }
    },
      err => {
        console.log("data is not downloaded")
      })

  }

}
