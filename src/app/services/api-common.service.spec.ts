import { TestBed, inject } from '@angular/core/testing';

import { ApiCommonService } from './api-common.service';

describe('ApiCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiCommonService]
    });
  });

  it('should be created', inject([ApiCommonService], (service: ApiCommonService) => {
    expect(service).toBeTruthy();
  }));
});
