import {TestBed} from '@angular/core/testing';

import {HrimEventService} from './hrim-event.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import {LogService} from './log.service'
import {DurationTestData, OccurrenceTestData} from "../../test_data/events";
import {EventTypeTestData} from "../../test_data/event-types";
import {OccurrenceEventSnakeModel} from "../shared/occurrence-event.model";
import {EventTypeService} from "./user-event-type.service";
import {DurationEventSnakeModel} from "../shared/duration-event.model";
import {NotificationService} from "./notification.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {BackendUrlService} from "./backend-url.service";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";

describe('HrimEventService', () => {
  let service: HrimEventService;
  let httpTestingController: HttpTestingController
  const crudApiUrl = 'https://crud.api'
  const occurrenceUrl = `${crudApiUrl}/v1/event/occurrence`
  const durationUrl = `${crudApiUrl}/v1/event/duration`
  const entityUrl = `${crudApiUrl}/v1/entity/`
  let testEventTypes: EventTypeTestData
  let testOccurrences: OccurrenceTestData
  let testDurations: DurationTestData

  beforeEach(() => {
    testEventTypes = new EventTypeTestData()
    testOccurrences = new OccurrenceTestData(testEventTypes)
    testDurations = new DurationTestData(testEventTypes)
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ],
      providers: [LogService, BackendUrlService, EventTypeService, NotificationService]
    })
    service = TestBed.inject(HrimEventService);
    const eventTypeService = TestBed.inject(EventTypeService)
    testEventTypes.register(eventTypeService)
    testOccurrences.register(service)
    testDurations.register(service)
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

  it('should update event types for events when event-type is changed', (done) => {
    const changedReading = {...testEventTypes.reading, color: 'new_color'}

    service.updateEventTypesForEvents(changedReading)

    expect(testOccurrences.reading_1.eventType.color).toBe('new_color')
    done()
  })

  it('should update event type for occurrence events when updated with save', (done) => {
    service.save(testOccurrences.reading_1)
      .subscribe(updatedEvent => {
        expect(updatedEvent.id).toEqual(testOccurrences.reading_1.id)
        expect(updatedEvent.eventType).not.toBeNull()
        expect(updatedEvent.eventType.id).toBe(testOccurrences.reading_1.eventType.id)
        done()
      })

    const req = httpTestingController.expectOne(occurrenceUrl)
    expect(req.request.method).toEqual('PUT')
    const serverResponseModel = new OccurrenceEventSnakeModel({...testOccurrences.reading_1})
    serverResponseModel.event_type = null
    req.flush(serverResponseModel)
  })

  it('should update event type for occurrence events when eventType is changed and updated with save', (done) => {
    const changedEvent = {
      ...testOccurrences.reading_1,
      eventType : testOccurrences.yoga_practice_1.eventType
    }
    service.save(changedEvent)
      .subscribe(updatedEvent => {
        expect(updatedEvent.id).toEqual(testOccurrences.reading_1.id)
        expect(updatedEvent.eventType).not.toBeNull()
        expect(updatedEvent.eventType.id).toBe(testOccurrences.yoga_practice_1.eventType.id)
        done()
      })

    const req = httpTestingController.expectOne(occurrenceUrl)
    expect(req.request.method).toEqual('PUT')
    const serverResponseModel = new OccurrenceEventSnakeModel({...testOccurrences.reading_1})
    serverResponseModel.event_type = null
    req.flush(serverResponseModel)
  })

  it('should update event type for duration events when updated with save', (done) => {
    service.save(testDurations.reading_1)
      .subscribe(updatedEvent => {
        expect(updatedEvent.id).toEqual(testDurations.reading_1.id)
        expect(updatedEvent.eventType).not.toBeNull()
        expect(updatedEvent.eventType.id).toBe(testDurations.reading_1.eventType.id)
        done()
      })

    const req = httpTestingController.expectOne(durationUrl)
    expect(req.request.method).toEqual('PUT')
    const serverResponseModel = new DurationEventSnakeModel({...testDurations.reading_1})
    serverResponseModel.event_type = null
    req.flush(serverResponseModel)
  })

  it('should update event type for duration events when eventType is changed and updated with save', (done) => {
    const changedEvent = {
      ...testDurations.reading_1,
      eventType : testDurations.yoga_practice_1.eventType
    }
    service.save(changedEvent)
      .subscribe(updatedEvent => {
        expect(updatedEvent.id).toEqual(testDurations.reading_1.id)
        expect(updatedEvent.eventType).not.toBeNull()
        expect(updatedEvent.eventType.id).toBe(testDurations.yoga_practice_1.eventType.id)
        done()
      })

    const req = httpTestingController.expectOne(durationUrl)
    expect(req.request.method).toEqual('PUT')
    const serverResponseModel = new DurationEventSnakeModel({...testDurations.reading_1})
    serverResponseModel.event_type = null
    req.flush(serverResponseModel)
  })
});
