import {TestBed} from '@angular/core/testing';

import {HrimEventService} from './hrim-event.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import {LogService} from './log.service'
import {DurationTestData, OccurrenceTestData} from "../../test_data/events";
import {EventTypeTestData} from "../../test_data/event-types";

describe('HrimEventService', () => {
    let service: HrimEventService;
    let httpTestingController: HttpTestingController
    const crudApiUrl = 'https://crud.api'
    const occurrenceUrl = `${crudApiUrl}/v1/event/occurrence`
    const durationUrl = `${crudApiUrl}/v1/event/duration`
    const entityUrl = `${crudApiUrl}/v1/entity/`
    let testOccurrences: OccurrenceTestData
    let testDurations: DurationTestData

    beforeEach(() => {
        const testEventTypes = new EventTypeTestData()
        testOccurrences = new OccurrenceTestData(testEventTypes)
        testDurations = new DurationTestData(testEventTypes)
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LogService]
        })
        service = TestBed.inject(HrimEventService);
        httpTestingController = TestBed.inject(HttpTestingController)
        const reqCrudApi = httpTestingController.expectOne('/backend/crud')
        reqCrudApi.flush(`"${crudApiUrl}"`, {status: 200, statusText: 'Ok'})
    });

    afterEach(() => {
        httpTestingController.verify()
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('createEvent should emit created event', done => {
        const testEvent = {...testOccurrences.reading_1, id: ''}
        service.createdOccurrences$.subscribe(createdEvent => {
            expect(createdEvent.id).toBeTruthy()
            expect(createdEvent.eventType).toBeTruthy()
            done()
        })

        service.createEvent(testEvent);

        const req = httpTestingController.expectOne(occurrenceUrl)
        expect(req.request.method).toEqual('POST')
        req.flush(testOccurrences.reading_1)
    })

    it('given occurrence createEvent should call occurrence endpoint', done => {
        const testEvent = {...testOccurrences.reading_1, id: ''}

        service.createEvent(testEvent);

        const req = httpTestingController.expectOne(occurrenceUrl)
        expect(req.request.method).toEqual('POST')
        done()
    })

    it('given occurrence createEvent should emit into occurrence subject', done => {
        const testEvent = {...testOccurrences.reading_1, id: ''}
        service.createdOccurrences$.subscribe(createdEvent => {
            expect(createdEvent.id).toEqual(testOccurrences.reading_1.id)
            done()
        })
        service.createEvent(testEvent);

        const req = httpTestingController.expectOne(occurrenceUrl)
        expect(req.request.method).toEqual('POST')
        req.flush(testOccurrences.reading_1)
    })

    it('given duration createEvent should call duration endpoint', done => {
        const testEvent = {...testDurations.reading_1, id: ''}

        service.createEvent(testEvent);

        const req = httpTestingController.expectOne(durationUrl)
        expect(req.request.method).toEqual('POST')
        done()
    })

    it('given duration createEvent should emit into duration subject', done => {
        const testEvent = {...testDurations.reading_1, id: ''}
        service.createdDurations$.subscribe(createdEvent => {
            expect(createdEvent.id).toEqual(testDurations.reading_1.id)
            done()
        })
        service.createEvent(testEvent);

        const req = httpTestingController.expectOne(durationUrl)
        expect(req.request.method).toEqual('POST')
        req.flush(testDurations.reading_1)
    })

    it('should soft delete an occurrence event type by id', (done) => {
        service.deleteEvent({...testOccurrences.reading_1})
            .subscribe(entity => {
                expect(entity).toBeTruthy()
                expect(entity.id).toEqual(testOccurrences.reading_1.id)
                done()
            })
        const deleteUrl = `${entityUrl}${testOccurrences.reading_1.id}?entity_type=occurrence_event`
        const req = httpTestingController.expectOne(deleteUrl)
        expect(req.request.method).toEqual('DELETE')
        req.flush({...testOccurrences.reading_1})
    })

    it('should soft delete an occurrence event type by id', (done) => {
        service.deleteEvent({...testDurations.reading_1})
            .subscribe(entity => {
                expect(entity).toBeTruthy()
                expect(entity.id).toEqual(testDurations.reading_1.id)
                done()
            })
        const deleteUrl = `${entityUrl}${testDurations.reading_1.id}?entity_type=duration_event`
        const req = httpTestingController.expectOne(deleteUrl)
        expect(req.request.method).toEqual('DELETE')
        req.flush({...testDurations.reading_1})
    })
});
