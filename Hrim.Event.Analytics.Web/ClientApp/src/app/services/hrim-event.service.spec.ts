import {TestBed} from '@angular/core/testing';

import {HrimEventService}                               from './hrim-event.service';
import {DURATION_EVENTS, OCCURRENCE_EVENTS}             from "../../test_data/events";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import {LogService}                                     from './log.service'
import {environment}                                    from "../../environments/environment";
import {EVENT_TYPES}                                    from "../../test_data/event-types";

describe('HrimEventService', () => {
  let service: HrimEventService;
  let httpTestingController: HttpTestingController
  const occurrenceUrl = `${environment.apiUrl}/v1/event/occurrence`
  const durationUrl   = `${environment.apiUrl}/v1/event/duration`
  const entityUrl     = `${environment.apiUrl}/v1/entity/`;


  beforeEach(() => {
    TestBed.configureTestingModule({
                                     imports  : [HttpClientTestingModule],
                                     providers: [LogService]
                                   })
    service               = TestBed.inject(HrimEventService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createEvent should emit created event', done => {
    const testEvent = {...OCCURRENCE_EVENTS["reading_1"], id: ''}
    service.createdOccurrences$.subscribe(createdEvent => {
      expect(createdEvent.id).toBeTruthy()
      expect(createdEvent.eventType).toBeTruthy()
      done()
    })

    service.createEvent(testEvent);

    const req = httpTestingController.expectOne(occurrenceUrl)
    expect(req.request.method).toEqual('POST')
    req.flush(OCCURRENCE_EVENTS["reading_1"])
  })

  it('given occurrence createEvent should call occurrence endpoint', done => {
    const testEvent = {...OCCURRENCE_EVENTS["reading_1"], id: ''}

    service.createEvent(testEvent);

    const req = httpTestingController.expectOne(occurrenceUrl)
    expect(req.request.method).toEqual('POST')
    done()
  })

  it('given occurrence createEvent should emit into occurrence subject', done => {
    const testEvent = {...OCCURRENCE_EVENTS["reading_1"], id: ''}
    service.createdOccurrences$.subscribe(createdEvent => {
      expect(createdEvent.id).toEqual(OCCURRENCE_EVENTS['reading_1'].id)
      done()
    })
    service.createEvent(testEvent);

    const req = httpTestingController.expectOne(occurrenceUrl)
    expect(req.request.method).toEqual('POST')
    req.flush(OCCURRENCE_EVENTS["reading_1"])
  })

  it('given duration createEvent should call duration endpoint', done => {
    const testEvent = {...DURATION_EVENTS["reading_1"], id: ''}

    service.createEvent(testEvent);

    const req = httpTestingController.expectOne(durationUrl)
    expect(req.request.method).toEqual('POST')
    done()
  })

  it('given duration createEvent should emit into duration subject', done => {
    const testEvent = {...DURATION_EVENTS["reading_1"], id: ''}
    service.createdDurations$.subscribe(createdEvent => {
      expect(createdEvent.id).toEqual(DURATION_EVENTS['reading_1'].id)
      done()
    })
    service.createEvent(testEvent);

    const req = httpTestingController.expectOne(durationUrl)
    expect(req.request.method).toEqual('POST')
    req.flush(DURATION_EVENTS["reading_1"])
  })

  it('should soft delete an occurrence event type by id', (done) => {
    service.deleteEvent({...OCCURRENCE_EVENTS["reading_1"]})
           .subscribe(entity => {
             expect(entity).toBeTruthy()
             expect(entity.id).toEqual(OCCURRENCE_EVENTS["reading_1"].id)
             done()
           })
    const deleteUrl = `${entityUrl}${OCCURRENCE_EVENTS["reading_1"].id}?entity_type=occurrence_event`
    const req       = httpTestingController.expectOne(deleteUrl)
    expect(req.request.method).toEqual('DELETE')
    req.flush({...OCCURRENCE_EVENTS["reading_1"]})
  })

  it('should soft delete an occurrence event type by id', (done) => {
    service.deleteEvent({...DURATION_EVENTS["reading_1"]})
           .subscribe(entity => {
             expect(entity).toBeTruthy()
             expect(entity.id).toEqual(DURATION_EVENTS["reading_1"].id)
             done()
           })
    const deleteUrl = `${entityUrl}${DURATION_EVENTS["reading_1"].id}?entity_type=duration_event`
    const req       = httpTestingController.expectOne(deleteUrl)
    expect(req.request.method).toEqual('DELETE')
    req.flush({...DURATION_EVENTS["reading_1"]})
  })
});
