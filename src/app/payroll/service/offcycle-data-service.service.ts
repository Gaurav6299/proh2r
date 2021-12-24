import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormArray } from '@angular/forms/src/model';

@Injectable()
export class OffcycleDataServiceService {

  private data = new BehaviorSubject<Element[]>(null);
  currentData = this.data.asObservable();

  constructor() { }

  changeData(data: Element[]) {
    this.data.next(data);
  }

}
export interface Element {
  recordId: string;
  employeeCode: string;
  employeeName: string;
  joiningDate: string;
  totalVariableAllowances: TotalVariableAllowanceObject[];
  totalVariableDeductions: TotalVariableDeductionObject[];
  totalVariableAllowance: number;
  totalVariableDeduction: number;
}

export interface TotalVariableAllowanceObject {
  fieldName: string;
  fieldValue: any;
}

export interface TotalVariableDeductionObject {
  fieldName: string;
  fieldValue: any;
}
