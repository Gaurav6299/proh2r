import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormArray } from '@angular/forms/src/model';

@Injectable()
export class RunPayroll {

  private step = new BehaviorSubject<number>(1);
  currentStep = this.step.asObservable();

  constructor() { }

  changeData(data: number) {
    console.log('current step :::' + data);
    this.step.next(data);
  }

}
