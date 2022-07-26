import { TestBed } from '@angular/core/testing';

import { HrimEventService } from './hrim-event.service';

describe('HrimEventService', () => {
  let service: HrimEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrimEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
