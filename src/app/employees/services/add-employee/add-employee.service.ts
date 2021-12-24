import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup } from '@angular/forms';

@Injectable()
export class AddEmployeeService {

  private empCode = new BehaviorSubject<string>(null);
  currentEmpCode = this.empCode.asObservable();
  private step = new BehaviorSubject<string>(null);

  private data = new BehaviorSubject<FormGroup>(null);
  currentData = this.data.asObservable();

  constructor() { }

  changeData(data: FormGroup) {
    this.data.next(data);
  }

  changeStep(data: string) {
    this.step.next(data);
  }

  changeEmpCode(data: string) {
    this.empCode.next(data);
  }
}
