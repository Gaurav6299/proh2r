import { TestBed, inject } from '@angular/core/testing';

import { StepperService } from './stepper.service';

describe('StepperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StepperService]
    });
  });

  it('should be created', inject([StepperService], (service: StepperService) => {
    expect(service).toBeTruthy();
  }));
});
