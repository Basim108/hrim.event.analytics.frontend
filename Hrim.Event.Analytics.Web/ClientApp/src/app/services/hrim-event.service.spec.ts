import { TestBed } from '@angular/core/testing';

import { HrimEventService } from './hrim-event.service';
import {EventOfDayModel} from "../event-of-day/event-of-day.model";

describe('HrimEventService', () => {
  let service: HrimEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrimEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createEvent should set event id to guid', () => {
    // const event = new EventOfDayModel();
    // service.createEvent(event);
    // expect(event.id).not.toBeFalsy();
  });
});
