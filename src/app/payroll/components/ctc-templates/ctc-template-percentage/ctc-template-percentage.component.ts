import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';

import { FormArray, FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-ctc-template-percentage',
  templateUrl: './ctc-template-percentage.component.html',
  styleUrls: ['./ctc-template-percentage.component.scss']
})
export class EditCtcTemplatePercentageComponent implements OnInit {

  @Input() inputFixedAllowanceForm = [];
  @Input() inputFixedAllowanceFormIndex = [];
  @Input() editInputDependentIds = [];

  @Output() messageEvent = new EventEmitter<string>();


  indexValue: any;

  fixedAllowanceList = [
    { value: -1, viewValue: 'Gross Salary/CTC' , type: ''},
  ];

  selectedData = new FormControl();
  // toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private http: Http) {
    console.log('Enter in the Edit Blaock FOr Dropdown');
    this.activeInputField();
  }

  activeInputField() {
  }

  exists(nameKey, myArray) {
    let exists: Boolean = false;
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].value === nameKey.value && myArray[i].type === nameKey.type) {
        exists = true;
      }
    }
    return exists;
  }


  ngOnInit() {
    console.log(this.inputFixedAllowanceForm);
    for (let i = 0; i < this.inputFixedAllowanceForm.length; i++) {
      const resultObject = this.exists(this.inputFixedAllowanceForm[i], this.fixedAllowanceList);
      if (resultObject) {
        console.log('Id Already Exist');
      } else {
        this.indexValue = i;
        this.fixedAllowanceList.push({
          value: this.inputFixedAllowanceForm[i].value,
          viewValue: this.inputFixedAllowanceForm[i].viewValue,
          type: this.inputFixedAllowanceForm[i].type
        });
      }
    }
    this.indexValue = this.inputFixedAllowanceFormIndex;
    
    console.log('ids f Edited : ' + this.editInputDependentIds);
    if (this.editInputDependentIds.length > 0) {
      console.log('Editable Value occur');
      this.selectedData.patchValue(this.editInputDependentIds);
      // for (let i = 0; i < this.editInputDependentIds.length; i++) {
      //   console.log('index Retrive Allowance Id : ' + this.editInputDependentIds[i].allowanceId);
      //   console.log('index Retrive Allowance Name : ' + this.editInputDependentIds[i].allowanceName);
      //   this.fixedAllowanceList.push({
      //     value: this.editInputDependentIds[i].allowanceId,
      //     viewValue: this.editInputDependentIds[i].allowanceName,
      //     type : this.editInputDependentIds[i].type
      //   });
      // }
    } else {
      console.log('No Editable Value Occer');
    }

    
  }

  methodCall(data: any) {
    console.log('Checked Values : ' + data.value + ' And Selected Data Name ' );
    // if(data.length > 1){
      let idList = [];
      data.forEach(element => {
        idList.push(element.value+'/'+element.type)
      });
      this.messageEvent.emit(idList.toString() + '=' + this.indexValue);
    // }else{
    //   this.messageEvent.emit(data[0].value + '=' + this.indexValue);
    // }
       
  }
}

