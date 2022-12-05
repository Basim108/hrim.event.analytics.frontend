import { TestBed } from '@angular/core/testing';

import { HrimEventService } from './hrim-event.service';
import {HrimEventModel} from "../shared/hrim-event.model";
import {EVENTS} from "../../test_data/events";

describe('HrimEventService', () => {
  let service: HrimEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrimEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createEvent should set event id', () => {
    const event = new HrimEventModel();
    service.createEvent(event);
    expect(event.id).not.toBeFalsy();
  });

  it('createEvent should emit created event', done => {
    const testEvent = {...EVENTS["eventOfDay_1"], id: ''}
    service.hrimEvents$.subscribe(createdEvent => {
      expect(createdEvent.id).toBeTruthy()
      expect(createdEvent.color).toBe(testEvent.color)
      done()
    })
    service.createEvent(testEvent);
  })

  it('new subscriber should get all previously emitted events', done => {
    const testEvent = {...EVENTS["eventOfDay_1"], id: ''}
    service.hrimEvents$.subscribe(() => {
    })
    service.createEvent(testEvent);
    service.hrimEvents$.subscribe(createdEvent => {
      expect(createdEvent.id).toBeTruthy()
      expect(createdEvent.color).toBe(testEvent.color)
      done()
    })
  })
});
