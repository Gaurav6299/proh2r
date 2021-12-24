import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LeaveTamplatesComponent } from '../components/leave-settings/tabs/leave-tamplates/leave-tamplates.component';
@Injectable()
export class StepperService {
  private step = new BehaviorSubject<number>(0);
  currentStep = this.step.asObservable();
  constructor() { }
  changeStep(data: number) {
    this.step.next(data);
  }
}
