import {OccurrenceEventModel} from "../app/shared/occurrence-event.model";
import {DateTime}             from "luxon";
import {EVENT_TYPES}          from "./event-types";
import {DurationEventModel}   from "../app/shared/duration-event.model";

const occurrenceReading1           = new OccurrenceEventModel(null)
occurrenceReading1.id              = "07f4cb3d-7a2b-4abc-bead-ece3389012d7"
occurrenceReading1.occurredAt      = DateTime.now()
occurrenceReading1.occurredOn      = DateTime.now().toISODate()
occurrenceReading1.eventType       = EVENT_TYPES['reading']
occurrenceReading1.concurrentToken = 1

const occurrenceYogaPractice1           = new OccurrenceEventModel(null)
occurrenceYogaPractice1.id              = "b0ff15c2-cf9f-41eb-9a36-158728b2cffa"
occurrenceYogaPractice1.occurredAt      = DateTime.now()
occurrenceYogaPractice1.occurredOn      = DateTime.now().toISODate()
occurrenceYogaPractice1.eventType       = EVENT_TYPES['yogaPractice']
occurrenceYogaPractice1.concurrentToken = 1

const durationReading1           = new DurationEventModel(null)
durationReading1.id              = "3c92d4fe-065a-4f46-975d-9f6d745f110d"
durationReading1.startedAt       = DateTime.now()
durationReading1.startedOn       = DateTime.now().toISODate()
durationReading1.eventType       = EVENT_TYPES['reading']
durationReading1.concurrentToken = 1

const durationYogaPractice1           = new DurationEventModel(null)
durationYogaPractice1.id              = "56ce92a6-d772-4363-99c1-271b8fb1d22c"
durationYogaPractice1.startedAt       = DateTime.now()
durationYogaPractice1.startedOn       = DateTime.now().toISODate()
durationYogaPractice1.eventType       = EVENT_TYPES['yogaPractice']
durationYogaPractice1.concurrentToken = 1


export const OCCURRENCE_EVENTS: { [name: string]: OccurrenceEventModel } = {
  reading_1      : occurrenceReading1,
  yoga_practice_1: occurrenceYogaPractice1
}

export const DURATION_EVENTS: { [name: string]: DurationEventModel } = {
  reading_1      : durationReading1,
  yoga_practice_1: durationYogaPractice1
}
