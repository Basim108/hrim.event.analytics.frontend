import { TestBed } from '@angular/core/testing';

import { HrimEventService } from './hrim-event.service';
import {OccurrenceEventModel}    from "../shared/occurrence-event.model";
import {OCCURRENCE_EVENTS}       from "../../test_data/events";
import {HttpClientTestingModule} from '@angular/common/http/testing'
import {LogService} from './log.service'

describe('HrimEventService', () => {
  let service: HrimEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
                                     imports:   [HttpClientTestingModule],
                                     providers: [LogService]
                                   })
    service = TestBed.inject(HrimEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createEvent should set event id', () => {
    const event = new OccurrenceEventModel(null);
    service.createEvent(event);
    expect(event.id).not.toBeFalsy();
  });

  it('createEvent should emit created event', done => {
    const testEvent = {...OCCURRENCE_EVENTS["reading_1"], id: ''}
    service.occurrenceEvents$.subscribe(createdEvent => {
      expect(createdEvent.id).toBeTruthy()
      expect(createdEvent.eventType).toBeTruthy()
      done()
    })
    service.createEvent(testEvent);
  })

  it('new subscriber should get all previously emitted events', done => {
    const testEvent = {...OCCURRENCE_EVENTS["reading_1"], id: ''}
    service.occurrenceEvents$.subscribe(() => {
    })
    service.createEvent(testEvent);
    service.occurrenceEvents$.subscribe(createdEvent => {
      expect(createdEvent.id).toBeTruthy()
      expect(createdEvent.id).toBeTruthy()
      done()
    })
  })
});
