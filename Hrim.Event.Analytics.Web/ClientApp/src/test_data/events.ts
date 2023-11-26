import {OccurrenceEventModel} from "../app/shared/occurrence-event.model";
import {DateTime} from "luxon";
import {EventTypeTestData} from "./event-types";
import {DurationEventModel} from "../app/shared/duration-event.model";
import {HrimEventService} from "../app/services/hrim-event.service";

export class DurationTestData {
  public readonly reading_1: DurationEventModel
  public readonly yoga_practice_1: DurationEventModel

  constructor(testEventTypes: EventTypeTestData) {
    this.reading_1 = new DurationEventModel(null, null)
    this.reading_1.id = 1
    this.reading_1.startedAt = DateTime.now()
    this.reading_1.startedOn = DateTime.now().toISODate()!
    this.reading_1.eventType = testEventTypes.reading
    this.reading_1.concurrentToken = 1
    this.reading_1.props = {note: 'test follow up'}

    this.yoga_practice_1 = new DurationEventModel(null, null)
    this.yoga_practice_1.id = 2
    this.yoga_practice_1.startedAt = DateTime.now()
    this.yoga_practice_1.startedOn = DateTime.now().toISODate()!
    this.yoga_practice_1.eventType = testEventTypes.yogaPractice
    this.yoga_practice_1.concurrentToken = 1
    this.yoga_practice_1.props = {note: 'test follow up'}
  }

  register(service: HrimEventService) {
    service.registerEventContext(this.reading_1)
    service.registerEventContext(this.yoga_practice_1)
  }
}

export class OccurrenceTestData {
  public readonly reading_1: OccurrenceEventModel
  public readonly yoga_practice_1: OccurrenceEventModel

  constructor(testEventTypes: EventTypeTestData) {
    this.reading_1 = new OccurrenceEventModel(null, null)
    this.reading_1.id = 3
    this.reading_1.occurredAt = DateTime.now()
    this.reading_1.occurredOn = DateTime.now().toISODate()!
    this.reading_1.eventType = testEventTypes.reading
    this.reading_1.concurrentToken = 1
    this.reading_1.props = {note: 'test follow up'}


    this.yoga_practice_1 = new OccurrenceEventModel(null, null)
    this.yoga_practice_1.id = 4
    this.yoga_practice_1.occurredAt = DateTime.now()
    this.yoga_practice_1.occurredOn = DateTime.now().toISODate()!
    this.yoga_practice_1.eventType = testEventTypes.yogaPractice
    this.yoga_practice_1.concurrentToken = 1
    this.yoga_practice_1.props = {note: 'test follow up'}
  }

  register(service: HrimEventService) {
    service.registerEventContext(this.reading_1)
    service.registerEventContext(this.yoga_practice_1)
  }
}
