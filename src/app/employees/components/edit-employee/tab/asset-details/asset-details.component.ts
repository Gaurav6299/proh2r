import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ApiCommonService } from '../../../../../services/api-common.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { element } from 'protractor';
import { KeycloakService } from '../../../../../keycloak/keycloak.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {
  displayedColumns: string[] = ['allocationId','assetName', 'allocationDate', 'allocatedTill', 'actions'];
  dataSource;
  allocatedAssetList=[]
  allocatedAssetListO=[]
  empCode
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  notificationMsg: String;
  categoriesList=[];
  constructor(public dialog: MatDialog, private serviceApi: ApiCommonService, private route: ActivatedRoute) { 
    this.route.params.subscribe(res =>
      this.empCode =  res.id);
  }

  ngOnInit() {
    this.getAllCategories();
    this.getAllAssetAllocations();
  }
  applyFilter(filterValue: string) {
    console.log('hello' + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  getAllAssetAllocations() {
    console.log('Enter inside getAllAssetsList ');
    this.allocatedAssetList = [];
    this.serviceApi.get('/v1/employee/assetAllocation/'+this.empCode).subscribe(
      res => {
        console.log('Response ----' + res);
        if (res != null) {
          res.forEach(element => {
            console.log('Response ----' + element);
            this.allocatedAssetListO.push(element);
            this.allocatedAssetList.push({
              'allocationId':element.allocationId,
              'assetName':element.orgAssets.assetName,
              'allocationDate':element.issuedDate,
              'allocatedTill':element.withdrawalDate
            });
          });
        } else {
          console.log('There is no any response from Database');
        }
      },
      err => {

      },
      () => {
        this.dataSource = new MatTableDataSource(this.allocatedAssetList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  getAllCategories() {
    console.log('Enter inside getAllCategories ');
    this.categoriesList = [];
    this.serviceApi.get('/v1/assets/category/list').subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Response ----' + element);
            this.categoriesList.push({
              'assetCategoryId': element.assetCategoryId,
              'categoryName': element.categoryName,
              'categoryDescription': element.categoryDescription
            });
          });
        } else {
          console.log('There is no any response from Database');
        }
      },
      err => {
      },
      () => {
      });
  }
    //open dialog for add asset categories
    createAllocationDialog() {
      const dialogRef = this.dialog.open(CreateUpdateAllocationComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: { action: 'add', message: this.notificationMsg, title: "Allocate Asset",categoriesList:this.categoriesList,empCode:this.empCode }
      });
      dialogRef.afterClosed().subscribe(result => {
        //  console.log('The dialog was closed....................' + result.message);
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            this.successNotification(result.message);
            this.getAllAssetAllocations();
          }
        }
      });
    }

    getSelectedAllocatedAsset(allocationId){
      var data;
      this.allocatedAssetListO.forEach(element=>{
        if(element.allocationId===allocationId){
          data=element;
        }
      });
      return data;
    }
    //open dialog for update asset categories
    updateAllocationDialog(data: any) {
      console.log('Label Info-----' + data.labelName);
      const dialogRef = this.dialog.open(CreateUpdateAllocationComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: {empCode:this.empCode , action: 'update', message: this.notificationMsg, labelInfo: this.getSelectedAllocatedAsset(data.allocationId), title: "Update Allocation Details",categoriesList:this.categoriesList }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          console.log('Result value ..... ' + JSON.stringify(result));
          if (result.message) {
            console.log('Result value ..... ' + result.message);
            this.successNotification(result.message);
            this.getAllAssetAllocations();
          }
        }
      });
    }
    //open dialog for delete asset categories
    openDeleteAllocationDialog(data: any) {
      const dialogRef = this.dialog.open(DeleteAssetAllocationComponent, {
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
            this.getAllAssetAllocations();
          }
        }
      });
    }

}




// ---------------- Add/Update label model start ------------------------
@Component({
  templateUrl: 'asset-allocation-dialog.component.html',
  styleUrls:['./asset-allocation-dialog.component.scss']
})
export class CreateUpdateAllocationComponent implements OnInit {
  isReadOnly=false;
  action: string;
  message: any;
  error: any;
  title: any;
  isValidFormSubmitted = true;
  identificationLableList = [];
  categoriesList=[];
  assetAllocation: FormGroup;
  assetsList=[];
  selectedCategoryAssetsList=[];
  empCode
  compareFnCategory = (a: any, b: any) => a.assetCategoryId == b.assetCategoryId;
  compareFnAsset=(a: any, b: any)=> a.assetId == b.assetId;
  constructor( private datePipe: DatePipe,public dialogRef: MatDialogRef<CreateUpdateAllocationComponent>, private serviceApi: ApiCommonService, private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    this.title = this.data.title;
    this.categoriesList=this.data.categoriesList
    this.empCode=this.data.empCode 
    if(this.action==='update'){
      this.getAssets(this.data.labelInfo.orgAssets.assetCategory.assetCategoryId,'i')
    }
  }

  ngOnInit() {
    if (this.action === 'add') {
      this.assetAllocation = this._fb.group(
        {
          allocationId: ['0'],
          empCode: [this.empCode, [Validators.required]],
          assetCategory:['', [Validators.required]],
          selectedAsset:['', [Validators.required]],
          allocationDate: [this.datePipe.transform(new Date(),'yyyy-MM-dd'), [Validators.required]],
          allocatedTill:[this.datePipe.transform(new Date(),'yyyy-MM-dd'), [Validators.required]],
          identificationLabel: this._fb.array([])
        }
      );
    } else if (this.action === 'update') {
      this.isReadOnly=true;
      this.assetAllocation = this._fb.group(
        {
          allocationId: this.data.labelInfo.allocationId,
          empCode: [this.empCode, [Validators.required]],
          assetCategory:[this.data.labelInfo.orgAssets.assetCategory, [Validators.required]],
          selectedAsset:[this.data.labelInfo.orgAssets, [Validators.required]],
          allocationDate: [this.data.labelInfo.issuedDate, [Validators.required]],
          allocatedTill:[this.data.labelInfo.withdrawalDate, [Validators.required]],
          identificationLabel: this._fb.array([])
        }
      );
      const control = (<FormArray>this.assetAllocation.controls['identificationLabel']) as FormArray;
      this.data.labelInfo.identificationLabels.forEach(element=>{
        control.push(
          this._fb.group({
            "identificationLabelId": element.identificationLabelId,
            "labelDescription":element.labelDescription,
            "labelName": element.labelName,
            "labelValue":[element.labelValue,[Validators.required]]
          })
        );
      })
      this.assetAllocation.controls['assetCategory'].disable();
      this.assetAllocation.controls['selectedAsset'].disable();
    }
  }

 allocateAsset() {
    if (this.assetAllocation.valid) {
      this.isValidFormSubmitted = true;
      console.log('form value ' + JSON.stringify(this.assetAllocation.value));
      const body = {
        "allocationId": 0,
        "empCode":  this.assetAllocation.controls.empCode.value,
        "identificationLabels":this.assetAllocation.controls.identificationLabel.value,
        "issuedDate": this.datePipe.transform(this.assetAllocation.controls.allocationDate.value, 'yyyy-MM-dd'),
        "orgAssets":this.assetAllocation.controls.selectedAsset.value,
        "withdrawalDate":this.datePipe.transform(this.assetAllocation.controls.allocatedTill.value,'yyyy-MM-dd')
      };
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.post('/v1/employee/assetAllocation/'+this.assetAllocation.controls.selectedAsset.value.assetId, body).
        subscribe(
          res => {
            console.log('Description Label Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.assetAllocation.controls).forEach(field => {
        const control = this.assetAllocation.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  getAssets(event,type){

    var val
    if(type==='c'){
      let target = event.source.selected._element.nativeElement;
      let selectedData = {
        value: event.value,
        text: target.innerText.trim()
      };
      console.log(selectedData);
      val=selectedData.value.assetCategoryId
      const control = (<FormArray>this.assetAllocation.controls['identificationLabel']) as FormArray;
      for(let i = control.length-1; i >= 0; i--) {
        control.removeAt(i)
      }
      this.assetAllocation.controls.selectedAsset.patchValue('');
    }else{
      val=event
    }
    this.selectedCategoryAssetsList = [];
    this.serviceApi.get('/v1/organization/assets/list/bycategory/'+val).subscribe(
      res => {
        if (res != null) {
          res.forEach(element => {
            console.log('Response ----' + element);
            this.selectedCategoryAssetsList.push({
              'assetId': element.assetId,
              'assetName': element.assetName,
              'assetDescription': element.assetDescription,
              'assetCategory': element.assetCategory,
              'identificationLabel':element.identificationLabel
            });
          });
        } else {
          console.log('There is no any response from Database');
        }
      },
      err => {

      },
      () => {
      });
  }
  onAssetSelection(event){
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim()
    };
    console.log(selectedData);
    const control = (<FormArray>this.assetAllocation.controls['identificationLabel']) as FormArray;
    for(let i = control.length-1; i >= 0; i--) {
      control.removeAt(i)
    }
    selectedData.value.identificationLabel.forEach(element=>{
      control.push(
        this._fb.group({
          "identificationLabelId": element.identificationLabelId,
          "labelDescription":element.labelDescription,
          "labelName": element.labelName,
          "labelValue":["",[Validators.required]]
        })
      );
    })
  
  }
  onUpdateLabel() {
    if (this.assetAllocation.valid) {
      this.isValidFormSubmitted = true;
      console.log('form value ' + JSON.stringify(this.assetAllocation.value));
      const body = {
        "allocationId": this.assetAllocation.controls.allocationId.value,
        "empCode":  this.assetAllocation.controls.empCode.value,
        "identificationLabels":this.assetAllocation.controls.identificationLabel.value,
        "issuedDate": this.datePipe.transform(this.assetAllocation.controls.allocationDate.value, 'yyyy-MM-dd'),
        "orgAssets":this.assetAllocation.controls.selectedAsset.value,
        "withdrawalDate":this.datePipe.transform(this.assetAllocation.controls.allocatedTill.value,'yyyy-MM-dd')
      };
      console.log('Body ---------- Json data-------   ' + JSON.stringify(body));
      return this.serviceApi.put('/v1/employee/assetAllocation/'+this.assetAllocation.controls.allocationId.value+'/'+this.assetAllocation.controls.selectedAsset.value.assetId, body).
        subscribe(
          res => {
            console.log('Description Label Successfully...' + JSON.stringify(res));
            this.message = res.message;
            this.close();
          },
          err => {
          });
    } else {
      Object.keys(this.assetAllocation.controls).forEach(field => {
        const control = this.assetAllocation.get(field);
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
// ---------------- Add/Update label model end ------------------------

// ---------------- Delete label model start ------------------------
@Component({
  templateUrl: 'delete-allocation-dialog.component.html',
})
export class DeleteAssetAllocationComponent implements OnInit {
  message: any;
  status: any;
  error = 'Error Message';
  action: any;
  // identificationLabelId: any;
  constructor(public dialogRef: MatDialogRef<DeleteAssetAllocationComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ApiCommonService) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() { }
  onDelete() {
    const val = this.data.labelInfo.allocationId;
    return this.serviceApi.delete('/v1/employee/assetAllocation/' + val)
      .subscribe(
        res => {
          console.log('Description Delete Successfully...' + JSON.stringify(res));
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
// ---------------- Delete label model end ------------------------

