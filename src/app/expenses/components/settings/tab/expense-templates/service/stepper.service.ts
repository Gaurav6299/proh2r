import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class StepperService {
 private step = new BehaviorSubject<number>(0);
  currentStep = this.step.asObservable();
  constructor() { }
  changeStep(data: number) {
    this.step.next(data);
  }
}
