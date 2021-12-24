import { TestBed, inject } from '@angular/core/testing';

import { OffcycleDataServiceService } from './offcycle-data-service.service';

describe('OffcycleDataServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OffcycleDataServiceService]
    });
  });

  it('should be created', inject([OffcycleDataServiceService], (service: OffcycleDataServiceService) => {
    expect(service).toBeTruthy();
  }));
});
