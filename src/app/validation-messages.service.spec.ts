import { TestBed, inject } from '@angular/core/testing';

import { ValidationMessagesService } from './validation-messages.service';

describe('ValidationMessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationMessagesService]
    });
  });

  it('should be created', inject([ValidationMessagesService], (service: ValidationMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
